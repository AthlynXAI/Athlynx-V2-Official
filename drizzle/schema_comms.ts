/**
 * AthlynXAI OS — Real-Time Communications Schema (Build 28)
 *
 * Additive schema for the Layer Cake communications routing system.
 * Extends crm_contacts / crm_pipeline / activity_log — does not replace them.
 *
 * Source: Perplexity Handoff — AthlynXAI OS Real-Time Communications Automation
 * Date:   2026-05-16
 * Owner:  Computer (implementation) / Perplexity (architecture)
 *
 * Migration file: drizzle/0011_build28_comms_os_scaffold.sql
 *
 * IMPORTANT: All tables here are scaffolds. Webhook intake, classifier, and
 * reply policy engine wiring lands AFTER Perplexity returns its architecture
 * diagnosis. These tables only commit to the data shape, not the runtime.
 */

import {
  pgTable,
  integer,
  varchar,
  text,
  boolean,
  timestamp,
  pgEnum,
  serial,
  json,
  smallint,
} from "drizzle-orm/pg-core";

// ─── Enums ───────────────────────────────────────────────────────────────────

export const commChannelValues = ["email", "sms", "outlook", "icloud"] as const;
export const commChannelEnum = pgEnum("comm_channel", commChannelValues);

export const commDirectionValues = ["inbound", "outbound"] as const;
export const commDirectionEnum = pgEnum("comm_direction", commDirectionValues);

export const commCategoryValues = [
  "coach_inquiry",
  "parent_inquiry",
  "athlete_support",
  "organization_director",
  "investor_partnership",
  "legal_compliance",
  "insurance",
  "finance_billing",
  "account_security",
  "promotional_spam",
  "personal",
  "uncertain",
] as const;
export const commCategoryEnum = pgEnum("comm_category", commCategoryValues);

export const commUrgencyValues = ["low", "normal", "high", "critical"] as const;
export const commUrgencyEnum = pgEnum("comm_urgency", commUrgencyValues);

export const commCompanyValues = ["athlynxai", "dhg", "softmor", "nil_portal", "personal", "unknown"] as const;
export const commCompanyEnum = pgEnum("comm_company", commCompanyValues);

export const commActionValues = [
  "archive",
  "label",
  "spam",
  "task_create",
  "draft_reply",
  "sent_reply",
  "escalate",
  "ignore",
] as const;
export const commActionEnum = pgEnum("comm_action", commActionValues);

export const commAutomationRunStatusValues = ["success", "error", "retrying", "skipped"] as const;
export const commAutomationRunStatusEnum = pgEnum(
  "comm_automation_run_status",
  commAutomationRunStatusValues,
);

// ─── communication_accounts ──────────────────────────────────────────────────
// Monitored mailbox / SMS-number / Outlook account metadata.
// Encodes the identity split: login identity vs outbound sender identity.

