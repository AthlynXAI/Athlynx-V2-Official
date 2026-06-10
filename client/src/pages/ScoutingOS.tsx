import { useState } from "react";
import PlatformLayout from "@/components/PlatformLayout";
import { Search, Eye, Target, Globe, Star, TrendingUp, BarChart3, Users, FileText, ChevronDown, ChevronUp, MapPin, Award, Zap } from "lucide-react";

const SCOUTING_CATEGORIES = [
  { icon: "⚾", sport: "Baseball", pipeline: "MLB Draft + International", key: "60-grade tool system, exit velocity, spin rate, arm strength", intl: "Dominican Republic, Venezuela, Cuba, Japan, Korea" },
  { icon: "🏀", sport: "Basketball", pipeline: "NBA Draft + G-League + International", key: "Athletic testing, shooting mechanics, court vision, defensive IQ", intl: "Europe (EuroLeague), Australia (NBL), Africa (BAL)" },
  { icon: "🏈", sport: "Football", pipeline: "NFL Draft + UDFA + CFL", key: "40-yard dash, vertical jump, Wonderlic, positional film study", intl: "Canada (CFL), Germany (NFL Europe), UK (NFL London)" },
  { icon: "⚽", sport: "Soccer", pipeline: "MLS SuperDraft + Homegrown + International Transfer", key: "GPS tracking, pressing intensity, progressive passes, xG contribution", intl: "England, Spain, Germany, Brazil, Argentina, Africa" },
  { icon: "🏒", sport: "Hockey", pipeline: "NHL Draft + AHL + International", key: "Skating speed, shot velocity, defensive zone exits, Corsi/Fenwick", intl: "Sweden, Finland, Russia, Czech Republic, Canada" },
  { icon: "🎾", sport: "Tennis", pipeline: "ITF Junior + ATP/WTA Pathway", key: "Serve speed, first serve %, rally patterns, mental toughness metrics", intl: "Spain, France, Serbia, Australia, USA academies" }
];

const SCOUTING_GRADES = [
  { grade: "80", label: "Elite / Hall of Fame", color: "#1E90FF", desc: "Generational talent. Top 1% of all players at this level." },
  { grade: "70", label: "Plus-Plus", color: "#00BFFF", desc: "All-Star caliber. Clear first-round talent." },
  { grade: "60", label: "Plus", color: "#4169E1", desc: "Above-average MLB/NBA/NFL starter. Solid draft pick." },
  { grade: "55", label: "Above Average", color: "#1E90FF", desc: "Fringe starter or strong reserve. Worth developing." },
  { grade: "50", label: "Average", color: "#6495ED", desc: "Major league average. Replacement-level ceiling." },
  { grade: "45", label: "Below Average", color: "#708090", desc: "Below average but serviceable. Organizational depth." },
  { grade: "40", label: "Fringe", color: "#556B8D", desc: "Fringe roster player. Needs significant development." },
  { grade: "30", label: "Non-Prospect", color: "#4a5568", desc: "Not projectable at current level." }
];

