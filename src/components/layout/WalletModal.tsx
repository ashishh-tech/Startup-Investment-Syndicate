"use client";

import React, { useState } from "react";
import { useWalletStore, WalletType } from "@/state/walletStore";
import { X, ShieldAlert, ArrowRight, CheckCircle2, Loader2, Sparkles } from "lucide-react";

interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function WalletModal({ isOpen, onClose }: WalletModalProps) {
  const { connect, isConnecting, error, clearError } = useWalletStore();
  const [selectedType, setSelectedType] = useState<WalletType | null>(null);

  if (!isOpen) return null;

  const handleConnect = async (type: WalletType) => {
    setSelectedType(type);
    await connect(type);
    const hasError = useWalletStore.getState().error;
    if (!hasError) {
      onClose();
    }
  };

  const walletOptions = [
    {
      id: "freighter" as WalletType,
      name: "Freighter Wallet",
      description: "Official browser extension wallet for Stellar & Soroban smart contracts",
      icon: "🦊",
      recommended: true,
      badge: "Official Extension",
    },
    {
      id: "simulator" as WalletType,
      name: "Testnet Investor Simulator",
      description: "Instantly simulate active LP/Lead with pre-funded 50,000 USDC testnet balance",
      icon: "⚡",
      recommended: false,
      badge: "Instant Evaluation",
    },
    {
      id: "xbull" as WalletType,
      name: "xBull Wallet",
      description: "Multi-platform wallet supporting mobile, web, and hardware integration",
      icon: "🐂",
      recommended: false,
      badge: "Web / Mobile",
    },
    {
      id: "albedo" as WalletType,
      name: "Albedo Auth",
      description: "Lightweight web authenticator with delegated transaction signing",
      icon: "🌐",
      recommended: false,
      badge: "Browser Native",
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-md rounded-2xl border border-stellar-border bg-[#13161F] p-6 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-stellar-border">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              Connect Stellar Wallet
            </h3>
            <p className="text-xs text-gray-400">
              Select your wallet to interact with Soroban syndicate vaults
            </p>
          </div>
          <button
            onClick={() => {
              clearError();
              onClose();
            }}
            className="rounded-lg p-1.5 text-gray-400 hover:bg-stellar-card hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Error notification */}
        {error && (
          <div className="my-4 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3.5 text-xs text-rose-300 flex items-start gap-2.5">
            <ShieldAlert className="h-4 w-4 shrink-0 text-rose-400 mt-0.5" />
            <div className="space-y-1">
              <p className="font-semibold text-rose-200">Connection Issue</p>
              <p className="leading-relaxed">{error}</p>
            </div>
          </div>
        )}

        {/* Wallets list */}
        <div className="mt-4 space-y-2.5">
          {walletOptions.map((w) => {
            const isLoading = isConnecting && selectedType === w.id;
            return (
              <button
                key={w.id}
                onClick={() => handleConnect(w.id)}
                disabled={isConnecting}
                className={`group flex w-full items-center justify-between rounded-xl border p-3.5 text-left transition-all ${
                  w.recommended
                    ? "border-stellar-primary/40 bg-stellar-primary/5 hover:border-stellar-primary hover:bg-stellar-primary/10"
                    : "border-stellar-border bg-stellar-card/50 hover:border-stellar-border hover:bg-stellar-card"
                } ${isLoading ? "opacity-75" : ""}`}
              >
                <div className="flex items-center gap-3.5">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-stellar-dark border border-stellar-border text-2xl shadow-inner group-hover:scale-105 transition-transform">
                    {w.icon}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-white group-hover:text-stellar-primary transition-colors">
                        {w.name}
                      </span>
                      <span className="rounded bg-stellar-border px-1.5 py-0.5 text-[10px] font-semibold text-gray-300">
                        {w.badge}
                      </span>
                    </div>
                    <p className="text-[11px] text-gray-400 line-clamp-1">{w.description}</p>
                  </div>
                </div>

                <div className="shrink-0 pl-2">
                  {isLoading ? (
                    <Loader2 className="h-5 w-5 animate-spin text-stellar-primary" />
                  ) : (
                    <ArrowRight className="h-4 w-4 text-gray-500 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Footer info */}
        <div className="mt-6 rounded-xl border border-stellar-border bg-[#0C0E14] p-3 text-center text-[11px] text-gray-400">
          <p>
            By connecting, you agree to the{" "}
            <span className="text-gray-300 font-medium">Stellar Soroban Terms</span> & acknowledge smart contract risk.
          </p>
        </div>
      </div>
    </div>
  );
}
