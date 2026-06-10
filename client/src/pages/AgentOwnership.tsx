/**
 * ============================================================
 * AthlynXAI — AGENT OWNERSHIP & SECURITY COMMAND CENTER
 * ============================================================
 * ALL AI agents, code, algorithms, and digital infrastructure
 * are the exclusive intellectual property of:
 *
 *   AthlynXAI Corporation — A Dozier Holdings Group Company
 *   19039 Cloyanna Ln, Humble, TX 77346
 *   Governing Law: State of Texas
 *
 * MASTER ADMIN: Chad A. Dozier Sr.
 * Every agent is linked to a human identity.
 * Kill switches are active and ready at all times.
 * © 2026 AthlynXAI Corporation. All Rights Reserved.
 * ============================================================
 */
import { RouteErrorBoundary } from "@/components/GlobalErrorBoundary";
import PlatformLayout from "@/components/PlatformLayout";
import MobileBottomNav from "@/components/MobileBottomNav";
import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { Link } from "wouter";
import { toast } from "sonner";
import {
  Shield, Lock, AlertTriangle, CheckCircle2,
  User, Key, Globe, Brain, XCircle, Power, RefreshCw,
  Building2, Crown
} from "lucide-react";

const AGENTS = [
  {
    id: "manus-ai",
    name: "AthlynXAI Agent",
    role: "Primary Autonomous Builder (Builds 1–3)",
    humanOwner: "Chad A. Dozier Sr.",
    humanEmail: "contact@athlynx.ai",
    humanPhone: "Book a call",
    status: "active",
    purpose: "Full-stack platform builder — builds, deploys, manages, and evolves AthlynX 24/7. All code produced is AthlynXAI Corporation IP.",
    layer: "Layer 5 — Orchestration",
    permissions: ["Read/Write GitHub", "Deploy Vercel", "Update Neon DB", "Send Emails", "Post Social"],
    ipOwner: "AthlynXAI Corporation",
    ipNote: "All code, logic, and outputs are company property under Texas IP law.",
    killSwitch: "Revoke AthlynXAI API access via manus.im/settings",
    killable: true,
    icon: "🤖",
    color: "from-cyan-600 to-blue-600",
    securityLevel: "HIGH",
  },
  {
    id: "perplexity-computer",
    name: "Perplexity Computer",
    role: "Primary Autonomous Builder (Build 4+)",
    humanOwner: "Chad A. Dozier Sr.",
    humanEmail: "contact@athlynx.ai",
    humanPhone: "Book a call",
    status: "active",
    purpose: "Full-stack builder for Build 4 forward — Layer Cake, Realty, CRM Hub, Tiered Billing, Mind Map, Quantum. All code produced is AthlynXAI Corporation IP.",
    layer: "Layer 5 — Orchestration",
    permissions: ["Read/Write GitHub", "Deploy Vercel", "Update Neon DB", "Send Emails", "Post Social"],
    ipOwner: "AthlynXAI Corporation",
    ipNote: "All code, logic, and outputs are company property under Texas IP law.",
    killSwitch: "Revoke Perplexity Computer access via perplexity.ai account settings",
    killable: true,
    icon: "\uD83E\uDDE0",
    color: "from-amber-500 to-yellow-600",
    securityLevel: "HIGH",
  },
  {
    id: "gemini-ai",
    name: "Private Intelligence Engine",
    role: "Primary Sports Intelligence Engine",
    humanOwner: "Chad A. Dozier Sr.",
    humanEmail: "contact@athlynx.ai",
    humanPhone: "Book a call",
    status: "active",
    purpose: "Real-time NIL analysis, X-Factor scoring, recruiting intelligence, scouting reports, and content generation.",
    layer: "Layer 1 — Intelligence",
    permissions: ["Read athlete data", "Generate AI responses", "Score athletes", "Analyze performance"],
    ipOwner: "AthlynXAI Corporation (via API license)",
    ipNote: "Outputs and derived data are AthlynXAI IP. Google retains model ownership.",
    killSwitch: "Rotate/delete GEMINI_API_KEY in Vercel environment variables",
    killable: true,
    icon: "🧠",
    color: "from-blue-500 to-cyan-500",
    securityLevel: "HIGH",
  },
  {
    id: "claude-ai",
    name: "Private Reasoning Engine",
    role: "Deep Reasoning & Legal Engine",
    humanOwner: "Chad A. Dozier Sr.",
    humanEmail: "contact@athlynx.ai",
    humanPhone: "Book a call",
    status: "active",
    purpose: "Contract analysis, NIL deal valuation, legal guidance, academic planning, and complex reasoning tasks.",
    layer: "Layer 2 — Reasoning",
    permissions: ["Read contracts", "Analyze documents", "Legal reasoning", "Academic guidance"],
    ipOwner: "AthlynXAI Corporation (via API license)",
    ipNote: "All analysis outputs are AthlynXAI IP. Anthropic retains model ownership.",
    killSwitch: "Rotate/delete ANTHROPIC_API_KEY in Vercel environment variables",
    killable: true,
    icon: "⚖️",
    color: "from-orange-500 to-red-500",
    securityLevel: "HIGH",
  },
  {
    id: "nebius-ai",
    name: "Private Fallback Engine",
    role: "Always-On GPU Fallback Engine",
    humanOwner: "Chad A. Dozier Sr.",
    humanEmail: "contact@athlynx.ai",
    humanPhone: "Book a call",
    status: "active",
    purpose: "Private compute fallback for platform continuity.",
    layer: "Layer 3 — Redundancy",
    permissions: ["Generate AI responses", "Fallback processing", "Load balancing"],
    ipOwner: "AthlynXAI Corporation (via API license)",
    ipNote: "Fallback outputs are AthlynXAI IP. Nebius retains infrastructure ownership.",
    killSwitch: "Rotate/delete NEBIUS_API_KEY in Vercel environment variables",
    killable: true,
    icon: "🖥️",
    color: "from-green-500 to-emerald-500",
    securityLevel: "MEDIUM",
  },
  {
    id: "openai",
    name: "OpenAI GPT-4o",
    role: "Generative Content Engine",
    humanOwner: "Chad A. Dozier Sr.",
    humanEmail: "contact@athlynx.ai",
    humanPhone: "Book a call",
    status: "active",
    purpose: "Content generation, social media captions, brand pitch decks, athlete bio writing, and creative copy.",
    layer: "Layer 4 — Content",
    permissions: ["Generate content", "Write copy", "Create captions", "Draft pitches"],
    ipOwner: "AthlynXAI Corporation (via API license)",
    ipNote: "All generated content is AthlynXAI IP. OpenAI retains model ownership.",
    killSwitch: "Rotate/delete OPENAI_API_KEY in Vercel environment variables",
    killable: true,
    icon: "✨",
    color: "from-purple-500 to-violet-500",
    securityLevel: "MEDIUM",
  },
];

