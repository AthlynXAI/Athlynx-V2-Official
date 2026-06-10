# ATHLYNX AI — HANDOFF REPORT
## Session 40 — May 6, 2026
---

## ⚡ FIRST THING EVERY SESSION — DO THIS BEFORE ANYTHING ELSE
```bash
cd /home/ubuntu/athlynxai_repo  # or wherever you cloned the repo
bash scripts/session-start.sh
```
This pulls latest, hardens all 16 server routers, and runs a build check. **If build fails, fix it before pushing anything.**

---

## PLATFORM STATUS
| Item | Status |
|---|---|
| **athlynx.ai** | LIVE ✅ |
| **Latest Commit** | `683326e` — S40 native mobile app pushed |
| **Build** | PASSING — web platform unchanged |
| **Total Pages** | 180 client pages (web) |
| **GitHub** | AthlyXAI/Athlynx-V2-Official · main branch |
| **Deploy** | git push → GitHub → Vercel auto-deploys |

---

## WHAT WAS DONE IN S40

### 1. GOOGLE PLAY CONSOLE — 11/11 COMPLETE ✅
- **App Name:** AthlynXAI
- **Package:** `ai.athlynx.app`
- **App ID:** `4975757299409089037`
- **Developer Account:** chaddozier75@gmail.com (Athlynx The Athlete's Financial Playbook)
- **Status:** Draft — all 11 required sections complete
- **Store listing saved:** Description, icon, feature graphic, screenshots

| Section | Status |
|---|---|
| Privacy Policy | ✅ https://athlynx.ai/privacy |
| App Access | ✅ Login credentials provided |
| Ads | ✅ No ads |
| Content Rating | ✅ IARC rated (Social, 12+) |
| Target Audience | ✅ 18+ |
| Data Safety | ✅ Name, Email, User IDs, Phone, Messages |
| Government Apps | ✅ Not a government app |
| Financial Features | ✅ No financial features |
| Health | ✅ No health features |
| App Category & Contact | ✅ Sports · cdozier14@athlynx.ai · +16014985282 |
| Store Listing | ✅ Full description, icon, feature graphic, screenshots |

**NEXT STEPS FOR GOOGLE PLAY TO GO LIVE:**
1. Upload signed APK/AAB (see Section 3 below)
2. Run closed test with 12+ testers for 14 days
3. Apply for production access

---

### 2. NATIVE MOBILE APP BUILT ✅
**Location:** `AthlyXAI/Athlynx-V2-Official/mobile/`

**Screens built:**
- `welcome.tsx` — Onboarding with brand stats, feature pills, CTA
- `login.tsx` — Email/password auth via live athlynx.ai API
- `register.tsx` — Registration with sport selection
- `(tabs)/index.tsx` — X-Factor Feed (real-time posts, likes, comments)
- `(tabs)/recruiting.tsx` — Athlete search with sport filters
- `(tabs)/nil.tsx` — NIL marketplace + my deals + create deal
- `(tabs)/messages.tsx` — Conversations list
- `(tabs)/profile.tsx` — X-Factor score ring, stats, NIL value, social links

**Tech stack:**
- Expo 53 / React Native 0.76
- expo-router (file-based navigation)
- expo-secure-store (session cookie storage)
- Live tRPC API: `https://athlynx.ai/api/trpc`
- Dark navy/blue AthlynXAI brand theme

**Key files:**
- `mobile/app.json` — Package: `ai.athlynx.app`, bundle: `ai.athlynx.app`
- `mobile/eas.json` — EAS Build config (preview = APK, production = APK)
- `mobile/lib/api.ts` — All API calls (feed, profile, NIL, messaging, AI)
- `mobile/lib/auth.ts` — Login/register/logout/getMe
- `mobile/lib/theme.ts` — Colors, Typography, Spacing constants
- `mobile/contexts/AuthContext.tsx` — Global auth state

---

### 3. EAS BUILD — NEEDS EXPO ACCOUNT LOGIN
To build the signed APK, you need to:

**Option A — EAS Cloud Build (recommended):**
```bash
cd /home/ubuntu/athlynxai-mobile/app  # or clone the mobile/ folder
pnpm install
eas login  # Login with your Expo account (create one at expo.dev if needed)
eas build --platform android --profile preview
```
This produces a signed APK downloadable from expo.dev (~15-20 min build time).

**Option B — Local build (requires Android SDK):**
```bash
cd mobile/
pnpm install
npx expo run:android --variant release
```

**Expo Account needed:** Create at https://expo.dev — free account works.
After login, run `eas build` and it will:
1. Auto-generate an Android keystore
2. Build the signed APK on Expo's servers
3. Give you a download URL

**Then upload the APK to Google Play:**
- Go to https://play.google.com/console/u/1/developers/6790613494227463770/app/4975757299409089037/tracks/internal
- Upload the APK → Create release → Review → Start rollout

---

### 4. APPLE APP STORE — NOT STARTED
Apple Developer Program enrollment still needed:
- Go to https://developer.apple.com/enroll
- Sign in with your Apple ID
- Select "Enroll as Organization"
- Your Apple Business Manager org is already verified (ID: `149833785256532752`)
- Cost: $99/year
- After enrollment, use EAS to build iOS IPA: `eas build --platform ios`

---

## CHAD'S ACTION ITEMS (Require you directly)
| # | Action | Where |
|---|---|---|
| 1 | Create Expo account | https://expo.dev (free) |
| 2 | Run `eas login` + `eas build --platform android --profile preview` | In `mobile/` directory |
| 3 | Upload APK to Google Play closed test track | play.google.com/console |
| 4 | Add 12 testers to closed test | Play Console → Testing → Internal testing |
| 5 | Enroll in Apple Developer Program | https://developer.apple.com/enroll ($99/yr) |
| 6 | Lee Marshall production test | Log in as `leronious@gmail.com` at `athlynx.ai` |
| 7 | Run live Stripe $0.50 test | `athlynx.ai/billing` |

---

## SESSION 41 — WHAT TO BUILD NEXT
1. **Complete mobile app screens:**
   - Training/Stats tracker
   - AI Scouting Report screen
   - Notifications screen
   - Transfer Portal screen
   - Highlight Reel Studio
   - Athlete Card (public profile)
2. **DHG Corporate Page (`/dhg`)** — Full Dozier Holdings Group page
3. **Onboarding Flow** — Sport/position/school onboarding with credits reward
4. **Credits Display in Header** — Show current credit balance in top nav
5. **Profile photo upload** — Wire S3 presigned URL for avatar upload in mobile app
6. **The Athlete Playbook section** — Recruiting presence + global athlete connect

---

## ALL OWNED DOMAINS (All pointing to athlynx.ai via Vercel)
| Domain | Routes To |
|---|---|
| athlynx.ai | Main platform |
| athlynx.pro | `/pro-teams` |
| athlynx.net | `/portal` |
| athlynx.io | `/portal` |
| nilportals.com | `/nil-portal` |
| nilportal.ai | `/nil-portal` |
| nilgateway.com | `/nil-marketplace` |
| nilgateway.org | `/nil-marketplace` |
| transferportal.live | `/transfer-portal` |
| transferportal360.com | `/transfer-portal` |
| dozierholdingsgroup.com | `/dhg` |

---

## CRITICAL RULES — NEVER CHANGE
- **NEVER run `manus-config save-config`** — disables all connectors
- **DNS for athlynx.ai → Vercel only** — never Cloudflare proxy
- **Deploy pipeline:** Manus sandbox → `git push` → GitHub `main` → Vercel auto-deploy
- **Stripe → AthlynXAI Corporation only** (`acct_1SqfS0GvvjXZw2uE`)
- **Chad A. Dozier Sr. = MASTER ADMIN** — only admin. Partners get full access, NOT admin
- **Always push ALL code to GitHub before ending session**
- **Home page — DO NOT MODIFY** (locked since S30)
- **Build locally first** — `npm run build:vercel` must pass before pushing
- **NO yellow** on any AthlynXAI branded materials — `#0066ff` blue and `#00c2ff` cyan only
- **Nothing stays in the sandbox** — all work must be pushed to GitHub
- **Run `bash scripts/session-start.sh` at the start of every session**
- **Mobile app package name is `ai.athlynx.app`** — NEVER change this

---

## KEY CREDENTIALS
| Item | Value |
|---|---|
| Master Admin | cdozier14@athlynx.ai |
| GitHub Repo | AthlyXAI/Athlynx-V2-Official |
| Vercel Project | athlynx-platform (team: AthlynxChad) |
| Vercel Project ID | prj_eL4LkEdQ3LJ9J4Jlt50b0jef9CsU |
| Vercel Team ID | team_7neDSatyrDspOku2p0LxT8zO |
| Neon DB Project | empty-lake-01820888 |
| Stripe Account | acct_1SqfS0GvvjXZw2uE (AthlynXAI Corporation) |
| Google Play App ID | 4975757299409089037 |
| Google Play Package | ai.athlynx.app |
| Google Play Account | chaddozier75@gmail.com |
| Apple BM Org ID | 149833785256532752 |
| Gemini API Key | AIza***REDACTED*** |
| Stripe Webhook Secret | [redacted Stripe webhook secret] |

---

*Iron Sharpens Iron — Proverbs 27:17*
**Chad A. Dozier Sr. — Founder & CEO, AthlynXAI Corporation**
A Dozier Holdings Group Company · Houston, TX · Founded November 2024
