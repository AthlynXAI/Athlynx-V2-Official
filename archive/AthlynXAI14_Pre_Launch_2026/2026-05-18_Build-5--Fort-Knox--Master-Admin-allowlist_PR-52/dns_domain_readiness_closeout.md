# AthlynXAI DNS and Domain Readiness Closeout

**Date:** 2026-05-18 CDT  
**Domain:** `athlynx.ai`  
**Status:** Operationally ready for the next bite, with propagation note.

## What was fixed

Cloudflare DNS was cleaned up one record at a time from the authenticated dashboard. The apex domain was moved to the Vercel apex target, the `www` record was kept on Vercel’s CNAME target but switched to DNS-only, external verification CNAMEs were switched to DNS-only, and the two legacy wildcard A records were removed.

| Area | Final state |
|---|---|
| Apex domain | `A athlynx.ai -> 76.76.21.21`, DNS-only |
| WWW | `CNAME www -> cname.vercel-dns.com`, DNS-only |
| Stripe bounce CNAME | DNS-only |
| Vercel domainconnect CNAME | DNS-only |
| Auth0 login CNAME | DNS-only |
| SendGrid DKIM CNAMEs | DNS-only |
| Legacy wildcard records | Removed: `* -> 216.150.16.193` and `* -> 216.150.1.1` |
| Nameservers | `fatima.ns.cloudflare.com` and `jihoon.ns.cloudflare.com` |

## Verification result

External route checks confirm that the live site and login routes respond from Vercel over HTTPS.

| Check | Result |
|---|---|
| `https://athlynx.ai` | HTTP 200, Vercel, `text/html` |
| `https://www.athlynx.ai` | Redirects to `https://athlynx.ai/`, Vercel |
| `http://athlynx.ai` | Redirects to `https://athlynx.ai/`, Vercel |
| `http://www.athlynx.ai` | Redirects to `https://athlynx.ai/`, Vercel |
| `https://athlynx.ai/login` | HTTP 200, Vercel |
| `https://athlynx.ai/sign-in` | HTTP 200, Vercel |

## Propagation note

The local resolver still returned an old cached apex address (`216.150.1.1`) immediately after the correction, while HTTPS traffic continued to resolve and serve successfully from Vercel. This is a DNS propagation/cache condition, not a live-site outage. The Cloudflare dashboard now shows the corrected apex record as `76.76.21.21` DNS-only.

## Evidence files

| Evidence | Path |
|---|---|
| Final Cloudflare DNS table | `/home/ubuntu/athlynx_dns_fix/cloudflare_dns_final_table.txt` |
| Change progress log | `/home/ubuntu/athlynx_dns_fix/cloudflare_dns_fix_progress.md` |
| Post-fix verification | `/home/ubuntu/athlynx_dns_fix/post_fix_verify_summary.txt` |
| Final quick verification | `/home/ubuntu/athlynx_dns_fix/dns_final_quick_verify.txt` |

## Next bite

Move to the CRM and Stripe payment-link monetization lane: map CRM objects, Stripe products/prices/payment links, webhook bookkeeping, and safe owner-approved payment operations under the AthlynXAI doctrine.
