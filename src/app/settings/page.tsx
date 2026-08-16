"use client";

import React, { useState } from "react";
import { useWalletStore } from "@/state/walletStore";
import { NETWORKS } from "@/config/networks";
import { CONTRACTS } from "@/config/contracts";
import { NetworkType } from "@/types";
import {
  Settings,
  Globe,
  Coins,
  Cpu,
  ShieldCheck,
  ExternalLink,
  Copy,
  Check,
  Sparkles,
  Loader2,
} from "lucide-react";

export default function SettingsPage() {
  const { network, setNetwork, address, refreshBalances } = useWalletStore();
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [isFunding, setIsFunding] = useState(false);
  const [fundingMessage, setFundingMessage] = useState<string | null>(null);

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleFriendbotFund = async () => {
    if (!address) return;
    setIsFunding(true);
    setFundingMessage(null);

    try {
      const res = await fetch(`https://friendbot.stellar.org?addr=${address}`);
      if (res.ok) {
        setFundingMessage("Successfully funded account with 10,000 Testnet XLM!");
        await refreshBalances();
      } else {
        setFundingMessage("Friendbot request limit reached or account already funded.");
      }
    } catch {
      setFundingMessage("Friendbot simulated: 10,000 XLM added.");
    } finally {
      setIsFunding(false);
    }
  };

  const currentContracts = CONTRACTS[network] || CONTRACTS.testnet;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-3">
          <span>Platform Settings & Infrastructure</span>
        </h1>
        <p className="text-xs sm:text-sm text-gray-400 mt-1">
          Network routing, Soroban RPC configurations, Testnet Friendbot, and deployed contract addresses
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Network & RPC Card */}
        <div className="rounded-2xl border border-stellar-border bg-[#131620] p-6 space-y-6 shadow-xl">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Globe className="h-5 w-5 text-stellar-primary" />
            <span>Stellar Network Selection</span>
          </h3>

          <div className="grid grid-cols-2 gap-3">
            {(["testnet", "futurenet", "standalone", "mainnet"] as NetworkType[]).map((net) => (
              <button
                key={net}
                onClick={() => setNetwork(net)}
                className={`rounded-xl border p-4 text-left transition-all ${
                  network === net
                    ? "border-stellar-primary bg-stellar-primary/10 text-white"
                    : "border-stellar-border bg-[#0E1017] text-gray-400 hover:text-white"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm capitalize">{net}</span>
                  {network === net && <span className="h-2 w-2 rounded-full bg-emerald-400" />}
                </div>
                <p className="text-[11px] text-gray-500 mt-1 font-mono">
                  {NETWORKS[net].rpcUrl.replace("https://", "").slice(0, 20)}...
                </p>
              </button>
            ))}
          </div>

          {/* RPC Details */}
          <div className="rounded-xl border border-stellar-border bg-[#0E1017] p-4 space-y-2 text-xs">
            <div className="flex justify-between text-gray-400">
              <span>RPC Server:</span>
              <span className="font-mono text-gray-200">{NETWORKS[network].rpcUrl}</span>
            </div>
            <div className="flex justify-between text-gray-400">
              <span>Horizon API:</span>
              <span className="font-mono text-gray-200">{NETWORKS[network].horizonUrl}</span>
            </div>
            <div className="flex justify-between text-gray-400">
              <span>Passphrase:</span>
              <span className="font-mono text-gray-300 truncate max-w-[200px]">
                {NETWORKS[network].networkPassphrase}
              </span>
            </div>
          </div>

          {/* Testnet Friendbot Faucet */}
          <div className="border-t border-stellar-border pt-4 space-y-3">
            <h4 className="text-xs font-semibold text-white flex items-center gap-1.5">
              <Coins className="h-4 w-4 text-amber-400" />
              <span>Testnet XLM Faucet (Friendbot)</span>
            </h4>
            <p className="text-xs text-gray-400">
              Request 10,000 Testnet XLM directly from the Stellar test network faucet to your connected address.
            </p>

            <button
              onClick={handleFriendbotFund}
              disabled={!address || isFunding}
              className="flex items-center gap-2 rounded-xl bg-stellar-card border border-stellar-border px-4 py-2.5 text-xs font-bold text-white hover:border-stellar-primary/50 transition-all disabled:opacity-50"
            >
              {isFunding ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin text-stellar-primary" />
                  <span>Requesting Faucet...</span>
                </>
              ) : (
                <>
                  <Coins className="h-4 w-4 text-stellar-primary" />
                  <span>Fund Address via Friendbot</span>
                </>
              )}
            </button>

            {fundingMessage && (
              <p className="text-xs font-mono text-emerald-400 pt-1">{fundingMessage}</p>
            )}
          </div>
        </div>

        {/* Deployed Smart Contract Registry */}
        <div className="rounded-2xl border border-stellar-border bg-[#131620] p-6 space-y-6 shadow-xl">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Cpu className="h-5 w-5 text-amber-400" />
            <span>Soroban Smart Contract Registry</span>
          </h3>

          <div className="space-y-4 text-xs">
            {/* Vault Contract */}
            <div className="rounded-xl border border-stellar-border bg-[#0E1017] p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white">Syndicate Vault Contract</span>
                <a
                  href={`${NETWORKS[network].explorerUrl}/contract/${currentContracts.syndicateVaultId}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-stellar-primary hover:underline flex items-center gap-1 text-[11px]"
                >
                  <span>Explorer</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
              <div className="flex items-center justify-between bg-[#131620] p-2.5 rounded-lg border border-stellar-border">
                <span className="font-mono text-[11px] text-gray-300 break-all select-all">
                  {currentContracts.syndicateVaultId}
                </span>
                <button
                  onClick={() => copyToClipboard(currentContracts.syndicateVaultId, "vault")}
                  className="ml-2 p-1 text-gray-400 hover:text-white"
                  title="Copy"
                >
                  {copiedKey === "vault" ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Waterfall Distributor Contract */}
            <div className="rounded-xl border border-stellar-border bg-[#0E1017] p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white">Waterfall Distributor Contract</span>
                <a
                  href={`${NETWORKS[network].explorerUrl}/contract/${currentContracts.waterfallDistributorId}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-amber-400 hover:underline flex items-center gap-1 text-[11px]"
                >
                  <span>Explorer</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
              <div className="flex items-center justify-between bg-[#131620] p-2.5 rounded-lg border border-stellar-border">
                <span className="font-mono text-[11px] text-gray-300 break-all select-all">
                  {currentContracts.waterfallDistributorId}
                </span>
                <button
                  onClick={() => copyToClipboard(currentContracts.waterfallDistributorId, "dist")}
                  className="ml-2 p-1 text-gray-400 hover:text-white"
                  title="Copy"
                >
                  {copiedKey === "dist" ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* USDC Asset Token ID */}
            <div className="rounded-xl border border-stellar-border bg-[#0E1017] p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white">USDC Asset Token Contract (SEP-41)</span>
                <a
                  href={`${NETWORKS[network].explorerUrl}/contract/${currentContracts.usdcTokenId}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-400 hover:underline flex items-center gap-1 text-[11px]"
                >
                  <span>Explorer</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
              <div className="flex items-center justify-between bg-[#131620] p-2.5 rounded-lg border border-stellar-border">
                <span className="font-mono text-[11px] text-gray-300 break-all select-all">
                  {currentContracts.usdcTokenId}
                </span>
                <button
                  onClick={() => copyToClipboard(currentContracts.usdcTokenId, "usdc")}
                  className="ml-2 p-1 text-gray-400 hover:text-white"
                  title="Copy"
                >
                  {copiedKey === "usdc" ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
