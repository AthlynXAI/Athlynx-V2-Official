/**
 * AthlynX NOTIFICATION CENTER — S39
 * Platform-wide notification hub with activity feed, filters, and mark-all-read.
 * Wired to the live notifications tRPC router.
 *
 * Session 39 — May 6, 2026
 */
import { useState } from "react";
import { RouteErrorBoundary } from "@/components/GlobalErrorBoundary";
import PlatformLayout from "@/components/PlatformLayout";
import MobileBottomNav from "@/components/MobileBottomNav";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { toast } from "sonner";
import { Link } from "wouter";
import {
  Bell, BellOff, CheckCheck, Filter, Clock, Zap, Trophy,
  MessageSquare, DollarSign, TrendingUp, Award, Star,
  Shield, Gift, Megaphone, User, ChevronRight, Loader2,
  Activity, Flame
} from "lucide-react";

// ─── Notification Type Config ─────────────────────────────────────────────────
const NOTIF_CONFIG: Record<string, { icon: React.ElementType; color: string; bg: string; label: string }> = {
  welcome:             { icon: Star,         color: "text-yellow-400", bg: "bg-yellow-500/20",  label: "Welcome" },
  vip_approved:        { icon: Shield,       color: "text-purple-400", bg: "bg-purple-500/20", label: "VIP" },
  system_announcement: { icon: Megaphone,    color: "text-blue-400",   bg: "bg-blue-500/20",   label: "System" },
  custom:              { icon: Bell,         color: "text-[#00c2ff]",  bg: "bg-[#0066ff]/20",  label: "Update" },
  credit_added:        { icon: Zap,          color: "text-green-400",  bg: "bg-green-500/20",  label: "Credits" },
  new_feature:         { icon: Flame,        color: "text-orange-400", bg: "bg-orange-500/20", label: "New" },
  promotion:           { icon: Gift,         color: "text-pink-400",   bg: "bg-pink-500/20",   label: "Promo" },
  reminder:            { icon: Clock,        color: "text-yellow-400", bg: "bg-yellow-500/20", label: "Reminder" },
  achievement:         { icon: Trophy,       color: "text-yellow-400", bg: "bg-yellow-500/20", label: "Achievement" },
  message:             { icon: MessageSquare,color: "text-cyan-400",   bg: "bg-cyan-500/20",   label: "Message" },
};

// ─── Demo Notifications (shown when DB is empty or loading) ──────────────────
const DEMO_NOTIFICATIONS = [
  { id: 1, type: "achievement", title: "🏆 X-Factor Score Updated!", message: "Your X-Factor score jumped to 87 — up 3 points this week. You're now in the top 15% of athletes in your sport.", isRead: false, createdAt: new Date(Date.now() - 2 * 60000).toISOString(), link: "/rankings-hub" },
  { id: 2, type: "credit_added", title: "⚡ 250 Credits Added", message: "Your monthly Starter subscription credits have been added to your account. Use them to generate scouting reports, coach emails, and NIL pitches.", isRead: false, createdAt: new Date(Date.now() - 15 * 60000).toISOString(), link: "/token-factory" },
  { id: 3, type: "message", title: "📬 Coach Williams Viewed Your Profile", message: "A D1 recruiting coordinator from LSU viewed your profile and highlight reel. This is your moment — send a follow-up email now.", isRead: false, createdAt: new Date(Date.now() - 45 * 60000).toISOString(), link: "/ai-recruiter" },
  { id: 4, type: "new_feature", title: "🔥 AI Scouting Report is LIVE", message: "Generate a professional AI scouting report for any athlete in seconds. Powered by Nebius H200 AI — 10 credits per report.", isRead: true, createdAt: new Date(Date.now() - 2 * 3600000).toISOString(), link: "/ai-scouting-report" },
  { id: 5, type: "promotion", title: "🎁 Limited Time: 2x Credits on Champion Pack", message: "For the next 48 hours, the Champion Pack (7,500 credits) includes a 2x bonus. That's 15,000 credits for $49.99.", isRead: true, createdAt: new Date(Date.now() - 5 * 3600000).toISOString(), link: "/token-factory" },
  { id: 6, type: "system_announcement", title: "📡 Live Leaderboard Now Active", message: "The AthlynX Live Leaderboard is now tracking 12 top prospects in real-time. Check your ranking and see where you stand nationally.", isRead: true, createdAt: new Date(Date.now() - 24 * 3600000).toISOString(), link: "/rankings-hub" },
  { id: 7, type: "achievement", title: "🎓 Profile 80% Complete", message: "You're almost there! Add your highlight reel URL and combine stats to reach 100% profile completion and earn 50 free credits.", isRead: true, createdAt: new Date(Date.now() - 2 * 24 * 3600000).toISOString(), link: "/profile" },
  { id: 8, type: "welcome", title: "👋 Welcome to AthlynX!", message: "You're now part of the most powerful athlete platform in the country. Complete your profile to start getting noticed by coaches and brands.", isRead: true, createdAt: new Date(Date.now() - 7 * 24 * 3600000).toISOString(), link: "/profile" },
];

