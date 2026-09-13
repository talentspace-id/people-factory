import { describe, expect, it } from "vitest";
import { buildHeadline, clarityBand, scoreAssessment, type ScoredResponse } from "./mbti";

function responses(dichotomy: ScoredResponse["dichotomy"], poleA: string, poleB: string, choices: ("A" | "B")[]): ScoredResponse[] {
  return choices.map((choice) => ({ dichotomy, poleA, poleB, choice }));
}

describe("clarityBand", () => {
  it("buckets the boundary values", () => {
    expect(clarityBand(0)).toBe("slight");
    expect(clarityBand(24)).toBe("slight");
    expect(clarityBand(25)).toBe("moderate");
    expect(clarityBand(49)).toBe("moderate");
    expect(clarityBand(50)).toBe("clear");
    expect(clarityBand(74)).toBe("clear");
    expect(clarityBand(75)).toBe("veryClear");
    expect(clarityBand(100)).toBe("veryClear");
  });
});

describe("scoreAssessment", () => {
  it("scores a unanimous dichotomy as 100% clarity", () => {
    const result = scoreAssessment(responses("EI", "E", "I", ["A", "A", "A", "A"]));
    expect(result.dichotomies).toHaveLength(1);
    expect(result.dichotomies[0]).toMatchObject({
      winner: "E",
      countA: 4,
      countB: 0,
      clarityPct: 100,
      band: "veryClear",
    });
    expect(result.typeCode).toBe("E");
  });

  it("breaks an exact tie toward poleA", () => {
    const result = scoreAssessment(responses("TF", "T", "F", ["A", "B", "A", "B"]));
    expect(result.dichotomies[0]).toMatchObject({ winner: "T", clarityPct: 0, band: "slight" });
  });

  it("assembles the type code in canonical dichotomy order regardless of input order", () => {
    const jp = responses("JP", "J", "P", ["B", "B"]); // -> P
    const ei = responses("EI", "E", "I", ["A", "A"]); // -> E
    const sn = responses("SN", "S", "N", ["B", "B"]); // -> N
    const tf = responses("TF", "T", "F", ["A", "A"]); // -> T
    const result = scoreAssessment([...jp, ...ei, ...sn, ...tf]);
    expect(result.typeCode).toBe("ENTP");
  });

  it("omits a dichotomy with zero responses instead of fabricating a result", () => {
    const result = scoreAssessment(responses("EI", "E", "I", ["A", "A"]));
    expect(result.dichotomies.map((d) => d.dichotomy)).toEqual(["EI"]);
    expect(result.typeCode).toBe("E");
  });

  it("computes clarity as the imbalance relative to total, not just the raw gap", () => {
    const result = scoreAssessment(responses("SN", "S", "N", ["A", "A", "A", "B", "B", "B", "B", "B"]));
    // 3 A vs 5 B, total 8 -> |5-3|/8 = 25%
    expect(result.dichotomies[0]).toMatchObject({ winner: "N", clarityPct: 25, band: "moderate" });
  });
});

describe("buildHeadline", () => {
  it("reports no responses recorded for an empty result", () => {
    expect(buildHeadline(scoreAssessment([]))).toBe("No responses recorded.");
  });

  it("leads with the dichotomy that has the highest clarity, not the first letter", () => {
    const low = responses("EI", "E", "I", ["A", "B"]); // 0% clarity
    const high = responses("JP", "J", "P", ["A", "A", "A", "A"]); // 100% clarity
    const headline = buildHeadline(scoreAssessment([...low, ...high]));
    expect(headline).toContain("Judging");
    expect(headline).toContain("100%");
  });
});
