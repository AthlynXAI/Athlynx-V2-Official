# AthlynXAI X-Factor 50+ Sport-App Service Template

**Owner:** Chad A. Dozier  
**Prepared by:** Manus AI  
**Branch:** `manus/auto-seo-roadmap`  
**Status:** PR-ready product standard for the all-in-one AthlynXAI app, Diamond Grind baseball, and future sport-service modules.

## 1. Product Decision

AthlynXAI will use the user-provided black-and-white **X-Factor** mark as the app logo and mobile icon direction for the all-in-one athlete platform. The mark should anchor the AthlynXAI iOS, Android, Apple App Store, Google Play, web, and social funnel presentation. The app is not a copy of any competitor. Maven Baseball is used only as a public market reference for broad product patterns such as assessment funnels, data scorecards, training follow-through, app access, and coach dashboards.[1] [2] [3] [4]

> The AthlynXAI standard is simple: one account, one athlete record, one connected app experience, and sport-specific modules that can scale across baseball, football, basketball, tennis, soccer, track and field, and 50+ sport/service apps.

## 2. What Was Added to the Page

The `MobileApp` page now includes an **X-Factor App Standard** section. This section shows the X-Factor app card, states that the mark becomes the master app template, and lists the sport/service portfolio chips. The hero app-store promo image now uses the supplied X-Factor mark instead of the older generic mobile preview.

| Area | Implementation |
| --- | --- |
| App hero artwork | `client/public/brand/athlynxai-xfactor-app-mark.png` |
| X-Factor app card | `client/public/brand/athlynxai-xfactor-app-card.png` |
| App icon seed | `client/public/icons/app/athlynxai-xfactor-icon.png` |
| Page updated | `client/src/pages/MobileApp.tsx` |
| Public message | “One app standard. Every sport.” |

## 3. Competitive Pattern Takeaways Without Copying

Maven Baseball’s public pages show a clean funnel pattern: assessment, app, training plan, and dashboard. Their assessment page frames a measured session with scored pillars and a prescription; their app page connects scores, drills, film, coaching, and trends; their training page turns assessment into recurring coaching and plan access; their dashboard page speaks to coaches and organizations.[1] [2] [3] [4]

AthlynXAI should not copy their language, visuals, scoring names, player proof, facility framing, or assets. The original AthlynXAI version should use its own **Proof Score**, **X-Factor Profile**, **Diamond Grind Scorecard**, **Athlete Playbook**, **NIL lane**, **Transfer Portal lane**, and **Coach View**.

| Public Pattern Observed | AthlynXAI Original Version |
| --- | --- |
| Assessment funnel | X-Factor intake and proof evaluation |
| Score categories | Sport-specific proof, skill, readiness, visibility, and consistency scorecards |
| Training follow-through | Diamond Grind and sport-specific training plans tied to athlete goals |
| App access | One all-in-one AthlynXAI account with web and mobile access |
| Coach dashboard | Team, parent, coach, recruiter, NIL, and program views |
| Social acquisition | Facebook, LinkedIn, Instagram, TikTok, YouTube, and email funnels built from AthlynXAI creative |

## 4. Core App Architecture

The X-Factor app must be a single AthlynXAI app with modular sport surfaces. Each sport gets a template, not a separate disconnected product. Every module should share account identity, athlete profile, media vault, calendar, messaging, payments, CRM tracking, analytics, and approval gates.

| Layer | Required Standard |
| --- | --- |
| Identity | One AthlynXAI account across web, iOS, Android, and future sport apps. |
| Athlete record | Profile, sport, position, class year, school, location, media, stats, academics, goals, and contacts. |
| Proof vault | Clips, verified stats, measurables, transcripts, references, schedules, awards, and offers. |
| Scorecards | Sport-specific scoring with explainable categories and parent/coach view. |
| Film room | Upload, label, compare, annotate, and share approved clips. |
| Training plan | Sport-specific practice plan, drills, recovery, nutrition, and check-ins. |
| Communication | Athlete, parent, coach, program, and brand messaging with approval controls. |
| Recruiting lane | Coach-ready profile links, outreach tracking, calendar windows, and follow-up tasks. |
| NIL lane | Brand readiness, deal intake, valuation support, content proof, contract workflow, and payment tracking. |
| Social lane | Facebook and LinkedIn funnel templates first, then Instagram, TikTok, YouTube, X, and email. |

## 5. First 50+ Sport and Service App Portfolio

The first portfolio should use sport modules plus service modules. Baseball starts as **Diamond Grind**, then the same template expands across the athlete lifecycle.

