import { useState, useEffect, useRef } from "react";
import { RouteErrorBoundary } from "@/components/GlobalErrorBoundary";
import PlatformLayout from "@/components/PlatformLayout";
import MobileBottomNav from '@/components/MobileBottomNav'
import { Link, useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

interface SignupEntry {
  id: number;
  signupNumber: number;
  fullName: string | null;
  email: string;
  phone: string | null;
  role: string | null;
  sport: string | null;
  ipAddress: string | null;
  browser: string | null;
  device: string | null;
  os: string | null;
  country: string | null;
  city: string | null;
  signupType: string;
  isConverted: boolean;
  isPaying: boolean;
  lifetimeValue: string | null;
  createdAt: Date | null;
}

interface CRMStats {
  totalSignups: number;
  todaySignups: number;
  convertedUsers: number;
  payingUsers: number;
  totalRevenue: number;
  waitlistCount: number;
  conversionRate: string;
  lastUpdated: string;
}

function CRMDashboardInner() {
  const meQuery = trpc.auth.me.useQuery(undefined, { retry: false, refetchOnWindowFocus: false });
  const [, navigate] = useLocation();
  const logoutMutation = trpc.auth.logout.useMutation();
  const partnerName = meQuery.data?.name || "Admin";
  const isAdmin = meQuery.data?.role === "admin";
  const [signups, setSignups] = useState<SignupEntry[]>([]);
  const [stats, setStats] = useState<CRMStats | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const lastSignupCount = useRef(0);

  useEffect(() => {
    if (meQuery.isLoading) return;
    if (!meQuery.data) navigate("/signin");
  }, [meQuery.data, meQuery.isLoading, navigate]);

  const handleLogout = async () => {
    await logoutMutation.mutateAsync();
    navigate("/signin");
  };

  // Get stats
  const statsQuery = trpc.crm.stats.useQuery(undefined, {
    enabled: isAdmin,
    refetchInterval: autoRefresh ? 5000 : false,
  });

  // Get signups
  const signupsQuery = trpc.crm.signups.useQuery(
    { limit: 100 },
    { 
      enabled: isAdmin,
      refetchInterval: autoRefresh ? 5000 : false,
    }
  );

  // Update stats when query changes
  useEffect(() => {
    if (statsQuery.data) {
      setStats(statsQuery.data);
    }
  }, [statsQuery.data]);

  // Update signups and play sound for new ones
  useEffect(() => {
    if (signupsQuery.data?.signups) {
      const newSignups = signupsQuery.data.signups as SignupEntry[];
      
      // Check for new signups
      if (newSignups.length > lastSignupCount.current && lastSignupCount.current > 0) {
        // Play notification sound
        playNotificationSound();
        toast.success(` NEW SIGNUP #${newSignups[0].signupNumber}!`, {
          description: `${newSignups[0].fullName} just joined!`,
          duration: 10000,
        });
      }
      
      lastSignupCount.current = newSignups.length;
      setSignups(newSignups);
    }
  }, [signupsQuery.data]);

  const playNotificationSound = () => {
    // Create a simple beep sound
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = 800;
    oscillator.type = "sine";
    gainNode.gain.value = 0.3;
    
    oscillator.start();
    setTimeout(() => {
      oscillator.stop();
      audioContext.close();
    }, 200);
  };


  const exportToCSV = () => {
    if (!signups.length) return;
    
    const headers = [
      "Signup #", "Timestamp", "Full Name", "Email", "Phone", "Role", "Sport",
      "IP Address", "Browser", "Device", "OS", "Country", "City",
      "Signup Type", "Converted", "Paying", "Lifetime Value"
    ];
    
    const rows = signups.map(s => [
      s.signupNumber,
      s.createdAt ? new Date(s.createdAt).toISOString() : "",
      s.fullName || "",
      s.email,
      s.phone || "",
      s.role || "",
      s.sport || "",
      s.ipAddress || "",
      s.browser || "",
      s.device || "",
      s.os || "",
      s.country || "",
      s.city || "",
      s.signupType,
      s.isConverted ? "Yes" : "No",
      s.isPaying ? "Yes" : "No",
      s.lifetimeValue || "0"
    ].map(v => `"${String(v).replace(/"/g, '""')}"`).join(","));
    
    const csv = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `AthlynX_Signups_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    
    toast.success("CSV exported! Ready for Microsoft Copilot");
  };

  if (meQuery.isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-blue-950 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-[#1E90FF] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-white/50 text-sm">Loading CRM Dashboard...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-blue-950 to-slate-900 flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-slate-800/90 border-[#1E90FF]/30">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 w-24 h-24 bg-gradient-to-r from-[#1E90FF] to-[#0a1628] rounded-2xl flex items-center justify-center">
              <span className="text-5xl"></span>
            </div>
            <CardTitle className="text-3xl text-white">Access Denied</CardTitle>
            <p className="text-[#1E90FF] text-sm">Admin access required. Contact Chad Dozier.</p>
          </CardHeader>
          <CardContent className="text-center">
            <Link href="/feed">
              <Button className="bg-slate-700 hover:bg-slate-600 text-white">Return to Platform</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Main Dashboard
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-blue-950 to-slate-900 text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/">
              <div className="bg-gradient-to-r from-[#1E90FF] to-blue-500 rounded-xl px-4 py-2 flex items-center gap-2">
                <span className="text-2xl"></span>
                <div>
                  <h1 className="text-white font-bold text-lg">AthlynX CRM</h1>
                  <p className="text-blue-100 text-[10px]">PARTNER DASHBOARD</p>
                </div>
              </div>
            </Link>
            <span className="text-[#00C2FF]">Welcome, {partnerName}</span>
          </div>
          
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={autoRefresh}
                onChange={(e) => setAutoRefresh(e.target.checked)}
                className="rounded"
              />
              <span className="text-slate-300">Auto-refresh (5s)</span>
            </label>
            <Button
              onClick={exportToCSV}
              className="bg-[#00C2FF] hover:bg-[#00C2FF]"
            >
               Export CSV
            </Button>
            <Button
              onClick={handleLogout}
              variant="outline"
              className="border-slate-600 text-slate-300"
            >
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-8">
          <StatCard 
            title="Total Signups" 
            value={stats?.totalSignups || 0} 
            icon=""
            color="cyan"
          />
          <StatCard 
            title="Today" 
            value={stats?.todaySignups || 0} 
            icon=""
            color="green"
          />
          <StatCard 
            title="Waitlist" 
            value={stats?.waitlistCount || 0} 
            icon=""
            color="blue"
          />
          <StatCard 
            title="Converted" 
            value={stats?.convertedUsers || 0} 
            icon=""
            color="blue"
          />
          <StatCard 
            title="Paying" 
            value={stats?.payingUsers || 0} 
            icon=""
            color="red"
          />
          <StatCard 
            title="Revenue" 
            value={`$${stats?.totalRevenue || 0}`} 
            icon=""
            color="green"
          />
          <StatCard 
            title="Conv. Rate" 
            value={`${stats?.conversionRate || 0}%`} 
            icon=""
            color="red"
          />
        </div>


        {/* Inbox Cleanup + OAuth Security Control */}
        <div className="mb-8 rounded-2xl border border-[#1E90FF]/30 bg-slate-800/60 p-6 shadow-xl shadow-cyan-950/20">
          <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#00C2FF]">Communication OS Guardrail</p>
              <h2 className="mt-2 text-2xl font-black text-white">Inbox Cleanup & OAuth Security Control</h2>
              <p className="mt-3 max-w-4xl text-sm leading-6 text-slate-300">
                AthlynXAI CRM now treats email cleanup as an operating workflow: truly important business, billing, legal,
                investor, production, Apple Developer, and account-access proof is preserved in folders; completed-task
                notifications and routine noise move to Trash only; permanent deletion remains owner-controlled.
              </p>
            </div>
            <Link href="/crm/communications">
              <Button className="bg-[#1565C0] hover:bg-[#1E90FF] text-white">Open Communications OS</Button>
            </Link>
          </div>
          <div className="mt-5 grid gap-4 md:grid-cols-3">
            <div className="rounded-xl border border-slate-600 bg-slate-900/70 p-4">
              <h3 className="font-bold text-[#00C2FF]">Folder what matters</h3>
              <p className="mt-2 text-sm text-slate-400">Keep only high-value proof in reviewable folders: GitHub/Vercel, Apple Developer, billing, legal, investor, OAuth, and account-access events.</p>
            </div>
            <div className="rounded-xl border border-slate-600 bg-slate-900/70 p-4">
              <h3 className="font-bold text-[#00C2FF]">Trash routine noise</h3>
              <p className="mt-2 text-sm text-slate-400">Completed Perplexity task notices, routine newsletters, stale login codes, and non-critical notifications go to Trash for Chad to permanently delete later.</p>
            </div>
            <div className="rounded-xl border border-slate-600 bg-slate-900/70 p-4">
              <h3 className="font-bold text-[#00C2FF]">Review OAuth apps one by one</h3>
              <p className="mt-2 text-sm text-slate-400">GitHub authorized apps, revoked-token notices, broad scopes, and connector drift become CRM System Alerts. Never bulk revoke, expand scopes, or reconnect without approval.</p>
            </div>
          </div>
        </div>

        {/* Milestones */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
             Milestones
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <MilestoneCard target={1} current={stats?.totalSignups || 0} label="First Signup!" />
            <MilestoneCard target={10} current={stats?.totalSignups || 0} label="10 Users" />
            <MilestoneCard target={100} current={stats?.totalSignups || 0} label="100 Users" />
            <MilestoneCard target={1000} current={stats?.totalSignups || 0} label="1,000 Users" />
            <MilestoneCard target={1} current={stats?.payingUsers || 0} label="First Paying Customer!" />
            <MilestoneCard target={100} current={stats?.totalRevenue || 0} label="$100 Revenue" isRevenue />
            <MilestoneCard target={1000} current={stats?.totalRevenue || 0} label="$1,000 Revenue" isRevenue />
            <MilestoneCard target={10000} current={stats?.totalRevenue || 0} label="$10,000 Revenue" isRevenue />
          </div>
        </div>

        {/* Live Feed */}
        <div className="bg-slate-800/50 rounded-2xl border border-slate-700 overflow-hidden">
          <div className="bg-gradient-to-r from-[#1E90FF] to-blue-600 px-6 py-4 flex items-center justify-between">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <span className="w-3 h-3 bg-[#00C2FF] rounded-full animate-pulse"></span>
              LIVE SIGNUP FEED
            </h2>
            <span className="text-blue-100 text-sm">
              Last updated: {stats?.lastUpdated ? new Date(stats.lastUpdated).toLocaleTimeString() : "..."}
            </span>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-700/50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-[#00C2FF] uppercase tracking-wider">#</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-[#00C2FF] uppercase tracking-wider">Time</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-[#00C2FF] uppercase tracking-wider">Name</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-[#00C2FF] uppercase tracking-wider">Email</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-[#00C2FF] uppercase tracking-wider">Phone</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-[#00C2FF] uppercase tracking-wider">Role</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-[#00C2FF] uppercase tracking-wider">Sport</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-[#00C2FF] uppercase tracking-wider">Device</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-[#00C2FF] uppercase tracking-wider">IP</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-[#00C2FF] uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                {signups.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="px-4 py-12 text-center text-slate-400">
                      <div className="flex flex-col items-center gap-2">
                        <span className="text-4xl"></span>
                        <p>Waiting for first signup...</p>
                        <p className="text-sm">Launch is at 9 AM CST!</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  signups.map((signup, index) => (
                    <tr 
                      key={signup.id} 
                      className={`hover:bg-slate-700/30 transition-colors ${
                        index === 0 ? "bg-[#1E90FF]/20 animate-pulse" : ""
                      }`}
                    >
                      <td className="px-4 py-3">
                        <span className={`font-bold ${
                          signup.signupNumber === 1 ? "text-[#1E90FF]" : "text-[#00C2FF]"
                        }`}>
                          #{signup.signupNumber}
                          {signup.signupNumber === 1 && " "}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-300 text-sm">
                        {signup.createdAt ? new Date(signup.createdAt).toLocaleString() : "-"}
                      </td>
                      <td className="px-4 py-3 text-white font-medium">{signup.fullName || "-"}</td>
                      <td className="px-4 py-3 text-slate-300">{signup.email}</td>
                      <td className="px-4 py-3 text-slate-300">{signup.phone || "-"}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          signup.role === "athlete" ? "bg-blue-500/20 text-blue-400" :
                          signup.role === "parent" ? "bg-blue-600/20 text-blue-500" :
                          signup.role === "coach" ? "bg-[#00C2FF]/20 text-[#00C2FF]" :
                          "bg-[#1E90FF]/20 text-[#1E90FF]"
                        }`}>
                          {signup.role || "-"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-300">{signup.sport || "-"}</td>
                      <td className="px-4 py-3 text-slate-400 text-sm">
                        {signup.device || "-"} / {signup.browser || "-"}
                      </td>
                      <td className="px-4 py-3 text-slate-400 text-sm font-mono">{signup.ipAddress || "-"}</td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1">
                          {signup.isPaying && (
                            <span className="px-2 py-1 bg-[#00C2FF]/20 text-[#00C2FF] rounded-full text-xs"> Paying</span>
                          )}
                          {signup.isConverted && !signup.isPaying && (
                            <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded-full text-xs"> Converted</span>
                          )}
                          {!signup.isConverted && (
                            <span className="px-2 py-1 bg-slate-500/20 text-slate-400 rounded-full text-xs"> Waitlist</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-slate-500 text-sm">
          <p>AthlynX CRM Dashboard • Failproof • Failsafe • Unbreakable</p>
          <p>Data is backed up to console logs and exportable to Excel/Microsoft Copilot</p>
        </div>
      </main>
    </div>
  );
}

function StatCard({ title, value, icon, color }: { title: string; value: number | string; icon: string; color: string }) {
  const colorClasses: Record<string, string> = {
    cyan: "from-[#1E90FF]/20 to-[#0a1628]/20 border-[#1E90FF]/30",
    green: "from-[#00C2FF]/20 to-[#0a1628]/20 border-[#00C2FF]/30",
    blue: "from-blue-500/20 to-blue-600/20 border-blue-500/30",
    blue2: "from-blue-600/20 to-blue-700/20 border-blue-600/30",
    red2: "from-[#1E90FF]/20 to-[#0a1628]/20 border-[#1E90FF]/30",
    orange2: "from-[#1E90FF]/20 to-[#0a1628]/20 border-[#1E90FF]/30",
  };

  return (
    <div className={`bg-gradient-to-br ${colorClasses[color]} rounded-xl border p-4`}>
      <div className="flex items-center gap-2 mb-2">
        <span className="text-xl">{icon}</span>
        <span className="text-slate-400 text-xs uppercase tracking-wider">{title}</span>
      </div>
      <div className="text-2xl font-bold text-white">{value}</div>
    </div>
  );
}

function MilestoneCard({ target, current, label, isRevenue = false }: { target: number; current: number; label: string; isRevenue?: boolean }) {
  const achieved = current >= target;
  const progress = Math.min((current / target) * 100, 100);
  
  return (
    <div className={`rounded-xl border p-4 ${
      achieved 
        ? "bg-gradient-to-br from-[#00C2FF]/20 to-[#0a1628]/20 border-[#00C2FF]/50" 
        : "bg-slate-800/50 border-slate-700"
    }`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-slate-300">{label}</span>
        {achieved && <span className="text-xl"></span>}
      </div>
      <div className="h-2 bg-slate-700 rounded-full overflow-hidden mb-2">
        <div 
          className={`h-full transition-all duration-500 ${
            achieved ? "bg-[#00C2FF]" : "bg-[#1E90FF]"
          }`}
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="text-xs text-slate-400">
        {isRevenue ? `$${current}` : current} / {isRevenue ? `$${target}` : target}
      </div>
    <MobileBottomNav />
    </div>
  );
}

export default function CRMDashboard() {
  return <RouteErrorBoundary><CRMDashboardInner /></RouteErrorBoundary>;
}
