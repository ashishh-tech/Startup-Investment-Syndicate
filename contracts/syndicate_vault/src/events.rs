use soroban_sdk::{symbol_short, Address, Env, String};
use crate::types::{MilestoneStatus, VaultStatus};

pub fn emit_syndicate_initialized(
    env: &Env,
    admin: &Address,
    lead: &Address,
    target_cap: i128,
    deadline: u64,
) {
    env.events().publish(
        (symbol_short!("synd"), symbol_short!("init")),
        (admin.clone(), lead.clone(), target_cap, deadline),
    );
}

pub fn emit_deposit(
    env: &Env,
    investor: &Address,
    amount: i128,
    shares: i128,
    total_raised: i128,
) {
    env.events().publish(
        (symbol_short!("synd"), symbol_short!("deposit")),
        (investor.clone(), amount, shares, total_raised),
    );
}

pub fn emit_milestone_submitted(
    env: &Env,
    milestone_id: u32,
    tranche_bps: u32,
    description: &String,
) {
    env.events().publish(
        (symbol_short!("synd"), symbol_short!("m_submit")),
        (milestone_id, tranche_bps, description.clone()),
    );
}

pub fn emit_milestone_status_changed(
    env: &Env,
    milestone_id: u32,
    status: MilestoneStatus,
) {
    env.events().publish(
        (symbol_short!("synd"), symbol_short!("m_status")),
        (milestone_id, status as u32),
    );
}

pub fn emit_tranche_released(
    env: &Env,
    milestone_id: u32,
    amount: i128,
    recipient: &Address,
) {
    env.events().publish(
        (symbol_short!("synd"), symbol_short!("m_release")),
        (milestone_id, amount, recipient.clone()),
    );
}

pub fn emit_vault_status_changed(
    env: &Env,
    status: VaultStatus,
) {
    env.events().publish(
        (symbol_short!("synd"), symbol_short!("status")),
        status as u32,
    );
}

pub fn emit_exit_triggered(
    env: &Env,
    total_proceeds: i128,
    lp_payout_pool: i128,
    lead_carry: i128,
) {
    env.events().publish(
        (symbol_short!("synd"), symbol_short!("exit")),
        (total_proceeds, lp_payout_pool, lead_carry),
    );
}

pub fn emit_payout_claimed(
    env: &Env,
    investor: &Address,
    amount: i128,
) {
    env.events().publish(
        (symbol_short!("synd"), symbol_short!("claimed")),
        (investor.clone(), amount),
    );
}
