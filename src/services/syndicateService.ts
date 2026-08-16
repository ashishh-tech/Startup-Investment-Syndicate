import { Syndicate, Milestone, InvestorStake, BlockchainEvent } from "@/types";
import { useTxStore } from "@/state/txStore";
import { useEventStore } from "@/state/eventStore";
import { NETWORKS } from "@/config/networks";
import { CONTRACTS } from "@/config/contracts";

const INITIAL_SYNDICATES: Syndicate[] = [
  {
    id: "syn-01",
    name: "Aetheria Robotics",
    tagline: "Autonomous Micro-Precision Surgical Robotics powered by Edge AI",
    category: "DeepTech / Robotics",
    logo: "🤖",
    banner: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=1200&q=80",
    admin: "GDL36B6U4XP3E2N7J5Q2B3P74Y49B6GQLK3Y7O57NVX5L5Q2O3F36SY",
    syndicateLead: "GDL36B6U4XP3E2N7J5Q2B3P74Y49B6GQLK3Y7O57NVX5L5Q2O3F36SY",
    leadName: "Elena Rostova (ex-Intuitive Surgical)",
    leadAvatar: "👩‍🔬",
    leadBio: "Former VP Robotics at Intuitive Surgical, 2x exited founder, 14 patents in micro-actuation systems.",
    startupRecipient: "GAST47U2P7M4B3X4K2P3N2V372B572U44P72G2C37P2N6U372B572AETH",
    assetToken: CONTRACTS.testnet.usdcTokenId,
    assetSymbol: "USDC",
    distributorContract: CONTRACTS.testnet.waterfallDistributorId,
    vaultContract: CONTRACTS.testnet.syndicateVaultId,
    targetCap: 1000000,
    minTicket: 10000,
    maxTicket: 250000,
    deadline: Date.now() + 86400000 * 18,
    totalRaised: 750000,
    totalDisbursed: 250000,
    status: "MilestonePhase",
    totalReturnPool: 0,
    carryBps: 2000, // 20%
    expectedValuation: 12000000,
    expectedExitMultiplier: 4.5,
    investorsCount: 14,
    milestones: [
      {
        id: 1,
        description: "Milestone 1: Sub-millimeter actuator prototype & pre-clinical laboratory test",
        trancheBps: 2500, // 25% = $250,000
        amount: 250000,
        status: "Released",
        estimatedDate: "Q2 2026",
        deliverables: [
          "Completed actuator physical casing",
          "Latency benchmark < 1.2ms over isolated fiber",
          "FDA Q-Sub meeting transcript",
        ],
      },
      {
        id: 2,
        description: "Milestone 2: Animal trial compliance & FDA 510(k) Pre-Market Notification Submission",
        trancheBps: 3500, // 35% = $350,000
        amount: 350000,
        status: "Pending",
        estimatedDate: "Q3 2026",
        deliverables: [
          "99.98% trajectory accuracy in vivo",
          "ISO 13485 certification audit report",
          "Formal FDA 510(k) receipt number",
        ],
      },
      {
        id: 3,
        description: "Milestone 3: First-in-human multi-site clinical trial & commercial production readiness",
        trancheBps: 4000, // 40% = $400,000
        amount: 400000,
        status: "Pending",
        estimatedDate: "Q1 2027",
        deliverables: [
          "15 successfully completed surgical interventions",
          "Commercial supply agreements with 3 tier-1 hospital systems",
        ],
      },
    ],
  },
  {
    id: "syn-02",
    name: "NeuroPulse MedTech",
    tagline: "Non-invasive neural telemetry for early epilepsy detection",
    category: "HealthTech / Neural AI",
    logo: "🧠",
    banner: "https://images.unsplash.com/photo-1559757175-5700dde675bc?auto=format&fit=crop&w=1200&q=80",
    admin: "GDL36B6U4XP3E2N7J5Q2B3P74Y49B6GQLK3Y7O57NVX5L5Q2O3F36SY",
    syndicateLead: "Dr. Julian Thorne",
    leadName: "Dr. Julian Thorne",
    leadAvatar: "👨‍⚕️",
    leadBio: "Neuroscientist & Partner at Apex BioVentures. Published in Nature Neuroscience.",
    startupRecipient: "GNEURO7M4B3X4K2P3N2V372B572U44P72G2C37P2N6U372B572MED",
    assetToken: CONTRACTS.testnet.usdcTokenId,
    assetSymbol: "USDC",
    distributorContract: CONTRACTS.testnet.waterfallDistributorId,
    vaultContract: "CB77VNLXWZY462GTH7OEZ4F63Z35T5T4ZGYQ6N3U32AEPX3CQU2Z6H99",
    targetCap: 1500000,
    minTicket: 25000,
    maxTicket: 500000,
    deadline: Date.now() + 86400000 * 24,
    totalRaised: 1100000,
    totalDisbursed: 0,
    status: "Fundraising",
    totalReturnPool: 0,
    carryBps: 2000,
    expectedValuation: 18000000,
    expectedExitMultiplier: 5.2,
    investorsCount: 22,
    milestones: [
      {
        id: 1,
        description: "Milestone 1: 128-channel EEG headband sensor calibration and CE Mark filing",
        trancheBps: 4000,
        amount: 600000,
        status: "Pending",
        estimatedDate: "Q3 2026",
      },
      {
        id: 2,
        description: "Milestone 2: 500-patient validation study across Mayo Clinic and Charité",
        trancheBps: 6000,
        amount: 900000,
        status: "Pending",
        estimatedDate: "Q1 2027",
      },
    ],
  },
  {
    id: "syn-03",
    name: "QuantumCipher Security",
    tagline: "Post-quantum cryptographic key encapsulation for financial settlement",
    category: "Cybersecurity / FinTech",
    logo: "🛡️",
    banner: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80",
    admin: "GDL36B6U4XP3E2N7J5Q2B3P74Y49B6GQLK3Y7O57NVX5L5Q2O3F36SY",
    syndicateLead: "Marcus Vance",
    leadName: "Marcus Vance (ex-DARPA)",
    leadAvatar: "🔐",
    leadBio: "Former cybersecurity lead at DARPA, cryptography researcher at MIT CSAIL.",
    startupRecipient: "GQCIPH7M4B3X4K2P3N2V372B572U44P72G2C37P2N6U372B572SEC",
    assetToken: CONTRACTS.testnet.usdcTokenId,
    assetSymbol: "USDC",
    distributorContract: CONTRACTS.testnet.waterfallDistributorId,
    vaultContract: "CC99VNLXWZY462GTH7OEZ4F63Z35T5T4ZGYQ6N3U32AEPX3CQU2Z6H11",
    targetCap: 2000000,
    minTicket: 50000,
    maxTicket: 500000,
    deadline: Date.now() - 86400000 * 60,
    totalRaised: 2000000,
    totalDisbursed: 2000000,
    status: "Liquidated",
    totalReturnPool: 6600000,
    carryBps: 2000,
    expectedValuation: 25000000,
    expectedExitMultiplier: 3.3,
    investorsCount: 19,
    milestones: [
      {
        id: 1,
        description: "Milestone 1: Lattice-based HSM firmware implementation",
        trancheBps: 5000,
        amount: 1000000,
        status: "Released",
        estimatedDate: "Q4 2025",
      },
      {
        id: 2,
        description: "Milestone 2: Tier-1 bank deployment & acquisition closure",
        trancheBps: 5000,
        amount: 1000000,
        status: "Released",
        estimatedDate: "Q2 2026",
      },
    ],
  },
];

