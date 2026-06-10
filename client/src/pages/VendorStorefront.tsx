/**
 * VendorStorefront.tsx
 * Per-vendor branded storefront page
 * Route: /commerce/vendor/:slug
 *
 * Author: manus-ai-bot@athlynx.ai
 * Date:   2026-06-06
 */

import DashboardLayout from "@/components/DashboardLayout";
import MobileBottomNav from "@/components/MobileBottomNav";
import { RouteErrorBoundary } from "@/components/GlobalErrorBoundary";
import { Link, useParams } from "wouter";
import { Store, ChevronRight, Shield, Package, ExternalLink, ArrowLeft } from "lucide-react";

const CYAN   = "#00c2ff";
const NAVY   = "#0a0f1e";
const GOLD   = "#1E90FF";
const WHITE  = "#ffffff";
const CARD   = "#0d1a3a";
const BORDER = "rgba(0,194,255,0.15)";

// ─── Vendor Data Registry ─────────────────────────────────────────────────────
const VENDORS: Record<string, {
  name: string;
  tagline: string;
  description: string;
  category: string;
  logo: string;
  badge: string;
  badgeColor: string;
  shopifyHandle: string;
  collections: Array<{ name: string; handle: string; icon: string }>;
  contactEmail: string;
}> = {
  "icc-usa": {
    name: "ICC-USA",
    tagline: "Primary Hardware, Equipment & Apparel Fulfillment Partner",
    description:
      "ICC-USA is AthlynX's primary fulfillment partner — delivering pro-grade athletic equipment, apparel, and accessories across every sport and every level of competition. From youth leagues to the pros, ICC-USA ensures every AthlynX physical product ships with speed, quality, and reliability.",
    category: "Equipment & Apparel",
    logo: "🏭",
    badge: "PRIMARY PARTNER",
    badgeColor: GOLD,
    shopifyHandle: "icc-usa-partner-store",
    collections: [
      { name: "AthlynX Sportswear", handle: "athlynx-sportswear", icon: "👕" },
      { name: "Athletic Equipment", handle: "athletic-equipment", icon: "🏋️" },
      { name: "Accessories", handle: "accessories", icon: "🎒" },
      { name: "Diamond Grind Gear", handle: "diamond-grind-gear", icon: "⚾" },
      { name: "Warriors Playbook Gear", handle: "warriors-playbook-gear", icon: "📋" },
    ],
    contactEmail: "contact@athlynx.ai",
  },
};

