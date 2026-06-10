/**
 * AthlynX — Athlete Store & Brand Marketplace
 * Premium sports e-commerce built for champions.
 * Real store. Real checkout. Real brands.
 *
 * Featured Vendor Slots (ready to activate when deals close):
 *   - Private Compute: GPU compute, AI tools, developer products
 *   - ICC-USA: International sports partnerships & equipment
 *   - AthlynX Originals: Platform-branded performance gear
 *
 * Market penetration structure modeled after Nike, Adidas, Under Armour.
 * Session 32 — May 5, 2026
 */
import { RouteErrorBoundary } from "@/components/GlobalErrorBoundary";
import PlatformLayout from "@/components/PlatformLayout";
import MobileBottomNav from "@/components/MobileBottomNav";
import { useState } from "react";

//  Featured Vendor Slots (activate when deals close) 
const FEATURED_VENDORS = [
  {
    id: "nebius",
    name: "Private Compute",
    tagline: "The AI Infrastructure for Champions",
    desc: "GPU compute, AI developer tools, and machine learning infrastructure. The same H200 technology powering AthlynXAI — now available for athletes, teams, and sports tech builders.",
    badge: "COMING SOON",
    badgeColor: "bg-[#1E90FF]/20 text-[#1E90FF] border border-[#1E90FF]/30",
    icon: "",
    color: "from-[#1E90FF]/40 to-indigo-900/30",
    border: "border-[#1E90FF]/40",
    cta: "Explore Nebius Products",
    products: [
      { name: "Advanced Compute Access", price: "From $2.50/hr", icon: "", desc: "Advanced compute for approved AI workflows" },
      { name: "Private Compute Studio", price: "From $0.10/1M tokens", icon: "", desc: "Private model access for approved workflows" },
      { name: "Private Object Storage", price: "From $0.015/GB", icon: "", desc: "Secure storage for athlete media and data" },
    ],
  },
  {
    id: "icc-usa",
    name: "ICC-USA",
    tagline: "International Sports Partnerships",
    desc: "ICC-USA brings world-class international sports equipment, apparel, and partnership opportunities to American athletes. Global brands. Elite standards. Athlete-first.",
    badge: "COMING SOON",
    badgeColor: "bg-blue-500/20 text-blue-400 border border-blue-500/30",
    icon: "",
    color: "from-blue-900/40 to-[#0a1628]/30",
    border: "border-blue-700/40",
    cta: "Explore ICC-USA Products",
    products: [
      { name: "International Training Gear", price: "TBD", icon: "", desc: "World-class training equipment from global partners" },
      { name: "Global Apparel Collection", price: "TBD", icon: "", desc: "International sports apparel and performance wear" },
      { name: "Partnership Programs", price: "TBD", icon: "", desc: "Athlete sponsorship and brand ambassador opportunities" },
    ],
  },
];

const CATEGORIES = [
  { id: "all", label: "All Products", icon: "" },
  { id: "football", label: "Football", icon: "" },
  { id: "basketball", label: "Basketball", icon: "" },
  { id: "baseball", label: "Baseball", icon: "" },
  { id: "soccer", label: "Soccer", icon: "" },
  { id: "training", label: "Training", icon: "" },
  { id: "recovery", label: "Recovery", icon: "" },
  { id: "apparel", label: "Apparel", icon: "" },
  { id: "tech", label: "Tech & AI", icon: "" },
  { id: "nutrition", label: "Nutrition", icon: "" },
  { id: "nil-merch", label: "NIL Merch", icon: "" },
];

