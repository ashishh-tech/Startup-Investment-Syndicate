import { NetworkConfig, NetworkType } from "@/types";

export const NETWORKS: Record<NetworkType, NetworkConfig> = {
  testnet: {
    network: "testnet",
    networkPassphrase: "Test SDF Network ; September 2015",
    rpcUrl: "https://soroban-testnet.stellar.org",
    horizonUrl: "https://horizon-testnet.stellar.org",
    explorerUrl: "https://stellar.expert/explorer/testnet",
  },
  futurenet: {
    network: "futurenet",
    networkPassphrase: "Test SDF Future Network ; October 2022",
    rpcUrl: "https://rpc-futurenet.stellar.org",
    horizonUrl: "https://horizon-futurenet.stellar.org",
    explorerUrl: "https://stellar.expert/explorer/futurenet",
  },
  standalone: {
    network: "standalone",
    networkPassphrase: "Standalone Network ; February 2017",
    rpcUrl: "http://localhost:8000/soroban/rpc",
    horizonUrl: "http://localhost:8000",
    explorerUrl: "http://localhost:8000/explorer",
  },
  mainnet: {
    network: "mainnet",
    networkPassphrase: "Public Global Stellar Network ; July 2015",
    rpcUrl: "https://mainnet.sorobanrpc.com",
    horizonUrl: "https://horizon.stellar.org",
    explorerUrl: "https://stellar.expert/explorer/public",
  },
};

export const DEFAULT_NETWORK: NetworkType = "testnet";
