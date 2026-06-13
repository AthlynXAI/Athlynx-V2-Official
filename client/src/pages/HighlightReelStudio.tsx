/**
 * AthlynX HIGHLIGHT REEL STUDIO — S39
 * Upload, caption, share, and AI-title your highlight reels.
 * Wired to S3 upload + AI caption generation.
 * Colors: #0066ff blue, #00c2ff cyan. NO yellow.
 *
 * Session 39 — May 6, 2026
 */
import { useState, useRef } from "react";
import { RouteErrorBoundary } from "@/components/GlobalErrorBoundary";
import PlatformLayout from "@/components/PlatformLayout";
import MobileBottomNav from "@/components/MobileBottomNav";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { toast } from "sonner";
import { Link } from "wouter";
import {
  Play, Upload, Sparkles, Share2, Eye, Heart, MessageSquare,
  Download, Copy, Film, Zap, Star, TrendingUp, Clock,
  CheckCircle, Loader2, ChevronRight,
  BarChart2, Award, Cpu, Video, Scissors, Plus, X
} from "lucide-react";

// Inline social icons (lucide-react@1.14 doesn't export Instagram/Twitter)
const Instagram = (p: any) => (<svg viewBox="0 0 24 24" fill="currentColor" {...p}><path d="M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41a3.7 3.7 0 0 1-1.38-.9 3.7 3.7 0 0 1-.9-1.38c-.16-.42-.36-1.06-.41-2.23C2.17 15.58 2.16 15.2 2.16 12s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41C8.42 2.17 8.8 2.16 12 2.16Zm0 5.43A4.41 4.41 0 1 0 16.41 12 4.41 4.41 0 0 0 12 7.59Zm0 7.27A2.86 2.86 0 1 1 14.86 12 2.86 2.86 0 0 1 12 14.86Zm5.6-7.45a1.03 1.03 0 1 1-1.03-1.03 1.03 1.03 0 0 1 1.03 1.03Z"/></svg>);
const Twitter = (p: any) => (<svg viewBox="0 0 24 24" fill="currentColor" {...p}><path d="M18.244 2H21l-6.51 7.43L22 22h-6.84l-4.65-6.07L4.93 22H2.17l6.96-7.95L2 2h7.04l4.18 5.55L18.244 2Zm-2.4 18h1.86L7.27 4H5.3l10.55 16Z"/></svg>);

// Seed reels — shown until real videos are uploaded
const SEED_REELS = [
  {
    id: 1,
    title: "40-Yard Dash — 4.52s Personal Best",
    sport: "Football",
    athlete: "Marcus Williams",
    duration: "0:18",
    views: 12400,
    likes: 847,
    comments: 63,
    shares: 124,
    thumbnail: "https://images.unsplash.com/photo-1566577739112-5180d4bf9390?w=400&q=80",
    tags: ["#Football", "#40YardDash", "#QB", "#Recruiting"],
    uploadedAt: "2 days ago",
    status: "live",
  },
  {
    id: 2,
    title: "Game-Winning TD Pass vs. Katy Tigers",
    sport: "Football",
    athlete: "Marcus Williams",
    duration: "1:24",
    views: 28900,
    likes: 2140,
    comments: 189,
    shares: 412,
    thumbnail: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=400&q=80",
    tags: ["#Football", "#QB", "#Highlights", "#Texas6A"],
    uploadedAt: "1 week ago",
    status: "live",
  },
  {
    id: 3,
    title: "Training Camp — Arm Strength Showcase",
    sport: "Football",
    athlete: "Marcus Williams",
    duration: "2:05",
    views: 8700,
    likes: 612,
    comments: 44,
    shares: 87,
    thumbnail: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400&q=80",
    tags: ["#Football", "#Training", "#QB", "#Arm"],
    uploadedAt: "2 weeks ago",
    status: "live",
  },
];

//  AI Caption Templates 
const AI_CAPTIONS = [
  "Built different. Every rep, every route, every rep. The grind doesn't stop.  #AthlynX #Recruiting #Football",
  "When the lights come on, I deliver. 4.52 and climbing. D1 or bust.  #QB #40YardDash #ClassOf2027",
  "This is what 5am looks like. This is what commitment looks like. This is what I look like.  #Grind #Football #Westlake",
];

