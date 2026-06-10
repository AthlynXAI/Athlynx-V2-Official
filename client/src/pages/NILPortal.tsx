/**
 * AthlynX NIL PORTAL — The Unified Hub
 * Facebook-style Feed + Messenger + NIL Deals + Social Command Center
 * All platforms talk together here: Instagram, FB, X, TikTok, LinkedIn
 * Reverse funnel: all roads lead to AthlynX
 */
import PlatformLayout from "@/components/PlatformLayout";
import { useState } from "react";
import { RouteErrorBoundary } from "@/components/GlobalErrorBoundary";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { Link } from "wouter";
import { toast } from "sonner";
import { NILAvatar, type NILAvatarSize } from "@/components/NILAvatar";

const TABS = [
  { id: "feed", label: "Feed", icon: "🏠" },
  { id: "messenger", label: "Messenger", icon: "💬" },
  { id: "deals", label: "NIL Deals", icon: "💰" },
  { id: "social", label: "Social Hub", icon: "🌐" },
  { id: "vault", label: "NIL Vault", icon: "🔐" },
];

const SOCIAL_PLATFORMS = [
  { id: "instagram", label: "Instagram", color: "#E1306C", icon: "📸", placeholder: "https://instagram.com/yourhandle" },
  { id: "facebook", label: "Facebook", color: "#1877F2", icon: "👥", placeholder: "https://facebook.com/yourpage" },
  { id: "twitter", label: "X / Twitter", color: "#1DA1F2", icon: "🐦", placeholder: "https://x.com/yourhandle" },
  { id: "tiktok", label: "TikTok", color: "#FF0050", icon: "🎵", placeholder: "@yourhandle" },
  { id: "linkedin", label: "LinkedIn", color: "#0A66C2", icon: "💼", placeholder: "https://linkedin.com/in/yourprofile" },
  { id: "youtube", label: "YouTube", color: "#FF0000", icon: "▶️", placeholder: "https://youtube.com/@yourchannel" },
  { id: "hudl", label: "Hudl", color: "#F05A28", icon: "🎬", placeholder: "https://hudl.com/profile/yourprofile" },
];

// NIL doctrine: real Image is required. When absent at >=32px, render a
// neutral silhouette with "Identity pending" — never a colored initials bubble.
function Avatar({ src, name, size = "md" }: { src?: string | null; name?: string | null; size?: "sm" | "md" | "lg" }) {
  const mapped: NILAvatarSize = size === "sm" ? "sm" : size === "lg" ? "lg" : "md";
  return <NILAvatar src={src} name={name} size={mapped} />;
}

