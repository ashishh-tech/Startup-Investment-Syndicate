"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useSyndicates } from "@/hooks/useSyndicates";
import { useWalletStore } from "@/state/walletStore";
import { WalletModal } from "@/components/layout/WalletModal";
import {
  Flame,
  ShieldCheck,
  Zap,
  TrendingUp,
  Lock,
  Layers,
  ArrowRight,
  Sparkles,
  Users,
  Coins,
  Cpu,
  BarChart3,
  ExternalLink,
  ChevronRight,
} from "lucide-react";

export default function LandingPage() {
  const { data: syndicates, isLoading } = useSyndicates();
  const { isConnected } = useWalletStore();
  const [isWalletOpen, setIsWalletOpen] = useState(false);

  const totalRaised = syndicates?.reduce((acc, s) => acc + s.totalRaised, 0) || 3850000;
  const totalCap = syndicates?.reduce((acc, s) => acc + s.targetCap, 0) || 4500000;
  const totalInvestors = syndicates?.reduce((acc, s) => acc + s.investorsCount, 0) || 55;

  return (
    <div className="relative overflow-hidden">
      {/* Background Decorative Gradients */}
      <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-gradient-to-b from-stellar-primary/20 via-amber-600/10 to-transparent blur-3xl opacity-70" />

      {/* Hero Section */}
      <section className="relative pt-20 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-1.5 text-xs font-semibold text-stellar-primary mb-8 animate-pulse">
          <Sparkles className="h-3.5 w-3.5" />
          <span>Stellar Soroban Level 3 (Orange Belt) Showcase</span>
        </div>

        {/* Headline */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white max-w-5xl mx-auto leading-tight sm:leading-none">
          Decentralized Venture Syndicates on <span className="bg-gradient-to-r from-stellar-primary via-amber-400 to-amber-500 bg-clip-text text-transparent">Stellar</span>
        </h1>

        {/* Subhead */}
        <p className="mt-6 text-base sm:text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
          Pool capital from accredited angels, mint proportional Soroban LP share tokens, and protect investments with milestone-based tranche escrow & automated VC waterfall payouts.
        </p>

        {/* Hero CTA buttons */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-stellar-primary to-amber-600 px-6 py-3.5 text-sm font-bold text-white shadow-xl shadow-stellar-primary/25 hover:brightness-110 active:scale-95 transition-all"
          >
            <span>Explore Active Syndicates</span>
            <ArrowRight className="h-4 w-4" />
          </Link>

          {!isConnected ? (
            <button
              onClick={() => setIsWalletOpen(true)}
              className="flex items-center gap-2 rounded-xl border border-stellar-border bg-stellar-card/80 px-6 py-3.5 text-sm font-bold text-gray-200 hover:border-stellar-primary/50 hover:bg-stellar-card transition-all"
            >
              <Coins className="h-4 w-4 text-stellar-primary" />
              <span>Connect Wallet</span>
            </button>
          ) : (
            <Link
              href="/activity"
              className="flex items-center gap-2 rounded-xl border border-stellar-border bg-stellar-card/80 px-6 py-3.5 text-sm font-bold text-gray-200 hover:border-stellar-primary/50 hover:bg-stellar-card transition-all"
            >
              <Zap className="h-4 w-4 text-amber-400" />
              <span>Live Blockchain Activity</span>
            </Link>
          )}
        </div>

        {/* Platform Stat Bar */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
          <div className="rounded-2xl border border-stellar-border bg-[#131620]/80 p-4 backdrop-blur-sm">
            <p className="text-xs text-gray-400 font-medium">Total Capital Pooled</p>
            <p className="mt-1 font-mono text-xl sm:text-2xl font-bold text-white">
              ${(totalRaised / 1000000).toFixed(2)}M USDC
            </p>
          </div>
          <div className="rounded-2xl border border-stellar-border bg-[#131620]/80 p-4 backdrop-blur-sm">
            <p className="text-xs text-gray-400 font-medium">Target Capacity</p>
            <p className="mt-1 font-mono text-xl sm:text-2xl font-bold text-stellar-primary">
              ${(totalCap / 1000000).toFixed(2)}M USDC
            </p>
          </div>
          <div className="rounded-2xl border border-stellar-border bg-[#131620]/80 p-4 backdrop-blur-sm">
            <p className="text-xs text-gray-400 font-medium">Participating LPs</p>
            <p className="mt-1 font-mono text-xl sm:text-2xl font-bold text-white">
              {totalInvestors} Angels
            </p>
          </div>
          <div className="rounded-2xl border border-stellar-border bg-[#131620]/80 p-4 backdrop-blur-sm">
            <p className="text-xs text-gray-400 font-medium">Settlement Speed</p>
            <p className="mt-1 font-mono text-xl sm:text-2xl font-bold text-emerald-400">
              ~3.5s Finality
            </p>
          </div>
        </div>
      </section>

      {/* Feature Highlights Grid */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            Engineered for Modern Venture Capital
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-gray-400">
            Powered by dual-contract Soroban smart architecture with atomic cross-contract calls.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="rounded-2xl border border-stellar-border bg-[#131620] p-6 space-y-4 hover:border-stellar-primary/50 transition-all group">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/10 text-stellar-primary border border-amber-500/20 group-hover:scale-110 transition-transform">
              <Lock className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Milestone Tranche Escrow</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Capital is not handed over in one lump sum. Funds stay locked in the Soroban Vault and are released in verified tranches upon audit approval.
            </p>
          </div>

          {/* Card 2 */}
          <div className="rounded-2xl border border-stellar-border bg-[#131620] p-6 space-y-4 hover:border-stellar-primary/50 transition-all group">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20 group-hover:scale-110 transition-transform">
              <TrendingUp className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Smart Waterfall Payouts</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Automated multi-tier distribution: 100% Principal Payback to LPs &rarr; 20% Syndicate Lead Carry &rarr; 80% Pro-Rata LP Profit Split.
            </p>
          </div>

          {/* Card 3 */}
          <div className="rounded-2xl border border-stellar-border bg-[#131620] p-6 space-y-4 hover:border-stellar-primary/50 transition-all group">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 group-hover:scale-110 transition-transform">
              <Cpu className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Dual-Contract Inter-Op</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              <code className="text-stellar-primary font-mono text-[11px]">SyndicateVault</code> executes real-time cross-contract invocations to <code className="text-stellar-primary font-mono text-[11px]">WaterfallDistributor</code> during exit events.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Deals Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-stellar-border/50">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-extrabold text-white">Active Investment Syndicates</h2>
            <p className="text-xs text-gray-400">Join top-tier deeptech and medical startups pooled on Stellar</p>
          </div>
          <Link
            href="/dashboard"
            className="flex items-center gap-1.5 text-xs font-bold text-stellar-primary hover:underline"
          >
            <span>View All Deals</span>
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {syndicates?.map((s) => {
            const progress = (s.totalRaised / s.targetCap) * 100;
            return (
              <div
                key={s.id}
                className="flex flex-col justify-between rounded-2xl border border-stellar-border bg-[#131620] p-5 hover:border-stellar-primary/50 transition-all shadow-lg"
              >
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="text-3xl p-2 rounded-xl bg-[#0E1017] border border-stellar-border">
                        {s.logo}
                      </div>
                      <div>
                        <h3 className="font-bold text-base text-white">{s.name}</h3>
                        <span className="text-[11px] font-medium text-stellar-primary">
                          {s.category}
                        </span>
                      </div>
                    </div>

                    <span className="rounded-full bg-amber-500/10 px-2.5 py-0.5 text-[10px] font-bold text-amber-400 border border-amber-500/20">
                      {s.status}
                    </span>
                  </div>

                  <p className="text-xs text-gray-400 line-clamp-2">{s.tagline}</p>

                  {/* Progress Bar */}
                  <div className="space-y-1.5 pt-2">
                    <div className="flex justify-between text-xs font-mono">
                      <span className="text-gray-400">Raised:</span>
                      <span className="font-bold text-white">
                        ${s.totalRaised.toLocaleString()} / ${s.targetCap.toLocaleString()}
                      </span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-stellar-border overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-stellar-primary to-amber-500 rounded-full"
                        style={{ width: `${Math.min(progress, 100)}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-stellar-border flex items-center justify-between">
                  <div className="text-xs">
                    <span className="text-gray-500">Min Ticket: </span>
                    <span className="font-mono font-bold text-gray-200">
                      ${s.minTicket.toLocaleString()}
                    </span>
                  </div>

                  <Link
                    href={`/syndicates/${s.id}`}
                    className="flex items-center gap-1.5 rounded-lg bg-stellar-primary/10 border border-stellar-primary/30 px-3 py-1.5 text-xs font-bold text-stellar-primary hover:bg-stellar-primary hover:text-white transition-all"
                  >
                    <span>Deal Room</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Wallet Modal */}
      <WalletModal isOpen={isWalletOpen} onClose={() => setIsWalletOpen(false)} />
    </div>
  );
}
