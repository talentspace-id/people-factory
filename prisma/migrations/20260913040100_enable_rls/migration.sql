-- Row-level security for the tenant-scoped business-data tables.
--
-- NOT covered here, deliberately: `accounts` (the tenant root itself, not
-- tenant-scoped data), `interviewers` (looked up by email during sign-in
-- request, before any account context exists — the same bootstrapping
-- problem as the token tables below), `interviewer_login_tokens`,
-- `interviewer_sessions`, and `candidate_invite_tokens` (all three looked up
-- by their own unique random hash, which is the actual authorization
-- boundary for a credential table, not tenant filtering). `question_sets`,
-- `questions`, and `action_item_templates` are shared, non-tenant content.
--
-- Every table below is queried exclusively through withAccount()
-- (src/lib/db/client.ts), which sets app.current_account_id for the
-- transaction. A query that runs outside that wrapper sees zero rows rather
-- than every account's — current_setting(..., true) returns NULL when unset,
-- and account_id = NULL is never true.

ALTER TABLE "candidates" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "candidates" FORCE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON "candidates"
  USING (account_id = current_setting('app.current_account_id', true))
  WITH CHECK (account_id = current_setting('app.current_account_id', true));

ALTER TABLE "assessments" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "assessments" FORCE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON "assessments"
  USING (account_id = current_setting('app.current_account_id', true))
  WITH CHECK (account_id = current_setting('app.current_account_id', true));

ALTER TABLE "responses" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "responses" FORCE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON "responses"
  USING (account_id = current_setting('app.current_account_id', true))
  WITH CHECK (account_id = current_setting('app.current_account_id', true));

ALTER TABLE "reports" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "reports" FORCE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON "reports"
  USING (account_id = current_setting('app.current_account_id', true))
  WITH CHECK (account_id = current_setting('app.current_account_id', true));
