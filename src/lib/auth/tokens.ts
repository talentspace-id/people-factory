/**
 * Token minting and hashing, shared by the interviewer magic link, the
 * interviewer session cookie, and the candidate invite link. Only hashes are
 * ever stored — a database leak yields no usable credential, since the
 * plaintext exists once, in the link itself.
 */

import { createHash, randomBytes, timingSafeEqual } from "node:crypto";

/** 32 bytes of CSPRNG entropy, url-safe. */
export function mintSecret(): string {
  return randomBytes(32).toString("base64url");
}

/**
 * SHA-256, not bcrypt/argon2 — deliberate: these are 256-bit random secrets,
 * not user-chosen passwords, so there's no dictionary to attack and a slow
 * KDF would only add latency.
 */
export function hashSecret(secret: string): string {
  return createHash("sha256").update(secret).digest("hex");
}

export function secretMatches(candidate: string, storedHash: string): boolean {
  const a = Buffer.from(hashSecret(candidate), "hex");
  const b = Buffer.from(storedHash, "hex");
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

/** Short: a sign-in link is a single-use credential. */
export const LOGIN_TOKEN_TTL_MINUTES = 15;
export const SESSION_TTL_DAYS = 30;
/** Long relative to a login link — a candidate may not open the email same-day. */
export const INVITE_TOKEN_TTL_DAYS = 14;

export function expiryMinutesFromNow(minutes: number, now: Date = new Date()): Date {
  return new Date(now.getTime() + minutes * 60_000);
}

export function expiryDaysFromNow(days: number, now: Date = new Date()): Date {
  return new Date(now.getTime() + days * 24 * 60 * 60_000);
}
