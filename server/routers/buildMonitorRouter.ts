/**
 * Build Monitor router — admin-only telemetry for the AthlynXAI Google Play
 * APK pipeline (Expo EAS / Gradle / Google Play console).
 *
 * Apple is reported as `pending` because no Apple Developer account exists yet.
 *
 * Endpoints:
 *  - getStatus: dashboard summary (config + recent builds + parsed log signals)
 *  - getBuildLog: fetch + parse a single build's log
 *  - logHistory: idempotent append to Google Sheet for crash-resume durability
 *  - selfTest: dry-run validation of parser + spike detection (no creds needed)
 *  - alertOnFailure: fan a Slack/email alert based on the most recent failed build
 */

import { z } from "zod";
import { adminProcedure, publicProcedure, router } from "../_core/trpc";
import {
  easConfigSummary,
  easIsDryRun,
  getBuildLog,
  listRecentBuilds,
  type EasBuild,
} from "../services/easClient";
import {
  type Build10091Sample,
  detect10091Spike,
  parseBuildLog,
} from "../services/buildLogParser";
import {
  logBuildHistoryRows,
  sheetsConfigSummary,
  sheetsIsDryRun,
  type BuildHistoryRow,
} from "../services/googleSheetsLogger";
import { alerterConfigSummary, sendBuildAlert } from "../services/slackAlerter";

type Platform = "android" | "ios";
const PLATFORM_SCHEMA = z.enum(["android", "ios"]);

async function buildToHistoryRow(b: EasBuild): Promise<BuildHistoryRow> {
  const row: BuildHistoryRow = {
    buildId: b.id,
    platform: b.platform,
    status: b.status,
    appVersion: b.appVersion,
    appBuildVersion: b.appBuildVersion,
    gitCommitHash: b.gitCommitHash,
    createdAt: b.createdAt,
    updatedAt: b.updatedAt,
    artifactUrl: b.artifacts?.applicationArchiveUrl,
  };
  if (b.status === "errored") {
    try {
      const { log } = await getBuildLog(b.id);
      const parsed = parseBuildLog(log);
      row.failureSummary = parsed.summary;
      row.count10091 = parsed.count10091;
      row.hasGradleExecuteError = parsed.hasGradleExecuteError;
    } catch (err) {
      row.failureSummary = `log parse failed: ${(err as Error).message ?? "unknown"}`;
    }
  }
  return row;
}

