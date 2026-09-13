"use server";

import { redirect } from "next/navigation";
import { resolveInviteToken } from "@/lib/auth/candidate";
import { recordResponse, getAssessmentProgress } from "@/lib/db/assessment";
import { finalizeAssessment, AssessmentIncompleteError } from "@/lib/reports/build";

export async function submitAnswer(token: string, questionId: string, choice: "A" | "B") {
  const invite = await resolveInviteToken(token);
  if (!invite) redirect(`/assessment/${token}`);

  await recordResponse(invite.accountId, invite.assessmentId, questionId, choice);

  const progress = await getAssessmentProgress(invite.accountId, invite.assessmentId, invite.questionSetId);
  if (!progress.nextQuestion) {
    try {
      await finalizeAssessment(invite.accountId, invite.assessmentId);
    } catch (error) {
      if (!(error instanceof AssessmentIncompleteError)) throw error;
    }
    redirect(`/assessment/${token}/done`);
  }

  redirect(`/assessment/${token}`);
}
