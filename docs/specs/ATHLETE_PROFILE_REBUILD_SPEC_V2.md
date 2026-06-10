# ATHLETE_PROFILE_REBUILD_SPEC_V2
## The MLB.com / PlayerProfiler Pro-Grade Athlete Profile — for AthlynXAI

**Prepared for:** Chad and the 22 athletes already on AthlynX
**Prepared by:** AthlynXAI Corporation
**Status:** Master build spec, v2
**Standing closer:** Iron Sharpens Iron — Proverbs 27:17

---

## 1. North Star

This is the page that fixes the #1 thing on Chad's mind.

Right now we ask kids to trust us with their journey, and we hand them a profile that looks like a form. That is not honoring the journey. The athletes who walk in our door — all 22 of them, named, known, called by their first name — deserve a page that looks like the page a big leaguer gets. Not a watered-down version. The same page.

We are not building a recruiting profile. We are building **the front page of an athlete's career.** From the first travel-ball at-bat to the day a coach calls. From the first 40-yard time to the day a brand cuts a check. The journey lives on one page, built once, never rebuilt.

**The manifesto in three lines:**

- Honor the journey. Every entry on this page is a step the athlete actually took. Nothing fabricated, nothing inflated.
- Build once, never rebuild. The data model is designed to receive every dataset AthlynX will ever ingest — from the kid's first scrimmage to the day they're inducted.
- MLB.com for everyone. A 14-year-old freshman in Albany, Georgia gets the same profile shell as Andrew Abbott. Same hero, same tabs, same dignity.

**The Three-Question Gate.** Before any pixel ships, the build answers three questions out loud:

1. Does it honor the journey?
2. Would Nike be proud to put their logo next to it?
3. Would the athlete's mama be proud to share it?

If the answer to any of the three is no, it doesn't ship. That gate runs on every section, every component, every copy line.

---

## 2. The Three Viewers

The profile is one page. The page serves three readers. The page knows who is reading.

### 2.1 The Athlete (default view)

What they see: everything they own. Their stats, their highlight reel, their offers, their NIL deals, their coaches, their trusted circle. The full board.

What they edit: bio, social handles, video uploads, NIL availability toggle, trusted-circle invites, Top 5 Signing Day Board.

What is hidden from them: Coach view extras — they don't see who has them on a recruit list, they don't see internal coach notes, they don't see the contactability flag a coach set on them.

### 2.2 The Coach / Recruiter (verified)

What they see: everything in the athlete view, plus Coach View Extras (Section N) — Contactability status, Last contacted date, Recruit-list flag, Internal notes (coach-only, never shown to athlete or parent), Add-to-Board button.

What is hidden from them: Trusted Circle private messages, NIL deal financial detail beyond brand name (dollar amounts are aggregate-only unless the athlete opts in), Academic & Character data unless the athlete has explicitly published it.

Verification gate: a coach gets coach view only after passing the verified-coach check — institutional email + manual review by AthlynX. No exceptions.

### 2.3 The Parent / Brand (public)

What they see: the polished outward face — Hero, Summary, Stats, Awards, News, Media, NIL highlights (brand names only). The page a brand manager can screenshot and put in a deck. The page a grandmother can show a friend at church.

What is hidden from them: Internal coach notes, Trusted Circle, raw uncurated transactions log items the athlete has marked private, exact NIL dollar amounts unless the athlete publishes them.

---

## 3. Page Anatomy

Section-by-section information architecture. Layout matches MLB.com's Andrew Abbott profile exactly, with the AthlynXAI additions layered on top.

### Section A — HERO BAR

Inspired directly by the MLB.com Andrew Abbott #41 page Chad shared. Top of page, edge to edge.

Composition, left to right:

