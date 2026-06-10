# AUDIT_TYPECHECK.md — TypeScript Compilation Report

> Audit date: May 2026

---

## Root / Web Project (npx tsc --noEmit)

### Installation
```
npm install --no-audit --no-fund --ignore-scripts
→ added 1346 packages
```

### Result: **34 TypeScript Errors**

Full error list:

```
client/src/components/SportXHub.tsx(1009,22): error TS2304: Cannot find name 'Briefcase'.
client/src/components/ui/chart.tsx(107,3): error TS2339: Property 'payload' does not exist on type ...
client/src/components/ui/chart.tsx(112,3): error TS2339: Property 'label' does not exist on type ...
client/src/components/ui/chart.tsx(181,19): error TS7006: Parameter 'item' implicitly has an 'any' type.
client/src/components/ui/chart.tsx(182,17): error TS7006: Parameter 'item' implicitly has an 'any' type.
client/src/components/ui/chart.tsx(182,23): error TS7006: Parameter 'index' implicitly has an 'any' type.
client/src/components/ui/chart.tsx(260,39): error TS2344: Type '"payload" | "verticalAlign"' does not satisfy...
client/src/components/ui/chart.tsx(266,17): error TS2339: Property 'length' does not exist on type '{}'.
client/src/components/ui/chart.tsx(279,10): error TS2339: Property 'filter' does not exist on type '{}'.
client/src/components/ui/chart.tsx(279,17): error TS7006: Parameter 'item' implicitly has an 'any' type.
client/src/components/ui/chart.tsx(280,14): error TS7006: Parameter 'item' implicitly has an 'any' type.
client/src/pages/AgentOwnership.tsx(169,41): error TS2802: Type 'Set<string>' can only be iterated through
                                             when using the '--downlevelIteration' flag or 'es2015' target.
client/src/pages/AthleteCard.tsx(19,3):  error TS2305: Module '"lucide-react"' has no exported member 'Instagram'.
client/src/pages/AthleteCard.tsx(19,14): error TS2305: Module '"lucide-react"' has no exported member 'Twitter'.
client/src/pages/AthleteCard.tsx(19,23): error TS2305: Module '"lucide-react"' has no exported member 'Youtube'.
client/src/pages/AthletePublicProfile.tsx(18,14): error TS2300: Duplicate identifier 'Share2'.
client/src/pages/AthletePublicProfile.tsx(23,3):  error TS2300: Duplicate identifier 'ExternalLink'.
client/src/pages/AthletePublicProfile.tsx(23,17): error TS2300: Duplicate identifier 'Camera'.
client/src/pages/AthletePublicProfile.tsx(23,25): error TS2300: Duplicate identifier 'Share2'.
client/src/pages/AthletePublicProfile.tsx(23,47): error TS2300: Duplicate identifier 'ExternalLink'.
client/src/pages/AthletePublicProfile.tsx(26,15): error TS2300: Duplicate identifier 'Camera'.
client/src/pages/AthletePublicProfile.tsx(381,24): error TS2304: Cannot find name 'utils'.
client/src/pages/Contact.tsx(5,24):    error TS2300: Duplicate identifier 'ExternalLink'.
client/src/pages/Contact.tsx(5,111):   error TS2300: Duplicate identifier 'ExternalLink'.
client/src/pages/HighlightReelStudio.tsx(20,39): error TS2305: Module '"lucide-react"' has no exported member 'Instagram'.
client/src/pages/HighlightReelStudio.tsx(20,50): error TS2305: Module '"lucide-react"' has no exported member 'Twitter'.
client/src/pages/NotificationCenter.tsx(69,5):   error TS2769: No overload matches this call.
                                                  [onError deprecated in tRPC v11]
client/src/pages/NotificationCenter.tsx(83,43):   error TS7006: Parameter 'n' implicitly has an 'any' type.
client/src/pages/NotificationCenter.tsx(91,40):   error TS7006: Parameter 'n' implicitly has an 'any' type.
client/src/pages/NotificationCenter.tsx(168,46):  error TS7006: Parameter 'notif' implicitly has an 'any' type.
client/src/pages/NotificationCenter.tsx(168,53):  error TS7006: Parameter 'i' implicitly has an 'any' type.
server/routers/profileRouter.ts(56,45): error TS2339: Property 'recruitingVideos' does not exist on type ...
server/routers/profileRouter.ts(57,44): error TS2339: Property 'filmRoomEnabled' does not exist on type ...
server/routers/profileRouter.ts(58,44): error TS2339: Property 'totalVideoViews' does not exist on type ...
```

**Total: 34 errors across 9 files**

---

## Analysis of Critical Errors

### 1. `AthleteCard.tsx:19` — Missing lucide-react icons (RUNTIME CRASH)
```ts
import { Instagram, Twitter, Youtube } from "lucide-react";
```
These icons were removed from lucide-react in a breaking version update. **This page will crash on load** with a JavaScript runtime error because the imports resolve to `undefined`.

### 2. `AthletePublicProfile.tsx:18–26` — Duplicate imports (RUNTIME CRASH)
`Share2`, `ExternalLink`, and `Camera` are imported twice from two different sources. TypeScript refuses to compile this. The page will fail.

### 3. `AthletePublicProfile.tsx:381` — `utils` is undefined (RUNTIME CRASH)
```ts
onSuccess: () => { utils.profile.getPublicProfile.invalidate(); ... }
```
`utils` is declared at the top of another function in the same file but not in the scope where `updateCover` mutation is defined. This will throw at runtime when a user updates their cover photo.

### 4. `server/routers/profileRouter.ts:56–58` — Schema/router mismatch (SERVER CRASH)
The profileRouter tries to select `athleteProfiles.recruitingVideos`, `filmRoomEnabled`, and `totalVideoViews` from the database table, but these columns **do not exist in `drizzle/schema.ts`**. Every call to `getProfile` will throw a PostgreSQL `column not found` error. **The profile page for any athlete will return a 500.**

### 5. `NotificationCenter.tsx:69` — Deprecated `onError` option in tRPC v11
`onError` was removed from `useQuery` options in tRPC v11. The TypeScript error indicates the component was written against an older API. It may work at runtime due to tRPC ignoring unknown options, but it's a sign of stale code.

### 6. `chart.tsx` — 7 errors in the shared chart component
This component is used across dashboards. The typing is broken relative to the installed recharts version. Charts that use `payload` or `label` props may silently render incorrectly.

### 7. `Contact.tsx:5` — Duplicate `ExternalLink` import
Duplicate identifier — this page may crash.

### 8. `HighlightReelStudio.tsx:20` — Missing lucide-react icons
Same as AthleteCard — Instagram and Twitter icons removed from current lucide-react. This page crashes on load.

---

## Mobile Project (cd mobile && npx tsc --noEmit)

### Installation
```
npm install → added 771 packages
```

### Result: **0 TypeScript Errors — Mobile TypeScript passes**

```
Exit code: 0
```

The mobile codebase is TypeScript-clean. The React Native / Expo TypeScript config is functioning correctly.

---

## Summary

| Project | TS Errors | Pages That Will Crash |
|---------|-----------|----------------------|
| Web (client + server) | **34 errors** | AthleteCard, AthletePublicProfile, HighlightReelStudio, Contact (import issues); Profile router (server 500 on all profile views) |
| Mobile | **0 errors** | None from TypeScript |

### Build Note
TypeScript errors do **not** block the Vite build (`vite build` uses esbuild which does not type-check). The app will build and deploy with these errors. They only manifest as runtime crashes. **The build will "succeed" even though the code is broken.**
