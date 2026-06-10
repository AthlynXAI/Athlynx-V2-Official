import { useState } from "react";
import PlatformLayout from "@/components/PlatformLayout";
import { DollarSign, Star, TrendingUp, Shield, FileText, Users, Target, Award, CheckCircle, ArrowRight, ChevronDown, ChevronUp, Zap, Globe } from "lucide-react";

const DEAL_TYPES = [
  { icon: "👟", type: "Footwear & Apparel", examples: "Under Armour, New Balance, Puma", avg_value: "$50K – $500M+", key_terms: "Exclusivity, royalties, signature line rights, appearance obligations" },
  { icon: "🥤", type: "Beverage & Nutrition", examples: "Gatorade, Powerade, Body Armor, Celsius, Prime", avg_value: "$25K – $100M+", key_terms: "Category exclusivity, usage rights, social media posts, event appearances" },
  { icon: "🚗", type: "Automotive", examples: "Cadillac, BMW, Toyota, Chevrolet, Kia", avg_value: "$100K – $10M", key_terms: "Vehicle use, brand ambassador, commercial rights, dealership appearances" },
  { icon: "💳", type: "Financial Services", examples: "Visa, Mastercard, American Express, Chase, State Farm", avg_value: "$500K – $50M", key_terms: "Spokesperson rights, commercial exclusivity, social media, event appearances" },
  { icon: "🍔", type: "Food & Restaurant", examples: "McDonald's, Subway, Chipotle, Taco Bell, Panera", avg_value: "$50K – $15M", key_terms: "Regional vs. national rights, menu item naming, commercial production" },
  { icon: "📱", type: "Technology & Gaming", examples: "Samsung, EA Sports, 2K, Beats by Dre", avg_value: "$100K – $50M", key_terms: "Product placement, likeness in games, social media content, launch events" },
  { icon: "🏋️", type: "Sports Equipment", examples: "Wilson, Rawlings, Callaway, Titleist, Bauer", avg_value: "$25K – $5M", key_terms: "Equipment use, logo placement, signature model, tournament requirements" },
  { icon: "💊", type: "Health & Wellness", examples: "GNC, Optimum Nutrition, Thorne, Whoop, Hyperice", avg_value: "$25K – $2M", key_terms: "Product endorsement, social media, testimonials, exclusivity within category" }
];

const NIL_DEAL_STRUCTURE = [
  {
    component: "Base Compensation",
    desc: "Fixed payment for the right to use the athlete's name, image, and likeness. Can be flat fee, annual retainer, or per-use payment.",
    examples: ["$5,000 flat fee for one social post", "$50,000 annual retainer for 12 posts/year", "$500 per appearance at store events"]
  },
  {
    component: "Performance Bonuses",
    desc: "Additional compensation tied to athletic performance milestones or business metrics.",
    examples: ["$10,000 bonus if team wins conference championship", "$5,000 per 100K new followers gained", "2% of product sales attributed to athlete's code"]
  },
  {
    component: "Royalties",
    desc: "Percentage of revenue from products bearing the athlete's name, image, or likeness.",
    examples: ["5% of signature shoe sales", "10% of jersey sales with athlete's name", "15% of licensed merchandise revenue"]
  },
  {
    component: "Equity / Ownership",
    desc: "Ownership stake in the company. Most valuable long-term — athletes like LeBron James have built fortunes through equity deals.",
    examples: ["1-5% equity stake in startup", "Founding partner with equity compensation", "Vesting equity over 3-year partnership"]
  },
  {
    component: "In-Kind Compensation",
    desc: "Products, services, or experiences provided instead of cash. Common in college NIL deals.",
    examples: ["Free vehicles for appearances", "Free products for social posts", "Travel and accommodations for events"]
  }
];

