/**
 * GameChanger Final Score Webhook — Build 27.1 Phase 2.3b
 *
 * Endpoint: POST /api/webhooks/gamechanger/final-score
 *
 * Receives game-completion payloads from GameChanger and auto-creates a
 * <FinalScoreStudio /> graphic row in studio_graphics, so the team's social
 * feed lights up the moment a game ends — no manual input.
 *
 * Auth model:
 *   - HMAC-SHA256 over the raw body, signed with GAMECHANGER_WEBHOOK_SECRET.
 *   - Signature delivered in the `X-GC-Signature` header as `sha256=<hex>`.
 *   - Falls back to a constant-time secret check via `X-GC-Token` for setups
 *     that only support shared-token auth.
 *
 * Idempotency:
 *   - Each payload's GameChanger event ID is stored in the graphic row's
 *     payload->>'gcEventId' field. A duplicate POST is a no-op 200.
 *
 * Owner mapping:
 *   - GameChanger team_id → athlynx user via a lookup column on
 *     athlete_profiles.gameChangerTeamId (added by migration 0011 sibling, or
 *     existing team_settings table if present). For V1 we resolve the owner by
 *     scanning team_settings.gc_team_id; if no match, we drop into a
 *     platform-owned "orphan" bucket logged for manual claim.
 *
 * Doctrine:
 *   - Athlete-owned: graphic row is written under the resolved team owner's
 *     userId. Orphans go to userId=0 and are flagged in console for review.
 *   - Routing not inventory: we do NOT copy GameChanger box scores into our
 *     own tables. We store only the public summary fields needed to render
 *     the FinalScore graphic.
 */

import crypto from "crypto";
import { type Express, type Request, type Response } from "express";
import { Pool } from "pg";

let _pool: Pool | null = null;
function getPool(): Pool {
  if (!_pool) {
    _pool = new Pool({
      connectionString: process.env.DATABASE_URL!,
      ssl: { rejectUnauthorized: false },
      max: 3,
    });
  }
  return _pool;
}

interface GameChangerPayload {
  event_id?: string;
  eventId?: string;
  team_id?: string;
  teamId?: string;
  team_name?: string;
  teamName?: string;
  opponent_name?: string;
  opponent?: string;
  game_date?: string;
  gameDate?: string;
  final_score?: { us?: number; them?: number };
  score?: { us?: number; them?: number };
  result?: "W" | "L" | "T";
  top_performer?: { name?: string; line?: string };
  topPerformer?: { name?: string; line?: string };
}

function pickEventId(p: GameChangerPayload): string | null {
  return (p.event_id ?? p.eventId ?? null) || null;
}
function pickTeamId(p: GameChangerPayload): string | null {
  return (p.team_id ?? p.teamId ?? null) || null;
}
function pickTeamName(p: GameChangerPayload): string {
  return (p.team_name ?? p.teamName ?? "").trim();
}
function pickOpponent(p: GameChangerPayload): string {
  return (p.opponent_name ?? p.opponent ?? "").trim();
}
function pickGameDate(p: GameChangerPayload): string | null {
  const v = p.game_date ?? p.gameDate ?? null;
  if (!v) return null;
  // Normalise to YYYY-MM-DD
  const d = new Date(v);
  if (Number.isNaN(d.getTime())) return null;
  return d.toISOString().slice(0, 10);
}
function pickScore(p: GameChangerPayload): { us: number; them: number } | null {
  const s = p.final_score ?? p.score;
  if (!s) return null;
  if (typeof s.us !== "number" || typeof s.them !== "number") return null;
  return { us: s.us, them: s.them };
}
function computeResult(score: { us: number; them: number } | null): "W" | "L" | "T" | null {
  if (!score) return null;
  if (score.us > score.them) return "W";
  if (score.us < score.them) return "L";
  return "T";
}
function pickTopPerformer(p: GameChangerPayload): string | null {
  const tp = p.top_performer ?? p.topPerformer;
  if (!tp || !tp.name) return null;
  return tp.line ? `${tp.name} — ${tp.line}` : tp.name;
}

/**
 * Constant-time signature verification.
 * Returns true if (a) HMAC signature matches, OR (b) shared token matches.
 * If no secret is configured, returns true but logs a loud warning so we
 * don't silently accept unsigned traffic in production.
 */
function verifyAuth(req: Request, rawBody: string): boolean {
  const secret = process.env.GAMECHANGER_WEBHOOK_SECRET;
  if (!secret) {
    console.warn(
      "[GameChanger] GAMECHANGER_WEBHOOK_SECRET not set — accepting webhook without verification. " +
        "Set the secret in Vercel before production traffic.",
    );
    return true;
  }

  // Prefer HMAC if header present.
  const sigHeader = req.header("x-gc-signature") ?? req.header("X-GC-Signature");
  if (sigHeader) {
    const provided = sigHeader.startsWith("sha256=") ? sigHeader.slice(7) : sigHeader;
    const expected = crypto.createHmac("sha256", secret).update(rawBody).digest("hex");
    try {
      const a = Buffer.from(provided, "hex");
      const b = Buffer.from(expected, "hex");
      if (a.length !== b.length) return false;
      return crypto.timingSafeEqual(a, b);
    } catch {
      return false;
    }
  }

  // Fallback to shared-token auth.
  const tokenHeader = req.header("x-gc-token") ?? req.header("X-GC-Token");
  if (tokenHeader) {
    const a = Buffer.from(tokenHeader);
    const b = Buffer.from(secret);
    if (a.length !== b.length) return false;
    return crypto.timingSafeEqual(a, b);
  }

  return false;
}

