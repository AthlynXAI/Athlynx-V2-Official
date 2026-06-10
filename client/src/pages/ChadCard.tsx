/**
 * ChadCard — /card
 * Chad A. Dozier Sr. digital business card / dot.card profile page
 * Matches his dot.card style exactly
 */
import { useState } from "react";
import { RouteErrorBoundary } from "@/components/GlobalErrorBoundary";
import PlatformLayout from "@/components/PlatformLayout";
import MobileBottomNav from '@/components/MobileBottomNav'
import { Link } from "wouter";

const CHAD_PHOTO = "/images/team/chad-dozier-headshot.png";
const DHG_LOGO = "/dhg-crab-shield.png";
const AthlynX_LOGO = "/athlynx-icon.png";
const DOTCARD_URL = "https://dot.cards/cdozier14";
const DOTCODE_IMAGE = "/dotcode/cdozier14_dotcode.png";

const LINKS = [
  {
    icon: "🔗",
    label: "dot.card Profile",
    sub: "dot.cards/cdozier14",
    href: DOTCARD_URL,
    color: "bg-black",
    textColor: "text-white",
  },
  {
    icon: "💬",
    label: "Text",
    sub: "Book or request contact",
    href: "/book",
    color: "bg-green-500",
    textColor: "text-white",
  },
  {
    icon: "✉️",
    label: "Email",
    sub: "contact@athlynx.ai",
    href: "mailto:contact@athlynx.ai",
    color: "bg-blue-500",
    textColor: "text-white",
  },
  {
    icon: "🌐",
    label: "Dozier Holdings Group",
    sub: "dozierholdingsgroup.com",
    href: "https://dozierholdingsgroup.com",
    color: "bg-white",
    textColor: "text-gray-800",
    border: true,
  },
  {
    icon: "🏆",
    label: "AthlynX — The Athlete's Playbook",
    sub: "athlynx.ai",
    href: "https://athlynx.ai",
    color: "bg-white",
    textColor: "text-gray-800",
    border: true,
  },
  {
    icon: "📅",
    label: "Schedule a Meeting",
    sub: "calendly.com/cdozier14",
    href: "https://calendly.com/cdozier14",
    color: "bg-white",
    textColor: "text-gray-800",
    border: true,
  },
  {
    icon: "💼",
    label: "LinkedIn",
    sub: "linkedin.com/in/chaddozier",
    href: "https://linkedin.com/in/chaddozier",
    color: "bg-[#0077B5]",
    textColor: "text-white",
  },
  {
    icon: "📸",
    label: "Instagram",
    sub: "@chad_dozier",
    href: "https://instagram.com/chad_dozier",
    color: "bg-gradient-to-r from-purple-500 via-pink-500 to-blue-400",
    textColor: "text-white",
  },
  {
    icon: "🐦",
    label: "X / Twitter",
    sub: "@ChadADozier2",
    href: "https://x.com/ChadADozier2",
    color: "bg-black",
    textColor: "text-white",
  },
];

