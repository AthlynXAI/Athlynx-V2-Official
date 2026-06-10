/**
 * NILDealBuilder — Comprehensive NIL Deal Creation Wizard
 * AthlynX — ONE IDENTITY. EVERY ATHLETE. EVERY PLATFORM.
 * Brand: true black + electric cobalt + white.
 * Build 15 — Jun 2026
 */
import { useState } from "react";
import { Link } from "wouter";
import { RouteErrorBoundary } from "@/components/GlobalErrorBoundary";
import MobileBottomNav from "@/components/MobileBottomNav";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { toast } from "sonner";
import {
  ArrowLeft, ArrowRight, CheckCircle, DollarSign, FileText,
  Shield, Users, Zap, Star, Target, Calendar, AlertTriangle,
  Building2, Globe, Lock, TrendingUp, Award, ChevronDown,
  ChevronUp, Info, Handshake, Percent, Clock, PenLine
} from "lucide-react";

// ─── Deal Categories ──────────────────────────────────────────────────────────
const DEAL_CATEGORIES = [
  { id: "apparel", label: "Footwear & Apparel", icon: "👟", examples: "Nike, Under Armour, Adidas, New Balance" },
  { id: "beverage", label: "Beverage & Nutrition", icon: "🥤", examples: "Gatorade, Powerade, Celsius, Prime" },
  { id: "automotive", label: "Automotive", icon: "🚗", examples: "Cadillac, BMW, Toyota, Chevrolet" },
  { id: "financial", label: "Financial Services", icon: "💳", examples: "Visa, Chase, State Farm, Mastercard" },
  { id: "food", label: "Food & Restaurant", icon: "🍔", examples: "McDonald's, Subway, Chipotle, Taco Bell" },
  { id: "tech", label: "Technology & Gaming", icon: "📱", examples: "Samsung, EA Sports, Beats, Apple" },
  { id: "equipment", label: "Sports Equipment", icon: "🏋️", examples: "Wilson, Rawlings, Callaway, Bauer" },
  { id: "health", label: "Health & Wellness", icon: "💊", examples: "GNC, Thorne, Whoop, Hyperice" },
  { id: "media", label: "Media & Entertainment", icon: "🎬", examples: "ESPN, YouTube, Twitch, Spotify" },
  { id: "education", label: "Education & Tutoring", icon: "📚", examples: "Chegg, Course Hero, Varsity Tutors" },
  { id: "crypto", label: "Crypto & Web3", icon: "₿", examples: "Coinbase, FTX, Crypto.com" },
  { id: "other", label: "Other", icon: "🤝", examples: "Any brand or business" },
];

const EXCLUSIVITY_OPTIONS = [
  { id: "none", label: "No Exclusivity", desc: "You can work with competing brands" },
  { id: "category", label: "Category Exclusive", desc: "Exclusive within this product category only" },
  { id: "full", label: "Full Exclusive", desc: "Cannot work with any competing brands" },
];

const PAYMENT_STRUCTURES = [
  { id: "flat", label: "Flat Fee", desc: "One-time or recurring fixed payment" },
  { id: "per_post", label: "Per Post / Appearance", desc: "Paid per deliverable completed" },
  { id: "royalty", label: "Royalty / Revenue Share", desc: "Percentage of product sales" },
  { id: "hybrid", label: "Hybrid", desc: "Base fee + performance bonuses" },
];

const DELIVERABLE_TYPES = [
  "Instagram Post", "Instagram Story", "TikTok Video", "YouTube Video",
  "Twitter/X Post", "Facebook Post", "Event Appearance", "Autograph Session",
  "Commercial Shoot", "Print/Digital Ad", "Podcast Episode", "Blog Post",
  "Product Endorsement", "Signature Product Line", "Training Camp Appearance",
];

