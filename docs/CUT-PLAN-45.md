# AthlynX — Tight 45-Page Platform Plan
**Approved by Chad A. Dozier Sr. on 2026-06-09.**

## North Star
Three surfaces — **website (athlynx.ai), iOS app, Android app** — deliver an **identical experience**, just optimized for each device. No fluff, all sizzle. 45 pages. One identity. Every athlete. Every platform.

---

## KEEP — 45 pages

### Public / Marketing (8)
1. Home
2. About
3. Pricing
4. Partners
5. FounderStory
6. InvestorHub
7. Contact
8. NotFound

### Auth (4)
9. SignIn
10. SignUp
11. ForgotPassword
12. AuthCallback

### Core Athlete OS (12)
13. Dashboard
14. Feed
15. Profile
16. AthleteDashboard
17. AthleteCard
18. AthleteJourney
19. AthletePlaybook
20. AthleteCareer
21. AthleteHealth
22. AthleteFinancial
23. Settings
24. Notifications

### NIL + Recruiting (5)
25. NILPortal
26. NILVault
27. NILCalculator
28. TransferPortal
29. RecruitingHub

### AI Bots (5)
30. AIRecruiter
31. AISales
32. AIContent
33. TrainerBot
34. WizardHub

### Sports / Brackets (5)
35. Brackets
36. DiamondGrind
37. CollegeWorldSeries2026 (Road to Omaha)
38. GridironNexus
39. AllSportsHub — replaces 30+ *Elite pages via SportElite template + sports config

### Media (3)
40. Studio
41. Podcast
42. HighlightReelStudio

### Business (3)
43. CRMCommandCenter
44. AthlynXAIMarketplace
45. AthleteStore

---

## ARCHIVE (not delete) — moved to client/src/_archive/
Everything not listed above is moved to `client/src/_archive/` so it remains in git history and can be restored at any time.

All routes for archived pages are removed from `client/src/App.tsx`.

## Mobile parity
Each of the 45 pages above maps to one screen in `mobile/app/` under Expo Router. Same data, same layout intent, native-optimized for iOS + Android. Mobile screens use the same brand tokens and the same TRPC client.
