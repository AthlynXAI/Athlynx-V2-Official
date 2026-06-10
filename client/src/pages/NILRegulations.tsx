import { useState } from "react";
import PlatformLayout from "@/components/PlatformLayout";
import { ChevronDown, ChevronUp, CheckCircle, AlertTriangle, DollarSign, FileText, Users, Shield } from "lucide-react";

const TABS = [
  { id: "overview", label: "Overview", icon: "💡" },
  { id: "state", label: "State Laws", icon: "🗺️" },
  { id: "collectives", label: "Collectives", icon: "🤝" },
  { id: "tax", label: "Tax & Compliance", icon: "📊" },
];

const NIL_TIMELINE = [
  { year: "2021", event: "NCAA adopts interim NIL policy — athletes can earn from name, image, likeness for first time in history." },
  { year: "2022", event: "States begin passing individual NIL laws. NCAA struggles to enforce national standard." },
  { year: "2023", event: "House v. NCAA lawsuit filed — challenges NCAA's restrictions on athlete compensation." },
  { year: "2024", event: "House settlement approved — $2.8B back pay + revenue sharing starting 2025." },
  { year: "2025", event: "Revenue sharing begins: schools can pay athletes directly up to ~$20M/year per school." },
  { year: "2026", event: "Full NIL + revenue sharing era. Athletes can earn unlimited NIL + direct school payments." },
];

const WHAT_YOU_CAN = [
  "Sign endorsement deals with brands, local businesses, or national companies",
  "Earn money from social media posts, YouTube, TikTok, Instagram",
  "Charge for autograph signings, appearances, and meet-and-greets",
  "License your name and likeness for merchandise, video games, trading cards",
  "Start your own business and use your athlete status to promote it",
  "Earn from podcasts, YouTube channels, and streaming content",
  "Accept payment for camps, clinics, and training sessions",
  "Partner with NIL collectives for group licensing deals",
  "Earn revenue sharing directly from your school (post-House settlement)",
];

const WHAT_YOU_CANNOT = [
  "Use NIL as a pay-for-play arrangement tied to athletic performance",
  "Have a booster promise NIL money as an inducement to sign with a school",
  "Sign NIL deals that conflict with your school's existing sponsorships",
  "Use NIL income to violate your school's academic or conduct policies",
  "Accept NIL deals from agents who are not registered with your school",
  "Fail to disclose NIL deals to your institution (most states require this)",
  "Use NIL to circumvent the transfer portal rules",
];

const STATE_LAWS = [
  { state: "California", law: "SB 206 (Fair Pay to Play Act)", key: "First state to pass NIL law (2019, effective 2023). No agent restrictions. Schools cannot revoke scholarships for NIL activity.", disclosure: "Not required", agentRule: "Athletes may hire agents" },
  { state: "Florida", law: "HB 7065", key: "Passed June 2021. Requires disclosure to school 7 days before signing. Prohibits deals conflicting with school sponsors.", disclosure: "7 days before signing", agentRule: "Must use licensed agent" },
  { state: "Texas", law: "HB 1525", key: "Effective July 2021. Schools can assist with NIL education. No disclosure requirement. Broad athlete protections.", disclosure: "Not required", agentRule: "No restriction" },
  { state: "Georgia", law: "SB 93", key: "Effective July 2021. Athletes must disclose deals to school. Schools can restrict deals conflicting with institutional sponsors.", disclosure: "Required before signing", agentRule: "No restriction" },
  { state: "Ohio", law: "HB 29", key: "Effective July 2021. Broad protections. Schools may not prevent NIL activity. Disclosure required.", disclosure: "Required", agentRule: "No restriction" },
  { state: "Alabama", law: "HB 439", key: "Effective July 2021. Athletes must disclose to school. Cannot conflict with school sponsors. Strong booster restrictions.", disclosure: "Required", agentRule: "Licensed agent preferred" },
  { state: "Michigan", law: "SB 617", key: "Effective December 2021. Disclosure required. Schools may provide NIL education and assistance.", disclosure: "Required", agentRule: "No restriction" },
  { state: "North Carolina", law: "SB 674", key: "Effective July 2021. Disclosure required within 72 hours. Schools can restrict conflicting deals.", disclosure: "72 hours after signing", agentRule: "No restriction" },
  { state: "Louisiana", law: "SB 123", key: "Effective July 2021. One of the most athlete-friendly laws. Minimal restrictions. No disclosure requirement.", disclosure: "Not required", agentRule: "No restriction" },
  { state: "Tennessee", law: "HB 1258", key: "Effective July 2021. Disclosure required. Schools may not restrict NIL activity unless it conflicts with existing contracts.", disclosure: "Required", agentRule: "No restriction" },
];

