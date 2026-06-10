#!/usr/bin/env node
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";

const allowed = new Set([
  "scripts/secret-scan.mjs",
  "ATHLYNXAI_HANDOFF_REPORT_MAY1_2026.md",
  "ATHLYNXAI_HANDOFF_REPORT_MAY2_2026.md",
  "OWNERSHIP_RUNBOOK.md",
  "audit/AUDIT_FAKES.md",
  "audit/AUDIT_DEPLOY.md",
  "audit/AUDIT_INTEGRATIONS.md",
  "audit/AUDIT_SECRETS.md",
  "audit/AUDIT_SUMMARY.md",
]);

const patterns = [
  { name: "OpenAI project key", regex: /sk-proj-[A-Za-z0-9_-]{20,}/g },
  { name: "OpenAI secret key", regex: /sk-[A-Za-z0-9]{20,}/g },
  { name: "Anthropic API key", regex: /sk-ant-api[0-9A-Za-z_-]{20,}/g },
  { name: "Stripe live secret key", regex: /sk_live_[A-Za-z0-9]{20,}/g },
  { name: "Stripe test secret key", regex: /sk_test_[A-Za-z0-9]{20,}/g },
  { name: "Stripe restricted live key", regex: /rk_live_[A-Za-z0-9]{20,}/g },
  { name: "Perplexity API key", regex: /pplx-[A-Za-z0-9]{20,}/g },
  { name: "Airtable PAT", regex: /pat[A-Za-z0-9]{10,}\.[A-Za-z0-9]{20,}/g },
  { name: "AWS access key", regex: /AKIA[0-9A-Z]{16}/g },
  { name: "Cloudflare token", regex: /cf(?:ut|k)_[A-Za-z0-9_-]{20,}/g },
  { name: "Vercel token", regex: /vcp_[A-Za-z0-9]{20,}/g },
  { name: "Netlify token", regex: /nfp_[A-Za-z0-9]{20,}/g },
  { name: "Twilio Account SID", regex: /AC[a-f0-9]{32}/gi },
];

const files = execFileSync("git", ["ls-files"], { encoding: "utf8" })
  .split("\n")
  .filter(Boolean)
  .filter((file) => !file.includes("node_modules/") && !file.endsWith(".png") && !file.endsWith(".jpg") && !file.endsWith(".jpeg") && !file.endsWith(".pdf") && !file.endsWith(".zip") && !file.endsWith(".aab") && !file.endsWith(".p8"));

const findings = [];
for (const file of files) {
  if (allowed.has(file)) continue;
  let text;
  try {
    text = readFileSync(file, "utf8");
  } catch {
    continue;
  }
  for (const pattern of patterns) {
    const matches = text.match(pattern.regex);
    if (matches?.length) {
      findings.push({ file, pattern: pattern.name, count: matches.length });
    }
  }
}

if (findings.length) {
  console.error("SECRET_SCAN_FAILED");
  for (const finding of findings) {
    console.error(`${finding.file}: ${finding.pattern} (${finding.count})`);
  }
  process.exit(1);
}

console.log("SECRET_SCAN_PASSED");
