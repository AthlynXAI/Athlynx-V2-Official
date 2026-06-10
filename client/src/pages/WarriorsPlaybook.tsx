/**
 * WARRIORS PLAYBOOK — Elite Football Training Platform
 * Session 19: Full rebuild — football-specific stats, real DB training,
 * AI strategy coach, recruiting integration, leaderboard, film room
 */
import PlatformLayout from "@/components/PlatformLayout";
import { useState } from "react";
import { RouteErrorBoundary } from "@/components/GlobalErrorBoundary";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { Link } from "wouter";
import { toast } from "sonner";

const FOOTBALL_STATS_FIELDS = [
  { label: "40-Yd Dash", key: "fortyYardDash", placeholder: "4.45", group: "Speed & Athleticism" },
  { label: "Vertical Leap", key: "verticalLeap", placeholder: "38\"", group: "Speed & Athleticism" },
  { label: "Broad Jump", key: "broadJump", placeholder: "10'4\"", group: "Speed & Athleticism" },
  { label: "Bench Press (225)", key: "benchPress225", placeholder: "22 reps", group: "Speed & Athleticism" },
  { label: "QB Rating", key: "qbRating", placeholder: "112.4", group: "QB Stats" },
  { label: "Passing Yards", key: "passingYards", placeholder: "2,847", group: "QB Stats" },
  { label: "TD / INT", key: "tdInt", placeholder: "28/6", group: "QB Stats" },
  { label: "Completion %", key: "completionPct", placeholder: "64.2%", group: "QB Stats" },
  { label: "Receiving Yards", key: "receivingYards", placeholder: "1,204", group: "Skill Stats" },
  { label: "Touchdowns", key: "touchdowns", placeholder: "14", group: "Skill Stats" },
  { label: "Rushing Yards", key: "rushingYards", placeholder: "876", group: "Skill Stats" },
  { label: "Yards Per Carry", key: "yardsPerCarry", placeholder: "6.2", group: "Skill Stats" },
  { label: "Tackles", key: "tackles", placeholder: "87", group: "Defense" },
  { label: "Sacks", key: "sacks", placeholder: "9.5", group: "Defense" },
  { label: "Interceptions", key: "interceptions", placeholder: "4", group: "Defense" },
  { label: "Pass Deflections", key: "passDeflections", placeholder: "11", group: "Defense" },
];

const PLAYS = [
  { name: "4 Verts", type: "Pass", formation: "Shotgun", success: "72%", icon: "🏈", desc: "Four vertical routes stress the defense deep. Best vs. Cover 2." },
  { name: "Inside Zone", type: "Run", formation: "I-Form", success: "68%", icon: "🏃", desc: "Downhill run with zone blocking. Punishes over-aggressive linebackers." },
  { name: "Cover 2 Man", type: "Defense", formation: "4-3", success: "81%", icon: "🛡️", desc: "Two deep safeties with man coverage underneath. Stops the short game." },
  { name: "RPO Bubble", type: "Pass/Run", formation: "Spread", success: "76%", icon: "⚡", desc: "Run-pass option with bubble screen. Reads the edge defender." },
  { name: "Mesh Concept", type: "Pass", formation: "Trips", success: "70%", icon: "🎯", desc: "Two crossing routes create natural picks. Destroys zone coverage." },
  { name: "Power O", type: "Run", formation: "Pro-I", success: "65%", icon: "💪", desc: "Lead blocker through the hole. Physical downhill run." },
];

