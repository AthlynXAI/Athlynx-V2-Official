/**
 * AthlynX Social Posts Worker — Build 9 (Relight)
 * ─────────────────────────────────────────────────────────
 *
 * Owner-controlled, killswitch-gated worker that takes scheduled rows
 * from `social_posts` and actually sends them outward via Buffer.
 *
 * Hard rules (do not violate):
 *   1. ALL posting MUST flow through checkSocialPostingGuard().
 *      Even if a row exists and an account is connected, no post leaves
 *      unless SOCIAL_POSTING_ENABLED=true.
 *   2. NO hardcoded tokens. Buffer token comes from process.env only.
 *   3. Dedupe is DB-enforced by uniq_social_posts_hash_platform_success.
 *      Worker does not "creatively" retry on duplicate errors.
 *   4. On failure, the row is marked status='failed' with the error text.
 *      Worker may retry failed rows with attempts below MAX_AUTO_RETRY_ATTEMPTS
 *      after the owner repairs auth/secrets, so broken Buffer/Zapier routes do
 *      not permanently kill the social distribution loop.
 *   5. Worker NEVER posts to TikTok (video-only platform).
 *
 * Owner: Chad A Dozier — created 2026-05-12
 * Iron Sharpens Iron — Proverbs 27:17
 */
import { getDb } from "../db";
import { sql } from "drizzle-orm";
import { checkSocialPostingGuard } from "../services/socialPostingGuard";
import { schedulePost as bufferSchedulePost } from "../services/buffer";

export interface WorkerResult {
  ok: boolean;
  considered: number;
  posted: number;
  failed: number;
  skipped_killswitch: boolean;
  errors: string[];
}

export interface ScheduledPostRow {
  id: number;
  content_id: number;
  account_id: number;
  platform_slug: string;
  content_hash: string;
  status: string;
  scheduled_for: string | null;
  attempt: number;
  body: string;
  image_url: string | null;
  account_external_id: string | null;
  account_status: string;
}

const NEVER_POST_PLATFORMS = ["tiktok"]; // video-only
const MAX_AUTO_RETRY_ATTEMPTS = Number(process.env.SOCIAL_POST_MAX_RETRY_ATTEMPTS || 3);

function socialOsTenantId(): string {
  return (process.env.SOCIAL_OS_TENANT_ID || process.env.AthlynXAI_TENANT_ID || "athlynxai").trim();
}

export async function runSocialPostsWorker(opts?: { limit?: number }): Promise<WorkerResult> {
  const result: WorkerResult = {
    ok: true,
    considered: 0,
    posted: 0,
    failed: 0,
    skipped_killswitch: false,
    errors: [],
  };

  // Hard gate FIRST. No DB query if posting is disabled.
  const guard = checkSocialPostingGuard();
  if (!guard.allowed) {
    result.skipped_killswitch = true;
    result.ok = false;
    return result;
  }

  const db = await getDb();
  if (!db) {
    result.ok = false;
    result.errors.push("DB unavailable");
    return result;
  }

  const limit = opts?.limit ?? 10;
  const tenantId = socialOsTenantId();

  // Pick up due scheduled rows and recoverable failed rows. The recoverable
  // failed path is critical after Buffer/Zapier auth outages: once credentials
  // are fixed, previously failed rows should not remain dead forever.
  const rowsRes = await db.execute(sql`
    SELECT
      sp.id, sp.content_id, sp.account_id, sp.platform_slug, sp.content_hash,
      sp.status, sp.scheduled_for, sp.attempt,
      sc.body, sc.image_url,
      sa.external_id AS account_external_id, sa.status AS account_status
    FROM social_posts sp
    JOIN social_content sc ON sc.id = sp.content_id
    JOIN social_accounts sa ON sa.id = sp.account_id
    WHERE sp.tenant_id = ${tenantId}
      AND (
        sp.status = 'scheduled'
        OR (
          sp.status = 'failed'
          AND sp.attempt < ${MAX_AUTO_RETRY_ATTEMPTS}
          AND COALESCE(sp.error, '') NOT ILIKE '%duplicate%'
        )
      )
      AND (sp.scheduled_for IS NULL OR sp.scheduled_for <= NOW())
      AND sa.status = 'active'
    ORDER BY
      CASE WHEN sp.status = 'failed' THEN 0 ELSE 1 END,
      sp.scheduled_for NULLS FIRST,
      sp.id
    LIMIT ${limit}
  `);
  const rows = ((rowsRes as any).rows ?? rowsRes) as ScheduledPostRow[];
  result.considered = rows.length;

  for (const row of rows) {
    // Skip platforms we never post to
    if (NEVER_POST_PLATFORMS.includes(row.platform_slug)) {
      await markFailed(db, row.id, "platform skipped: " + row.platform_slug);
      result.failed++;
      continue;
    }

    // For Buffer-based platforms, the external_id IS the Buffer profile id
    if (!row.account_external_id) {
      await markFailed(db, row.id, "account has no external_id (Buffer profile id missing)");
      result.failed++;
      continue;
    }

    try {
      const sendRes = await bufferSchedulePost(
        [row.account_external_id],
        row.body,
        row.image_url ?? undefined
      );

      if (!sendRes.ok) {
        const errMsg = `Buffer responded ${sendRes.status}: ${JSON.stringify(sendRes.body).slice(0, 400)}`;
        await markFailed(db, row.id, errMsg);
        result.failed++;
        result.errors.push(`post ${row.id}: ${errMsg}`);
        continue;
      }

      // Parse Buffer response for external id
      const body: any = sendRes.body ?? {};
      const updateId =
        body?.updates?.[0]?.id ??
        body?.id ??
        null;

      await db.execute(sql`
        UPDATE social_posts
        SET
          status = 'posted',
          posted_at = NOW(),
          external_post_id = ${updateId},
          error = NULL,
          updated_at = NOW()
        WHERE id = ${row.id}
      `);

      // Update content usage stats
      await db.execute(sql`
        UPDATE social_content
        SET use_count = use_count + 1, last_used_at = NOW(), updated_at = NOW()
        WHERE id = ${row.content_id}
      `);

      result.posted++;
    } catch (err: any) {
      const msg = err?.message ?? String(err);
      await markFailed(db, row.id, msg);
      result.failed++;
      result.errors.push(`post ${row.id}: ${msg}`);
    }
  }

  return result;
}

async function markFailed(db: any, id: number, error: string): Promise<void> {
  await db.execute(sql`
    UPDATE social_posts
    SET
      status = 'failed',
      error = ${error.slice(0, 1000)},
      attempt = attempt + 1,
      updated_at = NOW()
    WHERE id = ${id}
  `);
}
