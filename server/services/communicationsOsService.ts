import { sql } from "drizzle-orm";
import { getDb } from "../db";

export type NormalizedCommunicationEvent = {
  provider: "gmail" | "sms" | "outlook" | "icloud" | "manual";
  providerMessageId: string;
  providerThreadId?: string;
  direction: "inbound" | "outbound";
  fromAddress: string;
  toAddress: string;
  subject?: string;
  bodyText?: string;
  rawPayload?: unknown;
  receivedAt?: Date;
};

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
  "coach",
  "athlete",
  "investor",
];

const promotionalTerms = [
  "unsubscribe",
  "promotion",
  "promoted",
  "sale",
  "coupon",
  "discount",
  "pizza",
  "marlboro",
  "marriott",
  "newsletter",
  "final day",
  "last chance",
  "wild week",
];

function mapProviderToChannel(provider: NormalizedCommunicationEvent["provider"]) {
  if (provider === "sms") return "sms";
  if (provider === "outlook") return "outlook";
  if (provider === "icloud") return "icloud";
  return "email";
}

export function classifyCommunication(event: NormalizedCommunicationEvent) {
  const text = `${event.fromAddress} ${event.toAddress} ${event.subject ?? ""} ${event.bodyText ?? ""}`.toLowerCase();
  const protectedHits = protectedTerms.filter((term) => text.includes(term));
  const promotionalHits = promotionalTerms.filter((term) => text.includes(term));

  let category = "uncertain";
  let urgency = "normal";
  let company = "unknown";
  let riskScore = 30;
  let recommendedAction = "escalate";

  if (text.includes("athlynx") || text.includes("nil portal") || text.includes("recruiting")) {
    company = text.includes("nil portal") ? "nil_portal" : "athlynxai";
  } else if (text.includes("dozier") || text.includes("softmor")) {
    company = text.includes("softmor") ? "softmor" : "dhg";
  } else if (text.includes("icloud") || text.includes("personal")) {
    company = "personal";
  }

  if (protectedHits.some((hit) => ["regions", "chase", "bank of america", "stripe", "tax", "ein", "billing", "payment", "invoice"].includes(hit))) {
    category = "finance_billing";
    urgency = "critical";
    riskScore = 95;
    recommendedAction = "escalate";
  } else if (protectedHits.some((hit) => ["legal", "contract", "nda", "insurance", "claim", "policy"].includes(hit))) {
    category = text.includes("insurance") || text.includes("claim") || text.includes("policy") ? "insurance" : "legal_compliance";
    urgency = "critical";
    riskScore = 90;
    recommendedAction = "escalate";
  } else if (protectedHits.some((hit) => ["verification", "password", "security", "github", "vercel", "google", "microsoft"].includes(hit))) {
    category = "account_security";
    urgency = "high";
    riskScore = 80;
    recommendedAction = "escalate";
  } else if (protectedHits.some((hit) => ["athlynx", "dozier holdings", "softmor", "nil portal", "coach", "athlete", "investor"].includes(hit))) {
    category = text.includes("investor") ? "investor_partnership" : text.includes("coach") ? "coach_inquiry" : text.includes("athlete") ? "athlete_support" : "organization_director";
    urgency = "high";
    riskScore = 70;
    recommendedAction = "task_create";
  } else if (promotionalHits.length > 0) {
    category = "promotional_spam";
    urgency = "low";
    riskScore = 10;
    recommendedAction = "spam";
  }

  const confidence = Math.min(95, Math.max(40, protectedHits.length * 20 + promotionalHits.length * 15 + 40));

  return {
    category,
    urgency,
    company,
    confidence,
    riskScore,
    recommendedAction,
    ruleHits: { protectedHits, promotionalHits },
    reasoning:
      protectedHits.length > 0
        ? `Protected communication signals found: ${protectedHits.join(", ")}`
        : promotionalHits.length > 0
          ? `Promotional cleanup signals found: ${promotionalHits.join(", ")}`
          : "No decisive signal found; route to review.",
  };
}

async function ensureCommunicationAccount(event: NormalizedCommunicationEvent) {
  const db = await getDb();
  if (!db) return null;

  const channel = mapProviderToChannel(event.provider);
  const loginIdentity = event.toAddress || "unknown@athlynx.ai";
  const senderIdentity = event.toAddress || "unknown@athlynx.ai";
  const label = `${event.provider.toUpperCase()} Intake`;

  const existing = await db.execute(sql`
    SELECT id FROM communication_accounts
    WHERE "channel" = ${channel}::comm_channel
      AND "loginIdentity" = ${loginIdentity}
    LIMIT 1
  `);
  const row = ((existing as any).rows ?? existing ?? [])[0];
  if (row?.id) return Number(row.id);

  const inserted = await db.execute(sql`
    INSERT INTO communication_accounts
      ("channel", "loginIdentity", "senderIdentity", "company", "label", "providerConfig", "active", "lastSyncAt")
    VALUES
      (${channel}::comm_channel, ${loginIdentity}, ${senderIdentity}, 'unknown'::comm_company, ${label}, ${JSON.stringify({ provider: event.provider })}::json, TRUE, NOW())
    RETURNING id
  `);
  return Number((((inserted as any).rows ?? inserted ?? [])[0] ?? {}).id);
}

