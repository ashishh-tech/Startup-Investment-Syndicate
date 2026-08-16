import { create } from "zustand";
import { TrackedTransaction, TxStatus } from "@/types";

export interface TxState {
  transactions: TrackedTransaction[];
  activeTxId: string | null;
  isOpen: boolean;

  // Actions
  addTransaction: (tx: Omit<TrackedTransaction, "id" | "timestamp" | "status">) => string;
  updateStatus: (id: string, status: TxStatus, extra?: { hash?: string; errorMessage?: string; explorerUrl?: string }) => void;
  setOpen: (open: boolean) => void;
  clearHistory: () => void;
  getPendingCount: () => number;
}

export const useTxStore = create<TxState>((set, get) => ({
  transactions: [
    {
      id: "tx-init-demo-1",
      title: "Initialize Syndicate Vault",
      description: "Deployed Syndicate Vault contract with $1,000,000 target cap and 20% carry",
      status: "confirmed",
      timestamp: Date.now() - 3600000 * 2,
      hash: "8f74a9d9c22b2e987162983b4e4c278912384a6c8e312984b5c192847a9e8b12",
      explorerUrl: "https://stellar.expert/explorer/testnet/tx/8f74a9d9c22b2e987162983b4e4c278912384a6c8e312984b5c192847a9e8b12",
    },
    {
      id: "tx-init-demo-2",
      title: "Register Waterfall Distributor",
      description: "Cross-contract linking between Syndicate Vault and Waterfall Distributor",
      status: "confirmed",
      timestamp: Date.now() - 3600000 * 1.5,
      hash: "3a9e18b47289b4e4c278912384a6c8e312984b5c192847a9e8b128f74a9d9c22",
      explorerUrl: "https://stellar.expert/explorer/testnet/tx/3a9e18b47289b4e4c278912384a6c8e312984b5c192847a9e8b128f74a9d9c22",
    },
  ],
  activeTxId: null,
  isOpen: false,

  addTransaction: (tx) => {
    const id = `tx-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const newTx: TrackedTransaction = {
      ...tx,
      id,
      timestamp: Date.now(),
      status: "signing",
    };

    set((state) => ({
      transactions: [newTx, ...state.transactions],
      activeTxId: id,
      isOpen: true,
    }));

    return id;
  },

  updateStatus: (id, status, extra) => {
    set((state) => ({
      transactions: state.transactions.map((tx) =>
        tx.id === id
          ? {
              ...tx,
              status,
              ...(extra?.hash ? { hash: extra.hash } : {}),
              ...(extra?.errorMessage ? { errorMessage: extra.errorMessage } : {}),
              ...(extra?.explorerUrl ? { explorerUrl: extra.explorerUrl } : {}),
            }
          : tx
      ),
      activeTxId: status === "confirmed" || status === "failed" ? null : state.activeTxId,
    }));
  },

  setOpen: (isOpen) => set({ isOpen }),

  clearHistory: () => set({ transactions: [], activeTxId: null }),

  getPendingCount: () => {
    const { transactions } = get();
    return transactions.filter((t) => t.status === "signing" || t.status === "submitting").length;
  },
}));
