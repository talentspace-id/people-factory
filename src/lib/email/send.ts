/**
 * No email provider wired yet (see README) — links are logged to the server
 * console in dev, and returned in the response body so a smoke test or a
 * developer without console access can still get at them. Swap this for a
 * real provider (Resend, SES, ...) without touching any caller.
 */

export function sendLoginLink(email: string, url: string): void {
  console.log(`[dev email] sign-in link for ${email}: ${url}`);
}

export function sendCandidateInvite(email: string, fullName: string, url: string): void {
  console.log(`[dev email] assessment invite for ${fullName} <${email}>: ${url}`);
}
