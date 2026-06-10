# AthlynXAI Sport-Page Design Spec — Canonical (2026-05-19)

**Status:** LOCKED. This is the single source of truth for every sport-specific page on the AthlynXAI platform. DiamondGrind ships first as the reference implementation; all 11 other sports replicate this structure with sport-specific tokens.

**Mandate from Chad (verbatim):**
> "Did you do the demo pages but they are live inside the app not screenshots not placeholders live. Do you see this each Sport with App should look like that. This is baseball so Diamond Grind so each one looks like their respective sports and teams." + "OpenDorse Too" + (Recapp added via IMG_8776-8785)

**Quality bar:** Maven Baseball + Opendorse + Recapp. If it doesn't honor the journey, if it isn't Nike-proud, if it isn't Mama-proud — it doesn't ship.

---

## 1. Design DNA — Three Benchmarks Synthesized

| Benchmark | What we steal |
|---|---|
| **Maven Baseball** | Black canvas + sport accent color (red/baseball, blue/swim, violet/gymnastics, etc. — NEVER gold/yellow; Chad-locked X-theme). Bold sans-serif headlines ("90 minutes. Then you'll know."). 4-section narrative: Assessment → Capture → Clarity → Proof. 3D markerless mocap viewer with discipline toggle. 4 Pillar score cards with MLB/NCAA AVG benchmark bars. Build/Sharpen/Optimize/Elite tier chips. Social proof rail: "3000+ Players / 30+ Draft picks / 35 MLB All-Stars." Persistent red-pill "Get assessed" CTA. |
| **Opendorse** | "Reach 280M highly engaged sports fans" hero. Engagement comparison bars (1.9% vs 5.7%) with hard data. "Athletes drive 3x more engagement" pull-quote. "Trusted by 1000+ brands" logo wall. White-glove service flow: Scale → Activate → Measure. Campaign intake form (budget × timing × athlete tier). Report-card pattern ("NIL at Four"). |
| **Recapp Sports Highlights** | 4.8★ / 763 ratings App Store polish. Black background + sport-accent (we adapt Recapp's polish but reject its gold accent — X-theme uses sport-specific accent only). ALL-CAPS bold serif/condensed headlines: "WATCH EVERY HIGHLIGHT THAT MATTERS" / "JUMP FROM LEAGUE TO LEAGUE" / "ALL YOUR BREAKING NEWS." Phone-mock product shots with real athletes in team gear (Browns, Knicks, Inter Miami, Indiana). Persistent bottom-nav: For You / Stories / Games. Stats Hub button overlay on video. Story-card pattern with team-logo + bold headline + "Must Watch 🔥" tag. |

**Locked palette per sport (accent over black):**

| Sport | Page | Accent | Notes |
|---|---|---|---|
| Baseball | DiamondGrind | `#E63946` red | Maven's exact red |
| Softball | SoftballNation | `#FB7185` rose | Bright, distinct from baseball red |
| Lacrosse | LacrosseElite | `#7C3AED` violet | Stick + helmet motion |
| Rowing | RowingElite | `#06B6D4` cyan | Water + early-morning |
| Water Polo | WaterPoloElite | `#0EA5E9` aqua | Pool + cap colors |
| Cheer | CheerElite | `#EC4899` pink | High-energy + mat |
| Cricket | CricketElite | `#16A34A` pitch green | Boundary + crease |
| Gymnastics | GymnasticsVault | `#A855F7` violet | Elite chrome, no gold per X-theme |
| Swim | SwimSurge | `#0284C7` navy-blue | Lane lines + splash |
| Track | TrackElite | `#DC2626` red-track | Lane red + finish line |
| Field Hockey | FieldHockeyElite | `#0D9488` teal | Turf + stick |
| Baseball (public) | DiamondGrindPublic | `#E63946` red | Unauthenticated marketing |

All accents must clear WCAG AA on black background. All headlines `font-display` weight 900, ALL CAPS, tracking-tight.

**X-theme lock (Chad mandate 2026-05-19):** NO gold, NO yellow, NO amber anywhere — not in chrome, medals, accents, banners, or success states. Use sport-accent or neutral white/chrome. The X-theme is black canvas, sport-accent only, monochrome chrome.

**REAL-ONLY lock (Chad mandate 2026-05-19):** Every image, every photo, every athlete, every stat, every story, every leaderboard row, every brand logo MUST be real and live. NO placeholders. NO mock data. NO stock screenshots of other apps. NO empty shells. NO Lorem. NO 'coming soon'. NO grey rectangles where a photo should be. If we don't have it, we get it before we ship — we do not ship the lie. If a section has no data yet, the section does not render. The platform is live; the content is live.

---

## 2. Page Anatomy — 9 Required Sections (in order)

Every sport page MUST have these 9 sections, sport-themed, **live data wired (no placeholders, no Lorem)**:

### Section 1 — Sticky Header
- AthlynXAI logo (left)
- Sport name + emblem (center)
- Sport-accent pill button: **"Get Assessed →"** persistent (right)
- Mobile: collapses to logo + pill

### Section 2 — Hero
- Full-bleed sport photography (real action shot, not stock)
- Headline H1: **"90 MINUTES. THEN YOU'LL KNOW."** (Maven steal — adapt per sport)
- Sub: One sentence positioning ("The most accurate markerless mocap assessment for [sport] athletes.")
- Two CTAs: primary accent pill "Get Assessed" + ghost "See the science"
- Trust micro-rail under fold: "Trusted by [N] athletes · [N] colleges · [N] pro signings"

### Section 3 — Social Proof Rail (Maven)
3 stats, big numbers, accent color:
- `3,000+` Athletes assessed
- `30+` Draft picks signed
- `35` Pro All-Stars trained
(Replace with live counts from `metrics.public` tRPC endpoint — never hardcode.)

### Section 4 — The Assessment (Maven Section 1)
- Headline: **"THE ASSESSMENT"**
- 4-card grid, sport-specific protocol steps
- Baseball example: Intake → 3D Capture → AI Analysis → Coach Review
- Each card: icon + 12-word description + duration

### Section 5 — The Capture (Maven Section 2 — THE HERO INTERACTIVE)
- Headline: **"THE CAPTURE"**
- Embedded interactive 3D markerless mocap viewer (Three.js / React Three Fiber)
- **Discipline toggle chips** (sport-specific):
  - Baseball: Hitting / Pitching / Fielding
  - Softball: Hitting / Pitching / Defense
  - Lacrosse: Shooting / Dodging / Goalie
  - Track: Sprint / Jump / Throw
  - Swim: Free / Fly / Back / Breast
  - (etc — see `docs/specs/02-sport-classification-matrix.md`)
- Reuses `MovementDNAViewer` component from existing repo
- Empty state must show real demo skeleton, never blank canvas

### Section 6 — The Clarity / 4 Pillars (Maven Section 3)
- Headline: **"THE CLARITY"** + "Four pillars. One score."
- 4 pillar cards per discipline:
  - Baseball Hitting: Gather / Bat Path / Ground / Engine
  - Baseball Pitching: Setup / Stride / Arm / Release
  - Track Sprint: Block Drive / Acceleration / Top Speed / Maintenance
- Each card: pillar name + sample score (e.g., **82**) + horizontal bar showing **MLB AVG** and **NCAA AVG** benchmark lines
- Live: `assessment.pillarBenchmarks` tRPC call (empty? show seed demo benchmarks until first real assessment)

### Section 7 — The Proof (Maven Section 4 + Recapp Stories)
- Headline: **"THE PROOF"**
- Tier chip rail: **Build · Sharpen · Optimize · Elite** (sport-accent active state)
- 4-up story grid (Recapp "Top Stories" pattern):
  - Athlete photo + team color tag + "Must Watch 🔥"
  - Headline: "Trae Young puts on Wizards threads" style
  - 1-line context + "Watch full story" link
- Pulls live from `stories.featuredBySport(sport)` tRPC. Fall-back: 4 hand-curated showcase athletes per sport. NEVER empty.

### Section 8 — Brand / Partner Strip (Opendorse)
- Headline: **"TRUSTED BY 1,000+ BRANDS"** (use real count from CRM, or "Trusted by champions" if pre-launch)
- Logo wall: 8-12 grayscale partner logos (universities, brands, agencies)
- Sub-headline: **"Athletes drive 3× more engagement"** with two comparison bars: athletes 5.7% vs traditional influencers 1.9% (Opendorse exact stat — credit where due, or pull our own)

### Section 9 — Closing CTA + Footer
- Full-width sport-color band
- Headline: **"GET ASSESSED."** (single word, dominant)
- Sub: "90 minutes. One score. Forever changed."
- Two CTAs: "Book Assessment" (calendar embed) + "Watch the science" (video)
- Footer: legal, contact, social, app store badges (real TestFlight + Play links)

---

## 3. Technical Contract

```ts
// Every sport page lives at client/src/pages/<SportName>.tsx
// Must export a default React component named <SportName>
// Must consume the canonical hook:
import { useSportPage } from '@/hooks/useSportPage'
const { metrics, pillars, stories, partners } = useSportPage('baseball')
// All data live via tRPC. No fixtures in production paths.
```

**Shared components** (build once, reuse across 12 sports):
- `<SportHeader sport={sport} accent={accent} />`
- `<SportHero ... />`
- `<SocialProofRail counts={metrics} accent={accent} />`
- `<AssessmentGrid steps={...} accent={accent} />`
- `<MovementDNAViewer sport={sport} disciplines={[...]} />` (already exists in repo — wire it)
- `<PillarCard label score bench={{mlb,ncaa}} accent />`
- `<TierChips active accent />`
- `<StoryGrid stories={stories} accent />`
- `<BrandWall partners={partners} />`
- `<SportCTA accent calendarUrl />`

**File location:** `client/src/components/sport/` — new folder, build it.

**Tokens file:** `client/src/lib/sport-tokens.ts` — exports `SPORT_TOKENS` map: `{ baseball: { accent, headline, disciplines, pillars, partners, photoHero } }`. One file, all 12 sports declared.

---

## 4. Acceptance Gate — Per Sport

A sport page is "live" only when ALL of the following return true:

1. URL responds 200 with `<html lang>` + full HTML (no SPA shell-only blank)
2. Hero hero photo loads (no broken-img icon)
3. Movement viewer initializes (Three.js canvas mounts, no console error)
4. At least 4 stories render with real athlete data
5. At least 8 partner logos render
6. "Get Assessed" CTA opens a working flow (calendar embed or `/assessment/new`)
7. Lighthouse mobile score ≥ 85 performance, ≥ 95 accessibility
8. Screenshot diff vs Maven/Opendorse/Recapp reference shows visual parity (manual review)

**Verify gate enforcement:** GitHub Action `sport-page-verify.yml` (Task D in todo) blocks merge if any sport page fails 1-7. Item 8 is human review by Chad.

---

## 5. Build Order (parallel-safe)

| Wave | Sport | Owner | Branch |
|---|---|---|---|
| Wave 1 (ref) | Baseball (DiamondGrind) | Perplexity | `sport/baseball-canonical` |
| Wave 2 | Softball, Lacrosse, Track | Manus | `sport/<name>` |
| Wave 2 | Cricket, Cheer, Gymnastics | Perplexity | `sport/<name>` |
| Wave 3 | Swim, Water Polo, Rowing | Manus | `sport/<name>` |
| Wave 3 | Field Hockey, DiamondGrindPublic | Perplexity | `sport/<name>` |

Each wave merges to main only after Wave 1 ships and Chad reviews the baseball reference.

---

## 6. Three-Question Gate (mandatory before merging any sport page)

1. **Honor the journey?** — Does this page honor athletes who spent years to be here?
2. **Nike proud?** — Would Nike's brand team be proud to associate?
3. **Mama proud?** — Would Chad's mom be proud if this was the front door of her son's company?

If any answer is no, do not merge.

---

## 7. Anti-patterns (do not ship)

- ❌ Lorem ipsum or "Coming soon" — anywhere
- ❌ Placeholder gray rectangles where an image should be
- ❌ Stock photography that isn't sport-specific
- ❌ Screenshots used as image content (only real photography)
- ❌ Mock data, mock users, mock leaderboards, mock NIL values, mock stats
- ❌ Hardcoded "3000+" if we don't have 3000 — pull live or hide the rail
- ❌ Curated fallback stories baked into source (replaced — see Section 9)
- ❌ Empty grids with skeleton loaders that never resolve
- ❌ Movement viewer that throws and leaves blank canvas
- ❌ Generic "Sign up" CTA — must be "Get Assessed →"
- ❌ Light backgrounds — every sport page is black-canvas + accent
- ❌ Gold, yellow, amber — anywhere
- ❌ Pages without a working assessment booking flow
- ❌ Brand logo walls with fake/placeholder brand names
- ❌ Sections that render "No data yet" — hide the section instead

---

## 9. Real-Only Rendering Contract

Every sport page MUST follow this contract for live data:

1. **Hero photo** — real action photography sourced from `/sport-hero/<sport>.jpg` (CDN-backed). If the file 404s, hide the hero photo layer and use a black canvas with the accent gradient. NEVER show a broken-img icon.
2. **Social proof rail** — pull live from `metrics.publicCounts` tRPC. If count is 0, hide that stat (don't render "0 athletes"). Hide the entire rail if all three are 0.
3. **Stories grid** — pull live from `stories.featuredBySport(sport)`. If <4 real stories exist, hide the entire Proof grid. NEVER ship hardcoded fallbacks.
4. **Leaderboard** — `profile.browseAthletes({ sport })`. If 0 results, hide the leaderboard section entirely.
5. **Partner logos** — pull live from `partners.bySport(sport)` with real partner-supplied logo URLs. Hide section if <6 real partners. NEVER text-render fake brand names.
6. **Engagement bars (Opendorse)** — source: real platform analytics (`metrics.engagementBySport`). If not measured yet, hide the bars; keep the pull-quote only if we can credit a real source (Opendorse public data is permitted with citation).
7. **Athlete avatars in leaderboard** — only render `<img>` if `avatarUrl` exists. Empty avatar slots render the sport emblem in monochrome.
8. **Programs/Assessment Steps** — these ARE the product (not data). Authored copy is allowed, but every step must map to a real backend protocol.

**Render rule:** If a section's required real data is absent, the section does not render. Empty pages are honest. Lying pages are not. The Three-Question Gate fails on every untruthful pixel.

---

## 8. Reference assets in workspace

- Maven Baseball: `IMG_8946.jpeg` → `IMG_8983.jpeg` (38 screens)
- Opendorse: `IMG_8891.jpeg` → `IMG_8906.jpeg` (16 screens)
- Recapp: `IMG_8776.jpeg` → `IMG_8785.jpeg` (10 screens)
- Existing repo sport classification: `docs/specs/02-sport-classification-matrix.md`
- Athlete anatomy: `docs/specs/ATHLETE_PROFILE_REBUILD_SPEC_V2.md`
- Quality floor: `docs/specs/04-quality-bar-4-5-star.md`

---

**Lock-in:** This spec is now committed to repo at `docs/specs/SPORT_PAGE_DESIGN_SPEC.md`. Any deviation requires Chad sign-off in writing. Manus and Perplexity both build to this contract. First push wins; Chad audits both.

**Real-only enforcement:** A sport page that renders any placeholder, mock, or fake data FAILS the verify gate and reverts. The gate runs on every PR. Chad is the human auditor of last resort — if he sees a lie, the commit is reverted, no debate.
