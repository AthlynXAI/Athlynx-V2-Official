import { useState } from "react";
import PlatformLayout from "@/components/PlatformLayout";
import { Users, Target, BarChart3, Shield, CheckCircle, ArrowRight, Award, BookOpen, Calendar, Zap, ChevronDown, ChevronUp, AlertTriangle, FileText } from "lucide-react";

const COACHING_MODULES = [
  { icon: "📋", title: "Athlete Development Tracking", desc: "Monitor every athlete's physical, technical, and mental development with AI-powered progress tracking and milestone alerts.", badge: "CORE" },
  { icon: "🎯", title: "Recruiting Compliance Engine", desc: "NCAA/NAIA recruiting calendar compliance, contact period tracking, official/unofficial visit management, and NLI coordination.", badge: "COMPLIANCE" },
  { icon: "📊", title: "Performance Analytics", desc: "Advanced metrics, film breakdown, practice efficiency scores, and game-day performance analysis across all positions.", badge: "ANALYTICS" },
  { icon: "🧠", title: "Mental Performance OS", desc: "Athlete mental health monitoring, confidence tracking, team chemistry analysis, and sports psychology integration.", badge: "WELLNESS" },
  { icon: "💼", title: "Staff Management", desc: "Coordinate assistant coaches, trainers, nutritionists, and support staff. Role-based access and communication hub.", badge: "ADMIN" },
  { icon: "📱", title: "Athlete Communication", desc: "Direct messaging, practice schedules, film review sessions, and team announcements — all FERPA and NCAA compliant.", badge: "COMMS" }
];

const NCAA_RECRUITING_CALENDAR = [
  {
    period: "Dead Period",
    icon: "🚫",
    color: "red",
    rules: [
      "No in-person recruiting contact or evaluation of prospective student-athletes",
      "No official or unofficial visits permitted",
      "No off-campus contact allowed",
      "Phone calls and written correspondence still permitted",
      "Typically occurs around certain holidays and championship events"
    ]
  },
  {
    period: "Quiet Period",
    icon: "🤫",
    color: "yellow",
    rules: [
      "In-person contact with prospective student-athletes only on institution's campus",
      "No off-campus recruiting contact or evaluation",
      "Official visits permitted",
      "Unofficial visits permitted",
      "No attendance at prospect's competitions or practices"
    ]
  },
  {
    period: "Evaluation Period",
    icon: "👁️",
    color: "blue",
    rules: [
      "Coaches may watch prospective student-athletes compete and practice",
      "No in-person contact with prospects off campus",
      "No contact with prospects at competition sites",
      "Unofficial visits permitted on campus",
      "Official visits permitted on campus"
    ]
  },
  {
    period: "Contact Period",
    icon: "🤝",
    color: "green",
    rules: [
      "In-person off-campus contact with prospective student-athletes permitted",
      "Coaches may attend prospect's competitions",
      "Official and unofficial visits permitted",
      "Contact at competition sites allowed (with restrictions)",
      "Home visits permitted (one per prospect)"
    ]
  }
];

const VISIT_RULES = [
  {
    type: "Official Visit",
    icon: "✈️",
    rules: [
      "Institution pays for transportation, room, board, and entertainment",
      "Limited to 5 official visits per sport (D1 football: 5; basketball: 5; baseball: 5)",
      "Prospect must be a senior or have signed NLI",
      "48-hour maximum duration",
      "Must have SAT/ACT score on file (D1 only)",
      "Host student-athlete must be enrolled and eligible"
    ]
  },
  {
    type: "Unofficial Visit",
    icon: "🚗",
    rules: [
      "Prospect pays all expenses",
      "Unlimited number of unofficial visits",
      "Can occur during any period except dead period",
      "No restrictions on duration",
      "Complimentary admissions to athletic events: 3 per sport",
      "No transportation or lodging provided by institution"
    ]
  }
];

