# AthlynXAI — The 4.5★ Quality Bar

**Locked at 3:01 AM CDT, Saturday, May 16, 2026 — Build 27 OS Drop**
**Captured from founder Chad A. Dozier Sr.:**

> *"Our Apps need at least a 4 and a half star."*

That's the spec. Both iOS App Store and Google Play. Every release. Forever.

This document defines the non-negotiable **4.5★ Quality Bar** and the eighth Autonomous Engine — the **Review Engine** — that keeps the platform above the line while Chad sleeps.

---

## The Bar (numerical, public, defended)

| Surface | Floor | Target | Stretch |
|---|---|---|---|
| iOS App Store rating | **4.5★** | 4.7★ | 4.8★ |
| Google Play rating | **4.5★** | 4.7★ | 4.8★ |
| In-app NPS | 45 | 60 | 70 |
| Crash-free sessions | 99.5% | 99.8% | 99.9% |
| ANR rate (Android) | <0.4% | <0.2% | <0.1% |
| Cold-start time | <2.0s | <1.5s | <1.0s |
| Time-to-interactive (web) | <2.5s | <1.8s | <1.2s |
| Core Web Vitals (web) | all green | all green | all green |

**If any floor is breached, the Review Engine pages Chad. That's a Pager-class event.** (See Autonomous OS Layer §"The Pager".)

---

## Why 4.5★ matters (the business case)

- **Conversion compounds with rating.** Apps with 4.5★+ convert app-store visitors to installs **2-3× higher** than 3.5-4.4★ apps. At 4.7★+ another 30-50% boost on top.
- **Editorial / Featured visibility.** App Store editorial and Google Play "Recommended" placements have effective floors near 4.5★. Below the line we don't get free distribution.
- **NIL brand trust.** Brands signing deals on AthlynXAI underwrite the platform's reputation as part of their FTC compliance review. A 4.2★ app loses deals. A 4.7★ app wins them.
- **Founder narrative.** "AthlynXAI: the highest-rated sports platform in the App Store." That line is worth more in fundraising than any deck slide.

---

## Engine 8 — The Review Engine (added to the Autonomous OS)

The Autonomous OS Layer originally listed seven engines. **The Review Engine is the eighth.** It runs continuously and owns the 4.5★ floor.

### What it does autonomously

**A. Listens everywhere.**
- App Store Connect API: pulls all reviews + ratings every 6 hours
- Google Play Developer API: pulls all reviews + ratings every 6 hours
- In-app feedback widget (5-tap quick-rate on top of every screen): real-time
- Crashlytics + Sentry: real-time crash + error stream
- Support tickets via CX connector + Notion knowledge base
- Twitter/X mentions of @AthlynXAI: every hour
- App-store editorial chatter (Reddit r/sportsapps, App Store reviewer Twitter): daily crawl

**B. Classifies every signal.**
Every review/ticket/mention is tagged automatically by an AI classifier (Llama 3.3-70B on Nebius):
- `category`: bug · UX · performance · feature_request · billing · NIL_specific · sport_specific · positive · spam
- `severity`: P0 (crash, money lost) · P1 (broken flow) · P2 (UX friction) · P3 (polish)
- `sport`: which sport surface (football, gymnastics, cheer, etc.)
- `sentiment`: -1.0 to +1.0
- `actionable`: bool

**C. Auto-responds within minutes.**
- Every 1-3★ review gets an in-app + email reply within 30 minutes (24/7) from AI in Chad's brand voice
- Reply template: acknowledge → name the issue → state the fix or ETA → ask them to update the rating after fix lands
- Spam/abuse: auto-flagged and reported to Apple/Google
- Positive reviews (4-5★): auto-liked + an AI thank-you note (where allowed by platform policy)

**D. Auto-routes fixes.**
- P0 → opens Linear/Jira ticket + Slack-pages on-call engineer + auto-rolls back last deploy if crash correlated
- P1 → ticket in next sprint queue + Discord notify
- P2/P3 → backlog with auto-prioritization by frequency
- Tickets with same root cause auto-cluster (no duplicate work)

