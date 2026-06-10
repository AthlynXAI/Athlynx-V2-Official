import {
  pgTable,
  integer,
  varchar,
  text,
  boolean,
  timestamp,
  real,
  pgEnum,
  serial,
  json,
  smallint,
} from "drizzle-orm/pg-core";

// ─── Enums ────────────────────────────────────────────────────────────────────
export const userRoleValues = ["user", "admin"] as const;
export const nilDealStatusValues = [
  "pending",
  "active",
  "completed",
  "declined",
] as const;
export const transferStatusValues = [
  "entered",
  "committed",
  "withdrawn",
] as const;
export const verifTypeValues = ["signup", "login", "password_reset"] as const;
export const postTypeValues = [
  "status",
  "achievement",
  "workout",
  "nil_deal",
  "announcement",
  "milestone",
] as const;
export const crmContactRoleValues = [
  "Athlete",
  "Coach",
  "Brand",
  "Agent",
  "Investor",
  "Team",
] as const;
export const crmContactStatusValues = [
  "Lead",
  "Active",
  "VIP",
  "Churned",
] as const;
export const crmPipelineStageValues = [
  "New Lead",
  "Contacted",
  "Demo Scheduled",
  "Proposal Sent",
  "Closed Won",
  "Closed Lost",
] as const;
export const notifTypeValues = [
  "welcome",
  "vip_approved",
  "system_announcement",
  "custom",
  "credit_added",
  "new_feature",
  "promotion",
  "reminder",
  "achievement",
  "message",
] as const;
export const notifPriorityValues = ["low", "normal", "high", "urgent"] as const;
export const postVisibilityValues = ["public", "followers", "private"] as const;
export const postMediaTypeValues = [
  "none",
  "image",
  "video",
  "gallery",
] as const;
export const postSourceValues = [
  "nil_portal",
  "diamond_grind",
  "messenger",
  "transfer_portal",
  "faith",
  "warriors_playbook",
] as const;
export const msgTypeValues = [
  "text",
  "image",
  "video",
  "file",
  "workout",
  "achievement",
  "system",
] as const;
export const convTypeValues = ["direct", "group"] as const;
export const convParticipantRoleValues = ["member", "admin"] as const;

// PG Enums
export const userRoleEnum = pgEnum("user_role", userRoleValues);
export const nilDealStatusEnum = pgEnum("nil_deal_status", nilDealStatusValues);
export const transferStatusEnum = pgEnum(
  "transfer_status",
  transferStatusValues
);
export const verifTypeEnum = pgEnum("verif_type", verifTypeValues);
export const postTypeEnum = pgEnum("post_type", postTypeValues);
export const crmContactRoleEnum = pgEnum(
  "crm_contact_role",
  crmContactRoleValues
);
export const crmContactStatusEnum = pgEnum(
  "crm_contact_status",
  crmContactStatusValues
);
export const crmPipelineStageEnum = pgEnum(
  "crm_pipeline_stage",
  crmPipelineStageValues
);
export const notifTypeEnum = pgEnum("notif_type", notifTypeValues);
export const notifPriorityEnum = pgEnum("notif_priority", notifPriorityValues);
export const postVisibilityEnum = pgEnum(
  "post_visibility",
  postVisibilityValues
);
export const postMediaTypeEnum = pgEnum("post_media_type", postMediaTypeValues);
export const postSourceEnum = pgEnum("post_source", postSourceValues);
export const msgTypeEnum = pgEnum("msg_type", msgTypeValues);
export const convTypeEnum = pgEnum("conv_type", convTypeValues);
export const convParticipantRoleEnum = pgEnum(
  "conv_participant_role",
  convParticipantRoleValues
);