// ─── Time Formatter ───────────────────────────────────────────────────────────
function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString();
}

// ─── Main Component ───────────────────────────────────────────────────────────
function NotificationCenterInner() {
  const { user } = useAuth();
  const [filter, setFilter] = useState<"all" | "unread" | "credits" | "achievements" | "messages">("all");

  const { data: liveNotifs, isLoading, refetch } = trpc.notifications.getRecent.useQuery(undefined, {
    retry: false,
  });

  const markAllRead = trpc.notifications.markAllRead.useMutation({
    onSuccess: () => { toast.success("All notifications marked as read"); refetch(); },
  });

  const markRead = trpc.notifications.markRead.useMutation({
    onSuccess: () => refetch(),
  });

  // Use live data if available, otherwise demo
  const rawNotifs = (liveNotifs && liveNotifs.length > 0) ? liveNotifs : DEMO_NOTIFICATIONS;

  const filteredNotifs = rawNotifs.filter((n: any) => {
    if (filter === "unread") return !n.isRead;
    if (filter === "credits") return n.type === "credit_added" || n.type === "promotion";
    if (filter === "achievements") return n.type === "achievement" || n.type === "vip_approved";
    if (filter === "messages") return n.type === "message";
    return true;
  });

  const unreadCount = rawNotifs.filter((n: any) => !n.isRead).length;

  return (
    <PlatformLayout>
      <div className="min-h-screen bg-[#040c1a] pb-24">

        {/* Hero */}
        <div className="bg-gradient-to-b from-[#0a1628] to-[#040c1a] px-4 pt-5 pb-4">
          <div className="max-w-2xl mx-auto">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Bell size={18} className="text-[#00c2ff]" />
                  <div className="text-[10px] font-black tracking-[0.3em] text-[#00c2ff] uppercase">AthlynX</div>
                </div>
                <h1 className="text-2xl font-black text-white">Notification Center</h1>
                <p className="text-blue-400 text-sm mt-1">
                  {unreadCount > 0 ? `${unreadCount} unread notification${unreadCount > 1 ? "s" : ""}` : "You're all caught up"}
                </p>
              </div>
              {unreadCount > 0 && (
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#0066ff] to-[#00c2ff] flex items-center justify-center text-white font-black text-sm">
                  {unreadCount}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="max-w-2xl mx-auto px-4 py-4 space-y-4">

          {/* Filter + Mark All Read */}
          <div className="flex items-center gap-2">
            <div className="flex-1 flex gap-1.5 overflow-x-auto scrollbar-hide">
              {[
                { id: "all", label: "All" },
                { id: "unread", label: `Unread${unreadCount > 0 ? ` (${unreadCount})` : ""}` },
                { id: "credits", label: "Credits" },
                { id: "achievements", label: "Achievements" },
                { id: "messages", label: "Messages" },
              ].map(f => (
                <button key={f.id} onClick={() => setFilter(f.id as any)}
                  className={`shrink-0 text-[11px] font-bold px-3 py-1.5 rounded-full transition-colors ${
                    filter === f.id ? "bg-gradient-to-r from-[#0066ff] to-[#00c2ff] text-white" : "bg-[#0d1e3c] border border-blue-800/50 text-blue-400"
                  }`}>
                  {f.label}
                </button>
              ))}
            </div>
            {unreadCount > 0 && (
              <button
                onClick={() => markAllRead.mutate()}
                disabled={markAllRead.isPending}
                className="shrink-0 flex items-center gap-1 text-[#00c2ff] text-[11px] font-bold border border-[#0066ff]/40 rounded-full px-3 py-1.5 hover:bg-[#0066ff]/10 transition-colors"
              >
                <CheckCheck size={12} />
                <span className="hidden sm:inline">Mark all read</span>
              </button>
            )}
          </div>

          {/* Loading */}
          {isLoading && (
            <div className="flex items-center justify-center py-12">
              <Loader2 size={28} className="text-[#0066ff] animate-spin" />
            </div>
          )}

          {/* Notification List */}
          {!isLoading && filteredNotifs.length === 0 && (
            <div className="bg-[#0d1e3c] border border-blue-800/40 rounded-2xl p-8 text-center">
              <BellOff size={32} className="text-blue-700 mx-auto mb-3" />
              <div className="text-white font-black text-sm mb-1">No notifications here</div>
              <p className="text-blue-600 text-xs">Check back later or switch filters.</p>
            </div>
          )}

          {!isLoading && filteredNotifs.map((notif: any, i: number) => {
            const config = NOTIF_CONFIG[notif.type] || NOTIF_CONFIG.custom;
            const Icon = config.icon;
            return (
              <div
                key={notif.id}
                className={`relative bg-[#0d1e3c] border rounded-2xl overflow-hidden transition-all ${
                  !notif.isRead ? "border-[#0066ff]/40 shadow-lg shadow-[#0066ff]/5" : "border-blue-800/40"
                }`}
              >
                {!notif.isRead && (
                  <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-[#0066ff] to-[#00c2ff]" />
                )}
                <div className="flex items-start gap-3 p-4 pl-5">
                  <div className={`w-10 h-10 rounded-xl ${config.bg} flex items-center justify-center shrink-0`}>
                    <Icon size={18} className={config.color} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`text-[9px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded-full ${config.bg} ${config.color}`}>
                            {config.label}
                          </span>
                          {!notif.isRead && (
                            <span className="w-1.5 h-1.5 rounded-full bg-[#0066ff] shrink-0" />
                          )}
                        </div>
                        <div className={`text-sm font-black mt-1 ${!notif.isRead ? "text-white" : "text-blue-200"}`}>
                          {notif.title}
                        </div>
                        {notif.message && (
                          <p className="text-blue-400 text-xs mt-1 leading-relaxed">{notif.message}</p>
                        )}
                        <div className="flex items-center gap-3 mt-2">
                          <div className="flex items-center gap-1">
                            <Clock size={10} className="text-blue-700" />
                            <span className="text-blue-700 text-[10px]">{timeAgo(notif.createdAt as string)}</span>
                          </div>
                          {notif.link && (
                            <Link href={notif.link}>
                              <button
                                onClick={() => !notif.isRead && markRead.mutate({ id: notif.id })}
                                className="text-[#00c2ff] text-[10px] font-bold flex items-center gap-0.5 hover:text-white transition-colors"
                              >
                                View <ChevronRight size={10} />
                              </button>
                            </Link>
                          )}
                          {!notif.isRead && (
                            <button
                              onClick={() => markRead.mutate({ id: notif.id })}
                              className="text-blue-600 text-[10px] font-bold hover:text-blue-400 transition-colors"
                            >
                              Mark read
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Platform Stats */}
          <div className="bg-gradient-to-r from-[#0066ff]/10 to-[#00c2ff]/5 border border-[#0066ff]/20 rounded-2xl p-4">
            <div className="text-[10px] font-black text-[#00c2ff] tracking-widest uppercase mb-3">Platform Activity Today</div>
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: "New Offers", val: "38", icon: Award, color: "text-yellow-400" },
                { label: "NIL Deals", val: "14", icon: DollarSign, color: "text-green-400" },
                { label: "Active Users", val: "2,847", icon: Activity, color: "text-[#00c2ff]" },
              ].map((s, i) => (
                <div key={i} className="text-center">
                  <s.icon size={18} className={`${s.color} mx-auto mb-1`} />
                  <div className={`font-black text-base ${s.color}`}>{s.val}</div>
                  <div className="text-blue-600 text-[9px]">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Notification Preferences CTA */}
          <div className="bg-[#0d1e3c] border border-blue-800/40 rounded-2xl p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#0066ff]/20 flex items-center justify-center shrink-0">
              <Bell size={18} className="text-[#0066ff]" />
            </div>
            <div className="flex-1">
              <div className="text-white font-black text-sm">Notification Preferences</div>
              <p className="text-blue-500 text-xs">Control what alerts you receive and how.</p>
            </div>
            <Link href="/settings">
              <button className="text-[#00c2ff] text-xs font-bold border border-[#0066ff]/40 rounded-xl px-3 py-1.5 hover:bg-[#0066ff]/10 transition-colors">
                Settings
              </button>
            </Link>
          </div>

        </div>
      </div>
      <MobileBottomNav />
    </PlatformLayout>
  );
}

export default function NotificationCenter() {
  return <RouteErrorBoundary><NotificationCenterInner /></RouteErrorBoundary>;
}
