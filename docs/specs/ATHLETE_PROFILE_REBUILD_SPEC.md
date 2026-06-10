# AthlynXAI — Athlete Profile Rebuild Spec
**Product:** Layer 1 — Identity  
**Status:** Spec v1.0 — Delivered to Chad A. Dozier Sr.  
**Date:** May 2026  
**Prepared by:** AthlynXAI Product  
**Codebase target:** `/client/src/pages/Profile.tsx` · `/client/src/pages/AthletePublicProfile.tsx` · `/client/src/components/AthleteProfileCard.tsx` · `/mobile/app/(tabs)/profile.tsx`

---

## Section 1 — Brand North Star

The founding manifesto says it once, and it says it clearly:

> **AthlynXAI honors the athlete's journey. From youth to pro to retired. From backyard to billion-dollar deal. Once they come, they never leave.**

That is the only sentence this product answers to.

The athlete profile is not a feature. It is the journey honored on a page.

It is not a dashboard. It is not a resume. It is not a widget that ships in a sprint and gets forgotten. It is the first thing a scout sees at midnight. It is the page a parent bookmarks the night her son gets his first offer. It is the thing a retired pro looks at and feels — not reads, *feels* — twenty years of work condensed into something that finally says: *it happened, it was real, it mattered.*

Nike does not sell shoes. Nike honors athletes. AthlynXAI does not build profiles. AthlynXAI honors the journey. Every pixel on this page must be in service of that.

### The Three-Question Gate

Before any version of this profile ships — Build 1, Build 2, Build 3, or any hotfix — the team asks three questions:

1. **Does it honor the journey?** Not "is it functional." Does it honor it. If the answer is anything less than yes, it does not ship.
2. **Would Nike be proud of it?** If it could run as a competitor's product, it is not AthlynXAI. If it reads like a SaaS dashboard, it is not AthlynXAI.
3. **Would Mama recognize her son in it?** This is the final gate. The mother in the bleachers, the father on the road at 5 a.m. — would they look at this page and see their kid? If not, start over.

### What this page is NOT

- A feature checklist  
- An AI showcase  
- A recruiting form  
- A social media clone  
- A stats dump  

It is a story. The stats are just the evidence.

### Acceptance Criterion — Section 1

The brand north star is readable in 30 seconds by any new engineer. Any team member can recite the three-question gate without notes. No design decision proceeds without passing all three gates.

---

## Section 2 — The User

Three people look at this page. They need three completely different things. The design must serve all three simultaneously without compromising any one.

---

### Persona 1 — The Athlete (themselves)

**Who they are:** Youth player, high schooler, college player, pro, retired. Any sport, any level. They built this journey one rep at a time.

**What they need:**
- Pride. This page must make them feel seen.
- Identity. Their name, their sport, their story — rendered like they matter. Because they do.
- Control. They decide what the world sees. Their GPA, their injuries, their offers — their call.
- Growth. The page must show where they started and where they are going, not just where they stand today.

**Jobs to be done:**
- "I want to share this page and feel proud of what it shows."
- "I want to update my highlight reel and have it look professional without a marketing team."
- "I want coaches and scouts to find me. I want to control what they see."
- "I want to see my own growth arc — this year vs. last year, this season vs. freshman year."
- "I want to manage my NIL deals and have a paper trail that is mine, not sitting in some brand's inbox."
- "I want one link in my bio that says everything I need to say."

---

### Persona 2 — The Coach / Scout / Recruiter

**Who they are:** High school coach evaluating their own players. College scout pulling film at midnight. Pro scout on a regional assignment. NIL agent browsing a class. Recruiter comparing two quarterbacks.

**What they need:**
- Verified data, not self-reported noise.
- Side-by-side comparison without leaving the page.
- Decision support — percentile rings, cohort benchmarks, trend lines.
- Fast. They are looking at 40 profiles a night. The signal must surface in 10 seconds.

**Jobs to be done:**
- "I need to know if this athlete's 40 time is real or exaggerated within 10 seconds of opening the page."
- "I want to see this player's stats vs. their cohort, not raw numbers I have to interpret myself."
- "I want to contact the athlete's coach or parent directly, with one click, from this page."
- "I want to see every camp and showcase this athlete has attended, verified, not self-reported."
- "I want to pull a comparable player and run a side-by-side radar."
- "I want to set a recruiting alert and get notified when this athlete commits or transfers."

---

### Persona 3 — The Parent / Fan / Brand

**Who they are:** Mom. Dad. Little sibling who tells their friends. Local journalist. Brand manager at a mid-size company looking for a regional ambassador. Boosters. Alums. The people who believe before the world does.

**What they need:**
- Story, not stats. They want to feel something.
- Journey, not snapshot. Show where he came from.
- Highlights that load fast and look great.
- Trust. They need to know this platform is real and the athlete they are looking at is verified.

**Jobs to be done:**
- "I want to share this profile link with everyone I know and have it look like it belongs on ESPN."
- "I want to watch the highlight reel right here, no third-party redirect."
- "I want to see the full journey — first sport, first award, first offer — not just this season."
- "I want to contact the athlete about a sponsorship opportunity without going through three gatekeepers."
- "I want to know if this athlete is verified. Real achievements, real numbers."

---

### Acceptance Criterion — Section 2

A new engineer can read these three personas and immediately identify which UI component serves which user. Product decisions trace back to one of the three personas. Any feature not serving at least one persona is cut.

---

## Section 3 — Information Architecture

The profile supports every level: youth, high school, college, pro, retired. Sections that do not apply to a level are hidden, not disabled. A youth athlete does not see an empty NIL portfolio; the section does not exist on their page until it is activated.

The page reads top to bottom. The story builds as you scroll.

---

### 3.1 Identity Hero (above the fold — the most important real estate on the platform)

**What it is:** Full-bleed cover image, athlete photo, name, sport badge, position, school/team, class year, height/weight, dominant hand/foot, verified badge, NIL-open indicator.

