/**
 * AthlynX CRM Hub Router (Build 4) — accounts, contacts, deals, activities, pipelines.
 *
 * Aligned with the brand doctrine:
 *   "People remember meaning, not features."
 * The CRM honors the athlete and the relationship, not feature comparisons.
 *
 * Stripe link: deals carry stripe_customer_id and stripe_subscription_id so
 * the dashboard can show MRR/ARR pulled from stripe_subscriptions_mirror.
 */
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { protectedProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import { sql } from "drizzle-orm";

const ACCOUNT_KINDS = ["org", "athlete", "family", "brand", "school", "team", "investor", "vendor"] as const;
const STAGES = ["prospect", "engaged", "active", "customer", "churned"] as const;
const DEAL_STAGES = ["lead", "qualified", "proposal", "committed", "closed_won", "closed_lost"] as const;
const ACTIVITY_KINDS = ["note", "call", "email", "meeting", "task", "post", "dm", "stripe_event"] as const;

export const crmHubRouter = router({

  // ─── Accounts ──────────────────────────────────────────────────────────────

  listAccounts: protectedProcedure
    .input(
      z.object({
        q: z.string().optional(),
        stage: z.enum(STAGES).optional(),
        kind: z.enum(ACCOUNT_KINDS).optional(),
        limit: z.number().min(1).max(500).default(100),
      }).optional()
    )
    .query(async ({ input }) => {
      const db = await getDb();
      const q = input?.q ? `%${input.q.toLowerCase()}%` : null;
      const rows = await db.execute(sql`
        SELECT id, name, kind, stage, city, state, industry, website,
               health_score, tags, updated_at, created_at
        FROM crm_accounts
        WHERE (${q}::text IS NULL OR LOWER(name) LIKE ${q} OR LOWER(COALESCE(industry,'')) LIKE ${q})
          AND (${input?.stage ?? null}::text IS NULL OR stage = ${input?.stage ?? null})
          AND (${input?.kind ?? null}::text IS NULL OR kind = ${input?.kind ?? null})
        ORDER BY updated_at DESC
        LIMIT ${input?.limit ?? 100}
      `);
      return (rows as any).rows ?? rows ?? [];
    }),

  getAccount: protectedProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const db = await getDb();
      const [acct, contacts, deals, activities] = await Promise.all([
        db.execute(sql`SELECT * FROM crm_accounts WHERE id = ${input.id}`),
        db.execute(sql`SELECT * FROM crm_hub_contacts WHERE account_id = ${input.id} ORDER BY is_primary DESC, full_name ASC`),
        db.execute(sql`SELECT * FROM crm_deals    WHERE account_id = ${input.id} ORDER BY updated_at DESC`),
        db.execute(sql`SELECT * FROM crm_activities WHERE account_id = ${input.id} ORDER BY occurred_at DESC LIMIT 100`),
      ]);
      const acctRow = ((acct as any).rows ?? acct ?? [])[0];
      if (!acctRow) throw new TRPCError({ code: "NOT_FOUND", message: "Account not found." });
      return {
        account: acctRow,
        contacts: (contacts as any).rows ?? contacts ?? [],
        deals: (deals as any).rows ?? deals ?? [],
        activities: (activities as any).rows ?? activities ?? [],
      };
    }),

  upsertAccount: protectedProcedure
    .input(
      z.object({
        id: z.number().optional(),
        name: z.string().min(1),
        kind: z.enum(ACCOUNT_KINDS).default("org"),
        website: z.string().url().optional(),
        industry: z.string().optional(),
        city: z.string().optional(),
        state: z.string().optional(),
        country: z.string().optional(),
        sizeLabel: z.string().optional(),
        stage: z.enum(STAGES).optional(),
        notes: z.string().optional(),
        tags: z.array(z.string()).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      const ownerId = Number(ctx.user.id);
      if (input.id) {
        await db.execute(sql`
          UPDATE crm_accounts SET
            name = ${input.name},
            kind = ${input.kind},
            website = ${input.website ?? null},
            industry = ${input.industry ?? null},
            city = ${input.city ?? null},
            state = ${input.state ?? null},
            country = ${input.country ?? "USA"},
            size_label = ${input.sizeLabel ?? null},
            stage = ${input.stage ?? "prospect"},
            notes = ${input.notes ?? null},
            tags = ${JSON.stringify(input.tags ?? [])}::jsonb,
            updated_at = now()
          WHERE id = ${input.id}
        `);
        return { ok: true, id: input.id };
      }
      const rows = await db.execute(sql`
        INSERT INTO crm_accounts
          (owner_user_id, name, kind, website, industry, city, state, country,
           size_label, stage, notes, tags)
        VALUES
          (${ownerId}, ${input.name}, ${input.kind}, ${input.website ?? null},
           ${input.industry ?? null}, ${input.city ?? null}, ${input.state ?? null},
           ${input.country ?? "USA"}, ${input.sizeLabel ?? null},
           ${input.stage ?? "prospect"}, ${input.notes ?? null},
           ${JSON.stringify(input.tags ?? [])}::jsonb)
        RETURNING id
      `);
      const id = Number(((rows as any).rows ?? rows ?? [])[0]?.id);
      return { ok: true, id };
    }),

  // ─── Contacts ──────────────────────────────────────────────────────────────

  upsertContact: protectedProcedure
    .input(
      z.object({
        id: z.number().optional(),
        accountId: z.number(),
        firstName: z.string().optional(),
        lastName: z.string().optional(),
        email: z.string().email().optional(),
        phone: z.string().optional(),
        title: z.string().optional(),
        roleLabel: z.string().optional(),
        linkedinUrl: z.string().url().optional(),
        isPrimary: z.boolean().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      const ownerId = Number(ctx.user.id);
      const fullName = `${input.firstName ?? ""} ${input.lastName ?? ""}`.trim() || null;
      if (input.id) {
        await db.execute(sql`
          UPDATE crm_hub_contacts SET
            first_name = ${input.firstName ?? null},
            last_name  = ${input.lastName ?? null},
            full_name  = ${fullName},
            email      = ${input.email ?? null},
            phone      = ${input.phone ?? null},
            title      = ${input.title ?? null},
            role_label = ${input.roleLabel ?? null},
            linkedin_url = ${input.linkedinUrl ?? null},
            is_primary = ${input.isPrimary ?? false},
            updated_at = now()
          WHERE id = ${input.id}
        `);
        return { ok: true, id: input.id };
      }
      const rows = await db.execute(sql`
        INSERT INTO crm_hub_contacts
          (account_id, owner_user_id, first_name, last_name, full_name,
           email, phone, title, role_label, linkedin_url, is_primary)
        VALUES
          (${input.accountId}, ${ownerId}, ${input.firstName ?? null},
           ${input.lastName ?? null}, ${fullName},
           ${input.email ?? null}, ${input.phone ?? null},
           ${input.title ?? null}, ${input.roleLabel ?? null},
           ${input.linkedinUrl ?? null}, ${input.isPrimary ?? false})
        RETURNING id
      `);
      return { ok: true, id: Number(((rows as any).rows ?? rows ?? [])[0]?.id) };
    }),

  // ─── Deals ─────────────────────────────────────────────────────────────────

  listDeals: protectedProcedure
    .input(z.object({ stage: z.enum(DEAL_STAGES).optional(), limit: z.number().default(200) }).optional())
    .query(async ({ input }) => {
      const db = await getDb();
      const rows = await db.execute(sql`
        SELECT d.*, a.name AS account_name
        FROM crm_deals d
        LEFT JOIN crm_accounts a ON a.id = d.account_id
        WHERE (${input?.stage ?? null}::text IS NULL OR d.stage = ${input?.stage ?? null})
        ORDER BY d.expected_close ASC NULLS LAST, d.updated_at DESC
        LIMIT ${input?.limit ?? 200}
      `);
      return (rows as any).rows ?? rows ?? [];
    }),

  pipelineSummary: protectedProcedure.query(async () => {
    const db = await getDb();
    const rows = await db.execute(sql`
      SELECT stage,
             COUNT(*)::int  AS count,
             COALESCE(SUM(amount_cents), 0)::bigint AS total_cents,
             COALESCE(SUM(amount_cents * probability / 100), 0)::bigint AS weighted_cents
      FROM crm_deals
      GROUP BY stage
      ORDER BY CASE stage
        WHEN 'lead' THEN 1
        WHEN 'qualified' THEN 2
        WHEN 'proposal' THEN 3
        WHEN 'committed' THEN 4
        WHEN 'closed_won' THEN 5
        WHEN 'closed_lost' THEN 6
        ELSE 99
      END
    `);
    return (rows as any).rows ?? rows ?? [];
  }),

  upsertDeal: protectedProcedure
    .input(
      z.object({
        id: z.number().optional(),
        accountId: z.number(),
        contactId: z.number().optional(),
        name: z.string().min(1),
        stage: z.enum(DEAL_STAGES).default("lead"),
        amountCents: z.number().int().default(0),
        currency: z.string().default("USD"),
        probability: z.number().min(0).max(100).default(10),
        expectedClose: z.string().optional(),
        source: z.string().optional(),
        notes: z.string().optional(),
        tags: z.array(z.string()).optional(),
        stripeCustomerId: z.string().optional(),
        stripeSubscriptionId: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      const ownerId = Number(ctx.user.id);
      if (input.id) {
        await db.execute(sql`
          UPDATE crm_deals SET
            account_id = ${input.accountId},
            contact_id = ${input.contactId ?? null},
            name = ${input.name},
            stage = ${input.stage},
            amount_cents = ${input.amountCents},
            currency = ${input.currency},
            probability = ${input.probability},
            expected_close = ${input.expectedClose ?? null},
            source = ${input.source ?? null},
            notes = ${input.notes ?? null},
            tags = ${JSON.stringify(input.tags ?? [])}::jsonb,
            stripe_customer_id = ${input.stripeCustomerId ?? null},
            stripe_subscription_id = ${input.stripeSubscriptionId ?? null},
            updated_at = now(),
            closed_at = CASE WHEN ${input.stage} IN ('closed_won','closed_lost') THEN now() ELSE closed_at END,
            won = CASE WHEN ${input.stage} = 'closed_won' THEN true
                       WHEN ${input.stage} = 'closed_lost' THEN false
                       ELSE won END
          WHERE id = ${input.id}
        `);
        return { ok: true, id: input.id };
      }
      const rows = await db.execute(sql`
        INSERT INTO crm_deals
          (account_id, contact_id, owner_user_id, name, stage,
           amount_cents, currency, probability, expected_close, source, notes, tags,
           stripe_customer_id, stripe_subscription_id)
        VALUES
          (${input.accountId}, ${input.contactId ?? null}, ${ownerId},
           ${input.name}, ${input.stage},
           ${input.amountCents}, ${input.currency}, ${input.probability},
           ${input.expectedClose ?? null}, ${input.source ?? null},
           ${input.notes ?? null}, ${JSON.stringify(input.tags ?? [])}::jsonb,
           ${input.stripeCustomerId ?? null}, ${input.stripeSubscriptionId ?? null})
        RETURNING id
      `);
      return { ok: true, id: Number(((rows as any).rows ?? rows ?? [])[0]?.id) };
    }),

  // ─── Activities ────────────────────────────────────────────────────────────

  logActivity: protectedProcedure
    .input(
      z.object({
        accountId: z.number().optional(),
        contactId: z.number().optional(),
        dealId: z.number().optional(),
        kind: z.enum(ACTIVITY_KINDS),
        subject: z.string().optional(),
        body: z.string().optional(),
        dueAt: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      await db.execute(sql`
        INSERT INTO crm_activities (account_id, contact_id, deal_id, user_id,
                                    kind, subject, body, due_at)
        VALUES (${input.accountId ?? null}, ${input.contactId ?? null},
                ${input.dealId ?? null}, ${Number(ctx.user.id)},
                ${input.kind}, ${input.subject ?? null},
                ${input.body ?? null}, ${input.dueAt ?? null})
      `);
      return { ok: true };
    }),

  // ─── Revenue snapshot (combines deals + Stripe mirror) ─────────────────────

  revenueSnapshot: protectedProcedure.query(async () => {
    const db = await getDb();
    const [pipeline, mrr, activeSubs, lifetime] = await Promise.all([
      db.execute(sql`
        SELECT COALESCE(SUM(amount_cents * probability / 100), 0)::bigint AS weighted_pipeline_cents
        FROM crm_deals
        WHERE stage NOT IN ('closed_won','closed_lost')
      `),
      db.execute(sql`
        SELECT COALESCE(SUM(amount_cents), 0)::bigint AS mrr_cents
        FROM stripe_subscriptions_mirror
        WHERE status IN ('active','trialing') AND interval = 'month'
      `),
      db.execute(sql`SELECT COUNT(*)::int AS n FROM stripe_subscriptions_mirror WHERE status IN ('active','trialing')`),
      db.execute(sql`
        SELECT COALESCE(SUM(amount_paid_cents), 0)::bigint AS lifetime_paid_cents
        FROM stripe_invoices_mirror WHERE status = 'paid'
      `),
    ]);
    return {
      weighted_pipeline_cents: Number(((pipeline as any).rows ?? pipeline ?? [])[0]?.weighted_pipeline_cents ?? 0),
      mrr_cents: Number(((mrr as any).rows ?? mrr ?? [])[0]?.mrr_cents ?? 0),
      active_subs: Number(((activeSubs as any).rows ?? activeSubs ?? [])[0]?.n ?? 0),
      lifetime_paid_cents: Number(((lifetime as any).rows ?? lifetime ?? [])[0]?.lifetime_paid_cents ?? 0),
    };
  }),
});
