# AthlynXAI — Vimeo Video Flow CI Gate

Pre-merge integration tests that block the `rebase → main` merge if the
Vimeo video flow regresses. Lives in `.github/workflows/vimeo-video-flow.yml`
and runs on every PR targeting `main`.

## What it verifies

| Step | Endpoint | What breaks if it fails |
|------|----------|--------------------------|
| 1. Auth sanity | `GET /me` | Token revoked, scope removed, or auth header builder broken |
| 2. Existing videos | `GET /videos/{id}` for each ID in `VIMEO_TEST_VIDEO_IDS` | Player schema drift, deleted assets, lookup logic regression |
| 3. Upload simulation | `POST /me/videos` (tus init) + `HEAD` on upload link + `DELETE` cleanup | Upload scope missing, quota issue, tus endpoint unreachable |
| 4. Player config | `GET https://player.vimeo.com/video/{id}/config` | HLS manifest missing, CDN routing broken — playback dies on device |

Any 4xx or 5xx anywhere fails the job. Full response bodies (status, headers,
JSON) are written to `vimeo-logs/` and uploaded as a workflow artifact named
`vimeo-response-logs-<run_id>`. On PR failures, a comment is auto-posted with
the failed step(s) inline.

## One-time setup

### 1. Repo secrets — `Settings → Secrets and variables → Actions → Secrets`

| Name | Required | Notes |
|------|----------|-------|
| `VIMEO_ACCESS_TOKEN` | ✅ | Personal access token with `public`, `private`, `video_files`, `upload`, `edit`, `delete` scopes. Generate at https://developer.vimeo.com/apps |
| `VIMEO_CLIENT_ID` | optional | Only needed if you later swap to the client-credentials flow |
| `VIMEO_CLIENT_SECRET` | optional | Same as above |

### 2. Repo variables — `Settings → Secrets and variables → Actions → Variables`

| Name | Required | Example |
|------|----------|---------|
| `VIMEO_TEST_VIDEO_IDS` | ✅ | `123456789,987654321` — comma-separated, 2–5 stable production video IDs |
| `VIMEO_TEST_FOLDER_ID` | optional | Folder ID to drop CI-created placeholder videos into (they're deleted within the same run, but this keeps the root library tidy) |

### 3. Branch protection

See `.github/workflows/branch-protection-notes.md` — add
`Vimeo video flow regression check` as a required status check on `main`.

## Running locally

```bash
cd athlynx-vimeo-ci
export VIMEO_ACCESS_TOKEN=...                 # same token as the secret
export VIMEO_TEST_VIDEO_IDS=123456789,987654321
export LOG_DIR=$(pwd)/vimeo-logs

npm run vimeo:all                             # runs all four steps in order
# or, individually:
npm run vimeo:auth
npm run vimeo:validate
npm run vimeo:upload
npm run vimeo:player
```

Logs land in `vimeo-logs/<step>-<random>.json` — same format as CI.

## Debugging a failed run

1. Open the failed PR → "Checks" tab → "Vimeo video flow regression check"
2. Read the inline `::error::` line for the failing step
3. Expand the **Full response body** group in the log
4. For deeper inspection, download the `vimeo-response-logs-<run_id>` artifact —
   each `.json` file has the full status, headers, request ID, rate-limit
   counter, and parsed body
5. The Vimeo `x-request-id` header in each log is what to paste into a
   Vimeo support ticket if their side is the problem

## Common failure modes

| Symptom | Likely cause |
|---------|--------------|
| Step 1 fails with 401 | Token expired or scopes changed — regenerate at developer.vimeo.com |
| Step 2 fails with 404 | Video deleted in Vimeo dashboard — update `VIMEO_TEST_VIDEO_IDS` |
| Step 3 fails with 403 on POST | Token missing `upload` scope |
| Step 3 cleanup warns but step passes | Token missing `delete` scope — you can ignore for now but library will accumulate `ci-rebase-smoke-*` videos |
| Step 4 returns 200 but no HLS CDNs | Video still transcoding — pick a fully-processed video for `VIMEO_TEST_VIDEO_IDS` |
| Workflow doesn't trigger on PR | PR is still a draft — mark it "Ready for review" |

## Files

```
athlynx-vimeo-ci/
├── .github/workflows/
│   ├── vimeo-video-flow.yml          # the workflow itself
│   └── branch-protection-notes.md    # how to make it a required check
├── scripts/
│   ├── _vimeo-client.js              # shared HTTP + logging helper
│   ├── vimeo-check-auth.js           # step 1
│   ├── vimeo-validate-videos.js      # step 2
│   ├── vimeo-simulate-upload.js      # step 3
│   └── vimeo-verify-player.js        # step 4
├── package.json                      # npm scripts for local runs
└── README.md
```

## Notes for the rebase PR

- The workflow only runs when files under `src/**`, `app/**`, `lib/vimeo/**`,
  the scripts, or the workflow itself change. README/doc-only PRs skip it.
- `concurrency` is keyed per branch, so pushing a new commit cancels the
  prior run for the same PR — no wasted minutes.
- Total runtime: ~30–60 seconds when Vimeo is healthy.