| Category | Apps / Modules |
| --- | --- |
| Core sports | Baseball, football, basketball, tennis, soccer, track and field, softball, volleyball, wrestling, golf, lacrosse, hockey, swimming, cross country, gymnastics, cheer, dance, rugby, boxing, MMA, esports, cricket, field hockey, rowing, cycling, skiing, snowboarding, skateboarding, surfing, pickleball, bowling, archery, equestrian, fencing, water polo, triathlon. |
| Athlete services | Recruiting, NIL, transfer portal, film room, training, nutrition, recovery, mental performance, academics, calendar, messaging, CRM, payments, store, ticketing, team operations, camp registration, fundraising, legal, financial, insurance, wellness, life skills. |
| Program services | Coach dashboard, roster management, parent portal, organization portal, tournament hub, camp hub, club portal, school portal, sponsor portal, brand marketplace, agent directory, advisor directory. |

## 6. Diamond Grind Baseball First Build

Diamond Grind should become the first sport module under the X-Factor standard. The module should focus on proof, development, recruiting, and NIL readiness.

| Surface | Diamond Grind Standard |
| --- | --- |
| Athlete profile | Position, handedness, grad year, school, travel team, measurables, GPA, verified links, and coach contacts. |
| Scorecard | Swing/pitching proof, consistency, measurable readiness, game context, academic readiness, and coach-ready profile completeness. |
| Film room | Short verified clips, game clips, bullpen, batting practice, fielding, base running, and coach comments. |
| Training plan | Practice focus, drill plan, recovery routine, schedule, and next evaluation. |
| Recruiting | School targets, outreach history, profile links, follow-up dates, camp schedule, and evaluation notes. |
| NIL | Athlete brand profile, content plan, local sponsor target list, offer tracking, and contract review path. |

## 7. App Store and Google Play Packaging

The X-Factor mark should be the icon direction for store packaging. App store materials must be original, clean, mobile-first, and proof-based.

| Requirement | AthlynXAI Direction |
| --- | --- |
| App name | AthlynXAI or AthlynXAI: The Athlete’s Playbook. |
| Icon | X-Factor mark, black background, white mark, safe padding for rounded app masks. |
| Subtitle | The Athlete’s Playbook. |
| Screenshots | Real AthlynXAI screens: feed, profile, Diamond Grind, recruiting, NIL, messages, calendar, coach view. |
| Privacy | Clear data policy, athlete safety, parent controls, and consent flows. |
| Store copy | Humble, direct, proof-based, no inflated claims. |
| Release path | TestFlight, Google Play closed testing, then public launch after QA and approval. |

## 8. Social Distribution Template

Facebook is the first acquisition reference because Chad found the Maven ad in the Facebook feed. AthlynXAI should build its own paid and organic funnel across Facebook and LinkedIn first, then adapt to the rest.

| Channel | First AthlynXAI Funnel |
| --- | --- |
| Facebook | Parent and athlete lead magnet for Diamond Grind profile evaluation. |
| LinkedIn | Coaches, athletic directors, trainers, advisors, brands, and investor-facing product proof. |
| Instagram | Athlete visual proof, short clips, profile wins, training rhythm. |
| TikTok | Short app demos, athlete workflow clips, Diamond Grind routines. |
| YouTube | Sport-specific app walkthroughs, coach education, family guidance. |
| X | Product updates, recruiting calendar reminders, founder/operator notes. |
| Email | Approved follow-up sequence, no outbound sends without Chad approval. |

## 9. Non-Copy Rule

AthlynXAI may study public competitor patterns, but every app, page, score, UI, image, and message must be original. The system must not import competitor copy, logos, player proof, screenshot layouts, code, pricing language, or protected media.

## 10. Next Implementation Steps

| Priority | Step |
| --- | --- |
| 1 | Keep the X-Factor section on the Mobile App page and verify the preview route after the PR branch builds. |
| 2 | Convert this template into a dedicated AthlynXAI internal product standard under `docs/specs/`. |
| 3 | Add Diamond Grind baseball as the first live sport module under the X-Factor app standard. |
| 4 | Add football, basketball, tennis, soccer, and track and field as the next sport modules. |
| 5 | Build the reusable scorecard schema, proof vault schema, social funnel schema, and CRM tags. |
| 6 | Prepare App Store and Google Play asset checklist using the X-Factor icon. |
| 7 | Only after Chad approval, connect forms, CRM writes, email queues, social scheduling, and app store submission workflows. |

## References

[1]: https://www.mavenbaseball.com/assessment "Maven Baseball Assessment"
[2]: https://www.mavenbaseball.com/app "Maven Baseball App"
[3]: https://www.mavenbaseball.com/training "Maven EDGE Training"
[4]: https://www.mavenbaseball.com/ops "Maven Dashboard"
