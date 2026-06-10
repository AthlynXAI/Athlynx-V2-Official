import { useState, useEffect } from "react";
import { Zap, Star, Play, Eye, CheckCircle } from "lucide-react";

// Rotating athlete profiles to make it feel live
const ATHLETE_PROFILES = [
  {
    name: "Jaylen W.",
    year: "2026 QB / ATH",
    height: "6'2\"  190 LBS",
    city: "ATLANTA, GA",
    stats: [
      { label: "40 YD DASH", value: "4.62" },
      { label: "GPA", value: "3.85" },
      { label: "QB RATING", value: "105.6" },
    ],
    coachViews: 47,
    rating: 4,
    colleges: ["ALA", "OSU", "UGA"],
    collegeColors: ["#9E1B32", "#BB0000", "#BA0C2F"],
    collegeLabels: ["A", "O", "G"],
  },
  {
    name: "Marcus T.",
    year: "2025 WR / ATH",
    height: "6'0\"  175 LBS",
    city: "HOUSTON, TX",
    stats: [
      { label: "40 YD DASH", value: "4.41" },
      { label: "GPA", value: "3.70" },
      { label: "RECEPTIONS", value: "68" },
    ],
    coachViews: 31,
    rating: 5,
    colleges: ["TEX", "LSU", "OU"],
    collegeColors: ["#BF5700", "#461D7C", "#841617"],
    collegeLabels: ["T", "L", "O"],
  },
  {
    name: "Aaliyah J.",
    year: "2026 PG / BBALL",
    height: "5'8\"  145 LBS",
    city: "CHICAGO, IL",
    stats: [
      { label: "PPG", value: "24.3" },
      { label: "GPA", value: "3.92" },
      { label: "ASSISTS", value: "8.1" },
    ],
    coachViews: 62,
    rating: 5,
    colleges: ["UNC", "UCONN", "STAN"],
    collegeColors: ["#4B9CD3", "#000E2F", "#8C1515"],
    collegeLabels: ["U", "H", "S"],
  },
];

