"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useSyndicates } from "@/hooks/useSyndicates";
import { useWalletStore } from "@/state/walletStore";
import { DepositModal } from "@/components/syndicate/DepositModal";
import { Syndicate } from "@/types";
import {
  Layers,
  Coins,
  TrendingUp,
  ShieldCheck,
  Search,
  Filter,
  ArrowUpRight,
  Clock,
  Sparkles,
  Users,
  CheckCircle2,
} from "lucide-react";

export default function DashboardPage() {
  const { data: syndicates, isLoading } = useSyndicates();
  const { isConnected, address, usdcBalance } = useWalletStore();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedSyndicateForDeposit, setSelectedSyndicateForDeposit] = useState<Syndicate | null>(null);

  const filteredSyndicates = syndicates?.filter((s) => {
    const matchesSearch = s.name.toLowerCase().includes(search.toLowerCase()) || s.tagline.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || s.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Syndicate Dashboard</h1>
          <p className="text-xs sm:text-sm text-gray-400">
            Monitor pooled venture allocations, milestone release statuses, and claimable exits
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/activity"
            className="flex items-center gap-1.5 rounded-xl border border-stellar-border bg-stellar-card px-3.5 py-2 text-xs font-semibold text-gray-300 hover:border-stellar-primary/50 transition-colors"
          >
            <span>Live Feed</span>
          </Link>
          <Link
            href="/analytics"
            className="flex items-center gap-1.5 rounded-xl bg-stellar-primary px-3.5 py-2 text-xs font-bold text-white hover:brightness-110 shadow-lg shadow-stellar-primary/20 transition-all"
          >
            <span>IRR Analytics</span>
          </Link>
        </div>
      </div>

      {/* Portfolio Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-stellar-border bg-[#131620] p-5">
          <div className="flex items-center justify-between text-xs text-gray-400">
            <span>Committed Principal</span>
            <Coins className="h-4 w-4 text-stellar-primary" />
          </div>
          <p className="mt-2 font-mono text-2xl font-bold text-white">
            {isConnected ? "$150,000.00" : "$0.00"}
          </p>
          <p className="text-[11px] text-gray-500 mt-1">Across 2 active syndicates</p>
        </div>

        <div className="rounded-2xl border border-stellar-border bg-[#131620] p-5">
          <div className="flex items-center justify-between text-xs text-gray-400">
            <span>LP Share Tokens Minted</span>
            <Layers className="h-4 w-4 text-blue-400" />
          </div>
          <p className="mt-2 font-mono text-2xl font-bold text-white">
            {isConnected ? "150,000 SYND" : "0 SYND"}
          </p>
          <p className="text-[11px] text-emerald-400 mt-1">1:1 Backed by Vault Escrow</p>
        </div>

        <div className="rounded-2xl border border-stellar-border bg-[#131620] p-5">
          <div className="flex items-center justify-between text-xs text-gray-400">
            <span>Est. Portfolio MOIC</span>
            <TrendingUp className="h-4 w-4 text-emerald-400" />
          </div>
          <p className="mt-2 font-mono text-2xl font-bold text-emerald-400">3.8x</p>
          <p className="text-[11px] text-gray-500 mt-1">Blended target exit multiple</p>
        </div>

        <div className="rounded-2xl border border-stellar-border bg-[#131620] p-5">
          <div className="flex items-center justify-between text-xs text-gray-400">
            <span>Claimable Payout Pool</span>
            <ShieldCheck className="h-4 w-4 text-amber-400" />
          </div>
          <p className="mt-2 font-mono text-2xl font-bold text-amber-400">
            {isConnected ? "$720,000.00" : "$0.00"}
          </p>
          <p className="text-[11px] text-gray-500 mt-1">From QuantumCipher Exit</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#11141D] p-3 rounded-2xl border border-stellar-border">
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search deals by name or sector..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-stellar-border bg-[#0E1017] pl-10 pr-4 py-2 text-xs text-white placeholder-gray-500 focus:border-stellar-primary focus:outline-none"
          />
        </div>

        {/* Status Pills */}
        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          {["all", "Fundraising", "MilestonePhase", "Liquidated"].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold whitespace-nowrap transition-all ${
                statusFilter === status
                  ? "bg-stellar-primary text-white"
                  : "bg-stellar-card text-gray-400 hover:text-white"
              }`}
            >
              {status === "all" ? "All Deals" : status}
            </button>
          ))}
        </div>
      </div>

      {/* Syndicates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSyndicates?.map((syndicate) => {
          const progress = (syndicate.totalRaised / syndicate.targetCap) * 100;
          const isFundraising = syndicate.status === "Fundraising";
          const isMilestone = syndicate.status === "MilestonePhase";
          const isLiquidated = syndicate.status === "Liquidated";

          return (
            <div
              key={syndicate.id}
              className="flex flex-col justify-between rounded-2xl border border-stellar-border bg-[#131620] p-6 hover:border-stellar-primary/50 transition-all shadow-xl"
            >
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="text-3xl p-2 rounded-xl bg-[#0E1017] border border-stellar-border">
                      {syndicate.logo}
                    </div>
                    <div>
                      <h3 className="font-bold text-base text-white">{syndicate.name}</h3>
                      <span className="text-[11px] font-medium text-stellar-primary">
                        {syndicate.category}
                      </span>
                    </div>
                  </div>

                  <span
                    className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold border ${
                      isFundraising
                        ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                        : isMilestone
                        ? "bg-blue-500/10 text-blue-400 border-blue-500/20"
                        : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                    }`}
                  >
                    {syndicate.status}
                  </span>
                </div>

                <p className="text-xs text-gray-400 leading-relaxed">{syndicate.tagline}</p>

                {/* Progress */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-gray-400">Total Raised:</span>
                    <span className="font-bold text-white">
                      ${syndicate.totalRaised.toLocaleString()} / ${syndicate.targetCap.toLocaleString()}
                    </span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-stellar-border overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-stellar-primary to-amber-500 rounded-full"
                      style={{ width: `${Math.min(progress, 100)}%` }}
                    />
                  </div>
                </div>

                {/* Milestone preview */}
                <div className="rounded-xl border border-stellar-border bg-[#0E1017] p-3 text-xs space-y-1">
                  <div className="flex justify-between text-gray-400 font-medium">
                    <span>Milestones:</span>
                    <span className="text-white font-mono">
                      {syndicate.milestones.filter((m) => m.status === "Released").length} / {syndicate.milestones.length} Released
                    </span>
                  </div>
                  <div className="flex justify-between text-gray-400 font-medium">
                    <span>Lead Carry:</span>
                    <span className="text-stellar-primary font-mono">{syndicate.carryBps / 100}%</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 pt-4 border-t border-stellar-border flex items-center justify-between gap-3">
                <Link
                  href={`/syndicates/${syndicate.id}`}
                  className="flex-1 text-center rounded-xl border border-stellar-border bg-stellar-card py-2 text-xs font-bold text-gray-300 hover:border-stellar-primary/50 hover:text-white transition-all"
                >
                  View Details
                </Link>

                {isFundraising && (
                  <button
                    onClick={() => setSelectedSyndicateForDeposit(syndicate)}
                    className="flex-1 rounded-xl bg-gradient-to-r from-stellar-primary to-amber-600 py-2 text-xs font-bold text-white hover:brightness-110 transition-all shadow-md shadow-stellar-primary/20"
                  >
                    Commit Capital
                  </button>
                )}

                {isLiquidated && (
                  <Link
                    href={`/syndicates/${syndicate.id}`}
                    className="flex-1 text-center rounded-xl bg-emerald-600 py-2 text-xs font-bold text-white hover:bg-emerald-500 transition-all"
                  >
                    Claim Payout
                  </Link>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Deposit Modal */}
      {selectedSyndicateForDeposit && (
        <DepositModal
          syndicate={selectedSyndicateForDeposit}
          isOpen={!!selectedSyndicateForDeposit}
          onClose={() => setSelectedSyndicateForDeposit(null)}
        />
      )}
    </div>
  );
}
