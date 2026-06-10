import { useState, useRef, useEffect } from "react";
import { RouteErrorBoundary } from "@/components/GlobalErrorBoundary";
import PlatformLayout from "@/components/PlatformLayout";
import MobileBottomNav from '@/components/MobileBottomNav'
import { Link, useLocation } from "wouter";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  createdAt?: string;
}

const QUICK_PROMPTS = [
  "Build me a 4-week training plan for my sport",
  "What should I eat before a big game?",
  "How do I improve my 40-yard dash speed?",
  "Review my NIL deal offer — is it fair?",
  "Help me write an email to a college coach",
  "I'm feeling burned out. What should I do?",
  "How do I enter the transfer portal?",
  "Create a social media content plan for this week",
];

function AITrainingBotInner() {
  const meQuery = trpc.auth.me.useQuery(undefined, { retry: false, refetchOnWindowFocus: false });
  const historyQuery = trpc.ai.trainerHistory.useQuery(undefined, { retry: false, refetchOnWindowFocus: false });
  const [, navigate] = useLocation();
  const [input, setInput] = useState("");
  const [localMessages, setLocalMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (historyQuery.data?.messages && historyQuery.data.messages.length > 0) {
      setLocalMessages(
        historyQuery.data.messages.map((m: any) => ({
          role: m.role as "user" | "assistant",
          content: m.content,
          createdAt: m.createdAt?.toString(),
        }))
      );
    }
  }, [historyQuery.data]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [localMessages, isTyping]);

  const chatMutation = trpc.ai.trainerChat.useMutation({
    onSuccess: (data) => {
      setIsTyping(false);
      setLocalMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.reply, createdAt: new Date().toISOString() },
      ]);
    },
    onError: (err) => {
      setIsTyping(false);
      toast.error(err.message || "Your trainer is unavailable right now. Try again.");
    },
  });

  const clearMutation = trpc.ai.trainerClear.useMutation({
    onSuccess: () => {
      setLocalMessages([]);
      toast.success("Conversation cleared. Fresh start!");
    },
  });

  const handleSend = () => {
    if (!meQuery.data) { navigate("/signin"); return; }
    const msg = input.trim();
    if (!msg) return;
    setInput("");
    setLocalMessages((prev) => [
      ...prev,
      { role: "user", content: msg, createdAt: new Date().toISOString() },
    ]);
    setIsTyping(true);
    chatMutation.mutate({ message: msg });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (meQuery.isLoading || historyQuery.isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0a0a1a] via-[#0d1b2a] to-[#0f3460] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-cyan-400 font-semibold">Loading your AI Trainer...</p>
        </div>
      </div>
    );
  }

  if (!meQuery.data) { navigate("/signin"); return null; }

  const user = meQuery.data;
  const isFirstVisit = localMessages.length === 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a1a] via-[#0d1b2a] to-[#0f3460] flex flex-col">
      <header className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-xl border-b border-white/10">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/portal" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
              <span className="text-white font-black text-sm">AI</span>
            </div>
            <div>
              <div className="text-white font-black text-sm leading-none">AthlynXAI</div>
              <div className="text-cyan-400 text-xs leading-none">Personal Trainer Bot</div>
            </div>
          </Link>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 bg-cyan-500/10 border border-cyan-500/30 px-3 py-1.5 rounded-full">
              <span className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
              <span className="text-cyan-400 text-xs font-semibold">Online</span>
            </div>
            {localMessages.length > 0 && (
              <button
                onClick={() => clearMutation.mutate()}
                className="text-gray-500 hover:text-red-400 text-xs transition-colors px-2 py-1 rounded"
              >
                Clear Chat
              </button>
            )}
            <Link href="/portal" className="text-gray-400 hover:text-white text-sm transition-colors">
              Back
            </Link>
          </div>
        </div>
      </header>

      <div className="flex-1 pt-20 pb-36 overflow-y-auto">
        <div className="container mx-auto max-w-3xl px-4">
          {isFirstVisit && (
            <div className="py-12 text-center">
              <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-cyan-500/30">
                <span className="text-4xl">🤖</span>
              </div>
              <h1 className="text-3xl font-black text-white mb-3">Your Personal AI Trainer</h1>
              <p className="text-gray-400 text-lg mb-2">
                I'm your dedicated AthlynXAI coach — built exclusively for you.
              </p>
              <p className="text-gray-500 text-sm mb-10">
                I remember every conversation and know your profile. Ask me anything.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left max-w-2xl mx-auto">
                {QUICK_PROMPTS.map((prompt) => (
                  <button
                    key={prompt}
                    onClick={() => { setInput(prompt); inputRef.current?.focus(); }}
                    className="p-4 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-cyan-500/40 rounded-xl text-left text-sm text-gray-300 hover:text-white transition-all"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-4 py-4">
            {localMessages.map((msg, i) => (
              <div key={i} className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
                <div className={`flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold
                  ${msg.role === "user" ? "bg-gradient-to-br from-blue-600 to-blue-800 text-white" : "bg-gradient-to-br from-cyan-500 to-blue-600 text-white"}`}>
                  {msg.role === "user" ? (user.name?.[0]?.toUpperCase() ?? "A") : "AI"}
                </div>
                <div className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap
                  ${msg.role === "user" ? "bg-blue-600 text-white rounded-tr-sm" : "bg-white/8 border border-white/10 text-gray-100 rounded-tl-sm"}`}>
                  {msg.content}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-sm font-bold text-white">AI</div>
                <div className="bg-white/8 border border-white/10 px-4 py-3 rounded-2xl rounded-tl-sm flex items-center gap-1.5">
                  <span className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-black/90 backdrop-blur-xl border-t border-white/10 p-4">
        <div className="container mx-auto max-w-3xl">
          <div className="flex gap-3 items-end">
            <div className="flex-1 bg-white/8 border border-white/15 rounded-2xl overflow-hidden focus-within:border-cyan-500/60 transition-colors">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask your trainer anything... (Enter to send)"
                rows={1}
                className="w-full px-4 py-3 bg-transparent text-white placeholder-gray-500 focus:outline-none resize-none text-sm"
                style={{ maxHeight: "120px" }}
                onInput={(e) => {
                  const target = e.target as HTMLTextAreaElement;
                  target.style.height = "auto";
                  target.style.height = Math.min(target.scrollHeight, 120) + "px";
                }}
              />
            </div>
            <button
              onClick={handleSend}
              disabled={chatMutation.isPending || !input.trim()}
              className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center hover:opacity-90 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0 shadow-lg shadow-cyan-500/30"
            >
              {chatMutation.isPending ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              )}
            </button>
          </div>
          <p className="text-center text-gray-600 text-xs mt-2">
            3 credits per message · {(user as any).credits ?? 0} credits remaining
          </p>
        </div>
      </div>
    <MobileBottomNav />
    </div>
  );
}

export default function AITrainingBot() {
  return <RouteErrorBoundary><AITrainingBotInner /></RouteErrorBoundary>;
}
