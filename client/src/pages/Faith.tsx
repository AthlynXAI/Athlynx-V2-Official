import { useState } from "react";
import { RouteErrorBoundary } from "@/components/GlobalErrorBoundary";
import PlatformLayout from "@/components/PlatformLayout";
import { useAuth } from "@/_core/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

const DAILY_VERSES = [
  { ref: "Philippians 4:13", text: "I can do all things through Christ who strengthens me." },
  { ref: "Isaiah 40:31", text: "But those who hope in the Lord will renew their strength. They will soar on wings like eagles; they will run and not grow weary, they will walk and not be faint." },
  { ref: "Joshua 1:9", text: "Have I not commanded you? Be strong and courageous. Do not be afraid; do not be discouraged, for the Lord your God will be with you wherever you go." },
  { ref: "Romans 8:28", text: "And we know that in all things God works for the good of those who love him, who have been called according to his purpose." },
  { ref: "Proverbs 27:17", text: "As iron sharpens iron, so one person sharpens another." },
  { ref: "1 Corinthians 9:24", text: "Do you not know that in a race all the runners run, but only one gets the prize? Run in such a way as to get the prize." },
  { ref: "2 Timothy 4:7", text: "I have fought the good fight, I have finished the race, I have kept the faith." },
];

const DEVOTIONALS = [
  { id: 1, title: "Competing with Purpose", subtitle: "Why You Play Matters More Than How You Play", day: "Today", category: "Purpose", readTime: "4 min", verse: "Colossians 3:23", verseText: "Whatever you do, work at it with all your heart, as working for the Lord, not for human masters.", content: "Every athlete steps onto the field, court, or track with a reason. Some play for scholarships. Some play for fame. Some play to prove people wrong. But the athletes who last — who perform under pressure, who bounce back from injury, who lead their teams — are the ones who play for something bigger than themselves. When you anchor your purpose in faith, the outcome of any single game no longer defines you. Your identity is secure. Your effort becomes worship.", icon: "", color: "from-blue-900/60 to-blue-800/40", border: "border-blue-700/50" },
  { id: 2, title: "Handling Adversity", subtitle: "Finding Strength in Your Toughest Moments", day: "Yesterday", category: "Resilience", readTime: "5 min", verse: "James 1:2-4", verseText: "Consider it pure joy, my brothers and sisters, whenever you face trials of many kinds, because you know that the testing of your faith produces perseverance.", content: "Injuries. Losing streaks. Coaches who don't believe in you. Getting cut. Being overlooked. Every athlete faces adversity — it's not a question of if, but when. The question is what you do with it. Scripture doesn't promise a life without hardship. It promises that hardship, when met with faith, produces something unbreakable in you. The athlete who has been through the fire and come out the other side is the one scouts can't ignore — because they've seen what you're made of.", icon: "", color: "from-[#1E90FF]/60 to-[#0a1628]/40", border: "border-[#1E90FF]/50" },
  { id: 3, title: "Team & Brotherhood", subtitle: "The Spiritual Foundation of a Winning Culture", day: "2 days ago", category: "Leadership", readTime: "4 min", verse: "Ecclesiastes 4:12", verseText: "Though one may be overpowered, two can defend themselves. A cord of three strands is not quickly broken.", content: "The greatest teams in history weren't just talented — they were unified. Unified teams share sacrifice. They celebrate each other's wins as their own. They hold each other accountable not out of obligation but out of genuine love for one another. Iron sharpens iron. When you surround yourself with teammates who push you spiritually, mentally, and physically, you become something none of you could be alone. That's not just good team culture — that's God's design.", icon: "", color: "from-[#1E90FF]/60 to-[#0a1628]/40", border: "border-[#1E90FF]/50" },
  { id: 4, title: "Humility in Victory", subtitle: "Staying Grounded When Success Comes Your Way", day: "3 days ago", category: "Character", readTime: "3 min", verse: "Proverbs 16:18", verseText: "Pride goes before destruction, a haughty spirit before a fall.", content: "Nothing derails a promising career faster than pride. We've all seen it — the athlete who gets their first big deal, first big game, first viral moment — and suddenly forgets the people who got them there. Humility isn't weakness. It's the mark of a champion who knows where their gifts come from. The most decorated athletes in history — the ones who built legacies — were the ones who remained coachable, grateful, and grounded no matter how high they climbed.", icon: "", color: "from-blue-900/60 to-blue-800/40", border: "border-blue-700/50" },
  { id: 5, title: "Rest & Recovery", subtitle: "God Rested on the Seventh Day — So Should You", day: "4 days ago", category: "Wellness", readTime: "3 min", verse: "Matthew 11:28", verseText: "Come to me, all you who are weary and burdened, and I will give you rest.", content: "In a culture that glorifies the grind, rest is countercultural. But God built rest into the very fabric of creation. The body needs recovery. The mind needs stillness. The spirit needs renewal. The best coaches in the world know that overtraining leads to breakdown. The same is true spiritually. When you make time for rest — real rest, not just sleep but soul-level stillness — you come back sharper, more focused, and more ready to compete at your highest level.", icon: "", color: "from-[#00C2FF]/60 to-teal-800/40", border: "border-[#00C2FF]/50" },
  { id: 6, title: "Your Platform is a Pulpit", subtitle: "Using Your Influence for Something Greater", day: "5 days ago", category: "Impact", readTime: "5 min", verse: "Matthew 5:16", verseText: "Let your light shine before others, that they may see your good deeds and glorify your Father in heaven.", content: "Every athlete with a following has a platform. And every platform is an opportunity. NIL deals, social media, brand partnerships — these aren't just financial tools. They're megaphones. The question isn't whether you'll use your platform. You already are. The question is what you're saying with it. The athletes who build lasting legacies are the ones who use their influence to lift others, speak truth, and point to something bigger than themselves.", icon: "", color: "from-[#00C2FF]/60 to-[#0a1628]/40", border: "border-[#00C2FF]/50" },
];

