/**
 * Bridges the DB layer to the pure scoring module: loads an assessment's
 * responses, scores them, and persists the Report. The scoring/action-item
 * modules themselves take plain data and know nothing about Prisma — this is
 * the only place that translates between the two (Architecture principle 3).
 */

import { withAccount } from "@/lib/db/client";
import { buildHeadline, scoreAssessment, type ScoredResponse } from "@/lib/scoring/mbti";
import { rankActionItems, type ActionItemTemplate } from "@/lib/scoring/action-items";

export class AssessmentIncompleteError extends Error {
  constructor(public readonly missing: number) {
    super(`${missing} question(s) still unanswered`);
  }
}

export async function finalizeAssessment(accountId: string, assessmentId: string) {
  return withAccount(accountId, async (tx) => {
    const assessment = await tx.assessment.findFirst({
      where: { id: assessmentId, accountId },
      include: {
        questionSet: { include: { questions: true, actionItemTemplates: true } },
        responses: { include: { question: true } },
      },
    });
    if (!assessment) throw new Error("Assessment not found");
    if (assessment.completedAt) {
      return tx.report.findUnique({ where: { assessmentId } });
    }

    const totalQuestions = assessment.questionSet.questions.length;
    if (assessment.responses.length < totalQuestions) {
      throw new AssessmentIncompleteError(totalQuestions - assessment.responses.length);
    }

    const scored: ScoredResponse[] = assessment.responses.map((r) => ({
      dichotomy: r.question.dichotomy,
      poleA: r.question.poleA,
      poleB: r.question.poleB,
      choice: r.choice,
    }));

    const result = scoreAssessment(scored);
    const headline = buildHeadline(result);
    const templates: ActionItemTemplate[] = assessment.questionSet.actionItemTemplates.map((t) => ({
      dichotomy: t.dichotomy,
      pole: t.pole,
      band: bandToScoringBand(t.band),
      title: t.title,
      guidance: t.guidance,
      order: t.order,
    }));
    const actionItems = rankActionItems(result, templates);

    await tx.assessment.update({
      where: { id: assessmentId },
      data: { completedAt: new Date() },
    });
    await tx.candidate.update({
      where: { id: assessment.candidateId },
      data: { status: "COMPLETED" },
    });

    return tx.report.create({
      data: {
        accountId,
        assessmentId,
        typeCode: result.typeCode,
        headline,
        dichotomyScores: result.dichotomies as unknown as object,
        actionItems: actionItems as unknown as object,
      },
    });
  });
}

/** Prisma's ClarityBand enum uses VERY_CLEAR; the scoring module uses veryClear. */
function bandToScoringBand(band: "SLIGHT" | "MODERATE" | "CLEAR" | "VERY_CLEAR") {
  return { SLIGHT: "slight", MODERATE: "moderate", CLEAR: "clear", VERY_CLEAR: "veryClear" }[band] as
    | "slight"
    | "moderate"
    | "clear"
    | "veryClear";
}