const B2B_CONNECTIONS = [
  { name: "Vercel", purpose: "Production hosting & deployment pipeline", status: "active", dataAccess: "Full codebase, env vars, deployment logs", owner: "contact@athlynx.ai", secured: true, securityNote: "Team: AthlynXChad. DNS: athlynx.ai → Vercel only. Never Cloudflare.", killSwitch: "Revoke GitHub integration in Vercel dashboard", icon: "▲" },
  { name: "Protected Source Control", purpose: "Source code repository & version control", status: "active", dataAccess: "Full source code read/write", owner: "contact@athlynx.ai", secured: true, securityNote: "Repository details are confidential company IP.", killSwitch: "Revoke OAuth tokens in GitHub org settings", icon: "⬡" },
  { name: "Neon PostgreSQL", purpose: "Live production database", status: "active", dataAccess: "Full athlete data, user records, transactions", owner: "contact@athlynx.ai", secured: true, securityNote: "Project: empty-lake-01820888. Connection string in Vercel env vars only.", killSwitch: "Rotate DATABASE_URL in Vercel env vars & Neon dashboard", icon: "🗄️" },
  { name: "Stripe", purpose: "Payment processing & subscription billing", status: "active", dataAccess: "Payment intents, subscriptions, customer data", owner: "contact@athlynx.ai", secured: true, securityNote: "Payment account and webhook details are confidential.", killSwitch: "Rotate STRIPE_SECRET_KEY & STRIPE_WEBHOOK_SECRET in Vercel", icon: "💳" },
  { name: "Supabase", purpose: "Real-time messaging & auth layer", status: "active", dataAccess: "E2EE messenger data, real-time channels", owner: "contact@athlynx.ai", secured: true, securityNote: "AES-256-GCM E2EE on all messages. Keys stored in Vercel env vars.", killSwitch: "Rotate SUPABASE_URL & SUPABASE_KEY in Vercel env vars", icon: "⚡" },
  { name: "AWS SES + SNS", purpose: "Transactional email & SMS notifications", status: "active", dataAccess: "Send emails/SMS on behalf of athlynx.ai", owner: "contact@athlynx.ai", secured: true, securityNote: "IAM user with SES/SNS-only permissions. Toll-free: +18664502081. Keys in Vercel env vars.", killSwitch: "Deactivate IAM user in AWS Console", icon: "📧" },
  { name: "Private Automation Rail", purpose: "Workflow automation — 14+ connected apps", status: "active", dataAccess: "Trigger/Action only — no persistent data storage", owner: "contact@athlynx.ai", secured: true, securityNote: "Webhook-based only. No credentials stored in Private Automation Rail.", killSwitch: "Disable Zaps in Private Automation Rail dashboard", icon: "⚡" },
  { name: "Jotform", purpose: "Waitlist & lead capture forms", status: "active", dataAccess: "Form submissions, email addresses", owner: "contact@athlynx.ai", secured: true, securityNote: "Data flows to Neon DB via webhook. No PII stored in Jotform long-term.", killSwitch: "Disable webhook in Jotform form settings", icon: "📋" },
];

