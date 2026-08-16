"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useWalletStore } from "@/state/walletStore";
import { useTxStore } from "@/state/txStore";
import { WalletModal } from "./WalletModal";
import {
  Coins,
  Layers,
  Activity,
  History,
  BarChart3,
  Settings,
  ChevronDown,
  LogOut,
  ExternalLink,
  Flame,
  Menu,
  X,
  Sparkles,
} from "lucide-react";

export function Navbar() {
  const pathname = usePathname();
  const { isConnected, address, xlmBalance, usdcBalance, network, disconnect } = useWalletStore();
  const { getPendingCount, setOpen: setTxOpen } = useTxStore();
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const pendingCount = getPendingCount();

  const navLinks = [
    { href: "/dashboard", label: "Dashboard", icon: Layers },
    { href: "/activity", label: "Live Activity", icon: Activity },
    { href: "/transactions", label: "Tx Center", icon: History, badge: pendingCount > 0 ? pendingCount : null },
    { href: "/analytics", label: "Analytics", icon: BarChart3 },
    { href: "/settings", label: "Settings", icon: Settings },
  ];

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 4)}...${addr.slice(-4)}`;
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-stellar-border bg-[#0B0D13]/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo & Brand */}
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-stellar-primary to-amber-600 shadow-lg shadow-stellar-primary/20 group-hover:scale-105 transition-all">
                <Flame className="h-6 w-6 text-white" />
              </div>
              <div>
                <span className="text-lg font-bold tracking-tight text-white flex items-center gap-1.5">
                  SYNDICATE<span className="text-stellar-primary">X</span>
                  <span className="rounded bg-amber-500/10 px-1.5 py-0.5 text-[10px] font-semibold text-stellar-primary border border-amber-500/30">
                    ORANGE BELT
                  </span>
                </span>
                <span className="hidden sm:block text-[11px] font-medium text-gray-400">
                  Soroban Venture Pooling
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all ${
                      isActive
                        ? "bg-stellar-card text-stellar-primary border border-stellar-border shadow-sm"
                        : "text-gray-400 hover:bg-stellar-card/50 hover:text-white"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{link.label}</span>
                    {link.badge && (
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-stellar-primary text-[11px] font-bold text-white animate-pulse">
                        {link.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Right Action Area */}
          <div className="flex items-center gap-3">
            {/* Network Badge */}
            <div className="hidden sm:flex items-center gap-1.5 rounded-full border border-stellar-border bg-stellar-card/60 px-3 py-1 text-xs font-medium text-gray-300">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="capitalize">{network}</span>
            </div>

            {/* Pending Tx Center Quick Button */}
            <button
              onClick={() => setTxOpen(true)}
              className="relative flex items-center gap-1.5 rounded-lg border border-stellar-border bg-stellar-card px-2.5 py-1.5 text-xs font-medium text-gray-300 hover:border-stellar-primary/50 transition-colors"
              title="Open Transaction Center"
            >
              <History className="h-4 w-4 text-stellar-primary" />
              <span className="hidden sm:inline">Tx Center</span>
              {pendingCount > 0 && (
                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-stellar-primary text-[10px] font-bold text-white">
                  {pendingCount}
                </span>
              )}
            </button>

            {/* Wallet Connect / User Menu */}
            {isConnected && address ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 rounded-lg border border-stellar-primary/40 bg-stellar-primary/10 px-3 py-1.5 text-xs font-medium text-white hover:bg-stellar-primary/20 transition-all"
                >
                  <div className="flex flex-col text-right">
                    <span className="font-semibold text-white">{formatAddress(address)}</span>
                    <span className="text-[10px] text-stellar-primary font-mono">
                      {usdcBalance} USDC
                    </span>
                  </div>
                  <ChevronDown className="h-3.5 w-3.5 text-stellar-primary" />
                </button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-60 rounded-xl border border-stellar-border bg-[#161922] p-3 shadow-2xl z-50 animate-in fade-in zoom-in-95">
                    <div className="border-b border-stellar-border pb-2 mb-2">
                      <p className="text-[11px] text-gray-400">Connected Account</p>
                      <p className="font-mono text-xs font-medium text-white break-all">{address}</p>
                    </div>

                    <div className="space-y-1.5 py-1 text-xs">
                      <div className="flex justify-between text-gray-300">
                        <span>USDC Balance:</span>
                        <span className="font-mono font-bold text-white">{usdcBalance} USDC</span>
                      </div>
                      <div className="flex justify-between text-gray-300">
                        <span>XLM Balance:</span>
                        <span className="font-mono text-gray-300">{xlmBalance} XLM</span>
                      </div>
                    </div>

                    <div className="border-t border-stellar-border pt-2 mt-2 space-y-1">
                      <a
                        href={`https://stellar.expert/explorer/testnet/account/${address}`}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center justify-between rounded-md px-2 py-1.5 text-xs text-gray-300 hover:bg-stellar-accent hover:text-white"
                      >
                        <span>View on Explorer</span>
                        <ExternalLink className="h-3.5 w-3.5 text-gray-400" />
                      </a>
                      <button
                        onClick={() => {
                          disconnect();
                          setIsUserMenuOpen(false);
                        }}
                        className="flex w-full items-center justify-between rounded-md px-2 py-1.5 text-xs text-rose-400 hover:bg-rose-500/10"
                      >
                        <span>Disconnect Wallet</span>
                        <LogOut className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => setIsWalletModalOpen(true)}
                className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-stellar-primary to-amber-600 px-4 py-2 text-xs font-semibold text-white shadow-lg shadow-stellar-primary/20 hover:brightness-110 active:scale-95 transition-all"
              >
                <Coins className="h-4 w-4" />
                <span>Connect Wallet</span>
              </button>
            )}

            {/* Mobile menu toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden rounded-lg p-2 text-gray-400 hover:bg-stellar-card hover:text-white"
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-b border-stellar-border bg-[#0E1017] px-4 pt-2 pb-4 space-y-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium ${
                    isActive
                      ? "bg-stellar-card text-stellar-primary font-semibold"
                      : "text-gray-400 hover:bg-stellar-card/50 hover:text-white"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="h-4 w-4" />
                    <span>{link.label}</span>
                  </div>
                  {link.badge && (
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-stellar-primary text-xs font-bold text-white">
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        )}
      </header>

      {/* Wallet Selector Modal */}
      <WalletModal isOpen={isWalletModalOpen} onClose={() => setIsWalletModalOpen(false)} />
    </>
  );
}