const PRAYER_REQUESTS = [
  { name: "Marcus W.", sport: "Football", prayer: "Praying for my team's health this season. We've had too many injuries. God, cover our guys. ", time: "2h ago", likes: 47 },
  { name: "Aaliyah J.", sport: "Basketball", prayer: "Thank God for the scholarship opportunity to play D1. Never giving up on this dream. He makes a way. ", time: "4h ago", likes: 89 },
  { name: "DeShawn C.", sport: "Football", prayer: "Prayers for all athletes chasing their dreams. Don't quit. Your breakthrough is coming.", time: "6h ago", likes: 134 },
  { name: "Sofia R.", sport: "Soccer", prayer: "Lord, help me stay focused during the recruiting process. I trust your timing over my own. ", time: "8h ago", likes: 61 },
  { name: "Jordan M.", sport: "Track & Field", prayer: "Recovering from a hamstring injury. Believing for a full, fast recovery before nationals. ", time: "12h ago", likes: 203 },
  { name: "Tyler B.", sport: "Baseball", prayer: "Grateful for another season. Win or lose, I play for an audience of One. ", time: "1d ago", likes: 78 },
];

const FAITH_ATHLETES = [
  { name: "Steph Curry", sport: "NBA", quote: "I can do all things — that's my life verse. Everything I do is for His glory.", verse: "Phil 4:13" },
  { name: "Tim Tebow", sport: "NFL/MLB", quote: "My faith defines who I am. Not my stats, not my wins, not my losses.", verse: "John 3:16" },
  { name: "Simone Biles", sport: "Gymnastics", quote: "I have to remember that God gave me this talent and I'm using it for His glory.", verse: "Psalm 46:5" },
  { name: "Russell Wilson", sport: "NFL", quote: "Why not you? God has a plan for your life greater than you can imagine.", verse: "Jer 29:11" },
  { name: "Candace Parker", sport: "WNBA", quote: "Faith is the foundation. Everything else is built on top of it.", verse: "Heb 11:1" },
  { name: "Clayton Kershaw", sport: "MLB", quote: "Baseball is what I do. It's not who I am. My identity is in Christ.", verse: "Gal 2:20" },
];

