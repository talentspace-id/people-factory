# People Factory

## What this is

A candidate-facing personality assessment product — separate from, but
visually matching, the TalentSpace/SGA workforce-intelligence platform (see
`DESIGN.md`).

**Flow:** an interviewer invites a candidate → the candidate signs in via
the invite link and answers a forced-choice question set (four dichotomies:
Extraversion/Introversion, Sensing/Intuition, Thinking/Feeling,
Judging/Perceiving) → the interviewer gets a generated report of the
candidate's type breakdown plus ranked interview action items. The
candidate does not see their own report — see `docs/PRODUCT-SPEC.md`,
"Report visibility."

This is deliberately a much smaller product than SGA: no HR dashboard, no
employee/division data model, no skill-gap scoring engine. Just: interviewer
auth, candidate invites, a question flow, scoring/report generation, and
the report view.

## Design system

Read `DESIGN.md` before writing any UI — colors, fonts, shape/spacing, and
the auth-shell pattern, all carried over from SGA. Match that look; don't
reinvent it or pull in a different color/font system.

## Tech stack

- Next.js 15 (App Router) + TypeScript, strict mode
- Postgres via Prisma (Supabase in production; local Postgres via Docker for dev)
- Vercel for hosting
- Vitest for the scoring module's unit tests

## Architecture principles (non-negotiable)

1. **Multi-tenant from day one.** Every table holding account-scoped
   business data (`Candidate`, `Assessment`, `Response`, `Report`) carries
   `accountId` directly and is protected by Postgres row-level security —
   see `prisma/migrations/.../enable_rls/migration.sql` for exactly which
   tables and why some (auth/token tables, the shared question bank)
   deliberately aren't. Every read/write to an RLS-protected table must go
   through `withAccount()` (`src/lib/db/client.ts`); a query outside it
   sees zero rows, never another account's. Verify with `npm run db:rls-check`.
2. **The question bank and its action-item content are data, not code** —
   versioned `QuestionSet` rows (`prisma/skills-library.ts` seeds v1), not
   hardcoded strings in application logic. Growing the bank or adding a
   second instrument is a seed change, never a migration.
3. **Scoring logic is isolated and pure-function-tested** —
   `src/lib/scoring/mbti.ts` and `action-items.ts` take plain data, know
   nothing about Prisma or Next.js, and are covered by Vitest. Only
   `src/lib/reports/build.ts` bridges the DB to the scoring module.
4. **Every report ends in an action, not just a chart** — the report page
   leads with a ranked action-item list for the interviewer, not just the
   dichotomy bars.

## Coding conventions

- TypeScript strict mode on
- Prefer server components / server actions where Next.js allows it; keep
  client components for interactivity only (the sign-in and invite forms
  are the two client components in this codebase, both for `useActionState`)
- Small, reviewable commits with descriptive messages
- No new dependency without a one-line justification in the commit message

## Reference material

- `DESIGN.md` — the visual design handoff this was built from
- `docs/PRODUCT-SPEC.md` — the open questions from the original brief
  (account model, report visibility, question bank sourcing) and how they
  were resolved