export const buildMonitorRouter = router({
  // Public, low-risk: only exposes dry-run flags + counts. Lets the dashboard
  // render even before the admin login completes.
  getConfig: publicProcedure.query(() => ({
    eas: easConfigSummary(),
    sheets: sheetsConfigSummary(),
    alerter: alerterConfigSummary(),
    apple: { configured: false, status: "pending — Apple Developer account not set up" },
    android: {
      package: process.env.EAS_APP_PACKAGE || "ai.athlynx.app",
      account: process.env.GOOGLE_PLAY_ACCOUNT || "chaddozier75@gmail.com",
      appName: "AthlynXAI",
    },
  })),

  getStatus: adminProcedure
    .input(
      z
        .object({
          platform: PLATFORM_SCHEMA.optional(),
          limit: z.number().int().min(1).max(50).optional(),
          windowMinutes: z.number().int().min(5).max(1440).optional(),
          spikeThreshold: z.number().int().min(1).max(50).optional(),
        })
        .optional(),
    )
    .query(async ({ input: rawInput }) => {
      const input = {
        platform: (rawInput?.platform ?? "android") as Platform,
        limit: rawInput?.limit ?? 10,
        windowMinutes: rawInput?.windowMinutes ?? 60,
        spikeThreshold: rawInput?.spikeThreshold ?? 3,
      };
      const builds = await listRecentBuilds({
        platform: input.platform,
        limit: input.limit,
      });

      // Fetch + parse logs in parallel for builds that have failed.
      const enriched = await Promise.all(
        builds.map(async (b) => {
          if (b.status !== "errored") {
            return { build: b, parsed: null as ReturnType<typeof parseBuildLog> | null };
          }
          try {
            const { log, source } = await getBuildLog(b.id);
            const parsed = parseBuildLog(log);
            return { build: b, parsed, logSource: source };
          } catch (err) {
            return {
              build: b,
              parsed: null,
              logError: (err as Error).message ?? "unknown",
            };
          }
        }),
      );

      const samples: Build10091Sample[] = enriched.flatMap((e) =>
        e.parsed
          ? [
              {
                buildId: e.build.id,
                finishedAt: e.build.updatedAt,
                count10091: e.parsed.count10091,
              },
            ]
          : [],
      );
      const spike = detect10091Spike(samples, {
        windowMinutes: input.windowMinutes,
        threshold: input.spikeThreshold,
      });

      const latestErrored = enriched.find((e) => e.build.status === "errored");

      return {
        platform: input.platform,
        config: {
          eas: easConfigSummary(),
          sheets: sheetsConfigSummary(),
          alerter: alerterConfigSummary(),
        },
        builds: enriched,
        spike10091: spike,
        latestErrored: latestErrored?.build.id ?? null,
        latestSummary: latestErrored?.parsed?.summary ?? null,
        dryRun: easIsDryRun(),
      };
    }),

  getBuildLog: adminProcedure
    .input(z.object({ buildId: z.string().min(1) }))
    .query(async ({ input }) => {
      const { log, source } = await getBuildLog(input.buildId);
      const parsed = parseBuildLog(log);
      return { buildId: input.buildId, source, parsed, logExcerpt: log.slice(0, 8000) };
    }),

  logHistory: adminProcedure
    .input(
      z
        .object({
          platform: PLATFORM_SCHEMA.optional(),
          limit: z.number().int().min(1).max(50).optional(),
        })
        .optional(),
    )
    .mutation(async ({ input: rawInput }) => {
      const platform = (rawInput?.platform ?? "android") as Platform;
      const limit = rawInput?.limit ?? 10;
      const builds = await listRecentBuilds({
        platform,
        limit,
      });
      const rows = await Promise.all(builds.map(buildToHistoryRow));
      const result = await logBuildHistoryRows(rows);
      return {
        ...result,
        sheetDryRun: sheetsIsDryRun(),
      };
    }),

  alertOnLatestFailure: adminProcedure.mutation(async () => {
    const builds = await listRecentBuilds({ platform: "android", limit: 5 });
    const failed = builds.find((b) => b.status === "errored");
    if (!failed) return { sent: false, reason: "no errored builds" };
    const { log } = await getBuildLog(failed.id);
    const parsed = parseBuildLog(log);
    const result = await sendBuildAlert({
      title: `Android APK build ${failed.id} failed`,
      body: parsed.summary,
      buildId: failed.id,
      severity: parsed.hasGradleExecuteError || parsed.hasEvalAppError ? "critical" : "high",
    });
    return { sent: result.slack || result.email, ...result };
  }),

  // Self-test: synthetic logs through the parser + spike detector. No creds.
  selfTest: publicProcedure.query(() => {
    const sampleLog = `Setup
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
    const cleanLog = `Setup
Install dependencies
Prebuild
Run gradlew
BUILD SUCCESSFUL in 4m 17s
`;
    const errLog = `Upload to Google Play failed: 10091
10091 invalid signature
10091 retry
`;

    const failingParse = parseBuildLog(sampleLog);
    const cleanParse = parseBuildLog(cleanLog);
    const errParse = parseBuildLog(errLog);

    const spike = detect10091Spike(
      [
        { buildId: "a", finishedAt: new Date().toISOString(), count10091: 2 },
        { buildId: "b", finishedAt: new Date().toISOString(), count10091: 1 },
        { buildId: "c", finishedAt: new Date().toISOString(), count10091: 4 },
      ],
      { windowMinutes: 60, threshold: 3 },
    );

    const checks = [
      { name: "detects .execute() deprecation", pass: failingParse.hasGradleExecuteError },
      { name: "detects ':app' eval failure", pass: failingParse.hasEvalAppError },
      { name: "clean log has no signals", pass: failingParse.signals.length > 0 && cleanParse.signals.length === 0 },
      { name: "10091 detected", pass: errParse.has10091 && errParse.count10091 >= 3 },
      { name: "spike detection fires at threshold", pass: spike.spike },
    ];

    return {
      ok: checks.every((c) => c.pass),
      checks,
      summaryFailing: failingParse.summary,
      summaryClean: cleanParse.summary,
      summary10091: errParse.summary,
    };
  }),
});
