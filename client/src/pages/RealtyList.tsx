/**
 * /realty/list — List a property.
 * Sign-in required (handled at the router layer).
 */
import React, { useState } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";

const GOLD = "#D4AF37";
const INK = "#0E0E0E";
const PAPER = "#F7F4EC";
const MUTED = "#6B6B6B";

export default function RealtyList() {
  const [, navigate] = useLocation();
  const [form, setForm] = useState({
    title: "",
    description: "",
    city: "",
    state: "",
    bedrooms: 1,
    bathrooms: 1,
    rentUsd: "" as number | "",
    priceUsd: "" as number | "",
    kind: "rental" as "rental" | "for_sale" | "shared" | "host_family" | "team_housing",
    nilFriendly: false,
    nearSchool: "",
  });

  const upsert = trpc.realty.upsertListing.useMutation({
    onSuccess: () => navigate("/realty"),
  });

  function update<K extends keyof typeof form>(k: K, v: (typeof form)[K]) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  async function submit() {
    if (!form.title.trim()) {
      alert("Give your listing a title.");
      return;
    }
    if (!form.city.trim() || !form.state.trim()) {
      alert("City and state are required.");
      return;
    }
    try {
      await upsert.mutateAsync({
        title: form.title,
        description: form.description || undefined,
        city: form.city,
        state: form.state,
        bedrooms: Number(form.bedrooms) || undefined,
        bathrooms: Number(form.bathrooms) || undefined,
        monthlyRentCents:
          typeof form.rentUsd === "number"
            ? Math.round(form.rentUsd * 100)
            : undefined,
        salePriceCents:
          typeof form.priceUsd === "number"
            ? Math.round(form.priceUsd * 100)
            : undefined,
        kind: form.kind,
        nilFriendly: form.nilFriendly,
        nearSchools: form.nearSchool ? [form.nearSchool] : undefined,
      });
    } catch (e: any) {
      alert(e?.message ?? "Could not save listing");
    }
  }

  return (
    <div style={{ background: PAPER, color: INK, minHeight: "100vh" }}>
      <div style={{ maxWidth: 760, margin: "0 auto", padding: "40px 24px 80px" }}>
        <div
          style={{
            fontSize: 11,
            letterSpacing: 3,
            color: GOLD,
            textTransform: "uppercase",
            fontWeight: 800,
          }}
        >
          List a Property
        </div>
        <h1 style={{ fontSize: 32, fontWeight: 800, margin: "6px 0 18px" }}>
          Open a door for an athlete.
        </h1>

        <div
          style={{
            background: "#FFF",
            border: `1px solid ${INK}`,
            borderRadius: 8,
            padding: 16,
            display: "grid",
            gap: 10,
          }}
        >
          <Field label="Title">
            <input
              value={form.title}
              onChange={(e) => update("title", e.target.value)}
              style={inputStyle}
              placeholder="2BR near campus, walking distance to gym"
            />
          </Field>
          <Field label="Description">
            <textarea
              value={form.description}
              onChange={(e) => update("description", e.target.value)}
              rows={4}
              style={{ ...inputStyle, resize: "vertical" }}
              placeholder="Plain words. What an athlete should know."
            />
          </Field>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <Field label="City">
              <input
                value={form.city}
                onChange={(e) => update("city", e.target.value)}
                style={inputStyle}
              />
            </Field>
            <Field label="State">
              <input
                value={form.state}
                onChange={(e) => update("state", e.target.value)}
                style={inputStyle}
                placeholder="TX"
              />
            </Field>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
            <Field label="Bedrooms">
              <input
                type="number"
                value={form.bedrooms}
                onChange={(e) => update("bedrooms", Number(e.target.value))}
                style={inputStyle}
              />
            </Field>
            <Field label="Bathrooms">
              <input
                type="number"
                value={form.bathrooms}
                onChange={(e) => update("bathrooms", Number(e.target.value))}
                style={inputStyle}
              />
            </Field>
            <Field label="Kind">
              <select
                value={form.kind}
                onChange={(e) => update("kind", e.target.value as any)}
                style={inputStyle}
              >
                <option value="rental">Rental</option>
                <option value="for_sale">For sale</option>
                <option value="shared">Roommate / shared</option>
                <option value="host_family">Host family</option>
                <option value="team_housing">Team housing</option>
              </select>
            </Field>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <Field label="Rent (USD / mo)">
              <input
                type="number"
                value={form.rentUsd}
                onChange={(e) =>
                  update("rentUsd", e.target.value ? Number(e.target.value) : "")
                }
                style={inputStyle}
              />
            </Field>
            <Field label="Price (USD, if for sale)">
              <input
                type="number"
                value={form.priceUsd}
                onChange={(e) =>
                  update("priceUsd", e.target.value ? Number(e.target.value) : "")
                }
                style={inputStyle}
              />
            </Field>
          </div>
          <Field label="Near which school">
            <input
              value={form.nearSchool}
              onChange={(e) => update("nearSchool", e.target.value)}
              style={inputStyle}
              placeholder="Texas A&M, MD Anderson area, etc."
            />
          </Field>
          <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <input
              type="checkbox"
              checked={form.nilFriendly}
              onChange={(e) => update("nilFriendly", e.target.checked)}
            />
            NIL-friendly landlord
          </label>

          <button
            onClick={submit}
            disabled={upsert.isPending}
            style={{
              marginTop: 10,
              background: INK,
              color: PAPER,
              border: "none",
              padding: "12px 16px",
              borderRadius: 6,
              fontWeight: 800,
              cursor: "pointer",
            }}
          >
            {upsert.isPending ? "Saving..." : "Publish Listing"}
          </button>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label style={{ display: "block" }}>
      <div
        style={{
          fontSize: 10,
          letterSpacing: 1.6,
          color: MUTED,
          fontWeight: 700,
          marginBottom: 4,
        }}
      >
        {label.toUpperCase()}
      </div>
      {children}
    </label>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "8px 10px",
  border: `1px solid ${INK}`,
  borderRadius: 4,
  fontFamily: "inherit",
  fontSize: 14,
  background: "#FFF",
};
