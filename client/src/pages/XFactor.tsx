import { useState } from "react";
import { RouteErrorBoundary } from "@/components/GlobalErrorBoundary";
import PlatformLayout from "@/components/PlatformLayout";
import MobileBottomNav from '@/components/MobileBottomNav'
import { Link } from "wouter";
import EPXPhoneMockup from "../components/XFactorPhoneMockup";
import MeetAthletes from "@/components/MeetAthletes";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import {
  Zap, Trophy, Star, TrendingUp, Heart, MessageCircle, Repeat2,
  Share2, Bookmark, MoreHorizontal, Search, Bell, Home, User,
  Play, Image as ImageIcon, BarChart2, MapPin, Smile, Send,
  ChevronRight, Award, Target, Activity, Eye, Users, Filter,
  Flame, Clock, Hash, Verified, Plus, ArrowUp, Video
} from "lucide-react";

const FEED_POSTS = [
  {
    id: 1,
    user: { name: "Marcus Williams", handle: "@mwilliams_qb", sport: "Football", position: "QB", school: "Westlake HS", verified: true, avatar: "MW", xScore: 94 },
    content: "Just dropped a 4.38 40-yard dash at the Nike Combine today. The work doesn't lie. ",
    stats: { likes: 2847, reposts: 412, comments: 189, views: 48200 },
    time: "2h",
    tags: ["#Combine", "#Football", "#QB"],
    highlight: { type: "combine", label: "4.38s 40-Yard Dash", icon: "" },
    trending: true,
  },
  {
    id: 2,
    user: { name: "Aaliyah Johnson", handle: "@aaliyah_hoops", sport: "Basketball", position: "PG", school: "Oak Ridge Academy", verified: true, avatar: "AJ", xScore: 91 },
    content: "Dropped 38 pts, 11 ast, 6 reb last night. Nike EYBL Peach Jam next week. Scouts — I'll be there. ",
    stats: { likes: 5103, reposts: 891, comments: 344, views: 92400 },
    time: "4h",
    tags: ["#EYBL", "#Basketball", "#PeachJam"],
    highlight: { type: "game", label: "38 PTS | 11 AST | 6 REB", icon: "" },
    trending: true,
  },
  {
    id: 3,
    user: { name: "DeShawn Carter", handle: "@dcarter_wr", sport: "Football", position: "WR", school: "IMG Academy", verified: false, avatar: "DC", xScore: 88 },
    content: "Just committed to my dream school. The journey was real but God had a plan. More details dropping soon. ",
    stats: { likes: 8920, reposts: 1204, comments: 672, views: 187000 },
    time: "6h",
    tags: ["#Committed", "#Football", "#WR"],
    highlight: { type: "commitment", label: "COMMITTED ", icon: "" },
    trending: true,
  },
  {
    id: 4,
    user: { name: "Sofia Reyes", handle: "@sofia_soccer10", sport: "Soccer", position: "MF", school: "Dallas FC Academy", verified: true, avatar: "SR", xScore: 89 },
    content: "Named to the US Soccer U-20 National Pool. Everything I've worked for since age 6. Thank you to everyone who believed. ",
    stats: { likes: 3412, reposts: 567, comments: 231, views: 61800 },
    time: "8h",
    tags: ["#USYNT", "#Soccer", "#NationalPool"],
    highlight: { type: "award", label: "US Soccer U-20 National Pool", icon: "" },
    trending: false,
  },
  {
    id: 5,
    user: { name: "Jordan Miles", handle: "@jmiles_track", sport: "Track & Field", position: "Sprinter", school: "Centennial HS", verified: false, avatar: "JM", xScore: 86 },
    content: "10.87 in the 100m at New Balance Nationals. PR by 0.12 seconds. The grind is real. ",
    stats: { likes: 1923, reposts: 298, comments: 145, views: 34700 },
    time: "12h",
    tags: ["#Track", "#NBNationals", "#Sprinter"],
    highlight: { type: "pr", label: "10.87s 100M — Personal Record", icon: "" },
    trending: false,
  },
  {
    id: 6,
    user: { name: "Tyler Brooks", handle: "@tbrooks_lb", sport: "Football", position: "LB", school: "Mater Dei HS", verified: true, avatar: "TB", xScore: 92 },
    content: "Elite 11 invite just hit the inbox. See y'all in Dallas.  #Elite11",
    stats: { likes: 4201, reposts: 734, comments: 289, views: 78300 },
    time: "1d",
    tags: ["#Elite11", "#Football", "#LB"],
    highlight: { type: "invite", label: "Elite 11 Invite — Dallas", icon: "" },
    trending: true,
  },
];

