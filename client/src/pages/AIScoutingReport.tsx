import { Link } from "wouter";
/**
 * AthlynXAI SCOUTING REPORT — S39
 * One-click AI-generated professional scouting report per athlete.
 * Powered by Nebius H200 Llama-3.3-70B.
 * 10 AI credits per report.
 *
 * Session 39 — May 6, 2026
 */
import { useState } from "react";
import { RouteErrorBoundary } from "@/components/GlobalErrorBoundary";
import PlatformLayout from "@/components/PlatformLayout";
import MobileBottomNav from "@/components/MobileBottomNav";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { toast } from "sonner";
import {
  Cpu, FileText, Download, Share2, Star, Zap, Trophy,
  ChevronDown, ChevronUp, User, School, MapPin, Target,
  BarChart2, TrendingUp, Shield, Award, Loader2, Copy,
  Dumbbell, Gauge, Brain, Sparkles
} from "lucide-react";

// ─── Sample Athletes for Quick-Generate ──────────────────────────────────────
const SAMPLE_ATHLETES = [
  { name: "Marcus Williams", sport: "Football", position: "QB", school: "Westlake HS", state: "TX", year: "2027", xScore: 98, fortyYd: "4.52", vertical: "38.5", bench: 22, gpa: 3.8, offers: 24, nilValue: 85000 },
  { name: "Aaliyah Thompson", sport: "Basketball", position: "PG", school: "Cy-Fair HS", state: "TX", year: "2027", xScore: 96, fortyYd: "4.61", vertical: "40.0", bench: 14, gpa: 4.0, offers: 22, nilValue: 62000 },
  { name: "Jordan Davis", sport: "Baseball", position: "RHP", school: "The Woodlands HS", state: "TX", year: "2027", xScore: 94, fortyYd: "4.68", vertical: "34.0", bench: 18, gpa: 3.6, offers: 12, nilValue: 41000 },
  { name: "Keisha Moore", sport: "Football", position: "WR", school: "North Shore HS", state: "GA", year: "2027", xScore: 93, fortyYd: "4.38", vertical: "40.5", bench: 14, gpa: 3.5, offers: 19, nilValue: 38000 },
];

// ─── Report Section Parser ────────────────────────────────────────────────────
function parseReportSections(report: string): { title: string; content: string }[] {
  const sections: { title: string; content: string }[] = [];
  const lines = report.split("\n");
  let current: { title: string; content: string } | null = null;
  for (const line of lines) {
    if (line.startsWith("## ")) {
      if (current) sections.push(current);
      current = { title: line.replace("## ", "").trim(), content: "" };
    } else if (current) {
      current.content += (current.content ? "\n" : "") + line;
    }
  }
  if (current) sections.push(current);
  if (sections.length === 0) {
    return [{ title: "Scouting Report", content: report }];
  }
  return sections;
}

// ─── Section Icons ────────────────────────────────────────────────────────────
const SECTION_ICONS: Record<string, React.ElementType> = {
  "EXECUTIVE SUMMARY": Sparkles,
  "ATHLETIC PROFILE": User,
  "PERFORMANCE METRICS": Gauge,
  "RECRUITING OUTLOOK": TrendingUp,
  "NIL POTENTIAL": Trophy,
  "STRENGTHS": Shield,
  "AREAS FOR DEVELOPMENT": Target,
  "SCOUT RECOMMENDATION": Award,
};

