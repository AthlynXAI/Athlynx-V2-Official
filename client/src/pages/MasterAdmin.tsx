import { useState } from "react";
import { RouteErrorBoundary } from "@/components/GlobalErrorBoundary";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Send, Users, Megaphone, Shield, Search, Bell, CheckCircle, AlertTriangle, BarChart2, Crown } from "lucide-react";
import PlatformLayout from "@/components/PlatformLayout";
import PartnerAvatar, { isMasterAdmin } from "@/components/PartnerAvatar";

const RECIPIENT_OPTIONS = [
  { value: "all", label: "All Users", emoji: "" },
  { value: "trial", label: "Trial Users", icon: "" },
  { value: "subscribed", label: "Subscribers", emoji: "" },
  { value: "free", label: "Free Users", emoji: "" },
] as const;

const MESSAGE_TEMPLATES = [
  { label: "Welcome", subject: "Welcome to AthlynX!", body: "Welcome to AthlynX! Your journey starts here. Explore NIL deals, connect with coaches, and build your brand. We're glad you're here. " },
  { label: "New Feature", subject: " New Feature Alert!", body: "We just launched something big on AthlynX. Log in now to check it out and stay ahead of the game." },
  { label: "NIL Opportunity", subject: " New NIL Opportunities Live!", body: "Brands are looking for athletes like you. Check the NIL Portal now for new deals." },
  { label: "Recruiting Update", subject: " Recruiting Season Update", body: "Make sure your profile is complete and your highlight reel is up to date. Coaches are watching." },
  { label: "Maintenance", subject: " Scheduled Maintenance", body: "Scheduled maintenance tonight from 2–4 AM EST. The platform will be briefly unavailable. We apologize for any inconvenience." },
];

