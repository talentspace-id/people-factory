"use client";

import { useActionState } from "react";
import Link from "next/link";
import { createInvite, type InviteState } from "./actions";

const initialState: InviteState = { status: "idle" };

export default function NewCandidatePage() {
  const [state, formAction, pending] = useActionState(createInvite, initialState);

  return (
    <>
      <div className="pf-page-header">
        <h1 className="pf-page-title">Invite a candidate</h1>
      </div>

      <div className="pf-card">
        {state.status === "created" ? (
          <>
            <p>
              Invited <strong>{state.candidateName}</strong>. No email provider is wired up yet, so
              share this link directly:
            </p>
            <div className="pf-invite-link-box">{state.inviteUrl}</div>
            <p style={{ marginTop: 16 }}>
              <Link href="/dashboard">Back to candidates</Link>
            </p>
          </>
        ) : (
          <form className="pf-form" action={formAction}>
            <div>
              <label className="pf-field-label" htmlFor="fullName">
                Full name
              </label>
              <input id="fullName" name="fullName" required className="pf-field-input" />
            </div>
            <div>
              <label className="pf-field-label" htmlFor="email">
                Email
              </label>
              <input id="email" name="email" type="email" required className="pf-field-input" />
            </div>
            {state.status === "error" && <p className="sign-in-error">{state.error}</p>}
            <button className="pf-button-primary" type="submit" disabled={pending}>
              {pending ? "Sending…" : "Send invite"}
            </button>
          </form>
        )}
      </div>
    </>
  );
}
