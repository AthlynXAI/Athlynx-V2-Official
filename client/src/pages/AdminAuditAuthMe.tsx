import { Activity, AlertTriangle, Clock, Cookie, KeyRound, RefreshCw, ServerCrash, ShieldAlert } from "lucide-react";
// Build 51 — /api/auth/me Audit Dashboard
// Admin-only dashboard at /admin/audit/auth-me.
//
// Pulls live data from /api/admin/audit/auth-me/{summary,timeseries,groups,flagged}
// (all admin-gated). NO MOCK DATA — every number comes from the auth_me_events
// table, which is populated by the structured logger registered against the
// real /api/auth/me handler in server/entry.ts.

import { useEffect, useMemo, useState } from "react";
import { useLocation } from "wouter";
import { RouteErrorBoundary } from "@/components/GlobalErrorBoundary";
import PlatformLayout from "@/components/PlatformLayout";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Legend,
} from "recharts";

type Win = "24h" | "7d" | "30d";

type Summary = {
  window: string;
  since: string;
  total?: number;
  ok_count?: number;
  unauth_count?: number;
  sessions?: number;
  unique_ips?: number;
  unique_uas?: number;
};

type Point = { t: string; ok: number; unauth: number };
type TS = { window: string; bucket: string; points: Point[] };

type GroupRow = {
  key: string;
  total: number;
  unauth: number;
  ok: number;
  firstSeen: string | null;
  lastSeen: string | null;
};
type GroupsResp = { window: string; by: string; groups: GroupRow[] };

type Flagged = {
  sessionId: string;
  transitionAt: string;
  prevSeenAt: string | null;
  ip: string | null;
  userAgent: string | null;
  authProvider: string;
  tokenState: string;
  failureReason: string | null;
  headersPresent: Record<string, boolean>;
  userEmail: string | null;
  rootCause: string;
};
type FlaggedResp = { window: string; flagged: Flagged[] };

async function fetchJson<T>(url: string): Promise<T> {
  const r = await fetch(url, { credentials: "include" });
  if (!r.ok) throw new Error(`${url} → ${r.status}`);
  return r.json();
}

function fmtTs(s: string | null): string {
  if (!s) return "—";
  const d = new Date(s);
  return d.toLocaleString();
}

function rootCauseBadge(cause: string) {
  const map: Record<string, { label: string; color: string; Icon: any }> = {
    expired_token:           { label: "Expired token",          color: "bg-blue-900/40/15 text-blue-400 border-blue-500/40/40",  Icon: Clock },
    missing_credentials:     { label: "Missing credentials",    color: "bg-rose-500/15 text-rose-300 border-rose-500/40",     Icon: KeyRound },
    missing_session_cookie:  { label: "Missing session cookie", color: "bg-rose-500/15 text-rose-300 border-rose-500/40",     Icon: Cookie },
    no_credentials_sent:     { label: "No credentials sent",    color: "bg-rose-500/15 text-rose-300 border-rose-500/40",     Icon: KeyRound },
    malformed_token:         { label: "Malformed token",        color: "bg-blue-500/15 text-blue-300 border-blue-500/40", Icon: AlertTriangle },
    invalid_token:           { label: "Invalid token",          color: "bg-blue-500/15 text-blue-300 border-blue-500/40", Icon: AlertTriangle },
    header_misconfiguration: { label: "Header misconfig",       color: "bg-fuchsia-500/15 text-fuchsia-300 border-fuchsia-500/40", Icon: ServerCrash },
    unclassified:            { label: "Unclassified",           color: "bg-slate-500/15 text-slate-300 border-slate-500/40",   Icon: ShieldAlert },
  };
  const e = map[cause] ?? map.unclassified;
  const I = e.Icon;
  return (
    <span className={`inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-xs ${e.color}`}>
      <I className="h-3 w-3" /> {e.label}
    </span>
  );
}

