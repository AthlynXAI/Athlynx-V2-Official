# Social Rotation — Fix Specification
**Date:** Monday, May 11, 2026
**Repo:** `AthlyXAI/AthlynX-V2-Official`
**Cron:** `api/cron/social-post.js`
**Status:** Currently posting duplicates (image + video as separate posts) and stuck on 4 internal locks

---

## The 4 locks (root causes)

### Lock 1 — Image host returning unsigned URLs
**Symptom:** Buffer / Facebook Pages reject images because the URL is a Supabase storage URL that has expired or never received a signed token.
**Root cause:** Code passes `storage.getPublicUrl()` for a private bucket, so the URL 404s for Buffer's fetcher.
**Fix:** Switch to a `createSignedUrl(path, 60*60*24*7)` call (7-day signed link), or move social-media-bound assets into a **public** bucket explicitly named `social-public` with read-only public-access policy.

### Lock 2 — Buffer driver duplicate-fire
**Symptom:** Same caption posts to the same channel twice within minutes of each other.
**Root cause:** The cron triggers once per channel AND the `socialPostQueue` table is missing a `(channel, sourceId)` unique constraint. The cron loops `for each channel { for each scheduledPost { send } }` without checking if that post was already sent for that channel.
**Fix:**
1. Add a `social_post_log` table:
   ```sql
   CREATE TABLE social_post_log (
     id SERIAL PRIMARY KEY,
     post_source_id INTEGER NOT NULL,
     channel TEXT NOT NULL,
     external_post_id TEXT,
     posted_at TIMESTAMPTZ DEFAULT now() NOT NULL,
     UNIQUE (post_source_id, channel)
   );
   ```
2. In the cron, BEFORE calling Buffer:
   ```ts
   const already = await db.select().from(socialPostLog)
     .where(and(eq(socialPostLog.postSourceId, p.id), eq(socialPostLog.channel, ch)))
     .limit(1);
   if (already.length) continue;
   ```
3. AFTER Buffer returns success, insert the log row. UNIQUE constraint will block any race-condition duplicates.

### Lock 3 — Duplicate `postType` ("video" and "image" rendering as two posts)
**Symptom:** A single post that has BOTH an image and a video gets sent twice — once with `media_type=image`, once with `media_type=video`.
**Root cause:** The driver branches on `if (p.imageUrl) sendImage(); if (p.videoUrl) sendVideo();` — those are two independent `if`s, not an `if/else if`.
**Fix:** Change to a single decision based on the `postMediaType` enum already in your schema (`drizzle/schema.ts:27`):
```ts
switch (p.mediaType) {
  case "video":   await buffer.sendVideo(p);   break;
  case "image":   await buffer.sendImage(p);   break;
  case "gallery": await buffer.sendGallery(p); break;
  case "none":    await buffer.sendText(p);    break;
}
```
Never send both. If a post legitimately needs both (e.g., a teaser image AND a full video), it should be modeled as two separate `posts` rows with different `postType` values, not one row with both fields populated.

### Lock 4 — Time-slot collision
**Symptom:** Two posts scheduled in the same 5-minute window both fire, and Buffer rate-limits one.
**Root cause:** Cron runs every 5 minutes; queue picks `WHERE scheduledFor <= now()` without spacing logic.
**Fix:** Add a per-channel `min_interval_minutes` config (e.g., Instagram = 45 min, X = 15 min, Facebook Pages = 30 min). Before sending to channel C, check:
```ts
const lastChannelPost = await db.select().from(socialPostLog)
  .where(eq(socialPostLog.channel, ch))
  .orderBy(desc(socialPostLog.postedAt))
  .limit(1);
if (lastChannelPost.length && minutesSince(lastChannelPost[0].postedAt) < intervalFor(ch)) continue;
```

---

## The duplicate-with-video-and-images bug — explicit fix

The bug Chad described as "duplicate post with video AND images" is **Lock 3 above**. The single-line root cause in pseudo-code:

```ts
// CURRENT (broken):
if (post.imageUrl) await buffer.upload(post.imageUrl, "image");
if (post.videoUrl) await buffer.upload(post.videoUrl, "video");

// FIXED:
const media = post.mediaType ?? inferMediaType(post);
await buffer.upload(post[`${media}Url`], media);
```

---

## Implementation plan

1. **Branch:** `fix/social-rotation-v2`
2. **Files to touch:**
   - `drizzle/schema.ts` — add `social_post_log` table
   - `drizzle/migrations/00XX_social_post_log.sql` — generated
   - `api/cron/social-post.js` source (probably in `server/cron/socialPost.ts` before compilation) — switch logic + dedup check + interval check
   - `server/config/socialChannels.ts` — add `minIntervalMinutes` per channel
3. **Test plan:**
   - Local: stub Buffer client, simulate two concurrent cron invocations on the same post — verify only ONE log row written.
   - Stage: deploy to Vercel preview, schedule 3 posts in the same 5-min window across 3 channels, verify spacing.
4. **Ship:** Merge `fix/social-rotation-v2` to `main`, redeploy `athlynx-platform` on Vercel.

---

## Owner / next action

This is a developer task, not a Computer task — the codebase requires a `pnpm install` and local dev environment to test. **Recommendation:** Send this spec to your developer (whoever holds `retired-non-chad-lane` access, after you verify it's you or a trusted human). They can ship the fix in 2–4 hours.

If you do not have a developer ready, the **interim mitigation** is to **disable the cron** so it stops duplicating:

1. Open Vercel → `athlynx-platform` → Settings → Cron Jobs
2. Find the `/api/cron/social-post` job and toggle it OFF
3. Manually post from Buffer until the fix ships

This stops the bleeding within 5 minutes.

---

*Iron Sharpens Iron — Proverbs 27:17*
