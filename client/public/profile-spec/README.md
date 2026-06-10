# Athlete Profile Spec — Permanent Reference

Locked references that the ATHLYNX athlete profile is built against.

- **mlb-inspiration.jpeg** — MLB.com profile (Andrew Abbott, Cincinnati Reds): Summary / Stats / News / Awards / Shop tab pattern with MLB Career table at top, Splits below, then News card grid. This is the structural inspiration for our `/profile` MLB-style hero + tab system.

Companion mockups (live in `client/public/landing/`):
- `IMG_7178.PNG` — Chad's TRUE profile hero spec: blue gradient hero, big Edit Profile, Founder & CEO • Mississippi State University, full bio, Multi-Sport / Founder stat row, Height / GPA placeholders, Recruiting Active + Verified Athlete chips, follower / posts / NIL deals counters.
- `IMG_7177.PNG` — Mini profile card variant: avatar + name + email + 26 Posts / 0 Followers / 0 NIL Deals + "View Full Profile" + Settings.
- `IMG_7176.PNG` — Feed tab: "What's on your mind" composer + Photo/Video/Highlight/Post + welcome post.

## Tab structure (matches Profile.tsx)

Summary · Stats · News · Awards · Recruiting · NIL · Media · Performance

Currently shipped (Build 1–3, commits f6c3f3d → fd6ba34): Summary, Recruiting, Awards. Stats, News, NIL, Media, Performance remain TabPlaceholder until their PRs land.
