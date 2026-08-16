"use client";

import React, { useState } from "react";
import { useEventStore } from "@/state/eventStore";
import {
  Activity,
  Zap,
  Coins,
  ShieldCheck,
  Send,
  TrendingUp,
  ExternalLink,
  Filter,
  CheckCircle2,
  Clock,
  Radio,
} from "lucide-react";

export default function ActivityPage() {
  const { events, filterType, setFilterType, isStreaming, setStreaming } = useEventStore();

  const filteredEvents = events.filter((e) => {
    if (filterType === "all") return true;
    if (filterType === "deposits") return e.type === "deposit";
    if (filterType === "milestones") return e.type.startsWith("milestone") || e.type === "tranche_released";
    if (filterType === "exits") return e.type === "exit_triggered" || e.type === "payout_claimed";
    return true;
  });

  const formatTime = (ts: number) => {
    const diff = Math.floor((Date.now() - ts) / 1000);
    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    return `${Math.floor(diff / 3600)}h ago`;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header & Live Stream Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-3">
            <span>Live Activity Feed</span>
            <span className="flex items-center gap-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 text-xs font-semibold text-emerald-400">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
              Real-Time Horizon Events
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 mt-1">
            Real-time event logging from Soroban smart contracts across active syndicate vaults
          </p>
        </div>

        {/* Filter Controls */}
        <div className="flex items-center gap-2 bg-[#11141D] p-1.5 rounded-xl border border-stellar-border">
          {[
            { id: "all", label: "All Events" },
            { id: "deposits", label: "Deposits" },
            { id: "milestones", label: "Milestones" },
            { id: "exits", label: "Exits & Waterfall" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterType(tab.id)}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                filterType === tab.id
                  ? "bg-stellar-primary text-white shadow-sm"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Events Timeline List */}
      <div className="space-y-3.5">
        {filteredEvents.map((evt) => {
          const isDeposit = evt.type === "deposit";
          const isMilestone = evt.type.startsWith("milestone") || evt.type === "tranche_released";
          const isExit = evt.type === "exit_triggered" || evt.type === "payout_claimed";

          return (
            <div
              key={evt.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-stellar-border bg-[#131620] p-5 hover:border-stellar-primary/40 transition-all shadow-md"
            >
              <div className="flex items-start gap-4">
                {/* Event Type Icon */}
                <div
                  className={`mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border ${
                    isDeposit
                      ? "bg-amber-500/10 text-stellar-primary border-amber-500/20"
                      : isMilestone
                      ? "bg-blue-500/10 text-blue-400 border-blue-500/20"
                      : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                  }`}
                >
                  {isDeposit && <Coins className="h-5 w-5" />}
                  {isMilestone && <ShieldCheck className="h-5 w-5" />}
                  {isExit && <TrendingUp className="h-5 w-5" />}
                </div>

                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-bold text-white">{evt.syndicateName}</span>
                    <span className="rounded bg-stellar-border px-1.5 py-0.5 text-[10px] font-mono text-gray-300">
                      {evt.actorLabel || `${evt.actor.slice(0, 4)}...${evt.actor.slice(-4)}`}
                    </span>
                    <span className="text-[11px] text-gray-500">• {formatTime(evt.timestamp)}</span>
                  </div>
                  <p className="text-xs text-gray-300">{evt.details}</p>
                </div>
              </div>

              {/* Amount & Tx Hash */}
              <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center border-t sm:border-t-0 border-stellar-border pt-2 sm:pt-0 shrink-0">
                {evt.amount && (
                  <p className="font-mono text-sm font-bold text-white">
                    ${evt.amount.toLocaleString()} {evt.assetSymbol || "USDC"}
                  </p>
                )}
                <a
                  href={`https://stellar.expert/explorer/testnet/tx/${evt.txHash}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 font-mono text-[11px] text-stellar-primary hover:underline"
                >
                  <span>{evt.txHash.slice(0, 6)}...{evt.txHash.slice(-4)}</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
