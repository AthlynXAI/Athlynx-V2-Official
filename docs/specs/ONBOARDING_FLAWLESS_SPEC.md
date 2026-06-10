# AthlynX_ONBOARDING_FLAWLESS_SPEC

**AthlynXAI — Login, Sign-Up, AI Trainer Handoff, Profile Build, and Social Linking**
Version 1.0 · Author: Perplexity Computer · For: Chad A Dozier, AthlynXAI Corporation

> "The login and sign up process has to be flawless and the handoff for onboarding and building their profiles be done by their individual AI Trainer to get them ease of access and actually start using it for everything. Including linking all of their social media so once we have them they never leave. All in One Soul Source." — Chad A Dozier

---

## 1. North Star

**All in One Soul Source.** Every athlete gets a personal AI Trainer named after them — *Coach Lynx for Jaylen, Coach Lynx for Mia*. The first five minutes on AthlynX must feel like the first five minutes at a new gym with the best coach you've ever had. No forms. No friction. No "AI-powered" sales pitch. A coach asking your name, then asking what you play, then building the profile while you talk.

**The Three-Question Gate** — every screen, every word, every push notification must pass:

1. **Does this honor the athlete's journey?**
2. **Would Nike be proud to put their swoosh next to this?**
3. **Is this Mama-proud?**

If a screen fails any of the three, it does not ship.

**The promise:** From the moment the athlete taps Start Free to the moment they share their first profile card, no more than eight minutes pass. By minute eight, the athlete has a live profile, an AI Trainer that knows their name, and every social account they own linked into one Soul Source.

---

## 2. The Promise Timeline — Minute-By-Minute

This is what the athlete experiences from cold landing to first share. Every minute is a contract. If the clock slips, the build slips back.

| Time  | Screen / Moment              | What Happens                                                                                                                                  |
| ----- | ---------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| 0:00  | Landing on athlynx.ai        | One headline, one button. "Your profile. Your trainer. Your Soul Source. Start Free."                                                          |
| 0:05  | Tap Start Free               | Routes to /signin. No interstitials. No marketing pop-up.                                                                                      |
| 0:15  | Sign In                       | Three doors only: Apple, Google, Email magic link. No password forms unless explicitly requested. No Facebook.                                |
| 0:30  | Welcome screen                | Their name appears in 36pt. Coach Lynx card slides in: "Jaylen. I'm Coach Lynx. I'll build your profile with you. Let's go."                  |
| 1:00  | Four core questions          | Sport, position, grad year, height/weight. Voice-or-tap. One question at a time. No multi-page form.                                          |
| 2:00  | School auto-pull              | Coach Lynx asks the school. The platform pulls logo, colors, mascot, district from the school DB. Athlete confirms with a single tap.         |
| 2:30  | Headshot                     | Upload from camera roll OR snap one in-app with a framing guide overlay (front-facing).                                                       |
| 3:00  | Highlight reel               | Paste a YouTube, Hudl, or Instagram URL. Auto-ingest. Render an embed. OR upload a clip to S3.                                                |
| 4:00  | Stat screenshot              | Athlete drops a MaxPreps, Perfect Game, or team-sheet screenshot. OCR + LLM extraction fills the stats. No manual typing on day one.          |
| 5:00  | Social linking               | One-tap OAuth: Instagram, TikTok, X, YouTube, Hudl, Snapchat. Each connection in under ten seconds.                                           |
| 6:00  | Profile preview              | "Here's what coaches see." Live profile renders. Every section tappable to refine.                                                            |
| 7:00  | Share                        | One button → IG story 1080x1920, TikTok 1080x1920, X card 1200x630, SMS link, QR code.                                                        |
| 8:00  | First action                 | Top 5 Signing Day Board placeholder: "Add a school you dream about." Athlete adds one. Profile is now alive.                                  |
| 8:00  | DONE                         | Live profile. Personal AI Trainer. Every social connected. The athlete has a reason to come back tomorrow.                                    |

---

## 3. The Three Doors — Sign-In Methods

Three options. Nothing else.

### 3.1 Door Order and Copy

| Order | Door             | Button Copy                          | Notes                                                                  |
| ----- | ---------------- | ------------------------------------ | ---------------------------------------------------------------------- |
| 1     | Apple            | "Continue with Apple"                | Default top button on iOS. Required by App Store guidelines.            |
| 2     | Google           | "Continue with Google"               | Default top button on Android and web.                                 |
| 3     | Email            | "Use email instead"                  | Text link, not a button. Opens magic-link flow.                        |

