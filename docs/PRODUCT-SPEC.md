# Product spec — People Factory v1

Candidate-facing personality assessment: a company/interviewer invites a
candidate, the candidate answers a forced-choice question set, and the
interviewer gets a type breakdown plus ranked interview action items.
Visually paired with TalentSpace/SGA (see `DESIGN.md`) but a separate,
smaller product — no HR dashboard, no employee/division data model, no
skill-gap scoring engine.

This file records the decisions the original design handoff (see git
history / `CLAUDE.md`) left open, and why.

## Account model: interviewer-invited, not self-registered

A company account creates interviewer users; an interviewer invites a
candidate by name + email, which mints a single-purpose assessment link.
Candidates never self-register. This mirrors SGA's B2B `account_id`-scoped
multi-tenant model (`CLAUDE.md`, Architecture principle 1) and makes the
company the data controller for the candidate's assessment responses — the
platform is the processor, same relationship SGA already documents for its
own B2B track.

Consequence for schema: `Candidate`, `Assessment`, `Response`, and `Report`
all carry `accountId` directly and are RLS-protected (see
`prisma/migrations/.../enable_rls`). `Interviewer` and the token tables are
deliberately **not** RLS-scoped — see the migration's own comment for why
(auth has to look things up before an account context exists).

## Report visibility: interviewer only

The candidate is told they've completed the assessment; they do not see
their own type, dichotomy breakdown, or action items — only the inviting
interviewer/account does. This matches the stated purpose (prep for an
interview, not a candidate-facing personality report) and avoids a second
UU PDP consent flow for v1: the candidate consents to being assessed as
part of the recruitment process, not to receiving or being shown a
psychological profile of themselves. Revisit if this product ever adds a
candidate-facing summary — that's a distinct processing purpose and needs
its own opt-in, same reasoning as SGA's individual-report vs.
employer-discoverability split.

## Question bank: original content, not the licensed MBTI instrument

The four-dichotomy framework (Extraversion/Introversion,
Sensing/Intuition, Thinking/Feeling, Judging/Perceiving) is a general
typology, not proprietary. The actual Myers-Briggs Type Indicator®
question set is licensed, trademarked content owned by The Myers-Briggs
Company — this product does not reproduce it. `prisma/skills-library.ts`
is original wording covering the same four dichotomies, seeded as v1's
`QuestionSet` (32 questions, 8 per dichotomy).

This is thin relative to the ~300-question target floated in the original
brief, deliberately: the question bank is data (a `QuestionSet` version),
not code, so growing it — or adding a second, independent instrument as its
own `QuestionSet` version — is a seed/content change, never a migration or
a redeploy (`CLAUDE.md`, Architecture principle 2).

## Scoring

Each question is a forced choice between two poles of one dichotomy. A
completed assessment tallies choices per dichotomy; the pole with more
answers wins, ties break toward the first pole (`EI`→E, `SN`→S, `TF`→T,
`JP`→J) — arbitrary but fixed and documented in
`src/lib/scoring/mbti.ts`. "Clarity" is the percentage imbalance between the
two poles (0% = even split, 100% = unanimous), bucketed into four bands
(slight/moderate/clear/veryClear) that double as which
`ActionItemTemplate` row a dichotomy's result maps to.

Interview action items are one per dichotomy the candidate answered (at
most four), ranked by clarity descending, so the interviewer sees the most
confident signal first (`CLAUDE.md`, Architecture principle 4: every
report ends in an action). A dichotomy with no matching template is
omitted rather than shown with placeholder text — see
`src/lib/scoring/action-items.test.ts`.

## What's out of scope for v1

No candidate self-registration, no candidate-facing report, no admin UI
for editing the question bank (it's a seed script), no email provider
(magic links and invite links are logged to the console in dev — see
README), no billing.
