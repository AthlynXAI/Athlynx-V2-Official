import { sql } from "drizzle-orm";
import { getDb } from "../db";
import { sendCustomEmail } from "../services/email";

const OWNER_EMAILS = [
  "chaddozier75@gmail.com",
  "cdozier14@athlynx.ai",
  "cdozier@dozierholdingsgroup.com",
];

export interface SocialQueueGuardrailResult {
  ok: boolean;
  alertSent: boolean;
  socialAccounts: number;
  socialContent: number;
  scheduledToday: number;
  scheduledFuture: number;
  reason?: string;
  errors: string[];
}

function asNumber(value: unknown): number {
  const n = Number(value ?? 0);
  return Number.isFinite(n) ? n : 0;
}

function socialOsTenantId(): string {
  return (process.env.SOCIAL_OS_TENANT_ID || process.env.AthlynXAI_TENANT_ID || "athlynxai").trim();
}

async function notifyOwners(subject: string, html: string, text: string): Promise<void> {
  await Promise.all(OWNER_EMAILS.map((to) => sendCustomEmail(to, subject, html, text)));
}

export async function runSocialQueueGuardrail(): Promise<SocialQueueGuardrailResult> {
  const result: SocialQueueGuardrailResult = {
    ok: true,
    alertSent: false,
    socialAccounts: 0,
    socialContent: 0,
    scheduledToday: 0,
    scheduledFuture: 0,
    errors: [],
  };

  const db = await getDb();
  if (!db) {
    result.ok = false;
    result.reason = "DB unavailable";
    result.errors.push("DB unavailable");
    await notifyOwners(
      "CRITICAL: AthlynXAI Social OS queue guardrail cannot reach database",
      `<p>The weekday Social OS guardrail could not reach the production database. This means the social queue cannot be verified.</p><p><strong>Action required:</strong> inspect Neon/Vercel DATABASE_URL immediately.</p>`,
      "The weekday Social OS guardrail could not reach the production database. Action required: inspect Neon/Vercel DATABASE_URL immediately."
    );
    result.alertSent = true;
    return result;
  }

  try {
    const tenantId = socialOsTenantId();
    // Keep the guardrail resilient: one failed count should identify the exact
    // failing table/query instead of collapsing a four-count dashboard query.
    // The scheduled-today window is computed in PostgreSQL using the Chicago
    // business day and compared against TIMESTAMPTZ values in UTC.
    const [accountsCount, contentCount, scheduledTodayCount, scheduledFutureCount] = await Promise.all([
      db.execute(sql`
        SELECT COUNT(*) AS count
        FROM social_accounts
        WHERE tenant_id = ${tenantId}
          AND status = 'active'
      `),
      db.execute(sql`
        SELECT COUNT(*) AS count
        FROM social_content
        WHERE tenant_id = ${tenantId}
          AND is_active IS TRUE
      `),
      db.execute(sql`
        SELECT COUNT(*) AS count
        FROM social_posts
        WHERE tenant_id = ${tenantId}
          AND status = 'scheduled'
          AND scheduled_for IS NOT NULL
          AND scheduled_for >= (date_trunc('day', now() AT TIME ZONE 'America/Chicago') AT TIME ZONE 'America/Chicago')
          AND scheduled_for < ((date_trunc('day', now() AT TIME ZONE 'America/Chicago') + interval '1 day') AT TIME ZONE 'America/Chicago')
      `),
      db.execute(sql`
        SELECT COUNT(*) AS count
        FROM social_posts
        WHERE tenant_id = ${tenantId}
          AND status = 'scheduled'
      `),
    ]);

    const firstRow = (value: any) => ((value as any).rows ?? value)?.[0] ?? {};
    result.socialAccounts = asNumber(firstRow(accountsCount).count);
    result.socialContent = asNumber(firstRow(contentCount).count);
    result.scheduledToday = asNumber(firstRow(scheduledTodayCount).count);
    result.scheduledFuture = asNumber(firstRow(scheduledFutureCount).count);

    const failures: string[] = [];
    if (result.socialAccounts === 0) failures.push("social_accounts has zero active rows");
    // social_content may be empty while the seeder is priming the queue from
    // social_content_approved — this is not a posting failure. Only alert if
    // social_posts has nothing scheduled for today, which is the actual gate.
    if (result.scheduledToday === 0) failures.push("social_posts has zero scheduled rows for today (seeder may still be priming)");

    if (failures.length > 0) {
      result.ok = false;
      result.reason = failures.join("; ");
      const subject = "CRITICAL: AthlynXAI Social OS has no scheduled post ready for today";
      const text = `AthlynXAI Social OS guardrail fired.\n\nTenant: ${tenantId}\n\nFailures:\n- ${failures.join("\n- ")}\n\nCounts:\nactive social_accounts=${result.socialAccounts}\nactive social_content=${result.socialContent}\nscheduled social_posts today=${result.scheduledToday}\ntotal scheduled social_posts=${result.scheduledFuture}\n\nAction required: seed/verify social_accounts, social_content, and social_posts before the next posting cron. No post was sent by this guardrail.`;
      const html = `<!doctype html><html><body style="font-family:Arial,sans-serif;background:#0a0f1e;color:#fff;padding:24px;">
        <h2 style="color:#ffcc00;">AthlynXAI Social OS Guardrail</h2>
        <p>The weekday guardrail found the Social OS queue incomplete. No post was sent by this guardrail.</p>
        <p>Tenant: <code>${tenantId}</code></p>
        <ul>${failures.map((f) => `<li><strong>${f}</strong></li>`).join("")}</ul>
        <table cellpadding="8" cellspacing="0" style="border-collapse:collapse;background:#0d1b3e;color:#fff;">
          <tr><td>Active social_accounts</td><td><strong>${result.socialAccounts}</strong></td></tr>
          <tr><td>Active social_content</td><td><strong>${result.socialContent}</strong></td></tr>
          <tr><td>Scheduled social_posts today</td><td><strong>${result.scheduledToday}</strong></td></tr>
          <tr><td>Total scheduled social_posts</td><td><strong>${result.scheduledFuture}</strong></td></tr>
        </table>
        <p><strong>Action required:</strong> seed/verify <code>social_accounts</code>, <code>social_content</code>, and <code>social_posts</code> before the next posting cron.</p>
      </body></html>`;
      await notifyOwners(subject, html, text);
      result.alertSent = true;
    }

    return result;
  } catch (err: any) {
    result.ok = false;
    const reason = err?.message ?? String(err);
    result.reason = reason;
    result.errors.push(reason);
    await notifyOwners(
      "CRITICAL: AthlynXAI Social OS guardrail query failed",
      `<p>The Social OS guardrail query failed:</p><pre>${reason.slice(0, 1000)}</pre>`,
      `The Social OS guardrail query failed: ${reason.slice(0, 1000)}`
    );
    result.alertSent = true;
    return result;
  }
}
