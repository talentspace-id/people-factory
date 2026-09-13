"use client";

import { useActionState } from "react";
import AuthIllustration from "./AuthIllustration";
import { requestSignIn, type SignInState } from "./actions";
import "./sign-in.css";

const initialState: SignInState = { status: "idle" };

export default function SignInPage() {
  const [state, formAction, pending] = useActionState(requestSignIn, initialState);

  return (
    <div className="auth-shell">
      <div className="auth-form-side">
        <div className="auth-form-side-inner">
          <div className="auth-wordmark">
            <span className="auth-wordmark-mark">PF</span>
            <span>People Factory</span>
          </div>

          {state.status === "sent" ? (
            <>
              <h1 className="sign-in-title">Check your email</h1>
              <p className="sign-in-subtitle">
                We sent a sign-in link. It expires in 15 minutes.
              </p>
              <div className="sign-in-notice sign-in-dev">
                <p>
                  No email provider is wired up yet — in dev, the link is printed to the
                  server console instead of sent.
                </p>
              </div>
            </>
          ) : (
            <>
              <h1 className="sign-in-title">Sign in</h1>
              <p className="sign-in-subtitle">
                Enter your interviewer account email — we'll send a sign-in link.
              </p>
              <form className="sign-in-form" action={formAction}>
                <label className="sign-in-label" htmlFor="email">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="sign-in-input"
                  placeholder="you@company.id"
                />
                <button className="sign-in-button" type="submit" disabled={pending}>
                  {pending ? <span className="sign-in-spinner" /> : "Send sign-in link"}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
      <AuthIllustration />
    </div>
  );
}
