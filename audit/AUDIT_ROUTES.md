# AUDIT_ROUTES.md — Route & Page Classification

> Legend: **REAL** = actual functionality with backend wiring | **STUB** = UI only, no backend | **FAKE** = hardcoded data shown as real | **COMING_SOON** = intentional placeholder | **ADMIN-ONLY** = restricted access  
> tRPC call count in parentheses.

---

## Server Routers (server/routers/)

All 28 routers found. No router has explicit TODO or "not implemented" throws. Issues noted below.

| Router | Endpoints | Issues |
|--------|-----------|--------|
| `adminRouter.ts` | 11 | Clean. Auth-checked. |
| `aiCommandRouter.ts` | 10 | Clean. |
| `aiRouter.ts` | 21 | `scheduleToBuffer` requires `BUFFER_ACCESS_TOKEN` — throws if missing. Contains hardcoded Buffer channel IDs. |
| `autoPostRouter.ts` | 3 | Clean logic but hardcoded Buffer token fallback (live credential in source). |
| `buildMonitorRouter.ts` | 6 | Contains a hardcoded sample build log string used in production code at line 206. |
| `calendarRouter.ts` | 5 | Clean. |
| `concreatorRouter.ts` | 7 | Clean. |
| `connectionsRouter.ts` | 8 | **FAKE DATA:** Appends 4 fake seed coaches (IDs: -1 through -4) to every coach list query. |
| `crmRouter.ts` | 20 | Clean. Most comprehensive router. |
| `customAuthRouter.ts` | 7 | Clean. |
| `dataRouter.ts` | 5 | Clean. |
| `expirationRouter.ts` | 3 | Clean. |
| `feedRouter.ts` | 6 | Clean. |
| `feedbackRouter.ts` | 16 | Clean. |
| `investorRouter.ts` | 2 | Clean. |
| `licensingRouter.ts` | 5 | Clean. |
| `mediaRouter.ts` | 6 | **BROKEN:** Returns `{ publicUrl: "https://athlynx.ai/placeholder-video.mp4", fallback: true }` when S3 not configured. No client error thrown. |
| `messagingRouter.ts` | 3 | Clean. |
| `messengerRouter.ts` | 4 | Clean. |
| `nilRouter.ts` | 7 | Clean. Encryption used. |
| `notificationsRouter.ts` | 7 | Clean. |
| `profileRouter.ts` | 7 | **SCHEMA MISMATCH:** References `athleteProfiles.recruitingVideos`, `.filmRoomEnabled`, `.totalVideoViews` — columns that do not exist in `drizzle/schema.ts`. Runtime crash on `getProfile` queries. |
| `pushRouter.ts` | 4 | Clean. |
| `socialRouter.ts` | 6 | Clean. |
| `storiesRouter.ts` | 4 | Clean. |
| `trainingRouter.ts` | 3 | Clean. |
| `verificationRouter.ts` | 2 | Clean. |
| `waitlistRouter.ts` | 2 | Clean. |
| `stripeRouter.ts` | ~8 | **MISSING:** `createProductCheckout` called from Marketplace page but does not exist. Clean for subscription/credits flow. |

---

## Client Pages (client/src/pages/) — 192 Pages

### REAL (functional, wired to backend)

| Page | tRPC Calls | Notes |
|------|-----------|-------|
| Feed.tsx | 6 | Feed, stories, likes, comments |
| MessengerApp.tsx | 5 | Real conversations, messages, start DM |
| Messages.tsx | 5 | Alias/duplicate of MessengerApp |
| Profile.tsx | 10 | Full profile + AI chat + social publish |
| AITrainingBot.tsx | 3 | trainerChat, trainerHistory, trainerClear |
| AIRecruiter.tsx | 4 | AI recruiter tools wired |
| AISales.tsx | 4 | AI sales tools wired |
| AIContent.tsx | 4 | Social content generation wired |
| AIScoutingReport.tsx | 4 | AI scouting wired (but shows SAMPLE_ATHLETES) |
| Billing.tsx | 2 | Subscription status + portal wired |
| Pricing.tsx | 3 | Stripe checkout wired |
| NILPortal.tsx | 5 | Feed + messaging + NIL wired |
| TransferPortal.tsx | 2 | DB athletes + AI eligibility check |
| AdminDashboard.tsx | 9 | Admin tools wired |
| AdminCRM.tsx | 8 | CRM wired |
| AdminBroadcast.tsx | 3 | Broadcast wired |
| AdminUsers.tsx | 4 | User management wired |
| Dashboard.tsx | 13 | Main dashboard wired |
| WarriorsPlaybook.tsx | 8 | Training + AI wired |
| SocialCommandCenter.tsx | 5 | Social posting wired |
| NILVault.tsx | 2 | NIL deal queries |
| AthleteCalendar.tsx | 4 | Calendar wired |
| CFactorHub.tsx | 3 | X-Factor score + connections wired |
| Settings.tsx | 4 | Profile settings wired |
| SignIn.tsx | 2 | Auth wired |
| SignUp.tsx | 4 | Auth + waitlist wired |
| BrowseAthletes.tsx | 1 | Real query but falls back to fake athletes |
| NotificationCenter.tsx | 2 | Real but falls back to DEMO_NOTIFICATIONS |

