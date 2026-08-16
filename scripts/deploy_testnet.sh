#!/usr/bin/env bash
set -e

echo "=========================================================="
echo "   Stellar Soroban Orange Belt: Syndicate Deployment"
echo "=========================================================="

NETWORK="testnet"
RPC_URL="https://soroban-testnet.stellar.org"

# Check stellar CLI
if ! command -v stellar &> /dev/null; then
    echo "Stellar CLI not found. Please install stellar-cli."
    exit 1
fi

echo "[1/5] Setting up testnet deployer..."
stellar keys generate deployer --network $NETWORK --fund --overwrite || true
DEPLOYER_ADDRESS=$(stellar keys address deployer)
echo "Deployer Address: $DEPLOYER_ADDRESS"

echo "[2/5] Building contracts..."
cargo build --target wasm32-unknown-unknown --release

DISTRIBUTOR_WASM="target/wasm32-unknown-unknown/release/waterfall_distributor.wasm"
VAULT_WASM="target/wasm32-unknown-unknown/release/syndicate_vault.wasm"

echo "[3/5] Deploying Waterfall Distributor..."
DISTRIBUTOR_ID=$(stellar contract deploy \
    --wasm "$DISTRIBUTOR_WASM" \
    --source deployer \
    --network "$NETWORK")

echo "Waterfall Distributor ID: $DISTRIBUTOR_ID"

echo "Initializing Waterfall Distributor..."
stellar contract invoke \
    --id "$DISTRIBUTOR_ID" \
    --source deployer \
    --network "$NETWORK" \
    -- \
    initialize \
    --admin "$DEPLOYER_ADDRESS" \
    --lead_carry_bps 2000 \
    --hurdle_rate_bps 0

echo "[4/5] Deploying Syndicate Vault..."
VAULT_ID=$(stellar contract deploy \
    --wasm "$VAULT_WASM" \
    --source deployer \
    --network "$NETWORK")

echo "Syndicate Vault ID: $VAULT_ID"

echo "[5/5] Writing configurations..."
cat <<EOF > contracts.json
{
  "network": "$NETWORK",
  "deployerAddress": "$DEPLOYER_ADDRESS",
  "syndicateVaultId": "$VAULT_ID",
  "waterfallDistributorId": "$DISTRIBUTOR_ID",
  "timestamp": "$(date -u +"%Y-%m-%dT%H:%M:%SZ")"
}
EOF

cat <<EOF > .env.local
NEXT_PUBLIC_VAULT_CONTRACT_ID=$VAULT_ID
NEXT_PUBLIC_DISTRIBUTOR_CONTRACT_ID=$DISTRIBUTOR_ID
EOF

echo "Deployment complete! Contracts saved to contracts.json and .env.local"
