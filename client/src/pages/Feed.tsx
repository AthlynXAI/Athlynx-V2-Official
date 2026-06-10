/**
 * AthlynX FEED — Facebook/Instagram-style athlete social feed
 * Stories bar at top + real profile photos + like/comment/share
 */
import PlatformLayout from "@/components/PlatformLayout";
import { useState, useRef } from "react";
import { RouteErrorBoundary } from "@/components/GlobalErrorBoundary";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { toast } from "sonner";

const BADGE_COLORS: Record<string, string> = {
  ACHIEVEMENT: "bg-blue-900/30", WORKOUT: "bg-green-600",
  NIL_DEAL: "bg-purple-600", STATUS: "bg-[#1E90FF]",
  ANNOUNCEMENT: "bg-red-600", MILESTONE: "bg-blue-900/30",
};

const STORY_TYPES = [
  { type: "update", label: "Update", icon: "📢", color: "#3b82f6" },
  { type: "highlight", label: "Highlight", icon: "🏆", color: "#1E90FF" },
  { type: "nil", label: "NIL", icon: "💰", color: "#10b981" },
  { type: "game", label: "Game", icon: "🎮", color: "#ef4444" },
  { type: "training", label: "Training", icon: "⚡", color: "#06b6d4" },
  { type: "life", label: "Life", icon: "🌟", color: "#8b5cf6" },
];

// NIL doctrine: render the athlete's real Image; fall back to silhouette "Identity pending", never colored initials.
function Avatar({ src, name, size = "md" }: { src?: string | null; name?: string | null; size?: "sm" | "md" | "lg" }) {
  const sizeClass = size === "sm" ? "w-8 h-8" : size === "lg" ? "w-14 h-14" : "w-11 h-11";
  return (
    <div className={`${sizeClass} rounded-full bg-slate-800 flex items-center justify-center shrink-0 text-slate-400 overflow-hidden`} title={src ? (name ?? '') : 'Identity pending'}>
      {src ? (
        <img src={src} alt={name || "Athlete"} className="w-full h-full object-cover" />
      ) : (
        <svg viewBox="0 0 24 24" className="w-3/5 h-3/5" fill="currentColor" aria-hidden="true"><path d="M12 12c2.7 0 4.9-2.2 4.9-4.9S14.7 2.2 12 2.2 7.1 4.4 7.1 7.1 9.3 12 12 12zm0 2.2c-3.3 0-9.8 1.7-9.8 4.9v2.7h19.6v-2.7c0-3.3-6.5-4.9-9.8-4.9z"/></svg>
      )}
    </div>
  );
}

