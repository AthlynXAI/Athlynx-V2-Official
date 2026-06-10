# AthlynXAI GlucoAthlete OS Vault

This vault holds the working GlucoAthlete OS package for AthlynXAI OS v1. The module is now wired into the web app at the `/glucoathlete`, `/gluco-athlete`, `/glucoathlete-os`, and `/digital-health/glucoathlete` routes, with a discoverable Digital Health card.

## Folder Map

| Folder | Purpose |
|---|---|
| `Nebius/` | Competition strategy, architecture, scalable AI workload mapping, and wide-research CSV for Nebius positioning. |
| `OpenAI/` | Judge-facing summary, explainable AI positioning, provider-summary language, and wide-research JSON for AI prompting and synthesis. |

## Safety Boundary

GlucoAthlete OS is built as a monitoring, education, alerting, Fuel Bot, and care-plan documentation layer. It does not provide unapproved insulin dosing or pump control. Any insulin-dose recommendation, sliding-scale calculation beyond clinician-entered parameters, or pump-control feature must go through medical, legal, regulatory, cybersecurity, and clinical validation before production use.

## Live App Integration

The React page is located at:

`client/src/pages/GlucoAthleteOS.tsx`

The routes are registered in:

`client/src/App.tsx`

The Digital Health landing card is located in:

`client/src/pages/DigitalHealth.tsx`

## Asset

The architecture image is available at:

`public/assets/glucoathlete/architecture.png`
