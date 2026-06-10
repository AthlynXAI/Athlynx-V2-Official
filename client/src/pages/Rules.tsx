import { RouteErrorBoundary } from "@/components/GlobalErrorBoundary";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";

/**
 * Build 5 — Live Rule Book.
 * Reads from DB via tRPC rules.list. Updated in real time by master admin
 * (no redeploy needed). Shows last-verified timestamp per rule.
 */

interface RuleRow {
  id: number;
  slug: string;
  category: string;
  title: string;
  who: string;
  rule: string;
  athlynx_action: string;
  source_label: string;
  source_url: string;
  severity: "critical" | "high" | "medium";
  sort_order: number;
  last_verified_at: string;
  verified_by: string | null;
  updated_at: string;
}

function severityColor(s: RuleRow["severity"]): string {
  if (s === "critical") return "bg-red-500/10 text-red-300 border-red-500/30";
  if (s === "high") return "bg-blue-500/10 text-sky-300 border-blue-500/30";
  return "bg-blue-500/10 text-blue-300 border-blue-500/30";
}

function fmt(d?: string | null): string {
  if (!d) return "—";
  try { return new Date(d).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" }); }
  catch { return String(d); }
}

function RulesInner() {
  const q = trpc.rules.list.useQuery();
  const rules = ((q.data ?? []) as unknown) as RuleRow[];
  const categories = Array.from(new Set(rules.map((r) => r.category)));

  return (
    <div className="min-h-screen bg-[#050c1a] text-white">
      <nav className="sticky top-0 z-50 bg-[#050c1a]/95 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <img src="/athlynx-icon.png" alt="AthlynX" className="w-9 h-9 rounded-lg object-cover" />
            <span className="text-white font-black text-lg tracking-widest">AthlynX</span>
          </Link>
          <div className="flex gap-4 text-sm">
            <Link href="/qa" className="text-[#00c2ff] hover:underline">Q&amp;A</Link>
            <Link href="/terms-of-service" className="text-[#00c2ff] hover:underline">Terms</Link>
            <Link href="/privacy-policy" className="text-[#00c2ff] hover:underline">Privacy</Link>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 pt-12 pb-8">
        <div className="mb-2">
          <span className="text-xs text-[#00c2ff] font-semibold uppercase tracking-widest">The Rule Book</span>
        </div>
        <h1 className="text-4xl md:text-6xl font-black mb-4 leading-none">Above the Law.</h1>
        <p className="text-white/70 text-lg max-w-3xl">
          Every rule that touches an athlete on AthlynX. NIL by state. NCAA. NFHS. FTC. IRS. COPPA. FERPA. HIPAA. DMCA. Title IX. SafeSport. Plain English. Always sourced. Updated in real time.
        </p>
        <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm text-white/50 mt-4">
          <span>Total Rules: <strong className="text-white/80">{rules.length}</strong></span>
          <span>Governing Law: <strong className="text-white/80">State of Texas</strong></span>
          <span>Source: <strong className="text-white/80">Live database</strong></span>
        </div>
      </div>

      {q.isPending ? (
        <div className="max-w-6xl mx-auto px-4 py-20 text-center text-white/50">Loading the Rule Book…</div>
      ) : rules.length === 0 ? (
        <div className="max-w-6xl mx-auto px-4 py-20 text-center text-white/50">No rules published yet.</div>
      ) : (
        <>
          <div className="max-w-6xl mx-auto px-4 mb-10">
            <div className="bg-[#0a1628] border border-white/10 rounded-xl p-6">
              <h2 className="text-xs font-bold text-white/50 uppercase tracking-widest mb-4">Categories</h2>
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <a
                    key={cat}
                    href={`#cat-${cat.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
                    className="px-3 py-1.5 bg-[#00c2ff]/10 border border-[#00c2ff]/30 text-[#00c2ff] text-xs font-semibold rounded-full hover:bg-[#00c2ff]/20"
                  >
                    {cat}
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div className="max-w-6xl mx-auto px-4 pb-20 space-y-12">
            {categories.map((cat) => {
              const inCat = rules.filter((r) => r.category === cat);
              return (
                <section key={cat} id={`cat-${cat.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`} className="scroll-mt-20">
                  <h2 className="text-2xl font-black text-white mb-6 pb-2 border-b border-white/10">{cat}</h2>
                  <div className="space-y-6">
                    {inCat.map((r) => (
                      <article key={r.id} id={r.slug} className="bg-[#0a1628] border border-white/10 rounded-xl p-6 scroll-mt-20">
                        <div className="flex items-start justify-between gap-4 mb-3">
                          <h3 className="text-lg font-bold text-white">{r.title}</h3>
                          <span className={`shrink-0 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider border rounded ${severityColor(r.severity)}`}>
                            {r.severity}
                          </span>
                        </div>
                        <div className="grid md:grid-cols-2 gap-x-8 gap-y-4 text-sm">
                          <div>
                            <div className="text-[10px] font-bold text-white/40 uppercase tracking-wider mb-1">Who it applies to</div>
                            <div className="text-white/80">{r.who}</div>
                          </div>
                          <div>
                            <div className="text-[10px] font-bold text-white/40 uppercase tracking-wider mb-1">Source of authority</div>
                            <a href={r.source_url} target="_blank" rel="noopener noreferrer" className="text-[#00c2ff] hover:underline">
                              {r.source_label} ↗
                            </a>
                          </div>
                          <div className="md:col-span-2">
                            <div className="text-[10px] font-bold text-white/40 uppercase tracking-wider mb-1">The rule</div>
                            <div className="text-white/80 leading-relaxed">{r.rule}</div>
                          </div>
                          <div className="md:col-span-2">
                            <div className="text-[10px] font-bold text-[#00c2ff] uppercase tracking-wider mb-1">How AthlynX handles it</div>
                            <div className="text-white/80 leading-relaxed">{r.athlynx_action}</div>
                          </div>
                          <div className="md:col-span-2 pt-2 mt-2 border-t border-white/5 text-[11px] text-white/40">
                            Last verified: <strong className="text-white/60">{fmt(r.last_verified_at)}</strong>
                            {r.verified_by ? <> · by <strong className="text-white/60">{r.verified_by}</strong></> : null}
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                </section>
              );
            })}

            <div className="mt-12 p-6 bg-[#0a1628] border border-blue-500/30 rounded-xl">
              <h3 className="text-sm font-bold text-sky-300 uppercase tracking-wider mb-2">Important Disclaimer</h3>
              <p className="text-white/70 text-sm leading-relaxed">
                This Rule Book is informational only and is not legal, tax, or compliance advice. Rules change frequently. Athletes are responsible for verifying current rules with their school compliance office, state athletic association, governing body, and qualified professional advisors before acting.
              </p>
            </div>

            <div className="pt-8 border-t border-white/10 text-center">
              <p className="text-white/40 text-sm">© {new Date().getFullYear()} Softmor Inc. / Dozier Holdings Group. All rights reserved.</p>
              <div className="flex justify-center gap-6 mt-4 text-sm">
                <Link href="/qa" className="text-[#00c2ff] hover:underline">Q&amp;A</Link>
                <Link href="/terms-of-service" className="text-[#00c2ff] hover:underline">Terms</Link>
                <Link href="/privacy-policy" className="text-[#00c2ff] hover:underline">Privacy</Link>
                <Link href="/" className="text-white/50 hover:text-white transition-colors">← Back</Link>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default function Rules() {
  return <RouteErrorBoundary><RulesInner /></RouteErrorBoundary>;
}
