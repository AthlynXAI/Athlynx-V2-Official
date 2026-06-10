import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Sparkles, Plus } from "lucide-react";
import { trpc } from "@/lib/trpc";
import PlatformLayout from "@/components/PlatformLayout";
import MobileBottomNav from "@/components/MobileBottomNav";
import { RouteErrorBoundary } from "@/components/GlobalErrorBoundary";

const TIERS = ["iconic", "major", "regional", "local"] as const;
type Tier = (typeof TIERS)[number];

const TIER_META: Record<Tier, { label: string; description: string; accent: string }> = {
  iconic: {
    label: "Iconic",
    description: "Nike. Coca-Cola. Wheaties. The names every athlete wants on their chest.",
    accent: "from-blue-600 to-blue-300",
  },
  major: {
    label: "Major",
    description: "National household brands. Big budgets. Bigger reach.",
    accent: "from-cyan-500 to-blue-600",
  },
  regional: {
    label: "Regional",
    description: "Strong in a state or a market. Where the real local fits happen.",
    accent: "from-emerald-500 to-teal-600",
  },
  local: {
    label: "Local",
    description: "Hometown businesses ready to back hometown athletes.",
    accent: "from-purple-500 to-pink-600",
  },
};

function BrandWallInner() {
  const [submitOpen, setSubmitOpen] = useState(false);
  const [form, setForm] = useState({ brandName: "", brandDomain: "", category: "", suggestedTier: "major" as Tier });

  const wallQ = trpc.brandWall.listApproved.useQuery({ tier: "all", limit: 200 });
  const submit = trpc.brandWall.submitBrand.useMutation({
    onSuccess: () => {
      setSubmitOpen(false);
      setForm({ brandName: "", brandDomain: "", category: "", suggestedTier: "major" });
      wallQ.refetch();
    },
  });

  const entries = wallQ.data ?? [];
  const byTier: Record<Tier, any[]> = { iconic: [], major: [], regional: [], local: [] };
  for (const e of entries) {
    if ((TIERS as readonly string[]).includes(e.tier)) byTier[e.tier as Tier].push(e);
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white">
      <header className="sticky top-0 z-40 bg-slate-950/95 backdrop-blur-md border-b border-slate-800">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/">
            <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Home
            </Button>
          </Link>
          <Button
            size="sm"
            className="bg-blue-900/40 hover:bg-blue-900/40 text-black font-semibold"
            onClick={() => setSubmitOpen(true)}
          >
            <Plus className="w-4 h-4 mr-1" />
            Submit a brand
          </Button>
        </div>
      </header>

      <section className="container mx-auto px-4 py-10 max-w-6xl">
        <div className="flex items-center gap-3 mb-2">
          <Sparkles className="w-6 h-6 text-blue-400" />
          <div className="text-blue-400 text-xs font-semibold tracking-wider">AthlynX BRAND WALL</div>
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold mb-3">
          Every brand. One wall. Real receipts.
        </h1>
        <p className="text-slate-300 max-w-2xl">
          Athletes pitch the brands they want. Founder curates the wall. When a deal gets
          signed, it shows up on the athlete's profile as a real receipt — not a wishlist.
        </p>
      </section>

      {/* Submit modal */}
      {submitOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4"
          onClick={() => setSubmitOpen(false)}
        >
          <div
            className="bg-slate-900 border border-slate-700 rounded-xl p-6 max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-bold mb-4">Submit a brand</h3>
            <div className="space-y-3">
              <input
                className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2 text-sm"
                placeholder="Brand name (required)"
                value={form.brandName}
                onChange={(e) => setForm({ ...form, brandName: e.target.value })}
              />
              <input
                className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2 text-sm"
                placeholder="Website (optional)"
                value={form.brandDomain}
                onChange={(e) => setForm({ ...form, brandDomain: e.target.value })}
              />
              <input
                className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2 text-sm"
                placeholder="Category (apparel, beverage, tech, etc)"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
              />
              <select
                className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2 text-sm"
                value={form.suggestedTier}
                onChange={(e) => setForm({ ...form, suggestedTier: e.target.value as Tier })}
              >
                <option value="iconic">Iconic</option>
                <option value="major">Major</option>
                <option value="regional">Regional</option>
                <option value="local">Local</option>
              </select>
            </div>
            <div className="flex gap-2 mt-5">
              <Button
                variant="ghost"
                className="flex-1 text-slate-400"
                onClick={() => setSubmitOpen(false)}
              >
                Cancel
              </Button>
              <Button
                className="flex-1 bg-blue-900/40 hover:bg-blue-900/40 text-black font-semibold"
                disabled={!form.brandName.trim() || submit.isPending}
                onClick={() =>
                  submit.mutate({
                    brandName: form.brandName.trim(),
                    brandDomain: form.brandDomain.trim() || undefined,
                    category: form.category.trim() || undefined,
                    suggestedTier: form.suggestedTier,
                  })
                }
              >
                {submit.isPending ? "Submitting…" : "Submit"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Tiers */}
      <section className="container mx-auto px-4 pb-12 max-w-6xl space-y-10">
        {TIERS.map((tier) => {
          const items = byTier[tier];
          const meta = TIER_META[tier];
          return (
            <div key={tier}>
              <div className="flex items-baseline gap-3 mb-1">
                <h2
                  className={`text-3xl font-bold bg-gradient-to-r ${meta.accent} bg-clip-text text-transparent`}
                >
                  {meta.label}
                </h2>
                <span className="text-slate-500 text-sm">{items.length} brands</span>
              </div>
              <p className="text-slate-400 text-sm mb-4 max-w-2xl">{meta.description}</p>
              {items.length === 0 ? (
                <Card className="bg-slate-900 border-slate-800">
                  <CardContent className="p-5 text-slate-500 text-sm">
                    No brands here yet. Submit one and help build this tier.
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
                  {items.map((b: any) => (
                    <Card
                      key={b.id}
                      className="bg-slate-900 border-slate-800 hover:border-blue-500/40 transition-colors"
                    >
                      <CardContent className="p-3 aspect-square flex flex-col items-center justify-center text-center">
                        {b.brandLogoUrl ? (
                          <img
                            src={b.brandLogoUrl}
                            alt={b.brandName}
                            className="w-12 h-12 object-contain mb-2"
                          />
                        ) : (
                          <div
                            className={`w-12 h-12 rounded bg-gradient-to-br ${meta.accent} flex items-center justify-center font-bold text-sm mb-2`}
                          >
                            {b.brandName.slice(0, 2).toUpperCase()}
                          </div>
                        )}
                        <div className="text-xs font-medium leading-tight line-clamp-2">
                          {b.brandName}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </section>

      <footer className="container mx-auto px-4 py-8 max-w-6xl text-center text-slate-500 text-xs border-t border-slate-800">
        Iron Sharpens Iron — Proverbs 27:17
      </footer>
      <MobileBottomNav />
    </div>
  );
}

export default function BrandWall() {
  return (
    <RouteErrorBoundary>
      <PlatformLayout>
        <BrandWallInner />
      </PlatformLayout>
    </RouteErrorBoundary>
  );
}
