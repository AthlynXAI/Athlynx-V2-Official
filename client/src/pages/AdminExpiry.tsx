/**
 * AthlynX — Admin Subscription Expiry View
 * Shows all users with expiring/expired trials, email log timestamps, and manual send controls.
 * Admin-only page.
 */
import { RouteErrorBoundary } from "@/components/GlobalErrorBoundary";
import PlatformLayout from "@/components/PlatformLayout";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { useState } from "react";
import { Link } from "wouter";

function timeAgo(date: string | Date | null): string {
  if (!date) return "Never";
  const d = new Date(date);
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const mins = Math.floor(diff / (1000 * 60));
  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  return `${mins}m ago`;
}

function daysColor(days: number): string {
  if (days <= 0) return "text-red-400";
  if (days <= 2) return "text-red-300";
  if (days <= 4) return "text-blue-400";
  return "text-blue-300";
}

function AdminExpiryInner() {
  const { user, loading } = useAuth();
  const [activeTab, setActiveTab] = useState<"expiring" | "overdue">("expiring");

  const warningsQuery = trpc.expiration.getWarnings.useQuery(undefined, {
    enabled: user?.role === "admin",
    refetchInterval: 30000,
  });

  const overdueQuery = trpc.expiration.getOverdue.useQuery(undefined, {
    enabled: user?.role === "admin" && activeTab === "overdue",
    refetchInterval: 30000,
  });

  if (loading) return (
    <PlatformLayout title="Subscription Expiry">
      <div className="flex items-center justify-center h-64">
        <div className="text-blue-400 text-sm animate-pulse">Loading...</div>
      </div>
    </PlatformLayout>
  );

  if (!user || user.role !== "admin") return (
    <PlatformLayout title="Access Denied">
      <div className="max-w-lg mx-auto text-center py-16">
        <div className="text-5xl mb-4">🔒</div>
        <h2 className="text-white font-black text-xl mb-2">Admin Only</h2>
        <p className="text-blue-400 text-sm mb-4">This page is restricted to AthlynX administrators.</p>
        <Link href="/feed"><button className="px-6 py-2.5 bg-blue-600 text-white font-bold rounded-xl text-sm">Go to Feed</button></Link>
      </div>
    </PlatformLayout>
  );

  const warnings = warningsQuery.data ?? [];
  const overdue = overdueQuery.data ?? [];

  // Email cadence summary
  const emailCadence = [
    { day: 7, label: "Day 7", desc: "First warning — trial ending in 1 week", color: "text-blue-300" },
    { day: 5, label: "Day 5", desc: "Second warning — 5 days remaining", color: "text-blue-300" },
    { day: 4, label: "Day 4", desc: "Daily warning begins", color: "text-blue-400" },
    { day: 3, label: "Day 3", desc: "Urgent — 3 days left", color: "text-blue-400" },
    { day: 2, label: "Day 2", desc: "Critical — 2 days left", color: "text-red-400" },
    { day: 1, label: "Day 1", desc: "Final warning — expires tomorrow", color: "text-red-400" },
    { day: 0, label: "Day 0", desc: "Expired — account suspended", color: "text-red-600" },
  ];

  return (
    <PlatformLayout title="Subscription Expiry">
      <div className="max-w-5xl mx-auto px-2 py-4 space-y-5">

        {/* Header */}
        <div className="bg-gradient-to-br from-[#0d1b3e] to-[#1a3a8f] rounded-2xl border border-blue-800 p-5">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-black text-white mb-1">⏰ Subscription Expiry Dashboard</h1>
              <p className="text-blue-300 text-sm">Monitor expiring trials and overdue accounts. Send manual email reminders.</p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-black text-blue-400">{warnings.length}</div>
              <div className="text-blue-400 text-xs">Expiring Soon</div>
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: "Expiring (7 days)", value: warnings.length, color: "text-blue-300", icon: "⚠️" },
            { label: "Expired / Overdue", value: overdue.length || "—", color: "text-red-400", icon: "🚨" },
            { label: "With Paid Sub", value: warnings.filter(w => w.hasPaidSub).length, color: "text-green-400", icon: "✅" },
            { label: "Email Cadence", value: "7 emails", color: "text-blue-400", icon: "📧" },
          ].map((stat, i) => (
            <div key={i} className="bg-[#0d1b3e] rounded-xl border border-blue-800 p-3 text-center">
              <div className="text-2xl mb-1">{stat.icon}</div>
              <div className={`text-2xl font-black ${stat.color}`}>{stat.value}</div>
              <div className="text-blue-400 text-xs mt-0.5">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Email Cadence Reference */}
        <div className="bg-[#0d1b3e] rounded-2xl border border-blue-800 p-4">
          <h3 className="text-white font-black text-sm mb-3 flex items-center gap-2">
            <span>📧</span> Email Cadence Schedule
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2">
            {emailCadence.map(e => (
              <div key={e.day} className="bg-blue-900/30 rounded-xl p-2 text-center border border-blue-800/40">
                <div className={`text-sm font-black ${e.color}`}>{e.label}</div>
                <div className="text-blue-400 text-[9px] mt-0.5 leading-tight">{e.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab("expiring")}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === "expiring" ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white" : "bg-[#0d1b3e] border border-blue-800 text-blue-400"}`}
          >
            ⚠️ Expiring Soon ({warnings.length})
          </button>
          <button
            onClick={() => setActiveTab("overdue")}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === "overdue" ? "bg-gradient-to-r from-red-700 to-red-600 text-white" : "bg-[#0d1b3e] border border-blue-800 text-blue-400"}`}
          >
            🚨 Overdue ({overdue.length})
          </button>
        </div>

        {/* Expiring Users Table */}
        {activeTab === "expiring" && (
          <div className="bg-[#0d1b3e] rounded-2xl border border-blue-800 overflow-hidden">
            <div className="p-4 border-b border-blue-800">
              <h3 className="text-white font-black text-sm">Users Expiring in Next 7 Days</h3>
            </div>
            {warningsQuery.isLoading ? (
              <div className="p-8 text-center text-blue-400 text-sm animate-pulse">Loading expiry data...</div>
            ) : warnings.length === 0 ? (
              <div className="p-8 text-center">
                <div className="text-3xl mb-2">✅</div>
                <p className="text-green-400 text-sm font-bold">No expiring accounts in the next 7 days!</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-blue-900/30 text-blue-400 text-xs">
                      <th className="text-left px-4 py-2">User</th>
                      <th className="text-left px-4 py-2">Days Left</th>
                      <th className="text-left px-4 py-2">Trial Ends</th>
                      <th className="text-left px-4 py-2">Paid Sub</th>
                      <th className="text-left px-4 py-2">Last Email</th>
                      <th className="text-left px-4 py-2">Email Log</th>
                      <th className="text-left px-4 py-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {warnings.map(w => (
                      <tr key={w.id} className="border-t border-blue-900/50 hover:bg-blue-900/20 transition-colors">
                        <td className="px-4 py-3">
                          <div className="text-white font-bold text-xs">{w.name || "Unknown"}</div>
                          <div className="text-blue-400 text-[10px]">{w.email}</div>
                          {w.phone && <div className="text-blue-500 text-[10px]">{w.phone}</div>}
                        </td>
                        <td className="px-4 py-3">
                          <span className={`font-black text-base ${daysColor(w.daysLeft)}`}>
                            {w.isExpired ? "EXPIRED" : `${w.daysLeft}d`}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-blue-300 text-xs">
                          {w.trialEndsAt ? new Date(w.trialEndsAt).toLocaleDateString() : "—"}
                        </td>
                        <td className="px-4 py-3">
                          <span className={`text-xs font-bold ${w.hasPaidSub ? "text-green-400" : "text-red-400"}`}>
                            {w.hasPaidSub ? "✅ Yes" : "❌ No"}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-blue-400 text-xs">
                          {w.emailLog.length > 0
                            ? `${w.emailLog[0].emailType} — ${timeAgo(w.emailLog[0].emailSentAt)}`
                            : "Never sent"}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex flex-wrap gap-1">
                            {w.emailLog.slice(0, 3).map((log: any, i: number) => (
                              <span key={i} className="text-[9px] bg-blue-900/50 border border-blue-700 rounded px-1 py-0.5 text-blue-300">
                                D{log.daysRemaining}
                              </span>
                            ))}
                            {w.emailLog.length === 0 && <span className="text-[9px] text-blue-500">No emails</span>}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <a
                            href={`mailto:${w.email}?subject=Your AthlynX Trial is Expiring&body=Hi ${w.name},%0A%0AYour AthlynX trial expires in ${w.daysLeft} day(s). Upgrade now to keep access to all your athlete tools.%0A%0AUpgrade here: https://athlynx.ai/pricing%0A%0A— Chad Dozier%0AAthlynXAI`}
                            className="text-[10px] bg-blue-600/20 border border-blue-600 text-blue-400 rounded px-2 py-1 hover:bg-blue-600/40 transition-colors"
                          >
                            📧 Send
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Overdue Users Table */}
        {activeTab === "overdue" && (
          <div className="bg-[#0d1b3e] rounded-2xl border border-red-800/50 overflow-hidden">
            <div className="p-4 border-b border-red-800/50 bg-red-900/20">
              <h3 className="text-white font-black text-sm">🚨 Overdue Accounts (Expired, No Paid Sub)</h3>
            </div>
            {overdueQuery.isLoading ? (
              <div className="p-8 text-center text-blue-400 text-sm animate-pulse">Loading overdue data...</div>
            ) : overdue.length === 0 ? (
              <div className="p-8 text-center">
                <div className="text-3xl mb-2">✅</div>
                <p className="text-green-400 text-sm font-bold">No overdue accounts!</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-red-900/30 text-red-300 text-xs">
                      <th className="text-left px-4 py-2">User</th>
                      <th className="text-left px-4 py-2">Expired</th>
                      <th className="text-left px-4 py-2">Trial Ended</th>
                      <th className="text-left px-4 py-2">Plan</th>
                      <th className="text-left px-4 py-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {overdue.map((u: any) => (
                      <tr key={u.id} className="border-t border-red-900/30 hover:bg-red-900/10 transition-colors">
                        <td className="px-4 py-3">
                          <div className="text-white font-bold text-xs">{u.name || "Unknown"}</div>
                          <div className="text-red-300 text-[10px]">{u.email}</div>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-red-400 font-black text-sm">{u.expiredDaysAgo}d ago</span>
                        </td>
                        <td className="px-4 py-3 text-red-300 text-xs">
                          {u.trialEndsAt ? new Date(u.trialEndsAt).toLocaleDateString() : "—"}
                        </td>
                        <td className="px-4 py-3 text-blue-400 text-xs">{u.stripePlanId || "Free"}</td>
                        <td className="px-4 py-3 flex gap-2">
                          <a
                            href={`mailto:${u.email}?subject=Your AthlynX Account Has Expired&body=Hi ${u.name},%0A%0AYour AthlynX trial expired ${u.expiredDaysAgo} day(s) ago. Reactivate now to regain access.%0A%0AUpgrade: https://athlynx.ai/pricing%0A%0A— Chad Dozier%0AAthlynXAI`}
                            className="text-[10px] bg-red-600/20 border border-red-600 text-red-400 rounded px-2 py-1 hover:bg-red-600/40 transition-colors"
                          >
                            📧 Re-engage
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Quick Links */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: "Admin Dashboard", href: "/admin/dashboard", icon: "🏠" },
            { label: "User Tracker", href: "/admin/users", icon: "👥" },
            { label: "CRM", href: "/admin/crm", icon: "📊" },
            { label: "Broadcast", href: "/admin/broadcast", icon: "📢" },
          ].map(link => (
            <Link key={link.href} href={link.href}>
              <div className="bg-[#0d1b3e] rounded-xl border border-blue-800 p-3 text-center hover:border-blue-600 hover:bg-blue-900/30 transition-all cursor-pointer">
                <div className="text-xl mb-1">{link.icon}</div>
                <div className="text-white text-xs font-bold">{link.label}</div>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </PlatformLayout>
  );
}

export default function AdminExpiry() {
  return <RouteErrorBoundary><AdminExpiryInner /></RouteErrorBoundary>;
}
