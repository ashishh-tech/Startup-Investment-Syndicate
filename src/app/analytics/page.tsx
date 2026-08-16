"use client";

import React from "react";
import { useSyndicates } from "@/hooks/useSyndicates";
import {
  BarChart3,
  TrendingUp,
  Coins,
  Layers,
  PieChart,
  ShieldCheck,
  Zap,
  ArrowUpRight,
  Cpu,
} from "lucide-react";

export default function AnalyticsPage() {
  const { data: syndicates } = useSyndicates();

  const totalCap = syndicates?.reduce((acc, s) => acc + s.targetCap, 0) || 4500000;
  const totalRaised = syndicates?.reduce((acc, s) => acc + s.totalRaised, 0) || 3850000;
  const totalDisbursed = syndicates?.reduce((acc, s) => acc + s.totalDisbursed, 0) || 2250000;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-3">
          <span>Protocol Analytics</span>
          <span className="rounded-full bg-amber-500/10 border border-amber-500/20 px-3 py-1 text-xs font-semibold text-stellar-primary">
            Real-Time Metrics
          </span>
        </h1>
        <p className="text-xs sm:text-sm text-gray-400 mt-1">
          Deep liquidity overview, milestone escrow velocity, and waterfall return distributions
        </p>
      </div>

      {/* Top Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="rounded-2xl border border-stellar-border bg-[#131620] p-6 space-y-2">
          <div className="flex items-center justify-between text-xs text-gray-400">
            <span>Total Value Locked (TVL)</span>
            <Coins className="h-4 w-4 text-stellar-primary" />
          </div>
          <p className="font-mono text-3xl font-extrabold text-white">
            ${(totalRaised / 1000000).toFixed(2)}M USDC
          </p>
          <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium pt-1">
            <TrendingUp className="h-3.5 w-3.5" />
            <span>85.5% of $4.5M Aggregate Capacity</span>
          </div>
        </div>

        <div className="rounded-2xl border border-stellar-border bg-[#131620] p-6 space-y-2">
          <div className="flex items-center justify-between text-xs text-gray-400">
            <span>Disbursed Tranches</span>
            <ShieldCheck className="h-4 w-4 text-blue-400" />
          </div>
          <p className="font-mono text-3xl font-extrabold text-white">
            ${(totalDisbursed / 1000000).toFixed(2)}M USDC
          </p>
          <div className="flex items-center gap-1.5 text-xs text-blue-400 font-medium pt-1">
            <span>58.4% of Capital Released to Startups</span>
          </div>
        </div>

        <div className="rounded-2xl border border-stellar-border bg-[#131620] p-6 space-y-2">
          <div className="flex items-center justify-between text-xs text-gray-400">
            <span>Total Exited Liquidity</span>
            <Zap className="h-4 w-4 text-emerald-400" />
          </div>
          <p className="font-mono text-3xl font-extrabold text-emerald-400">
            $6.60M USDC
          </p>
          <div className="flex items-center gap-1.5 text-xs text-gray-400 font-medium pt-1">
            <span>3.3x Realized Exit via QuantumCipher</span>
          </div>
        </div>
      </div>

      {/* Waterfall Model Comparison Section */}
      <div className="rounded-2xl border border-stellar-border bg-[#131620] p-6 sm:p-8 space-y-6">
        <div>
          <h3 className="text-lg font-bold text-white">Waterfall Payout Distribution Mechanics</h3>
          <p className="text-xs text-gray-400 mt-0.5">
            How proceeds are partitioned across LP Principal, Lead Carry, and LP Profit Split at various exit multiples
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { multiple: "1.0x (Break-Even)", proceeds: "$1.0M", lp: "$1.0M (100%)", carry: "$0 (0%)", netMoic: "1.00x" },
            { multiple: "2.0x (2x Exit)", proceeds: "$2.0M", lp: "$1.8M (90%)", carry: "$200k (10%)", netMoic: "1.80x" },
            { multiple: "3.0x (3x Base)", proceeds: "$3.0M", lp: "$2.6M (86.7%)", carry: "$400k (13.3%)", netMoic: "2.60x" },
            { multiple: "5.0x (Bull Case)", proceeds: "$5.0M", lp: "$4.2M (84%)", carry: "$800k (16%)", netMoic: "4.20x" },
          ].map((item, idx) => (
            <div key={idx} className="rounded-xl border border-stellar-border bg-[#0E1017] p-4 space-y-2 text-xs">
              <div className="flex justify-between items-center pb-2 border-b border-stellar-border">
                <span className="font-bold text-stellar-primary">{item.multiple}</span>
                <span className="font-mono text-white font-bold">{item.proceeds}</span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>LP Total Payout:</span>
                <span className="font-mono text-emerald-400 font-semibold">{item.lp}</span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>Lead 20% Carry:</span>
                <span className="font-mono text-amber-400 font-semibold">{item.carry}</span>
              </div>
              <div className="flex justify-between text-gray-400 pt-1 border-t border-stellar-border/40">
                <span>Net LP MOIC:</span>
                <span className="font-mono text-white font-bold">{item.netMoic}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Sector Allocation Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-stellar-border bg-[#131620] p-6 space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <PieChart className="h-4 w-4 text-stellar-primary" />
            <span>Capital Allocation by Sector</span>
          </h3>

          <div className="space-y-3 pt-2 text-xs">
            <div>
              <div className="flex justify-between text-gray-300 font-medium mb-1">
                <span>DeepTech & Robotics (Aetheria)</span>
                <span className="font-mono text-white">$1,000,000 (22.2%)</span>
              </div>
              <div className="h-2 rounded-full bg-stellar-border overflow-hidden">
                <div className="h-full bg-stellar-primary w-[22%]" />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-gray-300 font-medium mb-1">
                <span>HealthTech & Neural Telemetry (NeuroPulse)</span>
                <span className="font-mono text-white">$1,500,000 (33.3%)</span>
              </div>
              <div className="h-2 rounded-full bg-stellar-border overflow-hidden">
                <div className="h-full bg-blue-500 w-[33%]" />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-gray-300 font-medium mb-1">
                <span>Post-Quantum Cryptography (QuantumCipher)</span>
                <span className="font-mono text-white">$2,000,000 (44.5%)</span>
              </div>
              <div className="h-2 rounded-full bg-stellar-border overflow-hidden">
                <div className="h-full bg-emerald-500 w-[45%]" />
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-stellar-border bg-[#131620] p-6 space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Cpu className="h-4 w-4 text-amber-400" />
            <span>Soroban Network Metrics</span>
          </h3>

          <div className="space-y-3 pt-2 text-xs">
            <div className="flex justify-between items-center bg-[#0E1017] p-3 rounded-xl border border-stellar-border">
              <span className="text-gray-400">Average Transaction Fee</span>
              <span className="font-mono font-bold text-emerald-400">0.00001 XLM (&lt;$0.0001)</span>
            </div>
            <div className="flex justify-between items-center bg-[#0E1017] p-3 rounded-xl border border-stellar-border">
              <span className="text-gray-400">Ledger Close Finality</span>
              <span className="font-mono font-bold text-white">~3.5 seconds</span>
            </div>
            <div className="flex justify-between items-center bg-[#0E1017] p-3 rounded-xl border border-stellar-border">
              <span className="text-gray-400">Cross-Contract Gas Overhead</span>
              <span className="font-mono font-bold text-blue-400">Optimized Instance TTL</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
