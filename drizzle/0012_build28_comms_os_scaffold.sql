-- Build 28: Real-Time Communications OS — Scaffold migration
-- Source: Perplexity Handoff — AthlynXAI OS Real-Time Communications Automation (2026-05-16)
-- Purpose: Additive schema for the Layer Cake communications routing system.
--          Extends crm_contacts / crm_pipeline / activity_log — does not replace them.
-- Safety:  All tables are scaffolds. No webhook intake, classifier, or auto-reply
--          dispatch runs until Perplexity returns its architecture diagnosis.
-- Note:    Numbered 0012 to land cleanly AFTER Build 27.1 migration 0011 (studio_suite).

-- ─── Enums ───────────────────────────────────────────────────────────────────

DO $$ BEGIN
  CREATE TYPE "comm_channel" AS ENUM ('email', 'sms', 'outlook', 'icloud');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE "comm_direction" AS ENUM ('inbound', 'outbound');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE "comm_category" AS ENUM (
    'coach_inquiry','parent_inquiry','athlete_support','organization_director',
    'investor_partnership','legal_compliance','insurance','finance_billing',
    'account_security','promotional_spam','personal','uncertain'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE "comm_urgency" AS ENUM ('low','normal','high','critical');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE "comm_company" AS ENUM ('athlynxai','dhg','softmor','nil_portal','personal','unknown');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE "comm_action" AS ENUM (
    'archive','label','spam','task_create','draft_reply','sent_reply','escalate','ignore'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE "comm_automation_run_status" AS ENUM ('success','error','retrying','skipped');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ─── communication_accounts ──────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS "communication_accounts" (
  "id"             SERIAL PRIMARY KEY,
  "channel"        "comm_channel" NOT NULL,
  "loginIdentity"  VARCHAR(320) NOT NULL,
  "senderIdentity" VARCHAR(320) NOT NULL,
  "company"        "comm_company" NOT NULL,
  "label"          VARCHAR(128) NOT NULL,
  "providerConfig" JSON,
  "active"         BOOLEAN NOT NULL DEFAULT TRUE,
  "lastSyncAt"     TIMESTAMP,
  "createdAt"      TIMESTAMP NOT NULL DEFAULT NOW(),
  "updatedAt"      TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS communication_accounts_company_active_idx
  ON "communication_accounts" ("company", "active");

-- ─── communication_threads ───────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS "communication_threads" (
  "id"                SERIAL PRIMARY KEY,
  "providerThreadId"  VARCHAR(256),
  "crmContactId"      INTEGER,
  "crmPipelineId"     INTEGER,
  "company"           "comm_company" NOT NULL DEFAULT 'unknown',
  "subject"           VARCHAR(512),
  "lastCategory"      "comm_category",
  "lastUrgency"       "comm_urgency" NOT NULL DEFAULT 'normal',
  "acknowledgedAt"    TIMESTAMP,
  "lastInboundAt"     TIMESTAMP,
  "lastOutboundAt"    TIMESTAMP,
  "messageCount"      INTEGER NOT NULL DEFAULT 0,
  "createdAt"         TIMESTAMP NOT NULL DEFAULT NOW(),
  "updatedAt"         TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS communication_threads_provider_thread_idx
  ON "communication_threads" ("providerThreadId");
CREATE INDEX IF NOT EXISTS communication_threads_crm_contact_idx
  ON "communication_threads" ("crmContactId");
CREATE INDEX IF NOT EXISTS communication_threads_urgency_inbound_idx
  ON "communication_threads" ("lastUrgency", "lastInboundAt" DESC);

-- ─── communication_events ───────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS "communication_events" (
  "id"                SERIAL PRIMARY KEY,
  "accountId"         INTEGER NOT NULL,
  "threadId"          INTEGER,
  "providerMessageId" VARCHAR(256) NOT NULL,
  "channel"           "comm_channel" NOT NULL,
  "direction"         "comm_direction" NOT NULL,
  "fromAddress"       VARCHAR(320) NOT NULL,
  "toAddress"         VARCHAR(320) NOT NULL,
  "ccAddresses"       TEXT,
  "subject"           VARCHAR(512),
  "bodyText"          TEXT,
  "rawPayload"        JSON,
  "classifiedAt"      TIMESTAMP,
  "receivedAt"        TIMESTAMP NOT NULL DEFAULT NOW(),
  "sentAt"            TIMESTAMP,
  "createdAt"         TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS communication_events_provider_message_unique_idx
  ON "communication_events" ("accountId", "providerMessageId");
CREATE INDEX IF NOT EXISTS communication_events_thread_idx
  ON "communication_events" ("threadId");
CREATE INDEX IF NOT EXISTS communication_events_received_idx
  ON "communication_events" ("receivedAt" DESC);
CREATE INDEX IF NOT EXISTS communication_events_unclassified_idx
  ON "communication_events" ("classifiedAt") WHERE "classifiedAt" IS NULL;

-- ─── communication_classifications ──────────────────────────────────────────

CREATE TABLE IF NOT EXISTS "communication_classifications" (
  "id"               SERIAL PRIMARY KEY,
  "eventId"          INTEGER NOT NULL,
  "category"         "comm_category" NOT NULL,
  "urgency"          "comm_urgency" NOT NULL,
  "detectedCompany"  "comm_company" NOT NULL DEFAULT 'unknown',
  "confidence"       SMALLINT NOT NULL,
  "ruleHits"         JSON,
  "riskScore"        SMALLINT NOT NULL DEFAULT 0,
  "classifierSource" VARCHAR(32) NOT NULL DEFAULT 'rules',
  "reasoning"        TEXT,
  "createdAt"        TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS communication_classifications_event_idx
  ON "communication_classifications" ("eventId");

-- ─── communication_actions ──────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS "communication_actions" (
  "id"          SERIAL PRIMARY KEY,
  "eventId"     INTEGER NOT NULL,
  "action"      "comm_action" NOT NULL,
  "performedBy" VARCHAR(64) NOT NULL DEFAULT 'automation',
  "templateId"  INTEGER,
  "detail"      JSON,
  "success"     BOOLEAN NOT NULL DEFAULT TRUE,
  "createdAt"   TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS communication_actions_event_idx
  ON "communication_actions" ("eventId");

-- ─── reply_templates ────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS "reply_templates" (
  "id"              SERIAL PRIMARY KEY,
  "company"         "comm_company" NOT NULL,
  "channel"         "comm_channel" NOT NULL,
  "category"        "comm_category" NOT NULL,
  "name"            VARCHAR(128) NOT NULL,
  "subjectTemplate" VARCHAR(256),
  "bodyTemplate"    TEXT NOT NULL,
  "approved"        BOOLEAN NOT NULL DEFAULT FALSE,
  "approvedAt"      TIMESTAMP,
  "approvedBy"      VARCHAR(128),
  "useCount"        INTEGER NOT NULL DEFAULT 0,
  "active"          BOOLEAN NOT NULL DEFAULT TRUE,
  "createdAt"       TIMESTAMP NOT NULL DEFAULT NOW(),
  "updatedAt"       TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS reply_templates_lookup_idx
  ON "reply_templates" ("company", "channel", "category", "approved", "active");

-- ─── automation_rules ───────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS "automation_rules" (
  "id"              SERIAL PRIMARY KEY,
  "scope"           VARCHAR(32) NOT NULL,
  "name"            VARCHAR(128) NOT NULL,
  "priority"        INTEGER NOT NULL DEFAULT 100,
  "matchConditions" JSON NOT NULL,
  "actionPayload"   JSON NOT NULL,
  "active"          BOOLEAN NOT NULL DEFAULT TRUE,
  "hitCount"        INTEGER NOT NULL DEFAULT 0,
  "createdAt"       TIMESTAMP NOT NULL DEFAULT NOW(),
  "updatedAt"       TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS automation_rules_scope_active_priority_idx
  ON "automation_rules" ("scope", "active", "priority");

-- ─── automation_runs ────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS "automation_runs" (
  "id"           SERIAL PRIMARY KEY,
  "jobType"      VARCHAR(64) NOT NULL,
  "status"       "comm_automation_run_status" NOT NULL,
  "eventId"      INTEGER,
  "durationMs"   INTEGER,
  "errorMessage" TEXT,
  "attempt"      SMALLINT NOT NULL DEFAULT 0,
  "startedAt"    TIMESTAMP NOT NULL DEFAULT NOW(),
  "finishedAt"   TIMESTAMP
);

CREATE INDEX IF NOT EXISTS automation_runs_status_started_idx
  ON "automation_runs" ("status", "startedAt" DESC);
CREATE INDEX IF NOT EXISTS automation_runs_job_started_idx
  ON "automation_runs" ("jobType", "startedAt" DESC);
