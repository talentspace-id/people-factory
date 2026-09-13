/**
 * Four-dichotomy forced-choice scoring — pure functions, no UI or DB imports
 * (Architecture principle 3). The four-letter typology (E/I, S/N, T/F, J/P) is
 * a general framework, not proprietary content; the actual question wording
 * seeded in prisma/seed.ts is original, not the licensed Myers-Briggs
 * instrument — see docs/PRODUCT-SPEC.md, "Question bank."
 *
 * Every question belongs to exactly one dichotomy and offers a binary choice
 * between that dichotomy's two poles (letter codes, e.g. "E"/"I" — not a
 * hardcoded enum, so the same code works for any pole pair a future
 * QuestionSet version defines).
 */

export type Dichotomy = "EI" | "SN" | "TF" | "JP";
export type Choice = "A" | "B";
export type ClarityBand = "slight" | "moderate" | "clear" | "veryClear";

/** Canonical order the four letters are assembled in, regardless of input order. */
export const DICHOTOMY_ORDER: readonly Dichotomy[] = ["EI", "SN", "TF", "JP"];

export const POLE_LABELS: Record<string, string> = {
  E: "Extraversion",
  I: "Introversion",
  S: "Sensing",
  N: "Intuition",
  T: "Thinking",
  F: "Feeling",
  J: "Judging",
  P: "Perceiving",
};

export interface ScoredResponse {
  dichotomy: Dichotomy;
  poleA: string;
  poleB: string;
  choice: Choice;
}

export interface DichotomyResult {
  dichotomy: Dichotomy;
  poleA: string;
  poleB: string;
  countA: number;
  countB: number;
  total: number;
  /** The letter with more responses. Ties favor poleA — arbitrary but fixed. */
  winner: string;
  /** 0-100: how lopsided the split is. 0 = perfectly even, 100 = unanimous. */
  clarityPct: number;
  band: ClarityBand;
}

export interface TypeResult {
  typeCode: string;
  dichotomies: DichotomyResult[];
}

export function clarityBand(clarityPct: number): ClarityBand {
  if (clarityPct >= 75) return "veryClear";
  if (clarityPct >= 50) return "clear";
  if (clarityPct >= 25) return "moderate";
  return "slight";
}

/**
 * Scores one completed assessment. Responses may arrive in any order and need
 * not be pre-grouped by dichotomy — this groups them itself, one bucket per
 * dichotomy that appears at least once.
 *
 * A dichotomy with zero responses (should not happen for a completed
 * assessment, but this function does not assume the caller enforced that)
 * scores as a 0/0 tie, which resolves to poleA per the winner tie-break —
 * callers that care should check total === 0 before trusting that dichotomy.
 */
export function scoreAssessment(responses: ScoredResponse[]): TypeResult {
  const byDichotomy = new Map<Dichotomy, ScoredResponse[]>();
  for (const response of responses) {
    const bucket = byDichotomy.get(response.dichotomy);
    if (bucket) bucket.push(response);
    else byDichotomy.set(response.dichotomy, [response]);
  }

  const dichotomies: DichotomyResult[] = [];
  for (const dichotomy of DICHOTOMY_ORDER) {
    const bucket = byDichotomy.get(dichotomy);
    if (!bucket || bucket.length === 0) continue;

    const poleA = bucket[0].poleA;
    const poleB = bucket[0].poleB;
    const countA = bucket.filter((r) => r.choice === "A").length;
    const countB = bucket.length - countA;
    const total = bucket.length;
    const winner = countB > countA ? poleB : poleA;
    const clarityPct = total === 0 ? 0 : Math.round((Math.abs(countA - countB) / total) * 100);

    dichotomies.push({
      dichotomy,
      poleA,
      poleB,
      countA,
      countB,
      total,
      winner,
      clarityPct,
      band: clarityBand(clarityPct),
    });
  }

  return {
    typeCode: dichotomies.map((d) => d.winner).join(""),
    dichotomies,
  };
}

/**
 * The one-line summary that leads the report — Architecture principle 4
 * (every report ends in an action, but it also has to *start* somewhere
 * legible). Picks the dichotomy the candidate answered most consistently,
 * since that's the most reliable single signal to hand an interviewer, not
 * necessarily the first letter of the type code.
 */
export function buildHeadline(result: TypeResult): string {
  if (result.dichotomies.length === 0) return "No responses recorded.";
  const clearest = result.dichotomies.reduce((max, d) => (d.clarityPct > max.clarityPct ? d : max));
  const label = POLE_LABELS[clearest.winner] ?? clearest.winner;
  return `${label} is this candidate's clearest signal (${clearest.clarityPct}% clarity).`;
}
