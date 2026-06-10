/**
 * AthletePublicProfile — /athlete/:id
 * Session 33 — May 5, 2026
 * PlayerProfiler + MLB.com level design.
 * EPX ring · EPX dial · Sport metrics bars · Comparable player
 * Tabs: Profile · Stats · Bio · News · Contract · Film · NIL · Recruiting
 * College database · E2EE badge · Lucide icons only (no generic emojis in UI)
 */
import { useState, useEffect } from "react";
import { RouteErrorBoundary } from "@/components/GlobalErrorBoundary";
import MobileBottomNav from "@/components/MobileBottomNav";
import { Link, useRoute } from "wouter";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import VideoUploadHub from "@/components/VideoUploadHub";
import { toast } from "sonner";
import {
  ArrowLeft, Share2, Edit3, UserPlus, MessageCircle, CheckCircle,
  Shield, Lock, Zap, TrendingUp, BarChart2, Star, Award, Target,
  MapPin, GraduationCap, Calendar, DollarSign, Video, FileText,
  Users, Eye, Activity, ChevronRight, Flame, Cpu, Radio,
  BookOpen, Newspaper, Briefcase, Film, Trophy, Building2,
  ExternalLink, Camera, Play, Music2,
  Heart, RefreshCw, Download, Verified, Globe, Phone, Mail,
  Dumbbell, Timer, Ruler, Weight, Gauge, Percent, TrendingDown,
  PlayCircle, Medal, Flag, Clock, Info, ChevronDown,
  UserCheck, Handshake, School, Search, Filter, SlidersHorizontal
} from "lucide-react";

//  Sport-specific metric definitions 
const SPORT_METRICS: Record<string, { label: string; key: string; unit: string; icon: any; max: number }[]> = {
  Football: [
    { label: "40-Yard Dash", key: "fortyYard", unit: "s", icon: Timer, max: 5.0 },
    { label: "Vertical Jump", key: "vertical", unit: '"', icon: TrendingUp, max: 45 },
    { label: "Bench Press", key: "benchPress", unit: " reps", icon: Dumbbell, max: 30 },
    { label: "Broad Jump", key: "broadJump", unit: '"', icon: Ruler, max: 140 },
    { label: "3-Cone Drill", key: "threeCone", unit: "s", icon: Activity, max: 8.0 },
    { label: "Shuttle Run", key: "shuttle", unit: "s", icon: Gauge, max: 5.0 },
  ],
  Basketball: [
    { label: "Standing Reach", key: "standingReach", unit: '"', icon: Ruler, max: 108 },
    { label: "Max Vertical", key: "maxVertical", unit: '"', icon: TrendingUp, max: 48 },
    { label: "Sprint Speed", key: "sprintSpeed", unit: " mph", icon: Timer, max: 22 },
    { label: "Wingspan", key: "wingspan", unit: '"', icon: Ruler, max: 96 },
    { label: "3PT%", key: "threePointPct", unit: "%", icon: Target, max: 100 },
    { label: "FG%", key: "fieldGoalPct", unit: "%", icon: Percent, max: 100 },
  ],
  Baseball: [
    { label: "Exit Velocity", key: "exitVelo", unit: " mph", icon: Gauge, max: 120 },
    { label: "Fastball Velo", key: "fastballVelo", unit: " mph", icon: Flame, max: 105 },
    { label: "60-Yard Dash", key: "sixtyYard", unit: "s", icon: Timer, max: 8.0 },
    { label: "Pop Time", key: "popTime", unit: "s", icon: Clock, max: 2.5 },
    { label: "Spin Rate", key: "spinRate", unit: " rpm", icon: RefreshCw, max: 3500 },
    { label: "Launch Angle", key: "launchAngle", unit: "°", icon: TrendingUp, max: 45 },
  ],
  Soccer: [
    { label: "Sprint Speed", key: "sprintSpeed", unit: " mph", icon: Timer, max: 25 },
    { label: "Shot Power", key: "shotPower", unit: " mph", icon: Flame, max: 80 },
    { label: "Passing Acc.", key: "passingAcc", unit: "%", icon: Target, max: 100 },
    { label: "Dribble Speed", key: "dribbleSpeed", unit: " mph", icon: Activity, max: 20 },
    { label: "Vertical Jump", key: "vertical", unit: '"', icon: TrendingUp, max: 35 },
    { label: "Stamina Index", key: "stamina", unit: "/100", icon: Gauge, max: 100 },
  ],
  default: [
    { label: "Speed Rating", key: "speedRating", unit: "/100", icon: Timer, max: 100 },
    { label: "Strength", key: "strengthRating", unit: "/100", icon: Dumbbell, max: 100 },
    { label: "Agility", key: "agilityRating", unit: "/100", icon: Activity, max: 100 },
    { label: "Endurance", key: "enduranceRating", unit: "/100", icon: Gauge, max: 100 },
    { label: "Skill Rating", key: "skillRating", unit: "/100", icon: Star, max: 100 },
    { label: "IQ Rating", key: "iqRating", unit: "/100", icon: Cpu, max: 100 },
  ],
};

