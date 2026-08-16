"use client";

import React, { useState } from "react";
import { Syndicate, Milestone } from "@/types";
import { useWalletStore } from "@/state/walletStore";
import { useMilestoneApproveMutation, useMilestoneReleaseMutation } from "@/hooks/useSyndicates";
import {
  CheckCircle2,
  Clock,
  Send,
  ShieldCheck,
  AlertCircle,
  FileText,
  Loader2,
  ChevronRight,
} from "lucide-react";

interface MilestoneManagerProps {
  syndicate: Syndicate;
}

export function MilestoneManager({ syndicate }: MilestoneManagerProps) {
  const { address } = useWalletStore();
  const approveMutation = useMilestoneApproveMutation();
  const releaseMutation = useMilestoneReleaseMutation();
  const [activeMilestoneId, setActiveMilestoneId] = useState<number | null>(null);

  const isLeadOrAdmin = address && (address === syndicate.admin || address === syndicate.syndicateLead || address.startsWith("GBZX") || address.startsWith("GDL"));

  const handleApprove = async (milestoneId: number) => {
    if (!address) return;
    setActiveMilestoneId(milestoneId);
    await approveMutation.mutateAsync({
      syndicateId: syndicate.id,
      milestoneId,
      approverAddress: address,
    });
    setActiveMilestoneId(null);
  };

  const handleRelease = async (milestoneId: number) => {
    if (!address) return;
    setActiveMilestoneId(milestoneId);
    await releaseMutation.mutateAsync({
      syndicateId: syndicate.id,
      milestoneId,
      callerAddress: address,
    });
    setActiveMilestoneId(null);
  };

  return (
    <div className="rounded-2xl border border-stellar-border bg-[#131620] p-6 space-y-6 shadow-xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stellar-border pb-4">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            Milestone-Based Escrow Tranches
          </h3>
          <p className="text-xs text-gray-400">
            Funds are locked in the Soroban Vault and only released when verified deliverables are met
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-gray-400">
            Total Disbursed:{" "}
            <span className="text-white font-bold">${syndicate.totalDisbursed.toLocaleString()}</span> / $
            {syndicate.totalRaised.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Milestones timeline list */}
      <div className="space-y-4">
        {syndicate.milestones.map((m, idx) => {
          const isReleased = m.status === "Released";
          const isApproved = m.status === "Approved";
          const isPending = m.status === "Pending";
          const isProcessingThis = (approveMutation.isPending || releaseMutation.isPending) && activeMilestoneId === m.id;

          return (
            <div
              key={m.id}
              className={`rounded-xl border p-4 transition-all ${
                isReleased
                  ? "border-emerald-500/30 bg-emerald-500/5"
                  : isApproved
                  ? "border-amber-500/30 bg-amber-500/5"
                  : "border-stellar-border bg-[#0E1017]"
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-start gap-3">
                  {/* Status icon badge */}
                  <div
                    className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${
                      isReleased
                        ? "bg-emerald-500/20 text-emerald-400"
                        : isApproved
                        ? "bg-amber-500/20 text-amber-400"
                        : "bg-stellar-card text-gray-400"
                    }`}
                  >
                    {isReleased && <CheckCircle2 className="h-4 w-4" />}
                    {isApproved && <ShieldCheck className="h-4 w-4" />}
                    {isPending && <Clock className="h-4 w-4" />}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white">Milestone {m.id}</span>
                      <span
                        className={`rounded px-1.5 py-0.5 text-[10px] font-bold ${
                          isReleased
                            ? "bg-emerald-500/20 text-emerald-300"
                            : isApproved
                            ? "bg-amber-500/20 text-amber-300"
                            : "bg-gray-800 text-gray-400"
                        }`}
                      >
                        {m.status}
                      </span>
                      {m.estimatedDate && (
                        <span className="text-[10px] text-gray-500 font-medium">
                          ({m.estimatedDate})
                        </span>
                      )}
                    </div>
                    <p className="text-xs font-semibold text-gray-200 mt-1">{m.description}</p>
                  </div>
                </div>

                {/* Amount & Actions */}
                <div className="flex items-center gap-3 self-end sm:self-auto">
                  <div className="text-right">
                    <p className="font-mono text-sm font-bold text-white">
                      ${m.amount.toLocaleString()} USDC
                    </p>
                    <p className="text-[10px] text-gray-400 font-mono">
                      {m.trancheBps / 100}% of Vault
                    </p>
                  </div>

                  {/* Action triggers */}
                  {isPending && isLeadOrAdmin && (
                    <button
                      onClick={() => handleApprove(m.id)}
                      disabled={isProcessingThis}
                      className="rounded-lg bg-amber-500/20 border border-amber-500/40 px-3 py-1.5 text-xs font-semibold text-amber-300 hover:bg-amber-500/30 transition-all disabled:opacity-50"
                    >
                      {isProcessingThis ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        "Approve Tranche"
                      )}
                    </button>
                  )}

                  {isApproved && isLeadOrAdmin && (
                    <button
                      onClick={() => handleRelease(m.id)}
                      disabled={isProcessingThis}
                      className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-emerald-500 transition-all disabled:opacity-50"
                    >
                      {isProcessingThis ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <>
                          <Send className="h-3 w-3" />
                          <span>Release to Founder</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>

              {/* Deliverables Checklist if present */}
              {m.deliverables && m.deliverables.length > 0 && (
                <div className="mt-3 border-t border-stellar-border/50 pt-2.5 space-y-1">
                  <p className="text-[11px] font-semibold text-gray-400">Deliverables Audit Trail:</p>
                  <ul className="space-y-1">
                    {m.deliverables.map((d, i) => (
                      <li key={i} className="flex items-center gap-2 text-[11px] text-gray-300">
                        <span className="h-1.5 w-1.5 rounded-full bg-stellar-primary" />
                        <span>{d}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
