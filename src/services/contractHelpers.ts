import { Address, xdr } from "@stellar/stellar-sdk";

export interface SorobanEventData {
  topicSymbol: string;
  actionSymbol: string;
  dataValues: any[];
}

export class ContractHelpers {
  /**
   * Format a Stellar G-Address or C-Contract address for clean UI display
   */
  static truncateAddress(address: string, leadLength = 4, tailLength = 4): string {
    if (!address) return "";
    if (address.length <= leadLength + tailLength) return address;
    return `${address.slice(0, leadLength)}...${address.slice(-tailLength)}`;
  }

  /**
   * Validate standard Stellar G-public key or C-contract address string format
   */
  static isValidStellarAddress(address: string): boolean {
    if (!address) return false;
    return (address.startsWith("G") || address.startsWith("C")) && address.length === 56;
  }

  /**
   * Calculate human-readable basis points percentage display
   */
  static bpsToPercentString(bps: number): string {
    return `${(bps / 100).toFixed(1)}%`;
  }
}
