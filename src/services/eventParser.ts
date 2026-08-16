import { BlockchainEvent } from "@/types";

export class EventParserService {
  /**
   * Transforms raw Soroban contract event log into UI-ready BlockchainEvent struct
   */
  static parseSorobanEvent(
    rawTopic: string,
    txHash: string,
    syndicateId: string,
    syndicateName: string,
    actor: string,
    amount?: number
  ): BlockchainEvent {
    let eventType: BlockchainEvent["type"] = "deposit";
    let details = "Contract event published";

    if (rawTopic.includes("deposit")) {
      eventType = "deposit";
      details = `Deposited $${amount?.toLocaleString() || 0} USDC into syndicate vault`;
    } else if (rawTopic.includes("m_submit")) {
      eventType = "milestone_submitted";
      details = "Proposed milestone tranche deliverable";
    } else if (rawTopic.includes("m_status")) {
      eventType = "milestone_approved";
      details = "Approved milestone deliverable audit";
    } else if (rawTopic.includes("m_release")) {
      eventType = "tranche_released";
      details = `Disbursed $${amount?.toLocaleString() || 0} USDC tranche to startup recipient`;
    } else if (rawTopic.includes("exit")) {
      eventType = "exit_triggered";
      details = `Triggered exit return waterfall with $${amount?.toLocaleString() || 0} USDC proceeds`;
    } else if (rawTopic.includes("claimed")) {
      eventType = "payout_claimed";
      details = `Claimed $${amount?.toLocaleString() || 0} USDC pro-rata return from vault`;
    }

    return {
      id: `evt-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      type: eventType,
      timestamp: Date.now(),
      txHash,
      syndicateId,
      syndicateName,
      actor,
      amount,
      details,
    };
  }
}
