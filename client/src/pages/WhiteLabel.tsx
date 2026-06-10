/**
 * AthlynX — White-Label Licensing System
 * 4 tiers: Team ($299/mo), School ($599/mo), Conference ($1,499/mo), Enterprise (custom)
 * Stripe checkout wired for Team/School/Conference. Enterprise → contact form.
 */
import { RouteErrorBoundary } from "@/components/GlobalErrorBoundary";
import PlatformLayout from "@/components/PlatformLayout";
import MobileBottomNav from "@/components/MobileBottomNav";
import { trpc } from "@/lib/trpc";
import { useState } from "react";
import { Link } from "wouter";

const TIERS = [
  {
    id: "team" as const,
    name: "Team",
    price: "$299",
    period: "/mo",
    athletes: "Up to 50 athletes",
    color: "from-blue-600 to-cyan-600",
    borderColor: "border-blue-600",
    badgeColor: "bg-blue-600",
    icon: "🏟️",
    features: [
      "Custom team branding & colors",
      "Up to 50 athlete profiles",
      "Full NIL marketplace access",
      "AI recruiting tools",
      "Team messaging & film room",
      "Performance analytics",
      "Dedicated team dashboard",
      "Email support",
    ],
    stripeEnabled: true,
  },
  {
    id: "school" as const,
    name: "School",
    price: "$599",
    period: "/mo",
    athletes: "Up to 500 athletes",
    color: "from-indigo-600 to-purple-600",
    borderColor: "border-indigo-500",
    badgeColor: "bg-indigo-600",
    icon: "🎓",
    popular: true,
    features: [
      "Everything in Team, plus:",
      "Up to 500 athlete profiles",
      "Multi-sport support (all 44 sports)",
      "School-branded platform",
      "Admin dashboard for coaches & staff",
      "Compliance & eligibility tools",
      "Bulk athlete onboarding",
      "Priority support",
    ],
    stripeEnabled: true,
  },
  {
    id: "conference" as const,
    name: "Conference",
    price: "$1,499",
    period: "/mo",
    athletes: "Unlimited athletes",
    color: "from-purple-600 to-pink-600",
    borderColor: "border-purple-500",
    badgeColor: "bg-purple-600",
    icon: "🏆",
    features: [
      "Everything in School, plus:",
      "Unlimited athlete profiles",
      "Conference-wide analytics & rankings",
      "Custom domain (yourconference.athlynx.ai)",
      "White-glove onboarding",
      "API access for data integration",
      "Conference branding & theming",
      "Dedicated account manager",
    ],
    stripeEnabled: true,
  },
  {
    id: "enterprise" as const,
    name: "Enterprise",
    price: "Custom",
    period: "",
    athletes: "Unlimited + custom",
    color: "from-blue-500 to-blue-500",
    borderColor: "border-blue-400/40",
    badgeColor: "bg-blue-900/30",
    icon: "🌐",
    features: [
      "Everything in plus:",
      "Fully custom white-label deployment",
      "Your own domain (yourplatform.com)",
      "Custom AI model fine-tuning",
      "On-premise or private cloud option",
      "SLA guarantee (99.9% uptime)",
      "Dedicated engineering support",
      "Revenue sharing options",
    ],
    stripeEnabled: false,
  },
];

const SPORT_APPS = [
  { name: "Diamond Grind", sport: "Baseball", icon: "⚾", status: "live", href: "/diamond-grind" },
  { name: "Gridiron Nexus", sport: "Football", icon: "🏈", status: "live", href: "/gridiron-nexus" },
  { name: "Court Kings", sport: "Basketball", icon: "🏀", status: "live", href: "/court-kings" },
  { name: "Pitch Pulse", sport: "Soccer", icon: "⚽", status: "live", href: "/pitch-pulse" },
  { name: "Reel Masters", sport: "Fishing", icon: "🎣", status: "live", href: "/reel-masters" },
  { name: "Racket Kings", sport: "Tennis", icon: "🎾", status: "live", href: "/racket-kings" },
  { name: "Swim Surge", sport: "Swimming", icon: "🏊", status: "live", href: "/swim-surge" },
  { name: "Mat Warriors", sport: "Wrestling", icon: "🤼", status: "live", href: "/mat-warriors" },
  { name: "Net Setters", sport: "Volleyball", icon: "🏐", status: "live", href: "/net-setters" },
  { name: "Track Elite", sport: "Track & Field", icon: "🏃", status: "live", href: "/track-elite" },
  { name: "Softball Nation", sport: "Softball", icon: "🥎", status: "live", href: "/softball-nation" },
  { name: "Cheer Elite", sport: "Cheer", icon: "📣", status: "coming-soon", href: "#" },
];

