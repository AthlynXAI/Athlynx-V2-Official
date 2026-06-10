import { useMemo, useState } from "react";
import { RouteErrorBoundary } from "@/components/GlobalErrorBoundary";
import PlatformLayout from "@/components/PlatformLayout";
import MobileBottomNav from "@/components/MobileBottomNav";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  Hammer,
  RefreshCw,
  Smartphone,
  Apple,
  FileText,
  PlayCircle,
  Bell,
} from "lucide-react";

type Platform = "android" | "ios";

function statusBadge(status: string) {
  const map: Record<string, { label: string; cls: string }> = {
    finished: { label: "Finished", cls: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30" },
    "in-progress": { label: "In progress", cls: "bg-blue-500/20 text-blue-300 border-blue-500/30" },
    "in-queue": { label: "Queued", cls: "bg-slate-500/20 text-slate-300 border-slate-500/30" },
    new: { label: "New", cls: "bg-slate-500/20 text-slate-300 border-slate-500/30" },
    errored: { label: "Errored", cls: "bg-red-500/20 text-red-300 border-red-500/30" },
    canceled: { label: "Canceled", cls: "bg-amber-500/20 text-amber-300 border-amber-500/30" },
  };
  const m = map[status] ?? { label: status, cls: "bg-slate-500/20 text-slate-300 border-slate-500/30" };
  return <Badge className={`border ${m.cls}`}>{m.label}</Badge>;
}

function BuildMonitorInner() {
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const [platform, setPlatform] = useState<Platform>("android");
  const [selectedBuild, setSelectedBuild] = useState<string | null>(null);

  const isAdmin = !!user && (user as any).role === "admin";

  const configQuery = trpc.buildMonitor.getConfig.useQuery();
  const selfTestQuery = trpc.buildMonitor.selfTest.useQuery();
  const statusQuery = trpc.buildMonitor.getStatus.useQuery(
    { platform, limit: 10, windowMinutes: 60, spikeThreshold: 3 },
    { enabled: isAdmin, refetchInterval: 30_000 },
  );
  const logQuery = trpc.buildMonitor.getBuildLog.useQuery(
    { buildId: selectedBuild ?? "" },
    { enabled: isAdmin && !!selectedBuild },
  );

  const logHistory = trpc.buildMonitor.logHistory.useMutation({
    onSuccess: (r) =>
      toast({
        title: r.dryRun ? "Sheets dry-run" : "History logged",
        description: `appended=${r.appended}, skipped=${r.skipped}`,
      }),
    onError: (e) => toast({ title: "Sheets log failed", description: e.message, variant: "destructive" }),
  });
  const fireAlert = trpc.buildMonitor.alertOnLatestFailure.useMutation({
    onSuccess: (r) => {
      const ra = r as { sent: boolean; slack?: boolean; email?: boolean; reason?: string };
      toast({
        title: ra.sent ? "Alert dispatched" : "Alert skipped",
        description: ra.sent
          ? `slack=${ra.slack ?? false} email=${ra.email ?? false}`
          : ra.reason ?? "no destinations",
      });
    },
    onError: (e) => toast({ title: "Alert failed", description: e.message, variant: "destructive" }),
  });

  const config = configQuery.data;
  const status = statusQuery.data;

  const allChecksPass = selfTestQuery.data?.ok ?? false;

  const builds = useMemo(() => status?.builds ?? [], [status]);

  return (
    <PlatformLayout>
      <div className="max-w-7xl mx-auto p-4 md:p-6 space-y-6 pb-24">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-2">
              <Hammer className="h-7 w-7 text-blue-400" />
              Build Monitor
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Live status of the AthlynXAI mobile pipeline. Google Play APK first; Apple is pending.
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant={platform === "android" ? "default" : "outline"}
              onClick={() => setPlatform("android")}
              className="gap-2"
            >
              <Smartphone className="h-4 w-4" /> Android
            </Button>
            <Button variant="outline" disabled className="gap-2 opacity-60">
              <Apple className="h-4 w-4" /> iOS (pending)
            </Button>
            <Button variant="outline" onClick={() => statusQuery.refetch()} className="gap-2">
              <RefreshCw className="h-4 w-4" /> Refresh
            </Button>
          </div>
        </div>

        {!isAdmin && !authLoading && (
          <Card>
            <CardContent className="p-6 text-slate-300">
              You must be signed in as an admin to view live build data. Self-test and config below
              are still available.
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm text-slate-300 flex items-center gap-2">
                <Activity className="h-4 w-4" /> EAS connection
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-1 text-sm text-slate-200">
              <div>Mode: {config?.eas.dryRun ? "Dry-run / mock" : "Live"}</div>
              <div>Token: {config?.eas.hasToken ? "set" : "missing"}</div>
              <div>Project ID: {config?.eas.hasProjectId ? "set" : "missing"}</div>
              <div className="text-slate-400 break-all">
                Package: {config?.android.package}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm text-slate-300 flex items-center gap-2">
                <FileText className="h-4 w-4" /> Sheets logger
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-1 text-sm text-slate-200">
              <div>Mode: {config?.sheets.dryRun ? "Dry-run" : "Live"}</div>
              <div>Sheet: {config?.sheets.hasSheetId ? config?.sheets.sheetId : "missing"}</div>
              <div>Tab: {config?.sheets.tabName}</div>
              <div className="pt-2">
                <Button
                  size="sm"
                  onClick={() => logHistory.mutate({ platform, limit: 10 })}
                  disabled={!isAdmin || logHistory.isPending}
                >
                  Append last 10 builds
                </Button>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm text-slate-300 flex items-center gap-2">
                <Bell className="h-4 w-4" /> Alerter
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-1 text-sm text-slate-200">
              <div>Slack: {config?.alerter.hasSlack ? "configured" : "missing"}</div>
              <div>Email: {config?.alerter.hasEmail ? "configured" : "missing"}</div>
              <div className="pt-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => fireAlert.mutate()}
                  disabled={!isAdmin || fireAlert.isPending}
                >
                  Send alert for latest failure
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-base text-white flex items-center gap-2">
              <PlayCircle className="h-5 w-5 text-blue-400" /> Self-test
              {allChecksPass ? (
                <Badge className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">PASS</Badge>
              ) : (
                <Badge className="bg-red-500/20 text-red-300 border border-red-500/30">FAIL</Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
              {selfTestQuery.data?.checks.map((c) => (
                <li key={c.name} className="flex items-center gap-2 text-slate-200">
                  {c.pass ? (
                    <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  ) : (
                    <AlertTriangle className="h-4 w-4 text-red-400" />
                  )}
                  {c.name}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {status?.spike10091?.spike && (
          <Card className="border-red-500/40">
            <CardContent className="p-4 text-red-200 flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 mt-0.5" />
              <div>
                <div className="font-semibold">10091 spike detected</div>
                <div className="text-sm">
                  {status.spike10091.matches.length} affected builds in the last{" "}
                  {status.spike10091.window} minutes (threshold {status.spike10091.threshold}).
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle className="text-base text-white">Recent builds</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-slate-400 border-b border-blue-800/30">
                  <tr className="text-left">
                    <th className="px-4 py-2">Build</th>
                    <th className="px-4 py-2">Status</th>
                    <th className="px-4 py-2">Version</th>
                    <th className="px-4 py-2">Commit</th>
                    <th className="px-4 py-2">Updated</th>
                    <th className="px-4 py-2">Failure summary</th>
                    <th className="px-4 py-2"></th>
                  </tr>
                </thead>
                <tbody>
                  {builds.length === 0 && (
                    <tr>
                      <td colSpan={7} className="px-4 py-6 text-slate-400">
                        {statusQuery.isLoading ? "Loading…" : "No builds visible. Check EAS config."}
                      </td>
                    </tr>
                  )}
                  {builds.map((b: any) => (
                    <tr key={b.build.id} className="border-b border-blue-800/20 hover:bg-blue-900/10">
                      <td className="px-4 py-2 font-mono text-xs text-slate-200">{b.build.id}</td>
                      <td className="px-4 py-2">{statusBadge(b.build.status)}</td>
                      <td className="px-4 py-2 text-slate-300">
                        {b.build.appVersion ?? "—"} ({b.build.appBuildVersion ?? "?"})
                      </td>
                      <td className="px-4 py-2 font-mono text-xs text-slate-400">
                        {b.build.gitCommitHash ? b.build.gitCommitHash.slice(0, 8) : "—"}
                      </td>
                      <td className="px-4 py-2 text-slate-400">
                        {new Date(b.build.updatedAt).toLocaleString()}
                      </td>
                      <td className="px-4 py-2 text-slate-300 max-w-md">
                        {b.parsed?.summary ?? (b.build.status === "errored" ? "Log unavailable" : "—")}
                      </td>
                      <td className="px-4 py-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setSelectedBuild(b.build.id)}
                        >
                          Log
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {selectedBuild && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base text-white flex items-center gap-2">
                Log for {selectedBuild}
                {logQuery.data?.source === "mock" && (
                  <Badge className="bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    mock
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {logQuery.data && (
                <>
                  <div className="text-slate-300 text-sm">
                    <div className="font-semibold">{logQuery.data.parsed.summary}</div>
                    <div className="text-slate-400">
                      {logQuery.data.parsed.signals.length} signal(s),{" "}
                      {logQuery.data.parsed.count10091} × 10091
                    </div>
                  </div>
                  <pre className="text-xs bg-slate-950 text-slate-200 p-3 rounded-lg overflow-x-auto max-h-96">
                    {logQuery.data.logExcerpt}
                  </pre>
                  <ul className="text-xs text-slate-300 space-y-1">
                    {logQuery.data.parsed.signals.slice(0, 20).map((s, i) => (
                      <li key={i}>
                        <span className="text-amber-300">[{s.severity}]</span>{" "}
                        <span className="text-slate-400">L{s.line}</span> {s.category}: {s.excerpt}
                        {s.hint && <div className="pl-6 text-slate-500">↳ {s.hint}</div>}
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </CardContent>
          </Card>
        )}
      </div>
      <MobileBottomNav />
    </PlatformLayout>
  );
}

export default function BuildMonitor() {
  return (
    <RouteErrorBoundary>
      <BuildMonitorInner />
    </RouteErrorBoundary>
  );
}
