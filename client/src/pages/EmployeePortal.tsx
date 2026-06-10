/**
 * AthlynX Employee Portal
 * Every team member works through this page.
 * Wired to private CRM, planning, intelligence, data, and automation systems
 * Access: Admin role only
 */
import { useState } from "react";
import { RouteErrorBoundary } from "@/components/GlobalErrorBoundary";
import { Link } from "wouter";
import PlatformLayout from "@/components/PlatformLayout";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

const TEAM = [
  { name: "Chad A. Dozier Sr.", role: "Founder & CEO", email: "contact@athlynx.ai", focus: "Vision, Investors, Strategy", avatar: "C", color: "#0066ff" },
  { name: "Lee Marshall", role: "Co-Host · VP Sales & Partnerships", email: "lmarshall@athlynx.ai", focus: "Revenue, Athlete Acquisition, NIL", avatar: "L", color: "#059669" },
  { name: "Glenn Tse", role: "CFO / COO", email: "gtse@athlynx.ai", focus: "Finance, Operations, Partnerships", avatar: "G", color: "#00c2ff" },

];

const QUICK_ACTIONS = [
  { label: "Admin Dashboard", href: "/admin", icon: "⚙️", desc: "Manage users & platform" },
  { label: "CRM Command", href: "/crm-command", icon: "📊", desc: "Contacts & pipeline" },
  { label: "Broadcast", href: "/admin/broadcast", icon: "📣", desc: "Message all users" },
  { label: "NIL Portal", href: "/nil-portal", icon: "💰", desc: "Manage NIL deals" },
  { label: "Transfer Portal", href: "/transfer-portal", icon: "🔄", desc: "Athlete transfers" },
  { label: "Social Command", href: "/social-command", icon: "📱", desc: "Social media control" },
  { label: "Investor Hub", href: "/investor-hub", icon: "💎", desc: "Investor relations" },
  { label: "AI Command", href: "/wizard-hub", icon: "🤖", desc: "Gemini AI tools" },
];

const FUNNEL_STAGES = [
  { stage: "Awareness", action: "Social posts auto-published 3x/day via Buffer", status: "✅ LIVE", color: "#0066ff" },
  { stage: "Interest", action: "Home page → Sign Up CTA → 7-day free trial", status: "✅ LIVE", color: "#00c2ff" },
  { stage: "Signup", action: "Email/Google auth → Gemini enriches CRM profile", status: "✅ LIVE", color: "#7c3aed" },
  { stage: "Onboarding", action: "AI Onboarding → Role selection → Platform tour", status: "✅ LIVE", color: "#059669" },
  { stage: "Activation", action: "First NIL deal / Transfer entry / AI Trainer session", status: "✅ LIVE", color: "#d97706" },
  { stage: "Conversion", action: "Trial expires → Stripe billing → Pro/Elite upgrade", status: "✅ LIVE", color: "#dc2626" },
  { stage: "Retention", action: "Daily AI reports → Personalized recommendations", status: "✅ LIVE", color: "#0066ff" },
  { stage: "Revenue", action: "Subscriptions + NIL commissions + ConCreator B2B", status: "✅ LIVE", color: "#00c2ff" },
];

