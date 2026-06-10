// AthlynXAI OS v1 — AthlynX Commerce & Vendor Marketplace
// Shop by collection, vendor directory, become-a-partner tab.
import { useState } from "react";
import { Link } from "wouter";

const COLLECTIONS = [
  { id: "athlynx-sportswear", name: "AthlynX Sportswear", items: 4, icon: "", description: "Premium performance apparel for elite athletes" },
  { id: "diamond-grind-gear", name: "Diamond Grind Gear", items: 2, icon: "", description: "Pro baseball training equipment and gear" },
  { id: "warriors-playbook-gear", name: "Warriors Playbook Gear", items: 1, icon: "", description: "Basketball coaching and training tools" },
  { id: "nil-merchandise", name: "NIL Merchandise", items: 1, icon: "", description: "Athlete branded NIL merchandise" },
  { id: "athlynxai-apparel", name: "AthlynXAI Branded Apparel", items: 1, icon: "", description: "Official AthlynXAI OS branded gear" },
  { id: "athletic-equipment", name: "Athletic Equipment", items: 1, icon: "", description: "Pro-grade training equipment" },
  { id: "accessories", name: "Accessories", items: 1, icon: "", description: "Athlete lifestyle accessories" },
];

const PRODUCTS = [
  { id: 1, name: "AthlynX Training Tee", price: "$34.99", collection: "AthlynX Sportswear", image: "", vendor: "ICC-USA", status: "In Stock" },
  { id: 2, name: "AthlynX Training Shorts", price: "$44.99", collection: "AthlynX Sportswear", image: "", vendor: "ICC-USA", status: "In Stock" },
  { id: 3, name: "AthlynX Performance Hoodie", price: "$69.99", collection: "AthlynX Sportswear", image: "", vendor: "ICC-USA", status: "In Stock" },
  { id: 4, name: "AthlynX Compression Leggings", price: "$54.99", collection: "AthlynX Sportswear", image: "", vendor: "ICC-USA", status: "In Stock" },
  { id: 5, name: "Diamond Grind Pro Batting Gloves", price: "$49.99", collection: "Diamond Grind Gear", image: "", vendor: "ICC-USA", status: "In Stock" },
  { id: 6, name: "Diamond Grind Training Batting Helmet", price: "$89.99", collection: "Diamond Grind Gear", image: "", vendor: "ICC-USA", status: "In Stock" },
  { id: 7, name: "Warriors Playbook Pro Coaching Binder", price: "$39.99", collection: "Warriors Playbook Gear", image: "", vendor: "ICC-USA", status: "In Stock" },
  { id: 8, name: "NIL Athlete Snapback Hat", price: "$29.99", collection: "NIL Merchandise", image: "", vendor: "ICC-USA", status: "In Stock" },
  { id: 9, name: "AthlynXAI Logo Performance Tee", price: "$39.99", collection: "AthlynXAI Branded Apparel", image: "", vendor: "ICC-USA", status: "In Stock" },
  { id: 10, name: "Pro Resistance Band Set", price: "$24.99", collection: "Athletic Equipment", image: "", vendor: "ICC-USA", status: "In Stock" },
  { id: 11, name: "Insulated Athlete Water Bottle", price: "$34.99", collection: "Accessories", image: "", vendor: "ICC-USA", status: "In Stock" },
];

const VENDORS = [
  { id: "icc-usa", name: "ICC-USA", category: "Primary Fulfillment Partner", products: 11, status: "Active", description: "Full-service fulfillment, print-on-demand, and wholesale athletic gear supplier." },
];

