-- Migration 0006: Build 3 — editable everywhere + Top 5 ladder + sports avatar library
-- Postgres dialect. Idempotent (uses IF NOT EXISTS).

-- ─── 1. athlete_profiles — avatar choice + ladder direction ─────────────
ALTER TABLE "athlete_profiles" ADD COLUMN IF NOT EXISTS "avatarChoiceKey" varchar(64);
ALTER TABLE "athlete_profiles" ADD COLUMN IF NOT EXISTS "coverChoiceKey" varchar(64);
ALTER TABLE "athlete_profiles" ADD COLUMN IF NOT EXISTS "recruitingLadderDirection" varchar(16) NOT NULL DEFAULT 'countdown';
ALTER TABLE "athlete_profiles" ADD COLUMN IF NOT EXISTS "lastEditedAt" timestamp;

-- ─── 2. recruiting_board_entries — Top 5 ladder fields ──────────────────
DO $$ BEGIN
  CREATE TYPE "recruiting_letter_type" AS ENUM ('offer','commitment','interest','ncaa_loi','camp_invite');
EXCEPTION WHEN duplicate_object THEN null; END $$;

ALTER TABLE "recruiting_board_entries" ADD COLUMN IF NOT EXISTS "rank" smallint;
ALTER TABLE "recruiting_board_entries" ADD COLUMN IF NOT EXISTS "letterUrl" text;
ALTER TABLE "recruiting_board_entries" ADD COLUMN IF NOT EXISTS "letterType" "recruiting_letter_type";
ALTER TABLE "recruiting_board_entries" ADD COLUMN IF NOT EXISTS "letterFilename" varchar(255);
ALTER TABLE "recruiting_board_entries" ADD COLUMN IF NOT EXISTS "letterPublic" boolean NOT NULL DEFAULT true;
ALTER TABLE "recruiting_board_entries" ADD COLUMN IF NOT EXISTS "letterUploadedAt" timestamp;

CREATE INDEX IF NOT EXISTS "rbe_athleteId_rank_idx" ON "recruiting_board_entries"("athleteId","rank");