async function ensureCommunicationThread(event: NormalizedCommunicationEvent, classification: ReturnType<typeof classifyCommunication>) {
  const db = await getDb();
  if (!db) return null;
  const providerThreadId = event.providerThreadId ?? event.providerMessageId;
  const existing = await db.execute(sql`
    SELECT id, "messageCount" FROM communication_threads
    WHERE "providerThreadId" = ${providerThreadId}
    LIMIT 1
  `);
  const row = ((existing as any).rows ?? existing ?? [])[0];
  if (row?.id) {
    await db.execute(sql`
      UPDATE communication_threads
      SET "lastCategory" = ${classification.category}::comm_category,
          "lastUrgency" = ${classification.urgency}::comm_urgency,
          "lastInboundAt" = CASE WHEN ${event.direction} = 'inbound' THEN NOW() ELSE "lastInboundAt" END,
          "lastOutboundAt" = CASE WHEN ${event.direction} = 'outbound' THEN NOW() ELSE "lastOutboundAt" END,
          "messageCount" = COALESCE("messageCount", 0) + 1,
          "updatedAt" = NOW()
      WHERE id = ${Number(row.id)}
    `);
    return Number(row.id);
  }

  const inserted = await db.execute(sql`
    INSERT INTO communication_threads
      ("providerThreadId", "company", "subject", "lastCategory", "lastUrgency", "lastInboundAt", "lastOutboundAt", "messageCount")
    VALUES
      (${providerThreadId}, ${classification.company}::comm_company, ${event.subject ?? null}, ${classification.category}::comm_category, ${classification.urgency}::comm_urgency,
       CASE WHEN ${event.direction} = 'inbound' THEN NOW() ELSE NULL END,
       CASE WHEN ${event.direction} = 'outbound' THEN NOW() ELSE NULL END,
       1)
    RETURNING id
  `);
  return Number((((inserted as any).rows ?? inserted ?? [])[0] ?? {}).id);
}

export async function persistCommunicationEvent(event: NormalizedCommunicationEvent) {
  const db = await getDb();
  if (!db) {
    return { ok: false, skipped: true, reason: "database_unavailable" };
  }

  const classification = classifyCommunication(event);
  const accountId = await ensureCommunicationAccount(event);
  if (!accountId) return { ok: false, skipped: true, reason: "account_unavailable" };
  const threadId = await ensureCommunicationThread(event, classification);

  const channel = mapProviderToChannel(event.provider);
  const rawPayload = JSON.stringify(event.rawPayload ?? {});

  const insertedEvent = await db.execute(sql`
    INSERT INTO communication_events
      ("accountId", "threadId", "providerMessageId", "channel", "direction", "fromAddress", "toAddress", "subject", "bodyText", "rawPayload", "classifiedAt", "receivedAt")
    VALUES
      (${accountId}, ${threadId}, ${event.providerMessageId}, ${channel}::comm_channel, ${event.direction}::comm_direction, ${event.fromAddress}, ${event.toAddress}, ${event.subject ?? null}, ${event.bodyText ?? null}, ${rawPayload}::json, NOW(), ${event.receivedAt ?? new Date()})
    ON CONFLICT ("accountId", "providerMessageId") DO UPDATE SET
      "classifiedAt" = NOW(),
      "rawPayload" = EXCLUDED."rawPayload"
    RETURNING id
  `);

  const eventId = Number((((insertedEvent as any).rows ?? insertedEvent ?? [])[0] ?? {}).id);

  if (eventId) {
    await db.execute(sql`
      INSERT INTO communication_classifications
        ("eventId", "category", "urgency", "detectedCompany", "confidence", "ruleHits", "riskScore", "classifierSource", "reasoning")
      VALUES
        (${eventId}, ${classification.category}::comm_category, ${classification.urgency}::comm_urgency, ${classification.company}::comm_company, ${classification.confidence}, ${JSON.stringify(classification.ruleHits)}::json, ${classification.riskScore}, 'rules', ${classification.reasoning})
    `);

    await db.execute(sql`
      INSERT INTO communication_actions
        ("eventId", "action", "performedBy", "detail", "success")
      VALUES
        (${eventId}, ${classification.recommendedAction}::comm_action, 'automation_recommendation', ${JSON.stringify({ autoSendEnabled: false, cleanupRequiresProviderCapability: true })}::json, TRUE)
    `);
  }

  return { ok: true, eventId, accountId, threadId, classification };
}
