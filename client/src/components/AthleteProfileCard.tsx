/**
 * AthlynX — World-Class Athlete Profile Card
 * Beats Perfect Game, Hudl, On3, 24/7 Sports, and all NIL/recruiting platforms.
 * Shows: photo, sport badge, position, school, class year, recruiting status,
 * NIL value, key stats, verified badge, connect button.
 */
import { useState } from "react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";

const SPORT_COLORS: Record<string, { from: string; to: string; accent: string }> = {
  Football: { from: "#1a3a0a", to: "#0a1f05", accent: "#4ade80" },
  Basketball: { from: "#3a1a0a", to: "#1f0a05", accent: "#fb923c" },
  Baseball: { from: "#0a1a3a", to: "#051020", accent: "#60a5fa" },
  Soccer: { from: "#0a3a1a", to: "#051f0a", accent: "#34d399" },
  "Track & Field": { from: "#3a2a0a", to: "#1f1505", accent: "#fbbf24" },
  Swimming: { from: "#0a2a3a", to: "#05151f", accent: "#22d3ee" },
  Wrestling: { from: "#2a0a0a", to: "#150505", accent: "#f87171" },
  Volleyball: { from: "#1a0a3a", to: "#0a051f", accent: "#a78bfa" },
  Tennis: { from: "#2a3a0a", to: "#151f05", accent: "#a3e635" },
  Golf: { from: "#0a3a2a", to: "#051f15", accent: "#6ee7b7" },
  Softball: { from: "#3a0a2a", to: "#1f0515", accent: "#f472b6" },
  Lacrosse: { from: "#0a1a3a", to: "#050a1f", accent: "#93c5fd" },
  Hockey: { from: "#0a2a3a", to: "#05151f", accent: "#67e8f9" },
};

const SPORT_ICONS: Record<string, string> = {
  Football: "", Basketball: "", Baseball: "", Soccer: "",
  "Track & Field": "", Swimming: "", Tennis: "", Volleyball: "",
  Wrestling: "", Golf: "", Lacrosse: "", Hockey: "",
  Softball: "", "Cross Country": "", Gymnastics: "", Rugby: "",
  Cricket: "", Rowing: "", "Water Polo": "", "Field Hockey": "",
  Cheerleading: "", Fishing: "", "Multi-Sport": "",
};

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string; dot: string }> = {
  available: { label: "Available", color: "text-[#00C2FF]", bg: "bg-[#00C2FF]/15 border-[#00C2FF]/30", dot: "bg-[#00C2FF]" },
  committed: { label: "Committed", color: "text-blue-400", bg: "bg-blue-500/15 border-blue-500/30", dot: "bg-blue-400" },
  signed: { label: "Signed", color: "text-[#1E90FF]", bg: "bg-[#1E90FF]/15 border-[#1E90FF]/30", dot: "bg-[#1E90FF]" },
  transferred: { label: "Transfer Portal", color: "text-[#00C2FF]", bg: "bg-blue-500/15 border-blue-500/30", dot: "bg-blue-400" },
};

// Showcase athlete photos from CDN — used when no real photo exists
const SHOWCASE_PHOTOS = [
  "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=300&h=300&fit=crop&q=80",
  "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=300&fit=crop&q=80",
  "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=300&h=300&fit=crop&q=80",
  "https://images.unsplash.com/photo-1517649763962-0c623066013b?w=300&h=300&fit=crop&q=80",
  "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=300&h=300&fit=crop&q=80",
  "https://images.unsplash.com/photo-1543326727-cf6c39e8f84c?w=300&h=300&fit=crop&q=80",
  "https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?w=300&h=300&fit=crop&q=80",
  "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=300&h=300&fit=crop&q=80",
];

export function getShowcasePhoto(userId: number): string {
  return SHOWCASE_PHOTOS[userId % SHOWCASE_PHOTOS.length];
}

interface AthleteCardProps {
  athlete: {
    userId: number;
    name?: string | null;
    sport?: string | null;
    position?: string | null;
    school?: string | null;
    classYear?: string | null;
    state?: string | null;
    recruitingStatus?: string | null;
    recruitingScore?: number | null;
    nilValue?: number | null;
    avatarUrl?: string | null;
    followers?: number | null;
    gpa?: number | null;
    height?: string | null;
    weight?: number | null;
    sportStats?: any;
  };
  variant?: "grid" | "list" | "featured";
  showConnect?: boolean;
}

