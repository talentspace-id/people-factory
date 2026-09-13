"use server";

import { headers } from "next/headers";
import { requestLoginLink } from "@/lib/auth/session";

export interface SignInState {
  status: "idle" | "sent";
  devLink?: string;
}

async function baseUrl(): Promise<string> {
  if (process.env.APP_BASE_URL) return process.env.APP_BASE_URL;
  const h = await headers();
  const host = h.get("host") ?? "localhost:3000";
  const proto = h.get("x-forwarded-proto") ?? "http";
  return `${proto}://${host}`;
}

export async function requestSignIn(_prev: SignInState, formData: FormData): Promise<SignInState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  if (!email) return { status: "idle" };

  await requestLoginLink(email, await baseUrl());
  // Always report success, whether or not the email matched an interviewer —
  // avoids leaking which emails have accounts.
  return { status: "sent" };
}
