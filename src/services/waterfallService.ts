import { WaterfallBreakdown } from "@/types";

export class WaterfallService {
  /**
   * Computes multi-tier VC Waterfall distribution identical to the Soroban WaterfallDistributor contract
   * @param totalProceeds Exit or liquidation total proceeds
   * @param totalPrincipal Initial capital invested across all LPs
   * @param carryBps Syndicate lead performance fee (basis points, e.g. 2000 for 20%)
   * @param investmentYears Estimated holding period in years for IRR calculation
   */
  static calculate(
    totalProceeds: number,
    totalPrincipal: number,
    carryBps: number = 2000,
    investmentYears: number = 3
  ): WaterfallBreakdown {
    if (totalProceeds <= 0 || totalPrincipal <= 0) {
      return {
        totalProceeds: 0,
        totalPrincipal: 0,
        principalRepaid: 0,
        excessProfit: 0,
        leadCarryAmount: 0,
        lpProfitPool: 0,
        totalLpPayout: 0,
        totalLeadPayout: 0,
        lpMoic: 0,
        lpIrrEstimate: 0,
      };
    }

    // Tier 1: 100% Principal repayment to LPs
    const principalRepaid = Math.min(totalProceeds, totalPrincipal);

    // Excess profit above principal
    const excessProfit = Math.max(0, totalProceeds - totalPrincipal);

    // Tier 2: Lead Carry performance fee
    const carryRate = carryBps / 10000;
    const leadCarryAmount = excessProfit * carryRate;

    // Tier 3: LP Profit Pool (Remaining excess profit)
    const lpProfitPool = excessProfit - leadCarryAmount;

    // Totals
    const totalLpPayout = principalRepaid + lpProfitPool;
    const totalLeadPayout = leadCarryAmount;

    // Multiple on Invested Capital (MOIC)
    const lpMoic = Number((totalLpPayout / totalPrincipal).toFixed(2));

    // Internal Rate of Return (IRR) approximation
    let lpIrrEstimate = 0;
    if (lpMoic > 0 && investmentYears > 0) {
      lpIrrEstimate = Number((Math.pow(lpMoic, 1 / investmentYears) - 1) * 100);
      lpIrrEstimate = Number(Math.max(-100, lpIrrEstimate).toFixed(1));
    }

    return {
      totalProceeds,
      totalPrincipal,
      principalRepaid,
      excessProfit,
      leadCarryAmount,
      lpProfitPool,
      totalLpPayout,
      totalLeadPayout,
      lpMoic,
      lpIrrEstimate,
    };
  }

  /**
   * Calculate an individual LP's pro-rata distribution
   */
  static calculateLpShare(
    investorPrincipal: number,
    totalPrincipal: number,
    totalLpPayout: number
  ): {
    investorPayout: number;
    investorNetProfit: number;
    investorMoic: number;
  } {
    if (totalPrincipal <= 0 || investorPrincipal <= 0) {
      return { investorPayout: 0, investorNetProfit: 0, investorMoic: 0 };
    }

    const shareRatio = investorPrincipal / totalPrincipal;
    const investorPayout = totalLpPayout * shareRatio;
    const investorNetProfit = investorPayout - investorPrincipal;
    const investorMoic = Number((investorPayout / investorPrincipal).toFixed(2));

    return {
      investorPayout: Number(investorPayout.toFixed(2)),
      investorNetProfit: Number(investorNetProfit.toFixed(2)),
      investorMoic,
    };
  }
}
