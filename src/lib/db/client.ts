/**
 * Prisma client singleton, plus the account-context helper RLS depends on.
 */

import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export type TransactionClient = Parameters<Parameters<PrismaClient["$transaction"]>[0]>[0];

/**
 * Runs `work` inside a transaction with the account context set, so RLS
 * scopes every query in it to that account. Transaction-local on purpose — a
 * session-level setting would leak across pooled connections. Every
 * account-scoped read/write must go through here; a query outside this
 * wrapper sees zero rows rather than another account's, per prisma/rls-check.ts.
 */
export async function withAccount<T>(
  accountId: string,
  work: (tx: TransactionClient) => Promise<T>,
): Promise<T> {
  return prisma.$transaction(async (tx) => {
    await tx.$executeRawUnsafe(`SELECT set_config('app.current_account_id', $1, true)`, accountId);
    return work(tx);
  });
}