// ─── Step Components ──────────────────────────────────────────────────────────
interface DealData {
  // Step 1: Brand
  brandName: string;
  brandWebsite: string;
  brandCategory: string;
  brandContact: string;
  brandContactEmail: string;
  // Step 2: Deal Terms
  dealValue: string;
  paymentStructure: string;
  royaltyPercent: string;
  bonusThreshold: string;
  bonusAmount: string;
  currency: string;
  // Step 3: Deliverables
  deliverables: string[];
  customDeliverable: string;
  startDate: string;
  endDate: string;
  exclusivity: string;
  // Step 4: Rights & Restrictions
  usageRights: string[];
  geographicScope: string;
  socialHandleTag: boolean;
  approvalRequired: boolean;
  contentGuidelines: string;
  // Step 5: Notes
  description: string;
  agentName: string;
  agentEmail: string;
  internalNotes: string;
}

const INITIAL_DEAL: DealData = {
  brandName: "", brandWebsite: "", brandCategory: "apparel",
  brandContact: "", brandContactEmail: "",
  dealValue: "", paymentStructure: "flat", royaltyPercent: "",
  bonusThreshold: "", bonusAmount: "", currency: "USD",
  deliverables: [], customDeliverable: "",
  startDate: "", endDate: "", exclusivity: "none",
  usageRights: [], geographicScope: "national",
  socialHandleTag: true, approvalRequired: true, contentGuidelines: "",
  description: "", agentName: "", agentEmail: "", internalNotes: "",
};

const STEPS = [
  { id: 1, label: "Brand Info", icon: Building2 },
  { id: 2, label: "Deal Terms", icon: DollarSign },
  { id: 3, label: "Deliverables", icon: FileText },
  { id: 4, label: "Rights", icon: Shield },
  { id: 5, label: "Review", icon: CheckCircle },
];