function MasterAdminInner() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [recipientFilter, setRecipientFilter] = useState<"all" | "trial" | "subscribed" | "free">("all");
  const [channel, setChannel] = useState<"in_app" | "email" | "both">("in_app");
  const [searchQuery, setSearchQuery] = useState("");
  const [sent, setSent] = useState(false);

  const { data: stats } = trpc.admin.getStats.useQuery();
  const { data: usersData } = trpc.admin.getUsers.useQuery({ search: searchQuery, limit: 50 });
  const { data: broadcasts } = trpc.admin.getBroadcasts.useQuery();

  const sendBroadcastMutation = trpc.admin.sendBroadcast.useMutation({
    onSuccess: (result) => {
      setSent(true);
      toast({ title: "Broadcast Sent!", description: `Delivered to ${result.recipientCount} users.` });
      setTimeout(() => { setSent(false); setSubject(""); setBody(""); }, 3000);
    },
    onError: (err) => toast({ title: "Error", description: err.message, variant: "destructive" }),
  });

  // Only allow admin
  if (!user || (user as any).role !== "admin") {
    return (
      <PlatformLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
          <Shield className="w-16 h-16 text-[#1E90FF] mb-4" />
          <h1 className="text-2xl font-black text-white mb-2">Access Denied</h1>
          <p className="text-blue-400">This page is restricted to Master Admins only.</p>
        </div>
      </PlatformLayout>
    );
  }

  const handleSend = () => {
    if (!subject.trim() || !body.trim()) {
      toast({ title: "Required", description: "Subject and message body are required.", variant: "destructive" });
      return;
    }
    sendBroadcastMutation.mutate({ subject, body, channel, recipientFilter });
  };

  const isPending = sendBroadcastMutation.isPending;

  return (
    <PlatformLayout>
      <div className="space-y-5 pb-20 lg:pb-6 max-w-4xl mx-auto">

        {/* Header */}
        <div className="bg-gradient-to-br from-[#1a0a2e] via-[#2d1b69] to-[#1a0a2e] border border-blue-800/50 rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-700 to-indigo-700 flex items-center justify-center shadow-lg">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-white">Master Admin</h1>
              <p className="text-blue-300 text-sm">AthlynX Command Center</p>
            </div>
            <Badge className="ml-auto bg-blue-700/30 text-blue-300 border-blue-600/40">
              {user?.name || "Admin"}
            </Badge>
          </div>

          {/* Stats */}
          {stats && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: "Total Users", value: stats.totalUsers, icon: Users },
                { label: "New This Week", value: stats.newThisWeek, icon: Bell },
                { label: "Subscribers", value: stats.withSubscription, icon: BarChart2 },
                { label: "On Trial", value: stats.onTrial, icon: CheckCircle },
              ].map((s, i) => {
                const Icon = s.icon;
                return (
                  <div key={i} className="bg-blue-950/30 rounded-xl p-3 text-center border border-blue-900/30">
                    <Icon className="w-4 h-4 text-blue-500 mx-auto mb-1" />
                    <div className="text-xl font-black text-white">{s.value.toLocaleString()}</div>
                    <div className="text-blue-500 text-xs">{s.label}</div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Broadcast Compose */}
        <div className="bg-[#1a1a3a] border border-blue-900/40 rounded-2xl p-5 space-y-4">
          <h2 className="font-black text-white text-lg flex items-center gap-2">
            <Megaphone className="w-5 h-5 text-blue-500" />
            Broadcast Message
          </h2>

          {/* Recipient Filter */}
          <div>
            <label className="text-blue-300 text-sm font-bold mb-2 block">Send To</label>
            <div className="flex flex-wrap gap-2">
              {RECIPIENT_OPTIONS.map(opt => (
                <button
                  key={opt.value}
                  onClick={() => setRecipientFilter(opt.value)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                    recipientFilter === opt.value
                      ? "bg-blue-700 text-white border-blue-600"
                      : "bg-blue-950/20 text-blue-300 border-blue-900/30 hover:bg-blue-900/40"
                  }`}
                >
                  {opt.emoji} {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Channel */}
          <div>
            <label className="text-blue-300 text-sm font-bold mb-2 block">Channel</label>
            <div className="flex gap-2">
              {(["in_app", "email", "both"] as const).map(c => (
                <button
                  key={c}
                  onClick={() => setChannel(c)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                    channel === c
                      ? "bg-[#1E90FF] text-white border-[#1E90FF]"
                      : "bg-[#1E90FF]/20 text-[#1E90FF] border-[#1E90FF]/30 hover:bg-[#1E90FF]/40"
                  }`}
                >
                  {c === "in_app" ? " In-App" : c === "email" ? " Email" : " Both"}
                </button>
              ))}
            </div>
          </div>

          {/* Templates */}
          <div>
            <label className="text-blue-300 text-sm font-bold mb-2 block">Quick Templates</label>
            <div className="flex flex-wrap gap-2">
              {MESSAGE_TEMPLATES.map(t => (
                <button
                  key={t.label}
                  onClick={() => { setSubject(t.subject); setBody(t.body); }}
                  className="px-3 py-1 rounded-lg text-xs bg-blue-950/30 text-blue-300 border border-blue-900/30 hover:bg-blue-900/40 transition-all font-bold"
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Subject */}
          <div>
            <label className="text-blue-300 text-sm font-bold mb-2 block">Subject</label>
            <Input
              value={subject}
              onChange={e => setSubject(e.target.value)}
              placeholder="e.g. New NIL Opportunity Available"
              className="bg-[#0d0d2a] border-blue-900 text-white placeholder:text-blue-700 rounded-xl"
            />
          </div>

          {/* Body */}
          <div>
            <label className="text-blue-300 text-sm font-bold mb-2 block">Message</label>
            <Textarea
              value={body}
              onChange={e => setBody(e.target.value)}
              placeholder="Write your message here..."
              rows={5}
              className="bg-[#0d0d2a] border-blue-900 text-white placeholder:text-blue-700 rounded-xl resize-none"
            />
            <div className="text-blue-700 text-xs mt-1 text-right">{body.length} characters</div>
          </div>

          {/* Send Button */}
          <Button
            onClick={handleSend}
            disabled={isPending || sent || !subject.trim() || !body.trim()}
            className={`w-full font-black py-3 rounded-xl text-base transition-all ${
              sent
                ? "bg-[#00C2FF] hover:bg-[#00C2FF]"
                : "bg-gradient-to-r from-blue-700 to-indigo-600 hover:from-blue-600 hover:to-indigo-500"
            } text-white shadow-lg`}
          >
            {sent ? (
              <><CheckCircle className="mr-2 w-5 h-5" /> Message Sent!</>
            ) : isPending ? (
              <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" /> Sending...</>
            ) : (
              <><Send className="mr-2 w-5 h-5" /> Broadcast to {RECIPIENT_OPTIONS.find(r => r.value === recipientFilter)?.label}</>
            )}
          </Button>

          {recipientFilter === "all" && (
            <div className="flex items-center gap-2 bg-[#1E90FF]/20 border border-[#1E90FF]/30 rounded-xl p-3">
              <AlertTriangle className="w-4 h-4 text-[#1E90FF] shrink-0" />
              <p className="text-[#1E90FF] text-xs">This will send to ALL users on the platform. Make sure your message is ready.</p>
            </div>
          )}
        </div>

        {/* Recent Broadcasts */}
        {broadcasts && broadcasts.length > 0 && (
          <div className="bg-[#1a1a3a] border border-blue-900/40 rounded-2xl p-5">
            <h2 className="font-black text-white text-lg mb-4 flex items-center gap-2">
              <Bell className="w-5 h-5 text-blue-500" /> Recent Broadcasts
            </h2>
            <div className="space-y-3">
              {broadcasts.slice(0, 10).map((b: any) => (
                <div key={b.id} className="bg-[#0d0d2a] rounded-xl p-4 border border-blue-950/30">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <div className="font-bold text-white text-sm">{b.subject}</div>
                    <Badge className="bg-blue-950/40 text-blue-300 border-blue-800/30 text-xs shrink-0">
                      {b.recipientCount} recipients
                    </Badge>
                  </div>
                  <p className="text-blue-500 text-xs line-clamp-2">{b.body}</p>
                  <div className="text-blue-700 text-xs mt-2">
                    {new Date(b.createdAt).toLocaleString()} · {b.channel} · {b.recipientFilter}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* User Directory */}
        <div className="bg-[#1a1a3a] border border-blue-900/40 rounded-2xl p-5">
          <h2 className="font-black text-white text-lg mb-4 flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-500" /> User Directory
          </h2>
          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-600" />
            <Input
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search users by name, email, sport, or school..."
              className="pl-9 bg-[#0d0d2a] border-blue-900 text-white placeholder:text-blue-700 rounded-xl"
            />
          </div>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {usersData?.users?.map((u: any) => (
              <div key={u.id} className="flex items-center gap-3 p-3 rounded-xl bg-[#0d0d2a] border border-blue-950/30 hover:border-blue-800/40 transition-all">
                <PartnerAvatar
                  email={u.email}
                  name={u.name}
                  dbAvatar={u.avatarUrl}
                  size="md"
                  ring={isMasterAdmin(u.email)}
                  className="shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="text-white font-bold text-sm truncate flex items-center gap-1.5">
                    {u.name || "Unknown User"}
                    {isMasterAdmin(u.email) && (
                      <Crown className="w-3.5 h-3.5 text-[#00C2FF] shrink-0" aria-label="Master Admin" />
                    )}
                  </div>
                  <div className="text-blue-500 text-xs truncate">{u.email} {u.sport ? `· ${u.sport}` : ""} {u.school ? `· ${u.school}` : ""}</div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {isMasterAdmin(u.email) ? (
                    <Badge className="bg-blue-500/20 text-[#00C2FF] border-blue-500/40 text-xs">Master Admin</Badge>
                  ) : u.role === "admin" && (
                    <Badge className="bg-blue-700/40 text-blue-200 border-blue-600/30 text-xs">Admin</Badge>
                  )}
                  {u.stripeSubscriptionId && (
                    <Badge className="bg-[#00C2FF]/40 text-[#00C2FF] border-[#00C2FF]/30 text-xs">Pro</Badge>
                  )}
                </div>
              </div>
            ))}
            {usersData?.users?.length === 0 && (
              <div className="text-center text-blue-600 py-8">No users found</div>
            )}
          </div>
          {usersData && (
            <div className="text-blue-600 text-xs mt-3 text-center">
              Showing {usersData.users?.length} of {usersData.total} users
            </div>
          )}
        </div>

      </div>
    </PlatformLayout>
  );
}

export default function MasterAdmin() {
  return <RouteErrorBoundary><MasterAdminInner /></RouteErrorBoundary>;
}
