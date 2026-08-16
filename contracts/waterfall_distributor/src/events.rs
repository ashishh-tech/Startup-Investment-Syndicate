use soroban_sdk::{symbol_short, Address, Env};
use crate::types::WaterfallCalculation;

pub fn emit_initialized(env: &Env, admin: &Address, lead_carry_bps: u32) {
    env.events().publish(
        (symbol_short!("wtfall"), symbol_short!("init")),
        (admin.clone(), lead_carry_bps),
    );
}

pub fn emit_waterfall_computed(
    env: &Env,
    caller: &Address,
    total_proceeds: i128,
    total_principal: i128,
    calc: &WaterfallCalculation,
) {
    env.events().publish(
        (symbol_short!("wtfall"), symbol_short!("computed")),
        (
            caller.clone(),
            total_proceeds,
            total_principal,
            calc.total_lp_payout,
            calc.total_lead_payout,
        ),
    );
}