export class SyndicateService {
  private static syndicates: Syndicate[] = INITIAL_SYNDICATES;

  static async getAllSyndicates(): Promise<Syndicate[]> {
    // Return clone
    return [...this.syndicates];
  }

  static async getSyndicateById(id: string): Promise<Syndicate | null> {
    const syn = this.syndicates.find((s) => s.id === id);
    return syn ? { ...syn } : null;
  }

  /**
   * Deposit capital into syndicate vault (with transaction lifecycle tracking & events)
   */
  static async depositCapital(
    syndicateId: string,
    investorAddress: string,
    amount: number
  ): Promise<{ success: boolean; txHash: string }> {
    const syndicate = this.syndicates.find((s) => s.id === syndicateId);
    if (!syndicate) throw new Error("Syndicate not found");

    if (syndicate.status !== "Fundraising") {
      throw new Error(`Syndicate is not in Fundraising phase (Current: ${syndicate.status})`);
    }

    if (amount < syndicate.minTicket) {
      throw new Error(`Deposit below minimum ticket ($${syndicate.minTicket.toLocaleString()})`);
    }

    if (amount > syndicate.maxTicket) {
      throw new Error(`Deposit exceeds maximum ticket ($${syndicate.maxTicket.toLocaleString()})`);
    }

    if (syndicate.totalRaised + amount > syndicate.targetCap) {
      throw new Error(`Deposit would exceed target cap ($${syndicate.targetCap.toLocaleString()})`);
    }

    // Trigger Transaction Center
    const txId = useTxStore.getState().addTransaction({
      title: `Deposit $${amount.toLocaleString()} into ${syndicate.name}`,
      description: `Minting ${amount.toLocaleString()} share tokens via Soroban Vault contract`,
      contractId: syndicate.vaultContract,
      method: "deposit",
      params: { investor: investorAddress, amount },
    });

    // Simulate blockchain confirmation
    await new Promise((resolve) => setTimeout(resolve, 800));
    useTxStore.getState().updateStatus(txId, "submitting");

    await new Promise((resolve) => setTimeout(resolve, 1400));
    const txHash = `7b9e${Math.random().toString(16).substring(2, 14)}4c278912384a6c8e312984b5c192847a9e8b12`;
    const explorerUrl = `${NETWORKS.testnet.explorerUrl}/tx/${txHash}`;

    // Update internal state
    syndicate.totalRaised += amount;
    syndicate.investorsCount += 1;
    if (syndicate.totalRaised >= syndicate.targetCap) {
      syndicate.status = "MilestonePhase";
    }

    useTxStore.getState().updateStatus(txId, "confirmed", { hash: txHash, explorerUrl });

    // Emit live blockchain event
    useEventStore.getState().addEvent({
      id: `evt-${Date.now()}`,
      type: "deposit",
      timestamp: Date.now(),
      txHash,
      syndicateId: syndicate.id,
      syndicateName: syndicate.name,
      actor: investorAddress,
      actorLabel: "LP Investor",
      amount,
      assetSymbol: syndicate.assetSymbol,
      details: `Deposited $${amount.toLocaleString()} ${syndicate.assetSymbol} into syndicate vault`,
    });

    return { success: true, txHash };
  }