const IP_ASSETS = [
  { name: "AthlynX Platform Codebase", type: "Software / Copyright", owner: "AthlynXAI Corporation", registered: "GitHub: Protected private repository", law: "Texas Trade Secret & Copyright Law" },
  { name: "X-Factor Scoring Algorithm", type: "Algorithm / Trade Secret", owner: "AthlynXAI Corporation", registered: "Proprietary — not publicly disclosed", law: "Texas Uniform Trade Secrets Act" },
  { name: "EPX (Explosive Play Rating) System", type: "Algorithm / Trade Secret", owner: "AthlynXAI Corporation", registered: "Proprietary — not publicly disclosed", law: "Texas Uniform Trade Secrets Act" },
  { name: "NIL Valuation Engine", type: "Software / Algorithm", owner: "AthlynXAI Corporation", registered: "Embedded in platform codebase", law: "Texas Trade Secret & Copyright Law" },
  { name: "Athlete AI Scouting Prompts", type: "Trade Secret / Prompt Engineering", owner: "AthlynXAI Corporation", registered: "Proprietary system prompts", law: "Texas Uniform Trade Secrets Act" },
  { name: "AthlynX Brand & Trademarks", type: "Trademark", owner: "AthlynXAI Corporation", registered: "USPTO filing in progress", law: "Federal Trademark Law (Lanham Act)" },
  { name: "Platform Database Schema", type: "Software / Database", owner: "AthlynXAI Corporation", registered: "Neon DB: empty-lake-01820888", law: "Texas Trade Secret & Copyright Law" },
  { name: "E2EE Messenger Implementation", type: "Software / Security", owner: "AthlynXAI Corporation", registered: "AES-256-GCM implementation", law: "Texas Trade Secret & Copyright Law" },
];