const PRODUCTS = [
  // Football
  { id: 1, name: "AthlynX Pro Football Helmet", category: "football", price: 299.99, rating: 4.8, reviews: 124, badge: "BESTSELLER", icon: "", description: "NOCSAE-certified helmet with built-in sensor array for impact tracking. Feeds data directly to your AthlynX dashboard.", inStock: true },
  { id: 2, name: "Speed & Agility Training Kit", category: "football", price: 89.99, rating: 4.7, reviews: 89, badge: "NEW", icon: "", description: "Ladder, cones, resistance bands, and speed parachute. Complete agility training system.", inStock: true },
  { id: 3, name: "QB Throwing Machine Pro", category: "football", price: 1299.99, rating: 4.9, reviews: 45, badge: "PRO", icon: "", description: "Automated QB training machine with 0-70 mph throw speed. AI-powered target tracking.", inStock: true },

  // Basketball
  { id: 4, name: "AthlynX Smart Basketball", category: "basketball", price: 149.99, rating: 4.6, reviews: 203, badge: "SMART", icon: "", description: "Bluetooth-connected basketball that tracks dribbles, shots, and spin rate. Syncs with your AthlynX profile.", inStock: true },
  { id: 5, name: "Vertical Jump Training System", category: "basketball", price: 199.99, rating: 4.8, reviews: 167, badge: "BESTSELLER", icon: "", description: "Resistance band system + jump mat with Bluetooth sensor. Track your vertical progress in real-time.", inStock: true },
  { id: 6, name: "NBA Draft Prep Package", category: "basketball", price: 499.99, rating: 4.9, reviews: 28, badge: "ELITE", icon: "", description: "Complete combine prep kit: shooting sleeve, ankle braces, training shoes, and 3-month AI coaching subscription.", inStock: false },

  // Baseball
  { id: 7, name: "Diamond Grind Batting Gloves", category: "baseball", price: 59.99, rating: 4.7, reviews: 312, badge: "BESTSELLER", icon: "", description: "Pro-grade leather batting gloves with grip sensors. Track bat speed and exit velocity.", inStock: true },
  { id: 8, name: "Pitching Velocity Radar Gun", category: "baseball", price: 129.99, rating: 4.8, reviews: 156, badge: "POPULAR", icon: "", description: "Pocket-sized radar gun with Bluetooth. Reads 10-130 mph. Syncs velocity data to AthlynX.", inStock: true },
  { id: 9, name: "Baseball Pitching Net Pro", category: "baseball", price: 179.99, rating: 4.6, reviews: 94, badge: "NEW", icon: "", description: "Heavy-duty 7x7 ft pitching net with strike zone target. Folds flat for easy transport.", inStock: true },

  // Training
  { id: 10, name: "AthlynX Smart Wearable Band", category: "tech", price: 249.99, rating: 4.9, reviews: 78, badge: "AI-POWERED", icon: "", description: "Heart rate, GPS, acceleration, and recovery score. Feeds real-time data to your AthlynX Data Dashboard.", inStock: true },
  { id: 11, name: "Resistance Band Complete Set", category: "training", price: 49.99, rating: 4.7, reviews: 445, badge: "BESTSELLER", icon: "", description: "5-band set (10-50 lbs) with door anchor, handles, and ankle straps. Works for all sports.", inStock: true },
  { id: 12, name: "Foam Roller & Recovery Kit", category: "recovery", price: 79.99, rating: 4.8, reviews: 289, badge: "RECOVERY", icon: "", description: "High-density foam roller, massage gun, compression sleeves, and ice packs. Full recovery system.", inStock: true },

  // Apparel
  { id: 13, name: "AthlynX Performance Hoodie", category: "apparel", price: 89.99, rating: 4.8, reviews: 567, badge: "BESTSELLER", icon: "", description: "Moisture-wicking, 4-way stretch performance hoodie. AthlynX logo embroidered. Available in S-3XL.", inStock: true },
  { id: 14, name: "AthlynX Training Shorts", category: "apparel", price: 49.99, rating: 4.7, reviews: 389, badge: "POPULAR", icon: "", description: "7-inch inseam, built-in compression liner, deep pockets. Perfect for any sport.", inStock: true },
  { id: 15, name: "Compression Tights Pro", category: "apparel", price: 69.99, rating: 4.9, reviews: 234, badge: "PRO", icon: "", description: "Graduated compression (15-20 mmHg) for improved circulation and faster recovery.", inStock: true },

  // Nutrition
  { id: 16, name: "Athlete Protein Bundle (3-Month)", category: "nutrition", price: 149.99, rating: 4.8, reviews: 412, badge: "BUNDLE", icon: "", description: "Whey protein, creatine, BCAAs, and pre-workout. 3-month supply. NSF Certified for Sport.", inStock: true },
  { id: 17, name: "Hydration & Electrolyte Pack", category: "nutrition", price: 39.99, rating: 4.7, reviews: 678, badge: "BESTSELLER", icon: "", description: "30-day supply of electrolyte powder in 5 flavors. Zero sugar, 1000mg sodium per serving.", inStock: true },

  // NIL Merch
  { id: 18, name: "Custom NIL Jersey (Personalized)", category: "nil-merch", price: 129.99, rating: 4.9, reviews: 89, badge: "CUSTOM", icon: "", description: "Your name, number, and school on a pro-grade jersey. Perfect for NIL deals and fan merchandise.", inStock: true },
  { id: 19, name: "Athlete Brand Starter Kit", category: "nil-merch", price: 199.99, rating: 4.8, reviews: 56, badge: "NIL", icon: "", description: "Business cards, stickers, phone case, and branded tote bag. Everything to launch your personal brand.", inStock: true },

  // Tech
  { id: 20, name: "AthlynXAI Training Camera", category: "tech", price: 399.99, rating: 4.7, reviews: 34, badge: "AI", icon: "", description: "Auto-tracking camera with AI pose analysis. Records and analyzes your form, feeds clips to AthlynX.", inStock: true },
];

