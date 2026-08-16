import React from "react";
import Link from "next/link";
import { Flame, ShieldCheck, Github, ExternalLink, Cpu } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-stellar-border bg-[#0B0D13] text-gray-400 py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-stellar-primary text-white">
                <Flame className="h-5 w-5" />
              </div>
              <span className="text-base font-bold text-white tracking-tight">
                SYNDICATE<span className="text-stellar-primary">X</span>
              </span>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed">
              Decentralized venture capital syndicate protocol on Stellar. Milestone-based escrow, proportional LP tokens, and automated transparent waterfall payouts.
            </p>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 px-2.5 py-1 text-[11px] font-semibold text-stellar-primary border border-amber-500/20">
                <ShieldCheck className="h-3.5 w-3.5" />
                Stellar Orange Belt (Level 3)
              </span>
            </div>
          </div>

          {/* Smart Contracts */}
          <div>
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-3">
              Soroban Contracts
            </h4>
            <ul className="space-y-2 text-xs">
              <li className="flex items-center gap-1.5 text-gray-300">
                <Cpu className="h-3.5 w-3.5 text-stellar-primary" />
                <span>Syndicate Vault</span>
              </li>
              <li className="flex items-center gap-1.5 text-gray-300">
                <Cpu className="h-3.5 w-3.5 text-stellar-primary" />
                <span>Waterfall Distributor</span>
              </li>
              <li className="flex items-center gap-1.5 text-gray-300">
                <Cpu className="h-3.5 w-3.5 text-stellar-primary" />
                <span>SEP-41 SAC Asset Pool</span>
              </li>
              <li className="pt-1">
                <a
                  href="https://developers.stellar.org/docs/learn/smart-contract-internals"
                  target="_blank"
                  rel="noreferrer"
                  className="text-stellar-primary hover:underline inline-flex items-center gap-1"
                >
                  <span>Soroban Docs</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-3">
              Platform Features
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/dashboard" className="hover:text-white transition-colors">
                  Deal Directory
                </Link>
              </li>
              <li>
                <Link href="/activity" className="hover:text-white transition-colors">
                  Live Event Stream
                </Link>
              </li>
              <li>
                <Link href="/transactions" className="hover:text-white transition-colors">
                  Transaction Center
                </Link>
              </li>
              <li>
                <Link href="/analytics" className="hover:text-white transition-colors">
                  Waterfall & IRR Analytics
                </Link>
              </li>
            </ul>
          </div>

          {/* Github & Resources */}
          <div>
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-3">
              Open Source & Submission
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a
                  href="https://github.com/ashishh-tech/Startup-Investment-Syndicate"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 hover:text-white transition-colors"
                >
                  <Github className="h-3.5 w-3.5" />
                  <span>GitHub Repository</span>
                </a>
              </li>
              <li>
                <a
                  href="https://stellar.expert/explorer/testnet"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-white transition-colors inline-flex items-center gap-1"
                >
                  <span>Stellar.Expert Testnet</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </li>
              <li>
                <span className="text-gray-500">Stellar Ecosystem Track 2026</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-stellar-border pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <p>© 2026 Startup Investment Syndicate Protocol. Built for Stellar Orange Belt Certification.</p>
          <p className="flex items-center gap-1 font-mono text-[11px]">
            <span>RPC:</span> <span className="text-emerald-400">soroban-testnet.stellar.org</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
