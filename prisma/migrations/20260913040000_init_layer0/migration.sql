-- CreateEnum
CREATE TYPE "Dichotomy" AS ENUM ('EI', 'SN', 'TF', 'JP');

-- CreateEnum
CREATE TYPE "ClarityBand" AS ENUM ('SLIGHT', 'MODERATE', 'CLEAR', 'VERY_CLEAR');

-- CreateEnum
CREATE TYPE "CandidateStatus" AS ENUM ('INVITED', 'IN_PROGRESS', 'COMPLETED');

-- CreateEnum
CREATE TYPE "Choice" AS ENUM ('A', 'B');

-- CreateTable
CREATE TABLE "accounts" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "interviewers" (
    "id" TEXT NOT NULL,
    "account_id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "full_name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "interviewers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "interviewer_login_tokens" (
    "id" TEXT NOT NULL,
    "interviewer_id" TEXT NOT NULL,
    "token_hash" TEXT NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "consumed_at" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "interviewer_login_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "interviewer_sessions" (
    "id" TEXT NOT NULL,
    "interviewer_id" TEXT NOT NULL,
    "token_hash" TEXT NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "interviewer_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "question_sets" (
    "id" TEXT NOT NULL,
    "version" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "question_sets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "questions" (
    "id" TEXT NOT NULL,
    "question_set_id" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "dichotomy" "Dichotomy" NOT NULL,
    "poleA" TEXT NOT NULL,
    "poleB" TEXT NOT NULL,
    "statement_a" TEXT NOT NULL,
    "statement_b" TEXT NOT NULL,

    CONSTRAINT "questions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "action_item_templates" (
    "id" TEXT NOT NULL,
    "question_set_id" TEXT NOT NULL,
    "dichotomy" "Dichotomy" NOT NULL,
    "pole" TEXT NOT NULL,
    "band" "ClarityBand" NOT NULL,
    "title" TEXT NOT NULL,
    "guidance" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "action_item_templates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "candidates" (
    "id" TEXT NOT NULL,
    "account_id" TEXT NOT NULL,
    "invited_by_interviewer_id" TEXT NOT NULL,
    "full_name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "status" "CandidateStatus" NOT NULL DEFAULT 'INVITED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "candidates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "candidate_invite_tokens" (
    "id" TEXT NOT NULL,
    "account_id" TEXT NOT NULL,
    "candidate_id" TEXT NOT NULL,
    "token_hash" TEXT NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "candidate_invite_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "assessments" (
    "id" TEXT NOT NULL,
    "account_id" TEXT NOT NULL,
    "candidate_id" TEXT NOT NULL,
    "question_set_id" TEXT NOT NULL,
    "started_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completed_at" TIMESTAMP(3),

    CONSTRAINT "assessments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "responses" (
    "id" TEXT NOT NULL,
    "account_id" TEXT NOT NULL,
    "assessment_id" TEXT NOT NULL,
    "question_id" TEXT NOT NULL,
    "choice" "Choice" NOT NULL,
    "answered_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "responses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reports" (
    "id" TEXT NOT NULL,
    "account_id" TEXT NOT NULL,
    "assessment_id" TEXT NOT NULL,
    "type_code" TEXT NOT NULL,
    "headline" TEXT NOT NULL,
    "dichotomy_scores" JSONB NOT NULL,
    "action_items" JSONB NOT NULL,
    "generated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "reports_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "interviewers_email_key" ON "interviewers"("email");

-- CreateIndex
CREATE INDEX "interviewers_account_id_idx" ON "interviewers"("account_id");

-- CreateIndex
CREATE UNIQUE INDEX "interviewer_login_tokens_token_hash_key" ON "interviewer_login_tokens"("token_hash");

-- CreateIndex
CREATE INDEX "interviewer_login_tokens_interviewer_id_idx" ON "interviewer_login_tokens"("interviewer_id");

-- CreateIndex
CREATE UNIQUE INDEX "interviewer_sessions_token_hash_key" ON "interviewer_sessions"("token_hash");

-- CreateIndex
CREATE INDEX "interviewer_sessions_interviewer_id_idx" ON "interviewer_sessions"("interviewer_id");

-- CreateIndex
CREATE UNIQUE INDEX "question_sets_version_key" ON "question_sets"("version");

-- CreateIndex
CREATE INDEX "questions_question_set_id_idx" ON "questions"("question_set_id");

-- CreateIndex
CREATE UNIQUE INDEX "questions_question_set_id_order_key" ON "questions"("question_set_id", "order");

-- CreateIndex
CREATE INDEX "action_item_templates_question_set_id_idx" ON "action_item_templates"("question_set_id");

-- CreateIndex
CREATE UNIQUE INDEX "action_item_templates_question_set_id_dichotomy_pole_band_key" ON "action_item_templates"("question_set_id", "dichotomy", "pole", "band");

-- CreateIndex
CREATE INDEX "candidates_account_id_idx" ON "candidates"("account_id");

-- CreateIndex
CREATE UNIQUE INDEX "candidate_invite_tokens_token_hash_key" ON "candidate_invite_tokens"("token_hash");

-- CreateIndex
CREATE INDEX "candidate_invite_tokens_candidate_id_idx" ON "candidate_invite_tokens"("candidate_id");

-- CreateIndex
CREATE INDEX "assessments_account_id_idx" ON "assessments"("account_id");

-- CreateIndex
CREATE INDEX "assessments_candidate_id_idx" ON "assessments"("candidate_id");

-- CreateIndex
CREATE INDEX "responses_account_id_idx" ON "responses"("account_id");

-- CreateIndex
CREATE UNIQUE INDEX "responses_assessment_id_question_id_key" ON "responses"("assessment_id", "question_id");

-- CreateIndex
CREATE UNIQUE INDEX "reports_assessment_id_key" ON "reports"("assessment_id");

-- CreateIndex
CREATE INDEX "reports_account_id_idx" ON "reports"("account_id");

-- AddForeignKey
ALTER TABLE "interviewers" ADD CONSTRAINT "interviewers_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "accounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "interviewer_login_tokens" ADD CONSTRAINT "interviewer_login_tokens_interviewer_id_fkey" FOREIGN KEY ("interviewer_id") REFERENCES "interviewers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "interviewer_sessions" ADD CONSTRAINT "interviewer_sessions_interviewer_id_fkey" FOREIGN KEY ("interviewer_id") REFERENCES "interviewers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "questions" ADD CONSTRAINT "questions_question_set_id_fkey" FOREIGN KEY ("question_set_id") REFERENCES "question_sets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "action_item_templates" ADD CONSTRAINT "action_item_templates_question_set_id_fkey" FOREIGN KEY ("question_set_id") REFERENCES "question_sets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "candidates" ADD CONSTRAINT "candidates_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "accounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "candidates" ADD CONSTRAINT "candidates_invited_by_interviewer_id_fkey" FOREIGN KEY ("invited_by_interviewer_id") REFERENCES "interviewers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "candidate_invite_tokens" ADD CONSTRAINT "candidate_invite_tokens_candidate_id_fkey" FOREIGN KEY ("candidate_id") REFERENCES "candidates"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assessments" ADD CONSTRAINT "assessments_candidate_id_fkey" FOREIGN KEY ("candidate_id") REFERENCES "candidates"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assessments" ADD CONSTRAINT "assessments_question_set_id_fkey" FOREIGN KEY ("question_set_id") REFERENCES "question_sets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "responses" ADD CONSTRAINT "responses_assessment_id_fkey" FOREIGN KEY ("assessment_id") REFERENCES "assessments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "responses" ADD CONSTRAINT "responses_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "questions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reports" ADD CONSTRAINT "reports_assessment_id_fkey" FOREIGN KEY ("assessment_id") REFERENCES "assessments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