**Required fields:**
- `name` (from `users.name`)
- `sport` (from `athleteProfiles.sport`)
- `position` (from `athleteProfiles.position`)
- `school` / `team` (from `athleteProfiles.school`)
- `avatarUrl` (from `users.avatarUrl`)
- `coverUrl` (from `athleteProfiles.coverUrl`)

**Optional fields:**
- `classYear` — maps to "Class of 2026" or "2026 Draft" for pros
- `height`, `weight` (existing fields in schema)
- `dominantHand` / `dominantFoot` — new field needed, sport-contextual
- `nilOpenStatus` — boolean, "OPEN TO NIL" badge if true
- `careerLevel` — enum: `youth | hs | college | pro | retired` — controls which sections render

**Visibility controls:**
- `name`, `sport`, `position`, `school` — always public
- `height`, `weight` — public by default, athlete can set private
- `classYear` — public
- `nilOpenStatus` — athlete-controlled, public or hidden
- `careerLevel` — always public

**Data sources:** `athleteProfiles` table, `users` table (already exists in `profileRouter.ts`)

**Layer Cake touch:** Layer 1 (Identity)

**Current state:** `AthletePublicProfile.tsx` has a hero section with cover, avatar, name, sport badge, position, school, and X-Factor ring. `AthleteProfileCard.tsx` has sport-color gradient system (13 sports defined). Both need restyle to the new design system. Height/weight render. Dominant hand/foot field does not exist yet.

**Acceptance Criterion:** Identity hero renders above the fold on a 375px iPhone with no scroll. All required fields present. Cover image has lazy-load fallback. Verified badge renders from `verifications` table (Build 3). NIL-open badge renders when athlete enables it.

---

### 3.2 The Journey Ribbon

**What it is:** A horizontal, scrollable timeline running from the athlete's first sport to today. Milestones: first organized sport, first varsity start, first all-conference selection, first college offer, first official visit, commitment date, signing date, first NIL deal, first pro contract, first All-Star/All-Pro, retirement, coaching/mentorship post-career.

**Required fields (new table — `journey_events`):**
- `id`, `athleteId`, `eventType` (enum: see below), `eventDate`, `title`, `description`, `isVerified`, `verificationSource`, `isPublic`

**`eventType` enum:**
`first_sport | first_award | varsity_start | all_conference | college_offer | official_visit | commitment | signing | nil_deal | pro_contract | all_star | injury_return | retirement | milestone`

**Optional fields:**
- `mediaUrl` — photo or video attached to milestone
- `linkedEntityId` — links to a school, brand, or league record

**Visibility controls:** Athlete controls per-event visibility. Committed/signed status defaults to public after athlete confirms. Injury events default to private.

**Data sources:** Self-reported (badged as such) + recruiting API integrations (Build 3)

**Layer Cake touch:** Layer 1 (Identity), Layer 6 (Calendar data can seed events)

**Current state:** Not built. No `journey_events` table exists. The timeline concept is referenced in the Layer Cake Vision but has no implementation.

**Acceptance Criterion:** Ribbon renders at least 3 events for any athlete with data. Horizontal scroll works on mobile. Empty state renders a prompt: "Add your first milestone." Timeline items have a verified/self-reported badge. At least 5 event types are supported at Build 2 launch.

---

### 3.3 Stats Tile Grid

**What it is:** Sport-specific stat tiles. Each tile shows: label, current value, delta vs. last season, and a 6-point sparkline. Grid is sortable by season. Each stat has a percentile ring showing rank vs. cohort (same sport, same level, same class year).

**Required fields:**
- `sportStats` (existing JSONB field in `athleteProfiles`) — already has per-sport metric keys in `AthletePublicProfile.tsx`
- `seasonYear` — needed for YoY deltas; currently missing per-season history
- `cohortPercentiles` — computed field, not stored raw

**New table needed — `athlete_season_stats`:**
- `id`, `athleteId`, `sport`, `season`, `stats` (JSONB), `source`, `isVerified`

**Optional fields:**
- `splits` — home/away, vs. ranked opponents, situational (Build 2)
- `advancedMetrics` — sport-specific computed metrics (Build 2)

**Visibility controls:** All stats public by default. Athlete can hide individual stats (medical/injury-adjacent stats default hidden).

**Data sources:**
- High school: MaxPreps API (Build 3)
- College: conference APIs, ESPN (Build 3)
- Pro: league APIs (Build 3)
- Self-reported: manually entered, badged "Self-reported" until verified

**Layer Cake touch:** Layer 1 (Identity), Layer 8 (AI can compute advanced metrics on top of raw stats)

**Current state:** `SPORT_METRICS` object in `AthletePublicProfile.tsx` defines 6 metrics per sport (Football, Basketball, Baseball, Soccer, default). `sportStats` JSONB field exists in `athleteProfiles`. Metric bars render. Percentile rings not yet implemented. Per-season history does not exist.

**Acceptance Criterion:** Tile grid renders for Football, Basketball, Baseball, Soccer, and default. Percentile rings render when cohort data is available, placeholder (gray ring, "—") when not. Sparkline renders when 2+ seasons of data exist. Season filter dropdown works. Delta indicator shows positive trend (green), negative trend (red), flat (white).

---

### 3.4 Advanced Analytics

**What it is:** Deeper data layer. Year-over-year trend charts (line), splits (situational performance breakdowns), and sport-specific advanced metrics (Exit Velocity trend for baseball, 40-time progression for football, etc.). Collapsed by default; expands on tap. Only shown when at least 2 seasons of data exist.

**Required fields:** Sourced from `athlete_season_stats` table (Section 3.3)

**Optional fields:**
- `splits` JSONB — home/away, conference vs. non-conference, post-season
- `advancedMetrics` JSONB — xBA, wOBA for baseball; DVOA, PFF grade for football; per-36 for basketball