-- ─── 3. Sports avatar library catalog (rows seeded by app on boot) ──────
CREATE TABLE IF NOT EXISTS "sports_avatar_library" (
  "id" serial PRIMARY KEY NOT NULL,
  "key" varchar(64) NOT NULL UNIQUE,
  "label" varchar(128) NOT NULL,
  "kind" varchar(16) NOT NULL,            -- 'avatar' | 'cover'
  "sport" varchar(32),                    -- 'football' | 'basketball' | etc, NULL = universal
  "imageUrl" text NOT NULL,
  "thumbnailUrl" text,
  "sortOrder" integer NOT NULL DEFAULT 0,
  "active" boolean NOT NULL DEFAULT true,
  "createdAt" timestamp NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS "sal_kind_sport_idx" ON "sports_avatar_library"("kind","sport","sortOrder");

-- ─── 4. Per-field privacy overrides (lightweight) ───────────────────────
-- Athletes can hide specific fields from public view even when published.
-- Stored as a JSON map { "gpa": false, "weight": false } where false = hidden.
ALTER TABLE "athlete_profiles" ADD COLUMN IF NOT EXISTS "fieldPrivacy" json;

-- ─── 5. Founder presence (Chad Dozier is_founder + follow + notes + lessons)
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "isFounder" boolean NOT NULL DEFAULT false;

-- Founder "follows" — used to surface the "Followed by Founder" badge on hero
CREATE TABLE IF NOT EXISTS "founder_follows" (
  "id" serial PRIMARY KEY NOT NULL,
  "founderUserId" integer NOT NULL,
  "athleteId" integer NOT NULL,
  "createdAt" timestamp NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX IF NOT EXISTS "founder_follows_pair_unique" ON "founder_follows"("founderUserId","athleteId");
CREATE INDEX IF NOT EXISTS "founder_follows_athleteId_idx" ON "founder_follows"("athleteId");

-- Founder direct notes to specific athletes — surface as pinned card on Summary tab
CREATE TABLE IF NOT EXISTS "founder_notes" (
  "id" serial PRIMARY KEY NOT NULL,
  "founderUserId" integer NOT NULL,
  "athleteId" integer NOT NULL,
  "title" varchar(160),
  "body" text NOT NULL,
  "pinned" boolean NOT NULL DEFAULT true,
  "createdAt" timestamp NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS "founder_notes_athleteId_idx" ON "founder_notes"("athleteId","pinned","createdAt");

-- Founder lessons — platform-wide drops surfaced in every athlete's News and pulled by Coach Lynx
CREATE TABLE IF NOT EXISTS "founder_lessons" (
  "id" serial PRIMARY KEY NOT NULL,
  "founderUserId" integer NOT NULL,
  "title" varchar(160) NOT NULL,
  "body" text NOT NULL,
  "audioUrl" text,                       -- optional voice drop in R2
  "category" varchar(48),                -- 'mindset' | 'recruiting' | 'NIL' | 'training' | 'life'
  "publishedAt" timestamp NOT NULL DEFAULT now(),
  "active" boolean NOT NULL DEFAULT true,
  "createdAt" timestamp NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS "founder_lessons_publishedAt_idx" ON "founder_lessons"("publishedAt");

-- ─── 6. Athlynx Brand Wall (Endorsement Board) ─────────────────────────
-- One platform-wide board. Athletes submit brands, you curate, signed deals show on every profile.
DO $$ BEGIN
  CREATE TYPE "brand_tier" AS ENUM ('iconic','major','regional','local','unknown');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE "brand_pursuit_status" AS ENUM ('wishlist','pitched','conversation','signed','closed');
EXCEPTION WHEN duplicate_object THEN null; END $$;

CREATE TABLE IF NOT EXISTS "brand_wall_entries" (
  "id" serial PRIMARY KEY NOT NULL,
  "brandName" varchar(160) NOT NULL,
  "brandLogoUrl" text,
  "brandDomain" varchar(160),
  "tier" "brand_tier" NOT NULL DEFAULT 'unknown',
  "category" varchar(48),               -- 'apparel' | 'beverage' | 'auto' | 'tech' | 'finance' | 'media' | 'food' | 'other'
  "submittedBy" integer NOT NULL,        -- userId who submitted (athlete or founder)
  "curatedBy" integer,                   -- founder userId who blessed it
  "approved" boolean NOT NULL DEFAULT false,
  "sortOrder" integer NOT NULL DEFAULT 0,
  "active" boolean NOT NULL DEFAULT true,
  "createdAt" timestamp NOT NULL DEFAULT now(),
  "updatedAt" timestamp NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS "brand_wall_tier_approved_idx" ON "brand_wall_entries"("approved","tier","sortOrder");
CREATE UNIQUE INDEX IF NOT EXISTS "brand_wall_brandName_unique" ON "brand_wall_entries"(LOWER("brandName"));

-- Per-athlete pursuit status against a brand on the wall
CREATE TABLE IF NOT EXISTS "brand_wall_pursuits" (
  "id" serial PRIMARY KEY NOT NULL,
  "athleteId" integer NOT NULL,
  "brandWallEntryId" integer NOT NULL,
  "status" "brand_pursuit_status" NOT NULL DEFAULT 'wishlist',
  "notes" text,
  "signedAt" timestamp,
  "dealValueCents" integer,
  "createdAt" timestamp NOT NULL DEFAULT now(),
  "updatedAt" timestamp NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX IF NOT EXISTS "bwp_athlete_brand_unique" ON "brand_wall_pursuits"("athleteId","brandWallEntryId");
CREATE INDEX IF NOT EXISTS "bwp_athleteId_idx" ON "brand_wall_pursuits"("athleteId");
CREATE INDEX IF NOT EXISTS "bwp_status_idx" ON "brand_wall_pursuits"("status");

-- ─── 7. Founder Podcast — episodes table ───────────────────────────────
-- Audio on R2, video on Cloudflare Stream, RSS feed at /founder/podcast/rss.xml.
-- Every guest who is an athlete on the platform gets a profile receipt.
CREATE TABLE IF NOT EXISTS "podcast_episodes" (
  "id" serial PRIMARY KEY NOT NULL,
  "slug" varchar(160) NOT NULL UNIQUE,
  "title" varchar(240) NOT NULL,
  "subtitle" varchar(240),
  "description" text,
  "episodeNumber" integer,
  "seasonNumber" integer DEFAULT 1,
  "audioUrl" text,                       -- R2 audio URL
  "videoStreamId" varchar(64),           -- Cloudflare Stream video UID
  "videoThumbnailUrl" text,
  "coverArtUrl" text,
  "durationSeconds" integer,
  "publishedAt" timestamp,
  "status" varchar(16) NOT NULL DEFAULT 'draft',   -- 'draft' | 'scheduled' | 'published'
  "explicit" boolean NOT NULL DEFAULT false,
  "transcript" text,
  "showNotes" text,
  "createdAt" timestamp NOT NULL DEFAULT now(),
  "updatedAt" timestamp NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS "podcast_episodes_publishedAt_idx" ON "podcast_episodes"("status","publishedAt");

-- Episode guests — link to platform users when possible so they get the receipt on their profile
CREATE TABLE IF NOT EXISTS "podcast_episode_guests" (
  "id" serial PRIMARY KEY NOT NULL,
  "episodeId" integer NOT NULL,
  "userId" integer,                      -- nullable: external guest (no platform account)
  "guestName" varchar(160) NOT NULL,
  "guestRole" varchar(160),              -- 'Athlete', 'Coach', 'Founder', etc
  "guestAvatarUrl" text,
  "sortOrder" integer NOT NULL DEFAULT 0,
  "createdAt" timestamp NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS "podcast_guests_episodeId_idx" ON "podcast_episode_guests"("episodeId");
CREATE INDEX IF NOT EXISTS "podcast_guests_userId_idx" ON "podcast_episode_guests"("userId");

-- ─── 8. Athlynx Network — streaming channels and live events ───────────
-- Provider-agnostic: 'cloudflare_stream' | 'mux' | 'youtube'. StreamProvider interface swaps providers.
DO $$ BEGIN
  CREATE TYPE "stream_provider" AS ENUM ('cloudflare_stream','mux','youtube','vimeo');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE "stream_status" AS ENUM ('scheduled','live','ended','vod','draft');
EXCEPTION WHEN duplicate_object THEN null; END $$;

CREATE TABLE IF NOT EXISTS "stream_channels" (
  "id" serial PRIMARY KEY NOT NULL,
  "slug" varchar(96) NOT NULL UNIQUE,
  "name" varchar(160) NOT NULL,
  "description" text,
  "ownerUserId" integer,                 -- nullable for house channels
  "sport" varchar(32),
  "logoUrl" text,
  "bannerUrl" text,
  "active" boolean NOT NULL DEFAULT true,
  "createdAt" timestamp NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "stream_events" (
  "id" serial PRIMARY KEY NOT NULL,
  "channelId" integer NOT NULL,
  "slug" varchar(160) NOT NULL UNIQUE,
  "title" varchar(240) NOT NULL,
  "description" text,
  "provider" "stream_provider" NOT NULL DEFAULT 'cloudflare_stream',
  "providerStreamId" varchar(64),        -- Cloudflare Stream live input ID / Mux playback ID
  "playbackUrl" text,                    -- HLS URL
  "thumbnailUrl" text,
  "status" "stream_status" NOT NULL DEFAULT 'scheduled',
  "scheduledStartAt" timestamp,
  "actualStartAt" timestamp,
  "endedAt" timestamp,
  "viewerCount" integer NOT NULL DEFAULT 0,
  "isPublic" boolean NOT NULL DEFAULT true,
  "createdAt" timestamp NOT NULL DEFAULT now(),
  "updatedAt" timestamp NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS "stream_events_channelId_idx" ON "stream_events"("channelId","status","scheduledStartAt");
CREATE INDEX IF NOT EXISTS "stream_events_status_idx" ON "stream_events"("status","scheduledStartAt");
