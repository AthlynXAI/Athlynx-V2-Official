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
  Eye,
  LockKeyhole,
  RefreshCw,
  Satellite,
  ShieldCheck,
  Zap,
} from "lucide-react";

type ConnectorHealthStatus = "ok" | "degraded" | "blocked" | "manual_review";

function statusBadge(status: ConnectorHealthStatus | string) {
  const map: Record<string, { label: string; cls: string }> = {
    ok: { label: "OK", cls: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30" },
    degraded: { label: "Degraded", cls: "bg-amber-500/20 text-amber-300 border-amber-500/30" },
    blocked: { label: "Blocked", cls: "bg-red-500/20 text-red-300 border-red-500/30" },
    manual_review: { label: "Same-Session Proof", cls: "bg-blue-500/20 text-blue-300 border-blue-500/30" },
  };
  const m = map[status] ?? { label: status, cls: "bg-slate-500/20 text-slate-300 border-slate-500/30" };
  return <Badge className={`border ${m.cls}`}>{m.label}</Badge>;
}

function ConnectorHealthOSInner() {
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const isAdmin = !!user && (user as any).role === "admin";

  const registryQuery = trpc.system.connectorRegistry.useQuery(undefined, {
    refetchInterval: 120_000,
  });
  const selfTestQuery = trpc.system.connectorHealthSelfTest.useQuery(undefined, {
    refetchInterval: 120_000,
  });
  const healthQuery = trpc.system.connectorHealth.useQuery(undefined, {
    enabled: isAdmin,
    refetchInterval: 60_000,
  });
  const emitSentry = trpc.system.emitConnectorHealthSentry.useMutation({
    onSuccess: (result) =>
      toast({
        title: "Sanitized connector proof emitted",
        description: `Sentry severity: ${result.severity}. Payload: summary counts + connector IDs only.`,
      }),
    onError: (err) =>
      toast({
        title: "Sentry emission failed",
        description: err.message,
        variant: "destructive",
      }),
  });

  const snapshot = healthQuery.data;
  const registry = registryQuery.data;
  const selfTest = selfTestQuery.data;
  const connectors = snapshot?.connectors ?? registry?.connectors ?? [];
  const summary = snapshot?.summary;

  return (
    <PlatformLayout>
      <div className="max-w-7xl mx-auto p-4 md:p-6 space-y-6 pb-24">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-2">
              <Satellite className="h-7 w-7 text-cyan-400" />
              AthlynXAI Connector Health OS
            </h1>
            <p className="text-sm text-slate-400 mt-1 max-w-3xl">
              Autonomous connector sweep dashboard for repo, deployment, compute, CRM, social,
              payment, storage, database, and monitoring rails. The system detects and reports proof gaps;
              OAuth providers can still expire or revoke sessions, so same-session read-only proof remains required.
              No passwords, tokens, private keys, cookies, or raw environment values are exposed.
            </p>
          </div>
          <div className="flex gap-2 flex-wrap">
            <Button variant="outline" onClick={() => void registryQuery.refetch()} className="gap-2">
              <Eye className="h-4 w-4" /> Registry
            </Button>
            <Button
              variant="outline"
              onClick={() => void healthQuery.refetch()}
              disabled={!isAdmin}
              className="gap-2"
            >
              <RefreshCw className="h-4 w-4" /> Sweep
            </Button>
            <Button
              onClick={() => emitSentry.mutate()}
              disabled={!isAdmin || emitSentry.isPending}
              className="gap-2"
            >
              <Zap className="h-4 w-4" /> Emit Sentry Proof
            </Button>
          </div>
        </div>

        {!isAdmin && !authLoading && (
          <Card className="border-blue-500/30 bg-blue-950/20">
            <CardContent className="p-6 text-slate-300">
              Public view shows the connector registry and self-test only. OAuth scopes, environment
              proof, cron logs, and live sweep details are protected. Sign in as an admin to run the
              live connector sweep. This prevents exposing infrastructure status or secret-adjacent
              proof to the public web.
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm text-slate-300 flex items-center gap-2">
                <Activity className="h-4 w-4" /> Total Rails
              </CardTitle>
            </CardHeader>
            <CardContent className="text-3xl font-black text-white">
              {summary?.total ?? connectors.length}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm text-slate-300 flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4" /> OK
              </CardTitle>
            </CardHeader>
            <CardContent className="text-3xl font-black text-emerald-300">
              {summary?.ok ?? "—"}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm text-slate-300 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" /> Blocked
              </CardTitle>
            </CardHeader>
            <CardContent className="text-3xl font-black text-red-300">
              {summary?.blocked ?? "—"}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm text-slate-300 flex items-center gap-2">
                <ShieldCheck className="h-4 w-4" /> OAuth / Manual Proof
              </CardTitle>
            </CardHeader>
            <CardContent className="text-3xl font-black text-blue-300">
              {summary?.manualReview ?? "—"}
            </CardContent>
          </Card>
        </div>

        {summary?.criticalBlocked ? (
          <Card className="border-red-500/40 bg-red-950/20">
            <CardContent className="p-4 text-red-200 flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 mt-0.5" />
              <div>
                <div className="font-semibold">Critical connector blocker detected</div>
                <div className="text-sm">
                  {summary.criticalBlocked} critical rail(s) are blocked. Production automation must
                  stop on affected lanes until a secure connector or environment proof is restored.
                </div>
              </div>
            </CardContent>
          </Card>
        ) : null}

        <Card className="border-cyan-500/30 bg-cyan-950/10">
          <CardHeader>
            <CardTitle className="text-base text-white flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-cyan-400" /> Watchdog Reality Check
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm text-slate-300">
            <div className="rounded-xl border border-cyan-500/20 bg-slate-950/40 p-4">
              <div className="text-cyan-300 font-black mb-1">Detection, not magic</div>
              OAuth sessions can expire or be revoked by third-party apps. The OS detects proof gaps and blocks unsafe actions; it cannot force external providers to stay connected forever.
            </div>
            <div className="rounded-xl border border-blue-500/20 bg-slate-950/40 p-4">
              <div className="text-blue-300 font-black mb-1">Cron watchdog</div>
              The cloud-computer sweep runs on a schedule and may report blocked/manual-review when secure env or OAuth proof is missing. That is expected fail-closed behavior.
            </div>
            <div className="rounded-xl border border-emerald-500/20 bg-slate-950/40 p-4">
              <div className="text-emerald-300 font-black mb-1">Sentry proof</div>
              Sentry proof sends sanitized summary counts and connector IDs only. Secret values, tokens, cookies, and mailbox data are never emitted.
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base text-white flex items-center gap-2">
              <LockKeyhole className="h-5 w-5 text-cyan-400" /> Doctrine Lock
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-slate-300">
            <div>
              <div className="text-slate-500 uppercase text-xs font-black tracking-widest">Repo</div>
              {snapshot?.doctrine.productionRepo ?? registry?.doctrine.productionRepo}
            </div>
            <div>
              <div className="text-slate-500 uppercase text-xs font-black tracking-widest">Vercel</div>
              {snapshot?.doctrine.productionVercelProject ?? registry?.doctrine.productionVercelProject}
            </div>
            <div>
              <div className="text-slate-500 uppercase text-xs font-black tracking-widest">Owner Lane</div>
              {snapshot?.doctrine.defaultOwnerLane ?? registry?.doctrine.defaultOwnerLane}
            </div>
            <div>
              <div className="text-slate-500 uppercase text-xs font-black tracking-widest">Secret Rule</div>
              {snapshot?.doctrine.secretRule ?? registry?.doctrine.secretRule}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base text-white flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-cyan-400" /> Self-Test
              {selfTest?.ok ? statusBadge("ok") : statusBadge("degraded")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
              {selfTest?.checks.map((check) => (
                <li key={check.name} className="flex items-center gap-2 text-slate-200">
                  {check.pass ? (
                    <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  ) : (
                    <AlertTriangle className="h-4 w-4 text-amber-400" />
                  )}
                  {check.name}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base text-white">Connector Rails</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-slate-400 border-b border-blue-800/30">
                  <tr className="text-left">
                    <th className="px-4 py-2">Rail</th>
                    <th className="px-4 py-2">Status</th>
                    <th className="px-4 py-2">Tier</th>
                    <th className="px-4 py-2">Lane</th>
                    <th className="px-4 py-2">Owner / Context</th>
                    <th className="px-4 py-2">Proof Rule</th>
                    <th className="px-4 py-2">Recovery</th>
                  </tr>
                </thead>
                <tbody>
                  {connectors.map((connector: any) => (
                    <tr key={connector.id} className="border-b border-blue-800/20 hover:bg-blue-900/10">
                      <td className="px-4 py-2 font-semibold text-slate-100">{connector.label}</td>
                      <td className="px-4 py-2">{statusBadge(connector.status ?? "manual_review")}</td>
                      <td className="px-4 py-2 text-slate-300 capitalize">{connector.tier}</td>
                      <td className="px-4 py-2 text-slate-300 capitalize">{connector.lane}</td>
                      <td className="px-4 py-2 text-slate-300 max-w-xs">{connector.ownerAccount}</td>
                      <td className="px-4 py-2 text-slate-400 max-w-md">{connector.safeCheck}</td>
                      <td className="px-4 py-2 text-slate-400 max-w-md">
                    {connector.recoveryAction}
                    {connector.status === "manual_review" ? (
                      <div className="mt-1 text-[11px] text-blue-300">
                        Standard security gate: run same-session read-only proof before any external mutation.
                      </div>
                    ) : null}
                    {connector.status === "blocked" ? (
                      <div className="mt-1 text-[11px] text-red-300">
                        Fail-closed: do not push, send, post, charge, migrate, or automate this rail until restored.
                      </div>
                    ) : null}
                  </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
      <MobileBottomNav />
    </PlatformLayout>
  );
}

export default function ConnectorHealthOS() {
  return (
    <RouteErrorBoundary>
      <ConnectorHealthOSInner />
    </RouteErrorBoundary>
  );
}
