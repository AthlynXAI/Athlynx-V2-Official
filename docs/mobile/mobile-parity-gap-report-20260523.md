# AthlynXAI Mobile Parity Gap Report — May 23, 2026

**Approved identity lane:** `chaddozier75@gmail.com`  
**Approved repo lane:** `chaddozier75-cmd/AthlynX-V2-Official`  
**Mobile stack:** Expo React Native  
**Goal:** Android and iOS must function like the web version for phone-first athletes.

## Current Mobile Coverage

The mobile app already includes first-party screens for feed, athlete card, highlight reel, messages, NIL, notifications, profile, recruiting, scouting, training, transfer portal, authentication, onboarding, and wizards. This gives the app a real athlete workflow foundation, but the web platform has far more routes across media, podcast, AXN, marketplace, legal, billing, community, school/team portals, and operating-system documentation.

## Immediate Parity Fix Completed

| Fix | Why It Matters |
|---|---|
| Added `mobile/app/(tabs)/media.tsx` | Gives phone users a direct Media OS / podcast surface matching the web Episode 1 launch lane. |
| Added the Media tab to `mobile/app/(tabs)/_layout.tsx` | Makes Spotify, Suno, AXN, and AthlynXAI OS continuity discoverable from Android/iOS navigation. |
| Removed the explicit `mobile/app.json` owner field while retaining the existing EAS project linkage | Fixes the EAS owner/projectId mismatch that blocked both Android and iOS builds. |

## Remaining Priority Gaps

| Priority | Gap | Mobile Target |
|---:|---|---|
| 1 | Podcast/Media OS depth | Add episode library, AXN channel hub, clips, push notifications, and episode feedback. |
| 2 | Web route parity | Group web routes into mobile hubs instead of copying every route one by one. |
| 3 | NIL/Recruiting workflows | Ensure NIL, recruiting, scouting, transfer portal, and messages share state and deep links. |
| 4 | Payments/credits | Bring billing, credits, subscriptions, and quote/request flows into mobile safely after backend proof. |
| 5 | Feedback loop | Add a simple always-visible feedback button tied to AthlynXAI OS improvement tracking. |
| 6 | Release readiness | Run Expo doctor, Android build, iOS build, and store metadata checks under the approved account. |

## Next Build Recommendation

The next mobile sprint should build a unified **Athlete OS Home** that routes athletes into Feed, Profile, Recruiting, NIL, Messages, Media OS, Training, Transfer Portal, and Feedback. That is the cleanest way to make the app feel like the web version without overwhelming phone users with hundreds of web routes.
