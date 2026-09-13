/**
 * Interviewer-facing candidate operations. Every function takes accountId
 * explicitly and routes through withAccount, so a wrong or missing accountId
 * fails closed (RLS returns zero rows) rather than leaking across tenants.
 */

import { withAccount } from "@/lib/db/client";
import {
  expiryDaysFromNow,
  hashSecret,
  INVITE_TOKEN_TTL_DAYS,
  mintSecret,
} from "@/lib/auth/tokens";
import { sendCandidateInvite } from "@/lib/email/send";

export async function listCandidates(accountId: string) {
  return withAccount(accountId, (tx) =>
    tx.candidate.findMany({
      where: { accountId },
      orderBy: { createdAt: "desc" },
    }),
  );
}

export interface NewCandidateInput {
  fullName: string;
  email: string;
}

export async function inviteCandidate(
  accountId: string,
  interviewerId: string,
  input: NewCandidateInput,
  baseUrl: string,
) {
  const secret = mintSecret();

  const candidate = await withAccount(accountId, async (tx) => {
    const created = await tx.candidate.create({
      data: {
        accountId,
        invitedByInterviewerId: interviewerId,
        fullName: input.fullName,
        email: input.email,
      },
    });
    await tx.candidateInviteToken.create({
      data: {
        accountId,
        candidateId: created.id,
        tokenHash: hashSecret(secret),
        expiresAt: expiryDaysFromNow(INVITE_TOKEN_TTL_DAYS),
      },
    });
    return created;
  });

  const inviteUrl = `${baseUrl}/assessment/${secret}`;
  sendCandidateInvite(input.email, input.fullName, inviteUrl);
  return { candidate, inviteUrl };
}

export async function getCandidateWithReport(accountId: string, candidateId: string) {
  return withAccount(accountId, (tx) =>
    tx.candidate.findFirst({
      where: { id: candidateId, accountId },
      include: {
        assessments: {
          orderBy: { startedAt: "desc" },
          take: 1,
          include: { report: true },
        },
      },
    }),
  );
}
