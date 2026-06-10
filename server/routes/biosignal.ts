import type { Express, Request, Response } from "express";
import crypto from "node:crypto";

const BIOSIGNAL_SAFE_NOTE = "AthlynXAI Athlete BioSignal OS is read-only informational monitoring. Verify critical readings with the source device, clinician, guardian, or emergency services as appropriate. It does not diagnose, prescribe, replace emergency care, dose insulin, or control pumps.";
const PROPRIETARY_NOTICE = "Copyright © 2026 Chad A. Dozier Sr. All rights reserved. Athlete BioSignal OS, GlucoAthlete OS, the multi-sensor registry, lifecycle model, API/MCP design, and associated documentation are proprietary intellectual property of Chad A. Dozier Sr. and the AthlynXAI OS ecosystem. This notice asserts ownership and confidentiality intent and does not represent formal IP registration unless separately documented.";

type IntegrationStatus = "live_demo" | "health_bridge" | "official_partner_required" | "research_only" | "manual_entry";
type SignalDomain = "glucose" | "heart" | "oxygen" | "blood_flow" | "brain" | "hydration_heat" | "sleep_recovery";

type SensorProvider = {
  id: string;
  name: string;
  domain: SignalDomain;
  signals: string[];
  devices: string[];
  lifecycle: {
    typicalWearDays?: number;
    warmupMinutes?: number;
    replacementRule: string;
    notes: string;
  };
  access: {
    status: IntegrationStatus;
    route: string;
    productionBoundary: string;
  };
};

