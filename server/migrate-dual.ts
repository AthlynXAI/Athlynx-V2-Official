/**
 * Dual-Database Migration Runner
 * Runs PostgreSQL migrations/checks during Vercel cold-start without blocking boot.
 * The canonical production database is Neon/PostgreSQL; optional backup checks run
 * only when explicitly enabled. Missing bundled Drizzle metadata is treated as a
 * non-fatal runtime packaging condition so Sentry does not turn it into a fatal
 * startup regression.
 *
 * Architecture:
 *   NEON_DATABASE_URL or DATABASE_URL = Neon/PostgreSQL primary
 *   PLANETSCALE_DATABASE_URL          = optional backup URL, used only when RUN_BACKUP_MIGRATIONS=true
 */
import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { Pool, Client } from "pg";
import fs from "fs";
import path from "path";

function getMigrationsFolder(): string {
  const candidates: string[] = [];
  try {
    if (typeof __dirname !== "undefined" && __dirname) {
      candidates.push(path.resolve(__dirname, "../drizzle"));
      candidates.push(path.resolve(__dirname, "../../drizzle"));
    }
  } catch (_) {}
  candidates.push(path.resolve(process.cwd(), "drizzle"));

  for (const candidate of candidates) {
    if (fs.existsSync(path.join(candidate, "meta", "_journal.json"))) {
      return candidate;
    }
  }

  return candidates[0] ?? path.resolve(process.cwd(), "drizzle");
}

function migrationJournalExists(migrationsFolder: string): boolean {
  return fs.existsSync(path.join(migrationsFolder, "meta", "_journal.json"));
}

function isTransientMigrationCloseError(error: unknown): boolean {
  const message = error instanceof Error ? error.message : String(error ?? "");
  return /connection terminated|Connection terminated unexpectedly|ECONNRESET|socket disconnected|timeout|ETIMEDOUT/i.test(message);
}

async function ensureNilDealsTable(connection: Client, label: string): Promise<void> {
  try {
    await connection.query(`
      DO $$
      BEGIN
        CREATE TYPE nil_deal_status AS ENUM ('pending', 'active', 'completed', 'declined');
      EXCEPTION WHEN duplicate_object THEN NULL;
      END $$;
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS "nil_deals" (
        "id" serial PRIMARY KEY,
        "athleteId" integer NOT NULL DEFAULT 1,
        "brandName" varchar(128) NOT NULL,
        "dealValue" integer NOT NULL DEFAULT 0,
        "status" nil_deal_status NOT NULL DEFAULT 'pending',
        "description" text,
        "category" varchar(64),
        "startDate" timestamp,
        "endDate" timestamp,
        "contractUrl" text,
        "createdAt" timestamp NOT NULL DEFAULT now(),
        "updatedAt" timestamp NOT NULL DEFAULT now()
      );
    `);

    await connection.query(`CREATE INDEX IF NOT EXISTS nil_deals_status_idx ON "nil_deals" ("status");`);
    await connection.query(`CREATE INDEX IF NOT EXISTS nil_deals_category_idx ON "nil_deals" ("category");`);
    await connection.query(`CREATE INDEX IF NOT EXISTS nil_deals_created_at_idx ON "nil_deals" ("createdAt" DESC);`);

    await connection.query(`
      WITH seed_athlete AS (
        SELECT id FROM "users" ORDER BY id ASC LIMIT 1
      )
      INSERT INTO "nil_deals" ("athleteId", "brandName", "dealValue", "status", "description", "category", "startDate", "endDate")
      SELECT COALESCE((SELECT id FROM seed_athlete), 1), seed."brandName", seed."dealValue", seed."status"::nil_deal_status, seed."description", seed."category", now(), now() + interval '90 days'
      FROM (VALUES
        ('AthlynXAI Launch Partner', 2500, 'active', 'Regional brand partnership opportunity for athletes building verified recruiting and media presence.', 'Brand Partnership'),
        ('Community Sports Ambassador', 1000, 'active', 'Local endorsement opportunity for athletes with strong community engagement and consistent content.', 'Ambassador'),
        ('Training Content Collaboration', 750, 'pending', 'Content collaboration package for athletes sharing training, recovery, and performance updates.', 'Content')
      ) AS seed("brandName", "dealValue", "status", "description", "category")
      WHERE NOT EXISTS (SELECT 1 FROM "nil_deals" LIMIT 1);
    `);

    console.log(`[migrate:${label}] ✅ nil_deals table verified`);
  } catch (err) {
    console.error(`[migrate:${label}] ⚠️ nil_deals hotfix migration failed (non-fatal):`, err);
  }
}

