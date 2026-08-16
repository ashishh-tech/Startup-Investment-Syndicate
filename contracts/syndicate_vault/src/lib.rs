#![no_std]
use soroban_sdk::{
    contract, contractimpl, token, Address, Env, String, Vec,
};

pub mod events;
pub mod storage;
pub mod types;

#[cfg(test)]
mod test;

use crate::events::*;
use crate::storage::*;
use crate::types::*;
use waterfall_distributor::WaterfallDistributorClient;

const BPS_DIVISOR: i128 = 10_000;

#[contract]
pub struct SyndicateVault;

#[contractimpl]
impl SyndicateVault {
    /// Initialize the Syndicate Vault contract
    pub fn initialize(
        env: Env,
        admin: Address,
        syndicate_lead: Address,
        startup_recipient: Address,
        asset_token: Address,
        distributor_contract: Address,
        target_cap: i128,
        min_ticket: i128,
        max_ticket: i128,
        deadline: u64,
        carry_bps: u32,
    ) -> Result<(), VaultError> {
        if get_config(&env).is_some() {
            return Err(VaultError::AlreadyInitialized);
        }

        if target_cap <= 0 || min_ticket <= 0 || max_ticket < min_ticket {
            return Err(VaultError::ZeroAmount);
        }

        admin.require_auth();

        let config = SyndicateConfig {
            admin: admin.clone(),
            syndicate_lead: syndicate_lead.clone(),
            startup_recipient,
            asset_token,
            distributor_contract,
            target_cap,
            min_ticket,
            max_ticket,
            deadline,
            total_raised: 0,
            total_disbursed: 0,
            status: VaultStatus::Fundraising,
            total_return_pool: 0,
            carry_bps,
        };

        set_config(&env, &config);
        emit_syndicate_initialized(&env, &admin, &syndicate_lead, target_cap, deadline);

        Ok(())
    }

    /// LP / Investor deposits capital into the syndicate
    pub fn deposit(env: Env, investor: Address, amount: i128) -> Result<(), VaultError> {
        let mut config = get_config(&env).ok_or(VaultError::NotInitialized)?;

        if config.status != VaultStatus::Fundraising {
            return Err(VaultError::FundraisingClosed);
        }

        let current_ledger_time = env.ledger().timestamp();
        if current_ledger_time > config.deadline {
            return Err(VaultError::DeadlinePassed);
        }

        if amount < config.min_ticket {
            return Err(VaultError::TicketTooSmall);
        }

        if amount > config.max_ticket {
            return Err(VaultError::TicketTooLarge);
        }

        if config.total_raised + amount > config.target_cap {
            return Err(VaultError::TargetCapExceeded);
        }

        investor.require_auth();

        // Transfer tokens from investor to this vault contract
        let token_client = token::Client::new(&env, &config.asset_token);
        token_client.transfer(&investor, &env.current_contract_address(), &amount);

        // Update investor stake
        let mut stake = get_investor_stake(&env, &investor).unwrap_or(InvestorStake {
            investor: investor.clone(),
            principal_deposited: 0,
            shares_minted: 0,
            claimed_payout: 0,
            has_claimed_final: false,
        });

        stake.principal_deposited += amount;
        stake.shares_minted += amount; // 1:1 proportional share tokens
        set_investor_stake(&env, &investor, &stake);
        add_to_investor_list(&env, &investor);

        // Update vault state
        config.total_raised += amount;
        if config.total_raised >= config.target_cap {
            config.status = VaultStatus::MilestonePhase;
            emit_vault_status_changed(&env, VaultStatus::MilestonePhase);
        }
        set_config(&env, &config);

        emit_deposit(&env, &investor, amount, amount, config.total_raised);

        Ok(())
    }

    /// Finalize fundraising and transition to Milestone phase
    pub fn close_fundraising(env: Env, caller: Address) -> Result<(), VaultError> {
        let mut config = get_config(&env).ok_or(VaultError::NotInitialized)?;
        caller.require_auth();

        if caller != config.admin && caller != config.syndicate_lead {
            return Err(VaultError::Unauthorized);
        }

        if config.status != VaultStatus::Fundraising {
            return Err(VaultError::InvalidState);
        }

        config.status = VaultStatus::MilestonePhase;
        set_config(&env, &config);
        emit_vault_status_changed(&env, VaultStatus::MilestonePhase);

        Ok(())
    }