const TRENDING_ATHLETES = [
  { name: "Marcus Williams", handle: "@mwilliams_qb", sport: " Football QB", xScore: 94, change: "+8" },
  { name: "Aaliyah Johnson", handle: "@aaliyah_hoops", sport: " Basketball PG", xScore: 91, change: "+5" },
  { name: "Tyler Brooks", handle: "@tbrooks_lb", sport: " Football LB", xScore: 92, change: "+12" },
  { name: "Sofia Reyes", handle: "@sofia_soccer10", sport: " Soccer MF", xScore: 89, change: "+3" },
  { name: "DeShawn Carter", handle: "@dcarter_wr", sport: " Football WR", xScore: 88, change: "+7" },
];

const TRENDING_TAGS = [
  { tag: "#Elite11", posts: "12.4K posts" },
  { tag: "#PeachJam", posts: "8.9K posts" },
  { tag: "#NILDeal", posts: "34.2K posts" },
  { tag: "#Committed", posts: "21.7K posts" },
  { tag: "#CombineReady", posts: "6.1K posts" },
  { tag: "#7v7Nationals", posts: "4.8K posts" },
];

const XFACTOR_CATEGORIES = ["All", "Football", "Basketball", "Baseball", "Soccer", "Track", "Highlights", "Combines", "Commitments"];

//  EPX Feed — Real DB data with seeded fallback 
function EPXFeed({ activeCategory, activeTab, postText, setPostText }: {
  activeCategory: string;
  activeTab: string;
  postText: string;
  setPostText: (v: string) => void;
}) {
  const { user } = useAuth();
  const utils = trpc.useUtils();
  const { data: feedData, isLoading } = trpc.feed.getFeed.useQuery({ limit: 20 }, {
    refetchInterval: 30000,
    retry: 1,
  });
  const likePost = trpc.feed.likePost.useMutation({
    onSuccess: () => utils.feed.getFeed.invalidate(),
  });
  const createPost = trpc.feed.createPost.useMutation({
    onSuccess: () => {
      setPostText("");
      utils.feed.getFeed.invalidate();
    },
  });

  const posts = feedData?.posts ?? [];
  const filteredPosts = activeCategory === "All"
    ? posts
    : posts.filter((p: any) => p.type?.toLowerCase().includes(activeCategory.toLowerCase()) || (p.content as string)?.toLowerCase().includes(activeCategory.toLowerCase()));

  const displayPosts = filteredPosts.length > 0 ? filteredPosts : FEED_POSTS;

  const handlePost = () => {
    if (!postText.trim() || !user) return;
    createPost.mutate({ content: postText, postType: "status" });
  };

  return (
    <div>
      {/* Compose Box */}
      <div className="px-4 py-4 border-b border-slate-800">
        <div className="flex gap-3">
          <div
            className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 flex-shrink-0 overflow-hidden"
            title={user?.avatarUrl ? (user?.name || "You") : `${user?.name || "You"} — Identity pending`}
          >
            {user?.avatarUrl
              ? <img src={user.avatarUrl} alt={user?.name || "You"} className="w-full h-full object-cover" />
              : (
                <svg viewBox="0 0 24 24" className="w-3/5 h-3/5" fill="currentColor" aria-hidden="true">
                  <path d="M12 12c2.7 0 4.9-2.2 4.9-4.9S14.7 2.2 12 2.2 7.1 4.4 7.1 7.1 9.3 12 12 12zm0 2.2c-3.3 0-9.8 1.7-9.8 4.9v2.7h19.6v-2.7c0-3.3-6.5-4.9-9.8-4.9z" />
                </svg>
              )
            }
          </div>
          <div className="flex-1">
            <textarea
              value={postText}
              onChange={e => setPostText(e.target.value)}
              placeholder="Share your EPX moment..."
              className="w-full bg-transparent text-white placeholder-slate-600 text-base resize-none outline-none min-h-[60px]"
              rows={2}
            />
            <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-800">
              <div className="flex items-center gap-3 text-blue-400">
                <button className="hover:text-blue-300 transition-colors"><ImageIcon className="w-5 h-5" /></button>
                <button className="hover:text-blue-300 transition-colors"><BarChart2 className="w-5 h-5" /></button>
                <button className="hover:text-blue-300 transition-colors"><MapPin className="w-5 h-5" /></button>
              </div>
              <button
                onClick={handlePost}
                disabled={!postText.trim() || createPost.isPending}
                className="bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold px-5 py-1.5 rounded-full text-sm transition-colors flex items-center gap-1.5"
              >
                <Zap className="w-4 h-4" />
                {createPost.isPending ? "Posting..." : "Post"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Posts */}
      {isLoading ? (
        <div className="p-8 text-center">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-slate-500 text-sm">Loading athlete feed...</p>
        </div>
      ) : (
        <div>
          {displayPosts.map((post: any) => (
            <PostCard key={post.id} post={post} onLike={() => likePost.mutate({ postId: post.id })} />
          ))}
          {displayPosts.length === 0 && (
            <div className="p-8 text-center text-slate-500">
              <Trophy className="w-8 h-8 mx-auto mb-2 text-blue-600" />
              <p className="text-sm">Be the first to post your EPX moment!</p>
            </div>
          )}
        </div>
      )}

      {/* Load More */}
      <div className="p-6 text-center">
        <button
          onClick={() => utils.feed.getFeed.invalidate()}
          className="text-blue-400 hover:text-blue-300 text-sm font-medium hover:underline"
        >
          Refresh feed
        </button>
      </div>
    </div>
  );
}

