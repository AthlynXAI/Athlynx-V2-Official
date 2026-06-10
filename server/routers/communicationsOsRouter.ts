import { z } from "zod";
import { sql } from "drizzle-orm";
import { protectedProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import {
  communicationsOsPrinciples,
  protectedCommunicationClasses,
  providerCapabilities,
  senderIdentityRules,
} from "@shared/communicationsOs";

const cleanupDecisionInput = z.object({
  from: z.string().optional(),
  subject: z.string().optional(),
  snippet: z.string().optional(),
  provider: z.string().optional(),
});

const protectedTerms = [
  "regions",
  "chase",
  "bank of america",
  "stripe",
  "tax",
  "ein",
  "billing",
  "payment",
  "invoice",
  "legal",
  "contract",
  "nda",
  "insurance",
  "claim",
  "policy",
  "verification",
  "password",
  "security",
  "github",
  "vercel",
  "google",
  "microsoft",
  "athlynx",
  "dozier holdings",
  "softmor",
  "nil portal",
];

const junkTerms = [
  "marlboro",
  "papa john",
  "pizza",
  "final day to save",
  "wild week",
  "promoted",
  "sale",
  "coupon",
  "newsletter",
  "unsubscribe",
  "retail",
  "techcrunch daily",
  "marriott bonvoy",
];

function classifySafeAction(input: z.infer<typeof cleanupDecisionInput>) {
  const haystack = `${input.from ?? ""} ${input.subject ?? ""} ${input.snippet ?? ""}`.toLowerCase();
  const protectedHits = protectedTerms.filter((term) => haystack.includes(term));
  const junkHits = junkTerms.filter((term) => haystack.includes(term));

  if (protectedHits.length > 0) {
    return {
      recommendedAction: "preserve_review",
      risk: "high",
      canAutoDelete: false,
      reason: `Protected terms detected: ${protectedHits.join(", ")}`,
    };
  }

  if (junkHits.length > 0) {
    return {
      recommendedAction: "trash_or_spam_if_provider_allows",
      risk: "low",
      canAutoDelete: true,
      reason: `Promotional/junk terms detected: ${junkHits.join(", ")}`,
    };
  }

  return {
    recommendedAction: "needs_review",
    risk: "normal",
    canAutoDelete: false,
    reason: "No decisive protected or junk terms detected.",
  };
}

export const communicationsOsRouter = router({
  status: protectedProcedure.query(async () => {
    const db = await getDb();
    let presentTables: string[] = [];

    if (db) {
      const tableRows = await db.execute(sql`
        SELECT table_name
        FROM information_schema.tables
        WHERE table_schema = 'public'
          AND table_name IN (
            'communication_accounts',
            'communication_threads',
            'communication_events',
            'communication_classifications',
            'communication_actions',
            'reply_templates',
            'automation_rules',
            'automation_runs'
          )
        ORDER BY table_name
      `);

      const rows = ((tableRows as any).rows ?? tableRows ?? []) as Array<{ table_name: string }>;
      presentTables = rows.map((row) => row.table_name);
    }

    return {
      build: "Build 30 — Live Communications Execution",
      productionMode: "live_intake_safe_cleanup",
      liveData: true,
      providerCapabilities,
      senderIdentityRules,
      protectedCommunicationClasses,
      principles: communicationsOsPrinciples,
      database: {
        expectedTables: 8,
        presentTables,
        ready: presentTables.length === 8,
      },
      guardrails: [
        "No public migration route.",
        "No Vercel build-time database migration.",
        "No email send automation. Drafts require explicit company sender identity, and final sending remains manual after owner approval.",
        "No deletion of protected finance/legal/security/personal/business classes.",
      ],
    };
  }),

  providerMatrix: protectedProcedure.query(() => ({
    providers: providerCapabilities,
    senderIdentityRules,
    protectedClasses: protectedCommunicationClasses,
    principles: communicationsOsPrinciples,
  })),

  cleanupDecision: protectedProcedure
    .input(cleanupDecisionInput)
    .mutation(({ input }) => classifySafeAction(input)),

  dashboardSummary: protectedProcedure.query(async () => {
    const db = await getDb();
    let summary: Record<string, number> = {
      accounts: 0,
      threads: 0,
      events: 0,
      classifications: 0,
      actions: 0,
      rules: 0,
      runs: 0,
    };

    if (db) {
      try {
        const counts = await db.execute(sql`
          SELECT
            (SELECT COUNT(*)::int FROM communication_accounts) AS accounts,
            (SELECT COUNT(*)::int FROM communication_threads) AS threads,
            (SELECT COUNT(*)::int FROM communication_events) AS events,
            (SELECT COUNT(*)::int FROM communication_classifications) AS classifications,
            (SELECT COUNT(*)::int FROM communication_actions) AS actions,
            (SELECT COUNT(*)::int FROM automation_rules) AS rules,
            (SELECT COUNT(*)::int FROM automation_runs) AS runs
        `);

        summary = (((counts as any).rows ?? counts ?? [])[0] ?? summary) as Record<string, number>;
      } catch (error) {
        console.warn("[communicationsOs] dashboardSummary unavailable until migrations are applied", error);
      }
    }

    return {
      summary,
      visibleSourceOfTruth: "Phone All Inboxes + CRM Communications OS dashboard",
      immediateOperationalTruth: "Live Gmail/SMS/Outlook webhook intake now persists to Communications OS tables when migrations are applied. Gmail cleanup actions are available through connector-side execution; Outlook still needs move/delete capability or Gmailify/forwarding for direct cleanup.",
      nextProviderWork: [
        "Enable Microsoft Graph move/delete scope or equivalent Outlook connector action.",
        "Gmailify or forward external mailboxes into Gmail where direct connector cleanup is unavailable.",
        "Attach SMS webhook for 601-498-5282 with consent-safe reply drafts.",
      ],
    };
  }),

  perplexityNextBuildBrief: protectedProcedure.query(() => ({
    title: "Perplexity Next Build — Live AthlynXAI Communications OS Execution",
    directive:
      "Build on the Build 30 live intake layer. Treat phone-visible All Inboxes as the user-facing source of truth, but execute provider-specific cleanup only through approved capabilities and safety rules.",
    implementationLanes: [
      "Gmail/Workspace: use search/read/label/archive/spam/trash capability now; add hard-delete only if connector exposes a safe scope.",
      "Outlook/iCloud: add Graph/IMAP move-delete capability or centralize through Gmailify/forwarding before promising visible cleanup.",
      "CRM: every inbound message becomes a communication_event, classification, thread, optional CRM contact, and follow-up task.",
      "Automation AI: draft-first replies, explicit sender identity, risk scoring, and audit log before any owner-approved manual send.",
      "Layer Cake: expose provider capability status, cleanup queue, blocked actions, and one-time setup tasks in the CRM UI.",
    ],
    blockedUntil: [
      "Production DATABASE_URL is set in GitHub environment secrets and migrations 0011/0012/0013 are applied.",
      "Outlook/iCloud cleanup-capable connector path is added or external accounts are centralized into Gmail.",
    ],
  })),
});