const COLLECTIVES = [
  { name: "What is a Collective?", desc: "A NIL collective is a booster-funded organization that pools money to pay athletes for NIL activities — appearances, social posts, autographs, or group licensing deals. They operate separately from the university but are funded by fans and boosters." },
  { name: "Legal vs. Illegal Collective Activity", desc: "LEGAL: Paying athletes for genuine NIL activities (appearances, content creation, licensing). ILLEGAL: Using collective payments as a disguised pay-for-play arrangement or as an inducement to sign with a school." },
  { name: "House Settlement Impact", desc: "The House v. NCAA settlement (2024) allows schools to directly share revenue with athletes — up to ~$20M/year per school. This reduces the need for collectives but doesn't eliminate them. Collectives can still supplement school payments." },
  { name: "How Athletes Work With Collectives", desc: "Athletes sign group licensing agreements with collectives. The collective pays athletes for use of their NIL in merchandise, marketing, or events. Athletes must report collective income as taxable income." },
  { name: "Booster Rules", desc: "Boosters CANNOT promise NIL money as a recruiting inducement. They CAN donate to collectives that pay athletes for legitimate NIL work. The line between recruiting inducement and legitimate NIL is actively monitored by the NCAA." },
];

const TAX_GUIDE = [
  { topic: "NIL Income is Taxable", detail: "All NIL income — endorsements, appearances, social media, licensing — is taxable as self-employment income. The IRS treats you as an independent contractor." },
  { topic: "Self-Employment Tax", detail: "You owe 15.3% self-employment tax (Social Security + Medicare) on top of regular income tax. Budget 25-30% of NIL income for taxes." },
  { topic: "Quarterly Estimated Taxes", detail: "If you expect to owe more than $1,000 in taxes, you must pay quarterly estimated taxes (April 15, June 15, Sept 15, Jan 15). Missing payments triggers penalties." },
  { topic: "1099 Forms", detail: "Any company that pays you $600+ must send you a 1099-NEC form by January 31. Keep records of all payments even if you don't receive a 1099." },
  { topic: "Business Deductions", detail: "You can deduct legitimate business expenses: agent fees, equipment, travel for appearances, home office, marketing costs. Keep all receipts." },
  { topic: "Form an LLC", detail: "Many athletes form an LLC to manage NIL income. Benefits: liability protection, potential tax savings, professional appearance to brands. Cost: $50-500 to form depending on state." },
  { topic: "Hire a CPA", detail: "A CPA who specializes in athlete finances can save you far more than their fee. AthlynX connects you with athlete-focused CPAs through the Financial Advisor OS." },
  { topic: "State Taxes", detail: "You may owe state income tax in every state where you earn NIL income (e.g., if you do an appearance in another state). This is called 'jock tax' and applies to athletes." },
];

const NIL_CHECKLIST = [
  "Register with your school's compliance office before signing any deal",
  "Disclose all NIL deals to your institution (check your state's law)",
  "Review deal for conflicts with school's existing sponsor agreements",
  "Ensure deal is for genuine NIL activity — not pay-for-play",
  "Get contract reviewed by a licensed agent or attorney",
  "Set up a separate bank account for NIL income",
  "Track all income and expenses from day one",
  "Pay quarterly estimated taxes if earning $1,000+ per year",
  "Consider forming an LLC for liability protection",
  "File taxes by April 15 — or request extension by April 15",
];