export const communicationAccounts = pgTable("communication_accounts", {
  id: serial("id").primaryKey(),
  channel: commChannelEnum("channel").notNull(),
  // The identity used to authenticate to the provider (e.g. chaddozier75@gmail.com)
  loginIdentity: varchar("loginIdentity", { length: 320 }).notNull(),
  // The identity that appears in the From: header on outbound messages
  // (e.g. cdozier14@athlynx.ai for AthlynXAI, com.mx for DHG)
  senderIdentity: varchar("senderIdentity", { length: 320 }).notNull(),
  // Which company this account belongs to for routing
  company: commCompanyEnum("company").notNull(),
  // Free-form display label (e.g. "AthlynXAI Primary", "DHG Operations", "SMS 601-498-5282")
  label: varchar("label", { length: 128 }).notNull(),
  // Provider-specific connection metadata: OAuth tokens, webhook URLs, watch expirations.
  // Stored as JSON until Perplexity finalizes the provider list.
  providerConfig: json("providerConfig"),
  active: boolean("active").default(true).notNull(),
  lastSyncAt: timestamp("lastSyncAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});
export type CommunicationAccount = typeof communicationAccounts.$inferSelect;

// ─── communication_threads ───────────────────────────────────────────────────
// Groups messages into one business conversation across email/SMS.

export const communicationThreads = pgTable("communication_threads", {
  id: serial("id").primaryKey(),
  // Provider-native thread id (Gmail threadId, conversationId, SMS conversation key)
  providerThreadId: varchar("providerThreadId", { length: 256 }),
  // CRM contact linkage — extends existing crm_contacts table
  crmContactId: integer("crmContactId"),
  // CRM pipeline deal linkage if this thread is tied to an opportunity
  crmPipelineId: integer("crmPipelineId"),
  // Which company's account is handling this thread
  company: commCompanyEnum("company").notNull().default("unknown"),
  subject: varchar("subject", { length: 512 }),
  // Snapshot of the most recent classification — denormalized for dashboard speed
  lastCategory: commCategoryEnum("lastCategory"),
  lastUrgency: commUrgencyEnum("lastUrgency").default("normal").notNull(),
  // Has Chad responded / acknowledged this thread?
  acknowledgedAt: timestamp("acknowledgedAt"),
  // Last inbound message timestamp — drives SLA tracking
  lastInboundAt: timestamp("lastInboundAt"),
  // Last outbound message timestamp (auto-reply or human reply)
  lastOutboundAt: timestamp("lastOutboundAt"),
  messageCount: integer("messageCount").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});
export type CommunicationThread = typeof communicationThreads.$inferSelect;

// ─── communication_events ────────────────────────────────────────────────────
// Normalized inbound/outbound messages across email + SMS.
// One row per individual message.

export const communicationEvents = pgTable("communication_events", {
  id: serial("id").primaryKey(),
  accountId: integer("accountId").notNull(),
  threadId: integer("threadId"),
  // Provider-native message id (Gmail messageId, Twilio MessageSid, etc.)
  providerMessageId: varchar("providerMessageId", { length: 256 }).notNull(),
  channel: commChannelEnum("channel").notNull(),
  direction: commDirectionEnum("direction").notNull(),
  // Sender / recipient identifiers — email addresses or phone numbers
  fromAddress: varchar("fromAddress", { length: 320 }).notNull(),
  toAddress: varchar("toAddress", { length: 320 }).notNull(),
  ccAddresses: text("ccAddresses"), // comma-separated for now
  subject: varchar("subject", { length: 512 }),
  // Plain-text body — HTML stored in rawPayload for audit
  bodyText: text("bodyText"),
  // Full provider payload for audit + replay
  rawPayload: json("rawPayload"),
  // Has the classifier processed this yet?
  classifiedAt: timestamp("classifiedAt"),
  // Webhook receipt timestamp — drives SLA from the moment of arrival
  receivedAt: timestamp("receivedAt").defaultNow().notNull(),
  // Original message timestamp from the provider
  sentAt: timestamp("sentAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});
export type CommunicationEvent = typeof communicationEvents.$inferSelect;

// ─── communication_classifications ───────────────────────────────────────────
// Classifier output: category, confidence, rule hits, urgency, risk.
// Separate table so re-classification is non-destructive (append-only audit).

export const communicationClassifications = pgTable("communication_classifications", {
  id: serial("id").primaryKey(),
  eventId: integer("eventId").notNull(),
  category: commCategoryEnum("category").notNull(),
  urgency: commUrgencyEnum("urgency").notNull(),
  // Detected company context (which AthlynXAI/DHG/etc. business is this about?)
  detectedCompany: commCompanyEnum("detectedCompany").default("unknown").notNull(),
  // 0..100 confidence score
  confidence: smallint("confidence").notNull(),
  // Which rule(s) fired — JSON array of rule ids
  ruleHits: json("ruleHits"),
  // Risk score 0..100 — gates auto-reply permission
  riskScore: smallint("riskScore").default(0).notNull(),
  // Did this classification come from rules-only, LLM-only, or hybrid?
  classifierSource: varchar("classifierSource", { length: 32 }).notNull().default("rules"),
  // Human-readable reasoning summary (max 2 sentences)
  reasoning: text("reasoning"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});
export type CommunicationClassification = typeof communicationClassifications.$inferSelect;

// ─── communication_actions ───────────────────────────────────────────────────
// Every action taken on a message: archive, label, spam, task-create,
// draft-reply, sent-reply, escalate. Append-only audit log.

export const communicationActions = pgTable("communication_actions", {
  id: serial("id").primaryKey(),
  eventId: integer("eventId").notNull(),
  action: commActionEnum("action").notNull(),
  // Was this action executed by automation or by Chad?
  performedBy: varchar("performedBy", { length: 64 }).notNull().default("automation"),
  // Template id used if this was a draft_reply or sent_reply
  templateId: integer("templateId"),
  // Outcome detail — error message, label name, draft body, etc.
  detail: json("detail"),
  // Did this action succeed?
  success: boolean("success").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});
export type CommunicationAction = typeof communicationActions.$inferSelect;

// ─── reply_templates ─────────────────────────────────────────────────────────
// Approved low-risk auto-reply templates, scoped by company + channel + category.
// Auto-send is ONLY permitted when a matching template exists and is approved.

export const replyTemplates = pgTable("reply_templates", {
  id: serial("id").primaryKey(),
  company: commCompanyEnum("company").notNull(),
  channel: commChannelEnum("channel").notNull(),
  category: commCategoryEnum("category").notNull(),
  // Human-readable name (e.g. "Parent free-trial acknowledgement")
  name: varchar("name", { length: 128 }).notNull(),
  // Optional subject template (email only)
  subjectTemplate: varchar("subjectTemplate", { length: 256 }),
  // Body template with {{var}} placeholders
  bodyTemplate: text("bodyTemplate").notNull(),
  // Approved by Chad? Auto-send blocked until approved.
  approved: boolean("approved").default(false).notNull(),
  approvedAt: timestamp("approvedAt"),
  approvedBy: varchar("approvedBy", { length: 128 }),
  // How many times has this template been sent? For monitoring drift.
  useCount: integer("useCount").default(0).notNull(),
  active: boolean("active").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});
export type ReplyTemplate = typeof replyTemplates.$inferSelect;

// ─── automation_rules ────────────────────────────────────────────────────────
// Deterministic rules for classification, sender choice, auto-reply permission,
// and escalation. Rule-first beats LLM-first on cost + speed.

export const automationRules = pgTable("automation_rules", {
  id: serial("id").primaryKey(),
  // Rule scope: "classify" | "route" | "auto_reply" | "escalate" | "spam"
  scope: varchar("scope", { length: 32 }).notNull(),
  name: varchar("name", { length: 128 }).notNull(),
  // Priority — lower number runs first. Ties broken by id.
  priority: integer("priority").default(100).notNull(),
  // Match conditions as JSON. Schema TBD by Perplexity, but starts with:
  // { fromMatches?: string[], subjectMatches?: string[], bodyMatches?: string[],
  //   companyHint?: string, urgencyOverride?: string }
  matchConditions: json("matchConditions").notNull(),
  // Action payload — what this rule does when matched.
  // { setCategory?, setUrgency?, setCompany?, applyLabel?, autoReplyTemplateId?,
  //   blockAutoReply?, escalateTo? }
  actionPayload: json("actionPayload").notNull(),
  active: boolean("active").default(true).notNull(),
  hitCount: integer("hitCount").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});
export type AutomationRule = typeof automationRules.$inferSelect;

// ─── automation_runs ─────────────────────────────────────────────────────────
// Logs job/webhook execution time, errors, retries, time-to-response metrics.
// Required for the Automation Health dashboard.

export const automationRuns = pgTable("automation_runs", {
  id: serial("id").primaryKey(),
  // What ran: "gmail_webhook" | "sms_webhook" | "outlook_watch" | "classifier" |
  //          "reply_dispatcher" | "task_creator"
  jobType: varchar("jobType", { length: 64 }).notNull(),
  status: commAutomationRunStatusEnum("status").notNull(),
  // Related event id if applicable
  eventId: integer("eventId"),
  // Duration in milliseconds — drives SLA dashboard
  durationMs: integer("durationMs"),
  errorMessage: text("errorMessage"),
  // Retry attempt number (0 = first try)
  attempt: smallint("attempt").default(0).notNull(),
  startedAt: timestamp("startedAt").defaultNow().notNull(),
  finishedAt: timestamp("finishedAt"),
});
export type AutomationRun = typeof automationRuns.$inferSelect;