const DEVELOPMENT_PILLARS = [
  {
    pillar: "Physical Development",
    icon: "💪",
    areas: ["Strength & conditioning", "Speed & agility", "Injury prevention", "Recovery protocols", "Nutrition planning", "Sleep optimization"],
    kpis: ["Max squat/bench/deadlift", "40-yard dash time", "Vertical jump", "Body composition", "Injury-free days", "Recovery score"]
  },
  {
    pillar: "Technical Development",
    icon: "🎯",
    areas: ["Skill-specific drills", "Film study", "Game IQ development", "Position-specific coaching", "Situational practice", "Competition simulation"],
    kpis: ["Skill grade progression", "Film study hours", "Practice efficiency %", "Drill completion rate", "Situational success %", "Competition performance"]
  },
  {
    pillar: "Mental Development",
    icon: "🧠",
    areas: ["Confidence building", "Pressure performance", "Team leadership", "Adversity response", "Focus and concentration", "Goal setting"],
    kpis: ["Confidence index", "Clutch performance %", "Leadership rating", "Adversity recovery time", "Focus score", "Goal achievement %"]
  },
  {
    pillar: "Academic Development",
    icon: "📚",
    areas: ["GPA maintenance", "Time management", "Study hall compliance", "Tutoring utilization", "Graduation planning", "Career preparation"],
    kpis: ["GPA", "Study hall hours", "Tutor sessions", "Class attendance %", "Credit completion", "Internship secured"]
  }
];

const STAFF_ROLES = [
  { role: "Head Coach", responsibilities: ["Program vision and culture", "Recruiting strategy", "Game planning", "Staff management", "Media relations", "Compliance oversight"] },
  { role: "Assistant Coach", responsibilities: ["Position group coaching", "Recruiting territory", "Film breakdown", "Practice planning", "Athlete development", "Compliance reporting"] },
  { role: "Strength & Conditioning Coach", responsibilities: ["Strength programming", "Speed development", "Injury prevention", "Recovery protocols", "Testing and assessment", "Nutrition coordination"] },
  { role: "Athletic Trainer", responsibilities: ["Injury treatment", "Rehabilitation", "Medical clearance", "HIPAA compliance", "Insurance coordination", "Emergency protocols"] },
  { role: "Director of Operations", responsibilities: ["Travel logistics", "Budget management", "Facility scheduling", "Equipment management", "Compliance documentation", "Staff coordination"] },
  { role: "Recruiting Coordinator", responsibilities: ["Prospect database management", "Campus visit coordination", "Communication tracking", "NLI processing", "Compliance calendar", "Scholarship tracking"] }
];

const COMPLIANCE_CHECKLIST = [
  { item: "Annual eligibility certification for all athletes", category: "Eligibility" },
  { item: "Drug testing program compliance", category: "Health & Safety" },
  { item: "Recruiting contact log maintained", category: "Recruiting" },
  { item: "Official visit documentation complete", category: "Recruiting" },
  { item: "Scholarship agreements on file", category: "Financial Aid" },
  { item: "Practice hour limits tracked (20 hrs/week in-season, 8 hrs/week out-of-season)", category: "Time Limits" },
  { item: "Playing and practice season dates within NCAA windows", category: "Time Limits" },
  { item: "Booster contact restrictions communicated to staff", category: "Amateurism" },
  { item: "NIL disclosure forms collected from athletes", category: "NIL" },
  { item: "Transfer portal notifications processed within 2 business days", category: "Transfer" },
  { item: "HIPAA training completed by all staff with medical access", category: "Health & Safety" },
  { item: "FERPA compliance for athlete academic records", category: "Academic" }
];