**Visibility controls:** Public by default; athlete can collapse to coach-only or private

**Data sources:** Same as 3.3. Advanced metrics computed by Layer 8 AI where not available via integration.

**Layer Cake touch:** Layer 1, Layer 8 (AI computation), Layer 2 (stats can seed public feed posts)

**Current state:** `EPXDial` component exists in `AthletePublicProfile.tsx` (animated SVG dial). `XFactorRing` component exists (animated SVG ring with 4-tier label: PROSPECT / MID MAJOR / HIGH MAJOR / ELITE). These are the foundation. YoY charts and splits do not exist yet.

**Acceptance Criterion:** Advanced analytics section renders when `athlete_season_stats` has 2+ season rows. Section is collapsed by default on mobile. Minimum viable content at Build 2: YoY line chart for 2 primary stats and one splits breakdown where data exists.

---

### 3.5 Comparison Radar

**What it is:** Head-to-head radar chart, 4–6 axes, comparing this athlete against another athlete in the same cohort. Scout/recruiter-facing. Athlete can initiate a comparison from their own profile for self-analysis.

**Required fields:** Two athlete records from `athleteProfiles` + `athlete_season_stats`

**Optional fields:**
- `comparisonLocked` — athlete can prevent their profile from being compared (reduces discoverability, not recommended)

**Visibility controls:** Radar is public. The "compare with me" feature is public.

**Data sources:** Drawn from same stat sources as Sections 3.3 and 3.4. Comparable player AI suggestion from `COMPARABLES` data (already in `AthletePublicProfile.tsx`), expandable to real platform users.

**Layer Cake touch:** Layer 1, Layer 8 (AI comparable player suggestion)

**Current state:** `COMPARABLES` object in `AthletePublicProfile.tsx` has pro comparables per sport. No radar chart component exists yet. The comparable player display card (name, team, score) exists in the UI. The actual radar visualization is missing.

**Acceptance Criterion:** Radar renders with 4+ axes when any two athletes in the same sport are selected. Axis labels are sport-specific (not generic). Radar is readable at 320px mobile width. AI comparable suggestion renders with match score.

---

### 3.6 Highlight Reel

**What it is:** Embedded video player (16:9). Supports single highlight video and multi-chapter reel. Chapter markers allow viewers to jump to specific plays (first touchdown, first slam, etc.). Athlete uploads via `VideoUploadHub` (already built). Film room view for full-game tape.

**Required fields (new table — `highlight_videos`):**
- `id`, `athleteId`, `title`, `videoUrl`, `thumbnailUrl`, `duration`, `isPublic`, `isPrimary`, `uploadedAt`

**Chapter markers (nested):**
- `id`, `videoId`, `label`, `timestampSeconds`, `description`

**Optional fields:**
- `filmRoomEnabled` (existing field in `athleteProfiles`) — unlocks full film tab
- `recruitingVideos` JSONB (existing field) — already stores recruiting video links

**Visibility controls:**
- Primary highlight reel: public by default
- Film room / full game tape: coach-only or scout-only (athlete-controlled)
- Individual chapters: inherit parent video visibility

**Data sources:** Athlete upload via `VideoUploadHub`. Auto-generated highlight reel from full film is a Layer 8 AI feature (not Build 1 or 2 scope).

**Layer Cake touch:** Layer 1 (Identity), Layer 8 (AI auto-highlight generation)

**Current state:** `VideoUploadHub` component exists. `highlightUrl` field exists in `athleteProfiles`. `filmRoomEnabled` boolean exists. `recruitingVideos` JSONB exists. A video tab is referenced in `AthletePublicProfile.tsx`. The `highlight_videos` table with chapter markers does not exist yet.

**Acceptance Criterion:** Primary highlight video plays inline (no redirect). Thumbnail loads before video. Chapter markers render in a time-coded list below the player. Mobile player fills full width with native controls. Empty state: "Add your highlight reel — scouts are watching."

---

### 3.7 Camps & Showcases

**What it is:** Calendar-driven list of every camp, showcase, combine, or event the athlete has attended or is registered for. Verified attendance is badged. Future events show a countdown. Past events link to any recorded results (times, scores, rankings from that event).

**Required fields (new table — `camps_attended`):**
- `id`, `athleteId`, `eventName`, `eventDate`, `location`, `organizer`, `isVerified`, `verificationSource`, `resultSummary`, `isPublic`

**Optional fields:**
- `rankingAtEvent` — where athlete placed or ranked
- `calendarEventId` — links to Layer 6 Calendar entry

**Visibility controls:** Public by default. Athlete can hide specific events.

**Data sources:** Self-reported + Calendar layer (Layer 6) feeds confirmed attendance. Organizer verification is Build 3.

**Layer Cake touch:** Layer 1, Layer 6 (Calendar)

**Current state:** `AthleteCalendar.tsx` exists (Layer 6 scaffold). No `camps_attended` table. No rendering of camps on the profile page yet.

**Acceptance Criterion:** List renders with event name, date, location, and verified/self-reported badge. Future events show countdown in days. Empty state: "No camps or showcases logged yet." Verified events have a distinct visual treatment vs. self-reported.

---

### 3.8 NIL Portfolio

**What it is:** Athlete's record of brand partnerships, deal values (athlete-controlled visibility), active and completed deals. Feeds from Layer 4 (NIL Public Feed) and Layer 5 (NIL Deal Room). Total estimated NIL value displayed as a headline number.

**Required fields (new table — `nil_deals`):**
- `id`, `athleteId`, `brandName`, `brandLogoUrl`, `dealType` (enum: `ambassador | post | appearance | licensing | equity`), `dealValue`, `dealValueVisible`, `startDate`, `endDate`, `isVerified`, `verificationSource`, `isPublic`

**Optional fields:**
- `stripePaymentId` — links to Stripe receipt for verified deals
- `contractFileId` — links to signed contract (gated)

