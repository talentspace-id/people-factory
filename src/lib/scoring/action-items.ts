/**
 * Turns a scored assessment into the ranked list of interview action items an
 * interviewer actually acts on (Architecture principle 4: every report ends
 * in an action, not just a chart). Templates are data (ActionItemTemplate
 * rows, seeded per QuestionSet version, see prisma/seed.ts) — this module
 * only picks and ranks, it never hardcodes template content.
 */

import type { ClarityBand, Dichotomy, TypeResult } from "./mbti";

export interface ActionItemTemplate {
  dichotomy: Dichotomy;
  pole: string;
  band: ClarityBand;
  title: string;
  guidance: string;
  order: number;
}

export interface RankedActionItem {
  dichotomy: Dichotomy;
  pole: string;
  clarityPct: number;
  title: string;
  guidance: string;
}

/**
 * One action item per dichotomy the candidate answered (at most four),
 * ranked by clarity descending — the interviewer sees the most confident
 * signals first. A dichotomy with no matching template (a content gap, not a
 * scoring bug) is silently omitted rather than shown with placeholder text.
 */
export function rankActionItems(
  result: TypeResult,
  templates: ActionItemTemplate[],
): RankedActionItem[] {
  const byKey = new Map(templates.map((t) => [`${t.dichotomy}:${t.pole}:${t.band}`, t]));

  const items: RankedActionItem[] = [];
  for (const d of result.dichotomies) {
    if (d.total === 0) continue;
    const template = byKey.get(`${d.dichotomy}:${d.winner}:${d.band}`);
    if (!template) continue;
    items.push({
      dichotomy: d.dichotomy,
      pole: d.winner,
      clarityPct: d.clarityPct,
      title: template.title,
      guidance: template.guidance,
    });
  }

  return items.sort((a, b) => b.clarityPct - a.clarityPct);
}
