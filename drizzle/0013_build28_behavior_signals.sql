-- Build 28: Behavior Algorithm Substrate — Signal events, aggregates, lifecycle, recommendations
-- Source: Chad executive decision 2026-05-16 — "This has to be an algorithm platform"
-- Purpose: Additive schema for the autonomous behavior-learning layer.
--          Feeds Layer 8 (AI on top) and Layer 9 (Syndication out).
-- Safety:  Append-only event log + denormalized state tables. No constraints
--          on athleteUserId/actorUserId to keep schema additive and fast.
-- Numbering: 0013 lands after 0012_build28_comms_os_scaffold.sql in same branch.

-- ─── Enums ───────────────────────────────────────────────────────────────────

DO $$ BEGIN
  CREATE TYPE "signal_kind" AS ENUM (
    'identity.user.signup','identity.user.login',
    'identity.user.dormant_7d','identity.user.dormant_14d','identity.user.reactivated',
    'profile.athlete.claimed','profile.athlete.parent_invited','profile.athlete.coach_claimed',
    'profile.athlete.viewed','profile.athlete.edited',
    'studio.lineup.created','studio.graphic.created','studio.score.posted','studio.milestone.added',
    'comm.inbound.received','comm.inbound.coach','comm.inbound.parent','comm.inbound.director',
    'comm.outbound.auto_reply','comm.outbound.draft_created','comm.outbound.sent','comm.reply.opened',
    'recruiting.page.viewed','recruiting.coach.viewed_profile','recruiting.milestone.published',
    'nil.deal.viewed','nil.deal.tapped','nil.deal.signed',
    'content.post.created','content.post.liked','content.video.uploaded',
    'content.photo.uploaded','content.feed.opened',
    'lifecycle.stage.entered','lifecycle.stage.advanced',
    'system.recommendation.fired','system.recommendation.acted_on',
    'system.recommendation.ignored','system.automation.escalated'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE "signal_source" AS ENUM (
    'athlete','parent','coach','director','brand','recruiter','system','automation','founder'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE "lifecycle_stage" AS ENUM (
    'youth_9_12','preteen_13_14','highschool_15_16','highschool_17_18',
    'college_18_22','pro_22_plus','post_career_35','unassigned'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE "behavior_segment" AS ENUM (
    'active_weekly_poster','active_monthly_poster','graphic_heavy','score_only',
    'parent_driven','coach_driven','athlete_driven',
    'dormant_7d','dormant_14d','dormant_30d',
    'founding_100','recruiting_active','nil_engaged','new_unactivated','unassigned'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE "recommendation_kind" AS ENUM (
    'ready_for_studio_day1','ready_for_milestone_post','ready_for_recruiting_card',
    'at_risk_churn','parent_engagement_needed','coach_engagement_needed',
    'lifecycle_stage_advance','founder_outreach_priority','auto_reply_eligible'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE "aggregate_window" AS ENUM ('1d','7d','30d','90d','365d','all');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ─── signal_events ──────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS "signal_events" (
  "id"             SERIAL PRIMARY KEY,
  "athleteUserId"  INTEGER,
  "actorUserId"    INTEGER,
  "source"         "signal_source" NOT NULL,
  "kind"           "signal_kind" NOT NULL,
  "context"        JSON,
  "weight"         REAL NOT NULL DEFAULT 1.0,
  "commEventId"    INTEGER,
  "occurredAt"     TIMESTAMP NOT NULL DEFAULT NOW(),
  "createdAt"      TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS signal_events_athlete_kind_occurred_idx
  ON "signal_events" ("athleteUserId", "kind", "occurredAt" DESC);
CREATE INDEX IF NOT EXISTS signal_events_kind_occurred_idx
  ON "signal_events" ("kind", "occurredAt" DESC);
CREATE INDEX IF NOT EXISTS signal_events_source_occurred_idx
  ON "signal_events" ("source", "occurredAt" DESC);
CREATE INDEX IF NOT EXISTS signal_events_comm_event_idx
  ON "signal_events" ("commEventId") WHERE "commEventId" IS NOT NULL;

-- ─── signal_aggregates ──────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS "signal_aggregates" (
  "id"             SERIAL PRIMARY KEY,
  "athleteUserId"  INTEGER NOT NULL,
  "kind"           "signal_kind" NOT NULL,
  "window"         "aggregate_window" NOT NULL,
  "count"          INTEGER NOT NULL DEFAULT 0,
  "weightSum"      REAL NOT NULL DEFAULT 0,
  "lastOccurredAt" TIMESTAMP,
  "version"        INTEGER NOT NULL DEFAULT 1,
  "computedAt"     TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS signal_aggregates_athlete_kind_window_unique_idx
  ON "signal_aggregates" ("athleteUserId", "kind", "window");
CREATE INDEX IF NOT EXISTS signal_aggregates_kind_window_idx
  ON "signal_aggregates" ("kind", "window");

-- ─── lifecycle_transitions ──────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS "lifecycle_transitions" (
  "id"                  SERIAL PRIMARY KEY,
  "athleteUserId"       INTEGER NOT NULL,
  "fromStage"           "lifecycle_stage",
  "toStage"             "lifecycle_stage" NOT NULL,
  "reason"              VARCHAR(64) NOT NULL,
  "overriddenByUserId"  INTEGER,
  "snapshot"            JSON,
  "occurredAt"          TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS lifecycle_transitions_athlete_occurred_idx
  ON "lifecycle_transitions" ("athleteUserId", "occurredAt" DESC);
CREATE INDEX IF NOT EXISTS lifecycle_transitions_to_stage_idx
  ON "lifecycle_transitions" ("toStage", "occurredAt" DESC);

-- ─── athlete_lifecycle_state ────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS "athlete_lifecycle_state" (
  "athleteUserId"          INTEGER PRIMARY KEY,
  "currentStage"           "lifecycle_stage" NOT NULL DEFAULT 'unassigned',
  "enteredCurrentStageAt"  TIMESTAMP NOT NULL DEFAULT NOW(),
  "lastTransitionId"       INTEGER,
  "updatedAt"              TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS athlete_lifecycle_state_current_stage_idx
  ON "athlete_lifecycle_state" ("currentStage");

-- ─── recommendation_scores ──────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS "recommendation_scores" (
  "id"                 SERIAL PRIMARY KEY,
  "athleteUserId"      INTEGER NOT NULL,
  "kind"               "recommendation_kind" NOT NULL,
  "score"              SMALLINT NOT NULL,
  "reasons"            JSON,
  "firedActionId"      INTEGER,
  "actedOn"            BOOLEAN NOT NULL DEFAULT FALSE,
  "thresholdAtScore"   SMALLINT,
  "computedAt"         TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS recommendation_scores_athlete_kind_computed_idx
  ON "recommendation_scores" ("athleteUserId", "kind", "computedAt" DESC);
CREATE INDEX IF NOT EXISTS recommendation_scores_kind_score_idx
  ON "recommendation_scores" ("kind", "score" DESC, "computedAt" DESC);

-- ─── athlete_behavior_segments ──────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS "athlete_behavior_segments" (
  "id"             SERIAL PRIMARY KEY,
  "athleteUserId"  INTEGER NOT NULL,
  "segment"        "behavior_segment" NOT NULL,
  "score"          SMALLINT NOT NULL DEFAULT 50,
  "enteredAt"      TIMESTAMP NOT NULL DEFAULT NOW(),
  "refreshedAt"    TIMESTAMP NOT NULL DEFAULT NOW(),
  "active"         BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE UNIQUE INDEX IF NOT EXISTS athlete_behavior_segments_athlete_segment_unique_idx
  ON "athlete_behavior_segments" ("athleteUserId", "segment");
CREATE INDEX IF NOT EXISTS athlete_behavior_segments_segment_active_score_idx
  ON "athlete_behavior_segments" ("segment", "active", "score" DESC);