**Visibility controls:**
- Deal existence: athlete-controlled (public or private)
- Deal value: athlete-controlled separately from deal existence
- Brand logo: public if deal is public
- Contract: private, lawyer-only access

**Data sources:** Self-reported (unverified) + Stripe Connect receipt (verified) + brand confirmation (Build 3)

**Layer Cake touch:** Layer 1 (Identity), Layer 4 (NIL Public Feed), Layer 5 (NIL Deal Room), Layer 7 (Agent/Advisor visible in full)

**Current state:** `nilValue` field exists in `athleteProfiles` as a computed integer. `nilVerified` boolean exists. NIL Portal page exists (Layer 4 scaffold). The `nil_deals` table with per-deal tracking does not exist yet. NIL display in `AthleteProfileCard.tsx` shows aggregate value only.

**Acceptance Criterion:** Portfolio renders as a brand-logo grid with deal type labels. Total NIL value headline updates when deals are added. Hidden deals do not leak count or value. Verified deals have a Stripe/brand badge. Unverified deals are badged "Self-reported."

---

### 3.9 Recruiting Timeline

**What it is:** Chronological record of every offer, official visit, unofficial visit, and commitment. Athlete-controlled visibility per entry. Integrates with 247Sports/On3/Rivals data where available (Build 3).

**Required fields:** Sourced from `journey_events` table (Section 3.2), filtered to event types: `college_offer | official_visit | commitment | signing`

**Optional fields:**
- `offerSchool`, `offerDate`, `offerLevel` (D1/D2/D3/NAIA/JUCO/Pro) — per event
- `recruitingScore` (existing field in `athleteProfiles`) — headline composite score

**Visibility controls:**
- Offers: athlete-controlled. Default: private until athlete chooses to make public.
- Visits: private by default.
- Commitment: public upon athlete confirmation.
- Signed: public.

**Data sources:** Self-reported + 247Sports/On3/Rivals API (Build 3). College database already exists in `AthletePublicProfile.tsx` (D1 through JUCO, 40+ schools).

**Layer Cake touch:** Layer 1, Layer 8 (AI can suggest schools based on stats + recruiting score)

**Current state:** `recruitingStatus` enum exists (`available | committed | signed | transferred`). `collegesInterested` JSONB field exists. `recruitingScore` field exists and renders in `AthleteProfileCard.tsx`. Offer-by-offer history does not exist.

**Acceptance Criterion:** Timeline renders offers in reverse chronological order. Visibility badge on each entry (Public / Coach-only / Private). Commitment entry renders prominently — larger card, school logo, date. Signed entry renders with a celebration treatment.

---

### 3.10 Academic & Character

**What it is:** GPA range (not exact GPA, to protect privacy — "3.5–4.0"), leadership roles, community service hours, awards. Athlete-controlled. Coaches and scouts can see what the athlete chooses to show.

**Required fields:** `gpa` (existing, rendered as range band), self-reported character fields

**Optional fields (new fields on `athleteProfiles` or separate table):**
- `leadershipRoles` — text list
- `communityServiceHours` — integer
- `characterAwards` — text list
- `academicHonors` — text list

**Visibility controls:** Entire section is athlete-controlled. Default: public. GPA rendered as range band (3.5–4.0), never exact.

**Data sources:** Self-reported only. School verification is a future integration.

**Layer Cake touch:** Layer 1 only

**Current state:** `gpa` field exists (exact float). Renders in `AthleteProfileCard.tsx`. No leadership or character fields exist. Range-band rendering not yet implemented.

**Acceptance Criterion:** GPA displays as range band, not exact. Character section visible only if athlete has added at least one item. Empty state does not show section at all. Section has a "This is self-reported" disclosure.

---

### 3.11 Press & Social

**What it is:** Verified articles mentioning the athlete, social handles, follower counts, and a cross-platform social media summary tile. Links out to external profiles but keeps the viewer on AthlynXAI as long as possible.

**Required fields:**
- `instagram`, `twitter`, `tiktokHandle`, `facebookUrl`, `youtubeUrl`, `linkedinUrl` (all existing in `athleteProfiles`)
- `followers` (existing)

**Optional fields:**
- `pressArticles` — array of {url, headline, publication, date} — new field or table
- `spotifyUrl`, `capcutUrl` (existing)

**Visibility controls:** Social handles: public. Follower count: public. Press: public.

**Data sources:** Self-reported handles. Follower counts pulled via social API where athlete has authorized (Build 3). Press links self-reported or AI-discovered.

**Layer Cake touch:** Layer 1, Layer 2 (Public Feed), Layer 9 (Syndication)

**Current state:** All social URL fields exist in `athleteProfiles` and `profileRouter.ts`. Follower count field exists. Press articles not yet tracked.

**Acceptance Criterion:** Social icons render for each platform with a handle present. Follower count renders with comma formatting. Press section renders if at least one article URL is added. Empty press section does not render the heading.

---

### 3.12 Trusted Circle

**What it is:** Gated panel showing the athlete's professional support network — coaches, agent, scout contacts, lawyer, financial advisor, trainer, family/guardian. Visible only to credentialed users per the athlete's permission settings. Not shown on the public-facing profile.

**Required fields (new table — `trusted_circle`):**
- `id`, `athleteId`, `memberId` (links to user), `role` (enum: `coach | agent | scout | lawyer | financial_advisor | trainer | family`), `isActive`, `canViewProfile`, `canViewNIL`, `canViewRecruiting`, `canViewAcademic`

**Optional fields:**
- `customTitle` — "Head Coach" vs. just "Coach"
- `notes` — private notes visible only to athlete

**Visibility controls:** The entire panel is gated. No public visibility. Each trusted circle member sees only the sections the athlete has granted them access to.

**Data sources:** Athlete adds/removes members. Role verification is Build 3.

**Layer Cake touch:** Layer 7 (The Stack)

**Current state:** `Profile.tsx` has tabs structure that references coaches, advisors. The `trusted_circle` table does not exist. No unified "My Team" panel is implemented.

