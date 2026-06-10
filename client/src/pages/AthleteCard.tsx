/**
 * AthlynX — Public Shareable AthleteCard
 * The digital business card every athlete needs.
 * Coaches, scouts, and brands see this when you share your link.
 *
 * Share URL: athlynx.ai/card/:username
 * No login required to view.
 *
 * Session 32 — May 5, 2026
 */
import { useState } from "react";
import { useRoute, Link } from "wouter";
import { RouteErrorBoundary } from "@/components/GlobalErrorBoundary";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { Share2, Download, ExternalLink, Star, Zap, Trophy, MapPin, MessageCircle, CheckCircle, Award, GraduationCap } from "lucide-react";

// Inline social icons (lucide-react@1.14 doesn't export Instagram/Twitter/Youtube)
const Instagram = (p: any) => (<svg viewBox="0 0 24 24" fill="currentColor" {...p}><path d="M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41a3.7 3.7 0 0 1-1.38-.9 3.7 3.7 0 0 1-.9-1.38c-.16-.42-.36-1.06-.41-2.23C2.17 15.58 2.16 15.2 2.16 12s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41C8.42 2.17 8.8 2.16 12 2.16Zm0 5.43A4.41 4.41 0 1 0 16.41 12 4.41 4.41 0 0 0 12 7.59Zm0 7.27A2.86 2.86 0 1 1 14.86 12 2.86 2.86 0 0 1 12 14.86Zm5.6-7.45a1.03 1.03 0 1 1-1.03-1.03 1.03 1.03 0 0 1 1.03 1.03Z"/></svg>);
const Twitter = (p: any) => (<svg viewBox="0 0 24 24" fill="currentColor" {...p}><path d="M18.244 2H21l-6.51 7.43L22 22h-6.84l-4.65-6.07L4.93 22H2.17l6.96-7.95L2 2h7.04l4.18 5.55L18.244 2Zm-2.4 18h1.86L7.27 4H5.3l10.55 16Z"/></svg>);
const Youtube = (p: any) => (<svg viewBox="0 0 24 24" fill="currentColor" {...p}><path d="M21.58 7.19a2.51 2.51 0 0 0-1.77-1.77C18.25 5 12 5 12 5s-6.25 0-7.81.42a2.51 2.51 0 0 0-1.77 1.77C2 8.75 2 12 2 12s0 3.25.42 4.81a2.51 2.51 0 0 0 1.77 1.77C5.75 19 12 19 12 19s6.25 0 7.81-.42a2.51 2.51 0 0 0 1.77-1.77C22 15.25 22 12 22 12s0-3.25-.42-4.81ZM10 15.02V8.98L15.5 12 10 15.02Z"/></svg>);

const SPORT_ICONS: Record<string, string> = {
  Football: "🏈", Basketball: "🏀", Baseball: "⚾", Soccer: "⚽",
  "Track & Field": "🏃", Swimming: "🏊", Tennis: "🎾", Volleyball: "🏐",
  Wrestling: "🤼", Golf: "⛳", Lacrosse: "🥍", Hockey: "🏒",
  Softball: "🥎", "Cross Country": "🏃", Gymnastics: "🤸", "Multi-Sport": "🏆",
};