const sensorRegistry: SensorProvider[] = [
  {
    id: "abbott_libre",
    name: "Abbott FreeStyle Libre",
    domain: "glucose",
    signals: ["glucose_mg_dl", "trend_arrow", "alarm_state", "sensor_days_remaining", "data_freshness"],
    devices: ["Libre 2", "Libre 3", "Libre 3 Plus"],
    lifecycle: { typicalWearDays: 14, warmupMinutes: 60, replacementRule: "Track sensor start, end, warmup, replacement countdown, and stale data state.", notes: "Founder proof starts with the active Libre 3 Plus workflow using read-only manual/consented input until approved access is granted." },
    access: { status: "live_demo", route: "Manual reading, connected-app-style code, LibreLinkUp/LibreView partner route pending", productionBoundary: "Official production access should move through Abbott/Validic or approved partner terms." },
  },
  {
    id: "dexcom",
    name: "Dexcom",
    domain: "glucose",
    signals: ["glucose_mg_dl", "trend_arrow", "sensor_status", "clarity_summary", "data_freshness"],
    devices: ["Dexcom G6", "Dexcom G7", "Dexcom Stelo"],
    lifecycle: { typicalWearDays: 10, warmupMinutes: 30, replacementRule: "Track sensor session, expiration, transmitter/app status, and replacement countdown.", notes: "Dexcom is the next partner pitch after Libre proof." },
    access: { status: "official_partner_required", route: "Dexcom developer / Clarity / Follow-Share pathways", productionBoundary: "Use approved developer scopes and terms only." },
  },
  {
    id: "medtronic_cgm",
    name: "Medtronic Diabetes CGM",
    domain: "glucose",
    signals: ["glucose_mg_dl", "trend", "pump_context", "alarm_state"],
    devices: ["Guardian Sensor 3", "Guardian 4", "Simplera"],
    lifecycle: { replacementRule: "Track sensor session and AID compatibility without pump control.", notes: "Pump/AID ecosystem must remain read-only unless regulated and clinician-authorized." },
    access: { status: "official_partner_required", route: "CareLink / partner API / export route", productionBoundary: "No pump control or dosing recommendations." },
  },
  {
    id: "senseonics_eversense",
    name: "Senseonics Eversense",
    domain: "glucose",
    signals: ["longitudinal_glucose", "transmitter_status", "sensor_implant_lifecycle"],
    devices: ["Eversense E3", "Eversense 365"],
    lifecycle: { typicalWearDays: 365, replacementRule: "Track implant lifecycle, transmitter wear, calibration/support state, and annual replacement context.", notes: "Long-duration implantable CGM is valuable for season-long athlete trend analytics." },
    access: { status: "official_partner_required", route: "Direct partnership / approved data route", productionBoundary: "Implantable-device data requires heightened consent and privacy controls." },
  },
  {
    id: "apple_garmin_whoop_oura_heart",
    name: "Heart and Cardiac Wearables",
    domain: "heart",
    signals: ["heart_rate", "hrv", "resting_hr", "cardiac_load", "ecg_available_flag"],
    devices: ["Apple Watch", "Garmin", "WHOOP", "Oura", "Fitbit", "Polar", "AliveCor Kardia"],
    lifecycle: { replacementRule: "Track device battery, last sync, permission state, and ECG regulatory boundary.", notes: "Heart data supports recovery and safety context but should not diagnose arrhythmia inside AthlynXAI." },
    access: { status: "health_bridge", route: "HealthKit, Health Connect, Garmin/WHOOP/Oura/Fitbit/Polar APIs", productionBoundary: "ECG and arrhythmia claims require regulated partner workflow." },
  },
  {
    id: "oxygen_respiratory",
    name: "Oxygen and Respiratory Wearables",
    domain: "oxygen",
    signals: ["spo2", "respiratory_rate", "sleep_oxygen", "altitude_context", "freshness"],
    devices: ["Apple Watch", "Garmin", "WHOOP", "Oura", "Masimo", "Nonin"],
    lifecycle: { replacementRule: "Track last sync, device source, measurement context, and low-confidence states.", notes: "Use as trend context, not diagnosis." },
    access: { status: "health_bridge", route: "HealthKit, Health Connect, Garmin, WHOOP, Oura and partner APIs", productionBoundary: "No respiratory diagnosis or emergency replacement." },
  },
  {
    id: "blood_flow_nirs",
    name: "Blood Flow and Muscle Oxygen",
    domain: "blood_flow",
    signals: ["blood_pressure_trend", "perfusion", "sm_o2", "pulse_transit_time", "calibration_due"],
    devices: ["Moxy Monitor", "PortaMon", "cuffless BP devices"],
    lifecycle: { replacementRule: "Track sensor placement, calibration due date, last sync, and data-confidence state.", notes: "Cuffless BP should be trend-only unless validated for clinical use." },
    access: { status: "official_partner_required", route: "Partner APIs / device exports / sports-science integrations", productionBoundary: "No hypertension diagnosis or medical BP management." },
  },
  {
    id: "brain_concussion",
    name: "Brain and Concussion Safety",
    domain: "brain",
    signals: ["impact_event", "cognitive_check", "eeg_trend", "baseline_status", "return_to_play_review"],
    devices: ["instrumented mouthguards", "helmet sensors", "Muse", "NeuroSky", "cognitive test platforms"],
    lifecycle: { replacementRule: "Track baseline date, last assessment, impact review state, and clinician/athletic-trainer review requirement.", notes: "Return-to-play decisions must stay with qualified professionals." },
    access: { status: "research_only", route: "Partner pilots and research integrations", productionBoundary: "No concussion diagnosis without cleared clinical pathway." },
  },
  {
    id: "hydration_heat",
    name: "Hydration, Sweat, and Heat Stress",
    domain: "hydration_heat",
    signals: ["sweat_rate", "sodium_loss", "core_temp", "heat_strain", "hydration_status"],
    devices: ["Nix", "CORE", "Epicore/Gatorade sweat patch", "Kenzen"],
    lifecycle: { replacementRule: "Track patch/pod start, expected end, heat-risk window, and replacement/refill need.", notes: "Useful for practice heat safety and personalized hydration plans." },
    access: { status: "official_partner_required", route: "Partner API, device app, export, or health bridge", productionBoundary: "Performance/wellness safety, not medical diagnosis." },
  },
  {
    id: "sleep_recovery",
    name: "Sleep, Recovery, and Strain",
    domain: "sleep_recovery",
    signals: ["sleep_stage", "hrv", "readiness", "strain", "recovery_score"],
    devices: ["WHOOP", "Oura", "Garmin", "Fitbit", "Apple Health", "Eight Sleep"],
    lifecycle: { replacementRule: "Track last night window, subscription/API status, device battery, and last sync.", notes: "Recovery scores are context, not medical clearance." },
    access: { status: "health_bridge", route: "WHOOP/Oura/Garmin/Fitbit APIs, HealthKit, Health Connect", productionBoundary: "Avoid medical sleep-disorder claims." },
  },
];

