/**
 * Seeds one active QuestionSet (v1) with its questions and action-item
 * content, plus a demo account/interviewer so `npm run dev` has something to
 * sign in as. Run via `npm run db:seed` (swaps DATABASE_URL for
 * MIGRATE_DATABASE_URL — see scripts/with-migrate-url.mjs).
 */

import { PrismaClient } from "@prisma/client";
import { SEED_QUESTIONS, buildActionItemTemplates } from "./skills-library";

const prisma = new PrismaClient();

async function main() {
  const questionSet = await prisma.questionSet.create({
    data: {
      version: 1,
      name: "People Factory v1 — four-dichotomy forced choice",
      isActive: true,
    },
  });

  await prisma.question.createMany({
    data: SEED_QUESTIONS.map((q, i) => ({
      questionSetId: questionSet.id,
      order: i + 1,
      ...q,
    })),
  });

  await prisma.actionItemTemplate.createMany({
    data: buildActionItemTemplates().map((t) => ({ ...t, questionSetId: questionSet.id })),
  });

  const account = await prisma.account.create({ data: { name: "Demo Company" } });
  const interviewer = await prisma.interviewer.create({
    data: { accountId: account.id, email: "demo@peoplefactory.id", fullName: "Demo Interviewer" },
  });

  console.log(`Seeded question set v${questionSet.version} (${SEED_QUESTIONS.length} questions).`);
  console.log(`Demo account: ${account.id}`);
  console.log(`Sign in as: ${interviewer.email}   <- request a link at /sign-in with this email`);
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (err) => {
    console.error(err);
    await prisma.$disconnect();
    process.exit(1);
  });
