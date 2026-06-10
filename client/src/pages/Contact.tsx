import { useState } from "react";
import { RouteErrorBoundary } from "@/components/GlobalErrorBoundary";
import MobileBottomNav from '@/components/MobileBottomNav'
import { Link } from "wouter";
import { Mail, MapPin, ExternalLink, Send, CheckCircle, MessageCircle, Building2, Users, Briefcase, Calendar } from "lucide-react";
import { toast } from "sonner";

//  Chad A. Dozier — Official Contact Block 
const CHAD_CONTACT = {
  name: "Chad A. Dozier",
  title: "Founder · CEO · Chairman",
  companies: "Dozier Holdings Group · AthlynX · Softmor Inc",
  address: "Laurel, Mississippi, USA",
  email: "contact@athlynx.ai",
  emailAlt: "contact@athlynx.ai",
  linkedin: "https://linkedin.com/in/chaddozier",
  whatsapp: "mailto:contact@athlynx.ai?subject=AthlynXAI%20Contact", // Public contact rail; no personal number exposed
  telegram: "https://t.me/chaddozier",
  wechat: "chaddozier",                   // WeChat ID — users must add manually
  calendly: "/book",
  zoom: "https://zoom.us/j/chaddozier",
  dotcard: "https://athlynx.ai/card",
  website: "https://athlynx.ai",
};

