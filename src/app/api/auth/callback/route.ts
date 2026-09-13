import { NextRequest, NextResponse } from "next/server";
import { consumeLoginLink, SESSION_COOKIE } from "@/lib/auth/session";
import { SESSION_TTL_DAYS } from "@/lib/auth/tokens";

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token");
  if (!token) {
    return NextResponse.redirect(new URL("/sign-in?error=missing_token", request.url));
  }

  const sessionSecret = await consumeLoginLink(token);
  if (!sessionSecret) {
    return NextResponse.redirect(new URL("/sign-in?error=expired", request.url));
  }

  const response = NextResponse.redirect(new URL("/dashboard", request.url));
  response.cookies.set(SESSION_COOKIE, sessionSecret, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: SESSION_TTL_DAYS * 24 * 60 * 60,
    path: "/",
  });
  return response;
}
