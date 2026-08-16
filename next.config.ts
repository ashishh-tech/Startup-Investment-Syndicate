import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  transpilePackages: ["@stellar/stellar-sdk"],
};

export default nextConfig;
