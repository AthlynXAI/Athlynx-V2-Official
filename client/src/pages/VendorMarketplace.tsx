/**
 * VendorMarketplace.tsx
 * AthlynX Vendor Marketplace & E-Commerce Hub
 * Route: /commerce
 *
 * The unified storefront where ICC-USA and all AthlynX vendor partners
 * list products across every DHG brand lane. Athletes browse by sport,
 * brand, or category. Every transaction flows through AthlynX.
 *
 * Author: manus-ai-bot@athlynx.ai
 * Date:   2026-06-06
 */

import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import MobileBottomNav from "@/components/MobileBottomNav";
import { RouteErrorBoundary } from "@/components/GlobalErrorBoundary";
import { Link } from "wouter";
import {
  ShoppingBag,
  Store,
  Users,
  Star,
  Award,
  TrendingUp,
  Package,
  Zap,
  Shield,
  ChevronRight,
  ExternalLink,
  Tag,
  Globe,
} from "lucide-react";

// ─── Brand Colors ─────────────────────────────────────────────────────────────
const CYAN   = "#00c2ff";
const PURPLE = "#7c3aed";
const NAVY   = "#0a0f1e";
const GOLD   = "#1E90FF";
const WHITE  = "#ffffff";
const CARD   = "#0d1a3a";
const BORDER = "rgba(0,194,255,0.15)";

// ─── Vendor Partner Data ──────────────────────────────────────────────────────
const VENDOR_PARTNERS = [
  {
    slug: "icc-usa",
    name: "ICC-USA",
    tagline: "Primary Hardware, Equipment & Apparel Partner",
    category: "Equipment & Apparel",
    badge: "PRIMARY PARTNER",
    badgeColor: GOLD,
    description:
      "ICC-USA is AthlynX's primary fulfillment partner — delivering pro-grade athletic equipment, apparel, and accessories across every sport. Every physical product on AthlynX ships through ICC-USA.",
    collections: ["Athletic Equipment", "AthlynX Sportswear", "Accessories"],
    shopifyHandle: "icc-usa-partner-store",
    logo: "🏭",
  },
];

// ─── Collection Cards ─────────────────────────────────────────────────────────
const COLLECTIONS = [
  {
    title: "AthlynX Sportswear",
    icon: "👕",
    description: "Performance apparel built for athletes who refuse to settle.",
    handle: "athlynx-sportswear",
    color: CYAN,
    vendor: "ICC-USA",
  },
  {
    title: "Athletic Equipment",
    icon: "🏋️",
    description: "Pro-grade equipment for every level of competition.",
    handle: "athletic-equipment",
    color: PURPLE,
    vendor: "ICC-USA",
  },
  {
    title: "NIL Merchandise",
    icon: "⭐",
    description: "Athlete-branded merchandise. Support your favorites.",
    handle: "nil-merchandise",
    color: GOLD,
    vendor: "AthlynX NIL Portal",
  },
  {
    title: "Diamond Grind Gear",
    icon: "⚾",
    description: "Built for the grind. Designed for the diamond.",
    handle: "diamond-grind-gear",
    color: "#22c55e",
    vendor: "ICC-USA",
  },
  {
    title: "Warriors Playbook Gear",
    icon: "📋",
    description: "Coach the sideline. Own the film room.",
    handle: "warriors-playbook-gear",
    color: "#1E90FF",
    vendor: "ICC-USA",
  },
  {
    title: "AthlynXAI Branded Apparel",
    icon: "🔷",
    description: "Wear the mission. Represent the platform.",
    handle: "athlynxai-branded-apparel",
    color: CYAN,
    vendor: "ICC-USA",
  },
  {
    title: "Accessories",
    icon: "🎒",
    description: "Every detail matters. Built for the athlete who never stops.",
    handle: "accessories",
    color: PURPLE,
    vendor: "ICC-USA",
  },
];

