import { useState } from "react";
import { RouteErrorBoundary } from "@/components/GlobalErrorBoundary";
import PlatformLayout from "@/components/PlatformLayout";
import MobileBottomNav from '@/components/MobileBottomNav'
import { Link, Redirect } from "wouter";
import { PushNotificationBell } from "@/components/PushNotificationBell";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import {
  Users, TrendingUp, Activity, List, LayoutGrid, Plus, Search,
  Download, RefreshCw, ChevronRight, Mail, Phone, Building2,
  Star, Clock, CheckCircle, XCircle, ArrowRight, Shield, BarChart3,
  Loader2, Trash2, Edit2, X
} from "lucide-react";

const CDN = "/athlynx-icon.png";

const PIPELINE_STAGES = ["New Lead", "Contacted", "Demo Scheduled", "Proposal Sent", "Closed Won", "Closed Lost"] as const;
const STAGE_COLORS: Record<string, string> = {
  "New Lead": "bg-blue-900/60 border-blue-700",
  "Contacted": "bg-red-900/60 border-red-700",
  "Demo Scheduled": "bg-blue-950/60 border-blue-800",
  "Proposal Sent": "bg-red-900/60 border-red-700",
  "Closed Won": "bg-green-900/60 border-green-700",
  "Closed Lost": "bg-red-900/60 border-red-700",
};
const STAGE_BADGE: Record<string, string> = {
  "New Lead": "bg-blue-800 text-blue-200",
  "Contacted": "bg-red-800 text-red-200",
  "Demo Scheduled": "bg-blue-900 text-blue-200",
  "Proposal Sent": "bg-red-800 text-red-200",
  "Closed Won": "bg-green-800 text-green-200",
  "Closed Lost": "bg-red-800 text-red-200",
};
const STATUS_BADGE: Record<string, string> = {
  Lead: "bg-blue-900 text-blue-300",
  Active: "bg-green-900 text-green-300",
  VIP: "bg-red-900 text-red-300",
  Churned: "bg-red-900 text-red-300",
};
const ROLE_BADGE: Record<string, string> = {
  Athlete: "bg-cyan-900 text-cyan-300",
  Coach: "bg-blue-950 text-blue-300",
  Brand: "bg-red-900 text-red-300",
  Agent: "bg-teal-900 text-teal-300",
  Investor: "bg-red-900 text-red-300",
  Team: "bg-indigo-900 text-indigo-300",
};

