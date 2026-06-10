/**
 * Social Content Seeder — PR #54
 *
 * The autonomous, owner-approved-only seeder. Reads from social_content_approved
 * and materializes owner-approved packages into the live posting tables
 * (social_content + social_posts) one time per approved destination.
 *
 * Doctrine refs:
 *   - AthlynXAI_COMMUNICATIONS_DOCTRINE.md
 *   - docs/specs/03-autonomous-os.md (Engines 2 + 3)
 *   - OWNERSHIP_RUNBOOK.md ("Social posting kill switch")
 *
 * Permanent rules enforced by this file:
 *   1. NEVER repost the same content_hash to the same platform — regardless of
 *      whether the prior post status was 'posted', 'scheduled', or 'failed'.
 *      Chad's rule: "Never post same message video image content twice — brand
 *      new design."
 *   2. Skip any destination the owner did NOT explicitly approve in the
 *      approval row's destinations[] array.
 *   3. Instagram requires image_url OR video_url; reject text-only.
 *   4. TikTok is never seeded by this job (video-only platform, owner has
 *      historically blocked it in the worker).
 *   5. Tenant locked to 'athlynxai'.
 *   6. Does NOT post. Only writes status='scheduled' rows. The existing
 *      socialPostsWorker (gated by SOCIAL_POSTING_ENABLED) is the only path
 *      that can call Buffer.
 *
 * Side-effects: writes to social_content, social_posts, social_content_approved
 * (sets seeded_at + seeded_content_id). Idempotent: a second run skips rows
 * that already have seeded_at set, and the dedupe check blocks any re-emerged
 * duplicate.
 */

import { sql } from "drizzle-orm";
import { getDb } from "../db";

const BLOCKED_PLATFORMS = new Set<string>(["tiktok"]); // video-only, owner-blocked

function tenantId(): string {
  return (
    process.env.SOCIAL_OS_TENANT_ID ||
    process.env.AthlynXAI_TENANT_ID ||
    "athlynxai"
  ).trim();
}

export interface SeederBlocked {
  approvedId: number;
  contentHash: string;
  reason: string;
  platform?: string;
}

export interface SeederScheduled {
  approvedId: number;
  contentId: number;
  postId: number;
  platform: string;
  accountId: number;
  scheduledFor: string;
}

export interface SocialContentSeederResult {
  ok: boolean;
  tenantId: string;
  approvedRowsRead: number;
  scheduled: SeederScheduled[];
  blocked: SeederBlocked[];
  errors: string[];
  dryRun: boolean;
}

interface ApprovedRow {
  id: number;
  kind: string;
  title: string | null;
  body: string;
  link_url: string | null;
  image_url: string | null;
  video_url: string | null;
  tags: string[] | null;
  destinations: string[];
  content_hash: string;
  approved_by: string | null;
}

interface AccountRow {
  id: number;
  platform_slug: string;
  handle: string | null;
  external_id: string | null;
}

interface SeederOptions {
  /** When true, perform every read + duplicate check but write nothing. */
  dryRun?: boolean;
  /** Cap how many approved rows we process per run. Defaults to 5 (Buffer free tier). */
  maxRows?: number;
  /** Slot interval in minutes between scheduled posts on the same platform. */
  slotIntervalMinutes?: number;
}

function nextSlot(base: Date, offsetMinutes: number): Date {
  return new Date(base.getTime() + offsetMinutes * 60_000);
}

function validateFormat(row: ApprovedRow, platform: string): string | null {
  if (BLOCKED_PLATFORMS.has(platform)) {
    return `Platform '${platform}' is permanently blocked by owner doctrine`;
  }
  if (platform === "instagram") {
    if (!row.image_url && !row.video_url) {
      return "Instagram requires image_url or video_url; text-only feed posts are blocked";
    }
  }
  return null;
}

