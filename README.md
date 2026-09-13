# People Factory

Candidate personality assessment: an interviewer invites a candidate, the
candidate answers a short forced-choice question set, and the interviewer
gets a type breakdown plus ranked interview action items.

- [`CLAUDE.md`](CLAUDE.md) — engineering brief
- [`DESIGN.md`](DESIGN.md) — visual design handoff (colors, fonts, the
  auth-shell pattern), carried over from TalentSpace/SGA
- [`docs/PRODUCT-SPEC.md`](docs/PRODUCT-SPEC.md) — the open product
  questions from the original brief and how they were resolved (account
  model, report visibility, question bank sourcing)

## Run it locally

Requires Node 20+ and either Docker or a local Postgres 16.

```bash
npm install
docker compose up -d db      # Postgres on :5432, creates the app role
npm run db:migrate           # apply schema + RLS policies
npm run db:seed              # one question set (32 questions), a demo account
```

The seed prints a line like:

```
Sign in as: demo@peoplefactory.id   <- request a link at /sign-in with this email
```

Create `.env` from [`.env.example`](.env.example), then:

```bash
npm run dev                  # http://localhost:3000
```

Sign in with the demo interviewer's email. No email provider is wired up
yet (see below), so the sign-in link and every candidate invite link are
printed to the server console instead of sent — copy them from there.

### The one thing that will bite you

**The app must connect as a non-superuser.** Superusers bypass row-level
security unconditionally, so connecting as `postgres` leaves every policy
in place while enforcing none of them. `docker-compose.yml` sets this up
correctly: migrations and the seed run as `postgres` (which owns the
tables), the app connects as `app_user`.

Verify isolation any time:

```bash
npm run db:rls-check
```

It asserts three things: an account sees only its own candidate, a query
with **no** account context returns zero rows rather than everything, and a
cross-account write is rejected. Run it as `app_user`, not `postgres` — as
a superuser it passes while proving nothing.

## What works today

| | |
|---|---|
| Scoring engine | Four-dichotomy forced-choice tally, signed clarity percentage per axis, four confidence bands. Pure functions, no UI or DB imports. |
| Question bank | One versioned `QuestionSet`, seeded with 32 original questions (not the licensed MBTI instrument — see `docs/PRODUCT-SPEC.md`) |
| Reports | Type code, per-dichotomy breakdown, and a ranked interview action-item list, generated server-side once an assessment is complete |
| Data layer | Postgres via Prisma, RLS on every account-scoped table |
| Auth | Interviewer magic-link sign-in; candidates use a single-purpose invite link, no password either side |
| Dashboard | Candidate list with status, an invite form, and the report view |

Not built yet: an email provider (links print to the console), self-serve
company signup, billing, and any candidate-facing view of their own report
(deliberate — see `docs/PRODUCT-SPEC.md`, "Report visibility").

## Commands

| | |
|---|---|
| `npm run dev` | Next.js dev server |
| `npm test` | Vitest — the scoring and action-item ranking logic |
| `npm run typecheck` | TypeScript, strict |
| `npm run db:migrate` | Apply migrations |
| `npm run db:seed` | Seed the question set and a demo account |
| `npm run db:rls-check` | Prove tenant isolation holds |