const SCRIPTURE_SECTIONS = [
  { topic: "Strength & Endurance", icon: "", color: "border-blue-600", verses: [
    { ref: "Isaiah 40:31", text: "Those who hope in the Lord will renew their strength. They will soar on wings like eagles." },
    { ref: "Philippians 4:13", text: "I can do all things through Christ who strengthens me." },
    { ref: "2 Corinthians 12:10", text: "For when I am weak, then I am strong." },
  ]},
  { topic: "Overcoming Adversity", icon: "", color: "border-[#1E90FF]", verses: [
    { ref: "Romans 5:3-4", text: "We also glory in our sufferings, because we know that suffering produces perseverance; perseverance, character; and character, hope." },
    { ref: "James 1:2-4", text: "Consider it pure joy whenever you face trials, because the testing of your faith produces perseverance." },
    { ref: "John 16:33", text: "In this world you will have trouble. But take heart! I have overcome the world." },
  ]},
  { topic: "Purpose & Identity", icon: "", color: "border-blue-600", verses: [
    { ref: "Jeremiah 29:11", text: "For I know the plans I have for you, plans to prosper you and not to harm you, plans to give you hope and a future." },
    { ref: "Colossians 3:23", text: "Whatever you do, work at it with all your heart, as working for the Lord." },
    { ref: "Ephesians 2:10", text: "For we are God's handiwork, created in Christ Jesus to do good works, which God prepared in advance for us to do." },
  ]},
  { topic: "Team & Leadership", icon: "", color: "border-[#00C2FF]", verses: [
    { ref: "Proverbs 27:17", text: "As iron sharpens iron, so one person sharpens another." },
    { ref: "Ecclesiastes 4:12", text: "A cord of three strands is not quickly broken." },
    { ref: "1 Corinthians 12:27", text: "Now you are the body of Christ, and each one of you is a part of it." },
  ]},
  { topic: "Victory & Excellence", icon: "", color: "border-[#1E90FF]", verses: [
    { ref: "1 Corinthians 9:24", text: "Run in such a way as to get the prize." },
    { ref: "2 Timothy 4:7", text: "I have fought the good fight, I have finished the race, I have kept the faith." },
    { ref: "Hebrews 12:1", text: "Let us run with perseverance the race marked out for us." },
  ]},
];

const CATEGORIES = ["All", "Purpose", "Resilience", "Leadership", "Character", "Wellness", "Impact"];