export function AthleteProfileCard({ athlete, variant = "grid", showConnect = true }: AthleteCardProps) {
  const { user } = useAuth();
  const [connected, setConnected] = useState(false);
  const [imgError, setImgError] = useState(false);

  const sendConnection = trpc.connections.sendConnectionRequest.useMutation({
    onSuccess: () => setConnected(true),
  });

  const sport = athlete.sport || "Multi-Sport";
  const sportColor = SPORT_COLORS[sport] || SPORT_COLORS.Football;
  const sportIcon = SPORT_ICONS[sport] || "";
  const statusConfig = STATUS_CONFIG[athlete.recruitingStatus || "available"] || STATUS_CONFIG.available;
  const initials = (athlete.name || "AT").split(" ").map((w: string) => w[0]).join("").slice(0, 2).toUpperCase();
  const photoUrl = (!imgError && athlete.avatarUrl) ? athlete.avatarUrl : getShowcasePhoto(athlete.userId);
  const nilDisplay = athlete.nilValue && Number(athlete.nilValue) > 0
    ? `$${Number(athlete.nilValue) >= 1000 ? (Number(athlete.nilValue) / 1000).toFixed(0) + "K" : athlete.nilValue}`
    : null;

  // Get sport-specific key stat
  const getStat = () => {
    const stats = athlete.sportStats as any;
    if (!stats) return null;
    if (sport === "Football") return stats.fortyTime ? { label: "40 YD", value: `${stats.fortyTime}s` } : stats.passingYards ? { label: "PASS YDS", value: stats.passingYards } : null;
    if (sport === "Basketball") return stats.pointsPerGame ? { label: "PPG", value: stats.pointsPerGame } : stats.vertical ? { label: "VERT", value: `${stats.vertical}"` } : null;
    if (sport === "Baseball") return stats.era ? { label: "ERA", value: stats.era } : stats.battingAvg ? { label: "AVG", value: stats.battingAvg } : null;
    if (sport === "Soccer") return stats.goals ? { label: "GOALS", value: stats.goals } : null;
    if (sport === "Track & Field") return stats.hundredMeterTime ? { label: "100M", value: `${stats.hundredMeterTime}s` } : null;
    return null;
  };
  const keyStat = getStat();

  if (variant === "featured") {
    return (
      <div className="relative bg-[#0a0f1e] rounded-3xl overflow-hidden border border-white/10 hover:border-[#1E90FF]/30 transition-all group shadow-xl">
        {/* Background sport gradient */}
        <div className="absolute inset-0 opacity-30" style={{ background: `linear-gradient(135deg, ${sportColor.from}, ${sportColor.to})` }} />

        {/* Cover photo area */}
        <div className="relative h-40 overflow-hidden">
          <img
            src={photoUrl}
            alt={athlete.name || "Athlete"}
            className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
            onError={() => setImgError(true)}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f1e] via-[#0a0f1e]/40 to-transparent" />

          {/* Sport badge */}
          <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-black/60 backdrop-blur-sm rounded-full px-2.5 py-1">
            <span className="text-base">{sportIcon}</span>
            <span className="text-white text-xs font-black">{sport.toUpperCase()}</span>
          </div>

          {/* Recruiting status */}
          <div className={`absolute top-3 right-3 flex items-center gap-1 ${statusConfig.bg} border rounded-full px-2 py-0.5`}>
            <span className={`w-1.5 h-1.5 rounded-full ${statusConfig.dot} animate-pulse`} />
            <span className={`text-[10px] font-black ${statusConfig.color}`}>{statusConfig.label}</span>
          </div>
        </div>

        {/* Profile info */}
        <div className="relative px-4 pb-4">
          {/* Name + position */}
          <div className="mb-3">
            <div className="flex items-center gap-2 mb-0.5">
              <h3 className="text-white font-black text-lg leading-tight">{athlete.name || "Athlete"}</h3>
              {athlete.recruitingScore && Number(athlete.recruitingScore) >= 80 && (
                <span className="text-[#00C2FF] text-sm"></span>
              )}
            </div>
            <p className="text-[#00C2FF] text-sm font-bold">
              {[athlete.position, athlete.classYear ? `Class of ${athlete.classYear}` : null].filter(Boolean).join(" · ")}
            </p>
            {athlete.school && (
              <p className="text-white/50 text-xs mt-0.5 flex items-center gap-1">
                <span></span> {athlete.school}
                {athlete.state && <span className="text-white/30">· {athlete.state}</span>}
              </p>
            )}
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-2 mb-3">
            {[
              { label: "SCORE", value: athlete.recruitingScore ? `${athlete.recruitingScore}` : "—", color: "text-[#00C2FF]" },
              { label: "NIL", value: nilDisplay || "—", color: "text-[#00C2FF]" },
              keyStat ? { label: keyStat.label, value: `${keyStat.value}`, color: "text-[#00C2FF]" } :
              { label: "GPA", value: athlete.gpa ? athlete.gpa.toFixed(1) : "—", color: "text-[#1E90FF]" },
            ].map((stat, i) => (
              <div key={i} className="bg-white/5 rounded-xl p-2 text-center border border-white/5">
                <div className={`text-sm font-black ${stat.color}`}>{stat.value}</div>
                <div className="text-white/30 text-[9px] font-bold tracking-wider">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Connect button */}
          {showConnect && (
            <div className="flex gap-2">
              <Link href={`/athlete/${athlete.userId}`} className="flex-1">
                <button className="w-full bg-gradient-to-r from-[#1E90FF] to-blue-600 text-white font-black py-2.5 rounded-xl text-xs hover:opacity-90 transition-all">
                  View Profile →
                </button>
              </Link>
              {user && user.id !== athlete.userId && (
                <button
                  onClick={() => sendConnection.mutate({ targetUserId: athlete.userId })}
                  disabled={connected || sendConnection.isPending}
                  className={`px-3 py-2.5 rounded-xl text-xs font-black border transition-all ${
                    connected ? "bg-[#00C2FF]/30 text-[#00C2FF] border-[#00C2FF]" : "bg-white/5 text-white/70 border-white/10 hover:border-[#1E90FF]/30 hover:text-[#00C2FF]"
                  }`}
                >
                  {connected ? "" : ""}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Grid variant (default)
  return (
    <div className="bg-[#0d1b3e] border border-white/10 rounded-2xl overflow-hidden hover:border-[#1E90FF]/30 hover:shadow-lg hover:shadow-cyan-500/10 transition-all group">
      <Link href={`/athlete/${athlete.userId}`}>
        <div className="cursor-pointer">
          {/* Photo header */}
          <div className="relative h-28 overflow-hidden">
            <img
              src={photoUrl}
              alt={athlete.name || "Athlete"}
              className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
              onError={() => setImgError(true)}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0d1b3e] via-transparent to-transparent" />
            <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-sm rounded-full px-2 py-0.5 flex items-center gap-1">
              <span className="text-sm">{sportIcon}</span>
              <span className="text-white text-[9px] font-black">{sport}</span>
            </div>
            <div className={`absolute top-2 right-2 flex items-center gap-1 ${statusConfig.bg} border rounded-full px-1.5 py-0.5`}>
              <span className={`w-1.5 h-1.5 rounded-full ${statusConfig.dot}`} />
              <span className={`text-[9px] font-black ${statusConfig.color}`}>{statusConfig.label}</span>
            </div>
          </div>

          {/* Info */}
          <div className="p-3">
            <div className="flex items-start justify-between mb-1">
              <div>
                <h3 className="text-white font-black text-sm leading-tight group-hover:text-[#00C2FF] transition-colors">
                  {athlete.name || "Athlete"}
                </h3>
                <p className="text-white/50 text-[10px]">
                  {[athlete.position, athlete.classYear ? `'${athlete.classYear?.slice(-2)}` : null].filter(Boolean).join(" · ")}
                </p>
              </div>
              {athlete.recruitingScore && Number(athlete.recruitingScore) >= 80 && (
                <span className="text-[#00C2FF] text-xs"></span>
              )}
            </div>
            {athlete.school && (
              <p className="text-white/30 text-[10px] truncate mb-2">{athlete.school}</p>
            )}

            {/* Mini stats */}
            <div className="grid grid-cols-3 gap-1 border-t border-white/5 pt-2">
              {[
                { label: "SCORE", value: athlete.recruitingScore ? `${athlete.recruitingScore}` : "—" },
                { label: "NIL", value: nilDisplay || "—" },
                { label: "CLASS", value: athlete.classYear || "—" },
              ].map((s, i) => (
                <div key={i} className="text-center">
                  <div className="text-white font-black text-xs">{s.value}</div>
                  <div className="text-white/25 text-[8px] tracking-wider">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Link>

      {/* Connect */}
      {showConnect && (
        <div className="px-3 pb-3">
          {user ? (
            <button
              onClick={() => sendConnection.mutate({ targetUserId: athlete.userId })}
              disabled={connected || sendConnection.isPending}
              className={`w-full text-[10px] font-black py-1.5 rounded-full transition-all ${
                connected ? "bg-[#00C2FF]/30 text-[#00C2FF] border border-[#00C2FF]/30" :
                "bg-[#1E90FF]/20 hover:bg-[#1E90FF]/20 border border-[#1E90FF]/30 text-[#00C2FF]"
              }`}
            >
              {connected ? " Connected" : sendConnection.isPending ? "..." : " Connect"}
            </button>
          ) : (
            <Link href="/signup">
              <button className="w-full text-[10px] font-black py-1.5 rounded-full bg-[#1E90FF]/20 hover:bg-[#1E90FF]/20 border border-[#1E90FF]/30 text-[#00C2FF] transition-all">
                Sign Up to Connect
              </button>
            </Link>
          )}
        </div>
      )}
    </div>
  );
}

export default AthleteProfileCard;
