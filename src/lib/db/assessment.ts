/**
 * Candidate-facing assessment progress. Like candidates.ts, every function
 * takes accountId and routes through withAccount for RLS.
 */

import { withAccount } from "@/lib/db/client";

export interface AssessmentProgress {
  totalQuestions: number;
  answeredCount: number;
  nextQuestion: {
    id: string;
    dichotomy: string;
    statementA: string;
    statementB: string;
  } | null;
}

export async function getAssessmentProgress(
  accountId: string,
  assessmentId: string,
  questionSetId: string,
): Promise<AssessmentProgress> {
  return withAccount(accountId, async (tx) => {
    const [questions, responses] = await Promise.all([
      tx.question.findMany({ where: { questionSetId }, orderBy: { order: "asc" } }),
      tx.response.findMany({ where: { assessmentId }, select: { questionId: true } }),
    ]);

    const answered = new Set(responses.map((r) => r.questionId));
    const next = questions.find((q) => !answered.has(q.id)) ?? null;

    return {
      totalQuestions: questions.length,
      answeredCount: answered.size,
      nextQuestion: next
        ? {
            id: next.id,
            dichotomy: next.dichotomy,
            statementA: next.statementA,
            statementB: next.statementB,
          }
        : null,
    };
  });
}

export async function recordResponse(
  accountId: string,
  assessmentId: string,
  questionId: string,
  choice: "A" | "B",
): Promise<void> {
  await withAccount(accountId, (tx) =>
    tx.response.upsert({
      where: { assessmentId_questionId: { assessmentId, questionId } },
      create: { accountId, assessmentId, questionId, choice },
      update: { choice },
    }),
  );
}
