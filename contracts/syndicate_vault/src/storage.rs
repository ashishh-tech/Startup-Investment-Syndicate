use soroban_sdk::{contracttype, Address, Env, Vec};
use crate::types::{InvestorStake, Milestone, SyndicateConfig};

#[contracttype]
#[derive(Clone)]
pub enum DataKey {
    Config,
    Investor(Address),
    InvestorList,
    Milestones,
    TotalLpPayoutPool,
    TotalLeadCarryPool,
}

const INSTANCE_BUMP_AMOUNT: u32 = 100_000;
const INSTANCE_LIFETIME_THRESHOLD: u32 = 50_000;

const PERSISTENT_BUMP_AMOUNT: u32 = 200_000;
const PERSISTENT_LIFETIME_THRESHOLD: u32 = 100_000;

pub fn bump_instance(env: &Env) {
    env.storage().instance().extend_ttl(
        INSTANCE_LIFETIME_THRESHOLD,
        INSTANCE_BUMP_AMOUNT,
    );
}

pub fn get_config(env: &Env) -> Option<SyndicateConfig> {
    env.storage().instance().get(&DataKey::Config)
}

pub fn set_config(env: &Env, config: &SyndicateConfig) {
    env.storage().instance().set(&DataKey::Config, config);
    bump_instance(env);
}

pub fn get_investor_stake(env: &Env, investor: &Address) -> Option<InvestorStake> {
    let key = DataKey::Investor(investor.clone());
    let stake = env.storage().persistent().get(&key);
    if stake.is_some() {
        env.storage().persistent().extend_ttl(
            &key,
            PERSISTENT_LIFETIME_THRESHOLD,
            PERSISTENT_BUMP_AMOUNT,
        );
    }
    stake
}

pub fn set_investor_stake(env: &Env, investor: &Address, stake: &InvestorStake) {
    let key = DataKey::Investor(investor.clone());
    env.storage().persistent().set(&key, stake);
    env.storage().persistent().extend_ttl(
        &key,
        PERSISTENT_LIFETIME_THRESHOLD,
        PERSISTENT_BUMP_AMOUNT,
    );
}

pub fn get_investor_list(env: &Env) -> Vec<Address> {
    env.storage()
        .persistent()
        .get(&DataKey::InvestorList)
        .unwrap_or(Vec::new(env))
}

pub fn add_to_investor_list(env: &Env, investor: &Address) {
    let mut list = get_investor_list(env);
    let mut exists = false;
    for item in list.iter() {
        if item == *investor {
            exists = true;
            break;
        }
    }
    if !exists {
        list.push_back(investor.clone());
        env.storage().persistent().set(&DataKey::InvestorList, &list);
    }
}

pub fn get_milestones(env: &Env) -> Vec<Milestone> {
    env.storage()
        .persistent()
        .get(&DataKey::Milestones)
        .unwrap_or(Vec::new(env))
}

pub fn set_milestones(env: &Env, milestones: &Vec<Milestone>) {
    env.storage().persistent().set(&DataKey::Milestones, milestones);
    env.storage().persistent().extend_ttl(
        &DataKey::Milestones,
        PERSISTENT_LIFETIME_THRESHOLD,
        PERSISTENT_BUMP_AMOUNT,
    );
}
