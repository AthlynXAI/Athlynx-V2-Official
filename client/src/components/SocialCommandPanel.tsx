/**
 * SocialCommandPanel — AthlynXAI
 * Permanent social media posting from the admin panel
 * Posts to: Facebook, Instagram, X/Twitter, LinkedIn, Buffer
 * All tokens stored in Vercel env vars — permanent, never expires
 * No AthlynXAI. No Buffer UI. No manual steps. The platform posts itself.
 */
import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Send, Zap, CheckCircle, XCircle, Loader2, RefreshCw } from "lucide-react";
import { toast } from "sonner";

const PLATFORMS = [
  { id: "facebook", label: "Facebook (AthlynX Page)", icon: "👥", color: "text-blue-400" },
  { id: "instagram", label: "Instagram (@chad_dozier / @chaddozier14)", icon: "📸", color: "text-pink-400" },
  { id: "twitter", label: "X / Twitter (@ChadADozier2)", icon: "🐦", color: "text-sky-400" },
  { id: "linkedin", label: "LinkedIn", icon: "💼", color: "text-blue-300" },
  { id: "buffer_linkedin", label: "Buffer → LinkedIn (backup)", icon: "🔄", color: "text-green-400" },
  { id: "buffer_twitter", label: "Buffer → X/Twitter (backup)", icon: "🔄", color: "text-green-400" },
] as const;

type PlatformId = typeof PLATFORMS[number]["id"];

const QUICK_TOPICS = [
  "AthlynXAI SportXHub launch — every sport worldwide",
  "AI X-Factor Score — powered by Nebius H200 GPUs",
  "NIL deals for every sport on AthlynXAI",
  "Transfer Portal — find your next school",
  "Meet new athletes worldwide on AthlynXAI",
  "7-day free trial — card required, not charged until day 8",
];