  /**
   * Syndicate Lead submits milestone tranche
   */
  static async submitMilestone(
    syndicateId: string,
    leadAddress: string,
    description: string,
    trancheBps: number
  ): Promise<{ success: boolean; txHash: string }> {
    const syndicate = this.syndicates.find((s) => s.id === syndicateId);
    if (!syndicate) throw new Error("Syndicate not found");

    const newId = syndicate.milestones.length + 1;
    const trancheAmount = (syndicate.totalRaised * trancheBps) / 10000;

    const txId = useTxStore.getState().addTransaction({
      title: `Submit Milestone ${newId} (${trancheBps / 100}%)`,
      description: `Registering tranche proposal for ${syndicate.name}`,
      contractId: syndicate.vaultContract,
      method: "submit_milestone",
    });

    await new Promise((resolve) => setTimeout(resolve, 1200));
    const txHash = `3a9e${Math.random().toString(16).substring(2, 14)}4c278912384a6c8e312984b5c192847a9e8b12`;
    const explorerUrl = `${NETWORKS.testnet.explorerUrl}/tx/${txHash}`;

    syndicate.milestones.push({
      id: newId,
      description,
      trancheBps,
      amount: trancheAmount,
      status: "Pending",
      estimatedDate: "Upcoming",
    });

    useTxStore.getState().updateStatus(txId, "confirmed", { hash: txHash, explorerUrl });

    useEventStore.getState().addEvent({
      id: `evt-${Date.now()}`,
      type: "milestone_submitted",
      timestamp: Date.now(),
      txHash,
      syndicateId: syndicate.id,
      syndicateName: syndicate.name,
      actor: leadAddress,
      actorLabel: "Syndicate Lead",
      details: `Submitted milestone ${newId}: ${description} (${trancheBps / 100}% tranche)`,
    });

    return { success: true, txHash };
  }

  /**
   * Approve Milestone
   */
  static async approveMilestone(
    syndicateId: string,
    milestoneId: number,
    approverAddress: string
  ): Promise<{ success: boolean; txHash: string }> {
    const syndicate = this.syndicates.find((s) => s.id === syndicateId);
    if (!syndicate) throw new Error("Syndicate not found");

    const milestone = syndicate.milestones.find((m) => m.id === milestoneId);
    if (!milestone) throw new Error("Milestone not found");

    const txId = useTxStore.getState().addTransaction({
      title: `Approve Milestone ${milestoneId}`,
      description: `Authorizing disbursement for milestone: ${milestone.description}`,
      contractId: syndicate.vaultContract,
      method: "approve_milestone",
    });

    await new Promise((resolve) => setTimeout(resolve, 1000));
    const txHash = `5b8f${Math.random().toString(16).substring(2, 14)}4c278912384a6c8e312984b5c192847a9e8b12`;
    const explorerUrl = `${NETWORKS.testnet.explorerUrl}/tx/${txHash}`;

    milestone.status = "Approved";
    useTxStore.getState().updateStatus(txId, "confirmed", { hash: txHash, explorerUrl });

    useEventStore.getState().addEvent({
      id: `evt-${Date.now()}`,
      type: "milestone_approved",
      timestamp: Date.now(),
      txHash,
      syndicateId: syndicate.id,
      syndicateName: syndicate.name,
      actor: approverAddress,
      actorLabel: "Auditor / Lead",
      details: `Approved Milestone ${milestoneId} deliverables for ${syndicate.name}`,
    });

    return { success: true, txHash };
  }

