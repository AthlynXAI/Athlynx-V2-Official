-- P0 — Create the activity_log table in production (Supabase / PostgreSQL).
--
-- Root cause: sign-up tonight created userId=7 but the server crashed on
-- INSERT into activity_log with "Could not find the table
-- 'public.activity_log' in the schema cache" (HTTP 404 from Supabase). The
-- table was only ever declared in the MySQL-dialect 0000 snapshot, so it was
-- never materialized on the PostgreSQL production database.
--
-- This migration creates the table to match drizzle/schema.ts (activityLog).
-- Column names are the camelCase identifiers Drizzle emits from the schema
-- definition, so they are double-quoted to preserve case.
--
-- Idempotent: safe to run even if the table was created out of band.

CREATE TABLE IF NOT EXISTS activity_log (
  "id" SERIAL PRIMARY KEY,
  "userId" INTEGER,
  "eventType" VARCHAR(64) NOT NULL,
  "metadata" TEXT,
  "createdAt" TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_activity_log_userId ON activity_log("userId");
CREATE INDEX IF NOT EXISTS idx_activity_log_eventType ON activity_log("eventType");
CREATE INDEX IF NOT EXISTS idx_activity_log_createdAt ON activity_log("createdAt");