**Acceptance Criterion:** Trusted Circle panel is absent from the public-facing `/athlete/:id` route. In the private `/profile` route, athlete can add/remove members and assign roles. Members receive an in-platform notification when added. Role icons render from Lucide library.

---

### 3.13 The Stack Cross-Link (Layer 7)

**What it is:** A pinned, persistent panel on the private profile view linking to the athlete's Layer 7 resources: AthlynX Legal Hub, AthlynX Financial, AthlynX Mental Health, AI Trainer. For public profiles: a simplified "Get Support" CTA that routes to the appropriate resource.

**Required fields:** None new — cross-links to existing platform sections

**Visibility controls:** Full Stack panel: gated (private view only). "Get Support" CTA: public.

**Layer Cake touch:** Layer 7 (The Stack), Layer 8 (AI Trainer already shipping)

**Current state:** AI Trainer tab (`AITrainerTab`) and Claude AI tab (`ClaudeAITab`) already exist in `Profile.tsx`. Legal/Financial/Mental Health resources are not yet linked from the profile.

**Acceptance Criterion:** AI Trainer CTA visible on both public and private profile. Legal/Financial/Mental Health links visible on private profile only. All links open in-platform (no full page reload on mobile).

---

### 3.14 Profile Footer

**What it is:** Bottom-of-page trust layer. Shows: verification sources, data partner logos, last-updated timestamp, data dispute button, platform ToS link, and athlete's chosen privacy mode.

**Required fields:**
- `lastUpdatedAt` — timestamp from `athleteProfiles`
- `verificationSources` — derived from `verifications` table (Build 3)
- Dispute data button — routes to a support ticket form

**Visibility controls:** Public

**Layer Cake touch:** Layer 1 only

**Acceptance Criterion:** Footer renders on every profile. Dispute button submits a ticket. Last-updated timestamp is human-readable ("Updated 3 days ago"). Verification source logos appear when integrations are active (Build 3).

---

## Section 4 — Visual Design System

### Color

| Token | Hex | Usage |
|---|---|---|
| `navy-deep` | `#0a1628` | Page background, primary surface |
| `navy-card` | `#0d1b3e` | Card background (matches existing `AthleteProfileCard.tsx`) |
| `navy-elevated` | `#112244` | Hover state, elevated panels |
| `electric-blue` | `#00d4ff` | Primary accent — links, CTAs, ring highlights |
| `signal-green` | `#00ff88` | Positive deltas, upward trends, growth indicators |
| `alert-red` | `#ff4d4d` | Negative deltas, decline indicators, alerts |
| `gold` | `#ffd700` | Awards, honors, top-tier status, ELITE tier |
| `white` | `#ffffff` | Section headers, primary text |
| `white-60` | `rgba(255,255,255,0.6)` | Secondary text, labels |
| `white-20` | `rgba(255,255,255,0.2)` | Borders, dividers, muted elements |

The existing codebase uses `#0a0f1e`, `#0d1b3e`, `#1530a0`, and cyan-500 variants. Build 1 unifies these to the palette above. No new color is introduced without explicit approval.

### Typography

| Role | Font | Weight | Size | Notes |
|---|---|---|---|---|
| Section headers | Inter | 800 Black | `text-xs` tracked 0.15em, all-caps | e.g. "STATS · SEASON 2025" |
| Athlete name | Inter | 900 | `text-2xl` / `text-xl` mobile | The hero name. Never truncate. |
| Stat values | JetBrains Mono | 700 | `text-xl` | Data reads differently than prose. Mono signals precision. |
| Stat labels | Inter | 700 | `text-[9px]` tracked-out all-caps | Existing pattern in AthleteProfileCard; keep it |
| Body / bios | Inter | 400 | `text-sm` | Clean. No serif. |
| Percentile label | JetBrains Mono | 700 | `text-xs` | Inside ring or beside bar |
| Milestone labels | Inter | 600 | `text-xs` | Journey ribbon events |

JetBrains Mono is loaded from CDN (Google Fonts). Inter is already present. No other fonts are added.

### Core Components

**Percentile Ring**
- SVG, 64×64px (card context) or 96×96px (expanded)
- Track: `#0d1b3e` at 8px stroke
- Fill: gradient `navy-deep → electric-blue → signal-green` based on percentile
- Center: JetBrains Mono bold, percentile number + "PCT" label
- Animation: stroke-dasharray transition, 1.0s ease-in-out, fires on viewport entry
- Below 33rd percentile: `alert-red` fill. 34–66th: `electric-blue`. 67–89th: `signal-green`. 90+: `gold`.
- `XFactorRing` in `AthletePublicProfile.tsx` is the starting point — restyle to new color system, add PCT label, add percentile color logic.

**Stat Tile**
- Size: min-width 100px, flex-grow in 3-column grid on mobile, 4-column on desktop
- Background: `navy-card`, border `white-20`, border-radius 12px
- Layout: [label top-left] [delta badge top-right] [value center, JetBrains Mono bold] [sparkline bottom, 6-point, 32px height]
- Delta badge: `+2.3` in `signal-green` or `-1.1` in `alert-red`, rounded pill
- Sparkline: pure SVG polyline, no chart library required for 6 points
- Hover: border upgrades to `electric-blue` at 40% opacity

**Comparison Radar**
- Library: Recharts `RadarChart` (already available via shadcn/ui dependency chain)
- Axes: 4–6, sport-specific labels, no generic labels
- Athlete 1: `electric-blue` fill at 20% opacity, `electric-blue` stroke
- Athlete 2: `signal-green` fill at 20% opacity, `signal-green` stroke
- Background: `navy-card`
- Size: 280×280px collapsed, full-width expanded

