# 🚢 Deployment & Environment Configuration Matrix

This matrix provides operational guidance for deploying the **Startup Investment Syndicate** platform across Stellar network environments.

## 1. Network Endpoint Configurations

| Environment | RPC Endpoint URL | Horizon URL | Stellar Explorer |
|---|---|---|---|
| **Testnet** | `https://soroban-testnet.stellar.org` | `https://horizon-testnet.stellar.org` | `https://stellar.expert/explorer/testnet` |
| **Futurenet** | `https://rpc-futurenet.stellar.org` | `https://horizon-futurenet.stellar.org` | `https://stellar.expert/explorer/futurenet` |
| **Standalone** | `http://localhost:8000/soroban/rpc` | `http://localhost:8000` | `http://localhost:8000/explorer` |
| **Mainnet** | `https://mainnet.sorobanrpc.com` | `https://horizon.stellar.org` | `https://stellar.expert/explorer/public` |

---

## 2. Soroban Deployment Steps

```bash
# 1. Generate and fund deployer account
stellar keys generate deployer --network testnet --fund

# 2. Compile Rust WASM binaries
cargo build --target wasm32-unknown-unknown --release

# 3. Deploy Waterfall Distributor
stellar contract deploy \
  --wasm target/wasm32-unknown-unknown/release/waterfall_distributor.wasm \
  --source deployer \
  --network testnet

# 4. Deploy Syndicate Vault
stellar contract deploy \
  --wasm target/wasm32-unknown-unknown/release/syndicate_vault.wasm \
  --source deployer \
  --network testnet
```

---

## 3. Web Hosting & Netlify CDN

- **Live URL**: [https://startupinvestmentsyndicate.netlify.app/](https://startupinvestmentsyndicate.netlify.app/)
- **Build Command**: `npm run build`
- **Output Directory**: `out`
- **SSG Pre-rendered Routes**: `/`, `/dashboard`, `/activity`, `/analytics`, `/transactions`, `/settings`, `/syndicates/syn-01`, `/syndicates/syn-02`, `/syndicates/syn-03`.