const businessLegs = [
  { id: "athlynx_parent_os", code: "AthlynX", name: "AthlynX Parent Athlete OS", parent: "Dozier / AthlynX ecosystem", status: "parent_platform", purpose: "Athlete accounts, recruiting, NIL, training, wellness, data ownership, and platform identity." },
  { id: "athlynxai_core", code: "AthlynXAI", name: "AthlynXAI Operating Core", parent: "AthlynX Parent Athlete OS", status: "live_platform", purpose: "AI intelligence, connector routing, vaulting, summaries, automation, and Nebius/OpenAI infrastructure." },
  { id: "athlete_biosignal_os", code: "BioSignal", name: "Athlete BioSignal OS", parent: "AthlynXAI OS", status: "founder_tested_proof", purpose: "Unified glucose, heart, oxygen, brain, blood-flow, hydration, heat, sleep, recovery, biomedical, and robotics signal layer." },
  { id: "athlynx_medical", code: "AM", name: "AthlynX Medical", parent: "AthlynXAI OS", status: "regulated_roadmap", purpose: "Founder-tested medical-performance company leg for BioSignal OS, GlucoAthlete, safety monitoring, clinical review, and regulated partner pathways." },
  { id: "glucoathlete_os", code: "GlucoAthlete", name: "GlucoAthlete OS", parent: "AthlynX Medical / Athlete BioSignal OS", status: "live_demo", purpose: "First proof wedge for Libre, LibreView, LibreLinkUp, Dexcom, and CGM athlete monitoring." },
  { id: "partner_os", code: "Adapters", name: "Partner Adapter OS", parent: "AthlynXAI OS", status: "vault_strategy", purpose: "Abbott, Dexcom, Garmin, WHOOP, Oura, Apple, Google, OpenAI, Nebius, biomedical, and robotics partners as modular company legs." },
  { id: "axn", code: "AXN", name: "Athlete Network", parent: "AthlynXAI OS", status: "media_network", purpose: "Podcast, reels, sports media, recruiting visibility, athlete storytelling, and distribution." },
  { id: "avn", code: "AVN", name: "Athlete Vision Network", parent: "AthlynXAI OS", status: "vision_video_layer", purpose: "Video, computer vision, game film, highlights, AI clips, and future vision analytics." },
  { id: "nil_os", code: "NIL", name: "NIL OS", parent: "AthlynXAI OS", status: "existing_leg", purpose: "NIL marketplace, contracts, valuation, legal and brand rails." },
];

const universalBioSignalChannel = {
  id: "athlynx_medical_universal_biosignal_channel",
  name: "Universal BioSignal Channel",
  parent: "AthlynX Medical / AthlynXAI OS",
  status: "founder_tested_architecture",
  founderProof: "Invented from Chad A. Dozier Sr.'s lived diabetic-athlete experience and tested against his own Libre/LibreView workflow before expanding to the full athlete medical-performance OS.",
  purpose: "Normalize every approved athlete health, performance, medical-device, biomedical, and robotics signal into one consented, privacy-first, read-only monitoring and escalation layer.",
  safetyBoundary: BIOSIGNAL_SAFE_NOTE,
  stages: [
    "consent_gateway",
    "device_adapter",
    "identity_redaction",
    "signal_normalizer",
    "sensor_lifecycle_engine",
    "alert_rules_engine",
    "human_escalation_router",
    "vault_audit_log",
    "partner_api_mcp_layer",
  ],
  supportedFamilies: [
    "Abbott Libre / LibreView / LibreLinkUp",
    "Dexcom CGM / Clarity / Follow",
    "Apple Health / HealthKit",
    "Google Health Connect",
    "Garmin / WHOOP / Oura / Fitbit / Polar",
    "Heat, hydration, sweat, sodium, core-temperature devices",
    "Cardiac, HRV, ECG-flag, oxygen, SpO2, respiratory devices",
    "Brain impact, concussion baseline, neurocognitive tools",
    "Blood-flow, perfusion, blood pressure, NIRS muscle oxygen sensors",
    "Biomedical device partners",
    "Human-in-loop robotics and sideline response partners",
  ],
};