**Journey Ribbon**
- Horizontal scroll container, `overflow-x: auto`, hidden scrollbar on mobile
- Event node: 40×40px circle, filled for completed, outlined for future
- Connector line: 1px `white-20` between nodes
- Active/current event: `electric-blue` ring, pulsing CSS animation
- Verified event: gold checkmark overlay on node
- Tap to expand: event card drops down with full details

**Highlight Card**
- 16:9 aspect ratio enforced
- Thumbnail with play button overlay (`PlayCircle` from Lucide, 48px, white)
- Hover: overlay darkens 20%, play button scales 1.1
- Chapter list: below player, each chapter is `[timestamp] [label]`, tap to seek
- Mobile: native `<video>` controls, no custom player chrome

### Motion

Framer Motion is the library. All motion serves comprehension — no decorative animation.

| Element | Motion | Duration |
|---|---|---|
| Percentile ring fill | Stroke-dasharray transition on viewport entry | 1.0s ease-in-out |
| Stat tile entry | Fade up (`y: 20 → 0`, `opacity: 0 → 1`) | 0.3s, stagger 0.05s |
| Page tab switch | Opacity crossfade | 0.2s |
| Journey ribbon node hover | Scale 1.0 → 1.1 | 0.15s spring |
| Radar chart | Animate on mount | 0.6s ease-out |

No parallax. No scroll-triggered reveals on the primary data sections — those must be immediately visible. Motion applies to decorative and transitional elements only.

### Mobile-First

`mobile/profile.tsx` is the primary delivery surface. Desktop is enhanced, not baseline.

- Every section collapses to a single-column stack on 375px
- Journey ribbon: horizontal scroll on mobile, full display on desktop ≥1024px
- Radar chart: collapsed/CTA on mobile ("Compare Athletes →"), full render on desktop
- Stats grid: 3-col on mobile (matching existing pattern in `AthleteProfileCard.tsx`), 4-col on desktop
- Stat tile sparkline: renders on mobile; full YoY chart deferred to desktop or expanded view

**Acceptance Criterion:** Every section passes a visual QA screenshot at 375px (iPhone SE) and 1280px (desktop). No horizontal overflow. No text truncation on athlete name. Tap targets minimum 44×44px on all interactive elements.

---

## Section 5 — Data Model

### Existing schema (from `profileRouter.ts` + `athleteProfiles` table)

The following fields already exist and are in use. Build 1 does not change these.

```
athleteProfiles:
  userId, sport, position, school, height, weight, gpa, classYear,
  state, bio, recruitingStatus, nilValue, coverUrl, highlightUrl,
  instagram, twitter, followers, sportStats (JSONB), coachViews,
  collegesInterested (JSONB), nilVerified, facebookUrl, youtubeUrl,
  linkedinUrl, tiktokHandle, spotifyUrl, capcutUrl, recruitingScore,
  recruitingVideos (JSONB), filmRoomEnabled, totalVideoViews

users:
  id, name, email, avatarUrl, stripePlanId, onboardingRole,
  onboardingData, onboardingCompleted, sport, school
```

### New tables required (Build 2)

**`journey_events`**
```sql
CREATE TABLE journey_events (
  id          SERIAL PRIMARY KEY,
  athlete_id  INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  event_type  TEXT NOT NULL,  -- enum enforced in application layer
  event_date  DATE NOT NULL,
  title       TEXT NOT NULL,
  description TEXT,
  media_url   TEXT,
  is_verified BOOLEAN DEFAULT FALSE,
  verification_source TEXT,
  is_public   BOOLEAN DEFAULT TRUE,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX ON journey_events(athlete_id, event_date DESC);
```

**`athlete_season_stats`**
```sql
CREATE TABLE athlete_season_stats (
  id          SERIAL PRIMARY KEY,
  athlete_id  INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  sport       TEXT NOT NULL,
  season      TEXT NOT NULL,  -- e.g. "2024-2025" or "2024"
  stats       JSONB NOT NULL DEFAULT '{}',
  source      TEXT,           -- "self_reported" | "maxpreps" | "espn" | etc.
  is_verified BOOLEAN DEFAULT FALSE,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(athlete_id, sport, season)
);
```

**`highlight_videos`**
```sql
CREATE TABLE highlight_videos (
  id           SERIAL PRIMARY KEY,
  athlete_id   INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title        TEXT NOT NULL,
  video_url    TEXT NOT NULL,
  thumbnail_url TEXT,
  duration_seconds INT,
  is_public    BOOLEAN DEFAULT TRUE,
  is_primary   BOOLEAN DEFAULT FALSE,
  uploaded_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE video_chapters (
  id           SERIAL PRIMARY KEY,
  video_id     INT NOT NULL REFERENCES highlight_videos(id) ON DELETE CASCADE,
  label        TEXT NOT NULL,
  timestamp_seconds INT NOT NULL,
  description  TEXT
);
```

**`nil_deals`**
```sql
CREATE TABLE nil_deals (
  id                   SERIAL PRIMARY KEY,
  athlete_id           INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  brand_name           TEXT NOT NULL,
  brand_logo_url       TEXT,
  deal_type            TEXT NOT NULL,  -- ambassador|post|appearance|licensing|equity
  deal_value           NUMERIC,
  deal_value_visible   BOOLEAN DEFAULT FALSE,
  start_date           DATE,
  end_date             DATE,
  is_verified          BOOLEAN DEFAULT FALSE,
  verification_source  TEXT,  -- "stripe" | "brand_confirmation" | "self_reported"
  stripe_payment_id    TEXT,
  is_public            BOOLEAN DEFAULT TRUE,
  created_at           TIMESTAMPTZ DEFAULT NOW()
);
```

**`camps_attended`**
```sql
CREATE TABLE camps_attended (
  id                  SERIAL PRIMARY KEY,
  athlete_id          INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  event_name          TEXT NOT NULL,
  event_date          DATE NOT NULL,
  location            TEXT,
  organizer           TEXT,
  is_verified         BOOLEAN DEFAULT FALSE,
  verification_source TEXT,
  result_summary      TEXT,
  ranking_at_event    TEXT,
  calendar_event_id   INT,
  is_public           BOOLEAN DEFAULT TRUE
);
```