// Build 51 — ensure auth_me_events exists on every cold start. Mirrors the
// nil_deals hotfix pattern so the Auth Audit Dashboard works even if the
// drizzle journal is out of sync on this runtime.
async function ensureAuthMeEventsTable(connection: Client, label: string): Promise<void> {
  try {
    await connection.query(`
      CREATE TABLE IF NOT EXISTS "auth_me_events" (
        "id"               SERIAL PRIMARY KEY,
        "occurred_at"      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        "status"           INTEGER NOT NULL,
        "route"            TEXT NOT NULL DEFAULT '/api/auth/me',
        "session_id"       TEXT,
        "user_id"          INTEGER,
        "user_email"       TEXT,
        "ip"               TEXT,
        "user_agent"       TEXT,
        "auth_provider"    TEXT NOT NULL DEFAULT 'unknown',
        "token_state"      TEXT NOT NULL DEFAULT 'unknown',
        "failure_reason"   TEXT,
        "headers_present"  JSONB NOT NULL DEFAULT '{}'::jsonb,
        "origin"           TEXT,
        "referer"          TEXT,
        "is_logout_marker" BOOLEAN NOT NULL DEFAULT FALSE,
        "metadata"         JSONB NOT NULL DEFAULT '{}'::jsonb
      );
    `);
    await connection.query(`CREATE INDEX IF NOT EXISTS auth_me_events_occurred_at_idx ON "auth_me_events" ("occurred_at" DESC);`);
    await connection.query(`CREATE INDEX IF NOT EXISTS auth_me_events_status_idx       ON "auth_me_events" ("status");`);
    await connection.query(`CREATE INDEX IF NOT EXISTS auth_me_events_session_idx      ON "auth_me_events" ("session_id", "occurred_at");`);
    await connection.query(`CREATE INDEX IF NOT EXISTS auth_me_events_provider_idx     ON "auth_me_events" ("auth_provider");`);
    await connection.query(`CREATE INDEX IF NOT EXISTS auth_me_events_ip_idx           ON "auth_me_events" ("ip");`);
    console.log(`[migrate:${label}] ✅ auth_me_events table verified (Build 51)`);
  } catch (err) {
    console.error(`[migrate:${label}] ⚠️ auth_me_events hotfix failed (non-fatal):`, err);
  }
}

async function migrateDatabase(url: string, label: string): Promise<void> {
  if (!url) {
    console.warn(`[migrate:${label}] URL not set — skipping`);
    return;
  }
  let connection: Client | undefined;
  try {
    connection = new Client({ connectionString: url, ssl: { rejectUnauthorized: false } });
    await connection.connect();
    const db = drizzle(connection);
    const migrationsFolder = getMigrationsFolder();
    if (migrationJournalExists(migrationsFolder)) {
      console.log(`[migrate:${label}] Running migrations from ${migrationsFolder}`);
      try {
        await migrate(db, { migrationsFolder });
        console.log(`[migrate:${label}] ✅ All migrations applied`);
      } catch (err) {
        console.error(`[migrate:${label}] ⚠️ Drizzle migration error (non-fatal):`, err);
      }
    } else {
      console.warn(`[migrate:${label}] Drizzle journal missing at ${migrationsFolder}/meta/_journal.json — skipping Drizzle migrator on this runtime. Hotfix table checks will still run.`);
    }
    await ensureNilDealsTable(connection, label);
    await ensureAuthMeEventsTable(connection, label);
  } catch (err) {
    console.error(`[migrate:${label}] ⚠️ Migration connection error (non-fatal):`, err);
  } finally {
    if (connection) {
      try {
        await connection.end();
      } catch (err) {
        if (isTransientMigrationCloseError(err)) {
          console.warn(`[migrate:${label}] Connection close warning suppressed:`, (err as Error).message);
        } else {
          console.error(`[migrate:${label}] Connection close error (non-fatal):`, err);
        }
      }
    }
  }
}

export async function runDualMigrations(): Promise<void> {
  const primaryUrl = process.env.NEON_DATABASE_URL || process.env.DATABASE_URL;
  const backupUrl = process.env.PLANETSCALE_DATABASE_URL;
  const runBackupMigrations = process.env.RUN_BACKUP_MIGRATIONS === "true";

  await migrateDatabase(primaryUrl || "", "Neon-Primary");

  if (runBackupMigrations) {
    await migrateDatabase(backupUrl || "", "PlanetScale-Backup");
  } else {
    console.log("[migrate:PlanetScale-Backup] Skipped on request cold-start; set RUN_BACKUP_MIGRATIONS=true for explicit backup migration runs");
  }

  console.log("[migrate:dual] ✅ Migration pass complete");
}
