-- Migration 0005: Build 2 foundation
-- Adds the columns and tables the Build 2 PRs (Recruiting, Stats, News, Awards,
-- NIL, Media, Performance, Coach Lynx persistence, Social linking) need.
-- Postgres dialect. Idempotent (uses IF NOT EXISTS).

-- ─── 1. athlete_profiles — new presentation + recruiting columns ─────────────
ALTER TABLE "athlete_profiles" ADD COLUMN IF NOT EXISTS "headshotUrl" text;
ALTER TABLE "athlete_profiles" ADD COLUMN IF NOT EXISTS "actionPhotoUrl" text;
ALTER TABLE "athlete_profiles" ADD COLUMN IF NOT EXISTS "statScreenshotUrl" text;
ALTER TABLE "athlete_profiles" ADD COLUMN IF NOT EXISTS "jerseyNumber" smallint;
ALTER TABLE "athlete_profiles" ADD COLUMN IF NOT EXISTS "dominantHand" varchar(16);
ALTER TABLE "athlete_profiles" ADD COLUMN IF NOT EXISTS "athlynxStarRating" smallint;
ALTER TABLE "athlete_profiles" ADD COLUMN IF NOT EXISTS "athleticismScore" real;
ALTER TABLE "athlete_profiles" ADD COLUMN IF NOT EXISTS "published" boolean NOT NULL DEFAULT false;
ALTER TABLE "athlete_profiles" ADD COLUMN IF NOT EXISTS "publishedAt" timestamp;
ALTER TABLE "athlete_profiles" ADD COLUMN IF NOT EXISTS "recruitingTopFive" json;

-- ─── 2. Recruiting Board ─────────────────────────────────────────────────────
DO $$ BEGIN
  CREATE TYPE "recruiting_interest_level" AS ENUM ('watching','interested','offer_extended','committed');
EXCEPTION WHEN duplicate_object THEN null; END $$;

CREATE TABLE IF NOT EXISTS "recruiting_board_entries" (
  "id" serial PRIMARY KEY NOT NULL,
  "athleteId" integer NOT NULL,
  "collegeName" varchar(255) NOT NULL,
  "collegeLogoUrl" text,
  "division" varchar(32),
  "conference" varchar(64),
  "level" "recruiting_interest_level" NOT NULL DEFAULT 'watching',
  "coachName" varchar(128),
  "coachEmail" varchar(320),
  "notes" text,
  "firstContactAt" timestamp,
  "lastContactAt" timestamp,
  "createdAt" timestamp NOT NULL DEFAULT now(),
  "updatedAt" timestamp NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS "rbe_athleteId_idx" ON "recruiting_board_entries"("athleteId");
CREATE INDEX IF NOT EXISTS "rbe_level_idx" ON "recruiting_board_entries"("level");

CREATE TABLE IF NOT EXISTS "recruiting_coach_views" (
  "id" serial PRIMARY KEY NOT NULL,
  "athleteId" integer NOT NULL,
  "coachName" varchar(128),
  "collegeName" varchar(255),
  "viewedAt" timestamp NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS "rcv_athleteId_idx" ON "recruiting_coach_views"("athleteId");

-- ─── 3. Awards ────────────────────────────────────────────────────────────────
DO $$ BEGIN
  CREATE TYPE "award_category" AS ENUM ('team','conference','state','regional','national','academic','media','combine');
EXCEPTION WHEN duplicate_object THEN null; END $$;

CREATE TABLE IF NOT EXISTS "athlete_awards" (
  "id" serial PRIMARY KEY NOT NULL,
  "athleteId" integer NOT NULL,
  "title" varchar(255) NOT NULL,
  "organization" varchar(255),
  "category" "award_category" NOT NULL DEFAULT 'team',
  "season" varchar(16),
  "awardedOn" timestamp,
  "badgeColor" varchar(16),
  "verified" boolean NOT NULL DEFAULT false,
  "proofUrl" text,
  "createdAt" timestamp NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS "awards_athleteId_idx" ON "athlete_awards"("athleteId");

-- ─── 4. Athlete Social Accounts ──────────────────────────────────────────────
DO $$ BEGIN
  CREATE TYPE "social_platform" AS ENUM ('instagram','tiktok','twitter','youtube','snapchat','hudl','maxpreps','perfectgame','rivals','247sports');
EXCEPTION WHEN duplicate_object THEN null; END $$;

CREATE TABLE IF NOT EXISTS "athlete_social_accounts" (
  "id" serial PRIMARY KEY NOT NULL,
  "userId" integer NOT NULL,
  "platform" "social_platform" NOT NULL,
  "externalUserId" varchar(255),
  "handle" varchar(255),
  "displayName" varchar(255),
  "accessTokenEncrypted" text,
  "refreshTokenEncrypted" text,
  "scope" text,
  "expiresAt" timestamp,
  "followerCount" integer DEFAULT 0,
  "lastSyncedAt" timestamp,
  "syncStatus" varchar(32) DEFAULT 'active',
  "archivedAt" timestamp,
  "createdAt" timestamp NOT NULL DEFAULT now(),
  "updatedAt" timestamp NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX IF NOT EXISTS "asa_userId_platform_unique" ON "athlete_social_accounts"("userId","platform");
CREATE INDEX IF NOT EXISTS "asa_userId_idx" ON "athlete_social_accounts"("userId");

-- ─── 5. Coach Lynx persistent chat + memory ──────────────────────────────────
DO $$ BEGIN
  CREATE TYPE "coach_lynx_role" AS ENUM ('system','user','assistant');
EXCEPTION WHEN duplicate_object THEN null; END $$;

CREATE TABLE IF NOT EXISTS "coach_lynx_messages" (
  "id" serial PRIMARY KEY NOT NULL,
  "userId" integer NOT NULL,
  "role" "coach_lynx_role" NOT NULL,
  "content" text NOT NULL,
  "contextScreen" varchar(64),
  "modelUsed" varchar(64),
  "tokensIn" integer DEFAULT 0,
  "tokensOut" integer DEFAULT 0,
  "createdAt" timestamp NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS "clm_userId_createdAt_idx" ON "coach_lynx_messages"("userId","createdAt");

CREATE TABLE IF NOT EXISTS "coach_lynx_memory" (
  "id" serial PRIMARY KEY NOT NULL,
  "userId" integer NOT NULL,
  "fact" text NOT NULL,
  "source" varchar(64),
  "confidence" real DEFAULT 1.0,
  "createdAt" timestamp NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS "clmem_userId_idx" ON "coach_lynx_memory"("userId");
