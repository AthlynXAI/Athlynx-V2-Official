import { useState } from "react";
import PlatformLayout from "@/components/PlatformLayout";
import { Shield, BookOpen, CheckCircle, AlertTriangle, ArrowRight, ChevronDown, ChevronUp, Award, Users, Calendar, FileText, Zap } from "lucide-react";

const NCAA_DIVISIONS = [
  {
    division: "Division I",
    schools: "~350 schools",
    scholarships: "Full athletic scholarships (headcount or equivalency)",
    revenue: "Highest revenue, most media coverage",
    sports: "All major sports + Olympic sports",
    key_rules: ["20-hour practice rule in-season, 8 hours out-of-season", "Academic Progress Rate (APR) requirements", "Scholarship limits strictly enforced", "Transfer portal: 1 free transfer with immediate eligibility", "NIL: athletes can earn NIL income"],
    color: "#1E90FF"
  },
  {
    division: "Division II",
    schools: "~300 schools",
    scholarships: "Partial scholarships (equivalency only)",
    revenue: "Moderate — some TV contracts, conference revenue",
    sports: "Most sports, fewer Olympic sports than D1",
    key_rules: ["Similar practice hour limits to D1", "Lower APR thresholds than D1", "Partial scholarship model — coaches split aid", "Transfer portal available", "NIL rules same as D1"],
    color: "#00BFFF"
  },
  {
    division: "Division III",
    schools: "~450 schools",
    scholarships: "No athletic scholarships — academic aid only",
    revenue: "No athletic-based revenue sharing",
    sports: "Wide variety, student-athlete focused",
    key_rules: ["No athletic scholarships permitted", "Financial aid based on academic merit/need only", "Practice hour limits apply", "Transfer portal available", "NIL rules same as D1/D2"],
    color: "#4169E1"
  }
];

const ELIGIBILITY_RULES = [
  {
    category: "Initial Eligibility (High School → College)",
    rules: [
      { rule: "Core Course Requirement", detail: "D1: 16 core courses minimum. D2: 16 core courses. Specific distribution requirements by subject area." },
      { rule: "GPA Requirement", detail: "D1: Minimum 2.3 GPA in core courses. D2: Minimum 2.2 GPA. Sliding scale with test scores." },
      { rule: "SAT/ACT Requirement", detail: "D1: Minimum 900 SAT / 75 ACT sum score (sliding scale with GPA). D2: Minimum 820 SAT / 68 ACT sum score." },
      { rule: "Amateurism Certification", detail: "Must be certified as an amateur athlete by the NCAA Eligibility Center before competing." },
      { rule: "NCAA Eligibility Center", detail: "All D1/D2 athletes must register with the NCAA Eligibility Center (eligibilitycenter.org) and be certified." }
    ]
  },
  {
    category: "Continuing Eligibility (Year-to-Year)",
    rules: [
      { rule: "Satisfactory Progress", detail: "Must complete 40% of degree requirements by end of year 2, 60% by year 3, 80% by year 4." },
      { rule: "Minimum GPA", detail: "Must maintain minimum 1.8 GPA after year 1, 1.9 after year 2, 2.0 after year 3 and beyond." },
      { rule: "Full-Time Enrollment", detail: "Must be enrolled full-time (minimum 12 credit hours) during the academic year to compete." },
      { rule: "5-Year Clock", detail: "Athletes have 5 calendar years from first enrollment to complete 4 seasons of eligibility." },
      { rule: "Academic Progress Rate (APR)", detail: "Team APR below 930 triggers penalties. Below 900 triggers postseason ban. Calculated per athlete per semester." }
    ]
  },
  {
    category: "Amateurism Rules",
    rules: [
      { rule: "No Professional Contracts", detail: "Signing a professional contract in any sport eliminates eligibility in that sport. Other sports unaffected." },
      { rule: "Agent Restrictions", detail: "Athletes may not enter into agent agreements. Agents may not provide benefits. Exception: NIL agents for NIL activities only." },
      { rule: "Prize Money", detail: "Athletes may accept prize money from open competitions if not representing their college team, up to expenses." },
      { rule: "NIL Exception", detail: "Since July 1, 2021: athletes may earn NIL compensation without losing eligibility. Must disclose to institution." },
      { rule: "Olympic Exception", detail: "Athletes may accept USOC/NGB stipends and prize money for Olympic/Paralympic competition without losing eligibility." }
    ]
  }
];

