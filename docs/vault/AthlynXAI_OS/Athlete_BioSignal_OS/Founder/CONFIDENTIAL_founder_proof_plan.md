# CONFIDENTIAL — Founder Proof Plan

The immediate proof is to validate AthlynXAI OS against the founder's active Libre 3 Plus workflow without exposing credentials or claiming official Abbott production API access. The first test should prove four things: sensor lifecycle tracking, latest reading intake by safe method, alert evaluation, and a working MCP/read-only API contract.

## Test Path

| Step | Action | Success Criteria |
|---|---|---|
| 1 | Open Libre app and confirm current Libre 3 Plus reading, trend arrow, and sensor end date. | Manual values match what the founder sees on-device. |
| 2 | Use AthlynXAI read-only API to enter or mirror the value in test mode. | API returns normalized reading, freshness, and alert state. |
| 3 | Track sensor start/end lifecycle. | AthlynXAI shows days remaining and replacement countdown. |
| 4 | Use MCP manifest and tool call. | MCP returns registry, lifecycle, and latest reading in a safe format. |
| 5 | If official/partner access is later granted, replace manual/mock adapter with approved provider adapter. | Same normalized schema works without changing the UI. |

## Boundary

Do not enter the founder's medical login password into chat. Use a manual reading, a temporary code path, a controlled browser takeover, or an approved API/partner bridge.
