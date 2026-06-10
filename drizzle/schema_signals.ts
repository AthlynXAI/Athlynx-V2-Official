/**
 * AthlynXAI OS — Behavior Algorithm Substrate (Build 28)
 *
 * The platform learns athletes (and parents, coaches, directors, brands) by
 * recording every meaningful action as a typed signal event. Signals roll up
 * into aggregates, drive lifecycle stage transitions, and produce recommendation
 * scores that fire autonomous platform actions.
 *
 * Lifecycle thesis:
 *   Catch them at 12. Watch them at 16. Sign them at 22. Hire them at 35.
 *
 * Layers wired here:
 *   Layer 1 — Identity   → who emitted the signal
 *   Layer 8 — AI on top  → what the platform learns from the signal
 *   Layer 9 — Syndication → what the platform fires in response
 *
 * Migration file: drizzle/0013_build28_behavior_signals.sql
 *
 * Append-only: signal_events, lifecycle_transitions, recommendation_scores
 * Mutable:     signal_aggregates (rollup target), behavior_segments (recomputed)
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
  real,
} from "drizzle-orm/pg-core";

// ─── Signal kind registry (wide first wave) ──────────────────────────────────
//
// Add kinds here. The registry is the source of truth. Routers reference
// SignalKind type. Adding a kind is a one-line change in this file.
//
// Naming convention: <domain>.<entity>.<action>
//
// Domains: identity | profile | studio | comm | recruiting | nil | content |
//          lifecycle | system | engagement
//

export const signalKindValues = [
  // identity / account lifecycle
  "identity.user.signup",
  "identity.user.login",
  "identity.user.dormant_7d",
  "identity.user.dormant_14d",
  "identity.user.reactivated",

  // profile claims and ownership
  "profile.athlete.claimed",
  "profile.athlete.parent_invited",
  "profile.athlete.coach_claimed",
  "profile.athlete.viewed",
  "profile.athlete.edited",

  // studio suite (graphic / lineup / score)
  "studio.lineup.created",
  "studio.graphic.created",
  "studio.score.posted",
  "studio.milestone.added",

  // communications (mirrors Comms OS)
  "comm.inbound.received",
  "comm.inbound.coach",
  "comm.inbound.parent",
  "comm.inbound.director",
  "comm.outbound.auto_reply",
  "comm.outbound.draft_created",
  "comm.outbound.sent",
  "comm.reply.opened",

  // recruiting / college signals
  "recruiting.page.viewed",
  "recruiting.coach.viewed_profile",
  "recruiting.milestone.published",

  // NIL / marketplace
  "nil.deal.viewed",
  "nil.deal.tapped",
  "nil.deal.signed",

  // content engagement
  "content.post.created",
  "content.post.liked",
  "content.video.uploaded",
  "content.photo.uploaded",
  "content.feed.opened",

  // lifecycle stage events
  "lifecycle.stage.entered",
  "lifecycle.stage.advanced",

  // system / automation feedback
  "system.recommendation.fired",
  "system.recommendation.acted_on",
  "system.recommendation.ignored",
  "system.automation.escalated",
] as const;

export type SignalKind = (typeof signalKindValues)[number];

export const signalKindEnum = pgEnum("signal_kind", signalKindValues);

// ─── Signal source (who/what emitted) ────────────────────────────────────────

export const signalSourceValues = [
  "athlete",
  "parent",
  "coach",
  "director",
  "brand",
  "recruiter",
  "system",
  "automation",
  "founder",
] as const;
export const signalSourceEnum = pgEnum("signal_source", signalSourceValues);

// ─── Lifecycle stages (athlete arc) ──────────────────────────────────────────

export const lifecycleStageValues = [
  "youth_9_12",        // 9U–12U: help the family organize the season
  "preteen_13_14",     // 13U–14U: organize before recruiting pressure
  "highschool_15_16",  // 15U–16U: turn development into recruiting presence
  "highschool_17_18",  // 17U–18U: route offers, visits, deal interest
  "college_18_22",     // College: NIL, media, calendar, marketplace
  "pro_22_plus",       // Pro: career record, brand, media archive
  "post_career_35",    // Post-career: coach, mentor, founder, scout
  "unassigned",        // Default until first signal lands
] as const;
export const lifecycleStageEnum = pgEnum("lifecycle_stage", lifecycleStageValues);

// ─── Behavior segment (computed grouping) ────────────────────────────────────

export const behaviorSegmentValues = [
  "active_weekly_poster",     // ≥1 studio action / week, last 4 weeks
  "active_monthly_poster",    // ≥1 studio action / month
  "graphic_heavy",            // graphic > lineup > score
  "score_only",               // posts scores, no graphics
  "parent_driven",            // parent account does most actions
  "coach_driven",             // coach account does most actions
  "athlete_driven",           // athlete account does most actions
  "dormant_7d",
  "dormant_14d",
  "dormant_30d",
  "founding_100",             // founding 100 teams cohort
  "recruiting_active",        // recruiting page views in last 14d
  "nil_engaged",              // NIL deal taps in last 30d
  "new_unactivated",          // signed up but no studio action yet
  "unassigned",
] as const;
export const behaviorSegmentEnum = pgEnum("behavior_segment", behaviorSegmentValues);

// ─── Recommendation kinds (what the algorithm decides to do) ────────────────

export const recommendationKindValues = [
  "ready_for_studio_day1",       // newly claimed → push first lineup card
  "ready_for_milestone_post",    // active poster → push milestone template
  "ready_for_recruiting_card",   // age + behavior → recruiting profile prompt
  "at_risk_churn",               // dormant signals → re-engagement
  "parent_engagement_needed",    // athlete-only activity → invite parent
  "coach_engagement_needed",     // athlete-only activity → invite coach
  "lifecycle_stage_advance",     // ready to advance to next stage
  "founder_outreach_priority",   // high-signal → escalate to Chad
  "auto_reply_eligible",         // comm matched approved template
] as const;
export const recommendationKindEnum = pgEnum("recommendation_kind", recommendationKindValues);

// ─── signal_events ────────────────────────────────────────────────────────────
// Append-only event log. One row per athlete action. The substrate of the
// algorithm. Indexed for fast rollup by athlete + kind + window.

export const signalEvents = pgTable("signal_events", {
  id: serial("id").primaryKey(),
  // The athlete this signal is about (FK semantically, no constraint to keep
  // schema additive and the table scaling-friendly)
  athleteUserId: integer("athleteUserId"),
  // The actor that emitted this signal — may differ from the athlete
  // (e.g. parent emits, coach emits, system emits)
  actorUserId: integer("actorUserId"),
  source: signalSourceEnum("source").notNull(),
  kind: signalKindEnum("kind").notNull(),
  // Free-form context payload — stores entity ids, page slugs, comm event ids, etc.
  context: json("context"),
  // Numeric weight — defaults to 1.0 but can be overridden for high-value signals
  // (e.g. NIL deal signed = 10.0, profile claim = 5.0, page view = 0.1)
  weight: real("weight").notNull().default(1.0),
  // Did this signal originate from a comm event? Cross-link for the dashboard.
  commEventId: integer("commEventId"),
  occurredAt: timestamp("occurredAt").defaultNow().notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});
export type SignalEvent = typeof signalEvents.$inferSelect;

// ─── signal_aggregates ───────────────────────────────────────────────────────
// Pre-computed rollups by athlete × time-window × kind. Rebuilt by a nightly
// job (and incrementally on hot writes). Drives recommendations and segments.

export const aggregateWindowValues = ["1d", "7d", "30d", "90d", "365d", "all"] as const;
export const aggregateWindowEnum = pgEnum("aggregate_window", aggregateWindowValues);

export const signalAggregates = pgTable("signal_aggregates", {
  id: serial("id").primaryKey(),
  athleteUserId: integer("athleteUserId").notNull(),
  kind: signalKindEnum("kind").notNull(),
  window: aggregateWindowEnum("window").notNull(),
  count: integer("count").notNull().default(0),
  weightSum: real("weightSum").notNull().default(0),
  // Most recent occurrence within the window — fast "last seen" lookup
  lastOccurredAt: timestamp("lastOccurredAt"),
  // Rollup version — bumped each rebuild for cache invalidation
  version: integer("version").notNull().default(1),
  computedAt: timestamp("computedAt").defaultNow().notNull(),
});
export type SignalAggregate = typeof signalAggregates.$inferSelect;

// ─── lifecycle_transitions ───────────────────────────────────────────────────
// Append-only log of stage transitions. The platform's view of the athlete's
// arc through their career. Auto-advances based on age + behavior thresholds.

export const lifecycleTransitions = pgTable("lifecycle_transitions", {
  id: serial("id").primaryKey(),
  athleteUserId: integer("athleteUserId").notNull(),
  fromStage: lifecycleStageEnum("fromStage"),
  toStage: lifecycleStageEnum("toStage").notNull(),
  // Why the platform advanced this athlete: "age_threshold", "signal_density",
  // "manual_override", "first_claim", "dormant_recovery", etc.
  reason: varchar("reason", { length: 64 }).notNull(),
  // Optional human override — null when fully autonomous
  overriddenByUserId: integer("overriddenByUserId"),
  // Aggregate snapshot at the moment of transition (for audit/replay)
  snapshot: json("snapshot"),
  occurredAt: timestamp("occurredAt").defaultNow().notNull(),
});
export type LifecycleTransition = typeof lifecycleTransitions.$inferSelect;

// ─── athlete_lifecycle_state ─────────────────────────────────────────────────
// Current stage per athlete — denormalized for fast reads. One row per athlete.
// Updated whenever a new lifecycle_transitions row is inserted.

export const athleteLifecycleState = pgTable("athlete_lifecycle_state", {
  athleteUserId: integer("athleteUserId").primaryKey(),
  currentStage: lifecycleStageEnum("currentStage").notNull().default("unassigned"),
  enteredCurrentStageAt: timestamp("enteredCurrentStageAt").defaultNow().notNull(),
  // Last transition id — link back to the audit row
  lastTransitionId: integer("lastTransitionId"),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});
export type AthleteLifecycleState = typeof athleteLifecycleState.$inferSelect;

// ─── recommendation_scores ───────────────────────────────────────────────────
// Per athlete, per recommendation-kind, with a 0..100 score and reason codes.
// High-confidence scores fire autonomous actions through the Comms OS or in-app
// prompt system. Low-confidence scores surface in the review queue.
// Append-only history — current state is the most recent row per (athlete, kind).

export const recommendationScores = pgTable("recommendation_scores", {
  id: serial("id").primaryKey(),
  athleteUserId: integer("athleteUserId").notNull(),
  kind: recommendationKindEnum("kind").notNull(),
  // 0..100 confidence score
  score: smallint("score").notNull(),
  // Reason codes — JSON array of rule ids / signal kinds that contributed
  reasons: json("reasons"),
  // Did this recommendation fire an automated action? If so, what?
  firedActionId: integer("firedActionId"),
  // Did the user act on this recommendation? Updated by feedback loop.
  actedOn: boolean("actedOn").default(false).notNull(),
  // Threshold at the time this score was computed — for replay
  thresholdAtScore: smallint("thresholdAtScore"),
  computedAt: timestamp("computedAt").defaultNow().notNull(),
});
export type RecommendationScore = typeof recommendationScores.$inferSelect;

// ─── behavior_segments ───────────────────────────────────────────────────────
// Computed segment memberships per athlete. An athlete can belong to multiple
// segments (e.g. "active_weekly_poster" + "parent_driven" + "founding_100").
// Recomputed by the nightly job.

export const athleteBehaviorSegments = pgTable("athlete_behavior_segments", {
  id: serial("id").primaryKey(),
  athleteUserId: integer("athleteUserId").notNull(),
  segment: behaviorSegmentEnum("segment").notNull(),
  // Score within the segment (0..100) — lets us rank "most active" within
  // "active_weekly_poster", etc.
  score: smallint("score").notNull().default(50),
  // When did this athlete enter this segment?
  enteredAt: timestamp("enteredAt").defaultNow().notNull(),
  // When was this membership last confirmed by the recompute job?
  refreshedAt: timestamp("refreshedAt").defaultNow().notNull(),
  active: boolean("active").default(true).notNull(),
});
export type AthleteBehaviorSegment = typeof athleteBehaviorSegments.$inferSelect;