const SCHOLARSHIP_LIMITS = [
  { sport: "Football (FBS)", d1_limit: "85 (headcount)", d2_limit: "36 (equivalency)", notes: "Walk-ons unlimited. 25 initial counters per year." },
  { sport: "Men's Basketball", d1_limit: "13 (headcount)", d2_limit: "10 (equivalency)", notes: "Walk-ons unlimited. 13 total roster scholarships." },
  { sport: "Women's Basketball", d1_limit: "15 (headcount)", d2_limit: "10 (equivalency)", notes: "Walk-ons unlimited. 15 total roster scholarships." },
  { sport: "Baseball", d1_limit: "11.7 (equivalency)", d2_limit: "9 (equivalency)", notes: "Can split scholarships. Minimum 25% per athlete." },
  { sport: "Men's Soccer", d1_limit: "9.9 (equivalency)", d2_limit: "9 (equivalency)", notes: "Can split scholarships. No minimum per athlete." },
  { sport: "Women's Soccer", d1_limit: "14 (equivalency)", d2_limit: "9.9 (equivalency)", notes: "Can split scholarships. No minimum per athlete." },
  { sport: "Softball", d1_limit: "12 (equivalency)", d2_limit: "7.2 (equivalency)", notes: "Can split scholarships. No minimum per athlete." },
  { sport: "Men's Tennis", d1_limit: "4.5 (equivalency)", d2_limit: "4.5 (equivalency)", notes: "Can split scholarships. Very limited aid." },
  { sport: "Women's Tennis", d1_limit: "8 (equivalency)", d2_limit: "6 (equivalency)", notes: "Can split scholarships." },
  { sport: "Men's Swimming", d1_limit: "9.9 (equivalency)", d2_limit: "8.1 (equivalency)", notes: "Can split scholarships." },
  { sport: "Women's Swimming", d1_limit: "14 (equivalency)", d2_limit: "8.1 (equivalency)", notes: "Can split scholarships." },
  { sport: "Track & Field", d1_limit: "12.6 M / 18 W (equiv)", d2_limit: "12.6 M / 12.6 W", notes: "Combined indoor/outdoor/cross country." }
];

const VIOLATION_LEVELS = [
  {
    level: "Level I",
    severity: "Most Severe",
    color: "red",
    desc: "Violations that provide or are intended to provide a substantial or extensive recruiting, competitive, or other advantage. Severe harm to the integrity of the NCAA.",
    examples: ["Systematic academic fraud", "Intentional major recruiting violations", "Providing large sums of money to recruits", "Covering up violations"],
    penalties: ["Multi-year postseason ban", "Scholarship reductions (25-50%)", "Recruiting restrictions (1-3 years)", "Show-cause order for coaches", "Probation (4+ years)"]
  },
  {
    level: "Level II",
    severity: "Significant",
    color: "orange",
    desc: "Violations that provide more than a minimal but less than a substantial or extensive recruiting, competitive, or other advantage.",
    examples: ["Impermissible recruiting contacts", "Providing meals/lodging to recruits", "Improper agent contact", "Failure to monitor"],
    penalties: ["Postseason ban (1 year)", "Scholarship reductions (10-25%)", "Recruiting restrictions (1 year)", "Probation (1-3 years)"]
  },
  {
    level: "Level III",
    severity: "Moderate",
    color: "yellow",
    desc: "Violations that are isolated or limited in nature, provide minimal competitive advantage, and are not intentional.",
    examples: ["Minor recruiting calendar violations", "Inadvertent extra benefits", "Minor administrative errors"],
    penalties: ["Public reprimand", "Minor scholarship reductions", "Short recruiting restrictions"]
  },
  {
    level: "Level IV",
    severity: "Incidental",
    color: "green",
    desc: "Technical violations that are unintentional and provide no competitive advantage.",
    examples: ["Administrative paperwork errors", "Minor procedural violations"],
    penalties: ["Internal corrective measures", "No public penalty"]
  }
];

