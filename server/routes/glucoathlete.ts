import type { Express, Request, Response } from "express";
import crypto from "node:crypto";

const SAFE_NOTE = "Informational monitoring only. Verify with the primary CGM app/reader or backup meter and follow the clinician-prescribed care plan. AthlynXAI does not prescribe insulin or control pumps.";
const PROPRIETARY_NOTICE = "Copyright © 2026 Chad A. Dozier Sr. All rights reserved. GlucoAthlete OS, Athlete BioSignal OS, the Libre/Dexcom sensor lifecycle model, connected-app flow, API/MCP design, and associated documentation are proprietary intellectual property of Chad A. Dozier Sr. and the AthlynXAI OS ecosystem. This notice asserts ownership and confidentiality intent and does not represent formal IP registration unless separately documented.";

type Trend = "rising_fast" | "rising" | "steady" | "falling" | "falling_fast";

type GlucoseReading = {
  athleteId: string;
  valueMgDl: number;
  unit: "mg/dL";
  trend: Trend;
  trendArrow: "↑" | "↗" | "→" | "↘" | "↓";
  timestamp: string;
  source: "mock_libre_3_plus" | "librelinkup_pending" | "health_bridge_pending";
  dataFreshnessSeconds: number;
  confidence: "demo" | "user_provided" | "partner_api";
  safetyNote: string;
};

function buildDemoSeries(athleteId = "demo-athlete", count = 24): GlucoseReading[] {
  const now = Date.now();
  const values = [197, 191, 184, 172, 155, 142, 129, 118, 104, 96, 88, 76, 83, 94, 106, 118, 132, 144, 151, 146, 138, 126, 114, 108];
  return values.slice(-count).map((value, idx, arr) => {
    const previous = idx > 0 ? arr[idx - 1] : value;
    const delta = value - previous;
    const trend: Trend = delta >= 10 ? "rising_fast" : delta >= 4 ? "rising" : delta <= -10 ? "falling_fast" : delta <= -4 ? "falling" : "steady";
    const trendArrow = trend === "rising_fast" ? "↑" : trend === "rising" ? "↗" : trend === "falling_fast" ? "↓" : trend === "falling" ? "↘" : "→";
    return {
      athleteId,
      valueMgDl: value,
      unit: "mg/dL",
      trend,
      trendArrow,
      timestamp: new Date(now - (arr.length - 1 - idx) * 60_000).toISOString(),
      source: "mock_libre_3_plus",
      dataFreshnessSeconds: (arr.length - 1 - idx) * 60,
      confidence: "demo",
      safetyNote: SAFE_NOTE,
    };
  });
}

function evaluateReading(reading: GlucoseReading) {
  const severeLow = reading.valueMgDl < 54;
  const low = reading.valueMgDl < 70;
  const high = reading.valueMgDl > 180;
  const rapidFall = reading.trend === "falling_fast" || reading.trend === "falling";
  const stale = reading.dataFreshnessSeconds > 900;
  const severity = severeLow ? "critical" : low || high || stale ? "watch" : rapidFall ? "caution" : "normal";
  const flags = [
    severeLow ? "severe_low" : null,
    low ? "low_glucose" : null,
    high ? "high_glucose" : null,
    rapidFall ? "rapid_fall" : null,
    stale ? "stale_data" : null,
  ].filter(Boolean);

  return {
    severity,
    flags,
    message: severity === "normal"
      ? "Glucose is in the demo monitoring range. Continue watching data freshness and trend context."
      : "Review the primary CGM app/reader, confirm symptoms, and follow the athlete's clinician-prescribed care plan.",
    escalation: severity === "critical" ? ["athlete", "parent_guardian", "emergency_contact", "clinician_if_enabled"] : severity === "watch" ? ["athlete", "parent_guardian"] : ["athlete"],
    safetyNote: SAFE_NOTE,
  };
}

function createConnectionCode(athleteId: string) {
  const raw = crypto.createHash("sha256").update(`${athleteId}:${Date.now()}:${Math.random()}`).digest("hex").slice(0, 9).toUpperCase();
  return `AXG-${raw.slice(0, 3)}-${raw.slice(3, 6)}-${raw.slice(6, 9)}`;
}

function sendJson(res: Response, body: unknown) {
  res.setHeader("Cache-Control", "no-store");
  res.json(body);
}

const mcpManifest = {
  name: "athlynxai-glucoathlete",
  version: "0.1.0",
  description: "Read-only GlucoAthlete tools for demo Libre 3 Plus monitoring, data freshness, alert evaluation, and provider-safe summaries.",
  safety: SAFE_NOTE,
  proprietaryNotice: PROPRIETARY_NOTICE,
  tools: [
    {
      name: "glucoathlete_get_latest_reading",
      description: "Return the latest mock Libre 3 Plus reading for an athlete. Read-only; no insulin dosing.",
      inputSchema: { type: "object", properties: { athleteId: { type: "string" } }, required: [] },
    },
    {
      name: "glucoathlete_get_demo_series",
      description: "Return a demo glucose trend series for dashboard testing.",
      inputSchema: { type: "object", properties: { athleteId: { type: "string" }, count: { type: "number" } }, required: [] },
    },
    {
      name: "glucoathlete_evaluate_alert",
      description: "Evaluate a glucose value and trend for informational alert state. Does not prescribe insulin.",
      inputSchema: { type: "object", properties: { athleteId: { type: "string" }, valueMgDl: { type: "number" }, trend: { type: "string" } }, required: ["valueMgDl"] },
    },
    {
      name: "glucoathlete_create_connection_code",
      description: "Create an AthlynXAI-side connection code for the user-facing connected-app test flow.",
      inputSchema: { type: "object", properties: { athleteId: { type: "string" } }, required: [] },
    },
  ],
};

