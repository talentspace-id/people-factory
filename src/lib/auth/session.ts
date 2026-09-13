/**
 * Interviewer auth: magic-link sign-in + a session cookie. No password, no
 * self-serve signup for v1 (Track B non-goal) — an interviewer's account must
 * already exist (seeded, or created by hand) before they can request a link.
 */

import { cookies } from "next/headers";
import { prisma } from "@/lib/db/client";
import {
  expiryDaysFromNow,
  expiryMinutesFromNow,
  hashSecret,
  LOGIN_TOKEN_TTL_MINUTES,
  mintSecret,
  SESSION_TTL_DAYS,
} from "./tokens";
import { sendLoginLink } from "@/lib/email/send";

export const SESSION_COOKIE = "pf_session";

/** Returns false without revealing whether the email exists, to avoid enumeration. */
export async function requestLoginLink(email: string, baseUrl: string): Promise<boolean> {
  const interviewer = await prisma.interviewer.findUnique({ where: { email } });
  if (!interviewer) return false;

  const secret = mintSecret();
  await prisma.interviewerLoginToken.create({
    data: {
      interviewerId: interviewer.id,
      tokenHash: hashSecret(secret),
      expiresAt: expiryMinutesFromNow(LOGIN_TOKEN_TTL_MINUTES),
    },
  });

  sendLoginLink(email, `${baseUrl}/api/auth/callback?token=${secret}`);
  return true;
}

export async function consumeLoginLink(secret: string): Promise<string | null> {
  const hash = hashSecret(secret);
  const token = await prisma.interviewerLoginToken.findUnique({ where: { tokenHash: hash } });
  if (!token || token.consumedAt || token.expiresAt < new Date()) return null;

  const sessionSecret = mintSecret();
  await prisma.$transaction([
    prisma.interviewerLoginToken.update({
      where: { id: token.id },
      data: { consumedAt: new Date() },
    }),
    prisma.interviewerSession.create({
      data: {
        interviewerId: token.interviewerId,
        tokenHash: hashSecret(sessionSecret),
        expiresAt: expiryDaysFromNow(SESSION_TTL_DAYS),
      },
    }),
  ]);

  return sessionSecret;
}

export interface CurrentInterviewer {
  interviewerId: string;
  accountId: string;
  email: string;
  fullName: string;
}

export async function getCurrentInterviewer(): Promise<CurrentInterviewer | null> {
  const cookieValue = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!cookieValue) return null;

  const hash = hashSecret(cookieValue);
  const session = await prisma.interviewerSession.findUnique({
    where: { tokenHash: hash },
    include: { interviewer: true },
  });
  if (!session || session.expiresAt < new Date()) return null;

  return {
    interviewerId: session.interviewer.id,
    accountId: session.interviewer.accountId,
    email: session.interviewer.email,
    fullName: session.interviewer.fullName,
  };
}