// ─── Core user table ─────────────────────────────────────────────────────────
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  openId: varchar("openId", { length: 64 }).unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: userRoleEnum("role").default("user").notNull(),
  sport: varchar("sport", { length: 64 }),
  school: varchar("school", { length: 128 }),
  year: varchar("year", { length: 32 }),
  bio: text("bio"),
  avatarUrl: text("avatarUrl"),
  phone: varchar("phone", { length: 20 }),
  trialEndsAt: timestamp("trialEndsAt"),
  phoneVerified: smallint("phoneVerified").default(0).notNull(),
  passwordHash: varchar("passwordHash", { length: 255 }),
  stripeCustomerId: varchar("stripeCustomerId", { length: 255 }),
  stripeSubscriptionId: varchar("stripeSubscriptionId", { length: 255 }),
  stripePlanId: varchar("stripePlanId", { length: 255 }),
  credits: integer("credits").default(0).notNull(),
  aiCredits: integer("aiCredits").default(0).notNull(),
  lastSignedIn: timestamp("lastSignedIn"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
  onboardingRole: varchar("onboardingRole", { length: 64 }),
  onboardingData: text("onboardingData"),
  onboardingCompleted: smallint("onboardingCompleted").default(0).notNull(),
  // Build 3: founder presence — Chad Dozier (and any future co-founder) gets isFounder=true.
  isFounder: boolean("isFounder").default(false).notNull(),
  // Build 50 · May 29, 2026 — Master Admin Doctrine columns (single source of truth: client/src/governance.ts)
  isVip: boolean("is_vip").default(false),
  unlimitedCredits: boolean("unlimited_credits").default(false),
  billingExempt: boolean("billing_exempt").default(false),
  fullAdmin: boolean("full_admin").default(false),
  partnerStatus: text("partner_status"),    // governance.ts PartnerStatus type: "Partner & Team Member"
  accessTier: text("access_tier"),          // governance.ts AccessTier type: "Master Admin" | "Full Admin"
});
export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// ─── Athlete profiles ─────────────────────────────────────────────────────────
export const athleteProfiles = pgTable("athlete_profiles", {
  id: serial("id").primaryKey(),
  userId: integer("userId").notNull(),
  sport: varchar("sport", { length: 64 }),
  position: varchar("position", { length: 64 }),
  school: varchar("school", { length: 128 }),
  year: varchar("year", { length: 32 }),
  gpa: real("gpa"),
  height: varchar("height", { length: 16 }),
  weight: integer("weight"),
  hometown: varchar("hometown", { length: 128 }),
  bio: text("bio"),
  hudlUrl: text("hudlUrl"),
  instagramUrl: text("instagramUrl"),
  twitterUrl: text("twitterUrl"),
  tiktokUrl: text("tiktokUrl"),
  recruitingScore: integer("recruitingScore").default(0),
  nilValue: integer("nilValue").default(0),
  transferStatus: varchar("transferStatus", { length: 32 }),
  classYear: varchar("classYear", { length: 16 }),
  state: varchar("state", { length: 64 }),
  recruitingStatus: varchar("recruitingStatus", { length: 32 }),
  followers: integer("followers").default(0),
  coverUrl: text("coverUrl"),
  highlightUrl: text("highlightUrl"),
  instagram: varchar("instagram", { length: 128 }),
  twitter: varchar("twitter", { length: 128 }),
  // ─── Sport-specific stats (JSON) — 40-yd dash, QB rating, GPA, etc.
  sportStats: json("sportStats"),
  // ─── Recruiting intelligence
  coachViews: integer("coachViews").default(0),
  collegesInterested: json("collegesInterested"),
  nilVerified: boolean("nilVerified").default(false),
  // ─── Full social URLs for reverse funnel
  facebookUrl: text("facebookUrl"),
  youtubeUrl: text("youtubeUrl"),
  linkedinUrl: text("linkedinUrl"),
  tiktokHandle: varchar("tiktokHandle", { length: 128 }),
  // ─── Media & Content platforms
  spotifyUrl: text("spotifyUrl"), // Athlete playlist / podcast
  capcutUrl: text("capcutUrl"), // CapCut highlight reel
  // ─── Build 2: profile presentation columns ──────────────────────────────
  headshotUrl: text("headshotUrl"), // Cloudflare R2 headshot URL
  actionPhotoUrl: text("actionPhotoUrl"), // R2 action shot for hero bar
  statScreenshotUrl: text("statScreenshotUrl"), // R2 stat sheet upload (onboarding step 7)
  jerseyNumber: smallint("jerseyNumber"), // 0-99, displayed in gold on hero
  dominantHand: varchar("dominantHand", { length: 16 }), // "Right" | "Left" | "Both" | "R/R" | "L/R" etc.
  athlynxStarRating: smallint("athlynxStarRating"), // 1-5, manually awarded
  athleticismScore: real("athleticismScore"), // PlayerProfiler-style 0-100
  published: boolean("published").default(false).notNull(), // Onboarding step 10 flips this true
  publishedAt: timestamp("publishedAt"),
  // ─── Build 2: structured recruiting ──────────────────────────────────────
  recruitingTopFive: json("recruitingTopFive"), // Array of 5 college names locked at Signing Day onboarding step
  // ─── Build 3: editable everywhere + avatar library + ladder direction ──
  avatarChoiceKey: varchar("avatarChoiceKey", { length: 64 }), // slug into sports_avatar_library when athlete picks a library avatar instead of uploading
  coverChoiceKey: varchar("coverChoiceKey", { length: 64 }), // same idea for cover photo library
  recruitingLadderDirection: varchar("recruitingLadderDirection", { length: 16 }).default("countdown").notNull(), // 'countdown' | 'topdown'
  fieldPrivacy: json("fieldPrivacy"), // { gpa:false, weight:false ... } for per-field hide-from-public toggles
  lastEditedAt: timestamp("lastEditedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});
export type AthleteProfile = typeof athleteProfiles.$inferSelect;

// ─── Posts / Feed ─────────────────────────────────────────────────────────────
export const posts = pgTable("posts", {
  id: serial("id").primaryKey(),
  userId: integer("userId").notNull(),
  content: text("content").notNull(),
  mediaUrls: json("mediaUrls"),
  mediaType: varchar("mediaType", { length: 50 }).default("none"),
  postType: postTypeEnum("postType").default("status").notNull(),
  visibility: postVisibilityEnum("visibility").default("public").notNull(),
  likesCount: integer("likesCount").default(0).notNull(),
  commentsCount: integer("commentsCount").default(0).notNull(),
  sharesCount: integer("sharesCount").default(0).notNull(),
  isPinned: boolean("isPinned").default(false),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow(),
});
export type Post = typeof posts.$inferSelect;

export const postLikes = pgTable("post_likes", {
  id: serial("id").primaryKey(),
  postId: integer("postId").notNull(),
  userId: integer("userId").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const postComments = pgTable("post_comments", {
  id: serial("id").primaryKey(),
  postId: integer("postId").notNull(),
  userId: integer("userId").notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// ─── Messaging ────────────────────────────────────────────────────────────────
export const conversations = pgTable("conversations", {
  id: serial("id").primaryKey(),
  type: convTypeEnum("type").default("direct").notNull(),
  name: varchar("name", { length: 255 }),
  createdBy: integer("createdBy"),
  lastMessageAt: timestamp("lastMessageAt"),
  lastMessagePreview: varchar("lastMessagePreview", { length: 255 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const conversationParticipants = pgTable("conversation_participants", {
  id: serial("id").primaryKey(),
  conversationId: integer("conversation_id").notNull(),
  userId: integer("user_id").notNull(),
  role: varchar("role", { length: 50 }).default("member"),
  lastReadAt: timestamp("last_read_at"),
  unreadCount: integer("unreadCount").default(0),
  joinedAt: timestamp("joined_at").defaultNow().notNull(),
});

export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  conversationId: integer("conversation_id").notNull(),
  senderId: integer("sender_id").notNull(),
  content: text("content").notNull(),
  messageType: varchar("message_type", { length: 50 })
    .default("text")
    .notNull(),
  mediaUrl: text("media_url"),
  metadata: json("metadata"),
  isEdited: boolean("isEdited").default(false),
  isDeleted: boolean("isDeleted").default(false),
  isRead: boolean("is_read").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at"),
});
export type Message = typeof messages.$inferSelect;

// ─── NIL Deals ────────────────────────────────────────────────────────────────
export const nilDeals = pgTable("nil_deals", {
  id: serial("id").primaryKey(),
  athleteId: integer("athleteId").notNull(),
  brandName: varchar("brandName", { length: 128 }).notNull(),
  dealValue: integer("dealValue").default(0).notNull(),
  status: nilDealStatusEnum("status").default("pending").notNull(),
  description: text("description"),
  category: varchar("category", { length: 64 }),
  startDate: timestamp("startDate"),
  endDate: timestamp("endDate"),
  contractUrl: text("contractUrl"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});
export type NilDeal = typeof nilDeals.$inferSelect;

// ─── Training Logs ────────────────────────────────────────────────────────────
export const trainingLogs = pgTable("training_logs", {
  id: serial("id").primaryKey(),
  userId: integer("userId").notNull(),
  workout: varchar("workout", { length: 128 }).notNull(),
  duration: integer("duration"),
  notes: text("notes"),
  performance: integer("performance"),
  logDate: timestamp("logDate").defaultNow().notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// ─── Transfer Portal ──────────────────────────────────────────────────────────
export const transferPortalEntries = pgTable("transfer_portal_entries", {
  id: serial("id").primaryKey(),
  athleteId: integer("athleteId").notNull(),
  fromSchool: varchar("fromSchool", { length: 128 }),
  toSchool: varchar("toSchool", { length: 128 }),
  status: transferStatusEnum("status").default("entered").notNull(),
  eligibilityYears: integer("eligibilityYears"),
  enteredAt: timestamp("enteredAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

// ─── Notifications ────────────────────────────────────────────────────────────
// DB uses snake_case columns: user_id, is_read, created_at, content
export const notifications = pgTable("notifications", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  type: varchar("type", { length: 100 }).default("custom").notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  message: text("content"),
  link: varchar("link", { length: 500 }),
  imageUrl: varchar("imageUrl", { length: 500 }),
  priority: varchar("priority", { length: 50 }).default("normal").notNull(),
  isRead: boolean("is_read").default(false).notNull(),
  isDismissed: boolean("isDismissed").default(false),
  isBroadcast: boolean("isBroadcast").default(false),
  expiresAt: timestamp("expiresAt"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  readAt: timestamp("readAt"),
});

// ─── Verification Codes ───────────────────────────────────────────────────────
export const verificationCodes = pgTable("verification_codes", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 320 }).notNull(),
  phone: varchar("phone", { length: 20 }),
  code: varchar("code", { length: 10 }).notNull(),
  type: verifTypeEnum("type").default("signup").notNull(),
  verified: boolean("verified").default(false).notNull(),
  expiresAt: timestamp("expiresAt").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});
export type VerificationCode = typeof verificationCodes.$inferSelect;
export type InsertVerificationCode = typeof verificationCodes.$inferInsert;

// ─── Waitlist ─────────────────────────────────────────────────────────────────
export const waitlist = pgTable("waitlist_entries", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 320 }).notNull(),
  name: varchar("name", { length: 255 }),
  sport: varchar("sport", { length: 100 }),
  school: varchar("school", { length: 255 }),
  phone: varchar("phone", { length: 20 }),
  role: varchar("role", { length: 50 }).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});
export type Waitlist = typeof waitlist.$inferSelect;

// ─── CRM Contacts ─────────────────────────────────────────────────────────────
export const crmContacts = pgTable("crm_contacts", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 128 }).notNull(),
  email: varchar("email", { length: 320 }),
  phone: varchar("phone", { length: 20 }),
  company: varchar("company", { length: 128 }),
  role: crmContactRoleEnum("role").default("Athlete").notNull(),
  status: crmContactStatusEnum("status").default("Lead").notNull(),
  notes: text("notes"),
  lastActivity: timestamp("lastActivity").defaultNow().notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});
export type CrmContact = typeof crmContacts.$inferSelect;

// ─── CRM Pipeline ─────────────────────────────────────────────────────────────
export const crmPipeline = pgTable("crm_pipeline", {
  id: serial("id").primaryKey(),
  contactId: integer("contactId").notNull(),
  stage: crmPipelineStageEnum("stage").default("New Lead").notNull(),
  dealValue: integer("dealValue").default(0),
  assignedTo: varchar("assignedTo", { length: 128 }),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});
export type CrmPipeline = typeof crmPipeline.$inferSelect;

// ─── Activity Log ─────────────────────────────────────────────────────────────
export const activityLog = pgTable("activity_log", {
  id: serial("id").primaryKey(),
  userId: integer("userId"),
  eventType: varchar("eventType", { length: 64 }).notNull(),
  metadata: text("metadata"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});
export type ActivityLog = typeof activityLog.$inferSelect;

// ─── Broadcast Messages ───────────────────────────────────────────────────────
export const broadcastChannelEnum = pgEnum("broadcast_channel", [
  "email",
  "in_app",
  "both",
]);
export const broadcastRecipientEnum = pgEnum("broadcast_recipient", [
  "all",
  "trial",
  "subscribed",
  "free",
]);
export const broadcastStatusEnum = pgEnum("broadcast_status", [
  "draft",
  "sent",
  "failed",
]);

export const broadcastMessages = pgTable("broadcast_messages", {
  id: serial("id").primaryKey(),
  senderId: integer("senderId").notNull(),
  subject: varchar("subject", { length: 256 }).notNull(),
  body: text("body").notNull(),
  channel: broadcastChannelEnum("channel").default("in_app").notNull(),
  recipientFilter: broadcastRecipientEnum("recipientFilter")
    .default("all")
    .notNull(),
  recipientCount: integer("recipientCount").default(0),
  status: broadcastStatusEnum("status").default("sent").notNull(),
  sentAt: timestamp("sentAt").defaultNow().notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});
export type BroadcastMessage = typeof broadcastMessages.$inferSelect;

// ─── Athlete Feedback ─────────────────────────────────────────────────────────
export const feedbackStatusValues = [
  "open",
  "under_review",
  "planned",
  "completed",
  "declined",
] as const;
export const feedbackCategoryValues = [
  "feature_request",
  "bug_report",
  "general",
  "content",
  "performance",
] as const;

export const feedbackStatusEnum = pgEnum(
  "feedback_status",
  feedbackStatusValues
);
export const feedbackCategoryEnum = pgEnum(
  "feedback_category",
  feedbackCategoryValues
);

export const athleteFeedback = pgTable("athlete_feedback", {
  id: serial("id").primaryKey(),
  userId: integer("userId"),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  title: varchar("title", { length: 256 }).notNull(),
  body: text("body").notNull(),
  category: feedbackCategoryEnum("category").default("general").notNull(),
  votes: integer("votes").default(0).notNull(),
  status: feedbackStatusEnum("status").default("open").notNull(),
  adminReply: text("adminReply"),
  repliedAt: timestamp("repliedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});
export type AthleteFeedback = typeof athleteFeedback.$inferSelect;
export type InsertAthleteFeedback = typeof athleteFeedback.$inferInsert;

// ─── Feedback Votes ───────────────────────────────────────────────────────────
export const feedbackVotes = pgTable("feedback_votes", {
  id: serial("id").primaryKey(),
  feedbackId: integer("feedbackId").notNull(),
  voterIdentifier: varchar("voterIdentifier", { length: 320 }).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});
export type FeedbackVote = typeof feedbackVotes.$inferSelect;

// ─── Subscription Expiry Notices ─────────────────────────────────────────────
export const expiryEmailTypeValues = [
  "7_day",
  "5_day",
  "4_day",
  "3_day",
  "2_day",
  "1_day",
  "expired",
] as const;
export const expiryNoticeStatusValues = ["sent", "failed", "skipped"] as const;

export const expiryEmailTypeEnum = pgEnum(
  "expiry_email_type",
  expiryEmailTypeValues
);
export const expiryNoticeStatusEnum = pgEnum(
  "expiry_notice_status",
  expiryNoticeStatusValues
);

export const subscriptionExpiryNotices = pgTable(
  "subscription_expiry_notices",
  {
    id: serial("id").primaryKey(),
    userId: integer("userId").notNull(),
    stripeSubscriptionId: varchar("stripeSubscriptionId", { length: 255 }),
    daysRemaining: integer("daysRemaining").notNull(),
    emailType: expiryEmailTypeEnum("emailType").notNull(),
    status: expiryNoticeStatusEnum("status").default("sent").notNull(),
    emailSentAt: timestamp("emailSentAt").defaultNow().notNull(),
    expiresAt: timestamp("expiresAt").notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  }
);
export type SubscriptionExpiryNotice =
  typeof subscriptionExpiryNotices.$inferSelect;
export type InsertSubscriptionExpiryNotice =
  typeof subscriptionExpiryNotices.$inferInsert;

// ─── AI Bot + Robot Data Collection ──────────────────────────────────────────
export const dataSourceTypeValues = [
  "ai_bot",
  "robot",
  "wearable",
  "video_analysis",
  "manual",
  "api_integration",
] as const;
export const dataEventTypeValues = [
  "performance_metric",
  "biometric",
  "gps_tracking",
  "motion_capture",
  "ai_session",
  "recruitment_interaction",
  "training_session",
  "health_record",
  "game_stat",
  "combine_result",
  "injury_report",
  "recovery_score",
] as const;

export const dataSourceTypeEnum = pgEnum(
  "data_source_type",
  dataSourceTypeValues
);
export const dataEventTypeEnum = pgEnum("data_event_type", dataEventTypeValues);

export const athleteDataSources = pgTable("athlete_data_sources", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  sourceType: dataSourceTypeEnum("sourceType").notNull(),
  deviceId: varchar("deviceId", { length: 255 }),
  firmwareVersion: varchar("firmwareVersion", { length: 64 }),
  isActive: boolean("isActive").default(true).notNull(),
  lastSeenAt: timestamp("lastSeenAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});
export type AthleteDataSource = typeof athleteDataSources.$inferSelect;

export const athleteDataEvents = pgTable("athlete_data_events", {
  id: serial("id").primaryKey(),
  athleteId: integer("athleteId"),
  sourceId: integer("sourceId"),
  sourceType: dataSourceTypeEnum("sourceType").notNull(),
  eventType: dataEventTypeEnum("eventType").notNull(),
  sport: varchar("sport", { length: 64 }),
  sessionId: varchar("sessionId", { length: 128 }),
  payload: json("payload").notNull(),
  heartRate: integer("heartRate"),
  speed: real("speed"),
  distance: real("distance"),
  acceleration: real("acceleration"),
  recoveryScore: real("recoveryScore"),
  aiConfidence: real("aiConfidence"),
  latitude: real("latitude"),
  longitude: real("longitude"),
  deviceTimestamp: timestamp("deviceTimestamp"),
  processedAt: timestamp("processedAt"),
  isAnonymized: boolean("isAnonymized").default(false).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});
export type AthleteDataEvent = typeof athleteDataEvents.$inferSelect;
export type InsertAthleteDataEvent = typeof athleteDataEvents.$inferInsert;

export const athleteDataSummaries = pgTable("athlete_data_summaries", {
  id: serial("id").primaryKey(),
  athleteId: integer("athleteId").notNull(),
  summaryDate: varchar("summaryDate", { length: 10 }).notNull(),
  sport: varchar("sport", { length: 64 }),
  totalEvents: integer("totalEvents").default(0).notNull(),
  avgHeartRate: real("avgHeartRate"),
  maxSpeed: real("maxSpeed"),
  totalDistance: real("totalDistance"),
  avgRecoveryScore: real("avgRecoveryScore"),
  aiSessionCount: integer("aiSessionCount").default(0).notNull(),
  robotSessionCount: integer("robotSessionCount").default(0).notNull(),
  wearableSessionCount: integer("wearableSessionCount").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});
export type AthleteDataSummary = typeof athleteDataSummaries.$inferSelect;

// ─── Credit System ────────────────────────────────────────────────────────────
export const creditTxTypeValues = [
  "purchase",
  "deduction",
  "refund",
  "bonus",
  "admin_grant",
] as const;
export type CreditTxType = (typeof creditTxTypeValues)[number];

export const creditTxTypeEnum = pgEnum("credit_tx_type", creditTxTypeValues);

export const creditTransactions = pgTable("credit_transactions", {
  id: serial("id").primaryKey(),
  userId: integer("userId").notNull(),
  type: creditTxTypeEnum("type").notNull(),
  amount: integer("amount").notNull(),
  balanceAfter: integer("balanceAfter").notNull(),
  description: varchar("description", { length: 255 }),
  stripeSessionId: varchar("stripeSessionId", { length: 128 }),
  aiAction: varchar("aiAction", { length: 64 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});
export type CreditTransaction = typeof creditTransactions.$inferSelect;
export type InsertCreditTransaction = typeof creditTransactions.$inferInsert;

export const creditPackagePurchases = pgTable("credit_package_purchases", {
  id: serial("id").primaryKey(),
  userId: integer("userId").notNull(),
  packId: varchar("packId", { length: 64 }).notNull(),
  packName: varchar("packName", { length: 128 }).notNull(),
  credits: integer("credits").notNull(),
  amountCents: integer("amountCents").notNull(),
  stripeSessionId: varchar("stripeSessionId", { length: 128 }).notNull(),
  stripeCustomerId: varchar("stripeCustomerId", { length: 128 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});
export type CreditPackagePurchase = typeof creditPackagePurchases.$inferSelect;
export type InsertCreditPackagePurchase =
  typeof creditPackagePurchases.$inferInsert;

// ─── AI Trainer Bot ───────────────────────────────────────────────────────────
export const aiTrainerRoleValues = ["user", "assistant"] as const;
export type AiTrainerRole = (typeof aiTrainerRoleValues)[number];

export const aiTrainerRoleEnum = pgEnum("ai_trainer_role", aiTrainerRoleValues);

export const aiTrainerSessions = pgTable("ai_trainer_sessions", {
  id: serial("id").primaryKey(),
  userId: integer("userId").notNull(),
  role: aiTrainerRoleEnum("role").notNull(),
  content: text("content").notNull(),
  sessionTag: varchar("sessionTag", { length: 64 }),
  tokensUsed: integer("tokensUsed").default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});
export type AiTrainerSession = typeof aiTrainerSessions.$inferSelect;
export type InsertAiTrainerSession = typeof aiTrainerSessions.$inferInsert;

// ─── Athlete Calendar Events ──────────────────────────────────────────────────
export const calendarEventTypeValues = [
  "game",
  "practice",
  "nil",
  "recruiting",
  "team",
  "personal",
  "training",
  "media",
] as const;
export type CalendarEventType = (typeof calendarEventTypeValues)[number];
export const calendarEventTypeEnum = pgEnum(
  "calendar_event_type",
  calendarEventTypeValues
);

export const athleteCalendarEvents = pgTable("athlete_calendar_events", {
  id: serial("id").primaryKey(),
  userId: integer("userId").notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  date: varchar("date", { length: 10 }).notNull(), // YYYY-MM-DD
  time: varchar("time", { length: 10 }),
  type: calendarEventTypeEnum("type").default("personal").notNull(),
  location: varchar("location", { length: 255 }),
  description: text("description"),
  priority: varchar("priority", { length: 16 }).default("medium"),
  isPublic: boolean("isPublic").default(false),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});
export type AthleteCalendarEvent = typeof athleteCalendarEvents.$inferSelect;
export type InsertAthleteCalendarEvent =
  typeof athleteCalendarEvents.$inferInsert;

// ─── Athlete Stories (Instagram/Facebook-style 24hr stories) ─────────────────
export const athleteStories = pgTable("athlete_stories", {
  id: serial("id").primaryKey(),
  userId: integer("userId").notNull(),
  mediaUrl: text("mediaUrl"),
  mediaType: varchar("mediaType", { length: 16 }).default("image"),
  caption: text("caption"),
  storyType: varchar("storyType", { length: 32 }).default("update"),
  expiresAt: timestamp("expiresAt"),
  viewCount: integer("viewCount").default(0),
  isActive: boolean("isActive").default(true),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});
export type AthleteStory = typeof athleteStories.$inferSelect;

// ─── License Agreements (White-Label Licensing) ───────────────────────────────
export const licenseStatusValues = [
  "active",
  "pending",
  "suspended",
  "cancelled",
  "trial",
] as const;
export type LicenseStatus = (typeof licenseStatusValues)[number];
export const licenseStatusEnum = pgEnum("license_status", licenseStatusValues);

export const licenseTierValues = [
  "team",
  "school",
  "conference",
  "enterprise",
] as const;
export type LicenseTier = (typeof licenseTierValues)[number];
export const licenseTierEnum = pgEnum("license_tier", licenseTierValues);

export const licenseAgreements = pgTable("license_agreements", {
  id: serial("id").primaryKey(),
  orgName: varchar("orgName", { length: 255 }).notNull(),
  orgType: varchar("orgType", { length: 64 }).notNull(),
  tier: licenseTierEnum("tier").notNull(),
  monthlyFee: integer("monthlyFee").notNull(), // in cents
  athleteCount: integer("athleteCount").default(0),
  status: licenseStatusEnum("status").default("pending").notNull(),
  startDate: timestamp("startDate"),
  renewalDate: timestamp("renewalDate"),
  adminUserId: integer("adminUserId"),
  brandColor: varchar("brandColor", { length: 16 }),
  logoUrl: text("logoUrl"),
  customDomain: varchar("customDomain", { length: 255 }),
  contactName: varchar("contactName", { length: 255 }),
  contactEmail: varchar("contactEmail", { length: 255 }),
  contactPhone: varchar("contactPhone", { length: 32 }),
  stripeSubscriptionId: varchar("stripeSubscriptionId", { length: 128 }),
  stripeCustomerId: varchar("stripeCustomerId", { length: 128 }),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});
export type LicenseAgreement = typeof licenseAgreements.$inferSelect;
export type InsertLicenseAgreement = typeof licenseAgreements.$inferInsert;

// ─── Build 2: Recruiting Board ────────────────────────────────────────────────
// Colleges showing interest in an athlete. Distinct from recruitingTopFive (which
// is the athlete-curated signing day shortlist). This is the recruiter-driven side.
export const recruitingInterestLevelValues = [
  "watching",
  "interested",
  "offer_extended",
  "committed",
] as const;
export const recruitingInterestLevelEnum = pgEnum(
  "recruiting_interest_level",
  recruitingInterestLevelValues
);

export const recruitingLetterTypeValues = [
  "offer",
  "commitment",
  "interest",
  "ncaa_loi",
  "camp_invite",
] as const;
export const recruitingLetterTypeEnum = pgEnum(
  "recruiting_letter_type",
  recruitingLetterTypeValues
);

export const recruitingBoardEntries = pgTable("recruiting_board_entries", {
  id: serial("id").primaryKey(),
  athleteId: integer("athleteId").notNull(),
  collegeName: varchar("collegeName", { length: 255 }).notNull(),
  collegeLogoUrl: text("collegeLogoUrl"),
  division: varchar("division", { length: 32 }), // "NCAA D1" | "NCAA D2" | "NAIA" etc.
  conference: varchar("conference", { length: 64 }),
  level: recruitingInterestLevelEnum("level").default("watching").notNull(),
  coachName: varchar("coachName", { length: 128 }),
  coachEmail: varchar("coachEmail", { length: 320 }),
  notes: text("notes"),
  firstContactAt: timestamp("firstContactAt"),
  lastContactAt: timestamp("lastContactAt"),
  // ─── Build 3: Top 5 ladder fields ────────────────────────────────────
  rank: smallint("rank"), // 1-5, the slot in the Top 5 ladder. null = not in top 5
  letterUrl: text("letterUrl"), // R2 URL of uploaded offer/commitment/LOI
  letterType: recruitingLetterTypeEnum("letterType"),
  letterFilename: varchar("letterFilename", { length: 255 }),
  letterPublic: boolean("letterPublic").default(true).notNull(),
  letterUploadedAt: timestamp("letterUploadedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});
export type RecruitingBoardEntry = typeof recruitingBoardEntries.$inferSelect;
export type InsertRecruitingBoardEntry =
  typeof recruitingBoardEntries.$inferInsert;

// Aggregate counter: number of coach views (powers "47 Coaches Viewed" ticker).
export const recruitingCoachViews = pgTable("recruiting_coach_views", {
  id: serial("id").primaryKey(),
  athleteId: integer("athleteId").notNull(),
  coachName: varchar("coachName", { length: 128 }),
  collegeName: varchar("collegeName", { length: 255 }),
  viewedAt: timestamp("viewedAt").defaultNow().notNull(),
});
export type RecruitingCoachView = typeof recruitingCoachViews.$inferSelect;

// ─── Build 2: Awards ──────────────────────────────────────────────────────────
export const awardCategoryValues = [
  "team",
  "conference",
  "state",
  "regional",
  "national",
  "academic",
  "media",
  "combine",
] as const;
export const awardCategoryEnum = pgEnum("award_category", awardCategoryValues);

export const athleteAwards = pgTable("athlete_awards", {
  id: serial("id").primaryKey(),
  athleteId: integer("athleteId").notNull(),
  title: varchar("title", { length: 255 }).notNull(), // "First-Team All-State"
  organization: varchar("organization", { length: 255 }), // "Texas High School Coaches Association"
  category: awardCategoryEnum("category").default("team").notNull(),
  season: varchar("season", { length: 16 }), // "2025-26"
  awardedOn: timestamp("awardedOn"),
  badgeColor: varchar("badgeColor", { length: 16 }), // hex or gold/silver/bronze
  verified: boolean("verified").default(false).notNull(),
  proofUrl: text("proofUrl"), // R2-hosted proof image / news article
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});
export type AthleteAward = typeof athleteAwards.$inferSelect;
export type InsertAthleteAward = typeof athleteAwards.$inferInsert;

// ─── Build 2: Social Accounts (OAuth-linked, KMS-encrypted tokens) ────────────
// Stored AFTER the Signup tagline says "Once we have them, they never leave."
export const socialPlatformValues = [
  "instagram",
  "tiktok",
  "twitter",
  "youtube",
  "snapchat",
  "hudl",
  "maxpreps",
  "perfectgame",
  "rivals",
  "247sports",
] as const;
export const socialPlatformEnum = pgEnum(
  "social_platform",
  socialPlatformValues
);

export const athleteSocialAccounts = pgTable("athlete_social_accounts", {
  id: serial("id").primaryKey(),
  userId: integer("userId").notNull(),
  platform: socialPlatformEnum("platform").notNull(),
  externalUserId: varchar("externalUserId", { length: 255 }),
  handle: varchar("handle", { length: 255 }),
  displayName: varchar("displayName", { length: 255 }),
  accessTokenEncrypted: text("accessTokenEncrypted"), // KMS-encrypted, never logged
  refreshTokenEncrypted: text("refreshTokenEncrypted"),
  scope: text("scope"),
  expiresAt: timestamp("expiresAt"),
  followerCount: integer("followerCount").default(0),
  lastSyncedAt: timestamp("lastSyncedAt"),
  syncStatus: varchar("syncStatus", { length: 32 }).default("active"), // active | revoked | expired
  archivedAt: timestamp("archivedAt"), // 30-day soft delete
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});
export type AthleteSocialAccount = typeof athleteSocialAccounts.$inferSelect;
export type InsertAthleteSocialAccount =
  typeof athleteSocialAccounts.$inferInsert;

// ─── Build 2: Coach Lynx persistent chat ──────────────────────────────────────
// Replaces the in-memory trainerStore from Build 1. Persists per user, full transcript.
export const coachLynxRoleValues = ["system", "user", "assistant"] as const;
export const coachLynxRoleEnum = pgEnum("coach_lynx_role", coachLynxRoleValues);

export const coachLynxMessages = pgTable("coach_lynx_messages", {
  id: serial("id").primaryKey(),
  userId: integer("userId").notNull(),
  role: coachLynxRoleEnum("role").notNull(),
  content: text("content").notNull(),
  contextScreen: varchar("contextScreen", { length: 64 }), // which page they were on
  modelUsed: varchar("modelUsed", { length: 64 }), // "nebius" | "gemini" | "claude" | "openai"
  tokensIn: integer("tokensIn").default(0),
  tokensOut: integer("tokensOut").default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});
export type CoachLynxMessage = typeof coachLynxMessages.$inferSelect;
export type InsertCoachLynxMessage = typeof coachLynxMessages.$inferInsert;

// Per-user long-term memory facts that Coach Lynx can recall across sessions.
export const coachLynxMemory = pgTable("coach_lynx_memory", {
  id: serial("id").primaryKey(),
  userId: integer("userId").notNull(),
  fact: text("fact").notNull(), // "User competes at 6A in Texas"
  source: varchar("source", { length: 64 }), // "onboarding" | "chat" | "manual"
  confidence: real("confidence").default(1.0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});
export type CoachLynxMemory = typeof coachLynxMemory.$inferSelect;

// ─── Build 3: Sports avatar library ──────────────────────────────────────────
// Catalog of curated avatar + cover images athletes can pick from instead of
// uploading their own. Seeded by `pnpm run seed:avatars` after R2 upload.
// ─── Build 3: Founder presence ─────────────────────────────────────────────
export const founderFollows = pgTable("founder_follows", {
  id: serial("id").primaryKey(),
  founderUserId: integer("founderUserId").notNull(),
  athleteId: integer("athleteId").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});
export type FounderFollow = typeof founderFollows.$inferSelect;

export const founderNotes = pgTable("founder_notes", {
  id: serial("id").primaryKey(),
  founderUserId: integer("founderUserId").notNull(),
  athleteId: integer("athleteId").notNull(),
  title: varchar("title", { length: 160 }),
  body: text("body").notNull(),
  pinned: boolean("pinned").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});
export type FounderNote = typeof founderNotes.$inferSelect;

export const founderLessons = pgTable("founder_lessons", {
  id: serial("id").primaryKey(),
  founderUserId: integer("founderUserId").notNull(),
  title: varchar("title", { length: 160 }).notNull(),
  body: text("body").notNull(),
  audioUrl: text("audioUrl"),
  category: varchar("category", { length: 48 }),
  publishedAt: timestamp("publishedAt").defaultNow().notNull(),
  active: boolean("active").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});
export type FounderLesson = typeof founderLessons.$inferSelect;

// ─── Build 3: Athlynx Brand Wall (Endorsement Board) ───────────────────────
export const brandTierValues = [
  "iconic",
  "major",
  "regional",
  "local",
  "unknown",
] as const;
export const brandTierEnum = pgEnum("brand_tier", brandTierValues);

export const brandPursuitStatusValues = [
  "wishlist",
  "pitched",
  "conversation",
  "signed",
  "closed",
] as const;
export const brandPursuitStatusEnum = pgEnum(
  "brand_pursuit_status",
  brandPursuitStatusValues
);

export const brandWallEntries = pgTable("brand_wall_entries", {
  id: serial("id").primaryKey(),
  brandName: varchar("brandName", { length: 160 }).notNull(),
  brandLogoUrl: text("brandLogoUrl"),
  brandDomain: varchar("brandDomain", { length: 160 }),
  tier: brandTierEnum("tier").default("unknown").notNull(),
  category: varchar("category", { length: 48 }),
  submittedBy: integer("submittedBy").notNull(),
  curatedBy: integer("curatedBy"),
  approved: boolean("approved").default(false).notNull(),
  sortOrder: integer("sortOrder").default(0).notNull(),
  active: boolean("active").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});
export type BrandWallEntry = typeof brandWallEntries.$inferSelect;

export const brandWallPursuits = pgTable("brand_wall_pursuits", {
  id: serial("id").primaryKey(),
  athleteId: integer("athleteId").notNull(),
  brandWallEntryId: integer("brandWallEntryId").notNull(),
  status: brandPursuitStatusEnum("status").default("wishlist").notNull(),
  notes: text("notes"),
  signedAt: timestamp("signedAt"),
  dealValueCents: integer("dealValueCents"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});
export type BrandWallPursuit = typeof brandWallPursuits.$inferSelect;

export const sportsAvatarLibrary = pgTable("sports_avatar_library", {
  id: serial("id").primaryKey(),
  key: varchar("key", { length: 64 }).notNull().unique(),
  label: varchar("label", { length: 128 }).notNull(),
  kind: varchar("kind", { length: 16 }).notNull(), // 'avatar' | 'cover'
  sport: varchar("sport", { length: 32 }), // 'football' | 'basketball' | etc, NULL = universal
  imageUrl: text("imageUrl").notNull(),
  thumbnailUrl: text("thumbnailUrl"),
  sortOrder: integer("sortOrder").default(0).notNull(),
  active: boolean("active").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});
export type SportsAvatarLibraryItem =
  typeof sportsAvatarLibrary.$inferSelect;

// ─── Podcast (Founder podcast) ──────────────────────────────────────────────
export const podcastEpisodes = pgTable("podcast_episodes", {
  id: serial("id").primaryKey(),
  slug: varchar("slug", { length: 160 }).notNull().unique(),
  title: varchar("title", { length: 240 }).notNull(),
  subtitle: varchar("subtitle", { length: 240 }),
  description: text("description"),
  episodeNumber: integer("episodeNumber"),
  seasonNumber: integer("seasonNumber").default(1),
  audioUrl: text("audioUrl"),
  videoStreamId: varchar("videoStreamId", { length: 64 }),
  videoThumbnailUrl: text("videoThumbnailUrl"),
  coverArtUrl: text("coverArtUrl"),
  durationSeconds: integer("durationSeconds"),
  publishedAt: timestamp("publishedAt"),
  status: varchar("status", { length: 16 }).default("draft").notNull(),
  explicit: boolean("explicit").default(false).notNull(),
  transcript: text("transcript"),
  showNotes: text("showNotes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});
export type PodcastEpisode = typeof podcastEpisodes.$inferSelect;

export const podcastEpisodeGuests = pgTable("podcast_episode_guests", {
  id: serial("id").primaryKey(),
  episodeId: integer("episodeId").notNull(),
  userId: integer("userId"),
  guestName: varchar("guestName", { length: 160 }).notNull(),
  guestRole: varchar("guestRole", { length: 160 }),
  guestAvatarUrl: text("guestAvatarUrl"),
  sortOrder: integer("sortOrder").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});
export type PodcastEpisodeGuest = typeof podcastEpisodeGuests.$inferSelect;

// ─── Athlynx Network — streaming channels & events ──────────────────────────
export const streamProviderValues = [
  "cloudflare_stream",
  "mux",
  "youtube",
  "vimeo",
] as const;
export const streamProviderEnum = pgEnum("stream_provider", streamProviderValues);

export const streamStatusValues = [
  "scheduled",
  "live",
  "ended",
  "vod",
  "draft",
] as const;
export const streamStatusEnum = pgEnum("stream_status", streamStatusValues);

export const streamChannels = pgTable("stream_channels", {
  id: serial("id").primaryKey(),
  slug: varchar("slug", { length: 96 }).notNull().unique(),
  name: varchar("name", { length: 160 }).notNull(),
  description: text("description"),
  ownerUserId: integer("ownerUserId"),
  sport: varchar("sport", { length: 32 }),
  logoUrl: text("logoUrl"),
  bannerUrl: text("bannerUrl"),
  active: boolean("active").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});
export type StreamChannel = typeof streamChannels.$inferSelect;

export const streamEvents = pgTable("stream_events", {
  id: serial("id").primaryKey(),
  channelId: integer("channelId").notNull(),
  slug: varchar("slug", { length: 160 }).notNull().unique(),
  title: varchar("title", { length: 240 }).notNull(),
  description: text("description"),
  provider: streamProviderEnum("provider").default("cloudflare_stream").notNull(),
  providerStreamId: varchar("providerStreamId", { length: 64 }),
  playbackUrl: text("playbackUrl"),
  thumbnailUrl: text("thumbnailUrl"),
  status: streamStatusEnum("status").default("scheduled").notNull(),
  scheduledStartAt: timestamp("scheduledStartAt"),
  actualStartAt: timestamp("actualStartAt"),
  endedAt: timestamp("endedAt"),
  viewerCount: integer("viewerCount").default(0).notNull(),
  isPublic: boolean("isPublic").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});
export type StreamEvent = typeof streamEvents.$inferSelect;

// ─── Build 27.1: Studio Suite — generated graphics (Lineup, Match Day, Final Score) ─
// Persists every PNG generated by <LineupStudio />, <MatchDayStudio />, and
// <FinalScoreStudio /> so the team can re-publish, audit, and the AI Caption
// Engine can stack captions against the saved graphic.
export const studioGraphicTypeValues = [
  "lineup",
  "matchday",
  "finalscore",
] as const;
export type StudioGraphicType = (typeof studioGraphicTypeValues)[number];
export const studioGraphicTypeEnum = pgEnum(
  "studio_graphic_type",
  studioGraphicTypeValues,
);

export const studioGraphics = pgTable("studio_graphics", {
  id: serial("id").primaryKey(),
  userId: integer("userId").notNull(),
  type: studioGraphicTypeEnum("type").notNull(),
  teamName: varchar("teamName", { length: 160 }).notNull(),
  opponent: varchar("opponent", { length: 160 }),
  gameDate: varchar("gameDate", { length: 10 }), // YYYY-MM-DD
  pngUrl: text("pngUrl"), // R2 / Supabase URL after upload
  payload: json("payload"), // slot/score/caption data for re-render
  captions: json("captions"), // 3 captions from Nebius Llama 3.3-70B
  publishedTo: json("publishedTo"), // { buffer:true, zapier:true, ... }
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});
export type StudioGraphic = typeof studioGraphics.$inferSelect;
export type InsertStudioGraphic = typeof studioGraphics.$inferInsert;

// ─── SOCIAL PLATFORM EXTENSIONS (Build 50 · May 30, 2026) ────────────────────
// Added per Chad's social-ad platform vision: AthlynX = FB + IG + LinkedIn +
// TikTok + X, sports-vertical. Additive only — does NOT modify existing posts,
// postLikes, postComments, conversations, messages, notifications tables.
//
// Source of truth: client/src/governance.ts SOCIAL_AD_PLATFORM_DOCTRINE
// Status: SCHEMA-ONLY. Routes are stubs returning ROADMAP until wired.

export const socialFollows = pgTable("social_follows", {
  id: serial("id").primaryKey(),
  followerId: integer("follower_id").notNull(),
  followingId: integer("following_id").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const socialReposts = pgTable("social_reposts", {
  id: serial("id").primaryKey(),
  postId: integer("post_id").notNull(),
  userId: integer("user_id").notNull(),
  quoteText: text("quote_text"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const socialSaves = pgTable("social_saves", {
  id: serial("id").primaryKey(),
  postId: integer("post_id").notNull(),
  userId: integer("user_id").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const socialStories = pgTable("social_stories", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  mediaUrl: text("media_url").notNull(),
  mediaType: varchar("media_type", { length: 20 }).notNull(), // image | video
  caption: text("caption"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  expiresAt: timestamp("expires_at").notNull(), // 24h default
});

export const socialHashtags = pgTable("social_hashtags", {
  id: serial("id").primaryKey(),
  tag: varchar("tag", { length: 64 }).notNull().unique(),
  postCount: integer("post_count").default(0).notNull(),
  lastUsedAt: timestamp("last_used_at").defaultNow().notNull(),
});

// ─── AD PLATFORM (Build 50 · May 30, 2026) ───────────────────────────────────
// Native sponsored posts + brand-deal marketplace + endorsement matching.
// Stripe Connect powers brand → athlete payouts. Doctrine team is billing-
// exempt (Chad/Lee/Glenn/Tony do not pay platform fees on brand deals).

export const brandAccounts = pgTable("brand_accounts", {
  id: serial("id").primaryKey(),
  ownerUserId: integer("owner_user_id").notNull(),
  brandName: varchar("brand_name", { length: 200 }).notNull(),
  brandSlug: varchar("brand_slug", { length: 80 }).notNull().unique(),
  websiteUrl: text("website_url"),
  logoUrl: text("logo_url"),
  industry: varchar("industry", { length: 80 }),    // e.g. "Nutrition" | "Apparel" | "DTC"
  budgetUsdCents: integer("budget_usd_cents").default(0).notNull(),
  status: varchar("status", { length: 20 }).default("pending").notNull(), // pending | verified | suspended
  stripeConnectedAccountId: varchar("stripe_connected_account_id", { length: 64 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const adCampaigns = pgTable("ad_campaigns", {
  id: serial("id").primaryKey(),
  brandAccountId: integer("brand_account_id").notNull(),
  name: varchar("name", { length: 200 }).notNull(),
  objective: varchar("objective", { length: 40 }).notNull(), // awareness | engagement | clicks | nil_deals
  status: varchar("status", { length: 20 }).default("draft").notNull(), // draft | live | paused | ended
  budgetUsdCents: integer("budget_usd_cents").notNull(),
  spentUsdCents: integer("spent_usd_cents").default(0).notNull(),
  bidUsdCents: integer("bid_usd_cents").notNull(),         // CPM or CPC depending on objective
  targeting: json("targeting"),                            // {sports: [...], ageRange, geo, schoolTier, nilEligible}
  creativePostId: integer("creative_post_id"),             // links to posts table for native ads
  startAt: timestamp("start_at").defaultNow().notNull(),
  endAt: timestamp("end_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const adImpressions = pgTable("ad_impressions", {
  id: serial("id").primaryKey(),
  campaignId: integer("campaign_id").notNull(),
  viewerUserId: integer("viewer_user_id"),                 // null for logged-out
  context: varchar("context", { length: 40 }),             // feed | profile | brackets | diamond_grind | story
  costUsdMicros: integer("cost_usd_micros").default(0).notNull(),  // micro-cents for precision
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const adClicks = pgTable("ad_clicks", {
  id: serial("id").primaryKey(),
  campaignId: integer("campaign_id").notNull(),
  impressionId: integer("impression_id"),                  // optional link to source impression
  viewerUserId: integer("viewer_user_id"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const brandDealOffers = pgTable("brand_deal_offers", {
  id: serial("id").primaryKey(),
  brandAccountId: integer("brand_account_id").notNull(),
  athleteUserId: integer("athlete_user_id").notNull(),
  campaignId: integer("campaign_id"),
  offerUsdCents: integer("offer_usd_cents").notNull(),
  platformFeeBps: integer("platform_fee_bps").default(1500).notNull(), // 15% default
  status: varchar("status", { length: 20 }).default("offered").notNull(), // offered | accepted | declined | completed | cancelled
  contractTerms: text("contract_terms"),
  acceptedAt: timestamp("accepted_at"),
  completedAt: timestamp("completed_at"),
  stripePayoutId: varchar("stripe_payout_id", { length: 64 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type SocialFollow = typeof socialFollows.$inferSelect;
export type SocialRepost = typeof socialReposts.$inferSelect;
export type SocialSave = typeof socialSaves.$inferSelect;
export type SocialStory = typeof socialStories.$inferSelect;
export type SocialHashtag = typeof socialHashtags.$inferSelect;
export type BrandAccount = typeof brandAccounts.$inferSelect;
export type AdCampaign = typeof adCampaigns.$inferSelect;
export type AdImpression = typeof adImpressions.$inferSelect;
export type AdClick = typeof adClicks.$inferSelect;
export type BrandDealOffer = typeof brandDealOffers.$inferSelect;

// ─── LIFETIME ATHLETE IDENTITY (Innovation F · May 30, 2026) ─────────────────
// Tracks the five-stage career arc per user. One identity, birth to retirement.

export const athleteLifetimeProfile = pgTable("athlete_lifetime_profile", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  currentStage: varchar("current_stage", { length: 20 }).notNull(), // youth | high_school | college | pro | post_career
  stageEnteredAt: timestamp("stage_entered_at").defaultNow().notNull(),
  birthYear: integer("birth_year"),
  parentEmail: varchar("parent_email", { length: 200 }),            // youth stage only
  primarySport: varchar("primary_sport", { length: 40 }),
  position: varchar("position", { length: 40 }),
  highSchool: varchar("high_school", { length: 200 }),
  college: varchar("college", { length: 200 }),
  proTeam: varchar("pro_team", { length: 200 }),
  postCareerRole: varchar("post_career_role", { length: 200 }),
  diamondGrindStarted: timestamp("diamond_grind_started"),          // when this kid first joined Diamond Grind — proof of lifetime arc
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const lifetimeStageHistory = pgTable("lifetime_stage_history", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  fromStage: varchar("from_stage", { length: 20 }),
  toStage: varchar("to_stage", { length: 20 }).notNull(),
  transitionedAt: timestamp("transitioned_at").defaultNow().notNull(),
  notes: text("notes"),
});

// ─── AI RECRUITING CONCIERGE (Innovation B · May 30, 2026) ───────────────────
// One Nemotron-backed agent per Pro / Elite / Champion / MVP athlete.

export const conciergeBriefings = pgTable("concierge_briefings", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  briefingDate: timestamp("briefing_date").defaultNow().notNull(),
  recruitingSummary: text("recruiting_summary"),
  nilOpportunities: json("nil_opportunities"),                      // [{brand, fit_score, offer_range}]
  eligibilityNotes: text("eligibility_notes"),
  transferPortalAlerts: text("transfer_portal_alerts"),
  modelUsed: varchar("model_used", { length: 80 }).default("nvidia/Llama-3_1-Nemotron-Ultra-253B-v1"),
  promptTokens: integer("prompt_tokens"),
  completionTokens: integer("completion_tokens"),
  readAt: timestamp("read_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const conciergeAlerts = pgTable("concierge_alerts", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  alertType: varchar("alert_type", { length: 40 }).notNull(),       // recruiting | nil | transfer | eligibility | visit
  title: varchar("title", { length: 200 }).notNull(),
  body: text("body"),
  priority: varchar("priority", { length: 10 }).default("normal"),  // normal | high | urgent
  pushedAt: timestamp("pushed_at"),
  readAt: timestamp("read_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ─── NIL VALUATION SPIKES (Innovation D · May 30, 2026) ──────────────────────
// Real-time NIL re-scoring driven by performance events.

export const nilValuationSnapshots = pgTable("nil_valuation_snapshots", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  scoreUsdCents: integer("score_usd_cents").notNull(),              // current NIL value, USD cents
  prevScoreUsdCents: integer("prev_score_usd_cents"),
  pctChange: integer("pct_change"),                                  // basis-points style (e.g. 2300 = +23.00%)
  triggerEvent: varchar("trigger_event", { length: 40 }),            // regional_breakout_game | viral_social_moment | etc
  context: json("context"),                                          // { gameId, oppRank, statLine, viewers }
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const nilValueGainersFeed = pgTable("nil_value_gainers_feed", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  hourBucket: timestamp("hour_bucket").notNull(),                    // top gainers grouped by hour
  pctChange: integer("pct_change").notNull(),                        // basis-points
  rank: integer("rank"),                                             // 1 = top gainer that hour
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type AthleteLifetimeProfile = typeof athleteLifetimeProfile.$inferSelect;
export type LifetimeStageHistory = typeof lifetimeStageHistory.$inferSelect;
export type ConciergeBriefing = typeof conciergeBriefings.$inferSelect;
export type ConciergeAlert = typeof conciergeAlerts.$inferSelect;
export type NilValuationSnapshot = typeof nilValuationSnapshots.$inferSelect;
export type NilValueGainersFeed = typeof nilValueGainersFeed.$inferSelect;

// ─── PUSH NOTIFICATION TOKENS (Lane B mobile · May 30, 2026) ──────────────────
// Storage for Expo push tokens registered from the mobile app
// (mobile/push.ts → POST /api/push/register). Tokens are deduplicated by
// (token, user_id) so re-registration on app reopen does not create duplicates.
// nullable user_id allows token capture pre-auth (anonymous push for game
// updates, NIL feed, etc.). Linked to user when login completes.

export const pushTokens = pgTable("push_tokens", {
  id: serial("id").primaryKey(),
  userId: integer("user_id"),                                       // nullable — registered before auth
  token: text("token").notNull(),                                   // Expo push token (ExponentPushToken[...])
  platform: varchar("platform", { length: 10 }).notNull(),          // "ios" | "android"
  appVersion: varchar("app_version", { length: 20 }),
  deviceModel: varchar("device_model", { length: 80 }),
  active: boolean("active").default(true).notNull(),
  lastSeenAt: timestamp("last_seen_at").defaultNow().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type PushToken = typeof pushTokens.$inferSelect;
