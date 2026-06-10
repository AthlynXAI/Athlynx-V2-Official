/**
 * AthleteDataDashboard — Real-Time AI Data Collection Dashboard
 * Shows live data streams from AI bots, robots, wearables, and video analysis.
 * Core IP moat — proprietary data no competitor can replicate.
 */
import { useState } from "react";
import { RouteErrorBoundary } from "@/components/GlobalErrorBoundary";
import PlatformLayout from "@/components/PlatformLayout";
import MobileBottomNav from "@/components/MobileBottomNav";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";

const SOURCE_ICONS: Record<string, string> = {
  ai_bot: "",
  robot: "",
  wearable: "",
  video_analysis: "",
  manual: "",
  api_integration: "",
};

const EVENT_ICONS: Record<string, string> = {
  performance_metric: "",
  biometric: "",
  gps_tracking: "",
  motion_capture: "",
  ai_session: "",
  recruitment_interaction: "",
  training_session: "",
  health_record: "",
  game_stat: "",
  combine_result: "",
  injury_report: "",
  recovery_score: "",
};

const SOURCE_COLORS: Record<string, string> = {
  ai_bot: "border-[#1E90FF]/30 bg-[#1E90FF]/20 text-[#00C2FF]",
  robot: "border-[#1E90FF]/40 bg-[#1E90FF]/5 text-[#1E90FF]",
  wearable: "border-[#00C2FF]/40 bg-[#00C2FF]/5 text-[#00C2FF]",
  video_analysis: "border-[#1E90FF]/30 bg-[#1E90FF]/20 text-[#00C2FF]",
  manual: "border-blue-400/40 bg-blue-400/5 text-blue-400",
  api_integration: "border-[#1E90FF]/40 bg-[#1E90FF]/5 text-[#1E90FF]",
};