- **Action photo banner** — full-bleed background, dark gradient overlay bottom-left to top-right so the headshot tile reads cleanly
- **Headshot tile** — square portrait card, white border, slight shadow, sits over the action photo like the MLB.com lineup card
- **Identity block** — athlete's full name in display weight (Bebas Neue / Anton), jersey number large to the right of the name (e.g., "#41"), position chip pill underneath (LHP, WR, PG, etc.)
- **Vitals line** — single line under the name: `B/T: L/L  |  H: 6'0"  |  W: 192 lbs  |  Age: 26`. For HS / college athletes this becomes `Class of 2027  |  H: 6'2"  |  W: 195 lbs  |  Age: 16.4`
- **Action row** — three buttons inline: `Follow` · `Watch Story` · `Share`
- **AthlynXAI add-ons (right side of hero):**
  - **NIL Verified badge** — small shield, electric blue, only shown if the athlete has cleared NIL verification (from Jaylen W. mockup)
  - **4-Star Rating** — gold stars, 0–5 scale, the AthlynX composite scout grade (from Jaylen W. mockup)
  - **Coaches Viewed Today ticker** — small pill under the badges: "47 coaches viewed your profile today" (from Chad's mockup, live count, updates every refresh)
  - **Highlight Reel inline player** — collapsible 16:9 player tucked under the hero, above the tab nav, autoplay muted

### Section B — TAB NAV

Sticky tab bar, sits below the hero. MLB.com layout (Summary | Stats | News | Awards | SHOP) extended for AthlynX:

`Summary  |  Stats  |  News  |  Awards  |  Recruiting  |  NIL  |  Media  |  Metrics  |  Journey  |  Academic  |  Contact`

Tabs scroll horizontally on mobile. Selected tab gets electric-blue underline.

### Section C — SUMMARY tab

Top-of-funnel snapshot. Matches MLB.com Andrew Abbott Summary layout one-to-one.

- **Current Season mini-table** — header row: `G  W-L  ERA  IP  SO  WHIP` (pitcher) or `G  AVG  HR  RBI  OBP  SLG` (hitter) or sport-equivalent. One row of stats, large numerals.
- **Career Regular Season mini-table** — same column shape as Current Season, one totals row.
- **Bio block** — labeled key-value pairs:
  - Fullname
  - Born (date + birthplace) OR Class (for HS athletes, e.g., "Class of 2027")
  - Draft (round, pick, year, team) OR Commit Status (e.g., "Verbal — Alabama, June 2026")
  - College (for pros) OR High School (for HS / college)
  - Debut (MLB debut date) OR Varsity Debut (for HS) OR HS Grad date
  - Follow handles — X, Instagram, TikTok with logos
- **Splits section** — three side-by-side cards:
  - `Last 7 Games` — W L ERA G GS SV (pitcher) / G AB H HR RBI AVG (hitter)
  - `Last 15 Games` — same shape
  - `Last 30 Games` — same shape
- **Last 3 Games game-by-game** — table: `Date  Opponent  W/L/SV  IP  H  ER  BB  SO` (pitcher). Each row links to box score.

### Section D — STATS tab

Full season-by-season career table, sport-aware. MLB.com Andrew Abbott shows 2023, 2024, 2025, 2026, and an MLB Career row. We replicate that exactly.

- **Career table** — columns vary by sport (see Section 8 for the exact schemas). Sortable by clicking column header. Sticky first column for athlete name on horizontal scroll.
- **Advanced Career Stats** — second table below the main one: `QS GF 2B 3B GIDP` for a pitcher, or sport-equivalent advanced row (see Section 8).
- **Rate Stats** — third small table: `WPCT  RS/9  TBF` for pitchers, or `BABIP  ISO  wRC+` for hitters, etc.
- **Export CSV** button — downloads the full career table.

### Section E — NEWS tab

Four-card grid, MLB.com Andrew Abbott News layout exactly.

Each card: thumbnail (16:9), date stamp, headline, source attribution. Three card sources:

- AthlynX-published video posts the athlete authored themselves
- Tagged news from local press, school sites, MaxPreps, Perfect Game scrolls
- Recruiter Notes — short verified-coach blurbs the athlete chose to feature

`View More Videos` button bottom of grid.

### Section F — AWARDS tab

Year/Team/League labeled tables, MLB.com style. Each award type gets its own small table.

Award categories supported:

- All-League selections (Year / Team / League)
- Player of the Week / Month (Year-Week / Team / League)
- All-Conference (Year / Team / League)
- All-State (Year / Team / League)
- All-American (Year / Team / League)
- MVP (Year / Team / League)
- Showcase Invites (Year / Event / Org — Perfect Game, Under Armour All-America, Future Star Series, etc.)
- Combine Invites (Year / Event)

Then a **League Rankings table** — the athlete's ranks within their league/class/state/national: `Year  |  Stat  |  Rank  |  Pool`. MLB.com lists Home Runs, Wins, Losses, Strikeouts, At Bats, Innings Pitched. AthlynX adds sport-equivalent rows for football, basketball, soccer, track.

### Section G — RECRUITING tab (AthlynX's killer feature)

The page MLB.com does not have. The page Chad's been drawing on napkins.

- **Colleges Showing Interest** — logo grid card. Pulls from athleteOffers and athleteVisits. Inspired by Chad's Jaylen W. ad mockup that shows Alabama, Ohio State, Georgia logos. Shows up to 12 logos; tap one for the relationship detail (offer date, visit history, contact log).
- **Top 5 Signing Day Board** — the athlete's own choice. Five logo slots. Drag-and-drop. Big `Commit Lock-in` button. When the athlete clicks Commit, the board freezes, generates a shareable Commit Card asset (PNG sized for IG, X, TikTok), and posts to the athlete's News tab.
- **Coaches Viewed Today ticker** — same data source as the hero pill, expanded here to a daily/weekly/monthly toggle. Privacy: shows count, not names (athlete sees aggregate; verified coach sees their own view recorded for the athlete only).
- **Visit History** — chronological list: `Date  School  Type (Official / Unofficial / Camp / Showcase)  Notes`.
- **Offer Log** — chronological: `Date  School  Scholarship Type (Full / Partial / PWO / Grayshirt)  Status (Open / Committed / Decommitted / Withdrawn)`.
- **Commit Announcement Template** — once a commit lock-in fires, this generates the announcement post (image + caption draft) the athlete edits and publishes.

### Section H — NIL tab

The NIL Portal sub-page. Inspired by Chad's NIL Portal ad mockup.

- **Deal Cards Grid** — each deal is a card: brand logo, deal name, value tier ("$25K Nike Deal", "$25K Gatorade Partnership"), term dates, deliverables checklist. Cards stack vertically on mobile.
- **Earnings Tracker** — line chart. X-axis: month. Y-axis: cumulative NIL earnings. Single line, electric blue. Hover for monthly delta.
- **This Month total** — large KPI tile: dollar amount this calendar month, delta vs. prior month.
- **Top Brands strip** — horizontal logo row of brands the athlete has worked with (Nike, Gatorade, Under Armour, Beats — placeholder set from the mockup).
- **NIL Valuation Score** — single composite number (0–100) computed from follower count, engagement, performance, geo, sport, school. Tooltip explains the inputs.
- **Available for Deals toggle** — athlete-controlled. When on, brand reps see the athlete in the Brand Match queue. When off, the athlete is invisible to the queue.
- **Brand Match queue** — incoming deal inquiries, sorted newest-first. Each row: brand, proposed terms, response action (Accept / Counter / Decline).

### Section I — MEDIA tab

- **Highlight Reel hero player** — the same player as the inline hero player, expanded here with playlist controls.
- **Full Game archive** — list of full-game uploads. Filter by season.
- **Workout / Combine videos** — separate row, tagged with the metric the video supports (40-yard, vertical, FB velo, etc.).
- **Photo gallery** — masonry grid.
- **Press mentions** — list of external article links the athlete is tagged in.

### Section J — METRICS / PERFORMANCE tab (PlayerProfiler-style)

Built from the Antonio Williams PlayerProfiler reference Chad shared.

- **Athleticism Score gauge** — single large radial gauge, score 0–100, with four ranking dials underneath:
  - `# of N — Position, Class Rank`
  - `# of N — All Positions, Class Rank`
  - `# of N — Position, All Time Rank`
  - `# of N — All Positions, All Time Rank`
- **Workout Metrics bar chart** — each row is a metric, the bar fills to the athlete's value, and a percentile rank pill sits at the end. Sport-appropriate metrics:
  - Football: 40-Yard, 10-Yard Split, Vertical, Broad Jump, Shuttle, 3-Cone, Bench, Speed Score, Burst Score, Agility Score, Catch Radius
  - Baseball: 60-Yard, Exit Velo, FB Velo, Spin Rate (FB/SL/CH/CB), Pop Time (catcher), Throw Velo (OF/IF)
  - Basketball: Vertical, Lane Agility, Shuttle, Sprint, Wingspan
  - Soccer: 40-Yard, Vertical, Yo-Yo, Repeated Sprint
  - Track: Event PR, Reaction Time, Power-Speed Index
- **Comparable Player card** — "Best Comparable Player" — a card showing the closest match from a baseline player set, with similarity score. (PlayerProfiler-style — Antonio Williams ↔ Jalen McMillan.)
- **Explosive Rating** — sport-specific gauge:
  - Football: EPX (Receiving EPX + Explosive Plays bars + definition text)
  - Baseball pitcher: Stuff+ (composite pitch-quality score)
  - Baseball hitter: Barrel Rate + Hard Hit %
  - Basketball: PER + TS%
- **College Production trio** (for college / pre-draft athletes) — three side-by-side stat tiles with percentile rank:
  - College Dominator Rating
  - College Target Share / Usage Rate
  - Breakout Age

### Section K — TRANSACTIONS / JOURNEY tab

MLB.com chronological event log style. Andrew Abbott's page shows entries like "April 12, 2025: Cincinnati Reds activated LHP Andrew Abbott from the 15-day injured list." We mirror that exactly.

Each row: team / org logo + date + event description. Event types:

- Committed (verbal / written / NLI signed)
- Decommitted
- Transferred (school or org)
- Drafted (round, pick, team)
- Signed (pro contract, NIL deal, bonus)
- Called Up / Sent Down (minors / majors, varsity / JV)
- Injured / IL'd / Returned from IL
- Awards (auto-mirrors entries from Awards tab)
- Showcases attended
- Coach changes (committed coach hired / fired)

Reverse chronological by default; toggle to chronological. Export CSV.

### Section L — ACADEMIC & CHARACTER (AthlynX exclusive)

The part that makes a mama proud.

- GPA (cumulative + current term)
- SAT / ACT
- NCAA Eligibility Center status (Registered / Cleared / Final Amateurism Cert)
- Verified Coaches — list of coaches who have vouched (with a verification timestamp)
- Community service hours (logged + verified)
- Character references — verified short statements from teachers, pastors, mentors. Each reference shows verifier name, role, and verification date. Athlete chooses which to publish.

### Section M — TRUSTED CIRCLE

Mutual-consent visibility. The athlete invites; the invitee accepts. Roles:

- Head Coach
- Position Coach / Trainer
- Parent / Guardian
- Agent / Advisor
- Academic Counselor
- Pastor / Mentor

Each circle member can see additional fields the athlete grants them, and message inside the circle. Nothing in the Trusted Circle is visible to the public or to coach view.

### Section N — COACH VIEW EXTRAS (verified coach only)

Only renders when the viewer is a verified coach / recruiter account.

- **Contactability** — status pill: `Open` / `Quiet Period` / `Dead Period` / `Committed Elsewhere` / `Off Limits`. NCAA-rule aware.
- **Last Contacted** — date + channel (call / email / DM / camp).
- **Recruit-list flag** — boolean: is this athlete on this coach's internal list? Visible only to that coach.
- **Internal Notes** — free-text field, coach-only. Never visible to athlete, parent, or another coach.
- **Add to Board** — moves the athlete to the coach's recruiting board view.

These extras are scoped per coach account — coach A's notes are invisible to coach B.

### Section O — SHOP / STORE (future)

Post-NIL deal, the athlete can list licensed merch. MLB.com Andrew Abbott page shows MLB Shop custom jerseys $149.99–$199.99. We replicate the row when the athlete has products.

Until products exist, the section is suppressed (not shown empty).

### Section P — FOOTER

- Verification badges row (NIL Verified, Academics Verified, NCAA Cleared, Coach-Verified)
- "Built once, never rebuild."
- "Iron Sharpens Iron — Proverbs 27:17"
- ""
- AthlynXAI Corporation legal line + copyright year

---

## 4. Data Model

Drizzle ORM table definitions. These extend the existing `athleteProfiles` table referenced in `profileRouter.ts`. All ids are uuid. All timestamps are `timestamp` with timezone.

```ts
// Existing extended
athleteProfiles: {
  id: uuid().primaryKey().defaultRandom(),
  userId: uuid().notNull().references(() => users.id),
  fullName: varchar({ length: 200 }).notNull(),
  jerseyNumber: varchar({ length: 8 }),
  position: varchar({ length: 16 }),
  sport: varchar({ length: 32 }).notNull(),
  bats: varchar({ length: 4 }),
  throws: varchar({ length: 4 }),
  heightInches: integer(),
  weightLbs: integer(),
  birthDate: date(),
  birthCity: varchar({ length: 120 }),
  birthState: varchar({ length: 64 }),
  birthCountry: varchar({ length: 64 }),
  classYear: integer(),          // HS grad year
  highSchool: varchar({ length: 160 }),
  college: varchar({ length: 160 }),
  varsityDebutDate: date(),
  proDebutDate: date(),
  draftYear: integer(),
  draftRound: integer(),
  draftPick: integer(),
  draftTeam: varchar({ length: 80 }),
  xHandle: varchar({ length: 80 }),
  igHandle: varchar({ length: 80 }),
  tiktokHandle: varchar({ length: 80 }),
  headshotUrl: text(),
  actionPhotoUrl: text(),
  highlightReelUrl: text(),
  nilVerified: boolean().default(false),
  athlynxStarRating: numeric({ precision: 2, scale: 1 }), // 0.0 - 5.0
  availableForDeals: boolean().default(false),
  createdAt: timestamp({ withTimezone: true }).defaultNow(),
  updatedAt: timestamp({ withTimezone: true }).defaultNow(),
}

athleteSeasonStats: {
  id: uuid().primaryKey().defaultRandom(),
  athleteId: uuid().notNull().references(() => athleteProfiles.id),
  season: integer().notNull(),
  team: varchar({ length: 120 }).notNull(),
  league: varchar({ length: 80 }).notNull(),
  sport: varchar({ length: 32 }).notNull(),
  statPayload: jsonb().notNull(),  // sport-specific (see Section 8 schemas)
  source: varchar({ length: 80 }),  // 'MaxPreps' | 'Perfect Game' | 'manual' | etc.
  verifiedAt: timestamp({ withTimezone: true }),
  createdAt: timestamp({ withTimezone: true }).defaultNow(),
}

athleteCareerStats: {
  id: uuid().primaryKey().defaultRandom(),
  athleteId: uuid().notNull().references(() => athleteProfiles.id),
  sport: varchar({ length: 32 }).notNull(),
  scope: varchar({ length: 24 }).notNull(),  // 'HS' | 'College' | 'Pro' | 'AllTime'
  statPayload: jsonb().notNull(),
  computedAt: timestamp({ withTimezone: true }).defaultNow(),
}

athleteAwards: {
  id: uuid().primaryKey().defaultRandom(),
  athleteId: uuid().notNull().references(() => athleteProfiles.id),
  awardType: varchar({ length: 80 }).notNull(),  // 'AllLeague' | 'POW' | 'AllAmerican' | etc.
  awardName: varchar({ length: 200 }).notNull(),
  year: integer(),
  month: integer(),
  week: integer(),
  team: varchar({ length: 120 }),
  league: varchar({ length: 80 }),
  verifiedAt: timestamp({ withTimezone: true }),
}

athleteRankings: {
  id: uuid().primaryKey().defaultRandom(),
  athleteId: uuid().notNull().references(() => athleteProfiles.id),
  year: integer().notNull(),
  statName: varchar({ length: 40 }).notNull(),
  statValue: numeric({ precision: 10, scale: 3 }),
  rank: integer().notNull(),
  pool: varchar({ length: 80 }).notNull(),  // 'league' | 'state' | 'class' | 'national'
}

athleteTransactions: {
  id: uuid().primaryKey().defaultRandom(),
  athleteId: uuid().notNull().references(() => athleteProfiles.id),
  eventDate: date().notNull(),
  eventType: varchar({ length: 40 }).notNull(),  // 'committed' | 'signed' | 'drafted' | 'iled' | etc.
  description: text().notNull(),
  teamLogoUrl: text(),
  meta: jsonb(),
}

athleteOffers: {
  id: uuid().primaryKey().defaultRandom(),
  athleteId: uuid().notNull().references(() => athleteProfiles.id),
  school: varchar({ length: 160 }).notNull(),
  schoolLogoUrl: text(),
  offerDate: date().notNull(),
  scholarshipType: varchar({ length: 32 }),  // 'Full' | 'Partial' | 'PWO' | 'Grayshirt'
  status: varchar({ length: 24 }).notNull(),  // 'Open' | 'Committed' | 'Decommitted' | 'Withdrawn'
  notes: text(),
}

athleteVisits: {
  id: uuid().primaryKey().defaultRandom(),
  athleteId: uuid().notNull().references(() => athleteProfiles.id),
  school: varchar({ length: 160 }).notNull(),
  visitDate: date().notNull(),
  visitType: varchar({ length: 32 }).notNull(),  // 'Official' | 'Unofficial' | 'Camp' | 'Showcase'
  notes: text(),
}

athleteCommit: {
  athleteId: uuid().primaryKey().references(() => athleteProfiles.id),
  top5: jsonb().notNull(),  // array of {schoolName, schoolLogoUrl, locked: bool}
  committedSchool: varchar({ length: 160 }),
  commitDate: date(),
  commitCardAssetUrl: text(),
  updatedAt: timestamp({ withTimezone: true }).defaultNow(),
}

athleteNILDeals: {
  id: uuid().primaryKey().defaultRandom(),
  athleteId: uuid().notNull().references(() => athleteProfiles.id),
  brand: varchar({ length: 120 }).notNull(),
  brandLogoUrl: text(),
  dealName: varchar({ length: 200 }),
  valueUsd: numeric({ precision: 12, scale: 2 }),
  startDate: date(),
  endDate: date(),
  deliverables: jsonb(),
  publishedAmount: boolean().default(false),  // athlete chooses to show dollars
  status: varchar({ length: 24 }).notNull(),  // 'Active' | 'Pending' | 'Completed'
}

athleteWorkoutMetrics: {
  id: uuid().primaryKey().defaultRandom(),
  athleteId: uuid().notNull().references(() => athleteProfiles.id),
  metricName: varchar({ length: 40 }).notNull(),  // '40Yard' | 'ExitVelo' | 'FBVelo' | etc.
  value: numeric({ precision: 10, scale: 3 }).notNull(),
  unit: varchar({ length: 16 }).notNull(),
  percentile: integer(),
  recordedAt: timestamp({ withTimezone: true }).notNull(),
  source: varchar({ length: 80 }),  // 'Catapult' | 'Rapsodo' | 'manual' | etc.
  verifiedAt: timestamp({ withTimezone: true }),
}

athleteAthleticismScore: {
  athleteId: uuid().primaryKey().references(() => athleteProfiles.id),
  score: numeric({ precision: 5, scale: 2 }).notNull(),  // 0.00 - 100.00
  positionClassRank: integer(),
  positionClassPool: integer(),
  allPositionsClassRank: integer(),
  allPositionsClassPool: integer(),
  positionAllTimeRank: integer(),
  positionAllTimePool: integer(),
  allPositionsAllTimeRank: integer(),
  allPositionsAllTimePool: integer(),
  comparablePlayer: varchar({ length: 160 }),
  comparableSimilarity: numeric({ precision: 4, scale: 1 }),
  computedAt: timestamp({ withTimezone: true }).defaultNow(),
}

coachViews: {
  id: uuid().primaryKey().defaultRandom(),
  athleteId: uuid().notNull().references(() => athleteProfiles.id),
  coachUserId: uuid().notNull().references(() => users.id),
  viewedAt: timestamp({ withTimezone: true }).defaultNow(),
  contactability: varchar({ length: 24 }),  // 'Open' | 'QuietPeriod' | 'DeadPeriod' | 'Off Limits'
  lastContactedAt: timestamp({ withTimezone: true }),
  lastContactedChannel: varchar({ length: 24 }),
  onRecruitList: boolean().default(false),
  internalNotes: text(),  // coach-only, never exposed to athlete
}

athleteTrustedCircle: {
  id: uuid().primaryKey().defaultRandom(),
  athleteId: uuid().notNull().references(() => athleteProfiles.id),
  memberUserId: uuid().notNull().references(() => users.id),
  role: varchar({ length: 40 }).notNull(),  // 'HeadCoach' | 'Parent' | 'Agent' | etc.
  invitedAt: timestamp({ withTimezone: true }).defaultNow(),
  acceptedAt: timestamp({ withTimezone: true }),
}

athleteAcademics: {
  athleteId: uuid().primaryKey().references(() => athleteProfiles.id),
  gpaCumulative: numeric({ precision: 3, scale: 2 }),
  gpaTerm: numeric({ precision: 3, scale: 2 }),
  satScore: integer(),
  actScore: integer(),
  ncaaEligibilityStatus: varchar({ length: 24 }),  // 'Registered' | 'Cleared' | 'Final Cert'
  communityServiceHours: integer().default(0),
  verifiedAt: timestamp({ withTimezone: true }),
}

athleteReferences: {
  id: uuid().primaryKey().defaultRandom(),
  athleteId: uuid().notNull().references(() => athleteProfiles.id),
  verifierName: varchar({ length: 160 }).notNull(),
  verifierRole: varchar({ length: 80 }).notNull(),
  statement: text().notNull(),
  verifiedAt: timestamp({ withTimezone: true }).notNull(),
  published: boolean().default(false),
}
```

### Router additions (`profileRouter.ts`)

New procedures, all tRPC:

- `getProfile(athleteId, viewer)` — returns the right slice based on viewer role (athlete / coach / public)
- `getSeasonStats(athleteId, season?)` — list, optional season filter
- `getCareerStats(athleteId)` — all rows
- `getAwards(athleteId, awardType?)` — grouped
- `getTransactions(athleteId, limit?)` — paged
- `getOffers(athleteId)`, `getVisits(athleteId)`, `getCommit(athleteId)`
- `setTop5(athleteId, top5)` — athlete only
- `commitLockIn(athleteId, school)` — athlete only, generates Commit Card asset
- `getNILDeals(athleteId)`, `addNILDeal`, `updateNILDeal`
- `getWorkoutMetrics(athleteId)`, `getAthleticismScore(athleteId)`
- `logCoachView(athleteId, coachUserId)` — fires on view
- `getCoachExtras(athleteId, coachUserId)` — verified coach only
- `setCoachExtras(athleteId, coachUserId, partial)` — verified coach only
- `getTickerCount(athleteId, window)` — coaches-viewed-today aggregate

---

## 5. Visual Design

### Color tokens

| Role | Hex | Use |
|---|---|---|
| Surface base | `#0A1628` | Page background — MLB.com dark navy |
| Surface card | `#0F1E36` | Card backgrounds, lighter than base |
| Surface elevated | `#142544` | Hover, focus, stat tiles |
| Border | `#1F3257` | Card dividers |
| Accent | `#00A3FF` | AthlynXAI electric blue — buttons, links, selected tab underline |
| Accent hover | `#0084CC` | Hover state |
| Gold | `#D4AF37` | Awards, star ratings, MVP markers |
| Text primary | `#FFFFFF` | Headings, big numerals |
| Text secondary | `#B7C3D9` | Body copy |
| Text muted | `#6B7A99` | Labels, captions |
| Success (percentile ≥ 75) | `#3FB984` | Top-quartile percentile fills |
| Mid (25–74) | `#E8AF34` | Mid-percentile fills |
| Low (< 25) | `#E5556C` | Bottom-quartile fills |

### Typography

| Role | Font | Use |
|---|---|---|
| Display (jersey #, big stats, hero name) | Bebas Neue or Anton | Hero name, jersey number, big stat tiles |
| Heading | DM Sans Bold | Section headers, tab labels |
| Body | Inter | Tables, bio fields, paragraphs |
| Monospace | JetBrains Mono | Drizzle schema blocks, code |
| Tabular numerals | Inter (`tabular-nums lining-nums`) | Stat tables |

Display floor: 24px on screen, 18pt in print. Body floor: 14px on screen, 10pt in print.

### Component inventory

- `HeroBar` — Section A composition
- `TabNav` — sticky horizontal nav
- `StatTile` — single big numeral + label + delta
- `StatTable` — sortable, CSV-exportable
- `AwardRow` — year / month / week + team + league
- `TransactionItem` — logo + date + description
- `WorkoutMetricBar` — name + bar + value + percentile pill (color-graded)
- `AthleticismGauge` — radial gauge with score + four rank dials
- `CollegeInterestGrid` — logo grid card
- `CommitCard` — top-5 board with lock-in
- `NILDealCard` — brand logo, deal title, value tier, term, deliverables
- `EarningsChart` — line chart, single series, electric blue
- `BrandStrip` — horizontal logo row
- `CoachViewBadge` — coach-only floating card with extras
- `VerifiedBadge` — shield, electric blue
- `StarRating` — gold, 0–5
- `TickerPill` — "47 coaches viewed your profile today"
- `HighlightPlayer` — 16:9 video player, autoplay muted

---

## 6. The Three Builds

Sequenced. Each build ships end-to-end on its own and is testable.

### Build 1 — THIS WEEK

Restyle the existing Profile page to MLB.com hero + tab nav + Summary tab with mock data wired to `athleteProfiles`.

Scope:

- Section A HeroBar component, wired to `athleteProfiles` real fields, mock action photo + headshot
- Section B TabNav skeleton, all 11 tabs render placeholders except Summary
- Section C Summary tab fully wired: Current Season + Career mini-tables (mock), Bio block from `athleteProfiles`, Splits (mock)
- Section P Footer with manifesto closers

Deliverable: every one of the 22 athletes on AthlynX today has a page that already looks like MLB.com when they log in next.

### Build 2 — NEXT 2 WEEKS

Full Stats / Awards / Recruiting / NIL / Media / Metrics tabs with real data tables, CSV import for stats.

Scope:

- All Drizzle tables from Section 4 created and migrated
- Section D Stats tab: season-by-season career table, Advanced Career Stats, rate stats, sortable columns, export CSV
- Section F Awards tab: all award type tables + League Rankings table
- Section G Recruiting tab: Colleges Showing Interest grid, Top 5 Signing Day Board with drag-and-drop, Commit lock-in, Coaches Viewed ticker, Visit history, Offer log
- Section H NIL tab: Deal cards grid, Earnings chart, This Month KPI, Top Brands strip, NIL Valuation, Available toggle, Brand Match queue
- Section I Media tab: Highlight Reel player, Full Game archive, Workout videos, photo gallery, press mentions
- Section J Metrics tab: Athleticism gauge, four rank dials, Workout Metrics bar chart, Comparable Player, Explosive Rating, College Production trio
- CSV import flow: upload stat file → map columns → preview → commit. Sources tagged.

### Build 3 — WEEK 4

Verification layer, Coach view, NIL deal flow, dispute flow.

Scope:

- Verified coach onboarding (institutional email + manual review)
- Section N Coach View Extras renders only for verified coaches
- Section L Academic & Character data entry + verification flow
- Section M Trusted Circle invite + accept flow
- Section K Transactions / Journey tab auto-populates from events
- NIL deal proposal → counter / accept → contract → payment milestone flow
- Dispute flow: athlete or coach can flag a fact on the profile for re-verification

---

## 7. Acceptance Criteria

Tab-by-tab checklist. Each box must be checked before ship.

### Summary tab
- [ ] Hero renders headshot tile, action photo, name, jersey #, position chip, B/T H/W Age line, Follow + Watch Story + Share buttons
- [ ] NIL Verified badge renders if `athleteProfiles.nilVerified = true`
- [ ] 4-star rating renders from `athleteProfiles.athlynxStarRating`
- [ ] Coaches-Viewed-Today pill renders count from `getTickerCount` last 24h
- [ ] Current Season table shows correct columns by sport (Section 8) from latest `athleteSeasonStats`
- [ ] Career Regular Season table shows totals row from `athleteCareerStats` scope='Pro' (or HS/College)
- [ ] Bio block shows Fullname, Born/Class, Draft/Commit, College/HS, Debut, social handles
- [ ] Splits cards (Last 7 / 15 / 30) compute from `athleteSeasonStats` last N games
- [ ] Last 3 Games table renders most recent 3 rows
- [ ] Responsive: hero stacks vertically below 768px

### Stats tab
- [ ] Season-by-season table shows correct columns by sport
- [ ] Career row at bottom totals correctly
- [ ] Advanced Career Stats table renders
- [ ] Rate Stats table renders
- [ ] Columns sortable on click
- [ ] Export CSV downloads file matching visible table

### News tab
- [ ] 4-card grid renders thumbnail + date + headline
- [ ] Athlete videos, tagged news, recruiter notes interleave correctly
- [ ] View More Videos button paginates

### Awards tab
- [ ] One table per award type (All-League, POW, All-Conf, All-State, All-American, MVP, Showcase Invites)
- [ ] League Rankings table renders with `Year / Stat / Rank / Pool`
- [ ] Empty award types are suppressed (not shown empty)

### Recruiting tab
- [ ] Colleges Showing Interest grid renders ≤12 school logos
- [ ] Tapping a logo opens relationship detail panel
- [ ] Top 5 Signing Day Board has 5 slots, drag-and-drop reordering works
- [ ] Commit Lock-in button freezes board and generates Commit Card asset (1080x1350 PNG)
- [ ] Coaches Viewed Today ticker toggles day / week / month
- [ ] Visit History list renders chronologically
- [ ] Offer Log renders with school + date + scholarship type + status

### NIL tab
- [ ] Deal cards grid renders all `athleteNILDeals`
- [ ] Earnings chart shows cumulative line by month
- [ ] This Month KPI tile shows current calendar month total + delta
- [ ] Top Brands strip renders brand logos
- [ ] NIL Valuation Score renders with tooltip
- [ ] Available toggle persists to `athleteProfiles.availableForDeals`
- [ ] Brand Match queue lists inquiries newest-first

### Media tab
- [ ] Highlight Reel hero player loads and plays
- [ ] Full Game archive filterable by season
- [ ] Workout / Combine videos tagged by metric
- [ ] Photo gallery masonry layout
- [ ] Press mentions link out

### Metrics tab
- [ ] Athleticism Score radial gauge renders 0–100
- [ ] Four rank dials render with `# of N` labels
- [ ] Workout Metrics bar chart renders sport-appropriate rows
- [ ] Each metric bar shows value + percentile pill, color-graded
- [ ] Comparable Player card renders with similarity score
- [ ] Explosive Rating gauge renders sport-specific metric
- [ ] College Production trio renders for college / pre-draft athletes

### Journey tab
- [ ] Chronological event log renders with team logo + date + description
- [ ] Reverse-chrono default, toggle to chrono
- [ ] Export CSV

### Academic & Character tab
- [ ] GPA, SAT/ACT render only if athlete published
- [ ] NCAA status pill renders
- [ ] Verified coaches list renders with verification timestamps
- [ ] Community service hours render
- [ ] Published character references render

### Coach View Extras (verified coach only)
- [ ] Renders ONLY when viewer is verified coach
- [ ] Contactability pill renders
- [ ] Last Contacted date + channel render
- [ ] Recruit-list toggle persists per-coach
- [ ] Internal Notes save per-coach, invisible to athlete
- [ ] Add to Board button works

### Three Viewer gating
- [ ] Athlete viewer sees own data + edit controls, never Coach View Extras
- [ ] Coach viewer (verified) sees athlete view + Coach View Extras, never another coach's notes
- [ ] Public viewer sees the polished public face only, never internal notes or trusted circle

---

## 8. Sport-Specific Stat Schemas

Exact fields per sport. Build 2 wires these directly.

### Baseball — Hitter

Standard: `AVG, HR, RBI, OBP, SLG, OPS, SB, G, AB, H, 2B, 3B, BB, SO`

Advanced: `wOBA, wRC+, BABIP, ISO, Pull%, Hard%, ExitVeloAvg, ExitVeloMax, LaunchAngleAvg, SprintSpeed, BarrelRate`

### Baseball — Pitcher

Standard: `ERA, W, L, SV, IP, SO, WHIP, BB, H, HR, G, GS`

Advanced: `FIP, xERA, K%, BB%, GB%, FBVelo, SLVelo, CHVelo, CBVelo, SpinRateFB, SpinRateBreaking, CSW%, Stuff+`

### Football — QB

Standard: `Comp, Att, Yds, TD, INT, Rating, RushYds, RushTD`

Advanced: `YPA, AY/A, Pressure%, DeepBall%, TimeToThrow, CompPctOverExpected, ADoT`

### Football — WR

Standard: `Rec, Yds, TD, YPC, YAC, Tgt`

Advanced: `TargetShare, AirYards, aDOT, ContestedCatch%, Drop%, YardsPerRouteRun, SeparationAvg`

### Football — RB

Standard: `Att, Yds, TD, YPC, Rec, RecYds, RecTD`

Advanced: `YardsAfterContact, BrokenTackles, PressureRate, ElusiveRating, BreakawayRunRate`

### Basketball

Standard: `PTS, REB, AST, STL, BLK, FG%, 3P%, FT%, GP, MIN, TO`

Advanced: `PER, TS%, USG%, BPM, eFG%, ORtg, DRtg, WS/48`

### Soccer

Standard: `Goals, Assists, Shots, Pass%, Tackles, Saves (GK), GP, MIN`

Advanced: `xG, xA, ProgressivePasses, Pressures, KeyPasses, DribblesCompleted, DefensiveActions`

### Track & Field

Standard: Event PRs (100m, 200m, 400m, 800m, 1600m, 4x100, 4x400, LJ, HJ, TJ, Shot, Disc) with `Wind, Heat, Position`

Advanced: `PowerSpeedIndex, ReactionTime, Splits (100m / 200m / 400m), AcceleratingSpeed, TopSpeed`

---

## 9. The "Buy Them All" Note

This profile spec is designed so AthlynX can ingest data from every competitor we'll later acquire.

- Perfect Game stats — maps to `athleteSeasonStats` (baseball) with `source = 'PerfectGame'`
- MaxPreps box scores — maps to `athleteSeasonStats` (HS) with `source = 'MaxPreps'`
- Hudl video — maps to `Media tab` Full Game archive and Highlight Reel
- Catapult GPS — maps to `athleteWorkoutMetrics` (sprint, max velo, accel)
- Rapsodo pitch data — maps to `athleteWorkoutMetrics` (FB/SL/CH/CB velo + spin) and pitcher `statPayload` advanced fields
- NCSA recruit profiles — maps to `athleteOffers`, `athleteVisits`, `athleteAcademics`
- 247Sports / On3 ratings — maps to `athlynxStarRating` cross-reference
- Trackman — maps to `athleteWorkoutMetrics` (exit velo, launch angle, barrel)
- KinaTrax / motion capture — maps to `athleteWorkoutMetrics` (biomech fields, future)

Every section on this page has a column already shaped to receive a competitor's existing dataset. Build once, never rebuild.

---

## 10. Closers

**Iron Sharpens Iron — Proverbs 27:17**

****

Built by AthlynXAI Corporation for the 22 athletes who said yes first.
