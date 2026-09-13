"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { resolveInviteToken } from "@/lib/auth/candidate";
import { recordResponse, getAssessmentProgress } from "@/lib/db/assessment";
import { finalizeAssessment, AssessmentIncompleteError } from "@/lib/reports/build";

export async function submitAnswer(token: string, questionId: string, choice: "A" | "B") {
  const invite = await resolveInviteToken(token);
  if (!invite) redirect(`/assessment/${token}`);

  await recordResponse(invite.accountId, invite.assessmentId, questionId, choice);

  // Every question shares the same URL (/assessment/[token]) — without this,
  // the client router cache can serve a previous question's cached RSC
  // payload instead of re-fetching.
  revalidatePath(`/assessment/${token}`);

  const progress = await getAssessmentProgress(invite.accountId, invite.assessmentId, invite.questionSetId);
  if (!progress.nextQuestion) {
    try {
      await finalizeAssessment(invite.accountId, invite.assessmentId);
      revalidatePath("/dashboard");
    } catch (error) {
      if (!(error instanceof AssessmentIncompleteError)) throw error;
    }
    redirect(`/assessment/${token}/done`);
  }

  redirect(`/assessment/${token}`);
}