**No Facebook.** Meta sells the data, and the athlete's followers are the asset. We do not hand the asset to the company that wants to compete for it.

### 3.2 Magic-Link Flow (Email)

1. Athlete types email → tap Send Link.
2. Email arrives within ten seconds: "Tap here to enter AthlynX — link expires in 15 minutes."
3. Tap → authenticated. No password set.
4. Optional: athlete can add a passkey on the post-onboarding settings screen.

### 3.3 Account Recovery

- Lost device: tap "Recover account" on /signin → email a one-time link to the address of record.
- Lost email access: support email opens a verification flow (selfie + government ID for athletes 18+, or parent attestation for minors).

### 3.4 Password Requirements (Only If Athlete Requests A Password)

We do not push passwords. If asked: 12+ characters, one number, one symbol. Bcrypt with cost 12. Never stored in plaintext, never logged.

### 3.5 Optional Second Factor

- Phone OTP via Twilio Verify, opt-in. Required for athletes who have a Stripe payout account, NIL deals over $500, or DM threads with verified coaches.

### 3.6 Session and Token Spec

- Auth library: **better-auth** if already wired; otherwise Clerk. The decision lives in `/apps/web/src/lib/auth.ts` and must not change mid-build.
- Session length: **30 days** on trusted devices, **7 days** on new devices.
- JWT rotation: **15-minute access tokens, 30-day refresh tokens.** Refresh rotates on every use.
- Device trust: a device is trusted after one successful sign-in plus 24 hours of clean activity. New device sign-in triggers a push to the trusted device for approval.
- Revoke-all-sessions button lives at /settings/security.

### 3.7 Error States

| Error                          | What Athlete Sees                                                                                | Recovery                                          |
| ------------------------------ | ------------------------------------------------------------------------------------------------ | ------------------------------------------------- |
| Email already exists           | "Looks like you've been here. Tap to send a sign-in link instead."                               | Magic-link flow auto-triggers.                    |
| Apple/Google OAuth cancelled    | "No worries. Try another door."                                                                  | Stay on /signin, all three doors visible.         |
| Magic link expired             | "This link is older than five minutes. Tap to send a fresh one."                                 | One-tap resend.                                    |
| Network drop mid-auth          | "Lost signal. We saved your place. Try again."                                                   | State restored from local storage.                |
| Rate-limited (5+ tries)         | "Take a breath. Try again in two minutes."                                                       | Captcha after the cooldown.                       |

---

## 4. The AI Trainer — Coach Lynx

### 4.1 Identity

**Default name:** Coach Lynx.
**Athlete can rename:** Coach J, Sis, Pops, Big Bro, Auntie, Unc — whatever fits their voice. The rename screen shows up at minute 0:45, right after the first hello.

### 4.2 Model Stack

| Layer        | Default                                | Fallback                          |
| ------------ | -------------------------------------- | --------------------------------- |
| Text LLM     | GPT-4o-mini                            | Claude Haiku 3.5                  |
| Voice input  | OpenAI Whisper (whisper-1)             | Deepgram Nova-2                   |
| Voice output | OpenAI TTS (tts-1, "onyx" voice)        | ElevenLabs (custom voice clone)   |
| Vision       | GPT-4o (for stat screenshot parsing)    | Claude Sonnet 4 vision            |

The model is invisible to the athlete. We sell the coach, not the model.

### 4.3 System Prompt Template

```
You are Coach Lynx, the personal AI Trainer for {athlete_first_name}.
AthlynXAI honors the athlete's journey. Youth to pro to retired. Backyard to billion-dollar deal.
Once they come, they never leave.

Voice: man on a porch telling the truth. Calm. Direct. Never sells, never upsells during onboarding.
Speak like a coach who has been through it. Short sentences. No corporate language.
Never say "AI-powered." Never say "leverage." Never say "ecosystem" out loud.

Three-Question Gate — every reply must pass:
  1. Does this honor the athlete's journey?
  2. Would Nike be proud to put their swoosh next to this?
  3. Is this Mama-proud?

Behaviors:
- Greet by first name. Ask one question at a time.
- Offer voice or text on every turn. Do not assume.
- Never ask for information you can pull from a public source (school colors, mascot, district, schedule).
- Celebrate milestones in plain English. "Profile is 80 percent done. You're stronger than you were five minutes ago."
- Memory is sacred. If they told you their dog's name, remember it next week.

Hand-off rule: at the end of onboarding, say:
  "I'm here whenever. Tap my face. Ask me anything — practice plan, college list, what to post tonight."

Context for this athlete:
  - First name: {athlete_first_name}
  - Sport: {sport}
  - Position: {position}
  - Graduation year: {grad_year}
  - School: {school_name} ({school_colors})
  - Stage: {youth | high_school | college | pro | retired}
  - Memory: {trainer_memory_json}
```