function buildBioSignalChannelEvent(input: any) {
  const providerId = String(input?.providerId || "abbott_libre");
  const metric = String(input?.metric || input?.signal || "glucose_mg_dl");
  const value = input?.value ?? input?.glucoseMgDl ?? input?.valueMgDl ?? null;
  const domain = String(input?.domain || sensorRegistry.find((sensor) => sensor.id === providerId)?.domain || "glucose");
  return {
    eventId: createConnectionCode("BSE"),
    athleteId: String(input?.athleteId || "athlete_redacted"),
    sourceAdapter: providerId,
    signalDomain: domain,
    metric,
    value,
    unit: String(input?.unit || (domain === "glucose" ? "mg/dL" : "source_unit")),
    trend: normalizeTrend(input?.trend),
    timestamp: new Date().toISOString(),
    confidence: String(input?.confidence || "manual_or_demo_read_only"),
    lifecycle: buildSensorLifecycle({ providerId, sensorStartIso: input?.sensorStartIso, typicalWearDays: input?.typicalWearDays }),
    privacy: {
      phiScope: "minimum_needed",
      serialReturned: false,
      identifierRedacted: true,
      codeReturned: false,
    },
    alert: evaluateBioSignal({ glucoseMgDl: domain === "glucose" ? Number(value) : undefined, spo2: input?.spo2, coreTempF: input?.coreTempF }),
    channel: universalBioSignalChannel.id,
    safetyNote: BIOSIGNAL_SAFE_NOTE,
    proprietaryNotice: PROPRIETARY_NOTICE,
  };
}

function sendJson(res: Response, body: unknown) {
  res.setHeader("Cache-Control", "no-store");
  res.json(body);
}

function createConnectionCode(prefix = "AXB") {
  const raw = crypto.createHash("sha256").update(`${prefix}:${Date.now()}:${Math.random()}`).digest("hex").slice(0, 9).toUpperCase();
  return `${prefix}-${raw.slice(0, 3)}-${raw.slice(3, 6)}-${raw.slice(6, 9)}`;
}

function buildDemoBioSignal(athleteId = "demo-athlete") {
  const now = new Date().toISOString();
  return {
    athleteId,
    timestamp: now,
    mode: "demo_read_only",
    readings: [
      { domain: "glucose", providerId: "abbott_libre", value: 108, unit: "mg/dL", trend: "falling", freshnessSeconds: 0, lifecycle: { sensor: "Libre 3 Plus", typicalWearDays: 14, daysRemaining: 8, status: "active" } },
      { domain: "heart", providerId: "apple_garmin_whoop_oura_heart", value: 68, unit: "bpm", metric: "resting_hr", freshnessSeconds: 300, lifecycle: { status: "last_sync_ok" } },
      { domain: "oxygen", providerId: "oxygen_respiratory", value: 97, unit: "%", metric: "spo2", freshnessSeconds: 900, lifecycle: { status: "trend_only" } },
      { domain: "hydration_heat", providerId: "hydration_heat", value: 0.62, unit: "risk_score", metric: "heat_strain", freshnessSeconds: 600, lifecycle: { status: "demo_patch" } },
      { domain: "sleep_recovery", providerId: "sleep_recovery", value: 82, unit: "score", metric: "readiness", freshnessSeconds: 21600, lifecycle: { status: "last_night" } },
    ],
    safetyNote: BIOSIGNAL_SAFE_NOTE,
  };
}