// ─── Add Contact Modal ────────────────────────────────────────────────────────
function AddContactModal({ onClose, onSuccess }: { onClose: () => void; onSuccess: () => void }) {
  const [form, setForm] = useState({ name: "", email: "", phone: "", company: "", role: "Athlete" as const, status: "Lead" as const, notes: "" });
  const createContact = trpc.crm.createContact.useMutation({
    onSuccess: () => { toast.success("Contact added"); onSuccess(); onClose(); },
    onError: (e) => toast.error(e.message),
  });
  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-[#0d1f3c] border border-white/10 rounded-2xl p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-white font-black text-lg">Add New Contact</h3>
          <button onClick={onClose} className="text-white/40 hover:text-white"><X className="w-5 h-5" /></button>
        </div>
        <div className="space-y-3">
          {[
            { key: "name", label: "Full Name *", placeholder: "John Smith" },
            { key: "email", label: "Email", placeholder: "john@example.com" },
            { key: "phone", label: "Phone", placeholder: "+1 (555) 000-0000" },
            { key: "company", label: "Company / School", placeholder: "University of Texas" },
          ].map(({ key, label, placeholder }) => (
            <div key={key}>
              <label className="text-white/60 text-xs font-semibold uppercase tracking-wide block mb-1">{label}</label>
              <input
                type="text"
                placeholder={placeholder}
                value={(form as Record<string, string>)[key]}
                onChange={(e) => setForm(f => ({ ...f, [key]: e.target.value }))}
                className="w-full bg-white/5 border border-white/10 text-white placeholder:text-white/20 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#00c2ff]/50"
              />
            </div>
          ))}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-white/60 text-xs font-semibold uppercase tracking-wide block mb-1">Role</label>
              <select value={form.role} onChange={(e) => setForm(f => ({ ...f, role: e.target.value as typeof form.role }))}
                className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#00c2ff]/50">
                {["Athlete", "Coach", "Brand", "Agent", "Investor", "Team"].map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
            <div>
              <label className="text-white/60 text-xs font-semibold uppercase tracking-wide block mb-1">Status</label>
              <select value={form.status} onChange={(e) => setForm(f => ({ ...f, status: e.target.value as typeof form.status }))}
                className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#00c2ff]/50">
                {["Lead", "Active", "VIP", "Churned"].map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="text-white/60 text-xs font-semibold uppercase tracking-wide block mb-1">Notes</label>
            <textarea
              placeholder="Any notes about this contact..."
              value={form.notes}
              onChange={(e) => setForm(f => ({ ...f, notes: e.target.value }))}
              rows={3}
              className="w-full bg-white/5 border border-white/10 text-white placeholder:text-white/20 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#00c2ff]/50 resize-none"
            />
          </div>
        </div>
        <div className="flex gap-3 mt-5">
          <button onClick={onClose} className="flex-1 py-2.5 bg-white/5 border border-white/10 text-white rounded-xl text-sm font-bold hover:bg-white/10 transition-colors">Cancel</button>
          <button
            onClick={() => { if (!form.name) { toast.error("Name is required"); return; } createContact.mutate(form); }}
            disabled={createContact.isPending}
            className="flex-1 py-2.5 bg-gradient-to-r from-[#00c2ff] to-[#0066ff] text-white rounded-xl text-sm font-black hover:from-[#00b0e8] hover:to-[#0055dd] transition-all disabled:opacity-50"
          >
            {createContact.isPending ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : "Add Contact"}
          </button>
        </div>
      </div>
      <MobileBottomNav />
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
function AdminCRMInner() {
  const { user, loading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState<"overview" | "contacts" | "pipeline" | "waitlist" | "activity" | "expiry" | "concreator">("overview");
  const [search, setSearch] = useState("");
  const [showAddContact, setShowAddContact] = useState(false);

  const utils = trpc.useUtils();
  const statsQuery = trpc.crm.stats.useQuery(undefined, { refetchInterval: 30000 });
  const contactsQuery = trpc.crm.getContacts.useQuery({ search: search || undefined, limit: 100 }, { enabled: activeTab === "contacts" });
  const pipelineQuery = trpc.crm.getPipeline.useQuery(undefined, { enabled: activeTab === "pipeline" });
  const waitlistQuery = trpc.crm.getWaitlist.useQuery({ limit: 200 }, { enabled: activeTab === "waitlist" });
  const activityQuery = trpc.crm.getActivityLog.useQuery({ limit: 100 }, { enabled: activeTab === "activity" });
  const expiryQuery = trpc.expiration.getWarnings.useQuery(undefined, { enabled: activeTab === "expiry", refetchInterval: 60000 });
  const overdueQuery = trpc.expiration.getOverdue.useQuery(undefined, { enabled: activeTab === "expiry", refetchInterval: 60000 });
  const usersQuery = trpc.crm.getUsers.useQuery({ limit: 100 }, { enabled: activeTab === "overview" });

  const deleteContact = trpc.crm.deleteContact.useMutation({
    onSuccess: () => { toast.success("Contact deleted"); utils.crm.getContacts.invalidate(); },
    onError: (e) => toast.error(e.message),
  });
  const updateStage = trpc.crm.updatePipelineStage.useMutation({
    onSuccess: () => { utils.crm.getPipeline.invalidate(); },
    onError: (e) => toast.error(e.message),
  });
  const updateUserRole = trpc.crm.updateUserRole.useMutation({
    onSuccess: () => { toast.success("Role updated"); utils.crm.getUsers.invalidate(); },
    onError: (e) => toast.error(e.message),
  });
  const testEmailMutation = trpc.admin.testEmail.useMutation({
    onSuccess: () => toast.success("✅ Test email sent to contact@athlynx.ai"),
    onError: (e) => toast.error("Email failed: " + e.message),
  });
  const testSmsMutation = trpc.admin.testSms.useMutation({
    onSuccess: () => toast.success("✅ Test SMS sent to Book a call"),
    onError: (e) => toast.error("SMS failed: " + e.message),
  });
  const revenueQuery = trpc.admin.getRevenueStats.useQuery(undefined, { enabled: activeTab === "overview", refetchInterval: 60000 });
  const sendDailyReportMutation = trpc.admin.sendDailyReport.useMutation({
    onSuccess: () => toast.success("✅ Daily report sent to contact@athlynx.ai"),
    onError: (e) => toast.error("Report failed: " + e.message),
  });

  // Loading state
  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#050c1a] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#00c2ff] animate-spin" />
      </div>
    );
  }

  // Not logged in
  if (!user) return <Redirect to="/signin" />;

  // Not admin
  if (user.role !== "admin") {
    return (
      <div className="min-h-screen bg-[#050c1a] flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <Shield className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h1 className="text-white text-2xl font-black mb-2">Admin Access Required</h1>
          <p className="text-white/50 mb-6">You need admin privileges to access the CRM dashboard. Contact Chad Dozier to request access.</p>
          <Link href="/feed">
            <button className="px-6 py-3 bg-gradient-to-r from-[#00c2ff] to-[#0066ff] text-white font-black rounded-xl">Go to Feed</button>
          </Link>
        </div>
      </div>
    );
  }

  const stats = statsQuery.data;
  const contacts = contactsQuery.data?.contacts ?? [];
  const pipeline = pipelineQuery.data ?? [];
  const waitlist = waitlistQuery.data?.entries ?? [];
  const activityEvents = activityQuery.data?.events ?? [];
  const allUsers = usersQuery.data?.users ?? [];

  // Export users as CSV (Salesforce-style)
  const exportUsersCSV = () => {
    const header = "ID,Name,Email,Sport,School,Role,Plan,Trial Ends,Credits,Joined";
    const rows = allUsers.map((u: typeof allUsers[0]) => [
      u.id, `"${u.name ?? ""}"`  , `"${u.email ?? ""}"`, `"${u.sport ?? ""}"`, `"${u.school ?? ""}"`,
      u.role ?? "", u.stripePlanId ?? "free",
      u.trialEndsAt ? new Date(u.trialEndsAt).toLocaleDateString() : "",
      u.credits ?? 0,
      u.createdAt ? new Date(u.createdAt).toLocaleDateString() : "",
    ].join(","));
    const csv = [header, ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `athlynxai-users-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Users exported");
  };

  // Export waitlist as CSV
  const exportWaitlistCSV = () => {
    const header = "Name,Email,Sport,School,Phone,Role,Signed Up";
    const rows = waitlist.map((w: typeof waitlist[0]) => `"${w.name ?? ""}","${w.email}","${w.sport ?? ""}","${w.school ?? ""}","${w.phone ?? ""}","${w.role ?? ""}","${w.signedUpAt}"`);
    const csv = [header, ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `athlynx-waitlist-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Waitlist exported");
  };

  const TABS = [
    { id: "overview", label: "Overview", icon: BarChart3 },
    { id: "contacts", label: "Contacts", icon: Users },
    { id: "pipeline", label: "Pipeline", icon: LayoutGrid },
    { id: "concreator", label: "🤖 ConCreator™", icon: Building2 },
    { id: "waitlist", label: "Waitlist", icon: List },
    { id: "activity", label: "Activity", icon: Activity },
    { id: "expiry", label: "⏰ Expiring", icon: Clock },
  ] as const;

  return (
    <div className="min-h-screen bg-[#050c1a]">
      {/* Header */}
      <header className="bg-[#0a1628] border-b border-white/10 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/">
              <img src={`/athlynx-icon.png`} alt="AthlynX" className="w-9 h-9 rounded-xl cursor-pointer" />
            </Link>
            <div>
              <div className="text-white font-black text-lg leading-none">CRM Dashboard</div>
              <div className="text-[#00c2ff] text-xs tracking-widest uppercase leading-none">AthlynX Admin</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="bg-green-900/50 border border-green-700/50 text-green-300 text-xs px-3 py-1 rounded-full font-semibold">
              ● Admin: {user.name}
            </span>
            <button onClick={() => { statsQuery.refetch(); toast.success("Refreshed"); }} className="p-2 bg-white/5 border border-white/10 rounded-xl text-white/50 hover:text-white hover:bg-white/10 transition-colors">
              <RefreshCw className="w-4 h-4" />
            </button>
            <PushNotificationBell />
            <a href="https://calendly.com/cdozier14" target="_blank" rel="noopener noreferrer"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-black rounded-xl transition-colors flex items-center gap-2">
              📅 Schedule Meeting
            </a>
            <Link href="/feed">
              <button className="px-4 py-2 bg-white/5 border border-white/10 text-white text-sm font-bold rounded-xl hover:bg-white/10 transition-colors">← Platform</button>
            </Link>
          </div>
        </div>
      </header>

      {/* Tab nav */}
      <div className="bg-[#0a1628] border-b border-white/10 px-6">
        <div className="max-w-7xl mx-auto flex gap-1">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-bold border-b-2 transition-all ${
                activeTab === id
                  ? "border-[#00c2ff] text-[#00c2ff]"
                  : "border-transparent text-white/40 hover:text-white/70"
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">

        {/* ─── OVERVIEW TAB ─────────────────────────────────────────────────── */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            {/* Stats grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: "Total Users", value: stats?.totalSignups ?? 0, icon: Users, color: "text-[#00c2ff]", sub: `+${stats?.todaySignups ?? 0} today` },
                { label: "This Week", value: stats?.weekSignups ?? 0, icon: TrendingUp, color: "text-green-400", sub: "new signups" },
                { label: "Waitlist", value: stats?.waitlistCount ?? 0, icon: List, color: "text-red-400", sub: "pending" },
                { label: "CRM Contacts", value: stats?.contactsCount ?? 0, icon: Star, color: "text-blue-500", sub: "tracked" },
              ].map(({ label, value, icon: Icon, color, sub }) => (
                <div key={label} className="bg-[#0d1f3c] border border-white/10 rounded-2xl p-5">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-white/50 text-xs font-semibold uppercase tracking-wide">{label}</span>
                    <Icon className={`w-5 h-5 ${color}`} />
                  </div>
                  <div className={`text-3xl font-black ${color} mb-1`}>{value.toLocaleString()}</div>
                  <div className="text-white/30 text-xs">{sub}</div>
                </div>
              ))}
            </div>

            {/* Team members */}
            <div className="bg-[#0d1f3c] border border-white/10 rounded-2xl p-5">
              <h3 className="text-white font-black text-base mb-4">DHG Team Members</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {[
                  { name: "Chad A. Dozier", title: "Founder, CEO & Chairman", email: "contact@athlynx.ai", badge: "admin" },
                  { name: "Lee Marshall", title: "Co-Host · VP Sales & Partnerships · Business Partner", email: "lmarshall@athlynx.ai", badge: "team" },
                  { name: "Glenn Tse", title: "CFO / COO", email: "gtse@dozierholdingsgroup.com", badge: "team" },
                ].map((m) => (
                  <div key={m.name} className="bg-white/5 border border-white/10 rounded-xl p-4 flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#00c2ff] to-[#0066ff] flex items-center justify-center text-white font-black text-sm flex-shrink-0">
                      {m.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                    </div>
                    <div className="min-w-0">
                      <div className="text-white font-bold text-sm truncate">{m.name}</div>
                      <div className="text-white/50 text-xs truncate">{m.title}</div>
                      <div className="text-[#00c2ff] text-xs truncate">{m.email}</div>
                      <span className={`inline-block mt-1 text-[10px] px-2 py-0.5 rounded-full font-bold ${m.badge === "admin" ? "bg-red-900 text-red-300" : "bg-blue-900 text-blue-300"}`}>
                        {m.badge.toUpperCase()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Revenue Stats */}
            <div className="bg-[#0d1f3c] border border-white/10 rounded-2xl p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-black text-base flex items-center gap-2"><BarChart3 className="w-5 h-5 text-green-400" /> Live Revenue</h3>
                <span className="text-white/30 text-xs">Stripe — Live Mode</span>
              </div>
              {revenueQuery.isLoading ? (
                <div className="flex items-center justify-center py-6"><Loader2 className="w-6 h-6 text-[#00c2ff] animate-spin" /></div>
              ) : revenueQuery.error ? (
                <p className="text-red-400 text-sm text-center py-4">Stripe not connected — add STRIPE_SECRET_KEY to Vercel env vars</p>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { label: "MTD Revenue", value: `$${(revenueQuery.data?.mtdRevenue ?? 0).toLocaleString("en-US", { minimumFractionDigits: 2 })}`, color: "text-green-400" },
                    { label: "MRR", value: `$${(revenueQuery.data?.mrr ?? 0).toLocaleString("en-US", { minimumFractionDigits: 2 })}`, color: "text-[#00c2ff]" },
                    { label: "ARR", value: `$${(revenueQuery.data?.arr ?? 0).toLocaleString("en-US", { minimumFractionDigits: 2 })}`, color: "text-blue-400" },
                    { label: "Active Subs", value: String(revenueQuery.data?.activeSubscriptions ?? 0), color: "text-red-400" },
                  ].map(({ label, value, color }) => (
                    <div key={label} className="bg-white/5 border border-white/10 rounded-xl p-4">
                      <div className="text-white/40 text-xs font-semibold uppercase tracking-wide mb-2">{label}</div>
                      <div className={`text-2xl font-black ${color}`}>{value}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            {/* System Tests */}
            <div className="bg-[#0d1f3c] border border-white/10 rounded-2xl p-5">
              <h3 className="text-white font-black text-base mb-4 flex items-center gap-2"><Activity className="w-5 h-5 text-[#00c2ff]" /> System Tests</h3>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => testEmailMutation.mutate()}
                  disabled={testEmailMutation.isPending}
                  className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#00c2ff] to-[#0066ff] text-white font-black rounded-xl text-sm hover:from-[#00b0e8] hover:to-[#0055dd] transition-all disabled:opacity-50"
                >
                  {testEmailMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Mail className="w-4 h-4" />}
                  Test Email
                </button>
                <button
                  onClick={() => testSmsMutation.mutate()}
                  disabled={testSmsMutation.isPending}
                  className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-green-600 to-green-500 text-white font-black rounded-xl text-sm hover:from-green-500 hover:to-green-400 transition-all disabled:opacity-50"
                >
                  {testSmsMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Phone className="w-4 h-4" />}
                  Test SMS
                </button>
                <button
                  onClick={() => sendDailyReportMutation.mutate()}
                  disabled={sendDailyReportMutation.isPending}
                  className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-red-700 to-red-600 text-white font-black rounded-xl text-sm hover:from-red-600 hover:to-red-500 transition-all disabled:opacity-50"
                >
                  {sendDailyReportMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <BarChart3 className="w-4 h-4" />}
                  Send Daily Report
                </button>
              </div>
              <p className="text-white/30 text-xs mt-3">Email → contact@athlynx.ai · SMS → Book a call · Daily report auto-fires at 8 AM CST</p>
            </div>
            {/* Live User Dashboard — Salesforce + ZoomInfo Level */}
            <div className="bg-[#0d1f3c] border border-white/10 rounded-2xl p-5">
              <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
                <div>
                  <h3 className="text-white font-black text-base flex items-center gap-2">
                    <Users className="w-5 h-5 text-[#00c2ff]" /> Live User Dashboard
                    <span className="text-[10px] bg-green-900/50 border border-green-700/50 text-green-300 px-2 py-0.5 rounded-full font-semibold">LIVE • 30s refresh</span>
                  </h3>
                  <p className="text-white/30 text-xs mt-0.5">{allUsers.length} total users · Avatar enriched · Real-time</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => { usersQuery.refetch(); toast.success("Refreshed"); }}
                    className="flex items-center gap-1.5 px-3 py-2 bg-white/5 border border-white/10 text-white/60 rounded-xl text-xs font-bold hover:bg-white/10 transition-colors"
                  >
                    <RefreshCw className="w-3.5 h-3.5" /> Refresh
                  </button>
                  <button
                    onClick={exportUsersCSV}
                    className="flex items-center gap-1.5 px-3 py-2 bg-white/5 border border-white/10 text-white/60 rounded-xl text-xs font-bold hover:bg-white/10 transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" /> Export CSV
                  </button>
                </div>
              </div>
              {usersQuery.isLoading ? (
                <div className="flex items-center justify-center py-8"><Loader2 className="w-6 h-6 text-[#00c2ff] animate-spin" /></div>
              ) : allUsers.length === 0 ? (
                <div className="text-center py-10">
                  <Users className="w-12 h-12 text-white/10 mx-auto mb-3" />
                  <p className="text-white/30 text-sm">No users yet — be the first to sign up at athlynx.ai</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-white/10">
                        {["User", "Sport / School", "Plan", "Trial", "Credits", "Role", "Joined"].map(h => (
                          <th key={h} className="text-white/40 text-xs font-semibold uppercase tracking-wide text-left pb-3 pr-4 whitespace-nowrap">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {allUsers.map((u: typeof allUsers[0]) => {
                        const trialDaysLeft = u.trialEndsAt ? Math.max(0, Math.ceil((new Date(u.trialEndsAt).getTime() - Date.now()) / 86400000)) : null;
                        const isOnTrial = trialDaysLeft !== null && trialDaysLeft > 0;
                        const hasSubscription = !!u.stripeSubscriptionId;
                        return (
                          <tr key={u.id} className="border-b border-white/5 hover:bg-white/5 transition-colors group">
                            {/* User column with avatar */}
                            <td className="py-3 pr-4">
                              <div className="flex items-center gap-3">
                                <div className="relative flex-shrink-0">
                                  {u.avatarUrl ? (
                                    <img src={u.avatarUrl} alt={u.name ?? ""} className="w-9 h-9 rounded-full object-cover border-2 border-[#00c2ff]/30" />
                                  ) : (
                                    <div
                                      className="w-9 h-9 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 border-2 border-[#00c2ff]/30 overflow-hidden"
                                      title={u.name ? `${u.name} — Identity pending` : "Identity pending"}
                                    >
                                      <svg viewBox="0 0 24 24" className="w-3/5 h-3/5" fill="currentColor" aria-hidden="true">
                                        <path d="M12 12c2.7 0 4.9-2.2 4.9-4.9S14.7 2.2 12 2.2 7.1 4.4 7.1 7.1 9.3 12 12 12zm0 2.2c-3.3 0-9.8 1.7-9.8 4.9v2.7h19.6v-2.7c0-3.3-6.5-4.9-9.8-4.9z" />
                                      </svg>
                                    </div>
                                  )}
                                  <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-[#0d1f3c] bg-green-400" />
                                </div>
                                <div className="min-w-0">
                                  <div className="text-white font-bold text-sm truncate max-w-[140px]">{u.name ?? "—"}</div>
                                  <div className="text-white/40 text-xs truncate max-w-[140px]">{u.email ?? "—"}</div>
                                </div>
                              </div>
                            </td>
                            {/* Sport / School */}
                            <td className="py-3 pr-4">
                              <div className="text-white/70 text-xs font-semibold">{u.sport ?? "—"}</div>
                              <div className="text-white/30 text-xs">{u.school ?? ""}</div>
                            </td>
                            {/* Plan */}
                            <td className="py-3 pr-4">
                              <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                                hasSubscription ? "bg-green-900/60 text-green-300 border border-green-700/50" :
                                isOnTrial ? "bg-blue-900/60 text-blue-300 border border-blue-700/50" :
                                "bg-white/5 text-white/30 border border-white/10"
                              }`}>
                                {hasSubscription ? (u.stripePlanId ?? "Pro") : isOnTrial ? "Trial" : "Free"}
                              </span>
                            </td>
                            {/* Trial */}
                            <td className="py-3 pr-4">
                              {isOnTrial ? (
                                <span className="text-xs text-blue-300 font-bold">{trialDaysLeft}d left</span>
                              ) : hasSubscription ? (
                                <span className="text-xs text-green-400">✓ Active</span>
                              ) : (
                                <span className="text-xs text-white/20">Expired</span>
                              )}
                            </td>
                            {/* Credits */}
                            <td className="py-3 pr-4">
                              <span className="text-xs text-[#00c2ff] font-bold">{(u.credits ?? 0).toLocaleString()}</span>
                            </td>
                            {/* Role (editable) */}
                            <td className="py-3 pr-4">
                              <select
                                value={u.role ?? "user"}
                                onChange={(e) => updateUserRole.mutate({ userId: u.id, role: e.target.value as "athlete" | "coach" | "brand" | "admin" })}
                                className="bg-white/10 border border-white/10 text-white text-xs rounded-lg px-2 py-1 focus:outline-none hover:bg-white/20 transition-colors"
                              >
                                {["user", "athlete", "coach", "brand", "admin"].map((r: string) => <option key={r} value={r}>{r}</option>)}
                              </select>
                            </td>
                            {/* Joined */}
                            <td className="py-3 text-white/30 text-xs whitespace-nowrap">
                              {u.createdAt ? new Date(u.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "—"}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ─── CONTACTS TAB ─────────────────────────────────────────────────── */}
        {activeTab === "contacts" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div className="relative flex-1 min-w-48">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input
                  type="text"
                  placeholder="Search contacts..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 text-white placeholder:text-white/20 rounded-xl pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:border-[#00c2ff]/50"
                />
              </div>
              <button
                onClick={() => setShowAddContact(true)}
                className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#00c2ff] to-[#0066ff] text-white font-black rounded-xl text-sm hover:from-[#00b0e8] hover:to-[#0055dd] transition-all"
              >
                <Plus className="w-4 h-4" /> Add Contact
              </button>
            </div>

            {contactsQuery.isLoading ? (
              <div className="flex items-center justify-center py-16"><Loader2 className="w-8 h-8 text-[#00c2ff] animate-spin" /></div>
            ) : contacts.length === 0 ? (
              <div className="text-center py-16">
                <Users className="w-12 h-12 text-white/20 mx-auto mb-3" />
                <p className="text-white/40 text-sm">No contacts yet. Add your first contact.</p>
              </div>
            ) : (
              <div className="bg-[#0d1f3c] border border-white/10 rounded-2xl overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="border-b border-white/10">
                    <tr>
                      {["Name", "Email", "Phone", "Company", "Role", "Status", "Last Activity", "Actions"].map(h => (
                        <th key={h} className="text-white/40 text-xs font-semibold uppercase tracking-wide text-left px-4 py-3">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {contacts.map((c: typeof contacts[0]) => (
                      <tr key={c.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                        <td className="px-4 py-3 text-white font-semibold">{c.name}</td>
                        <td className="px-4 py-3 text-white/50">{c.email ?? "—"}</td>
                        <td className="px-4 py-3 text-white/50">{c.phone ?? "—"}</td>
                        <td className="px-4 py-3 text-white/50">{c.company ?? "—"}</td>
                        <td className="px-4 py-3">
                          <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${ROLE_BADGE[c.role] ?? "bg-gray-800 text-gray-300"}`}>{c.role}</span>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${STATUS_BADGE[c.status] ?? "bg-gray-800 text-gray-300"}`}>{c.status}</span>
                        </td>
                        <td className="px-4 py-3 text-white/30 text-xs">{c.lastActivity ? new Date(c.lastActivity).toLocaleDateString() : "—"}</td>
                        <td className="px-4 py-3">
                          <button
                            onClick={() => { if (confirm(`Delete ${c.name}?`)) deleteContact.mutate({ id: c.id }); }}
                            className="text-red-400 hover:text-red-300 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ─── PIPELINE TAB ─────────────────────────────────────────────────── */}
        {activeTab === "pipeline" && (
          <div>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-white font-black text-lg">Sales Pipeline</h2>
              <span className="text-white/40 text-sm">{pipeline.length} deals</span>
            </div>
            {pipelineQuery.isLoading ? (
              <div className="flex items-center justify-center py-16"><Loader2 className="w-8 h-8 text-[#00c2ff] animate-spin" /></div>
            ) : pipeline.length === 0 ? (
              <div className="text-center py-16">
                <LayoutGrid className="w-12 h-12 text-white/20 mx-auto mb-3" />
                <p className="text-white/40 text-sm">No pipeline entries yet. Add contacts and move them through stages.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                {PIPELINE_STAGES.map((stage) => {
                  const stageItems = pipeline.filter((p: typeof pipeline[0]) => p.pipeline.stage === stage);
                  return (
                    <div key={stage} className={`${STAGE_COLORS[stage]} border rounded-xl p-3`}>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-white/70 text-xs font-bold uppercase tracking-wide">{stage}</span>
                        <span className="bg-white/10 text-white text-xs px-1.5 py-0.5 rounded-full">{stageItems.length}</span>
                      </div>
                      <div className="space-y-2">
                        {stageItems.map(({ pipeline: p, contact }: { pipeline: typeof stageItems[0]['pipeline']; contact: typeof stageItems[0]['contact'] }) => (
                          <div key={p.id} className="bg-black/30 border border-white/10 rounded-lg p-2.5">
                            <div className="text-white text-xs font-bold truncate">{contact?.name ?? "Unknown"}</div>
                            <div className="text-white/40 text-[10px] truncate">{contact?.role ?? ""}</div>
                            {p.dealValue ? <div className="text-green-400 text-[10px] font-bold mt-1">${p.dealValue.toLocaleString()}</div> : null}
                            <select
                              value={p.stage}
                              onChange={(e) => updateStage.mutate({ id: p.id, stage: e.target.value as typeof p.stage })}
                              className="w-full mt-2 bg-white/10 border border-white/10 text-white text-[10px] rounded px-1 py-0.5 focus:outline-none"
                            >
                              {PIPELINE_STAGES.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ─── WAITLIST TAB ─────────────────────────────────────────────────── */}
        {activeTab === "waitlist" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div>
                <h2 className="text-white font-black text-lg">VIP Waitlist</h2>
                <p className="text-white/40 text-sm">{waitlistQuery.data?.total ?? 0} total entries</p>
              </div>
              <button
                onClick={exportWaitlistCSV}
                className="flex items-center gap-2 px-4 py-2.5 bg-green-800 hover:bg-green-700 text-white font-bold rounded-xl text-sm transition-colors"
              >
                <Download className="w-4 h-4" /> Export CSV
              </button>
            </div>

            {waitlistQuery.isLoading ? (
              <div className="flex items-center justify-center py-16"><Loader2 className="w-8 h-8 text-[#00c2ff] animate-spin" /></div>
            ) : waitlist.length === 0 ? (
              <div className="text-center py-16">
                <List className="w-12 h-12 text-white/20 mx-auto mb-3" />
                <p className="text-white/40 text-sm">No waitlist entries yet.</p>
              </div>
            ) : (
              <div className="bg-[#0d1f3c] border border-white/10 rounded-2xl overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="border-b border-white/10">
                    <tr>
                      {["#", "Name", "Email", "Sport", "School", "Phone", "Role", "Signed Up"].map(h => (
                        <th key={h} className="text-white/40 text-xs font-semibold uppercase tracking-wide text-left px-4 py-3">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {waitlist.map((w: typeof waitlist[0], i: number) => (
                      <tr key={w.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                        <td className="px-4 py-3 text-white/30 text-xs">{i + 1}</td>
                        <td className="px-4 py-3 text-white font-semibold">{w.name ?? "—"}</td>
                        <td className="px-4 py-3 text-[#00c2ff]">{w.email}</td>
                        <td className="px-4 py-3 text-white/50">{w.sport ?? "—"}</td>
                        <td className="px-4 py-3 text-white/50">{w.school ?? "—"}</td>
                        <td className="px-4 py-3 text-white/50">{w.phone ?? "—"}</td>
                        <td className="px-4 py-3 text-white/50">{w.role ?? "—"}</td>
                        <td className="px-4 py-3 text-white/30 text-xs">{new Date(w.signedUpAt).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ─── ACTIVITY TAB ─────────────────────────────────────────────────── */}
        {activeTab === "activity" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-white font-black text-lg">Activity Log</h2>
              <span className="text-white/40 text-sm">{activityQuery.data?.total ?? 0} total events</span>
            </div>

            {activityQuery.isLoading ? (
              <div className="flex items-center justify-center py-16"><Loader2 className="w-8 h-8 text-[#00c2ff] animate-spin" /></div>
            ) : activityEvents.length === 0 ? (
              <div className="text-center py-16">
                <Activity className="w-12 h-12 text-white/20 mx-auto mb-3" />
                <p className="text-white/40 text-sm">No activity logged yet.</p>
              </div>
            ) : (
              <div className="bg-[#0d1f3c] border border-white/10 rounded-2xl overflow-hidden">
                <div className="divide-y divide-white/5">
                  {activityEvents.map(({ log, user: u }: { log: typeof activityEvents[0]['log']; user: typeof activityEvents[0]['user'] }) => (
                    <div key={log.id} className="px-5 py-4 flex items-start gap-4 hover:bg-white/5 transition-colors">
                      <div className="w-8 h-8 rounded-full bg-[#00c2ff]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Activity className="w-4 h-4 text-[#00c2ff]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-white font-bold text-sm">{log.eventType}</span>
                          {u?.name && <span className="text-white/40 text-xs">by {u.name}</span>}
                        </div>
                        {log.metadata && <p className="text-white/40 text-xs mt-0.5 truncate">{log.metadata}</p>}
                      </div>
                      <span className="text-white/25 text-xs flex-shrink-0">{new Date(log.createdAt).toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
        {/* ── EXPIRY WARNINGS TAB ── */}
        {activeTab === "expiry" && (
          <div className="space-y-6">
            {/* Expiring Soon */}
            <div className="bg-[#0a1628] border border-blue-400/40/20 rounded-2xl overflow-hidden">
              <div className="px-5 py-4 border-b border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-blue-300" />
                  <span className="text-white font-black text-sm">Expiring Soon (≤5 days)</span>
                  <span className="bg-blue-900/30/20 text-blue-300 text-xs font-bold px-2 py-0.5 rounded-full">
                    {(expiryQuery.data ?? []).filter((u: any) => !u.isExpired && !u.hasPaidSub).length}
                  </span>
                </div>
                <button onClick={() => expiryQuery.refetch()} className="text-white/30 hover:text-white transition-colors"><RefreshCw className="w-4 h-4" /></button>
              </div>
              {expiryQuery.isLoading ? (
                <div className="p-8 text-center"><Loader2 className="w-6 h-6 animate-spin text-white/30 mx-auto" /></div>
              ) : (expiryQuery.data ?? []).filter((u: any) => !u.isExpired && !u.hasPaidSub).length === 0 ? (
                <div className="p-6 text-center text-white/30 text-sm">No users expiring within 5 days</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="bg-white/5 border-b border-white/10">
                        <th className="text-left px-4 py-3 text-white/50 font-semibold">User</th>
                        <th className="text-left px-4 py-3 text-white/50 font-semibold">Email</th>
                        <th className="text-left px-4 py-3 text-white/50 font-semibold">Days Left</th>
                        <th className="text-left px-4 py-3 text-white/50 font-semibold">Expires</th>
                        <th className="text-left px-4 py-3 text-white/50 font-semibold">Last Email Sent</th>
                        <th className="text-left px-4 py-3 text-white/50 font-semibold">Email Log</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(expiryQuery.data ?? []).filter((u: any) => !u.isExpired && !u.hasPaidSub).map((u: any) => (
                        <tr key={u.id} className="border-b border-white/5 hover:bg-white/5">
                          <td className="px-4 py-3 text-white font-semibold">{u.name || "—"}</td>
                          <td className="px-4 py-3 text-white/60">{u.email}</td>
                          <td className="px-4 py-3">
                            <span className={`font-black px-2 py-0.5 rounded-full text-xs ${
                              u.daysLeft <= 1 ? "bg-red-500/20 text-red-400" :
                              u.daysLeft <= 3 ? "bg-blue-900/30/20 text-blue-300" :
                              "bg-blue-500/20 text-blue-400"
                            }`}>{u.daysLeft}d</span>
                          </td>
                          <td className="px-4 py-3 text-white/50">{u.trialEndsAt ? new Date(u.trialEndsAt).toLocaleDateString() : "—"}</td>
                          <td className="px-4 py-3 text-white/50">
                            {u.emailLog?.[0] ? new Date(u.emailLog[0].emailSentAt).toLocaleString() : "None sent"}
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex flex-wrap gap-1">
                              {(u.emailLog ?? []).map((e: any, i: number) => (
                                <span key={i} className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
                                  e.status === "sent" ? "bg-green-900/50 text-green-400" : "bg-red-900/50 text-red-400"
                                }`}>{e.emailType}</span>
                              ))}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Overdue / Expired */}
            <div className="bg-[#0a1628] border border-red-500/20 rounded-2xl overflow-hidden">
              <div className="px-5 py-4 border-b border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <XCircle className="w-5 h-5 text-red-400" />
                  <span className="text-white font-black text-sm">Expired — No Subscription</span>
                  <span className="bg-red-500/20 text-red-400 text-xs font-bold px-2 py-0.5 rounded-full">
                    {(overdueQuery.data ?? []).length}
                  </span>
                </div>
                <button onClick={() => overdueQuery.refetch()} className="text-white/30 hover:text-white transition-colors"><RefreshCw className="w-4 h-4" /></button>
              </div>
              {overdueQuery.isLoading ? (
                <div className="p-8 text-center"><Loader2 className="w-6 h-6 animate-spin text-white/30 mx-auto" /></div>
              ) : (overdueQuery.data ?? []).length === 0 ? (
                <div className="p-6 text-center text-white/30 text-sm">No expired accounts without subscription</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="bg-white/5 border-b border-white/10">
                        <th className="text-left px-4 py-3 text-white/50 font-semibold">User</th>
                        <th className="text-left px-4 py-3 text-white/50 font-semibold">Email</th>
                        <th className="text-left px-4 py-3 text-white/50 font-semibold">Expired</th>
                        <th className="text-left px-4 py-3 text-white/50 font-semibold">Days Ago</th>
                        <th className="text-left px-4 py-3 text-white/50 font-semibold">Plan</th>
                        <th className="text-left px-4 py-3 text-white/50 font-semibold">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(overdueQuery.data ?? []).map((u: any) => (
                        <tr key={u.id} className="border-b border-white/5 hover:bg-white/5">
                          <td className="px-4 py-3 text-white font-semibold">{u.name || "—"}</td>
                          <td className="px-4 py-3 text-white/60">{u.email}</td>
                          <td className="px-4 py-3 text-white/50">{u.trialEndsAt ? new Date(u.trialEndsAt).toLocaleDateString() : "—"}</td>
                          <td className="px-4 py-3">
                            <span className="bg-red-500/20 text-red-400 font-black px-2 py-0.5 rounded-full text-xs">{u.expiredDaysAgo}d ago</span>
                          </td>
                          <td className="px-4 py-3 text-white/40">{u.stripePlanId || "free"}</td>
                          <td className="px-4 py-3">
                            <a href={`mailto:${u.email}?subject=Your AthlynX trial has expired&body=Hi ${u.name || 'there'},%0A%0AYour AthlynX free trial has ended. Upgrade now at https://athlynx.ai/billing to restore full access.%0A%0AChad Dozier%0AAthlynXAI`}
                              className="text-xs bg-blue-600 hover:bg-blue-500 text-white font-bold px-3 py-1 rounded-lg transition-colors">
                              Email
                            </a>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ─── CONCREATOR™ B2B CLIENT TAB ──────────────────────────────────── */}
        {activeTab === "concreator" && (
          <div className="space-y-6">

            {/* Header */}
            <div className="bg-gradient-to-br from-[#0a1628] via-[#0d2040] to-[#0a1628] border border-cyan-600/40 rounded-2xl p-6">
              <div className="flex items-center gap-4 mb-4">
                <img src="/images/logos/athlynx-main-logo.png" alt="ConCreator" className="w-14 h-14 rounded-2xl border border-cyan-500/30" />
                <div>
                  <h2 className="text-white font-black text-2xl">ConCreator™ B2B Clients</h2>
                  <p className="text-cyan-400 text-sm">Data Intelligence &amp; AI Credit System · Powered by Softmor Inc. · A Dozier Holdings Group Product</p>
                </div>
              </div>
              <p className="text-blue-200 text-sm leading-relaxed max-w-3xl">
                Every company that comes to DHG/Softmor for AI software, hardware integration, or data intelligence is billed here.
                They pay per machine, per month. You own the IP. They get the service. Revenue flows directly to DHG.
              </p>
            </div>

            {/* Revenue Summary */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: "Active Clients", value: "1", sub: "CementCo · Command Tier", color: "text-cyan-400" },
                { label: "Active Machines", value: "10", sub: "$9,970/mo projected", color: "text-green-400" },
                { label: "Monthly Revenue", value: "$9,970", sub: "Command × 10 machines", color: "text-blue-300" },
                { label: "Annual Revenue", value: "$119,640", sub: "Year 1 + license", color: "text-blue-400" },
              ].map(({ label, value, sub, color }) => (
                <div key={label} className="bg-[#0d1f3c] border border-white/10 rounded-2xl p-5">
                  <div className="text-white/50 text-xs font-semibold uppercase tracking-wide mb-2">{label}</div>
                  <div className={`text-2xl font-black ${color} mb-1`}>{value}</div>
                  <div className="text-white/30 text-xs">{sub}</div>
                </div>
              ))}
            </div>

            {/* Tier Reference */}
            <div className="bg-[#0d1f3c] border border-white/10 rounded-2xl p-5">
              <h3 className="text-white font-black text-base mb-4">ConCreator™ Pricing Tiers — Per Machine / Per Month</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/10">
                      {["Tier", "Price/Machine/Mo", "AI Credits", "Reports", "Stripe Price ID", "Add Client"].map(h => (
                        <th key={h} className="text-white/40 text-xs font-semibold uppercase tracking-wide text-left pb-3 pr-4 whitespace-nowrap">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { tier: "Pulse", price: "$297/mo", credits: "500", reports: "Monthly only", priceId: "price_1TTaLKGvvjXZw2uE0j4ZMU9J", color: "text-blue-400" },
                      { tier: "Insight", price: "$597/mo", credits: "2,000", reports: "Weekly + Monthly", priceId: "price_1TTaLMGvvjXZw2uE8m5Imwtn", color: "text-cyan-400" },
                      { tier: "Command ★", price: "$997/mo", credits: "5,000", reports: "Daily + Weekly + Monthly", priceId: "price_1TTaLNGvvjXZw2uEVbyQse2H", color: "text-emerald-400", rec: true },
                      { tier: "Enterprise", price: "$1,997/mo", credits: "Unlimited", reports: "Full Suite + Custom", priceId: "price_1TTaLPGvvjXZw2uEOGZwzZUA", color: "text-purple-400" },
                    ].map((t) => (
                      <tr key={t.tier} className={`border-b border-white/5 hover:bg-white/5 transition-colors ${t.rec ? 'bg-emerald-900/10' : ''}`}>
                        <td className="py-3 pr-4">
                          <span className={`font-black ${t.color}`}>{t.tier}</span>
                          {t.rec && <span className="ml-2 text-[10px] bg-emerald-500 text-white px-2 py-0.5 rounded-full font-bold">RECOMMENDED</span>}
                        </td>
                        <td className="py-3 pr-4 text-white font-bold">{t.price}</td>
                        <td className="py-3 pr-4 text-white/70">{t.credits}</td>
                        <td className="py-3 pr-4 text-white/50 text-xs">{t.reports}</td>
                        <td className="py-3 pr-4">
                          <code className="text-xs text-cyan-400 bg-cyan-900/20 px-2 py-0.5 rounded">{t.priceId}</code>
                        </td>
                        <td className="py-3 pr-4">
                          <a href={`mailto:contact@athlynx.ai?subject=New ConCreator ${t.tier} Client&body=Company:%0AContact:%0AEmail:%0APhone:%0AMachines:%0ATier: ${t.tier}%0APrice ID: ${t.priceId}`}
                            className="text-xs bg-cyan-600 hover:bg-cyan-500 text-white font-bold px-3 py-1.5 rounded-lg transition-colors">
                            + Add Client
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-white/20 text-xs mt-3">Add-ons: Extra Machine (prorated) · API Raw Data Feed +$199/mo · White-Label Branding +$99/mo · Dedicated Account Manager +$499/mo · Extra 1,000 Credits $49</p>
            </div>

            {/* Active Clients */}
            <div className="bg-[#0d1f3c] border border-white/10 rounded-2xl p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-black text-base">Active B2B Clients</h3>
                <a href="mailto:contact@athlynx.ai?subject=New ConCreator Client Onboarding"
                  className="flex items-center gap-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white text-sm font-black rounded-xl transition-colors">
                  <Plus className="w-4 h-4" /> Onboard New Client
                </a>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/10">
                      {["Company", "Contact", "Tier", "Machines", "Monthly Rev", "AI Credits", "Status", "Sold By"].map(h => (
                        <th key={h} className="text-white/40 text-xs font-semibold uppercase tracking-wide text-left pb-3 pr-4 whitespace-nowrap">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-white/5 hover:bg-white/5 transition-colors">
                      <td className="py-3 pr-4">
                        <div className="text-white font-bold">CementCo Technologies</div>
                        <div className="text-white/30 text-xs">Industrial · Mississippi</div>
                      </td>
                      <td className="py-3 pr-4">
                        <div className="text-white/70 text-xs">Telly Walsworth</div>
                        <div className="text-cyan-400 text-xs">CEO</div>
                      </td>
                      <td className="py-3 pr-4">
                        <span className="bg-emerald-900/60 text-emerald-300 border border-emerald-700/50 text-xs px-2 py-0.5 rounded-full font-bold">Command</span>
                      </td>
                      <td className="py-3 pr-4 text-white font-bold">10</td>
                      <td className="py-3 pr-4 text-green-400 font-black">$9,970</td>
                      <td className="py-3 pr-4 text-white/70">5,000/mo</td>
                      <td className="py-3 pr-4">
                        <span className="bg-blue-900/60 text-blue-300 border border-blue-700/50 text-xs px-2 py-0.5 rounded-full font-bold">Proposal Sent</span>
                      </td>
                      <td className="py-3 pr-4">
                        <div className="text-white/70 text-xs">Chad A. Dozier</div>
                        <div className="text-white/30 text-xs">DHG / Softmor</div>
                      </td>
                    </tr>
                    <tr className="border-b border-white/5">
                      <td colSpan={8} className="py-8 text-center">
                        <div className="text-white/20 text-sm">More clients coming — every DHG company can sell ConCreator™</div>
                        <a href="mailto:contact@athlynx.ai?subject=New ConCreator Client"
                          className="inline-flex items-center gap-2 mt-3 px-5 py-2 bg-white/5 border border-white/10 text-white/50 text-sm font-bold rounded-xl hover:bg-white/10 transition-colors">
                          <Plus className="w-4 h-4" /> Add Next Client
                        </a>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* AI Credit Actions Reference */}
            <div className="bg-[#0d1f3c] border border-white/10 rounded-2xl p-5">
              <h3 className="text-white font-black text-base mb-4">AI Credit Actions — What Clients Pay For</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { action: "Standard Report Generation", credits: "50 credits", icon: "📊", desc: "Daily/weekly/monthly auto-reports" },
                  { action: "AI Anomaly Detection", credits: "25 credits", icon: "🚨", desc: "Flags unusual machine behavior" },
                  { action: "Predictive Trend Analysis", credits: "150 credits", icon: "📈", desc: "AI forecasts output & maintenance" },
                  { action: "Custom Data Query", credits: "100 credits", icon: "🤖", desc: "Ask any machine data question" },
                  { action: "Year-End Summary Report", credits: "FREE", icon: "🏆", desc: "Included with all tiers annually" },
                  { action: "Extra Credit Block", credits: "$49 / 1,000", icon: "⚡", desc: "Buy more anytime, no tier upgrade" },
                  { action: "White-Label Branding", credits: "+$99/mo", icon: "🎨", desc: "Client logo on all reports" },
                  { action: "API Raw Data Feed", credits: "+$199/mo", icon: "🔗", desc: "Build custom dashboards" },
                ].map((item, i) => (
                  <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-4">
                    <div className="text-2xl mb-2">{item.icon}</div>
                    <div className="text-white text-sm font-semibold mb-1">{item.action}</div>
                    <div className="text-cyan-400 text-xs font-bold mb-1">{item.credits}</div>
                    <div className="text-white/40 text-xs">{item.desc}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* How to Sell */}
            <div className="bg-gradient-to-r from-[#0a1628] to-[#1a3a8f] border border-blue-600/40 rounded-2xl p-5">
              <h3 className="text-white font-black text-base mb-3">How Any DHG Company Sells ConCreator™</h3>
              <div className="grid md:grid-cols-4 gap-4">
                {[
                  { step: "1", title: "Identify the Client", desc: "Any company with machines, data, or AI needs. Industrial, manufacturing, logistics, healthcare, sports." },
                  { step: "2", title: "Send the Deck", desc: "ConCreatorFULLv2 deck + credit tiers deck. Recommend Command tier as the floor." },
                  { step: "3", title: "Onboard in CRM", desc: "Add client here. Set tier, machine count, monthly revenue. Email contact@athlynx.ai to activate Stripe billing." },
                  { step: "4", title: "Get Paid", desc: "Stripe bills client monthly. Revenue flows to DHG bank account. Credits reset monthly — drives natural upsell." },
                ].map((s) => (
                  <div key={s.step} className="bg-white/5 border border-white/10 rounded-xl p-4">
                    <div className="text-3xl font-black text-blue-400 mb-2">{s.step}</div>
                    <div className="text-white font-bold text-sm mb-1">{s.title}</div>
                    <div className="text-blue-200 text-xs leading-relaxed">{s.desc}</div>
                  </div>
                ))}
              </div>
              <p className="text-white/30 text-xs mt-4">ConCreator™ is a registered trademark of Dozier Holdings Group. © 2026 DHG &amp; Softmor Inc. All Rights Reserved. Governing Law: State of Texas.</p>
            </div>

          </div>
        )}

      </div>

      {/* Add Contact Modal */}
      {showAddContact && (
        <AddContactModal
          onClose={() => setShowAddContact(false)}
          onSuccess={() => utils.crm.getContacts.invalidate()}
        />
      )}
    </div>
  );
}

export default function AdminCRM() {
  return <RouteErrorBoundary><AdminCRMInner /></RouteErrorBoundary>;
}
