# AthlynXAI H200 / Nebius Verification Note

**Date:** 2026-05-18 CDT  
**Scope:** Verify whether the live AthlynXAI production system is currently routed through Nebius/NVIDIA H200-class AI infrastructure.

## Verified live facts

| Check | Evidence | Result |
|---|---|---|
| Production app health | `https://athlynx.ai/api/health` | HTTP 200 from Vercel; platform reports `ATHLYNX`, version `1.0.10-doctrine-baked`, Build 27 OS Drop. |
| Active AI engine | `https://athlynx.ai/api/trpc/system.health` | `activeEngine: "nebius"`, DB connected. |
| Nebius service call | `https://athlynx.ai/api/trpc/ai.nebiusHealthCheck` | `status: "ok"`, model `meta-llama/Meta-Llama-3.1-8B-Instruct`, live latency observed at 1556 ms and 659 ms. |
| Source implementation | `server/services/nebius.ts` | Nebius OpenAI-compatible client wired to `https://api.studio.nebius.ai/v1/` with Llama 4, Llama 3.3, and NVIDIA Nemotron model options documented. |
| Source active-engine cascade | `server/_core/llm.ts` | Nebius is the primary engine when `NEBIUS_API_KEY` is configured. |

## Determination

AthlynXAI production is **live on Nebius as the active AI engine** and is successfully making live Nebius health-check calls. The codebase describes this Nebius lane as the NVIDIA H200-backed lane and includes H200/NVIDIA model references.

The only distinction is hardware attestation: the public live endpoints verify Nebius execution and model response, but they do not expose a provider-signed hardware receipt proving the exact physical GPU SKU for each request. Operationally, the AthlynXAI OS is routed through the Nebius lane now; provider-level H200 proof would require Nebius account/console telemetry or an official Nebius API field that returns hardware placement.

## Next bite

With DNS/domain readiness closed and Nebius active-engine verification complete, continue to the CRM + Stripe payment-link monetization lane.