function EPXScore({ score }: { score: number }) {
  const color = score >= 90 ? "text-[#00C2FF]" : score >= 80 ? "text-blue-400" : "text-slate-400";
  return (
    <span className={`text-xs font-bold ${color} flex items-center gap-0.5`}>
      <Zap className="w-3 h-3" />
      {score}
    </span>
  );
}

function PostCard({ post, onLike }: { post: any; onLike?: () => void }) {
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);

  return (
    <div className="border-b border-slate-800 px-4 py-4 hover:bg-slate-900/50 transition-colors cursor-pointer">
      <div className="flex gap-3">
        {/* Avatar */}
        <div className="flex-shrink-0">
          <div
            className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 overflow-hidden"
            title={post.authorName ? `${post.authorName} — Identity pending` : "Identity pending"}
          >
            {post.user?.avatarUrl
              ? <img src={post.user.avatarUrl} alt={post.authorName || "Author"} className="w-full h-full object-cover" />
              : (
                <svg viewBox="0 0 24 24" className="w-3/5 h-3/5" fill="currentColor" aria-hidden="true">
                  <path d="M12 12c2.7 0 4.9-2.2 4.9-4.9S14.7 2.2 12 2.2 7.1 4.4 7.1 7.1 9.3 12 12 12zm0 2.2c-3.3 0-9.8 1.7-9.8 4.9v2.7h19.6v-2.7c0-3.3-6.5-4.9-9.8-4.9z" />
                </svg>
              )
            }
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="font-bold text-white text-sm">{post.user?.name ?? post.authorName ?? "Athlete"}</span>
            {post.user?.verified && <Verified className="w-4 h-4 text-blue-400 fill-blue-400" />}
            {post.user?.xScore && <EPXScore score={post.user.xScore} />}
            <span className="text-slate-500 text-sm">{post.user?.handle ?? ""}</span>
            <span className="text-slate-600 text-sm">·</span>
            <span className="text-slate-500 text-sm">{post.time ?? (post.createdAt ? new Date(post.createdAt).toLocaleDateString() : "now")}</span>
            <div className="ml-auto">
              <button className="text-slate-600 hover:text-slate-400 p-1">
                <MoreHorizontal className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Sport badge */}
          {post.user?.sport && (
            <div className="flex items-center gap-2 mt-0.5 mb-2">
              <span className="text-xs text-slate-500">{post.user.sport}{post.user.position ? ` · ${post.user.position}` : ""}{post.user.school ? ` · ${post.user.school}` : ""}</span>
            </div>
          )}

          {/* Highlight badge */}
          {post.highlight && (
            <div className="mb-2 inline-flex items-center gap-1.5 bg-blue-950/60 border border-blue-800/50 rounded-full px-3 py-1">
              <span className="text-sm">{post.highlight.icon}</span>
              <span className="text-xs font-bold text-blue-300">{post.highlight.label}</span>
              {post.trending && <Flame className="w-3 h-3 text-[#00C2FF]" />}
            </div>
          )}

          {/* Post text */}
          <p className="text-slate-200 text-sm leading-relaxed mb-3">{post.content}</p>

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-3">
              {post.tags.map((tag: string) => (
                <span key={tag} className="text-blue-400 text-xs hover:underline cursor-pointer">{tag}</span>
              ))}
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-between text-slate-500 max-w-xs">
            <button className="flex items-center gap-1.5 hover:text-blue-400 transition-colors group">
              <MessageCircle className="w-4 h-4 group-hover:scale-110 transition-transform" />
              <span className="text-xs">{(post.stats?.comments ?? post.commentCount ?? 0).toLocaleString()}</span>
            </button>
            <button className="flex items-center gap-1.5 hover:text-[#00C2FF] transition-colors group">
              <Repeat2 className="w-4 h-4 group-hover:scale-110 transition-transform" />
              <span className="text-xs">{(post.stats?.reposts ?? 0).toLocaleString()}</span>
            </button>
            <button
              onClick={() => { setLiked(!liked); if (!liked && onLike) onLike(); }}
              className={`flex items-center gap-1.5 transition-colors group ${liked ? "text-[#1E90FF]" : "hover:text-[#1E90FF]"}`}
            >
              <Heart className={`w-4 h-4 group-hover:scale-110 transition-transform ${liked ? "fill-pink-500" : ""}`} />
              <span className="text-xs">{((post.stats?.likes ?? post.likes ?? 0) + (liked ? 1 : 0)).toLocaleString()}</span>
            </button>
            <button className="flex items-center gap-1.5 hover:text-blue-400 transition-colors group">
              <Eye className="w-4 h-4 group-hover:scale-110 transition-transform" />
              <span className="text-xs">{((post.stats?.views ?? post.viewCount ?? 0) / 1000).toFixed(1)}K</span>
            </button>
            <button
              onClick={() => setBookmarked(!bookmarked)}
              className={`flex items-center gap-1.5 transition-colors ${bookmarked ? "text-blue-400" : "hover:text-blue-400"}`}
            >
              <Bookmark className={`w-4 h-4 ${bookmarked ? "fill-blue-400" : ""}`} />
            </button>
            <button className="flex items-center gap-1.5 hover:text-blue-400 transition-colors">
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
      <MobileBottomNav />
    </div>
  );
}

