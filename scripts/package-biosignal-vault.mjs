#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const repo = process.cwd();
const vaultRoot = path.join(repo, 'docs', 'vault', 'AthlynXAI_OS', 'Athlete_BioSignal_OS');
const localVaultRoot = '/home/ubuntu/Vault/AthlynXAI_OS/Athlete_BioSignal_OS';
const lanes = ['Founder', 'AthlynXAI_OS', 'BioSignal_OS', 'Nebius', 'OpenAI', 'Abbott', 'Dexcom', 'Partner_Legs', 'Compliance', 'Research'];

function mkdirp(p) { fs.mkdirSync(p, { recursive: true }); }
function writeBoth(rel, content) {
  const repoPath = path.join(vaultRoot, rel);
  const localPath = path.join(localVaultRoot, rel);
  mkdirp(path.dirname(repoPath));
  mkdirp(path.dirname(localPath));
  fs.writeFileSync(repoPath, content);
  fs.writeFileSync(localPath, content);
}

for (const lane of lanes) {
  mkdirp(path.join(vaultRoot, lane));
  mkdirp(path.join(localVaultRoot, lane));
}

const master = `# CONFIDENTIAL — AthlynXAI Athlete BioSignal OS Master Vault Index

**Parent OS:** AthlynXAI OS v1  
**Confidential product leg:** Athlete BioSignal OS  
**First proof product:** GlucoAthlete OS with Libre 3 Plus read-only validation  
**Expansion model:** Company-within-company modular legs routed through AthlynXAI OS.

## Founder Thesis

AthlynXAI OS is the parent operating system. Athlete BioSignal OS is a confidential product leg inside that OS. GlucoAthlete OS is the first proof wedge because live CGM data creates an immediate athlete-safety, nutrition, recovery, and lifecycle-tracking problem. If the platform can safely prove a read-only validation path against the founder's current Libre 3 Plus workflow, the same architecture can extend to Dexcom, Abbott partner channels, heart, oxygen, brain, blood-flow, hydration, temperature, and recovery.

## Vault Lanes

| Folder | Purpose |
|---|---|
| Founder | Private founder thesis, product logic, IP notes, and proof plan. |
| AthlynXAI_OS | Parent OS architecture, identity, permissions, connectors, audit, and platform legs. |
| BioSignal_OS | Unified multi-sensor registry, signal model, lifecycle model, and read-only monitoring design. |
| Nebius | Competition positioning, infrastructure story, GPU/AI/data-pipeline roadmap. |
| OpenAI | Reasoning layer, safe summaries, assistant behavior, and MCP tool design. |
| Abbott | Libre and Abbott/Validic partner lane. |
| Dexcom | Dexcom G6/G7/Stelo, Clarity, Follow/Share, and developer-partner lane. |
| Partner_Legs | Garmin, WHOOP, Oura, Apple/Google, Validic, Redox, Moxy, CORE, Nix, others. |
| Compliance | HIPAA-aligned controls, consent, RBAC, audit logs, minors, and medical-device boundaries. |
| Research | Wide research results and source summaries. |

## Safety Rule

This vault may describe the full ambition. Public product language must stay disciplined: **read-only monitoring, informational trend context, consent-based sharing, and clinician-directed action plans only.** No autonomous insulin dosing, no pump control, no diagnosis, and no emergency-response replacement without regulated clearance and clinical governance.
`;

writeBoth('README.md', master);

writeBoth('Founder/CONFIDENTIAL_founder_proof_plan.md', `# CONFIDENTIAL — Founder Proof Plan

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
`);

writeBoth('Compliance/HIPAA_aligned_controls.md', `# HIPAA-Aligned Controls for Athlete BioSignal OS

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
`);

