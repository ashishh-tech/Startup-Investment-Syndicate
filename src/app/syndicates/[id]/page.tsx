"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useSyndicate } from "@/hooks/useSyndicates";
import { useWalletStore } from "@/state/walletStore";
import { SyndicateService } from "@/services/syndicateService";
import { WaterfallCalculator } from "@/components/syndicate/WaterfallCalculator";
import { MilestoneManager } from "@/components/syndicate/MilestoneManager";
import { DepositModal } from "@/components/syndicate/DepositModal";
import {
  ArrowLeft,
  Coins,
  ShieldCheck,
  Cpu,
  TrendingUp,
  ExternalLink,
  Users,
  Clock,
  Sparkles,
  Zap,
  Building,
  CheckCircle2,
  AlertTriangle,
  Play,
} from "lucide-react";

export default function SyndicateDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = typeof params.id === "string" ? params.id : "syn-01";
  const { data: syndicate, isLoading } = useSyndicate(id);
  const { isConnected, address } = useWalletStore();
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
  const [isSimulatingExit, setIsSimulatingExit] = useState(false);

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-stellar-primary border-t-transparent" />
          <p className="text-xs text-gray-400">Loading Soroban Syndicate Vault...</p>
        </div>
      </div>
    );
  }

  if (!syndicate) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-xl font-bold text-white">Syndicate Not Found</h2>
        <Link href="/dashboard" className="text-xs font-bold text-stellar-primary hover:underline">
          Return to Dashboard
        </Link>
      </div>
    );
  }

  const progress = (syndicate.totalRaised / syndicate.targetCap) * 100;
  const isFundraising = syndicate.status === "Fundraising";

  const handleSimulateExit = async () => {
    if (!address) return;
    setIsSimulatingExit(true);
    try {
      await SyndicateService.triggerExit(syndicate.id, address, syndicate.targetCap * 3.3);
      router.refresh();
    } finally {
      setIsSimulatingExit(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Back Button */}
      <div>
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-xs font-semibold text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to All Syndicates</span>
        </Link>
      </div>

      {/* Main Deal Header Card */}
      <div className="rounded-3xl border border-stellar-border bg-[#131620] p-6 sm:p-8 space-y-6 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="text-4xl p-3.5 rounded-2xl bg-[#0E1017] border border-stellar-border shadow-inner">
              {syndicate.logo}
            </div>
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white">{syndicate.name}</h1>
                <span className="rounded-full bg-amber-500/10 px-3 py-0.5 text-xs font-bold text-amber-400 border border-amber-500/20">
                  {syndicate.status}
                </span>
                <span className="rounded-full bg-stellar-card px-2.5 py-0.5 text-[11px] font-medium text-gray-300 border border-stellar-border">
                  {syndicate.category}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-gray-400 max-w-2xl">{syndicate.tagline}</p>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-3">
            {isFundraising && (
              <button
                onClick={() => setIsDepositModalOpen(true)}
                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-stellar-primary to-amber-600 px-6 py-3 text-sm font-bold text-white shadow-xl shadow-stellar-primary/25 hover:brightness-110 active:scale-95 transition-all"
              >
                <Coins className="h-4 w-4" />
                <span>Join Syndicate</span>
              </button>
            )}

            {syndicate.status !== "Liquidated" && (
              <button
                onClick={handleSimulateExit}
                disabled={isSimulatingExit}
                title="Simulate Acquisition Exit via cross-contract call"
                className="flex items-center gap-2 rounded-xl border border-stellar-border bg-[#0E1017] px-4 py-3 text-xs font-bold text-gray-300 hover:border-amber-500/50 hover:text-white transition-all disabled:opacity-50"
              >
                <Play className="h-3.5 w-3.5 text-amber-400" />
                <span>{isSimulatingExit ? "Simulating Exit..." : "Simulate 3.3x Exit"}</span>
              </button>
            )}
          </div>
        </div>

        {/* Funding Progress Bar */}
        <div className="rounded-2xl border border-stellar-border bg-[#0E1017] p-5 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-mono">
            <span className="text-gray-400">
              Raised: <strong className="text-white">${syndicate.totalRaised.toLocaleString()}</strong> of $
              {syndicate.targetCap.toLocaleString()} Target
            </span>
            <span className="text-stellar-primary font-bold">{progress.toFixed(1)}% Funded</span>
          </div>

          <div className="h-3 w-full rounded-full bg-stellar-border overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-stellar-primary via-amber-500 to-emerald-400 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2 text-xs">
            <div>
              <p className="text-gray-500">Min Ticket</p>
              <p className="font-mono font-bold text-white">${syndicate.minTicket.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-gray-500">Max Ticket</p>
              <p className="font-mono font-bold text-white">${syndicate.maxTicket.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-gray-500">Active LPs</p>
              <p className="font-mono font-bold text-white">{syndicate.investorsCount} Angels</p>
            </div>
            <div>
              <p className="text-gray-500">Lead Carry Fee</p>
              <p className="font-mono font-bold text-stellar-primary">{syndicate.carryBps / 100}%</p>
            </div>
          </div>
        </div>

        {/* Lead Profile & Smart Contract IDs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          {/* Lead info */}
          <div className="rounded-2xl border border-stellar-border bg-[#0E1017] p-5 space-y-3">
            <div className="flex items-center gap-3">
              <div className="text-2xl">{syndicate.leadAvatar}</div>
              <div>
                <p className="text-xs font-bold text-white">{syndicate.leadName}</p>
                <p className="text-[11px] text-gray-400">Syndicate Lead & Deal Sponsor</p>
              </div>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed">{syndicate.leadBio}</p>
          </div>

          {/* Contract Registry */}
          <div className="rounded-2xl border border-stellar-border bg-[#0E1017] p-5 space-y-2 text-xs">
            <p className="font-bold text-white flex items-center gap-1.5">
              <Cpu className="h-4 w-4 text-stellar-primary" />
              <span>Deployed Soroban Contracts</span>
            </p>

            <div className="space-y-1.5 font-mono text-[11px]">
              <div className="flex justify-between items-center bg-[#131620] p-2 rounded-lg border border-stellar-border">
                <span className="text-gray-400">Syndicate Vault:</span>
                <a
                  href={`https://stellar.expert/explorer/testnet/contract/${syndicate.vaultContract}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-stellar-primary hover:underline flex items-center gap-1"
                >
                  <span>{syndicate.vaultContract.slice(0, 6)}...{syndicate.vaultContract.slice(-4)}</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>

              <div className="flex justify-between items-center bg-[#131620] p-2 rounded-lg border border-stellar-border">
                <span className="text-gray-400">Waterfall Distributor:</span>
                <a
                  href={`https://stellar.expert/explorer/testnet/contract/${syndicate.distributorContract}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-amber-400 hover:underline flex items-center gap-1"
                >
                  <span>{syndicate.distributorContract.slice(0, 6)}...{syndicate.distributorContract.slice(-4)}</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Milestone Escrow Section */}
      <MilestoneManager syndicate={syndicate} />

      {/* Waterfall Return Calculator Simulator */}
      <WaterfallCalculator syndicate={syndicate} />

      {/* Deposit Modal */}
      <DepositModal
        syndicate={syndicate}
        isOpen={isDepositModalOpen}
        onClose={() => setIsDepositModalOpen(false)}
      />
    </div>
  );
}
