#![cfg(test)]

use super::*;
use soroban_sdk::{
    testutils::Address as _,
    token::StellarAssetClient,
    Address, Env, String,
};
use waterfall_distributor::{WaterfallDistributor, WaterfallDistributorClient};

fn create_token_contract<'a>(e: &Env, admin: &Address) -> (token::Client<'a>, StellarAssetClient<'a>) {
    let contract_id = e.register_stellar_asset_contract_v2(admin.clone());
    (
        token::Client::new(e, &contract_id.address()),
        StellarAssetClient::new(e, &contract_id.address()),
    )
}

#[test]
fn test_full_syndicate_lifecycle_with_intercontract_calls() {
    let env = Env::default();
    env.mock_all_auths();

    // 1. Setup actors
    let admin = Address::generate(&env);
    let lead = Address::generate(&env);
    let startup = Address::generate(&env);
    let lp1 = Address::generate(&env);
    let lp2 = Address::generate(&env);
    let exit_acquirer = Address::generate(&env);

    // 2. Setup SAC token (e.g. USDC)
    let (token_client, token_admin) = create_token_contract(&env, &admin);
    let token_addr = token_client.address.clone();

    // Mint funds for LPs and Acquirer
    token_admin.mint(&lp1, &600_000);
    token_admin.mint(&lp2, &400_000);
    token_admin.mint(&exit_acquirer, &3_000_000);

    // 3. Register & Initialize Waterfall Distributor contract (Contract 1)
    let distributor_id = env.register(WaterfallDistributor, ());
    let distributor_client = WaterfallDistributorClient::new(&env, &distributor_id);
    distributor_client.initialize(&admin, &2000, &0); // 20% carry

    // 4. Register & Initialize Syndicate Vault contract (Contract 2)
    let vault_id = env.register(SyndicateVault, ());
    let vault_client = SyndicateVaultClient::new(&env, &vault_id);

    let target_cap = 1_000_000i128;
    let min_ticket = 10_000i128;
    let max_ticket = 1_000_000i128;
    let deadline = 100_000u64;
    let carry_bps = 2000u32; // 20%

    vault_client.initialize(
        &admin,
        &lead,
        &startup,
        &token_addr,
        &distributor_id,
        &target_cap,
        &min_ticket,
        &max_ticket,
        &deadline,
        &carry_bps,
    );

    // 5. Investors deposit capital
    vault_client.deposit(&lp1, &600_000);
    vault_client.deposit(&lp2, &400_000);

    let vault_info = vault_client.get_syndicate_info();
    assert_eq!(vault_info.total_raised, 1_000_000);
    assert_eq!(vault_info.status, VaultStatus::MilestonePhase);

    // Verify token balance in vault
    assert_eq!(token_client.balance(&vault_id), 1_000_000);

    // 6. Submit and Release Milestone 1 (50% tranche = 500,000 USDC)
    vault_client.submit_milestone(
        &lead,
        &1,
        &String::from_str(&env, "MVP Release & Initial Beta Launch"),
        &5000, // 50%
    );

    vault_client.approve_milestone(&lead, &1);
    vault_client.release_milestone(&lead, &1);

    // Verify startup recipient received tranche
    assert_eq!(token_client.balance(&startup), 500_000);
    assert_eq!(token_client.balance(&vault_id), 500_000);

    // 7. Successful Exit / Acquisition (3x exit = 3,000,000 USDC proceeds)
    // Acquirer sends proceeds into vault which triggers cross-contract calculation
    vault_client.trigger_exit_return(&exit_acquirer, &3_000_000);

    let vault_info_after_exit = vault_client.get_syndicate_info();
    assert_eq!(vault_info_after_exit.status, VaultStatus::Liquidated);
    assert_eq!(vault_info_after_exit.total_return_pool, 3_000_000);

    // 8. LPs claim pro-rata payouts (Inter-contract calls)
    // LP1 (60% stake) -> 60% of $2.6M LP pool = $1,560,000
    // LP2 (40% stake) -> 40% of $2.6M LP pool = $1,040,000
    let lp1_claimed = vault_client.claim_investor_payout(&lp1);
    let lp2_claimed = vault_client.claim_investor_payout(&lp2);

    assert_eq!(lp1_claimed, 1_560_000);
    assert_eq!(lp2_claimed, 1_040_000);
    assert_eq!(token_client.balance(&lp1), 1_560_000);
    assert_eq!(token_client.balance(&lp2), 1_040_000);

    // 9. Lead claims 20% Carry ($400,000)
    let lead_carry = vault_client.claim_lead_carry(&lead);
    assert_eq!(lead_carry, 400_000);
    assert_eq!(token_client.balance(&lead), 400_000);
}

#[test]
fn test_ticket_size_validation() {
    let env = Env::default();
    env.mock_all_auths();

    let admin = Address::generate(&env);
    let lead = Address::generate(&env);
    let startup = Address::generate(&env);
    let lp = Address::generate(&env);

    let (token_client, token_admin) = create_token_contract(&env, &admin);
    let token_addr = token_client.address;
    token_admin.mint(&lp, &1_000_000);

    let distributor_id = env.register(WaterfallDistributor, ());
    let vault_id = env.register(SyndicateVault, ());
    let vault_client = SyndicateVaultClient::new(&env, &vault_id);

    vault_client.initialize(
        &admin,
        &lead,
        &startup,
        &token_addr,
        &distributor_id,
        &500_000,
        &50_000,   // min ticket $50k
        &200_000,  // max ticket $200k
        &100_000,
        &2000,
    );

    // Too small ticket
    let res_small = vault_client.try_deposit(&lp, &10_000);
    assert_eq!(res_small, Err(Ok(VaultError::TicketTooSmall)));

    // Too large ticket
    let res_large = vault_client.try_deposit(&lp, &300_000);
    assert_eq!(res_large, Err(Ok(VaultError::TicketTooLarge)));

    // Valid ticket
    let res_valid = vault_client.try_deposit(&lp, &100_000);
    assert!(res_valid.is_ok());
}

#[test]
fn test_milestone_lifecycle_and_security() {
    let env = Env::default();
    env.mock_all_auths();

    let admin = Address::generate(&env);
    let lead = Address::generate(&env);
    let startup = Address::generate(&env);
    let random_user = Address::generate(&env);

    let (token_client, _) = create_token_contract(&env, &admin);
    let distributor_id = env.register(WaterfallDistributor, ());
    let vault_id = env.register(SyndicateVault, ());
    let vault_client = SyndicateVaultClient::new(&env, &vault_id);

    vault_client.initialize(
        &admin,
        &lead,
        &startup,
        &token_client.address,
        &distributor_id,
        &500_000,
        &10_000,
        &500_000,
        &100_000,
        &2000,
    );

    // Unauthorized milestone submission
    let res_unauth = vault_client.try_submit_milestone(
        &random_user,
        &1,
        &String::from_str(&env, "Unauthorized tranche"),
        &2500,
    );
    assert_eq!(res_unauth, Err(Ok(VaultError::Unauthorized)));

    // Authorized submission
    let res_ok = vault_client.try_submit_milestone(
        &lead,
        &1,
        &String::from_str(&env, "Authorized tranche"),
        &2500,
    );
    assert!(res_ok.is_ok());

    // Cannot release before approval
    let res_release_early = vault_client.try_release_milestone(&lead, &1);
    assert_eq!(res_release_early, Err(Ok(VaultError::MilestoneNotApproved)));
}
