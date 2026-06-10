/**
 * AthlynX — ROUTE AUDIT PAGE
 * Live status table for every registered route.
 * Build 12 — May 12, 2026
 */
import { useState, useEffect } from "react";
import { RouteErrorBoundary } from "@/components/GlobalErrorBoundary";
import MobileBottomNav from "@/components/MobileBottomNav";
import { Link } from "wouter";

type Probe = { route: string; status: number | string; size: number; ms: number };

const ROUTE_SEEDS = [
  "/", "/about", "/founders", "/founder", "/chad", "/card",
  "/pricing", "/early-access", "/early-access-v2", "/signin", "/signup",
  "/welcome", "/platform", "/investor-hub", "/investor-deck",
  "/partners", "/nil-portal", "/faith", "/diamond-grind", "/warriors-playbook",
  "/family", "/team", "/os",
  "/connector-os/thesis", "/connector-os/pricing", "/connector-os/layer-cake",
  "/doctrine/manifesto", "/doctrine/brand", "/doctrine/small-circle",
  "/team/glenn-tse", "/team/lee-marshall", "/team/",
  "/athlete-dashboard", "/athlete-data", "/athlete-financial", "/athlete-health",
  "/athlete-career", "/athlete-life", "/athlete-store", "/athlete-playbook",
  "/discover", "/browse-athletes",
  "/qa", "/feedback", "/billing", "/credits",
  "/ai-trainer", "/ai-recruiter", "/ai-sales", "/ai-scouting-report",
  "/admin", "/admin/users", "/admin/build-monitor", "/admin/broadcast",
];

export default function RouteAudit() {
  const [probes, setProbes] = useState<Probe[]>([]);
  const [running, setRunning] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function run() {
      const results: Probe[] = [];
      for (const route of ROUTE_SEEDS) {
        if (cancelled) return;
        const start = performance.now();
        try {
          const r = await fetch(route, { method: "HEAD", redirect: "manual" });
          results.push({
            route,
            status: r.status,
            size: 0,
            ms: Math.round(performance.now() - start),
          });
        } catch (e) {
          results.push({ route, status: "ERR", size: 0, ms: Math.round(performance.now() - start) });
        }
        setProbes([...results]);
      }
      if (!cancelled) setRunning(false);
    }
    run();
    return () => { cancelled = true; };
  }, []);

  const okCount = probes.filter(p => p.status === 200).length;
  const failCount = probes.filter(p => p.status !== 200).length;

  return (
    <RouteErrorBoundary>
      <div className="min-h-screen bg-[#050d1a] text-white">
        <header className="border-b border-white/10 sticky top-0 bg-[#050d1a]/95 backdrop-blur z-50">
          <div className="mx-auto max-w-5xl px-6 py-5 flex items-center justify-between">
            <Link href="/" className="text-xl font-bold">
              <span>AthlynX</span>
              <span className="ml-2 text-xs uppercase tracking-widest text-[#00c2ff]">Audit</span>
            </Link>
            <div className="text-sm text-white/60">
              {running ? "Probing…" : "Done"} · <span className="text-[#00c2ff]">{okCount} OK</span> · <span className="text-[#1E90FF]">{failCount} fail</span>
            </div>
          </div>
        </header>

        <section className="mx-auto max-w-5xl px-6 py-12">
          <div className="text-xs uppercase tracking-[0.3em] text-[#00c2ff] mb-3">Live Route Audit</div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">{ROUTE_SEEDS.length} routes · probed live</h1>
          <p className="mt-3 text-white/60 max-w-3xl">
            HEAD probes against the deployed production domain. Status, response time, and identifier
            for each registered public route. Run from your browser — anything blocking you blocks
            visitors.
          </p>
        </section>

        <section className="mx-auto max-w-5xl px-6 pb-24">
          <div className="border border-white/10 rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-white/5">
                <tr>
                  <th className="text-left px-4 py-3 text-white/60 font-medium">Route</th>
                  <th className="text-left px-4 py-3 text-white/60 font-medium">Status</th>
                  <th className="text-left px-4 py-3 text-white/60 font-medium">Latency</th>
                </tr>
              </thead>
              <tbody>
                {probes.map(p => (
                  <tr key={p.route} className="border-t border-white/5">
                    <td className="px-4 py-2 font-mono text-xs">
                      <a href={p.route} className="text-[#00c2ff] hover:underline">{p.route}</a>
                    </td>
                    <td className="px-4 py-2">
                      {p.status === 200 ? (
                        <span className="text-[#00C2FF]"> {p.status}</span>
                      ) : (
                        <span className="text-[#1E90FF]"> {String(p.status)}</span>
                      )}
                    </td>
                    <td className="px-4 py-2 text-white/60">{p.ms}ms</td>
                  </tr>
                ))}
                {running && (
                  <tr><td colSpan={3} className="px-4 py-3 text-white/40 text-xs">probing…</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        <footer className="border-t border-white/10 bg-[#050d1a]">
          <div className="mx-auto max-w-5xl px-6 py-10 text-center">
            <p className="text-xs uppercase tracking-[0.3em] text-[#00c2ff]">
              Iron Sharpens Iron — Proverbs 27:17
            </p>
          </div>
        </footer>
        <MobileBottomNav />
      </div>
    </RouteErrorBoundary>
  );
}