export function registerGlucoAthleteRoutes(app: Express) {
  app.get("/api/glucoathlete/health", (_req: Request, res: Response) => {
    sendJson(res, { status: "ok", module: "GlucoAthlete OS", mode: "read_only_demo", owner: "Chad A. Dozier Sr.", proprietaryNotice: PROPRIETARY_NOTICE, safetyNote: SAFE_NOTE, timestamp: new Date().toISOString() });
  });

  app.post("/api/glucoathlete/connections/create-code", (req: Request, res: Response) => {
    const athleteId = String(req.body?.athleteId || "demo-athlete");
    const code = createConnectionCode(athleteId);
    sendJson(res, {
      code,
      athleteId,
      expiresInMinutes: 15,
      connectionType: "athlynxai_connected_app_test_code",
      nextSteps: [
        "Open GlucoAthlete OS in AthlynXAI.",
        "Use this code in the test connector screen.",
        "Tonight's build mirrors the Libre connected-app user flow and uses mock/read-only data until an approved Abbott/Validic or health-bridge connector is authorized.",
      ],
      safetyNote: SAFE_NOTE,
      proprietaryNotice: PROPRIETARY_NOTICE,
    });
  });

  app.get("/api/glucoathlete/readings/latest", (req: Request, res: Response) => {
    const athleteId = String(req.query.athleteId || "demo-athlete");
    const latest = buildDemoSeries(athleteId).at(-1)!;
    sendJson(res, { reading: latest, alert: evaluateReading(latest), consent: { required: true, currentMode: "demo_mock_data" } });
  });

  app.get("/api/glucoathlete/readings/series", (req: Request, res: Response) => {
    const athleteId = String(req.query.athleteId || "demo-athlete");
    const count = Math.min(Math.max(Number(req.query.count || 24), 1), 96);
    const readings = buildDemoSeries(athleteId, count);
    sendJson(res, { readings, latestAlert: evaluateReading(readings.at(-1)!), safetyNote: SAFE_NOTE });
  });

  app.post("/api/glucoathlete/alerts/evaluate", (req: Request, res: Response) => {
    const valueMgDl = Number(req.body?.valueMgDl);
    if (!Number.isFinite(valueMgDl)) {
      return sendJson(res.status(400), { error: "valueMgDl is required", safetyNote: SAFE_NOTE });
    }
    const reading: GlucoseReading = {
      athleteId: String(req.body?.athleteId || "demo-athlete"),
      valueMgDl,
      unit: "mg/dL",
      trend: (req.body?.trend || "steady") as Trend,
      trendArrow: "→",
      timestamp: new Date().toISOString(),
      source: "mock_libre_3_plus",
      dataFreshnessSeconds: 0,
      confidence: "demo",
      safetyNote: SAFE_NOTE,
    };
    sendJson(res, { reading, alert: evaluateReading(reading) });
  });

  app.get("/api/glucoathlete/mcp/manifest", (_req: Request, res: Response) => sendJson(res, mcpManifest));
  app.get("/api/mcp/glucoathlete", (_req: Request, res: Response) => sendJson(res, mcpManifest));

  app.post("/api/mcp/glucoathlete/call", (req: Request, res: Response) => {
    const tool = String(req.body?.tool || "");
    const input = req.body?.input || {};
    const athleteId = String(input.athleteId || "demo-athlete");

    if (tool === "glucoathlete_get_latest_reading") {
      const reading = buildDemoSeries(athleteId).at(-1)!;
      return sendJson(res, { tool, output: { reading, alert: evaluateReading(reading) } });
    }
    if (tool === "glucoathlete_get_demo_series") {
      const count = Math.min(Math.max(Number(input.count || 24), 1), 96);
      return sendJson(res, { tool, output: { readings: buildDemoSeries(athleteId, count), safetyNote: SAFE_NOTE } });
    }
    if (tool === "glucoathlete_evaluate_alert") {
      const valueMgDl = Number(input.valueMgDl);
      if (!Number.isFinite(valueMgDl)) return sendJson(res.status(400), { error: "valueMgDl is required", safetyNote: SAFE_NOTE });
      const reading = buildDemoSeries(athleteId).at(-1)!;
      reading.valueMgDl = valueMgDl;
      reading.trend = (input.trend || reading.trend) as Trend;
      return sendJson(res, { tool, output: { reading, alert: evaluateReading(reading) } });
    }
    if (tool === "glucoathlete_create_connection_code") {
      return sendJson(res, { tool, output: { athleteId, code: createConnectionCode(athleteId), expiresInMinutes: 15, safetyNote: SAFE_NOTE } });
    }

    return sendJson(res.status(404), { error: "Unknown GlucoAthlete MCP tool", availableTools: mcpManifest.tools.map((t) => t.name), safetyNote: SAFE_NOTE });
  });
}
