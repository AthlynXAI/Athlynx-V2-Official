import { useState, useRef } from "react";
import { RouteErrorBoundary } from "@/components/GlobalErrorBoundary";
import PlatformLayout from "@/components/PlatformLayout";
import MobileBottomNav from '@/components/MobileBottomNav'
import { Link } from "wouter";
import { toast } from "sonner";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import LoginButton from "@/components/LoginButton";

function DashboardInner() {
  const { user, loading } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const [displayName, setDisplayName] = useState("");
  const nameInitialized = useRef(false);

  // ── Real tRPC queries ────────────────────────────────────────────────────────
  const { data: subscription, isLoading: subLoading } = trpc.stripe.getSubscription.useQuery(
    undefined,
    { enabled: !!user }
  );
  const { data: plans } = trpc.stripe.getPlans.useQuery();
  const { data: creditPacks } = trpc.stripe.getCreditPacks.useQuery();
  const { data: trainingStats, isLoading: statsLoading } = trpc.training.getStats.useQuery(
    undefined,
    { enabled: !!user }
  );
  const { data: trainingHistory } = trpc.training.getHistory.useQuery(
    { limit: 10 },
    { enabled: !!user }
  );
  const { data: nilDeals } = trpc.nil.getMyDeals.useQuery(
    undefined,
    { enabled: !!user, retry: false, refetchOnWindowFocus: false }
  );
  const { data: notifications } = trpc.notifications.getRecent.useQuery(
    undefined,
    { enabled: !!user, retry: false, refetchOnWindowFocus: false }
  );
  const { data: athletes } = trpc.profile.browseAthletes.useQuery(
    { limit: 10 },
    { enabled: !!user }
  );
  const { data: myProfile } = trpc.profile.getMyProfile.useQuery(
    undefined,
    { enabled: !!user }
  );

  // ── Mutations ────────────────────────────────────────────────────────────────
  const updateProfileMutation = trpc.profile.updateProfile.useMutation({
    onSuccess: () => toast.success("Profile updated!"),
    onError: (e) => toast.error(e.message),
  });
  const createCheckout = trpc.stripe.createSubscriptionCheckout.useMutation({
    onSuccess: (data) => { if (data.url) window.location.href = data.url; },
    onError: (e) => toast.error(e.message),
  });
  const createCreditsCheckout = trpc.stripe.createCreditsCheckout.useMutation({
    onSuccess: (data) => { if (data.url) window.location.href = data.url; },
    onError: (e) => toast.error(e.message),
  });
  const createBillingPortal = trpc.stripe.createBillingPortal.useMutation({
    onSuccess: (data) => { if (data.url) window.location.href = data.url; },
    onError: (e) => toast.error(e.message),
  });

  // ── Derived values ───────────────────────────────────────────────────────────
  const aiCredits = user?.credits ?? 0;
  const planName = subscription?.plan ?? "Free Trial";
  const planData = plans?.find((p) => p.id === subscription?.plan);
  const planPriceDisplay = planData ? `$${(planData.priceMonthly / 100).toFixed(2)}` : "Free";
  const nextBilling = subscription?.currentPeriodEnd
    ? new Date((subscription.currentPeriodEnd as number) * 1000).toLocaleDateString("en-US", {
        month: "long", day: "numeric", year: "numeric",
      })
    : "—";
  const isFounderIdentity = [
    "contact@athlynx.ai",
    "contact@athlynx.ai",
    "cdozier@dozierholdingsgroup.com",
  ].includes((user?.email ?? "").toLowerCase());

  if (user && !nameInitialized.current) {
    setDisplayName(user.name ?? "");
    nameInitialized.current = true;
  }

  const tabs = [
    { id: "overview",     name: "Overview",        icon: "🏠" },
    { id: "subscription", name: "Subscription",    icon: "💳" },
    { id: "credits",      name: "AI Credits",      icon: "🤖" },
    { id: "activity",     name: "Activity",        icon: "📊" },
    { id: "nil",          name: "NIL Deals",       icon: "💰" },
    { id: "athletes",     name: "Browse Athletes", icon: "🏃" },
    { id: "settings",     name: "Settings",        icon: "⚙️" },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="bg-black border border-blue-500/30 rounded-2xl p-8 max-w-md w-full text-center">
          <img src="/logo-owl-512.png" alt="AthlynX" className="w-20 h-20 mx-auto mb-4" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
          <h1 className="text-2xl font-black text-white mb-2 tracking-wide">Sign In</h1>
          <p className="text-white/60 mb-6 text-sm">One identity. Every athlete. Every platform.</p>
          <LoginButton className="inline-block w-full px-8 py-3 bg-[#1E90FF] hover:bg-blue-400 text-black font-black rounded-xl transition-colors">
            Continue with AthlynX
          </LoginButton>
          <p className="text-white/40 text-sm mt-4">
            <Link href="/" className="text-blue-400 hover:text-blue-300">← Back to Home</Link>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460]">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-xl border-b border-white/10">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl">⚡</span>
            <span className="text-xl font-black text-white">AthlynX</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm">
            <Link href="/home" className="text-gray-400 hover:text-white">Platform</Link>
            <Link href="/store" className="text-gray-400 hover:text-white">Store</Link>
            <Link href="/dashboard" className="text-red-400 font-semibold">Dashboard</Link>
          </nav>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-lg">
              <span className="text-red-400">🤖</span>
              <span className="text-white font-semibold">{aiCredits}</span>
              <span className="text-gray-400 text-sm">credits</span>
            </div>
            {user.avatarUrl ? (
              <img src={user.avatarUrl} alt={user.name ?? "User"} className="w-8 h-8 rounded-full object-cover" />
            ) : (
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center text-white font-bold text-sm">
                {user.name?.charAt(0) ?? "U"}
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="pt-20 pb-16 px-4">
        <div className="container mx-auto max-w-7xl">
          {/* ── PLAYER PROFILE CARD ── */}
          <div className="mb-6 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden">
            {/* Cover banner */}
            <div className="h-28 bg-gradient-to-r from-blue-900 via-cyan-900 to-blue-900 relative">
              {myProfile?.coverUrl && (
                <img src={myProfile.coverUrl} alt="Cover" className="w-full h-full object-cover absolute inset-0" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              {isFounderIdentity && (
                <div className="absolute top-3 right-3 bg-red-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full tracking-widest uppercase">
                  FOUNDER
                </div>
              )}
            </div>
            {/* Profile info */}
            <div className="px-5 pb-5">
              <div className="flex items-end justify-between -mt-10 mb-3">
                {/* Avatar */}
                <div className="w-20 h-20 rounded-full border-4 border-[#1a1a2e] overflow-hidden bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shrink-0">
                  {user.avatarUrl ? (
                    <img src={user.avatarUrl} alt={user.name ?? ""} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-white font-black text-2xl">{user.name?.charAt(0) ?? "A"}</span>
                  )}
                </div>
                {/* Action buttons */}
                <div className="flex gap-2 pb-1">
                  <a href="/profile" className="bg-cyan-500 hover:bg-cyan-400 text-black text-xs font-black px-4 py-2 rounded-full transition-all">
                    Edit Profile
                  </a>
                  <a href="/x-factor" className="bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-bold px-4 py-2 rounded-full transition-all">
                    X-Factor Feed
                  </a>
                </div>
              </div>
              {/* Name + role */}
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <h2 className="text-xl font-black text-white">{user.name ?? "Athlete"}</h2>
                <svg className="w-5 h-5 text-cyan-400" fill="currentColor" viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/></svg>
                {isFounderIdentity ? (
                  <span className="text-[10px] font-black bg-red-500/20 text-red-400 border border-red-500/30 px-2 py-0.5 rounded-full uppercase tracking-wider">Founder · CEO · Chairman</span>
                ) : user.role === "admin" ? (
                  <span className="text-[10px] font-black bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 px-2 py-0.5 rounded-full uppercase tracking-wider">Team Admin</span>
                ) : null}
              </div>
              {/* Sport / School / Position */}
              <div className="text-cyan-400 text-sm mb-2">
                {[myProfile?.position, myProfile?.sport, myProfile?.school].filter(Boolean).join(" • ") || "Complete your profile →"}
              </div>
              {/* Bio */}
              <p className="text-gray-300 text-sm leading-relaxed mb-4 max-w-2xl">
                {myProfile?.bio || "Your bio will appear here. Click Edit Profile to add it."}
              </p>
              {/* Stats row */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                {[
                  { label: "Sport", value: myProfile?.sport || "—" },
                  { label: "School", value: myProfile?.school || "—" },
                  { label: "NIL Value", value: myProfile?.nilValue ? `$${Number(myProfile.nilValue).toLocaleString()}` : "—" },
                  { label: "Plan", value: planName || "Free" },
                ].map((s) => (
                  <div key={s.label} className="bg-white/5 rounded-xl p-3 text-center">
                    <div className="text-white font-black text-sm truncate">{s.value}</div>
                    <div className="text-gray-500 text-xs mt-0.5">{s.label}</div>
                  </div>
                ))}
              </div>
              {/* ─── ATHLETE RECRUITING CARD — AthlynX STYLE ─── */}
              {myProfile && (
                <div className="mt-3 space-y-3">
                  {/* Coaches Viewed Banner */}
                  {(myProfile as any).coachViews > 0 && (
                    <div className="flex items-center gap-3 bg-gradient-to-r from-blue-900/60 to-cyan-900/40 border border-cyan-500/30 rounded-xl p-3">
                      <div className="relative shrink-0">
                        <div className="w-12 h-12 bg-blue-700/50 rounded-xl flex items-center justify-center">
                          <svg className="w-6 h-6 text-cyan-400" fill="currentColor" viewBox="0 0 24 24"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/></svg>
                        </div>
                        <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white text-[10px] font-black">{(myProfile as any).coachViews}</span>
                      </div>
                      <div>
                        <div className="text-white font-black text-sm">{(myProfile as any).coachViews} COACHES VIEWED YOUR PROFILE TODAY</div>
                        <div className="text-cyan-400 text-xs">Your recruiting profile is getting attention 🔥</div>
                      </div>
                    </div>
                  )}
                  {/* Sport Stats */}
                  {(myProfile as any).sportStats && (
                    <div className="bg-white/5 border border-white/10 rounded-xl p-3">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-white font-bold text-xs">ATHLETE STATS</span>
                        {(myProfile as any).nilVerified && (
                          <span className="flex items-center gap-1 text-[10px] font-black text-cyan-400 bg-cyan-900/40 border border-cyan-500/30 px-2 py-0.5 rounded-full">
                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/></svg>
                            NIL VERIFIED
                          </span>
                        )}
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        {(() => {
                          const stats = (myProfile as any).sportStats as any;
                          const items = [
                            stats.fortyYardDash ? { label: "40 YD DASH", value: stats.fortyYardDash } : null,
                            stats.gpa ? { label: "GPA", value: stats.gpa } : null,
                            stats.qbRating ? { label: "QB RATING", value: stats.qbRating } : null,
                            stats.height ? { label: "HEIGHT", value: stats.height } : null,
                            stats.weight ? { label: "WEIGHT", value: `${stats.weight} LBS` } : null,
                            stats.verticalLeap ? { label: "VERTICAL", value: `${stats.verticalLeap}"` } : null,
                            ...((stats.custom || []) as any[]).map((c: any) => ({ label: c.label.toUpperCase(), value: c.value })),
                          ].filter(Boolean).slice(0, 6);
                          return items.map((item: any, i: number) => (
                            <div key={i} className="bg-white/5 rounded-lg p-2 text-center">
                              <div className="text-white font-black text-sm">{item.value}</div>
                              <div className="text-gray-400 text-[10px] mt-0.5">{item.label}</div>
                            </div>
                          ));
                        })()}
                      </div>
                    </div>
                  )}
                  {/* Colleges Showing Interest */}
                  {(myProfile as any).collegesInterested && ((myProfile as any).collegesInterested as any[]).length > 0 && (
                    <div className="bg-white/5 border border-white/10 rounded-xl p-3">
                      <div className="text-white font-bold text-xs mb-2">COLLEGES SHOWING INTEREST</div>
                      <div className="flex gap-3 flex-wrap">
                        {((myProfile as any).collegesInterested as any[]).map((c: any, i: number) => (
                          <div key={i} className="flex items-center gap-2 bg-white/5 rounded-lg px-3 py-2">
                            {c.logo && <img src={c.logo} alt={c.name} className="w-8 h-8 object-contain" onError={(e) => { (e.target as HTMLImageElement).style.display='none'; }} />}
                            <span className="text-white text-xs font-bold">{c.name}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {/* Highlight Reel */}
                  {myProfile.highlightUrl && (
                    <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
                      <div className="text-white font-bold text-xs p-3 pb-2">HIGHLIGHT REEL</div>
                      <video className="w-full max-h-48 object-cover" controls muted playsInline>
                        <source src={myProfile.highlightUrl} />
                      </video>
                    </div>
                  )}
                </div>
              )}
              {/* Social links */}
              {(myProfile?.instagram || myProfile?.twitter) && (                <div className="flex gap-3 flex-wrap">
                  {myProfile?.instagram && (
                    <a href={`https://instagram.com/${myProfile.instagram}`} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-xs text-pink-400 hover:text-pink-300 bg-pink-500/10 border border-pink-500/20 px-3 py-1.5 rounded-full transition-all">
                      📸 @{myProfile.instagram}
                    </a>
                  )}
                  {myProfile?.twitter && (
                    <a href={`https://twitter.com/${myProfile.twitter}`} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-xs text-sky-400 hover:text-sky-300 bg-sky-500/10 border border-sky-500/20 px-3 py-1.5 rounded-full transition-all">
                      🐦 @{myProfile.twitter}
                    </a>
                  )}
                  <a href="/community-feedback"
                    className="flex items-center gap-1.5 text-xs text-cyan-400 hover:text-cyan-300 bg-cyan-500/10 border border-cyan-500/20 px-3 py-1.5 rounded-full transition-all">
                    💬 Talk to the Founder
                  </a>
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-6 flex-col lg:flex-row">
            {/* Sidebar */}
            <div className="lg:w-64 flex-shrink-0">
              <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all ${
                      activeTab === tab.id
                        ? "bg-red-500 text-white font-semibold"
                        : "text-gray-400 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    <span>{tab.icon}</span>
                    <span>{tab.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1">

              {/* ── OVERVIEW ─────────────────────────────────────────────── */}
              {activeTab === "overview" && (
                <div className="space-y-6">
                  <div className="grid md:grid-cols-3 gap-4">
                    {/* Plan card */}
                    <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-5">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-gray-400 text-sm">Current Plan</span>
                        <span className="px-2 py-1 bg-red-500/20 text-red-400 rounded text-xs font-semibold uppercase">
                          {planName}
                        </span>
                      </div>
                      {subLoading ? (
                        <div className="h-8 bg-white/10 rounded animate-pulse" />
                      ) : (
                        <>
                          <p className="text-2xl font-bold text-white">{planPriceDisplay}/mo</p>
                          <p className="text-gray-500 text-sm mt-1">Next billing: {nextBilling}</p>
                        </>
                      )}
                    </div>

                    {/* Credits card */}
                    <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-5">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-gray-400 text-sm">AI Credits</span>
                        <span className="text-cyan-400">🤖</span>
                      </div>
                      <p className="text-2xl font-bold text-white">{aiCredits}</p>
                      <p className="text-gray-500 text-sm mt-1">Available credits</p>
                    </div>

                    {/* Training card */}
                    <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-5">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-gray-400 text-sm">Training Sessions</span>
                        <span className="text-green-400">💪</span>
                      </div>
                      {statsLoading ? (
                        <div className="h-8 bg-white/10 rounded animate-pulse" />
                      ) : (
                        <>
                          <p className="text-2xl font-bold text-white">{trainingStats?.totalSessions ?? 0}</p>
                          <p className="text-gray-500 text-sm mt-1">{trainingStats?.totalMinutes ?? 0} total minutes</p>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Recent Activity from notifications */}
                  <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-5">
                    <h3 className="text-lg font-bold text-white mb-4">Recent Activity</h3>
                    {!notifications || notifications.length === 0 ? (
                      <div className="text-center py-8">
                        <span className="text-4xl block mb-2">📭</span>
                        <p className="text-gray-400">No recent activity yet.</p>
                        <p className="text-gray-500 text-sm mt-1">
                          Start training or create a NIL deal to see activity here.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {notifications.slice(0, 5).map((n: any) => (
                          <div
                            key={n.id}
                            className="flex items-center justify-between py-2 border-b border-white/5 last:border-0"
                          >
                            <div className="flex items-center gap-3">
                              <span className="text-xl">
                                {n.type === "credit_added" ? "🤖"
                                  : n.type === "achievement" ? "🏆"
                                  : n.type === "welcome" ? "👋"
                                  : "🔔"}
                              </span>
                              <div>
                                <p className="text-white text-sm">{n.title}</p>
                                {n.message && <p className="text-gray-500 text-xs">{n.message}</p>}
                                <p className="text-gray-600 text-xs">
                                  {new Date(n.createdAt).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                            {n.isRead === "no" && (
                              <span className="w-2 h-2 rounded-full bg-cyan-400 flex-shrink-0" />
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* NIL Deals summary */}
                  {nilDeals && nilDeals.length > 0 && (
                    <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-5">
                      <h3 className="text-lg font-bold text-white mb-4">Your NIL Deals</h3>
                      <div className="space-y-3">
                        {nilDeals.slice(0, 3).map((deal: any) => (
                          <div
                            key={deal.id}
                            className="flex items-center justify-between py-2 border-b border-white/5 last:border-0"
                          >
                            <div>
                              <p className="text-white text-sm font-semibold">{deal.brandName}</p>
                              {deal.description && (
                                <p className="text-gray-500 text-xs">{deal.description}</p>
                              )}
                            </div>
                            <div className="text-right">
                              <p className="text-green-400 font-bold">
                                ${(deal.dealValue ?? 0).toLocaleString()}
                              </p>
                              <span
                                className={`text-xs px-2 py-0.5 rounded-full ${
                                  deal.status === "active"
                                    ? "bg-green-500/20 text-green-400"
                                    : deal.status === "pending"
                                    ? "bg-blue-900/30/20 text-blue-300"
                                    : "bg-gray-500/20 text-gray-400"
                                }`}
                              >
                                {deal.status}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                      <Link
                        href="/nil-portal"
                        className="block mt-4 text-center text-cyan-400 hover:underline text-sm"
                      >
                        View All NIL Deals →
                      </Link>
                    </div>
                  )}
                </div>
              )}

              {/* ── SUBSCRIPTION ─────────────────────────────────────────── */}
              {activeTab === "subscription" && (
                <div className="space-y-6">
                  <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6">
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h3 className="text-xl font-bold text-white">Your Subscription</h3>
                        <p className="text-gray-400">Manage your plan and billing</p>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          subscription?.status === "active"
                            ? "bg-green-500/20 text-green-400"
                            : subscription?.status === "trialing"
                            ? "bg-blue-900/30/20 text-blue-300"
                            : "bg-gray-500/20 text-gray-400"
                        }`}
                      >
                        {!subscription?.status || subscription.status === "none"
                          ? "Free Trial"
                          : subscription.status}
                      </span>
                    </div>

                    {subLoading ? (
                      <div className="h-24 bg-white/10 rounded-xl animate-pulse mb-6" />
                    ) : !subscription?.plan || subscription.status === "none" ? (
                      /* No active plan — show upgrade options */
                      <div className="mb-6">
                        <p className="text-gray-300 mb-4 text-center">
                          You're on the free trial. Upgrade to unlock all features.
                        </p>
                        <div className="grid md:grid-cols-3 gap-4">
                          {plans?.map((plan) => (
                            <div
                              key={plan.id}
                              className="bg-white/5 rounded-xl p-4 border border-white/10"
                            >
                              <p className="text-white font-bold mb-1">{plan.name}</p>
                              <p className="text-2xl font-bold text-cyan-400 mb-1">
                                ${(plan.priceMonthly / 100).toFixed(2)}
                                <span className="text-sm text-gray-400">/mo</span>
                              </p>
                              <ul className="text-gray-400 text-xs mb-3 space-y-1">
                                {plan.features.slice(0, 3).map((f, i) => (
                                  <li key={i} className="flex items-center gap-1">
                                    <span className="text-green-400">✓</span> {f}
                                  </li>
                                ))}
                              </ul>
                              <button
                                onClick={() =>
                                  createCheckout.mutate({
                                    planId: plan.id,
                                    interval: "month",
                                    origin: window.location.origin,
                                  })
                                }
                                disabled={createCheckout.isPending}
                                className="w-full py-2 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-400 transition-all text-sm disabled:opacity-50"
                              >
                                Subscribe
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      /* Active plan */
                      <div className="bg-gradient-to-r from-red-500/20 to-red-600/20 rounded-xl p-6 mb-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-red-400 font-semibold mb-1">
                              AthlynX {planData?.name ?? planName}
                            </p>
                            <p className="text-3xl font-bold text-white">
                              {planPriceDisplay}
                              <span className="text-lg text-gray-400">/month</span>
                            </p>
                          </div>
                          <button
                            onClick={() =>
                              createBillingPortal.mutate({
                                origin: window.location.origin,
                              })
                            }
                            disabled={createBillingPortal.isPending}
                            className="px-6 py-2 bg-white/10 text-white font-semibold rounded-lg hover:bg-white/20 transition-all disabled:opacity-50"
                          >
                            Manage Billing
                          </button>
                        </div>
                      </div>
                    )}

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="bg-white/5 rounded-lg p-4">
                        <p className="text-gray-400 text-sm mb-1">Next Billing Date</p>
                        <p className="text-white font-semibold">{nextBilling}</p>
                      </div>
                      <div className="bg-white/5 rounded-lg p-4">
                        <p className="text-gray-400 text-sm mb-1">Plan Status</p>
                        <p className="text-white font-semibold capitalize">
                          {subscription?.status ?? "Free Trial"}
                        </p>
                      </div>
                    </div>

                    {planData?.features && (
                      <div className="mt-6 pt-6 border-t border-white/10">
                        <h4 className="text-white font-semibold mb-3">Plan Features</h4>
                        <div className="grid md:grid-cols-2 gap-2">
                          {planData.features.map((feature, i) => (
                            <div key={i} className="flex items-center gap-2 text-gray-400 text-sm">
                              <span className="text-green-400">✓</span>
                              {feature}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* ── AI CREDITS ───────────────────────────────────────────── */}
              {activeTab === "credits" && (
                <div className="space-y-6">
                  <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6">
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h3 className="text-xl font-bold text-white">AI Credits</h3>
                        <p className="text-gray-400">Power your AI coaching and analysis</p>
                      </div>
                      <div className="text-right">
                        <p className="text-3xl font-bold text-cyan-400">{aiCredits}</p>
                        <p className="text-gray-500 text-sm">credits remaining</p>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-4 mb-6">
                      {creditPacks?.map((pack) => (
                        <div
                          key={pack.id}
                          className={`relative rounded-xl p-5 border ${
                            pack.credits === 500
                              ? "bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border-cyan-500/50"
                              : "bg-white/5 border-white/10"
                          }`}
                        >
                          {pack.credits === 500 && (
                            <span className="absolute -top-2 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-cyan-500 text-black text-xs font-bold rounded-full">
                              BEST VALUE
                            </span>
                          )}
                          <p className="text-3xl font-bold text-white text-center mb-1">
                            {pack.credits.toLocaleString()}
                          </p>
                          <p className="text-gray-400 text-center text-sm mb-3">credits</p>
                          <p className="text-xl font-bold text-cyan-400 text-center mb-4">
                            ${(pack.price / 100).toFixed(2)}
                          </p>
                          <button
                            onClick={() =>
                              createCreditsCheckout.mutate({
                                packId: pack.id,
                                origin: window.location.origin,
                              })
                            }
                            disabled={createCreditsCheckout.isPending}
                            className={`w-full py-2 rounded-lg font-semibold transition-all disabled:opacity-50 ${
                              pack.credits === 500
                                ? "bg-cyan-500 text-black hover:bg-cyan-400"
                                : "bg-white/10 text-white hover:bg-white/20"
                            }`}
                          >
                            Buy Now
                          </button>
                        </div>
                      ))}
                    </div>

                    <div className="bg-white/5 rounded-lg p-4">
                      <h4 className="text-white font-semibold mb-3">Credit Usage Guide</h4>
                      <div className="grid md:grid-cols-2 gap-2 text-sm">
                        {[
                          { action: "Training Plan Generation", credits: 5 },
                          { action: "Video Analysis", credits: 10 },
                          { action: "Recruiting Email", credits: 3 },
                          { action: "Performance Report", credits: 8 },
                          { action: "AI Chat Session", credits: 1 },
                          { action: "Scouting Report", credits: 15 },
                        ].map((item, i) => (
                          <div key={i} className="flex items-center justify-between text-gray-400">
                            <span>{item.action}</span>
                            <span className="text-cyan-400">{item.credits} credits</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ── ACTIVITY ─────────────────────────────────────────────── */}
              {activeTab === "activity" && (
                <div className="space-y-6">
                  <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6">
                    <h3 className="text-xl font-bold text-white mb-6">Training Stats</h3>
                    {statsLoading ? (
                      <div className="h-24 bg-white/10 rounded animate-pulse" />
                    ) : (
                      <div className="grid md:grid-cols-4 gap-4 mb-6">
                        {[
                          { label: "Total Sessions", value: trainingStats?.totalSessions ?? 0, icon: "💪" },
                          { label: "Total Minutes",  value: trainingStats?.totalMinutes ?? 0,  icon: "⏱️" },
                          { label: "Avg Performance",value: `${trainingStats?.avgPerformance ?? 0}/10`, icon: "📈" },
                          { label: "Streak",         value: `${trainingStats?.streak ?? 0} days`, icon: "🔥" },
                        ].map((stat, i) => (
                          <div key={i} className="bg-white/5 rounded-lg p-4 text-center">
                            <span className="text-2xl block mb-1">{stat.icon}</span>
                            <p className="text-2xl font-bold text-white">{stat.value}</p>
                            <p className="text-gray-400 text-sm">{stat.label}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6">
                    <h3 className="text-lg font-bold text-white mb-4">Recent Workouts</h3>
                    {!trainingHistory || trainingHistory.length === 0 ? (
                      <div className="text-center py-8">
                        <span className="text-4xl block mb-2">🏋️</span>
                        <p className="text-gray-400">No workouts logged yet.</p>
                        <Link
                          href="/ai-training-bot"
                          className="inline-block mt-3 px-4 py-2 bg-cyan-500 text-black font-semibold rounded-lg text-sm"
                        >
                          Start Training →
                        </Link>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {trainingHistory.map((log: any) => (
                          <div
                            key={log.id}
                            className="flex items-center justify-between py-2 border-b border-white/5 last:border-0"
                          >
                            <div>
                              <p className="text-white text-sm font-semibold">{log.workout}</p>
                              {log.notes && <p className="text-gray-500 text-xs">{log.notes}</p>}
                              <p className="text-gray-600 text-xs">
                                {new Date(log.logDate).toLocaleDateString()}
                              </p>
                            </div>
                            <div className="text-right">
                              {log.duration && (
                                <p className="text-cyan-400 text-sm">{log.duration} min</p>
                              )}
                              {log.performance && (
                                <p className="text-gray-400 text-xs">{log.performance}/10</p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* ── NIL DEALS ────────────────────────────────────────────── */}
              {activeTab === "nil" && (
                <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6">
                  <h3 className="text-xl font-bold text-white mb-6">My NIL Deals</h3>
                  {!nilDeals || nilDeals.length === 0 ? (
                    <div className="text-center py-12">
                      <span className="text-5xl block mb-3">💰</span>
                      <p className="text-gray-400 mb-2">No NIL deals yet.</p>
                      <p className="text-gray-500 text-sm mb-4">
                        Start building your brand and attracting sponsors.
                      </p>
                      <Link
                        href="/nil-portal"
                        className="inline-block px-6 py-2 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-400 transition-all"
                      >
                        Explore NIL Portal →
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {nilDeals.map((deal: any) => (
                        <div key={deal.id} className="bg-white/5 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-white font-semibold">{deal.brandName}</span>
                            <span
                              className={`px-2 py-1 rounded text-xs font-semibold ${
                                deal.status === "active"
                                  ? "bg-green-500/20 text-green-400"
                                  : deal.status === "pending"
                                  ? "bg-blue-900/30/20 text-blue-300"
                                  : deal.status === "completed"
                                  ? "bg-blue-500/20 text-blue-400"
                                  : "bg-red-500/20 text-red-400"
                              }`}
                            >
                              {deal.status}
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-400">{deal.category ?? "General"}</span>
                            <span className="text-green-400 font-bold">
                              ${(deal.dealValue ?? 0).toLocaleString()}
                            </span>
                          </div>
                          {deal.description && (
                            <p className="text-gray-500 text-xs mt-1">{deal.description}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                  <Link
                    href="/nil-portal"
                    className="block mt-6 text-center text-cyan-400 hover:underline"
                  >
                    Browse All NIL Opportunities →
                  </Link>
                </div>
              )}

              {/* ── BROWSE ATHLETES ──────────────────────────────────────── */}
              {activeTab === "athletes" && (
                <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6">
                  <h3 className="text-xl font-bold text-white mb-6">Browse Athletes</h3>
                  {!athletes || athletes.length === 0 ? (
                    <div className="text-center py-12">
                      <span className="text-5xl block mb-3">🏃</span>
                      <p className="text-gray-400 mb-2">No athlete profiles yet.</p>
                      <p className="text-gray-500 text-sm">
                        Be the first to complete your athlete profile!
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {athletes.map((athlete: any) => (
                        <div
                          key={athlete.id}
                          className="flex items-center justify-between bg-white/5 rounded-lg p-4"
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold overflow-hidden">
                              {athlete.avatarUrl ? (
                                <img
                                  src={athlete.avatarUrl}
                                  alt={athlete.name ?? ""}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                athlete.name?.charAt(0) ?? "A"
                              )}
                            </div>
                            <div>
                              <p className="text-white font-semibold">{athlete.name ?? "Athlete"}</p>
                              <p className="text-gray-400 text-sm">
                                {athlete.position ?? "—"} • {athlete.sport ?? "—"}
                                {athlete.classYear ? ` • Class of ${athlete.classYear}` : ""}
                              </p>
                              {athlete.school && (
                                <p className="text-gray-500 text-xs">{athlete.school}</p>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            {athlete.nilValue && athlete.nilValue > 0 && (
                              <span className="text-green-400 font-bold text-sm">
                                ${athlete.nilValue.toLocaleString()}
                              </span>
                            )}
                            <span
                              className={`text-xs px-2 py-1 rounded-full ${
                                athlete.recruitingStatus === "available"
                                  ? "bg-green-500/20 text-green-400"
                                  : athlete.recruitingStatus === "committed"
                                  ? "bg-blue-500/20 text-blue-400"
                                  : "bg-gray-500/20 text-gray-400"
                              }`}
                            >
                              {athlete.recruitingStatus ?? "unknown"}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  <Link
                    href="/diamond-grind"
                    className="block mt-6 text-center text-cyan-400 hover:underline"
                  >
                    Full Athlete Directory →
                  </Link>
                </div>
              )}

              {/* ── SETTINGS ─────────────────────────────────────────────── */}
              {activeTab === "settings" && (
                <div className="space-y-6">
                  <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6">
                    <h3 className="text-xl font-bold text-white mb-6">Account Settings</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="text-gray-400 text-sm block mb-2">Display Name</label>
                        <input
                          type="text"
                          value={displayName}
                          onChange={(e) => setDisplayName(e.target.value)}
                          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500"
                        />
                      </div>
                      <div>
                        <label className="text-gray-400 text-sm block mb-2">Email</label>
                        <input
                          type="email"
                          defaultValue={user.email ?? ""}
                          readOnly
                          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-gray-400 cursor-not-allowed"
                        />
                        <p className="text-gray-600 text-xs mt-1">
                          Email is managed by your sign-in provider.
                        </p>
                      </div>
                      <div>
                        <label className="text-gray-400 text-sm block mb-2">Sport</label>
                        <input
                          type="text"
                          defaultValue={myProfile?.sport ?? (user as any).sport ?? ""}
                          onBlur={(e) =>
                            e.target.value && updateProfileMutation.mutate({ sport: e.target.value })
                          }
                          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500"
                          placeholder="e.g. Football"
                        />
                      </div>
                      <div>
                        <label className="text-gray-400 text-sm block mb-2">School</label>
                        <input
                          type="text"
                          defaultValue={myProfile?.school ?? (user as any).school ?? ""}
                          onBlur={(e) =>
                            e.target.value && updateProfileMutation.mutate({ school: e.target.value })
                          }
                          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500"
                          placeholder="e.g. University of Texas"
                        />
                      </div>
                      <div>
                        <label className="text-gray-400 text-sm block mb-2">Bio</label>
                        <textarea
                          defaultValue={myProfile?.bio ?? ""}
                          onBlur={(e) =>
                            updateProfileMutation.mutate({ bio: e.target.value })
                          }
                          rows={3}
                          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 resize-none"
                          placeholder="Tell scouts and brands about yourself..."
                        />
                      </div>
                      <button
                        onClick={() =>
                          updateProfileMutation.mutate({
                            sport: myProfile?.sport ?? undefined,
                            school: myProfile?.school ?? undefined,
                            bio: myProfile?.bio ?? undefined,
                          })
                        }
                        disabled={updateProfileMutation.isPending}
                        className="px-6 py-2 bg-cyan-500 text-black font-semibold rounded-lg hover:bg-cyan-400 transition-all disabled:opacity-50"
                      >
                        {updateProfileMutation.isPending ? "Saving..." : "Save Changes"}
                      </button>
                    </div>
                  </div>

                  {/* Account Info */}
                  <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6">
                    <h3 className="text-lg font-bold text-white mb-4">Account Info</h3>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Role</span>
                        <span className="text-white capitalize">{user.role}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Member Since</span>
                        <span className="text-white">
                          {new Date((user as any).createdAt).toLocaleDateString("en-US", {
                            month: "long",
                            year: "numeric",
                          })}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Login Method</span>
                        <span className="text-white capitalize">{(user as any).loginMethod ?? "—"}</span>
                      </div>
                      {user.trialEndsAt && (
                        <div className="flex justify-between">
                          <span className="text-gray-400">Trial Ends</span>
                          <span className="text-blue-300">
                            {new Date(user.trialEndsAt).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="bg-red-500/10 backdrop-blur-sm rounded-xl border border-red-500/20 p-6">
                    <h3 className="text-lg font-bold text-red-400 mb-2">Danger Zone</h3>
                    <p className="text-gray-400 text-sm mb-4">
                      Once you delete your account, there is no going back.
                    </p>
                    <button className="px-6 py-2 bg-red-500/20 text-red-400 font-semibold rounded-lg hover:bg-red-500/30 transition-all">
                      Delete Account
                    </button>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      </div>
      <MobileBottomNav />
    </div>
  );
}

export default function Dashboard() {
  return <RouteErrorBoundary><DashboardInner /></RouteErrorBoundary>;
}