function evaluateBioSignal(body: any) {
  const glucose = Number(body?.glucoseMgDl ?? body?.valueMgDl);
  const spo2 = Number(body?.spo2);
  const coreTempF = Number(body?.coreTempF);
  const flags: string[] = [];
  if (Number.isFinite(glucose) && glucose < 70) flags.push("glucose_watch_low");
  if (Number.isFinite(glucose) && glucose > 180) flags.push("glucose_watch_high");
  if (Number.isFinite(spo2) && spo2 < 94) flags.push("oxygen_watch_low");
  if (Number.isFinite(coreTempF) && coreTempF >= 102) flags.push("heat_watch_high");
  return {
    severity: flags.length ? "watch" : "normal",
    flags,
    message: flags.length ? "Review the source device, confirm symptoms, and follow the clinician/guardian/team safety plan." : "Demo values are within the current informational monitoring range.",
    safetyNote: BIOSIGNAL_SAFE_NOTE,
  };
}

function normalizeTrend(trend: unknown) {
  const raw = String(trend || "steady").toLowerCase().replace(/\s+/g, "_");
  return ["rising_fast", "rising", "steady", "falling", "falling_fast"].includes(raw) ? raw : "steady";
}

function redactAndFingerprintDevice(input: any) {
  const serial = String(input?.serialNumber || "").trim();
  const serialLast4 = String(input?.serialLast4 || serial.slice(-4) || "").replace(/[^A-Za-z0-9]/g, "").slice(-4);
  const fingerprint = serial
    ? crypto.createHash("sha256").update(`athlynxai-biosignal-device-fingerprint-v1:${serial}`).digest("hex")
    : null;
  return {
    providerId: String(input?.providerId || "abbott_libre"),
    deviceModel: String(input?.deviceModel || "Libre 3 Plus"),
    serialLast4: serialLast4 ? `****${serialLast4}` : "not_provided",
    serialFingerprint: fingerprint,
    serialStored: false,
    privacyRule: "Full serial numbers are accepted only for one-way fingerprinting, are not returned, and are not intentionally persisted by this test endpoint.",
  };
}

function buildSensorLifecycle(input: any) {
  const providerId = String(input?.providerId || "abbott_libre");
  const provider = sensorRegistry.find((sensor) => sensor.id === providerId) || sensorRegistry[0];
  const typicalWearDays = Number(input?.typicalWearDays || provider.lifecycle.typicalWearDays || 14);
  const sensorStartIso = input?.sensorStartIso ? new Date(String(input.sensorStartIso)) : null;
  const now = new Date();
  const startIsValid = !!sensorStartIso && !Number.isNaN(sensorStartIso.getTime());
  const sensorEndIso = startIsValid ? new Date(sensorStartIso!.getTime() + typicalWearDays * 24 * 60 * 60 * 1000).toISOString() : null;
  const daysRemaining = startIsValid ? Math.max(0, Math.ceil((new Date(sensorEndIso!).getTime() - now.getTime()) / (24 * 60 * 60 * 1000))) : null;
  return {
    providerId,
    typicalWearDays,
    sensorStartIso: startIsValid ? sensorStartIso!.toISOString() : null,
    sensorEndIso,
    daysRemaining,
    status: !startIsValid ? "start_date_needed" : daysRemaining === 0 ? "replace_now_or_verify_source_app" : daysRemaining !== null && daysRemaining <= 2 ? "replacement_window" : "active",
    safetyNote: "Lifecycle is calculated from user-provided dates and must be verified in the source CGM app.",
  };
}

