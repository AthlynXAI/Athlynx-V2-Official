/**
 * run-migrations.ts
 *
 * Applies any pending Drizzle migrations against the PlanetScale database.
 * Called once at server startup (from entry.ts) so migrations run in the
 * Vercel serverless runtime where DATABASE_URL is available — NOT during
 * the build step where it is not.
 *
 * Safe to call on every cold-start: drizzle migrate is idempotent and tracks
 * applied migrations in the __drizzle_migrations table.
 */

import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { Client } from "pg";
import path from "path";

// CJS-safe directory resolution.
// esbuild bundles this with --format=cjs for Vercel, so import.meta.url is
// undefined at runtime. We use the CJS __dirname global (injected by Node)
// which points to the api/ output directory, then step up one level to reach
// the drizzle/ migrations folder at the project root.
function getMigrationsFolder(): string {
  try {
    // __dirname is available in CJS context (Node injects it)
    if (typeof __dirname !== "undefined" && __dirname) {
      return path.resolve(__dirname, "../drizzle");
    }
  } catch (_) {
    // ignore
  }
  // Fallback: Vercel sets cwd to project root
  return path.resolve(process.cwd(), "drizzle");
}

export async function runMigrations(): Promise<void> {
  const url = process.env.DATABASE_URL;
  if (!url) {
    console.warn("[migrate] DATABASE_URL not set — skipping migrations");
    return;
  }

  let client: Client | undefined;
  try {
    client = new Client({ connectionString: url, ssl: { rejectUnauthorized: false } });
    await client.connect();
    const db = drizzle(client);

    const migrationsFolder = getMigrationsFolder();

    console.log("[migrate] Running pending migrations from", migrationsFolder);
    await migrate(db, { migrationsFolder });
    console.log("[migrate] ✅ All migrations applied");
  } catch (err) {
    // Log but do NOT crash the server — the app can still serve requests
    // even if the migration step fails (tables may already exist).
    console.error("[migrate] ⚠️  Migration error (non-fatal):", err);
  } finally {
    await client?.end();
  }
}
