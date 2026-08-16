use soroban_sdk::{contracterror, contracttype, Address, String};

#[contracterror]
#[derive(Copy, Clone, Debug, Eq, PartialEq, PartialOrd, Ord)]
#[repr(u32)]
pub enum VaultError {
    AlreadyInitialized = 1,
    NotInitialized = 2,
    Unauthorized = 3,
    InvalidState = 4,
    FundraisingClosed = 5,
    TargetCapExceeded = 6,
    TicketTooSmall = 7,
    TicketTooLarge = 8,
    DeadlinePassed = 9,
    MilestoneNotFound = 10,
    MilestoneNotApproved = 11,
    MilestoneAlreadyReleased = 12,
    InsufficientVaultBalance = 13,
    NoClaimableReturns = 14,
    InvalidTranchePercent = 15,
    ZeroAmount = 16,
    ArithmeticError = 17,
    AlreadyClaimed = 18,
}

#[contracttype]
#[derive(Copy, Clone, Debug, Eq, PartialEq)]
#[repr(u32)]
pub enum VaultStatus {
    Fundraising = 0,
    Active = 1,
    MilestonePhase = 2,
    ExitPending = 3,
    Liquidated = 4,
}

#[contracttype]
#[derive(Copy, Clone, Debug, Eq, PartialEq)]
#[repr(u32)]
pub enum MilestoneStatus {
    Pending = 0,
    Approved = 1,
    Released = 2,
    Rejected = 3,
}

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct SyndicateConfig {
    pub admin: Address,
    pub syndicate_lead: Address,
    pub startup_recipient: Address,
    pub asset_token: Address,
    pub distributor_contract: Address,
    pub target_cap: i128,
    pub min_ticket: i128,
    pub max_ticket: i128,
    pub deadline: u64,
    pub total_raised: i128,
    pub total_disbursed: i128,
    pub status: VaultStatus,
    pub total_return_pool: i128,
    pub carry_bps: u32,
}

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct Milestone {
    pub id: u32,
    pub description: String,
    pub tranche_bps: u32, // e.g. 2500 for 25%
    pub amount: i128,
    pub status: MilestoneStatus,
}

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct InvestorStake {
    pub investor: Address,
    pub principal_deposited: i128,
    pub shares_minted: i128,
    pub claimed_payout: i128,
    pub has_claimed_final: bool,
}
