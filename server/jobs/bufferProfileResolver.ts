/**
 * Buffer Profile Resolver — PR #54
 *
 * Resolves Buffer profile IDs for owner-approved handles and persists them to
 * social_accounts.external_id (tenant 'athlynxai').
 *
 * Doctrine refs:
 *   - AthlynXAI_COMMUNICATIONS_DOCTRINE.md — "Do not guess channel IDs,
 *     organization IDs, page IDs, or profile IDs."
 *   - docs/specs/03-autonomous-os.md — Engine 3 Distribution Engine.
 *
 * Strict rules:
 *   1. Never write a row unless Buffer returned an exact handle match from the
 *      owner-approved priority list.
 *   2. If Buffer is unreachable or the token is missing, the resolver returns
 *      a clean error result; it never silently downgrades.
 *   3. Tenant is locked to 'athlynxai'.
 *   4. Posting still requires SOCIAL_POSTING_ENABLED=true through
 *      checkSocialPostingGuard — the resolver only writes routing rows.
 */

import { sql } from "drizzle-orm";
import { getDb } from "../db";

const BUFFER_API_BASE = "https://api.bufferapp.com/1";

// Owner-approved Instagram handle priority (locked in chat 2026-05-19).
// First match wins; later matches are recorded as 'inactive' so they're never
// silently used as a fallback.
export const APPROVED_INSTAGRAM_HANDLES: readonly string[] = [
  "chaddozier14",
  "chad_dozier",
  "chadallendozier",
  "dozier_chad",
];

function tenantId(): string {
  return (
    process.env.SOCIAL_OS_TENANT_ID ||
    process.env.AthlynXAI_TENANT_ID ||
    "athlynxai"
  ).trim();
}

interface BufferProfile {
  id: string;
  service: string;
  service_username?: string;
  service_id?: string;
  formatted_username?: string;
  default?: boolean;
  disabled?: boolean;
}

export interface ResolveBufferProfilesResult {
  ok: boolean;
  tenantId: string;
  fetchedProfiles: number;
  matchedInstagramHandle?: string;
  matchedInstagramProfileId?: string;
  rowsUpserted: number;
  rowsMarkedInactive: number;
  warnings: string[];
  errors: string[];
}

async function fetchBufferProfiles(token: string): Promise<BufferProfile[]> {
  const url = `${BUFFER_API_BASE}/profiles.json?access_token=${encodeURIComponent(token)}`;
  const resp = await fetch(url, { method: "GET" });
  if (!resp.ok) {
    const body = await resp.text().catch(() => "");
    throw new Error(
      `Buffer /profiles.json returned HTTP ${resp.status}: ${body.slice(0, 500)}`,
    );
  }
  const data = (await resp.json().catch(() => null)) as BufferProfile[] | null;
  if (!Array.isArray(data)) {
    throw new Error("Buffer /profiles.json returned non-array body");
  }
  return data;
}

function normalizeHandle(value: string | undefined | null): string {
  return (value ?? "").replace(/^@/, "").trim().toLowerCase();
}

function pickInstagramMatch(
  profiles: BufferProfile[],
): { profile: BufferProfile; handle: string } | null {
  const instagram = profiles.filter(
    (p) => (p.service ?? "").toLowerCase() === "instagram" && !p.disabled,
  );
  for (const approved of APPROVED_INSTAGRAM_HANDLES) {
    const match = instagram.find(
      (p) =>
        normalizeHandle(p.service_username) === approved ||
        normalizeHandle(p.formatted_username) === approved,
    );
    if (match) return { profile: match, handle: approved };
  }
  return null;
}

/**
 * Resolve Buffer profiles and upsert routing rows into social_accounts.
 * Returns a structured result; never throws on Buffer errors — callers
 * inspect `ok` and `errors`.
 */
