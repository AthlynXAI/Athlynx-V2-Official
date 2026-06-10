/**
 * Standalone self-test for the build-monitor pipeline.
 *
 *   npx tsx server/scripts/buildMonitorSelfTest.ts
 *
 * Exits 0 on PASS, 1 on FAIL. Safe to run with no env vars (forces dry-run).
 */

import { detect10091Spike, parseBuildLog } from "../services/buildLogParser";
import { easConfigSummary, easIsDryRun, getBuildLog, listRecentBuilds } from "../services/easClient";
import { logBuildHistoryRows, sheetsConfigSummary, sheetsIsDryRun } from "../services/googleSheetsLogger";
import { alerterConfigSummary } from "../services/slackAlerter";

const FAIL_LOG = `Setup
Install dependencies
Prebuild
Run gradlew
FAILURE: Build failed with an exception.
A problem occurred evaluating project ':app'.
> "git rev-parse".execute().text.trim()
Execution failed for task ':app:processReleaseManifest'.
Error: Run gradlew failed
command failed with exit code 1
`;

const CLEAN_LOG = `Setup
Install dependencies
Prebuild
Run gradlew
BUILD SUCCESSFUL in 4m 17s
`;

const ERR_10091 = `Upload to Google Play failed: 10091
10091 invalid signature
10091 retry
`;

type Check = { name: string; pass: boolean; detail?: string };

async function main() {
  const checks: Check[] = [];

  const failingParse = parseBuildLog(FAIL_LOG);
  checks.push({
    name: "parser detects .execute() deprecation",
    pass: failingParse.hasGradleExecuteError,
    detail: failingParse.summary,
  });
  checks.push({
    name: "parser detects ':app' eval failure",
    pass: failingParse.hasEvalAppError,
  });

  const cleanParse = parseBuildLog(CLEAN_LOG);
  checks.push({
    name: "clean log produces no signals",
    pass: cleanParse.signals.length === 0,
  });

  const e = parseBuildLog(ERR_10091);
  checks.push({
    name: "10091 detected (count >= 3)",
    pass: e.has10091 && e.count10091 >= 3,
    detail: `count=${e.count10091}`,
  });

  const spike = detect10091Spike(
    [
      { buildId: "a", finishedAt: new Date().toISOString(), count10091: 2 },
      { buildId: "b", finishedAt: new Date().toISOString(), count10091: 1 },
      { buildId: "c", finishedAt: new Date().toISOString(), count10091: 4 },
    ],
    { windowMinutes: 60, threshold: 3 },
  );
  checks.push({ name: "spike detector fires at threshold=3", pass: spike.spike });

  // Force EAS into dry-run for the integration check.
  process.env.EAS_DRY_RUN = "1";
  const builds = await listRecentBuilds({ limit: 5 });
  checks.push({
    name: "easClient returns mock builds in dry-run",
    pass: builds.length > 0 && builds.every((b) => b.source === "mock"),
  });
  if (builds[0]) {
    const { log, source } = await getBuildLog(builds[0].id);
    const parsed = parseBuildLog(log);
    checks.push({
      name: "mock log routes through parser",
      pass: source === "mock" && parsed.hasGradleExecuteError,
    });
  }

  process.env.GOOGLE_SHEETS_DRY_RUN = "1";
  const sheetResult = await logBuildHistoryRows([
    {
      buildId: "selftest-1",
      platform: "android",
      status: "errored",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ]);
  checks.push({
    name: "sheets logger no-ops cleanly in dry-run",
    pass: sheetResult.dryRun === true && sheetResult.appended === 0,
  });

  const ok = checks.every((c) => c.pass);

  console.log("=== build-monitor self-test ===");
  console.log("EAS:", easConfigSummary());
  console.log("Sheets:", sheetsConfigSummary());
  console.log("Alerter:", alerterConfigSummary());
  console.log("Dry-run flags — eas:", easIsDryRun(), "sheets:", sheetsIsDryRun());
  console.log("");
  for (const c of checks) {
    console.log(`${c.pass ? "PASS" : "FAIL"}  ${c.name}${c.detail ? `  (${c.detail})` : ""}`);
  }
  console.log("");
  console.log(ok ? "RESULT: PASS" : "RESULT: FAIL");
  process.exit(ok ? 0 : 1);
}

main().catch((err) => {
  console.error("self-test crashed:", err);
  process.exit(1);
});
