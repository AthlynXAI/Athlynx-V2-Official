import { toast } from "sonner";
import PlatformLayout from "@/components/PlatformLayout";
import { useState } from "react";
import { RouteErrorBoundary } from "@/components/GlobalErrorBoundary";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";

function AIContentInner() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<"caption" | "bio" | "plan" | "hashtags" | "tips">("caption");
  const [captionForm, setCaptionForm] = useState({ platform: "instagram" as "instagram"|"twitter"|"tiktok"|"linkedin", contentType: "highlight" as "highlight"|"training"|"gameday"|"nil_deal"|"motivation"|"recruiting", context: "", sport: "" });
  const [captionResult, setCaptionResult] = useState("");
  const [bioForm, setBioForm] = useState({ platform: "instagram" as "instagram"|"twitter"|"tiktok"|"linkedin", sport: "", school: "", position: "", achievements: "" });
  const [bioResult, setBioResult] = useState("");
  const [planForm, setPlanForm] = useState({ sport: "", season: "in-season" as "preseason"|"in-season"|"offseason"|"postseason", goals: "", platforms: ["instagram", "twitter"] });
  const [planResult, setPlanResult] = useState("");
  const captionMutation = trpc.ai.generateCaption.useMutation({ onSuccess: (d) => setCaptionResult(String(d.captions ?? "")) });
  const bioMutation = trpc.ai.generateBio.useMutation({ onSuccess: (d) => setBioResult(String(d.bios ?? "")) });
  const planMutation = trpc.ai.generateContentPlan.useMutation({ onSuccess: (d) => setPlanResult(String(d.plan ?? "")) });
  const bufferMutation = trpc.ai.scheduleToBuffer.useMutation({
    onSuccess: (d) => toast.success(`Posted to ${d.posted} channel${d.posted !== 1 ? "s" : ""} via Buffer!`),
    onError: (e) => toast.error(e.message || "Buffer post failed"),
  });
  return (
    <PlatformLayout title="AI Content">
      <div className="space-y-4 pb-20 lg:pb-4">
        <div className="bg-gradient-to-r from-[#1a3a8f] to-[#1a2a4a] border border-red-700 rounded-xl p-5">
          <div className="flex items-center gap-4">
            <img src="/ai-content.png" alt="AI Content" className="w-14 h-14 rounded-2xl object-cover shadow-lg" />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-black text-white">AI CONTENT</h2>
                <span className="text-xs bg-red-600 text-white px-2 py-0.5 rounded-full font-bold">BLEND</span>
              </div>
              <p className="text-blue-300 text-sm">Create viral content, highlight reels, and brand-ready media with AI</p>
            </div>
          </div>
        </div>
        {/* Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          {([
            { id: "caption", label: "📱 Captions" },
            { id: "bio", label: "✍️ Bio Writer" },
            { id: "plan", label: "📅 30-Day Plan" },
            { id: "hashtags", label: "#️⃣ Hashtags" },
            { id: "tips", label: "💡 Tips" },
          ] as const).map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`flex-shrink-0 px-4 py-2.5 rounded-xl font-bold text-sm transition-all ${
                activeTab === tab.id ? "bg-red-600 text-white" : "bg-[#1a2a4a] text-blue-300 hover:bg-[#1a3a6a]"
              }`}>
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === "caption" && (
          <div className="bg-[#0d1f3c] border border-red-900 rounded-xl p-5 space-y-4">
            <h3 className="text-white font-bold text-lg">Social Media Caption Generator</h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-blue-300 text-xs font-semibold block mb-1">Platform</label>
                <select className="w-full bg-[#1a2a4a] border border-blue-800 text-white text-sm rounded-lg px-3 py-2.5"
                  value={captionForm.platform} onChange={e => setCaptionForm(f => ({ ...f, platform: e.target.value as any }))}>
                  {["instagram","twitter","tiktok","linkedin"].map(p => <option key={p} value={p}>{p.charAt(0).toUpperCase()+p.slice(1)}</option>)}
                </select>
              </div>
              <div>
                <label className="text-blue-300 text-xs font-semibold block mb-1">Content Type</label>
                <select className="w-full bg-[#1a2a4a] border border-blue-800 text-white text-sm rounded-lg px-3 py-2.5"
                  value={captionForm.contentType} onChange={e => setCaptionForm(f => ({ ...f, contentType: e.target.value as any }))}>
                  {["highlight","training","gameday","nil_deal","motivation","recruiting"].map(t => <option key={t} value={t}>{t.replace("_"," ").toUpperCase()}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="text-blue-300 text-xs font-semibold block mb-1">What's the post about?</label>
              <textarea className="w-full bg-[#1a2a4a] border border-blue-800 text-white text-sm rounded-lg px-3 py-2.5 h-20 resize-none placeholder-blue-600"
                placeholder="e.g. Just dropped 4 TDs in the championship game, feeling blessed..."
                value={captionForm.context} onChange={e => setCaptionForm(f => ({ ...f, context: e.target.value }))} />
            </div>
            <button onClick={() => captionMutation.mutate({ platform: captionForm.platform, contentType: captionForm.contentType, context: captionForm.context || "Athletic achievement", sport: captionForm.sport, includeHashtags: true })}
              disabled={captionMutation.isPending}
              className="w-full bg-gradient-to-r from-red-600 to-blue-700 hover:from-red-500 hover:to-blue-600 disabled:opacity-50 text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2">
              {captionMutation.isPending ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Generating...</> : "✨ Generate Captions"}
            </button>
            {captionResult && (
              <div className="bg-[#0a1628] border border-red-800 rounded-xl p-4">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="text-red-400 font-bold text-sm">✨ AI Captions</h4>
                  <button onClick={() => navigator.clipboard.writeText(captionResult)} className="text-xs text-blue-400 hover:text-white border border-blue-700 px-2 py-1 rounded-lg">Copy All</button>
                </div>
                <pre className="text-white text-sm whitespace-pre-wrap font-sans leading-relaxed">{captionResult}</pre>
              </div>
            )}
          </div>
        )}

        {activeTab === "bio" && (
          <div className="bg-[#0d1f3c] border border-red-900 rounded-xl p-5 space-y-4">
            <h3 className="text-white font-bold text-lg">Athlete Bio Writer</h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-blue-300 text-xs font-semibold block mb-1">Platform</label>
                <select className="w-full bg-[#1a2a4a] border border-blue-800 text-white text-sm rounded-lg px-3 py-2.5"
                  value={bioForm.platform} onChange={e => setBioForm(f => ({ ...f, platform: e.target.value as any }))}>
                  {["instagram","twitter","tiktok","linkedin"].map(p => <option key={p} value={p}>{p.charAt(0).toUpperCase()+p.slice(1)}</option>)}
                </select>
              </div>
              <div>
                <label className="text-blue-300 text-xs font-semibold block mb-1">Sport</label>
                <input className="w-full bg-[#1a2a4a] border border-blue-800 text-white text-sm rounded-lg px-3 py-2.5 placeholder-blue-600"
                  placeholder="e.g. Football" value={bioForm.sport} onChange={e => setBioForm(f => ({ ...f, sport: e.target.value }))} />
              </div>
              <div>
                <label className="text-blue-300 text-xs font-semibold block mb-1">School</label>
                <input className="w-full bg-[#1a2a4a] border border-blue-800 text-white text-sm rounded-lg px-3 py-2.5 placeholder-blue-600"
                  placeholder="e.g. Alabama" value={bioForm.school} onChange={e => setBioForm(f => ({ ...f, school: e.target.value }))} />
              </div>
              <div>
                <label className="text-blue-300 text-xs font-semibold block mb-1">Position</label>
                <input className="w-full bg-[#1a2a4a] border border-blue-800 text-white text-sm rounded-lg px-3 py-2.5 placeholder-blue-600"
                  placeholder="e.g. QB" value={bioForm.position} onChange={e => setBioForm(f => ({ ...f, position: e.target.value }))} />
              </div>
            </div>
            <div>
              <label className="text-blue-300 text-xs font-semibold block mb-1">Key Achievements</label>
              <textarea className="w-full bg-[#1a2a4a] border border-blue-800 text-white text-sm rounded-lg px-3 py-2.5 h-16 resize-none placeholder-blue-600"
                placeholder="e.g. 4,200 passing yards, 38 TDs, All-Conference 2024..."
                value={bioForm.achievements} onChange={e => setBioForm(f => ({ ...f, achievements: e.target.value }))} />
            </div>
            <button onClick={() => bioMutation.mutate({ platform: bioForm.platform, athleteName: user?.name || "Athlete", sport: bioForm.sport || "Athlete", school: bioForm.school || undefined, position: bioForm.position || undefined, achievements: bioForm.achievements || undefined })}
              disabled={bioMutation.isPending}
              className="w-full bg-gradient-to-r from-blue-700 to-red-600 hover:from-blue-600 hover:to-red-500 disabled:opacity-50 text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2">
              {bioMutation.isPending ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Writing...</> : "✍️ Write My Bio"}
            </button>
            {bioResult && (
              <div className="bg-[#0a1628] border border-blue-900 rounded-xl p-4">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="text-blue-500 font-bold text-sm">✍️ AI Bio Options</h4>
                  <button onClick={() => navigator.clipboard.writeText(bioResult)} className="text-xs text-blue-400 hover:text-white border border-blue-700 px-2 py-1 rounded-lg">Copy</button>
                </div>
                <pre className="text-white text-sm whitespace-pre-wrap font-sans leading-relaxed">{bioResult}</pre>
              </div>
            )}
          </div>
        )}

        {activeTab === "plan" && (
          <div className="bg-[#0d1f3c] border border-red-900 rounded-xl p-5 space-y-4">
            <h3 className="text-white font-bold text-lg">30-Day Content Plan</h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-blue-300 text-xs font-semibold block mb-1">Sport</label>
                <input className="w-full bg-[#1a2a4a] border border-blue-800 text-white text-sm rounded-lg px-3 py-2.5 placeholder-blue-600"
                  placeholder="e.g. Basketball" value={planForm.sport} onChange={e => setPlanForm(f => ({ ...f, sport: e.target.value }))} />
              </div>
              <div>
                <label className="text-blue-300 text-xs font-semibold block mb-1">Season</label>
                <select className="w-full bg-[#1a2a4a] border border-blue-800 text-white text-sm rounded-lg px-3 py-2.5"
                  value={planForm.season} onChange={e => setPlanForm(f => ({ ...f, season: e.target.value as any }))}>
                  {["preseason","in-season","offseason","postseason"].map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="text-blue-300 text-xs font-semibold block mb-1">Your Goals</label>
              <textarea className="w-full bg-[#1a2a4a] border border-blue-800 text-white text-sm rounded-lg px-3 py-2.5 h-16 resize-none placeholder-blue-600"
                placeholder="e.g. Grow to 50K followers, attract NIL deals, get recruited to D1..."
                value={planForm.goals} onChange={e => setPlanForm(f => ({ ...f, goals: e.target.value }))} />
            </div>
            <button onClick={() => planMutation.mutate({ sport: planForm.sport || "College Sport", season: planForm.season, goals: planForm.goals || "Grow audience and attract NIL deals", platforms: planForm.platforms })}
              disabled={planMutation.isPending}
              className="w-full bg-gradient-to-r from-blue-600 to-red-600 hover:from-blue-500 hover:to-red-500 disabled:opacity-50 text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2">
              {planMutation.isPending ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Creating Plan...</> : "📅 Generate 30-Day Plan"}
            </button>
            {planResult && (
              <div className="bg-[#0a1628] border border-blue-800 rounded-xl p-4">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="text-blue-400 font-bold text-sm">📅 Your 30-Day Content Plan</h4>
                  <button onClick={() => navigator.clipboard.writeText(planResult)} className="text-xs text-blue-400 hover:text-white border border-blue-700 px-2 py-1 rounded-lg">Copy</button>
                  <button
                    onClick={() => bufferMutation.mutate({ text: planResult.slice(0, 500), channels: ["twitter", "instagram", "facebook"] })}
                    disabled={bufferMutation.isPending}
                    className="text-xs text-green-400 hover:text-white border border-green-700 px-2 py-1 rounded-lg disabled:opacity-50"
                  >
                    {bufferMutation.isPending ? "Posting..." : "📲 Post to Buffer"}
                  </button>
                </div>
                <pre className="text-white text-sm whitespace-pre-wrap font-sans leading-relaxed">{planResult}</pre>
              </div>
            )}
          </div>
        )}

        {/* Hashtag Generator Tab */}
        {activeTab === "hashtags" && (
          <div className="space-y-3">
            <div className="bg-[#0d1f3c] border border-red-900 rounded-xl p-5">
              <h3 className="text-white font-bold text-lg mb-4">#️⃣ Hashtag Sets by Sport & Goal</h3>
              <div className="space-y-4">
                {[
                  { sport: "Football", icon: "🏈", sets: [
                    { label: "Recruiting", tags: "#FootballRecruiting #CFBRecruiting #D1Football #FootballScholarship #CollegeFootball #RecruitingClass2027 #NCAAFB #HighSchoolFootball" },
                    { label: "NIL", tags: "#NILFootball #FootballNIL #CollegeAthleteNIL #NILDeal #AthleteMarketing #BrandAmbassador #NIL2026" },
                    { label: "Training", tags: "#FootballTraining #QBTraining #WRTraining #DBTraining #FootballDrills #GridironGrind #FootballWorkout" },
                  ]},
                  { sport: "Basketball", icon: "🏀", sets: [
                    { label: "Recruiting", tags: "#BasketballRecruiting #HoopsDreams #D1Basketball #CollegeHoops #BasketballScholarship #NBAdraft #EYBLBasketball" },
                    { label: "NIL", tags: "#BasketballNIL #NILHoops #CollegeBasketball #AthleteNIL #HoopsNIL #BasketballBrand" },
                    { label: "Highlights", tags: "#BasketballHighlights #HoopsHighlights #BasketballMix #NBAProspect #CollegeHoopsHighlights" },
                  ]},
                  { sport: "Baseball", icon: "⚾", sets: [
                    { label: "Recruiting", tags: "#BaseballRecruiting #CollegeBaseball #D1Baseball #BaseballScholarship #PGBaseball #PerfectGame #BaseballProspect" },
                    { label: "Training", tags: "#BaseballTraining #PitchingMechanics #HittingDrills #BaseballGrind #BaseballDevelopment #DiamondGrind" },
                  ]},
                  { sport: "Soccer", icon: "⚽", sets: [
                    { label: "Recruiting", tags: "#SoccerRecruiting #CollegeSoccer #D1Soccer #SoccerScholarship #USYouthSoccer #SoccerProspect" },
                    { label: "NIL", tags: "#SoccerNIL #NILSoccer #CollegeSoccerNIL #SoccerBrand #AthleteMarketing" },
                  ]},
                  { sport: "Track & Field", icon: "💨", sets: [
                    { label: "Recruiting", tags: "#TrackRecruiting #TrackAndField #D1Track #TrackScholarship #SprintLife #TrackProspect #CollegeTrack" },
                    { label: "Training", tags: "#SprintTraining #TrackWorkout #SpeedTraining #TrackLife #AthleteTraining #SprintDrills" },
                  ]},
                  { sport: "General Athlete", icon: "🏆", sets: [
                    { label: "NIL & Brand", tags: "#NIL #NILDeal #CollegeAthlete #AthleteMarketing #BrandAmbassador #AthlynX #AthlynXAI #NILPortal" },
                    { label: "Motivation", tags: "#AthleteLife #GrindSeason #NeverSettle #EliteAthlete #ChampionMindset #NoExcuses #WorkEthic #AthleteMotivation" },
                    { label: "AthlynX", tags: "#AthlynX #AthlynXAI #AthletePlaybook #NILPlatform #AthleteSuccess #DozierHoldingsGroup" },
                  ]},
                ].map((sport, si) => (
                  <div key={si} className="bg-[#1a2a4a] rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-xl">{sport.icon}</span>
                      <span className="text-white font-bold">{sport.sport}</span>
                    </div>
                    <div className="space-y-2">
                      {sport.sets.map((set, ssi) => (
                        <div key={ssi} className="bg-[#0d1b3e] rounded-xl p-3">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-blue-400 text-xs font-bold uppercase">{set.label}</span>
                            <button onClick={() => { navigator.clipboard.writeText(set.tags); toast.success("Hashtags copied!"); }}
                              className="text-xs text-blue-400 hover:text-white border border-blue-700 px-2 py-1 rounded-lg transition-colors">
                              📋 Copy
                            </button>
                          </div>
                          <p className="text-blue-200 text-xs leading-relaxed">{set.tags}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Content Tips Tab */}
        {activeTab === "tips" && (
          <div className="space-y-3">
            <div className="bg-[#0d1f3c] border border-red-900 rounded-xl p-5">
              <h3 className="text-white font-bold text-lg mb-4">💡 Content Strategy for Athletes</h3>
              <div className="space-y-4">
                {[
                  { title: "The 3-2-1 Rule", icon: "📊", color: "border-blue-600", content: "Post 3 training/performance posts, 2 personal/behind-the-scenes posts, and 1 brand/NIL post per week. This ratio keeps your audience engaged while building your brand value for sponsors." },
                  { title: "Best Times to Post", icon: "⏰", color: "border-green-600", content: "Instagram: 6-9 AM and 5-8 PM EST. Twitter/X: 8-10 AM and 6-9 PM EST. TikTok: 7-9 AM, 12-3 PM, and 7-11 PM EST. Post when your audience is most active — typically before school/work and after dinner." },
                  { title: "Highlight Reel Checklist", icon: "🎬", color: "border-red-600", content: "Keep it under 90 seconds. Lead with your best play in the first 5 seconds. Include your name, position, school, and graduation year in the first frame. Add upbeat music. End with contact info. Update it every season." },
                  { title: "NIL-Ready Content", icon: "💰", color: "border-blue-400/40", content: "Brands look for athletes who post consistently, engage authentically, and align with their values. Showcase your personality, not just your stats. Document your journey — brands buy into stories, not just highlights." },
                  { title: "Engagement Over Followers", icon: "❤️", color: "border-pink-600", content: "A 10K follower account with 8% engagement is worth more to a brand than a 100K account with 0.5% engagement. Reply to comments, ask questions in your captions, and build a real community." },
                  { title: "Cross-Platform Strategy", icon: "📱", color: "border-purple-600", content: "Create once, distribute everywhere. Film a training video → post the full version on YouTube → cut a 60-second version for Instagram Reels → cut a 15-second version for TikTok → post a still frame on Twitter with a link. One piece of content, four platforms." },
                ].map((tip, ti) => (
                  <div key={ti} className={`bg-[#1a2a4a] border ${tip.color} rounded-xl p-4`}>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xl">{tip.icon}</span>
                      <h4 className="text-white font-bold">{tip.title}</h4>
                    </div>
                    <p className="text-blue-200 text-sm leading-relaxed">{tip.content}</p>
                  </div>
                ))}
                {/* CTA */}
                <div className="bg-gradient-to-br from-red-900/50 to-[#1530a0] border border-red-700/60 rounded-xl p-5 text-center">
                  <div className="text-3xl mb-2">🚀</div>
                  <h3 className="text-white font-black text-lg mb-1">Ready to Build Your Brand?</h3>
                  <p className="text-blue-300 text-sm mb-4">Use the Caption Generator and 30-Day Plan to start posting with purpose today.</p>
                  <button onClick={() => setActiveTab("caption")}
                    className="bg-red-700 hover:bg-red-600 text-white font-bold py-2.5 px-6 rounded-xl transition-colors">
                    Generate My First Caption →
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </PlatformLayout>
  );
}

export default function AIContent() {
  return <RouteErrorBoundary><AIContentInner /></RouteErrorBoundary>;
}
