import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { getCurrentInterviewer } from "@/lib/auth/session";
import "./interviewer.css";

export default async function InterviewerLayout({ children }: { children: ReactNode }) {
  const interviewer = await getCurrentInterviewer();
  if (!interviewer) redirect("/sign-in");

  return (
    <div className="interviewer-shell">
      <header className="interviewer-topbar">
        <div className="interviewer-wordmark">
          <span className="auth-wordmark-mark">PF</span>
          <span>People Factory</span>
        </div>
        <div className="interviewer-topbar-right">
          <span className="interviewer-email">{interviewer.email}</span>
          <form action="/api/auth/sign-out" method="post">
            <button className="interviewer-signout" type="submit">
              Sign out
            </button>
          </form>
        </div>
      </header>
      <main className="interviewer-main">{children}</main>
    </div>
  );
}