const INTERNATIONAL_PATHWAYS = [
  {
    sport: "Baseball",
    icon: "⚾",
    rules: [
      "International Bonus Pool: Each MLB team receives an annual IBA pool (varies by draft position). Exceeding the pool triggers penalties.",
      "Signing Period: Opens July 2 each year. Players must be 16+ to sign.",
      "Cuban Defectors: Must establish residency in a third country and clear MLB's process before becoming free agents.",
      "Japanese/Korean Players: Posted through NPB/KBO posting system. Team pays posting fee, then negotiates contract.",
      "Dominican/Venezuelan Academies: Teams maintain academies in Latin America. Players sign at 16 for development."
    ],
    key_markets: ["Dominican Republic", "Venezuela", "Cuba", "Japan", "Korea", "Panama", "Mexico"]
  },
  {
    sport: "Basketball",
    icon: "🏀",
    rules: [
      "NBA Draft: International players eligible at age 19. No residency requirement — can declare from any country.",
      "Two-Way Contracts: Allow NBA teams to stash international players in G-League while maintaining NBA rights.",
      "EuroLeague Buyouts: European contracts often have buyout clauses triggered by NBA draft selection.",
      "Work Permits: Non-EU players in European leagues need work permits. UK requires Governing Body Endorsement (GBE).",
      "FIBA Transfer Rules: International transfers require FIBA clearance certificate. Loan agreements common."
    ],
    key_markets: ["France", "Spain", "Serbia", "Australia", "Nigeria", "Canada", "Germany"]
  },
  {
    sport: "Soccer",
    icon: "⚽",
    rules: [
      "FIFA Transfer Window: Two windows per year (summer: June–Sept, winter: Jan–Feb). Transfers outside windows prohibited.",
      "Training Compensation: Clubs that trained a player ages 12–23 receive compensation when player transfers.",
      "Solidarity Mechanism: 5% of transfer fee distributed to all clubs that trained player between ages 12–23.",
      "Homegrown Rules: MLS, Premier League require minimum homegrown players on roster.",
      "International Transfer Certificate (ITC): Required for all international transfers. Issued by national federation.",
      "Third-Party Ownership (TPO): Banned by FIFA. No third parties can own economic rights to player transfers."
    ],
    key_markets: ["England", "Spain", "Germany", "Italy", "France", "Brazil", "Argentina"]
  },
  {
    sport: "Hockey",
    icon: "🏒",
    rules: [
      "NHL Entry Draft: 7 rounds. Players eligible at age 18. European players can be drafted and remain in Europe.",
      "KHL/SHL/Liiga: NHL teams often loan prospects to European leagues for development.",
      "CBA Transfer Agreement: NHL has agreements with European leagues governing player movement.",
      "Work Authorization: Non-North American players need work visas (O-1 or P-1 visa for USA; work permit for Canada).",
      "Waiver Rules: Players with 3+ years of pro experience must clear waivers before AHL assignment."
    ],
    key_markets: ["Sweden", "Finland", "Russia", "Czech Republic", "Slovakia", "Switzerland", "Germany"]
  }
];

const SCOUTING_REPORT_TEMPLATE = [
  { section: "Physical Profile", fields: ["Height", "Weight", "Wingspan", "Body Type", "Age", "Projected Growth"] },
  { section: "Athletic Testing", fields: ["40-Yard Dash / Sprint Speed", "Vertical Jump", "Broad Jump", "Agility Drills", "Strength Testing", "Endurance Metrics"] },
  { section: "Skill Grades (20-80 Scale)", fields: ["Primary Tool 1", "Primary Tool 2", "Secondary Tool", "Defensive Rating", "Mental/IQ Grade", "Makeup/Character"] },
  { section: "Projection", fields: ["Current Level Grade", "Future Projection", "ETA to Majors/Pros", "Ceiling", "Floor", "Risk Assessment"] },
  { section: "Comp Players", fields: ["MLB/NBA/NFL Comp", "Ceiling Comp", "Floor Comp", "Style Comp"] },
  { section: "Summary", fields: ["Strengths", "Weaknesses", "Development Needs", "Recommendation", "Draft Round Projection"] }
];

const AMATEUR_TO_PRO = [
  {
    path: "High School → MLB Draft",
    steps: ["Showcase circuit (Perfect Game, Area Codes, WWBA)", "High school season performance", "June MLB Draft (20 rounds)", "Signing deadline: August 1", "Slot value negotiation", "Rookie ball assignment"],
    timeline: "3–5 years to majors average"
  },
  {
    path: "College → NFL Draft",
    steps: ["3 years college eligibility required (or redshirt)", "All-Star games (Senior Bowl, East-West Shrine)", "NFL Combine (February)", "Pro Day workouts", "April NFL Draft (7 rounds)", "Rookie minicamp → training camp"],
    timeline: "Immediate — NFL season starts September"
  },
  {
    path: "High School → NBA Draft",
    steps: ["Must be 19 years old AND 1 year removed from HS graduation", "One-and-done college route OR G-League Ignite", "NBA Draft Combine (May)", "June NBA Draft (2 rounds, 60 picks)", "Summer League → training camp"],
    timeline: "Immediate — NBA season starts October"
  },
  {
    path: "Youth → MLS",
    steps: ["MLS Academy (ages 13–18)", "Homegrown Player designation", "MLS SuperDraft (college route)", "Generation Adidas (early entry college players)", "Loan to USL for development"],
    timeline: "Variable — some sign at 15, others at 22"
  }
];

