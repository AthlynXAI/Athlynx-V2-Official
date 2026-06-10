# HIPAA-Aligned Controls for Athlete BioSignal OS

AthlynXAI should treat all BioSignal data as sensitive health data whether it originates from a medical device, consumer wearable, or manual entry.

| Control | Required Standard |
|---|---|
| Consent | Explicit per-provider and per-signal consent with revocation. |
| Access Control | RBAC for athlete, parent/guardian, coach, clinician, emergency contact, and admin. |
| Audit Logs | Every read, write, export, alert, connector call, and permission change must be logged. |
| Encryption | TLS in transit and encrypted storage/backups. |
| Minors | Parent/guardian consent and limited coach visibility. |
| Medical Boundary | Informational monitoring only unless a regulated, clinician-approved workflow exists. |
| AI Boundary | AI can summarize context and flag data freshness; it cannot diagnose or prescribe. |
