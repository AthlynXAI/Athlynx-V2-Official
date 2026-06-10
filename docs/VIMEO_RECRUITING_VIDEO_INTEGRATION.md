# Vimeo Recruiting Video Integration

This branch adds a server-mediated Vimeo upload path for athlete recruiting videos. No Vimeo secrets are committed to source control.

## Required Runtime Secrets

| Variable | Purpose | Notes |
|---|---|---|
| `VIMEO_ACCESS_TOKEN` | Server-side Vimeo API token | Must include `upload` and `edit` scopes. Never expose to the browser. |
| `VIMEO_ALLOWED_DOMAINS` | Comma-separated embed whitelist | Defaults to `athlynx.ai,www.athlynx.ai`. |
| `VIMEO_VIEW_PRIVACY` | Vimeo view privacy | Defaults to `disable`; `unlisted` is also supported if the account plan allows it. |

## Flow

The client asks `media.createVimeoUpload` for a Vimeo Tus upload ticket. The server creates the Vimeo placeholder with domain-whitelisted embed privacy and returns only the safe upload link. The client uploads the file directly to Vimeo via Tus, then calls `media.completeVimeoUpload` so AthlynXAI saves the player URL, Vimeo ID, thumbnail, privacy, and processing status in the existing `recruitingVideos` profile array. If Vimeo is not configured, the UI falls back to the existing S3/R2 upload path.

## Safety Rules

Vimeo tokens stay server-side. Athlete browsers and mobile apps never receive the raw Vimeo token. Deleting a Vimeo-backed video from an AthlynXAI profile removes it from the profile list only; deleting the source asset from Chad’s Vimeo account should remain an explicit owner/admin action.