// ─── Component ────────────────────────────────────────────────────────────────
function NILDealBuilderInner() {
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [deal, setDeal] = useState<DealData>(INITIAL_DEAL);
  const [submitted, setSubmitted] = useState(false);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const utils = trpc.useUtils();
  const createDeal = trpc.nil.createDeal.useMutation({
    onSuccess: () => {
      utils.nil.getMyDeals.invalidate();
      setSubmitted(true);
      toast.success("NIL Deal created successfully!");
    },
    onError: (err) => {
      toast.error("Failed to create deal. Please try again.");
    },
  });

  const update = (key: keyof DealData, value: any) =>
    setDeal((prev) => ({ ...prev, [key]: value }));

  const toggleDeliverable = (d: string) => {
    setDeal((prev) => ({
      ...prev,
      deliverables: prev.deliverables.includes(d)
        ? prev.deliverables.filter((x) => x !== d)
        : [...prev.deliverables, d],
    }));
  };

  const toggleRight = (r: string) => {
    setDeal((prev) => ({
      ...prev,
      usageRights: prev.usageRights.includes(r)
        ? prev.usageRights.filter((x) => x !== r)
        : [...prev.usageRights, r],
    }));
  };

  const handleSubmit = () => {
    if (!user) {
      toast.error("Please sign in to create a deal.");
      return;
    }
    createDeal.mutate({
      brandName: deal.brandName,
      dealValue: parseFloat(deal.dealValue) || 0,
      description: `${deal.description}\n\nDeliverables: ${deal.deliverables.join(", ")}\nPayment: ${deal.paymentStructure}\nExclusivity: ${deal.exclusivity}`,
      category: deal.brandCategory,
    });
  };

  const selectedCategory = DEAL_CATEGORIES.find((c) => c.id === deal.brandCategory);

  if (submitted) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center pb-24 px-4">
        <div className="max-w-md w-full text-center space-y-6">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="font-black text-2xl">Deal Created!</h2>
          <p className="text-white/60">
            Your NIL deal with <span className="text-[#0057FF] font-bold">{deal.brandName}</span> has been
            logged in your NIL Vault. Track it in your portal.
          </p>
          <div className="bg-white/5 rounded-2xl border border-white/10 p-5 text-left space-y-3">
            <div className="flex justify-between">
              <span className="text-white/50 text-sm">Brand</span>
              <span className="font-bold">{deal.brandName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/50 text-sm">Deal Value</span>
              <span className="font-black text-green-400">${parseFloat(deal.dealValue || "0").toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/50 text-sm">Category</span>
              <span className="font-bold">{selectedCategory?.label}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/50 text-sm">Deliverables</span>
              <span className="font-bold">{deal.deliverables.length} items</span>
            </div>
          </div>
          <div className="flex gap-3">
            <Link href="/nil-portal">
              <button className="flex-1 px-4 py-3 bg-[#0057FF] hover:bg-blue-600 rounded-xl font-bold transition-colors">
                View in NIL Portal
              </button>
            </Link>
            <button
              onClick={() => { setDeal(INITIAL_DEAL); setStep(1); setSubmitted(false); }}
              className="flex-1 px-4 py-3 bg-white/10 hover:bg-white/20 rounded-xl font-bold transition-colors"
            >
              Create Another
            </button>
          </div>
        </div>
        <MobileBottomNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white pb-24">
      {/* Header */}
      <div className="bg-gradient-to-b from-[#0a0a0a] to-black border-b border-white/10 px-4 pt-6 pb-4">
        <div className="max-w-2xl mx-auto">
          <Link href="/nil-portal">
            <button className="flex items-center gap-2 text-white/50 hover:text-white text-sm mb-4 transition-colors">
              <ArrowLeft className="w-4 h-4" /> Back to NIL Portal
            </button>
          </Link>
          <div className="flex items-center gap-3 mb-4">
            <Handshake className="w-7 h-7 text-[#0057FF]" />
            <div>
              <h1 className="text-xl font-black">NIL DEAL BUILDER</h1>
              <p className="text-white/50 text-xs">Create and log your NIL deals with full contract details</p>
            </div>
          </div>

          {/* Step Progress */}
          <div className="flex items-center gap-1">
            {STEPS.map((s, i) => (
              <div key={s.id} className="flex items-center flex-1">
                <button
                  onClick={() => step > s.id && setStep(s.id)}
                  className={`flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-xs font-bold transition-all flex-1 justify-center ${
                    step === s.id
                      ? "bg-[#0057FF] text-white"
                      : step > s.id
                      ? "bg-green-600/20 text-green-400 cursor-pointer hover:bg-green-600/30"
                      : "bg-white/5 text-white/30"
                  }`}
                >
                  {step > s.id ? (
                    <CheckCircle className="w-3 h-3" />
                  ) : (
                    <s.icon className="w-3 h-3" />
                  )}
                  <span className="hidden sm:inline">{s.label}</span>
                  <span className="sm:hidden">{s.id}</span>
                </button>
                {i < STEPS.length - 1 && (
                  <div className={`w-2 h-0.5 mx-0.5 ${step > s.id ? "bg-green-600" : "bg-white/10"}`} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* Step 1: Brand Info */}
        {step === 1 && (
          <div className="space-y-5">
            <h2 className="font-black text-lg">Brand Information</h2>

            <div className="space-y-4">
              <div>
                <label className="text-white/60 text-sm mb-1.5 block font-medium">Brand / Company Name *</label>
                <input
                  value={deal.brandName}
                  onChange={(e) => update("brandName", e.target.value)}
                  placeholder="e.g. Gatorade, Nike, Local Business..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-[#0057FF]/50 text-sm"
                />
              </div>

              <div>
                <label className="text-white/60 text-sm mb-1.5 block font-medium">Brand Website</label>
                <input
                  value={deal.brandWebsite}
                  onChange={(e) => update("brandWebsite", e.target.value)}
                  placeholder="https://brand.com"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-[#0057FF]/50 text-sm"
                />
              </div>

              <div>
                <label className="text-white/60 text-sm mb-2 block font-medium">Deal Category *</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {DEAL_CATEGORIES.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => update("brandCategory", cat.id)}
                      className={`flex items-center gap-2 p-3 rounded-xl border text-left transition-all ${
                        deal.brandCategory === cat.id
                          ? "bg-[#0057FF]/10 border-[#0057FF]/50 text-white"
                          : "bg-white/5 border-white/10 text-white/60 hover:text-white hover:border-white/30"
                      }`}
                    >
                      <span className="text-lg">{cat.icon}</span>
                      <span className="text-xs font-bold leading-tight">{cat.label}</span>
                    </button>
                  ))}
                </div>
                {selectedCategory && (
                  <p className="text-white/30 text-xs mt-2 flex items-center gap-1">
                    <Info className="w-3 h-3" /> Examples: {selectedCategory.examples}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-white/60 text-sm mb-1.5 block font-medium">Brand Contact Name</label>
                  <input
                    value={deal.brandContact}
                    onChange={(e) => update("brandContact", e.target.value)}
                    placeholder="John Smith"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-[#0057FF]/50 text-sm"
                  />
                </div>
                <div>
                  <label className="text-white/60 text-sm mb-1.5 block font-medium">Contact Email</label>
                  <input
                    value={deal.brandContactEmail}
                    onChange={(e) => update("brandContactEmail", e.target.value)}
                    placeholder="john@brand.com"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-[#0057FF]/50 text-sm"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Deal Terms */}
        {step === 2 && (
          <div className="space-y-5">
            <h2 className="font-black text-lg">Deal Terms & Compensation</h2>

            <div className="space-y-4">
              <div>
                <label className="text-white/60 text-sm mb-2 block font-medium">Payment Structure *</label>
                <div className="grid grid-cols-2 gap-2">
                  {PAYMENT_STRUCTURES.map((ps) => (
                    <button
                      key={ps.id}
                      onClick={() => update("paymentStructure", ps.id)}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        deal.paymentStructure === ps.id
                          ? "bg-[#0057FF]/10 border-[#0057FF]/50"
                          : "bg-white/5 border-white/10 hover:border-white/30"
                      }`}
                    >
                      <div className="font-bold text-sm">{ps.label}</div>
                      <div className="text-white/40 text-xs mt-0.5">{ps.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-white/60 text-sm mb-1.5 block font-medium">
                  {deal.paymentStructure === "royalty" ? "Annual Revenue Share Value (est.)" : "Total Deal Value ($) *"}
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                  <input
                    type="number"
                    value={deal.dealValue}
                    onChange={(e) => update("dealValue", e.target.value)}
                    placeholder="0"
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-[#0057FF]/50 text-sm"
                  />
                </div>
              </div>

              {(deal.paymentStructure === "royalty" || deal.paymentStructure === "hybrid") && (
                <div>
                  <label className="text-white/60 text-sm mb-1.5 block font-medium">Royalty Percentage (%)</label>
                  <div className="relative">
                    <Percent className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                    <input
                      type="number"
                      value={deal.royaltyPercent}
                      onChange={(e) => update("royaltyPercent", e.target.value)}
                      placeholder="5"
                      min="0" max="100"
                      className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-[#0057FF]/50 text-sm"
                    />
                  </div>
                </div>
              )}

              {(deal.paymentStructure === "hybrid") && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-white/60 text-sm mb-1.5 block font-medium">Bonus Threshold</label>
                    <input
                      value={deal.bonusThreshold}
                      onChange={(e) => update("bonusThreshold", e.target.value)}
                      placeholder="e.g. Win championship"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-[#0057FF]/50 text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-white/60 text-sm mb-1.5 block font-medium">Bonus Amount ($)</label>
                    <input
                      type="number"
                      value={deal.bonusAmount}
                      onChange={(e) => update("bonusAmount", e.target.value)}
                      placeholder="10000"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-[#0057FF]/50 text-sm"
                    />
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-white/60 text-sm mb-1.5 block font-medium">Start Date</label>
                  <input
                    type="date"
                    value={deal.startDate}
                    onChange={(e) => update("startDate", e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#0057FF]/50 text-sm"
                  />
                </div>
                <div>
                  <label className="text-white/60 text-sm mb-1.5 block font-medium">End Date</label>
                  <input
                    type="date"
                    value={deal.endDate}
                    onChange={(e) => update("endDate", e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#0057FF]/50 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="text-white/60 text-sm mb-2 block font-medium">Exclusivity</label>
                <div className="space-y-2">
                  {EXCLUSIVITY_OPTIONS.map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => update("exclusivity", opt.id)}
                      className={`w-full flex items-center gap-3 p-3 rounded-xl border text-left transition-all ${
                        deal.exclusivity === opt.id
                          ? "bg-[#0057FF]/10 border-[#0057FF]/50"
                          : "bg-white/5 border-white/10 hover:border-white/30"
                      }`}
                    >
                      <div className={`w-4 h-4 rounded-full border-2 flex-shrink-0 ${
                        deal.exclusivity === opt.id ? "border-[#0057FF] bg-[#0057FF]" : "border-white/30"
                      }`} />
                      <div>
                        <div className="font-bold text-sm">{opt.label}</div>
                        <div className="text-white/40 text-xs">{opt.desc}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Deliverables */}
        {step === 3 && (
          <div className="space-y-5">
            <h2 className="font-black text-lg">Deliverables & Requirements</h2>

            <div>
              <label className="text-white/60 text-sm mb-2 block font-medium">
                Select Deliverables ({deal.deliverables.length} selected)
              </label>
              <div className="grid grid-cols-2 gap-2">
                {DELIVERABLE_TYPES.map((d) => (
                  <button
                    key={d}
                    onClick={() => toggleDeliverable(d)}
                    className={`flex items-center gap-2 p-3 rounded-xl border text-left text-sm transition-all ${
                      deal.deliverables.includes(d)
                        ? "bg-[#0057FF]/10 border-[#0057FF]/50 text-white"
                        : "bg-white/5 border-white/10 text-white/60 hover:text-white hover:border-white/30"
                    }`}
                  >
                    {deal.deliverables.includes(d) ? (
                      <CheckCircle className="w-4 h-4 text-[#0057FF] flex-shrink-0" />
                    ) : (
                      <div className="w-4 h-4 rounded border border-white/20 flex-shrink-0" />
                    )}
                    <span className="font-medium leading-tight">{d}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-white/60 text-sm mb-1.5 block font-medium">Custom Deliverable</label>
              <div className="flex gap-2">
                <input
                  value={deal.customDeliverable}
                  onChange={(e) => update("customDeliverable", e.target.value)}
                  placeholder="Add custom deliverable..."
                  className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-[#0057FF]/50 text-sm"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && deal.customDeliverable.trim()) {
                      toggleDeliverable(deal.customDeliverable.trim());
                      update("customDeliverable", "");
                    }
                  }}
                />
                <button
                  onClick={() => {
                    if (deal.customDeliverable.trim()) {
                      toggleDeliverable(deal.customDeliverable.trim());
                      update("customDeliverable", "");
                    }
                  }}
                  className="px-4 py-3 bg-[#0057FF] hover:bg-blue-600 rounded-xl text-sm font-bold transition-colors"
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Rights & Restrictions */}
        {step === 4 && (
          <div className="space-y-5">
            <h2 className="font-black text-lg">Usage Rights & Restrictions</h2>

            <div>
              <label className="text-white/60 text-sm mb-2 block font-medium">Usage Rights Granted</label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  "Social Media", "Print Advertising", "TV Commercial",
                  "Digital/Online Ads", "In-Store Signage", "Packaging",
                  "Website", "Email Marketing", "Outdoor Billboards", "Radio",
                ].map((right) => (
                  <button
                    key={right}
                    onClick={() => toggleRight(right)}
                    className={`flex items-center gap-2 p-3 rounded-xl border text-left text-sm transition-all ${
                      deal.usageRights.includes(right)
                        ? "bg-[#0057FF]/10 border-[#0057FF]/50 text-white"
                        : "bg-white/5 border-white/10 text-white/60 hover:text-white"
                    }`}
                  >
                    {deal.usageRights.includes(right) ? (
                      <CheckCircle className="w-4 h-4 text-[#0057FF] flex-shrink-0" />
                    ) : (
                      <div className="w-4 h-4 rounded border border-white/20 flex-shrink-0" />
                    )}
                    <span className="font-medium">{right}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-white/60 text-sm mb-2 block font-medium">Geographic Scope</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: "local", label: "Local", desc: "City/region only" },
                  { id: "national", label: "National", desc: "USA only" },
                  { id: "global", label: "Global", desc: "Worldwide" },
                ].map((scope) => (
                  <button
                    key={scope.id}
                    onClick={() => update("geographicScope", scope.id)}
                    className={`p-3 rounded-xl border text-center transition-all ${
                      deal.geographicScope === scope.id
                        ? "bg-[#0057FF]/10 border-[#0057FF]/50"
                        : "bg-white/5 border-white/10 hover:border-white/30"
                    }`}
                  >
                    <div className="font-bold text-sm">{scope.label}</div>
                    <div className="text-white/40 text-xs">{scope.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between bg-white/5 rounded-xl border border-white/10 p-4">
                <div>
                  <div className="font-bold text-sm">Require Brand Tag</div>
                  <div className="text-white/40 text-xs">Brand must tag your handle in posts</div>
                </div>
                <button
                  onClick={() => update("socialHandleTag", !deal.socialHandleTag)}
                  className={`w-12 h-6 rounded-full transition-colors ${deal.socialHandleTag ? "bg-[#0057FF]" : "bg-white/20"}`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full transition-transform mx-0.5 ${deal.socialHandleTag ? "translate-x-6" : "translate-x-0"}`} />
                </button>
              </div>

              <div className="flex items-center justify-between bg-white/5 rounded-xl border border-white/10 p-4">
                <div>
                  <div className="font-bold text-sm">Content Approval Required</div>
                  <div className="text-white/40 text-xs">You must approve all content before publication</div>
                </div>
                <button
                  onClick={() => update("approvalRequired", !deal.approvalRequired)}
                  className={`w-12 h-6 rounded-full transition-colors ${deal.approvalRequired ? "bg-[#0057FF]" : "bg-white/20"}`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full transition-transform mx-0.5 ${deal.approvalRequired ? "translate-x-6" : "translate-x-0"}`} />
                </button>
              </div>
            </div>

            <div>
              <label className="text-white/60 text-sm mb-1.5 block font-medium">Content Guidelines / Notes</label>
              <textarea
                value={deal.contentGuidelines}
                onChange={(e) => update("contentGuidelines", e.target.value)}
                placeholder="Any specific content requirements, restrictions, or guidelines..."
                rows={3}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-[#0057FF]/50 text-sm resize-none"
              />
            </div>

            <div>
              <label className="text-white/60 text-sm mb-1.5 block font-medium">Deal Description / Summary</label>
              <textarea
                value={deal.description}
                onChange={(e) => update("description", e.target.value)}
                placeholder="Describe the deal in your own words..."
                rows={3}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-[#0057FF]/50 text-sm resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-white/60 text-sm mb-1.5 block font-medium">Agent / Advisor Name</label>
                <input
                  value={deal.agentName}
                  onChange={(e) => update("agentName", e.target.value)}
                  placeholder="Optional"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-[#0057FF]/50 text-sm"
                />
              </div>
              <div>
                <label className="text-white/60 text-sm mb-1.5 block font-medium">Agent Email</label>
                <input
                  value={deal.agentEmail}
                  onChange={(e) => update("agentEmail", e.target.value)}
                  placeholder="agent@firm.com"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-[#0057FF]/50 text-sm"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 5: Review & Submit */}
        {step === 5 && (
          <div className="space-y-5">
            <h2 className="font-black text-lg">Review & Create Deal</h2>

            <div className="bg-white/5 rounded-2xl border border-white/10 divide-y divide-white/10">
              {/* Brand */}
              <div className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Building2 className="w-4 h-4 text-[#0057FF]" />
                  <span className="font-bold text-sm">Brand</span>
                  <button onClick={() => setStep(1)} className="ml-auto text-white/30 hover:text-white text-xs">Edit</button>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-white/50">Brand Name</span>
                    <span className="font-bold">{deal.brandName || "—"}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-white/50">Category</span>
                    <span>{selectedCategory?.label}</span>
                  </div>
                  {deal.brandContact && (
                    <div className="flex justify-between text-sm">
                      <span className="text-white/50">Contact</span>
                      <span>{deal.brandContact}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Deal Terms */}
              <div className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <DollarSign className="w-4 h-4 text-green-400" />
                  <span className="font-bold text-sm">Deal Terms</span>
                  <button onClick={() => setStep(2)} className="ml-auto text-white/30 hover:text-white text-xs">Edit</button>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-white/50">Total Value</span>
                    <span className="font-black text-green-400">${parseFloat(deal.dealValue || "0").toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-white/50">Payment Type</span>
                    <span>{PAYMENT_STRUCTURES.find(p => p.id === deal.paymentStructure)?.label}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-white/50">Exclusivity</span>
                    <span>{EXCLUSIVITY_OPTIONS.find(e => e.id === deal.exclusivity)?.label}</span>
                  </div>
                  {deal.startDate && (
                    <div className="flex justify-between text-sm">
                      <span className="text-white/50">Duration</span>
                      <span>{deal.startDate} → {deal.endDate || "Open"}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Deliverables */}
              <div className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <FileText className="w-4 h-4 text-purple-400" />
                  <span className="font-bold text-sm">Deliverables</span>
                  <button onClick={() => setStep(3)} className="ml-auto text-white/30 hover:text-white text-xs">Edit</button>
                </div>
                {deal.deliverables.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5">
                    {deal.deliverables.map((d) => (
                      <span key={d} className="bg-white/10 text-white/70 text-xs px-2 py-1 rounded-full">{d}</span>
                    ))}
                  </div>
                ) : (
                  <span className="text-white/30 text-sm">No deliverables specified</span>
                )}
              </div>

              {/* Rights */}
              <div className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Shield className="w-4 h-4 text-cyan-400" />
                  <span className="font-bold text-sm">Rights & Scope</span>
                  <button onClick={() => setStep(4)} className="ml-auto text-white/30 hover:text-white text-xs">Edit</button>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-white/50">Geographic Scope</span>
                    <span className="capitalize">{deal.geographicScope}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-white/50">Content Approval</span>
                    <span>{deal.approvalRequired ? "Required" : "Not Required"}</span>
                  </div>
                  {deal.usageRights.length > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-white/50">Usage Rights</span>
                      <span>{deal.usageRights.length} granted</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* NCAA Compliance Notice */}
            <div className="bg-blue-600/5 border border-blue-500/20 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-sm text-blue-400 mb-1">NCAA Compliance Notice</div>
                  <p className="text-white/50 text-xs leading-relaxed">
                    Ensure this deal complies with your school's NIL policy and NCAA regulations.
                    Report this deal to your athletic department as required. AthlynX is not a
                    legal advisor — consult your school's compliance office or a sports attorney.
                  </p>
                </div>
              </div>
            </div>

            {!user && (
              <div className="bg-[#0057FF]/10 border border-[#0057FF]/30 rounded-xl p-4 text-center">
                <p className="text-white/70 text-sm mb-3">Sign in to save this deal to your NIL Vault</p>
                <Link href="/sign-in">
                  <button className="px-6 py-2 bg-[#0057FF] hover:bg-blue-600 rounded-xl text-sm font-bold transition-colors">
                    Sign In
                  </button>
                </Link>
              </div>
            )}
          </div>
        )}

        {/* Navigation */}
        <div className="flex gap-3 mt-8">
          {step > 1 && (
            <button
              onClick={() => setStep(step - 1)}
              className="flex items-center gap-2 px-5 py-3 bg-white/10 hover:bg-white/20 rounded-xl font-bold transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
          )}
          {step < 5 ? (
            <button
              onClick={() => setStep(step + 1)}
              disabled={step === 1 && !deal.brandName}
              className="flex-1 flex items-center justify-center gap-2 px-5 py-3 bg-[#0057FF] hover:bg-blue-600 disabled:opacity-40 disabled:cursor-not-allowed rounded-xl font-bold transition-colors"
            >
              Continue <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={createDeal.isPending || !deal.brandName || !deal.dealValue}
              className="flex-1 flex items-center justify-center gap-2 px-5 py-3 bg-green-600 hover:bg-green-500 disabled:opacity-40 disabled:cursor-not-allowed rounded-xl font-bold transition-colors"
            >
              {createDeal.isPending ? (
                "Creating Deal..."
              ) : (
                <>
                  <CheckCircle className="w-4 h-4" /> Create NIL Deal
                </>
              )}
            </button>
          )}
        </div>
      </div>

      <MobileBottomNav />
    </div>
  );
}

export default function NILDealBuilder() {
  return (
    <RouteErrorBoundary>
      <NILDealBuilderInner />
    </RouteErrorBoundary>
  );
}