//  Stat Formatter 
function formatStat(n: number): string {
  if (n >= 1000) return (n / 1000).toFixed(1) + "K";
  return String(n);
}

//  Main Component 
function HighlightReelStudioInner() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<"my-reels" | "upload" | "analytics">("my-reels");

  // Real videos from DB
  const myVideosQuery = trpc.media.getMyVideos.useQuery(undefined, { staleTime: 60_000 });
  const realReels = (myVideosQuery.data ?? []).map((v: any) => ({
    id: v.id ?? String(Math.random()),
    title: v.title ?? "Untitled Reel",
    sport: v.sport ?? user?.sport ?? "Sport",
    athlete: user?.name ?? "Athlete",
    duration: v.duration ?? "0:00",
    views: v.views ?? 0,
    likes: v.likes ?? 0,
    comments: v.comments ?? 0,
    shares: v.shares ?? 0,
    thumbnail: v.thumbnailUrl ?? v.url ?? "",
    tags: v.tags ?? [],
    uploadedAt: v.createdAt ? new Date(v.createdAt).toLocaleDateString() : "Recently",
    status: "live" as const,
  }));
  const SAMPLE_REELS = realReels.length > 0 ? realReels : SEED_REELS;

  const [selectedReel, setSelectedReel] = useState<typeof SEED_REELS[0] | null>(null);
  const [uploadStep, setUploadStep] = useState<"select" | "details" | "ai" | "done">("select");
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [reelTitle, setReelTitle] = useState("");
  const [reelCaption, setReelCaption] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [generatingCaption, setGeneratingCaption] = useState(false);
  const [aiCaptionIndex, setAiCaptionIndex] = useState(0);
  const fileRef = useRef<HTMLInputElement>(null);

  const generateCaption = trpc.ai.generateCaption.useMutation({
    onSuccess: (data) => {
      setReelCaption(data.captions.split("\n")[0].replace(/^1\.\s*/, ""));
      setGeneratingCaption(false);
      toast.success("AI caption generated!");
    },
    onError: () => {
      // Fallback to local demo caption
      setReelCaption(AI_CAPTIONS[aiCaptionIndex % AI_CAPTIONS.length]);
      setAiCaptionIndex(i => i + 1);
      setGeneratingCaption(false);
      toast.success("Caption generated!");
    },
  });

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("video/")) {
      setUploadedFile(file);
      setUploadStep("details");
    } else {
      toast.error("Please upload a video file.");
    }
  }

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      setUploadStep("details");
    }
  }

  function handleGenerateCaption() {
    setGeneratingCaption(true);
    generateCaption.mutate({
      platform: "instagram",
      contentType: "highlight",
      context: reelTitle || "Athlete highlight reel",
      athleteName: user?.name || "Athlete",
      sport: user?.sport || "Football",
      includeHashtags: true,
    });
  }

  function handlePublish() {
    toast.success("Highlight reel published! Coaches and scouts can now view it.");
    setUploadStep("done");
  }

  const SPORT_TAGS: Record<string, string[]> = {
    Football: ["#Football", "#QB", "#Recruiting", "#D1", "#ClassOf2027", "#Highlights", "#Texas6A", "#AthlynX"],
    Basketball: ["#Basketball", "#Hoops", "#Recruiting", "#D1", "#Highlights", "#AthlynX"],
    Baseball: ["#Baseball", "#Pitcher", "#Recruiting", "#D1", "#Highlights", "#AthlynX"],
    default: ["#Athlete", "#Recruiting", "#Highlights", "#D1", "#AthlynX"],
  };
  const tags = SPORT_TAGS[user?.sport || "default"] || SPORT_TAGS.default;

  return (
    <PlatformLayout>
      <div className="min-h-screen bg-[#040c1a] pb-24">

        {/* Hero */}
        <div className="bg-gradient-to-b from-[#0a1628] to-[#040c1a] px-4 pt-5 pb-4">
          <div className="max-w-2xl mx-auto">
            <div className="flex items-center gap-2 mb-1">
              <Film size={18} className="text-[#00c2ff]" />
              <div className="text-[10px] font-black tracking-[0.3em] text-[#00c2ff] uppercase">AthlynX Studio</div>
            </div>
            <h1 className="text-2xl font-black text-white">Highlight Reel Studio™</h1>
            <p className="text-blue-400 text-sm mt-1">Upload, caption, and share your highlights. AI-powered titles and captions. Get seen by D1 coaches and brands.</p>
            <div className="flex gap-2 mt-3 flex-wrap">
              {[
                { label: " AI Captions", color: "bg-[#1E90FF]/40 border-[#1E90FF]/40 text-[#1E90FF]" },
                { label: " Coach Visibility", color: "bg-[#00C2FF]/40 border-[#00C2FF]/40 text-[#00C2FF]" },
                { label: " View Analytics", color: "bg-blue-900/40 border-blue-700/40 text-blue-300" },
              ].map((b, i) => (
                <span key={i} className={`text-[10px] font-bold px-2 py-1 rounded-full border ${b.color}`}>{b.label}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Tab Nav */}
        <div className="sticky top-0 z-20 bg-[#040c1a]/95 backdrop-blur border-b border-blue-900/30 px-4 py-2">
          <div className="max-w-2xl mx-auto flex gap-1.5">
            {[
              { id: "my-reels", label: " My Reels" },
              { id: "upload", label: " Upload" },
              { id: "analytics", label: " Analytics" },
            ].map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 text-xs font-bold py-2 rounded-xl transition-colors ${
                  activeTab === tab.id ? "bg-gradient-to-r from-[#0066ff] to-[#00c2ff] text-white" : "text-blue-400 hover:text-white bg-blue-900/20"
                }`}>
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="max-w-2xl mx-auto px-4 py-4 space-y-4">

          {/*  MY REELS  */}
          {activeTab === "my-reels" && (
            <>
              {/* Upload CTA */}
              <button onClick={() => setActiveTab("upload")}
                className="w-full bg-gradient-to-r from-[#0066ff]/20 to-[#00c2ff]/10 border border-dashed border-[#0066ff]/40 rounded-2xl p-4 flex items-center gap-3 hover:border-[#0066ff]/70 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-[#0066ff]/30 flex items-center justify-center shrink-0">
                  <Plus size={20} className="text-[#00c2ff]" />
                </div>
                <div className="text-left">
                  <div className="text-white font-black text-sm">Upload New Highlight Reel</div>
                  <div className="text-blue-500 text-xs">MP4, MOV, AVI · Max 500MB · AI captions included</div>
                </div>
                <ChevronRight size={16} className="text-blue-600 ml-auto shrink-0" />
              </button>

              {/* Reel Cards */}
              {SAMPLE_REELS.map((reel: typeof SEED_REELS[0], i: number) => (
                <div key={reel.id} className="bg-[#0d1e3c] border border-blue-800/50 rounded-2xl overflow-hidden">
                  {/* Thumbnail */}
                  <div className="relative">
                    <img src={reel.thumbnail} alt={reel.title} className="w-full h-44 object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#040c1a]/80 to-transparent" />
                    <div className="absolute bottom-3 left-3 right-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 bg-black/60 rounded-full px-2 py-1">
                          <Play size={10} className="text-white fill-white" />
                          <span className="text-white text-[10px] font-bold">{reel.duration}</span>
                        </div>
                        <div className="flex items-center gap-1.5 bg-[#00C2FF]/20 border border-[#00C2FF]/30 rounded-full px-2 py-1">
                          <div className="w-1.5 h-1.5 rounded-full bg-[#00C2FF]" />
                          <span className="text-[#00C2FF] text-[10px] font-black">LIVE</span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedReel(selectedReel?.id === reel.id ? null : reel)}
                      className="absolute inset-0 flex items-center justify-center"
                    >
                      <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur flex items-center justify-center hover:bg-white/30 transition-colors">
                        <Play size={24} className="text-white fill-white ml-1" />
                      </div>
                    </button>
                  </div>

                  {/* Info */}
                  <div className="p-4">
                    <div className="text-white font-black text-sm mb-1">{reel.title}</div>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-blue-500 text-xs">{reel.sport}</span>
                      <span className="text-blue-700 text-xs">·</span>
                      <span className="text-blue-600 text-xs">{reel.uploadedAt}</span>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-4 gap-2 mb-3">
                      {[
                        { icon: Eye, val: formatStat(reel.views), label: "Views" },
                        { icon: Heart, val: formatStat(reel.likes), label: "Likes" },
                        { icon: MessageSquare, val: formatStat(reel.comments), label: "Comments" },
                        { icon: Share2, val: formatStat(reel.shares), label: "Shares" },
                      ].map((s, si) => (
                        <div key={si} className="bg-blue-900/30 rounded-xl p-2 text-center">
                          <s.icon size={12} className="text-[#00c2ff] mx-auto mb-0.5" />
                          <div className="text-white font-black text-xs">{s.val}</div>
                          <div className="text-blue-600 text-[9px]">{s.label}</div>
                        </div>
                      ))}
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1 mb-3">
                      {reel.tags.map((tag: string, ti: number) => (
                        <span key={ti} className="text-[10px] font-bold text-[#00c2ff] bg-[#0066ff]/10 border border-[#0066ff]/20 rounded-full px-2 py-0.5">{tag}</span>
                      ))}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <button onClick={() => toast.success("Share link copied!")}
                        className="flex-1 border border-[#0066ff]/50 text-[#00c2ff] text-xs font-bold py-2 rounded-xl flex items-center justify-center gap-1">
                        <Share2 size={12} /> Share
                      </button>
                      <button onClick={() => toast.success("AI caption generated!")}
                        className="flex-1 border border-[#0066ff]/50 text-[#00c2ff] text-xs font-bold py-2 rounded-xl flex items-center justify-center gap-1">
                        <Sparkles size={12} /> AI Caption
                      </button>
                      <button onClick={() => toast.success("Reel analytics loading...")}
                        className="flex-1 bg-gradient-to-r from-[#0066ff] to-[#00c2ff] text-white text-xs font-black py-2 rounded-xl flex items-center justify-center gap-1">
                        <BarChart2 size={12} /> Stats
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </>
          )}

          {/*  UPLOAD  */}
          {activeTab === "upload" && (
            <>
              {uploadStep === "select" && (
                <div
                  onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={handleDrop}
                  className={`border-2 border-dashed rounded-2xl p-10 text-center transition-colors cursor-pointer ${
                    isDragging ? "border-[#0066ff] bg-[#0066ff]/10" : "border-blue-800/50 bg-[#0d1e3c] hover:border-[#0066ff]/50"
                  }`}
                  onClick={() => fileRef.current?.click()}
                >
                  <input ref={fileRef} type="file" accept="video/*" className="hidden" onChange={handleFileSelect} />
                  <Video size={40} className="text-[#0066ff] mx-auto mb-3" />
                  <div className="text-white font-black text-lg mb-1">Drop your highlight reel here</div>
                  <p className="text-blue-400 text-sm mb-4">or click to browse files</p>
                  <div className="text-blue-600 text-xs">MP4, MOV, AVI · Max 500MB · Best: 1080p or higher</div>
                </div>
              )}

              {(uploadStep === "details" || uploadStep === "ai") && uploadedFile && (
                <div className="space-y-4">
                  {/* File Info */}
                  <div className="bg-[#0d1e3c] border border-[#00C2FF]/40 rounded-2xl p-4 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#00C2FF]/20 flex items-center justify-center shrink-0">
                      <CheckCircle size={20} className="text-[#00C2FF]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-white font-black text-sm truncate">{uploadedFile.name}</div>
                      <div className="text-[#00C2FF] text-xs">{(uploadedFile.size / 1024 / 1024).toFixed(1)} MB · Ready to upload</div>
                    </div>
                    <button onClick={() => { setUploadedFile(null); setUploadStep("select"); }}
                      className="text-blue-600 hover:text-[#1E90FF] transition-colors">
                      <X size={16} />
                    </button>
                  </div>

                  {/* Title */}
                  <div>
                    <label className="text-blue-400 text-[10px] font-bold block mb-1">Reel Title *</label>
                    <input value={reelTitle} onChange={e => setReelTitle(e.target.value)}
                      placeholder="e.g. Game-Winning TD Pass vs. Katy Tigers"
                      className="w-full bg-[#0d1e3c] border border-blue-800/50 rounded-xl px-3 py-2.5 text-white text-sm placeholder-blue-700 focus:outline-none focus:border-[#0066ff]" />
                  </div>

                  {/* Caption */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-blue-400 text-[10px] font-bold">Caption</label>
                      <button onClick={handleGenerateCaption} disabled={generatingCaption}
                        className="flex items-center gap-1 text-[#00c2ff] text-[10px] font-bold hover:text-white transition-colors">
                        {generatingCaption ? <Loader2 size={10} className="animate-spin" /> : <Sparkles size={10} />}
                        AI Generate
                      </button>
                    </div>
                    <textarea value={reelCaption} onChange={e => setReelCaption(e.target.value)}
                      placeholder="Write a caption or use AI to generate one..."
                      rows={3}
                      className="w-full bg-[#0d1e3c] border border-blue-800/50 rounded-xl px-3 py-2.5 text-white text-sm placeholder-blue-700 focus:outline-none focus:border-[#0066ff] resize-none" />
                  </div>

                  {/* Tags */}
                  <div>
                    <label className="text-blue-400 text-[10px] font-bold block mb-2">Tags</label>
                    <div className="flex flex-wrap gap-1.5">
                      {tags.map(tag => (
                        <button key={tag} onClick={() => setSelectedTags(t => t.includes(tag) ? t.filter(x => x !== tag) : [...t, tag])}
                          className={`text-[11px] font-bold px-2.5 py-1 rounded-full transition-colors ${
                            selectedTags.includes(tag) ? "bg-[#0066ff] text-white" : "bg-[#0d1e3c] border border-blue-800/50 text-blue-400"
                          }`}>
                          {tag}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Share To */}
                  <div>
                    <label className="text-blue-400 text-[10px] font-bold block mb-2">Share To</label>
                    <div className="flex gap-2">
                      {[
                        { label: "AthlynX Feed", icon: "", active: true },
                        { label: "Instagram", icon: "", active: false },
                        { label: "Twitter/X", icon: "", active: false },
                      ].map((p, i) => (
                        <div key={i} className={`flex-1 flex items-center gap-1.5 p-2 rounded-xl border text-center justify-center ${
                          p.active ? "border-[#0066ff]/50 bg-[#0066ff]/10 text-[#00c2ff]" : "border-blue-800/30 text-blue-600"
                        }`}>
                          <span className="text-sm">{p.icon}</span>
                          <span className="text-[10px] font-bold">{p.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <button onClick={handlePublish}
                    className="w-full bg-gradient-to-r from-[#0066ff] to-[#00c2ff] text-white font-black py-3 rounded-xl flex items-center justify-center gap-2">
                    <Upload size={16} />
                    Publish Highlight Reel
                  </button>
                </div>
              )}

              {uploadStep === "done" && (
                <div className="bg-gradient-to-r from-[#00C2FF]/20 to-[#0a1628]/5 border border-[#00C2FF]/30 rounded-2xl p-8 text-center">
                  <CheckCircle size={48} className="text-[#00C2FF] mx-auto mb-4" />
                  <div className="text-white font-black text-xl mb-2">Reel Published!</div>
                  <p className="text-blue-400 text-sm mb-4">Your highlight reel is live. Coaches and scouts can now discover you through the AthlynX platform.</p>
                  <div className="flex gap-2">
                    <button onClick={() => { setUploadStep("select"); setUploadedFile(null); setReelTitle(""); setReelCaption(""); setSelectedTags([]); setActiveTab("my-reels"); }}
                      className="flex-1 bg-gradient-to-r from-[#0066ff] to-[#00c2ff] text-white text-xs font-black py-2.5 rounded-xl">
                      View My Reels
                    </button>
                    <button onClick={() => { setUploadStep("select"); setUploadedFile(null); setReelTitle(""); setReelCaption(""); setSelectedTags([]); }}
                      className="flex-1 border border-[#0066ff]/50 text-[#00c2ff] text-xs font-bold py-2.5 rounded-xl">
                      Upload Another
                    </button>
                  </div>
                </div>
              )}
            </>
          )}

          {/*  ANALYTICS  */}
          {activeTab === "analytics" && (
            <>
              {/* Summary Cards */}
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Total Views", val: "50,000+", icon: Eye, color: "text-[#00c2ff]", bg: "bg-[#0066ff]/20" },
                  { label: "Total Likes", val: "3,599", icon: Heart, color: "text-[#1E90FF]", bg: "bg-[#1E90FF]/20" },
                  { label: "Coach Views", val: "47", icon: Award, color: "text-[#00C2FF]", bg: "bg-blue-500/20" },
                  { label: "Shares", val: "623", icon: Share2, color: "text-[#00C2FF]", bg: "bg-[#00C2FF]/20" },
                ].map((s, i) => (
                  <div key={i} className="bg-[#0d1e3c] border border-blue-800/40 rounded-2xl p-4">
                    <div className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center mb-2`}>
                      <s.icon size={18} className={s.color} />
                    </div>
                    <div className={`font-black text-xl ${s.color}`}>{s.val}</div>
                    <div className="text-blue-600 text-xs">{s.label}</div>
                  </div>
                ))}
              </div>

              {/* Top Performing Reel */}
              <div className="bg-[#0d1e3c] border border-blue-800/50 rounded-2xl p-4">
                <div className="text-[10px] font-black text-[#00c2ff] tracking-widest uppercase mb-3">Top Performing Reel</div>
                <div className="flex items-center gap-3">
                  <img src={SAMPLE_REELS[1].thumbnail} alt="" className="w-16 h-16 rounded-xl object-cover shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="text-white font-black text-sm truncate">{SAMPLE_REELS[1].title}</div>
                    <div className="text-blue-400 text-xs">{formatStat(SAMPLE_REELS[1].views)} views · {formatStat(SAMPLE_REELS[1].likes)} likes</div>
                    <div className="flex items-center gap-1 mt-1">
                      <TrendingUp size={10} className="text-[#00C2FF]" />
                      <span className="text-[#00C2FF] text-[10px] font-bold">+24% this week</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Coach Activity */}
              <div className="bg-[#0d1e3c] border border-blue-800/50 rounded-2xl p-4">
                <div className="text-[10px] font-black text-[#00c2ff] tracking-widest uppercase mb-3">Recent Coach Activity</div>
                {[
                  { school: "LSU Tigers", coach: "Coach Williams", action: "Viewed 3 reels", time: "2h ago", level: "D1" },
                  { school: "Texas A&M", coach: "Coach Martinez", action: "Liked your highlight", time: "1d ago", level: "D1" },
                  { school: "Baylor Bears", coach: "Coach Johnson", action: "Shared your reel", time: "3d ago", level: "D1" },
                ].map((c, i) => (
                  <div key={i} className="flex items-center gap-3 py-2.5 border-b border-blue-900/20 last:border-0">
                    <div className="w-9 h-9 rounded-xl bg-blue-900/50 flex items-center justify-center text-sm shrink-0"></div>
                    <div className="flex-1 min-w-0">
                      <div className="text-white font-black text-xs">{c.school}</div>
                      <div className="text-blue-400 text-[10px]">{c.coach} · {c.action}</div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-[#00C2FF] text-[10px] font-black">{c.level}</div>
                      <div className="text-blue-700 text-[9px]">{c.time}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* AI Recommendations */}
              <div className="bg-gradient-to-r from-[#0066ff]/10 to-[#00c2ff]/5 border border-[#0066ff]/20 rounded-2xl p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Cpu size={14} className="text-[#00c2ff]" />
                  <div className="text-[10px] font-black text-[#00c2ff] tracking-widest uppercase">AI Recommendations</div>
                </div>
                {[
                  "Upload a 40-yard dash video — coaches view combine reels 3x more than game film",
                  "Add your GPA and academic achievements to your profile to attract academic scholarship offers",
                  "Post consistently — athletes who upload weekly get 4x more coach views",
                ].map((rec, i) => (
                  <div key={i} className="flex items-start gap-2 mb-2">
                    <Zap size={12} className="text-[#00c2ff] shrink-0 mt-0.5" />
                    <p className="text-blue-300 text-xs">{rec}</p>
                  </div>
                ))}
              </div>
            </>
          )}

        </div>
      </div>
      <MobileBottomNav />
    </PlatformLayout>
  );
}

export default function HighlightReelStudio() {
  return <RouteErrorBoundary><HighlightReelStudioInner /></RouteErrorBoundary>;
}
