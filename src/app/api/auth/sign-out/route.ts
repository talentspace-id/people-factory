import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/client";
import { hashSecret } from "@/lib/auth/tokens";
import { SESSION_COOKIE } from "@/lib/auth/session";

export async function POST(request: NextRequest) {
  const cookieValue = request.cookies.get(SESSION_COOKIE)?.value;
  if (cookieValue) {
    await prisma.interviewerSession.deleteMany({ where: { tokenHash: hashSecret(cookieValue) } });
  }

  const response = NextResponse.redirect(new URL("/sign-in", request.url));
  response.cookies.delete(SESSION_COOKIE);
  return response;
}