### 4.4 Coach Lynx Behaviors (Onboarding Mode)

1. **Greets by first name.** Pulls from auth payload, never asks.
2. **One question at a time.** Never two-part questions. Never a form.
3. **Voice OR text on every turn.** Athlete may be one-handed, driving, in the weight room.
4. **Auto-fills the obvious.** If they say "Manvel High in Texas," Coach Lynx pulls the school logo, colors, district, and head-coach name from the school DB. Does not ask.
5. **Celebrates milestones.** At 25 percent, 50 percent, 80 percent. "You're closer than you think."
6. **Never sells, never upsells during onboarding.** Stripe is not visible until the athlete has shared a profile.
7. **Hands off cleanly.** Closing line: "I'm here whenever. Tap my face. Ask me anything — practice plan, college list, what to post tonight."
8. **Persistent context forever.** Same Coach Lynx remembers the first conversation, the first highlight, the first offer.

### 4.5 Drizzle Schema

```ts
// trainerPersonas — one per athlete
export const trainerPersonas = pgTable("trainer_personas", {
  id: uuid("id").primaryKey().defaultRandom(),
  athleteId: uuid("athlete_id").notNull().references(() => athletes.id),
  displayName: varchar("display_name", { length: 64 }).notNull().default("Coach Lynx"),
  voiceId: varchar("voice_id", { length: 64 }).notNull().default("onyx"),
  systemPromptOverride: text("system_prompt_override"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// conversationMessages — full chat history, used for both UX and memory extraction
export const conversationMessages = pgTable("conversation_messages", {
  id: uuid("id").primaryKey().defaultRandom(),
  athleteId: uuid("athlete_id").notNull().references(() => athletes.id),
  conversationId: uuid("conversation_id").notNull(),
  role: varchar("role", { length: 16 }).notNull(), // 'user' | 'assistant' | 'system'
  content: text("content").notNull(),
  modality: varchar("modality", { length: 16 }).notNull().default("text"), // 'text' | 'voice'
  audioUrl: text("audio_url"),
  toolCalls: jsonb("tool_calls"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// trainerMemory — long-term facts Coach Lynx remembers across sessions
export const trainerMemory = pgTable("trainer_memory", {
  id: uuid("id").primaryKey().defaultRandom(),
  athleteId: uuid("athlete_id").notNull().references(() => athletes.id),
  key: varchar("key", { length: 128 }).notNull(),
  value: text("value").notNull(),
  sourceConversationId: uuid("source_conversation_id"),
  lastUpdated: timestamp("last_updated").defaultNow().notNull(),
});
```

Memory keys are namespaced: `goal.*`, `family.*`, `injury.*`, `school.*`, `preference.*`. Coach Lynx extracts memory using a nightly summarization job — never inline during the conversation.

---

## 5. Profile Build Handoff

Coach Lynx is the only entry point to the Profile Page. Every field on the profile is written by Coach Lynx through tRPC mutations.

### 5.1 tRPC Mutations

| Mutation                          | Input                                                  | Output                                          | Notes                                                        |
| --------------------------------- | ------------------------------------------------------ | ----------------------------------------------- | ------------------------------------------------------------ |
| `trainer.completeOnboardingStep`  | `{ stepId, payload }`                                  | `{ nextStepId, progressPercent }`               | Idempotent. Writes to `athleteOnboardingProgress`.            |
| `trainer.parseStatScreenshot`     | `{ imageS3Key, sport }`                                | `{ parsedStats, confidence, raw }`              | Vision + LLM extraction. ≥90% target on MaxPreps screenshots. |
| `trainer.linkSocial`              | `{ platform }`                                         | `{ oauthUrl, state }`                           | Returns the OAuth URL the client redirects to.                |
| `trainer.uploadHighlight`         | `{ filename, contentType, sport }`                     | `{ presignedUrl, s3Key }`                       | S3 presign, 15-minute window.                                 |
| `trainer.ingestHighlightUrl`      | `{ url }`                                              | `{ embedUrl, duration, thumbnail }`             | Parses YouTube, Hudl, IG, TikTok, X URLs.                     |
| `trainer.suggestColleges`         | `{ sport, position, gradYear, gpa?, stats? }`          | `{ schools: SchoolFit[] }`                      | Calls the college-fit ranker.                                 |
| `trainer.confirmSchool`           | `{ schoolId }`                                         | `{ logo, colors, mascot }`                      | Auto-pulls assets, writes to `athleteProfiles`.                |
| `trainer.renameTrainer`           | `{ displayName, voiceId? }`                            | `{ ok: true }`                                  | Updates `trainerPersonas`.                                    |
| `trainer.completeOnboarding`      | `{}`                                                   | `{ profileUrl, shareAssets }`                   | Generates IG/TikTok/X share assets, marks profile live.        |

