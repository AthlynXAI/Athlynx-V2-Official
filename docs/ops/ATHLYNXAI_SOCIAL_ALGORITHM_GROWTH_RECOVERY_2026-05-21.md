# AthlynXAI Social Algorithm Growth Recovery — May 21, 2026

**Owner:** Chad A. Dozier  
**Operating lane:** `chaddozier75@gmail.com / chaddozier75-cmd`  
**Status:** Distribution loop repaired in code; remaining production posting still requires live Buffer/Zapier authentication to be valid.

## Executive diagnosis

The growth drop is real. The LinkedIn screenshot shows **386 profile appearances**, down **53%** over the last 7 days. The source mix proves the problem is distribution-led: **Posts drive 84.7%** of appearances, while comments drive **10.6%**, network recommendations **3.6%**, and search only **1%**. When Zapier/Buffer failed, the highest-leverage appearance source broke.

The AthlynXAI growth report shows **0 new profile claims** and **14 total athlete profiles**. The dashboard also shows **Landing → Signup CTA clicks** and **Signup page → Profile claims** as **Instrumentation pending**, which means social reach is not yet tied to profile-claim conversion.

## What was wrong technically

The Social OS had several overlapping posting lanes: scheduled queue worker, direct Buffer GraphQL router, Zapier LinkedIn route, and Buffer/Zapier MCP scripts. The key failure point was the queue worker behavior: when Buffer/Zapier/auth failed, rows were marked `failed` and **not retried automatically**. That meant distribution could silently die even after credentials were later repaired.

## Code fix applied

`server/jobs/socialPostsWorker.ts` now retries recoverable failed rows after an auth repair. Failed posts with attempts below `SOCIAL_POST_MAX_RETRY_ATTEMPTS` are picked up again, duplicate errors are excluded, and successful retries clear the previous error field.

This does **not** bypass the owner kill switch. All outbound posting still flows through `checkSocialPostingGuard()` and requires `SOCIAL_POSTING_ENABLED=true`.

## Platform algorithm recovery rules

| Platform | What the algorithm rewards | AthlynXAI action |
|---|---|---|
| LinkedIn | Founder voice, meaningful comments, carousels/PDFs, dwell time, first-hour discussion. | 3–4 posts weekly from Chad’s voice; no link in body; link in first comment; 15–20 meaningful comments daily. |
| Instagram | Reels, shares/DMs, saves, watch time, original vertical content, keywords. | Daily or near-daily 15–30 sec Reels; strong 3-sec hook; link in bio; Stories daily. |
| Facebook | Reels, meaningful comments, shares, parent/community discussion, native video. | Daily Reels during recovery; parent/coach community posts; pinned profile-claim post. |
| TikTok | Completion rate, rewatches, niche consistency, authentic short videos, captions/keywords. | Daily short sports-tech/athlete videos; fast hooks; no recycled watermarked content. |
| YouTube Shorts | Viewed-vs-swiped rate, completion, loopability, title/SEO relevance. | 3–5 Shorts weekly; pinned comment CTA; NIL/recruiting education clips. |
| X/Twitter | Replies, engagement velocity, niche authority, founder takes, native video. | 70/30 reply strategy; 3–5 posts daily; AI tokenization + NIL + sports-tech threads. |
| Google Business | Local trust, updates, offers, events, clear business relevance. | 2–3 posts weekly; no hashtags; link to profile claim/demo page. |

## Required posting cadence

| Channel | Recovery cadence | Notes |
|---|---:|---|
| LinkedIn | 3–4x/week | Personal founder perspective; never generic AI copy. |
| Instagram accounts | 1 Reel/day/account max | No external links in caption; bio link only. |
| Facebook pages | 1 Reel/day/page during recovery | Mix parent, athlete, coach, and community messages. |
| X/Twitter | 2–3x/day | Founder voice, fast commentary, 1–2 hashtags max. |
| TikTok | 1/day/account | Video only; hook in first 2 seconds. |
| YouTube Shorts | 3–5/week | Pinned comment with UTM profile-claim link. |
| Google Business | 2–3/week | Business update, event, or offer only. |

## First-hour algorithm protocol

Every post gets a first-hour engagement push. Chad or the team must spend 15 minutes engaging before posting, then 30–60 minutes responding after posting. For LinkedIn and X, thoughtful comments on target accounts matter almost as much as original posts. For Instagram, Facebook, TikTok, and YouTube Shorts, the key early signals are watch time, comments, saves, shares, and replies.

## Social-to-profile-claim conversion system

Every social post must route to one measurable conversion path:

`social post → UTM link / bio link / pinned comment → profile claim landing page → signup → claim profile → first Studio asset → referral credit`

Required UTM format:

```text
https://athlynx.ai/signup?utm_source={platform}&utm_medium=social&utm_campaign=profile_claim_recovery&utm_content={post_slug}
```

## Immediate offer

Launch the **First 100 Verified Athletes** campaign:

> Claim your AthlynXAI profile, get starter AI credits, generate your first athlete media card, and invite teammates to earn more credits.

This turns reach into a measurable profile-claim loop instead of leaving attention on the social platform.

## Non-negotiable monitoring

The daily owner report must stop saying `Instrumentation pending`. The required metrics are:

| Metric | Required status |
|---|---|
| Landing page views by source | Must be tracked. |
| CTA clicks by platform | Must be tracked. |
| Signup starts | Must be tracked. |
| Signup completions | Must be tracked. |
| Profile claims | Must be tracked. |
| Day-1 Studio opens | Already tracked; must be activated. |
| Day 2–7 returning profiles | Already tracked; must be activated. |
| Failed social posts by platform | Must trigger owner alert. |

## Recovery principle

Do not post blindly. Do not spray one generic message everywhere. The algorithm fix is **native platform behavior + reliable automation + measurable profile-claim conversion**.
