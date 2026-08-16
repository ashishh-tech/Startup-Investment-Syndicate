import { describe, it, expect } from "vitest";
import { EventParserService } from "@/services/eventParser";

describe("EventParserService event transformation", () => {
  it("should parse deposit event topic into deposit struct", () => {
    const evt = EventParserService.parseSorobanEvent(
      "synd.deposit",
      "7b9e5832a8f4c278912384a6c8e312984b5c192847a9e8b12",
      "syn-01",
      "Aetheria Robotics",
      "GBZXN7PIRZGNMHGA728JDO2Y27494B6GQLK3Y7O57NVX5L5Q2O3F36SY",
      150000
    );

    expect(evt.type).toBe("deposit");
    expect(evt.amount).toBe(150000);
    expect(evt.details).toContain("Deposited");
    expect(evt.details).toContain("USDC");
  });

  it("should parse exit event topic into exit_triggered struct", () => {
    const evt = EventParserService.parseSorobanEvent(
      "synd.exit",
      "e312984b5c192847a9e8b128f74a9d9c22b2e987162983b4e4c2",
      "syn-03",
      "QuantumCipher",
      "GDACQ5L2X6Y8Z12984b5c192847a9e8b128f74a9d9c22b2e9871",
      5000000
    );

    expect(evt.type).toBe("exit_triggered");
    expect(evt.amount).toBe(5000000);
    expect(evt.details).toContain("Triggered exit return waterfall");
  });
});
