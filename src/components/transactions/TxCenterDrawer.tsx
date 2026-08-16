"use client";

import React from "react";
import { useTxStore } from "@/state/txStore";
import {
  X,
  History,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ExternalLink,
  Trash2,
  ShieldCheck,
  RefreshCw,
} from "lucide-react";

export function TxCenterDrawer() {
  const { transactions, isOpen, setOpen, clearHistory } = useTxStore();

  if (!isOpen) return null;

  const formatTime = (ts: number) => {
    const diff = Math.floor((Date.now() - ts) / 1000);
    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    return `${Math.floor(diff / 3600)}h ago`;
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div className="absolute inset-y-0 right-0 flex max-w-full pl-10">
        <div className="w-screen max-w-md border-l border-stellar-border bg-[#11141D] text-white shadow-2xl flex flex-col">
          {/* Drawer Header */}
          <div className="flex items-center justify-between border-b border-stellar-border p-4 sm:p-6 bg-[#0E1017]">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-stellar-primary/10 text-stellar-primary border border-stellar-primary/20">
                <History className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-white">Transaction Center</h2>
                <p className="text-xs text-gray-400">Live Soroban execution monitor</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {transactions.length > 0 && (
                <button
                  onClick={clearHistory}
                  title="Clear history"
                  className="rounded-lg p-1.5 text-gray-400 hover:bg-stellar-card hover:text-rose-400 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
              <button
                onClick={() => setOpen(false)}
                className="rounded-lg p-1.5 text-gray-400 hover:bg-stellar-card hover:text-white transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Transactions List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3.5">
            {transactions.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-stellar-card text-gray-500 mb-3 border border-stellar-border">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <p className="text-sm font-semibold text-gray-300">No transactions recorded</p>
                <p className="text-xs text-gray-500 max-w-xs mt-1">
                  Actions you perform like depositing, approving milestones, or claiming payouts will appear here in real time.
                </p>
              </div>
            ) : (
              transactions.map((tx) => {
                const isPending = tx.status === "signing" || tx.status === "submitting";
                const isSuccess = tx.status === "confirmed";
                const isFailed = tx.status === "failed";

                return (
                  <div
                    key={tx.id}
                    className="rounded-xl border border-stellar-border bg-[#161922] p-4 space-y-3 transition-all hover:border-stellar-border/80"
                  >
                    {/* Top Row: Title & Status */}
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h4 className="text-sm font-bold text-white">{tx.title}</h4>
                        <p className="text-xs text-gray-400 mt-0.5">{tx.description}</p>
                      </div>

                      {/* Status Badge */}
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                          isSuccess
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                            : isFailed
                            ? "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                            : "bg-amber-500/10 text-amber-400 border border-amber-500/20 animate-pulse"
                        }`}
                      >
                        {isPending && <Loader2 className="h-3 w-3 animate-spin" />}
                        {isSuccess && <CheckCircle2 className="h-3 w-3" />}
                        {isFailed && <AlertCircle className="h-3 w-3" />}
                        <span className="capitalize">{tx.status}</span>
                      </span>
                    </div>

                    {/* Meta Row: Hash & Timestamp */}
                    <div className="border-t border-stellar-border/60 pt-2.5 flex items-center justify-between text-[11px] text-gray-400">
                      <span>{formatTime(tx.timestamp)}</span>

                      {tx.hash && (
                        <a
                          href={tx.explorerUrl || `https://stellar.expert/explorer/testnet/tx/${tx.hash}`}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-1 font-mono text-stellar-primary hover:underline"
                        >
                          <span>{tx.hash.slice(0, 6)}...{tx.hash.slice(-6)}</span>
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      )}
                    </div>

                    {/* Error info */}
                    {tx.errorMessage && (
                      <div className="rounded-lg bg-rose-500/10 border border-rose-500/20 p-2 text-xs text-rose-300">
                        {tx.errorMessage}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>

          {/* Footer Info */}
          <div className="border-t border-stellar-border p-4 bg-[#0E1017] text-center text-xs text-gray-400">
            <span>Stellar Horizon Testnet WebSocket Streaming Active</span>
          </div>
        </div>
      </div>
    </div>
  );
}