function ContactInner() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    type: "general",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    toast.success("Message sent! Chad will get back to you within 24 hours.");
  };

  const contactTypes = [
    { id: "general", label: "General Inquiry", icon: MessageCircle },
    { id: "partnership", label: "Partnership", icon: Building2 },
    { id: "investor", label: "Investor Relations", icon: Briefcase },
    { id: "support", label: "Support", icon: Users },
  ];

  const messagingApps = [
    {
      name: "WhatsApp",
      icon: "",
      color: "#25D366",
      bg: "rgba(37,211,102,0.12)",
      border: "rgba(37,211,102,0.3)",
      href: CHAD_CONTACT.whatsapp,
      label: "Message on WhatsApp",
      action: "Open WhatsApp",
    },
    {
      name: "Telegram",
      icon: "",
      color: "#229ED9",
      bg: "rgba(34,158,217,0.12)",
      border: "rgba(34,158,217,0.3)",
      href: CHAD_CONTACT.telegram,
      label: "Message on Telegram",
      action: "Open Telegram",
    },
    {
      name: "WeChat",
      icon: "",
      color: "#07C160",
      bg: "rgba(7,193,96,0.12)",
      border: "rgba(7,193,96,0.3)",
      href: null,
      label: `WeChat ID: ${CHAD_CONTACT.wechat}`,
      action: "Copy WeChat ID",
    },
  ];

  return (
    <div className="min-h-screen" style={{ background: "linear-gradient(180deg, #0a1628 0%, #0d1f3c 50%, #061424 100%)" }}>

      {/* Header */}
      <div className="text-center py-12 border-b border-[#1E90FF]/30">
        <Link href="/">
          <div className="inline-flex items-center gap-2 bg-slate-900/80 border border-[#1E90FF]/30 rounded-full px-4 py-2 mb-6 cursor-pointer hover:bg-slate-800/80 transition-colors">
            <span className="text-white/60 text-sm">← Back to AthlynX</span>
          </div>
        </Link>
        <div className="flex items-center justify-center gap-4 mb-4">
          <img
            src="/athlynxai-icon.png"
            alt="DHG"
            className="w-16 h-16 rounded-full border-4 border-[#1E90FF]/30"
            onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
          />
        </div>
        <h1 className="text-5xl font-black text-white mb-2">CONTACT US</h1>
        <p className="text-[#00C2FF] text-xl font-bold uppercase tracking-wider mb-2">Dozier Holdings Group</p>
        <p className="text-white/50 text-sm">AthlynX · Softmor Inc · DHG</p>
      </div>

      <div className="max-w-6xl mx-auto px-5 py-10">
        <div className="grid lg:grid-cols-2 gap-10">

          {/*  Contact Form  */}
          <div className="bg-slate-900/80 border border-white/10 rounded-2xl p-8">
            {submitted ? (
              <div className="text-center py-12">
                <CheckCircle className="w-16 h-16 text-[#00C2FF] mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-white mb-2">Message Sent!</h3>
                <p className="text-white/60 mb-6">
                  Thank you for reaching out. Chad will respond within 24 hours.
                </p>
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setFormData({ name: "", email: "", subject: "", type: "general", message: "" });
                  }}
                  className="bg-[#1E90FF] hover:bg-[#1E90FF] text-black font-bold px-6 py-3 rounded-xl"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <h2 className="text-2xl font-bold text-white mb-6">Send a Message</h2>

                <div>
                  <label className="block text-white/70 text-sm mb-2">What can we help you with?</label>
                  <div className="grid grid-cols-2 gap-2">
                    {contactTypes.map((type) => (
                      <button
                        key={type.id}
                        type="button"
                        onClick={() => setFormData({ ...formData, type: type.id })}
                        className={`flex items-center gap-2 px-4 py-3 rounded-xl border transition-colors ${
                          formData.type === type.id
                            ? "bg-[#1E90FF]/20 border-[#1E90FF] text-[#00C2FF]"
                            : "bg-white/5 border-white/10 text-white/60 hover:bg-white/10"
                        }`}
                      >
                        <type.icon className="w-4 h-4" />
                        <span className="text-sm">{type.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white/70 text-sm mb-1">Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 bg-black/30 border border-white/20 rounded-xl text-white focus:border-[#1E90FF] focus:outline-none"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label className="block text-white/70 text-sm mb-1">Email *</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 bg-black/30 border border-white/20 rounded-xl text-white focus:border-[#1E90FF] focus:outline-none"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-white/70 text-sm mb-1">Subject *</label>
                  <input
                    type="text"
                    required
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-4 py-3 bg-black/30 border border-white/20 rounded-xl text-white focus:border-[#1E90FF] focus:outline-none"
                    placeholder="What is this about?"
                  />
                </div>

                <div>
                  <label className="block text-white/70 text-sm mb-1">Message *</label>
                  <textarea
                    required
                    rows={5}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-3 bg-black/30 border border-white/20 rounded-xl text-white focus:border-[#1E90FF] focus:outline-none resize-none"
                    placeholder="Tell us more..."
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#1E90FF] hover:bg-[#1E90FF] text-black font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  Send Message
                </button>
              </form>
            )}
          </div>

          {/*  Right Column: Contact Info  */}
          <div className="space-y-5">

            {/* Chad's Contact Card */}
            <div className="bg-slate-900/80 border border-[#1E90FF]/30 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#1E90FF] to-blue-600 flex items-center justify-center text-white font-black text-lg">CD</div>
                <div>
                  <div className="text-white font-black text-lg">{CHAD_CONTACT.name}</div>
                  <div className="text-[#00C2FF] text-sm">{CHAD_CONTACT.title}</div>
                  <div className="text-white/40 text-xs">{CHAD_CONTACT.companies}</div>
                </div>
              </div>

              <div className="space-y-4">
                {/* Primary Email */}
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 bg-[#1E90FF]/20 rounded-lg flex items-center justify-center shrink-0">
                    <Mail className="w-4 h-4 text-[#00C2FF]" />
                  </div>
                  <div>
                    <p className="text-white/40 text-xs mb-0.5">Primary Email</p>
                    <a href={`mailto:${CHAD_CONTACT.email}`} className="text-[#00C2FF] hover:underline text-sm font-semibold">
                      {CHAD_CONTACT.email}
                    </a>
                  </div>
                </div>

                {/* Alt Email */}
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 bg-blue-500/15 rounded-lg flex items-center justify-center shrink-0">
                    <Mail className="w-4 h-4 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-white/40 text-xs mb-0.5">Business Email</p>
                    <a href={`mailto:${CHAD_CONTACT.emailAlt}`} className="text-blue-400 hover:underline text-sm">
                      {CHAD_CONTACT.emailAlt}
                    </a>
                  </div>
                </div>

                {/* Location */}
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 bg-[#1E90FF]/15 rounded-lg flex items-center justify-center shrink-0">
                    <MapPin className="w-4 h-4 text-[#1E90FF]" />
                  </div>
                  <div>
                    <p className="text-white/40 text-xs mb-0.5">Location</p>
                    <p className="text-white text-sm">{CHAD_CONTACT.address}</p>
                  </div>
                </div>

                {/* LinkedIn */}
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 bg-blue-700/20 rounded-lg flex items-center justify-center shrink-0">
                    <ExternalLink className="w-4 h-4 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-white/40 text-xs mb-0.5">LinkedIn</p>
                    <a href={CHAD_CONTACT.linkedin} target="_blank" rel="noopener noreferrer" className="text-[#00C2FF] hover:underline text-sm">
                      linkedin.com/in/chaddozier
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/*  Messaging Apps  */}
            <div className="bg-slate-900/80 border border-white/10 rounded-2xl p-6">
              <h3 className="text-lg font-bold text-white mb-4">Message Directly</h3>
              <div className="space-y-3">
                {messagingApps.map((app) => (
                  <div
                    key={app.name}
                    style={{ background: app.bg, border: `1px solid ${app.border}`, borderRadius: "12px", padding: "14px 16px" }}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{app.icon}</span>
                      <div>
                        <div className="text-white font-bold text-sm">{app.name}</div>
                        <div className="text-white/50 text-xs">{app.label}</div>
                      </div>
                    </div>
                    {app.href ? (
                      <a
                        href={app.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ background: app.color, color: "#fff", borderRadius: "8px", padding: "6px 14px", fontSize: "12px", fontWeight: "700", textDecoration: "none", whiteSpace: "nowrap" }}
                      >
                        {app.action} →
                      </a>
                    ) : (
                      <button
                        onClick={() => { navigator.clipboard.writeText(CHAD_CONTACT.wechat); toast.success("WeChat ID copied!"); }}
                        style={{ background: app.color, color: "#fff", borderRadius: "8px", padding: "6px 14px", fontSize: "12px", fontWeight: "700", border: "none", cursor: "pointer", whiteSpace: "nowrap" }}
                      >
                        {app.action}
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/*  Book a Meeting (Calendly)  */}
            <div className="bg-gradient-to-r from-blue-900/40 to-[#0a1628]/30 border border-[#1E90FF]/30 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-3">
                <Calendar className="w-6 h-6 text-[#00C2FF]" />
                <h3 className="text-lg font-bold text-white">Book a Meeting</h3>
              </div>
              <p className="text-white/60 text-sm mb-4">
                Schedule a call directly with Chad — investor meetings, partnership discussions, or platform demos.
              </p>
              <div className="flex gap-2">
                <a
                  href={CHAD_CONTACT.calendly}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 flex-1 bg-[#1E90FF] hover:bg-[#1E90FF] text-black font-black py-3 rounded-xl transition-colors text-sm"
                >
                  <Calendar className="w-4 h-4" />
                  Calendly
                  <ExternalLink className="w-3 h-3" />
                </a>
                <a
                  href={CHAD_CONTACT.zoom}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 flex-1 bg-blue-600 hover:bg-blue-500 text-white font-black py-3 rounded-xl transition-colors text-sm"
                >
                   Zoom
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              <p className="text-white/30 text-xs text-center mt-2">calendly.com/cdozier14 · zoom.us</p>
            </div>

            {/*  dot.card + vCard  */}
            <div className="bg-slate-900/80 border border-white/10 rounded-2xl p-5">
              <h3 className="text-base font-bold text-white mb-3">Digital Business Card</h3>
              <a
                href="/card"
                className="flex items-center justify-center gap-2 w-full bg-[#1a3a8f] hover:bg-[#1a4aaf] border border-blue-700 text-white font-bold py-2.5 rounded-xl transition-colors text-sm"
              >
                 View My Digital Card — athlynx.ai/card
              </a>
              <button
                onClick={() => {
                  const vcard = `BEGIN:VCARD\nVERSION:3.0\nFN:Chad Allen Dozier Sr\nN:Dozier;Chad;Allen;Sr;\nTITLE:Founder, CEO & Chairman\nORG:Dozier Holdings Group;AthlynXAI;Softmor Inc\nEMAIL;TYPE=WORK:contact@athlynx.ai\nURL:https://athlynx.ai\nNOTE:Founder. Builder. Servant Leader. Public contact details are routed through AthlynXAI.\nEND:VCARD`;
                  const blob = new Blob([vcard], { type: "text/vcard" });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement("a");
                  a.href = url; a.download = "Chad_Dozier.vcf"; a.click();
                  URL.revokeObjectURL(url);
                }}
                className="w-full mt-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 font-bold py-2.5 rounded-xl transition-colors text-sm"
              >
                 Save Contact (.vcf)
              </button>
            </div>

            {/*  Response Time  */}
            <div className="bg-gradient-to-r from-[#1E90FF]/20 to-blue-500/10 border border-[#1E90FF]/30 rounded-2xl p-5">
              <h3 className="text-base font-bold text-white mb-1">Response Time</h3>
              <p className="text-white/60 text-sm">
                All inquiries are typically answered within <strong className="text-[#00C2FF]">24 hours</strong>.
                For urgent matters, use WhatsApp or Telegram for the fastest response.
              </p>
            </div>

          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center py-8 border-t border-white/10 mt-10">
        <p className="text-white/50 text-sm">© 2026 Dozier Holdings Group, LLC. All Rights Reserved.</p>
        <p className="text-white/30 text-xs mt-1">AthlynX · Softmor Inc · DHG</p>
      </div>
    <MobileBottomNav />
    </div>
  );
}

export default function Contact() {
  return <RouteErrorBoundary><ContactInner /></RouteErrorBoundary>;
}