function timeAgo(date: string | Date) {
  const d = new Date(date);
  const now = new Date();
  const diff = Math.floor((now.getTime() - d.getTime()) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

function AthleteDataDashboardInner() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<"my" | "platform">("my");

  const { data: myEvents = [], isLoading: myLoading } = trpc.data.getMyEvents.useQuery(
    { limit: 50 },
    { enabled: !!user, refetchInterval: 10000 }
  );

  const { data: platformStats, isLoading: statsLoading } = trpc.data.getPlatformStats.useQuery(
    undefined,
    { enabled: !!user, refetchInterval: 15000 }
  );

  const { data: sources = [] } = trpc.data.getSources.useQuery(
    undefined,
    { enabled: !!user }
  );

  const DEMO_EVENTS = [
    { id: 1, sourceType: "ai_bot", eventType: "ai_session", sport: "Football", payload: { action: "Profile optimization", score: 94 }, heartRate: null, speed: null, createdAt: new Date(Date.now() - 120000).toISOString() },
    { id: 2, sourceType: "wearable", eventType: "biometric", sport: "Basketball", payload: { hrv: 68, stress: "low" }, heartRate: 72, speed: null, createdAt: new Date(Date.now() - 300000).toISOString() },
    { id: 3, sourceType: "robot", eventType: "motion_capture", sport: "Baseball", payload: { pitchSpeed: "94 mph", spinRate: 2400 }, heartRate: null, speed: 94, createdAt: new Date(Date.now() - 600000).toISOString() },
    { id: 4, sourceType: "video_analysis", eventType: "game_stat", sport: "Football", payload: { yards: 187, touchdowns: 2, completions: "18/24" }, heartRate: null, speed: null, createdAt: new Date(Date.now() - 900000).toISOString() },
    { id: 5, sourceType: "ai_bot", eventType: "recruitment_interaction", sport: "Soccer", payload: { college: "University of Texas", interest: "high" }, heartRate: null, speed: null, createdAt: new Date(Date.now() - 1800000).toISOString() },
  ];

  const displayEvents = (myEvents as any[]).length > 0 ? myEvents : DEMO_EVENTS;
  const isDemo = (myEvents as any[]).length === 0;

  const statCards = [
    { label: "Total Data Events", value: platformStats?.totalEvents?.toLocaleString() ?? "—", icon: "", color: "text-[#00C2FF]", sub: "All time" },
    { label: "AI Bot Sessions", value: platformStats?.aiEvents?.toLocaleString() ?? "—", icon: "", color: "text-blue-400", sub: "AI interactions" },
    { label: "Robot Captures", value: platformStats?.robotEvents?.toLocaleString() ?? "—", icon: "", color: "text-[#1E90FF]", sub: "Sideline data" },
    { label: "Wearable Streams", value: platformStats?.wearableEvents?.toLocaleString() ?? "—", icon: "", color: "text-[#00C2FF]", sub: "Real-time bio" },
  ];

  return (
    <PlatformLayout>
      <div className="max-w-6xl mx-auto px-4 py-6 space-y-6 pb-24">
        {/*  HEADER  */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <span className="text-3xl"></span>
              <h1 className="text-3xl font-black text-white">Data Command Center</h1>
              <span className="bg-[#1E90FF]/20 text-[#00C2FF] text-xs font-black px-3 py-1 rounded-full border border-[#1E90FF]/30 animate-pulse">
                LIVE
              </span>
            </div>
            <p className="text-white/50 text-sm ml-12">
              Real-time streams from AI bots, robots, wearables &amp; video analysis — your proprietary data moat
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab("my")}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === "my" ? "bg-[#1E90FF] text-black" : "bg-white/5 text-white/60 hover:bg-white/10"}`}
            >
              My Data
            </button>
            <button
              onClick={() => setActiveTab("platform")}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === "platform" ? "bg-[#1E90FF] text-black" : "bg-white/5 text-white/60 hover:bg-white/10"}`}
            >
              Platform Stats
            </button>
          </div>
        </div>

        {/*  STAT CARDS  */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((s, i) => (
            <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-4 hover:border-[#1E90FF]/30 transition-all">
              <div className="text-2xl mb-2">{s.icon}</div>
              <div className={`text-2xl font-black ${s.color}`}>{statsLoading ? "..." : s.value}</div>
              <div className="text-white/70 text-sm font-bold mt-1">{s.label}</div>
              <div className="text-white/30 text-xs mt-0.5">{s.sub}</div>
            </div>
          ))}
        </div>

        {activeTab === "my" ? (
          <>
            {/*  DATA SOURCES  */}
            <div>
              <h2 className="text-lg font-black text-white mb-3 flex items-center gap-2">
                <span></span> Connected Data Sources
                <span className="text-white/30 text-sm font-normal">({sources.length} registered)</span>
              </h2>
              {sources.length === 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                  {Object.entries(SOURCE_ICONS).map(([type, icon]) => (
                    <div key={type} className={`border rounded-xl p-3 text-center ${SOURCE_COLORS[type]} opacity-40`}>
                      <div className="text-2xl mb-1">{icon}</div>
                      <div className="text-xs font-bold capitalize">{type.replace("_", " ")}</div>
                      <div className="text-xs opacity-60 mt-0.5">Not connected</div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                  {(sources as any[]).map((src: any) => (
                    <div key={src.id} className={`border rounded-xl p-3 ${SOURCE_COLORS[src.sourceType] || "border-white/10 bg-white/5 text-white"}`}>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xl">{SOURCE_ICONS[src.sourceType] || ""}</span>
                        <span className={`w-2 h-2 rounded-full ${src.isActive ? "bg-[#00C2FF]" : "bg-[#1E90FF]"}`} />
                      </div>
                      <div className="font-bold text-sm">{src.name}</div>
                      <div className="text-xs opacity-60 capitalize">{src.sourceType.replace("_", " ")}</div>
                      {src.lastSeenAt && <div className="text-xs opacity-40 mt-1">{timeAgo(src.lastSeenAt)}</div>}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/*  LIVE EVENT FEED  */}
            <div>
              <h2 className="text-lg font-black text-white mb-3 flex items-center gap-2">
                <span></span> Live Event Stream
                {isDemo && <span className="text-[#00C2FF]/60 text-xs font-normal">(demo — start using the platform to see your real data)</span>}
              </h2>
              {myLoading ? (
                <div className="text-white/40 text-center py-12">Loading your data stream...</div>
              ) : (
                <div className="space-y-2">
                  {(displayEvents as any[]).map((event: any, i: number) => (
                    <div
                      key={event.id ?? i}
                      className={`border rounded-xl p-4 flex items-start gap-4 transition-all hover:border-[#1E90FF]/30 ${SOURCE_COLORS[event.sourceType] || "border-white/10 bg-white/5"}`}
                    >
                      <div className="text-2xl flex-shrink-0">{EVENT_ICONS[event.eventType] || ""}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <span className="font-bold text-white text-sm capitalize">{event.eventType.replace(/_/g, " ")}</span>
                          <span className={`text-xs px-2 py-0.5 rounded-full border font-bold ${SOURCE_COLORS[event.sourceType]}`}>
                            {SOURCE_ICONS[event.sourceType]} {event.sourceType.replace("_", " ")}
                          </span>
                          {event.sport && (
                            <span className="text-xs text-white/40 bg-white/5 px-2 py-0.5 rounded-full">{event.sport}</span>
                          )}
                        </div>
                        <div className="text-white/50 text-xs font-mono truncate">
                          {typeof event.payload === "object"
                            ? Object.entries(event.payload as Record<string, unknown>)
                                .slice(0, 3)
                                .map(([k, v]) => `${k}: ${v}`)
                                .join(" · ")
                            : String(event.payload)}
                        </div>
                        <div className="flex gap-3 mt-1 text-xs text-white/30">
                          {event.heartRate && <span> {event.heartRate} bpm</span>}
                          {event.speed && <span> {event.speed} mph</span>}
                          {event.recoveryScore && <span> {event.recoveryScore}% recovery</span>}
                        </div>
                      </div>
                      <div className="text-white/30 text-xs flex-shrink-0">{timeAgo(event.createdAt)}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            {/*  PLATFORM STATS TAB  */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <h2 className="text-xl font-black text-white mb-4 flex items-center gap-2">
                <span></span> Platform-Wide Data Intelligence
              </h2>
              <p className="text-white/50 text-sm mb-6">
                Every AI interaction, every robot sideline session, every wearable stream — all flowing into AthlynX servers.
                This is the proprietary data moat no competitor can replicate.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                {[
                  { label: "AI Bot Sessions", count: platformStats?.aiEvents ?? 0, icon: "", desc: "Profile optimizations, recruiting AI, NIL analysis" },
                  { label: "Robot Captures", count: platformStats?.robotEvents ?? 0, icon: "", desc: "Sideline motion capture, combine data, pitch tracking" },
                  { label: "Wearable Streams", count: platformStats?.wearableEvents ?? 0, icon: "", desc: "Heart rate, GPS, biometrics, recovery scores" },
                  { label: "Total Events", count: platformStats?.totalEvents ?? 0, icon: "", desc: "All data events across all sources" },
                ].map((item, i) => (
                  <div key={i} className="bg-black/30 rounded-xl p-4 border border-white/10">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-2xl">{item.icon}</span>
                      <div>
                        <div className="text-2xl font-black text-white">{statsLoading ? "..." : item.count.toLocaleString()}</div>
                        <div className="text-white/60 text-sm font-bold">{item.label}</div>
                      </div>
                    </div>
                    <div className="text-white/30 text-xs">{item.desc}</div>
                  </div>
                ))}
              </div>
              {/* Recent platform events */}
              {platformStats?.recentEvents && platformStats.recentEvents.length > 0 && (
                <div>
                  <h3 className="text-white/60 text-sm font-bold mb-3">Recent Platform Events</h3>
                  <div className="space-y-2">
                    {(platformStats.recentEvents as any[]).slice(0, 10).map((event: any, i: number) => (
                      <div key={i} className="flex items-center gap-3 text-sm border border-white/5 rounded-lg p-3 bg-white/3">
                        <span className="text-lg">{SOURCE_ICONS[event.sourceType] || ""}</span>
                        <span className="text-white/60 capitalize">{event.eventType?.replace(/_/g, " ")}</span>
                        {event.sport && <span className="text-white/30 text-xs">{event.sport}</span>}
                        <span className="ml-auto text-white/20 text-xs">{timeAgo(event.createdAt)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/*  DATA MOAT EXPLAINER  */}
            <div className="bg-gradient-to-r from-[#1E90FF]/20 via-blue-500/10 to-[#0a1628]/10 border border-[#1E90FF]/30 rounded-2xl p-6">
              <h2 className="text-xl font-black text-white mb-3"> The AthlynX Data Moat</h2>
              <p className="text-white/60 text-sm mb-4">
                No competitor has ever built this. Every data point collected on AthlynX is proprietary, anonymized, and
                owned by AthlynX. This creates an insurmountable competitive advantage as the dataset grows.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { icon: "", title: "AI Bot Data", desc: "Every AI conversation, recommendation, and outcome logged and learned from" },
                  { icon: "", title: "Robot Sideline Data", desc: "Motion capture, pitch tracking, combine metrics — real-time from the field" },
                  { icon: "", title: "Wearable Integration", desc: "Heart rate, GPS, recovery, sleep — continuous biometric streams" },
                ].map((item, i) => (
                  <div key={i} className="bg-black/30 rounded-xl p-4 border border-white/10">
                    <div className="text-2xl mb-2">{item.icon}</div>
                    <div className="font-bold text-white text-sm mb-1">{item.title}</div>
                    <div className="text-white/40 text-xs">{item.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
      <MobileBottomNav />
    </PlatformLayout>
  );
}

export default function AthleteDataDashboard() {
  return <RouteErrorBoundary><AthleteDataDashboardInner /></RouteErrorBoundary>;
}