const SECURITY_RULES = [
  { rule: "Bangladesh IP Alert", detail: "Any login or API call from Bangladesh IP ranges triggers immediate admin alert and temporary block.", severity: "CRITICAL" },
  { rule: "Single Admin Rule", detail: "Chad A. Dozier Sr. (contact@athlynx.ai) is the ONLY admin in the platform database. No other user may have admin role.", severity: "CRITICAL" },
  { rule: "No Hardcoded Secrets", detail: "All API keys must be stored in Vercel environment variables only. Never in source code. Gemini key rotation completed S34.", severity: "CRITICAL" },
  { rule: "Kill-Switch Protocol", detail: "Any agent can be disabled within 60 seconds by rotating its API key in Vercel environment variables.", severity: "HIGH" },
  { rule: "DNS Lock", detail: "athlynx.ai DNS is managed by Vercel only. Cloudflare must never be used as DNS provider.", severity: "HIGH" },
  { rule: "Stripe Account Lock", detail: "Only the approved production payment account is authorized.", severity: "CRITICAL" },
  { rule: "Code Ownership Stamp", detail: "All code commits must use AthlyXAI org credentials. All outputs are AthlynXAI Corporation IP under Texas law.", severity: "HIGH" },
  { rule: "Deploy Pipeline", detail: "AthlynXAI → GitHub (Protected private repository) → Vercel. No other deploy path is authorized.", severity: "HIGH" },
];

