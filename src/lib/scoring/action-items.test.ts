import { describe, expect, it } from "vitest";
import { scoreAssessment, type ScoredResponse } from "./mbti";
import { rankActionItems, type ActionItemTemplate } from "./action-items";

const TEMPLATES: ActionItemTemplate[] = [
  { dichotomy: "EI", pole: "E", band: "veryClear", title: "E very clear", guidance: "g", order: 0 },
  { dichotomy: "EI", pole: "E", band: "clear", title: "E clear", guidance: "g", order: 0 },
  { dichotomy: "JP", pole: "P", band: "moderate", title: "P moderate", guidance: "g", order: 0 },
];

function responses(
  dichotomy: ScoredResponse["dichotomy"],
  poleA: string,
  poleB: string,
  choices: ("A" | "B")[],
): ScoredResponse[] {
  return choices.map((choice) => ({ dichotomy, poleA, poleB, choice }));
}

describe("rankActionItems", () => {
  it("picks the template matching the winning pole's actual clarity band", () => {
    const ei = responses("EI", "E", "I", ["A", "A", "A", "B"]); // 50% clarity -> "clear"
    const result = scoreAssessment(ei);
    const items = rankActionItems(result, TEMPLATES);
    expect(items).toHaveLength(1);
    expect(items[0].title).toBe("E clear");
  });

  it("omits a dichotomy the template table has no content for, rather than showing a placeholder", () => {
    const tf = responses("TF", "T", "F", ["A", "A"]);
    const result = scoreAssessment(tf);
    expect(rankActionItems(result, TEMPLATES)).toHaveLength(0);
  });

  it("ranks by clarity descending, independent of dichotomy order", () => {
    const eiVeryClear = responses("EI", "E", "I", ["A", "A", "A", "A"]); // 100% -> veryClear
    const jpModerate = responses("JP", "J", "P", ["B", "B", "B", "B", "B", "A", "A", "A"]); // 5B/3A of 8 -> 25% moderate
    const result = scoreAssessment([...jpModerate, ...eiVeryClear]);
    const items = rankActionItems(result, TEMPLATES);
    expect(items.map((i) => i.title)).toEqual(["E very clear", "P moderate"]);
  });
});