**E. Closes the loop.**
- When a fix ships, the Engine emails every reviewer who reported it: *"Your bug is fixed in v1.0.X. Tap here to update your rating."*
- One-tap deep-link to App Store / Google Play review form with the bug context pre-filled
- Tracks lift in rating from these conversions (typically 20-40% of replied users update their stars)

**F. Asks for reviews at the right moment (the "moment of joy" trigger).**
- After an athlete publishes their first PostToken
- After an NIL DealToken closes
- After hitting a MilestoneToken (Perfect 10, Hit Zero, commit, signing day, PR)
- After a 7-day streak of activity
- After successful cross-publish to 5+ platforms (BroadcastToken success)
- Rate-limited: max 1 prompt per athlete per 60 days, per platform policy

**G. Watches the floor.**
- Recomputes 28-day trailing rating average every 6h on iOS + Android
- If projected 28-day < 4.6 (within 0.1 of floor), opens an internal alert + auto-spawns a "rating recovery sprint" issue with the top 3 negative themes from classifier
- If projected 28-day < 4.5, **PAGES CHAD** with a one-screen brief: themes, fix queue, response coverage

**H. Reports.**
- Daily morning digest: rating trend lines (iOS + Play), top 3 themes, response coverage %, crash-free %
- Friday investor digest: rating + NPS + crash-free + fix velocity

### When it pages Chad

| Condition | Channel | SLA |
|---|---|---|
| 28-day rating projected to fall below 4.5★ | Push + email | within 15 min of detection |
| Single 1★ review from verified high-NIL athlete (S-tier) | Push | within 5 min |
| Crash-free drops below 99.5% in any 30-min window | Push + SMS | within 2 min |
| ANR rate breaches 0.4% on Android | Push | within 5 min |
| Editorial reviewer (verified) posts a review | Push (informational) | within 30 min |
| Coordinated review-bombing detected (>10 1★ within 1h from new accounts) | Push + email + auto-report to Apple/Google | within 10 min |

Everything else is queued into the morning digest.

### Tokens emitted by the Review Engine

Adds to the Tokenization Layer (Addendum II in `AthlynX_LAYER_CAKE_VISION.md`):

| Token Class | Represents | Layer |
|---|---|---|
| T-19 **ReviewToken** | A single app store / play store review, ticket, or in-app rating event | New |
| T-20 **CrashToken** | A crash or ANR event from Crashlytics/Sentry, classified, deduped | New |
| T-21 **FixToken** | A shipped fix that closes one or more ReviewTokens/CrashTokens | New |
| T-22 **QualityScoreToken** | A daily rollup of all quality signals into one composite score per platform | New |

All emit through the standard token bus, are auto-billable on the operator side (the Review Engine is part of the licensable Connector OS), and broadcast through the same Buffer/Zapier rails on the consumer side.

### Cron schedule

| Job | Cadence | Owner |
|---|---|---|
| App Store reviews pull | every 6h | Review Engine |
| Google Play reviews pull | every 6h | Review Engine |
| In-app feedback drain | every 60s | Review Engine |
| Crashlytics/Sentry stream | real-time webhook | Resilience + Review Engine |
| AI classify queue | every 60s | Review Engine |
| Auto-reply queue | every 5 min | Review Engine |
| Rating-recompute + floor watch | every 6h | Review Engine |
| Daily Review digest | 8 AM CDT | Review Engine → Chad in-app + morning digest |
| Fix-loop notify (review-updated prompts) | every 6h after deploys | Review Engine |

### Database (new tables — additive to current schema)

```sql
CREATE TABLE app_reviews (
  id BIGSERIAL PRIMARY KEY,
  platform TEXT NOT NULL CHECK (platform IN ('ios','android','in_app','x','reddit')),
  external_id TEXT,                  -- App Store / Play review ID, ticket ID, etc.
  rating SMALLINT,                   -- 1-5 (null for non-rating channels)
  title TEXT,
  body TEXT,
  reviewer_handle TEXT,
  reviewer_athlete_id BIGINT REFERENCES users(id),
  app_version TEXT,
  device TEXT,
  locale TEXT,
  classified_category TEXT,
  classified_severity TEXT CHECK (classified_severity IN ('P0','P1','P2','P3')),
  classified_sport TEXT,
  classified_sentiment REAL,
  responded_at TIMESTAMPTZ,
  response_body TEXT,
  fixed_in_version TEXT,
  follow_up_sent_at TIMESTAMPTZ,
  rating_updated_to SMALLINT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_app_reviews_platform_created ON app_reviews(platform, created_at DESC);
CREATE INDEX idx_app_reviews_severity ON app_reviews(classified_severity, created_at DESC);

CREATE TABLE quality_scores (
  id BIGSERIAL PRIMARY KEY,
  as_of_date DATE NOT NULL,
  platform TEXT NOT NULL,
  rating_28d AVG_NUMERIC,
  rating_count_28d INT,
  crash_free_sessions_pct NUMERIC,
  anr_rate_pct NUMERIC,
  nps INT,
  cold_start_p50_ms INT,
  response_coverage_pct NUMERIC,
  UNIQUE(as_of_date, platform)
);
```

