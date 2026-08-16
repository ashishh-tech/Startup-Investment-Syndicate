import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Providers } from "@/components/common/Providers";

export const metadata: Metadata = {
  title: "Startup Investment Syndicate | Stellar Soroban Venture Pooling",
  description: "Next-gen blockchain investment syndicate on Stellar — pool capital, mint LP share tokens, milestone-based escrow release, and automated waterfall distributions.",
  keywords: ["Stellar", "Soroban", "Smart Contracts", "Syndicate", "Venture Capital", "Orange Belt", "Web3"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-[#080A0F] text-gray-100 flex flex-col antialiased">
        <Providers>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