function buildRealDeviceTest(input: any) {
  const athleteId = String(input?.athleteId || "chad-test-redacted");
  const valueMgDl = Number(input?.glucoseMgDl ?? input?.valueMgDl);
  const reading = Number.isFinite(valueMgDl)
    ? { domain: "glucose", providerId: String(input?.providerId || "abbott_libre"), value: valueMgDl, unit: "mg/dL", trend: normalizeTrend(input?.trend), timestamp: new Date().toISOString(), source: "manual_user_verified_libre_app", confidence: "user_provided_read_only" }
    : null;
  return {
    testSessionId: createConnectionCode("AXT"),
    athleteId,
    mode: "privacy_safe_real_device_test",
    device: redactAndFingerprintDevice(input),
    lifecycle: buildSensorLifecycle(input),
    reading,
    alert: reading ? evaluateBioSignal({ glucoseMgDl: reading.value, trend: reading.trend }) : { severity: "needs_reading", flags: ["manual_glucose_value_needed"], message: "Enter the current Libre value from the source app to complete the read-only test.", safetyNote: BIOSIGNAL_SAFE_NOTE },
    dataHandling: {
      storesFullSerial: false,
      returnsFullSerial: false,
      medicalAction: "none_read_only_monitoring",
      verification: "Compare output against the Libre app/reader before using it for any decision.",
    },
    proprietaryNotice: PROPRIETARY_NOTICE,
    safetyNote: BIOSIGNAL_SAFE_NOTE,
  };
}

function redactConnectionCode(rawCode: unknown) {
  const cleaned = String(rawCode || "").trim().toUpperCase().replace(/[^A-Z0-9]/g, "");
  const last4 = cleaned.slice(-4);
  const fingerprint = cleaned
    ? crypto.createHash("sha256").update(`athlynxai-libre-connection-code-v1:${cleaned}`).digest("hex")
    : null;
  return {
    codeLast4: last4 ? `****${last4}` : "not_provided",
    codeFingerprint: fingerprint,
    fullCodeStored: false,
    fullCodeReturned: false,
    privacyRule: "Temporary Libre connection codes are accepted only for one-way proof/fingerprinting in this test route and are not returned in API responses.",
  };
}

function buildLibreConnectionProof(input: any) {
  const connectionType = String(input?.connectionType || "libre_data_share");
  const expiresAtIso = input?.expiresAtIso ? new Date(String(input.expiresAtIso)) : null;
  const expiresIsValid = !!expiresAtIso && !Number.isNaN(expiresAtIso.getTime());
  const expiresInHours = expiresIsValid ? Math.max(0, Math.round((expiresAtIso!.getTime() - Date.now()) / (60 * 60 * 1000))) : null;
  const allowedTypes = ["libre_data_share", "libreview_practice", "librelinkup_invite", "librelinkup_follower"];
  return {
    proofSessionId: createConnectionCode("AXL"),
    mode: "privacy_safe_libre_connection_proof",
    connectionType: allowedTypes.includes(connectionType) ? connectionType : "libre_data_share",
    connectionStatus: String(input?.connectionStatus || "user_visible_pending"),
    code: redactConnectionCode(input?.connectionCode),
    practice: {
      practiceNameRedacted: input?.practiceName ? "provided_not_returned" : "not_provided",
      practiceIdStored: false,
      practiceIdReturned: false,
    },
    follower: {
      inviteEmailStored: false,
      inviteEmailReturned: false,
      followerNameRedacted: input?.followerName ? "provided_not_returned" : "not_provided",
    },
    sharing: {
      expiresAtIso: expiresIsValid ? expiresAtIso!.toISOString() : null,
      expiresInHours,
      expectedWindowHours: 72,
      source: "Libre app visible sharing screen / user-confirmed entry",
    },
    nextStep: "Use this as a proof-of-connection record only. Production glucose ingestion still requires approved Abbott/LibreView/LibreLinkUp partner access, authorized export, or user-mediated secure flow.",
    dataHandling: {
      storesTemporaryCode: false,
      returnsTemporaryCode: false,
      storesBirthYear: false,
      storesInviteEmail: false,
      medicalAction: "none_read_only_connection_proof",
    },
    proprietaryNotice: PROPRIETARY_NOTICE,
    safetyNote: BIOSIGNAL_SAFE_NOTE,
  };
}