writeBoth('BioSignal_OS/sensor_registry_model.md', `# Athlete BioSignal OS Sensor Registry Model

| Domain | Signals | First Providers | Lifecycle Fields |
|---|---|---|---|
| Glucose | value, trend, freshness, alarms | Libre, Dexcom, Medtronic, Eversense | sensorStart, sensorEnd, warmup, daysRemaining, status |
| Heart | HR, HRV, ECG, load | Apple, Garmin, WHOOP, Oura, Fitbit, Polar, AliveCor | deviceBattery, lastSync, permissionStatus |
| Oxygen | SpO2, respiratory rate | Apple, Garmin, WHOOP, Oura, Masimo, Nonin | lastSync, freshness, deviceStatus |
| Blood Flow | BP, perfusion, SmO2, PTT | cuffless BP, Moxy, PortaMon | calibrationDue, lastSync, sensorPlacement |
| Brain | EEG, impact, cognitive readiness | Muse, NeuroSky, instrumented mouthguards/helmets | baselineDate, lastAssessment, reviewRequired |
| Hydration/Heat | sweat, sodium, core temp, heat strain | Nix, CORE, Epicore, Kenzen | patchStart, patchEnd, temperatureRisk, hydrationStatus |
| Sleep/Recovery | readiness, strain, HRV, sleep stages | WHOOP, Oura, Garmin, Fitbit, Apple Health | nightlyWindow, lastSync, subscriptionStatus |
`);

writeBoth('AthlynXAI_OS/modular_company_legs.md', `# AthlynXAI OS Modular Company-Leg Model

AthlynXAI OS should operate like a parent company with expandable internal product legs. Each leg can become its own LLC-style business line later, but the first architecture keeps identity, data governance, connectors, AI, and audit inside the parent OS.

| Leg | Product Role | Expansion Path |
|---|---|---|
| Athlete BioSignal OS | Health/performance signal monitoring | Glucose → heart → oxygen → brain → blood flow → recovery |
| NIL OS | NIL marketplace, contracts, brand deals | NIL Portal, valuation, agent/legal rails |
| Media OS | Podcast, reels, AXN, social distribution | Source-only media vault and approvals |
| Recruiting OS | Profiles, coaches, transfer portal, scouting | School/team/coach data rails |
| Partner OS | Abbott, Dexcom, Garmin, WHOOP, Oura, OpenAI, Nebius | Adapter-per-partner with guarded access |
`);

writeBoth('Nebius/nebius_competition_positioning.md', `# Nebius Competition Positioning

Athlete BioSignal OS positions AthlynXAI as the athlete operating system that can ingest and normalize high-frequency biosignal data, apply safe AI reasoning, and produce real-time context for athletes, parents, coaches, clinicians, and approved partners.

The Nebius story is infrastructure: secure multi-sensor ingestion, AI reasoning, privacy-preserving model pipelines, simulation data for demos, scalable athlete data workloads, and future real-time signal analytics. The competition pitch should emphasize proof over hype: Libre 3 Plus first, Dexcom next, then broader biosignal expansion.
`);

writeBoth('OpenAI/openai_reasoning_layer.md', `# OpenAI Reasoning Layer

OpenAI should sit behind AthlynXAI OS as a reasoning and summarization layer. It should explain trends, detect stale data, translate sensor values into plain-language context, and generate provider-ready summaries. It must not diagnose, prescribe insulin, control pumps, or replace emergency care.

MCP tools should be read-only by default: get registry, get lifecycle, get latest reading, evaluate informational alert, summarize provider handoff, and produce audit-safe language.
`);

writeBoth('Abbott/abbott_libre_partner_lane.md', `# Abbott / Libre Partner Lane

The Abbott lane begins with Libre 3 Plus proof. The immediate test route is manual/consented read-only validation and connected-app-style code handling. Production should move through approved Abbott/Validic or other authorized pathways rather than unsupported scraping.

Pitch: AthlynXAI extends Libre data into athlete-specific context: sport, practice, nutrition, recovery, family/coach visibility, sensor lifecycle, and clinician-safe summaries.
`);

writeBoth('Dexcom/dexcom_partner_lane.md', `# Dexcom Partner Lane

Dexcom is the next strategic CGM pitch after Libre proof. The Dexcom lane should cover G6, G7, Stelo, Clarity, Follow/Share, and developer/partner access. AthlynXAI's value is the athlete operating layer around glucose data: lifecycle, practice state, nutrition, recovery, and team-aware safety context.
`);

const researchSrc = '/home/ubuntu/athlete_biosignal_os_master_research.json';
if (fs.existsSync(researchSrc)) {
  fs.copyFileSync(researchSrc, path.join(vaultRoot, 'Research', 'athlete_biosignal_os_master_research.json'));
  fs.copyFileSync(researchSrc, path.join(localVaultRoot, 'Research', 'athlete_biosignal_os_master_research.json'));
}

console.log(`[biosignal-vault] wrote confidential vault to ${vaultRoot} and ${localVaultRoot}`);
