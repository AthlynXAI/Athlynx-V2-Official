/**
 * Owner Daily Post Cron — AthlynXAI Layer Cake
 * Runs three times daily (10am, 1pm, 5pm CST).
 *
 * For every user with profile_automation.enabled = true:
 *   - If the user already has > 0 queued posts for today, skip them.
 *   - Otherwise, materialize ONE Real AI Me post draft using a small
 *     library of brand-voice prompts that pass the values gate.
 *   - Post is inserted into scheduled_posts with status = 'queued'.
 *
 * The Master Admin can preempt any queued post from /profile.
 *
 * Locked principles:
 *   - "Values first." Every post goes through runValuesGate before write.
 *   - "Man on a porch telling the truth." Voice is plain, short, anchored.
 *   - No emojis, no family disclosures, no "AI-powered" buzzwords.
 *
 * Iron Sharpens Iron — Proverbs 27:17.
 */
import { getDb } from "../db";
import { sql } from "drizzle-orm";
import { runValuesGate } from "../services/valuesGate";

const VOICE_BANK_REAL_AI: string[] = [
  "AthlynX isn't a recruiting app. It's a place to be known. Stand still long enough and the right people will find you.",
  "The complete athlete ecosystem. From backyard to billion-dollar deal. That isn't a slogan. It's the floor.",
  "We don't sell features. We protect a feeling — the feeling of being seen for who you are, not what you're worth on a chart.",
  "An athlete with a story is more valuable than an athlete with stats. Stats fade. Story compounds.",
  "Most platforms count followers. AthlynX counts neighbors. If your community shows up for you, the algorithm doesn't matter.",
  "There's no comparison game here. There's a values game. The athletes who win it don't have to shout about it.",
  "Built in Texas. Built for everyone everywhere. Built so nobody has to choose between being faithful and being seen.",
  "A platform should serve the person, not the other way around. If it costs you your peace, it isn't worth your time.",
  "The transfer portal didn't break athletes. The lack of identity did. AthlynX fixes the identity first.",
  "We measure success by who feels safer when they sign up — not by who feels bigger.",
];

const VOICE_BANK_REAL_ME: string[] = [
  "Iron sharpens iron. That's been the rule in every locker room I've ever stood in. It's the rule here too.",
  " The rest is just work.",
  "We don't build for the loudest. We build for the ones who keep showing up after the cameras leave.",
  "I've watched athletes get treated like inventory. We're done with that. AthlynX treats them like family.",
  " Every day. Because the alternative is bitterness, and bitterness has never built a thing worth keeping.",
];

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

interface AutomationRow {
  user_id: number;
  enabled: boolean;
  default_voice: string;
  channels: any;
  master_admin: boolean;
  quiet_hours_start?: number;
  quiet_hours_end?: number;
}

function inQuietHours(row: AutomationRow): boolean {
  const start = Number(row.quiet_hours_start ?? 22);
  const end = Number(row.quiet_hours_end ?? 6);
  const hour = new Date().getUTCHours();
  if (start === end) return false;
  if (start < end) return hour >= start && hour < end;
  return hour >= start || hour < end;
}

export async function runOwnerDailyPostCron(): Promise<{
  ok: boolean;
  considered: number;
  queued: number;
  skipped: number;
  errors: number;
}> {
  const db = await getDb();
  if (!db) {
    return { ok: false, considered: 0, queued: 0, skipped: 0, errors: 1 };
  }

  let considered = 0;
  let queued = 0;
  let skipped = 0;
  let errors = 0;

  try {
    const autoRows = await db.execute(sql`
      SELECT user_id, enabled, default_voice, channels, master_admin,
             quiet_hours_start, quiet_hours_end, daily_target_count
      FROM profile_automation
      WHERE enabled = true
    `);
    const rows: AutomationRow[] = (autoRows as any).rows ?? autoRows ?? [];
    considered = rows.length;

    for (const row of rows) {
      try {
        if (inQuietHours(row)) {
          skipped++;
          continue;
        }
        // Skip if user already has >=1 queued post for today
        const existing = await db.execute(sql`
          SELECT COUNT(*)::int AS c
          FROM scheduled_posts
          WHERE user_id = ${row.user_id}
            AND status = 'queued'
            AND scheduled_for::date = (now() AT TIME ZONE 'UTC')::date
        `);
        const c = Number(
          (((existing as any).rows ?? existing ?? [])[0] as any)?.c ?? 0,
        );
        if (c >= 1) {
          skipped++;
          continue;
        }

        const channels: string[] = Array.isArray(row.channels)
          ? row.channels
          : (() => {
              try {
                return JSON.parse(row.channels ?? "[]");
              } catch {
                return [];
              }
            })();
        if (channels.length === 0) {
          skipped++;
          continue;
        }

        const voice = row.default_voice === "real_me" ? "real_me" : "real_ai";
        const body =
          voice === "real_me" ? pick(VOICE_BANK_REAL_ME) : pick(VOICE_BANK_REAL_AI);

        // Hard values gate — never queue a post that doesn't pass
        const gate = runValuesGate(body);
        if (!gate.passes) {
          skipped++;
          continue;
        }

        const scheduledFor = new Date(Date.now() + 15 * 60 * 1000);

        await db.execute(sql`
          INSERT INTO scheduled_posts
            (user_id, voice, body, channels, scheduled_for, source, source_note)
          VALUES
            (${row.user_id}, ${voice}, ${body},
             ${JSON.stringify(channels)}::jsonb,
             ${scheduledFor.toISOString()}, 'agent', 'owner_daily_post cron')
        `);
        queued++;
      } catch (innerErr) {
        // eslint-disable-next-line no-console
        console.error("[ownerDailyPostCron] user error", row.user_id, innerErr);
        errors++;
      }
    }

    return { ok: true, considered, queued, skipped, errors };
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error("[ownerDailyPostCron] fatal", err);
    return { ok: false, considered, queued, skipped, errors: errors + 1 };
  }
}
