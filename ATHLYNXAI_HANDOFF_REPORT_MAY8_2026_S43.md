# AthlynXAI — Session 43 Handoff Report
**Date:** May 8, 2026  
**Session:** S43

---

## What Was Completed This Session

### Android
| Item | Status |
|---|---|
| versionCode 12 (expo-system-ui crash fix + icon fix) | ✅ Live in Google Play Internal Testing |
| Google Play review submission (7 changes) | ✅ Submitted |
| Lee and Andrew notified via Slack + email | ✅ Done |

### iOS / TestFlight
| Item | Status |
|---|---|
| Apple Developer Program enrollment | ✅ Active (chad.dozier@icloud.com, Team R9M3A9KGLT) |
| Bundle ID registered | ✅ ai.athlynx.app |
| App Store Connect app created | ✅ AthlynXAI (App ID: 6767448150) |
| Distribution Certificate | ✅ Created (expires May 2027, Serial: 21499B3007F34774E2C466A23EEF82E0) |
| Provisioning Profile | ✅ Created (expires May 2027, ID: 635SJ8UAR8) |
| ASC API Key | ✅ Key ID: 5PTLU5B336, Issuer: ba530e88-4441-4029-bc5a-853abab91a91 |
| iOS build 15 (1.0.0) | ✅ Built with latest Xcode (iOS 26 SDK) |
| TestFlight submission | ✅ Submitted and processed |
| Core Team group created | ✅ chad.dozier@icloud.com invited |
| iOS app launch test | ⚠️ Splash screen hang — see below |

---

## Open Issue: iOS Splash Screen Hang

**Symptom:** App shows splash screen (logo on navy background) indefinitely. Never transitions to welcome/login screen.

**Root cause confirmed:** `SplashScreen.preventAutoHideAsync()` is called at module level in `_layout.tsx`. `SplashScreen.hideAsync()` is called in `useEffect` on mount — but on iOS, if the React tree has any rendering delay, the splash never hides. The `AuthContext` sets `isLoading: true` initially and calls `getMe()` (which takes ~2 seconds on prod). The splash should hide AFTER `isLoading` becomes `false`, not just on mount.

**Fix required (next session):**
1. Move `SplashScreen.hideAsync()` to fire when `isLoading === false` in AuthContext, not just on component mount
2. Add a 5-second AbortController timeout to `getMe()` as a safety net
3. Rebuild iOS (build 16) and resubmit to TestFlight

**Files to change:**
- `mobile/app/_layout.tsx` — pass `isLoading` from AuthContext and call `hideAsync` when `false`
- `mobile/lib/auth.ts` — add AbortController timeout to `getMe()`

---

## Credentials for Next Session

| Service | Value |
|---|---|
| EXPO_TOKEN | Q8RlmyiQ8G1j18UbojI-QboMriwHtoT7_q5ZR79g |
| Apple ID | chad.dozier@icloud.com |
| ASC API Key ID | 5PTLU5B336 |
| ASC Issuer ID | ba530e88-4441-4029-bc5a-853abab91a91 |
| ASC App ID | 6767448150 |
| .p8 file location | mobile/AuthKey_5PTLU5B336.p8 (in repo, gitignored) |
| Google Play Developer ID | 6790613494227463770 |
| Google Play App ID | 4975757299409089037 |

---

## Next Session Priority Order
1. Fix iOS splash screen hang (see above)
2. Rebuild iOS build 16 and resubmit to TestFlight
3. Add Andy's Apple ID to Core Team (pending — Chad will send)
4. Monitor Android versionCode 12 tester feedback from Lee
5. Complete Google Play App content forms (Content Rating, Target Audience, Data Safety, Ads, Category) to unblock production review