const mcpManifest = {
  name: "athlynxai-athlete-biosignal-os",
  version: "0.1.0",
  description: "Read-only Athlete BioSignal OS tools for multi-sensor registry, lifecycle tracking, demo readings, alerts, and modular company-leg discovery.",
  safety: BIOSIGNAL_SAFE_NOTE,
  proprietaryNotice: PROPRIETARY_NOTICE,
  tools: [
    { name: "biosignal_get_registry", description: "Return supported sensor domains, providers, lifecycles and integration status.", inputSchema: { type: "object", properties: {}, required: [] } },
    { name: "biosignal_get_business_legs", description: "Return AthlynXAI parent OS modular company-leg structure.", inputSchema: { type: "object", properties: {}, required: [] } },
    { name: "biosignal_get_demo_readings", description: "Return demo read-only multi-sensor readings for an athlete.", inputSchema: { type: "object", properties: { athleteId: { type: "string" } }, required: [] } },
    { name: "biosignal_evaluate_alert", description: "Evaluate informational alert state from submitted readings; no diagnosis or treatment instruction.", inputSchema: { type: "object", properties: { glucoseMgDl: { type: "number" }, spo2: { type: "number" }, coreTempF: { type: "number" } }, required: [] } },
    { name: "biosignal_create_connection_code", description: "Create an AthlynXAI-side read-only connection code for testing a biosignal connector lane.", inputSchema: { type: "object", properties: { athleteId: { type: "string" }, providerId: { type: "string" } }, required: [] } },
    { name: "biosignal_test_real_device_intake", description: "Run a privacy-safe read-only test using redacted/fingerprinted device metadata and optional manual Libre reading. Full serial is never returned.", inputSchema: { type: "object", properties: { athleteId: { type: "string" }, providerId: { type: "string" }, deviceModel: { type: "string" }, serialLast4: { type: "string" }, glucoseMgDl: { type: "number" }, trend: { type: "string" }, sensorStartIso: { type: "string" } }, required: [] } },
    { name: "biosignal_record_libre_connection_proof", description: "Record a privacy-safe LibreView, LibreLinkUp, or Libre Data Share connection proof. Temporary code, birth year, practice ID, and email are not returned.", inputSchema: { type: "object", properties: { connectionType: { type: "string" }, connectionStatus: { type: "string" }, connectionCode: { type: "string" }, expiresAtIso: { type: "string" } }, required: [] } },
    { name: "biosignal_get_universal_channel", description: "Return the AthlynX Medical universal BioSignal Channel architecture and supported device families.", inputSchema: { type: "object", properties: {}, required: [] } },
    { name: "biosignal_create_channel_event", description: "Create a read-only normalized BioSignal Channel event from an approved/manual signal without storing full identifiers.", inputSchema: { type: "object", properties: { athleteId: { type: "string" }, providerId: { type: "string" }, domain: { type: "string" }, metric: { type: "string" }, value: { type: "number" }, unit: { type: "string" }, trend: { type: "string" } }, required: [] } },
  ],
};

