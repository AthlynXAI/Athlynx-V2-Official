# AUDIT_FAKES.md — Athlynx-V2 Fake / Mock / Stub Inventory

> Audit date: May 2026 | Auditor: Automated deep-read of source  
> Every finding is cited by file:line.

---

## BLOCKER — Revenue Path is Fake or Broken

### B-1: AthleteStore checkout is an email link, not Stripe
**File:** `client/src/pages/AthleteStore.tsx:140–144`  
The "Buy Now" button opens `mailto:cdozier14@athlynx.ai` with a composed order email. The comment literally says "Build Stripe checkout URL" but the implementation is an email. No Stripe Checkout Session is created. **Products with prices shown (servers, GPU cloud, merch) cannot be purchased.**

```ts
// Line 141-144
const emailBody = `I'd like to purchase:\n\n${itemsDesc}\n\nTotal: $${...}`;
window.open(`mailto:cdozier14@athlynx.ai?subject=Athlete Store Order&body=...`, "_blank");
```

### B-2: BrowseAthletes shows 12 hardcoded fake athletes when DB is empty
**File:** `client/src/pages/BrowseAthletes.tsx:41–67`  
`SHOWCASE_ATHLETES` is a hardcoded array of 12 fictional athletes (Marcus Johnson, Destiny Williams, Tyler Brooks, etc.) with fake NIL values and recruiting scores. The code reads: `const sourceAthletes = dbAthletes.length > 0 ? dbAthletes : SHOWCASE_ATHLETES;` — meaning any new deployment with zero real users shows fiction as if it were real.

### B-3: RankingsHub uses MOCK_DRAFTS — no real data source
**File:** `client/src/pages/RankingsHub.tsx:67, 174`  
Draft picks are hardcoded in a `MOCK_DRAFTS` constant. No API call. No database. Shown to all users.

### B-4: AgentFinder lists fake agents with invented deal totals
**File:** `client/src/pages/AgentFinder.tsx:24–134`  
`AGENTS` array contains 5+ fake agents: "Marcus Thompson" ($142M deals), "Keisha Williams" ($89M), etc. These are presented as real registered agents on the platform. No backend lookup. No real agent sign-up flow.

### B-5: AthleteLeagalHub (note: filename typo) lists fake agents and endorsement deals
**File:** `client/src/pages/AthleteLeagalHub.tsx:44–79`  
`AGENTS` and `ENDORSEMENT_DEALS` are hardcoded arrays: "Marcus Williams" (NFLPA, $180M+), "Jennifer Park" (NBPA, $420M+), etc. None of these are real. Presented as the platform's attorney/agent directory.

### B-6: MediaRouter returns a placeholder URL when S3 is not configured
**File:** `server/routers/mediaRouter.ts:48–53`  
```ts
// Fallback: return a mock URL for development
publicUrl: `https://athlynx.ai/placeholder-video.mp4`,
fallback: true,
```
When `AWS_ACCESS_KEY_ID` or `AWS_SECRET_ACCESS_KEY` are missing, **all video upload requests silently return a non-existent URL**. No error is thrown to the user. This means the highlight reel upload flow in production silently fails with a fake URL.

---

## MAJOR — Core Feature Uses Fake Data

### M-1: NotificationCenter shows DEMO_NOTIFICATIONS when no real notifications exist
**File:** `client/src/pages/NotificationCenter.tsx:38–81`  
```ts
const rawNotifs = (liveNotifs && liveNotifs.length > 0) ? liveNotifs : DEMO_NOTIFICATIONS;
```
New users see 8 fake notifications including "Coach Williams Viewed Your Profile" (a fake LSU coach) and fabricated credit events.

### M-2: AthleteDataDashboard shows DEMO_EVENTS when calendar is empty
**File:** `client/src/pages/AthleteDataDashboard.tsx:75–83`  
```ts
const DEMO_EVENTS = [...]
const displayEvents = (myEvents as any[]).length > 0 ? myEvents : DEMO_EVENTS;
```

### M-3: AIScoutingReport has SAMPLE_ATHLETES pre-populated
**File:** `client/src/pages/AIScoutingReport.tsx:25, 68`  
`SAMPLE_ATHLETES` array with fake athlete names, schools, and stats shown as example data.

### M-4: HighlightReelStudio shows SAMPLE_REELS — no real video storage wired up
**File:** `client/src/pages/HighlightReelStudio.tsx:25–90`  
`SAMPLE_REELS` with "Marcus Williams", "DeShawn T.", "Carlos R." — fictional athletes. The upload functionality links to the broken S3 fallback (see B-6 above).

### M-5: Mobile Highlight Reel screen shows hardcoded SAMPLE_REELS
**File:** `mobile/app/(tabs)/highlight-reel.tsx:21–57`  
```ts
const SAMPLE_REELS = [
  { id: 1, title: "2025 Season Highlights — QB Marcus J.", ... views: 1240 },
  { id: 2, title: "Spring Training Reel — DeShawn T.", ... views: 890 },
  { id: 3, title: "Recruiting Video — Carlos R.", ... views: 2100 },
];
```
**Zero tRPC calls in this screen.** Entire highlight reel tab in the mobile app shows fake content only.

### M-6: connectionsRouter injects fake seed coaches into real results
**File:** `server/routers/connectionsRouter.ts:120–128`  
```ts
// Also include seed coaches if not enough real ones
const seedCoaches = [
  { id: -1, name: "Coach Davis", school: "NFL Scout · Dallas Cowboys", ... },
  { id: -2, name: "Coach Williams", school: "NCAA D1 Recruiter", ... },
  { id: -3, name: "NIL Agency Pro", school: "Certified NIL Agent", ... },
  { id: -4, name: "Coach Johnson", school: "Perfect Game Scout", ... },
];
const allCoaches = [...coaches, ...seedCoaches].slice(0, input.limit);
```
**Fake coaches with negative IDs are served to every user** alongside real data. Any user clicking on Coach Davis (id: -1) will crash or get no profile.

### M-7: AthleteLegal lists fake attorneys and state NIL laws (static, not authoritative)
**File:** `client/src/pages/AthleteLegal.tsx:79–135`  
Array of 6 fake attorneys with no real contact info. State NIL laws array is static and likely outdated.

### M-8: AgentOwnership page lists fake "AGENTS" owned by Athlynx
**File:** `client/src/pages/AgentOwnership.tsx:31–139`  
Hardcoded agent IP asset list presented as live platform content.

### M-9: AthleteFinancial shows fake financial advisors
**File:** `client/src/pages/AthleteFinancial.tsx:63–107`  
`ADVISORS` array of fictional certified financial planners.

### M-10: AthleteCareer shows fake "MENTORS"
**File:** `client/src/pages/AthleteCareer.tsx:119–154`  
Hardcoded `MENTORS` array with fake ex-NFL/NBA/WNBA names.

### M-11: AthleteHealth shows fake health professionals directory
**File:** `client/src/pages/AthleteHealth.tsx:81–153`  
`PROFESSIONALS` array — fictional sports medicine doctors, trainers, etc.

### M-12: AthletePublicProfile crashes at runtime due to missing `utils` variable
**File:** `client/src/pages/AthletePublicProfile.tsx:381`  
TypeScript error: `Cannot find name 'utils'`. The `updateCover` mutation's `onSuccess` calls `utils.profile.getPublicProfile.invalidate()` but `utils` is never declared in that scope. **This page will throw a runtime error** when a user updates their cover photo.

### M-13: Marketplace products are hardcoded, no Stripe product IDs
**File:** `client/src/pages/Marketplace.tsx:18–200`  
`PRODUCTS` constant includes ~30+ items (servers, GPU cloud, NIL gear). The page wires to `trpc.stripe.createProductCheckout` but the products in the array have no real Stripe `price_id` fields — they pass `price_data` inline. There is also no `createProductCheckout` endpoint in the Stripe router (checked: `stripeRouter.ts` only has `createSubscriptionCheckout` and `createCreditsCheckout`). **This will 500 on every product purchase.**

### M-14: AthleteStore has hardcoded PRODUCTS — all purchases are email, not Stripe
**File:** `client/src/pages/AthleteStore.tsx:71–140`  
Comment says "Real store. Real checkout. Real brands." at line 4. Reality: all purchases open an email to `cdozier14@athlynx.ai`. Not a store.

---

## MINOR — Cosmetic or Informational Stubs

### m-1: ComingSoon.tsx — intentional, used as landing for features not yet built
**File:** `client/src/pages/ComingSoon.tsx`  
Page exists but is never actually routed to in App.tsx (no `component={ComingSoon}` routes found). Exists as a standalone page at `/coming-soon`.

### m-2: CommunitySoon.tsx — intentional placeholder with email capture
**File:** `client/src/pages/CommunitySoon.tsx`  
Email capture form does nothing — no backend POST, just sets `joined = true` locally. The email never reaches the server.

### m-3: Partners.tsx tech stack table claims all services are "LIVE"
**File:** `client/src/pages/Partners.tsx`  
Every row in `TECH_STACK` has `status: "LIVE"` including Railway, PlanetScale, Resend, RunSun Cloud, Cloudflare. Some of these (e.g. Railway, Resend, Cloudflare) have no code integrations in the codebase. Marketing page only, but misleading.

### m-4: ProjectManagement.tsx lists future DHG businesses as planned
**File:** `client/src/pages/ProjectManagement.tsx`  
Visible internal project tracker showing unbuilt companies (VC Technology, The VIRT, Uma Real Estate, Villa Agape, etc.) with `status: "planned"` exposed to the public via routing.

### m-5: BuildMonitor contains a sample build log for testing
**File:** `server/routers/buildMonitorRouter.ts:206–228`  
`const sampleLog = \`Setup...\`` — a static string used in `parseBuildLog(sampleLog)` in production code.

### m-6: About.tsx TEAM array contains only 2 real entries
**File:** `client/src/pages/About.tsx:13`  
Static team array — no CMS or backend.

### m-7: AthleteJourney, AthletePlaybook stats are made-up
**Files:** `client/src/pages/AthleteJourney.tsx:109`, `client/src/pages/AthletePlaybook.tsx:133`  
Static `STATS` arrays with numbers like "50,000+ Athletes", "3,200+ Coaches" — no real data backing.

### m-8: Autopost Buffer token hardcoded as fallback
**File:** `server/routers/autoPostRouter.ts:185`  
```ts
const token = process.env.BUFFER_ACCESS_TOKEN || "BUFFER_TOKEN_***REDACTED***";
```
Real Buffer access token is baked into source code as a fallback. This is a live credential in git history.

---

## Summary Count

| Severity | Count | Examples |
|----------|-------|---------|
| BLOCKER  | 6     | AthleteStore email checkout, BrowseAthletes fake athletes, MediaRouter placeholder URL |
| MAJOR    | 14    | Fake coaches in API, fake notifications, fake agents, fake advisors |
| MINOR    | 8     | Coming soon email form does nothing, hardcoded stats |