export default function EPXPhoneMockup() {
  const [profileIdx, setProfileIdx] = useState(0);
  const [coachCount, setCoachCount] = useState(ATHLETE_PROFILES[0].coachViews);
  const [playing, setPlaying] = useState(false);
  const [pulse, setPulse] = useState(false);

  const profile = ATHLETE_PROFILES[profileIdx];

  // Rotate profiles every 5 seconds
  useEffect(() => {
    const t = setInterval(() => {
      setProfileIdx(i => (i + 1) % ATHLETE_PROFILES.length);
      setPulse(true);
      setTimeout(() => setPulse(false), 600);
    }, 5000);
    return () => clearInterval(t);
  }, []);

  // Increment coach views live
  useEffect(() => {
    setCoachCount(profile.coachViews);
    const t = setInterval(() => {
      setCoachCount(c => c + 1);
    }, 8000);
    return () => clearInterval(t);
  }, [profileIdx]);

  return (
    <div className="relative flex flex-col items-center justify-center py-10 px-4 overflow-hidden">
      {/* Electric lightning background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-radial from-blue-900/20 via-transparent to-transparent" />
        {/* Lightning lines */}
        <svg className="absolute inset-0 w-full h-full opacity-30" viewBox="0 0 400 600" preserveAspectRatio="xMidYMid slice">
          <defs>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
              <feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
          </defs>
          <polyline points="30,0 60,120 40,120 80,260" stroke="#00c2ff" strokeWidth="1.5" fill="none" filter="url(#glow)" opacity="0.7"/>
          <polyline points="370,20 340,140 360,140 310,300" stroke="#00c2ff" strokeWidth="1.5" fill="none" filter="url(#glow)" opacity="0.7"/>
          <polyline points="10,200 50,320 30,320 70,480" stroke="#0066ff" strokeWidth="1" fill="none" filter="url(#glow)" opacity="0.5"/>
          <polyline points="390,180 350,310 370,310 330,460" stroke="#0066ff" strokeWidth="1" fill="none" filter="url(#glow)" opacity="0.5"/>
        </svg>
      </div>

      {/* Headline */}
      <div className="relative z-10 text-center mb-6 max-w-sm">
        <h2 className="text-white font-black text-2xl md:text-3xl leading-tight uppercase tracking-tight drop-shadow-lg">
          STOP WAITING TO BE DISCOVERED.
        </h2>
        <h2 className="text-[#00c2ff] font-black text-2xl md:text-3xl leading-tight uppercase tracking-tight italic drop-shadow-lg">
          GET RECRUITED ON YOUR TERMS.
        </h2>
      </div>

      {/* Phone frame */}
      <div className={`relative z-10 transition-all duration-500 ${pulse ? "scale-105" : "scale-100"}`}>
        {/* Coach views badge — floating */}
        <div className="absolute -right-4 top-16 z-20 bg-[#0a1628] border-2 border-[#00c2ff] rounded-2xl p-3 shadow-xl shadow-blue-900/50 min-w-[110px] text-center">
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-blue-900/60 border border-blue-700 flex items-center justify-center mx-auto mb-1">
              <Eye className="w-5 h-5 text-[#00c2ff]" />
            </div>
            <span className="absolute -top-1 -right-1 bg-[#1E90FF] text-white text-[10px] font-black rounded-full w-5 h-5 flex items-center justify-center">
              {coachCount > 99 ? "99+" : coachCount}
            </span>
          </div>
          <p className="text-white font-black text-xs leading-tight">
            {coachCount} COACHES<br />VIEWED YOUR<br />PROFILE TODAY
          </p>
        </div>

        {/* Phone shell */}
        <div className="w-[220px] bg-[#111] rounded-[36px] border-4 border-[#333] shadow-2xl shadow-blue-900/40 overflow-hidden">
          {/* Notch */}
          <div className="bg-[#111] flex justify-center pt-2 pb-1">
            <div className="w-20 h-5 bg-black rounded-full" />
          </div>

          {/* Screen content */}
          <div className="bg-[#050c1a] px-3 pb-4">
            {/* App header */}
            <div className="flex items-center justify-between py-2 border-b border-white/10 mb-3">
              <div className="flex items-center gap-1.5">
                <img src="/img-athlete-multisport.jpg" alt="AthlynX" className="w-5 h-5 rounded-md object-cover" style={{ boxShadow: "0 0 8px rgba(0,194,255,0.6)" }} />
                <span className="text-white font-black text-sm tracking-tight">AthlynX</span>
              </div>
              <div className="flex gap-1">
                <div className="w-1 h-1 bg-white/40 rounded-full" />
                <div className="w-1 h-1 bg-white/40 rounded-full" />
                <div className="w-1 h-1 bg-white/40 rounded-full" />
              </div>
            </div>

            {/* Athlete card */}
            <div className="flex gap-2 mb-3">
              <div className="w-16 h-20 rounded-xl bg-gradient-to-br from-blue-800 to-blue-950 border border-blue-700/50 flex items-center justify-center flex-shrink-0 overflow-hidden">
                <div className="text-center">
                  <div className="text-white font-black text-xl">{profile.name.split(" ")[0][0]}{profile.name.split(" ")[1]}</div>
                  <img src="/img-athlete-multisport.jpg" alt="AthlynX" className="w-6 h-6 rounded-md object-cover mx-auto mt-1" />
                  <div className="text-white/60 text-[9px]">#{profileIdx + 7}</div>
                </div>
              </div>
              <div className="flex-1">
                <p className="text-white font-black text-sm leading-tight">{profile.name}</p>
                <p className="text-[#00c2ff] text-[10px] font-bold">{profile.year}</p>
                <p className="text-white/60 text-[9px]">{profile.height}</p>
                <p className="text-white/60 text-[9px]">{profile.city}</p>
              </div>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-3 gap-1 mb-3">
              {profile.stats.map(s => (
                <div key={s.label} className="bg-white/5 border border-white/10 rounded-lg p-1.5 text-center">
                  <p className="text-white font-black text-sm leading-none">{s.value}</p>
                  <p className="text-white/40 text-[8px] leading-tight mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>

            {/* Rating + NIL */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex gap-0.5">
                {[1,2,3,4,5].map(i => (
                  <Star key={i} className={`w-3 h-3 ${i <= profile.rating ? "text-[#00C2FF] fill-blue-400" : "text-white/20"}`} />
                ))}
              </div>
              <div className="flex items-center gap-1">
                <CheckCircle className="w-3 h-3 text-[#00c2ff]" />
                <span className="text-[#00c2ff] text-[9px] font-bold">NIL VERIFIED</span>
              </div>
            </div>

            {/* Highlight reel */}
            <div className="mb-3">
              <p className="text-white/50 text-[9px] font-bold uppercase tracking-wide mb-1">HIGHLIGHT REEL</p>
              <div
                onClick={() => setPlaying(!playing)}
                className="relative w-full h-16 bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl overflow-hidden cursor-pointer border border-white/10 flex items-center justify-center"
              >
                <div className="absolute inset-0 bg-black/40" />
                <div className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center border-2 border-white transition-all ${playing ? "bg-white/20 scale-90" : "bg-white/10 hover:bg-white/20"}`}>
                  <Play className={`w-4 h-4 text-white ${playing ? "opacity-50" : ""}`} />
                </div>
                {playing && (
                  <div className="absolute bottom-1 left-2 right-2 h-1 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-[#00c2ff] rounded-full animate-progress" style={{ width: "60%" }} />
                  </div>
                )}
              </div>
            </div>

            {/* Colleges showing interest */}
            <div>
              <p className="text-white/50 text-[9px] font-bold uppercase tracking-wide mb-1.5">COLLEGES SHOWING INTEREST</p>
              <div className="flex gap-2">
                {profile.colleges.map((col, i) => (
                  <div
                    key={col}
                    className="w-10 h-10 rounded-full border-2 border-white/20 flex items-center justify-center text-white font-black text-sm"
                    style={{ backgroundColor: profile.collegeColors[i] + "33", borderColor: profile.collegeColors[i] + "66" }}
                  >
                    <span style={{ color: profile.collegeColors[i] }}>{profile.collegeLabels[i]}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Home indicator */}
          <div className="bg-[#050c1a] flex justify-center py-2">
            <div className="w-16 h-1 bg-white/20 rounded-full" />
          </div>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="relative z-10 text-center mt-8 max-w-sm">
        <p className="text-white font-black text-base uppercase tracking-wide mb-3">
          BUILD YOUR PROFILE. GET SEEN. GET RECRUITED.
        </p>
        <a
          href="/early-access"
          className="inline-flex items-center gap-2 px-8 py-3 bg-transparent border-2 border-[#00c2ff] text-white font-black text-base rounded-full hover:bg-[#00c2ff]/10 transition-all shadow-lg shadow-blue-900/40"
          style={{ boxShadow: "0 0 20px rgba(0,194,255,0.3)" }}
        >
          <Zap className="w-4 h-4 text-[#00c2ff]" />
          START FREE — athlynx.ai
        </a>
      </div>
    </div>
  );
}
