/**
 * MeetAthletes — AthlynXAI
 * Facebook-style "People You May Know" for athletes and coaches
 * Shows on: Onboarding, Dashboard, BrowseAthletes, SportXHub feeds
 * Athletes connect with athletes. Athletes connect with coaches.
 * The world connects on AthlynXAI.
 */
import { useState } from "react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { Users, UserPlus, MessageCircle, Zap, Trophy, Star, Search } from "lucide-react";

interface MeetAthletesProps {
  variant?: "full" | "sidebar" | "onboarding";
  sport?: string;
  showCoaches?: boolean;
  title?: string;
}

export default function MeetAthletes({
  variant = "sidebar",
  sport,
  showCoaches = true,
  title,
}: MeetAthletesProps) {
  const { user } = useAuth();
  const [connected, setConnected] = useState<Set<number>>(new Set());
  const [searchQuery, setSearchQuery] = useState("");

  const suggestedAthletes = trpc.connections.getSuggestedAthletes.useQuery(
    { limit: variant === "full" ? 24 : 8 },
    { enabled: !!user, retry: false }
  );

  const suggestedCoaches = trpc.connections.getSuggestedCoaches.useQuery(
    { limit: 4 },
    { enabled: !!user && showCoaches, retry: false }
  );

  const searchResults = trpc.connections.searchPeople.useQuery(
    { query: searchQuery, limit: 12 },
    { enabled: searchQuery.length >= 2, retry: false }
  );

  const followUser = trpc.connections.followUser.useMutation({
    onSuccess: (_, vars) => {
      setConnected(prev => { const s = new Set(Array.from(prev)); s.add(vars.targetUserId); return s; });
    },
  });

  const sendConnection = trpc.connections.sendConnectionRequest.useMutation({
    onSuccess: (_, vars) => {
      setConnected(prev => { const s = new Set(Array.from(prev)); s.add(vars.targetUserId); return s; });
    },
  });

  const athletes = searchQuery.length >= 2
    ? (searchResults.data ?? [])
    : (suggestedAthletes.data ?? []);

  const coaches = suggestedCoaches.data ?? [];

  // Kept for legacy <32px callers (mention pings, message rows) per NIL doctrine.
  const getInitials = (name: string) =>
    (name || "A").split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();

  // Silhouette SVG — used for all ≥32px avatar fallbacks per NIL-First Identity Doctrine.
  // Real headshot when present; silhouette + "Identity pending" otherwise. No colored initials.
  const SilhouettePath = (
    <svg viewBox="0 0 24 24" className="w-3/5 h-3/5" fill="currentColor" aria-hidden="true">
      <path d="M12 12c2.7 0 4.9-2.2 4.9-4.9S14.7 2.2 12 2.2 7.1 4.4 7.1 7.1 9.3 12 12 12zm0 2.2c-3.3 0-9.8 1.7-9.8 4.9v2.7h19.6v-2.7c0-3.3-6.5-4.9-9.8-4.9z" />
    </svg>
  );

  const getSportEmoji = (sport: string) => {
    const map: Record<string, string> = {
      Football: "", Basketball: "", Baseball: "", Soccer: "",
      "Track & Field": "", Swimming: "", Wrestling: "", Tennis: "",
      Volleyball: "", Hockey: "", Softball: "", Golf: "",
      Lacrosse: "", Gymnastics: "", "Cross Country": "",
      Rowing: "", "Water Polo": "", "Field Hockey": "",
      Cheerleading: "", Rugby: "", Cricket: "",
    };
    return map[sport] || "";
  };

  if (variant === "onboarding") {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <div className="text-4xl mb-3"></div>
          <h2 className="text-2xl font-black text-white mb-2">Meet Your Fellow Athletes</h2>
          <p className="text-slate-400 text-sm">Connect with athletes in your sport, at your school, and around the world. This is your network.</p>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search athletes by name, school, or sport..."
            className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-4 py-3 text-white text-sm outline-none focus:border-blue-500 placeholder-slate-600"
          />
        </div>

        {/* Athletes Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {athletes.slice(0, 12).map((athlete: any) => (
            <AthleteCard
              key={athlete.id}
              athlete={athlete}
              connected={connected.has(athlete.id)}
              onConnect={() => sendConnection.mutate({ targetUserId: athlete.id, message: "Hey! Let's connect on AthlynXAI." })}
              getSportEmoji={getSportEmoji}
              getInitials={getInitials}
              compact
            />
          ))}
        </div>

        {/* Coaches */}
        {showCoaches && coaches.length > 0 && (
          <div>
            <h3 className="text-white font-black text-sm mb-3 flex items-center gap-2">
              <Trophy className="w-4 h-4 text-[#00C2FF]" />
              Coaches & Scouts Watching
            </h3>
            <div className="space-y-2">
              {coaches.slice(0, 3).map((coach: any) => (
                <div key={coach.id} className="flex items-center gap-3 bg-slate-900/60 border border-slate-800 rounded-xl p-3">
                  <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 flex-shrink-0 overflow-hidden" title={coach.name ? `${coach.name} — Identity pending` : "Identity pending"}>
                    {coach.avatarUrl
                      ? <img src={coach.avatarUrl} alt={coach.name} className="w-full h-full object-cover" />
                      : SilhouettePath
                    }
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-white font-bold text-sm truncate">{coach.name}</div>
                    <div className="text-slate-500 text-xs truncate">{coach.school} · {coach.sport}</div>
                  </div>
                  <button
                    onClick={() => followUser.mutate({ targetUserId: coach.id })}
                    disabled={connected.has(coach.id) || coach.id < 0}
                    className="text-xs border border-blue-700 hover:border-blue-500 hover:text-blue-400 text-slate-400 px-3 py-1.5 rounded-full transition-colors flex-shrink-0 disabled:opacity-50"
                  >
                    {connected.has(coach.id) ? " Following" : "Follow"}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  if (variant === "sidebar") {
    return (
      <div className="bg-slate-900/60 rounded-2xl p-4">
        <h3 className="font-black text-white text-sm mb-3 flex items-center gap-2">
          <Users className="w-4 h-4 text-blue-400" />
          {title || "Meet New Athletes"}
        </h3>
        <div className="space-y-3">
          {athletes.slice(0, 5).map((athlete: any) => (
            <div key={athlete.id} className="flex items-center gap-2">
              <Link href={`/athlete/${athlete.id}`}>
                <div className="w-9 h-9 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 flex-shrink-0 cursor-pointer hover:ring-2 hover:ring-blue-500 transition-all overflow-hidden" title={athlete.name ? `${athlete.name} — Identity pending` : "Identity pending"}>
                  {athlete.avatarUrl
                    ? <img src={athlete.avatarUrl} alt={athlete.name} className="w-full h-full rounded-full object-cover" />
                    : SilhouettePath
                  }
                </div>
              </Link>
              <div className="flex-1 min-w-0">
                <Link href={`/athlete/${athlete.id}`}>
                  <div className="text-sm font-bold text-white truncate cursor-pointer hover:text-blue-400 transition-colors">{athlete.name}</div>
                </Link>
                <div className="text-xs text-slate-500 truncate">
                  {getSportEmoji(athlete.sport)} {athlete.sport} {athlete.position ? `· ${athlete.position}` : ""}
                </div>
              </div>
              <button
                onClick={() => sendConnection.mutate({ targetUserId: athlete.id })}
                disabled={connected.has(athlete.id)}
                className="text-xs border border-slate-700 hover:border-blue-500 hover:text-blue-400 text-slate-400 px-2 py-1 rounded-full transition-colors flex-shrink-0 flex items-center gap-1"
              >
                {connected.has(athlete.id) ? "" : <><UserPlus className="w-3 h-3" /> Connect</>}
              </button>
            </div>
          ))}
        </div>
        <Link href="/browse-athletes">
          <button className="mt-3 w-full text-xs text-blue-400 hover:text-white border border-slate-800 hover:border-blue-700 rounded-xl py-2 transition-colors font-bold">
            See All Athletes →
          </button>
        </Link>
      </div>
    );
  }

  // Full variant
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-black text-white flex items-center gap-2">
          <Users className="w-5 h-5 text-blue-400" />
          {title || "Meet New Athletes"}
        </h2>
        <Link href="/browse-athletes">
          <button className="text-blue-400 text-sm hover:text-white transition-colors font-bold">See All →</button>
        </Link>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
        <input
          type="text"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder="Search by name, school, sport, or position..."
          className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-4 py-3 text-white text-sm outline-none focus:border-blue-500 placeholder-slate-600"
        />
      </div>

      {/* Athletes Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {athletes.map((athlete: any) => (
          <AthleteCard
            key={athlete.id}
            athlete={athlete}
            connected={connected.has(athlete.id)}
            onConnect={() => sendConnection.mutate({ targetUserId: athlete.id })}
            getSportEmoji={getSportEmoji}
            getInitials={getInitials}
          />
        ))}
        {athletes.length === 0 && !suggestedAthletes.isLoading && (
          <div className="col-span-4 text-center py-8 text-slate-500">
            <Users className="w-8 h-8 mx-auto mb-2 text-slate-700" />
            <p className="text-sm">No athletes found. Be the first to invite your teammates!</p>
          </div>
        )}
      </div>

      {/* Coaches Section */}
      {showCoaches && (
        <div>
          <h3 className="text-white font-black text-lg mb-4 flex items-center gap-2">
            <Trophy className="w-5 h-5 text-[#00C2FF]" />
            Coaches & Scouts
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {coaches.map((coach: any) => (
              <div key={coach.id} className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 flex items-center gap-3 hover:border-blue-700/50 transition-all">
                <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 flex-shrink-0 overflow-hidden" title={coach.name ? `${coach.name} — Identity pending` : "Identity pending"}>
                  {coach.avatarUrl
                    ? <img src={coach.avatarUrl} alt={coach.name} className="w-full h-full object-cover" />
                    : SilhouettePath
                  }
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-white font-black">{coach.name}</div>
                  <div className="text-slate-500 text-xs">{coach.school}</div>
                  <div className="text-[#00C2FF] text-xs">{getSportEmoji(coach.sport)} {coach.sport}</div>
                </div>
                <div className="flex flex-col gap-1.5">
                  <button
                    onClick={() => followUser.mutate({ targetUserId: coach.id })}
                    disabled={connected.has(coach.id) || coach.id < 0}
                    className="text-xs bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold px-3 py-1.5 rounded-full transition-colors"
                  >
                    {connected.has(coach.id) ? " Following" : "Follow"}
                  </button>
                  <Link href="/messenger">
                    <button className="text-xs border border-slate-700 hover:border-blue-500 text-slate-400 hover:text-blue-400 font-bold px-3 py-1.5 rounded-full transition-colors flex items-center gap-1 justify-center">
                      <MessageCircle className="w-3 h-3" /> Message
                    </button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

//  Athlete Card 
function AthleteCard({
  athlete,
  connected,
  onConnect,
  getSportEmoji,
  getInitials,
  compact = false,
}: {
  athlete: any;
  connected: boolean;
  onConnect: () => void;
  getSportEmoji: (s: string) => string;
  getInitials: (s: string) => string;
  compact?: boolean;
}) {
  return (
    <div className={`bg-slate-900/60 border border-slate-800 rounded-2xl hover:border-blue-700/50 transition-all ${compact ? "p-3" : "p-4"}`}>
      <Link href={`/athlete/${athlete.id}`}>
        <div className="flex flex-col items-center text-center cursor-pointer">
          {/* Avatar */}
          <div
            className={`${compact ? "w-14 h-14" : "w-16 h-16"} rounded-full bg-slate-800 flex items-center justify-center text-slate-400 mb-2 ring-2 ring-slate-700 hover:ring-blue-500 transition-all overflow-hidden`}
            title={athlete.name ? `${athlete.name} — Identity pending` : "Identity pending"}
          >
            {athlete.avatarUrl
              ? <img src={athlete.avatarUrl} alt={athlete.name} className="w-full h-full object-cover" />
              : (
                <svg viewBox="0 0 24 24" className="w-3/5 h-3/5" fill="currentColor" aria-hidden="true">
                  <path d="M12 12c2.7 0 4.9-2.2 4.9-4.9S14.7 2.2 12 2.2 7.1 4.4 7.1 7.1 9.3 12 12 12zm0 2.2c-3.3 0-9.8 1.7-9.8 4.9v2.7h19.6v-2.7c0-3.3-6.5-4.9-9.8-4.9z" />
                </svg>
              )
            }
          </div>

          {/* Name */}
          <div className={`text-white font-black truncate w-full ${compact ? "text-xs" : "text-sm"}`}>{athlete.name}</div>

          {/* Sport + Position */}
          <div className="text-slate-500 text-xs truncate w-full">
            {getSportEmoji(athlete.sport || "")} {athlete.sport || "Athlete"}
            {athlete.position ? ` · ${athlete.position}` : ""}
          </div>

          {/* School */}
          {athlete.school && (
            <div className="text-slate-600 text-xs truncate w-full mt-0.5">{athlete.school}</div>
          )}

          {/* X-Score */}
          {athlete.xScore > 0 && (
            <div className="flex items-center gap-1 mt-1.5">
              <Zap className="w-3 h-3 text-[#00C2FF]" />
              <span className="text-[#00C2FF] text-xs font-black">{athlete.xScore}</span>
            </div>
          )}

          {/* NIL Verified */}
          {athlete.nilVerified && (
            <div className="text-xs bg-[#00C2FF]/40 text-[#00C2FF] border border-[#00C2FF]/40 px-2 py-0.5 rounded-full mt-1">
              NIL Verified 
            </div>
          )}
        </div>
      </Link>

      {/* Connect Button */}
      <button
        onClick={onConnect}
        disabled={connected}
        className={`mt-3 w-full text-xs font-black py-2 rounded-full transition-all ${
          connected
            ? "bg-[#00C2FF]/40 text-[#00C2FF] border border-[#00C2FF]/40"
            : "bg-blue-600 hover:bg-blue-500 text-white"
        }`}
      >
        {connected ? " Connected" : (
          <span className="flex items-center justify-center gap-1">
            <UserPlus className="w-3 h-3" /> Connect
          </span>
        )}
      </button>
    </div>
  );
}