**`trusted_circle`**
```sql
CREATE TABLE trusted_circle (
  id                    SERIAL PRIMARY KEY,
  athlete_id            INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  member_id             INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role                  TEXT NOT NULL,  -- coach|agent|scout|lawyer|financial_advisor|trainer|family
  custom_title          TEXT,
  is_active             BOOLEAN DEFAULT TRUE,
  can_view_profile      BOOLEAN DEFAULT TRUE,
  can_view_nil          BOOLEAN DEFAULT FALSE,
  can_view_recruiting   BOOLEAN DEFAULT FALSE,
  can_view_academic     BOOLEAN DEFAULT FALSE,
  added_at              TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(athlete_id, member_id)
);
```

**`verifications`** (Build 3)
```sql
CREATE TABLE verifications (
  id               SERIAL PRIMARY KEY,
  entity_type      TEXT NOT NULL,  -- "athlete" | "stat" | "award" | "deal" | "offer"
  entity_id        INT NOT NULL,
  source           TEXT NOT NULL,  -- "maxpreps" | "247sports" | "on3" | "stripe" | "manual"
  source_url       TEXT,
  verified_at      TIMESTAMPTZ DEFAULT NOW(),
  verified_by      TEXT
);
```

**`privacy_controls`** — stored as JSONB column on `athleteProfiles`

```typescript
type PrivacyControls = {
  sections: {
    gpa: "public" | "coach_only" | "scout_only" | "private";
    nil: "public" | "coach_only" | "scout_only" | "private";
    recruiting: "public" | "coach_only" | "scout_only" | "private";
    academic: "public" | "coach_only" | "scout_only" | "private";
    trusted_circle: "private";  // always private, not configurable
  };
  nilValueVisible: boolean;
  showGpaRange: boolean;  // show "3.5–4.0" rather than exact
};
```

### Router additions needed

`profileRouter.ts` receives new procedures in Build 2:
- `getJourneyEvents`, `addJourneyEvent`, `updateJourneyEvent`, `deleteJourneyEvent`
- `getSeasonStats`, `upsertSeasonStats`
- `getHighlightVideos`, `addHighlightVideo`, `addVideoChapter`
- `getNilDeals`, `addNilDeal`, `updateNilDeal`
- `getCampsAttended`, `addCamp`, `updateCamp`
- `getTrustedCircle`, `addTrustedCircleMember`, `removeTrustedCircleMember`, `updateTrustedCirclePermissions`

**Acceptance Criterion:** All new tables created with indexes on `athlete_id`. Drizzle schema updated in `shared/schema.ts`. All new procedures added to `profileRouter.ts` following existing pattern (protectedProcedure for writes, publicProcedure for public reads). No raw SQL outside of Drizzle query builder.

---

## Section 6 — Verification & Trust

This is what Nike-grade looks like. Every data point on this profile has a badge. That badge means something.

### Verification Tiers

| Badge | Meaning | Visual Treatment |
|---|---|---|
| **Verified** (blue shield + check) | Sourced from an official integration and confirmed | `electric-blue` shield, `CheckCircle` Lucide icon |
| **Confirmed** (green check) | Athlete confirmed, cross-referenced with secondary source | `signal-green` check |
| **Self-reported** (gray info) | Athlete entered this; no third-party confirmation | `white-40` info badge, "Self-reported" tooltip |
| **Disputed** (amber flag) | Data is under review due to a dispute submission | `gold` flag, section locked until resolved |

### Verification Sources by Level

**High school athletes**
- Stats: MaxPreps API (Build 3)
- Awards: issuer org or article URL, manually reviewed
- Recruiting offers: 247Sports / On3 / Rivals API (Build 3), or self-reported until confirmed

**College athletes**
- Stats: conference APIs, ESPN Stats & Info (Build 3)
- Awards: NCAA, conference office records
- Transfer portal status: On3 Transfer Portal API (Build 3)

**Pro athletes**
- Stats: league APIs (NFL, NBA, MLB, MLS, etc.) — Build 3 partnership required
- Contracts: self-reported until league filing confirms
- Draft status: league draft API where available

**NIL deals — all levels**
- Verified: Stripe Connect payment receipt, or brand confirmation email
- Partially verified: brand social post linking to athlete
- Self-reported: no external confirmation — clearly labeled

**Recruiting — all levels**
- Offer received: self-reported until 247Sports/On3/Rivals confirms or coach counter-confirms
- Commitment: self-reported + coach tag in Trusted Circle confirms
- Signed: National Letter of Intent scan or school announcement URL

### Dispute Flow

Every section of the profile has a "Dispute this data" link visible to the athlete, their trusted circle, and any verified coach or scout who has been flagged as relevant. Clicking it:

1. Opens an inline form (not a new page): `[Section] → [What is incorrect?] → [Correct value or source URL] → Submit`
2. Creates a record in a `disputes` table with status: `pending | under_review | resolved | rejected`
3. Marks the disputed field with the amber "Disputed" badge
4. AthlynXAI moderation queue reviews within 48 hours (Build 3 SLA)

**Acceptance Criterion:** Every stat tile, every award, every offer in the recruiting timeline, and every NIL deal has a verification badge rendered. `verifications` table is populated for any data sourced from an integration. "Dispute this data" link is present on all data-bearing sections in Build 3. Dispute form submits in under 5 seconds on a 4G connection.

---

## Section 7 — The Three Builds

This spec covers three discrete deliverables. They are in order. Build 2 does not start until Build 1 ships. Build 3 does not start until Build 2 ships.

---

### Build 1 — Restyle

**What this is:** Pure visual upgrade. No new features. No new data. No new tables. Take what Manus built and make it look like it belongs on ESPN. Apply the design system from Section 4 to every existing profile component.

