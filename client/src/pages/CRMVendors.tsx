/**
 * CRMVendors.tsx
 * AthlynX CRM — Vendor Marketplace Module
 * Route: /crm/vendors
 *
 * Manages vendor partner relationships, deal pipeline, and
 * product catalog for the AthlynX Vendor Marketplace.
 *
 * Author: manus-ai-bot@athlynx.ai
 * Date:   2026-06-06
 */

import { useState } from "react";
import { trpc } from "@/lib/trpc";
import DashboardLayout from "@/components/DashboardLayout";
import MobileBottomNav from "@/components/MobileBottomNav";
import { RouteErrorBoundary } from "@/components/GlobalErrorBoundary";
import { Link } from "wouter";
import {
  Store,
  Plus,
  Package,
  TrendingUp,
  Users,
  ChevronRight,
  ArrowLeft,
  Shield,
  Edit3,
  ExternalLink,
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
const GREEN  = "#22c55e";

// ─── Stage Config ─────────────────────────────────────────────────────────────
const DEAL_STAGES = [
  { key: "outreach",    label: "Outreach",    color: "#6b7280" },
  { key: "negotiating", label: "Negotiating", color: PURPLE },
  { key: "contracted",  label: "Contracted",  color: CYAN },
  { key: "active",      label: "Active",      color: GREEN },
  { key: "paused",      label: "Paused",      color: GOLD },
  { key: "ended",       label: "Ended",       color: "#ef4444" },
] as const;

const DEAL_TYPES = ["marketplace", "exclusive", "co-brand", "sponsorship", "white-label"] as const;
const VENDOR_CATEGORIES = ["apparel", "equipment", "nutrition", "tech", "media", "other"] as const;

function stageColor(stage: string) {
  return DEAL_STAGES.find((s) => s.key === stage)?.color ?? "#6b7280";
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function Kpi({ label, value, icon }: { label: string; value: string; icon?: React.ReactNode }) {
  return (
    <div style={{
      background: CARD, border: `1px solid ${BORDER}`,
      borderRadius: 12, padding: "20px 24px",
    }}>
      {icon && <div style={{ marginBottom: 8 }}>{icon}</div>}
      <div style={{ fontSize: 24, fontWeight: 900, color: WHITE }}>{value}</div>
      <div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", marginTop: 4, fontWeight: 600 }}>{label}</div>
    </div>
  );
}

function Badge({ label, color }: { label: string; color: string }) {
  return (
    <span style={{
      fontSize: 11, fontWeight: 700, color,
      background: `${color}18`, padding: "3px 10px",
      borderRadius: 20, border: `1px solid ${color}40`,
      textTransform: "capitalize",
    }}>
      {label}
    </span>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function CRMVendors() {
  const [activeTab, setActiveTab] = useState<"vendors" | "deals" | "add-vendor" | "add-deal">("vendors");
  const [selectedVendorId, setSelectedVendorId] = useState<number | null>(null);

  // Queries
  const vendorSummary = trpc.vendor.vendorRevenueSummary.useQuery();
  const vendors = trpc.vendor.listVendors.useQuery();
  const deals = trpc.vendor.listVendorDeals.useQuery(
    selectedVendorId ? { vendorId: selectedVendorId } : undefined
  );

  // Mutations
  const upsertVendor = trpc.vendor.upsertVendor.useMutation({
    onSuccess: () => { vendors.refetch(); vendorSummary.refetch(); setActiveTab("vendors"); },
  });
  const upsertDeal = trpc.vendor.upsertVendorDeal.useMutation({
    onSuccess: () => { deals.refetch(); setActiveTab("deals"); },
  });

  // Form state — Add Vendor
  const [vForm, setVForm] = useState({
    name: "", slug: "", category: "equipment" as typeof VENDOR_CATEGORIES[number],
    contactName: "", contactEmail: "", contactPhone: "",
    website: "", shopifyVendorTag: "", commissionPct: 0, notes: "",
  });

  // Form state — Add Deal
  const [dForm, setDForm] = useState({
    vendorId: 0, name: "", stage: "outreach" as typeof DEAL_STAGES[number]["key"],
    dealType: "marketplace" as typeof DEAL_TYPES[number],
    amountCents: 0, commissionPct: 0, notes: "",
  });

  const vendorList = (vendors.data as any[]) ?? [];
  const dealList   = (deals.data as any[]) ?? [];
  const summary    = vendorSummary.data ?? { vendors: [], totalActive: 0, totalDeals: 0 };

  return (
    <RouteErrorBoundary>
      <DashboardLayout>
        <div style={{ minHeight: "100vh", background: NAVY, color: WHITE, fontFamily: "Inter, sans-serif" }}>

          {/* ── Header ── */}
          <div style={{ padding: "24px 24px 0", borderBottom: `1px solid ${BORDER}`, paddingBottom: 0 }}>
            <div style={{ maxWidth: 1100, margin: "0 auto" }}>
              <Link href="/crm">
                <span style={{ color: CYAN, fontWeight: 700, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13, marginBottom: 16 }}>
                  <ArrowLeft size={13} /> CRM Command Center
                </span>
              </Link>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12, marginBottom: 0 }}>
                <div>
                  <div style={{ fontSize: 11, letterSpacing: 3, color: CYAN, textTransform: "uppercase", fontWeight: 800, marginBottom: 4 }}>
                    CRM — Vendor Marketplace Module
                  </div>
                  <h1 style={{ fontSize: 28, fontWeight: 900, margin: 0 }}>Vendor Partners & Deals</h1>
                  <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 14, margin: "6px 0 0" }}>
                    Manage ICC-USA and all AthlynX vendor partner relationships, deals, and product catalog.
                  </p>
                </div>
                <div style={{ display: "flex", gap: 10 }}>
                  <Link href="/commerce">
                    <span style={{
                      display: "inline-flex", alignItems: "center", gap: 6,
                      background: "transparent", color: CYAN, fontWeight: 700,
                      padding: "10px 18px", borderRadius: 8, border: `1px solid ${BORDER}`,
                      fontSize: 13, cursor: "pointer",
                    }}>
                      <Store size={14} /> View Marketplace
                    </span>
                  </Link>
                  <button
                    onClick={() => setActiveTab("add-vendor")}
                    style={{
                      display: "inline-flex", alignItems: "center", gap: 6,
                      background: CYAN, color: NAVY, fontWeight: 800,
                      padding: "10px 18px", borderRadius: 8, border: "none",
                      fontSize: 13, cursor: "pointer",
                    }}
                  >
                    <Plus size={14} /> Add Vendor
                  </button>
                </div>
              </div>

              {/* Tabs */}
              <div style={{ display: "flex", gap: 4, marginTop: 24 }}>
                {(["vendors", "deals", "add-vendor", "add-deal"] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    style={{
                      padding: "10px 18px", background: "transparent", border: "none",
                      borderBottom: activeTab === tab ? `2px solid ${CYAN}` : "2px solid transparent",
                      color: activeTab === tab ? CYAN : "rgba(255,255,255,0.45)",
                      fontWeight: 700, fontSize: 13, cursor: "pointer",
                      textTransform: "capitalize", whiteSpace: "nowrap",
                    }}
                  >
                    {tab === "add-vendor" ? "+ Add Vendor" : tab === "add-deal" ? "+ Add Deal" : tab === "vendors" ? "Vendor Directory" : "Deal Pipeline"}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* ── Content ── */}
          <div style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 24px" }}>

            {/* KPIs */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 16, marginBottom: 32 }}>
              <Kpi label="Active Vendors" value={String(summary.totalActive)} icon={<Store size={20} color={CYAN} />} />
              <Kpi label="Total Deals" value={String(summary.totalDeals)} icon={<TrendingUp size={20} color={CYAN} />} />
              <Kpi label="Products Synced" value={vendorList.reduce((a: number, v: any) => a + Number(v.product_count ?? 0), 0).toString()} icon={<Package size={20} color={CYAN} />} />
              <Kpi label="Primary Fulfillment" value="ICC-USA" icon={<Shield size={20} color={GOLD} />} />
            </div>

            {/* ── Vendor Directory Tab ── */}
            {activeTab === "vendors" && (
              <div>
                {vendors.isLoading && <p style={{ color: "rgba(255,255,255,0.5)" }}>Loading vendors...</p>}
                {vendorList.length === 0 && !vendors.isLoading && (
                  <div style={{ textAlign: "center", padding: 48, color: "rgba(255,255,255,0.4)" }}>
                    <Store size={40} style={{ marginBottom: 12 }} />
                    <p>No vendors yet. Add your first vendor partner above.</p>
                  </div>
                )}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 20 }}>
                  {vendorList.map((vendor: any) => (
                    <div key={vendor.id} style={{
                      background: CARD, border: `1px solid ${BORDER}`,
                      borderRadius: 14, padding: 24,
                    }}>
                      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 12 }}>
                        <div>
                          <h3 style={{ fontSize: 18, fontWeight: 800, margin: "0 0 4px" }}>{vendor.name}</h3>
                          <Badge label={vendor.status ?? "active"} color={vendor.status === "active" ? GREEN : GOLD} />
                        </div>
                        <Badge label={vendor.category ?? "other"} color={CYAN} />
                      </div>

                      {vendor.contact_email && (
                        <p style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", margin: "0 0 8px" }}>
                          {vendor.contact_name && <span>{vendor.contact_name} · </span>}
                          <a href={`mailto:${vendor.contact_email}`} style={{ color: CYAN }}>{vendor.contact_email}</a>
                        </p>
                      )}

                      <div style={{ display: "flex", gap: 16, margin: "16px 0", fontSize: 13 }}>
                        <div>
                          <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 11, fontWeight: 600, marginBottom: 2 }}>ACTIVE DEALS</div>
                          <div style={{ fontWeight: 800, color: WHITE }}>{vendor.active_deals ?? 0}</div>
                        </div>
                        <div>
                          <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 11, fontWeight: 600, marginBottom: 2 }}>PRODUCTS</div>
                          <div style={{ fontWeight: 800, color: WHITE }}>{vendor.product_count ?? 0}</div>
                        </div>
                        <div>
                          <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 11, fontWeight: 600, marginBottom: 2 }}>COMMISSION</div>
                          <div style={{ fontWeight: 800, color: WHITE }}>{vendor.commission_pct ?? 0}%</div>
                        </div>
                      </div>

                      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                        <button
                          onClick={() => { setSelectedVendorId(vendor.id); setActiveTab("deals"); }}
                          style={{
                            display: "inline-flex", alignItems: "center", gap: 6,
                            background: "rgba(0,194,255,0.1)", color: CYAN, fontWeight: 700,
                            padding: "8px 14px", borderRadius: 8, border: `1px solid ${BORDER}`,
                            fontSize: 12, cursor: "pointer",
                          }}
                        >
                          <TrendingUp size={12} /> Deals
                        </button>
                        {vendor.slug && (
                          <Link href={`/commerce/vendor/${vendor.slug}`}>
                            <span style={{
                              display: "inline-flex", alignItems: "center", gap: 6,
                              background: "rgba(0,194,255,0.1)", color: CYAN, fontWeight: 700,
                              padding: "8px 14px", borderRadius: 8, border: `1px solid ${BORDER}`,
                              fontSize: 12, cursor: "pointer",
                            }}>
                              <Globe size={12} /> Storefront
                            </span>
                          </Link>
                        )}
                        {vendor.shopify_vendor_tag && (
                          <a
                            href={`https://0010yz-fn.myshopify.com/collections/vendor-marketplace`}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              display: "inline-flex", alignItems: "center", gap: 6,
                              background: "transparent", color: "rgba(255,255,255,0.5)", fontWeight: 700,
                              padding: "8px 14px", borderRadius: 8, border: "1px solid rgba(255,255,255,0.1)",
                              fontSize: 12, cursor: "pointer", textDecoration: "none",
                            }}
                          >
                            <ExternalLink size={12} /> Shopify
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── Deal Pipeline Tab ── */}
            {activeTab === "deals" && (
              <div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
                  <div>
                    <h2 style={{ fontSize: 20, fontWeight: 800, margin: 0 }}>
                      {selectedVendorId
                        ? `Deals — ${vendorList.find((v: any) => v.id === selectedVendorId)?.name ?? "Vendor"}`
                        : "All Vendor Deals"}
                    </h2>
                    {selectedVendorId && (
                      <button onClick={() => setSelectedVendorId(null)} style={{ background: "none", border: "none", color: CYAN, cursor: "pointer", fontSize: 13, padding: 0, marginTop: 4 }}>
                        ← Show all deals
                      </button>
                    )}
                  </div>
                  <button
                    onClick={() => setActiveTab("add-deal")}
                    style={{
                      display: "inline-flex", alignItems: "center", gap: 6,
                      background: CYAN, color: NAVY, fontWeight: 800,
                      padding: "10px 18px", borderRadius: 8, border: "none",
                      fontSize: 13, cursor: "pointer",
                    }}
                  >
                    <Plus size={14} /> New Deal
                  </button>
                </div>

                {/* Pipeline kanban-style by stage */}
                {DEAL_STAGES.map((stage) => {
                  const stageDeals = dealList.filter((d: any) => d.stage === stage.key);
                  if (stageDeals.length === 0) return null;
                  return (
                    <div key={stage.key} style={{ marginBottom: 28 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                        <div style={{ width: 10, height: 10, borderRadius: "50%", background: stage.color }} />
                        <span style={{ fontSize: 13, fontWeight: 800, color: stage.color, textTransform: "uppercase", letterSpacing: 1 }}>
                          {stage.label}
                        </span>
                        <span style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}>({stageDeals.length})</span>
                      </div>
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 14 }}>
                        {stageDeals.map((deal: any) => (
                          <div key={deal.id} style={{
                            background: CARD, border: `1px solid ${stage.color}30`,
                            borderRadius: 12, padding: 20,
                          }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                              <h4 style={{ fontSize: 15, fontWeight: 800, margin: 0, flex: 1 }}>{deal.name}</h4>
                              <Badge label={deal.deal_type ?? "marketplace"} color={PURPLE} />
                            </div>
                            <p style={{ fontSize: 13, color: CYAN, fontWeight: 600, margin: "0 0 8px" }}>
                              {deal.vendor_name}
                            </p>
                            {deal.amount_cents > 0 && (
                              <p style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", margin: "0 0 8px" }}>
                                Value: ${(deal.amount_cents / 100).toLocaleString()}
                              </p>
                            )}
                            {deal.commission_pct && (
                              <p style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", margin: 0 }}>
                                Commission: {deal.commission_pct}%
                              </p>
                            )}
                            {deal.notes && (
                              <p style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", margin: "8px 0 0", lineHeight: 1.4 }}>
                                {deal.notes}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}

                {dealList.length === 0 && !deals.isLoading && (
                  <div style={{ textAlign: "center", padding: 48, color: "rgba(255,255,255,0.4)" }}>
                    <TrendingUp size={40} style={{ marginBottom: 12 }} />
                    <p>No deals yet. Add your first vendor deal above.</p>
                  </div>
                )}
              </div>
            )}

            {/* ── Add Vendor Form ── */}
            {activeTab === "add-vendor" && (
              <div style={{ maxWidth: 560 }}>
                <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 24 }}>Add Vendor Partner</h2>
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  {[
                    { label: "Vendor Name *", key: "name", type: "text", placeholder: "e.g. ICC-USA" },
                    { label: "Slug * (URL-safe, lowercase)", key: "slug", type: "text", placeholder: "e.g. icc-usa" },
                    { label: "Contact Name", key: "contactName", type: "text", placeholder: "e.g. John Smith" },
                    { label: "Contact Email", key: "contactEmail", type: "email", placeholder: "e.g. john@vendor.com" },
                    { label: "Contact Phone", key: "contactPhone", type: "text", placeholder: "e.g. +1 555 000 0000" },
                    { label: "Website", key: "website", type: "url", placeholder: "https://vendor.com" },
                    { label: "Shopify Vendor Tag", key: "shopifyVendorTag", type: "text", placeholder: "Must match Shopify vendor field exactly" },
                    { label: "Commission %", key: "commissionPct", type: "number", placeholder: "0" },
                  ].map((field) => (
                    <div key={field.key}>
                      <label style={{ fontSize: 12, fontWeight: 700, color: "rgba(255,255,255,0.6)", display: "block", marginBottom: 6 }}>
                        {field.label}
                      </label>
                      <input
                        type={field.type}
                        placeholder={field.placeholder}
                        value={(vForm as any)[field.key]}
                        onChange={(e) => setVForm((f) => ({ ...f, [field.key]: field.type === "number" ? Number(e.target.value) : e.target.value }))}
                        style={{
                          width: "100%", padding: "10px 14px", background: CARD,
                          border: `1px solid ${BORDER}`, borderRadius: 8, color: WHITE,
                          fontSize: 14, fontFamily: "inherit", boxSizing: "border-box",
                        }}
                      />
                    </div>
                  ))}

                  <div>
                    <label style={{ fontSize: 12, fontWeight: 700, color: "rgba(255,255,255,0.6)", display: "block", marginBottom: 6 }}>Category</label>
                    <select
                      value={vForm.category}
                      onChange={(e) => setVForm((f) => ({ ...f, category: e.target.value as any }))}
                      style={{ width: "100%", padding: "10px 14px", background: CARD, border: `1px solid ${BORDER}`, borderRadius: 8, color: WHITE, fontSize: 14, fontFamily: "inherit" }}
                    >
                      {VENDOR_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>

                  <div>
                    <label style={{ fontSize: 12, fontWeight: 700, color: "rgba(255,255,255,0.6)", display: "block", marginBottom: 6 }}>Notes</label>
                    <textarea
                      placeholder="Internal notes about this vendor..."
                      value={vForm.notes}
                      onChange={(e) => setVForm((f) => ({ ...f, notes: e.target.value }))}
                      rows={3}
                      style={{ width: "100%", padding: "10px 14px", background: CARD, border: `1px solid ${BORDER}`, borderRadius: 8, color: WHITE, fontSize: 14, fontFamily: "inherit", resize: "vertical", boxSizing: "border-box" }}
                    />
                  </div>

                  <div style={{ display: "flex", gap: 10 }}>
                    <button
                      onClick={() => {
                        if (!vForm.name.trim() || !vForm.slug.trim()) return;
                        upsertVendor.mutate({
                          name: vForm.name,
                          slug: vForm.slug,
                          category: vForm.category,
                          contactName: vForm.contactName || undefined,
                          contactEmail: vForm.contactEmail || undefined,
                          contactPhone: vForm.contactPhone || undefined,
                          website: vForm.website || undefined,
                          shopifyVendorTag: vForm.shopifyVendorTag || undefined,
                          commissionPct: vForm.commissionPct,
                          notes: vForm.notes || undefined,
                        });
                      }}
                      disabled={upsertVendor.isPending}
                      style={{
                        flex: 1, background: CYAN, color: NAVY, fontWeight: 800,
                        padding: "12px 20px", borderRadius: 8, border: "none",
                        fontSize: 14, cursor: "pointer",
                      }}
                    >
                      {upsertVendor.isPending ? "Saving..." : "Add Vendor Partner"}
                    </button>
                    <button
                      onClick={() => setActiveTab("vendors")}
                      style={{
                        background: "transparent", color: "rgba(255,255,255,0.5)", fontWeight: 700,
                        padding: "12px 20px", borderRadius: 8, border: `1px solid ${BORDER}`,
                        fontSize: 14, cursor: "pointer",
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* ── Add Deal Form ── */}
            {activeTab === "add-deal" && (
              <div style={{ maxWidth: 560 }}>
                <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 24 }}>Add Vendor Deal</h2>
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  <div>
                    <label style={{ fontSize: 12, fontWeight: 700, color: "rgba(255,255,255,0.6)", display: "block", marginBottom: 6 }}>Vendor *</label>
                    <select
                      value={dForm.vendorId}
                      onChange={(e) => setDForm((f) => ({ ...f, vendorId: Number(e.target.value) }))}
                      style={{ width: "100%", padding: "10px 14px", background: CARD, border: `1px solid ${BORDER}`, borderRadius: 8, color: WHITE, fontSize: 14, fontFamily: "inherit" }}
                    >
                      <option value={0}>Select vendor...</option>
                      {vendorList.map((v: any) => <option key={v.id} value={v.id}>{v.name}</option>)}
                    </select>
                  </div>

                  {[
                    { label: "Deal Name *", key: "name", type: "text", placeholder: "e.g. ICC-USA Primary Fulfillment Agreement" },
                    { label: "Deal Value (cents)", key: "amountCents", type: "number", placeholder: "0" },
                    { label: "Commission %", key: "commissionPct", type: "number", placeholder: "0" },
                  ].map((field) => (
                    <div key={field.key}>
                      <label style={{ fontSize: 12, fontWeight: 700, color: "rgba(255,255,255,0.6)", display: "block", marginBottom: 6 }}>{field.label}</label>
                      <input
                        type={field.type}
                        placeholder={field.placeholder}
                        value={(dForm as any)[field.key]}
                        onChange={(e) => setDForm((f) => ({ ...f, [field.key]: field.type === "number" ? Number(e.target.value) : e.target.value }))}
                        style={{ width: "100%", padding: "10px 14px", background: CARD, border: `1px solid ${BORDER}`, borderRadius: 8, color: WHITE, fontSize: 14, fontFamily: "inherit", boxSizing: "border-box" }}
                      />
                    </div>
                  ))}

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                    <div>
                      <label style={{ fontSize: 12, fontWeight: 700, color: "rgba(255,255,255,0.6)", display: "block", marginBottom: 6 }}>Stage</label>
                      <select
                        value={dForm.stage}
                        onChange={(e) => setDForm((f) => ({ ...f, stage: e.target.value as any }))}
                        style={{ width: "100%", padding: "10px 14px", background: CARD, border: `1px solid ${BORDER}`, borderRadius: 8, color: WHITE, fontSize: 14, fontFamily: "inherit" }}
                      >
                        {DEAL_STAGES.map((s) => <option key={s.key} value={s.key}>{s.label}</option>)}
                      </select>
                    </div>
                    <div>
                      <label style={{ fontSize: 12, fontWeight: 700, color: "rgba(255,255,255,0.6)", display: "block", marginBottom: 6 }}>Deal Type</label>
                      <select
                        value={dForm.dealType}
                        onChange={(e) => setDForm((f) => ({ ...f, dealType: e.target.value as any }))}
                        style={{ width: "100%", padding: "10px 14px", background: CARD, border: `1px solid ${BORDER}`, borderRadius: 8, color: WHITE, fontSize: 14, fontFamily: "inherit" }}
                      >
                        {DEAL_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label style={{ fontSize: 12, fontWeight: 700, color: "rgba(255,255,255,0.6)", display: "block", marginBottom: 6 }}>Notes</label>
                    <textarea
                      placeholder="Deal notes..."
                      value={dForm.notes}
                      onChange={(e) => setDForm((f) => ({ ...f, notes: e.target.value }))}
                      rows={3}
                      style={{ width: "100%", padding: "10px 14px", background: CARD, border: `1px solid ${BORDER}`, borderRadius: 8, color: WHITE, fontSize: 14, fontFamily: "inherit", resize: "vertical", boxSizing: "border-box" }}
                    />
                  </div>

                  <div style={{ display: "flex", gap: 10 }}>
                    <button
                      onClick={() => {
                        if (!dForm.name.trim() || !dForm.vendorId) return;
                        upsertDeal.mutate({
                          vendorId: dForm.vendorId,
                          name: dForm.name,
                          stage: dForm.stage,
                          dealType: dForm.dealType,
                          amountCents: dForm.amountCents,
                          commissionPct: dForm.commissionPct || undefined,
                          notes: dForm.notes || undefined,
                        });
                      }}
                      disabled={upsertDeal.isPending}
                      style={{
                        flex: 1, background: CYAN, color: NAVY, fontWeight: 800,
                        padding: "12px 20px", borderRadius: 8, border: "none",
                        fontSize: 14, cursor: "pointer",
                      }}
                    >
                      {upsertDeal.isPending ? "Saving..." : "Add Deal"}
                    </button>
                    <button
                      onClick={() => setActiveTab("deals")}
                      style={{
                        background: "transparent", color: "rgba(255,255,255,0.5)", fontWeight: 700,
                        padding: "12px 20px", borderRadius: 8, border: `1px solid ${BORDER}`,
                        fontSize: 14, cursor: "pointer",
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}

          </div>
          <div style={{ height: 80 }} />
        </div>
        <MobileBottomNav />
      </DashboardLayout>
    </RouteErrorBoundary>
  );
}
