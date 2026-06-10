# Build Monitor — AthlynXAI mobile pipeline

A Vercel-native dashboard + API that tracks the Expo EAS Android APK pipeline
for `ai.athlynx.app`. Apple is reported as **pending** until an Apple Developer
account exists.

## What it does

- Polls EAS for the most recent Android builds (live or mock).
- Parses Gradle / Prebuild / shell logs for known failure signatures:
  - `.execute()` Gradle deprecation (the recurring AthlynXAI APK crash)
  - `A problem occurred evaluating project ':app'`
  - `providers.exec` misuse
  - generic Gradle `BUILD FAILED` / `Execution failed for task`
  - failed shell commands (`exit code N`)
  - Google Play `10091` errors
- Detects 10091 spikes over a configurable window/threshold.
- Appends each build (idempotently, keyed on `buildId`) to a private Google
  Sheet so progress survives agentic crashes and Vercel cold starts.
- Fires Slack and/or email alerts on the latest failure when configured.

## Routes

| URL | Auth | Purpose |
|---|---|---|
| `/admin/build-monitor` | admin | Dashboard (also `/build-monitor`) |
| `/api/trpc/buildMonitor.getConfig` | public | Dry-run flags + config summary |
| `/api/trpc/buildMonitor.selfTest` | public | Synthetic parser/spike check |
| `/api/trpc/buildMonitor.getStatus` | admin | Recent builds + parsed signals |
| `/api/trpc/buildMonitor.getBuildLog` | admin | Single-build log + parse |
| `/api/trpc/buildMonitor.logHistory` | admin | Idempotent Sheets append |
| `/api/trpc/buildMonitor.alertOnLatestFailure` | admin | Send Slack/email alert |

## Environment variables

All optional — every component degrades to dry-run/mock if its credentials are
missing, so the dashboard always renders.

| Var | Required for | Notes |
|---|---|---|
| `EXPO_TOKEN` | live EAS data | Personal access token from expo.dev |
| `EAS_PROJECT_ID` | live EAS data | `extra.eas.projectId` from `mobile/app.json` |
| `EAS_APP_PACKAGE` | display | Defaults to `ai.athlynx.app` |
| `EAS_DRY_RUN` | force mock | Set to `1` to disable live calls |
| `GOOGLE_SHEETS_SERVICE_ACCOUNT_JSON` | Sheets append | Full JSON or base64 of a GCP service-account key. Share the target sheet with the service account's `client_email`. |
| `GOOGLE_SHEETS_BUILD_LOG_ID` | Sheets append | The spreadsheet ID |
| `GOOGLE_SHEETS_BUILD_LOG_TAB` | Sheets append | Default: `BuildHistory` |
| `GOOGLE_SHEETS_DRY_RUN` | force no-op | Set to `1` to disable writes |
| `SLACK_WEBHOOK_URL` | Slack alerts | Incoming webhook |
| `BUILD_ALERT_EMAIL` | email alerts | Routed via existing SES (`AWS_*`) or SendGrid fallback |
| `GOOGLE_PLAY_ACCOUNT` | display | Default: `chaddozier75@gmail.com` |

## Self-test

```
npm run build-monitor:selftest
```

Forces dry-run and validates parser, EAS mock, sheets no-op, and 10091 spike
detection. Exits 0 on PASS / 1 on FAIL. No credentials needed.

## Crash-resume / serverless safety

- All durable state lives in the Google Sheet (keyed on `buildId`).
- `logHistory` reads existing IDs before appending so repeated polls/retries
  cannot create duplicates.
- Token exchange is in-memory cached but re-acquired on cold start.
- Outbound API calls use 3× exponential-backoff retry on 5xx/429.
- No local-disk persistence is required in production.

## Production safety

- The dashboard does not introduce any new app-router middleware and does not
  touch the existing `mobile/` Expo project.
- The generated `mobile/android` folder is unchanged and continues to be
  ignored by `.gitignore` per S41.
- No credentials are hardcoded; everything is env-sourced and falls back to
  mock cleanly when missing.