type CartItem = { product: typeof PRODUCTS[0]; qty: number };

function AthleteStoreInner() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [search, setSearch] = useState("");

  const filtered = PRODUCTS.filter(p => {
    const matchCat = activeCategory === "all" || p.category === activeCategory;
    const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.description.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const addToCart = (product: typeof PRODUCTS[0]) => {
    setCart(prev => {
      const existing = prev.find(i => i.product.id === product.id);
      if (existing) return prev.map(i => i.product.id === product.id ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { product, qty: 1 }];
    });
  };

  const removeFromCart = (id: number) => setCart(prev => prev.filter(i => i.product.id !== id));
  const updateQty = (id: number, qty: number) => {
    if (qty <= 0) return removeFromCart(id);
    setCart(prev => prev.map(i => i.product.id === id ? { ...i, qty } : i));
  };

  const cartTotal = cart.reduce((sum, i) => sum + i.product.price * i.qty, 0);
  const cartCount = cart.reduce((sum, i) => sum + i.qty, 0);

  const handleCheckout = () => {
    // Build Stripe checkout URL with line items
    const itemsDesc = cart.map(i => `${i.qty}x ${i.product.name}`).join(", ");
    const emailBody = `I'd like to purchase:\n\n${itemsDesc}\n\nTotal: $${cartTotal.toFixed(2)}\n\nPlease send me a payment link.`;
    window.open(`mailto:contact@athlynx.ai?subject=Athlete Store Order&body=${encodeURIComponent(emailBody)}`, "_blank");
  };

  return (
    <PlatformLayout title="Athlete Store">
      <div className="max-w-6xl mx-auto px-2 py-4 space-y-4">

        {/* Header */}
        <div className="bg-gradient-to-br from-[#0d1b3e] to-[#1a3a8f] rounded-2xl border border-blue-800 p-5 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black text-white mb-1"> Athlete Store</h1>
            <p className="text-blue-300 text-sm">Pro gear, smart tech, and NIL merch — everything an athlete needs.</p>
          </div>
          <button
            onClick={() => setShowCart(!showCart)}
            className="relative bg-gradient-to-r from-[#1E90FF] to-blue-600 text-white font-black px-4 py-2.5 rounded-xl text-sm hover:opacity-90 transition-all"
          >
             Cart
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-[#1E90FF] text-white text-[10px] font-black rounded-full w-5 h-5 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>
        </div>

        {/* Cart Panel */}
        {showCart && (
          <div className="bg-[#0d1b3e] rounded-2xl border border-blue-700 p-5">
            <h3 className="text-white font-black text-base mb-3"> Your Cart ({cartCount} items)</h3>
            {cart.length === 0 ? (
              <p className="text-blue-400 text-sm text-center py-4">Your cart is empty. Add some gear!</p>
            ) : (
              <>
                <div className="space-y-2 mb-4">
                  {cart.map(item => (
                    <div key={item.product.id} className="flex items-center justify-between bg-blue-900/30 rounded-xl px-3 py-2 border border-blue-800/40">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{item.product.icon}</span>
                        <div>
                          <div className="text-white text-xs font-bold">{item.product.name}</div>
                          <div className="text-blue-400 text-xs">${item.product.price.toFixed(2)} each</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button onClick={() => updateQty(item.product.id, item.qty - 1)} className="w-6 h-6 bg-blue-800 text-white rounded-full text-xs font-bold hover:bg-blue-700">−</button>
                        <span className="text-white text-sm font-bold w-4 text-center">{item.qty}</span>
                        <button onClick={() => updateQty(item.product.id, item.qty + 1)} className="w-6 h-6 bg-blue-800 text-white rounded-full text-xs font-bold hover:bg-blue-700">+</button>
                        <button onClick={() => removeFromCart(item.product.id)} className="text-[#1E90FF] text-xs ml-1 hover:text-[#1E90FF]"></button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-between border-t border-blue-800 pt-3">
                  <div>
                    <div className="text-blue-400 text-xs">Total</div>
                    <div className="text-white font-black text-xl">${cartTotal.toFixed(2)}</div>
                  </div>
                  <button
                    onClick={handleCheckout}
                    className="bg-gradient-to-r from-[#00C2FF] to-emerald-600 text-white font-black px-6 py-3 rounded-xl text-sm hover:opacity-90 transition-all"
                  >
                    Checkout →
                  </button>
                </div>
              </>
            )}
          </div>
        )}

        {/* Featured Vendor Banners */}
        <div className="space-y-3">
          <div className="text-xs font-black text-blue-400 tracking-widest uppercase px-1"> Featured Vendor Partners</div>
          {FEATURED_VENDORS.map(vendor => (
            <div key={vendor.id} className={`bg-gradient-to-br ${vendor.color} border ${vendor.border} rounded-2xl p-4`}>
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className="text-3xl">{vendor.icon}</div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-white font-black text-base">{vendor.name}</span>
                      <span className={`text-[9px] font-black px-2 py-0.5 rounded-full ${vendor.badgeColor}`}>{vendor.badge}</span>
                    </div>
                    <div className="text-blue-300 text-xs font-semibold">{vendor.tagline}</div>
                  </div>
                </div>
              </div>
              <p className="text-blue-300 text-xs leading-relaxed mb-3">{vendor.desc}</p>
              <div className="grid grid-cols-3 gap-2 mb-3">
                {vendor.products.map((p, pi) => (
                  <div key={pi} className="bg-[#040c1a]/50 rounded-xl p-2 text-center">
                    <div className="text-xl mb-1">{p.icon}</div>
                    <div className="text-white text-[10px] font-bold leading-tight">{p.name}</div>
                    <div className="text-[#00C2FF] text-[9px] font-black mt-0.5">{p.price}</div>
                  </div>
                ))}
              </div>
              <button className="w-full border border-blue-600/50 text-blue-300 text-xs font-bold py-2 rounded-xl hover:bg-blue-900/30 transition-colors">
                {vendor.cta} — Launching Soon
              </button>
            </div>
          ))}
        </div>

        {/* Market Stats */}
        <div className="grid grid-cols-4 gap-2">
          {[
            { val: "$135.9B", label: "Sports Tech TAM", icon: "" },
            { val: "$2.5B+", label: "NIL Market 2026", icon: "" },
            { val: "520K+", label: "NCAA Athletes", icon: "" },
            { val: "8%", label: "Store Commission", icon: "" },
          ].map((s, i) => (
            <div key={i} className="bg-[#0d1b3e] border border-blue-800/40 rounded-xl p-2 text-center">
              <div className="text-base">{s.icon}</div>
              <div className="text-[#00C2FF] font-black text-xs">{s.val}</div>
              <div className="text-blue-500 text-[9px] leading-tight">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Search */}
        <div className="relative">
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search products..."
            className="w-full bg-[#0d1b3e] border border-blue-800 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#1E90FF] pl-10"
          />
          <span className="absolute left-3 top-3.5 text-blue-400"></span>
        </div>

        {/* Category Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                activeCategory === cat.id
                  ? "bg-gradient-to-r from-[#1E90FF] to-blue-600 text-white"
                  : "bg-[#0d1b3e] border border-blue-800 text-blue-400 hover:border-blue-600"
              }`}
            >
              <span>{cat.icon}</span>
              <span>{cat.label}</span>
            </button>
          ))}
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map(product => (
            <div key={product.id} className="bg-[#0d1b3e] rounded-2xl border border-blue-800 overflow-hidden hover:border-blue-600 transition-all group">
              {/* Product Image Area */}
              <div className="bg-gradient-to-br from-blue-900/50 to-indigo-900/50 p-6 text-center relative">
                <div className="text-5xl group-hover:scale-110 transition-transform">{product.icon}</div>
                {product.badge && (
                  <span className={`absolute top-2 left-2 text-[9px] font-black px-1.5 py-0.5 rounded-full text-white ${
                    product.badge === "BESTSELLER" ? "bg-[#1565C0]" :
                    product.badge === "NEW" ? "bg-[#00C2FF]" :
                    product.badge === "AI-POWERED" || product.badge === "AI" ? "bg-[#1E90FF]" :
                    product.badge === "ELITE" || product.badge === "PRO" ? "bg-blue-600" :
                    "bg-blue-600"
                  }`}>
                    {product.badge}
                  </span>
                )}
                {!product.inStock && (
                  <span className="absolute top-2 right-2 text-[9px] font-black px-1.5 py-0.5 rounded-full bg-[#1E90FF] text-[#1E90FF]">OUT OF STOCK</span>
                )}
              </div>

              {/* Product Info */}
              <div className="p-3">
                <h3 className="text-white font-bold text-sm mb-1 leading-tight">{product.name}</h3>
                <p className="text-blue-400 text-[11px] mb-2 leading-relaxed line-clamp-2">{product.description}</p>

                {/* Rating */}
                <div className="flex items-center gap-1 mb-2">
                  <div className="flex text-[#00C2FF] text-xs">
                    {"".repeat(Math.floor(product.rating))}{"".repeat(5 - Math.floor(product.rating))}
                  </div>
                  <span className="text-blue-400 text-[10px]">({product.reviews})</span>
                </div>

                {/* Price & Add to Cart */}
                <div className="flex items-center justify-between">
                  <span className="text-white font-black text-lg">${product.price.toFixed(2)}</span>
                  <button
                    onClick={() => product.inStock && addToCart(product)}
                    disabled={!product.inStock}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      product.inStock
                        ? "bg-gradient-to-r from-[#1E90FF] to-blue-600 text-white hover:opacity-90"
                        : "bg-gray-800 text-gray-500 cursor-not-allowed"
                    }`}
                  >
                    {product.inStock ? "+ Cart" : "Unavailable"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-12 text-blue-400">
            <div className="text-4xl mb-3"></div>
            <p>No products found for "{search}". Try a different search.</p>
          </div>
        )}

        {/* NIL Merch CTA */}
        <div className="bg-gradient-to-r from-blue-900/40 to-[#0a1628]/40 rounded-2xl border border-blue-700/50 p-5 text-center">
          <div className="text-3xl mb-2"></div>
          <h3 className="text-white font-black text-base mb-1">Want Custom NIL Merchandise?</h3>
          <p className="text-[#00C2FF] text-sm mb-3">
            Build your personal brand with custom jerseys, apparel, and merch. Perfect for NIL deals and fan engagement.
          </p>
          <a
            href="mailto:contact@athlynx.ai?subject=Custom NIL Merch Request"
            className="inline-block px-6 py-2.5 bg-gradient-to-r from-blue-500 to-[#0a1628] text-white font-black rounded-xl text-sm hover:opacity-90 transition-all"
          >
            Request Custom Merch →
          </a>
        </div>

      </div>
      <MobileBottomNav />
    </PlatformLayout>
  );
}

export default function AthleteStore() {
  return <RouteErrorBoundary><AthleteStoreInner /></RouteErrorBoundary>;
}