export default function VendorStorefront() {
  const params = useParams<{ slug: string }>();
  const slug = params?.slug ?? "";
  const vendor = VENDORS[slug];

  if (!vendor) {
    return (
      <RouteErrorBoundary>
        <DashboardLayout>
          <div style={{ minHeight: "100vh", background: NAVY, color: WHITE, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 16 }}>
            <Store size={48} color={CYAN} />
            <h2 style={{ fontSize: 24, fontWeight: 800 }}>Vendor Not Found</h2>
            <p style={{ color: "rgba(255,255,255,0.6)" }}>This vendor storefront does not exist or is not yet active.</p>
            <Link href="/commerce">
              <span style={{ color: CYAN, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
                <ArrowLeft size={16} /> Back to Marketplace
              </span>
            </Link>
          </div>
          <MobileBottomNav />
        </DashboardLayout>
      </RouteErrorBoundary>
    );
  }

  return (
    <RouteErrorBoundary>
      <DashboardLayout>
        <div style={{ minHeight: "100vh", background: NAVY, color: WHITE, fontFamily: "Inter, sans-serif" }}>

          {/* Back nav */}
          <div style={{ padding: "16px 24px", borderBottom: `1px solid ${BORDER}` }}>
            <Link href="/commerce">
              <span style={{ color: CYAN, fontWeight: 700, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 6, fontSize: 14 }}>
                <ArrowLeft size={14} /> Vendor Marketplace
              </span>
            </Link>
          </div>

          {/* ── Vendor Hero ── */}
          <section style={{
            background: `linear-gradient(135deg, ${NAVY} 0%, #0d1a3a 60%, #1a0a3e 100%)`,
            borderBottom: `1px solid ${BORDER}`,
            padding: "48px 24px",
          }}>
            <div style={{ maxWidth: 800, margin: "0 auto" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 24, flexWrap: "wrap" }}>
                <div style={{
                  width: 88, height: 88, borderRadius: 16,
                  background: "rgba(0,194,255,0.1)", border: `2px solid ${BORDER}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 44, flexShrink: 0,
                }}>
                  {vendor.logo}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap", marginBottom: 8 }}>
                    <h1 style={{ fontSize: 36, fontWeight: 900, margin: 0 }}>{vendor.name}</h1>
                    <span style={{
                      fontSize: 11, fontWeight: 800, color: vendor.badgeColor,
                      background: `${vendor.badgeColor}18`, padding: "4px 14px",
                      borderRadius: 20, border: `1px solid ${vendor.badgeColor}40`,
                      letterSpacing: 1,
                    }}>
                      {vendor.badge}
                    </span>
                  </div>
                  <p style={{ fontSize: 15, color: CYAN, fontWeight: 600, margin: "0 0 12px" }}>{vendor.tagline}</p>
                  <p style={{ fontSize: 14, color: "rgba(255,255,255,0.7)", margin: 0, lineHeight: 1.6, maxWidth: 560 }}>
                    {vendor.description}
                  </p>
                </div>
              </div>

              <div style={{ display: "flex", gap: 12, marginTop: 28, flexWrap: "wrap" }}>
                <a
                  href={`https://0010yz-fn.myshopify.com/collections/${vendor.shopifyHandle}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "inline-flex", alignItems: "center", gap: 8,
                    background: CYAN, color: NAVY, fontWeight: 800,
                    padding: "12px 24px", borderRadius: 8, textDecoration: "none", fontSize: 14,
                  }}
                >
                  <Store size={16} /> Shop {vendor.name} <ExternalLink size={14} />
                </a>
                <a
                  href={`mailto:${vendor.contactEmail}?subject=Vendor Inquiry — ${vendor.name}`}
                  style={{
                    display: "inline-flex", alignItems: "center", gap: 8,
                    background: "transparent", color: WHITE, fontWeight: 700,
                    padding: "12px 24px", borderRadius: 8, border: `1px solid ${BORDER}`,
                    textDecoration: "none", fontSize: 14,
                  }}
                >
                  Contact Vendor
                </a>
              </div>
            </div>
          </section>

          {/* ── Trust Badges ── */}
          <section style={{ background: "rgba(0,194,255,0.04)", borderBottom: `1px solid ${BORDER}`, padding: "16px 24px" }}>
            <div style={{ maxWidth: 800, margin: "0 auto", display: "flex", gap: 24, flexWrap: "wrap", alignItems: "center" }}>
              {[
                { icon: <Shield size={16} color={CYAN} />, label: "AthlynX Verified Vendor" },
                { icon: <Package size={16} color={CYAN} />, label: "Authorized Fulfillment Partner" },
                { icon: <Store size={16} color={CYAN} />, label: vendor.category },
              ].map((b) => (
                <div key={b.label} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "rgba(255,255,255,0.7)", fontWeight: 600 }}>
                  {b.icon} {b.label}
                </div>
              ))}
            </div>
          </section>

          {/* ── Collections ── */}
          <section style={{ maxWidth: 800, margin: "0 auto", padding: "40px 24px" }}>
            <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 8 }}>Shop by Collection</h2>
            <p style={{ color: "rgba(255,255,255,0.6)", marginBottom: 24, fontSize: 14 }}>
              All products fulfilled by {vendor.name}.
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 16 }}>
              {vendor.collections.map((col) => (
                <a
                  key={col.handle}
                  href={`https://0010yz-fn.myshopify.com/collections/${col.handle}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ textDecoration: "none" }}
                >
                  <div style={{
                    background: CARD, border: `1px solid ${BORDER}`,
                    borderRadius: 12, padding: 20,
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    transition: "border-color 0.2s",
                    cursor: "pointer",
                  }}
                    onMouseEnter={(e) => (e.currentTarget as HTMLDivElement).style.borderColor = CYAN}
                    onMouseLeave={(e) => (e.currentTarget as HTMLDivElement).style.borderColor = BORDER}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <span style={{ fontSize: 28 }}>{col.icon}</span>
                      <span style={{ fontSize: 14, fontWeight: 700, color: WHITE }}>{col.name}</span>
                    </div>
                    <ChevronRight size={16} color={CYAN} />
                  </div>
                </a>
              ))}
            </div>

            {/* Full Store CTA */}
            <div style={{ marginTop: 32, textAlign: "center" }}>
              <a
                href={`https://0010yz-fn.myshopify.com/collections/${vendor.shopifyHandle}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "inline-flex", alignItems: "center", gap: 8,
                  background: CYAN, color: NAVY, fontWeight: 800,
                  padding: "14px 32px", borderRadius: 8, textDecoration: "none", fontSize: 15,
                }}
              >
                <Store size={18} /> View Full {vendor.name} Store <ExternalLink size={16} />
              </a>
            </div>
          </section>

          <div style={{ height: 80 }} />
        </div>
        <MobileBottomNav />
      </DashboardLayout>
    </RouteErrorBoundary>
  );
}