const CONTRACT_CLAUSES = [
  { clause: "Morality Clause", risk: "HIGH", desc: "Allows brand to terminate contract if athlete engages in conduct deemed harmful to brand reputation. Broad language can be weaponized. Negotiate specific triggers only." },
  { clause: "Exclusivity Clause", risk: "HIGH", desc: "Prevents athlete from working with competing brands. Category exclusivity (no other footwear brands) vs. total exclusivity. Negotiate narrow category definitions." },
  { clause: "Approval Rights", risk: "MEDIUM", desc: "Brand retains right to approve all content featuring their products. Can slow down social media posting. Negotiate 48-hour approval windows." },
  { clause: "Likeness Rights", risk: "HIGH", desc: "Defines how brand can use athlete's name, image, and likeness. Ensure time limits, geographic limits, and specific use cases are defined." },
  { clause: "Termination Clause", risk: "MEDIUM", desc: "Conditions under which either party can end the contract. Negotiate mutual termination rights and notice periods (30-90 days)." },
  { clause: "Assignment Clause", risk: "MEDIUM", desc: "Whether the contract can be transferred if the brand is acquired. Negotiate right to terminate if brand is sold to a competitor." },
  { clause: "Indemnification", risk: "HIGH", desc: "Who is responsible if the deal causes legal problems. Ensure mutual indemnification — brand should cover product liability claims." },
  { clause: "Governing Law", risk: "LOW", desc: "Which state's laws govern the contract. Negotiate for your home state or a favorable jurisdiction." }
];

const BRAND_VALUATION_FACTORS = [
  { factor: "Social Media Following", weight: "25%", desc: "Total followers across TikTok, Twitter/X, YouTube. Engagement rate matters more than raw numbers." },
  { factor: "Athletic Performance", weight: "30%", desc: "Current performance level, awards, championships, draft status, and trajectory. Elite performance commands premium rates." },
  { factor: "Market Demographics", weight: "15%", desc: "Age, gender, geographic reach of your fanbase. Brands pay premium for athletes who reach their target demographic." },
  { factor: "Media Coverage", weight: "10%", desc: "TV appearances, press mentions, viral moments. National media exposure dramatically increases brand value." },
  { factor: "Character & Values", weight: "10%", desc: "Community involvement, philanthropic work, personal brand alignment with company values." },
  { factor: "Sport Popularity", weight: "10%", desc: "Revenue and viewership of your sport. NFL/NBA athletes command higher rates than niche sports." }
];

const NIL_COLLECTIVE_RULES = [
  "Collectives are third-party organizations that pool booster money to pay athletes for NIL activities",
  "NCAA allows collectives but prohibits pay-for-play arrangements — compensation must be for legitimate NIL activities",
  "Athletes must disclose NIL deals to their institution per NCAA rules",
  "Collective deals must involve actual NIL activities (appearances, social posts, autographs) — not just payments",
  "Tax implications: collective payments are taxable income, not gifts",
  "Booster involvement in recruiting through collectives remains a gray area — evolving NCAA guidance",
  "House v. NCAA settlement (2024): schools can now directly share revenue with athletes — changes collective landscape",
  "Revenue sharing cap: $20.5M per school per year starting 2025-26 under House settlement"
];