export async function resolveBufferProfiles(): Promise<ResolveBufferProfilesResult> {
  const tenant = tenantId();
  const result: ResolveBufferProfilesResult = {
    ok: false,
    tenantId: tenant,
    fetchedProfiles: 0,
    rowsUpserted: 0,
    rowsMarkedInactive: 0,
    warnings: [],
    errors: [],
  };

  const token = process.env.BUFFER_ACCESS_TOKEN;
  if (!token) {
    result.errors.push("BUFFER_ACCESS_TOKEN env var is not configured");
    return result;
  }

  const db = await getDb();
  if (!db) {
    result.errors.push("Database unavailable");
    return result;
  }

  let profiles: BufferProfile[];
  try {
    profiles = await fetchBufferProfiles(token);
  } catch (err: any) {
    result.errors.push(err?.message ?? String(err));
    return result;
  }

  result.fetchedProfiles = profiles.length;

  // ─── Instagram (priority match) ────────────────────────────────────────────
  const match = pickInstagramMatch(profiles);
  if (!match) {
    result.warnings.push(
      `No Buffer Instagram profile matched approved handles ${APPROVED_INSTAGRAM_HANDLES.join(
        " | ",
      )}. Per doctrine, refusing to guess — Instagram routing not written.`,
    );
  } else {
    result.matchedInstagramHandle = match.handle;
    result.matchedInstagramProfileId = match.profile.id;

    // Upsert the matched Instagram profile.
    try {
      await db.execute(sql`
        INSERT INTO social_accounts (
          tenant_id, platform_slug, display_name, handle, external_id,
          access_token_env, status, metadata, created_at, updated_at
        ) VALUES (
          ${tenant},
          'instagram',
          ${match.profile.formatted_username ?? match.handle},
          ${match.handle},
          ${match.profile.id},
          'BUFFER_ACCESS_TOKEN',
          'active',
          ${JSON.stringify({
            buffer_service: match.profile.service,
            buffer_service_id: match.profile.service_id ?? null,
            resolved_at: new Date().toISOString(),
            resolver: "bufferProfileResolver/PR#54",
          })}::jsonb,
          NOW(),
          NOW()
        )
        ON CONFLICT (tenant_id, platform_slug, handle) DO UPDATE
          SET external_id = EXCLUDED.external_id,
              display_name = EXCLUDED.display_name,
              access_token_env = EXCLUDED.access_token_env,
              status = 'active',
              metadata = EXCLUDED.metadata,
              updated_at = NOW();
      `);
      result.rowsUpserted += 1;
    } catch (err: any) {
      // Likely missing unique index — fall back to manual UPSERT.
      const msg = err?.message ?? String(err);
      result.warnings.push(
        `ON CONFLICT path failed (${msg.slice(0, 200)}); falling back to UPDATE-then-INSERT`,
      );
      const upd = await db.execute(sql`
        UPDATE social_accounts
           SET external_id = ${match.profile.id},
               display_name = ${match.profile.formatted_username ?? match.handle},
               access_token_env = 'BUFFER_ACCESS_TOKEN',
               status = 'active',
               updated_at = NOW()
         WHERE tenant_id = ${tenant}
           AND platform_slug = 'instagram'
           AND handle = ${match.handle}
        RETURNING id;
      `);
      const updRows = ((upd as any).rows ?? upd) as Array<{ id: number }>;
      if (updRows.length === 0) {
        await db.execute(sql`
          INSERT INTO social_accounts (
            tenant_id, platform_slug, display_name, handle, external_id,
            access_token_env, status, created_at, updated_at
          ) VALUES (
            ${tenant}, 'instagram',
            ${match.profile.formatted_username ?? match.handle},
            ${match.handle}, ${match.profile.id}, 'BUFFER_ACCESS_TOKEN',
            'active', NOW(), NOW()
          );
        `);
      }
      result.rowsUpserted += 1;
    }

    // Mark every other approved Instagram handle that DID match a different
    // profile as 'inactive' so the seeder never silently routes to them.
    for (const handle of APPROVED_INSTAGRAM_HANDLES) {
      if (handle === match.handle) continue;
      try {
        const upd = await db.execute(sql`
          UPDATE social_accounts
             SET status = 'inactive',
                 last_error = 'Superseded by higher-priority approved handle ' || ${match.handle},
                 updated_at = NOW()
           WHERE tenant_id = ${tenant}
             AND platform_slug = 'instagram'
             AND handle = ${handle}
             AND status = 'active';
        `);
        const count = (upd as any).rowCount ?? ((upd as any).rows ?? []).length ?? 0;
        result.rowsMarkedInactive += count;
      } catch (err: any) {
        result.warnings.push(`mark-inactive failed for ${handle}: ${err?.message ?? String(err)}`);
      }
    }
  }

  result.ok = result.errors.length === 0;
  return result;
}
