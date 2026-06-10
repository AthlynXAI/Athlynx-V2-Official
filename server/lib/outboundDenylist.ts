// ─────────────────────────────────────────────────────────────────────────────
// OUTBOUND DENY-LIST
//
// Purpose: a single chokepoint that blocks any agent, cron job, or server
// route from sending email, SMS, push, calendar invites, Slack messages, or
// platform notifications to people who are under a private evaluation hold.
//
// Per OWNERSHIP.md ("Communications hold — outbound silence" 2026-06-02):
//   No outbound communication of any kind to Tony Locey or Tim Shoemake
//   while the hold is active. This is private to Chad and must not leak.
//
// HOW TO USE
//   import { assertOutboundAllowed } from "@/server/lib/outboundDenylist";
//   assertOutboundAllowed({ email: "tony@nexphase.com" });   // throws if blocked
//   if (isOutboundBlocked({ email })) return;                // soft-skip variant
//
// HOW TO REINSTATE A PERSON
//   Remove their record from BLOCKED_RECIPIENTS below. That is the ONLY change
//   required. The doctrine file in OWNERSHIP.md must also be updated in the
//   same commit so future agents see the rule is lifted.
//
// ─────────────────────────────────────────────────────────────────────────────

export interface OutboundRecipient {
  /** Any of: known email address, phone number, full display name, slug. */
  email?: string;
  phone?: string;
  name?: string;
  slug?: string;
}

/**
 * People under an active communication hold. Match is case-insensitive and
 * substring-tolerant on the name field so common variants ("Tony", "Locey",
 * "Tony L.") all resolve. Email and phone are matched exactly after
 * normalization.
 */
const BLOCKED_RECIPIENTS: Array<{
  reason: string;
  emails: string[];
  phones: string[];
  names: string[];
  slugs: string[];
}> = [
  {
    reason:
      "Active evaluation hold by Chad (2026-06-02). No outbound communication " +
      "of any kind. Reinstatement requires written instruction from Chad.",
    emails: [
      "tony@nexphase.com",
      "tlocey24@gmail.com",
      "tlocey24@uga.edu",
    ],
    phones: [],
    names: ["tony locey", "anthony locey"],
    slugs: ["tony-locey"],
  },
  {
    reason:
      "Active evaluation hold by Chad (2026-06-02). No outbound communication " +
      "of any kind. Reinstatement requires written instruction from Chad.",
    emails: [],
    phones: [],
    names: ["tim shoemake", "timothy shoemake"],
    slugs: ["tim-shoemake"],
  },
];

function normalize(s: string | undefined): string {
  return (s ?? "").trim().toLowerCase();
}

/**
 * Return true if any field on the recipient matches a record on the deny-list.
 * Use this when you want to silently skip an outbound send rather than crash.
 */
export function isOutboundBlocked(recipient: OutboundRecipient): boolean {
  const email = normalize(recipient.email);
  const phone = normalize(recipient.phone);
  const name = normalize(recipient.name);
  const slug = normalize(recipient.slug);

  for (const record of BLOCKED_RECIPIENTS) {
    if (email && record.emails.some((e) => normalize(e) === email)) return true;
    if (phone && record.phones.some((p) => normalize(p) === phone)) return true;
    if (slug && record.slugs.some((s) => normalize(s) === slug)) return true;
    if (
      name &&
      record.names.some((n) => {
        const needle = normalize(n);
        return name.includes(needle) || needle.includes(name);
      })
    ) {
      return true;
    }
  }
  return false;
}

/**
 * Return the structured reason a recipient is blocked, or null if allowed.
 * Use this when you want to log the reason on a soft-skip.
 */
export function getOutboundBlockReason(
  recipient: OutboundRecipient,
): string | null {
  if (!isOutboundBlocked(recipient)) return null;
  return BLOCKED_RECIPIENTS[0].reason; // shared message across records
}

/**
 * Throw a clearly-named error if the recipient is on the deny-list. Use this
 * at the top of every send function (email, SMS, push, calendar, slack) so
 * the failure mode is loud, not silent.
 */
export class OutboundDeniedError extends Error {
  constructor(public readonly recipient: OutboundRecipient, reason: string) {
    super(
      `[OUTBOUND_DENIED] Send to ${recipient.email ?? recipient.phone ?? recipient.name ?? recipient.slug ?? "<unknown>"} blocked: ${reason}`,
    );
    this.name = "OutboundDeniedError";
  }
}

export function assertOutboundAllowed(recipient: OutboundRecipient): void {
  const reason = getOutboundBlockReason(recipient);
  if (reason) {
    // Surfaces in logs without leaking the deny-list contents to clients.
    console.warn(
      `[outboundDenylist] Blocked send. reason=${reason} recipient=${JSON.stringify({
        email: recipient.email ? "[REDACTED]" : undefined,
        phone: recipient.phone ? "[REDACTED]" : undefined,
        name: recipient.name,
        slug: recipient.slug,
      })}`,
    );
    throw new OutboundDeniedError(recipient, reason);
  }
}
