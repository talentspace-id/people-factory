-- Creates the application role the app connects as.
--
-- This role must NOT be a superuser and must NOT own the tables — superusers
-- bypass row-level security unconditionally, so connecting as `postgres`
-- would silently disable every RLS policy while everything still appeared to
-- work (Architecture principle 1).
--
-- Runs once, on first container start, before any migration.

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'app_user') THEN
    CREATE ROLE app_user LOGIN PASSWORD 'app_user';
  END IF;
END $$;

GRANT USAGE ON SCHEMA public TO app_user;

-- Migrations run as `postgres` and create tables AFTER this script.
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public
  GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO app_user;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public
  GRANT USAGE, SELECT ON SEQUENCES TO app_user;

GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO app_user;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO app_user;
