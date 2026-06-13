/**
 * EAS Build client — talks to api.expo.dev for build status + logs.
 *
 * Auth: EXPO_TOKEN (personal access token).
 * Project: EAS_PROJECT_ID (from app.json `extra.eas.projectId`).
 *
 * Production mode: always returns real EAS data. If credentials are missing,
 * returns an empty array / error message so the dashboard shows the real state
 * rather than fake mock data. EAS_DRY_RUN is removed from production.
 */

export type EasBuildStatus =
  | "new"
  | "in-queue"
  | "in-progress"
  | "errored"
  | "finished"
  | "canceled"
  | "unknown";

export type EasBuild = {
  id: string;
  status: EasBuildStatus;
  platform: "android" | "ios";
  appVersion?: string;
  appBuildVersion?: string;
  gitCommitHash?: string;
  createdAt: string;
  updatedAt: string;
  artifacts?: { applicationArchiveUrl?: string };
  logsUrl?: string;
  source: "live" | "no-credentials";
};

const EAS_API = "https://api.expo.dev";

function envOrEmpty(k: string): string {
  return (process.env[k] ?? "").trim();
}

export function easIsConfigured(): boolean {
  return !!envOrEmpty("EXPO_TOKEN") && !!envOrEmpty("EAS_PROJECT_ID");
}

export function easConfigSummary() {
  return {
    configured: easIsConfigured(),
    hasToken: !!envOrEmpty("EXPO_TOKEN"),
    hasProjectId: !!envOrEmpty("EAS_PROJECT_ID"),
    projectId: envOrEmpty("EAS_PROJECT_ID") || null,
    appPackage: envOrEmpty("EAS_APP_PACKAGE") || "ai.athlynx.app",
  };
}

/**
 * List recent builds from EAS. Returns empty array with source="no-credentials"
 * if EXPO_TOKEN or EAS_PROJECT_ID are not set. Throws on API errors.
 */
export async function listRecentBuilds(opts?: { limit?: number; platform?: "android" | "ios" }): Promise<EasBuild[]> {
  const limit = opts?.limit ?? 10;
  const platform = opts?.platform ?? "android";

  if (!easIsConfigured()) {
    console.warn("[easClient] EXPO_TOKEN or EAS_PROJECT_ID not set — returning empty build list");
    return [];
  }

  const token = envOrEmpty("EXPO_TOKEN");
  const projectId = envOrEmpty("EAS_PROJECT_ID");
  const query = `
    query Builds($appId: String!, $limit: Int!, $platform: AppPlatform) {
      app { byId(appId: $appId) {
        builds(limit: $limit, filter: { platform: $platform }) {
          id status platform appVersion appBuildVersion gitCommitHash
          createdAt updatedAt
          artifacts { applicationArchiveUrl }
          logFiles
        }
      } }
    }
  `;

  const res = await fetch(`${EAS_API}/graphql`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query,
      variables: { appId: projectId, limit, platform: platform.toUpperCase() },
    }),
  });

  if (!res.ok) {
    throw new Error(`EAS GraphQL ${res.status} ${res.statusText}`);
  }

  const data = await res.json();
  const rows: any[] = data?.data?.app?.byId?.builds ?? [];

  return rows.map((r) => ({
    id: r.id,
    status: (r.status?.toLowerCase() ?? "unknown") as EasBuildStatus,
    platform: (r.platform?.toLowerCase() ?? "android") as "android" | "ios",
    appVersion: r.appVersion,
    appBuildVersion: r.appBuildVersion,
    gitCommitHash: r.gitCommitHash,
    createdAt: r.createdAt,
    updatedAt: r.updatedAt,
    artifacts: r.artifacts ?? undefined,
    logsUrl: Array.isArray(r.logFiles) && r.logFiles.length ? r.logFiles[0] : undefined,
    source: "live" as const,
  }));
}

export async function getBuildLog(buildId: string): Promise<{ log: string; source: "live" | "no-credentials" }> {
  if (!easIsConfigured()) {
    return { log: "EAS credentials not configured. Set EXPO_TOKEN and EAS_PROJECT_ID in Vercel environment variables.", source: "no-credentials" };
  }

  const builds = await listRecentBuilds({ limit: 50 });
  const target = builds.find((b) => b.id === buildId);
  if (!target?.logsUrl) {
    return { log: `No log URL found for build ${buildId}.`, source: "no-credentials" };
  }

  const res = await fetch(target.logsUrl);
  if (!res.ok) throw new Error(`EAS log fetch ${res.status}`);
  const text = await res.text();
  return { log: text, source: "live" };
}