    /// Syndicate lead submits a funding milestone tranche (e.g. Prototype, Beta, Market Launch)
    pub fn submit_milestone(
        env: Env,
        caller: Address,
        milestone_id: u32,
        description: String,
        tranche_bps: u32,
    ) -> Result<(), VaultError> {
        let config = get_config(&env).ok_or(VaultError::NotInitialized)?;
        caller.require_auth();

        if caller != config.syndicate_lead && caller != config.admin {
            return Err(VaultError::Unauthorized);
        }

        if tranche_bps == 0 || tranche_bps > 10_000 {
            return Err(VaultError::InvalidTranchePercent);
        }

        let mut milestones = get_milestones(&env);
        let tranche_amount = (config.total_raised * tranche_bps as i128) / BPS_DIVISOR;

        let milestone = Milestone {
            id: milestone_id,
            description: description.clone(),
            tranche_bps,
            amount: tranche_amount,
            status: MilestoneStatus::Pending,
        };

        milestones.push_back(milestone);
        set_milestones(&env, &milestones);
        emit_milestone_submitted(&env, milestone_id, tranche_bps, &description);

        Ok(())
    }

    /// Admin or Syndicate Lead approves milestone for release
    pub fn approve_milestone(env: Env, approver: Address, milestone_id: u32) -> Result<(), VaultError> {
        let config = get_config(&env).ok_or(VaultError::NotInitialized)?;
        approver.require_auth();

        if approver != config.admin && approver != config.syndicate_lead {
            return Err(VaultError::Unauthorized);
        }

        let mut milestones = get_milestones(&env);
        let mut found = false;

        for i in 0..milestones.len() {
            let mut m = milestones.get(i).unwrap();
            if m.id == milestone_id {
                if m.status != MilestoneStatus::Pending {
                    return Err(VaultError::InvalidState);
                }
                m.status = MilestoneStatus::Approved;
                milestones.set(i, m);
                found = true;
                break;
            }
        }

        if !found {
            return Err(VaultError::MilestoneNotFound);
        }

        set_milestones(&env, &milestones);
        emit_milestone_status_changed(&env, milestone_id, MilestoneStatus::Approved);

        Ok(())
    }

    /// Release milestone tranche funds to the startup recipient address
    pub fn release_milestone(env: Env, caller: Address, milestone_id: u32) -> Result<(), VaultError> {
        let mut config = get_config(&env).ok_or(VaultError::NotInitialized)?;
        caller.require_auth();

        if caller != config.syndicate_lead && caller != config.admin {
            return Err(VaultError::Unauthorized);
        }

        let mut milestones = get_milestones(&env);
        let mut release_amount = 0i128;
        let mut found = false;

        for i in 0..milestones.len() {
            let mut m = milestones.get(i).unwrap();
            if m.id == milestone_id {
                if m.status == MilestoneStatus::Released {
                    return Err(VaultError::MilestoneAlreadyReleased);
                }
                if m.status != MilestoneStatus::Approved {
                    return Err(VaultError::MilestoneNotApproved);
                }
                release_amount = m.amount;
                m.status = MilestoneStatus::Released;
                milestones.set(i, m);
                found = true;
                break;
            }
        }

        if !found {
            return Err(VaultError::MilestoneNotFound);
        }

        if release_amount <= 0 {
            return Err(VaultError::ZeroAmount);
        }

        config.total_disbursed += release_amount;
        set_config(&env, &config);
        set_milestones(&env, &milestones);

        // Disburse tokens to startup recipient
        let token_client = token::Client::new(&env, &config.asset_token);
        token_client.transfer(
            &env.current_contract_address(),
            &config.startup_recipient,
            &release_amount,
        );

        emit_tranche_released(&env, milestone_id, release_amount, &config.startup_recipient);

        Ok(())
    }