function WhiteLabelInner() {
  const [showForm, setShowForm] = useState(false);
  const [selectedTier, setSelectedTier] = useState<typeof TIERS[0] | null>(null);
  const [form, setForm] = useState({ orgName: "", orgType: "", contactName: "", contactEmail: "", contactPhone: "", notes: "" });
  const [submitted, setSubmitted] = useState(false);

  const checkoutMutation = trpc.licensing.createCheckout.useMutation({
    onSuccess: (data) => {
      if (data.url) window.location.href = data.url;
    },
  });

  const inquiryMutation = trpc.licensing.createInquiry.useMutation({
    onSuccess: () => setSubmitted(true),
  });

  const handleGetStarted = (tier: typeof TIERS[0]) => {
    setSelectedTier(tier);
    if (tier.stripeEnabled) {
      // Go straight to Stripe for paid tiers
      if (!form.orgName || !form.contactEmail || !form.contactName) {
        setShowForm(true);
      } else {
        checkoutMutation.mutate({
          tier: tier.id as "team" | "school" | "conference",
          orgName: form.orgName,
          contactEmail: form.contactEmail,
          contactName: form.contactName,
        });
      }
    } else {
      setShowForm(true);
    }
  };

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTier) return;
    if (selectedTier.stripeEnabled && selectedTier.id !== "enterprise") {
      checkoutMutation.mutate({
        tier: selectedTier.id as "team" | "school" | "conference",
        orgName: form.orgName,
        contactEmail: form.contactEmail,
        contactName: form.contactName,
      });
    } else {
      inquiryMutation.mutate({
        orgName: form.orgName,
        orgType: form.orgType || selectedTier.id,
        tier: selectedTier.id,
        contactName: form.contactName,
        contactEmail: form.contactEmail,
        contactPhone: form.contactPhone,
        notes: form.notes,
      });
    }
  };

  return (
    <PlatformLayout title="White-Label Licensing">
      <div className="max-w-6xl mx-auto px-2 py-4 space-y-8">

        {/* Hero */}
        <div className="bg-gradient-to-br from-[#0d1b3e] to-[#1a3a8f] rounded-2xl border border-blue-800 p-8 text-center">
          <div className="text-5xl mb-4">🏷️</div>
          <h1 className="text-3xl font-black text-white mb-3">White-Label Licensing</h1>
          <p className="text-blue-300 text-base max-w-2xl mx-auto mb-4">
            Power your organization with the full AthlynX platform under your brand. 
            Same world-class AI, NIL tools, and recruiting infrastructure — your logo, your colors, your domain.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-blue-400">
            <span className="flex items-center gap-1">✅ Custom branding</span>
            <span className="flex items-center gap-1">🤖 Triple AI engine</span>
            <span className="flex items-center gap-1">🏆 44 sports supported</span>
            <span className="flex items-center gap-1">🔒 HIPAA-compliant</span>
          </div>
        </div>

        {/* Pricing Tiers */}
        <div>
          <h2 className="text-xl font-black text-white mb-4 text-center">Choose Your Tier</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {TIERS.map(tier => (
              <div
                key={tier.id}
                className={`relative bg-[#0d1b3e] rounded-2xl border-2 ${tier.borderColor} overflow-hidden hover:scale-105 transition-all`}
              >
                {tier.popular && (
                  <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-[10px] font-black text-center py-1 tracking-widest">
                    MOST POPULAR
                  </div>
                )}
                <div className={`bg-gradient-to-r ${tier.color} p-4 ${tier.popular ? "mt-5" : ""}`}>
                  <div className="text-3xl mb-1">{tier.icon}</div>
                  <div className="text-white font-black text-lg">{tier.name}</div>
                  <div className="text-white/80 text-xs">{tier.athletes}</div>
                </div>
                <div className="p-4">
                  <div className="text-center mb-4">
                    <span className="text-3xl font-black text-white">{tier.price}</span>
                    <span className="text-blue-400 text-sm">{tier.period}</span>
                  </div>
                  <ul className="space-y-1.5 mb-5">
                    {tier.features.map((f, i) => (
                      <li key={i} className="flex items-start gap-1.5 text-xs text-blue-200">
                        <span className="text-cyan-400 mt-0.5 shrink-0">✓</span>
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                  <button
                    onClick={() => handleGetStarted(tier)}
                    className={`w-full bg-gradient-to-r ${tier.color} text-white font-black py-3 rounded-xl text-sm hover:opacity-90 transition-all`}
                  >
                    {tier.stripeEnabled ? "Get Started →" : "Contact Us →"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Inquiry / Checkout Form */}
        {showForm && selectedTier && !submitted && (
          <div className="bg-[#0d1b3e] rounded-2xl border border-blue-700 p-6">
            <h3 className="text-white font-black text-lg mb-1">
              {selectedTier.id === "enterprise" ? "Enterprise Inquiry" : `Start ${selectedTier.name} License`}
            </h3>
            <p className="text-blue-400 text-sm mb-4">
              {selectedTier.id === "enterprise"
                ? "Tell us about your organization and we'll reach out within 24 hours."
                : `You'll be redirected to Stripe to complete your ${selectedTier.name} subscription at ${selectedTier.price}/mo.`}
            </p>
            <form onSubmit={handleSubmitForm} className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="text-blue-400 text-xs font-bold uppercase tracking-wider block mb-1">Organization Name *</label>
                <input
                  required
                  value={form.orgName}
                  onChange={e => setForm(f => ({ ...f, orgName: e.target.value }))}
                  className="w-full bg-blue-900/30 border border-blue-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-cyan-500"
                  placeholder="e.g. Houston Texans, University of Texas"
                />
              </div>
              <div>
                <label className="text-blue-400 text-xs font-bold uppercase tracking-wider block mb-1">Organization Type</label>
                <input
                  value={form.orgType}
                  onChange={e => setForm(f => ({ ...f, orgType: e.target.value }))}
                  className="w-full bg-blue-900/30 border border-blue-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-cyan-500"
                  placeholder="e.g. NFL Team, Division I University"
                />
              </div>
              <div>
                <label className="text-blue-400 text-xs font-bold uppercase tracking-wider block mb-1">Contact Name *</label>
                <input
                  required
                  value={form.contactName}
                  onChange={e => setForm(f => ({ ...f, contactName: e.target.value }))}
                  className="w-full bg-blue-900/30 border border-blue-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-cyan-500"
                  placeholder="Your full name"
                />
              </div>
              <div>
                <label className="text-blue-400 text-xs font-bold uppercase tracking-wider block mb-1">Contact Email *</label>
                <input
                  required
                  type="email"
                  value={form.contactEmail}
                  onChange={e => setForm(f => ({ ...f, contactEmail: e.target.value }))}
                  className="w-full bg-blue-900/30 border border-blue-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-cyan-500"
                  placeholder="you@organization.com"
                />
              </div>
              <div>
                <label className="text-blue-400 text-xs font-bold uppercase tracking-wider block mb-1">Phone</label>
                <input
                  value={form.contactPhone}
                  onChange={e => setForm(f => ({ ...f, contactPhone: e.target.value }))}
                  className="w-full bg-blue-900/30 border border-blue-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-cyan-500"
                  placeholder="+1 (555) 000-0000"
                />
              </div>
              {selectedTier.id === "enterprise" && (
                <div className="md:col-span-2">
                  <label className="text-blue-400 text-xs font-bold uppercase tracking-wider block mb-1">Notes / Requirements</label>
                  <textarea
                    value={form.notes}
                    onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                    rows={3}
                    className="w-full bg-blue-900/30 border border-blue-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-cyan-500"
                    placeholder="Tell us about your athlete count, sports, custom requirements..."
                  />
                </div>
              )}
              <div className="md:col-span-2 flex gap-3">
                <button
                  type="submit"
                  disabled={checkoutMutation.isPending || inquiryMutation.isPending}
                  className={`flex-1 bg-gradient-to-r ${selectedTier.color} text-white font-black py-3 rounded-xl text-sm hover:opacity-90 transition-all disabled:opacity-50`}
                >
                  {checkoutMutation.isPending || inquiryMutation.isPending
                    ? "Processing..."
                    : selectedTier.id === "enterprise"
                    ? "Submit Inquiry"
                    : "Proceed to Payment →"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-3 bg-blue-900/30 text-blue-400 rounded-xl text-sm hover:bg-blue-900/50 transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Success state */}
        {submitted && (
          <div className="bg-green-900/30 border border-green-600 rounded-2xl p-6 text-center">
            <div className="text-4xl mb-3">✅</div>
            <h3 className="text-white font-black text-lg mb-2">Inquiry Received!</h3>
            <p className="text-green-300 text-sm">
              We'll contact you at <strong>{form.contactEmail}</strong> within 24 hours to discuss your enterprise licensing options.
            </p>
          </div>
        )}

        {/* Sport Apps Grid */}
        <div>
          <h2 className="text-xl font-black text-white mb-2">Sport-Specific Platforms Included</h2>
          <p className="text-blue-400 text-sm mb-4">All 44 sports available. Each has dedicated branding, AI coaching, and sport-specific features.</p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {SPORT_APPS.map(app => (
              <Link key={app.name} href={app.href}>
                <div className={`bg-[#0d1b3e] rounded-xl border border-blue-800 p-3 text-center hover:border-blue-600 transition-all cursor-pointer ${app.status === "coming-soon" ? "opacity-60" : ""}`}>
                  <div className="text-2xl mb-1">{app.icon}</div>
                  <div className="text-white text-xs font-bold">{app.name}</div>
                  <div className="text-blue-400 text-[10px]">{app.sport}</div>
                  <div className={`text-[9px] font-black mt-1 ${app.status === "live" ? "text-green-400" : "text-blue-300"}`}>
                    {app.status === "live" ? "● LIVE" : "● SOON"}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* How It Works */}
        <div className="bg-[#0d1b3e] rounded-2xl border border-blue-800 p-6">
          <h2 className="text-xl font-black text-white mb-4 text-center">How White-Label Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { icon: "🏗️", title: "Same Infrastructure", desc: "All platforms run on the AthlynX backend — one codebase, one database, one AI engine. Zero maintenance for you." },
              { icon: "🎨", title: "Your Brand", desc: "Custom logo, colors, domain, and sport-specific features. Athletes see your brand, not ours." },
              { icon: "💰", title: "Revenue Flows", desc: "All subscriptions, AI credits, and NIL transactions flow through your Stripe account. You keep the revenue." },
            ].map((item, i) => (
              <div key={i} className="text-center p-4 bg-blue-900/20 rounded-xl border border-blue-800/40">
                <div className="text-4xl mb-3">{item.icon}</div>
                <h3 className="text-white font-black text-base mb-2">{item.title}</h3>
                <p className="text-blue-300 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-r from-blue-900 to-indigo-900 rounded-2xl border border-blue-700 p-6 text-center">
          <h2 className="text-xl font-black text-white mb-2">Ready to License AthlynX?</h2>
          <p className="text-blue-300 text-sm mb-4">
            Join the growing network of teams, schools, and conferences powered by AthlynXAI.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <a href="mailto:contact@athlynx.ai?subject=White-Label Licensing Inquiry"
              className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-black rounded-xl text-sm hover:opacity-90 transition-all">
              📧 Email Us
            </a>
            <a href="/book"
              className="px-6 py-3 bg-blue-900/50 border border-blue-600 text-white font-black rounded-xl text-sm hover:bg-blue-900 transition-all">
              📞 Call Chad: Book a call
            </a>
          </div>
        </div>

      </div>
      <MobileBottomNav />
    </PlatformLayout>
  );
}

export default function WhiteLabel() {
  return <RouteErrorBoundary><WhiteLabelInner /></RouteErrorBoundary>;
}