function FaithInner() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<"devotionals" | "prayer" | "verses" | "athletes">("devotionals");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [expandedDev, setExpandedDev] = useState<number | null>(null);
  const [prayerText, setPrayerText] = useState("");
  const [likedPrayers, setLikedPrayers] = useState<Set<number>>(new Set());

  const todayVerse = DAILY_VERSES[new Date().getDay()];
  const filteredDevotionals = selectedCategory === "All" ? DEVOTIONALS : DEVOTIONALS.filter(d => d.category === selectedCategory);

  const handlePostPrayer = () => {
    if (!prayerText.trim()) return;
    toast({ title: "Prayer Posted ", description: "Your prayer has been shared with the AthlynX faith community." });
    setPrayerText("");
  };

  const toggleLike = (idx: number) => {
    setLikedPrayers(prev => { const next = new Set(prev); if (next.has(idx)) next.delete(idx); else next.add(idx); return next; });
  };

  return (
    <PlatformLayout title="Faith">
      <div className="space-y-4 pb-20 lg:pb-4">

        {/* Header */}
        <div className="bg-gradient-to-r from-[#1a3a8f] to-[#1a2a4a] border border-[#1E90FF]/60 rounded-xl p-5">
          <div className="flex items-center gap-4">
            <img src="/faith-icon.png" alt="Faith" className="w-14 h-14 rounded-2xl object-cover shadow-lg" onError={e => { (e.target as HTMLImageElement).src = '/faith.png'; }} />
            <div className="flex-1">
              <h2 className="text-2xl font-black text-white">FAITH HUB </h2>
              <p className="text-blue-300 text-sm">Daily devotionals, scripture, prayer wall & spiritual strength for athletes</p>
            </div>
            <div className="text-right hidden sm:block">
              <div className="text-white font-black text-base">Iron Sharpens Iron</div>
              <div className="text-[#1E90FF] text-xs">— Proverbs 27:17</div>
            </div>
          </div>
        </div>

        {/* Today's Verse */}
        <div className="bg-gradient-to-br from-[#1E90FF]/50 to-[#1530a0] border border-[#1E90FF]/60 rounded-xl p-5">
          <div className="text-[#1E90FF] text-xs uppercase tracking-widest mb-2 font-bold"> Today's Verse</div>
          <blockquote className="text-white text-lg font-semibold leading-relaxed mb-2">"{todayVerse.text}"</blockquote>
          <div className="text-[#1E90FF] text-sm font-bold">— {todayVerse.ref}</div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-[#0d1b3e] rounded-xl p-1 border border-blue-900">
          {[
            { id: "devotionals", label: " Devotionals" },
            { id: "prayer", label: " Prayer Wall" },
            { id: "verses", label: " Scripture" },
            { id: "athletes", label: " Faith Athletes" },
          ].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`flex-1 text-xs font-bold py-2 rounded-lg transition-all ${activeTab === tab.id ? "bg-[#1E90FF] text-white" : "text-blue-400 hover:text-white"}`}>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Devotionals Tab */}
        {activeTab === "devotionals" && (
          <div className="space-y-3">
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
              {CATEGORIES.map(cat => (
                <button key={cat} onClick={() => setSelectedCategory(cat)}
                  className={`shrink-0 text-xs font-bold px-3 py-1.5 rounded-full border transition-all ${selectedCategory === cat ? "bg-[#1E90FF] text-white border-[#1E90FF]" : "bg-white/5 text-blue-400 border-blue-800 hover:border-blue-600 hover:text-white"}`}>
                  {cat}
                </button>
              ))}
            </div>
            {filteredDevotionals.map(dev => (
              <div key={dev.id} className={`bg-gradient-to-br ${dev.color} border ${dev.border} rounded-xl overflow-hidden`}>
                <div className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-xl shrink-0">{dev.icon}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">{dev.category}</span>
                        <span className="text-xs text-blue-500">• {dev.readTime}</span>
                        <span className="text-xs text-blue-500">• {dev.day}</span>
                      </div>
                      <h3 className="text-white font-black text-base leading-tight">{dev.title}</h3>
                      <p className="text-blue-300 text-xs mt-0.5">{dev.subtitle}</p>
                    </div>
                    <button onClick={() => setExpandedDev(expandedDev === dev.id ? null : dev.id)}
                      className="text-blue-400 hover:text-white text-xs font-bold shrink-0 transition-colors">
                      {expandedDev === dev.id ? "Close" : "Read →"}
                    </button>
                  </div>
                  {expandedDev === dev.id && (
                    <div className="mt-4 space-y-3">
                      <div className="bg-white/10 rounded-xl p-3">
                        <div className="text-xs text-blue-400 font-bold mb-1"> {dev.verse}</div>
                        <p className="text-white text-sm italic leading-relaxed">"{dev.verseText}"</p>
                      </div>
                      <p className="text-blue-200 text-sm leading-relaxed">{dev.content}</p>
                      <div className="flex gap-2">
                        <button onClick={() => { navigator.clipboard.writeText(`"${dev.verseText}" — ${dev.verse}`); toast({ title: "Copied!" }); }}
                          className="text-xs bg-white/10 hover:bg-white/20 text-white font-bold px-3 py-1.5 rounded-lg transition-colors">
                           Copy Verse
                        </button>
                        <button onClick={() => toast({ title: "Shared! " })}
                          className="text-xs bg-[#1E90FF]/60 hover:bg-[#1E90FF] text-white font-bold px-3 py-1.5 rounded-lg transition-colors">
                           Share
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Prayer Wall Tab */}
        {activeTab === "prayer" && (
          <div className="space-y-3">
            <div className="bg-[#1a3a8f] border border-blue-900 rounded-xl p-4">
              <h3 className="text-white font-bold mb-3"> Share a Prayer Request or Praise Report</h3>
              <textarea className="w-full bg-[#0d1b3e] border border-blue-800 text-white text-sm rounded-xl px-3 py-2.5 focus:outline-none focus:border-[#1E90FF] placeholder-blue-500 h-24 resize-none"
                placeholder="Share a prayer request, praise report, or encouragement for your fellow athletes..."
                value={prayerText} onChange={e => setPrayerText(e.target.value)} />
              <div className="flex items-center justify-between mt-2">
                <span className="text-blue-500 text-xs">{prayerText.length}/280</span>
                <button onClick={handlePostPrayer} disabled={!prayerText.trim()}
                  className="bg-[#1E90FF] hover:bg-[#1E90FF] disabled:opacity-40 text-white font-bold py-2 px-5 rounded-xl transition-colors text-sm">
                  Post to Prayer Wall 
                </button>
              </div>
            </div>
            <div className="space-y-3">
              {PRAYER_REQUESTS.map((req, i) => (
                <div key={i} className="bg-[#1a3a8f] border border-blue-900 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-full bg-[#1E90FF] flex items-center justify-center text-white font-black text-sm shrink-0">
                      {req.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-white font-bold text-sm">{req.name}</span>
                        <span className="text-blue-500 text-xs">• {req.sport}</span>
                        <span className="text-blue-600 text-xs ml-auto">{req.time}</span>
                      </div>
                      <p className="text-blue-200 text-sm leading-relaxed">{req.prayer}</p>
                      <div className="flex items-center gap-3 mt-2">
                        <button onClick={() => toggleLike(i)}
                          className={`flex items-center gap-1 text-xs font-bold transition-colors ${likedPrayers.has(i) ? "text-[#1E90FF]" : "text-blue-500 hover:text-[#1E90FF]"}`}>
                           {req.likes + (likedPrayers.has(i) ? 1 : 0)} Praying
                        </button>
                        <button className="text-blue-500 hover:text-white text-xs transition-colors">Reply</button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Scripture Library Tab */}
        {activeTab === "verses" && (
          <div className="space-y-3">
            <div className="bg-[#1a3a8f] border border-blue-900 rounded-xl p-4">
              <h3 className="text-white font-bold mb-1"> Scripture Library</h3>
              <p className="text-blue-400 text-xs">Verses for every moment in an athlete's journey</p>
            </div>
            {SCRIPTURE_SECTIONS.map((section, si) => (
              <div key={si} className={`bg-[#1a3a8f] border ${section.color} rounded-xl p-4`}>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xl">{section.icon}</span>
                  <h3 className="text-white font-bold">{section.topic}</h3>
                </div>
                <div className="space-y-2">
                  {section.verses.map((v, vi) => (
                    <div key={vi} className="bg-[#0d1b3e] rounded-xl p-3">
                      <div className="text-blue-400 text-xs font-bold mb-1">{v.ref}</div>
                      <p className="text-blue-200 text-sm italic leading-relaxed">"{v.text}"</p>
                      <button onClick={() => { navigator.clipboard.writeText(`"${v.text}" — ${v.ref}`); toast({ title: "Copied!" }); }}
                        className="text-xs text-blue-500 hover:text-white mt-1 transition-colors"> Copy</button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Faith Athletes Tab */}
        {activeTab === "athletes" && (
          <div className="space-y-3">
            <div className="bg-[#1a3a8f] border border-blue-900 rounded-xl p-4">
              <h3 className="text-white font-bold mb-1"> Athletes of Faith</h3>
              <p className="text-blue-400 text-xs">Champions who compete for something greater than themselves</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {FAITH_ATHLETES.map((athlete, i) => (
                <div key={i} className="bg-gradient-to-br from-[#1a3a8f] to-[#1530a0] border border-blue-800 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#1E90FF] flex items-center justify-center text-white font-black text-sm shrink-0">
                      {athlete.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </div>
                    <div>
                      <div className="text-white font-black text-sm">{athlete.name}</div>
                      <div className="text-blue-400 text-xs">{athlete.sport}</div>
                    </div>
                    <div className="ml-auto text-xs text-[#1E90FF] font-bold">{athlete.verse}</div>
                  </div>
                  <p className="text-blue-200 text-sm italic mt-3 leading-relaxed">"{athlete.quote}"</p>
                </div>
              ))}
            </div>
            <div className="bg-gradient-to-br from-[#1E90FF]/50 to-[#1530a0] border border-[#1E90FF]/60 rounded-xl p-5 text-center">
              <div className="text-3xl mb-2"></div>
              <h3 className="text-white font-black text-lg mb-1">Your Faith Story Matters</h3>
              <p className="text-blue-300 text-sm mb-4">Share how faith drives your athletic journey. Inspire the next generation of faith-driven athletes.</p>
              <a href="/community-feedback"
                className="inline-block bg-[#1E90FF] hover:bg-[#1E90FF] text-white font-bold py-2.5 px-6 rounded-xl transition-colors">
                Share Your Story 
              </a>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="bg-[#1a3a8f] border border-blue-900 rounded-xl p-4 text-center">
          <div className="text-white font-black text-sm mb-1">Iron Sharpens Iron — Proverbs 27:17</div>
          <div className="text-blue-400 text-xs">AthlynXAI · Chad A. Dozier Sr., Founder · CEO · Chairman</div>
        </div>
      </div>
    </PlatformLayout>
  );
}

export default function Faith() {
  return <RouteErrorBoundary><FaithInner /></RouteErrorBoundary>;
}