function providerBadge(p: string) {
  const color =
    p === "supabase" ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/40" :
    p === "nextauth" ? "bg-violet-500/15 text-violet-300 border-violet-500/40" :
    p === "clerk"    ? "bg-sky-500/15 text-sky-300 border-sky-500/40" :
    p === "custom_jwt" ? "bg-cyan-500/15 text-cyan-300 border-cyan-500/40" :
    p === "none"     ? "bg-zinc-500/15 text-zinc-300 border-zinc-500/40" :
                       "bg-slate-500/15 text-slate-300 border-slate-500/40";
  return <span className={`inline-flex items-center rounded-md border px-2 py-0.5 text-xs ${color}`}>{p}</span>;
}

function StatCard({ label, value, sublabel }: { label: string; value: string | number; sublabel?: string }) {
  return (
    <Card className="bg-[#0d2847] border-cyan-500/20">
      <CardHeader className="pb-2">
        <CardDescription className="text-cyan-300/70 text-xs uppercase tracking-wider">{label}</CardDescription>
        <CardTitle className="text-3xl text-white">{value}</CardTitle>
      </CardHeader>
      {sublabel && <CardContent className="text-xs text-gray-400 pt-0">{sublabel}</CardContent>}
    </Card>
  );
}

function GroupTable({ resp, label }: { resp: GroupsResp | null; label: string }) {
  if (!resp) return <div className="text-sm text-gray-400 p-4">Loading…</div>;
  if (!resp.groups.length) return <div className="text-sm text-gray-400 p-4">No 401s recorded in this window.</div>;
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="text-cyan-300/70 text-xs uppercase tracking-wider">
          <tr>
            <th className="text-left py-2 pr-3">{label}</th>
            <th className="text-right py-2 px-3">401s</th>
            <th className="text-right py-2 px-3">200s</th>
            <th className="text-right py-2 px-3">Total</th>
            <th className="text-right py-2 pl-3">Last seen</th>
          </tr>
        </thead>
        <tbody>
          {resp.groups.map((g) => (
            <tr key={g.key} className="border-t border-cyan-500/10 text-gray-200">
              <td className="py-2 pr-3 font-mono text-xs max-w-[420px] truncate" title={g.key}>{g.key}</td>
              <td className="py-2 px-3 text-right text-rose-300">{g.unauth}</td>
              <td className="py-2 px-3 text-right text-emerald-300">{g.ok}</td>
              <td className="py-2 px-3 text-right">{g.total}</td>
              <td className="py-2 pl-3 text-right text-gray-400">{fmtTs(g.lastSeen)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function AdminAuditAuthMeInner() {
  const meQuery = trpc.auth.me.useQuery(undefined, { retry: false, refetchOnWindowFocus: false });
  const [, navigate] = useLocation();
  const [win, setWin] = useState<Win>("30d");
  const [summary, setSummary] = useState<Summary | null>(null);
  const [ts, setTs] = useState<TS | null>(null);
  const [bySession, setBySession] = useState<GroupsResp | null>(null);
  const [byUa, setByUa] = useState<GroupsResp | null>(null);
  const [byIp, setByIp] = useState<GroupsResp | null>(null);
  const [byProv, setByProv] = useState<GroupsResp | null>(null);
  const [flagged, setFlagged] = useState<FlaggedResp | null>(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const isAdmin = meQuery.data?.role === "admin";

  async function loadAll(w: Win) {
    setLoading(true); setErr(null);
    try {
      const [s, t, gs, gu, gi, gp, f] = await Promise.all([
        fetchJson<Summary>(`/api/admin/audit/auth-me/summary?window=${w}`),
        fetchJson<TS>(`/api/admin/audit/auth-me/timeseries?window=${w}`),
        fetchJson<GroupsResp>(`/api/admin/audit/auth-me/groups?window=${w}&by=session`),
        fetchJson<GroupsResp>(`/api/admin/audit/auth-me/groups?window=${w}&by=ua`),
        fetchJson<GroupsResp>(`/api/admin/audit/auth-me/groups?window=${w}&by=ip`),
        fetchJson<GroupsResp>(`/api/admin/audit/auth-me/groups?window=${w}&by=provider`),
        fetchJson<FlaggedResp>(`/api/admin/audit/auth-me/flagged?window=${w}`),
      ]);
      setSummary(s); setTs(t); setBySession(gs); setByUa(gu); setByIp(gi); setByProv(gp); setFlagged(f);
    } catch (e: any) {
      setErr(String(e?.message ?? e));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { if (isAdmin) void loadAll(win); }, [isAdmin, win]);

  const chartData = useMemo(() => (ts?.points ?? []).map((p) => ({
    t: new Date(p.t).toLocaleString(undefined, { month: "short", day: "numeric", hour: "2-digit" }),
    ok: p.ok, unauth: p.unauth,
  })), [ts]);

  if (meQuery.isLoading) {
    return (
      <div className="min-h-screen bg-[#0a1628] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-400" />
      </div>
    );
  }
  if (!meQuery.data) { navigate("/signin"); return null; }
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-[#0a1628] flex items-center justify-center p-6">
        <Card className="bg-[#0d2847] border-rose-500/30 max-w-md">
          <CardHeader>
            <CardTitle className="text-rose-300 flex items-center gap-2"><ShieldAlert className="h-5 w-5" /> Admin only</CardTitle>
            <CardDescription className="text-gray-400">
              The Auth Audit Dashboard is restricted to administrators.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a1628] text-white">
      <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-6">
        <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <h1 className="text-2xl md:text-3xl font-semibold flex items-center gap-3">
              <Activity className="h-6 w-6 text-cyan-300" />
              /api/auth/me Audit Dashboard
            </h1>
            <p className="text-sm text-gray-400 mt-1">
              Live grouping of 401s by session, user agent, IP, and auth provider. Flags 200→401 transitions without a logout.
            </p>
          </div>
          <div className="flex items-center gap-2">
            {(["24h","7d","30d"] as Win[]).map((w) => (
              <Button key={w} variant={win===w?"default":"outline"} size="sm" onClick={() => setWin(w)}>{w}</Button>
            ))}
            <Button variant="outline" size="sm" onClick={() => loadAll(win)} disabled={loading}>
              <RefreshCw className={`h-3.5 w-3.5 mr-1 ${loading?"animate-spin":""}`} /> Refresh
            </Button>
          </div>
        </header>

        {err && (
          <Card className="bg-rose-950/40 border-rose-500/40">
            <CardContent className="text-sm text-rose-200 py-3">Error loading dashboard: {err}</CardContent>
          </Card>
        )}

        <section className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <StatCard label="Total requests" value={summary?.total ?? 0} sublabel={`Since ${summary?.since ? fmtTs(summary.since) : "—"}`} />
          <StatCard label="200 OK" value={summary?.ok_count ?? 0} />
          <StatCard label="401 Unauthorized" value={summary?.unauth_count ?? 0} />
          <StatCard label="Distinct sessions" value={summary?.sessions ?? 0} sublabel={`${summary?.unique_ips ?? 0} IPs · ${summary?.unique_uas ?? 0} UAs`} />
        </section>

        <Card className="bg-[#0d2847] border-cyan-500/20">
          <CardHeader>
            <CardTitle className="text-white text-base">200s vs 401s over time</CardTitle>
            <CardDescription className="text-gray-400">Bucketed {ts?.bucket ?? "—"}</CardDescription>
          </CardHeader>
          <CardContent style={{ height: 320 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 8, right: 16, bottom: 8, left: 0 }}>
                <CartesianGrid stroke="#1f3a5f" strokeDasharray="3 3" />
                <XAxis dataKey="t" stroke="#7ab8d6" fontSize={11} />
                <YAxis stroke="#7ab8d6" fontSize={11} allowDecimals={false} />
                <Tooltip contentStyle={{ background: "#0a1628", border: "1px solid #155e75" }} />
                <Legend />
                <Line type="monotone" dataKey="ok"     name="200 OK"        stroke="#34d399" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="unauth" name="401 Unauthorized" stroke="#fb7185" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-[#0d2847] border-cyan-500/20">
          <CardHeader>
            <CardTitle className="text-white text-base flex items-center gap-2"><AlertTriangle className="h-4 w-4 text-blue-400" /> Flagged sessions: 200 → 401 without logout</CardTitle>
            <CardDescription className="text-gray-400">
              Sessions whose previous /api/auth/me was 200 and then transitioned to 401 with no /api/auth/logout-marker in between. Suspected root cause is inferred from token state and headers on the failing request.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!flagged ? (
              <div className="text-sm text-gray-400 p-2">Loading…</div>
            ) : flagged.flagged.length === 0 ? (
              <div className="text-sm text-emerald-300 p-2">No suspicious transitions in this window.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="text-cyan-300/70 text-xs uppercase tracking-wider">
                    <tr>
                      <th className="text-left py-2 pr-3">When</th>
                      <th className="text-left py-2 px-3">Session (sha256 prefix)</th>
                      <th className="text-left py-2 px-3">Provider</th>
                      <th className="text-left py-2 px-3">Suspected cause</th>
                      <th className="text-left py-2 px-3">Token state</th>
                      <th className="text-left py-2 px-3">IP</th>
                      <th className="text-left py-2 pl-3">User-Agent</th>
                    </tr>
                  </thead>
                  <tbody>
                    {flagged.flagged.map((f) => (
                      <tr key={`${f.sessionId}-${f.transitionAt}`} className="border-t border-cyan-500/10 text-gray-200 align-top">
                        <td className="py-2 pr-3 whitespace-nowrap">{fmtTs(f.transitionAt)}</td>
                        <td className="py-2 px-3 font-mono text-xs">{f.sessionId.slice(0,16)}…</td>
                        <td className="py-2 px-3">{providerBadge(f.authProvider)}</td>
                        <td className="py-2 px-3">{rootCauseBadge(f.rootCause)}</td>
                        <td className="py-2 px-3 text-xs text-gray-300">{f.tokenState}{f.failureReason ? ` · ${f.failureReason}` : ""}</td>
                        <td className="py-2 px-3 font-mono text-xs">{f.ip ?? "—"}</td>
                        <td className="py-2 pl-3 text-xs max-w-[340px] truncate" title={f.userAgent ?? ""}>{f.userAgent ?? "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-[#0d2847] border-cyan-500/20">
          <CardHeader>
            <CardTitle className="text-white text-base">Groupings (top 50 per dimension, sorted by 401 count)</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="session">
              <TabsList className="bg-[#0a1628] border border-cyan-500/20">
                <TabsTrigger value="session">By session</TabsTrigger>
                <TabsTrigger value="ua">By user agent</TabsTrigger>
                <TabsTrigger value="ip">By IP</TabsTrigger>
                <TabsTrigger value="provider">By auth provider</TabsTrigger>
              </TabsList>
              <TabsContent value="session"><GroupTable resp={bySession} label="Session id (sha256 prefix)" /></TabsContent>
              <TabsContent value="ua"><GroupTable resp={byUa} label="User-Agent" /></TabsContent>
              <TabsContent value="ip"><GroupTable resp={byIp} label="IP address" /></TabsContent>
              <TabsContent value="provider"><GroupTable resp={byProv} label="Auth provider" /></TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <p className="text-xs text-gray-500">
          Data source: <span className="font-mono">auth_me_events</span> table. Populated by the Build 51 logger attached to <span className="font-mono">/api/auth/me</span>. No raw cookies, headers, or tokens are stored — session ids are recorded as a SHA-256 prefix.
        </p>
      </div>
    </div>
  );
}

export default function AdminAuditAuthMe() {
  return (
    <RouteErrorBoundary>
      <AdminAuditAuthMeInner />
    </RouteErrorBoundary>
  );
}
