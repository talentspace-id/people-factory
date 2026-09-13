/**
 * Proves row-level security actually isolates tenants. Must run as the
 * app_user role (DATABASE_URL) — as a superuser this passes while proving
 * nothing, since superusers bypass RLS unconditionally.
 *
 * Asserts three things:
 *   1. A query with no account context set returns zero rows, not everything.
 *   2. An account sees only its own candidate.
 *   3. Writing a candidate under another account's context is rejected.
 */

import { existsSync, readFileSync } from "node:fs";
import { PrismaClient } from "@prisma/client";

// No dotenv dependency in this project — read .env by hand, same as
// scripts/with-migrate-url.mjs, since this script needs both URLs at once
// rather than one swapped for the other.
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

const appUrl = process.env.DATABASE_URL;
const migrateUrl = process.env.MIGRATE_DATABASE_URL;
if (!appUrl || !migrateUrl) {
  console.error("Set both DATABASE_URL and MIGRATE_DATABASE_URL (see .env.example).");
  process.exit(1);
}

const admin = new PrismaClient({ datasources: { db: { url: migrateUrl } } });
const app = new PrismaClient({ datasources: { db: { url: appUrl } } });

async function setAccount(client: PrismaClient, accountId: string | null) {
  await client.$executeRawUnsafe(`SELECT set_config('app.current_account_id', $1, true)`, accountId ?? "");
}

async function main() {
  const [accountA, accountB] = await Promise.all([
    admin.account.create({ data: { name: "RLS check A" } }),
    admin.account.create({ data: { name: "RLS check B" } }),
  ]);
  const interviewer = await admin.interviewer.create({
    data: { accountId: accountA.id, email: `rls-check-${Date.now()}@example.test`, fullName: "RLS Check" },
  });
  const candidateA = await admin.candidate.create({
    data: {
      accountId: accountA.id,
      invitedByInterviewerId: interviewer.id,
      fullName: "Candidate A",
      email: "candidate-a@example.test",
    },
  });

  try {
    await app.$transaction(async (tx) => {
      await setAccount(tx as unknown as PrismaClient, null);
      const rows = await tx.candidate.findMany();
      if (rows.length !== 0) throw new Error(`expected 0 rows with no account context, got ${rows.length}`);
    });
    console.log("✓ no account context -> zero rows");

    await app.$transaction(async (tx) => {
      await setAccount(tx as unknown as PrismaClient, accountA.id);
      const rows = await tx.candidate.findMany();
      if (rows.length !== 1 || rows[0].id !== candidateA.id) {
        throw new Error(`expected only candidate A, got ${JSON.stringify(rows.map((r) => r.id))}`);
      }
    });
    console.log("✓ account sees only its own candidate");

    let rejected = false;
    try {
      await app.$transaction(async (tx) => {
        await setAccount(tx as unknown as PrismaClient, accountB.id);
        await tx.candidate.create({
          data: {
            accountId: accountA.id, // writing account A's data under account B's context
            invitedByInterviewerId: interviewer.id,
            fullName: "Should be rejected",
            email: "should-be-rejected@example.test",
          },
        });
      });
    } catch {
      rejected = true;
    }
    if (!rejected) throw new Error("cross-account write was NOT rejected");
    console.log("✓ cross-account write rejected");
  } finally {
    await admin.candidate.deleteMany({ where: { accountId: { in: [accountA.id, accountB.id] } } });
    await admin.interviewer.deleteMany({ where: { id: interviewer.id } });
    await admin.account.deleteMany({ where: { id: { in: [accountA.id, accountB.id] } } });
  }
}

main()
  .then(() => Promise.all([admin.$disconnect(), app.$disconnect()]))
  .catch(async (err) => {
    console.error("✗", err.message ?? err);
    await Promise.all([admin.$disconnect(), app.$disconnect()]);
    process.exit(1);
  });