function ChadCardInner() {
  const [copied, setCopied] = useState(false);

  const handleSaveContact = () => {
    const vcard = `BEGIN:VCARD
VERSION:3.0
FN:Chad Allen Dozier Sr
N:Dozier;Chad;Allen;Sr;
TITLE:Founder, CEO & Chairman
ORG:Dozier Holdings Group;AthlynXAI;Softmor Inc
EMAIL;TYPE=WORK:contact@athlynx.ai
URL:${DOTCARD_URL}
URL:https://athlynx.ai
NOTE:Founder. Builder. Servant Leader. AthlynXAI dot.card: ${DOTCARD_URL}
END:VCARD`;
    const blob = new Blob([vcard], { type: "text/vcard" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "Chad_Dozier.vcf";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(DOTCARD_URL);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden">

        {/* Header Banner — MSU Maroon & White accent */}
        <div className="relative h-36 bg-gradient-to-r from-[#660000] via-[#7a1f1f] to-[#660000] overflow-hidden">
          {/* Maroon stripe overlay */}
          <div className="absolute inset-x-0 top-0 h-1 bg-white"></div>
          <div className="absolute inset-x-0 bottom-0 h-1 bg-white"></div>
          {/* DHG logo watermark */}
          <div className="absolute inset-0 flex items-center justify-center opacity-20">
            <img src={DHG_LOGO} alt="DHG" className="w-32 h-32 object-contain" />
          </div>
          {/* HailState · Maroon & White */}
          <div className="absolute top-2 left-3">
            <span className="text-white/80 text-[10px] font-black tracking-[0.25em] uppercase">Maroon &amp; White</span>
          </div>
          <div className="absolute top-2 right-3">
            <span className="text-white/80 text-[10px] font-black tracking-[0.25em] uppercase">#HailState</span>
          </div>
          {/* DOZIER HOLDINGS text */}
          <div className="absolute inset-0 flex items-end justify-center pb-3">
            <span className="text-white/40 text-xs font-black tracking-[0.3em] uppercase">DOZIER HOLDINGS GROUP</span>
          </div>
          {/* Avatar */}
          <div className="absolute -bottom-10 left-1/2 -translate-x-1/2">
            <div className="w-20 h-20 rounded-full border-4 border-white shadow-lg overflow-hidden bg-[#1a3a8f]">
              <img
                src={CHAD_PHOTO}
                alt="Chad A. Dozier Sr."
                className="w-full h-full object-cover"
                onError={(e) => { (e.target as HTMLImageElement).src = DHG_LOGO; }}
              />
            </div>
            {/* DHG crab badge */}
            <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-white shadow-md flex items-center justify-center overflow-hidden">
              <img src={DHG_LOGO} alt="DHG" className="w-5 h-5 object-contain" />
            </div>
          </div>
        </div>

        {/* Profile Info */}
        <div className="pt-14 pb-4 px-5 text-center">
          <h1 className="text-2xl font-black text-gray-900 leading-tight">Chad Allen Dozier Sr</h1>
          <p className="text-gray-500 text-sm font-medium mt-0.5">Founder. Builder. Servant Leader.</p>
          {/* Title block */}
          <div className="mt-3 text-left border-l-4 border-[#660000] pl-3">
            <p className="text-gray-600 text-xs leading-relaxed">
              Founder | CEO | Chairman | Dozier Holdings Group<br />
              AthlynXAI | Softmor Inc.<br />
              Houston, TX (HQ) | Laurel, MS (SE)<br />
              <span className="text-[#660000] font-bold">Mississippi State University — HailState</span>
            </p>
          </div>

          {/* High School Loyalty — RH Watkins Golden Tornadoes · Between the Bricks */}
          <div className="mt-3 text-left bg-gradient-to-r from-[#b80000] to-[#8b0000] rounded-xl p-3 shadow-md relative overflow-hidden">
            {/* Brick texture accent */}
            <div className="absolute inset-0 opacity-10" style={{backgroundImage: "repeating-linear-gradient(0deg, #000 0px, #000 1px, transparent 1px, transparent 8px), repeating-linear-gradient(90deg, #000 0px, #000 1px, transparent 1px, transparent 20px)"}}></div>
            <div className="relative">
              <div className="text-[10px] font-black tracking-widest uppercase text-[#1E90FF] mb-1">Two-Sport Athlete · FB + Baseball · 1989–1993</div>
              <div className="text-sm font-black text-white leading-tight">
                R.H. Watkins High School · Laurel
              </div>
              <div className="text-xs text-[#1E90FF] font-bold mt-0.5">
                Golden Tornadoes · Cardinal &amp; Gold
              </div>
              <p className="text-[11px] text-white/90 leading-relaxed mt-2">
                Played quarterback on <span className="font-bold text-[#1E90FF]">R.H. Watkins Stadium / George Blair Field</span> —
                the locals just call it <span className="font-bold text-[#1E90FF]">“The Bricks.”</span>
                Also wore the Cardinal &amp; Gold on the diamond.
              </p>
            </div>
          </div>

          {/* Jones County Junior College — Baseball · 1993-94 */}
          <div className="mt-3 text-left bg-gradient-to-r from-[#5a0e1a] to-[#3d0710] rounded-xl p-3 shadow-md border border-white/10">
            <div className="text-[10px] font-black tracking-widest uppercase text-white/80 mb-1">JuCo Baseball · 1993–94 Season</div>
            <div className="text-sm font-black text-white leading-tight">
              Jones County Junior College · Ellisville
            </div>
            <div className="text-xs text-white/90 font-bold mt-0.5">
              Bobcats · MACCC / NJCAA
            </div>
          </div>

          {/* Family Legacy — MSU rooted */}
          <div className="mt-3 text-left bg-gradient-to-r from-[#fdf3f3] to-white border border-[#660000]/20 rounded-xl p-3">
            <div className="text-[10px] font-black tracking-widest uppercase text-[#660000] mb-1">Family Legacy · Rooted in MSU</div>
            <p className="text-gray-700 text-xs leading-relaxed">
              My grandfather was the first in our family to earn a college degree — at Mississippi State.
              Today the Dozier family carries <span className="font-bold text-[#660000]">16 college degrees</span>:
              9 from MSU, 3 from Ole Miss, 3 from Southern Miss, and 1 from Belmont in Nashville.
              SEC fan. Mississippi proud. Bulldogs first.
            </p>
          </div>

          {/* dot.card / dot.code proof layer */}
          <div className="mt-4 bg-black rounded-2xl p-4 text-white text-left shadow-lg">
            <div className="flex items-center gap-4">
              <img src={DOTCODE_IMAGE} alt="Chad Dozier dot.card QR code" className="w-24 h-32 object-contain rounded-xl bg-white p-1" />
              <div className="min-w-0">
                <div className="text-[10px] font-black tracking-widest uppercase text-cyan-300">dot.card CRM Entry Point</div>
                <div className="text-sm font-black mt-1">Scan, save, and route the relationship back into AthlynXAI OS.</div>
                <a href={DOTCARD_URL} target="_blank" rel="noopener noreferrer" className="text-xs text-cyan-200 underline break-all mt-2 inline-block">dot.cards/cdozier14</a>
              </div>
            </div>
          </div>

          {/* Tags — roots, not résumé */}
          <div className="flex gap-2 justify-center mt-3 flex-wrap">
            {["Creative", "Entrepreneur", "Servant Leader"].map((tag) => (
              <span key={tag} className="text-xs px-3 py-1 rounded-full font-medium text-gray-500 bg-gray-100">
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="px-4 pb-3 flex gap-2">
          <button
            onClick={handleSaveContact}
            className="flex-1 bg-gray-900 text-white font-bold py-3 rounded-2xl text-sm hover:bg-gray-800 transition-colors"
          >
            Save Contact
          </button>
          <button
            onClick={handleCopyLink}
            className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center hover:bg-gray-200 transition-colors"
          >
            {copied ? "✓" : "🔗"}
          </button>
        </div>

        {/* Links */}
        <div className="px-4 pb-6 space-y-2.5">
          {LINKS.map((link, i) => (
            <a
              key={i}
              href={link.href}
              target={link.href.startsWith("http") ? "_blank" : undefined}
              rel="noopener noreferrer"
              className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all hover:scale-[1.01] active:scale-[0.99] ${link.color} ${link.border ? "border border-gray-200 shadow-sm" : "shadow-md"}`}
            >
              <span className="text-2xl w-8 text-center shrink-0">{link.icon}</span>
              <div className="flex-1 min-w-0">
                <div className={`font-bold text-sm ${link.textColor}`}>{link.label}</div>
                <div className={`text-xs truncate ${link.textColor} opacity-70`}>{link.sub}</div>
              </div>
              <svg className={`w-4 h-4 ${link.textColor} opacity-40 shrink-0`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </a>
          ))}
        </div>

        {/* Logos Row */}
        <div className="px-4 pb-5 flex items-center justify-center gap-4 border-t border-gray-100 pt-4">
          <img src={DHG_LOGO} alt="Dozier Holdings Group" className="h-8 w-8 object-contain" />
          <img src={AthlynX_LOGO} alt="AthlynXAI" className="h-8 w-8 object-contain rounded-lg" />
          <div className="text-center">
            <div className="text-[10px] text-gray-400 font-bold tracking-widest uppercase">Powered by</div>
            <div className="text-xs font-black text-gray-700">AthlynXAI</div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-4 py-3 text-center border-t border-gray-100">
          <p className="text-[10px] text-gray-400">
            Iron Sharpens Iron — Proverbs 27:17<br />
            © 2026 Dozier Holdings Group · athlynx.ai/card · dot.cards/cdozier14
          </p>
        </div>
      </div>
    <MobileBottomNav />
    </div>
  );
}

export default function ChadCard() {
  return <RouteErrorBoundary><ChadCardInner /></RouteErrorBoundary>;
}