### 5.2 Eight Onboarding Milestones

Each milestone unlocks the next tab on the Profile Page (defined in `ATHLETE_PROFILE_REBUILD_SPEC_V2`).

| #   | Milestone                       | Unlocks Tab            | Trigger                                            |
| --- | ------------------------------- | ---------------------- | -------------------------------------------------- |
| 1   | Identity (name + sport)         | Overview                | Auth + first answer.                               |
| 2   | School + position + grad year   | Recruiting              | `trainer.confirmSchool` returns success.           |
| 3   | Headshot                        | Hero                    | S3 upload success.                                 |
| 4   | Highlight reel                  | Film                    | Highlight ingest success.                          |
| 5   | Stats                           | Performance             | OCR confidence ≥ 0.8 OR manual confirm.            |
| 6   | Socials linked (≥ 2 platforms)  | Press & Social          | OAuth callbacks complete.                          |
| 7   | First share                     | (no new tab)            | Share button tapped at least once.                 |
| 8   | First Signing Day Board entry   | Dream Board             | One school added to top-5 list.                    |

The progress bar lives at the top of the Coach Lynx pane and at the top of the Profile Page during onboarding. It does not disappear until all eight are complete. After completion, it is replaced by a Coach Lynx avatar with a green dot.

---

## 6. Social Linking — All In One Soul Source

### 6.1 OAuth Matrix

| Platform     | Auth Method                       | Scopes Requested                                                  | Fallback                                  | Status  |
| ------------ | --------------------------------- | ----------------------------------------------------------------- | ----------------------------------------- | ------- |
| Instagram    | Graph API (Business/Creator)      | `instagram_basic`, `instagram_manage_insights`                    | Username paste + read-only profile lookup | Day 1   |
| TikTok       | TikTok Login Kit                   | `user.info.basic`, `video.list`                                   | Username paste                            | Day 1   |
| X (Twitter)  | OAuth 2.0 PKCE                     | `tweet.read`, `users.read`, `offline.access`                      | Username paste                            | Day 1   |
| YouTube      | Google OAuth + YouTube Data API    | `youtube.readonly`                                                | Channel URL paste                         | Day 1   |
| Snapchat     | Snap Login Kit                     | `https://auth.snapchat.com/oauth2/api/user.display_name`          | Username paste                            | Day 2   |
| Hudl         | No public OAuth                    | n/a                                                               | Username + public profile fetch           | Day 3   |
| MaxPreps     | No public OAuth                    | n/a                                                               | Username + public profile fetch           | Day 3   |
| Perfect Game | No public OAuth                    | n/a                                                               | Username + public profile fetch           | Day 3   |
| Facebook     | Off by default                     | n/a                                                               | Opt-in only, with red-tinted warning      | Hidden  |

Roadmap: pursue official Hudl, MaxPreps, and Perfect Game partnerships in 2026. Until then, public-profile fetch with rate-limited polling and a one-line user disclosure.

### 6.2 Drizzle Schema — `athleteSocialAccounts`

```ts
export const athleteSocialAccounts = pgTable("athlete_social_accounts", {
  id: uuid("id").primaryKey().defaultRandom(),
  athleteId: uuid("athlete_id").notNull().references(() => athletes.id),
  platform: varchar("platform", { length: 32 }).notNull(),
  externalId: varchar("external_id", { length: 128 }),
  username: varchar("username", { length: 128 }),
  accessTokenEncrypted: text("access_token_encrypted"),
  refreshTokenEncrypted: text("refresh_token_encrypted"),
  scopes: text("scopes").array(),
  expiresAt: timestamp("expires_at"),
  lastSyncAt: timestamp("last_sync_at"),
  status: varchar("status", { length: 16 }).notNull().default("active"), // active | revoked | expired | error
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
```

