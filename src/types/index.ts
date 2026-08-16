export type NetworkType = "testnet" | "futurenet" | "mainnet" | "standalone";

export interface NetworkConfig {
  network: NetworkType;
  networkPassphrase: string;
  rpcUrl: string;
  horizonUrl: string;
  explorerUrl: string;
}

export type VaultStatus = "Fundraising" | "Active" | "MilestonePhase" | "ExitPending" | "Liquidated";

export type MilestoneStatus = "Pending" | "Approved" | "Released" | "Rejected";

export interface Milestone {
  id: number;
  description: string;
  trancheBps: number;
  amount: number;
  status: MilestoneStatus;
  estimatedDate?: string;
  deliverables?: string[];
}

export interface InvestorStake {
  investor: string;
  principalDeposited: number;
  sharesMinted: number;
  claimedPayout: number;
  hasClaimedFinal: boolean;
  sharePercentage?: number;
}

export interface Syndicate {
  id: string;
  name: string;
  tagline: string;
  category: string;
  logo: string;
  banner: string;
  admin: string;
  syndicateLead: string;
  leadName: string;
  leadAvatar: string;
  leadBio: string;
  startupRecipient: string;
  assetToken: string;
  assetSymbol: string;
  distributorContract: string;
  vaultContract: string;
  targetCap: number;
  minTicket: number;
  maxTicket: number;
  deadline: number;
  totalRaised: number;
  totalDisbursed: number;
  status: VaultStatus;
  totalReturnPool: number;
  carryBps: number; // e.g. 2000 for 20%
  expectedValuation: number;
  expectedExitMultiplier: number;
  investorsCount: number;
  milestones: Milestone[];
}

export interface WaterfallBreakdown {
  totalProceeds: number;
  totalPrincipal: number;
  principalRepaid: number;
  excessProfit: number;
  leadCarryAmount: number;
  lpProfitPool: number;
  totalLpPayout: number;
  totalLeadPayout: number;
  lpMoic: number;
  lpIrrEstimate: number;
}

export type TxStatus = "idle" | "signing" | "submitting" | "confirmed" | "failed";

export interface TrackedTransaction {
  id: string;
  hash?: string;
  title: string;
  description: string;
  status: TxStatus;
  timestamp: number;
  contractId?: string;
  method?: string;
  params?: Record<string, any>;
  errorMessage?: string;
  explorerUrl?: string;
}

export interface BlockchainEvent {
  id: string;
  type: "deposit" | "milestone_submitted" | "milestone_approved" | "tranche_released" | "status_changed" | "exit_triggered" | "payout_claimed";
  timestamp: number;
  txHash: string;
  syndicateId: string;
  syndicateName: string;
  actor: string;
  actorLabel?: string;
  amount?: number;
  assetSymbol?: string;
  details: string;
}
