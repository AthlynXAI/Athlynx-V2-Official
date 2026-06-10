# AthlynX QA Bug Tracker — Live
**Owner:** Chad A. Dozier · QA crew running page-by-page through 5/11/2026 week
**Format:** Add new bugs to the top. Computer triages, root-causes, writes the fix spec, hands back to dev.
**Status legend:** 🔴 Open · 🟡 Spec'd / awaiting dev · 🟢 Shipped · ⚪ Need info

---

## BUG-001 · NIL Portal · "Post" button does nothing 🟡 SPEC'D

**Reported:** Monday 5/11/2026 9:55 AM CDT by Chad's QA crew
**Page:** `athlynx.ai` → NIL Portal → Feed tab
**Steps to reproduce:**
1. Log into AthlynXAI
2. Navigate to NIL Portal
3. Type "testing" into the composer
4. Click the blue Post button
5. **Nothing happens.** No toast, no error, no new post in the feed, no spinner.

**Root cause (pinned to exact lines):**
- File: `client/src/pages/NILPortal.tsx` line 51
- The composer uses `trpc.feed.createPost.useMutation({ onSuccess: ... })` and **does not pass an `onError` handler**.
- The backend handler at `server/routers/feedRouter.ts` (compiled to `api/index.js:199721`) is a `protectedProcedure` — it requires `ctx.user` to exist and throws `UNAUTHORIZED` if the request has no authenticated session.
- When the user is unauthenticated (or the auth cookie is stale), the click fires the mutation, the server throws, the error is swallowed silently because no `onError` is wired. The user sees nothing.
- Compare to `client/src/pages/Feed.tsx` line 359 — the main Feed page **does** have an `onError` callback that shows a toast. NIL Portal's `FeedTab` is missing it.

**The fix (one-file change):**
```tsx
// client/src/pages/NILPortal.tsx — line 51
const createPost = trpc.feed.createPost.useMutation({
  onSuccess: () => {
    setPostText("");
    utils.feed.getFeed.invalidate();
    toast.success("Posted!");
  },
  onError: (err) => {
    // UNAUTHORIZED, BAD_REQUEST, INTERNAL_SERVER_ERROR — all surface here
    toast.error(err.message || "Failed to post. Please try again.");
  },
});
```

**Second fix (probable real cause — auth session not propagating to NIL Portal):**
The NIL Portal composer is gated on `if (user)` in the JSX (line 60). The screenshot shows the composer IS visible (user = LM Marshall, posting "testing"), meaning the client thinks LM is logged in. So the LIKELY underlying problem is the tRPC client is sending the request without the auth cookie/header, the backend rejects it as UNAUTHORIZED, and the silent-swallow hides it from LM.

**Diagnostic next step for the dev:**
1. Open DevTools → Network tab on athlynx.ai
2. Reproduce the click
3. Look for the `/api/trpc/feed.createPost` POST — what status code? (Expecting 401 or 403)
4. Check the request headers — is the `cookie` header being sent? Is the `authorization` header set?
5. If 401 with no cookie: the auth provider isn't injecting the session into the tRPC client. Check `client/src/lib/trpc.ts` or wherever `httpBatchLink` is configured — confirm `credentials: "include"` is on.
6. If 401 WITH cookie: the cookie is expired or the server can't validate it. Check the auth middleware in `server/middleware/auth.ts` (or equivalent).

**Acceptance criteria for the dev:**
- Click "Post" with text → toast appears (success or error, never silent)
- Logged-in user posting valid text → post lands in `posts` table, feed refreshes, toast says "Posted!"
- Logged-out user clicking Post → composer should be hidden (current guard works), but as belt-and-suspenders, an `onError` toast must always exist

