/**
 * AthlynX Reverse Funnel Component
 * ─────────────────────────────────
 * Every page captures leads automatically.
 * Visitor → Lead → CRM → AI Follow-up → Conversion.
 *
 * Like Facebook's growth engine: the more users, the smarter it gets.
 * Every interaction feeds the AI layer.
 */

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Zap, Trophy, ArrowRight } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

interface ReverseFunnelProps {
  trigger?: "exit-intent" | "scroll" | "time" | "manual";
  source?: string;
  variant?: "athlete" | "b2b" | "investor";
}

export function ReverseFunnel({
  trigger = "time",
  source = "platform",
  variant = "athlete",
}: ReverseFunnelProps) {
  const [show, setShow] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", sport: "", school: "" });

  // Trigger logic
  useEffect(() => {
    const dismissed = sessionStorage.getItem(`funnel-dismissed-${source}`);
    if (dismissed) return;

    if (trigger === "time") {
      const timer = setTimeout(() => setShow(true), 45000); // 45 seconds
      return () => clearTimeout(timer);
    }

    if (trigger === "scroll") {
      const handleScroll = () => {
        if (window.scrollY > window.innerHeight * 0.7) {
          setShow(true);
          window.removeEventListener("scroll", handleScroll);
        }
      };
      window.addEventListener("scroll", handleScroll, { passive: true });
      return () => window.removeEventListener("scroll", handleScroll);
    }

    if (trigger === "exit-intent") {
      const handleMouseLeave = (e: MouseEvent) => {
        if (e.clientY <= 0) setShow(true);
      };
      document.addEventListener("mouseleave", handleMouseLeave);
      return () => document.removeEventListener("mouseleave", handleMouseLeave);
    }
  }, [trigger, source]);

  const handleDismiss = () => {
    setShow(false);
    sessionStorage.setItem(`funnel-dismissed-${source}`, "1");
  };

  const joinWaitlist = trpc.waitlist.join.useMutation({
    onSuccess: () => {
      setSubmitted(true);
      toast.success("You're in! Check your email for next steps.");
      setTimeout(() => {
        setShow(false);
        sessionStorage.setItem(`funnel-dismissed-${source}`, "1");
      }, 3000);
    },
    onError: () => {
      // Already on waitlist — still show success
      setSubmitted(true);
      toast.success("You're already on the list! We'll be in touch.");
      setTimeout(() => {
        setShow(false);
        sessionStorage.setItem(`funnel-dismissed-${source}`, "1");
      }, 3000);
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.email) return;
    joinWaitlist.mutate({
      email: form.email,
      fullName: form.name || "Athlete",
      phone: form.phone || undefined,
      sport: form.sport || undefined,
      role: variant === "b2b" ? "brand" : "athlete",
    });
  };

  const content = {
    athlete: {
      headline: "Your NIL. Your Career. Your Future.",
      sub: "Join thousands of athletes already on AthlynX — NIL deals, recruiting, AI training.",
      cta: "Start Free — 7 Days",
      badge: "⚡ FREE 7-DAY ACCESS",
      color: "from-[#0a1540] to-[#1565c0]",
    },
    b2b: {
      headline: "AI Data Intelligence for Your Business",
      sub: "ConCreator™ — 4 tiers from $297/machine/month. Request a demo today.",
      cta: "Request Demo",
      badge: "🤖 CONCREATOR™ LIVE",
      color: "from-[#0a1628] to-[#0d2040]",
    },
    investor: {
      headline: "The $47B NIL Market. One Platform.",
      sub: "AthlynX is live. 20+ platforms. Pre-seed round open. Request the investor deck.",
      cta: "View Investor Deck",
      badge: "💼 PRE-SEED OPEN",
      color: "from-[#1a0000] to-[#7f0000]",
    },
  }[variant];

  if (!show) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 z-[9999] flex items-end sm:items-center justify-center p-4"
        onClick={(e) => e.target === e.currentTarget && handleDismiss()}
      >
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className={`w-full max-w-md bg-gradient-to-br ${content.color} border border-white/10 rounded-3xl p-6 shadow-2xl`}
        >
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-2">
              <img src="/img-athlete-multisport.jpg" alt="AthlynX" className="w-8 h-8 rounded-lg" />
              <span className="text-xs font-bold text-blue-300 uppercase tracking-widest">AthlynX</span>
            </div>
            <button onClick={handleDismiss} className="text-white/40 hover:text-white transition-colors p-1">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-xs font-bold text-white mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            {content.badge}
          </div>

          {!submitted ? (
            <>
              {/* Content */}
              <h2 className="text-2xl font-black text-white mb-2 leading-tight">{content.headline}</h2>
              <p className="text-blue-200 text-sm mb-5 leading-relaxed">{content.sub}</p>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-3">
                {variant === "athlete" && (
                  <>
                    <input
                      type="text"
                      placeholder="Your name"
                      value={form.name}
                      onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                      className="w-full bg-white/10 border border-white/20 text-white placeholder:text-white/40 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-400"
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        placeholder="Sport"
                        value={form.sport}
                        onChange={e => setForm(f => ({ ...f, sport: e.target.value }))}
                        className="bg-white/10 border border-white/20 text-white placeholder:text-white/40 rounded-xl px-3 py-3 text-sm focus:outline-none focus:border-blue-400"
                      />
                      <input
                        type="text"
                        placeholder="School/Team"
                        value={form.school}
                        onChange={e => setForm(f => ({ ...f, school: e.target.value }))}
                        className="bg-white/10 border border-white/20 text-white placeholder:text-white/40 rounded-xl px-3 py-3 text-sm focus:outline-none focus:border-blue-400"
                      />
                    </div>
                  </>
                )}
                <input
                  type="email"
                  required
                  placeholder="Email address *"
                  value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  className="w-full bg-white/10 border border-white/20 text-white placeholder:text-white/40 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-400"
                />
                <button
                  type="submit"
                  disabled={joinWaitlist.isPending}
                  className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-black text-sm transition-all hover:scale-105 hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
                  style={{ background: "linear-gradient(135deg, #0066ff, #00c2ff)", color: "#ffffff" }}
                >
                  {joinWaitlist.isPending ? (
                    <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Joining...</>
                  ) : (
                    <>{content.cta} <ArrowRight className="w-4 h-4" /></>
                  )}
                </button>
              </form>

              <p className="text-white/20 text-xs text-center mt-3">Credit card required · Not charged until day 8 · Cancel anytime</p>
            </>
          ) : (
            <div className="text-center py-4">
              <div className="text-5xl mb-3">🏆</div>
              <h3 className="text-xl font-black text-white mb-2">You're in!</h3>
              <p className="text-blue-200 text-sm">Check your email for next steps. Welcome to AthlynX.</p>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

/**
 * Floating AI Assistant Button — always visible on mobile
 * One tap → Gemini answers any question about the platform
 */
export function AIAssistantButton() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [conversation, setConversation] = useState<{ role: "user" | "assistant"; content: string }[]>([]);
  const [loading, setLoading] = useState(false);

  const queryMutation = trpc.aiCommand.query.useMutation({
    onSuccess: (data) => {
      setConversation(prev => [...prev, { role: "assistant", content: data.reply }]);
      setLoading(false);
    },
    onError: () => {
      setConversation(prev => [...prev, { role: "assistant", content: "I'm having trouble connecting right now. Try again in a moment." }]);
      setLoading(false);
    },
  });

  const handleSend = () => {
    if (!message.trim() || loading) return;
    const userMsg = message.trim();
    setMessage("");
    setConversation(prev => [...prev, { role: "user", content: userMsg }]);
    setLoading(true);
    queryMutation.mutate({
      message: userMsg,
      context: "platform-assistant",
      history: conversation.slice(-6),
    });
  };

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen(true)}
        className="fixed right-4 z-40 w-12 h-12 rounded-full shadow-2xl flex items-center justify-center transition-all hover:scale-110 lg:bottom-6"
        style={{
          background: "linear-gradient(135deg, #0066ff, #00c2ff)",
          bottom: "calc(env(safe-area-inset-bottom, 0px) + 80px)",
        }}
        title="Ask AthlynXAI"
      >
        <Zap className="w-5 h-5 text-white" />
      </button>

      {/* Chat panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed right-4 z-40 w-80 max-w-[calc(100vw-2rem)] bg-[#0a1540] border border-blue-800 rounded-2xl shadow-2xl overflow-hidden lg:bottom-20"
            style={{ bottom: "calc(env(safe-area-inset-bottom, 0px) + 96px)" }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-[#1a237e] border-b border-blue-800">
              <div className="flex items-center gap-2">
                <img src="/img-athlete-multisport.jpg" alt="" className="w-6 h-6 rounded-lg" />
                <span className="text-white font-bold text-sm">AthlynXAI</span>
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              </div>
              <button onClick={() => setOpen(false)} className="text-white/40 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Messages */}
            <div className="h-64 overflow-y-auto p-3 space-y-2">
              {conversation.length === 0 && (
                <div className="text-center py-6">
                  <Trophy className="w-8 h-8 text-sky-400 mx-auto mb-2" />
                  <p className="text-white/60 text-xs">Ask me anything about AthlynX, NIL deals, recruiting, or ConCreator™</p>
                </div>
              )}
              {conversation.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[85%] rounded-xl px-3 py-2 text-xs leading-relaxed ${
                    msg.role === "user"
                      ? "bg-blue-600 text-white"
                      : "bg-white/10 text-blue-100"
                  }`}>
                    {msg.content}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-white/10 rounded-xl px-3 py-2">
                    <div className="flex gap-1">
                      {[0, 1, 2].map(i => (
                        <div key={i} className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="p-3 border-t border-blue-900">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && handleSend()}
                  placeholder="Ask anything..."
                  className="flex-1 bg-white/10 border border-white/20 text-white placeholder:text-white/30 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-blue-400"
                />
                <button
                  onClick={handleSend}
                  disabled={loading || !message.trim()}
                  className="px-3 py-2 rounded-xl font-bold text-xs transition-all disabled:opacity-40"
                  style={{ background: "linear-gradient(135deg, #0066ff, #00c2ff)", color: "#ffffff" }}
                >
                  Send
                </button>
              </div>
              <p className="text-white/20 text-[10px] text-center mt-1.5">Powered by Gemini 2.5 Flash · AthlynXAI</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