// ─── STORIES BAR ─────────────────────────────────────────────────────────────
function StoriesBar({ user }: { user: any }) {
  const [showAddStory, setShowAddStory] = useState(false);
  const [viewingStory, setViewingStory] = useState<any>(null);
  const [storyProgress, setStoryProgress] = useState(0);
  const [newStory, setNewStory] = useState({ caption: "", storyType: "update" });
  const progressRef = useRef<NodeJS.Timeout | null>(null);
  const utils = trpc.useUtils();

  const { data: stories = [] } = trpc.stories.getActiveStories.useQuery(undefined, {
    refetchInterval: 30000,
  });

  const createStory = trpc.stories.createStory.useMutation({
    onSuccess: () => {
      utils.stories.getActiveStories.invalidate();
      setShowAddStory(false);
      setNewStory({ caption: "", storyType: "update" });
      toast.success("Story posted! Visible for 24 hours.");
    },
    onError: (e) => toast.error(e.message),
  });

  const viewStory = trpc.stories.viewStory.useMutation();

  const openStory = (story: any) => {
    setViewingStory(story);
    setStoryProgress(0);
    viewStory.mutate({ storyId: story.id });
    // Auto-progress bar
    if (progressRef.current) clearInterval(progressRef.current);
    progressRef.current = setInterval(() => {
      setStoryProgress(p => {
        if (p >= 100) {
          clearInterval(progressRef.current!);
          setViewingStory(null);
          return 0;
        }
        return p + 2;
      });
    }, 100);
  };

  const closeStory = () => {
    setViewingStory(null);
    setStoryProgress(0);
    if (progressRef.current) clearInterval(progressRef.current);
  };

  // Group stories by user
  const storyUsers = (stories as any[]).reduce((acc: any[], story: any) => {
    const existing = acc.find((u: any) => u.userId === story.userId);
    if (existing) {
      existing.stories.push(story);
    } else {
      acc.push({ userId: story.userId, name: story.authorName, avatar: story.authorAvatar, stories: [story] });
    }
    return acc;
  }, []);

  return (
    <>
      <div className="bg-[#000000]/92 border border-[#1E90FF]/20 rounded-2xl shadow-[0_24px_60px_rgba(0,0,0,0.42)] backdrop-blur-xl p-3">
        <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-hide">
          {/* Add Story button */}
          {user && (
            <button onClick={() => setShowAddStory(true)}
              className="flex flex-col items-center gap-1.5 shrink-0">
              <div className="w-14 h-14 rounded-full bg-[#000000] border-2 border-dashed border-[#1E90FF] flex items-center justify-center text-[#1E90FF] hover:border-[#1E90FF] hover:text-[#1E90FF] transition-colors relative">
                <Avatar src={user.avatarUrl} name={user.name} size="lg" />
                <div className="absolute bottom-0 right-0 w-5 h-5 bg-[#1E90FF] rounded-full flex items-center justify-center border-2 border-[#0a1628]">
                  <span className="text-white text-xs font-black">+</span>
                </div>
              </div>
              <span className="text-[#1E90FF] text-[10px] font-semibold whitespace-nowrap">Your Story</span>
            </button>
          )}

          {/* Other users' stories */}
          {storyUsers.map((storyUser: any) => (
            <button key={storyUser.userId} onClick={() => openStory(storyUser.stories[0])}
              className="flex flex-col items-center gap-1.5 shrink-0">
              <div className="w-14 h-14 rounded-full p-0.5 bg-gradient-to-tr from-[#1E90FF] via-[#0080FF] to-[#1E90FF]">
                <div className="w-full h-full rounded-full overflow-hidden bg-[#000000] border-2 border-[#0a1628]">
                  <Avatar src={storyUser.avatar} name={storyUser.name} size="lg" />
                </div>
              </div>
              <span className="text-white text-[10px] font-semibold whitespace-nowrap max-w-14 truncate">
                {storyUser.name?.split(" ")[0] || "Athlete"}
              </span>
            </button>
          ))}

          {/* Placeholder stories for visual richness */}
          {storyUsers.length === 0 && [
            { name: "Marcus J.", icon: "🏈", color: "from-red-500 to-red-700" },
            { name: "Jordan D.", icon: "🏀", color: "from-[#1E90FF] to-[#0080FF]" },
            { name: "Aaliyah T.", icon: "🏃", color: "from-[#1E90FF] to-[#0080FF]" },
            { name: "Deon W.", icon: "⚾", color: "from-[#1E90FF] to-[#0080FF]" },
          ].map((p, i) => (
            <div key={i} className="flex flex-col items-center gap-1.5 shrink-0 opacity-40">
              <div className={`w-14 h-14 rounded-full bg-gradient-to-br ${p.color} flex items-center justify-center text-2xl border-2 border-[#1E90FF]`}>
                {p.icon}
              </div>
              <span className="text-[#1E90FF] text-[10px] font-semibold">{p.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Add Story Modal */}
      {showAddStory && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="bg-[#0a1628] border border-[#1E90FF]/25 rounded-t-2xl sm:rounded-2xl w-full max-w-sm p-5 space-y-4 overflow-y-auto" style={{maxHeight: "85vh", paddingBottom: "80px"}}>
            <div className="flex items-center justify-between">
              <h3 className="text-white font-black text-lg">Add to Your Story</h3>
              <button onClick={() => setShowAddStory(false)} className="w-8 h-8 bg-[#0a1628] rounded-full flex items-center justify-center text-white hover:bg-[#1E90FF]/20">✕</button>
            </div>
            <div className="flex items-center gap-3">
              <Avatar src={user?.avatarUrl} name={user?.name} />
              <div>
                <div className="text-white font-bold text-sm">{user?.name}</div>
                <div className="text-[#1E90FF] text-xs">Visible for 24 hours</div>
              </div>
            </div>
            <div>
              <label className="text-[#1E90FF] text-xs mb-1 block">Story Type</label>
              <div className="grid grid-cols-3 gap-2">
                {STORY_TYPES.map(t => (
                  <button key={t.type} onClick={() => setNewStory(p => ({ ...p, storyType: t.type }))}
                    className={`flex flex-col items-center gap-1 py-2 rounded-xl text-xs font-bold border transition-colors ${newStory.storyType === t.type ? "border-[#1E90FF] bg-[#1E90FF]/10 text-white" : "border-[#1E90FF]/15 text-[#1E90FF] hover:border-[#1E90FF]/30"}`}>
                    <span className="text-lg">{t.icon}</span>
                    <span>{t.label}</span>
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-[#1E90FF] text-xs mb-1 block">Caption</label>
              <textarea value={newStory.caption} onChange={e => setNewStory(p => ({ ...p, caption: e.target.value }))}
                placeholder="What's your story? Share a highlight, update, or NIL news..."
                rows={3} className="w-full bg-[#0a1628] border border-[#1E90FF]/20 text-white text-sm rounded-xl px-3 py-2.5 focus:outline-none focus:border-[#1E90FF] placeholder-slate-500 resize-none" />
            </div>
            <div className="flex gap-3">
              <button onClick={() => createStory.mutate({ caption: newStory.caption, storyType: newStory.storyType as any, mediaType: "text" })}
                disabled={createStory.isPending || !newStory.caption.trim()}
                className="flex-1 bg-gradient-to-r from-[#1E90FF] via-[#0080FF] to-[#1E90FF] hover:from-white hover:via-cyan-200 hover:to-blue-400 text-slate-950 shadow-[0_12px_38px_rgba(30,144,255,0.28)] disabled:opacity-50 text-white font-bold py-3 rounded-xl transition-colors">
                {createStory.isPending ? "Posting..." : "Post Story"}
              </button>
              <button onClick={() => setShowAddStory(false)} className="flex-1 border border-[#1E90FF]/25 text-[#1E90FF] font-bold py-3 rounded-xl hover:bg-[#0a1628]">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Story Viewer */}
      {viewingStory && (
        <div className="fixed inset-0 z-50 bg-black flex items-center justify-center" onClick={closeStory}>
          {/* Progress bar */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-white/20">
            <div className="h-full bg-white transition-all duration-100" style={{ width: `${storyProgress}%` }} />
          </div>
          {/* Author */}
          <div className="absolute top-4 left-4 flex items-center gap-3 z-10">
            <Avatar src={viewingStory.authorAvatar} name={viewingStory.authorName} />
            <div>
              <div className="text-white font-bold text-sm">{viewingStory.authorName}</div>
              <div className="text-white/60 text-xs">{new Date(viewingStory.createdAt).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}</div>
            </div>
          </div>
          {/* Close */}
          <button onClick={closeStory} className="absolute top-4 right-4 w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-white text-lg z-10">✕</button>
          {/* Content */}
          <div className="max-w-sm w-full mx-4 text-center" onClick={e => e.stopPropagation()}>
            {viewingStory.mediaUrl && viewingStory.mediaType === "image" && (
              <img src={viewingStory.mediaUrl} alt="" className="w-full rounded-2xl mb-4 max-h-96 object-cover" />
            )}
            {viewingStory.caption && (
              <div className="bg-black/60 backdrop-blur rounded-2xl p-4">
                <p className="text-white text-lg font-semibold leading-relaxed">{viewingStory.caption}</p>
              </div>
            )}
            {!viewingStory.mediaUrl && !viewingStory.caption && (
              <div className="bg-gradient-to-br from-[#1E90FF] via-[#0080FF] to-[#1E90FF] rounded-2xl p-12 text-6xl">🏆</div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

// ─── POST CARD ────────────────────────────────────────────────────────────────
function PostCard({ post, currentUserId, currentUserAvatar, currentUserName }: {
  post: any; currentUserId?: number; currentUserAvatar?: string | null; currentUserName?: string | null;
}) {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likesCount ?? 0);
  const [showComments, setShowComments] = useState(false);
  const [comment, setComment] = useState("");
  const utils = trpc.useUtils();

  const likeMutation = trpc.feed.likePost.useMutation({
    onMutate: () => { setLiked(l => !l); setLikeCount((c: number) => liked ? c - 1 : c + 1); },
    onSettled: () => utils.feed.getFeed.invalidate(),
  });
  const addCommentMutation = trpc.feed.addComment.useMutation({
    onSuccess: () => { setComment(""); utils.feed.getComments.invalidate({ postId: post.id }); },
    onError: (err) => { toast.error(err.message || "Failed to add comment."); },
  });
  const { data: comments = [] } = trpc.feed.getComments.useQuery({ postId: post.id }, { enabled: showComments });

  const timeAgo = (date: Date) => {
    const s = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
    if (s < 60) return `${s}s`; if (s < 3600) return `${Math.floor(s / 60)}m`;
    if (s < 86400) return `${Math.floor(s / 3600)}h`; return `${Math.floor(s / 86400)}d`;
  };

  return (
    <div className="bg-[#000000]/92 border border-[#1E90FF]/20 rounded-2xl shadow-[0_24px_60px_rgba(0,0,0,0.42)] backdrop-blur-xl overflow-hidden">
      <div className="flex items-start gap-3 p-4 pb-2">
        <Avatar src={post.authorAvatar} name={post.authorName} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="font-bold text-white text-sm">{post.authorName || "Athlete"}</span>
            <svg className="w-3.5 h-3.5 text-[#1E90FF] shrink-0" fill="currentColor" viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/></svg>
          </div>
          <div className="text-[#1E90FF] text-xs mt-0.5">{timeAgo(post.createdAt)} · 🌐</div>
        </div>
        <span className={`text-[9px] font-black px-2 py-1 rounded-full text-white shrink-0 ${BADGE_COLORS[post.postType?.toUpperCase()] ?? "bg-[#1E90FF]"}`}>
          {post.postType?.toUpperCase() || "POST"}
        </span>
      </div>
      <div className="px-4 pb-3"><p className="text-slate-100 text-sm leading-relaxed">{post.content}</p></div>
      {post.mediaUrl && post.mediaType === "video" && (
        <video className="w-full max-h-72 object-cover" muted loop playsInline controls><source src={post.mediaUrl} /></video>
      )}
      {post.mediaUrl && post.mediaType === "image" && (
        <img src={post.mediaUrl} className="w-full max-h-72 object-cover" alt="" />
      )}
      <div className="px-4 py-2 flex items-center justify-between text-xs text-[#1E90FF] border-t border-[#1E90FF]/15/50">
        <div className="flex items-center gap-1">
          {likeCount > 0 && (
            <><span className="w-4 h-4 bg-[#1E90FF] rounded-full flex items-center justify-center text-[8px]">👍</span><span>{likeCount.toLocaleString()}</span></>
          )}
        </div>
        <div className="flex items-center gap-3">
          {(post.commentsCount ?? 0) > 0 && <span>{post.commentsCount} comments</span>}
        </div>
      </div>
      <div className="px-2 py-1 flex items-center border-t border-[#1E90FF]/15">
        <button onClick={() => currentUserId && likeMutation.mutate({ postId: post.id })}
          className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-semibold transition-colors ${liked ? "text-[#1E90FF] bg-[#1E90FF]/10" : "text-[#1E90FF] hover:bg-white/5"}`}>
          <svg className="w-5 h-5" fill={liked ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"/>
          </svg>
          Like
        </button>
        <button onClick={() => setShowComments(!showComments)}
          className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-semibold text-[#1E90FF] hover:bg-white/5 transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
          </svg>
          Comment
        </button>
        <button onClick={() => navigator.share?.({ title: `${post.authorName} on AthlynX`, text: post.content, url: window.location.href })}
          className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-semibold text-[#1E90FF] hover:bg-white/5 transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"/>
          </svg>
          Share
        </button>
      </div>
      {showComments && (
        <div className="px-4 pb-4 border-t border-[#1E90FF]/15 pt-3 space-y-3">
          {currentUserId ? (
            <div className="flex gap-2">
              <Avatar src={currentUserAvatar} name={currentUserName} size="sm" />
              <div className="flex-1 flex gap-2">
                <input value={comment} onChange={e => setComment(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && comment.trim() && addCommentMutation.mutate({ postId: post.id, content: comment })}
                  placeholder="Write a comment..." className="flex-1 bg-[#000000] border border-[#1E90FF]/20 text-white text-sm rounded-full px-4 py-1.5 focus:outline-none focus:border-[#1E90FF] placeholder-slate-500" />
                <button onClick={() => comment.trim() && addCommentMutation.mutate({ postId: post.id, content: comment })}
                  disabled={addCommentMutation.isPending || !comment.trim()} className="text-[#1E90FF] hover:text-[#1E90FF] text-sm font-bold px-2 disabled:opacity-50">Post</button>
              </div>
            </div>
          ) : (
            <div className="text-center py-2"><a href="/signup" className="text-[#1E90FF] text-sm hover:text-[#1E90FF]">Sign in to comment</a></div>
          )}
          {(comments as any[]).length === 0 && <div className="text-xs text-[#1E90FF] text-center py-1">Be the first to comment</div>}
          {(comments as any[]).map((c: any) => (
            <div key={c.id} className="flex gap-2">
              <Avatar src={c.authorAvatar} name={c.authorName} size="sm" />
              <div className="bg-[#000000] rounded-2xl px-3 py-2 flex-1">
                <div className="text-xs font-bold text-[#1E90FF]">{c.authorName || "Athlete"}</div>
                <div className="text-xs text-slate-100 mt-0.5">{c.content}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── MAIN FEED ────────────────────────────────────────────────────────────────
function FeedInner() {
  const { user } = useAuth();
  const [postText, setPostText] = useState("");
  const [postType, setPostType] = useState<"status" | "achievement" | "workout" | "nil_deal" | "announcement" | "milestone">("status");
  const utils = trpc.useUtils();
  const { data: feedData, isLoading } = trpc.feed.getFeed.useQuery({ limit: 30 });
  const posts = feedData ?? [];

  const createPostMutation = trpc.feed.createPost.useMutation({
    onSuccess: () => {
      setPostText("");
      utils.feed.getFeed.invalidate();
      toast.success("Post shared!");
    },
    onError: (err) => {
      toast.error(err.message || "Failed to post. Please try again.");
    },
  });

  return (
    <PlatformLayout>
      <div className="space-y-3 pb-24 lg:pb-4">

        {/* Billion-dollar mobile command strip */}
        <section className="relative overflow-hidden rounded-[28px] border border-blue-500/40/25 bg-[radial-gradient(circle_at_10%_0%,rgba(251,191,36,0.22),transparent_34%),radial-gradient(circle_at_90%_10%,rgba(30,144,255,0.20),transparent_32%),linear-gradient(135deg,rgba(3,7,18,0.98),rgba(8,13,30,0.94)_45%,rgba(15,23,42,0.98))] p-4 shadow-[0_30px_90px_rgba(0,0,0,0.6)]">
          <div className="absolute -right-12 -top-16 h-40 w-40 rounded-full bg-[#1E90FF]/20 blur-3xl" />
          <div className="absolute -left-10 bottom-0 h-32 w-32 rounded-full bg-blue-900/40/15 blur-3xl" />
          <div className="relative flex items-start justify-between gap-3">
            <div>
              <div className="text-[10px] font-black uppercase tracking-[0.32em] text-blue-400">AthlynX COMMAND FEED</div>
              <h2 className="mt-1 text-xl font-black leading-tight text-white">Not a social clone. The athlete operating system.</h2>
              <p className="mt-2 max-w-sm text-xs font-semibold leading-relaxed text-slate-300">Recruiting, NIL, AI Trainer, media, alerts, and athlete proof rails in one founder-built platform.</p>
            </div>
            <div className="rounded-2xl border border-cyan-200/30 bg-[#1E90FF]/10 px-3 py-2 text-right shadow-[0_0_28px_rgba(30,144,255,0.22)]">
              <div className="text-[10px] font-black uppercase tracking-widest text-[#1E90FF]">Live OS</div>
              <div className="text-lg font-black text-white">$1B</div>
            </div>
          </div>
        </section>

        {/* Stories bar — Instagram/Facebook style */}
        <StoriesBar user={user} />

        {/* Create post */}
        <div className="bg-[#000000]/92 border border-[#1E90FF]/20 rounded-2xl shadow-[0_24px_60px_rgba(0,0,0,0.42)] backdrop-blur-xl overflow-hidden">
          {user ? (
            <>
              <div className="flex gap-3 p-4 pb-2">
                <Avatar src={user.avatarUrl} name={user.name} />
                <textarea value={postText} onChange={e => setPostText(e.target.value)}
                  placeholder={`What's on your mind, ${user.name?.split(" ")[0] || "Athlete"}? Share your highlight, training update, or NIL news...`}
                  rows={2} className="flex-1 bg-[#000000] border border-[#1E90FF]/20 text-white text-sm rounded-2xl px-4 py-2.5 focus:outline-none focus:border-[#1E90FF] placeholder-slate-500 resize-none" />
              </div>
              <div className="flex items-center gap-1 px-4 pb-3 pt-1 border-t border-[#1E90FF]/15/50">
                {[
                  { label: "📸 Photo", value: "achievement", color: "text-green-400" },
                  { label: "🎬 Video", value: "workout", color: "text-red-400" },
                  { label: "💰 NIL Deal", value: "nil_deal", color: "text-green-400" },
                  { label: "⚡ Highlight", value: "status", color: "text-[#1E90FF]" },
                ].map(btn => (
                  <button key={btn.value} onClick={() => setPostType(btn.value as any)}
                    className={`text-xs font-semibold px-2 py-1.5 rounded-lg transition-colors ${postType === btn.value ? `${btn.color} bg-[#1E90FF]/10` : `${btn.color} hover:bg-white/5`}`}>
                    {btn.label}
                  </button>
                ))}
                <button onClick={() => postText.trim() && createPostMutation.mutate({ content: postText, postType })}
                  disabled={createPostMutation.isPending || !postText.trim()}
                  className="ml-auto bg-gradient-to-r from-[#1E90FF] via-[#0080FF] to-[#1E90FF] hover:from-white hover:via-cyan-200 hover:to-blue-400 text-slate-950 shadow-[0_12px_38px_rgba(30,144,255,0.28)] disabled:opacity-50 text-white text-sm font-bold px-5 py-1.5 rounded-full transition-colors">
                  {createPostMutation.isPending ? "Posting..." : "Post"}
                </button>
              </div>
            </>
          ) : (
            <div className="p-4 text-center">
              <a href="/signup" className="inline-block bg-gradient-to-r from-[#1E90FF] via-[#0080FF] to-[#1E90FF] hover:from-white hover:via-cyan-200 hover:to-blue-400 text-slate-950 shadow-[0_12px_38px_rgba(30,144,255,0.28)] text-white font-bold px-6 py-2.5 rounded-xl transition-colors">Sign In to Post</a>
            </div>
          )}
        </div>

        {/* Loading skeleton */}
        {isLoading && [1, 2, 3].map(i => (
          <div key={i} className="bg-[#000000]/92 border border-[#1E90FF]/20 rounded-2xl shadow-[0_24px_60px_rgba(0,0,0,0.42)] backdrop-blur-xl p-4 animate-pulse">
            <div className="flex gap-3 mb-3"><div className="w-11 h-11 rounded-full bg-slate-700/80" /><div className="flex-1 space-y-2"><div className="h-4 bg-slate-700/80 rounded w-1/3" /><div className="h-3 bg-slate-700/80 rounded w-1/4" /></div></div>
            <div className="space-y-2"><div className="h-3 bg-slate-700/80 rounded" /><div className="h-3 bg-slate-700/80 rounded w-5/6" /></div>
          </div>
        ))}

        {/* Empty state with showcase posts */}
        {!isLoading && (posts as any[]).length === 0 && (
          <>
            <div className="bg-gradient-to-r from-black via-[#0a1628] to-black border border-[#1E90FF]/30 rounded-xl p-4 text-center">
              <div className="text-3xl mb-2">🏆</div>
              <div className="text-white font-bold text-base mb-1">The Feed is Live — Be First</div>
              <div className="text-[#1E90FF] text-sm mb-3">Share your highlight, training update, or NIL news. The community is watching.</div>
              {!user && <a href="/signup" className="inline-block bg-gradient-to-r from-[#1E90FF] via-[#0080FF] to-[#1E90FF] text-white font-bold px-6 py-2.5 rounded-xl transition-all hover:opacity-90">Join Free — 7 Days</a>}
            </div>
            {/* Showcase activity cards */}
            {[
              { name: "Marcus Johnson", sport: "Football", type: "NIL_DEAL", content: "Just signed a $15,000 NIL deal with Under Armour! Hard work pays off. Thank you to everyone who believed in me. #NIL #Football #AthlynX", time: "2h", likes: 847, comments: 124, avatar: null },
              { name: "Destiny Williams", sport: "Basketball", type: "ACHIEVEMENT", content: "Committed to LSU! 🐯 After months of recruiting visits and conversations, I know this is where I'm supposed to be. Can't wait to play in the SEC! #Committed #LSU #Basketball", time: "5h", likes: 2341, comments: 389, avatar: null },
              { name: "Tyler Brooks", sport: "Baseball", type: "WORKOUT", content: "Day 47 of offseason training. Velocity up to 94 mph from 88 mph last year. The Diamond Grind AI training program is no joke. Scouts are calling. 🔥 #DiamondGrind #Baseball #Velocity", time: "1d", likes: 1203, comments: 87, avatar: null },
              { name: "Aaliyah Torres", sport: "Soccer", type: "MILESTONE", content: "Just hit 10,000 followers! My NIL value on AthlynX just updated to $38K. If you're a brand looking for a Stanford soccer player with a real audience — my DMs are open. #NIL #Soccer #Stanford", time: "2d", likes: 3102, comments: 445, avatar: null },
            ].map((p, i) => (
              <div key={i} className="bg-[#000000]/92 border border-[#1E90FF]/20 rounded-2xl shadow-[0_24px_60px_rgba(0,0,0,0.42)] backdrop-blur-xl overflow-hidden">
                <div className="flex items-start gap-3 p-4 pb-2">
                  <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#1E90FF] via-[#0080FF] to-[#1E90FF] flex items-center justify-center text-white font-black text-sm shrink-0">
                    {p.name.split(" ").map((w: string) => w[0]).join("")}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-white text-sm">{p.name}</span>
                      <svg className="w-3.5 h-3.5 text-[#1E90FF]" fill="currentColor" viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/></svg>
                    </div>
                    <div className="text-[#1E90FF] text-xs">{p.time} · {p.sport}</div>
                  </div>
                  <span className={`text-[9px] font-black px-2 py-1 rounded-full text-white ${p.type === 'NIL_DEAL' ? 'bg-purple-600' : p.type === 'ACHIEVEMENT' ? 'bg-blue-900/30' : p.type === 'WORKOUT' ? 'bg-green-600' : 'bg-[#1E90FF]'}`}>{p.type.replace('_', ' ')}</span>
                </div>
                <div className="px-4 pb-3"><p className="text-slate-100 text-sm leading-relaxed">{p.content}</p></div>
                <div className="px-2 py-1 flex items-center border-t border-[#1E90FF]/15">
                  <div className="flex-1 flex items-center justify-center gap-2 py-2 text-sm font-semibold text-[#1E90FF]">👍 {p.likes.toLocaleString()}</div>
                  <div className="flex-1 flex items-center justify-center gap-2 py-2 text-sm font-semibold text-[#1E90FF]">💬 {p.comments}</div>
                  <div className="flex-1 flex items-center justify-center gap-2 py-2 text-sm font-semibold text-[#1E90FF]">↗ Share</div>
                </div>
              </div>
            ))}
          </>
        )}

        {/* Posts */}
        {(posts as any[]).map((post: any) => (
          <PostCard key={post.id} post={post}
            currentUserId={user?.id ? Number(user.id) : undefined}
            currentUserAvatar={user?.avatarUrl}
            currentUserName={user?.name}
          />
        ))}
      </div>
    </PlatformLayout>
  );
}

export default function Feed() {
  return <RouteErrorBoundary><FeedInner /></RouteErrorBoundary>;
}
