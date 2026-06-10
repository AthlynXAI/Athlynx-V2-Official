export type CommunicationsProviderId =
  | "gmail"
  | "google_workspace"
  | "gmailify"
  | "outlook_mail"
  | "icloud_mail"
  | "sms";

export type CommunicationsCapability =
  | "search"
  | "read"
  | "send"
  | "draft_reply"
  | "label"
  | "archive"
  | "spam"
  | "trash"
  | "delete"
  | "sync_to_crm"
  | "create_task";

export type CommunicationsRiskLevel = "low" | "normal" | "high" | "critical";

export type CommunicationsCompany =
  | "athlynxai"
  | "dozier_holdings"
  | "softmor"
  | "nil_portal"
  | "personal"
  | "unknown";

export type SenderIdentityRule = {
  id: string;
  label: string;
  loginIdentity: string;
  senderIdentity: string;
  company: CommunicationsCompany;
  externallyAllowed: boolean;
  note: string;
};

export type CommunicationsProviderCapability = {
  id: CommunicationsProviderId;
  label: string;
  channel: "email" | "sms";
  status: "connected" | "needs_setup" | "planned";
  capabilities: CommunicationsCapability[];
  limitation?: string;
  crmAction: string;
};

export type ProtectedCommunicationClass = {
  id: string;
  label: string;
  risk: CommunicationsRiskLevel;
  defaultAction: "preserve" | "review" | "draft_only";
  examples: string[];
};

export const senderIdentityRules: SenderIdentityRule[] = [
  {
    id: "connector-login",
    label: "Connector / admin login",
    loginIdentity: "chaddozier75@gmail.com",
    senderIdentity: "chaddozier75@gmail.com",
    company: "unknown",
    externallyAllowed: false,
    note: "Use for logins, GitHub, connectors, and admin access. Do not use as the default external company sender.",
  },
  {
    id: "athlynx-company",
    label: "AthlynXAI outbound",
    loginIdentity: "chaddozier75@gmail.com",
    senderIdentity: "cdozier14@athlynx.ai",
    company: "athlynxai",
    externallyAllowed: true,
    note: "Use when the inbound context is AthlynXAI, Athlynx, NIL Portal, recruiting, athletes, coaches, apps, or platform work.",
  },
  {
    id: "dhg-company",
    label: "Dozier Holdings Group outbound",
    loginIdentity: "chaddozier75@gmail.com",
    senderIdentity: "cdozier14@dozierholdingsgroup.com.mx",
    company: "dozier_holdings",
    externallyAllowed: true,
    note: "Use when the inbound context is Dozier Holdings Group, Softmor, business holdings, legal, finance, or corporate operations.",
  },
];

export const providerCapabilities: CommunicationsProviderCapability[] = [
  {
    id: "gmail",
    label: "Gmail connector",
    channel: "email",
    status: "connected",
    capabilities: ["search", "read", "send", "draft_reply", "label", "archive", "spam", "trash", "sync_to_crm", "create_task"],
    crmAction: "Can run live cleanup and CRM intake through labels and message search. Hard delete requires Gmail API scope not currently exposed by the connector.",
  },
  {
    id: "google_workspace",
    label: "Google Workspace / company mail",
    channel: "email",
    status: "connected",
    capabilities: ["search", "read", "send", "draft_reply", "label", "archive", "spam", "trash", "sync_to_crm", "create_task"],
    crmAction: "Route company mail through the same Gmail/Workspace intake rules and enforce sender identity selection by company.",
  },
  {
    id: "gmailify",
    label: "Gmailify centralization path",
    channel: "email",
    status: "needs_setup",
    capabilities: ["search", "read", "label", "archive", "spam", "trash", "sync_to_crm", "create_task"],
    limitation: "Requires one-time account linking inside Gmail settings for external mailboxes that support Gmailify or POP/forwarding.",
    crmAction: "Preferred unification path for phone-visible All Inboxes clutter when external accounts need Gmail-grade cleanup controls.",
  },
  {
    id: "outlook_mail",
    label: "Outlook Mail connector",
    channel: "email",
    status: "connected",
    capabilities: ["search", "read", "send", "draft_reply", "sync_to_crm", "create_task"],
    limitation: "Current connector exposes search/read/send only; outbound sends remain manual-owner-approved and no move/archive/delete endpoint is available to the app layer yet.",
    crmAction: "Ingest and classify now; request Graph move/delete scope or route through Gmailify/forwarding for live cleanup.",
  },
  {
    id: "icloud_mail",
    label: "iCloud personal mail",
    channel: "email",
    status: "needs_setup",
    capabilities: ["search", "read", "sync_to_crm", "create_task"],
    limitation: "Use app-specific password, forwarding, IMAP bridge, or Gmailify-style centralization to gain automated cleanup controls.",
    crmAction: "Treat chad.dozier@icloud.com as personal; preserve family, healthcare, insurance, legal, and banking messages.",
  },
  {
    id: "sms",
    label: "SMS 601-498-5282",
    channel: "sms",
    status: "planned",
    capabilities: ["read", "send", "draft_reply", "sync_to_crm", "create_task"],
    limitation: "Requires Twilio/phone-provider webhook ownership and consent-safe draft rules; live responses require owner approval before send.",
    crmAction: "Route urgent inbound texts into CRM tasks and safe reply drafts before any owner-approved manual send.",
  },
];

export const protectedCommunicationClasses: ProtectedCommunicationClass[] = [
  {
    id: "finance-banking",
    label: "Finance, banking, and payments",
    risk: "critical",
    defaultAction: "preserve",
    examples: ["Regions Bank", "Chase", "Bank of America", "Stripe", "billing", "payment", "tax", "EIN"],
  },
  {
    id: "legal-insurance",
    label: "Legal, insurance, and compliance",
    risk: "critical",
    defaultAction: "review",
    examples: ["NDA", "contract", "policy", "claim", "insurance", "compliance", "registered agent"],
  },
  {
    id: "account-security",
    label: "Account security and platform access",
    risk: "high",
    defaultAction: "preserve",
    examples: ["GitHub", "Vercel", "Google", "Microsoft", "Stripe login", "verification code", "password reset"],
  },
  {
    id: "active-business",
    label: "Active business and project operations",
    risk: "high",
    defaultAction: "review",
    examples: ["AthlynXAI", "Dozier Holdings Group", "Softmor", "NIL Portal", "investor", "coach", "athlete", "CRM"],
  },
  {
    id: "obvious-promotional-junk",
    label: "Obvious promotions and junk",
    risk: "low",
    defaultAction: "review",
    examples: ["restaurant promotions", "retail sale", "newsletter with no active project tie", "tobacco marketing", "travel marketing"],
  },
];

export const communicationsOsPrinciples = [
  "Phone-visible All Inboxes is the user-facing source of truth.",
  "Never delete finance, banking, Stripe, legal, insurance, account-security, personal health, or active business mail.",
  "Move obvious promotional junk to Trash/Spam where provider capability permits; otherwise create a manual action or Gmailify setup task.",
  "Use chaddozier75@gmail.com for connector login and admin operations, not default external company replies.",
  "Use company sender identity based on detected company context.",
  "Auto-replies are draft-first until templates, sender identities, and risk rules are explicitly approved.",
] as const;