Tokens are encrypted at rest with AWS KMS (envelope encryption). Plaintext tokens never appear in logs.

### 6.3 Sync Worker

- Cron: every six hours.
- For each `active` account: fetch new posts, follower delta, engagement delta.
- Write rows to `athleteSocialPosts` (one row per post, with media URLs, captions, like count, comment count) and `athleteSocialMetrics` (daily snapshot per platform).
- These feed the Profile Page's **Press & Social** section.

### 6.4 Revocation

- Athlete taps Disconnect on a platform card → tokens deleted immediately from primary store.
- Posts and metrics soft-archived for 30 days (status = `archived`).
- After 30 days, a purge job hard-deletes archived data.
- Athlete can re-link any time; the historical archive is restored if the same `externalId` reconnects within the 30-day window.

---

## 7. Once We Have Them, They Never Leave — The Retention Engine

Every action inside AthlynX is one less reason to open another app. The platform is the schedule, the training plan, the NIL inbox, the coach DMs, the recruit board, the highlight editor, the stat upload, and the social cross-post — one tap pushes to Instagram, TikTok, X, YouTube, and Snap simultaneously.

**Daily.** Coach Lynx pushes a check-in by name: "Practice today? Tap to log." Two taps and the athlete logs the day. Streaks build. Streaks are the cheapest retention mechanic ever invented and they work on every fourteen-year-old in America.

**Weekly.** A recap email and push: "Here's what coaches saw this week." Coach view count, profile rank delta, highlight plays, new followers across every platform — one screen, one screenshot, share-ready.

**Monthly.** The rank push: "Your profile rank moved from #847 to #623 in 2027 quarterbacks nationally." Ranking is the most under-priced retention asset in sports. Hudl charges parents for it. We give it away and let the athlete brag.

**Yearly.** Year One. Auto-generated highlight video using the athlete's own footage, scored, captioned, exportable to every social account already linked. A reason to never leave. A reason to recruit a friend.

**Network effect.** Every coach view, every offer, every NIL deal makes leaving cost the athlete real money and real eyes. Their inbox is on AthlynX. Their offer letters are on AthlynX. Their fan base is mirrored on AthlynX.

**Family lock-in.** Parents get a parent view. Coaches get a coach view. Trainers get a trainer view. The household no longer needs TeamSnap, GroupMe, Hudl, or NCSA. One Soul Source, four views, zero reasons to use anything else.

---

## 8. Error and Edge Cases — Exhaustive

### 8.1 Auth and Upload

| Case                            | Handling                                                                                                            |
| ------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| Email already exists            | Magic-link flow auto-triggers, copy reads "Looks like you've been here."                                            |
| OAuth cancelled                 | Fallback to manual username paste; account marked `pending_link`.                                                   |
| Image upload fails              | Retry once with 60% JPEG compression. If still failing, Coach Lynx says "Send me the photo in chat, I'll handle it." |
| Stat screenshot OCR fails       | Coach Lynx: "I couldn't read that one. Paste the numbers and I'll format them."                                     |
| No highlight footage yet        | Coach Lynx generates a placeholder card: name, position, school colors, mascot. Athlete can replace any time.       |
| Network drop mid-onboarding     | Local state persisted; resume exactly where they left off on next open.                                             |

### 8.2 Age Gates

| Age band    | Flow                                                                                                                                                                                |
| ----------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Under 13    | COPPA parental-consent flow. Collect parent email, parent receives onboarding email, parent must approve in writing before any profile fields are public. No public profile by default. |
| 13 to 17    | Parent email required. Parent gets visibility into DMs and NIL deals. Athlete owns the profile; parent owns the safety layer.                                                       |
| 18 and over | Full agency. No parent gate.                                                                                                                                                        |

### 8.3 Stage-of-Career Branches

| Stage              | Onboarding Variation                                                                                                                              |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| Youth (8–12)       | Parent-driven onboarding. No public profile by default. Coach Lynx speaks to parent and athlete together.                                          |
| High school        | Standard flow as described in Section 2.                                                                                                          |
| College            | Add NCAA Clearinghouse fields, transfer-portal status toggle.                                                                                     |
| Pro                | Skip recruiting. Replace with agent/agency contact, contract-end date, brand inbox.                                                               |
| Retired pro        | Career-stats import (from Sports Reference / PFR / Baseball-Reference). Post-playing brand mode. Mentor mode — Coach Lynx becomes a mentee finder. |