function AgentOwnershipInner() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<"agents" | "b2b" | "ip" | "security">("agents");
  const [killedAgents, setKilledAgents] = useState<Set<string>>(new Set());
  const isAdmin = (user as any)?.role === "admin";

  const handleKillSwitch = (agentId: string, agentName: string) => {
    setKilledAgents(prev => new Set(Array.from(prev).concat(agentId)));
    toast.error(`🔴 KILL SWITCH ACTIVATED: ${agentName} flagged for shutdown. Rotate the API key in Vercel to complete.`, { duration: 6000 });
  };

  const handleReactivate = (agentId: string, agentName: string) => {
    setKilledAgents(prev => { const s = new Set(prev); s.delete(agentId); return s; });
    toast.success(`✅ ${agentName} reactivated. Verify API key is valid in Vercel.`, { duration: 4000 });
  };

  if (!isAdmin) {
    return (
      <PlatformLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
          <div className="text-5xl mb-4">🔒</div>
          <h2 className="text-2xl font-black text-white mb-2">RESTRICTED ACCESS</h2>
          <p className="text-blue-300 text-sm max-w-sm">This page is restricted to Chad A. Dozier Sr. — Master Admin only.</p>
          <Link href="/feed" className="mt-6 bg-blue-700 hover:bg-blue-600 text-white font-bold px-6 py-2 rounded-xl transition-colors">Return to Platform</Link>
        </div>
        <MobileBottomNav />
      </PlatformLayout>
    );
  }

  return (
    <PlatformLayout title="Agent Ownership & Security">
      <div className="max-w-5xl mx-auto px-2 py-4 space-y-5 pb-24">

        {/* Header */}
        <div className="bg-gradient-to-r from-[#0a1628] to-[#1a3a8f] border border-red-700/40 rounded-2xl p-6">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 bg-red-600/20 border border-red-500/40 rounded-2xl flex items-center justify-center shrink-0">
              <Shield className="w-7 h-7 text-red-400" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <span className="text-red-400 text-xs font-black uppercase tracking-widest">CLASSIFIED — ADMIN ONLY</span>
                <span className="bg-red-600 text-white text-[9px] font-black px-2 py-0.5 rounded-full">MASTER ADMIN</span>
              </div>
              <h1 className="text-xl font-black text-white mb-1">Agent Ownership & Security Command Center</h1>
              <p className="text-blue-300 text-sm">All AI agents, code, and B2B connections are property of <strong className="text-white">AthlynXAI Corporation</strong>. Every agent is linked to a human identity. Kill switches are active and ready.</p>
            </div>
          </div>
          {/* Owner Identity */}
          <div className="mt-4 bg-[#0d1b3e] border border-blue-800 rounded-xl p-4 flex items-center gap-4">
            <Crown className="w-8 h-8 text-yellow-400 shrink-0" />
            <div>
              <div className="text-yellow-400 text-xs font-black uppercase tracking-wider">Master Admin — Human Identity Verified</div>
              <div className="text-white font-black text-lg">Chad A. Dozier Sr.</div>
              <div className="text-blue-300 text-xs">contact@athlynx.ai · Book a call · AthlynXAI Corporation · Houston, TX</div>
            </div>
            <div className="ml-auto text-right shrink-0">
              <div className="text-green-400 text-xs font-bold flex items-center gap-1 justify-end"><CheckCircle2 className="w-3 h-3" /> VERIFIED OWNER</div>
              <div className="text-blue-400 text-xs">Sole kill-switch authority</div>
            </div>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            <span className="bg-green-500/20 border border-green-500/30 text-green-400 text-[10px] font-black px-2 py-1 rounded-full">✅ {AGENTS.length} AI Agents Active</span>
            <span className="bg-blue-500/20 border border-blue-500/30 text-blue-400 text-[10px] font-black px-2 py-1 rounded-full">🔗 {B2B_CONNECTIONS.length} B2B Connections Secured</span>
            <span className="bg-yellow-500/20 border border-yellow-500/30 text-yellow-400 text-[10px] font-black px-2 py-1 rounded-full">⚖️ {IP_ASSETS.length} IP Assets Documented</span>
            <span className="bg-red-500/20 border border-red-500/30 text-red-400 text-[10px] font-black px-2 py-1 rounded-full">🛡️ {SECURITY_RULES.length} Security Rules Enforced</span>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          {[
            { id: "agents", label: "🤖 AI Agents" },
            { id: "b2b", label: "🔗 B2B Connections" },
            { id: "ip", label: "⚖️ IP Ownership" },
            { id: "security", label: "🛡️ Security Rules" },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-shrink-0 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                activeTab === tab.id
                  ? "bg-gradient-to-r from-cyan-600 to-blue-600 text-white"
                  : "bg-[#0d1b3e] border border-blue-800 text-blue-400 hover:border-blue-600"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* AI AGENTS */}
        {activeTab === "agents" && (
          <div className="space-y-4">
            <div className="bg-yellow-900/20 border border-yellow-700/40 rounded-xl p-3 text-xs text-yellow-300">
              <strong>IP Rule:</strong> All AI agents operate under AthlynXAI Corporation. Every agent action is logged. Chad A. Dozier Sr. is the sole human authority. All code and outputs are company property under Texas law.
            </div>
            {AGENTS.map(agent => {
              const isKilled = killedAgents.has(agent.id);
              return (
                <div key={agent.id} className={`bg-[#0d1b3e] border rounded-2xl overflow-hidden ${isKilled ? "border-red-700 opacity-70" : "border-blue-900/60"}`}>
                  <div className={`bg-gradient-to-r ${isKilled ? "from-red-900 to-gray-900" : agent.color} p-4 flex items-start justify-between`}>
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{agent.icon}</span>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-white font-black">{agent.name}</span>
                          <span className="bg-white/20 text-white text-[9px] font-black px-1.5 py-0.5 rounded-full">{agent.layer}</span>
                          <span className={`text-[9px] font-black px-1.5 py-0.5 rounded-full ${agent.securityLevel === "HIGH" ? "bg-red-700 text-white" : "bg-yellow-700 text-white"}`}>{agent.securityLevel}</span>
                        </div>
                        <div className="text-white/70 text-xs">{agent.role}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className={`text-[9px] font-black px-2 py-0.5 rounded-full ${isKilled ? "bg-red-600 text-white" : "bg-green-500/30 text-green-300 border border-green-500/30"}`}>
                        {isKilled ? "⛔ KILLED" : "● ACTIVE"}
                      </span>
                      {isKilled
                        ? <button onClick={() => handleReactivate(agent.id, agent.name)} className="flex items-center gap-1 bg-green-700 hover:bg-green-600 text-white text-[10px] font-black px-2 py-1 rounded-lg"><RefreshCw className="w-3 h-3" />Restore</button>
                        : <button onClick={() => handleKillSwitch(agent.id, agent.name)} className="flex items-center gap-1 bg-red-700 hover:bg-red-600 text-white text-[10px] font-black px-2 py-1 rounded-lg"><XCircle className="w-3 h-3" />Kill</button>
                      }
                    </div>
                  </div>
                  <div className="p-4 space-y-3">
                    <p className="text-blue-300 text-xs">{agent.purpose}</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="bg-[#060d1f] border border-blue-900/40 rounded-xl p-3">
                        <div className="flex items-center gap-1 mb-1"><User className="w-3 h-3 text-cyan-400" /><span className="text-cyan-400 text-[10px] font-black uppercase">Human Identity</span></div>
                        <div className="text-white text-sm font-bold">{agent.humanOwner}</div>
                        <div className="text-blue-400 text-xs">{agent.humanEmail}</div>
                      </div>
                      <div className="bg-[#060d1f] border border-yellow-900/30 rounded-xl p-3">
                        <div className="flex items-center gap-1 mb-1"><Key className="w-3 h-3 text-yellow-400" /><span className="text-yellow-400 text-[10px] font-black uppercase">IP Owner</span></div>
                        <div className="text-white text-sm font-bold">{agent.ipOwner}</div>
                        <div className="text-blue-400 text-xs">{agent.ipNote}</div>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {agent.permissions.map((p, i) => (
                        <span key={i} className="text-[10px] bg-blue-900/50 text-blue-300 px-2 py-0.5 rounded-full border border-blue-800/50">{p}</span>
                      ))}
                    </div>
                    <div className="bg-red-950/30 border border-red-900/40 rounded-xl p-3 flex items-start gap-2">
                      <Power className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                      <div>
                        <div className="text-red-400 text-[10px] font-black uppercase mb-0.5">Kill Switch</div>
                        <div className="text-blue-300 text-xs">{agent.killSwitch}</div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* B2B CONNECTIONS */}
        {activeTab === "b2b" && (
          <div className="space-y-3">
            <div className="bg-blue-900/20 border border-blue-700/40 rounded-xl p-3 text-xs text-blue-300">
              <strong>Security Rule:</strong> All B2B connections use API keys stored in Vercel environment variables only. No keys in codebase. All connections owned by Chad A. Dozier Sr. and revocable instantly.
            </div>
            {B2B_CONNECTIONS.map((conn, i) => (
              <div key={i} className="bg-[#0d1b3e] border border-blue-900/60 rounded-2xl p-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-blue-900/50 border border-blue-800 rounded-xl flex items-center justify-center text-xl shrink-0">{conn.icon}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="text-white font-black text-sm">{conn.name}</span>
                      <span className={`text-[9px] font-black px-2 py-0.5 rounded-full ${conn.status === "active" ? "bg-green-700 text-white" : "bg-yellow-700 text-white"}`}>{conn.status.toUpperCase()}</span>
                      <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-blue-900 text-cyan-300 flex items-center gap-1"><Lock className="w-2 h-2" />SECURED</span>
                    </div>
                    <div className="text-blue-300 text-sm mb-1">{conn.purpose}</div>
                    <div className="text-blue-500 text-xs mb-2">Data Access: {conn.dataAccess}</div>
                    <div className="bg-[#060d1f] border border-blue-900/40 rounded-lg p-2 mb-2">
                      <div className="text-cyan-400 text-[10px] font-bold mb-0.5">Security Note</div>
                      <div className="text-blue-300 text-xs">{conn.securityNote}</div>
                    </div>
                    <div className="bg-red-950/30 border border-red-900/40 rounded-lg p-2 flex items-center gap-2">
                      <Power className="w-3 h-3 text-red-400 shrink-0" />
                      <div><span className="text-red-400 text-xs font-bold">Kill Switch: </span><span className="text-blue-300 text-xs">{conn.killSwitch}</span></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* IP OWNERSHIP */}
        {activeTab === "ip" && (
          <div className="space-y-4">
            <div className="bg-gradient-to-r from-yellow-950/40 to-[#0d1b3e] border border-yellow-700/40 rounded-2xl p-5">
              <div className="flex items-center gap-3 mb-2">
                <Building2 className="w-6 h-6 text-yellow-400" />
                <div>
                  <div className="text-yellow-400 text-xs font-black uppercase tracking-wider">Legal IP Declaration</div>
                  <div className="text-white font-black text-lg">AthlynXAI Corporation</div>
                </div>
              </div>
              <p className="text-blue-300 text-sm leading-relaxed">
                All intellectual property listed below is the exclusive property of <strong className="text-white">AthlynXAI Corporation</strong>, a Dozier Holdings Group company.
                Unauthorized use, reproduction, or distribution is prohibited under Texas state law and applicable federal law.
                Governing Law: <strong className="text-white">State of Texas</strong>.
              </p>
            </div>
            {IP_ASSETS.map((asset, i) => (
              <div key={i} className="bg-[#0d1b3e] border border-blue-900/60 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-yellow-900/30 border border-yellow-700/30 rounded-lg flex items-center justify-center shrink-0">
                    <Key className="w-4 h-4 text-yellow-400" />
                  </div>
                  <div className="flex-1">
                    <div className="text-white font-black text-sm mb-1">{asset.name}</div>
                    <div className="flex flex-wrap gap-2 mb-2">
                      <span className="text-[10px] bg-blue-900/50 text-blue-300 px-2 py-0.5 rounded-full border border-blue-800/50">{asset.type}</span>
                      <span className="text-[10px] bg-yellow-900/30 text-yellow-400 px-2 py-0.5 rounded-full border border-yellow-800/30">{asset.owner}</span>
                    </div>
                    <div className="text-blue-400 text-xs mb-1">Registration: {asset.registered}</div>
                    <div className="text-cyan-400 text-xs font-semibold">{asset.law}</div>
                  </div>
                </div>
              </div>
            ))}
            <div className="bg-[#060d1f] border border-blue-900/40 rounded-xl p-4 text-center">
              <div className="text-blue-400 text-xs">© 2026 AthlynXAI Corporation · A Dozier Holdings Group Company · All Rights Reserved</div>
              <div className="text-blue-600 text-xs mt-1">19039 Cloyanna Ln, Humble, TX 77346 · contact@athlynx.ai · Book a call</div>
            </div>
          </div>
        )}

        {/* SECURITY RULES */}
        {activeTab === "security" && (
          <div className="space-y-4">
            <div className="text-blue-400 text-xs font-bold uppercase tracking-wider mb-2">
              {SECURITY_RULES.length} Active Security Rules — Enforced Platform-Wide
            </div>
            {SECURITY_RULES.map((rule, i) => (
              <div key={i} className={`bg-[#0d1b3e] border rounded-xl p-4 ${rule.severity === "CRITICAL" ? "border-red-700/50" : "border-yellow-700/40"}`}>
                <div className="flex items-start gap-3">
                  <AlertTriangle className={`w-5 h-5 shrink-0 mt-0.5 ${rule.severity === "CRITICAL" ? "text-red-400" : "text-yellow-400"}`} />
                  <div>
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="text-white font-black text-sm">{rule.rule}</span>
                      <span className={`text-[9px] font-black px-2 py-0.5 rounded-full ${rule.severity === "CRITICAL" ? "bg-red-700 text-white" : "bg-yellow-700 text-white"}`}>{rule.severity}</span>
                    </div>
                    <div className="text-blue-300 text-xs leading-relaxed">{rule.detail}</div>
                  </div>
                </div>
              </div>
            ))}
            <div className="bg-gradient-to-r from-red-950/30 to-[#0d1b3e] border border-red-700/40 rounded-xl p-4 text-center">
              <div className="text-red-400 text-xs font-black uppercase tracking-wider mb-1">Emergency Protocol</div>
              <div className="text-white text-sm font-bold mb-1">If platform is compromised:</div>
              <div className="text-blue-300 text-xs">1. Rotate all API keys in Vercel → 2. Revoke GitHub OAuth → 3. Contact contact@athlynx.ai → 4. Escalate to Dozier Holdings Group legal team</div>
            </div>
          </div>
        )}
      </div>
      <MobileBottomNav />
    </PlatformLayout>
  );
}

export default function AgentOwnership() {
  return <RouteErrorBoundary><AgentOwnershipInner /></RouteErrorBoundary>;
}