### STUB (UI exists, no backend, no real data)

| Page | tRPC Calls | Issue |
|------|-----------|-------|
| AthleteDashboard.tsx | 0 | **STUB.** All NIL deals, stats, and insights are hardcoded constants. |
| NILMarketplace.tsx | 0 | **STUB.** All deals hardcoded (Nike, Gatorade, etc.). No real brand marketplace. |
| RecruitingHub.tsx | 0 | **STUB.** All content hardcoded. No real coach/school data. |
| Training.tsx | 0 | **STUB.** All workout plans, trainers, gyms hardcoded. No DB. |
| Onboarding.tsx | 0 | **STUB.** No backend onboarding flow wired. |
| AthleteCard.tsx | 0 | **STUB + BROKEN.** Imports `Instagram`, `Twitter`, `Youtube` from lucide-react — these icons don't exist. Page crashes on load. |
| AthletePublicProfile.tsx | 5 | **BROKEN.** `utils` not in scope at line 381. Page crashes on cover photo update. Duplicate identifier imports (Share2, ExternalLink, Camera). |
| BitcoinMining.tsx | 0 | STUB. No crypto/mining backend. |
| Robotics.tsx | 1 | STUB. One AI chat call; rest is hardcoded scenarios. |
| FuelBots.tsx | 0 | STUB. Hardcoded bots and scenarios. |
| TokenFactory.tsx | 0 | STUB. Credit system UI but no purchase flow wired to Stripe. |
| NILCalculator.tsx | 0 | Frontend calculator only (by design, acceptable). |
| AthleteWebsiteBuilder.tsx | 0 | STUB. Templates exist but no actual site generation. |
| HighlightReelStudio.tsx | 2 | STUB. Shows SAMPLE_REELS. Uploads go to broken S3 fallback. |
| Careers.tsx | 0 | STUB. No job application backend. |
| EmployeePortal.tsx | 2 | PARTIAL. Minimal real calls. |
| EmpireVision.tsx | 0 | STUB. Marketing page. |
| DHGEmpire.tsx | 0 | STUB. Marketing page. |
| SigningDay.tsx | 0 | STUB. No backend. |
| EliteEvents.tsx | 0 | STUB. No event system. |
| BookingHub.tsx | 0 | STUB. No booking backend. |
| MobileApp.tsx | 0 | Marketing page for app download. |
| Studio.tsx | 0 | STUB. No media studio backend. |
| RankingsHub.tsx | 1 | **FAKE.** Draft picks are `MOCK_DRAFTS` constant. |
| AgentFinder.tsx | 0 | **FAKE.** All agents hardcoded. |
| AgentOwnership.tsx | 0 | **FAKE.** Agent IP assets hardcoded. |
| AthleteLeagalHub.tsx (typo in filename) | 0 | **FAKE.** Agents, endorsement deals all hardcoded. |
| AthleteLegal.tsx | 0 | **FAKE.** Attorneys hardcoded. |
| AthleteFinancial.tsx | 0 | **FAKE.** Financial advisors hardcoded. |
| AthleteHealth.tsx | 0 | **FAKE.** Health professionals hardcoded. |
| AthleteCareer.tsx | 0 | **FAKE.** Mentors hardcoded. |
| AthleteStore.tsx | 0 | **FAKE CHECKOUT.** Products hardcoded, checkout is `mailto:`. |
| Marketplace.tsx | 1 | **BROKEN.** Calls `createProductCheckout` which doesn't exist. |
| AthlynxBrowser.tsx | 0 | STUB. In-app browser shell. |
| SchoolPage.tsx | 0 | STUB. No school data backend. |
| SchoolBranding.tsx | 0 | STUB. |
| WhiteLabel.tsx | 0 | STUB. White-label features not implemented. |
| WizardHub.tsx + wizards/*.tsx | 0 | STUB. Wizard UI with AI forms — no backend flow. |
| TheVirt.tsx | 0 | STUB. Crypto/metaverse concept page. |
| VCTech.tsx | 0 | STUB. |
| DataCenters.tsx | 0 | STUB. |
| Infrastructure.tsx | 0 | STUB. |
| InfrastructureManager.tsx | 0 | STUB. |
| Podcast.tsx | 0 | STUB. |
| Music.tsx | 0 | STUB. |
| Faith.tsx | 0 | STUB (some AI wired). |
| Mindset.tsx | 0 | STUB. |
| Medical.tsx | 0 | STUB. |
| WellnessPortal.tsx | 0 | STUB. |
| Veterans.tsx | 0 | STUB. |
| MilitaryDivision.tsx | 0 | STUB. |

### COMING_SOON (intentional)

| Page | Notes |
|------|-------|
| ComingSoon.tsx | Intentional — generic placeholder |
| CommunitySoon.tsx | Email capture but form doesn't POST to server |
| ChadCard.tsx | Coming soon feature |

### ADMIN-ONLY

| Page | Notes |
|------|-------|
| AdminDashboard.tsx | Email-gated to owner/admin |
| AdminCRM.tsx | Admin only |
| AdminBroadcast.tsx | Admin only |
| AdminUsers.tsx | Admin only |
| AdminExpiry.tsx | Admin only |
| MasterAdmin.tsx | Admin only |
| BuildMonitor.tsx | Admin only |
| CRMCommandCenter.tsx | Admin only |
| CRMDashboard.tsx | Admin only |
| InvestorHub.tsx | Admin only |
| InvestorDeck.tsx | Admin only |

### MARKETING / INFORMATIONAL (no interactivity expected)

| Pages (partial list) | 
|---------------------|
| Home.tsx, LandingPage.tsx, About.tsx, Team.tsx, Founders.tsx, FounderStory.tsx, FounderDedication.tsx, DHG.tsx, DHGHome.tsx, DHGCorporate.tsx, Partners.tsx, Contact.tsx, TermsOfService.tsx, PrivacyPolicy.tsx, HIPAACompliance.tsx, LegalHub.tsx, LegalCompliance.tsx, Capabilities.tsx, Platform.tsx, Journey.tsx, WarriorsPlaybook.tsx (partial), UNIFIED_IDENTITY.md, etc. |

---

## Mobile Screens (mobile/app/)

| Screen | tRPC/API Calls | Classification |
|--------|---------------|----------------|
| `(auth)/login.tsx` | uses AuthContext (Supabase Auth) | REAL |
| `(auth)/register.tsx` | uses AuthContext | REAL |
| `(auth)/welcome.tsx` | 0 | STUB — welcome splash |
| `(auth)/onboarding.tsx` | 0 | STUB — onboarding UI only |
| `(tabs)/index.tsx` (Feed) | uses `feedApi` | REAL |
| `(tabs)/nil.tsx` | uses `nilApi` | REAL |
| `(tabs)/training.tsx` | uses `trainingApi` | REAL |
| `(tabs)/messages.tsx` | uses `messagingApi` | REAL |
| `(tabs)/notifications.tsx` | uses `notificationsApi` | REAL |
| `(tabs)/profile.tsx` | uses `profileApi` | REAL |
| `(tabs)/recruiting.tsx` | uses `profileApi.searchAthletes` | REAL (basic) |
| `(tabs)/scouting.tsx` | 0 tRPC found in scan | STUB — no API calls confirmed |
| `(tabs)/transfer-portal.tsx` | REST calls via api lib | REAL |
| `(tabs)/athlete-card.tsx` | uses `profileApi` | REAL |
| `(tabs)/highlight-reel.tsx` | 0 | **STUB — shows SAMPLE_REELS only** |
| `contexts/AuthContext.tsx` | Supabase Auth auth | REAL |

### Mobile Push Notifications
**NOT IMPLEMENTED.** There is no APNs or FCM integration. The mobile app polls for notifications via REST. No real-time push delivery on iOS or Android.

---

## Key Missing Routes (no page exists)
- `/checkout/success` — PaymentSuccess.tsx exists but `/checkout/success` not routed
- `/checkout/cancel` — Not found
- No dedicated post-trial-expiry forced upgrade page beyond `TrialExpired.tsx`
