import { describe, it, expect, beforeEach } from "vitest";
import { useTxStore } from "@/state/txStore";

describe("useTxStore Transaction Lifecycle", () => {
  beforeEach(() => {
    useTxStore.getState().clearHistory();
  });

  it("should add a new transaction with signing status", () => {
    const txId = useTxStore.getState().addTransaction({
      title: "Deposit into Seed Vault",
      description: "Minting 25,000 LP tokens",
      contractId: "CA77VNLXWZY462GTH7OEZ4F63Z35T5T4ZGYQ6N3U32AEPX3CQU2Z6H66",
      method: "deposit",
    });

    const state = useTxStore.getState();
    expect(state.transactions.length).toBe(1);
    expect(state.transactions[0].id).toBe(txId);
    expect(state.transactions[0].status).toBe("signing");
    expect(state.isOpen).toBe(true);
  });

  it("should progress status from submitting to confirmed with explorer hash", () => {
    const txId = useTxStore.getState().addTransaction({
      title: "Milestone Release",
      description: "Disburse Tranche 1",
    });

    useTxStore.getState().updateStatus(txId, "submitting");
    expect(useTxStore.getState().transactions[0].status).toBe("submitting");

    const mockHash = "8f74a9d9c22b2e987162983b4e4c278912384a6c8e312984b5c192847a9e8b12";
    useTxStore.getState().updateStatus(txId, "confirmed", {
      hash: mockHash,
      explorerUrl: `https://stellar.expert/explorer/testnet/tx/${mockHash}`,
    });

    const updatedTx = useTxStore.getState().transactions[0];
    expect(updatedTx.status).toBe("confirmed");
    expect(updatedTx.hash).toBe(mockHash);
    expect(updatedTx.explorerUrl).toContain(mockHash);
  });
});
