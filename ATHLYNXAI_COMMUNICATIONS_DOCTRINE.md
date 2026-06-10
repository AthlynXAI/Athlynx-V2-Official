# AthlynXAI Permanent Communications Doctrine

**Owner:** Chad A. Dozier  
**Status:** Permanent operating rule  
**Scope:** AthlynXAI Social OS, Buffer, Zapier, Instagram, Facebook Pages, LinkedIn, X/Twitter, Threads, email lanes, and any future public communications automation.

## Core rule

AthlynXAI social publishing is allowed to be automated only after the owner approves a complete content package. A complete content package includes the exact media asset, caption, destination list, platform format, and account identity. Once approved, the system may publish that package one time per approved destination and must block duplicate content by default.

Email is different. **No email may be sent automatically.** Emails may be drafted, organized, searched, summarized, or prepared, but final sending remains manual and requires explicit owner approval inside the active session.

## Permanent operating boundaries

| Lane | Allowed automation | Hard stop |
|---|---|---|
| Social posts | Publish one approved content package one time per approved destination. | Do not repost the same image, video, caption, hash, or creative unless the owner explicitly approves a repost. |
| Instagram | Media-only posts using valid image or video format, posted only to verified active accounts. | Do not post text-only feed content, disabled-account content, duplicate media, or unsupported formats. |
| Facebook Page | Owner-approved text/media posts only through verified page routing. | Do not post to personal, deprecated, or unverified pages. |
| LinkedIn | Owner-approved company/profile updates only through verified routing. | Do not post employment, legal, or partnership claims unless confirmed. |
| X/Twitter and Threads | Owner-approved text or media variants only. | Do not duplicate exact Instagram captions if the platform needs a shorter variant. |
| Buffer and Zapier | Routing and queueing only after destination IDs are verified. | Do not guess channel IDs, organization IDs, page IDs, or profile IDs. |
| Gravatar | Profile consistency only. | Not a post destination. |
| Jira, Confluence, Sentry | Internal operations only. | Not public social feeds. |
| Email | Drafting and preparation only. | Do not send automatically. Manual owner approval is required for every email send. |

## Required preflight checklist

Before any public post leaves AthlynXAI, the system must verify the following gates.

| Gate | Requirement |
|---|---|
| Account gate | Destination account is active, owner-approved, and not disabled/deprecated. |
| Format gate | Asset matches the target platform’s required format. Instagram feed posts must include valid image/video media. |
| Duplicate gate | Content hash, caption, media URL, and prior post history are checked. Duplicates are blocked by default. |
| Standards gate | Content must be original, non-infringing, platform-safe, and free of unnecessary emojis. |
| Approval gate | Owner approval exists for the exact media, caption, and destination set. |
| Audit gate | Result is logged with destination, timestamp, content hash, external post ID if returned, and failure reason if blocked. |

## Image-card standard

Future AthlynXAI image-card assets must be original and mobile-readable. The accepted formats are **1080×1350 vertical** or **1080×1080 square**. Each card must use the AthlynXAI/DHG dark-blue theme, large high-contrast text, one clear hero message, one visible call to action, and no copied screenshots or protected third-party creative.

## Owner approval language

The owner may approve a social content package with language such as **“Approve all-social test default list”** or **“Publish approved.”** That approval authorizes only the exact content package being discussed. It does not authorize future changed captions, different media, new destination accounts, or reposting the same creative.

For email, approval must be explicit to sending. Draft approval is not send approval. The system must ask before sending any email.

## Permanent closeout standard

Every future audit, cron, and Social OS worker must follow this doctrine. If a connector, database row, channel ID, cron secret, or platform format is missing, the system must stop and report the blocker rather than guessing.

## Permanent no-rabbit-holes and blocker-escalation rule

AthlynXAI operating work must proceed from the active checklist only. Each checklist item may be marked only as **done**, **blocked awaiting Chad**, or **next**. Completed work stays closed unless live verification proves that it is broken, stale, missing, or no longer deployed.

The system must not drift into rabbit holes, circular revisits, duplicate work, or side quests. The required sequence is: read or reconstruct the active checklist, mark completed items, identify the first unchecked item, execute that item only, save evidence, then report the result and the next unchecked item.

If Manus, Perplexity, a cron, an audit, a connector worker, or any future automation hits a login, missing connector, permission block, missing file, unavailable server, unclear source of truth, failed authentication, or any other blocker, it must stop and ask Chad for help. It must not skip the item, silently downgrade it, mark it complete without evidence, or move to a different checklist item.

No task or checklist item may ever be left silently undone.