export function registerBioSignalRoutes(app: Express) {
  app.get("/api/biosignal/health", (_req: Request, res: Response) => sendJson(res, { status: "ok", module: "Athlete BioSignal OS", parent: "AthlynXAI OS", mode: "read_only_demo", owner: "Chad A. Dozier Sr.", proprietaryNotice: PROPRIETARY_NOTICE, timestamp: new Date().toISOString(), safetyNote: BIOSIGNAL_SAFE_NOTE }));
  app.get("/api/biosignal/registry", (_req: Request, res: Response) => sendJson(res, { parent: "AthlynXAI OS", owner: "Chad A. Dozier Sr.", proprietaryNotice: PROPRIETARY_NOTICE, registry: sensorRegistry, safetyNote: BIOSIGNAL_SAFE_NOTE }));
  app.get("/api/biosignal/legs", (_req: Request, res: Response) => sendJson(res, { parent: "AthlynXAI OS", owner: "Chad A. Dozier Sr.", proprietaryNotice: PROPRIETARY_NOTICE, legs: businessLegs, safetyNote: BIOSIGNAL_SAFE_NOTE }));
  app.get("/api/biosignal/channel", (_req: Request, res: Response) => sendJson(res, { owner: "Chad A. Dozier Sr.", ecosystem: businessLegs, channel: universalBioSignalChannel, proprietaryNotice: PROPRIETARY_NOTICE, safetyNote: BIOSIGNAL_SAFE_NOTE }));
  app.post("/api/biosignal/channel/events", (req: Request, res: Response) => sendJson(res, buildBioSignalChannelEvent(req.body || {})));
  app.get("/api/biosignal/readings/demo", (req: Request, res: Response) => sendJson(res, buildDemoBioSignal(String(req.query.athleteId || "demo-athlete"))));
  app.post("/api/biosignal/alerts/evaluate", (req: Request, res: Response) => sendJson(res, evaluateBioSignal(req.body || {})));
  app.post("/api/biosignal/connections/create-code", (req: Request, res: Response) => {
    const athleteId = String(req.body?.athleteId || "demo-athlete");
    const providerId = String(req.body?.providerId || "abbott_libre");
    sendJson(res, { athleteId, providerId, code: createConnectionCode("AXB"), expiresInMinutes: 15, mode: "read_only_connection_test", safetyNote: BIOSIGNAL_SAFE_NOTE });
  });

  app.post("/api/biosignal/device/test-intake", (req: Request, res: Response) => {
    sendJson(res, buildRealDeviceTest(req.body || {}));
  });

  app.post("/api/biosignal/libre/manual-reading", (req: Request, res: Response) => {
    sendJson(res, buildRealDeviceTest({ ...(req.body || {}), providerId: "abbott_libre", deviceModel: req.body?.deviceModel || "Libre 3 Plus" }));
  });

  app.post("/api/biosignal/libre/connection-proof", (req: Request, res: Response) => {
    sendJson(res, buildLibreConnectionProof(req.body || {}));
  });

  app.get("/api/biosignal/mcp/manifest", (_req: Request, res: Response) => sendJson(res, mcpManifest));
  app.get("/api/mcp/biosignal", (_req: Request, res: Response) => sendJson(res, mcpManifest));
  app.post("/api/mcp/biosignal/call", (req: Request, res: Response) => {
    const tool = String(req.body?.tool || "");
    const input = req.body?.input || {};
    if (tool === "biosignal_get_registry") return sendJson(res, { tool, output: { registry: sensorRegistry, safetyNote: BIOSIGNAL_SAFE_NOTE } });
    if (tool === "biosignal_get_business_legs") return sendJson(res, { tool, output: { legs: businessLegs, safetyNote: BIOSIGNAL_SAFE_NOTE } });
    if (tool === "biosignal_get_demo_readings") return sendJson(res, { tool, output: buildDemoBioSignal(String(input.athleteId || "demo-athlete")) });
    if (tool === "biosignal_evaluate_alert") return sendJson(res, { tool, output: evaluateBioSignal(input) });
    if (tool === "biosignal_create_connection_code") return sendJson(res, { tool, output: { athleteId: String(input.athleteId || "demo-athlete"), providerId: String(input.providerId || "abbott_libre"), code: createConnectionCode("AXB"), expiresInMinutes: 15, safetyNote: BIOSIGNAL_SAFE_NOTE } });
    if (tool === "biosignal_test_real_device_intake") return sendJson(res, { tool, output: buildRealDeviceTest(input) });
    if (tool === "biosignal_record_libre_connection_proof") return sendJson(res, { tool, output: buildLibreConnectionProof(input) });
    if (tool === "biosignal_get_universal_channel") return sendJson(res, { tool, output: { channel: universalBioSignalChannel, ecosystem: businessLegs, safetyNote: BIOSIGNAL_SAFE_NOTE } });
    if (tool === "biosignal_create_channel_event") return sendJson(res, { tool, output: buildBioSignalChannelEvent(input) });
    return sendJson(res.status(404), { error: "Unknown BioSignal MCP tool", availableTools: mcpManifest.tools.map((t) => t.name), safetyNote: BIOSIGNAL_SAFE_NOTE });
  });
}
