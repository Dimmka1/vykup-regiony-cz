import { describe, expect, it } from "vitest";
import { calculateLeadScore } from "../lead-scoring";

describe("calculateLeadScore", () => {
  it("returns hot tier for high-value lead (byt + Praha + exekuce)", () => {
    const result = calculateLeadScore({
      property_type: "byt",
      region: "Praha",
      situation_type: "exekuce",
    });

    expect(result.score).toBe(80); // 30+30+20
    expect(result.tier).toBe("hot");
    expect(result.emoji).toBe("🔥");
  });

  it("returns warm tier for medium-value lead (dům + Liberec + standard)", () => {
    const result = calculateLeadScore({
      property_type: "dům",
      region: "Liberec",
      situation_type: "standard",
    });

    expect(result.score).toBe(35); // 20+15+0
    expect(result.tier).toBe("warm");
    expect(result.emoji).toBe("⚡");
  });

  it("returns cold tier for low-value lead (pozemek + unknown region + standard)", () => {
    const result = calculateLeadScore({
      property_type: "pozemek",
      region: "Teplice",
      situation_type: "standard",
    });

    expect(result.score).toBe(20); // 10+10+0
    expect(result.tier).toBe("cold");
    expect(result.emoji).toBe("❄️");
  });

  it("adds +10 for quick-estimate source", () => {
    const result = calculateLeadScore({
      property_type: "pozemek",
      region: "Teplice",
      situation_type: "standard",
      source: "quick-estimate",
    });

    expect(result.score).toBe(30); // 10+10+0+10
    expect(result.tier).toBe("warm");
  });

  it("handles dědictví situation correctly", () => {
    const result = calculateLeadScore({
      property_type: "byt",
      region: "Brno",
      situation_type: "dědictví",
    });

    expect(result.score).toBe(65); // 30+20+15
    expect(result.tier).toBe("hot");
  });
});