//  Comparable player database 
const COMPARABLES: Record<string, { name: string; team: string; position: string; img: string; score: number }[]> = {
  Football: [
    { name: "Patrick Mahomes", team: "Kansas City Chiefs", position: "QB", img: "https://images.unsplash.com/photo-1566577739112-5180d4bf9390?w=80&h=80&fit=crop&q=80", score: 99 },
    { name: "Caleb Williams", team: "Chicago Bears", position: "QB", img: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=80&h=80&fit=crop&q=80", score: 94 },
    { name: "CJ Stroud", team: "Houston Texans", position: "QB", img: "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=80&h=80&fit=crop&q=80", score: 91 },
  ],
  Basketball: [
    { name: "Victor Wembanyama", team: "San Antonio Spurs", position: "C", img: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=80&h=80&fit=crop&q=80", score: 98 },
    { name: "Chet Holmgren", team: "OKC Thunder", position: "C/PF", img: "https://images.unsplash.com/photo-1517649763962-0c623066013b?w=80&h=80&fit=crop&q=80", score: 93 },
    { name: "Anthony Edwards", team: "Minnesota Timberwolves", position: "SG", img: "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=80&h=80&fit=crop&q=80", score: 95 },
  ],
  Baseball: [
    { name: "Paul Skenes", team: "Pittsburgh Pirates", position: "SP", img: "https://images.unsplash.com/photo-1543326727-cf6c39e8f84c?w=80&h=80&fit=crop&q=80", score: 97 },
    { name: "Jackson Holliday", team: "Baltimore Orioles", position: "SS", img: "https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?w=80&h=80&fit=crop&q=80", score: 94 },
    { name: "Elly De La Cruz", team: "Cincinnati Reds", position: "SS", img: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=80&h=80&fit=crop&q=80", score: 92 },
  ],
  default: [
    { name: "Top Prospect", team: "Elite Program", position: "All-Around", img: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=80&h=80&fit=crop&q=80", score: 90 },
  ],
};

//  College database (D1/D2/D3/NAIA/JUCO) 
const COLLEGE_DB = [
  { name: "Alabama", conf: "SEC", div: "D1", state: "AL", sports: ["Football","Basketball","Baseball","Soccer"] },
  { name: "Ohio State", conf: "Big Ten", div: "D1", state: "OH", sports: ["Football","Basketball","Baseball","Soccer"] },
  { name: "Texas", conf: "SEC", div: "D1", state: "TX", sports: ["Football","Basketball","Baseball","Soccer"] },
  { name: "Georgia", conf: "SEC", div: "D1", state: "GA", sports: ["Football","Basketball","Baseball","Soccer"] },
  { name: "LSU", conf: "SEC", div: "D1", state: "LA", sports: ["Football","Basketball","Baseball","Soccer"] },
  { name: "Michigan", conf: "Big Ten", div: "D1", state: "MI", sports: ["Football","Basketball","Baseball","Soccer"] },
  { name: "Notre Dame", conf: "ACC", div: "D1", state: "IN", sports: ["Football","Basketball","Baseball","Soccer"] },
  { name: "Clemson", conf: "ACC", div: "D1", state: "SC", sports: ["Football","Basketball","Baseball","Soccer"] },
  { name: "Penn State", conf: "Big Ten", div: "D1", state: "PA", sports: ["Football","Basketball","Wrestling","Soccer"] },
  { name: "Florida", conf: "SEC", div: "D1", state: "FL", sports: ["Football","Basketball","Baseball","Soccer"] },
  { name: "Duke", conf: "ACC", div: "D1", state: "NC", sports: ["Basketball","Soccer","Lacrosse"] },
  { name: "Kentucky", conf: "SEC", div: "D1", state: "KY", sports: ["Basketball","Football","Baseball"] },
  { name: "Kansas", conf: "Big 12", div: "D1", state: "KS", sports: ["Basketball","Football","Baseball"] },
  { name: "UCLA", conf: "Big Ten", div: "D1", state: "CA", sports: ["Basketball","Football","Baseball","Soccer"] },
  { name: "USC", conf: "Big Ten", div: "D1", state: "CA", sports: ["Football","Basketball","Baseball","Soccer"] },
  { name: "Stanford", conf: "ACC", div: "D1", state: "CA", sports: ["Football","Basketball","Baseball","Soccer","Swimming"] },
  { name: "Mississippi State", conf: "SEC", div: "D1", state: "MS", sports: ["Football","Basketball","Baseball","Soccer"] },
  { name: "Ole Miss", conf: "SEC", div: "D1", state: "MS", sports: ["Football","Basketball","Baseball","Soccer"] },
  { name: "Texas A&M", conf: "SEC", div: "D1", state: "TX", sports: ["Football","Basketball","Baseball","Soccer"] },
  { name: "Florida State", conf: "ACC", div: "D1", state: "FL", sports: ["Football","Basketball","Baseball","Soccer"] },
  { name: "Vanderbilt", conf: "SEC", div: "D1", state: "TN", sports: ["Baseball","Basketball","Football"] },
  { name: "Virginia", conf: "ACC", div: "D1", state: "VA", sports: ["Basketball","Soccer","Lacrosse","Baseball"] },
  { name: "North Carolina", conf: "ACC", div: "D1", state: "NC", sports: ["Basketball","Soccer","Lacrosse","Baseball"] },
  { name: "Gonzaga", conf: "WCC", div: "D1", state: "WA", sports: ["Basketball","Baseball","Soccer"] },
  { name: "Baylor", conf: "Big 12", div: "D1", state: "TX", sports: ["Football","Basketball","Baseball","Soccer"] },
  { name: "Oklahoma", conf: "SEC", div: "D1", state: "OK", sports: ["Football","Basketball","Baseball","Soccer"] },
  { name: "Iowa", conf: "Big Ten", div: "D1", state: "IA", sports: ["Football","Basketball","Wrestling","Baseball"] },
  { name: "Wisconsin", conf: "Big Ten", div: "D1", state: "WI", sports: ["Football","Basketball","Baseball","Soccer"] },
  { name: "Auburn", conf: "SEC", div: "D1", state: "AL", sports: ["Football","Basketball","Baseball","Soccer"] },
  { name: "Tennessee", conf: "SEC", div: "D1", state: "TN", sports: ["Football","Basketball","Baseball","Soccer"] },
  // D2
  { name: "Valdosta State", conf: "GSC", div: "D2", state: "GA", sports: ["Football","Basketball","Baseball"] },
  { name: "Grand Valley State", conf: "GLIAC", div: "D2", state: "MI", sports: ["Football","Basketball","Soccer"] },
  { name: "Ferris State", conf: "GLIAC", div: "D2", state: "MI", sports: ["Football","Basketball","Baseball"] },
  // D3
  { name: "MIT", conf: "NEWMAC", div: "D3", state: "MA", sports: ["Football","Basketball","Baseball","Soccer"] },
  { name: "Williams College", conf: "NESCAC", div: "D3", state: "MA", sports: ["Football","Basketball","Baseball","Soccer"] },
  { name: "Amherst", conf: "NESCAC", div: "D3", state: "MA", sports: ["Football","Basketball","Baseball","Soccer"] },
  // NAIA
  { name: "Morningside", conf: "GPAC", div: "NAIA", state: "IA", sports: ["Football","Basketball","Baseball"] },
  { name: "Georgetown (KY)", conf: "MSC", div: "NAIA", state: "KY", sports: ["Football","Basketball","Baseball"] },
  // JUCO
  { name: "Hutchinson CC", conf: "KJCCC", div: "JUCO", state: "KS", sports: ["Football","Basketball","Baseball"] },
  { name: "Iowa Western CC", conf: "ICCAC", div: "JUCO", state: "IA", sports: ["Football","Basketball","Baseball"] },
  { name: "East Mississippi CC", conf: "MACJC", div: "JUCO", state: "MS", sports: ["Football","Basketball","Baseball"] },
];

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string; icon: any }> = {
  available: { label: "Available for Recruiting", color: "text-[#00C2FF]", bg: "bg-[#1E90FF]/10 border-[#1E90FF]/30", icon: UserCheck },
  committed: { label: "Committed", color: "text-blue-400", bg: "bg-blue-500/10 border-blue-500/30", icon: CheckCircle },
  signed: { label: "Signed", color: "text-[#1E90FF]", bg: "bg-[#1E90FF]/10 border-[#1E90FF]/30", icon: Award },
  transferred: { label: "Transfer Portal", color: "text-[#00C2FF]", bg: "bg-blue-500/10 border-blue-500/30", icon: RefreshCw },
};

//  EPX Score Ring (SVG animated) 
function EPXRing({ score }: { score: number }) {
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const progress = (score / 100) * circumference;
  const color = score >= 90 ? "#facc15" : score >= 80 ? "#00c2ff" : score >= 70 ? "#22c55e" : "#94a3b8";
  const tier = score >= 90 ? "ELITE" : score >= 80 ? "HIGH MAJOR" : score >= 70 ? "MID MAJOR" : "PROSPECT";

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-36 h-36">
        <svg className="w-36 h-36 -rotate-90" viewBox="0 0 128 128">
          <circle cx="64" cy="64" r={radius} fill="none" stroke="#0d1b3e" strokeWidth="10" />
          <circle
            cx="64" cy="64" r={radius} fill="none"
            stroke={color} strokeWidth="10"
            strokeDasharray={`${progress} ${circumference}`}
            strokeLinecap="round"
            style={{ transition: "stroke-dasharray 1.2s ease-in-out", filter: `drop-shadow(0 0 8px ${color})` }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <Zap className="w-4 h-4 mb-0.5" style={{ color }} />
          <span className="text-3xl font-black text-white leading-none">{score}</span>
          <span className="text-[10px] font-black tracking-widest" style={{ color }}>{tier}</span>
        </div>
      </div>
      <div className="text-white/40 text-xs font-bold mt-1 tracking-widest">X-FACTOR SCORE</div>
    </div>
  );
}

//  EPX Dial 
function EPXDial({ score }: { score: number }) {
  const angle = -135 + (score / 100) * 270;
  const color = score >= 80 ? "#f97316" : score >= 60 ? "#facc15" : "#94a3b8";

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-24 h-24">
        <svg className="w-24 h-24" viewBox="0 0 96 96">
          {/* Background arc */}
          <path d="M 12 72 A 40 40 0 1 1 84 72" fill="none" stroke="#0d1b3e" strokeWidth="8" strokeLinecap="round" />
          {/* Colored arc */}
          <path
            d="M 12 72 A 40 40 0 1 1 84 72" fill="none"
            stroke={color} strokeWidth="8" strokeLinecap="round"
            strokeDasharray={`${(score / 100) * 188} 188`}
            style={{ filter: `drop-shadow(0 0 6px ${color})` }}
          />
          {/* Needle */}
          <line
            x1="48" y1="48"
            x2={48 + 28 * Math.cos((angle - 90) * Math.PI / 180)}
            y2={48 + 28 * Math.sin((angle - 90) * Math.PI / 180)}
            stroke="white" strokeWidth="2.5" strokeLinecap="round"
          />
          <circle cx="48" cy="48" r="4" fill="white" />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-end pb-1">
          <span className="text-lg font-black text-white leading-none">{score}</span>
        </div>
      </div>
      <div className="flex items-center gap-1 mt-0.5">
        <Flame className="w-3 h-3 text-[#00C2FF]" />
        <span className="text-white/40 text-[10px] font-black tracking-widest">EPX RATING</span>
      </div>
    </div>
  );
}

//  Metric Bar 
function MetricBar({ label, value, unit, max, percentile, icon: Icon }: {
  label: string; value: number; unit: string; max: number; percentile: number; icon: any;
}) {
  const pct = Math.min((value / max) * 100, 100);
  const barColor = percentile >= 90 ? "#facc15" : percentile >= 75 ? "#00c2ff" : percentile >= 50 ? "#22c55e" : "#94a3b8";

  return (
    <div className="flex items-center gap-3 py-2.5 border-b border-white/5 last:border-0">
      <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0">
        <Icon className="w-4 h-4 text-white/50" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <span className="text-white/70 text-xs font-bold">{label}</span>
          <div className="flex items-center gap-2">
            <span className="text-white font-black text-sm">{value}{unit}</span>
            <span className="text-[10px] font-black px-1.5 py-0.5 rounded-full"
              style={{ background: `${barColor}20`, color: barColor, border: `1px solid ${barColor}40` }}>
              {percentile}th
            </span>
          </div>
        </div>
        <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-1000"
            style={{ width: `${pct}%`, background: barColor, boxShadow: `0 0 6px ${barColor}` }}
          />
        </div>
      </div>
    </div>
  );
}

//  Comparable Player Card 
function ComparableCard({ sport, xScore }: { sport: string; xScore: number }) {
  const comps = COMPARABLES[sport] || COMPARABLES.default;
  const best = comps.reduce((a, b) => Math.abs(a.score - xScore) < Math.abs(b.score - xScore) ? a : b);

  return (
    <div className="bg-gradient-to-br from-[#0d1b3e] to-[#040c1a] border border-[#00c2ff]/20 rounded-2xl p-4">
      <div className="flex items-center gap-2 mb-3">
        <Users className="w-4 h-4 text-[#00c2ff]" />
        <span className="text-white font-black text-sm">Best Comparable</span>
        <span className="ml-auto text-[10px] text-white/30 font-bold">AI MATCH</span>
      </div>
      <div className="flex items-center gap-3">
        <img
          src={best.img} alt={best.name}
          className="w-14 h-14 rounded-xl object-cover border-2 border-[#00c2ff]/30"
          onError={(e) => { (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=80&h=80&fit=crop"; }}
        />
        <div className="flex-1">
          <div className="text-white font-black text-base leading-tight">{best.name}</div>
          <div className="text-white/50 text-xs mt-0.5">{best.position} · {best.team}</div>
          <div className="flex items-center gap-1.5 mt-1.5">
            <Star className="w-3 h-3 text-[#00C2FF]" />
            <span className="text-[#00C2FF] text-xs font-black">{best.score} EPX</span>
          </div>
        </div>
        <div className="text-right">
          <div className="text-[10px] text-white/30 font-bold mb-0.5">SIMILARITY</div>
          <div className="text-2xl font-black text-[#00c2ff]">
            {Math.max(70, 100 - Math.abs(best.score - xScore) * 2)}%
          </div>
        </div>
      </div>
    </div>
  );
}

//  College Database Panel 
function CollegeDatabase({ sport }: { sport: string }) {
  const [search, setSearch] = useState("");
  const [divFilter, setDivFilter] = useState("All");
  const divs = ["All", "D1", "D2", "D3", "NAIA", "JUCO"];

  const filtered = COLLEGE_DB.filter(c => {
    const matchSport = !sport || c.sports.includes(sport);
    const matchSearch = !search || c.name.toLowerCase().includes(search.toLowerCase()) || c.state.toLowerCase().includes(search.toLowerCase());
    const matchDiv = divFilter === "All" || c.div === divFilter;
    return matchSport && matchSearch && matchDiv;
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <School className="w-5 h-5 text-[#00c2ff]" />
        <h3 className="text-white font-black text-lg">College Database</h3>
        <span className="ml-auto text-white/30 text-xs">{filtered.length} programs</span>
      </div>

      {/* Search + Filter */}
      <div className="flex gap-2 mb-3">
        <div className="flex-1 relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search schools or state..."
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-white text-sm placeholder-white/30 focus:outline-none focus:border-[#00c2ff]/50"
          />
        </div>
        <div className="flex gap-1">
          {divs.map(d => (
            <button
              key={d}
              onClick={() => setDivFilter(d)}
              className={`px-2.5 py-2 rounded-xl text-xs font-black transition-all ${divFilter === d ? "bg-[#00c2ff] text-black" : "bg-white/5 text-white/50 hover:bg-white/10"}`}
            >
              {d}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
        {filtered.map((c, i) => (
          <div key={i} className="flex items-center justify-between bg-[#0d1b3e] border border-white/10 rounded-xl px-4 py-3 hover:border-[#00c2ff]/30 transition-all group">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#00c2ff]/10 flex items-center justify-center flex-shrink-0">
                <Building2 className="w-4 h-4 text-[#00c2ff]" />
              </div>
              <div>
                <div className="text-white font-bold text-sm">{c.name}</div>
                <div className="text-white/40 text-xs">{c.conf} · {c.state}</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${
                c.div === "D1" ? "bg-blue-500/10 text-blue-400 border-blue-500/30" :
                c.div === "D2" ? "bg-[#00C2FF]/10 text-[#00C2FF] border-[#00C2FF]/30" :
                c.div === "D3" ? "bg-[#1E90FF]/10 text-[#1E90FF] border-[#1E90FF]/30" :
                c.div === "NAIA" ? "bg-[#1E90FF]/20 text-[#00C2FF] border-[#1E90FF]/30" :
                "bg-slate-500/10 text-slate-400 border-slate-500/30"
              }`}>{c.div}</span>
              <ChevronRight className="w-4 h-4 text-white/20 group-hover:text-[#00c2ff] transition-colors" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

//  Main Component 
type TabId = "profile" | "stats" | "bio" | "news" | "contract" | "film" | "nil" | "recruiting";

function AthletePublicProfileInner() {
  const [, params] = useRoute("/athlete/:id");
  const athleteId = params?.id ? parseInt(params.id) : 0;
  const { user } = useAuth();
  const isOwnProfile = user?.id === athleteId;
  const [activeTab, setActiveTab] = useState<TabId>("profile");
  const [connected, setConnected] = useState(false);
  const [collegeSearch, setCollegeSearch] = useState("");

  const utils = trpc.useUtils();
  const updateAvatarMutation = trpc.profile.updateAvatar.useMutation({
    onSuccess: () => { utils.profile.getProfile.invalidate(); toast.success("Photo updated!"); },
    onError: (err: any) => { toast.error(err?.message || "Failed to update photo."); },
  });
  const sendConnection = trpc.connections.sendConnectionRequest.useMutation({
    onSuccess: () => { setConnected(true); toast.success("Connection request sent!"); },
  });
  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Profile link copied to clipboard");
  };

  const { data: profile, isLoading } = trpc.profile.getProfile.useQuery(
    { userId: athleteId }, { enabled: !!athleteId }
  );
  const { data: userPosts = [] } = trpc.feed.getUserPosts.useQuery(
    { userId: athleteId }, { enabled: !!athleteId }
  );

  const displayName = profile?.name || "Athlete";
  const initials = displayName.split(" ").map((w: string) => w[0]).join("").slice(0, 2).toUpperCase();
  const sport = profile?.sport || "Multi-Sport";
  const xScore = (profile as any)?.recruitingScore || 78;
  const epxScore = Math.min(100, Math.round(xScore * 0.92 + Math.random() * 5));
  const statusInfo = STATUS_CONFIG[(profile?.recruitingStatus || "available")];
  const StatusIcon = statusInfo.icon;
  const sportMetrics = SPORT_METRICS[sport] || SPORT_METRICS.default;
  const sportStats = (profile as any)?.sportStats as Record<string, any> || {};

  // Generate realistic percentiles from stats
  const getPercentile = (value: number, max: number) => Math.min(99, Math.round((value / max) * 100 * 0.95));

  const TABS: { id: TabId; label: string; icon: any }[] = [
    { id: "profile", label: "Profile", icon: Users },
    { id: "stats", label: "Stats", icon: BarChart2 },
    { id: "bio", label: "Bio", icon: BookOpen },
    { id: "news", label: "News", icon: Newspaper },
    { id: "contract", label: "Contract", icon: FileText },
    { id: "film", label: "Film", icon: Film },
    { id: "nil", label: "NIL", icon: DollarSign },
    { id: "recruiting", label: "Recruiting", icon: School },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#040c1a] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#00c2ff]/30 border-t-[#00c2ff] rounded-full animate-spin mx-auto mb-4" />
          <p className="text-white/40 text-sm font-bold tracking-wider">LOADING PROFILE</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-[#040c1a] flex items-center justify-center">
        <div className="text-center max-w-sm px-6">
          <div className="w-20 h-20 rounded-full bg-[#0d1b3e] border border-white/10 flex items-center justify-center mx-auto mb-4">
            <Users className="w-10 h-10 text-white/20" />
          </div>
          <h2 className="text-2xl font-black text-white mb-2">Profile Not Found</h2>
          <p className="text-white/40 text-sm mb-6">This athlete hasn't set up their profile yet.</p>
          <Link href="/browse-athletes">
            <button className="bg-[#00c2ff] text-black font-black px-6 py-3 rounded-xl">
              Browse Athletes
            </button>
          </Link>
        </div>
      </div>
    );
  }

  // Sport cover images from Unsplash
  const SPORT_COVERS: Record<string, string> = {
    Football: "https://images.unsplash.com/photo-1566577739112-5180d4bf9390?w=1200&h=300&fit=crop&q=80",
    Basketball: "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=1200&h=300&fit=crop&q=80",
    Baseball: "https://images.unsplash.com/photo-1543326727-cf6c39e8f84c?w=1200&h=300&fit=crop&q=80",
    Soccer: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=1200&h=300&fit=crop&q=80",
    "Track & Field": "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=1200&h=300&fit=crop&q=80",
    Swimming: "https://images.unsplash.com/photo-1530549387789-4c1017266635?w=1200&h=300&fit=crop&q=80",
    Wrestling: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1200&h=300&fit=crop&q=80",
    Tennis: "https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=1200&h=300&fit=crop&q=80",
    Volleyball: "https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=1200&h=300&fit=crop&q=80",
    Golf: "https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=1200&h=300&fit=crop&q=80",
    default: "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=1200&h=300&fit=crop&q=80",
  };
  const coverImg = profile.coverUrl || SPORT_COVERS[sport] || SPORT_COVERS.default;

  return (
    <div className="min-h-screen bg-[#040c1a] text-white pb-20">

      {/*  Top Nav  */}
      <div className="sticky top-0 z-50 bg-[#040c1a]/95 backdrop-blur border-b border-white/10">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/browse-athletes">
            <button className="text-white/50 hover:text-white transition-colors flex items-center gap-2 text-sm font-bold">
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
          </Link>
          <div className="flex items-center gap-2">
            <img src="/athlynxai-icon.png" alt="AthlynX" className="w-7 h-7 rounded-lg" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
            <span className="text-white font-black text-sm tracking-wider">AthlynX</span>
          </div>
          <div className="flex items-center gap-2">
            {/* E2EE Badge */}
            <div className="flex items-center gap-1 bg-[#1E90FF]/10 border border-[#1E90FF]/20 rounded-full px-2 py-1">
              <Lock className="w-3 h-3 text-[#00C2FF]" />
              <span className="text-[#00C2FF] text-[10px] font-black">E2EE</span>
            </div>
            {isOwnProfile ? (
              <Link href="/profile">
                <button className="text-xs bg-[#00c2ff]/10 border border-[#00c2ff]/30 text-[#00c2ff] font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5">
                  <Edit3 className="w-3 h-3" /> Edit
                </button>
              </Link>
            ) : (
              <button
                onClick={handleShare}
                className="text-xs bg-white/10 border border-white/20 text-white font-bold px-3 py-1.5 rounded-full hover:bg-white/20 transition-all flex items-center gap-1.5"
              >
                <Share2 className="w-3 h-3" /> Share
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto">

        {/*  MLB.COM STYLE HERO  */}
        <div className="relative">
          {/* Full-width action/cover photo */}
          <div className="relative h-56 sm:h-72 overflow-hidden">
            <img src={coverImg} alt={sport} className="w-full h-full object-cover object-center" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#040c1a] via-[#040c1a]/40 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#040c1a]/60 via-transparent to-transparent" />

            {/* Top badges */}
            <div className="absolute top-3 right-3 flex gap-2">
              <div className="bg-[#00c2ff]/20 backdrop-blur rounded-full px-2.5 py-1 flex items-center gap-1 border border-[#00c2ff]/30">
                <Shield className="w-3 h-3 text-[#00c2ff]" />
                <span className="text-[#00c2ff] text-[10px] font-black">VERIFIED</span>
              </div>
            </div>

            {/* Bottom-left: small headshot + name + stats — MLB.com style */}
            <div className="absolute bottom-0 left-0 right-0 px-4 pb-4">
              <div className="flex items-end gap-3">
                {/* Small headshot inset */}
                <div
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl border-2 border-white/30 overflow-hidden bg-gradient-to-br from-[#0066ff] to-[#00c2ff] flex items-center justify-center flex-shrink-0 shadow-2xl cursor-pointer relative group"
                  onClick={() => isOwnProfile && document.getElementById('avatar-upload')?.click()}
                >
                  {profile.avatarUrl ? (
                    <img src={profile.avatarUrl} alt={displayName} className="w-full h-full object-cover object-top" />
                  ) : (
                    /* NIL doctrine: silhouette fallback at large size, no colored initials. */
                    <svg viewBox="0 0 24 24" className="w-3/5 h-3/5 text-slate-400" fill="currentColor" aria-hidden="true"><title>Identity pending</title><path d="M12 12c2.7 0 4.9-2.2 4.9-4.9S14.7 2.2 12 2.2 7.1 4.4 7.1 7.1 9.3 12 12 12zm0 2.2c-3.3 0-9.8 1.7-9.8 4.9v2.7h19.6v-2.7c0-3.3-6.5-4.9-9.8-4.9z"/></svg>
                  )}
                  {isOwnProfile && (
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-xl">
                      <Camera className="w-5 h-5 text-white" />
                    </div>
                  )}
                </div>
                {isOwnProfile && (
                  <input
                    id="avatar-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      try {
                        const reader = new FileReader();
                        reader.onloadend = async () => {
                          const avatarUrl = reader.result as string;
                          await updateAvatarMutation.mutateAsync({ avatarUrl });
                          toast.success("Profile photo updated!");
                        };
                        reader.readAsDataURL(file);
                      } catch (err: any) {
                        toast.error("Failed to upload photo.");
                      }
                    }}
                  />
                )}

                {/* Name + info overlay */}
                <div className="flex-1 min-w-0 pb-1">
                  <div className="flex items-center gap-2 flex-wrap mb-0.5">
                    <h1 className="text-xl sm:text-2xl font-black text-white leading-tight">{displayName}</h1>
                    <CheckCircle className="w-4 h-4 text-[#00c2ff] flex-shrink-0" />
                  </div>
                  <div className="flex items-center gap-2 text-white/70 text-xs flex-wrap">
                    {profile.position && <span className="font-bold text-[#00c2ff]">{profile.position}</span>}
                    {profile.position && profile.school && <span className="text-white/40">|</span>}
                    {profile.height && <span>{profile.height}</span>}
                    {profile.height && profile.weight && <span className="text-white/40">/</span>}
                    {profile.weight && <span>{profile.weight} lbs</span>}
                    {profile.school && <><span className="text-white/40">|</span><span>{profile.school}</span></>}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action buttons row — below the banner */}
          <div className="flex gap-2 px-4 py-3 bg-[#040c1a] border-b border-[#0066ff]/20">
            {isOwnProfile ? (
              <>
                <Link href="/profile" className="flex-1">
                  <button className="w-full bg-[#0066ff] hover:bg-[#0052cc] text-white text-sm font-black py-2.5 rounded-xl transition-all flex items-center justify-center gap-2">
                    <Edit3 className="w-4 h-4" /> Edit Profile
                  </button>
                </Link>
                <Link href={`/athlete/${athleteId}`}>
                  <button className="border border-white/20 text-white text-sm font-black px-4 py-2.5 rounded-xl hover:bg-white/10 transition-all">
                    <Eye className="w-4 h-4" />
                  </button>
                </Link>
              </>
            ) : (
              <>
                <button
                  onClick={() => sendConnection.mutate({ targetUserId: athleteId })}
                  disabled={connected || sendConnection.isPending}
                  className={`flex-1 text-sm font-black py-2.5 rounded-xl transition-all flex items-center justify-center gap-2 ${connected ? "bg-[#1E90FF]/30 border border-[#1E90FF]/50 text-[#00C2FF]" : "bg-white text-black hover:bg-white/90"}`}
                >
                  {connected ? <CheckCircle className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
                  {connected ? "Connected" : "Follow"}
                </button>
                <Link href="/messenger">
                  <button className="bg-[#0066ff] hover:bg-[#0052cc] text-white text-sm font-black px-5 py-2.5 rounded-xl transition-all flex items-center gap-2">
                    <MessageCircle className="w-4 h-4" /> Message
                  </button>
                </Link>
                <button onClick={handleShare} className="border border-white/20 text-white text-sm font-black px-3 py-2.5 rounded-xl hover:bg-white/10 transition-all">
                  <Share2 className="w-4 h-4" />
                </button>
              </>
            )}
          </div>

          {/* Quick stats bar — position, EPX, NIL, offers */}
          <div className="grid grid-cols-4 gap-0 bg-[#0a1628] border-b border-[#0066ff]/20">
            {[
              { label: "Position", value: profile.position || "—" },
              { label: "EPX", value: `${xScore}` },
              { label: "NIL Value", value: profile.nilValue && Number(profile.nilValue) > 0 ? `$${(Number(profile.nilValue)/1000).toFixed(0)}K` : "—" },
              { label: "Class", value: profile.classYear ? `'${String(profile.classYear).slice(-2)}` : "—" },
            ].map((s, i) => (
              <div key={s.label} className={`py-3 text-center ${i < 3 ? "border-r border-[#0066ff]/10" : ""}`}>
                <div className="text-white font-black text-base leading-tight">{s.value}</div>
                <div className="text-[#4a6080] text-[10px] font-bold">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="max-w-4xl mx-auto">
        <div className="px-4 py-4">
          {/*  Score Cards Row  */}
          <div className="grid grid-cols-3 gap-3 mb-5">
            {/* EPX Ring */}
            <div className="col-span-1 bg-[#0d1b3e] border border-white/10 rounded-2xl p-4 flex items-center justify-center">
              <EPXRing score={xScore} />
            </div>
            {/* EPX Dial */}
            <div className="bg-[#0d1b3e] border border-white/10 rounded-2xl p-4 flex items-center justify-center">
              <EPXDial score={epxScore} />
            </div>
            {/* Quick stats */}
            <div className="bg-[#0d1b3e] border border-white/10 rounded-2xl p-4 space-y-2">
              {[
                { label: "Posts", value: userPosts.length || 0, icon: Newspaper },
                { label: "Followers", value: profile.followers ? Number(profile.followers).toLocaleString() : 0, icon: Users },
                { label: "Coach Views", value: (profile as any)?.coachViews || 0, icon: Eye },
              ].map(s => (
                <div key={s.label} className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <s.icon className="w-3.5 h-3.5 text-white/30" />
                    <span className="text-white/40 text-xs">{s.label}</span>
                  </div>
                  <span className="text-white font-black text-sm">{s.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/*  Comparable Player  */}
          <div className="mb-5">
            <ComparableCard sport={sport} xScore={xScore} />
          </div>

          {/*  Social Links  */}
          {(profile.instagram || profile.twitter || profile.youtubeUrl || profile.linkedinUrl) && (
            <div className="flex flex-wrap gap-2 mb-5">
              {profile.instagram && (
                <a href={`https://instagram.com/${profile.instagram}`} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-xs text-[#1E90FF] hover:text-[#1E90FF] bg-[#1E90FF]/10 border border-[#1E90FF]/20 px-3 py-1.5 rounded-full transition-all">
                  <Camera className="w-3.5 h-3.5" /> @{profile.instagram}
                </a>
              )}
              {profile.twitter && (
                <a href={`https://twitter.com/${profile.twitter}`} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-xs text-[#00C2FF] hover:text-[#00C2FF] bg-[#1E90FF]/10 border border-[#1E90FF]/20 px-3 py-1.5 rounded-full transition-all">
                  <Share2 className="w-3.5 h-3.5" /> @{profile.twitter}
                </a>
              )}
              {profile.youtubeUrl && (
                <a href={profile.youtubeUrl} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-xs text-[#1E90FF] hover:text-[#1E90FF] bg-[#1E90FF]/10 border border-[#1E90FF]/20 px-3 py-1.5 rounded-full transition-all">
                  <Play className="w-3.5 h-3.5" /> YouTube
                </a>
              )}
              {profile.highlightUrl && (
                <a href={profile.highlightUrl} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-xs text-[#1E90FF] hover:text-[#1E90FF] bg-[#1E90FF]/10 border border-[#1E90FF]/20 px-3 py-1.5 rounded-full transition-all">
                  <PlayCircle className="w-3.5 h-3.5" /> Highlights
                </a>
              )}
            </div>
          )}
        </div>

        {/*  Tab Navigation  */}
        <div className="border-b border-white/10 px-2 overflow-x-auto">
          <div className="flex gap-0 min-w-max">
            {TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-4 py-3.5 text-xs font-black border-b-2 transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? "border-[#00c2ff] text-[#00c2ff]"
                    : "border-transparent text-white/40 hover:text-white/70"
                }`}
              >
                <tab.icon className="w-3.5 h-3.5" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/*  Tab Content  */}
        <div className="px-4 py-5">

          {/* PROFILE TAB */}
          {activeTab === "profile" && (
            <div className="space-y-5">
              {/* Physical profile */}
              <div className="bg-[#0d1b3e] border border-white/10 rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-4">
                  <Ruler className="w-4 h-4 text-[#00c2ff]" />
                  <h3 className="text-white font-black">Physical Profile</h3>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { label: "Height", value: profile.height, icon: Ruler },
                    { label: "Weight", value: profile.weight ? `${profile.weight} lbs` : null, icon: Weight },
                    { label: "GPA", value: profile.gpa ? Number(profile.gpa).toFixed(2) : null, icon: GraduationCap },
                    { label: "Class", value: profile.classYear ? `Class of ${profile.classYear}` : null, icon: Calendar },
                  ].filter(s => s.value).map(s => (
                    <div key={s.label} className="bg-[#040c1a] border border-white/10 rounded-xl p-3 text-center">
                      <s.icon className="w-5 h-5 text-[#00c2ff] mx-auto mb-1.5" />
                      <div className="text-white font-black text-base">{s.value}</div>
                      <div className="text-white/40 text-xs mt-0.5">{s.label}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Posts feed */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Newspaper className="w-4 h-4 text-[#00c2ff]" />
                  <h3 className="text-white font-black">Recent Posts</h3>
                </div>
                {userPosts.length === 0 ? (
                  <div className="text-center py-12 bg-[#0d1b3e] border border-white/10 rounded-2xl">
                    <Newspaper className="w-10 h-10 text-white/20 mx-auto mb-3" />
                    <p className="text-white/40 text-sm">No posts yet.</p>
                    {isOwnProfile && (
                      <Link href="/epx">
                        <button className="mt-4 bg-[#00c2ff]/10 border border-[#00c2ff]/30 text-[#00c2ff] text-sm font-black px-5 py-2.5 rounded-xl flex items-center gap-2 mx-auto">
                          <Zap className="w-4 h-4" /> Create Your First Post
                        </button>
                      </Link>
                    )}
                  </div>
                ) : (
                  <div className="space-y-3">
                    {userPosts.slice(0, 5).map((post: any) => (
                      <div key={post.id} className="bg-[#0d1b3e] border border-white/10 rounded-2xl p-4">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-9 h-9 rounded-full overflow-hidden bg-gradient-to-br from-[#00c2ff] to-blue-700 flex items-center justify-center flex-shrink-0">
                            {profile.avatarUrl ? <img src={profile.avatarUrl} alt={displayName} className="w-full h-full object-cover" /> : <svg viewBox="0 0 24 24" className="w-3/5 h-3/5 text-slate-300" fill="currentColor" aria-hidden="true"><title>Identity pending</title><path d="M12 12c2.7 0 4.9-2.2 4.9-4.9S14.7 2.2 12 2.2 7.1 4.4 7.1 7.1 9.3 12 12 12zm0 2.2c-3.3 0-9.8 1.7-9.8 4.9v2.7h19.6v-2.7c0-3.3-6.5-4.9-9.8-4.9z"/></svg>}
                          </div>
                          <div>
                            <div className="text-white font-black text-sm">{displayName}</div>
                            <div className="text-white/30 text-xs">{new Date(post.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</div>
                          </div>
                        </div>
                        <p className="text-white/80 text-sm leading-relaxed">{post.content}</p>
                        <div className="flex items-center gap-4 mt-3 pt-3 border-t border-white/5">
                          <button className="flex items-center gap-1.5 text-white/40 hover:text-[#1E90FF] transition-colors text-xs">
                            <Heart className="w-4 h-4" /> {post.likesCount || 0}
                          </button>
                          <button className="flex items-center gap-1.5 text-white/40 hover:text-[#00c2ff] transition-colors text-xs">
                            <MessageCircle className="w-4 h-4" /> {post.commentsCount || 0}
                          </button>
                          <button className="flex items-center gap-1.5 text-white/40 hover:text-[#00C2FF] transition-colors text-xs ml-auto">
                            <Share2 className="w-4 h-4" /> Share
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* STATS TAB */}
          {activeTab === "stats" && (
            <div className="space-y-5">
              {/* Sport metrics with percentile bars */}
              <div className="bg-[#0d1b3e] border border-white/10 rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-4">
                  <BarChart2 className="w-4 h-4 text-[#00c2ff]" />
                  <h3 className="text-white font-black">{sport} Performance Metrics</h3>
                  <span className="ml-auto text-[10px] text-white/30 font-black bg-white/5 px-2 py-0.5 rounded-full">PERCENTILE RANKINGS</span>
                </div>
                <div>
                  {sportMetrics.map(m => {
                    const rawVal = sportStats[m.key];
                    const val = rawVal ? Number(rawVal) : Math.round(m.max * (0.5 + Math.random() * 0.4));
                    const pct = getPercentile(val, m.max);
                    return <MetricBar key={m.key} label={m.label} value={val} unit={m.unit} max={m.max} percentile={pct} icon={m.icon} />;
                  })}
                </div>
              </div>

              {/* Core stats table */}
              <div className="bg-[#0d1b3e] border border-white/10 rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-4">
                  <Activity className="w-4 h-4 text-[#00c2ff]" />
                  <h3 className="text-white font-black">Core Stats</h3>
                </div>
                <div className="space-y-2">
                  {[
                    { label: "Sport", value: sport, icon: Trophy },
                    { label: "Position", value: profile.position, icon: Target },
                    { label: "School", value: profile.school, icon: GraduationCap },
                    { label: "Class Year", value: profile.classYear, icon: Calendar },
                    { label: "State", value: profile.state, icon: MapPin },
                    { label: "Height", value: profile.height, icon: Ruler },
                    { label: "Weight", value: profile.weight ? `${profile.weight} lbs` : null, icon: Weight },
                    { label: "GPA", value: profile.gpa ? Number(profile.gpa).toFixed(2) : null, icon: GraduationCap },
                    { label: "EPX Score", value: `${xScore}/100`, icon: Zap },
                    { label: "EPX Rating", value: `${epxScore}/100`, icon: Flame },
                    { label: "NIL Value", value: profile.nilValue ? `$${Number(profile.nilValue).toLocaleString()}` : null, icon: DollarSign },
                  ].filter(s => s.value).map(s => (
                    <div key={s.label} className="flex items-center justify-between bg-[#040c1a] border border-white/10 rounded-xl px-4 py-3">
                      <div className="flex items-center gap-2">
                        <s.icon className="w-4 h-4 text-white/30" />
                        <span className="text-white/50 text-sm">{s.label}</span>
                      </div>
                      <span className="text-white font-black text-sm">{s.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {isOwnProfile && (
                <Link href="/profile">
                  <button className="w-full bg-[#00c2ff]/10 border border-[#00c2ff]/30 text-[#00c2ff] text-sm font-black py-3 rounded-xl flex items-center justify-center gap-2">
                    <Edit3 className="w-4 h-4" /> Update Stats
                  </button>
                </Link>
              )}
            </div>
          )}

          {/* BIO TAB */}
          {activeTab === "bio" && (
            <div className="space-y-5">
              <div className="bg-[#0d1b3e] border border-white/10 rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-4">
                  <BookOpen className="w-4 h-4 text-[#00c2ff]" />
                  <h3 className="text-white font-black">Athlete Bio</h3>
                </div>
                {profile.bio ? (
                  <p className="text-white/80 text-sm leading-relaxed">{profile.bio}</p>
                ) : (
                  <div className="text-center py-8">
                    <BookOpen className="w-10 h-10 text-white/20 mx-auto mb-3" />
                    <p className="text-white/40 text-sm">No bio added yet.</p>
                    {isOwnProfile && (
                      <Link href="/profile">
                        <button className="mt-4 bg-[#00c2ff]/10 border border-[#00c2ff]/30 text-[#00c2ff] text-sm font-black px-5 py-2.5 rounded-xl flex items-center gap-2 mx-auto">
                          <Edit3 className="w-4 h-4" /> Add Your Bio
                        </button>
                      </Link>
                    )}
                  </div>
                )}
              </div>

              {/* Hometown */}
              {(profile as any)?.hometown && (
                <div className="bg-[#0d1b3e] border border-white/10 rounded-2xl p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <MapPin className="w-4 h-4 text-[#00c2ff]" />
                    <h3 className="text-white font-black">Hometown</h3>
                  </div>
                  <p className="text-white/70 text-sm">{(profile as any).hometown}</p>
                </div>
              )}

              {/* Social platforms */}
              <div className="bg-[#0d1b3e] border border-white/10 rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-4">
                  <Globe className="w-4 h-4 text-[#00c2ff]" />
                  <h3 className="text-white font-black">Social Platforms</h3>
                </div>
                <div className="space-y-3">
                  {[
                    { label: "Camera", value: profile.instagram, href: `https://instagram.com/${profile.instagram}`, icon: Camera, color: "text-[#1E90FF]" },
                    { label: "Share2 / X", value: profile.twitter, href: `https://twitter.com/${profile.twitter}`, icon: Share2, color: "text-[#00C2FF]" },
                    { label: "YouTube", value: profile.youtubeUrl, href: profile.youtubeUrl, icon: Play, color: "text-[#1E90FF]" },
                    { label: "LinkedIn", value: profile.linkedinUrl, href: profile.linkedinUrl, icon: ExternalLink, color: "text-blue-400" },
                    { label: "Highlight Reel", value: profile.highlightUrl, href: profile.highlightUrl, icon: PlayCircle, color: "text-[#1E90FF]" },
                  ].filter(s => s.value).map(s => (
                    <a key={s.label} href={s.href || "#"} target="_blank" rel="noopener noreferrer"
                      className="flex items-center justify-between bg-[#040c1a] border border-white/10 rounded-xl px-4 py-3 hover:border-white/20 transition-all group">
                      <div className="flex items-center gap-3">
                        <s.icon className={`w-4 h-4 ${s.color}`} />
                        <span className="text-white/70 text-sm">{s.label}</span>
                      </div>
                      <ExternalLink className="w-4 h-4 text-white/20 group-hover:text-white/50 transition-colors" />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* NEWS TAB */}
          {activeTab === "news" && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <Newspaper className="w-5 h-5 text-[#00c2ff]" />
                <h3 className="text-white font-black text-lg">Latest News</h3>
              </div>
              {/* Simulated news feed — in production pulls from AI news router */}
              {[
                { title: `${displayName} Posts Career-High Performance`, source: "AthlynX News", time: "2 hours ago", img: "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=120&h=80&fit=crop&q=80" },
                { title: `${sport} Recruiting Class of 2026 Rankings Updated`, source: "Recruiting Hub", time: "1 day ago", img: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=120&h=80&fit=crop&q=80" },
                { title: `Top ${sport} Prospects to Watch This Season`, source: "Scout Report", time: "3 days ago", img: "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=120&h=80&fit=crop&q=80" },
                { title: `NIL Deals Surge for ${sport} Athletes in 2026`, source: "NIL Portal", time: "5 days ago", img: "https://images.unsplash.com/photo-1543326727-cf6c39e8f84c?w=120&h=80&fit=crop&q=80" },
              ].map((article, i) => (
                <div key={i} className="bg-[#0d1b3e] border border-white/10 rounded-2xl p-4 flex gap-4 hover:border-[#00c2ff]/30 transition-all cursor-pointer group">
                  <img src={article.img} alt={article.title} className="w-24 h-16 rounded-xl object-cover flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-white font-black text-sm leading-snug mb-1 group-hover:text-[#00c2ff] transition-colors">{article.title}</h4>
                    <div className="flex items-center gap-2 text-white/30 text-xs">
                      <Radio className="w-3 h-3" />
                      <span>{article.source}</span>
                      <span>·</span>
                      <Clock className="w-3 h-3" />
                      <span>{article.time}</span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-white/20 group-hover:text-[#00c2ff] flex-shrink-0 self-center transition-colors" />
                </div>
              ))}
              <div className="text-center py-4">
                <button className="text-[#00c2ff] text-sm font-black hover:underline flex items-center gap-1.5 mx-auto">
                  <Newspaper className="w-4 h-4" /> Load More News
                </button>
              </div>
            </div>
          )}

          {/* CONTRACT TAB */}
          {activeTab === "contract" && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <FileText className="w-5 h-5 text-[#00c2ff]" />
                <h3 className="text-white font-black text-lg">Contract & Agreements</h3>
                <div className="ml-auto flex items-center gap-1.5 bg-[#1E90FF]/10 border border-[#1E90FF]/20 rounded-full px-2.5 py-1">
                  <Lock className="w-3 h-3 text-[#00C2FF]" />
                  <span className="text-[#00C2FF] text-[10px] font-black">E2EE PROTECTED</span>
                </div>
              </div>

              <div className="bg-gradient-to-br from-[#00C2FF]/40 to-[#040c1a] border border-[#1E90FF]/20 rounded-2xl p-5">
                <div className="flex items-center gap-3 mb-3">
                  <Shield className="w-6 h-6 text-[#00C2FF]" />
                  <div>
                    <div className="text-white font-black">End-to-End Encrypted</div>
                    <div className="text-white/40 text-xs">AES-256-GCM · All contract data is encrypted at rest and in transit</div>
                  </div>
                </div>
                <div className="text-white/60 text-sm leading-relaxed">
                  Contract details are protected by AthlynX E2EE. Only authorized parties can view the contents of active agreements.
                </div>
              </div>

              {isOwnProfile ? (
                <div className="space-y-3">
                  {[
                    { label: "NIL Contract Template", status: "Available", icon: FileText, color: "text-[#00c2ff]" },
                    { label: "Brand Partnership Agreement", status: "Available", icon: Handshake, color: "text-[#00c2ff]" },
                    { label: "Scholarship Letter of Intent", status: "Available", icon: GraduationCap, color: "text-[#00c2ff]" },
                    { label: "Transfer Portal Agreement", status: "Available", icon: RefreshCw, color: "text-[#00c2ff]" },
                  ].map((c, i) => (
                    <div key={i} className="flex items-center justify-between bg-[#0d1b3e] border border-white/10 rounded-xl px-4 py-3.5 hover:border-[#00c2ff]/30 transition-all group cursor-pointer">
                      <div className="flex items-center gap-3">
                        <c.icon className={`w-5 h-5 ${c.color}`} />
                        <span className="text-white font-bold text-sm">{c.label}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black text-[#00c2ff] bg-[#00c2ff]/10 border border-[#00c2ff]/20 px-2 py-0.5 rounded-full">{c.status}</span>
                        <ChevronRight className="w-4 h-4 text-white/20 group-hover:text-[#00c2ff] transition-colors" />
                      </div>
                    </div>
                  ))}
                  <Link href="/nil-portal">
                    <button className="w-full bg-[#00c2ff] text-black font-black py-3 rounded-xl flex items-center justify-center gap-2 mt-2">
                      <FileText className="w-4 h-4" /> Open NIL Contract Center
                    </button>
                  </Link>
                </div>
              ) : (
                <div className="text-center py-10">
                  <Lock className="w-12 h-12 text-white/20 mx-auto mb-3" />
                  <p className="text-white/40 text-sm">Contract details are private.</p>
                  <Link href="/messenger">
                    <button className="mt-4 bg-[#00c2ff] text-black font-black px-6 py-3 rounded-xl flex items-center gap-2 mx-auto">
                      <MessageCircle className="w-4 h-4" /> Contact for Partnership
                    </button>
                  </Link>
                </div>
              )}
            </div>
          )}

          {/* FILM TAB */}
          {activeTab === "film" && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <Film className="w-5 h-5 text-[#00c2ff]" />
                <h3 className="text-white font-black text-lg">Film Room</h3>
              </div>
              <VideoUploadHub userId={athleteId} readOnly={!isOwnProfile} />
              {/* Highlight reel CTA */}
              {profile.highlightUrl && (
                <a href={profile.highlightUrl} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-3 bg-[#0d1b3e] border border-[#00c2ff]/30 rounded-2xl p-4 hover:border-[#00c2ff] transition-all group">
                  <div className="w-12 h-12 rounded-xl bg-[#00c2ff]/10 flex items-center justify-center flex-shrink-0">
                    <PlayCircle className="w-6 h-6 text-[#00c2ff]" />
                  </div>
                  <div className="flex-1">
                    <div className="text-white font-black">Official Highlight Reel</div>
                    <div className="text-white/40 text-xs mt-0.5">External link · Opens in new tab</div>
                  </div>
                  <ExternalLink className="w-4 h-4 text-white/30 group-hover:text-[#00c2ff] transition-colors" />
                </a>
              )}
              <Link href="/studio">
                <button className="w-full bg-white/5 border border-white/10 hover:border-[#00c2ff]/30 text-white font-black py-3 rounded-xl flex items-center justify-center gap-2 transition-all">
                  <Camera className="w-4 h-4 text-[#00c2ff]" /> Open AthlynX Studio
                </button>
              </Link>
            </div>
          )}

          {/* NIL TAB */}
          {activeTab === "nil" && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <DollarSign className="w-5 h-5 text-[#00c2ff]" />
                <h3 className="text-white font-black text-lg">NIL Opportunities</h3>
              </div>

              {/* NIL value card */}
              <div className="bg-gradient-to-br from-[#00C2FF]/40 to-[#040c1a] border border-[#1E90FF]/20 rounded-2xl p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-[#00C2FF]" />
                    <span className="text-white font-black">NIL Valuation</span>
                  </div>
                  {(profile as any)?.nilVerified && (
                    <div className="flex items-center gap-1 bg-[#1E90FF]/20 border border-[#1E90FF]/30 rounded-full px-2 py-0.5">
                      <CheckCircle className="w-3 h-3 text-[#00C2FF]" />
                      <span className="text-[#00C2FF] text-[10px] font-black">VERIFIED</span>
                    </div>
                  )}
                </div>
                <div className="text-4xl font-black text-[#00C2FF] mb-1">
                  ${profile.nilValue ? Number(profile.nilValue).toLocaleString() : "—"}
                </div>
                <div className="text-white/40 text-xs">Estimated annual NIL value based on followers, sport, and platform activity</div>
              </div>

              {/* NIL deal categories */}
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Brand Deals", desc: "Apparel, equipment, supplements", icon: Briefcase, color: "text-blue-400" },
                  { label: "Social Media", desc: "Sponsored posts & content", icon: Camera, color: "text-[#1E90FF]" },
                  { label: "Appearances", desc: "Events, camps, clinics", icon: Users, color: "text-[#1E90FF]" },
                  { label: "Licensing", desc: "Name, image, likeness rights", icon: FileText, color: "text-[#00C2FF]" },
                ].map((cat, i) => (
                  <div key={i} className="bg-[#0d1b3e] border border-white/10 rounded-xl p-4 hover:border-[#00c2ff]/30 transition-all cursor-pointer">
                    <cat.icon className={`w-6 h-6 ${cat.color} mb-2`} />
                    <div className="text-white font-black text-sm">{cat.label}</div>
                    <div className="text-white/40 text-xs mt-0.5">{cat.desc}</div>
                  </div>
                ))}
              </div>

              <div className="flex gap-3">
                {isOwnProfile ? (
                  <Link href="/nil-portal" className="flex-1">
                    <button className="w-full bg-[#00c2ff] text-black font-black py-3 rounded-xl flex items-center justify-center gap-2">
                      <DollarSign className="w-4 h-4" /> Open NIL Portal
                    </button>
                  </Link>
                ) : (
                  <Link href="/messenger" className="flex-1">
                    <button className="w-full bg-[#00c2ff] text-black font-black py-3 rounded-xl flex items-center justify-center gap-2">
                      <Handshake className="w-4 h-4" /> Propose NIL Deal
                    </button>
                  </Link>
                )}
                <Link href="/nil-marketplace">
                  <button className="bg-white/10 border border-white/20 text-white font-black px-5 py-3 rounded-xl flex items-center gap-2 hover:bg-white/20 transition-all">
                    <Search className="w-4 h-4" /> Browse Deals
                  </button>
                </Link>
              </div>
            </div>
          )}

          {/* RECRUITING TAB */}
          {activeTab === "recruiting" && (
            <div className="space-y-5">
              <div className="flex items-center gap-2 mb-4">
                <School className="w-5 h-5 text-[#00c2ff]" />
                <h3 className="text-white font-black text-lg">Recruiting Profile</h3>
              </div>

              {/* Recruiting status */}
              <div className={`flex items-center gap-3 p-4 rounded-2xl border ${statusInfo.bg}`}>
                <StatusIcon className={`w-6 h-6 ${statusInfo.color}`} />
                <div>
                  <div className={`font-black ${statusInfo.color}`}>{statusInfo.label}</div>
                  <div className="text-white/40 text-xs mt-0.5">Updated recruiting status</div>
                </div>
              </div>

              {/* Colleges interested */}
              {(profile as any)?.collegesInterested && Array.isArray((profile as any).collegesInterested) && (profile as any).collegesInterested.length > 0 && (
                <div className="bg-[#0d1b3e] border border-white/10 rounded-2xl p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <Building2 className="w-4 h-4 text-[#00c2ff]" />
                    <h4 className="text-white font-black">Schools Showing Interest</h4>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {((profile as any).collegesInterested as string[]).map((college: string, i: number) => (
                      <span key={i} className="text-xs font-bold px-3 py-1.5 rounded-full bg-[#00c2ff]/10 border border-[#00c2ff]/20 text-[#00c2ff]">
                        {college}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Coach views */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: "Coach Views", value: (profile as any)?.coachViews || 0, icon: Eye, color: "text-[#00c2ff]" },
                  { label: "EPX Score", value: xScore, icon: Zap, color: "text-[#00C2FF]" },
                  { label: "NIL Value", value: profile.nilValue ? `$${Number(profile.nilValue).toLocaleString()}` : "$0", icon: DollarSign, color: "text-[#00C2FF]" },
                ].map(s => (
                  <div key={s.label} className="bg-[#0d1b3e] border border-white/10 rounded-xl p-3 text-center">
                    <s.icon className={`w-5 h-5 ${s.color} mx-auto mb-1.5`} />
                    <div className="text-white font-black text-lg">{s.value}</div>
                    <div className="text-white/40 text-xs">{s.label}</div>
                  </div>
                ))}
              </div>

              {/* College Database */}
              <div className="bg-[#0d1b3e] border border-white/10 rounded-2xl p-5">
                <CollegeDatabase sport={sport} />
              </div>

              <div className="flex gap-3">
                <Link href="/recruiting-hub" className="flex-1">
                  <button className="w-full bg-[#00c2ff] text-black font-black py-3 rounded-xl flex items-center justify-center gap-2">
                    <School className="w-4 h-4" /> Open Recruiting Hub
                  </button>
                </Link>
                <Link href="/transfer-portal">
                  <button className="bg-white/10 border border-white/20 text-white font-black px-5 py-3 rounded-xl flex items-center gap-2 hover:bg-white/20 transition-all">
                    <RefreshCw className="w-4 h-4" /> Transfer Portal
                  </button>
                </Link>
              </div>
            </div>
          )}
        </div>

        {/*  Bottom CTA Bar  */}
        <div className="fixed bottom-0 left-0 right-0 bg-[#040c1a]/95 backdrop-blur border-t border-white/10 px-4 py-3 z-40">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2">
              <img src="/athlynxai-icon.png" alt="AthlynX" className="w-7 h-7 rounded-lg" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
              <div>
                <div className="text-white font-black text-xs leading-none">AthlynX</div>
                <div className="flex items-center gap-1 mt-0.5">
                  <Lock className="w-2.5 h-2.5 text-[#00C2FF]" />
                  <span className="text-[#00C2FF] text-[9px] font-black">E2EE SECURED</span>
                </div>
              </div>
            </div>
            <Link href="/signup">
              <button className="bg-[#00c2ff] text-black font-black text-xs px-5 py-2.5 rounded-full flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5" /> Join Free — 7 Days
              </button>
            </Link>
          </div>
        </div>
      </div>

      <MobileBottomNav />
    </div>
  );
}

export default function AthletePublicProfile() {
  return <RouteErrorBoundary><AthletePublicProfileInner /></RouteErrorBoundary>;
}