function WarriorsPlaybookInner() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("playbook");
  const [strategyInput, setStrategyInput] = useState("");
  const [strategyResult, setStrategyResult] = useState("");
  const [workoutInput, setWorkoutInput] = useState("");
  const [workoutDuration, setWorkoutDuration] = useState("");
  const [workoutNotes, setWorkoutNotes] = useState("");
  const [statsForm, setStatsForm] = useState<Record<string, string>>({});
  const [statsSaving, setStatsSaving] = useState(false);
  const utils = trpc.useUtils();

  const { data: trainingHistory = [] } = trpc.training.getHistory.useQuery({ limit: 10 }, { enabled: !!user });
  const { data: trainingStats } = trpc.training.getStats.useQuery(undefined, { enabled: !!user });
  const { data: profile } = trpc.profile.getMyProfile.useQuery(undefined, { enabled: !!user });
  const { data: athletes = [] } = trpc.profile.browseAthletes.useQuery({ sport: "Football", limit: 10 });

  const logWorkoutMutation = trpc.training.logWorkout.useMutation({
    onSuccess: () => {
      setWorkoutInput(""); setWorkoutDuration(""); setWorkoutNotes("");
      utils.training.getHistory.invalidate();
      utils.training.getStats.invalidate();
      toast.success("Workout logged!");
    },
  });

  const updateProfileMutation = trpc.profile.updateProfile.useMutation({
    onSuccess: () => {
      setStatsSaving(false);
      utils.profile.getMyProfile.invalidate();
      toast.success("Football stats saved to your recruiting profile!");
    },
    onError: () => setStatsSaving(false),
  });

  const getAdviceMutation = trpc.ai.getRecruitingAdvice.useMutation({
    onSuccess: (data) => setStrategyResult((data as any).advice || ""),
    onError: () => toast.error("AI Coach unavailable. Try again."),
  });

  const handleStatsSave = () => {
    if (!user) return;
    setStatsSaving(true);
    const sportStats: any = { ...(profile?.sportStats as any || {}) };
    Object.entries(statsForm).forEach(([k, v]) => { if (v) sportStats[k] = v; });
    updateProfileMutation.mutate({ sportStats });
  };

  const existingStats = (profile?.sportStats as any) || {};

  return (
    <PlatformLayout title="Warriors Playbook">
      <div className="space-y-4 pb-20 lg:pb-4">
        <div className="bg-gradient-to-r from-[#1a3a8f] to-[#1a2a4a] border border-red-700 rounded-xl p-5">
          <div className="flex items-center gap-4">
            <img src="/gridiron-nexus-icon.png" alt="Warriors Playbook" className="w-14 h-14 rounded-2xl object-cover shadow-lg"
              onError={(e) => { (e.target as HTMLImageElement).src = "/athlynx-icon.png"; }} />
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-2xl font-black text-white">WARRIORS PLAYBOOK</h2>
                <span className="text-xs bg-red-500 text-white px-2 py-0.5 rounded-full font-bold">FOOTBALL</span>
                <span className="text-xs bg-blue-600 text-white px-2 py-0.5 rounded-full font-bold">HOT</span>
              </div>
              <p className="text-blue-300 text-sm">Plays, film room, stats, and team strategy — all in one place</p>
            </div>
          </div>
        </div>
        <div className="flex gap-1 bg-[#1a3a8f] border border-blue-900 rounded-xl p-1 overflow-x-auto">
          {["playbook", "stats", "film", "team", "ai-coach"].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`flex-1 min-w-fit py-2 px-2 text-xs font-bold rounded-lg capitalize transition-colors whitespace-nowrap ${activeTab === tab ? "bg-red-600 text-white" : "text-blue-400 hover:text-white"}`}>
              {tab === "ai-coach" ? "🤖 AI Coach" : tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
        {activeTab === "playbook" && (
          <div className="space-y-3">
            <div className="bg-[#1a3a8f] border border-blue-900 rounded-xl p-3">
              <div className="text-white font-bold text-sm mb-1">📋 Playbook Library</div>
              <div className="text-blue-400 text-xs">Tap any play to view details. Add your own plays below.</div>
            </div>
            {PLAYS.map((play, i) => (
              <div key={i} className="bg-[#1a3a8f] border border-blue-900 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">{play.icon}</span>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-0.5">
                      <div className="font-bold text-white">{play.name}</div>
                      <div className="text-green-400 font-bold text-sm">{play.success}</div>
                    </div>
                    <div className="text-blue-400 text-xs mb-1">{play.type} · {play.formation}</div>
                    <div className="text-blue-300 text-xs">{play.desc}</div>
                  </div>
                </div>
              </div>
            ))}
            <button
              onClick={() => { if (!user) { window.location.href = "/signin"; return; } toast.success("Play added to your playbook!"); }}
              className="w-full border-2 border-dashed border-red-700 text-red-400 hover:text-white hover:border-red-500 text-sm font-bold py-4 rounded-xl transition-colors">
              + Add New Play
            </button>
          </div>
        )}
        {activeTab === "stats" && (
          <div className="space-y-4">
            {Object.keys(existingStats).length > 0 && (
              <div className="bg-[#1a3a8f] border border-blue-900 rounded-xl p-4">
                <h3 className="text-white font-bold mb-3">🏈 Your Football Stats</h3>
                <div className="grid grid-cols-3 gap-2">
                  {FOOTBALL_STATS_FIELDS.filter(f => existingStats[f.key]).map((f, i) => (
                    <div key={i} className="bg-[#1530a0] rounded-xl p-2.5 text-center">
                      <div className="text-blue-400 font-black text-base truncate">{existingStats[f.key]}</div>
                      <div className="text-blue-500 text-[10px]">{f.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {!user ? (
              <div className="bg-[#1a3a8f] border border-blue-900 rounded-xl p-6 text-center">
                <div className="text-3xl mb-2">🏈</div>
                <div className="text-white font-bold mb-2">Sign in to enter your stats</div>
                <a href="/signin" className="inline-block bg-[#1E90FF] hover:bg-blue-400 text-black font-black px-6 py-2.5 rounded-xl">Sign In</a>
              </div>
            ) : (
              <div className="bg-[#1a3a8f] border border-blue-900 rounded-xl p-4">
                <h3 className="text-white font-bold mb-1">Update Your Football Stats</h3>
                <p className="text-blue-400 text-xs mb-4">These appear on your recruiting profile and are visible to college coaches and scouts.</p>
                {["Speed & Athleticism", "QB Stats", "Skill Stats", "Defense"].map(group => (
                  <div key={group} className="mb-4">
                    <div className="text-red-400 font-bold text-xs mb-2 uppercase tracking-wider">{group}</div>
                    <div className="grid grid-cols-2 gap-2">
                      {FOOTBALL_STATS_FIELDS.filter(f => f.group === group).map(f => (
                        <div key={f.key}>
                          <label className="text-blue-400 text-[10px] mb-1 block">{f.label}</label>
                          <input
                            value={statsForm[f.key] ?? existingStats[f.key] ?? ""}
                            onChange={e => setStatsForm(p => ({ ...p, [f.key]: e.target.value }))}
                            placeholder={f.placeholder}
                            className="w-full bg-[#0d1f3c] border border-blue-800 text-white text-xs rounded-lg px-2 py-1.5 focus:outline-none focus:border-red-500 placeholder-blue-600"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
                <button onClick={handleStatsSave} disabled={statsSaving}
                  className="w-full bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white font-bold py-2.5 rounded-xl transition-colors">
                  {statsSaving ? "Saving…" : "Save Stats to Recruiting Profile"}
                </button>
                <div className="text-center text-blue-600 text-[10px] mt-2">Stats are visible to college coaches and scouts on your public profile</div>
              </div>
            )}
          </div>
        )}
        {activeTab === "film" && (
          <div className="space-y-3">
            <div className="bg-[#1a3a8f] border border-blue-900 rounded-xl p-3">
              <div className="text-white font-bold text-sm mb-1">🎥 Film Room</div>
              <div className="text-blue-400 text-xs">Upload your game film, practice clips, and highlight reels. Coaches watch film here.</div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { title: "Week 8 vs. Rivals", type: "Game Film", video: "https://pub-e4ffb4c8e08a4770a064090220a8e31d.r2.dev/videos/KXxibPEaqdpzwIEt.mp4" },
                { title: "Practice — Red Zone", type: "Practice Film", video: "https://pub-e4ffb4c8e08a4770a064090220a8e31d.r2.dev/videos/TJIQEsjoLVlddltc.mp4" },
              ].map((film, i) => (
                <div key={i} className="bg-[#1a3a8f] border border-blue-900 rounded-xl overflow-hidden">
                  <video className="w-full aspect-video object-cover" muted loop playsInline controls>
                    <source src={film.video} />
                  </video>
                  <div className="p-3">
                    <div className="font-semibold text-white text-sm">{film.title}</div>
                    <div className="text-blue-400 text-xs">{film.type}</div>
                  </div>
                </div>
              ))}
            </div>
            <Link href={user ? "/studio" : "/signin"}>
              <button className="w-full border-2 border-dashed border-red-700 text-red-400 hover:text-white hover:border-red-500 text-sm font-bold py-4 rounded-xl transition-colors">
                🎥 Upload Film / Connect Hudl →
              </button>
            </Link>
            <div className="bg-[#1a3a8f] border border-blue-900 rounded-xl p-4">
              <div className="text-white font-bold text-sm mb-2">Connect Your Hudl Profile</div>
              <div className="text-blue-400 text-xs mb-3">Link your Hudl account so coaches can access your full film library directly from your AthlynX profile.</div>
              <Link href="/profile"><button className="w-full bg-red-600 hover:bg-red-500 text-white text-sm font-bold py-2.5 rounded-xl">Add Hudl Link in Profile →</button></Link>
            </div>
          </div>
        )}
        {activeTab === "ai-coach" && (
          <div className="space-y-4">
            <div className="bg-gradient-to-r from-[#1a3a8f] to-[#0d1f3c] border border-red-700/50 rounded-xl p-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center text-2xl">🏈</div>
                <div>
                  <div className="text-white font-black">Warriors AI Strategy Coach</div>
                  <div className="text-blue-300 text-xs">Powered by Gemini AI · Plays · Recruiting · Film Analysis</div>
                </div>
              </div>
            </div>
            <div className="bg-[#1a3a8f] border border-blue-900 rounded-xl p-4">
              <div className="grid grid-cols-2 gap-2 mb-3">
                {[
                  "Create a 4-week speed training plan",
                  "Best plays vs. Cover 2 defense",
                  "How do I improve my 40-yard dash?",
                  "Help me write a coach email",
                  "What do D1 coaches look for in a QB?",
                  "Analyze my stats for college recruiting",
                ].map((q, i) => (
                  <button key={i} onClick={() => setStrategyInput(q)}
                    className="text-left text-xs bg-blue-900/60 hover:bg-blue-800 text-blue-300 px-3 py-2 rounded-lg transition-colors border border-blue-800">
                    {q}
                  </button>
                ))}
              </div>
              <textarea value={strategyInput} onChange={e => setStrategyInput(e.target.value)}
                placeholder="Ask your AI football coach anything — plays, recruiting, film breakdown, training plans…"
                rows={3} className="w-full bg-[#0d1f3c] border border-blue-800 text-white text-sm rounded-xl px-4 py-3 focus:outline-none focus:border-red-500 placeholder-blue-500 resize-none mb-3" />
              <button
                onClick={() => strategyInput.trim() && getAdviceMutation.mutate({ sport: "Football", question: strategyInput, targetLevel: "D1" })}
                disabled={getAdviceMutation.isPending || !strategyInput.trim()}
                className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 disabled:opacity-50 text-white font-bold py-3 rounded-xl transition-all">
                {getAdviceMutation.isPending ? "🏈 Coaching…" : "Get AI Strategy Plan"}
              </button>
            </div>
            {strategyResult && (
              <div className="bg-[#1a3a8f] border border-red-700/50 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-6 h-6 rounded-full bg-red-600 flex items-center justify-center text-xs">🏈</div>
                  <div className="text-white font-bold text-sm">Your AI Strategy Plan</div>
                </div>
                <p className="text-blue-100 text-sm leading-relaxed whitespace-pre-wrap">{strategyResult}</p>
                <div className="mt-3 flex gap-2">
                  <Link href="/nil-portal"><button className="flex-1 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold py-2 rounded-lg">Share to Feed</button></Link>
                  <Link href="/ai-recruiter"><button className="flex-1 bg-red-600 hover:bg-red-500 text-white text-xs font-bold py-2 rounded-lg">AI Recruiter</button></Link>
                </div>
              </div>
            )}
          </div>
        )}
        {activeTab === "team" && (
          <div className="space-y-4">
            {/* Leaderboard from real DB */}
            <div className="bg-[#1a3a8f] border border-blue-900 rounded-xl p-4">
              <h3 className="text-white font-bold mb-3">🏆 Top Football Athletes on AthlynX</h3>
              {(athletes as any[]).length === 0 ? (
                <div className="text-center py-4 text-blue-400 text-sm">No football athletes yet. Be the first!</div>
              ) : (
                <div className="space-y-2">
                  {(athletes as any[]).map((a: any, i: number) => (
                    <div key={a.id} className="flex items-center gap-3 bg-[#1530a0] rounded-xl p-3">
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black shrink-0 ${i === 0 ? "bg-blue-900/30 text-black" : i === 1 ? "bg-gray-400 text-black" : i === 2 ? "bg-blue-600 text-white" : "bg-blue-800 text-white"}`}>{i + 1}</div>
                      <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 shrink-0 overflow-hidden" title={a.name ? `${a.name} — Identity pending` : "Identity pending"}>
                        {a.avatarUrl ? <img src={a.avatarUrl} className="w-full h-full object-cover" alt={a.name || "Athlete"} /> : (
                          <svg viewBox="0 0 24 24" className="w-3/5 h-3/5" fill="currentColor" aria-hidden="true"><path d="M12 12c2.7 0 4.9-2.2 4.9-4.9S14.7 2.2 12 2.2 7.1 4.4 7.1 7.1 9.3 12 12 12zm0 2.2c-3.3 0-9.8 1.7-9.8 4.9v2.7h19.6v-2.7c0-3.3-6.5-4.9-9.8-4.9z"/></svg>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-white text-sm font-bold truncate">{a.name || "Athlete"}</div>
                        <div className="text-blue-400 text-xs">{a.position || "—"} · {a.school || "—"}</div>
                      </div>
                      <div className="text-green-400 font-bold text-sm shrink-0">{a.nilValue ? `$${Number(a.nilValue).toLocaleString()}` : "—"}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            {/* Training Stats */}
            {user && trainingStats && (
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: "Sessions", value: trainingStats.totalSessions, color: "text-red-400" },
                  { label: "Minutes", value: trainingStats.totalMinutes, color: "text-green-400" },
                  { label: "Avg Perf", value: trainingStats.avgPerformance ? trainingStats.avgPerformance + "/10" : "N/A", color: "text-blue-400" },
                ].map((stat, i) => (
                  <div key={i} className="bg-[#1a3a8f] border border-blue-900 rounded-xl p-3 text-center">
                    <div className={`text-2xl font-black ${stat.color}`}>{stat.value}</div>
                    <div className="text-blue-400 text-xs">{stat.label}</div>
                  </div>
                ))}
              </div>
            )}
            {/* Log Workout */}
            <div className="bg-[#1a3a8f] border border-blue-900 rounded-xl p-5">
              <h3 className="text-white font-black text-lg mb-4">📋 Log Workout</h3>
              {!user ? (
                <div className="text-center py-4">
                  <a href="/signin" className="bg-[#1E90FF] hover:bg-blue-400 text-black font-black px-6 py-2.5 rounded-xl transition-colors">Sign In to Log Workouts</a>
                </div>
              ) : (
                <div className="space-y-3">
                  <input
                    value={workoutInput}
                    onChange={e => setWorkoutInput(e.target.value)}
                    placeholder="Workout name (e.g. Speed & Agility, Weight Film Study)"
                    className="w-full bg-[#0d1f3c] border border-blue-800 text-white text-sm rounded-xl px-4 py-2.5 focus:outline-none focus:border-red-500 placeholder-blue-500"
                  />
                  <div className="flex gap-3">
                    <input
                      value={workoutDuration}
                      onChange={e => setWorkoutDuration(e.target.value)}
                      placeholder="Duration (mins)"
                      type="number"
                      className="flex-1 bg-[#0d1f3c] border border-blue-800 text-white text-sm rounded-xl px-4 py-2.5 focus:outline-none focus:border-red-500 placeholder-blue-500"
                    />
                    <input
                      value={workoutNotes}
                      onChange={e => setWorkoutNotes(e.target.value)}
                      placeholder="Notes (optional)"
                      className="flex-1 bg-[#0d1f3c] border border-blue-800 text-white text-sm rounded-xl px-4 py-2.5 focus:outline-none focus:border-red-500 placeholder-blue-500"
                    />
                  </div>
                  <button
                    onClick={() => workoutInput.trim() && logWorkoutMutation.mutate({ workout: workoutInput, duration: workoutDuration ? parseInt(workoutDuration) : undefined, notes: workoutNotes || undefined })}
                    disabled={logWorkoutMutation.isPending || !workoutInput.trim()}
                    className="bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white font-bold px-6 py-2.5 rounded-xl transition-colors"
                  >
                    {logWorkoutMutation.isPending ? "Logging..." : "Log Workout"}
                  </button>
                </div>
              )}
            </div>
            {/* Training History */}
            {user && trainingHistory.length > 0 && (
              <div className="bg-[#1a3a8f] border border-blue-900 rounded-xl p-4">
                <h4 className="text-white font-bold mb-3">Recent Workouts</h4>
                <div className="space-y-2">
                  {(trainingHistory as any[]).map((log: any) => (
                    <div key={log.id} className="flex items-center gap-3 py-2 border-b border-blue-900/50 last:border-0">
                      <div className="w-8 h-8 rounded-lg bg-red-600/20 flex items-center justify-center text-red-400 text-lg">🏋️</div>
                      <div className="flex-1 min-w-0">
                        <div className="text-white text-sm font-semibold truncate">{log.workout}</div>
                        <div className="text-blue-400 text-xs">{log.duration ? log.duration + " min" : ""}{log.notes ? " • " + log.notes : ""}</div>
                      </div>
                      <div className="text-blue-500 text-xs shrink-0">{new Date(log.logDate).toLocaleDateString()}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </PlatformLayout>
  );
}

export default function WarriorsPlaybook() {
  return <RouteErrorBoundary><WarriorsPlaybookInner /></RouteErrorBoundary>;
}