export default function SocialCommandPanel() {
  const [message, setMessage] = useState("");
  const [topic, setTopic] = useState("");
  const [tone, setTone] = useState<"professional" | "hype" | "motivational" | "educational">("motivational");
  const [selectedPlatforms, setSelectedPlatforms] = useState<PlatformId[]>(["buffer_linkedin", "buffer_twitter"]);
  const [postResult, setPostResult] = useState<any>(null);
  const [mode, setMode] = useState<"manual" | "ai">("manual");

  const tokenStatus = trpc.autoPost.getTokenStatus.useQuery(undefined, { retry: false });

  const postToAll = trpc.autoPost.postToAll.useMutation({
    onSuccess: (data) => {
      setPostResult(data);
      if (data.success) toast.success(data.summary);
      else toast.error("Some posts failed — check results below");
    },
    onError: (e) => toast.error(e.message),
  });

  const generateAndPost = trpc.autoPost.generateAndPost.useMutation({
    onSuccess: (data) => {
      setPostResult(data);
      setMessage(data.generatedMessage || "");
      if (data.success) toast.success(`AI generated + posted: ${data.summary}`);
      else toast.error("Some posts failed — check results below");
    },
    onError: (e) => toast.error(e.message),
  });

  const togglePlatform = (id: PlatformId) => {
    setSelectedPlatforms(prev =>
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
  };

  const handlePost = () => {
    if (mode === "ai") {
      if (!topic) { toast.error("Enter a topic for AI to write about"); return; }
      generateAndPost.mutate({ topic, tone, platforms: selectedPlatforms });
    } else {
      if (!message.trim()) { toast.error("Enter a message to post"); return; }
      postToAll.mutate({ message, platforms: selectedPlatforms });
    }
  };

  const isPending = postToAll.isPending || generateAndPost.isPending;
  const tokens = tokenStatus.data?.tokens || {};

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-950/40 to-slate-900/60 border border-blue-800/30 rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-2">
          <Send className="w-6 h-6 text-blue-400" />
          <h2 className="text-xl font-black text-white">Social Command Center</h2>
          <span className="text-xs bg-green-900/40 text-green-400 border border-green-800/40 px-2 py-0.5 rounded-full font-bold">Permanent · Vercel</span>
        </div>
        <p className="text-slate-400 text-sm">Post to all channels directly from the platform. No Buffer UI. No AthlynXAI. Tokens live in Vercel forever.</p>
      </div>

      {/* Token Status */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4">
        <h3 className="text-white font-black text-sm mb-3 flex items-center gap-2">
          <RefreshCw className="w-4 h-4 text-slate-400" />
          Platform Token Status
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {Object.entries(tokens).map(([key, status]) => (
            <div key={key} className="flex items-center gap-2 text-xs">
              {String(status).includes("✅") ? (
                <CheckCircle className="w-3.5 h-3.5 text-green-400 flex-shrink-0" />
              ) : (
                <XCircle className="w-3.5 h-3.5 text-red-400 flex-shrink-0" />
              )}
              <span className={String(status).includes("✅") ? "text-slate-300" : "text-slate-500"}>
                {key.replace(/_/g, " ")}
              </span>
            </div>
          ))}
        </div>
        <p className="text-slate-600 text-xs mt-2">Add missing tokens to Vercel env vars to enable those platforms permanently.</p>
      </div>

      {/* Mode Toggle */}
      <div className="flex gap-2">
        {[{ id: "manual", label: "✍️ Write Post" }, { id: "ai", label: "🤖 AI Generate + Post" }].map(m => (
          <button
            key={m.id}
            onClick={() => setMode(m.id as typeof mode)}
            className={`text-sm font-bold px-4 py-2 rounded-full border transition-all ${
              mode === m.id
                ? "bg-blue-600 text-white border-blue-500"
                : "bg-slate-900 text-slate-400 border-slate-700 hover:text-white"
            }`}
          >
            {m.label}
          </button>
        ))}
      </div>

      {/* Message / Topic Input */}
      {mode === "manual" ? (
        <div>
          <label className="text-slate-400 text-xs font-bold uppercase tracking-wider block mb-2">Post Message</label>
          <textarea
            value={message}
            onChange={e => setMessage(e.target.value)}
            placeholder="Write your post here... (Twitter auto-truncates to 280 chars)"
            rows={4}
            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-blue-500 resize-none placeholder-slate-600"
          />
          <div className="flex justify-between text-xs text-slate-600 mt-1">
            <span>{message.length} chars</span>
            <span>Twitter max: 280 · Instagram max: 2,200 · LinkedIn max: 3,000</span>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <div>
            <label className="text-slate-400 text-xs font-bold uppercase tracking-wider block mb-2">Topic for AI to Write About</label>
            <input
              value={topic}
              onChange={e => setTopic(e.target.value)}
              placeholder="e.g. AthlynXAI SportXHub launch — every sport worldwide"
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-blue-500 placeholder-slate-600"
            />
          </div>
          {/* Quick Topics */}
          <div className="flex flex-wrap gap-2">
            {QUICK_TOPICS.map(t => (
              <button
                key={t}
                onClick={() => setTopic(t)}
                className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white border border-slate-700 px-3 py-1.5 rounded-full transition-colors"
              >
                {t.slice(0, 40)}...
              </button>
            ))}
          </div>
          <div>
            <label className="text-slate-400 text-xs font-bold uppercase tracking-wider block mb-2">Tone</label>
            <div className="flex gap-2 flex-wrap">
              {(["professional", "hype", "motivational", "educational"] as const).map(t => (
                <button
                  key={t}
                  onClick={() => setTone(t)}
                  className={`text-xs font-bold px-3 py-1.5 rounded-full border transition-all capitalize ${
                    tone === t ? "bg-blue-600 text-white border-blue-500" : "bg-slate-900 text-slate-400 border-slate-700"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Platform Selection */}
      <div>
        <label className="text-slate-400 text-xs font-bold uppercase tracking-wider block mb-2">Post To</label>
        <div className="space-y-2">
          {PLATFORMS.map(p => (
            <label key={p.id} className="flex items-center gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={selectedPlatforms.includes(p.id)}
                onChange={() => togglePlatform(p.id)}
                className="w-4 h-4 rounded accent-blue-500"
              />
              <span className="text-lg">{p.icon}</span>
              <span className={`text-sm font-bold ${selectedPlatforms.includes(p.id) ? "text-white" : "text-slate-500"} group-hover:text-white transition-colors`}>
                {p.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Post Button */}
      <button
        onClick={handlePost}
        disabled={isPending || selectedPlatforms.length === 0}
        className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-black py-4 rounded-2xl text-lg transition-all flex items-center justify-center gap-3"
      >
        {isPending ? (
          <><Loader2 className="w-5 h-5 animate-spin" /> Posting to {selectedPlatforms.length} platform{selectedPlatforms.length !== 1 ? "s" : ""}...</>
        ) : mode === "ai" ? (
          <><Zap className="w-5 h-5" /> AI Generate + Post to {selectedPlatforms.length} Platform{selectedPlatforms.length !== 1 ? "s" : ""}</>
        ) : (
          <><Send className="w-5 h-5" /> Post to {selectedPlatforms.length} Platform{selectedPlatforms.length !== 1 ? "s" : ""}</>
        )}
      </button>

      {/* Results */}
      {postResult && (
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-3">
            {postResult.success ? (
              <CheckCircle className="w-5 h-5 text-green-400" />
            ) : (
              <XCircle className="w-5 h-5 text-red-400" />
            )}
            <div className="text-white font-black">{postResult.summary}</div>
          </div>

          {postResult.generatedMessage && (
            <div className="bg-slate-800/60 rounded-xl p-3 mb-3">
              <div className="text-slate-400 text-xs font-bold uppercase mb-1">AI Generated Post</div>
              <div className="text-white text-sm whitespace-pre-wrap">{postResult.generatedMessage}</div>
            </div>
          )}

          <div className="space-y-2">
            {Object.entries(postResult.results || {}).map(([platform, result]: [string, any]) => (
              <div key={platform} className="flex items-center justify-between text-sm">
                <span className="text-slate-300 capitalize">{platform.replace(/_/g, " ")}</span>
                <div className="flex items-center gap-2">
                  {result.success ? (
                    <span className="text-green-400 font-bold flex items-center gap-1">
                      <CheckCircle className="w-3.5 h-3.5" /> Posted
                    </span>
                  ) : (
                    <span className="text-red-400 text-xs">{result.error || "Failed"}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
