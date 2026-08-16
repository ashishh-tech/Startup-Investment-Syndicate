import { describe, it, expect } from "vitest";
import { WaterfallService } from "@/services/waterfallService";

describe("WaterfallService Mathematical Mechanics", () => {
  it("should return 100% principal and 0 carry on break-even exit", () => {
    const totalPrincipal = 1_000_000;
    const totalProceeds = 1_000_000;
    const carryBps = 2000; // 20%

    const result = WaterfallService.calculate(totalProceeds, totalPrincipal, carryBps);

    expect(result.principalRepaid).toBe(1_000_000);
    expect(result.excessProfit).toBe(0);
    expect(result.leadCarryAmount).toBe(0);
    expect(result.totalLpPayout).toBe(1_000_000);
    expect(result.totalLeadPayout).toBe(0);
    expect(result.lpMoic).toBe(1.0);
  });

  it("should calculate 3x exit returns with 20% carry accurately", () => {
    // $1M principal, $3M exit proceeds
    // Profit = $2M
    // 20% carry to lead = $400k
    // 80% to LPs = $1.6M
    // Total LP payout = $1M principal + $1.6M profit = $2.6M
    const totalPrincipal = 1_000_000;
    const totalProceeds = 3_000_000;
    const carryBps = 2000;

    const result = WaterfallService.calculate(totalProceeds, totalPrincipal, carryBps, 3);

    expect(result.principalRepaid).toBe(1_000_000);
    expect(result.excessProfit).toBe(2_000_000);
    expect(result.leadCarryAmount).toBe(400_000);
    expect(result.lpProfitPool).toBe(1_600_000);
    expect(result.totalLpPayout).toBe(2_600_000);
    expect(result.totalLeadPayout).toBe(400_000);
    expect(result.lpMoic).toBe(2.6);
    expect(result.lpIrrEstimate).toBeGreaterThan(30);
  });

  it("should calculate individual LP pro-rata distributions correctly", () => {
    const investorTicket = 250_000; // 25% of syndicate
    const totalPrincipal = 1_000_000;
    const totalLpPayout = 2_600_000;

    const share = WaterfallService.calculateLpShare(
      investorTicket,
      totalPrincipal,
      totalLpPayout
    );

    expect(share.investorPayout).toBe(650_000);
    expect(share.investorNetProfit).toBe(400_000);
    expect(share.investorMoic).toBe(2.6);
  });

  it("should protect LPs with 100% loss mitigation when proceeds are below principal", () => {
    const totalPrincipal = 1_000_000;
    const totalProceeds = 600_000; // Downside scenario

    const result = WaterfallService.calculate(totalProceeds, totalPrincipal, 2000);

    expect(result.principalRepaid).toBe(600_000);
    expect(result.excessProfit).toBe(0);
    expect(result.leadCarryAmount).toBe(0);
    expect(result.totalLpPayout).toBe(600_000);
    expect(result.totalLeadPayout).toBe(0);
    expect(result.lpMoic).toBe(0.6);
  });
});