  /**
   * Disburse Milestone Tranche to Startup
   */
  static async releaseTranche(
    syndicateId: string,
    milestoneId: number,
    callerAddress: string
  ): Promise<{ success: boolean; txHash: string }> {
    const syndicate = this.syndicates.find((s) => s.id === syndicateId);
    if (!syndicate) throw new Error("Syndicate not found");

    const milestone = syndicate.milestones.find((m) => m.id === milestoneId);
    if (!milestone) throw new Error("Milestone not found");

    if (milestone.status !== "Approved") {
      throw new Error("Milestone must be Approved before releasing funds");
    }

    const txId = useTxStore.getState().addTransaction({
      title: `Release $${milestone.amount.toLocaleString()} Tranche`,
      description: `Disbursing capital to startup address ${syndicate.startupRecipient.slice(0, 8)}...`,
      contractId: syndicate.vaultContract,
      method: "release_milestone",
    });

    await new Promise((resolve) => setTimeout(resolve, 1400));
    const txHash = `9a12${Math.random().toString(16).substring(2, 14)}4c278912384a6c8e312984b5c192847a9e8b12`;
    const explorerUrl = `${NETWORKS.testnet.explorerUrl}/tx/${txHash}`;

    milestone.status = "Released";
    syndicate.totalDisbursed += milestone.amount;

    useTxStore.getState().updateStatus(txId, "confirmed", { hash: txHash, explorerUrl });

    useEventStore.getState().addEvent({
      id: `evt-${Date.now()}`,
      type: "tranche_released",
      timestamp: Date.now(),
      txHash,
      syndicateId: syndicate.id,
      syndicateName: syndicate.name,
      actor: callerAddress,
      actorLabel: "Syndicate Lead",
      amount: milestone.amount,
      assetSymbol: syndicate.assetSymbol,
      details: `Released $${milestone.amount.toLocaleString()} ${syndicate.assetSymbol} to startup founder`,
    });

    return { success: true, txHash };
  }

  /**
   * Trigger Acquisition Exit (Inter-contract call to Waterfall Distributor)
   */
  static async triggerExit(
    syndicateId: string,
    acquirerAddress: string,
    totalProceeds: number
  ): Promise<{ success: boolean; txHash: string }> {
    const syndicate = this.syndicates.find((s) => s.id === syndicateId);
    if (!syndicate) throw new Error("Syndicate not found");

    const txId = useTxStore.getState().addTransaction({
      title: `Trigger Exit ($${totalProceeds.toLocaleString()} Proceeds)`,
      description: `Executing cross-contract Waterfall calculation between Vault and Distributor`,
      contractId: syndicate.vaultContract,
      method: "trigger_exit_return",
    });

    await new Promise((resolve) => setTimeout(resolve, 1800));
    const txHash = `ff10${Math.random().toString(16).substring(2, 14)}4c278912384a6c8e312984b5c192847a9e8b12`;
    const explorerUrl = `${NETWORKS.testnet.explorerUrl}/tx/${txHash}`;

    syndicate.status = "Liquidated";
    syndicate.totalReturnPool = totalProceeds;

    useTxStore.getState().updateStatus(txId, "confirmed", { hash: txHash, explorerUrl });

    useEventStore.getState().addEvent({
      id: `evt-${Date.now()}`,
      type: "exit_triggered",
      timestamp: Date.now(),
      txHash,
      syndicateId: syndicate.id,
      syndicateName: syndicate.name,
      actor: acquirerAddress,
      actorLabel: "Acquiring Entity",
      amount: totalProceeds,
      assetSymbol: syndicate.assetSymbol,
      details: `Executed exit with $${totalProceeds.toLocaleString()} total return pool via Waterfall Distributor contract`,
    });

    return { success: true, txHash };
  }
}