export default function EndorsementDeals() {
  const [activeTab, setActiveTab] = useState("overview");
  const [expandedDeal, setExpandedDeal] = useState<number | null>(null);
  const [expandedClause, setExpandedClause] = useState<number | null>(null);
  const [expandedComponent, setExpandedComponent] = useState<number | null>(null);

  const tabs = [
    { id: "overview", label: "Deal Types", icon: "💰" },
    { id: "structure", label: "Deal Structure", icon: "📋" },
    { id: "contracts", label: "Contract Clauses", icon: "⚖️" },
    { id: "valuation", label: "Brand Value", icon: "📊" },
    { id: "nil-collectives", label: "NIL Collectives", icon: "🏫" }
  ];

  return (
    <PlatformLayout>
      <div className="min-h-screen bg-[#0a0f1e] text-white pb-20">
        {/* Hero */}
        <div className="relative overflow-hidden bg-gradient-to-br from-[#0a0f1e] via-[#0d1b3e] to-[#0a0f1e] border-b border-blue-900/40 px-4 py-10">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(30,144,255,0.12),transparent_60%)]" />
          <div className="max-w-4xl mx-auto relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#1E90FF] to-[#4169E1] flex items-center justify-center text-2xl shadow-lg shadow-blue-500/30">
                🤝
              </div>
              <div>
                <div className="text-xs font-bold text-[#1E90FF] tracking-widest uppercase mb-1">AthlynX Brand OS</div>
                <h1 className="text-3xl font-black text-white">Endorsement Deals</h1>
              </div>
            </div>
            <p className="text-blue-200 text-lg mb-6 max-w-2xl">
              The complete brand partnership platform. Understand deal structures, negotiate contract clauses, calculate your brand value, and navigate NIL collective rules — from your first $500 deal to a $500M Nike contract.
            </p>
            <div className="flex flex-wrap gap-3">
              <div className="bg-[#1E90FF]/10 border border-[#1E90FF]/30 rounded-xl px-4 py-2 text-sm text-blue-200">
                <span className="text-[#1E90FF] font-bold">8 deal categories</span>
              </div>
              <div className="bg-[#1E90FF]/10 border border-[#1E90FF]/30 rounded-xl px-4 py-2 text-sm text-blue-200">
                <span className="text-[#1E90FF] font-bold">NIL compliant</span>
              </div>
              <div className="bg-[#1E90FF]/10 border border-[#1E90FF]/30 rounded-xl px-4 py-2 text-sm text-blue-200">
                <span className="text-[#1E90FF] font-bold">Contract templates</span>
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

          {/* DEAL TYPES TAB */}
          {activeTab === "overview" && (
            <div className="space-y-4">
              <h2 className="text-xl font-black text-white">Endorsement Deal Categories</h2>
              <div className="grid gap-4">
                {DEAL_TYPES.map((deal, i) => (
                  <div key={i} className="bg-gradient-to-br from-[#0d1b3e] to-[#0a0f1e] border border-blue-900/40 rounded-2xl p-5">
                    <div className="flex items-start gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#1E90FF]/20 to-[#4169E1]/20 border border-[#1E90FF]/30 flex items-center justify-center text-2xl flex-shrink-0">
                        {deal.icon}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between gap-2 flex-wrap">
                          <h3 className="text-white font-black">{deal.type}</h3>
                          <span className="text-[#1E90FF] font-bold text-sm">{deal.avg_value}</span>
                        </div>
                        <p className="text-blue-300 text-xs mt-1">{deal.examples}</p>
                        <p className="text-blue-200 text-sm mt-2"><span className="text-blue-400 font-bold">Key Terms: </span>{deal.key_terms}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* DEAL STRUCTURE TAB */}
          {activeTab === "structure" && (
            <div className="space-y-4">
              <div>
                <h2 className="text-xl font-black text-white mb-1">How Endorsement Deals Are Structured</h2>
                <p className="text-blue-300 text-sm">Most endorsement deals combine multiple compensation components. Understanding each one is critical to maximizing your total deal value.</p>
              </div>
              {NIL_DEAL_STRUCTURE.map((comp, i) => (
                <div key={i} className="bg-gradient-to-br from-[#0d1b3e] to-[#0a0f1e] border border-blue-900/40 rounded-2xl overflow-hidden">
                  <button
                    onClick={() => setExpandedComponent(expandedComponent === i ? null : i)}
                    className="w-full flex items-center justify-between p-5 text-left"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#1E90FF]/20 border border-[#1E90FF]/30 flex items-center justify-center">
                        <DollarSign className="w-5 h-5 text-[#1E90FF]" />
                      </div>
                      <h3 className="text-white font-black">{comp.component}</h3>
                    </div>
                    {expandedComponent === i ? <ChevronUp className="w-5 h-5 text-blue-400" /> : <ChevronDown className="w-5 h-5 text-blue-400" />}
                  </button>
                  {expandedComponent === i && (
                    <div className="px-5 pb-5 border-t border-blue-900/30 pt-3">
                      <p className="text-blue-200 text-sm mb-3">{comp.desc}</p>
                      <div className="text-xs font-bold text-[#1E90FF] mb-2">EXAMPLES:</div>
                      {comp.examples.map((ex, j) => (
                        <div key={j} className="flex items-center gap-2 mb-1">
                          <ArrowRight className="w-3 h-3 text-[#1E90FF] flex-shrink-0" />
                          <span className="text-blue-200 text-sm">{ex}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* CONTRACT CLAUSES TAB */}
          {activeTab === "contracts" && (
            <div className="space-y-4">
              <div>
                <h2 className="text-xl font-black text-white mb-1">Critical Contract Clauses</h2>
                <p className="text-blue-300 text-sm">These clauses can make or break your deal. Never sign without understanding every one of them.</p>
              </div>
              {CONTRACT_CLAUSES.map((clause, i) => (
                <div key={i} className="bg-gradient-to-br from-[#0d1b3e] to-[#0a0f1e] border border-blue-900/40 rounded-2xl overflow-hidden">
                  <button
                    onClick={() => setExpandedClause(expandedClause === i ? null : i)}
                    className="w-full flex items-center justify-between p-5 text-left"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#1E90FF]/20 border border-[#1E90FF]/30 flex items-center justify-center">
                        <FileText className="w-5 h-5 text-[#1E90FF]" />
                      </div>
                      <div>
                        <h3 className="text-white font-black">{clause.clause}</h3>
                        <span className={`text-xs font-black px-2 py-0.5 rounded ${
                          clause.risk === "HIGH" ? "bg-red-500/20 text-red-400" :
                          clause.risk === "MEDIUM" ? "bg-blue-500/20 text-blue-400" :
                          "bg-green-500/20 text-green-400"
                        }`}>RISK: {clause.risk}</span>
                      </div>
                    </div>
                    {expandedClause === i ? <ChevronUp className="w-5 h-5 text-blue-400" /> : <ChevronDown className="w-5 h-5 text-blue-400" />}
                  </button>
                  {expandedClause === i && (
                    <div className="px-5 pb-5 border-t border-blue-900/30 pt-3">
                      <p className="text-blue-200 text-sm">{clause.desc}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* BRAND VALUATION TAB */}
          {activeTab === "valuation" && (
            <div className="space-y-4">
              <div>
                <h2 className="text-xl font-black text-white mb-1">How Brands Value Athletes</h2>
                <p className="text-blue-300 text-sm">Understanding how brands calculate your value helps you negotiate from a position of knowledge.</p>
              </div>
              {BRAND_VALUATION_FACTORS.map((factor, i) => (
                <div key={i} className="bg-gradient-to-br from-[#0d1b3e] to-[#0a0f1e] border border-blue-900/40 rounded-xl p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-white font-black">{factor.factor}</h3>
                        <span className="text-[#1E90FF] font-black text-sm bg-[#1E90FF]/10 px-2 py-0.5 rounded">{factor.weight}</span>
                      </div>
                      <p className="text-blue-200 text-sm">{factor.desc}</p>
                    </div>
                  </div>
                  <div className="mt-3 bg-[#0a0f1e] rounded-lg h-2">
                    <div className="bg-gradient-to-r from-[#1E90FF] to-[#4169E1] h-2 rounded-lg" style={{ width: factor.weight }} />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* NIL COLLECTIVES TAB */}
          {activeTab === "nil-collectives" && (
            <div className="space-y-4">
              <div>
                <h2 className="text-xl font-black text-white mb-1">NIL Collectives — Rules & Reality</h2>
                <p className="text-blue-300 text-sm">NIL collectives have transformed college athletics. Here's what athletes and coaches need to know.</p>
              </div>
              <div className="bg-gradient-to-br from-[#1E90FF]/10 to-[#4169E1]/10 border border-[#1E90FF]/30 rounded-2xl p-5">
                <h3 className="text-white font-bold mb-3">House v. NCAA Settlement (2024)</h3>
                <p className="text-blue-200 text-sm">The landmark settlement allows schools to directly share up to $20.5M per year with athletes starting in the 2025-26 academic year. This fundamentally changes the NIL landscape — schools can now pay athletes directly, reducing reliance on collectives.</p>
              </div>
              <div className="space-y-3">
                {NIL_COLLECTIVE_RULES.map((rule, i) => (
                  <div key={i} className="bg-gradient-to-br from-[#0d1b3e] to-[#0a0f1e] border border-blue-900/40 rounded-xl p-4 flex items-start gap-3">
                    <div className="w-6 h-6 rounded bg-[#1E90FF]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-[#1E90FF] text-xs font-bold">{i + 1}</span>
                    </div>
                    <p className="text-blue-200 text-sm">{rule}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* CTA */}
          <div className="bg-gradient-to-r from-[#1E90FF]/10 to-[#4169E1]/10 border border-[#1E90FF]/30 rounded-2xl p-6 text-center">
            <div className="text-2xl mb-2">🤝</div>
            <h3 className="text-white font-black text-xl mb-2">Turn Your Name Into an Empire</h3>
            <p className="text-blue-200 text-sm mb-4">AthlynX connects athletes with brands, structures deals, and ensures every contract protects your legacy.</p>
            <button className="bg-gradient-to-r from-[#1E90FF] to-[#4169E1] text-white font-black px-8 py-3 rounded-xl hover:opacity-90 transition-opacity">
              Browse Brand Deals
            </button>
            <div className="text-xs text-blue-400 mt-3 italic">AthlynX. The Athlete's Playbook. BE THE LEGACY.</div>
          </div>
        </div>
      </div>
    </PlatformLayout>
  );
}
