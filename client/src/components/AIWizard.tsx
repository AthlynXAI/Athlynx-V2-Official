/**
 * AthlynXAI Wizard
 * ─────────────────────────────────────────────────────────────────────────────
 * A persistent, floating AI assistant that lives on every page of the platform.
 * Context-aware, tier-aware, and family-aware — it knows where the user is,
 * what career tier they're in, and who came before them in their family.
 *
 * Career Tiers (Birth → Death):
 *   1. Youth          — Ages 5–13  (Little League, Pop Warner, AAU)
 *   2. High School    — Ages 14–18 (Varsity, Recruiting begins)
 *   3. College        — Ages 18–23 (D1/D2/D3, NIL, Transfer Portal)
 *   4. Transfer Portal— Active portal entry (school change window)
 *   5. Professional   — Drafted / signed pro contract
 *   6. Post-Career    — Retired athlete (coaching, broadcasting, business)
 *   7. Legacy         — Generational — parent/grandparent of active athlete
 *
 * Generational linking: When a child signs up, the system checks if a parent
 * or grandparent already has an AthlynX account and pre-loads their athletic
 * history as context for the AI Trainer.
 */

import { useState, useRef, useEffect } from "react";
import { useLocation } from "wouter";
import { MessageCircle, X, ChevronDown, Sparkles, Trophy, Zap, Star, Users, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";

// ─── Career Tier Definitions ─────────────────────────────────────────────────
export const CAREER_TIERS = [
  {
    id: "youth",
    label: "Youth Athlete",
    emoji: "Y",
    ageRange: "Ages 5–13",
    color: "from-green-500 to-emerald-400",
    glow: "rgba(16,185,129,0.4)",
    description: "Little League, Pop Warner, AAU — the foundation of greatness.",
    unlocks: ["Basic profile", "Sport tracking", "Parent dashboard", "Youth coaching network"],
    nextTier: "high_school",
  },
  {
    id: "high_school",
    label: "High School Athlete",
    emoji: "HS",
    ageRange: "Ages 14–18",
    color: "from-blue-500 to-cyan-400",
    glow: "rgba(59,130,246,0.4)",
    description: "Varsity level. Coaches are watching. Your recruiting journey starts now.",
    unlocks: ["Recruiting profile", "Coach connections", "Highlight reel hosting", "Academic tracker", "NIL prep"],
    nextTier: "college",
  },
  {
    id: "college",
    label: "College Athlete",
    emoji: "COL",
    ageRange: "Ages 18–23",
    color: "from-purple-500 to-violet-400",
    glow: "rgba(139,92,246,0.4)",
    description: "D1, D2, D3 — you made it. Now maximize your NIL and build your brand.",
    unlocks: ["NIL deal matching", "Brand partnerships", "Transfer Portal access", "Agent marketplace", "Performance analytics"],
    nextTier: "transfer_portal",
  },
  {
    id: "transfer_portal",
    label: "Transfer Portal",
    emoji: "TP",
    ageRange: "Active window",
    color: "from-cyan-500 to-blue-400",
    glow: "rgba(249,115,22,0.4)",
    description: "In the portal. Every school is watching. Make the right move.",
    unlocks: ["Portal visibility boost", "School comparison tool", "NIL deal negotiation", "Coach direct messaging", "Transfer timeline tracker"],
    nextTier: "professional",
  },
  {
    id: "professional",
    label: "Professional Athlete",
    emoji: "PRO",
    ageRange: "Pro contract active",
    color: "from-blue-500 to-blue-400",
    glow: "rgba(234,179,8,0.5)",
    description: "You went pro. Now protect your career, your money, and your legacy.",
    unlocks: ["Agent & contract tools", "Wealth management", "Brand empire builder", "Media & PR suite", "Performance longevity AI"],
    nextTier: "post_career",
  },
  {
    id: "post_career",
    label: "Post-Career",
    emoji: "PC",
    ageRange: "Retired athlete",
    color: "from-pink-500 to-rose-400",
    glow: "rgba(236,72,153,0.4)",
    description: "The game ends. Your impact doesn't. Coach, broadcast, build, inspire.",
    unlocks: ["Coaching certification", "Broadcasting tools", "Business incubator", "Speaking platform", "Mentorship network"],
    nextTier: "legacy",
  },
  {
    id: "legacy",
    label: "Legacy Member",
    emoji: "LEG",
    ageRange: "Generational",
    color: "from-cyan-500-500 to-blue-300",
    glow: "rgba(251,191,36,0.6)",
    description: "Your bloodline is athletic royalty. Your children inherit your data, your network, your legend.",
    unlocks: ["Family dynasty dashboard", "Generational data vault", "Legacy NIL deals", "Children's head start profile", "Hall of Fame nomination"],
    nextTier: null,
  },
] as const;

export type CareerTierId = typeof CAREER_TIERS[number]["id"];

// ─── Page-specific AI context ─────────────────────────────────────────────────
const PAGE_CONTEXT: Record<string, { title: string; tips: string[] }> = {
  "/": {
    title: "Welcome to AthlynX",
    tips: [
      "Start by completing your athlete profile — it takes 2 minutes.",
      "Your AI Trainer is ready to guide you from day one.",
      "Connect your family members to unlock generational tracking.",
    ],
  },
  "/dashboard": {
    title: "Your Performance Hub",
    tips: [
      "Check your Performance Score — it updates in real time.",
      "Your Velocity Index shows recruiting momentum this week.",
      "Coaches viewed your profile 3 times this week — follow up!",
    ],
  },
  "/nil-vault": {
    title: "NIL Vault",
    tips: [
      "Your NIL value increases with every verified stat you add.",
      "Brands are searching for athletes in your sport right now.",
      "Upload your highlight reel to unlock premium deal matching.",
    ],
  },
  "/transfer-portal": {
    title: "Transfer Portal",
    tips: [
      "Being in the portal increases your visibility by 10x.",
      "Set your target schools and I'll alert you when coaches view your profile.",
      "Your NIL value follows you — don't leave money on the table.",
    ],
  },
  "/community": {
    title: "Athlete Community",
    tips: [
      "Connect with athletes at your level and position.",
      "Share your recruiting timeline — others can learn from your journey.",
      "The most connected athletes get the most opportunities.",
    ],
  },
  "/platform": {
    title: "Platform Overview",
    tips: [
      "Every app on this platform was built for your career stage.",
      "Your AI Trainer unlocks new tools as you advance through tiers.",
      "Invite your teammates — group accounts get premium features.",
    ],
  },
  "/ai-recruiter": {
    title: "AI Recruiter",
    tips: [
      "The AI Recruiter scans 10,000+ college programs for your fit.",
      "Update your stats weekly to get better matches.",
      "Your academic profile matters — add your GPA and test scores.",
    ],
  },
  "/diamond-grind": {
    title: "Diamond Grind",
    tips: [
      "Log your workouts to track your performance trajectory.",
      "Your combine numbers are your currency — keep them current.",
      "Elite athletes train 365 days a year. Track every session.",
    ],
  },
  "/nil-portal": {
    title: "NIL Portal",
    tips: [
      "Your NIL rights are yours from day one of college.",
      "Brands want authentic athletes — your story is your value.",
      "Set your rates and let the deals come to you.",
    ],
  },
  "/messenger": {
    title: "Athlete Messenger",
    tips: [
      "Direct line to coaches, agents, and brands.",
      "Keep all your recruiting conversations in one place.",
      "Response time matters — coaches notice who replies fast.",
    ],
  },
  "/analytics": {
    title: "Performance Analytics",
    tips: [
      "Your data tells your story better than any highlight reel.",
      "Track your progress against athletes at your position nationally.",
      "Share your analytics dashboard with coaches directly.",
    ],
  },
};

// ─── Component ────────────────────────────────────────────────────────────────
interface AIWizardProps {
  currentTier?: CareerTierId;
  userName?: string;
  familyLegacy?: {
    parentName?: string;
    parentSport?: string;
    parentTier?: string;
    grandparentName?: string;
  };
}

export default function AIWizard({
  currentTier = "high_school",
  userName = "Athlete",
  familyLegacy,
}: AIWizardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"chat" | "tier" | "family">("chat");
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState<{ role: "ai" | "user"; text: string }[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [location] = useLocation();
  const inputRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();

  // Real Gemini AI via tRPC trainerChat
  const trainerChatMutation = trpc.ai.trainerChat.useMutation({
    onSuccess: (data: any) => {
      setIsTyping(false);
      setChatHistory(prev => [...prev, { role: "ai", text: data.reply || data.message || "I'm here to help!" }]);
    },
    onError: () => {
      setIsTyping(false);
      const fallback = pageCtx?.tips?.[Math.floor(Math.random() * (pageCtx.tips?.length || 1))] || "I'm here to help with your athletic journey!";
      setChatHistory(prev => [...prev, { role: "ai", text: fallback }]);
    },
  });

  const tier = CAREER_TIERS.find(t => t.id === currentTier) ?? CAREER_TIERS[1];
  const nextTier = CAREER_TIERS.find(t => t.id === tier.nextTier);
  const pageCtx = PAGE_CONTEXT[location] ?? PAGE_CONTEXT["/"];
  const hideOnRoutes = ["/", "/signin", "/signup", "/login", "/forgot-password", "/callback", "/auth/callback", "/welcome"];
  const shouldHideForRoute = hideOnRoutes.some((path) => location === path || location.startsWith(`${path}/`));
  const shouldHide = !user || shouldHideForRoute;

  // Auto-scroll chat
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory, isTyping]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen && activeTab === "chat") {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen, activeTab]);

  // Initial greeting
  useEffect(() => {
    if (isOpen && chatHistory.length === 0) {
      const greeting = familyLegacy?.parentName
        ? `Welcome back, ${userName}! I see your parent ${familyLegacy.parentName} was a ${familyLegacy.parentSport} athlete. You've got legacy in your DNA. ${pageCtx.tips[0]}`
        : `Hey ${userName}! I'm your AI Trainer. ${pageCtx.tips[0]}`;
      setChatHistory([{ role: "ai", text: greeting }]);
    }
  }, [isOpen]);

   const sendMessage = async () => {
    if (!message.trim() || trainerChatMutation.isPending) return;
    const userMsg = message.trim();
    setMessage("");
    setChatHistory(prev => [...prev, { role: "user", text: userMsg }]);
    setIsTyping(true);

    if (user) {
      // Private AI-assisted trainer flow
      trainerChatMutation.mutate({ message: userMsg });
    } else {
      // Not logged in — prompt to sign in
      await new Promise(r => setTimeout(r, 500));
      setIsTyping(false);
      setChatHistory(prev => [...prev, {
        role: "ai",
        text: `Sign in to unlock your personal AI Trainer. I can help you with recruiting, NIL deals, training, and your entire athletic career.`,
      }]);
    }
  };

  if (shouldHide) return null;

  return (
    <>
      {/* Floating trigger button */}
      <button
        onClick={() => setIsOpen(true)}
        className={cn(
          "fixed bottom-[calc(92px+env(safe-area-inset-bottom,0px))] right-4 z-40 flex items-center gap-2 px-4 py-3 rounded-2xl sm:bottom-6",
          "bg-gradient-to-r", tier.color,
          "text-white font-black text-sm shadow-2xl",
          `shadow-[0_0_24px_${tier.glow}]`,
          "hover:scale-105 active:scale-95 transition-all duration-200",
          isOpen && "hidden"
        )}
        style={{ boxShadow: `0 0 24px ${tier.glow}, 0 4px 16px rgba(0,0,0,0.5)` }}
      >
        <Sparkles className="w-4 h-4" />
        <span>AI Trainer</span>
        <span className="text-base">{tier.emoji}</span>
      </button>

      {/* Wizard panel */}
      {isOpen && (
        <div className="fixed bottom-[calc(92px+env(safe-area-inset-bottom,0px))] right-4 z-40 w-[360px] max-w-[calc(100vw-2rem)] rounded-3xl overflow-hidden shadow-2xl border border-blue-800/50 sm:bottom-4"
          style={{ boxShadow: `0 0 40px ${tier.glow}, 0 8px 32px rgba(0,0,0,0.8)` }}>

          {/* Header */}
          <div className={cn("bg-gradient-to-r p-4 flex items-center justify-between", tier.color)}>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-lg">
                {tier.emoji}
              </div>
              <div>
                <div className="text-white font-black text-sm">AI Trainer</div>
                <div className="text-white/80 text-xs">{tier.label} · {tier.ageRange}</div>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)}
              className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors">
              <X className="w-4 h-4 text-white" />
            </button>
          </div>

          {/* Tabs */}
          <div className="bg-[#050d1f] flex border-b border-blue-900/50">
            {[
              { id: "chat" as const, label: "Chat", icon: MessageCircle },
              { id: "tier" as const, label: "My Tier", icon: Trophy },
              { id: "family" as const, label: "Legacy", icon: Users },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-bold transition-all",
                  activeTab === tab.id
                    ? "text-white border-b-2 border-blue-400"
                    : "text-blue-400/60 hover:text-blue-300"
                )}
              >
                <tab.icon className="w-3.5 h-3.5" />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Chat tab */}
          {activeTab === "chat" && (
            <div className="bg-[#050d1f] flex flex-col" style={{ height: 320 }}>
              <div className="flex-1 overflow-y-auto p-3 space-y-2">
                {/* Page context tip */}
                <div className="bg-blue-900/20 border border-blue-800/30 rounded-xl p-2.5 mb-2">
                  <div className="text-blue-300 text-xs font-bold mb-1 flex items-center gap-1">
                    <Zap className="w-3 h-3" /> {pageCtx.title}
                  </div>
                  <div className="text-blue-200/70 text-xs">{pageCtx.tips[0]}</div>
                </div>

                {chatHistory.map((msg, i) => (
                  <div key={i} className={cn("flex", msg.role === "user" ? "justify-end" : "justify-start")}>
                    {msg.role === "ai" && (
                      <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-xs mr-1.5 mt-0.5 shrink-0">
                        {tier.emoji}
                      </div>
                    )}
                    <div className={cn(
                      "max-w-[80%] rounded-2xl px-3 py-2 text-xs leading-relaxed",
                      msg.role === "ai"
                        ? "bg-[#0d1a3a] border border-blue-800/40 text-blue-100 rounded-tl-sm"
                        : "bg-blue-600 text-white rounded-tr-sm"
                    )}>
                      {msg.text}
                    </div>
                  </div>
                ))}

                {isTyping && (
                  <div className="flex items-center gap-1.5">
                    <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-xs shrink-0">
                      {tier.emoji}
                    </div>
                    <div className="bg-[#0d1a3a] border border-blue-800/40 rounded-2xl rounded-tl-sm px-3 py-2">
                      <div className="flex gap-1">
                        {[0, 1, 2].map(i => (
                          <div key={i} className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce"
                            style={{ animationDelay: `${i * 0.15}s` }} />
                        ))}
                      </div>
                    </div>
                  </div>
                )}
                <div ref={bottomRef} />
              </div>

              {/* Input */}
              <div className="p-3 border-t border-blue-900/40 flex gap-2">
                <input
                  ref={inputRef}
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && sendMessage()}
                  placeholder="Ask your AI Trainer..."
                  className="flex-1 bg-[#0a1628] border border-blue-700/60 text-white placeholder:text-blue-400/50 rounded-xl px-3 py-2 text-xs outline-none focus:border-blue-400 focus:shadow-[0_0_0_2px_rgba(59,130,246,0.3)] caret-blue-400 transition-all"
                />
                <button
                  onClick={sendMessage}
                  disabled={!message.trim()}
                  className={cn(
                    "w-8 h-8 rounded-xl flex items-center justify-center transition-all shrink-0",
                    "bg-gradient-to-r", tier.color,
                    "disabled:opacity-40 hover:scale-105 active:scale-95"
                  )}
                >
                  <ArrowUpRight className="w-4 h-4 text-white" />
                </button>
              </div>
            </div>
          )}

          {/* Tier tab */}
          {activeTab === "tier" && (
            <div className="bg-[#050d1f] p-4 overflow-y-auto" style={{ height: 320 }}>
              <div className={cn("rounded-2xl p-4 mb-3 bg-gradient-to-br", tier.color, "bg-opacity-20")}>
                <div className="text-3xl mb-1">{tier.emoji}</div>
                <div className="text-white font-black text-lg">{tier.label}</div>
                <div className="text-white/70 text-xs mt-1">{tier.description}</div>
              </div>

              <div className="mb-3">
                <div className="text-blue-300 text-xs font-bold mb-2 flex items-center gap-1">
                  <Star className="w-3 h-3" /> UNLOCKED FEATURES
                </div>
                <div className="space-y-1.5">
                  {tier.unlocks.map((feature, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-blue-100">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0" />
                      {feature}
                    </div>
                  ))}
                </div>
              </div>

              {nextTier && (
                <div className="bg-[#0a1628] border border-blue-800/30 rounded-xl p-3">
                  <div className="text-blue-400 text-xs font-bold mb-1 flex items-center gap-1">
                    <Zap className="w-3 h-3" /> NEXT TIER: {nextTier.label} {nextTier.emoji}
                  </div>
                  <div className="text-blue-200/60 text-xs">{nextTier.description}</div>
                </div>
              )}

              <div className="mt-3 text-center">
                <div className="text-blue-400/50 text-xs">All 7 tiers: Youth → High School → College → Transfer Portal → Pro → Post-Career → Legacy</div>
              </div>
            </div>
          )}

          {/* Family/Legacy tab */}
          {activeTab === "family" && (
            <div className="bg-[#050d1f] p-4 overflow-y-auto" style={{ height: 320 }}>
              <div className="text-center mb-4">
                <div className="text-2xl mb-2 font-black tracking-widest text-sky-300">LEG</div>
                <div className="text-white font-black text-base">Athletic Dynasty</div>
                <div className="text-blue-300/70 text-xs mt-1">Your family's athletic legacy lives here forever</div>
              </div>

              {familyLegacy?.parentName ? (
                <div className="space-y-2 mb-4">
                  {familyLegacy.grandparentName && (
                    <div className="bg-blue-900/20 border border-blue-700/30 rounded-xl p-3">
                      <div className="text-sky-400 text-xs font-bold">GRANDPARENT</div>
                      <div className="text-white text-sm font-bold">{familyLegacy.grandparentName}</div>
                      <div className="text-sky-300/60 text-xs">Legacy Member</div>
                    </div>
                  )}
                  <div className="bg-blue-900/20 border border-blue-700/30 rounded-xl p-3">
                    <div className="text-blue-400 text-xs font-bold">PARENT</div>
                    <div className="text-white text-sm font-bold">{familyLegacy.parentName}</div>
                    <div className="text-blue-300/60 text-xs">{familyLegacy.parentSport} · {familyLegacy.parentTier}</div>
                  </div>
                  <div className={cn("rounded-xl p-3 bg-gradient-to-r", tier.color, "bg-opacity-20 border border-blue-600/40")}>
                    <div className="text-blue-300 text-xs font-bold">YOU</div>
                    <div className="text-white text-sm font-bold">{userName}</div>
                    <div className="text-blue-200/70 text-xs">{tier.label} · Active</div>
                  </div>
                </div>
              ) : (
                <div className="bg-[#0a1628] border border-blue-800/30 rounded-xl p-4 mb-4 text-center">
                  <div className="text-blue-300/60 text-xs mb-2">No family members linked yet</div>
                  <div className="text-blue-200/80 text-xs">Link a parent, sibling, or child to start building your dynasty. Their athletic history becomes your head start.</div>
                </div>
              )}

              <button className="w-full bg-gradient-to-r from-blue-600 to-blue-500 text-black font-black text-sm rounded-xl py-2.5 hover:from-blue-500 hover:to-blue-400 transition-all active:scale-[0.98]">
                + Link Family Member
              </button>

              <div className="mt-3 text-center text-blue-400/40 text-xs">
                Your children's children will inherit your data, your network, and your legacy.
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}