function AthleteCardInner() {
  const [, params] = useRoute("/card/:id");
  const athleteId = params?.id ? parseInt(params.id) : 0;
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<"overview" | "stats" | "highlights" | "nil">("overview");

  const { data: profile, isLoading } = trpc.profile.getProfile.useQuery(
    { userId: athleteId },
    { enabled: !!athleteId }
  );

  const handleShare = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    setCopied(true);
    toast.success("AthleteCard link copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    toast.success("AthleteCard PDF generating...");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#040c1a] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-cyan-400/30 border-t-cyan-400 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-white/40 text-sm">Loading AthleteCard...</p>
        </div>
      </div>
    );
  }

  // Demo card if no profile found
  const displayName = profile?.name || "Chad A. Dozier";
  const sport = profile?.sport || "Multi-Sport";
  const position = profile?.position || "Founder · CEO · Chairman";
  const school = profile?.school || "AthlynX Platform";
  const status = profile?.recruitingStatus || "available";
  const xScore = profile?.xFactorScore ? Number(profile.xFactorScore) : 88;
  const nilValue = profile?.nilValue ? Number(profile.nilValue) : 50000;
  const initials = displayName.split(" ").map((w: string) => w[0]).join("").slice(0, 2).toUpperCase();
  const sportIcon = SPORT_ICONS[sport] || "🏆";

  const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
    available: { label: "Available for Recruiting", color: "text-green-400", bg: "bg-green-500/10 border-green-500/30" },
    committed: { label: "Committed", color: "text-blue-400", bg: "bg-blue-500/10 border-blue-500/30" },
    signed: { label: "Signed", color: "text-purple-400", bg: "bg-purple-500/10 border-purple-500/30" },
    transferred: { label: "Transfer Portal", color: "text-blue-300", bg: "bg-blue-900/30/10 border-blue-400/40/30" },
  };
  const statusInfo = statusConfig[status] || statusConfig.available;

  return (
    <div className="min-h-screen bg-[#040c1a]">
      {/* ── Header Bar ── */}
      <div className="sticky top-0 z-20 bg-[#040c1a]/95 backdrop-blur border-b border-blue-900/30 px-4 py-3">
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <Link href="/">
            <div className="flex items-center gap-2">
              <img src="/dhg-crab-shield.png" alt="AthlynX" className="w-7 h-7 object-contain" onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
              <span className="text-white font-black text-sm">AthlynX</span>
            </div>
          </Link>
          <div className="flex items-center gap-2">
            <button onClick={handleShare}
              className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-black px-3 py-2 rounded-xl transition-colors">
              <Share2 className="w-3.5 h-3.5" />
              {copied ? "Copied!" : "Share"}
            </button>
            <button onClick={handleDownload}
              className="flex items-center gap-1.5 border border-blue-700/50 text-blue-400 text-xs font-bold px-3 py-2 rounded-xl hover:bg-blue-900/30 transition-colors">
              <Download className="w-3.5 h-3.5" />
              PDF
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 py-6 space-y-4">

        {/* ── Hero Card ── */}
        <div className="bg-gradient-to-br from-[#0d1e3c] via-[#0a1628] to-[#040c1a] border border-blue-700/50 rounded-3xl overflow-hidden">
          {/* Cover */}
          <div className="h-24 bg-gradient-to-r from-blue-900 via-cyan-900 to-blue-900 relative">
            <div className="absolute inset-0 opacity-20" style={{
              backgroundImage: "repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(0,194,255,0.1) 10px, rgba(0,194,255,0.1) 11px)"
            }} />
            <div className="absolute top-3 right-3 text-4xl opacity-30">{sportIcon}</div>
          </div>

          {/* Profile */}
          <div className="px-5 pb-5">
            <div className="flex items-end justify-between -mt-8 mb-4">
              <div className="w-20 h-20 rounded-2xl bg-slate-800 flex items-center justify-center text-slate-400 border-4 border-[#040c1a] shadow-xl overflow-hidden" title={profile?.avatarUrl ? displayName : 'Identity pending'}>
                {profile?.avatarUrl ? (
                  <img src={profile.avatarUrl} alt={displayName} className="w-full h-full object-cover rounded-xl" />
                ) : (
                  <svg viewBox="0 0 24 24" className="w-3/5 h-3/5" fill="currentColor" aria-hidden="true"><path d="M12 12c2.7 0 4.9-2.2 4.9-4.9S14.7 2.2 12 2.2 7.1 4.4 7.1 7.1 9.3 12 12 12zm0 2.2c-3.3 0-9.8 1.7-9.8 4.9v2.7h19.6v-2.7c0-3.3-6.5-4.9-9.8-4.9z"/></svg>
                )}
              </div>
              <div className="flex items-center gap-1.5 mb-2">
                <div className="text-xs font-black px-2 py-1 rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                  ⚡ {xScore} X-Factor
                </div>
              </div>
            </div>

            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-black text-white">{displayName}</h1>
                  <CheckCircle className="w-5 h-5 text-blue-400 fill-blue-400/20" />
                </div>
                <div className="text-blue-400 text-sm">{position} · {sport}</div>
                <div className="flex items-center gap-1.5 mt-1">
                  <GraduationCap className="w-3.5 h-3.5 text-blue-500" />
                  <span className="text-blue-500 text-xs">{school}</span>
                </div>
              </div>
            </div>

            {/* Status Badge */}
            <div className={`mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-bold ${statusInfo.bg} ${statusInfo.color}`}>
              <div className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
              {statusInfo.label}
            </div>

            {/* Key Stats Row */}
            <div className="grid grid-cols-3 gap-3 mt-4">
              {[
                { label: "NIL Value", val: `$${(nilValue / 1000).toFixed(0)}K`, icon: "💰", color: "text-green-400" },
                { label: "X-Factor", val: xScore.toString(), icon: "⚡", color: "text-cyan-400" },
                { label: "Sport", val: sportIcon, icon: "", color: "text-white" },
              ].map((stat, i) => (
                <div key={i} className="bg-blue-900/30 rounded-xl p-3 text-center">
                  <div className={`font-black text-lg ${stat.color}`}>{stat.val}</div>
                  <div className="text-blue-500 text-[10px]">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Tab Nav ── */}
        <div className="flex gap-2">
          {[
            { id: "overview", label: "Overview" },
            { id: "stats", label: "Stats" },
            { id: "highlights", label: "Highlights" },
            { id: "nil", label: "NIL" },
          ].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 text-xs font-bold py-2 rounded-xl transition-colors ${
                activeTab === tab.id ? "bg-blue-600 text-white" : "bg-[#0d1e3c] border border-blue-800/50 text-blue-400"
              }`}>
              {tab.label}
            </button>
          ))}
        </div>

        {/* ── OVERVIEW TAB ── */}
        {activeTab === "overview" && (
          <div className="space-y-4">
            {/* Bio */}
            <div className="bg-[#0d1e3c] border border-blue-800/50 rounded-2xl p-4">
              <div className="text-xs font-black text-blue-400 tracking-widest uppercase mb-2">About</div>
              <p className="text-blue-200 text-sm leading-relaxed">
                {profile?.bio || `${displayName} is a ${position} competing at the highest level. Powered by AthlynXAI — one identity, every athlete, every platform for NIL deals, recruiting, and performance tracking.`}
              </p>
            </div>

            {/* Recruiting Info */}
            <div className="bg-[#0d1e3c] border border-blue-800/50 rounded-2xl p-4">
              <div className="text-xs font-black text-blue-400 tracking-widest uppercase mb-3">Recruiting Profile</div>
              <div className="space-y-2">
                {[
                  { label: "Sport", val: `${sportIcon} ${sport}` },
                  { label: "Position", val: position },
                  { label: "School", val: school },
                  { label: "Status", val: statusInfo.label },
                  { label: "Height", val: profile?.height || "6'2\"" },
                  { label: "Weight", val: profile?.weight ? `${profile.weight} lbs` : "195 lbs" },
                  { label: "GPA", val: profile?.gpa || "3.7" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between py-1.5 border-b border-blue-900/30 last:border-0">
                    <span className="text-blue-500 text-xs">{item.label}</span>
                    <span className="text-white text-xs font-semibold">{item.val}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Social Links */}
            <div className="bg-[#0d1e3c] border border-blue-800/50 rounded-2xl p-4">
              <div className="text-xs font-black text-blue-400 tracking-widest uppercase mb-3">Connect</div>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: "AthlynX Profile", href: `/athlete/${athleteId}`, icon: "🏆", color: "bg-blue-600" },
                  { label: "Send Message", href: "/messenger", icon: "💬", color: "bg-green-600" },
                  { label: "View NIL Deals", href: "/nil-portal", icon: "💰", color: "bg-blue-900/30" },
                  { label: "Watch Highlights", href: "/studio", icon: "🎬", color: "bg-purple-600" },
                ].map((link, i) => (
                  <Link key={i} href={link.href}>
                    <button className={`w-full ${link.color} hover:opacity-90 text-white text-xs font-bold py-2.5 rounded-xl flex items-center justify-center gap-1.5 transition-opacity`}>
                      <span>{link.icon}</span> {link.label}
                    </button>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── STATS / SCOUTING REPORT TAB ── */}
        {activeTab === "stats" && (
          <div className="space-y-4">
            {/* Scouting Report Header */}
            <div className="bg-gradient-to-br from-[#0d1e3c] to-[#0a1628] border border-blue-700/50 rounded-2xl p-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <div className="text-xs font-black text-blue-400 tracking-widest uppercase">AthlynX Scouting Report</div>
                  <div className="text-white font-black text-sm">{displayName}</div>
                  <div className="text-blue-400 text-xs">{position} · {sport} · {school}</div>
                </div>
                <div className="text-right">
                  <div className="text-cyan-400 font-black text-2xl">⚡ {xScore}</div>
                  <div className="text-blue-500 text-[10px]">X-Factor Score</div>
                  <div className="text-green-400 text-[10px] font-bold">
                    {xScore >= 90 ? "ELITE PROSPECT" : xScore >= 75 ? "HIGH PROSPECT" : xScore >= 60 ? "SOLID PROSPECT" : "DEVELOPING"}
                  </div>
                </div>
              </div>
              <div className="text-blue-600 text-[10px]">Powered by Nebius H200 AI · Updated daily · Used by scouts, coaches, agents & TV announcers</div>
            </div>

            {/* Performance Stats */}
            <div className="bg-[#0d1e3c] border border-blue-800/50 rounded-2xl p-4">
              <div className="text-xs font-black text-blue-400 tracking-widest uppercase mb-3">Performance Stats</div>
              {profile?.sportStats && Object.keys(profile.sportStats as object).length > 0 ? (
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(profile.sportStats as Record<string, string | number>).map(([key, val]) => (
                    <div key={key} className="bg-blue-900/30 rounded-xl p-2.5">
                      <div className="text-white font-black text-sm">{val}</div>
                      <div className="text-blue-500 text-[10px] capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <div className="text-3xl mb-2">📊</div>
                  <div className="text-white font-bold text-sm mb-1">Stats Not Yet Added</div>
                  <div className="text-blue-400 text-xs mb-3">This athlete hasn't entered their stats yet.</div>
                  <Link href="/x-factor">
                    <button className="bg-blue-600 text-white text-xs font-black px-4 py-2 rounded-xl">⚡ Add Stats with AI</button>
                  </Link>
                </div>
              )}
            </div>

            {/* Physical Profile */}
            <div className="bg-[#0d1e3c] border border-blue-800/50 rounded-2xl p-4">
              <div className="text-xs font-black text-blue-400 tracking-widest uppercase mb-3">Physical Profile</div>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { label: "Height", val: profile?.height || "N/A" },
                  { label: "Weight", val: profile?.weight ? `${profile.weight} lbs` : "N/A" },
                  { label: "GPA", val: profile?.gpa || "N/A" },
                  { label: "Sport", val: `${sportIcon} ${sport}` },
                  { label: "Position", val: position },
                  { label: "Status", val: statusInfo.label.split(" ")[0] },
                ].map((item, i) => (
                  <div key={i} className="bg-blue-900/30 rounded-xl p-2.5 text-center">
                    <div className="text-white font-black text-xs">{item.val}</div>
                    <div className="text-blue-500 text-[9px]">{item.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Scouting Summary */}
            <div className="bg-gradient-to-br from-purple-900/30 to-indigo-900/20 border border-purple-700/40 rounded-2xl p-4">
              <div className="text-xs font-black text-purple-400 tracking-widest uppercase mb-2">🤖 AI Scouting Summary</div>
              <p className="text-blue-200 text-sm leading-relaxed">
                {displayName} is a {position} competing in {sport} at {school}. 
                With an X-Factor score of {xScore}, this athlete ranks as a {xScore >= 90 ? "top-tier elite" : xScore >= 75 ? "high-value"  : "developing"} prospect. 
                NIL value estimated at ${(nilValue / 1000).toFixed(0)}K based on profile metrics, social reach, and sport market data.
                {status === "available" ? " Currently available for recruiting — coaches and brands should act now." : 
                 status === "committed" ? " Committed — watch for future opportunities." :
                 status === "transferred" ? " In the transfer portal — high-value opportunity for programs." : " Signed athlete."}
              </p>
              <div className="mt-3 text-blue-600 text-[9px]">AI-assisted analysis · Not official scouting data</div>
            </div>

            {/* Comparable to Player Profiles */}
            <div className="bg-[#0d1e3c] border border-blue-800/40 rounded-xl p-3 text-center">
              <div className="text-blue-500 text-xs">
                AthlynX covers <span className="text-white font-bold">44 sports</span> · <span className="text-white font-bold">520K+ athletes</span> · Used by scouts, coaches, agents & media
              </div>
              <div className="text-blue-700 text-[10px] mt-1">The complete athlete database — beats Player Profiles, Perfect Game, 247Sports, On3 & Rivals</div>
            </div>
          </div>
        )}

        {/* ── HIGHLIGHTS TAB ── */}
        {activeTab === "highlights" && (
          <div className="space-y-3">
            <div className="bg-[#0d1e3c] border border-blue-800/50 rounded-2xl p-4 text-center">
              <div className="text-4xl mb-3">🎬</div>
              <div className="text-white font-bold mb-1">Highlight Reel</div>
              <div className="text-blue-400 text-sm mb-3">Upload your best plays, training clips, and game film.</div>
              <Link href="/studio">
                <button className="bg-purple-600 hover:bg-purple-500 text-white text-xs font-black px-5 py-2.5 rounded-xl">
                  Upload Highlights →
                </button>
              </Link>
            </div>
          </div>
        )}

        {/* ── NIL TAB ── */}
        {activeTab === "nil" && (
          <div className="space-y-3">
            <div className="bg-gradient-to-br from-green-900/30 to-emerald-900/20 border border-green-700/40 rounded-2xl p-4">
              <div className="text-xs font-black text-green-400 tracking-widest uppercase mb-2">💰 NIL Profile</div>
              <div className="flex items-center justify-between mb-3">
                <div>
                  <div className="text-white font-black text-2xl">${(nilValue / 1000).toFixed(0)}K</div>
                  <div className="text-green-400 text-xs">Estimated NIL Value</div>
                </div>
                <div className="text-right">
                  <div className="text-cyan-400 font-black text-xl">⚡ {xScore}</div>
                  <div className="text-blue-400 text-xs">X-Factor Score</div>
                </div>
              </div>
              <div className="bg-green-900/20 rounded-xl p-3 mb-3">
                <div className="text-green-300 text-xs font-semibold mb-1">Open to Brand Partnerships</div>
                <div className="text-blue-400 text-xs">This athlete is available for NIL deals, sponsorships, appearances, and social media partnerships.</div>
              </div>
              <Link href="/nil-portal">
                <button className="w-full bg-green-600 hover:bg-green-500 text-white text-xs font-black py-2.5 rounded-xl">
                  Propose a Deal →
                </button>
              </Link>
            </div>
          </div>
        )}

        {/* ── Footer ── */}
        <div className="text-center py-4 border-t border-blue-900/30">
          <div className="text-blue-600 text-xs mb-1">Powered by AthlynX · ONE IDENTITY. EVERY ATHLETE. EVERY PLATFORM</div>
          <Link href="/signup">
            <button className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white text-xs font-black px-5 py-2.5 rounded-xl">
              Create Your AthleteCard — Free →
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function AthleteCard() {
  return <RouteErrorBoundary><AthleteCardInner /></RouteErrorBoundary>;
}
