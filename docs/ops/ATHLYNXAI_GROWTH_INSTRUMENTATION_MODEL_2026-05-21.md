# AthlynXAI Growth Instrumentation Model — May 21, 2026

**Purpose:** Replace `Instrumentation pending` in the daily growth report with durable social-to-profile-claim tracking.

## Event model

AthlynXAI now uses `activity_log` as the first lightweight conversion-event store. This avoids a risky schema migration while immediately creating usable funnel data.

| Event type | Meaning | Primary source |
|---|---|---|
| `signup_page_view` | A user landed on the signup/profile-claim page. | Client signup page load. |
| `landing_signup_cta_click` | A user clicked the signup/profile-claim CTA. | Client signup auth shell. |
| `signup_email_started` | A user began email profile-claim registration. | Client signup form submit. |
| `signup_social_started` | A user began Apple/Google profile-claim registration. | Client social auth door click. |
| `profile_claim_completed` | A new user/profile claim completed server-side. | Auth router after user creation. |
| `studio_activation_prompted` | A new user was pushed toward first Studio activation. | Reserved for next activation flow. |
| `referral_link_clicked` | A referral/social campaign link was clicked. | Reserved for referral campaign links. |

## Attribution model

The frontend captures UTM parameters and referral data into session/local storage, then passes attribution into signup and social-auth flows. Stored fields include `utmSource`, `utmMedium`, `utmCampaign`, `utmContent`, `utmTerm`, `ref`, `sourceUrl`, and `landingPath`.

## Daily report metrics

The daily profile report now queries `activity_log` for:

| Report row | Query source |
|---|---|
| Landing → Signup CTA clicks | Count of `landing_signup_cta_click` over the last 24 hours. |
| Signup starts → Profile claims | Count of `signup_email_started` + `signup_social_started` over the last 24 hours, shown beside `profile_claim_completed`. |
| Day-1 Studio Suite opens | Existing `studio_graphics` activation proxy. |
| Returning profiles day 2–7 | Existing return-use proxy via later `studio_graphics` activity. |

## Next activation target

The next product fix should fire `studio_activation_prompted` when a new profile reaches `/welcome` and is asked to generate the first athlete card, media kit, or recruiting profile. That will connect profile claim to first value.
