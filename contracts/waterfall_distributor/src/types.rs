use soroban_sdk::{contracterror, contracttype, Address};

#[contracterror]
#[derive(Copy, Clone, Debug, Eq, PartialEq, PartialOrd, Ord)]
#[repr(u32)]
pub enum WaterfallError {
    AlreadyInitialized = 1,
    NotInitialized = 2,
    Unauthorized = 3,
    InvalidBasisPoints = 4,
    ZeroAmount = 5,
    ArithmeticOverflow = 6,
    ZeroTotalShares = 7,
}

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct WaterfallConfig {
    pub admin: Address,
    pub lead_carry_bps: u32,       // e.g. 2000 for 20%
    pub hurdle_rate_bps: u32,      // e.g. 800 for 8% hurdle (optional, 0 for simple waterfall)
}

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct WaterfallCalculation {
    pub total_proceeds: i128,
    pub principal_repaid: i128,
    pub excess_profit: i128,
    pub lead_carry_amount: i128,
    pub lp_profit_pool: i128,
    pub total_lp_payout: i128,
    pub total_lead_payout: i128,
}