// ─── Why Partner Section ──────────────────────────────────────────────────────
const WHY_PARTNER = [
  {
    icon: <Users size={28} color={CYAN} />,
    title: "Athlete-First Audience",
    body: "Direct access to verified athletes, coaches, and sports families across every sport and every level.",
  },
  {
    icon: <TrendingUp size={28} color={CYAN} />,
    title: "Cross-Brand Distribution",
    body: "Your products appear across AthlynX, Diamond Grind, Warriors Playbook, NIL Portal, and every DHG lane.",
  },
  {
    icon: <Shield size={28} color={CYAN} />,
    title: "Verified Vendor Status",
    body: "AthlynX only partners with vendors who meet our quality and compliance standards. Your brand is in good company.",
  },
  {
    icon: <Zap size={28} color={CYAN} />,
    title: "Integrated Commerce OS",
    body: "Your storefront lives inside the AthlynXAI OS — not just a link, but a full branded experience inside the platform.",
  },
];

// ─── Component ────────────────────────────────────────────────────────────────
export default function VendorMarketplace() {
  const [activeTab, setActiveTab] = useState<"shop" | "vendors" | "partner">("shop");

  return (
    <RouteErrorBoundary>
      <DashboardLayout>
        <div style={{ minHeight: "100vh", background: NAVY, color: WHITE, fontFamily: "Inter, sans-serif" }}>

          {/* ── Hero ── */}
          <section
            style={{
              background: `linear-gradient(135deg, ${NAVY} 0%, #0d1a3a 50%, #1a0a3e 100%)`,
              borderBottom: `1px solid ${BORDER}`,
              padding: "60px 24px 48px",
              textAlign: "center",
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* Background glow */}
            <div style={{
              position: "absolute", top: "50%", left: "50%",
              transform: "translate(-50%, -50%)",
              width: 600, height: 300,
              background: `radial-gradient(ellipse, rgba(0,194,255,0.08) 0%, transparent 70%)`,
              pointerEvents: "none",
            }} />

            <div style={{ position: "relative", maxWidth: 720, margin: "0 auto" }}>
              <div style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                background: "rgba(0,194,255,0.1)", border: `1px solid ${BORDER}`,
                borderRadius: 20, padding: "6px 16px", marginBottom: 20,
                fontSize: 12, fontWeight: 700, color: CYAN, letterSpacing: 1.5,
                textTransform: "uppercase",
              }}>
                <Store size={14} /> AthlynX Commerce OS
              </div>

              <h1 style={{ fontSize: "clamp(32px, 6vw, 56px)", fontWeight: 900, margin: "0 0 16px", lineHeight: 1.1 }}>
                The Athlete{" "}
                <span style={{ color: CYAN }}>Vendor Marketplace</span>
              </h1>

              <p style={{ fontSize: 18, color: "rgba(255,255,255,0.7)", margin: "0 0 32px", lineHeight: 1.6 }}>
                ICC-USA and our verified vendor partners — all in one place.
                Every product. Every brand. One platform built for athletes.
              </p>

              <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
                <a
                  href="https://0010yz-fn.myshopify.com/collections/vendor-marketplace"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "inline-flex", alignItems: "center", gap: 8,
                    background: CYAN, color: NAVY, fontWeight: 800,
                    padding: "14px 28px", borderRadius: 8, textDecoration: "none",
                    fontSize: 15,
                  }}
                >
                  <ShoppingBag size={18} /> Shop All Products
                </a>
                <button
                  onClick={() => setActiveTab("partner")}
                  style={{
                    display: "inline-flex", alignItems: "center", gap: 8,
                    background: "transparent", color: WHITE, fontWeight: 700,
                    padding: "14px 28px", borderRadius: 8, border: `1px solid ${BORDER}`,
                    fontSize: 15, cursor: "pointer",
                  }}
                >
                  <Globe size={18} /> Become a Vendor Partner
                </button>
              </div>
            </div>
          </section>

          {/* ── Stats Bar ── */}
          <section style={{
            background: "rgba(0,194,255,0.04)", borderBottom: `1px solid ${BORDER}`,
            padding: "20px 24px",
          }}>
            <div style={{
              maxWidth: 960, margin: "0 auto",
              display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
              gap: 16, textAlign: "center",
            }}>
              {[
                { label: "Vendor Partners", value: "1 Active", icon: <Store size={18} color={CYAN} /> },
                { label: "Collections", value: "9 Live", icon: <Package size={18} color={CYAN} /> },
                { label: "Sports Covered", value: "All Sports", icon: <Award size={18} color={CYAN} /> },
                { label: "Fulfillment", value: "ICC-USA", icon: <Shield size={18} color={GOLD} /> },
              ].map((stat) => (
                <div key={stat.label} style={{ padding: "12px 8px" }}>
                  <div style={{ display: "flex", justifyContent: "center", marginBottom: 6 }}>{stat.icon}</div>
                  <div style={{ fontSize: 20, fontWeight: 800, color: WHITE }}>{stat.value}</div>
                  <div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", marginTop: 2 }}>{stat.label}</div>
                </div>
              ))}
            </div>
          </section>

          {/* ── Tabs ── */}
          <section style={{ maxWidth: 960, margin: "0 auto", padding: "32px 24px 0" }}>
            <div style={{ display: "flex", gap: 4, borderBottom: `1px solid ${BORDER}`, marginBottom: 32 }}>
              {(["shop", "vendors", "partner"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  style={{
                    padding: "10px 20px", background: "transparent", border: "none",
                    borderBottom: activeTab === tab ? `2px solid ${CYAN}` : "2px solid transparent",
                    color: activeTab === tab ? CYAN : "rgba(255,255,255,0.5)",
                    fontWeight: 700, fontSize: 14, cursor: "pointer", textTransform: "capitalize",
                    transition: "all 0.2s",
                  }}
                >
                  {tab === "shop" ? "Shop by Collection" : tab === "vendors" ? "Vendor Partners" : "Become a Partner"}
                </button>
              ))}
            </div>

            {/* ── Shop Tab ── */}
            {activeTab === "shop" && (
              <div>
                <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 8 }}>Shop by Collection</h2>
                <p style={{ color: "rgba(255,255,255,0.6)", marginBottom: 28, fontSize: 15 }}>
                  Every collection is fulfilled by ICC-USA and our authorized vendor partners.
                </p>
                <div style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
                  gap: 20,
                }}>
                  {COLLECTIONS.map((col) => (
                    <a
                      key={col.handle}
                      href={`https://0010yz-fn.myshopify.com/collections/${col.handle}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ textDecoration: "none" }}
                    >
                      <div style={{
                        background: CARD, border: `1px solid ${BORDER}`,
                        borderRadius: 12, padding: 24,
                        transition: "border-color 0.2s, transform 0.2s",
                        cursor: "pointer",
                      }}
                        onMouseEnter={(e) => {
                          (e.currentTarget as HTMLDivElement).style.borderColor = col.color;
                          (e.currentTarget as HTMLDivElement).style.transform = "translateY(-2px)";
                        }}
                        onMouseLeave={(e) => {
                          (e.currentTarget as HTMLDivElement).style.borderColor = BORDER;
                          (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
                        }}
                      >
                        <div style={{ fontSize: 36, marginBottom: 12 }}>{col.icon}</div>
                        <h3 style={{ fontSize: 17, fontWeight: 800, color: WHITE, margin: "0 0 8px" }}>{col.title}</h3>
                        <p style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", margin: "0 0 16px", lineHeight: 1.5 }}>
                          {col.description}
                        </p>
                        <div style={{
                          display: "flex", alignItems: "center", justifyContent: "space-between",
                        }}>
                          <span style={{
                            fontSize: 11, fontWeight: 700, color: col.color,
                            background: `${col.color}18`, padding: "3px 10px",
                            borderRadius: 20, border: `1px solid ${col.color}40`,
                          }}>
                            <Tag size={10} style={{ marginRight: 4, verticalAlign: "middle" }} />
                            {col.vendor}
                          </span>
                          <ChevronRight size={16} color={col.color} />
                        </div>
                      </div>
                    </a>
                  ))}
                </div>

                {/* Full Marketplace CTA */}
                <div style={{
                  marginTop: 32, padding: 28, background: CARD,
                  border: `1px solid ${BORDER}`, borderRadius: 12, textAlign: "center",
                }}>
                  <ShoppingBag size={32} color={CYAN} style={{ marginBottom: 12 }} />
                  <h3 style={{ fontSize: 20, fontWeight: 800, margin: "0 0 8px" }}>Browse the Full Vendor Marketplace</h3>
                  <p style={{ color: "rgba(255,255,255,0.6)", margin: "0 0 20px", fontSize: 14 }}>
                    All products from all vendors — in one place.
                  </p>
                  <a
                    href="https://0010yz-fn.myshopify.com/collections/vendor-marketplace"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: "inline-flex", alignItems: "center", gap: 8,
                      background: CYAN, color: NAVY, fontWeight: 800,
                      padding: "12px 24px", borderRadius: 8, textDecoration: "none", fontSize: 14,
                    }}
                  >
                    <ExternalLink size={16} /> Open Marketplace <ChevronRight size={16} />
                  </a>
                </div>
              </div>
            )}

            {/* ── Vendors Tab ── */}
            {activeTab === "vendors" && (
              <div>
                <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 8 }}>Vendor Partners</h2>
                <p style={{ color: "rgba(255,255,255,0.6)", marginBottom: 28, fontSize: 15 }}>
                  Every vendor on AthlynX is verified, contracted, and committed to the athlete.
                </p>

                {VENDOR_PARTNERS.map((vendor) => (
                  <div key={vendor.slug} style={{
                    background: CARD, border: `1px solid ${BORDER}`,
                    borderRadius: 16, padding: 32, marginBottom: 20,
                  }}>
                    <div style={{ display: "flex", alignItems: "flex-start", gap: 20, flexWrap: "wrap" }}>
                      <div style={{
                        width: 72, height: 72, borderRadius: 12,
                        background: "rgba(0,194,255,0.1)", border: `1px solid ${BORDER}`,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 36, flexShrink: 0,
                      }}>
                        {vendor.logo}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap", marginBottom: 8 }}>
                          <h3 style={{ fontSize: 22, fontWeight: 900, margin: 0 }}>{vendor.name}</h3>
                          <span style={{
                            fontSize: 11, fontWeight: 800, color: vendor.badgeColor,
                            background: `${vendor.badgeColor}18`, padding: "3px 12px",
                            borderRadius: 20, border: `1px solid ${vendor.badgeColor}40`,
                            letterSpacing: 1,
                          }}>
                            {vendor.badge}
                          </span>
                        </div>
                        <p style={{ fontSize: 14, color: CYAN, fontWeight: 600, margin: "0 0 12px" }}>
                          {vendor.tagline}
                        </p>
                        <p style={{ fontSize: 14, color: "rgba(255,255,255,0.7)", margin: "0 0 20px", lineHeight: 1.6 }}>
                          {vendor.description}
                        </p>
                        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 20 }}>
                          {vendor.collections.map((col) => (
                            <span key={col} style={{
                              fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.7)",
                              background: "rgba(255,255,255,0.06)", padding: "4px 12px",
                              borderRadius: 20, border: "1px solid rgba(255,255,255,0.1)",
                            }}>
                              {col}
                            </span>
                          ))}
                        </div>
                        <a
                          href={`https://0010yz-fn.myshopify.com/collections/${vendor.shopifyHandle}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            display: "inline-flex", alignItems: "center", gap: 8,
                            background: CYAN, color: NAVY, fontWeight: 800,
                            padding: "10px 20px", borderRadius: 8, textDecoration: "none", fontSize: 14,
                          }}
                        >
                          <Store size={16} /> Visit {vendor.name} Store <ChevronRight size={16} />
                        </a>
                      </div>
                    </div>
                  </div>
                ))}

                {/* More vendors coming */}
                <div style={{
                  padding: 28, background: "rgba(124,58,237,0.08)",
                  border: `1px solid rgba(124,58,237,0.2)`, borderRadius: 12, textAlign: "center",
                }}>
                  <Star size={28} color={PURPLE} style={{ marginBottom: 12 }} />
                  <h3 style={{ fontSize: 18, fontWeight: 800, margin: "0 0 8px" }}>More Vendors Coming</h3>
                  <p style={{ color: "rgba(255,255,255,0.6)", margin: "0 0 16px", fontSize: 14 }}>
                    We are actively onboarding sports brands, equipment manufacturers, nutrition companies,
                    and NIL merchandise partners. Apply below to be featured.
                  </p>
                  <button
                    onClick={() => setActiveTab("partner")}
                    style={{
                      display: "inline-flex", alignItems: "center", gap: 8,
                      background: PURPLE, color: WHITE, fontWeight: 700,
                      padding: "10px 20px", borderRadius: 8, border: "none",
                      fontSize: 14, cursor: "pointer",
                    }}
                  >
                    Apply to Become a Partner <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            )}

            {/* ── Partner Tab ── */}
            {activeTab === "partner" && (
              <div>
                <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 8 }}>Become a Vendor Partner</h2>
                <p style={{ color: "rgba(255,255,255,0.6)", marginBottom: 32, fontSize: 15 }}>
                  Partner with AthlynX and put your products in front of the most engaged athlete audience in sports.
                </p>

                {/* Why Partner */}
                <div style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
                  gap: 16, marginBottom: 40,
                }}>
                  {WHY_PARTNER.map((item) => (
                    <div key={item.title} style={{
                      background: CARD, border: `1px solid ${BORDER}`,
                      borderRadius: 12, padding: 24,
                    }}>
                      <div style={{ marginBottom: 12 }}>{item.icon}</div>
                      <h4 style={{ fontSize: 15, fontWeight: 800, margin: "0 0 8px" }}>{item.title}</h4>
                      <p style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", margin: 0, lineHeight: 1.5 }}>{item.body}</p>
                    </div>
                  ))}
                </div>

                {/* Partner Types */}
                <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 16 }}>Partnership Types</h3>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 12, marginBottom: 40 }}>
                  {[
                    { type: "Marketplace Vendor", desc: "List products in the AthlynX Vendor Marketplace", color: CYAN },
                    { type: "Exclusive Partner", desc: "Category-exclusive rights across all DHG brands", color: GOLD },
                    { type: "Co-Brand", desc: "Co-branded product lines with AthlynX branding", color: PURPLE },
                    { type: "NIL Sponsor", desc: "Sponsor athletes directly through the NIL Portal", color: "#22c55e" },
                    { type: "White-Label", desc: "Power your own branded storefront on AthlynX", color: "#1E90FF" },
                  ].map((p) => (
                    <div key={p.type} style={{
                      background: CARD, border: `1px solid ${p.color}30`,
                      borderRadius: 10, padding: 18,
                    }}>
                      <div style={{ fontSize: 13, fontWeight: 800, color: p.color, marginBottom: 6 }}>{p.type}</div>
                      <div style={{ fontSize: 12, color: "rgba(255,255,255,0.6)", lineHeight: 1.4 }}>{p.desc}</div>
                    </div>
                  ))}
                </div>

                {/* CTA */}
                <div style={{
                  background: `linear-gradient(135deg, rgba(0,194,255,0.08), rgba(124,58,237,0.08))`,
                  border: `1px solid ${BORDER}`, borderRadius: 16, padding: 40, textAlign: "center",
                }}>
                  <Award size={40} color={GOLD} style={{ marginBottom: 16 }} />
                  <h3 style={{ fontSize: 22, fontWeight: 900, margin: "0 0 12px" }}>
                    Ready to Partner with AthlynX?
                  </h3>
                  <p style={{ color: "rgba(255,255,255,0.7)", margin: "0 0 24px", fontSize: 15, maxWidth: 480, marginLeft: "auto", marginRight: "auto" }}>
                    Contact our partnerships team to discuss your vendor application. We review every application personally.
                  </p>
                  <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
                    <a
                      href="mailto:contact@athlynx.ai?subject=Vendor Partnership Application — AthlynX Marketplace"
                      style={{
                        display: "inline-flex", alignItems: "center", gap: 8,
                        background: CYAN, color: NAVY, fontWeight: 800,
                        padding: "14px 28px", borderRadius: 8, textDecoration: "none", fontSize: 15,
                      }}
                    >
                      Apply Now <ChevronRight size={18} />
                    </a>
                    <Link href="/crm">
                      <span style={{
                        display: "inline-flex", alignItems: "center", gap: 8,
                        background: "transparent", color: WHITE, fontWeight: 700,
                        padding: "14px 28px", borderRadius: 8, border: `1px solid ${BORDER}`,
                        fontSize: 15, cursor: "pointer", textDecoration: "none",
                      }}>
                        View CRM Vendor Pipeline
                      </span>
                    </Link>
                  </div>
                </div>
              </div>
            )}

            <div style={{ height: 80 }} />
          </section>
        </div>
        <MobileBottomNav />
      </DashboardLayout>
    </RouteErrorBoundary>
  );
}
