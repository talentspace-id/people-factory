"use server";

import { headers } from "next/headers";
import { getCurrentInterviewer } from "@/lib/auth/session";
import { inviteCandidate } from "@/lib/db/candidates";

export interface InviteState {
  status: "idle" | "created" | "error";
  inviteUrl?: string;
  candidateName?: string;
  error?: string;
}

async function baseUrl(): Promise<string> {
  if (process.env.APP_BASE_URL) return process.env.APP_BASE_URL;
  const h = await headers();
  const host = h.get("host") ?? "localhost:3000";
  const proto = h.get("x-forwarded-proto") ?? "http";
  return `${proto}://${host}`;
}

export async function createInvite(_prev: InviteState, formData: FormData): Promise<InviteState> {
  const interviewer = await getCurrentInterviewer();
  if (!interviewer) return { status: "error", error: "Not signed in." };

  const fullName = String(formData.get("fullName") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  if (!fullName || !email) return { status: "error", error: "Name and email are required." };

  const { inviteUrl } = await inviteCandidate(
    interviewer.accountId,
    interviewer.interviewerId,
    { fullName, email },
    await baseUrl(),
  );

  return { status: "created", inviteUrl, candidateName: fullName };
}