**Scope IN:**
- `Profile.tsx` — restyle to new color/typography/component system
- `AthletePublicProfile.tsx` — restyle hero, X-Factor ring, EPX dial, metrics bars, comparables card, all tabs
- `AthleteProfileCard.tsx` — restyle grid and featured variants to new design system
- `mobile/profile.tsx` — mobile-first restyle, 375px baseline

**Scope OUT:**
- No new database fields
- No new sections
- No verification layer
- No journey ribbon, NIL portfolio, or recruiting timeline (those are Build 2)

**Acceptance Criteria:**
- Profile passes the three-question gate (Section 1)
- All existing data surfaces correctly in new design
- No regressions: all existing tRPC calls still return data
- Visual QA screenshots at 375px and 1280px with no overflows, no off-palette colors
- JetBrains Mono renders on all stat values
- Percentile rings use Build 1 design (navy track, electric-blue fill, score in center)
- `navy-deep` (#0a1628) is the page background with zero exceptions

**Time estimate:** 3–5 engineer-days

---

### Build 2 — Feature Completion

**What this is:** Wire up the missing information architecture sections from Section 3. Journey ribbon, NIL portfolio, recruiting timeline, camps/showcases, trusted circle. New tables, new router procedures, new components — all following the patterns established in Build 1.

**Scope IN:**
- `journey_events` table + journey ribbon UI component
- `nil_deals` table + NIL portfolio section
- Recruiting timeline (sourced from `journey_events` + `recruitingStatus`)
- `camps_attended` table + camps section
- `trusted_circle` table + My Team panel (private profile only)
- `athlete_season_stats` table + YoY chart + season filter on stats grid
- `highlight_videos` + `video_chapters` tables + chapter-marked player
- Privacy controls UI — athlete can set per-section visibility
- `privacy_controls` JSONB field on `athleteProfiles`

**Scope OUT:**
- External API integrations (MaxPreps, 247Sports, On3, Rivals, league APIs)
- Stripe-verified NIL deals (requires Stripe Connect setup)
- Dispute flow
- AI auto-generated highlights

**Acceptance Criteria:**
- All new sections render with real data when athlete adds records
- Empty states render correctly for all new sections
- Privacy controls enforce visibility at the API layer, not just the UI layer
- Journey ribbon scrolls horizontally on mobile with at least 5 event nodes visible without clipping
- NIL portfolio shows aggregate total when deal values are hidden individually
- Trusted Circle panel is absent from public `/athlete/:id` route
- All new tRPC procedures follow existing error-handling pattern (INTERNAL_SERVER_ERROR on DB unavailable)

**Time estimate:** 10–14 engineer-days

---

### Build 3 — Verification Layer + Dispute Flow

**What this is:** Make every claim on the profile provable. Wire external data sources. Build the dispute system. This is where the profile earns the Verified Athlete badge.

**Scope IN:**
- `verifications` table
- MaxPreps API integration for HS stats
- 247Sports / On3 API integration for recruiting data
- Stripe Connect receipt verification for NIL deals
- `disputes` table + dispute submission form + moderation queue (internal tool)
- Verified Athlete badge (requires at least one verified stat or verified recruiting event)
- "Self-reported" badges on all unverified data
- Athlete onboarding step: "Connect your MaxPreps profile"

**Scope OUT:**
- Pro league API integrations (requires direct partnership agreements — post-Build 3)
- Automated fraud detection (post-Build 3)
- Brand confirmation API (post-Build 3)

**Acceptance Criteria:**
- Stats sourced from MaxPreps have `is_verified: true` and render with the verified shield badge
- Recruiting events confirmed by 247Sports/On3 have `is_verified: true`
- NIL deals with a Stripe payment receipt have `verification_source: "stripe"` and verified badge
- All self-reported data has a visible "Self-reported" badge
- Dispute form renders on every data section and submits successfully
- Dispute creates a record in `disputes` table and triggers an internal moderation notification
- Zero verified data is displayed as self-reported; zero self-reported data is displayed as verified

**Time estimate:** 14–21 engineer-days (integration SLAs dependent on API access agreements)

---

## Section 8 — Open Questions for Chad

These are the only questions in this spec. Everything else is a decision. These require the founder.

1. **Hall of Fame mode for retired pros.** Should a retired professional athlete get a fundamentally different profile layout — career-retrospective format, legacy stats, mentorship CTA — rather than the active-athlete layout? If yes: what is the trigger? Manual toggle? Age + retirement date?

2. **NIL portfolio default visibility.** When an athlete first adds a NIL deal, what is the default? Three options: (a) Public by default — athlete opts out if they want privacy. (b) Private by default — athlete opts in if they want to share. (c) Prompted — athlete must choose at the time of deal entry, no default. Chad's choice here sets the tone for the entire NIL layer.

3. **Youth athlete parent-gate.** For athletes under 18, should there be a parent/guardian approval layer? When a youth athlete adds data, does a linked parent account receive an approval request before it goes live? This affects the `trusted_circle` model and onboarding flow significantly.

4. **Mental health resources on the public profile.** The AI Trainer CTA is currently scoped as public-facing (Section 3.13). Mental health resources are part of Layer 7 (The Stack). Should crisis/mental health resources appear on the public profile — as a gentle, always-present signal that AthlynXAI cares about the whole person — or should they live exclusively behind the gated private view?

5. **Sponsor logos on profile.** When an NIL deal is public, should the brand's logo appear on the athlete's public-facing profile (like a jersey sponsor)? Three options: (a) Yes, always — verified deals display brand logo. (b) No — deal existence is shown but no logo on the profile itself. (c) Athlete's choice — per-deal toggle.

---

*These five questions have no wrong answers. They are founder-level calls. The team does not ship the NIL portfolio (Build 2) or the verification layer (Build 3) without answers to questions 2 and 5 respectively.*

---

**Iron Sharpens Iron — Proverbs 27:17**  
**
