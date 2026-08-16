"use client";

import React, { useState } from "react";
import { useTxStore } from "@/state/txStore";
import {
  History,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ExternalLink,
  Trash2,
  ShieldCheck,
  Plus,
  RefreshCw,
} from "lucide-react";

export default function TransactionsPage() {
  const { transactions, clearHistory, addTransaction, updateStatus } = useTxStore();
  const [filter, setFilter] = useState("all");

  const filteredTxs = transactions.filter((t) => {
    if (filter === "all") return true;
    if (filter === "pending") return t.status === "signing" || t.status === "submitting";
    if (filter === "confirmed") return t.status === "confirmed";
    if (filter === "failed") return t.status === "failed";
    return true;
  });

  const handleSimulateNewTx = async () => {
    const id = addTransaction({
      title: "Simulated LP Token Stake Verification",
      description: "Triggering Soroban simulation for pro-rata cap validation",
      contractId: "CA77VNLXWZY462GTH7OEZ4F63Z35T5T4ZGYQ6N3U32AEPX3CQU2Z6H66",
      method: "get_investor_stake",
    });

    setTimeout(() => {
      updateStatus(id, "submitting");
    }, 800);

    setTimeout(() => {
      const mockHash = `c4f8${Math.random().toString(16).substring(2, 14)}4c278912384a6c8e312984b5c192847a9e8b12`;
      updateStatus(id, "confirmed", {
        hash: mockHash,
        explorerUrl: `https://stellar.expert/explorer/testnet/tx/${mockHash}`,
      });
    }, 2200);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-3">
            <span>Transaction Center</span>
            <span className="rounded-full bg-stellar-card border border-stellar-border px-3 py-1 text-xs font-mono text-gray-300">
              {transactions.length} Total Operations
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 mt-1">
            Complete lifecycle monitoring, signing stages, gas fees, and Stellar explorer verifications
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleSimulateNewTx}
            className="flex items-center gap-1.5 rounded-xl bg-stellar-primary px-4 py-2 text-xs font-bold text-white hover:brightness-110 shadow-lg shadow-stellar-primary/20 transition-all"
          >
            <Plus className="h-4 w-4" />
            <span>Simulate Transaction</span>
          </button>

          {transactions.length > 0 && (
            <button
              onClick={clearHistory}
              className="flex items-center gap-1.5 rounded-xl border border-stellar-border bg-stellar-card px-3 py-2 text-xs font-semibold text-gray-400 hover:text-rose-400 hover:border-rose-500/40 transition-colors"
            >
              <Trash2 className="h-4 w-4" />
              <span>Clear History</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 bg-[#11141D] p-1.5 rounded-xl border border-stellar-border w-fit">
        {[
          { id: "all", label: "All Transactions" },
          { id: "pending", label: "In Flight" },
          { id: "confirmed", label: "Confirmed" },
          { id: "failed", label: "Failed" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilter(tab.id)}
            className={`rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all ${
              filter === tab.id
                ? "bg-stellar-primary text-white"
                : "text-gray-400 hover:text-white"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Transactions List */}
      <div className="space-y-4">
        {filteredTxs.length === 0 ? (
          <div className="rounded-2xl border border-stellar-border bg-[#131620] p-12 text-center space-y-3">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-stellar-card text-gray-500 border border-stellar-border">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <p className="text-sm font-semibold text-gray-300">No transactions in this view</p>
            <p className="text-xs text-gray-500 max-w-sm mx-auto">
              Execute actions in any syndicate or click "Simulate Transaction" above to test the lifecycle pipeline.
            </p>
          </div>
        ) : (
          filteredTxs.map((tx) => {
            const isPending = tx.status === "signing" || tx.status === "submitting";
            const isSuccess = tx.status === "confirmed";
            const isFailed = tx.status === "failed";

            return (
              <div
                key={tx.id}
                className="rounded-2xl border border-stellar-border bg-[#131620] p-6 space-y-4 hover:border-stellar-border/80 transition-all shadow-lg"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h3 className="text-base font-bold text-white">{tx.title}</h3>
                    <p className="text-xs text-gray-400 mt-0.5">{tx.description}</p>
                  </div>

                  <span
                    className={`inline-flex items-center gap-1.5 self-start sm:self-auto rounded-full px-3 py-1 text-xs font-semibold ${
                      isSuccess
                        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                        : isFailed
                        ? "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                        : "bg-amber-500/10 text-amber-400 border border-amber-500/20 animate-pulse"
                    }`}
                  >
                    {isPending && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                    {isSuccess && <CheckCircle2 className="h-3.5 w-3.5" />}
                    {isFailed && <AlertCircle className="h-3.5 w-3.5" />}
                    <span className="capitalize">{tx.status}</span>
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 border-t border-stellar-border/60 pt-3 text-xs">
                  <div>
                    <span className="text-gray-500">Method: </span>
                    <span className="font-mono font-semibold text-gray-300">
                      {tx.method || "contract_call"}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500">Timestamp: </span>
                    <span className="text-gray-300 font-mono">
                      {new Date(tx.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  <div className="text-left sm:text-right">
                    {tx.hash ? (
                      <a
                        href={tx.explorerUrl || `https://stellar.expert/explorer/testnet/tx/${tx.hash}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 font-mono text-stellar-primary hover:underline"
                      >
                        <span>{tx.hash.slice(0, 10)}...{tx.hash.slice(-8)}</span>
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    ) : (
                      <span className="text-gray-500">Awaiting Hash...</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