export default function ScoutingOS() {
  const [activeTab, setActiveTab] = useState("overview");
  const [expandedIntl, setExpandedIntl] = useState<number | null>(null);
  const [expandedPath, setExpandedPath] = useState<number | null>(null);

  const tabs = [
    { id: "overview", label: "Scouting OS", icon: "🔭" },
    { id: "grades", label: "Grade Scale", icon: "📊" },
    { id: "international", label: "International", icon: "🌍" },
    { id: "amateur", label: "Amateur → Pro", icon: "🚀" },
    { id: "report", label: "Report Template", icon: "📋" }
  ];

  return (
    <PlatformLayout>
      <div className="min-h-screen bg-[#0a0f1e] text-white pb-20">
        {/* Hero */}
        <div className="relative overflow-hidden bg-gradient-to-br from-[#0a0f1e] via-[#0d1b3e] to-[#0a0f1e] border-b border-blue-900/40 px-4 py-10">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(30,144,255,0.12),transparent_60%)]" />
          <div className="max-w-4xl mx-auto relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#1E90FF] to-[#4169E1] flex items-center justify-center text-2xl shadow-lg shadow-blue-500/30">
                🔭
              </div>
              <div>
                <div className="text-xs font-bold text-[#1E90FF] tracking-widest uppercase mb-1">AthlynX Intelligence</div>
                <h1 className="text-3xl font-black text-white">Scouting OS</h1>
              </div>
            </div>
            <p className="text-blue-200 text-lg mb-6 max-w-2xl">
              The complete athlete intelligence platform. Scouting reports, international signing pipelines, amateur-to-pro pathways, draft intelligence, and the 20-80 grade system — all in one OS.
            </p>
            <div className="flex flex-wrap gap-3">
              <div className="bg-[#1E90FF]/10 border border-[#1E90FF]/30 rounded-xl px-4 py-2 text-sm text-blue-200">
                <span className="text-[#1E90FF] font-bold">6 sports</span> covered
              </div>
              <div className="bg-[#1E90FF]/10 border border-[#1E90FF]/30 rounded-xl px-4 py-2 text-sm text-blue-200">
                <span className="text-[#1E90FF] font-bold">50+ countries</span> scouted
              </div>
              <div className="bg-[#1E90FF]/10 border border-[#1E90FF]/30 rounded-xl px-4 py-2 text-sm text-blue-200">
                <span className="text-[#1E90FF] font-bold">AI-powered</span> analysis
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

          {/* OVERVIEW TAB */}
          {activeTab === "overview" && (
            <div className="space-y-4">
              <h2 className="text-xl font-black text-white">Multi-Sport Scouting Intelligence</h2>
              <div className="grid gap-4">
                {SCOUTING_CATEGORIES.map((cat, i) => (
                  <div key={i} className="bg-gradient-to-br from-[#0d1b3e] to-[#0a0f1e] border border-blue-900/40 rounded-2xl p-5">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-3xl">{cat.icon}</span>
                      <div>
                        <h3 className="text-white font-black text-lg">{cat.sport}</h3>
                        <div className="text-[#1E90FF] text-sm font-bold">{cat.pipeline}</div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div>
                        <span className="text-xs text-blue-400 font-bold">KEY METRICS: </span>
                        <span className="text-blue-200 text-sm">{cat.key}</span>
                      </div>
                      <div>
                        <span className="text-xs text-blue-400 font-bold">INTERNATIONAL MARKETS: </span>
                        <span className="text-blue-200 text-sm">{cat.intl}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* GRADES TAB */}
          {activeTab === "grades" && (
            <div className="space-y-4">
              <div>
                <h2 className="text-xl font-black text-white mb-1">The 20-80 Scouting Grade Scale</h2>
                <p className="text-blue-300 text-sm">Used across MLB, NBA, NFL, and other leagues. Each tool is graded on this scale — current grade and future projection.</p>
              </div>
              {SCOUTING_GRADES.map((g, i) => (
                <div key={i} className="bg-gradient-to-br from-[#0d1b3e] to-[#0a0f1e] border border-blue-900/40 rounded-xl p-4">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl font-black border-2"
                      style={{ borderColor: g.color, color: g.color, backgroundColor: `${g.color}15` }}>
                      {g.grade}
                    </div>
                    <div>
                      <div className="text-white font-black">{g.label}</div>
                      <div className="text-blue-300 text-sm">{g.desc}</div>
                    </div>
                  </div>
                </div>
              ))}
              <div className="bg-gradient-to-br from-[#1E90FF]/10 to-[#4169E1]/10 border border-[#1E90FF]/30 rounded-2xl p-5">
                <h3 className="text-white font-bold mb-2">How Grades Work</h3>
                <p className="text-blue-200 text-sm">Each tool receives two grades: <span className="text-[#1E90FF] font-bold">current</span> (what the player does now) and <span className="text-[#1E90FF] font-bold">future</span> (projected peak). A player might be a 45 current / 60 future hitter — meaning he's below average now but projects as a plus hitter at peak development.</p>
              </div>
            </div>
          )}

          {/* INTERNATIONAL TAB */}
          {activeTab === "international" && (
            <div className="space-y-4">
              <div>
                <h2 className="text-xl font-black text-white mb-1">International Signing Rules</h2>
                <p className="text-blue-300 text-sm">Every sport has different rules for signing international talent. Know the rules before you scout.</p>
              </div>
              {INTERNATIONAL_PATHWAYS.map((path, i) => (
                <div key={i} className="bg-gradient-to-br from-[#0d1b3e] to-[#0a0f1e] border border-blue-900/40 rounded-2xl overflow-hidden">
                  <button
                    onClick={() => setExpandedIntl(expandedIntl === i ? null : i)}
                    className="w-full flex items-center justify-between p-5 text-left"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{path.icon}</span>
                      <div>
                        <h3 className="text-white font-black">{path.sport} International Rules</h3>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {path.key_markets.slice(0, 3).map((m, j) => (
                            <span key={j} className="text-xs text-blue-400 bg-blue-900/30 px-2 py-0.5 rounded">{m}</span>
                          ))}
                          {path.key_markets.length > 3 && <span className="text-xs text-blue-400">+{path.key_markets.length - 3} more</span>}
                        </div>
                      </div>
                    </div>
                    {expandedIntl === i ? <ChevronUp className="w-5 h-5 text-blue-400" /> : <ChevronDown className="w-5 h-5 text-blue-400" />}
                  </button>
                  {expandedIntl === i && (
                    <div className="px-5 pb-5 space-y-3 border-t border-blue-900/30">
                      <div className="space-y-2 mt-3">
                        {path.rules.map((rule, j) => (
                          <div key={j} className="flex items-start gap-2">
                            <div className="w-5 h-5 rounded bg-[#1E90FF]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                              <span className="text-[#1E90FF] text-xs font-bold">{j + 1}</span>
                            </div>
                            <p className="text-blue-200 text-sm">{rule}</p>
                          </div>
                        ))}
                      </div>
                      <div>
                        <div className="text-xs text-blue-400 font-bold mb-2">KEY MARKETS:</div>
                        <div className="flex flex-wrap gap-2">
                          {path.key_markets.map((m, j) => (
                            <span key={j} className="px-2 py-1 bg-[#1E90FF]/10 border border-[#1E90FF]/20 rounded-lg text-xs text-[#1E90FF]">{m}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* AMATEUR TO PRO TAB */}
          {activeTab === "amateur" && (
            <div className="space-y-4">
              <div>
                <h2 className="text-xl font-black text-white mb-1">Amateur → Professional Pathways</h2>
                <p className="text-blue-300 text-sm">The exact steps from amateur athlete to professional contract, by sport.</p>
              </div>
              {AMATEUR_TO_PRO.map((path, i) => (
                <div key={i} className="bg-gradient-to-br from-[#0d1b3e] to-[#0a0f1e] border border-blue-900/40 rounded-2xl overflow-hidden">
                  <button
                    onClick={() => setExpandedPath(expandedPath === i ? null : i)}
                    className="w-full flex items-center justify-between p-5 text-left"
                  >
                    <div>
                      <h3 className="text-white font-black">{path.path}</h3>
                      <div className="text-[#1E90FF] text-sm mt-1">{path.timeline}</div>
                    </div>
                    {expandedPath === i ? <ChevronUp className="w-5 h-5 text-blue-400" /> : <ChevronDown className="w-5 h-5 text-blue-400" />}
                  </button>
                  {expandedPath === i && (
                    <div className="px-5 pb-5 border-t border-blue-900/30">
                      <div className="space-y-2 mt-3">
                        {path.steps.map((step, j) => (
                          <div key={j} className="flex items-start gap-3">
                            <div className="w-6 h-6 rounded-full bg-[#1E90FF] flex items-center justify-center flex-shrink-0 text-xs font-black text-white">{j + 1}</div>
                            <p className="text-blue-200 text-sm pt-0.5">{step}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* REPORT TEMPLATE TAB */}
          {activeTab === "report" && (
            <div className="space-y-4">
              <div>
                <h2 className="text-xl font-black text-white mb-1">Standard Scouting Report Template</h2>
                <p className="text-blue-300 text-sm">The professional scouting report format used across MLB, NBA, NFL, and NHL organizations.</p>
              </div>
              {SCOUTING_REPORT_TEMPLATE.map((section, i) => (
                <div key={i} className="bg-gradient-to-br from-[#0d1b3e] to-[#0a0f1e] border border-blue-900/40 rounded-xl p-4">
                  <h3 className="text-[#1E90FF] font-black mb-3 flex items-center gap-2">
                    <span className="w-6 h-6 rounded bg-[#1E90FF]/20 flex items-center justify-center text-xs">{i + 1}</span>
                    {section.section}
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    {section.fields.map((field, j) => (
                      <div key={j} className="bg-[#0a0f1e] rounded-lg p-2 text-blue-300 text-xs flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#1E90FF]" />
                        {field}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              <button className="w-full bg-gradient-to-r from-[#1E90FF] to-[#4169E1] text-white font-black py-3 rounded-xl hover:opacity-90 transition-opacity">
                Generate AI Scouting Report
              </button>
            </div>
          )}

          {/* CTA */}
          <div className="bg-gradient-to-r from-[#1E90FF]/10 to-[#4169E1]/10 border border-[#1E90FF]/30 rounded-2xl p-6 text-center">
            <div className="text-2xl mb-2">🔭</div>
            <h3 className="text-white font-black text-xl mb-2">See Every Athlete. Miss Nothing.</h3>
            <p className="text-blue-200 text-sm mb-4">AthlynX Scouting OS gives you the complete picture — from local showcases to international academies to draft boards.</p>
            <button className="bg-gradient-to-r from-[#1E90FF] to-[#4169E1] text-white font-black px-8 py-3 rounded-xl hover:opacity-90 transition-opacity">
              Access Full Scouting Database
            </button>
            <div className="text-xs text-blue-400 mt-3 italic">AthlynX. The Athlete's Playbook. BE THE LEGACY.</div>
          </div>
        </div>
      </div>
    </PlatformLayout>
  );
}