export async function runSocialContentSeeder(
  opts: SeederOptions = {},
): Promise<SocialContentSeederResult> {
  const tenant = tenantId();
  const dryRun = opts.dryRun === true;
  const maxRows = Math.max(1, Math.min(opts.maxRows ?? 5, 25));
  const slotInterval = Math.max(15, opts.slotIntervalMinutes ?? 60);

  const result: SocialContentSeederResult = {
    ok: false,
    tenantId: tenant,
    approvedRowsRead: 0,
    scheduled: [],
    blocked: [],
    errors: [],
    dryRun,
  };

  const db = await getDb();
  if (!db) {
    result.errors.push("Database unavailable");
    return result;
  }

  // ─── 1. Pull pending owner-approved rows ──────────────────────────────────
  let approved: ApprovedRow[];
  try {
    const r = await db.execute(sql`
      SELECT id, kind, title, body, link_url, image_url, video_url, tags,
             destinations, content_hash, approved_by
        FROM social_content_approved
       WHERE tenant_id = ${tenant}
         AND approved_at IS NOT NULL
         AND seeded_at IS NULL
       ORDER BY approved_at ASC, id ASC
       LIMIT ${maxRows};
    `);
    approved = ((r as any).rows ?? r) as ApprovedRow[];
  } catch (err: any) {
    result.errors.push(
      `Failed to read social_content_approved: ${err?.message ?? String(err)}`,
    );
    return result;
  }

  result.approvedRowsRead = approved.length;
  if (approved.length === 0) {
    result.ok = true;
    return result;
  }

  // ─── 2. Pull active routing accounts once ────────────────────────────────
  let accounts: AccountRow[];
  try {
    const r = await db.execute(sql`
      SELECT id, platform_slug, handle, external_id
        FROM social_accounts
       WHERE tenant_id = ${tenant}
         AND status = 'active'
         AND external_id IS NOT NULL
         AND external_id <> '';
    `);
    accounts = ((r as any).rows ?? r) as AccountRow[];
  } catch (err: any) {
    result.errors.push(
      `Failed to read social_accounts: ${err?.message ?? String(err)}`,
    );
    return result;
  }
  const accountByPlatform = new Map<string, AccountRow>();
  for (const a of accounts) {
    if (!accountByPlatform.has(a.platform_slug)) {
      accountByPlatform.set(a.platform_slug, a);
    }
  }

  // ─── 3. Process each approved package ────────────────────────────────────
  // Compute next scheduling slot per platform within this run.
  const nowMs = Date.now();
  const baseSlot = new Date(nowMs + 10 * 60_000); // first slot 10 min out
  const platformOffset = new Map<string, number>();

  for (const row of approved) {
    const destinations = Array.isArray(row.destinations) ? row.destinations : [];
    if (destinations.length === 0) {
      result.blocked.push({
        approvedId: row.id,
        contentHash: row.content_hash,
        reason: "destinations[] is empty — owner approval gate fails",
      });
      continue;
    }

    const platformsForThisRow: Array<{ platform: string; account: AccountRow; slot: Date }> = [];
    let rowBlocked = false;

    for (const platform of destinations) {
      const fmtErr = validateFormat(row, platform);
      if (fmtErr) {
        result.blocked.push({
          approvedId: row.id,
          contentHash: row.content_hash,
          platform,
          reason: fmtErr,
        });
        rowBlocked = true;
        continue;
      }

      const account = accountByPlatform.get(platform);
      if (!account) {
        result.blocked.push({
          approvedId: row.id,
          contentHash: row.content_hash,
          platform,
          reason: `No active social_accounts row with external_id for platform '${platform}' under tenant '${tenant}'. Resolve routing first.`,
        });
        rowBlocked = true;
        continue;
      }

      // ── Brand-new check: never repost same content_hash to same platform ──
      // ANY prior social_posts row at any status counts as a duplicate.
      let dupCount = 0;
      try {
        const r = await db.execute(sql`
          SELECT COUNT(*)::int AS n
            FROM social_posts
           WHERE tenant_id = ${tenant}
             AND platform_slug = ${platform}
             AND content_hash = ${row.content_hash};
        `);
        const rows = ((r as any).rows ?? r) as Array<{ n: number }>;
        dupCount = Number(rows?.[0]?.n ?? 0);
      } catch (err: any) {
        result.errors.push(
          `Duplicate check failed for hash=${row.content_hash} platform=${platform}: ${err?.message ?? String(err)}`,
        );
        rowBlocked = true;
        continue;
      }
      if (dupCount > 0) {
        result.blocked.push({
          approvedId: row.id,
          contentHash: row.content_hash,
          platform,
          reason: `content_hash already present in social_posts for ${platform} (${dupCount} prior row(s)). Brand-new design required.`,
        });
        rowBlocked = true;
        continue;
      }

      // Allocate the next slot for this platform.
      const offset = platformOffset.get(platform) ?? 0;
      const slot = nextSlot(baseSlot, offset);
      platformOffset.set(platform, offset + slotInterval);

      platformsForThisRow.push({ platform, account, slot });
    }

    if (rowBlocked || platformsForThisRow.length === 0) {
      // Don't half-seed: if any destination was blocked, refuse the package.
      // The owner can fix and re-approve.
      continue;
    }

    if (dryRun) {
      for (const p of platformsForThisRow) {
        result.scheduled.push({
          approvedId: row.id,
          contentId: -1,
          postId: -1,
          platform: p.platform,
          accountId: p.account.id,
          scheduledFor: p.slot.toISOString(),
        });
      }
      continue;
    }

    // ─── 4. Insert social_content + social_posts in a single transaction ───
    try {
      await db.execute(sql`BEGIN;`);

      const tagsLiteral = row.tags ?? null;
      const contentInsert = await db.execute(sql`
        INSERT INTO social_content (
          tenant_id, kind, title, body, link_url, image_url, video_url,
          tags, content_hash, is_active, created_by, created_at, updated_at
        ) VALUES (
          ${tenant},
          ${row.kind},
          ${row.title},
          ${row.body},
          ${row.link_url},
          ${row.image_url},
          ${row.video_url},
          ${tagsLiteral},
          ${row.content_hash},
          TRUE,
          ${row.approved_by ?? "social-content-seeder"},
          NOW(),
          NOW()
        )
        RETURNING id;
      `);
      const contentRows = ((contentInsert as any).rows ?? contentInsert) as Array<{ id: number }>;
      const contentId = contentRows?.[0]?.id;
      if (!contentId) throw new Error("social_content insert returned no id");

      for (const p of platformsForThisRow) {
        const postInsert = await db.execute(sql`
          INSERT INTO social_posts (
            tenant_id, content_id, account_id, platform_slug, content_hash,
            status, scheduled_for, attempt, created_at, updated_at
          ) VALUES (
            ${tenant},
            ${contentId},
            ${p.account.id},
            ${p.platform},
            ${row.content_hash},
            'scheduled',
            ${p.slot.toISOString()}::timestamptz,
            1,
            NOW(),
            NOW()
          )
          RETURNING id;
        `);
        const postRows = ((postInsert as any).rows ?? postInsert) as Array<{ id: number }>;
        const postId = postRows?.[0]?.id;
        if (!postId) throw new Error("social_posts insert returned no id");

        result.scheduled.push({
          approvedId: row.id,
          contentId,
          postId,
          platform: p.platform,
          accountId: p.account.id,
          scheduledFor: p.slot.toISOString(),
        });
      }

      await db.execute(sql`
        UPDATE social_content_approved
           SET seeded_at = NOW(),
               seeded_content_id = ${contentId},
               updated_at = NOW()
         WHERE id = ${row.id};
      `);

      await db.execute(sql`COMMIT;`);
    } catch (err: any) {
      try { await db.execute(sql`ROLLBACK;`); } catch (_) {}
      result.errors.push(
        `Seed transaction failed for approved id=${row.id} hash=${row.content_hash}: ${err?.message ?? String(err)}`,
      );
    }
  }

  result.ok = result.errors.length === 0;
  return result;
}