function EmployeePortalInner() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<"overview" | "team" | "funnel" | "ai">("overview");
  const [aiQuery, setAiQuery] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const [aiLoading, setAiLoading] = useState(false);

  const { data: stats } = trpc.admin.getStats.useQuery();
  const aiMutation = trpc.aiCommand.query.useMutation({
    onSuccess: (d) => { setAiResponse(d.reply); setAiLoading(false); },
    onError: () => { setAiResponse("AI temporarily unavailable. Try again."); setAiLoading(false); },
  });

  if (!user || (user as any).role !== "admin") {
    return (
      <PlatformLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
          <div className="text-5xl mb-4">🔒</div>
          <h1 className="text-2xl font-black text-white mb-2">Employee Access Only</h1>
          <p className="text-blue-400">This portal is for AthlynX team members only.</p>
          <Link href="/dashboard" className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-xl font-bold">
            Go to Dashboard
          </Link>
        </div>
      </PlatformLayout>
    );
  }

  function handleAiQuery() {
    if (!aiQuery.trim()) return;
    setAiLoading(true);
    setAiResponse("");
    aiMutation.mutate({ message: aiQuery, context: "employee_portal" });
  }

  return (
    <PlatformLayout title="Employee Portal">
      <div className="space-y-4 pb-20 lg:pb-4">

        {/* Header */}
        <div className="bg-gradient-to-r from-[#0a1628] to-[#1a3a8f] border border-blue-700 rounded-xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center text-2xl">🏢</div>
            <div>
              <h2 className="text-2xl font-black text-white">AthlynX Employee Portal</h2>
              <p className="text-blue-300 text-sm">Welcome back, {user.name ?? "Team Member"} · {(user as any).role?.toUpperCase()}</p>
            </div>
          </div>
          {/* Live Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-3">
            {[
              { label: "Total Users", value: stats?.totalUsers ?? "—", icon: "👥" },
              { label: "Active Trial", value: stats?.onTrial ?? "—", icon: "⏱️" },
              { label: "Paid Subs", value: stats?.withSubscription ?? "—", icon: "💎" },
              { label: "New This Week", value: stats?.newThisWeek ?? "—", icon: "💰" },
            ].map((s, i) => (
              <div key={i} className="bg-[#0d1b3e] rounded-xl p-3 text-center border border-blue-900">
                <div className="text-xl">{s.icon}</div>
                <div className="text-xl font-black text-white">{s.value}</div>
                <div className="text-blue-400 text-xs">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-[#1a3a8f] border border-blue-900 rounded-xl p-1">
          {(["overview", "team", "funnel", "ai"] as const).map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2 text-xs font-bold rounded-lg capitalize transition-colors ${
                activeTab === tab ? "bg-blue-600 text-white" : "text-blue-400 hover:text-white"
              }`}>
              {tab === "overview" ? "🏠 Overview" : tab === "team" ? "👥 Team" : tab === "funnel" ? "🔄 Funnel" : "🤖 AI Command"}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div className="space-y-3">
            <div className="text-blue-400 text-xs font-bold uppercase tracking-widest px-1">Quick Actions</div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {QUICK_ACTIONS.map((action, i) => (
                <Link key={i} href={action.href}
                  className="bg-[#1a3a8f] border border-blue-900 hover:border-blue-600 rounded-xl p-4 text-center transition-all hover:scale-105 block">
                  <div className="text-2xl mb-1">{action.icon}</div>
                  <div className="text-white font-bold text-sm">{action.label}</div>
                  <div className="text-blue-400 text-xs mt-0.5">{action.desc}</div>
                </Link>
              ))}
            </div>

            {/* Autonomous Systems Status */}
            <div className="bg-[#0a1628] border border-blue-900 rounded-xl p-4">
              <div className="text-white font-black mb-3">🤖 Autonomous Systems Status</div>
              <div className="space-y-2">
                {[
                  { name: "Social Media Cron", detail: "3x/day · 10 channels · 600 unique posts", status: "LIVE" },
                  { name: "Gemini CRM Enrichment", detail: "Auto-enriches every new signup", status: "LIVE" },
                  { name: "AWS SES Email", detail: "Welcome + trial + owner alerts", status: "LIVE" },
                  { name: "Stripe Billing", detail: "Auto-charges + payouts", status: "LIVE" },
                  { name: "Protected Data Layer", detail: "Private schema · protected operations", status: "LIVE" },
                  { name: "Vercel CI/CD", detail: "Auto-deploys on every GitHub push", status: "LIVE" },
                  { name: "Automation Workflows", detail: "Approved internal workflow tools", status: "LIVE" },
                  { name: "AWS SNS SMS", detail: "Toll-free number · carrier approval pending", status: "PENDING" },
                ].map((sys, i) => (
                  <div key={i} className="flex items-center justify-between py-2 border-b border-blue-900/40">
                    <div>
                      <div className="text-white text-sm font-semibold">{sys.name}</div>
                      <div className="text-blue-400 text-xs">{sys.detail}</div>
                    </div>
                    <span className={`text-xs font-black px-2 py-0.5 rounded-full ${
                      sys.status === "LIVE" ? "bg-green-900/40 text-green-400 border border-green-700" : "bg-blue-900/40 text-sky-400 border border-blue-700"
                    }`}>{sys.status}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Team Tab */}
        {activeTab === "team" && (
          <div className="space-y-3">
            <div className="text-blue-400 text-xs font-bold uppercase tracking-widest px-1">Core Team — All Work Through This Platform</div>
            {TEAM.map((member, i) => (
              <div key={i} className="bg-[#1a3a8f] border border-blue-900 rounded-xl p-4 flex items-start gap-4">
                <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-black text-lg flex-shrink-0"
                  style={{ background: member.color }}>
                  {member.avatar}
                </div>
                <div className="flex-1">
                  <div className="text-white font-black">{member.name}</div>
                  <div className="text-blue-300 text-sm font-semibold">{member.role}</div>
                  <div className="text-blue-400 text-xs mt-1">{member.focus}</div>
                  <div className="text-blue-500 text-xs mt-1">{member.email}</div>
                </div>
                <div className="flex flex-col gap-1">
                  <a href={`mailto:${member.email}`}
                    className="text-xs bg-blue-700 hover:bg-blue-600 text-white px-3 py-1 rounded-lg font-bold transition-colors">
                    Email
                  </a>
                  <Link href="/crm-command"
                    className="text-xs bg-[#0d1b3e] border border-blue-700 hover:bg-blue-900 text-blue-300 px-3 py-1 rounded-lg font-bold transition-colors text-center">
                    CRM
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Funnel Tab */}
        {activeTab === "funnel" && (
          <div className="space-y-3">
            <div className="text-blue-400 text-xs font-bold uppercase tracking-widest px-1">The Autonomous Revenue Funnel</div>
            <div className="bg-[#0a1628] border border-blue-900 rounded-xl p-4">
              <p className="text-blue-300 text-sm mb-4">Every user flows through this funnel automatically. No manual intervention required. The platform runs itself.</p>
              <div className="space-y-3">
                {FUNNEL_STAGES.map((stage, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-black flex-shrink-0"
                      style={{ background: stage.color }}>
                      {i + 1}
                    </div>
                    <div className="flex-1 border-b border-blue-900/40 pb-3">
                      <div className="flex items-center justify-between">
                        <div className="text-white font-bold text-sm">{stage.stage}</div>
                        <span className="text-xs font-bold text-green-400">{stage.status}</span>
                      </div>
                      <div className="text-blue-400 text-xs mt-0.5">{stage.action}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-gradient-to-r from-blue-900/40 to-cyan-900/40 border border-blue-700 rounded-xl p-4 text-center">
              <div className="text-white font-black text-lg">$268.14/month to run the entire platform</div>
              <div className="text-blue-300 text-sm mt-1">Every dollar above that is pure profit — distributed automatically via Stripe</div>
            </div>
          </div>
        )}

        {/* AI Command Tab */}
        {activeTab === "ai" && (
          <div className="space-y-3">
            <div className="text-blue-400 text-xs font-bold uppercase tracking-widest px-1">Gemini AI Command Center</div>
            <div className="bg-[#0a1628] border border-blue-900 rounded-xl p-4">
              <p className="text-blue-300 text-sm mb-3">Ask Gemini anything about the platform, users, NIL deals, strategy, or operations. It knows everything.</p>
              <div className="flex gap-2">
                <input
                  value={aiQuery}
                  onChange={e => setAiQuery(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && handleAiQuery()}
                  placeholder="Ask Gemini: How many users signed up today? What's our NIL pipeline? Write a proposal for CementCo..."
                  className="flex-1 bg-[#1a3a8f] border border-blue-700 text-white text-sm rounded-xl px-4 py-3 focus:outline-none focus:border-cyan-500 placeholder-blue-600"
                />
                <button onClick={handleAiQuery} disabled={aiLoading}
                  className="bg-[#00c2ff] hover:bg-[#00a8e0] text-black font-black px-5 py-3 rounded-xl transition-all disabled:opacity-50">
                  {aiLoading ? "..." : "Ask"}
                </button>
              </div>
              {aiResponse && (
                <div className="mt-3 bg-[#1a3a8f] border border-blue-700 rounded-xl p-4">
                  <div className="text-[#00c2ff] text-xs font-bold mb-2">GEMINI RESPONSE</div>
                  <div className="text-white text-sm whitespace-pre-wrap leading-relaxed">{aiResponse}</div>
                </div>
              )}
              <div className="mt-3 grid grid-cols-2 gap-2">
                {[
                  "How many users signed up this week?",
                  "What's our current MRR?",
                  "Write a NIL proposal for a football player",
                  "Generate a daily report summary",
                  "What should Lee focus on today?",
                  "Analyze our transfer portal pipeline",
                ].map((q, i) => (
                  <button key={i} onClick={() => { setAiQuery(q); }}
                    className="text-left text-xs text-blue-300 bg-[#0d1b3e] border border-blue-900 hover:border-blue-600 rounded-lg px-3 py-2 transition-colors">
                    {q}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

      </div>
    </PlatformLayout>
  );
}

export default function EmployeePortal() {
  return <RouteErrorBoundary><EmployeePortalInner /></RouteErrorBoundary>;
}