function EPXInner() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("For You");
  const [activeCategory, setActiveCategory] = useState("All");
  const [postText, setPostText] = useState("");

  const tabs = ["For You", "Following", "Trending", "Scouts", "Highlights"];

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Top Nav */}
      <div className="sticky top-0 z-50 bg-black/90 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/portal">
              <button className="text-slate-400 hover:text-white transition-colors">
                <Home className="w-5 h-5" />
              </button>
            </Link>
            <div className="flex items-center gap-2">
              {/* AthlynX is the STAR — logo always leads */}
              <img src="/athlynx-icon.png" alt="AthlynX" className="w-9 h-9 rounded-xl object-cover" style={{ boxShadow: "0 0 12px rgba(0,194,255,0.5)" }} />
              <div className="flex flex-col leading-none">
                <span className="font-black text-[10px] tracking-widest text-[#00c2ff] uppercase">AthlynX</span>
                <span className="font-black text-lg tracking-tight text-white leading-tight">EPX</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="text-slate-400 hover:text-white transition-colors">
              <Search className="w-5 h-5" />
            </button>
            <button className="text-slate-400 hover:text-white transition-colors relative">
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full" />
            </button>
            <div
              className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 overflow-hidden"
              title={user?.avatarUrl ? (user?.name || "You") : `${user?.name || "You"} — Identity pending`}
            >
              {user?.avatarUrl
                ? <img src={user.avatarUrl} alt={user?.name || "You"} className="w-full h-full object-cover" />
                : (
                  <svg viewBox="0 0 24 24" className="w-3/5 h-3/5" fill="currentColor" aria-hidden="true">
                    <path d="M12 12c2.7 0 4.9-2.2 4.9-4.9S14.7 2.2 12 2.2 7.1 4.4 7.1 7.1 9.3 12 12 12zm0 2.2c-3.3 0-9.8 1.7-9.8 4.9v2.7h19.6v-2.7c0-3.3-6.5-4.9-9.8-4.9z" />
                  </svg>
                )
              }
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="max-w-6xl mx-auto px-4 flex gap-0 overflow-x-auto scrollbar-hide">
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                activeTab === tab
                  ? "border-blue-500 text-white"
                  : "border-transparent text-slate-500 hover:text-slate-300"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Hero Phone Mockup — shown on landing, hidden once user scrolls into feed */}
      <div className="bg-black border-b border-slate-800">
        <EPXPhoneMockup />
      </div>

      <div className="max-w-6xl mx-auto flex">
        {/* Left Sidebar */}
        <div className="hidden lg:block w-64 xl:w-72 flex-shrink-0 sticky top-[105px] h-[calc(100vh-105px)] overflow-y-auto px-4 py-4">
          {/* Trending Athletes */}
          <div className="bg-slate-900 rounded-2xl p-4 mb-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-blue-400" />
                Rising Athletes
              </h3>
            </div>
            <div className="space-y-3">
              {TRENDING_ATHLETES.map((athlete, i) => (
                <div key={i} className="flex items-center gap-2 cursor-pointer hover:bg-slate-800 rounded-lg p-1.5 transition-colors">
                  <div
                    className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 flex-shrink-0 overflow-hidden"
                    title={athlete.name ? `${athlete.name} — Identity pending` : "Identity pending"}
                  >
                    {(athlete as any).avatarUrl
                      ? <img src={(athlete as any).avatarUrl} alt={athlete.name} className="w-full h-full object-cover" />
                      : (
                        <svg viewBox="0 0 24 24" className="w-3/5 h-3/5" fill="currentColor" aria-hidden="true">
                          <path d="M12 12c2.7 0 4.9-2.2 4.9-4.9S14.7 2.2 12 2.2 7.1 4.4 7.1 7.1 9.3 12 12 12zm0 2.2c-3.3 0-9.8 1.7-9.8 4.9v2.7h19.6v-2.7c0-3.3-6.5-4.9-9.8-4.9z" />
                        </svg>
                      )
                    }
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-white truncate">{athlete.name}</div>
                    <div className="text-xs text-slate-500">{athlete.sport}</div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="text-xs font-bold text-[#00C2FF] flex items-center gap-0.5">
                      <Zap className="w-3 h-3" />{athlete.xScore}
                    </div>
                    <div className="text-xs text-[#00C2FF]">{athlete.change}</div>
                  </div>
                </div>
              ))}
            </div>
            <button className="mt-3 text-blue-400 text-sm hover:underline w-full text-left">Show more →</button>
          </div>

          {/* Trending Tags */}
          <div className="bg-slate-900 rounded-2xl p-4 mb-4">
            <h3 className="font-bold text-white flex items-center gap-2 mb-3">
              <Hash className="w-4 h-4 text-blue-400" />
              Trending in Sports
            </h3>
            <div className="space-y-2">
              {TRENDING_TAGS.map((item, i) => (
                <div key={i} className="cursor-pointer hover:bg-slate-800 rounded-lg p-1.5 transition-colors">
                  <div className="text-sm font-semibold text-blue-400">{item.tag}</div>
                  <div className="text-xs text-slate-500">{item.posts}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="bg-slate-900 rounded-2xl p-4">
            <h3 className="font-bold text-white mb-3 text-sm">Quick Access</h3>
            <div className="space-y-2">
              {[
                { label: "NIL Marketplace", href: "/nil-marketplace", icon: <Trophy className="w-4 h-4" /> },
                { label: "Elite Events", href: "/elite-events", icon: <Star className="w-4 h-4" /> },
                { label: "Agent Finder", href: "/agent-finder", icon: <Users className="w-4 h-4" /> },
                { label: "Athlete Calendar", href: "/athlete-calendar", icon: <Clock className="w-4 h-4" /> },
                { label: "NIL Jobs", href: "/nil-jobs", icon: <Target className="w-4 h-4" /> },
              ].map((link, i) => (
                <Link key={i} href={link.href}>
                  <div className="flex items-center gap-2 text-slate-400 hover:text-white text-sm cursor-pointer hover:bg-slate-800 rounded-lg p-1.5 transition-colors">
                    <span className="text-blue-400">{link.icon}</span>
                    {link.label}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Main Feed */}
        <div className="flex-1 border-x border-slate-800 min-h-screen">
          {/* Category Filter */}
          <div className="px-4 py-3 border-b border-slate-800 overflow-x-auto scrollbar-hide">
            <div className="flex gap-2">
              {XFACTOR_CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                    activeCategory === cat
                      ? "bg-blue-600 text-white"
                      : "bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Compose Box */}
          <div className="px-4 py-4 border-b border-slate-800">
            <div className="flex gap-3">
              <div
                className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 flex-shrink-0 overflow-hidden"
                title={user?.avatarUrl ? (user?.name || "You") : `${user?.name || "You"} — Identity pending`}
              >
                {user?.avatarUrl
                  ? <img src={user.avatarUrl} alt={user?.name || "You"} className="w-full h-full object-cover" />
                  : (
                    <svg viewBox="0 0 24 24" className="w-3/5 h-3/5" fill="currentColor" aria-hidden="true">
                      <path d="M12 12c2.7 0 4.9-2.2 4.9-4.9S14.7 2.2 12 2.2 7.1 4.4 7.1 7.1 9.3 12 12 12zm0 2.2c-3.3 0-9.8 1.7-9.8 4.9v2.7h19.6v-2.7c0-3.3-6.5-4.9-9.8-4.9z" />
                    </svg>
                  )
                }
              </div>
              <div className="flex-1">
                <textarea
                  value={postText}
                  onChange={e => setPostText(e.target.value)}
                  placeholder="Share your EPX moment..."
                  className="w-full bg-transparent text-white placeholder-slate-600 text-base resize-none outline-none min-h-[60px]"
                  rows={2}
                />
                <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-800">
                  <div className="flex items-center gap-3 text-blue-400">
                    <button className="hover:text-blue-300 transition-colors"><ImageIcon className="w-5 h-5" /></button>
                    <button className="hover:text-blue-300 transition-colors"><Video className="w-5 h-5" /></button>
                    <button className="hover:text-blue-300 transition-colors"><BarChart2 className="w-5 h-5" /></button>
                    <button className="hover:text-blue-300 transition-colors"><MapPin className="w-5 h-5" /></button>
                    <button className="hover:text-blue-300 transition-colors"><Smile className="w-5 h-5" /></button>
                  </div>
                  <button
                    disabled={!postText.trim()}
                    className="bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold px-5 py-1.5 rounded-full text-sm transition-colors flex items-center gap-1.5"
                  >
                    <Zap className="w-4 h-4" />
                    Post
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/*  FOUNDER WELCOME BANNER  */}
          <div className="border-b border-slate-800 bg-gradient-to-r from-blue-950/60 to-slate-900/60 p-4">
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#00c2ff] to-blue-700 flex items-center justify-center text-white font-black text-lg shrink-0 ring-2 ring-[#00c2ff]/40">
                CD
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-white font-black text-sm">Chad A. Dozier Sr.</span>
                  <span className="bg-[#00c2ff] text-black text-[9px] font-black px-1.5 py-0.5 rounded-full">FOUNDER</span>
                  <span className="text-slate-500 text-xs">Founder · CEO · Chairman, AthlynXAI</span>
                </div>
                <p className="text-slate-300 text-sm leading-relaxed mb-3">
                   Welcome to AthlynX — the platform built <strong>FOR YOU</strong>. Every sport. Every level. Youth to Pro to Retired. I built this because athletes deserve better. Your NIL deals, your recruiting profile, your training, your future — all in one place.
                </p>
                <p className="text-slate-400 text-xs mb-3">
                  I read every message. Tell me what you need. This platform exists to serve you.
                </p>
                <div className="flex flex-wrap gap-2">
                  <Link href="/community-feedback">
                    <button className="flex items-center gap-1.5 bg-[#00c2ff]/10 hover:bg-[#00c2ff]/20 border border-[#00c2ff]/30 text-[#00c2ff] text-xs font-bold px-3 py-1.5 rounded-full transition-all">
                       Talk to the Founder
                    </button>
                  </Link>
                  <Link href="/profile">
                    <button className="flex items-center gap-1.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 text-xs font-bold px-3 py-1.5 rounded-full transition-all">
                       Set Up Your Profile
                    </button>
                  </Link>
                  <Link href="/nil-portal">
                    <button className="flex items-center gap-1.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 text-xs font-bold px-3 py-1.5 rounded-full transition-all">
                       Find NIL Deals
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Feed — Real DB Data */}
          <EPXFeed activeCategory={activeCategory} activeTab={activeTab} postText={postText} setPostText={setPostText} />
        </div>

        {/* Right Sidebar */}
        <div className="hidden xl:block w-72 flex-shrink-0 sticky top-[105px] h-[calc(100vh-105px)] overflow-y-auto px-4 py-4">
          {/* EPX Score Explainer */}
          <div className="bg-gradient-to-br from-blue-950 to-slate-900 border border-blue-800/50 rounded-2xl p-4 mb-4">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-5 h-5 text-[#00C2FF]" />
              <h3 className="font-bold text-white">What is EPX?</h3>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed mb-3">
              Your EPX score (0–100) is your AI-powered athlete rating based on combine metrics, game film, stats, recruiting interest, and intangibles. It grows as you perform.
            </p>
            <div className="space-y-1.5">
              {[
                { label: "90–100", desc: "Elite — Pro Prospect", color: "text-[#00C2FF]" },
                { label: "80–89", desc: "High Major D1", color: "text-blue-400" },
                { label: "70–79", desc: "Mid Major D1", color: "text-[#00C2FF]" },
                { label: "60–69", desc: "D2 / D3 Prospect", color: "text-slate-400" },
              ].map((tier, i) => (
                <div key={i} className="flex items-center justify-between text-xs">
                  <span className={`font-bold ${tier.color}`}>{tier.label}</span>
                  <span className="text-slate-500">{tier.desc}</span>
                </div>
              ))}
            </div>
            <Link href="/portal">
              <button className="mt-3 w-full bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold py-2 rounded-full transition-colors">
                Get Your EPX Score
              </button>
            </Link>
          </div>

          {/* Meet New Athletes — Live DB */}
          <MeetAthletes variant="sidebar" title="Meet New Athletes" showCoaches={true} />

          {/* Scout Spotlight */}
          <div className="bg-slate-900 rounded-2xl p-4">
            <h3 className="font-bold text-white mb-3 flex items-center gap-2">
              <Eye className="w-4 h-4 text-blue-400" />
              Scout Spotlight
            </h3>
            <div className="bg-blue-950/50 border border-blue-800/30 rounded-xl p-3">
              <div className="text-xs text-blue-300 font-medium mb-1"> Scouts are watching</div>
              <p className="text-xs text-slate-400 leading-relaxed">
                14 verified scouts and coaches are active on EPX right now. Post your highlights to get noticed.
              </p>
              <button className="mt-2 text-xs text-blue-400 hover:underline font-medium">
                See who's watching →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function EPX() {
  return <RouteErrorBoundary><EPXInner /></RouteErrorBoundary>;
}