/**
 * Resolve the AthlynXAI owner userId for a GameChanger team_id.
 * V1: scan team_settings (if it exists) for gc_team_id. If no match, return 0
 * (orphan bucket) and log so Chad can claim it via admin UI.
 */
async function resolveOwnerUserId(gcTeamId: string): Promise<number> {
  const pool = getPool();
  try {
    const result = await pool.query(
      `SELECT "userId" FROM team_settings WHERE "gcTeamId" = $1 LIMIT 1`,
      [gcTeamId],
    );
    if (result.rows.length > 0 && result.rows[0].userId) {
      return Number(result.rows[0].userId);
    }
  } catch {
    // team_settings.gcTeamId may not exist yet — that's fine, fall through.
  }
  console.warn(
    `[GameChanger] No owner mapping for team_id=${gcTeamId} — routing to orphan bucket (userId=0)`,
  );
  return 0;
}

/**
 * Idempotency check: has this gcEventId already been ingested?
 */
async function alreadyIngested(gcEventId: string): Promise<boolean> {
  const pool = getPool();
  try {
    const result = await pool.query(
      `SELECT id FROM studio_graphics
       WHERE type = 'finalscore'
         AND payload->>'gcEventId' = $1
       LIMIT 1`,
      [gcEventId],
    );
    return result.rows.length > 0;
  } catch {
    return false;
  }
}

export function registerGameChangerWebhook(app: Express): void {
  app.post(
    "/api/webhooks/gamechanger/final-score",
    async (req: Request, res: Response) => {
      try {
        // Reconstruct raw body for HMAC verification. express.json() has already
        // parsed req.body, so we re-serialise. This is exact for application/json
        // bodies as long as GameChanger sends valid JSON with no trailing bytes.
        const rawBody = typeof req.body === "string" ? req.body : JSON.stringify(req.body);

        if (!verifyAuth(req, rawBody)) {
          res.status(401).json({ ok: false, reason: "unauthorized" });
          return;
        }

        const payload: GameChangerPayload =
          typeof req.body === "string" ? JSON.parse(req.body) : (req.body ?? {});

        const gcEventId = pickEventId(payload);
        const gcTeamId = pickTeamId(payload);
        const teamName = pickTeamName(payload);
        const opponent = pickOpponent(payload);
        const gameDate = pickGameDate(payload);
        const score = pickScore(payload);
        const result = (payload.result ?? computeResult(score)) ?? null;
        const topPerformer = pickTopPerformer(payload);

        if (!gcEventId || !gcTeamId || !teamName || !opponent || !score) {
          res.status(200).json({
            ok: false,
            reason: "incomplete_payload",
            missing: {
              gcEventId: !gcEventId,
              gcTeamId: !gcTeamId,
              teamName: !teamName,
              opponent: !opponent,
              score: !score,
            },
          });
          return;
        }

        // Idempotency: duplicate POSTs return 200 without re-writing.
        if (await alreadyIngested(gcEventId)) {
          res.status(200).json({ ok: true, deduped: true, gcEventId });
          return;
        }

        const ownerUserId = await resolveOwnerUserId(gcTeamId);

        const graphicPayload = {
          source: "gamechanger",
          gcEventId,
          gcTeamId,
          teamName,
          opponent,
          gameDate,
          score,
          result,
          topPerformer,
          ingestedAt: new Date().toISOString(),
        };

        const pool = getPool();
        const insert = await pool.query(
          `INSERT INTO studio_graphics
             ("userId", type, "teamName", payload, captions, "publishedTo", "createdAt", "updatedAt")
           VALUES ($1, 'finalscore', $2, $3, NULL, NULL, NOW(), NOW())
           RETURNING id`,
          [ownerUserId, teamName, JSON.stringify(graphicPayload)],
        );

        const graphicId = Number(insert.rows[0].id);
        console.log(
          `[GameChanger] ✅ Final score ingested — graphic id=${graphicId} ` +
            `team=${teamName} vs ${opponent} ${score.us}-${score.them} (${result}) ` +
            `owner=${ownerUserId} gcEventId=${gcEventId}`,
        );

        res.status(200).json({
          ok: true,
          graphicId,
          ownerUserId,
          orphan: ownerUserId === 0,
          gcEventId,
        });
      } catch (err) {
        console.error("[GameChanger] Unhandled error:", err);
        // Return 200 so GameChanger doesn't retry on internal blips.
        res.status(200).json({
          ok: false,
          reason: "internal_error",
          message: err instanceof Error ? err.message : String(err),
        });
      }
    },
  );
}