export default function NCAARegulations() {
  const [activeTab, setActiveTab] = useState("overview");
  const [expandedDiv, setExpandedDiv] = useState<number | null>(null);
  const [expandedCat, setExpandedCat] = useState<number | null>(null);
  const [expandedViolation, setExpandedViolation] = useState<number | null>(null);

  const tabs = [
    { id: "overview", label: "Divisions", icon: "🏛️" },
    { id: "eligibility", label: "Eligibility", icon: "✅" },
    { id: "scholarships", label: "Scholarship Limits", icon: "🎓" },
    { id: "violations", label: "Violations", icon: "⚠️" }
  ];

  return (
    <PlatformLayout>
      <div className="min-h-screen bg-[#0a0f1e] text-white pb-20">
        {/* Hero */}
        <div className="relative overflow-hidden bg-gradient-to-br from-[#0a0f1e] via-[#0d1b3e] to-[#0a0f1e] border-b border-blue-900/40 px-4 py-10">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(30,144,255,0.12),transparent_60%)]" />
          <div className="max-w-4xl mx-auto relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#1E90FF] to-[#4169E1] flex items-center justify-center text-2xl shadow-lg shadow-blue-500/30">
                🏛️
              </div>
              <div>
                <div className="text-xs font-bold text-[#1E90FF] tracking-widest uppercase mb-1">AthlynX Regulations</div>
                <h1 className="text-3xl font-black text-white">NCAA Regulations</h1>
              </div>
            </div>
            <p className="text-blue-200 text-lg mb-6 max-w-2xl">
              The complete NCAA rulebook — eligibility requirements, scholarship limits by sport, amateurism rules, violation levels, and compliance calendars. Know the rules before you play.
            </p>
            <div className="flex flex-wrap gap-3">
              <div className="bg-[#1E90FF]/10 border border-[#1E90FF]/30 rounded-xl px-4 py-2 text-sm text-blue-200">
                <span className="text-[#1E90FF] font-bold">D1, D2, D3</span> covered
              </div>
              <div className="bg-[#1E90FF]/10 border border-[#1E90FF]/30 rounded-xl px-4 py-2 text-sm text-blue-200">
                <span className="text-[#1E90FF] font-bold">2025-26</span> rulebook
              </div>
              <div className="bg-[#1E90FF]/10 border border-[#1E90FF]/30 rounded-xl px-4 py-2 text-sm text-blue-200">
                <span className="text-[#1E90FF] font-bold">House settlement</span> included
              </div>
            </div>
            <div className="mt-4 text-xs text-blue-400 italic">AthlynX. The Athlete's Playbook. BE THE LEGACY.</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="sticky top-0 z-20 bg-[#0a0f1e]/95 backdrop-blur border-b border-blue-900/40 px-4">
          <div className="max-w-4xl mx-auto flex gap-1 overflow-x-auto py-2 scrollbar-hide">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-all ${
                  activeTab === tab.id
                    ? "bg-[#1E90FF] text-white shadow-lg shadow-blue-500/30"
                    : "text-blue-300 hover:text-white hover:bg-blue-900/30"
                }`}
              >
                <span>{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">

          {/* DIVISIONS TAB */}
          {activeTab === "overview" && (
            <div className="space-y-4">
              <h2 className="text-xl font-black text-white">NCAA Divisions Overview</h2>
              {NCAA_DIVISIONS.map((div, i) => (
                <div key={i} className="bg-gradient-to-br from-[#0d1b3e] to-[#0a0f1e] border border-blue-900/40 rounded-2xl overflow-hidden">
                  <button
                    onClick={() => setExpandedDiv(expandedDiv === i ? null : i)}
                    className="w-full flex items-center justify-between p-5 text-left"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center font-black text-lg border-2"
                        style={{ borderColor: div.color, color: div.color, backgroundColor: `${div.color}15` }}>
                        {div.division.split(" ")[1]}
                      </div>
                      <div>
                        <h3 className="text-white font-black">{div.division}</h3>
                        <div className="text-blue-400 text-sm">{div.schools}</div>
                      </div>
                    </div>
                    {expandedDiv === i ? <ChevronUp className="w-5 h-5 text-blue-400" /> : <ChevronDown className="w-5 h-5 text-blue-400" />}
                  </button>
                  {expandedDiv === i && (
                    <div className="px-5 pb-5 border-t border-blue-900/30 pt-3 space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-[#0a0f1e] rounded-xl p-3">
                          <div className="text-xs text-blue-400 mb-1">Scholarships</div>
                          <div className="text-white text-sm font-bold">{div.scholarships}</div>
                        </div>
                        <div className="bg-[#0a0f1e] rounded-xl p-3">
                          <div className="text-xs text-blue-400 mb-1">Revenue Model</div>
                          <div className="text-white text-sm font-bold">{div.revenue}</div>
                        </div>
                      </div>
                      <div>
                        <div className="text-xs font-bold text-[#1E90FF] mb-2">KEY RULES:</div>
                        {div.key_rules.map((rule, j) => (
                          <div key={j} className="flex items-start gap-2 mb-1">
                            <CheckCircle className="w-4 h-4 text-[#1E90FF] flex-shrink-0 mt-0.5" />
                            <span className="text-blue-200 text-sm">{rule}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* ELIGIBILITY TAB */}
          {activeTab === "eligibility" && (
            <div className="space-y-4">
              <div>
                <h2 className="text-xl font-black text-white mb-1">NCAA Eligibility Rules</h2>
                <p className="text-blue-300 text-sm">Eligibility determines who can compete. Violations can result in immediate ineligibility — know the rules.</p>
              </div>
              {ELIGIBILITY_RULES.map((cat, i) => (
                <div key={i} className="bg-gradient-to-br from-[#0d1b3e] to-[#0a0f1e] border border-blue-900/40 rounded-2xl overflow-hidden">
                  <button
                    onClick={() => setExpandedCat(expandedCat === i ? null : i)}
                    className="w-full flex items-center justify-between p-5 text-left"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#1E90FF]/20 border border-[#1E90FF]/30 flex items-center justify-center">
                        <BookOpen className="w-5 h-5 text-[#1E90FF]" />
                      </div>
                      <h3 className="text-white font-black">{cat.category}</h3>
                    </div>
                    {expandedCat === i ? <ChevronUp className="w-5 h-5 text-blue-400" /> : <ChevronDown className="w-5 h-5 text-blue-400" />}
                  </button>
                  {expandedCat === i && (
                    <div className="px-5 pb-5 border-t border-blue-900/30 pt-3 space-y-3">
                      {cat.rules.map((rule, j) => (
                        <div key={j} className="bg-[#0a0f1e] rounded-xl p-3">
                          <div className="text-[#1E90FF] font-bold text-sm mb-1">{rule.rule}</div>
                          <div className="text-blue-200 text-sm">{rule.detail}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* SCHOLARSHIPS TAB */}
          {activeTab === "scholarships" && (
            <div className="space-y-4">
              <div>
                <h2 className="text-xl font-black text-white mb-1">NCAA Scholarship Limits by Sport</h2>
                <p className="text-blue-300 text-sm">Headcount sports: each scholarship counts as one full scholarship. Equivalency sports: coaches can split scholarships among multiple athletes.</p>
              </div>
              <div className="bg-gradient-to-br from-[#0d1b3e] to-[#0a0f1e] border border-blue-900/40 rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-blue-900/40">
                        <th className="text-left p-4 text-[#1E90FF] font-black text-sm">Sport</th>
                        <th className="text-left p-4 text-[#1E90FF] font-black text-sm">D1 Limit</th>
                        <th className="text-left p-4 text-[#1E90FF] font-black text-sm">D2 Limit</th>
                        <th className="text-left p-4 text-[#1E90FF] font-black text-sm">Notes</th>
                      </tr>
                    </thead>
                    <tbody>
                      {SCHOLARSHIP_LIMITS.map((sport, i) => (
                        <tr key={i} className={`border-b border-blue-900/20 ${i % 2 === 0 ? "bg-[#0a0f1e]/50" : ""}`}>
                          <td className="p-4 text-white font-bold text-sm">{sport.sport}</td>
                          <td className="p-4 text-[#1E90FF] font-bold text-sm">{sport.d1_limit}</td>
                          <td className="p-4 text-blue-300 text-sm">{sport.d2_limit}</td>
                          <td className="p-4 text-blue-400 text-xs">{sport.notes}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* VIOLATIONS TAB */}
          {activeTab === "violations" && (
            <div className="space-y-4">
              <div>
                <h2 className="text-xl font-black text-white mb-1">NCAA Violation Levels</h2>
                <p className="text-blue-300 text-sm">The NCAA's four-level violation structure determines penalties. Level I violations can end programs.</p>
              </div>
              {VIOLATION_LEVELS.map((v, i) => (
                <div key={i} className="bg-gradient-to-br from-[#0d1b3e] to-[#0a0f1e] border border-blue-900/40 rounded-2xl overflow-hidden">
                  <button
                    onClick={() => setExpandedViolation(expandedViolation === i ? null : i)}
                    className="w-full flex items-center justify-between p-5 text-left"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`px-3 py-1 rounded-lg font-black text-sm ${
                        v.color === "red" ? "bg-red-500/20 text-red-400 border border-red-500/30" :
                        v.color === "orange" ? "bg-blue-500/20 text-blue-400 border border-blue-500/30" :
                        v.color === "yellow" ? "bg-blue-500/20 text-blue-400 border border-blue-500/30" :
                        "bg-green-500/20 text-green-400 border border-green-500/30"
                      }`}>{v.level}</div>
                      <div>
                        <h3 className="text-white font-black">{v.severity}</h3>
                      </div>
                    </div>
                    {expandedViolation === i ? <ChevronUp className="w-5 h-5 text-blue-400" /> : <ChevronDown className="w-5 h-5 text-blue-400" />}
                  </button>
                  {expandedViolation === i && (
                    <div className="px-5 pb-5 border-t border-blue-900/30 pt-3 space-y-3">
                      <p className="text-blue-200 text-sm">{v.desc}</p>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <div className="text-xs font-bold text-red-400 mb-2">EXAMPLES:</div>
                          {v.examples.map((ex, j) => (
                            <div key={j} className="flex items-start gap-2 mb-1">
                              <AlertTriangle className="w-3 h-3 text-red-400 flex-shrink-0 mt-0.5" />
                              <span className="text-blue-200 text-sm">{ex}</span>
                            </div>
                          ))}
                        </div>
                        <div>
                          <div className="text-xs font-bold text-[#1E90FF] mb-2">PENALTIES:</div>
                          {v.penalties.map((p, j) => (
                            <div key={j} className="flex items-start gap-2 mb-1">
                              <ArrowRight className="w-3 h-3 text-[#1E90FF] flex-shrink-0 mt-0.5" />
                              <span className="text-blue-200 text-sm">{p}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* CTA */}
          <div className="bg-gradient-to-r from-[#1E90FF]/10 to-[#4169E1]/10 border border-[#1E90FF]/30 rounded-2xl p-6 text-center">
            <div className="text-2xl mb-2">🏛️</div>
            <h3 className="text-white font-black text-xl mb-2">Stay Compliant. Stay Eligible.</h3>
            <p className="text-blue-200 text-sm mb-4">AthlynX NCAA Regulations OS keeps you ahead of every rule change. Never lose eligibility to a preventable violation.</p>
            <button className="bg-gradient-to-r from-[#1E90FF] to-[#4169E1] text-white font-black px-8 py-3 rounded-xl hover:opacity-90 transition-opacity">
              Run Compliance Check
            </button>
            <div className="text-xs text-blue-400 mt-3 italic">AthlynX. The Athlete's Playbook. BE THE LEGACY.</div>
          </div>
        </div>
      </div>
    </PlatformLayout>
  );
}