export default function CoachingHub() {
  const [activeTab, setActiveTab] = useState("overview");
  const [expandedPeriod, setExpandedPeriod] = useState<number | null>(null);
  const [expandedVisit, setExpandedVisit] = useState<number | null>(null);
  const [expandedPillar, setExpandedPillar] = useState<number | null>(null);
  const [expandedRole, setExpandedRole] = useState<number | null>(null);

  const tabs = [
    { id: "overview", label: "Coaching OS", icon: "🏆" },
    { id: "recruiting", label: "Recruiting Rules", icon: "📋" },
    { id: "development", label: "Development", icon: "📈" },
    { id: "staff", label: "Staff Roles", icon: "👥" },
    { id: "compliance", label: "Compliance", icon: "✅" }
  ];

  return (
    <PlatformLayout>
      <div className="min-h-screen bg-[#0a0f1e] text-white pb-20">
        {/* Hero */}
        <div className="relative overflow-hidden bg-gradient-to-br from-[#0a0f1e] via-[#0d1b3e] to-[#0a0f1e] border-b border-blue-900/40 px-4 py-10">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(30,144,255,0.12),transparent_60%)]" />
          <div className="max-w-4xl mx-auto relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#1E90FF] to-[#4169E1] flex items-center justify-center text-2xl shadow-lg shadow-blue-500/30">
                🏆
              </div>
              <div>
                <div className="text-xs font-bold text-[#1E90FF] tracking-widest uppercase mb-1">AthlynX Coaching</div>
                <h1 className="text-3xl font-black text-white">Coaching Hub</h1>
              </div>
            </div>
            <p className="text-blue-200 text-lg mb-6 max-w-2xl">
              The complete coaching intelligence platform. Recruiting compliance, athlete development tracking, staff management, and NCAA rule mastery — everything a coach needs to build a dynasty.
            </p>
            <div className="flex flex-wrap gap-3">
              <div className="bg-[#1E90FF]/10 border border-[#1E90FF]/30 rounded-xl px-4 py-2 text-sm text-blue-200">
                <span className="text-[#1E90FF] font-bold">NCAA/NAIA</span> compliant
              </div>
              <div className="bg-[#1E90FF]/10 border border-[#1E90FF]/30 rounded-xl px-4 py-2 text-sm text-blue-200">
                <span className="text-[#1E90FF] font-bold">All divisions</span> covered
              </div>
              <div className="bg-[#1E90FF]/10 border border-[#1E90FF]/30 rounded-xl px-4 py-2 text-sm text-blue-200">
                <span className="text-[#1E90FF] font-bold">AI-powered</span> development
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
              <h2 className="text-xl font-black text-white">Coaching Intelligence Modules</h2>
              <div className="grid gap-4">
                {COACHING_MODULES.map((mod, i) => (
                  <div key={i} className="bg-gradient-to-br from-[#0d1b3e] to-[#0a0f1e] border border-blue-900/40 rounded-2xl p-5">
                    <div className="flex items-start gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#1E90FF]/20 to-[#4169E1]/20 border border-[#1E90FF]/30 flex items-center justify-center text-2xl flex-shrink-0">
                        {mod.icon}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-white font-black">{mod.title}</h3>
                          <span className={`px-2 py-0.5 rounded text-xs font-black ${
                            mod.badge === "COMPLIANCE" ? "bg-red-500/20 text-red-400" :
                            mod.badge === "ANALYTICS" ? "bg-[#1E90FF]/20 text-[#1E90FF]" :
                            mod.badge === "WELLNESS" ? "bg-green-500/20 text-green-400" :
                            "bg-blue-900/40 text-blue-300"
                          }`}>{mod.badge}</span>
                        </div>
                        <p className="text-blue-200 text-sm mt-1">{mod.desc}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* RECRUITING RULES TAB */}
          {activeTab === "recruiting" && (
            <div className="space-y-4">
              <div>
                <h2 className="text-xl font-black text-white mb-1">NCAA Recruiting Calendar</h2>
                <p className="text-blue-300 text-sm">The four recruiting periods govern when and how coaches can contact prospective student-athletes. Violations can result in NCAA sanctions.</p>
              </div>
              {NCAA_RECRUITING_CALENDAR.map((period, i) => (
                <div key={i} className="bg-gradient-to-br from-[#0d1b3e] to-[#0a0f1e] border border-blue-900/40 rounded-2xl overflow-hidden">
                  <button
                    onClick={() => setExpandedPeriod(expandedPeriod === i ? null : i)}
                    className="w-full flex items-center justify-between p-5 text-left"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{period.icon}</span>
                      <h3 className="text-white font-black">{period.period}</h3>
                    </div>
                    {expandedPeriod === i ? <ChevronUp className="w-5 h-5 text-blue-400" /> : <ChevronDown className="w-5 h-5 text-blue-400" />}
                  </button>
                  {expandedPeriod === i && (
                    <div className="px-5 pb-5 border-t border-blue-900/30 space-y-2 pt-3">
                      {period.rules.map((rule, j) => (
                        <div key={j} className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-[#1E90FF] flex-shrink-0 mt-0.5" />
                          <p className="text-blue-200 text-sm">{rule}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              <h2 className="text-xl font-black text-white pt-2">Official vs. Unofficial Visits</h2>
              {VISIT_RULES.map((visit, i) => (
                <div key={i} className="bg-gradient-to-br from-[#0d1b3e] to-[#0a0f1e] border border-blue-900/40 rounded-2xl overflow-hidden">
                  <button
                    onClick={() => setExpandedVisit(expandedVisit === i ? null : i)}
                    className="w-full flex items-center justify-between p-5 text-left"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{visit.icon}</span>
                      <h3 className="text-white font-black">{visit.type}</h3>
                    </div>
                    {expandedVisit === i ? <ChevronUp className="w-5 h-5 text-blue-400" /> : <ChevronDown className="w-5 h-5 text-blue-400" />}
                  </button>
                  {expandedVisit === i && (
                    <div className="px-5 pb-5 border-t border-blue-900/30 space-y-2 pt-3">
                      {visit.rules.map((rule, j) => (
                        <div key={j} className="flex items-start gap-2">
                          <ArrowRight className="w-4 h-4 text-[#1E90FF] flex-shrink-0 mt-0.5" />
                          <p className="text-blue-200 text-sm">{rule}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* DEVELOPMENT TAB */}
          {activeTab === "development" && (
            <div className="space-y-4">
              <div>
                <h2 className="text-xl font-black text-white mb-1">Athlete Development Framework</h2>
                <p className="text-blue-300 text-sm">The four pillars of complete athlete development. Track every dimension of your athletes' growth.</p>
              </div>
              {DEVELOPMENT_PILLARS.map((pillar, i) => (
                <div key={i} className="bg-gradient-to-br from-[#0d1b3e] to-[#0a0f1e] border border-blue-900/40 rounded-2xl overflow-hidden">
                  <button
                    onClick={() => setExpandedPillar(expandedPillar === i ? null : i)}
                    className="w-full flex items-center justify-between p-5 text-left"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{pillar.icon}</span>
                      <h3 className="text-white font-black">{pillar.pillar}</h3>
                    </div>
                    {expandedPillar === i ? <ChevronUp className="w-5 h-5 text-blue-400" /> : <ChevronDown className="w-5 h-5 text-blue-400" />}
                  </button>
                  {expandedPillar === i && (
                    <div className="px-5 pb-5 border-t border-blue-900/30 pt-3">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <div className="text-xs font-bold text-[#1E90FF] mb-2">DEVELOPMENT AREAS</div>
                          <ul className="space-y-1">
                            {pillar.areas.map((a, j) => (
                              <li key={j} className="text-blue-200 text-sm flex items-center gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-[#1E90FF]" />
                                {a}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <div className="text-xs font-bold text-green-400 mb-2">KEY PERFORMANCE INDICATORS</div>
                          <ul className="space-y-1">
                            {pillar.kpis.map((k, j) => (
                              <li key={j} className="text-blue-200 text-sm flex items-center gap-2">
                                <BarChart3 className="w-3 h-3 text-green-400 flex-shrink-0" />
                                {k}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* STAFF ROLES TAB */}
          {activeTab === "staff" && (
            <div className="space-y-4">
              <div>
                <h2 className="text-xl font-black text-white mb-1">Coaching Staff Roles & Responsibilities</h2>
                <p className="text-blue-300 text-sm">Every staff member has a defined role. Clear responsibilities prevent compliance violations and maximize athlete development.</p>
              </div>
              {STAFF_ROLES.map((role, i) => (
                <div key={i} className="bg-gradient-to-br from-[#0d1b3e] to-[#0a0f1e] border border-blue-900/40 rounded-2xl overflow-hidden">
                  <button
                    onClick={() => setExpandedRole(expandedRole === i ? null : i)}
                    className="w-full flex items-center justify-between p-5 text-left"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#1E90FF]/20 border border-[#1E90FF]/30 flex items-center justify-center">
                        <Users className="w-5 h-5 text-[#1E90FF]" />
                      </div>
                      <h3 className="text-white font-black">{role.role}</h3>
                    </div>
                    {expandedRole === i ? <ChevronUp className="w-5 h-5 text-blue-400" /> : <ChevronDown className="w-5 h-5 text-blue-400" />}
                  </button>
                  {expandedRole === i && (
                    <div className="px-5 pb-5 border-t border-blue-900/30 pt-3">
                      <ul className="space-y-2">
                        {role.responsibilities.map((r, j) => (
                          <li key={j} className="flex items-start gap-2 text-blue-200 text-sm">
                            <CheckCircle className="w-4 h-4 text-[#1E90FF] flex-shrink-0 mt-0.5" />
                            {r}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* COMPLIANCE TAB */}
          {activeTab === "compliance" && (
            <div className="space-y-4">
              <div>
                <h2 className="text-xl font-black text-white mb-1">Coaching Compliance Checklist</h2>
                <p className="text-blue-300 text-sm">Stay ahead of NCAA compliance requirements. Every item on this list is a potential violation if missed.</p>
              </div>
              <div className="bg-gradient-to-br from-[#1E90FF]/10 to-[#4169E1]/10 border border-[#1E90FF]/30 rounded-2xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="w-5 h-5 text-blue-400" />
                  <span className="text-white font-bold">NCAA Compliance Warning</span>
                </div>
                <p className="text-blue-200 text-sm">Compliance violations can result in scholarship reductions, recruiting restrictions, bowl bans, and show-cause orders. When in doubt, call your compliance office.</p>
              </div>
              {["Eligibility", "Recruiting", "Financial Aid", "Time Limits", "NIL", "Transfer", "Health & Safety", "Academic"].map((category) => (
                <div key={category} className="bg-gradient-to-br from-[#0d1b3e] to-[#0a0f1e] border border-blue-900/40 rounded-xl p-4">
                  <h3 className="text-[#1E90FF] font-black text-sm mb-3">{category}</h3>
                  {COMPLIANCE_CHECKLIST.filter(c => c.category === category).map((item, i) => (
                    <div key={i} className="flex items-start gap-2 mb-2">
                      <div className="w-5 h-5 rounded border-2 border-[#1E90FF]/50 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <CheckCircle className="w-3 h-3 text-[#1E90FF]" />
                      </div>
                      <p className="text-blue-200 text-sm">{item.item}</p>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}

          {/* CTA */}
          <div className="bg-gradient-to-r from-[#1E90FF]/10 to-[#4169E1]/10 border border-[#1E90FF]/30 rounded-2xl p-6 text-center">
            <div className="text-2xl mb-2">🏆</div>
            <h3 className="text-white font-black text-xl mb-2">Build Your Dynasty</h3>
            <p className="text-blue-200 text-sm mb-4">AthlynX Coaching Hub gives you the tools to recruit smarter, develop faster, and stay compliant. Championship programs start here.</p>
            <button className="bg-gradient-to-r from-[#1E90FF] to-[#4169E1] text-white font-black px-8 py-3 rounded-xl hover:opacity-90 transition-opacity">
              Access Full Coaching OS
            </button>
            <div className="text-xs text-blue-400 mt-3 italic">AthlynX. The Athlete's Playbook. BE THE LEGACY.</div>
          </div>
        </div>
      </div>
    </PlatformLayout>
  );
}