    /// Trigger exit / acquisition returns: Inter-contract call to `WaterfallDistributor`
    pub fn trigger_exit_return(
        env: Env,
        sender: Address,
        total_proceeds: i128,
    ) -> Result<(), VaultError> {
        let mut config = get_config(&env).ok_or(VaultError::NotInitialized)?;
        sender.require_auth();

        if total_proceeds <= 0 {
            return Err(VaultError::ZeroAmount);
        }

        // Transfer exit return tokens into vault contract
        let token_client = token::Client::new(&env, &config.asset_token);
        token_client.transfer(&sender, &env.current_contract_address(), &total_proceeds);

        // INTER-CONTRACT CALL to WaterfallDistributor contract
        let distributor_client =
            WaterfallDistributorClient::new(&env, &config.distributor_contract);
        
        let waterfall_calc = distributor_client.calculate_waterfall(
            &env.current_contract_address(),
            &total_proceeds,
            &config.total_raised,
            &Some(config.carry_bps),
        );

        config.status = VaultStatus::Liquidated;
        config.total_return_pool = total_proceeds;
        set_config(&env, &config);

        // Store LP payout pool & Lead carry in persistent storage
        env.storage().persistent().set(&DataKey::TotalLpPayoutPool, &waterfall_calc.total_lp_payout);
        env.storage().persistent().set(&DataKey::TotalLeadCarryPool, &waterfall_calc.total_lead_payout);

        emit_exit_triggered(
            &env,
            total_proceeds,
            waterfall_calc.total_lp_payout,
            waterfall_calc.total_lead_payout,
        );

        Ok(())
    }

    /// Claim LP returns from the waterfall payout pool
    pub fn claim_investor_payout(env: Env, investor: Address) -> Result<i128, VaultError> {
        let config = get_config(&env).ok_or(VaultError::NotInitialized)?;
        investor.require_auth();

        if config.status != VaultStatus::Liquidated {
            return Err(VaultError::InvalidState);
        }

        let mut stake = get_investor_stake(&env, &investor).ok_or(VaultError::Unauthorized)?;
        if stake.has_claimed_final {
            return Err(VaultError::AlreadyClaimed);
        }

        let total_lp_payout: i128 = env
            .storage()
            .persistent()
            .get(&DataKey::TotalLpPayoutPool)
            .unwrap_or(0);

        if total_lp_payout <= 0 {
            return Err(VaultError::NoClaimableReturns);
        }

        // INTER-CONTRACT CALL to WaterfallDistributor to calculate pro-rata share
        let distributor_client =
            WaterfallDistributorClient::new(&env, &config.distributor_contract);
        
        let payout_amount = distributor_client.calculate_lp_share(
            &stake.principal_deposited,
            &config.total_raised,
            &total_lp_payout,
        );

        if payout_amount <= 0 {
            return Err(VaultError::NoClaimableReturns);
        }

        stake.claimed_payout = payout_amount;
        stake.has_claimed_final = true;
        set_investor_stake(&env, &investor, &stake);

        // Transfer funds to LP investor
        let token_client = token::Client::new(&env, &config.asset_token);
        token_client.transfer(&env.current_contract_address(), &investor, &payout_amount);

        emit_payout_claimed(&env, &investor, payout_amount);

        Ok(payout_amount)
    }

    /// Claim Syndicate Lead carry performance fee
    pub fn claim_lead_carry(env: Env, lead: Address) -> Result<i128, VaultError> {
        let config = get_config(&env).ok_or(VaultError::NotInitialized)?;
        lead.require_auth();

        if lead != config.syndicate_lead {
            return Err(VaultError::Unauthorized);
        }

        if config.status != VaultStatus::Liquidated {
            return Err(VaultError::InvalidState);
        }

        let total_lead_carry: i128 = env
            .storage()
            .persistent()
            .get(&DataKey::TotalLeadCarryPool)
            .unwrap_or(0);

        if total_lead_carry <= 0 {
            return Err(VaultError::NoClaimableReturns);
        }

        // Zero out so lead cannot double claim
        env.storage().persistent().set(&DataKey::TotalLeadCarryPool, &0i128);

        let token_client = token::Client::new(&env, &config.asset_token);
        token_client.transfer(&env.current_contract_address(), &lead, &total_lead_carry);

        emit_payout_claimed(&env, &lead, total_lead_carry);

        Ok(total_lead_carry)
    }

    /// Read syndicate configuration & live status
    pub fn get_syndicate_info(env: Env) -> Result<SyndicateConfig, VaultError> {
        get_config(&env).ok_or(VaultError::NotInitialized)
    }

    /// Read specific investor stake
    pub fn get_investor_stake(env: Env, investor: Address) -> Option<InvestorStake> {
        storage::get_investor_stake(&env, &investor)
    }

    /// Read all participating investors list
    pub fn get_all_investors(env: Env) -> Vec<Address> {
        storage::get_investor_list(&env)
    }

    /// Read all milestones
    pub fn get_milestones(env: Env) -> Vec<Milestone> {
        storage::get_milestones(&env)
    }
}