**Owner:** Dev (whoever holds `retired-non-chad-lane` / Chad's verified dev account)
**ETA after dev picks up:** 30 minutes (10 min to add `onError`, 20 min to debug auth propagation if needed)

---

## BUG-002 · Messenger · "No conversations yet" with no obvious next step ⚪ NEED INFO

**Reported:** Monday 5/11/2026 (screenshots from QA crew, ~9:45 AM CDT)
**Page:** `athlynx.ai` → NIL Messenger
**What was seen:** Empty Messenger panel, "No conversations yet" + "Start a conversation" button. The "Search conversations…" and "User ID or name…" fields are present.
**Question for crew:** Did clicking "+ Start a conversation" do anything? Does typing a known username in "User ID or name…" find a user? This may be a duplicate of BUG-001 (same auth-token issue) or it may be working-as-designed (truly empty because only 1 user is in the system).
**Action:** Need 1 reproduction screenshot of what happens AFTER clicking "+ Start a conversation."

---

## BUG-003 · YouTube channel housekeeping 🟢 USER ACTION COMPLETE (per screenshots)

**Reported:** Monday 5/11/2026 9:45 AM CDT
**What was seen across screenshots:**
- Channel previously named just "AthlynXAI"
- Renamed to "AthlynXAI—The Complete Athlete Ecosystem"
- Toast at bottom confirms "Name changed"
- Handle: `@AthlynXAI` (correct)
- Description: "AthlynX — The Complete Athlete Ecosystem…"
- Stats: 1 subscriber, 19 videos
- Linked website: dozierholdingsgroup.com
**Status:** This is a YouTube-side change, not an app bug. Already executed. No code work needed.

**Two cleanup recommendations:**
1. The linked website is `dozierholdingsgroup.com` — should it be `athlynx.ai` instead? Faster path for new YouTube viewers to find the product.
2. The pinned post on the channel does not exist yet — when the founder-story video drops (per Week-1 Acquisition Playbook channel #1), pin it to the channel.

---

## BUG-004 · Profile section "has to be perfect" 🟡 SPEC ALREADY DELIVERED

**Reported:** Monday 5/11/2026 9:56 AM CDT — Chad confirmed: "the profile section has to be perfect I gave you that on list too"
**Status:** The full PlayerProfiler/MLB.com-grade rebuild spec was delivered earlier today as `athlynx_profile_rebuild_spec` — 929 lines, 48 KB, saved at `/home/user/workspace/ATHLETE_PROFILE_REBUILD_SPEC.md`.

**What's in the spec (re-anchoring for the crew):**
- 8 sections covering north star (manifesto-grounded), 3 personas, 14-subsection IA, full visual design system, 5 new DB tables with SQL, tiered trust/verification model, 3 sequenced builds with acceptance criteria
- 5 open questions reserved for Chad — those are the only decisions still pending
- "The athlete profile is not a feature — it is the journey honored on a page" runs through the three-question gate

**What "perfect" means in this spec:**
- Build 1 (Restyle) ships current pages on the new visual system — 4-6 hours dev work
- Build 2 (Feature Completion) adds the 5 missing pieces: journey events timeline, season stats per sport, highlight videos with chapters, NIL deals page, camps/trusted-circle social graph — 2-3 days dev work
- Build 3 (Verification Layer) adds the tiered trust badge system and dispute flow — 3-5 days dev work

**Action for the crew this week:**
1. Read the spec end-to-end
2. Pull up each existing athlete profile page in the live app
3. For every section, mark it against the spec's acceptance criteria as Pass / Fail / Missing
4. File any failures as new bugs in this tracker (BUG-005, BUG-006, etc.)
5. Chad answers the 5 open questions at the bottom of the spec so Build 1 can start

**Owner:** QA crew (audit pass), then Chad (5 decisions), then dev (Build 1)

---

## How to add new bugs (template for the crew)

```
## BUG-XXX · [Page] · [One-line description] 🔴 OPEN

**Reported:** [Date] [Time] by [Name]
**Page:** [URL or app section]
**Steps to reproduce:**
1.
2.
3.

**Expected:**
**Actual:**
**Screenshots:** [paste or attach]
**Severity:** Blocker / Major / Minor / Polish
```

Drop new entries at the top of the file above BUG-001 (keep newest first). I'll triage, root-cause, and write the fix spec within the same session.

---

*Iron Sharpens Iron — Proverbs 27:17*
**
