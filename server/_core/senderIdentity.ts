/**
 * AthlynXAI OS — Sender Identity Configuration
 *
 * THE 3-ADDRESS RULE (locked 2026-05-16 by Chad):
 *
 *   chaddozier75@gmail.com           → repo logins, connectors, admin
 *                                      AND existing founder-signed system mail
 *                                      (daily report, weekly report, M-9 doctrine).
 *                                      DO NOT use as the From: address for new
 *                                      external Comms OS drafts.
 *
 *   chaddozier75@gmail.com             → AthlynXAI / AthlynX outward-facing
 *                                      draft identity. Emails are prepared for
 *                                      owner review; final sending is manual
 *                                      only after explicit approval.
 *
 *   chaddozier75@gmail.com
 *                                    → Dozier Holdings Group outward-facing
 *                                      draft identity. Emails are prepared for
 *                                      owner review; final sending is manual
 *                                      only after explicit approval.
 *
 * Routing rule: pick the sender by detected company context on the inbound
 * thread. All outbound email remains draft/manual-send only unless the owner
 * explicitly approves the exact send in the active session. If company context
 * is unclear, the reply policy engine MUST route to the review queue and
 * produce a draft only — never send.
 *
 * This config is the source of truth. Webhook intake handlers, the classifier,
 * and the reply policy engine all read from here.
 */

import { commCompanyValues } from "../../drizzle/schema_comms";

export type CommCompany = (typeof commCompanyValues)[number];

export interface SenderIdentity {
  /** Stable id used by reply_templates + automation_rules */
  readonly id: CommCompany;
  /** From: address shown on owner-approved outbound drafts for this company's behalf */
  readonly fromAddress: string;
  /** Display name for the From: header */
  readonly fromName: string;
  /** Human-readable label for CRM UI */
  readonly label: string;
  /** Legacy flag remains false; email sending is manual-only after explicit owner approval */
  readonly autoSendEnabled: boolean;
}

/**
 * Company → outbound sender identity.
 *
 * autoSendEnabled defaults to FALSE for every identity. Permanent owner rule:
 * the system may draft and organize email, but final email sending is manual
 * only after explicit owner approval in the active session. Scaffold ships locked.
 */
export const SENDER_IDENTITIES: Record<CommCompany, SenderIdentity> = {
  athlynxai: {
    id: "athlynxai",
    fromAddress: "chaddozier75@gmail.com",
    fromName: "Chad Dozier — AthlynXAI",
    label: "AthlynXAI / AthlynX",
    autoSendEnabled: false,
  },
  dhg: {
    id: "dhg",
    fromAddress: "chaddozier75@gmail.com",
    fromName: "Chad Dozier — Dozier Holdings Group",
    label: "Dozier Holdings Group",
    autoSendEnabled: false,
  },
  softmor: {
    // Softmor outbound identity not yet provisioned. Route through AthlynXAI
    // identity until Chad supplies a dedicated address, with a draft-only
    // override flag on the reply policy engine.
    id: "softmor",
    fromAddress: "chaddozier75@gmail.com",
    fromName: "Chad Dozier — Softmor (via AthlynXAI)",
    label: "Softmor (provisional)",
    autoSendEnabled: false,
  },
  nil_portal: {
    // NIL Portal outbound identity not yet provisioned. Same provisional rule.
    id: "nil_portal",
    fromAddress: "chaddozier75@gmail.com",
    fromName: "Chad Dozier — NIL Portal (via AthlynXAI)",
    label: "NIL Portal (provisional)",
    autoSendEnabled: false,
  },
  personal: {
    // Personal context never gets an automated reply. This identity exists
    // only to label inbound classification — outbound is BLOCKED.
    id: "personal",
    fromAddress: "chaddozier75@gmail.com",
    fromName: "Chad Dozier",
    label: "Personal — outbound automation blocked",
    autoSendEnabled: false,
  },
  unknown: {
    // Unclear company context → review queue, draft only, NEVER send.
    id: "unknown",
    fromAddress: "chaddozier75@gmail.com",
    fromName: "Chad Dozier — AthlynXAI",
    label: "Unknown — review queue only",
    autoSendEnabled: false,
  },
};

/**
 * Login / admin identity — used for connector OAuth, repo access, and the
 * existing founder-signed system mail (daily report, weekly report).
 *
 * This is intentionally separate from SENDER_IDENTITIES. The system mail
 * already in production keeps using this Gmail address because the brand
 * voice card and doctrine encode it as the founder-direct identity.
 */
export const ADMIN_LOGIN_IDENTITY = "chaddozier75@gmail.com" as const;

/**
 * Resolve the sender identity for an outbound message based on the detected
 * company context. Falls back to "unknown" → review queue.
 */
export function resolveSenderIdentity(company: CommCompany | null | undefined): SenderIdentity {
  if (!company || !(company in SENDER_IDENTITIES)) return SENDER_IDENTITIES.unknown;
  return SENDER_IDENTITIES[company];
}

/**
 * Gate function used by the reply policy engine before any send-capable path.
 * Returns false if:
 *   - Identity has autoSendEnabled === false
 *   - Company is unknown / personal
 *   - Company is softmor / nil_portal (provisional — draft only)
 */
export function canAutoSendFor(company: CommCompany | null | undefined): boolean {
  if (!company) return false;
  if (company === "unknown" || company === "personal") return false;
  if (company === "softmor" || company === "nil_portal") return false;
  return SENDER_IDENTITIES[company]?.autoSendEnabled === true;
}
