#![cfg(test)]

use super::*;
use soroban_sdk::{testutils::Address as _, Address, Env};

#[test]
fn test_initialize_and_config() {
    let env = Env::default();
    let contract_id = env.register(WaterfallDistributor, ());
    let client = WaterfallDistributorClient::new(&env, &contract_id);

    let admin = Address::generate(&env);
    env.mock_all_auths();

    client.initialize(&admin, &2000, &0);
    let config = client.get_config();

    assert_eq!(config.admin, admin);
    assert_eq!(config.lead_carry_bps, 2000);
}

#[test]
fn test_waterfall_calculation_with_profit() {
    let env = Env::default();
    let contract_id = env.register(WaterfallDistributor, ());
    let client = WaterfallDistributorClient::new(&env, &contract_id);

    let admin = Address::generate(&env);
    let caller = Address::generate(&env);
    env.mock_all_auths();

    client.initialize(&admin, &2000, &0); // 20% carry

    // $1,000,000 principal invested, $3,000,000 exit proceeds (3x return)
    // Profit = $2,000,000
    // Carry (20%) = $400,000
    // LP Profit Pool = $1,600,000
    // Total LP Payout = $1,000,000 + $1,600,000 = $2,600,000
    // Total Lead Payout = $400,000
    let calc = client.calculate_waterfall(&caller, &3_000_000, &1_000_000, &None);

    assert_eq!(calc.principal_repaid, 1_000_000);
    assert_eq!(calc.excess_profit, 2_000_000);
    assert_eq!(calc.lead_carry_amount, 400_000);
    assert_eq!(calc.lp_profit_pool, 1_600_000);
    assert_eq!(calc.total_lp_payout, 2_600_000);
    assert_eq!(calc.total_lead_payout, 400_000);
}

#[test]
fn test_waterfall_calculation_downside_loss() {
    let env = Env::default();
    let contract_id = env.register(WaterfallDistributor, ());
    let client = WaterfallDistributorClient::new(&env, &contract_id);

    let admin = Address::generate(&env);
    let caller = Address::generate(&env);
    env.mock_all_auths();

    client.initialize(&admin, &2000, &0);

    // $1,000,000 principal, only $600,000 proceeds (downside)
    // LP gets 100% of proceeds ($600,000), Lead gets $0 carry
    let calc = client.calculate_waterfall(&caller, &600_000, &1_000_000, &None);

    assert_eq!(calc.principal_repaid, 600_000);
    assert_eq!(calc.excess_profit, 0);
    assert_eq!(calc.lead_carry_amount, 0);
    assert_eq!(calc.total_lp_payout, 600_000);
    assert_eq!(calc.total_lead_payout, 0);
}

#[test]
fn test_calculate_lp_share_pro_rata() {
    let env = Env::default();
    let contract_id = env.register(WaterfallDistributor, ());
    let client = WaterfallDistributorClient::new(&env, &contract_id);

    // Investor put in 250,000 out of 1,000,000 (25% share)
    // LP payout pool is 2,600,000
    // Expected LP payout = 25% * 2,600,000 = 650,000
    let lp_payout = client.calculate_lp_share(&250_000, &1_000_000, &2_600_000);
    assert_eq!(lp_payout, 650_000);
}