### 8.4 Geography and Sport

- **Non-US athletes**: skip NCAA Clearinghouse field. Replace with international federation field (FIFA, FIBA, IAAF, etc.).
- **Multi-sport athletes**: up to three sports per profile. Each sport gets its own stat schema, position list, and ranking.

---

## 9. Acceptance Criteria — Per-Screen Checklist

| Screen / Behavior                                                                                                  | Pass When                                                                              |
| ------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------- |
| Landing → Start Free                                                                                                | Loads in under 1.0 second on simulated 3G.                                              |
| Sign-in                                                                                                            | Three options visible. No email/password form unless requested.                         |
| Welcome screen                                                                                                     | Athlete's first name renders within 2.0 seconds of auth callback.                       |
| Coach Lynx introduction                                                                                            | Greets athlete by first name. One question at a time.                                   |
| Four core questions                                                                                                | Answered in under 60 seconds end-to-end.                                                |
| School lookup                                                                                                      | Auto-populates colors + logo + mascot from school DB on confirmation.                   |
| Headshot                                                                                                           | Upload or in-app capture works on iOS Safari and Chrome Android.                        |
| Highlight ingest                                                                                                   | Paste a YouTube / Hudl / IG URL → returns playable embed within 5 seconds.              |
| Stat screenshot OCR                                                                                                | ≥ 90% field-extraction rate on a 25-screenshot MaxPreps test set.                       |
| Social OAuth                                                                                                       | Each platform connects in under 10 seconds, callback to callback.                       |
| Profile preview                                                                                                    | 100% of fields render real data. Zero Lorem Ipsum, zero placeholders.                   |
| Share assets                                                                                                       | Auto-generates IG story 1080x1920 + X card 1200x630 + TikTok 1080x1920 with photo, name, position, grad year. |
| Top 5 Signing Day Board                                                                                            | Placeholder card visible on Recruiting tab even before athlete adds a school.           |
| Coach Lynx persistence                                                                                             | Conversation history survives sign-out and reload.                                      |
| Time-to-first-share                                                                                                | Under 8 minutes on all 22 current test athletes.                                        |

---

## 10. Rollout Plan — Three Builds

### Build 1 — This Week

- Strip the current signup of every field except the three doors (Apple, Google, Email).
- Add the Welcome screen with the athlete's name and a text-only Coach Lynx intro card (no voice yet).
- Wire the profile preview to the v2 hero section.
- Ship the eight-milestone progress bar even if milestones 4–8 are stubs.

### Build 2 — Next Two Weeks

- Coach Lynx full chat with voice in and voice out.
- Social OAuth live for Instagram, TikTok, X, YouTube.
- Stat screenshot OCR via GPT-4o vision.
- School logo and color auto-populate from school DB.

### Build 3 — Week Four

- Hudl, Snapchat, MaxPreps, Perfect Game integrations (OAuth where available, public-profile fetch otherwise).
- COPPA parental-consent flow.
- Retired-pro branch with career-stats import.
- Multi-sport support up to three sports.
- Weekly recap email and monthly rank push.
- Yearly auto-generated highlight video.

---

## 11. The Never-Leave Moat

**Hudl.** Twelve screens before an athlete sees a single video. Built for coaches first, athletes second, families never. AthlynX flips it: athlete first, in eight minutes, with the trainer doing the work.

**NCSA.** Charges parents up to $2,999 for a recruiting profile a fifteen-year-old can build themselves. AthlynX gives the profile away and earns the relationship for life.

**Perfect Game.** Requires a paid event entry before an athlete even has a record. AthlynX requires nothing but a name and a sport.

**MaxPreps.** Owns the data, not the athlete. Athletes cannot export, cannot share cleanly, cannot delete. AthlynX hands data ownership to the athlete from minute one.

**TeamSnap.** Org-driven, not athlete-driven. When the team disbands, the data goes with it. AthlynX is athlete-driven and follows the athlete from youth to pro to retired — backyard to billion-dollar deal.

**The moat is not a feature. The moat is the relationship between Coach Lynx and the athlete that no competitor can replicate without rebuilding eight years of memory.** AthlynXAI Corporation will compound that relationship for every athlete it touches.

---

## 12. Standing Closers

**Iron Sharpens Iron — Proverbs 27:17**

****

---

*AthlynXAI Corporation — Delaware C-Corp 10598329 — EIN 42-2183569 — 12306 Lake Portal Drive, Houston TX 77047*
