/**
 * EAS Build client — talks to api.expo.dev for build status + logs.
 *
 * Auth: EXPO_TOKEN (personal access token).
 * Project: EAS_PROJECT_ID (from app.json `extra.eas.projectId`).
 *
 * If credentials are missing OR EAS_DRY_RUN=1, returns mock data so the
 * dashboard remains functional in development / when EAS is unreachable.
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
  source: "live" | "mock";
};

const EAS_API = "https://api.expo.dev";

function envOrEmpty(k: string): string {
  return (process.env[k] ?? "").trim();
}

export function easIsDryRun(): boolean {
  if (envOrEmpty("EAS_DRY_RUN") === "1") return true;
  if (!envOrEmpty("EXPO_TOKEN")) return true;
  if (!envOrEmpty("EAS_PROJECT_ID")) return true;
  return false;
}

export function easConfigSummary() {
  return {
    dryRun: easIsDryRun(),
    hasToken: !!envOrEmpty("EXPO_TOKEN"),
    hasProjectId: !!envOrEmpty("EAS_PROJECT_ID"),
    projectId: envOrEmpty("EAS_PROJECT_ID") || null,
    appPackage: envOrEmpty("EAS_APP_PACKAGE") || "ai.athlynx.app",
  };
}

const MOCK_BUILDS: EasBuild[] = [
  {
    id: "mock-build-001",
    status: "errored",
    platform: "android",
    appVersion: "1.0.0",
    appBuildVersion: "3",
    gitCommitHash: "35e07a8",
    createdAt: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 75).toISOString(),
    logsUrl: "mock://logs/mock-build-001",
    source: "mock",
  },
  {
    id: "mock-build-002",
    status: "in-progress",
    platform: "android",
    appVersion: "1.0.0",
    appBuildVersion: "4",
    gitCommitHash: "35e07a8",
    createdAt: new Date(Date.now() - 1000 * 60 * 8).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 1).toISOString(),
    logsUrl: "mock://logs/mock-build-002",
    source: "mock",
  },
];

const MOCK_LOG = `Setup
Install dependencies
Prebuild
> npx expo prebuild --platform android --clean
✔ Created native directory
Run gradlew
> ./gradlew :app:assembleRelease
FAILURE: Build failed with an exception.
* What went wrong:
A problem occurred evaluating project ':app'.
> "git rev-parse --short HEAD".execute().text.trim()
> A problem occurred starting process 'command 'git''
Execution failed for task ':app:processReleaseManifest'.
BUILD FAILED in 2m 14s
Error: Run gradlew failed
command failed with exit code 1
`;

async function easFetch(path: string): Promise<any> {
  const token = envOrEmpty("EXPO_TOKEN");
  const res = await fetch(`${EAS_API}${path}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
  });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`EAS API ${res.status} ${res.statusText} — ${body.slice(0, 300)}`);
  }
  return res.json();
}

/**
 * List recent builds. EAS GraphQL is the canonical surface; we wrap a thin
 * fetch + GraphQL POST so we don't add a new dependency. If the GraphQL
 * shape changes we still return mock data on error so the dashboard renders.
 */
export async function listRecentBuilds(opts?: { limit?: number; platform?: "android" | "ios" }): Promise<EasBuild[]> {
  const limit = opts?.limit ?? 10;
  const platform = opts?.platform ?? "android";
  if (easIsDryRun()) {
    return MOCK_BUILDS.filter((b) => b.platform === platform).slice(0, limit);
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
  try {
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
    if (!res.ok) throw new Error(`EAS GraphQL ${res.status}`);
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
  } catch (err) {
    console.warn("[easClient] listRecentBuilds failed, returning mock:", err);
    return MOCK_BUILDS.filter((b) => b.platform === platform).slice(0, limit);
  }
}

export async function getBuildLog(buildId: string): Promise<{ log: string; source: "live" | "mock" }> {
  if (easIsDryRun() || buildId.startsWith("mock-")) {
    return { log: MOCK_LOG, source: "mock" };
  }
  // EAS exposes a build's log URLs via the GraphQL `logFiles` field. We fetch
  // the first one; on any failure we degrade to mock.
  try {
    const builds = await listRecentBuilds({ limit: 50 });
    const target = builds.find((b) => b.id === buildId);
    if (!target?.logsUrl) return { log: MOCK_LOG, source: "mock" };
    const res = await fetch(target.logsUrl);
    if (!res.ok) throw new Error(`logs fetch ${res.status}`);
    const text = await res.text();
    return { log: text, source: "live" };
  } catch (err) {
    console.warn("[easClient] getBuildLog failed, returning mock:", err);
    return { log: MOCK_LOG, source: "mock" };
  }
}
