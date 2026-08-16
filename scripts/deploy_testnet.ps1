# PowerShell Deployment Script for Soroban Testnet
Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "   Stellar Soroban Orange Belt: Syndicate Deployment" -ForegroundColor Yellow
Write-Host "==========================================================" -ForegroundColor Cyan

$Network = "testnet"
$RpcUrl = "https://soroban-testnet.stellar.org"
$NetworkPassphrase = "Test SDF Network ; September 2015"

# 1. Check stellar-cli
if (-not (Get-Command stellar -ErrorAction SilentlyContinue)) {
    Write-Error "Stellar CLI not found. Please install via: cargo install --locked stellar-cli --features opt"
    exit 1
}

# 2. Setup deployer identity
Write-Host "`n[1/5] Configuring deployer testnet identity..." -ForegroundColor Green
stellar keys generate deployer --network $Network --fund --overwrite

$DeployerAddress = stellar keys address deployer
Write-Host "Deployer Address: $DeployerAddress" -ForegroundColor Cyan

# 3. Build WASM contracts
Write-Host "`n[2/5] Building Soroban Smart Contracts to WASM..." -ForegroundColor Green
cargo build --target wasm32-unknown-unknown --release

$DistributorWasm = "target/wasm32-unknown-unknown/release/waterfall_distributor.wasm"
$VaultWasm = "target/wasm32-unknown-unknown/release/syndicate_vault.wasm"

# 4. Deploy Waterfall Distributor
Write-Host "`n[3/5] Deploying Waterfall Distributor contract..." -ForegroundColor Green
$DistributorContractId = stellar contract deploy `
    --wasm $DistributorWasm `
    --source deployer `
    --network $Network

Write-Host "Waterfall Distributor Deployed ID: $DistributorContractId" -ForegroundColor Yellow

# Initialize Waterfall Distributor (20% default carry = 2000 bps)
stellar contract invoke `
    --id $DistributorContractId `
    --source deployer `
    --network $Network `
    -- `
    initialize `
    --admin $DeployerAddress `
    --lead_carry_bps 2000 `
    --hurdle_rate_bps 0

# 5. Deploy Syndicate Vault
Write-Host "`n[4/5] Deploying Syndicate Vault contract..." -ForegroundColor Green
$VaultContractId = stellar contract deploy `
    --wasm $VaultWasm `
    --source deployer `
    --network $Network

Write-Host "Syndicate Vault Deployed ID: $VaultContractId" -ForegroundColor Yellow

# 6. Save addresses into contracts.json and .env.local
Write-Host "`n[5/5] Exporting contract configuration..." -ForegroundColor Green

$Config = @{
    network = $Network
    deployerAddress = $DeployerAddress
    syndicateVaultId = $VaultContractId
    waterfallDistributorId = $DistributorContractId
    timestamp = (Get-Date).ToString("yyyy-MM-ddTHH:mm:ssZ")
} | ConvertTo-Json -Depth 4

Set-Content -Path "contracts.json" -Value $Config
Set-Content -Path ".env.local" -Value "NEXT_PUBLIC_VAULT_CONTRACT_ID=$VaultContractId`nNEXT_PUBLIC_DISTRIBUTOR_CONTRACT_ID=$DistributorContractId"

Write-Host "`nDeployment Complete!" -ForegroundColor Green
Write-Host "Vault ID: $VaultContractId" -ForegroundColor Cyan
Write-Host "Distributor ID: $DistributorContractId" -ForegroundColor Cyan
Write-Host "Config saved to contracts.json and .env.local" -ForegroundColor Gray