export default function NILRegulations() {
  const [activeTab, setActiveTab] = useState("overview");
  const [expandedState, setExpandedState] = useState<number | null>(null);
  const [expandedCollective, setExpandedCollective] = useState<number | null>(null);
  const [expandedTax, setExpandedTax] = useState<number | null>(null);

  return (
    <PlatformLayout>
      <div className="min-h-screen bg-[#0a0f1e] text-white pb-20">
        {/* Hero */}
        <div className="relative overflow-hidden border-b border-blue-900/40 px-4 py-10"
          style={{ background: "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(30,144,255,0.13) 0%, transparent 70%), linear-gradient(160deg, #0e1a2e 0%, #0a0f1e 100%)" }}>
          <div className="max-w-4xl mx-auto relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#1E90FF] to-[#4169E1] flex items-center justify-center text-2xl shadow-lg shadow-blue-500/30">💡</div>
              <div>
                <div className="text-xs font-bold text-[#1E90FF] tracking-widest uppercase mb-1">AthlynX Regulations</div>
                <h1 className="text-3xl font-black text-white">NIL Regulations</h1>
              </div>
            </div>
            <p className="text-blue-200 text-lg mb-6 max-w-2xl">Name, Image & Likeness — the complete rulebook. What you can earn, how to stay compliant, state laws, collectives, the House settlement, and tax obligations.</p>
            <div className="flex flex-wrap gap-3">
              <div className="bg-[#1E90FF]/10 border border-[#1E90FF]/30 rounded-xl px-4 py-2 text-sm text-blue-200"><span className="text-[#1E90FF] font-bold">$2.8B</span> House Settlement</div>
              <div className="bg-[#1E90FF]/10 border border-[#1E90FF]/30 rounded-xl px-4 py-2 text-sm text-blue-200"><span className="text-[#1E90FF] font-bold">50 States</span> covered</div>
              <div className="bg-[#1E90FF]/10 border border-[#1E90FF]/30 rounded-xl px-4 py-2 text-sm text-blue-200"><span className="text-[#1E90FF] font-bold">2026</span> rules current</div>
            </div>
            <div className="mt-4 text-xs text-blue-400 italic">AthlynX. The Athlete's Playbook. BE THE LEGACY.</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="sticky top-0 z-20 bg-[#0a0f1e]/95 backdrop-blur border-b border-blue-900/40 px-4">
          <div className="max-w-4xl mx-auto flex gap-1 overflow-x-auto py-2">
            {TABS.map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-all ${activeTab === tab.id ? "bg-[#1E90FF] text-white shadow-lg shadow-blue-500/30" : "text-blue-300 hover:text-white hover:bg-blue-900/30"}`}>
                <span>{tab.icon}</span>{tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">

          {/* OVERVIEW */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              {/* Timeline */}
              <div>
                <h2 className="text-xl font-black text-white mb-4">NIL Timeline</h2>
                <div className="space-y-2">
                  {NIL_TIMELINE.map((item, i) => (
                    <div key={i} className="flex gap-4 bg-gradient-to-br from-[#0d1b3e] to-[#0a0f1e] border border-blue-900/40 rounded-xl p-4">
                      <div className="w-14 h-14 rounded-xl bg-[#1E90FF]/20 border border-[#1E90FF]/30 flex items-center justify-center font-black text-[#1E90FF] text-sm flex-shrink-0">{item.year}</div>
                      <p className="text-blue-200 text-sm leading-relaxed self-center">{item.event}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Can / Cannot */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-gradient-to-br from-[#0d1b3e] to-[#0a0f1e] border border-green-900/40 rounded-2xl p-5">
                  <h3 className="text-green-400 font-black mb-3 flex items-center gap-2"><CheckCircle className="w-5 h-5" /> What You CAN Do</h3>
                  <div className="space-y-2">
                    {WHAT_YOU_CAN.map((item, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-400 mt-2 flex-shrink-0" />
                        <span className="text-blue-200 text-sm">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-gradient-to-br from-[#0d1b3e] to-[#0a0f1e] border border-red-900/40 rounded-2xl p-5">
                  <h3 className="text-red-400 font-black mb-3 flex items-center gap-2"><AlertTriangle className="w-5 h-5" /> What You CANNOT Do</h3>
                  <div className="space-y-2">
                    {WHAT_YOU_CANNOT.map((item, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-red-400 mt-2 flex-shrink-0" />
                        <span className="text-blue-200 text-sm">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* NIL Checklist */}
              <div className="bg-gradient-to-br from-[#0d1b3e] to-[#0a0f1e] border border-[#1E90FF]/30 rounded-2xl p-5">
                <h3 className="text-white font-black mb-4 flex items-center gap-2"><FileText className="w-5 h-5 text-[#1E90FF]" /> NIL Deal Checklist</h3>
                <div className="grid md:grid-cols-2 gap-2">
                  {NIL_CHECKLIST.map((item, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-[#1E90FF] flex-shrink-0 mt-0.5" />
                      <span className="text-blue-200 text-sm">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STATE LAWS */}
          {activeTab === "state" && (
            <div className="space-y-4">
              <div>
                <h2 className="text-xl font-black text-white mb-1">State NIL Laws</h2>
                <p className="text-blue-300 text-sm">Each state has its own NIL law. Your school's state law governs your NIL activity. Know your state's rules.</p>
              </div>
              {STATE_LAWS.map((state, i) => (
                <div key={i} className="bg-gradient-to-br from-[#0d1b3e] to-[#0a0f1e] border border-blue-900/40 rounded-2xl overflow-hidden">
                  <button onClick={() => setExpandedState(expandedState === i ? null : i)}
                    className="w-full flex items-center justify-between p-5 text-left">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#1E90FF]/20 border border-[#1E90FF]/30 flex items-center justify-center font-black text-[#1E90FF] text-xs">{state.state.substring(0, 2).toUpperCase()}</div>
                      <div>
                        <h3 className="text-white font-black">{state.state}</h3>
                        <div className="text-blue-400 text-xs">{state.law}</div>
                      </div>
                    </div>
                    {expandedState === i ? <ChevronUp className="w-5 h-5 text-blue-400" /> : <ChevronDown className="w-5 h-5 text-blue-400" />}
                  </button>
                  {expandedState === i && (
                    <div className="px-5 pb-5 border-t border-blue-900/30 pt-3 space-y-3">
                      <p className="text-blue-200 text-sm">{state.key}</p>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-[#0a0f1e] rounded-xl p-3">
                          <div className="text-xs text-blue-400 mb-1">Disclosure Requirement</div>
                          <div className="text-white text-sm font-bold">{state.disclosure}</div>
                        </div>
                        <div className="bg-[#0a0f1e] rounded-xl p-3">
                          <div className="text-xs text-blue-400 mb-1">Agent Rule</div>
                          <div className="text-white text-sm font-bold">{state.agentRule}</div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* COLLECTIVES */}
          {activeTab === "collectives" && (
            <div className="space-y-4">
              <div>
                <h2 className="text-xl font-black text-white mb-1">NIL Collectives</h2>
                <p className="text-blue-300 text-sm">Collectives are booster-funded organizations that pay athletes for NIL activities. Understand how they work and where the lines are.</p>
              </div>
              {COLLECTIVES.map((item, i) => (
                <div key={i} className="bg-gradient-to-br from-[#0d1b3e] to-[#0a0f1e] border border-blue-900/40 rounded-2xl overflow-hidden">
                  <button onClick={() => setExpandedCollective(expandedCollective === i ? null : i)}
                    className="w-full flex items-center justify-between p-5 text-left">
                    <div className="flex items-center gap-3">
                      <Users className="w-5 h-5 text-[#1E90FF]" />
                      <h3 className="text-white font-black">{item.name}</h3>
                    </div>
                    {expandedCollective === i ? <ChevronUp className="w-5 h-5 text-blue-400" /> : <ChevronDown className="w-5 h-5 text-blue-400" />}
                  </button>
                  {expandedCollective === i && (
                    <div className="px-5 pb-5 border-t border-blue-900/30 pt-3">
                      <p className="text-blue-200 text-sm leading-relaxed">{item.desc}</p>
                    </div>
                  )}
                </div>
              ))}
              <div className="bg-gradient-to-r from-[#1E90FF]/10 to-[#4169E1]/10 border border-[#1E90FF]/30 rounded-2xl p-5">
                <h3 className="text-white font-black mb-2">House v. NCAA Settlement — Key Facts</h3>
                <div className="space-y-2">
                  {[
                    "$2.8 billion in back pay distributed to former college athletes over 10 years",
                    "Schools can now share up to ~$20M/year directly with athletes starting 2025",
                    "Revenue sharing is distributed through a school-athlete agreement — not NIL",
                    "Athletes can receive BOTH revenue sharing AND NIL income simultaneously",
                    "Revenue sharing does not affect NCAA eligibility",
                  ].map((fact, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-[#1E90FF] flex-shrink-0 mt-0.5" />
                      <span className="text-blue-200 text-sm">{fact}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAX */}
          {activeTab === "tax" && (
            <div className="space-y-4">
              <div>
                <h2 className="text-xl font-black text-white mb-1">NIL Tax & Compliance</h2>
                <p className="text-blue-300 text-sm">NIL income is taxable. Understand your obligations before you earn — not after.</p>
              </div>
              <div className="bg-red-900/20 border border-red-500/30 rounded-2xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="w-5 h-5 text-red-400" />
                  <span className="text-red-400 font-black">Critical: Budget 25-30% of every NIL payment for taxes</span>
                </div>
                <p className="text-blue-200 text-sm">The IRS does not automatically withhold taxes from NIL income. You are responsible for tracking and paying your own taxes. Failure to do so can result in penalties, interest, and back taxes owed.</p>
              </div>
              {TAX_GUIDE.map((item, i) => (
                <div key={i} className="bg-gradient-to-br from-[#0d1b3e] to-[#0a0f1e] border border-blue-900/40 rounded-2xl overflow-hidden">
                  <button onClick={() => setExpandedTax(expandedTax === i ? null : i)}
                    className="w-full flex items-center justify-between p-5 text-left">
                    <div className="flex items-center gap-3">
                      <DollarSign className="w-5 h-5 text-[#1E90FF]" />
                      <h3 className="text-white font-black">{item.topic}</h3>
                    </div>
                    {expandedTax === i ? <ChevronUp className="w-5 h-5 text-blue-400" /> : <ChevronDown className="w-5 h-5 text-blue-400" />}
                  </button>
                  {expandedTax === i && (
                    <div className="px-5 pb-5 border-t border-blue-900/30 pt-3">
                      <p className="text-blue-200 text-sm leading-relaxed">{item.detail}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* CTA */}
          <div className="bg-gradient-to-r from-[#1E90FF]/10 to-[#4169E1]/10 border border-[#1E90FF]/30 rounded-2xl p-6 text-center">
            <div className="text-2xl mb-2">💡</div>
            <h3 className="text-white font-black text-xl mb-2">Know Your NIL Rights.</h3>
            <p className="text-blue-200 text-sm mb-4">AthlynX NIL OS keeps you compliant, connected to collectives, and maximizing every dollar of your name, image, and likeness.</p>
            <button className="bg-gradient-to-r from-[#1E90FF] to-[#4169E1] text-white font-black px-8 py-3 rounded-xl hover:opacity-90 transition-opacity">
              Start My NIL Profile
            </button>
            <div className="text-xs text-blue-400 mt-3 italic">AthlynX. The Athlete's Playbook. BE THE LEGACY.</div>
          </div>
        </div>
      </div>
    </PlatformLayout>
  );
}
