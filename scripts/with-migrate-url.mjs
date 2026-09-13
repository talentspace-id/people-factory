/**
 * Runs a command with DATABASE_URL swapped for MIGRATE_DATABASE_URL.
 *
 * The app connects as a non-superuser so RLS is enforced, but that role
 * cannot create tables — migrations and the seed need the owner. Prisma only
 * reads DATABASE_URL, so this swaps it for the duration of the command.
 *
 * Usage: node scripts/with-migrate-url.mjs <command> [args...]
 */

import { spawn } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";

if (existsSync(".env")) {
  for (const line of readFileSync(".env", "utf8").split("\n")) {
    const match = /^\s*([A-Z0-9_]+)\s*=\s*(.*)$/.exec(line);
    if (!match) continue;
    const [, key, rawValue] = match;
    if (key && process.env[key] === undefined) {
      process.env[key] = rawValue?.trim().replace(/^["']|["']$/g, "") ?? "";
    }
  }
}

const migrateUrl = process.env["MIGRATE_DATABASE_URL"];
if (!migrateUrl) {
  console.error(
    "MIGRATE_DATABASE_URL is not set. Copy .env.example to .env and fill it in.\n" +
      "It must point at a role that owns the tables (postgres), not the app role.",
  );
  process.exit(1);
}

const [command, ...args] = process.argv.slice(2);
if (!command) {
  console.error("usage: node scripts/with-migrate-url.mjs <command> [args...]");
  process.exit(1);
}

const child = spawn(command, args, {
  stdio: "inherit",
  shell: process.platform === "win32",
  env: { ...process.env, DATABASE_URL: migrateUrl },
});

child.on("exit", (code) => process.exit(code ?? 1));
