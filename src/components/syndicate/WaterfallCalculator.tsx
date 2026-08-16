"use client";

import React, { useState } from "react";
import { Syndicate } from "@/types";
import { WaterfallService } from "@/services/waterfallService";
import { Calculator, ArrowRight, ShieldCheck, DollarSign, Percent, TrendingUp, Sparkles } from "lucide-react";

interface WaterfallCalculatorProps {
  syndicate: Syndicate;
  userDeposit?: number;
}

export function WaterfallCalculator({ syndicate, userDeposit = 25000 }: WaterfallCalculatorProps) {
  const [exitProceeds, setExitProceeds] = useState<number>(syndicate.targetCap * 3);
  const [myTicket, setMyTicket] = useState<number>(userDeposit);

  const breakdown = WaterfallService.calculate(
    exitProceeds,
    syndicate.targetCap,
    syndicate.carryBps,
    3 // 3 years holding
  );

  const myShare = WaterfallService.calculateLpShare(
    myTicket,
    syndicate.targetCap,
    breakdown.totalLpPayout
  );

  return (
    <div className="rounded-2xl border border-stellar-border bg-[#131620] p-6 space-y-6 shadow-xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stellar-border pb-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-stellar-primary/10 text-stellar-primary border border-stellar-primary/20">
            <Calculator className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Smart Waterfall Return Simulator</h3>
            <p className="text-xs text-gray-400">
              Contract-verified distribution engine: Principal Payback &rarr; 20% Lead Carry &rarr; LP Profit Split
            </p>
          </div>
        </div>

        <span className="inline-flex items-center gap-1 self-start sm:self-auto rounded-full bg-emerald-500/10 px-2.5 py-1 text-[11px] font-semibold text-emerald-400 border border-emerald-500/20">
          <ShieldCheck className="h-3.5 w-3.5" />
          Soroban Verified Math
        </span>
      </div>

      {/* Sliders Area */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-[#0E1017] p-5 rounded-xl border border-stellar-border">
        {/* Exit Proceeds Slider */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-gray-300">Simulated Exit Proceeds</label>
            <span className="font-mono text-sm font-bold text-stellar-primary">
              ${exitProceeds.toLocaleString()} USDC
            </span>
          </div>
          <input
            type="range"
            min={syndicate.targetCap * 0.5}
            max={syndicate.targetCap * 8}
            step={50000}
            value={exitProceeds}
            onChange={(e) => setExitProceeds(Number(e.target.value))}
            className="w-full h-2 bg-stellar-border rounded-lg appearance-none cursor-pointer accent-stellar-primary"
          />
          <div className="flex justify-between text-[10px] text-gray-500 font-mono">
            <span>0.5x Downside (${(syndicate.targetCap * 0.5).toLocaleString()})</span>
            <span>3x Base</span>
            <span>8x Bull (${(syndicate.targetCap * 8).toLocaleString()})</span>
          </div>
        </div>

        {/* My Ticket Slider */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-gray-300">Your Investment Ticket</label>
            <span className="font-mono text-sm font-bold text-white">
              ${myTicket.toLocaleString()} USDC
            </span>
          </div>
          <input
            type="range"
            min={syndicate.minTicket}
            max={syndicate.maxTicket}
            step={5000}
            value={myTicket}
            onChange={(e) => setMyTicket(Number(e.target.value))}
            className="w-full h-2 bg-stellar-border rounded-lg appearance-none cursor-pointer accent-amber-500"
          />
          <div className="flex justify-between text-[10px] text-gray-500 font-mono">
            <span>Min: ${syndicate.minTicket.toLocaleString()}</span>
            <span>Max: ${syndicate.maxTicket.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Waterfall Tiered Flow Graphic */}
      <div className="space-y-3">
        <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
          Multi-Tier Waterfall Flow
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Tier 1 */}
          <div className="rounded-xl border border-blue-500/30 bg-blue-500/5 p-4 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-blue-400">TIER 1: LP PRINCIPAL</span>
              <span className="text-[10px] font-mono bg-blue-500/20 text-blue-300 px-1.5 py-0.5 rounded">
                100% Payback
              </span>
            </div>
            <p className="text-lg font-bold font-mono text-white">
              ${breakdown.principalRepaid.toLocaleString()}
            </p>
            <p className="text-[11px] text-gray-400">
              LPs receive 100% of capital back before carry kicks in.
            </p>
          </div>

          {/* Tier 2 */}
          <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-4 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-amber-400">TIER 2: LEAD CARRY</span>
              <span className="text-[10px] font-mono bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded">
                {syndicate.carryBps / 100}% Performance Fee
              </span>
            </div>
            <p className="text-lg font-bold font-mono text-white">
              ${breakdown.leadCarryAmount.toLocaleString()}
            </p>
            <p className="text-[11px] text-gray-400">
              Syndicate Lead earns {syndicate.carryBps / 100}% on net profits only.
            </p>
          </div>

          {/* Tier 3 */}
          <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-4 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-emerald-400">TIER 3: LP PROFIT SPLIT</span>
              <span className="text-[10px] font-mono bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded">
                80% Pro-Rata
              </span>
            </div>
            <p className="text-lg font-bold font-mono text-white">
              ${breakdown.lpProfitPool.toLocaleString()}
            </p>
            <p className="text-[11px] text-gray-400">
              Remaining profit pool shared pro-rata among token holders.
            </p>
          </div>
        </div>
      </div>

      {/* Investor Return Highlight Card */}
      <div className="rounded-xl border border-stellar-primary/40 bg-gradient-to-r from-stellar-primary/10 via-[#191D28] to-amber-600/10 p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-stellar-primary flex items-center gap-1.5">
              <TrendingUp className="h-4 w-4" />
              Your Estimated Return Outcome
            </span>
            <div className="flex items-baseline gap-3">
              <span className="text-2xl sm:text-3xl font-extrabold font-mono text-white">
                ${myShare.investorPayout.toLocaleString()} USDC
              </span>
              <span className="text-sm font-bold font-mono text-emerald-400">
                (+${myShare.investorNetProfit.toLocaleString()} Net Profit)
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4 sm:border-l sm:border-stellar-border sm:pl-6">
            <div>
              <p className="text-[11px] text-gray-400 font-medium">Net LP MOIC</p>
              <p className="text-lg font-bold font-mono text-white">{myShare.investorMoic}x</p>
            </div>
            <div>
              <p className="text-[11px] text-gray-400 font-medium">Est. Net IRR</p>
              <p className="text-lg font-bold font-mono text-emerald-400">
                {breakdown.lpIrrEstimate}% / yr
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