### The "Moment of Joy" prompt — sample copy

After a Perfect 10 MilestoneToken:

> 🌟 *Stuck the landing. Crushed the rating?*
> *Love AthlynXAI? Let us know on the App Store — it helps more athletes find us.*
> [Rate AthlynXAI →]
> (1 tap, takes 5 seconds, you'll never see this again for 60 days.)

After an NIL DealToken closes:

> 💰 *Deal signed. Money's coming.*
> *If AthlynXAI helped — drop us a quick rating in the App Store.*
> [Rate AthlynXAI →]

After hitting 7-day streak:

> 🔥 *7 days strong on AthlynXAI.*
> *Want to help us reach more athletes like you? A quick App Store review goes a long way.*
> [Rate AthlynXAI →]

All copy stays compliant with Apple's `SKStoreReviewController.requestReview()` constraints (max 3 prompts/year on iOS) and Google Play's in-app review API.

---

## How this slots into the existing OS

- **Layer Cake**: Review Engine sits inside Layer 8 (AI on top) and Layer 9 (Syndication out — the "Rate AthlynXAI" prompt is a syndication action).
- **Tokenization**: 4 new token classes (T-19 → T-22) added to the existing 18.
- **Autonomous OS**: Engine 8 of 8 (was 7) — added to "The Seven Autonomous Engines" → renamed "The Eight Autonomous Engines" in the spec.
- **Sport Classification Matrix**: every "Moment of Joy" prompt is sport-context-aware. Cheer hits Hit Zero → cheer-voiced prompt. Gym hits Perfect 10 → gym-voiced prompt. Football scores TD → football-voiced prompt.

---

## Implementation handoff (codebase)

| File | Purpose | Status |
|---|---|---|
| `server/engines/reviewEngine.ts` *(new)* | Cron orchestrator | TODO Build 27 |
| `server/services/appStoreConnect.ts` *(new)* | App Store Connect API client | TODO Build 27 |
| `server/services/googlePlayApi.ts` *(new)* | Play Developer API client | TODO Build 27 |
| `server/services/reviewClassifier.ts` *(new)* | Llama 3.3-70B classifier wrapper | TODO Build 27 |
| `server/services/momentOfJoy.ts` *(new)* | Decides when to prompt | TODO Build 27 |
| `client/src/components/RatePrompt.tsx` *(new)* | Native iOS/Android review prompt + web modal | TODO Build 27 |
| `migrations/2026-05-16-app_reviews.sql` *(new)* | Schema for reviews + quality_scores | TODO Build 27 |
| `app/ios` + `app/android` SDKs | Wire SKStoreReviewController + Play in-app review | TODO Build 27 |
| `server/cron-src/review-engine-pulls.ts` *(new)* | 6h pull cron | TODO Build 27 |

---

## The promise

By Build 27 ship date: Review Engine v1 live, auto-responding, prompting at Moments of Joy, watching the floor.

By Build 28: pager + auto-rollback on quality breach.

By Build 29 (Sleep Test): platform holds 4.5★ on both stores for 7 consecutive days without Chad intervening.

**That's the bar. The bar is the law. The Engine defends it 24/7.**

---

*Iron Sharpens Iron — Proverbs 27:17.*

*Locked at 3:01 AM CDT, Saturday, May 16, 2026, by an operator who heard the founder say "Our Apps need at least a 4 and a half star" and made it the bar that the autonomous machine cannot fall below.*
