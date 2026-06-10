/**
 * /engine — AthlynXAI Engine Status Page (Build 26.7)
 * Live status of the Nebius-backed inference engine.
 * Public health view; admin-only invocation console.
 */
import { useEffect, useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import UnifiedNav from "@/components/UnifiedNav";
import UnifiedFooter from "@/components/UnifiedFooter";
import { useAuth } from "@/_core/hooks/useAuth";
import { isMasterAdmin } from "@/components/PartnerAvatar";
import {
  Cpu, Activity, Zap, CheckCircle2, AlertTriangle, Loader2,
  Server, Send, Shield, Clock, Sparkles
} from "lucide-react";

interface EngineHealth {
  status: "ok" | "error";
  engine?: string;
  model?: string;
  base_url?: string;
  reply?: string;
  latency_ms?: number;
  timestamp?: string;
  platform?: string;
  version?: string;
  error?: string;
}

export default function AthlynXEngine() {
  const { user, isAuthenticated } = useAuth();
  const email = ((user as any)?.email ?? "").toLowerCase();
  const role = (user as any)?.role;
  const isAdmin = isAuthenticated && (role === "admin" || isMasterAdmin(email));

  const [health, setHealth] = useState<EngineHealth | null>(null);
  const [healthLoading, setHealthLoading] = useState(true);

  const [prompt, setPrompt] = useState("");
  const [system, setSystem] = useState("You are AthlynXAI, the inference engine behind AthlynX. Concise, sharp, on-brand.");
  const [response, setResponse] = useState<string | null>(null);
  const [responseMeta, setResponseMeta] = useState<{ latency_ms?: number; model?: string } | null>(null);
  const [invokeLoading, setInvokeLoading] = useState(false);
  const [invokeError, setInvokeError] = useState<string | null>(null);

  async function checkHealth() {
    setHealthLoading(true);
    try {
      const res = await fetch("/api/engine/health");
      const data = await res.json();
      setHealth(data);
    } catch (err: any) {
      setHealth({ status: "error", error: err?.message || "Failed to reach engine" });
    } finally {
      setHealthLoading(false);
    }
  }

  useEffect(() => {
    checkHealth();
  }, []);

  async function runInvoke() {
    if (!prompt.trim()) return;
    setInvokeLoading(true);
    setInvokeError(null);
    setResponse(null);
    try {
      const res = await fetch("/api/engine/invoke", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-user-email": email },
        body: JSON.stringify({ prompt, system, max_tokens: 1024, temperature: 0.7 }),
      });
      const data = await res.json();
      if (!res.ok || data.status === "error") {
        setInvokeError(data.error || `HTTP ${res.status}`);
      } else {
        const content = typeof data.content === "string"
          ? data.content
          : Array.isArray(data.content)
            ? data.content.map((c: any) => c?.text ?? "").join("")
            : JSON.stringify(data.content);
        setResponse(content);
        setResponseMeta({ latency_ms: data.latency_ms, model: data.model });
      }
    } catch (err: any) {
      setInvokeError(err?.message || "Request failed");
    } finally {
      setInvokeLoading(false);
    }
  }

  const isHealthy = health?.status === "ok";

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      <UnifiedNav />

      <section className="pt-24 pb-12">
        <div className="container px-4 md:px-5 max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-3 mb-2">
            <Cpu className="w-8 h-8 text-cyan-400" />
            <h1 className="text-3xl md:text-4xl font-black text-white">AthlynXAI Engine</h1>
            <Badge className={isHealthy ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40" : "bg-red-500/20 text-red-300 border-red-500/40"}>
              {healthLoading ? "Checking…" : isHealthy ? "● ONLINE" : "● OFFLINE"}
            </Badge>
          </div>
          <p className="text-white/60 mb-8">
            The inference layer behind AthlynX. Nebius-backed. Premium model fleet. Sole-source.
          </p>

          {/* Status grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
            <Card className="bg-white/5 border-white/10">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 text-white/60 text-xs mb-2">
                  <Activity className="w-4 h-4" /> STATUS
                </div>
                <p className={`text-xl font-bold ${isHealthy ? "text-emerald-400" : "text-red-400"}`}>
                  {healthLoading ? "—" : isHealthy ? "Operational" : "Degraded"}
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/5 border-white/10">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 text-white/60 text-xs mb-2">
                  <Server className="w-4 h-4" /> ENGINE
                </div>
                <p className="text-xl font-bold text-cyan-300 uppercase">{health?.engine ?? "—"}</p>
              </CardContent>
            </Card>

            <Card className="bg-white/5 border-white/10">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 text-white/60 text-xs mb-2">
                  <Sparkles className="w-4 h-4" /> MODEL
                </div>
                <p className="text-sm font-bold text-white break-words">
                  {health?.model ?? "—"}
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/5 border-white/10">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 text-white/60 text-xs mb-2">
                  <Clock className="w-4 h-4" /> LATENCY
                </div>
                <p className="text-xl font-bold text-cyan-300">
                  {health?.latency_ms != null ? `${health.latency_ms} ms` : "—"}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Health detail card */}
          <Card className="bg-white/5 border-cyan-500/20 mb-8">
            <CardContent className="p-5 md:p-6">
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-2">
                  {isHealthy ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  ) : (
                    <AlertTriangle className="w-5 h-5 text-red-400" />
                  )}
                  <h2 className="text-white font-bold">Heartbeat</h2>
                </div>
                <Button size="sm" variant="outline" onClick={checkHealth} disabled={healthLoading}
                  className="border-cyan-500/40 text-cyan-300 hover:bg-cyan-500/10">
                  {healthLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : "Refresh"}
                </Button>
              </div>
              {health?.reply && (
                <p className="text-emerald-300 text-sm font-mono mb-2">
                  Reply: <span className="text-emerald-200">"{health.reply}"</span>
                </p>
              )}
              {health?.error && (
                <p className="text-red-300 text-sm font-mono mb-2">Error: {health.error}</p>
              )}
              <div className="grid sm:grid-cols-2 gap-2 text-xs text-white/60 mt-3">
                <div>Base URL: <span className="text-white/80">{health?.base_url ?? "—"}</span></div>
                <div>Version: <span className="text-white/80">{health?.version ?? "—"}</span></div>
                <div>Platform: <span className="text-white/80">{health?.platform ?? "—"}</span></div>
                <div>Checked: <span className="text-white/80">{health?.timestamp ? new Date(health.timestamp).toLocaleString() : "—"}</span></div>
              </div>
            </CardContent>
          </Card>

          {/* Invoke console — admin only */}
          {isAdmin ? (
            <Card className="bg-gradient-to-br from-cyan-500/5 to-blue-500/5 border-cyan-500/30">
              <CardContent className="p-5 md:p-6">
                <div className="flex items-center gap-2 mb-1">
                  <Zap className="w-5 h-5 text-cyan-400" />
                  <h2 className="text-white font-bold">Invoke Console</h2>
                  <Badge className="bg-blue-500/20 text-sky-300 border-blue-500/40 text-[10px]">ADMIN</Badge>
                </div>
                <p className="text-white/60 text-xs mb-4">Live inference against the engine. Logged to your account.</p>

                <div className="space-y-3">
                  <div>
                    <label className="text-white/70 text-xs mb-1 block">System prompt</label>
                    <Input
                      value={system}
                      onChange={(e) => setSystem(e.target.value)}
                      className="bg-slate-900 border-white/10 text-white text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-white/70 text-xs mb-1 block">Prompt</label>
                    <Textarea
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      placeholder="Ask the engine anything…"
                      rows={4}
                      className="bg-slate-900 border-white/10 text-white text-sm"
                    />
                  </div>
                  <Button
                    onClick={runInvoke}
                    disabled={invokeLoading || !prompt.trim()}
                    className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold"
                  >
                    {invokeLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Send className="w-4 h-4 mr-2" />}
                    Invoke
                  </Button>
                </div>

                {invokeError && (
                  <div className="mt-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-300 text-sm">
                    {invokeError}
                  </div>
                )}

                {response && (
                  <div className="mt-4">
                    <div className="flex items-center justify-between text-xs text-white/50 mb-2">
                      <span>Response</span>
                      <span>{responseMeta?.latency_ms} ms · {responseMeta?.model}</span>
                    </div>
                    <div className="p-4 rounded-lg bg-slate-950 border border-cyan-500/20 text-white/90 text-sm whitespace-pre-wrap font-mono">
                      {response}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ) : (
            <Card className="bg-white/5 border-white/10">
              <CardContent className="p-6 text-center">
                <Shield className="w-10 h-10 text-white/40 mx-auto mb-3" />
                <p className="text-white/70 mb-1">The invoke console is admin-only.</p>
                <p className="text-white/40 text-sm mb-4">Sign in as an AthlynX admin to query the engine directly.</p>
                <Link href="/signin"><Button variant="outline" className="border-cyan-500/40 text-cyan-300">Sign in</Button></Link>
              </CardContent>
            </Card>
          )}
        </div>
      </section>

      <UnifiedFooter />
    </div>
  );
}