// ─── Main Component ───────────────────────────────────────────────────────────
function AIScoutingReportInner() {
  const { user } = useAuth();
  const [mode, setMode] = useState<"select" | "custom" | "report">("select");
  const [selectedAthlete, setSelectedAthlete] = useState<typeof SAMPLE_ATHLETES[0] | null>(null);
  const [expandedSection, setExpandedSection] = useState<number | null>(0);
  const [generatedReport, setGeneratedReport] = useState<{ report: string; athleteName: string; generatedAt: string } | null>(null);

  // Custom form state
  const [form, setForm] = useState({
    athleteName: "", sport: "", position: "", school: "", state: "", year: "2027",
    xScore: "", fortyYd: "", vertical: "", bench: "", gpa: "", offers: "", nilValue: "", highlights: "",
  });

  const generateReport = trpc.ai.generateScoutingReport.useMutation({
    onSuccess: (data) => {
      setGeneratedReport(data);
      setMode("report");
      toast.success("AI Scouting Report generated!");
    },
    onError: (err) => {
      toast.error(err.message || "Failed to generate report. Check your credits.");
    },
  });

  function handleSampleGenerate(athlete: typeof SAMPLE_ATHLETES[0]) {
    setSelectedAthlete(athlete);
    generateReport.mutate({
      athleteName: athlete.name,
      sport: athlete.sport,
      position: athlete.position,
      school: athlete.school,
      state: athlete.state,
      year: athlete.year,
      xScore: athlete.xScore,
      fortyYd: athlete.fortyYd,
      vertical: athlete.vertical,
      bench: athlete.bench,
      gpa: athlete.gpa,
      offers: athlete.offers,
      nilValue: athlete.nilValue,
    });
  }

  function handleCustomGenerate() {
    if (!form.athleteName || !form.sport || !form.position || !form.school) {
      toast.error("Please fill in athlete name, sport, position, and school.");
      return;
    }
    generateReport.mutate({
      athleteName: form.athleteName,
      sport: form.sport,
      position: form.position,
      school: form.school,
      state: form.state || undefined,
      year: form.year || "2027",
      xScore: form.xScore ? Number(form.xScore) : undefined,
      fortyYd: form.fortyYd || undefined,
      vertical: form.vertical || undefined,
      bench: form.bench ? Number(form.bench) : undefined,
      gpa: form.gpa ? Number(form.gpa) : undefined,
      offers: form.offers ? Number(form.offers) : undefined,
      nilValue: form.nilValue ? Number(form.nilValue) : undefined,
      highlights: form.highlights || undefined,
    });
  }

  const sections = generatedReport ? parseReportSections(generatedReport.report) : [];

  return (
    <PlatformLayout>
      <div className="min-h-screen bg-[#040c1a] pb-24">

        {/* Hero */}
        <div className="bg-gradient-to-b from-[#0a1628] to-[#040c1a] px-4 pt-5 pb-4">
          <div className="max-w-2xl mx-auto">
            <div className="flex items-center gap-2 mb-1">
              <Cpu size={18} className="text-[#00c2ff]" />
              <div className="text-[10px] font-black tracking-[0.3em] text-[#00c2ff] uppercase">AthlynXAI</div>
            </div>
            <h1 className="text-2xl font-black text-white">AI Scouting Report™</h1>
            <p className="text-blue-400 text-sm mt-1">One-click professional scouting reports powered by Nebius H200 AI. Used by D1 programs and pro scouts.</p>
            <div className="flex gap-2 mt-3 flex-wrap">
              {[
                { label: "⚡ Nebius H200 Llama-3.3-70B", color: "bg-purple-900/40 border-purple-700/40 text-purple-300" },
                { label: "💎 10 AI Credits per report", color: "bg-blue-900/40 border-blue-700/40 text-blue-300" },
                { label: "📄 8-Section Professional Report", color: "bg-green-900/40 border-green-700/40 text-green-300" },
              ].map((b, i) => (
                <span key={i} className={`text-[10px] font-bold px-2 py-1 rounded-full border ${b.color}`}>{b.label}</span>
              ))}
            </div>
          </div>
        </div>

        <div className="max-w-2xl mx-auto px-4 py-4 space-y-4">

          {/* ══ LOADING STATE ══ */}
          {generateReport.isPending && (
            <div className="bg-gradient-to-r from-[#0066ff]/20 to-[#00c2ff]/10 border border-[#0066ff]/30 rounded-2xl p-8 text-center">
              <Loader2 size={40} className="text-[#00c2ff] mx-auto mb-4 animate-spin" />
              <div className="text-white font-black text-lg mb-2">Generating AI Scouting Report...</div>
              <p className="text-blue-400 text-sm">Nebius H200 AI is analyzing athlete data, combine stats, recruiting outlook, and NIL potential.</p>
              <div className="mt-4 flex justify-center gap-2">
                {["Athletic Profile", "Performance Metrics", "Recruiting Outlook", "NIL Potential"].map((step, i) => (
                  <div key={i} className="flex items-center gap-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#0066ff] animate-pulse" style={{ animationDelay: `${i * 0.3}s` }} />
                    <span className="text-blue-600 text-[9px] hidden sm:block">{step}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ══ SELECT / GENERATE MODE ══ */}
          {!generateReport.isPending && mode !== "report" && (
            <>
              {/* Mode Toggle */}
              <div className="flex gap-2">
                <button onClick={() => setMode("select")}
                  className={`flex-1 text-xs font-bold py-2.5 rounded-xl transition-colors ${
                    mode === "select" ? "bg-gradient-to-r from-[#0066ff] to-[#00c2ff] text-white" : "bg-[#0d1e3c] border border-blue-800/50 text-blue-400"
                  }`}>
                  🏆 Quick Generate
                </button>
                <button onClick={() => setMode("custom")}
                  className={`flex-1 text-xs font-bold py-2.5 rounded-xl transition-colors ${
                    mode === "custom" ? "bg-gradient-to-r from-[#0066ff] to-[#00c2ff] text-white" : "bg-[#0d1e3c] border border-blue-800/50 text-blue-400"
                  }`}>
                  ✏️ Custom Athlete
                </button>
              </div>

              {/* Quick Generate — Sample Athletes */}
              {mode === "select" && (
                <>
                  <div className="text-[10px] font-black text-blue-500 uppercase tracking-widest">Select an Athlete to Scout</div>
                  {SAMPLE_ATHLETES.map((athlete, i) => (
                    <div key={i} className="bg-[#0d1e3c] border border-blue-800/50 rounded-2xl p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#0066ff] to-[#00c2ff] flex items-center justify-center text-white font-black text-sm shrink-0">
                          {athlete.name.split(" ").map(n => n[0]).join("")}
                        </div>
                        <div className="flex-1">
                          <div className="text-white font-black text-sm">{athlete.name}</div>
                          <div className="text-blue-400 text-xs">{athlete.position} · {athlete.sport} · Class {athlete.year}</div>
                          <div className="text-blue-600 text-[10px]">{athlete.school}, {athlete.state}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-[#00c2ff] font-black text-xl">{athlete.xScore}</div>
                          <div className="text-blue-600 text-[9px]">X-Score</div>
                        </div>
                      </div>
                      <div className="grid grid-cols-4 gap-2 mb-3">
                        {[
                          { label: "40-Yd", val: athlete.fortyYd + "s" },
                          { label: "Vertical", val: athlete.vertical + '"' },
                          { label: "GPA", val: String(athlete.gpa) },
                          { label: "Offers", val: String(athlete.offers) },
                        ].map((s, si) => (
                          <div key={si} className="bg-blue-900/30 rounded-xl p-2 text-center">
                            <div className="text-white font-black text-xs">{s.val}</div>
                            <div className="text-blue-500 text-[9px]">{s.label}</div>
                          </div>
                        ))}
                      </div>
                      <button onClick={() => handleSampleGenerate(athlete)}
                        className="w-full bg-gradient-to-r from-[#0066ff] to-[#00c2ff] text-white text-xs font-black py-2.5 rounded-xl flex items-center justify-center gap-2">
                        <Cpu size={14} />
                        Generate AI Scouting Report (10 credits)
                      </button>
                    </div>
                  ))}
                </>
              )}

              {/* Custom Athlete Form */}
              {mode === "custom" && (
                <div className="bg-[#0d1e3c] border border-blue-800/50 rounded-2xl p-4 space-y-3">
                  <div className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-2">Athlete Information</div>
                  {[
                    { key: "athleteName", label: "Full Name *", placeholder: "e.g. Marcus Williams" },
                    { key: "sport", label: "Sport *", placeholder: "e.g. Football" },
                    { key: "position", label: "Position *", placeholder: "e.g. QB" },
                    { key: "school", label: "School *", placeholder: "e.g. Westlake HS" },
                    { key: "state", label: "State", placeholder: "e.g. TX" },
                    { key: "year", label: "Class Year", placeholder: "e.g. 2027" },
                  ].map(field => (
                    <div key={field.key}>
                      <label className="text-blue-400 text-[10px] font-bold block mb-1">{field.label}</label>
                      <input
                        value={(form as any)[field.key]}
                        onChange={e => setForm(f => ({ ...f, [field.key]: e.target.value }))}
                        placeholder={field.placeholder}
                        className="w-full bg-[#040c1a] border border-blue-800/50 rounded-xl px-3 py-2 text-white text-xs placeholder-blue-700 focus:outline-none focus:border-[#0066ff]"
                      />
                    </div>
                  ))}
                  <div className="text-[10px] font-black text-blue-500 uppercase tracking-widest mt-4 mb-2">Combine Stats (Optional)</div>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { key: "fortyYd", label: "40-Yard Dash (s)", placeholder: "4.52" },
                      { key: "vertical", label: 'Vertical Leap (")', placeholder: "38.5" },
                      { key: "bench", label: "Bench Press (reps)", placeholder: "22" },
                      { key: "gpa", label: "GPA", placeholder: "3.8" },
                      { key: "offers", label: "College Offers", placeholder: "24" },
                      { key: "nilValue", label: "NIL Value ($)", placeholder: "85000" },
                    ].map(field => (
                      <div key={field.key}>
                        <label className="text-blue-400 text-[10px] font-bold block mb-1">{field.label}</label>
                        <input
                          value={(form as any)[field.key]}
                          onChange={e => setForm(f => ({ ...f, [field.key]: e.target.value }))}
                          placeholder={field.placeholder}
                          type="number"
                          className="w-full bg-[#040c1a] border border-blue-800/50 rounded-xl px-3 py-2 text-white text-xs placeholder-blue-700 focus:outline-none focus:border-[#0066ff]"
                        />
                      </div>
                    ))}
                  </div>
                  <div>
                    <label className="text-blue-400 text-[10px] font-bold block mb-1">Additional Notes / Highlights</label>
                    <textarea
                      value={form.highlights}
                      onChange={e => setForm(f => ({ ...f, highlights: e.target.value }))}
                      placeholder="e.g. 3x All-State selection, committed to Texas A&M, 4.0 GPA, team captain..."
                      rows={3}
                      className="w-full bg-[#040c1a] border border-blue-800/50 rounded-xl px-3 py-2 text-white text-xs placeholder-blue-700 focus:outline-none focus:border-[#0066ff] resize-none"
                    />
                  </div>
                  <button onClick={handleCustomGenerate}
                    className="w-full bg-gradient-to-r from-[#0066ff] to-[#00c2ff] text-white text-xs font-black py-3 rounded-xl flex items-center justify-center gap-2 mt-2">
                    <Cpu size={14} />
                    Generate AI Scouting Report (10 credits)
                  </button>
                </div>
              )}
            </>
          )}

          {/* ══ REPORT VIEW ══ */}
          {!generateReport.isPending && mode === "report" && generatedReport && (
            <>
              {/* Report Header */}
              <div className="bg-gradient-to-r from-[#0066ff]/20 to-[#00c2ff]/10 border border-[#0066ff]/30 rounded-2xl p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-[10px] font-black text-[#00c2ff] tracking-widest uppercase mb-1">AthlynXAI Scouting Report</div>
                    <div className="text-white font-black text-xl">{generatedReport.athleteName}</div>
                    <div className="text-blue-400 text-xs mt-1">
                      Generated {new Date(generatedReport.generatedAt).toLocaleString()} · Powered by Nebius H200 AI
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 bg-green-500/20 border border-green-500/30 rounded-full px-2 py-1 shrink-0">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
                    <span className="text-[10px] font-black text-green-400">COMPLETE</span>
                  </div>
                </div>
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(generatedReport.report);
                      toast.success("Report copied to clipboard!");
                    }}
                    className="flex-1 border border-[#0066ff]/50 text-[#00c2ff] text-xs font-bold py-2 rounded-xl flex items-center justify-center gap-1">
                    <Copy size={12} /> Copy
                  </button>
                  <button
                    onClick={() => toast.success("PDF export — coming in S40!")}
                    className="flex-1 border border-[#0066ff]/50 text-[#00c2ff] text-xs font-bold py-2 rounded-xl flex items-center justify-center gap-1">
                    <Download size={12} /> Export PDF
                  </button>
                  <button
                    onClick={() => { setMode("select"); setGeneratedReport(null); }}
                    className="flex-1 bg-gradient-to-r from-[#0066ff] to-[#00c2ff] text-white text-xs font-black py-2 rounded-xl flex items-center justify-center gap-1">
                    <Cpu size={12} /> New Report
                  </button>
                </div>
              </div>

              {/* Report Sections */}
              {sections.map((section, i) => {
                const Icon = SECTION_ICONS[section.title] || FileText;
                return (
                  <div key={i} className="bg-[#0d1e3c] border border-blue-800/50 rounded-2xl overflow-hidden">
                    <button
                      onClick={() => setExpandedSection(expandedSection === i ? null : i)}
                      className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-blue-900/10 transition-colors"
                    >
                      <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#0066ff]/30 to-[#00c2ff]/20 flex items-center justify-center shrink-0">
                        <Icon size={14} className="text-[#00c2ff]" />
                      </div>
                      <div className="flex-1">
                        <div className="text-white font-black text-sm">{section.title}</div>
                      </div>
                      {expandedSection === i
                        ? <ChevronUp size={16} className="text-blue-500 shrink-0" />
                        : <ChevronDown size={16} className="text-blue-500 shrink-0" />
                      }
                    </button>
                    {expandedSection === i && (
                      <div className="px-4 pb-4 border-t border-blue-900/30">
                        <div className="text-blue-300 text-sm leading-relaxed whitespace-pre-wrap pt-3">
                          {section.content.trim()}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}

              {/* CTA */}
              <div className="bg-gradient-to-r from-[#0066ff]/10 to-[#00c2ff]/5 border border-dashed border-[#0066ff]/40 rounded-2xl p-5 text-center">
                <Brain size={24} className="text-[#00c2ff] mx-auto mb-2" />
                <div className="text-white font-black text-sm mb-1">Want More AI Reports?</div>
                <p className="text-blue-400 text-xs mb-3">Purchase AI credits to generate unlimited scouting reports, coach emails, NIL pitches, and more.</p>
                <Link href="/token-factory">
                  <button className="bg-gradient-to-r from-[#0066ff] to-[#00c2ff] text-white text-xs font-black px-6 py-2.5 rounded-xl">
                    Get More Credits
                  </button>
                </Link>
              </div>
            </>
          )}

        </div>
      </div>
      <MobileBottomNav />
    </PlatformLayout>
  );
}

export default function AIScoutingReport() {
  return <RouteErrorBoundary><AIScoutingReportInner /></RouteErrorBoundary>;
}
