"use client";

import React, { useState } from "react";
import { Syndicate } from "@/types";
import { useWalletStore } from "@/state/walletStore";
import { useDepositMutation } from "@/hooks/useSyndicates";
import {
  X,
  Coins,
  ShieldCheck,
  AlertTriangle,
  Loader2,
  CheckCircle2,
  Sparkles,
  ArrowRight,
} from "lucide-react";

interface DepositModalProps {
  syndicate: Syndicate;
  isOpen: boolean;
  onClose: () => void;
}

export function DepositModal({ syndicate, isOpen, onClose }: DepositModalProps) {
  const { isConnected, address, usdcBalance, connect } = useWalletStore();
  const [amount, setAmount] = useState<number>(syndicate.minTicket);
  const [agreedToTerms, setAgreedToTerms] = useState<boolean>(true);
  const [depositSuccessHash, setDepositSuccessHash] = useState<string | null>(null);

  const depositMutation = useDepositMutation();

  if (!isOpen) return null;

  const remainingCap = syndicate.targetCap - syndicate.totalRaised;
  const isAmountValid = amount >= syndicate.minTicket && amount <= syndicate.maxTicket && amount <= remainingCap;

  const handleDeposit = async () => {
    if (!address) return;

    try {
      const res = await depositMutation.mutateAsync({
        syndicateId: syndicate.id,
        investorAddress: address,
        amount,
      });
      if (res.success) {
        setDepositSuccessHash(res.txHash);
      }
    } catch {
      // Error handled by mutation
    }
  };

  const quickTicketOptions = [
    syndicate.minTicket,
    syndicate.minTicket * 2.5,
    syndicate.minTicket * 5,
    Math.min(syndicate.maxTicket, remainingCap),
  ].filter((v, i, a) => a.indexOf(v) === i && v <= remainingCap);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-lg rounded-2xl border border-stellar-border bg-[#131620] p-6 shadow-2xl">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-stellar-border pb-4">
          <div className="flex items-center gap-3">
            <div className="text-2xl">{syndicate.logo}</div>
            <div>
              <h3 className="text-base font-bold text-white">Join Syndicate: {syndicate.name}</h3>
              <p className="text-xs text-gray-400">Mint 1:1 LP Syndicate Share Tokens</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-gray-400 hover:bg-stellar-card hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {depositSuccessHash ? (
          /* Success Screen */
          <div className="py-8 text-center space-y-4">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <div>
              <h4 className="text-lg font-bold text-white">Investment Confirmed!</h4>
              <p className="text-xs text-gray-400 mt-1 max-w-sm mx-auto">
                Your deposit of <span className="font-mono text-white font-bold">${amount.toLocaleString()} USDC</span> was successfully executed on Soroban testnet.
              </p>
            </div>

            <div className="rounded-xl border border-stellar-border bg-[#0E1017] p-3 text-xs font-mono text-gray-300 break-all">
              <span className="text-gray-500">Tx Hash: </span>
              <a
                href={`https://stellar.expert/explorer/testnet/tx/${depositSuccessHash}`}
                target="_blank"
                rel="noreferrer"
                className="text-stellar-primary hover:underline"
              >
                {depositSuccessHash}
              </a>
            </div>

            <button
              onClick={onClose}
              className="w-full rounded-xl bg-stellar-primary py-2.5 text-xs font-bold text-white hover:brightness-110"
            >
              Done
            </button>
          </div>
        ) : (
          /* Deposit Form */
          <div className="mt-4 space-y-5">
            {/* Wallet status banner */}
            {!isConnected ? (
              <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-3.5 flex items-center justify-between text-xs text-amber-200">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 shrink-0 text-amber-400" />
                  <span>Connect wallet to commit capital</span>
                </div>
                <button
                  onClick={() => connect("simulator")}
                  className="rounded-lg bg-stellar-primary px-3 py-1.5 font-bold text-white hover:brightness-110"
                >
                  Quick Connect
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-between rounded-xl border border-stellar-border bg-[#0E1017] px-3.5 py-2.5 text-xs">
                <span className="text-gray-400">Available Wallet Balance:</span>
                <span className="font-mono font-bold text-white">{usdcBalance} USDC</span>
              </div>
            )}

            {/* Quick Ticket Selector */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-300">Select Allocation Size</label>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                {quickTicketOptions.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setAmount(opt)}
                    className={`rounded-lg border px-3 py-2 text-xs font-mono font-semibold transition-all ${
                      amount === opt
                        ? "border-stellar-primary bg-stellar-primary/10 text-stellar-primary"
                        : "border-stellar-border bg-stellar-card text-gray-300 hover:border-stellar-border/80"
                    }`}
                  >
                    ${opt.toLocaleString()}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Amount Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-300">Or Custom Ticket Amount (USDC)</label>
              <div className="relative">
                <input
                  type="number"
                  min={syndicate.minTicket}
                  max={Math.min(syndicate.maxTicket, remainingCap)}
                  step={1000}
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="w-full rounded-xl border border-stellar-border bg-[#0E1017] px-4 py-3 font-mono text-base font-bold text-white focus:border-stellar-primary focus:outline-none"
                  placeholder="25000"
                />
                <span className="absolute right-4 top-3.5 font-mono text-xs font-bold text-gray-400">
                  USDC
                </span>
              </div>

              <div className="flex items-center justify-between text-[11px] text-gray-500 pt-1">
                <span>Min: ${syndicate.minTicket.toLocaleString()}</span>
                <span>Remaining Cap: ${remainingCap.toLocaleString()}</span>
              </div>
            </div>

            {/* Mint Quote Box */}
            <div className="rounded-xl border border-stellar-border bg-[#0E1017] p-4 space-y-2.5">
              <div className="flex justify-between text-xs text-gray-400">
                <span>Shares Minted:</span>
                <span className="font-mono font-bold text-white">
                  {amount.toLocaleString()} {syndicate.name.slice(0, 4).toUpperCase()}-SYND
                </span>
              </div>
              <div className="flex justify-between text-xs text-gray-400">
                <span>Pro-Rata Vault Ownership:</span>
                <span className="font-mono font-bold text-stellar-primary">
                  {((amount / syndicate.targetCap) * 100).toFixed(2)}%
                </span>
              </div>
              <div className="flex justify-between text-xs text-gray-400">
                <span>Milestone Governance:</span>
                <span className="text-emerald-400 font-medium">Tranche-protected escrow</span>
              </div>
            </div>

            {/* Terms checkbox */}
            <label className="flex items-start gap-2.5 cursor-pointer text-xs text-gray-400">
              <input
                type="checkbox"
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                className="mt-0.5 rounded border-stellar-border bg-stellar-card text-stellar-primary focus:ring-0"
              />
              <span>
                I agree to the Syndicate terms, milestone disbursement policy, and standard 20% carry waterfall structure.
              </span>
            </label>

            {/* Action button */}
            <button
              onClick={handleDeposit}
              disabled={!isConnected || !isAmountValid || !agreedToTerms || depositMutation.isPending}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-stellar-primary to-amber-600 py-3.5 text-sm font-bold text-white shadow-lg shadow-stellar-primary/20 hover:brightness-110 active:scale-95 disabled:opacity-50 disabled:pointer-events-none transition-all"
            >
              {depositMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Signing Soroban Deposit Transaction...</span>
                </>
              ) : (
                <>
                  <Coins className="h-4 w-4" />
                  <span>Commit ${amount.toLocaleString()} USDC</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