export default function VendorMarketplace() {
  const [tab, setTab] = useState<"shop" | "vendors" | "partner">("shop");
  const [selectedCollection, setSelectedCollection] = useState<string | null>(null);

  const filteredProducts = selectedCollection
    ? PRODUCTS.filter(p => p.collection === selectedCollection)
    : PRODUCTS;

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="border-b border-white/10 bg-black/80 backdrop-blur sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="text-white/50 hover:text-white text-sm">← Home</Link>
            <span className="text-white/20">/</span>
            <span className="text-[#1E90FF] font-bold">AthlynX Store</span>
          </div>
          <a href="https://0010yz-fn.myshopify.com" target="_blank" rel="noopener noreferrer" className="px-4 py-2 bg-[#1E90FF] text-white rounded-lg text-sm font-bold hover:bg-[#1E90FF]/80 transition-colors">
            Open Shopify Store →
          </a>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Hero */}
        <div className="text-center mb-10">
          <div className="text-5xl mb-4 hidden"></div>
          <h1 className="text-4xl font-black tracking-tight mb-2">AthlynX Commerce</h1>
          <p className="text-white/50 text-lg">Official gear, equipment & athlete merchandise. Fulfilled by ICC-USA.</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: "Products", value: "11" },
            { label: "Collections", value: "7" },
            { label: "Fulfillment Partner", value: "ICC-USA" },
          ].map(s => (
            <div key={s.label} className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
              <div className="text-2xl font-black text-[#1E90FF]">{s.value}</div>
              <div className="text-white/50 text-sm mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-white/10">
          {(["shop", "vendors", "partner"] as const).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2 text-sm font-semibold capitalize transition-colors border-b-2 -mb-px ${tab === t ? "border-[#1E90FF] text-[#1E90FF]" : "border-transparent text-white/50 hover:text-white"}`}
            >
              {t === "partner" ? "Become a Partner" : t === "vendors" ? "Vendor Directory" : "Shop"}
            </button>
          ))}
        </div>

        {/* Shop Tab */}
        {tab === "shop" && (
          <div>
            {/* Collections */}
            <div className="flex gap-2 flex-wrap mb-6">
              <button
                onClick={() => setSelectedCollection(null)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${!selectedCollection ? "bg-[#1E90FF] text-white" : "bg-white/10 text-white/60 hover:bg-white/20"}`}
              >
                All ({PRODUCTS.length})
              </button>
              {COLLECTIONS.map(c => (
                <button
                  key={c.id}
                  onClick={() => setSelectedCollection(c.name)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${selectedCollection === c.name ? "bg-[#1E90FF] text-white" : "bg-white/10 text-white/60 hover:bg-white/20"}`}
                >
                  {c.icon} {c.name} ({c.items})
                </button>
              ))}
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredProducts.map(p => (
                <div key={p.id} className="bg-white/5 border border-white/10 rounded-xl overflow-hidden hover:border-[#1E90FF]/50 transition-colors group">
                  <div className="aspect-square bg-white/5 flex items-center justify-center text-6xl group-hover:scale-110 transition-transform">
                    {p.image}
                  </div>
                  <div className="p-3">
                    <div className="font-semibold text-sm leading-tight">{p.name}</div>
                    <div className="text-white/40 text-xs mt-1">{p.collection}</div>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-[#1E90FF] font-bold">{p.price}</span>
                      <span className="text-[#00C2FF] text-xs">{p.status}</span>
                    </div>
                    <a
                      href="https://0010yz-fn.myshopify.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 block w-full text-center py-1.5 bg-[#1E90FF] text-white rounded-lg text-xs font-bold hover:bg-[#1E90FF]/80 transition-colors"
                    >
                      Buy Now
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Vendors Tab */}
        {tab === "vendors" && (
          <div className="space-y-4">
            {VENDORS.map(v => (
              <div key={v.id} className="bg-white/5 border border-white/10 rounded-xl p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-xl font-bold">{v.name}</h3>
                    <div className="text-[#1E90FF] text-sm font-semibold mt-0.5">{v.category}</div>
                    <p className="text-white/60 text-sm mt-2">{v.description}</p>
                    <div className="mt-3 flex gap-4 text-sm">
                      <span className="text-white/50">{v.products} products</span>
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-[#00C2FF]/20 text-[#00C2FF] rounded-full text-xs font-bold">
                     {v.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Partner Tab */}
        {tab === "partner" && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white/5 border border-white/10 rounded-xl p-8 text-center">
              <div className="text-4xl mb-4"></div>
              <h2 className="text-2xl font-black mb-2">Become an AthlynX Vendor Partner</h2>
              <p className="text-white/60 mb-6">
                Join the AthlynX Vendor Marketplace. Sell your athletic gear, equipment, and merchandise to thousands of athletes, coaches, and programs on the AthlynXAI OS platform.
              </p>
              <div className="space-y-3 text-left mb-6">
                {[
                  "Access to 10,000+ athletes and coaches",
                  "Integrated with AthlynX NIL & Recruiting flows",
                  "Fulfillment support through ICC-USA network",
                  "Co-marketing through AthlynXAI social channels",
                  "Revenue share on all platform-driven sales",
                ].map(b => (
                  <div key={b} className="flex items-center gap-2 text-sm text-white/80">
                    <span className="text-[#1E90FF]"></span> {b}
                  </div>
                ))}
              </div>
              <a
                href="mailto:cdozier14@athlynx.ai?subject=Vendor Partner Application"
                className="inline-block px-8 py-3 bg-[#1E90FF] text-white rounded-xl font-bold hover:bg-[#1E90FF]/80 transition-colors"
              >
                Apply to Become a Partner
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