function FeedTab({ user }: { user: any }) {
  const [postText, setPostText] = useState("");
  const [postType, setPostType] = useState<"status" | "achievement" | "nil_deal" | "workout">("status");
  const utils = trpc.useUtils();
  const { data: feedData, isLoading } = trpc.feed.getFeed.useQuery({ limit: 20 });
  const createPost = trpc.feed.createPost.useMutation({
    onSuccess: () => { setPostText(""); utils.feed.getFeed.invalidate(); toast.success("Posted!"); },
  });
  const posts = feedData ?? [];
  const timeAgo = (date: Date) => {
    const s = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
    if (s < 60) return `${s}s`; if (s < 3600) return `${Math.floor(s / 60)}m`;
    if (s < 86400) return `${Math.floor(s / 3600)}h`; return `${Math.floor(s / 86400)}d`;
  };
  return (
    <div className="space-y-3">
      {user && (
        <div className="bg-[#1a3a8f] border border-blue-900 rounded-xl p-4">
          <div className="flex gap-3 mb-3">
            <Avatar src={user.avatarUrl} name={user.name} />
            <textarea value={postText} onChange={e => setPostText(e.target.value)}
              placeholder={`What's on your mind, ${user.name?.split(" ")[0] || "Athlete"}?`}
              rows={2} className="flex-1 bg-[#0d1f3c] border border-blue-800 text-white text-sm rounded-2xl px-4 py-2.5 focus:outline-none focus:border-blue-500 placeholder-blue-500 resize-none" />
          </div>
          <div className="flex items-center gap-2 pt-2 border-t border-blue-900/50">
            {[{ l: "📸 Photo", v: "achievement" }, { l: "🎬 Video", v: "workout" }, { l: "💰 NIL Deal", v: "nil_deal" }, { l: "🏆 Update", v: "status" }].map(b => (
              <button key={b.v} onClick={() => setPostType(b.v as any)}
                className={`text-xs font-semibold px-2 py-1.5 rounded-lg transition-colors ${postType === b.v ? "text-cyan-400 bg-blue-900/60" : "text-blue-400 hover:bg-blue-900/30"}`}>{b.l}</button>
            ))}
            <button onClick={() => postText.trim() && createPost.mutate({ content: postText, postType })}
              disabled={createPost.isPending || !postText.trim()}
              className="ml-auto bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-sm font-bold px-5 py-1.5 rounded-full">
              {createPost.isPending ? "Posting..." : "Post"}
            </button>
          </div>
        </div>
      )}
      {isLoading && [1, 2, 3].map(i => (
        <div key={i} className="bg-[#1a3a8f] border border-blue-900 rounded-xl p-4 animate-pulse">
          <div className="flex gap-3 mb-3"><div className="w-10 h-10 rounded-full bg-blue-800" /><div className="flex-1 space-y-2"><div className="h-4 bg-blue-800 rounded w-1/3" /><div className="h-3 bg-blue-800 rounded w-1/4" /></div></div>
          <div className="space-y-2"><div className="h-3 bg-blue-800 rounded" /><div className="h-3 bg-blue-800 rounded w-5/6" /></div>
        </div>
      ))}
      {!isLoading && (posts as any[]).length === 0 && (
        <div className="bg-[#1a3a8f] border border-blue-900 rounded-xl p-8 text-center">
          <div className="text-4xl mb-3">🏆</div>
          <div className="text-white font-bold mb-2">NIL Feed is Live</div>
          <div className="text-blue-400 text-sm">Share your NIL deals, highlights, and recruiting updates.</div>
        </div>
      )}
      {(posts as any[]).map((post: any) => (
        <div key={post.id} className="bg-[#1a3a8f] border border-blue-900 rounded-xl overflow-hidden">
          <div className="flex items-start gap-3 p-4 pb-2">
            <Avatar src={post.authorAvatar} name={post.authorName} />
            <div className="flex-1">
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-white text-sm">{post.authorName || "Athlete"}</span>
                <svg className="w-3.5 h-3.5 text-blue-400" fill="currentColor" viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/></svg>
              </div>
              <div className="text-blue-400 text-xs">{timeAgo(post.createdAt)} · 🌐</div>
            </div>
            <span className="text-[9px] font-black px-2 py-1 rounded-full text-white bg-blue-600">{post.postType?.toUpperCase() || "POST"}</span>
          </div>
          <div className="px-4 pb-3"><p className="text-blue-100 text-sm leading-relaxed">{post.content}</p></div>
          {post.mediaUrl && post.mediaType === "image" && <img src={post.mediaUrl} className="w-full max-h-64 object-cover" alt="" />}
          <div className="px-2 py-1 flex border-t border-blue-900">
            {[{ icon: "👍", label: "Like" }, { icon: "💬", label: "Comment" }, { icon: "↗️", label: "Share" }].map(a => (
              <button key={a.label} className="flex-1 flex items-center justify-center gap-1.5 py-2 text-sm font-semibold text-blue-400 hover:bg-blue-900/30 rounded-lg transition-colors">
                <span>{a.icon}</span>{a.label}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function MessengerTab({ user }: { user: any }) {
  const [activeConvoId, setActiveConvoId] = useState<number | null>(null);
  const [message, setMessage] = useState("");
  const [newConvoName, setNewConvoName] = useState("");
  const [showNew, setShowNew] = useState(false);
  const utils = trpc.useUtils();
  const { data: conversations = [] } = trpc.messenger.getConversations.useQuery(undefined, { enabled: !!user, refetchInterval: 10000 });
  const { data: messages = [] } = trpc.messenger.getMessages.useQuery({ conversationId: activeConvoId ?? 0 }, { enabled: !!user && !!activeConvoId });
  const sendMsg = trpc.messenger.sendMessage.useMutation({
    onSuccess: () => { setMessage(""); utils.messenger.getMessages.invalidate({ conversationId: activeConvoId ?? 0 }); utils.messenger.getConversations.invalidate(); },
  });
  const startConvo = trpc.messenger.startConversation.useMutation({
    onSuccess: (data: any) => { setShowNew(false); setNewConvoName(""); setActiveConvoId(data.conversationId); utils.messenger.getConversations.invalidate(); },
  });
  if (!user) return (
    <div className="text-center py-8">
      <div className="text-4xl mb-3">💬</div>
      <div className="text-white font-bold mb-2">Sign in to Message Athletes</div>
      <Link href="/signin" className="inline-block bg-blue-600 text-white font-bold px-6 py-2.5 rounded-xl">Sign In</Link>
    </div>
  );
  return (
    <div className="flex gap-3" style={{ height: "60vh" }}>
      <div className="w-1/3 bg-[#0d1f3c] rounded-xl border border-blue-900 overflow-hidden flex flex-col">
        <div className="p-3 border-b border-blue-900 flex items-center justify-between">
          <span className="text-white font-bold text-sm">Messages</span>
          <button onClick={() => setShowNew(true)} className="w-7 h-7 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold">+</button>
        </div>
        {showNew && (
          <div className="p-3 border-b border-blue-900">
            <input value={newConvoName} onChange={e => setNewConvoName(e.target.value)} placeholder="Athlete name..."
              className="w-full bg-[#1a3a8f] border border-blue-700 text-white text-xs rounded-lg px-3 py-2 focus:outline-none mb-2" />
            <div className="flex gap-2">
              <button onClick={() => newConvoName.trim() && startConvo.mutate({ recipientId: 1, initialMessage: `New conversation with: ${newConvoName}` })} className="flex-1 bg-blue-600 text-white text-xs font-bold py-1.5 rounded-lg">Start</button>
              <button onClick={() => setShowNew(false)} className="flex-1 border border-blue-700 text-blue-300 text-xs py-1.5 rounded-lg">Cancel</button>
            </div>
          </div>
        )}
        <div className="flex-1 overflow-y-auto">
          {(conversations as any[]).length === 0 && <div className="p-4 text-center text-blue-400 text-xs">No conversations yet.</div>}
          {(conversations as any[]).map((c: any) => (
            <button key={c.id} onClick={() => setActiveConvoId(c.id)}
              className={`w-full flex items-center gap-3 p-3 border-b border-blue-900/50 hover:bg-blue-900/30 transition-colors text-left ${activeConvoId === c.id ? "bg-blue-900/40" : ""}`}>
              <NILAvatar src={c.avatarUrl} name={c.name} size="md" />
              <div className="flex-1 min-w-0">
                <div className="text-white text-xs font-bold truncate">{c.name || "Conversation"}</div>
                <div className="text-blue-400 text-[10px] truncate">{c.lastMessage || "No messages yet"}</div>
              </div>
            </button>
          ))}
        </div>
      </div>
      <div className="flex-1 bg-[#0d1f3c] rounded-xl border border-blue-900 overflow-hidden flex flex-col">
        {!activeConvoId ? (
          <div className="flex-1 flex items-center justify-center text-blue-400 text-sm">Select a conversation to start messaging</div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {(messages as any[]).map((m: any) => (
                <div key={m.id} className={`flex gap-2 ${m.senderId === user.id ? "flex-row-reverse" : ""}`}>
                  <Avatar src={m.senderAvatar} name={m.senderName} size="sm" />
                  <div className={`max-w-xs px-3 py-2 rounded-2xl text-sm ${m.senderId === user.id ? "bg-blue-600 text-white" : "bg-[#1a3a8f] text-blue-100"}`}>{m.content}</div>
                </div>
              ))}
            </div>
            <div className="p-3 border-t border-blue-900 flex gap-2">
              <input value={message} onChange={e => setMessage(e.target.value)}
                onKeyDown={e => e.key === "Enter" && message.trim() && sendMsg.mutate({ conversationId: activeConvoId, content: message })}
                placeholder="Message..." className="flex-1 bg-[#1a3a8f] border border-blue-700 text-white text-sm rounded-full px-4 py-2 focus:outline-none focus:border-blue-500 placeholder-blue-500" />
              <button onClick={() => message.trim() && sendMsg.mutate({ conversationId: activeConvoId, content: message })}
                disabled={sendMsg.isPending || !message.trim()}
                className="w-9 h-9 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 rounded-full flex items-center justify-center shrink-0">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function SocialHubTab({ user }: { user: any }) {
  const { data: profile } = trpc.profile.getMyProfile.useQuery(undefined, { enabled: !!user });
  const [links, setLinks] = useState<Record<string, string>>({});
  const updateProfile = trpc.profile.updateProfile.useMutation({
    onSuccess: () => { toast.success("Social links saved! All platforms connected."); },
  });
  const handleSave = () => {
    updateProfile.mutate({
      instagram: links.instagram || (profile as any)?.instagram,
      twitter: links.twitter || (profile as any)?.twitter,
      facebookUrl: links.facebook || (profile as any)?.facebookUrl,
      youtubeUrl: links.youtube || (profile as any)?.youtubeUrl,
      linkedinUrl: links.linkedin || (profile as any)?.linkedinUrl,
      tiktokHandle: links.tiktok || (profile as any)?.tiktokHandle,
    });
  };
  return (
    <div className="space-y-4">
      <div className="bg-gradient-to-r from-[#1a3a8f] to-[#0d1f3c] border border-blue-700 rounded-xl p-4">
        <div className="flex items-center gap-3 mb-2">
          <div className="text-3xl">🌐</div>
          <div>
            <div className="text-white font-black text-lg">Social Command Center</div>
            <div className="text-blue-300 text-sm">Connect all your platforms. One hub. Total control.</div>
          </div>
        </div>
        <div className="text-blue-400 text-xs leading-relaxed">
          Link your Instagram, Facebook, X, TikTok, LinkedIn, and YouTube. AthlynX pulls your content in and lets you cross-post to all of them through approved publishing workflows — the reverse funnel that brings every platform back here.
        </div>
      </div>
      <div className="bg-[#1a3a8f] border border-blue-900 rounded-xl p-4 space-y-3">
        <div className="text-white font-bold text-sm mb-3">Your Social Profiles</div>
        {SOCIAL_PLATFORMS.map(p => {
          const currentVal = p.id === "instagram" ? (profile as any)?.instagram
            : p.id === "twitter" ? (profile as any)?.twitter
            : p.id === "facebook" ? (profile as any)?.facebookUrl
            : p.id === "youtube" ? (profile as any)?.youtubeUrl
            : p.id === "linkedin" ? (profile as any)?.linkedinUrl
            : p.id === "tiktok" ? (profile as any)?.tiktokHandle
            : (profile as any)?.hudlUrl;
          return (
            <div key={p.id} className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg shrink-0" style={{ background: p.color + "33", border: `1px solid ${p.color}44` }}>{p.icon}</div>
              <div className="flex-1">
                <div className="text-white text-xs font-bold mb-1">{p.label}</div>
                <input defaultValue={currentVal || ""} onChange={e => setLinks(l => ({ ...l, [p.id]: e.target.value }))}
                  placeholder={p.placeholder} className="w-full bg-[#0d1f3c] border border-blue-800 text-white text-xs rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500 placeholder-blue-600" />
              </div>
              {currentVal && (
                <a href={currentVal.startsWith("@") ? `https://tiktok.com/${currentVal}` : currentVal} target="_blank" rel="noopener noreferrer"
                  className="w-8 h-8 bg-blue-900 rounded-lg flex items-center justify-center text-blue-300 hover:text-white transition-colors shrink-0">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>
                </a>
              )}
            </div>
          );
        })}
        <button onClick={handleSave} disabled={updateProfile.isPending}
          className="w-full mt-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold py-3 rounded-xl transition-all disabled:opacity-50">
          {updateProfile.isPending ? "Saving..." : "Save & Connect All Platforms"}
        </button>
      </div>
      <div className="bg-[#1a3a8f] border border-blue-900 rounded-xl p-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="text-2xl">📡</div>
          <div>
            <div className="text-white font-bold text-sm">Cross-Post to All Platforms</div>
            <div className="text-blue-400 text-xs">Post once on AthlynX — goes to Instagram, Facebook, X, TikTok, LinkedIn simultaneously</div>
          </div>
        </div>
        <Link href="/social-command" className="block w-full text-center bg-blue-600 hover:bg-blue-500 text-white font-bold py-2.5 rounded-xl transition-colors text-sm">
          Open Social Command Center →
        </Link>
      </div>
      <div className="bg-[#1a3a8f] border border-blue-900 rounded-xl p-4">
        <div className="text-white font-bold text-sm mb-3">Connected Channels via Buffer</div>
        <div className="grid grid-cols-2 gap-2">
          {["Instagram (AthlynXAI)", "Facebook (AthlynX)", "X / Twitter", "LinkedIn", "TikTok (cdozier75)", "YouTube"].map(c => (
            <div key={c} className="flex items-center gap-2 bg-[#0d1f3c] rounded-lg p-2">
              <div className="w-2 h-2 bg-green-500 rounded-full shrink-0" />
              <div className="text-white text-xs font-semibold truncate">{c}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function DealsTab({ user }: { user: any }) {
  const [showAdd, setShowAdd] = useState(false);
  const [newDeal, setNewDeal] = useState({ brandName: "", dealValue: "", description: "", category: "Apparel" });
  const utils = trpc.useUtils();
  const { data: myDeals = [] } = trpc.nil.getMyDeals.useQuery(undefined, { enabled: !!user, retry: false });
  const createDeal = trpc.nil.createDeal.useMutation({
    onSuccess: () => { utils.nil.getMyDeals.invalidate(); setShowAdd(false); setNewDeal({ brandName: "", dealValue: "", description: "", category: "Apparel" }); toast.success("NIL Deal added!"); },
  });
  const totalValue = (myDeals as any[]).reduce((sum: number, d: any) => sum + (d.dealValue ?? 0), 0);
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-3">
        {[{ label: "Total NIL Value", value: `$${totalValue.toLocaleString()}`, color: "text-green-400" },
          { label: "Active Deals", value: String((myDeals as any[]).filter((d: any) => d.status === "active").length), color: "text-blue-400" },
          { label: "Total Deals", value: String((myDeals as any[]).length), color: "text-cyan-400" }].map((s, i) => (
          <div key={i} className="bg-[#1a3a8f] border border-blue-900 rounded-xl p-3 text-center">
            <div className={`text-xl font-black ${s.color}`}>{s.value}</div>
            <div className="text-blue-400 text-xs mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>
      {user && <button onClick={() => setShowAdd(!showAdd)} className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-2.5 rounded-xl text-sm transition-colors">+ Add NIL Deal</button>}
      {showAdd && (
        <div className="bg-[#1a3a8f] border border-blue-700 rounded-xl p-4 space-y-3">
          {[{ label: "Brand Name", key: "brandName", placeholder: "Nike, Gatorade..." },
            { label: "Deal Value ($)", key: "dealValue", placeholder: "5000" },
            { label: "Description", key: "description", placeholder: "What's the deal?" }].map(f => (
            <div key={f.key}>
              <label className="text-blue-400 text-xs mb-1 block">{f.label}</label>
              <input value={(newDeal as any)[f.key]} onChange={e => setNewDeal(p => ({ ...p, [f.key]: e.target.value }))}
                placeholder={f.placeholder} className="w-full bg-[#0d1f3c] border border-blue-800 text-white text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500 placeholder-blue-600" />
            </div>
          ))}
          <button onClick={() => createDeal.mutate({ brandName: newDeal.brandName, dealValue: parseFloat(newDeal.dealValue) || 0, description: newDeal.description, category: newDeal.category })}
            disabled={createDeal.isPending || !newDeal.brandName}
            className="w-full bg-green-600 hover:bg-green-500 disabled:opacity-50 text-white font-bold py-2.5 rounded-xl text-sm">
            {createDeal.isPending ? "Adding..." : "Add Deal"}
          </button>
        </div>
      )}
      {(myDeals as any[]).map((d: any) => (
        <div key={d.id} className="bg-[#1a3a8f] border border-blue-900 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="font-bold text-white">{d.brandName}</div>
            <span className={`text-xs font-bold px-2 py-1 rounded-full ${d.status === "active" ? "bg-green-900 text-green-400" : d.status === "pending" ? "bg-blue-900 text-sky-400" : "bg-gray-800 text-gray-400"}`}>{d.status?.toUpperCase()}</span>
          </div>
          <div className="text-green-400 font-black text-lg">${(d.dealValue ?? 0).toLocaleString()}</div>
          {d.description && <div className="text-blue-300 text-sm mt-1">{d.description}</div>}
        </div>
      ))}
      {(myDeals as any[]).length === 0 && (
        <div className="bg-[#1a3a8f] border border-blue-900 rounded-xl p-6 text-center">
          <div className="text-3xl mb-2">💰</div>
          <div className="text-white font-bold mb-1">No NIL Deals Yet</div>
          <div className="text-blue-400 text-sm">Add your first deal to start tracking your NIL value.</div>
        </div>
      )}
    </div>
  );
}

function NILPortalInner() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("feed");
  return (
    <PlatformLayout title="NIL Portal">
      <div className="space-y-4 pb-24 lg:pb-4">
        <div className="bg-gradient-to-r from-[#1a3a8f] to-[#1a2a4a] border border-blue-700 rounded-xl p-4">
          <div className="flex items-center gap-4">
            <img src="/logos/nil-portal-logo.png" alt="NIL Portal" className="w-12 h-12 rounded-2xl object-cover shadow-lg" onError={(e) => { (e.target as HTMLImageElement).src = "/athlynx-icon.png"; }} />
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black text-white">NIL PORTAL</h2>
                <span className="text-xs bg-green-600 text-white px-2 py-0.5 rounded-full font-bold">LIVE</span>
              </div>
              <p className="text-blue-300 text-xs">Feed · Messenger · NIL Deals · Social Hub · All Platforms Connected</p>
            </div>
            {user && <Avatar src={user.avatarUrl} name={user.name} />}
          </div>
        </div>
        <div className="relative -mx-2 px-2 sm:mx-0 sm:px-0">
          <div className="flex gap-1 bg-[#0d1f3c] border border-blue-900 rounded-xl p-1 overflow-x-auto overscroll-x-contain snap-x snap-mandatory [-webkit-overflow-scrolling:touch] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {TABS.map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className={`snap-start shrink-0 min-w-[92px] sm:flex-1 py-2 px-2 text-xs font-bold rounded-lg transition-colors whitespace-nowrap flex items-center justify-center gap-1 ${activeTab === tab.id ? "bg-blue-600 text-white" : "text-blue-400 hover:text-white"}`}>
                <span>{tab.icon}</span><span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </div>
          <div className="pointer-events-none absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-[#1a3a8f] to-transparent sm:hidden" aria-hidden="true" />
        </div>
        {activeTab === "feed" && <FeedTab user={user} />}
        {activeTab === "messenger" && <MessengerTab user={user} />}
        {activeTab === "deals" && <DealsTab user={user} />}
        {activeTab === "social" && <SocialHubTab user={user} />}
        {activeTab === "vault" && (
          <div className="bg-[#1a3a8f] border border-blue-900 rounded-xl p-6 text-center">
            <div className="text-4xl mb-3">🔐</div>
            <div className="text-white font-black text-lg mb-2">NIL Vault</div>
            <div className="text-blue-400 text-sm mb-4">Secure storage for your NIL contracts, agreements, and documents.</div>
            <Link href="/nil-vault" className="inline-block bg-blue-600 hover:bg-blue-500 text-white font-bold px-6 py-2.5 rounded-xl">Open NIL Vault →</Link>
          </div>
        )}
      </div>
    </PlatformLayout>
  );
}

export default function NILPortal() {
  return <RouteErrorBoundary><NILPortalInner /></RouteErrorBoundary>;
}
