#![no_std]
use soroban_sdk::{contract, contractimpl, symbol_short, Address, Env, Symbol};

pub mod events;
pub mod types;

#[cfg(test)]
mod test;

use crate::events::{emit_initialized, emit_waterfall_computed};
use crate::types::{WaterfallCalculation, WaterfallConfig, WaterfallError};

const CONFIG_KEY: Symbol = symbol_short!("CONFIG");
const BPS_DIVISOR: i128 = 10_000;

#[contract]
pub struct WaterfallDistributor;

#[contractimpl]
impl WaterfallDistributor {
    /// Initialize the Waterfall Distributor contract
    pub fn initialize(
        env: Env,
        admin: Address,
        lead_carry_bps: u32,
        hurdle_rate_bps: u32,
    ) -> Result<(), WaterfallError> {
        if env.storage().instance().has(&CONFIG_KEY) {
            return Err(WaterfallError::AlreadyInitialized);
        }

        if lead_carry_bps > 10_000 || hurdle_rate_bps > 10_000 {
            return Err(WaterfallError::InvalidBasisPoints);
        }

        admin.require_auth();

        let config = WaterfallConfig {
            admin: admin.clone(),
            lead_carry_bps,
            hurdle_rate_bps,
        };

        env.storage().instance().set(&CONFIG_KEY, &config);
        emit_initialized(&env, &admin, lead_carry_bps);

        Ok(())
    }

    /// Pure computation function: Calculates exact multi-tier waterfall payouts
    /// Tier 1: 100% Capital payback to LPs until principal is fully repaid
    /// Tier 2: Syndicate Lead Carry (% of profit)
    /// Tier 3: Remaining profit split pro-rata
    pub fn calculate_waterfall(
        env: Env,
        caller: Address,
        total_proceeds: i128,
        total_principal: i128,
        custom_carry_bps: Option<u32>,
    ) -> Result<WaterfallCalculation, WaterfallError> {
        if total_proceeds <= 0 || total_principal <= 0 {
            return Err(WaterfallError::ZeroAmount);
        }

        let config: WaterfallConfig = env
            .storage()
            .instance()
            .get(&CONFIG_KEY)
            .unwrap_or(WaterfallConfig {
                admin: caller.clone(),
                lead_carry_bps: 2000, // default 20%
                hurdle_rate_bps: 0,
            });

        let carry_bps = custom_carry_bps.unwrap_or(config.lead_carry_bps) as i128;
        if carry_bps > BPS_DIVISOR {
            return Err(WaterfallError::InvalidBasisPoints);
        }

        let principal_repaid = if total_proceeds < total_principal {
            total_proceeds
        } else {
            total_principal
        };

        let excess_profit = if total_proceeds > total_principal {
            total_proceeds - total_principal
        } else {
            0
        };

        let lead_carry_amount = if excess_profit > 0 {
            (excess_profit * carry_bps) / BPS_DIVISOR
        } else {
            0
        };

        let lp_profit_pool = excess_profit - lead_carry_amount;
        let total_lp_payout = principal_repaid + lp_profit_pool;
        let total_lead_payout = lead_carry_amount;

        let calc = WaterfallCalculation {
            total_proceeds,
            principal_repaid,
            excess_profit,
            lead_carry_amount,
            lp_profit_pool,
            total_lp_payout,
            total_lead_payout,
        };

        emit_waterfall_computed(&env, &caller, total_proceeds, total_principal, &calc);

        Ok(calc)
    }

    /// Calculate pro-rata LP claim amount from the total LP payout pool
    pub fn calculate_lp_share(
        _env: Env,
        investor_principal: i128,
        total_principal: i128,
        total_lp_payout_pool: i128,
    ) -> Result<i128, WaterfallError> {
        if total_principal <= 0 {
            return Err(WaterfallError::ZeroTotalShares);
        }
        if investor_principal <= 0 || total_lp_payout_pool <= 0 {
            return Ok(0);
        }

        let lp_share = (investor_principal * total_lp_payout_pool) / total_principal;
        Ok(lp_share)
    }

    /// Update configuration
    pub fn update_config(
        env: Env,
        admin: Address,
        lead_carry_bps: u32,
        hurdle_rate_bps: u32,
    ) -> Result<(), WaterfallError> {
        let mut config: WaterfallConfig = env
            .storage()
            .instance()
            .get(&CONFIG_KEY)
            .ok_or(WaterfallError::NotInitialized)?;

        config.admin.require_auth();
        if admin != config.admin {
            return Err(WaterfallError::Unauthorized);
        }
        if lead_carry_bps > 10_000 || hurdle_rate_bps > 10_000 {
            return Err(WaterfallError::InvalidBasisPoints);
        }

        config.lead_carry_bps = lead_carry_bps;
        config.hurdle_rate_bps = hurdle_rate_bps;
        env.storage().instance().set(&CONFIG_KEY, &config);

        Ok(())
    }

    /// Get current configuration
    pub fn get_config(env: Env) -> Result<WaterfallConfig, WaterfallError> {
        env.storage()
            .instance()
            .get(&CONFIG_KEY)
            .ok_or(WaterfallError::NotInitialized)
    }
}
