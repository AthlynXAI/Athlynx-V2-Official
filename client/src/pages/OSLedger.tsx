/**
 * AthlynX — TRAFFIC LEDGER (Admin)
 * Read-only view of operator API/MCP traffic + revenue.
 * Build 13 — May 12, 2026
 *
 * Note: This is a UI scaffold. Wire to /api/admin/traffic-ledger
 * in a follow-up commit once the tRPC procedure is added.
 */
import { useState } from "react";
import { RouteErrorBoundary } from "@/components/GlobalErrorBoundary";
import MobileBottomNav from "@/components/MobileBottomNav";
import { Link } from "wouter";

const SEED_ROWS = [
  { operator: "athlynx-ai", connector: "stripe", calls: 0, ai_min: 0, revenue_cents: 0, status: "live" },
  { operator: "athlynx-ai", connector: "nebius", calls: 0, ai_min: 0, revenue_cents: 0, status: "live" },
  { operator: "athlynx-ai", connector: "supabase", calls: 0, ai_min: 0, revenue_cents: 0, status: "live" },
  { operator: "athlynx-ai", connector: "buffer", calls: 0, ai_min: 0, revenue_cents: 0, status: "pending" },
  { operator: "athlynx-ai", connector: "vercel", calls: 0, ai_min: 0, revenue_cents: 0, status: "live" },
];

export default function OSLedger() {
  const [rows] = useState(SEED_ROWS);
  return (
    <RouteErrorBoundary>
      <div className="min-h-screen bg-[#050d1a] text-white">
        <header className="border-b border-white/10 sticky top-0 bg-[#050d1a]/95 backdrop-blur z-50">
          <div className="mx-auto max-w-6xl px-6 py-5 flex items-center justify-between">
            <Link href="/os" className="text-xl font-bold">
              <span>AthlynX</span>
              <span className="ml-2 text-xs uppercase tracking-widest text-[#00c2ff]">OS Ledger</span>
            </Link>
            <div className="text-sm text-white/60">
              {rows.length} operator / connector rows
            </div>
          </div>
        </header>

        <section className="mx-auto max-w-6xl px-6 py-12">
          <div className="text-xs uppercase tracking-[0.3em] text-[#00c2ff] mb-3">Traffic Ledger</div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Operator Traffic. Live.</h1>
          <p className="mt-3 text-white/60 max-w-3xl">
            Meters every API call, MCP invocation, AI minute, and Stripe transaction crossing the
            Connector OS rail. Backed by the <code className="text-[#00c2ff]">traffic_ledger</code> table
            (Supabase). Bills the operator on cycle; bills the end user on event.
          </p>
        </section>

        <section className="mx-auto max-w-6xl px-6 pb-24">
          <div className="border border-white/10 rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-white/5 text-white/60 text-left">
                <tr>
                  <th className="px-4 py-3 font-medium">Operator</th>
                  <th className="px-4 py-3 font-medium">Connector</th>
                  <th className="px-4 py-3 font-medium">Calls</th>
                  <th className="px-4 py-3 font-medium">AI Min</th>
                  <th className="px-4 py-3 font-medium">Revenue (cents)</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r, i) => (
                  <tr key={i} className="border-t border-white/5">
                    <td className="px-4 py-2 font-mono text-xs">{r.operator}</td>
                    <td className="px-4 py-2">{r.connector}</td>
                    <td className="px-4 py-2 text-white/80">{r.calls.toLocaleString()}</td>
                    <td className="px-4 py-2 text-white/80">{r.ai_min}</td>
                    <td className="px-4 py-2 text-white/80">${(r.revenue_cents / 100).toFixed(2)}</td>
                    <td className="px-4 py-2">
                      <span className={r.status === "live" ? "text-green-400" : "text-sky-400"}>
                        ● {r.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 text-xs text-white/40">
            Scaffold view — wires to <code className="text-[#00c2ff]">/api/admin/traffic-ledger</code> in
            a follow-up commit. Schema lives at <code>drizzle/migrations/2026_05_12_traffic_ledger.sql</code>.
          </div>
        </section>

        <footer className="border-t border-white/10 bg-[#050d1a]">
          <div className="mx-auto max-w-6xl px-6 py-10 text-center">
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
