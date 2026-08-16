import { describe, it, expect } from "vitest";
import { ContractHelpers } from "@/services/contractHelpers";

describe("ContractHelpers utility functions", () => {
  it("should truncate addresses correctly", () => {
    const address = "GBZXN7PIRZGNMHGA728JDO2Y27494B6GQLK3Y7O57NVX5L5Q2O3F36SY";
    const truncated = ContractHelpers.truncateAddress(address);
    expect(truncated).toBe("GBZX...36SY");
  });

  it("should validate standard Stellar public keys and contract IDs", () => {
    const validG = "GBZXN7PIRZGNMHGA728JDO2Y27494B6GQLK3Y7O57NVX5L5Q2O3F36SY";
    const validC = "CA77VNLXWZY462GTH7OEZ4F63Z35T5T4ZGYQ6N3U32AEPX3CQU2Z6H66";
    const invalid = "short-address";

    expect(ContractHelpers.isValidStellarAddress(validG)).toBe(true);
    expect(ContractHelpers.isValidStellarAddress(validC)).toBe(true);
    expect(ContractHelpers.isValidStellarAddress(invalid)).toBe(false);
  });

  it("should format basis points into percentage string", () => {
    expect(ContractHelpers.bpsToPercentString(2000)).toBe("20.0%");
    expect(ContractHelpers.bpsToPercentString(250)).toBe("2.5%");
  });
});
