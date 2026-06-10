# GlucoAthlete Libre API + MCP Route

**Status:** First testable build for AthlynXAI OS v1.  
**Mode:** Read-only demo connector, mock Libre 3 Plus stream, connected-app-style code flow, and MCP-style tool manifest.  
**Safety boundary:** This route does not prescribe insulin, calculate independent sliding-scale doses, or control a pump.

## Why This Route Exists

The Libre screenshots show the practical path AthlynXAI needs to support first: a user-facing **Connected Apps** flow with **Add Connection** and **Create Code** behavior, plus glucose alarm settings such as a low glucose alarm below 70 mg/dL. The first AthlynXAI build mirrors that connection experience safely without claiming direct Abbott production API access.

## First Testable Endpoints

| Route | Method | Purpose |
|---|---:|---|
| `/api/glucoathlete/health` | GET | Confirms the GlucoAthlete API is online. |
| `/api/glucoathlete/connections/create-code` | POST | Creates an AthlynXAI-side connection code for the connected-app test flow. |
| `/api/glucoathlete/readings/latest` | GET | Returns the latest mock Libre 3 Plus glucose reading and alert state. |
| `/api/glucoathlete/readings/series` | GET | Returns a mock trend series for dashboard testing. |
| `/api/glucoathlete/alerts/evaluate` | POST | Evaluates a provided glucose value for informational alert state. |
| `/api/glucoathlete/mcp/manifest` | GET | Returns the GlucoAthlete MCP-style tool manifest. |
| `/api/mcp/glucoathlete` | GET | Alias for the MCP-style tool manifest. |
| `/api/mcp/glucoathlete/call` | POST | Calls read-only GlucoAthlete tools by name. |

## MCP-Style Tools

| Tool | Purpose |
|---|---|
| `glucoathlete_get_latest_reading` | Returns latest demo glucose reading and alert state. |
| `glucoathlete_get_demo_series` | Returns a mock Libre trend series. |
| `glucoathlete_evaluate_alert` | Evaluates a glucose value and trend for informational alerts. |
| `glucoathlete_create_connection_code` | Creates a test connection code. |

## Tonight Test Commands

```bash
curl https://athlynx.ai/api/glucoathlete/health
curl https://athlynx.ai/api/glucoathlete/readings/latest
curl https://athlynx.ai/api/glucoathlete/readings/series?count=12
curl https://athlynx.ai/api/mcp/glucoathlete
curl -X POST https://athlynx.ai/api/glucoathlete/connections/create-code \
  -H 'content-type: application/json' \
  -d '{"athleteId":"chad-test"}'
curl -X POST https://athlynx.ai/api/mcp/glucoathlete/call \
  -H 'content-type: application/json' \
  -d '{"tool":"glucoathlete_get_latest_reading","input":{"athleteId":"chad-test"}}'
```

## Production Integration Boundary

Official Abbott production access should move through an approved Abbott/Validic or equivalent partner route. Unofficial LibreLinkUp/LibreView reverse-engineered APIs may be useful for internal proof-of-concept work only, but they should not be treated as the production path without legal, privacy, security, and terms-of-service review.

## Safety Language

Every response includes the safety principle: **informational monitoring only; verify with the primary CGM app/reader or backup meter and follow the clinician-prescribed care plan. AthlynXAI does not prescribe insulin or control pumps.**
