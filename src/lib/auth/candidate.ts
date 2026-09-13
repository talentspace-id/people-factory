/**
 * Resolves a candidate's invite link. Unlike an interviewer login token this
 * is not single-use — a candidate may leave and come back mid-assessment —
 * so only expiry is checked, not a consumed flag. The underlying Assessment
 * row is what actually tracks progress.
 *
 * candidate_invite_tokens itself carries no RLS policy (see prisma migration
 * .../enable_rls): it's looked up by its own unique random hash before any
 * account context exists, the same way interviewer login tokens are. Every
 * other table touched here — Assessment, Candidate — IS RLS-protected, so
 * once the token lookup gives us accountId, everything past that point runs
 * through withAccount.
 */

import { prisma, withAccount } from "@/lib/db/client";
import { hashSecret } from "./tokens";

export interface ResolvedInvite {
  accountId: string;
  candidateId: string;
  assessmentId: string;
  questionSetId: string;
}

export async function resolveInviteToken(secret: string): Promise<ResolvedInvite | null> {
  const hash = hashSecret(secret);
  const invite = await prisma.candidateInviteToken.findUnique({ where: { tokenHash: hash } });
  if (!invite || invite.expiresAt < new Date()) return null;

  const { accountId, candidateId } = invite;

  const assessment = await withAccount(accountId, async (tx) => {
    const existing = await tx.assessment.findFirst({
      where: { candidateId },
      orderBy: { startedAt: "desc" },
    });
    if (existing) return existing;

    const activeQuestionSet = await prisma.questionSet.findFirst({ where: { isActive: true } });
    if (!activeQuestionSet) return null;

    const created = await tx.assessment.create({
      data: { accountId, candidateId, questionSetId: activeQuestionSet.id },
    });
    await tx.candidate.update({ where: { id: candidateId }, data: { status: "IN_PROGRESS" } });
    return created;
  });

  if (!assessment) return null;

  return {
    accountId,
    candidateId,
    assessmentId: assessment.id,
    questionSetId: assessment.questionSetId,
  };
}
