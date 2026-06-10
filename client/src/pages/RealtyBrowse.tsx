/**
 * /realty — Browse athlete-friendly housing.
 *
 * Chad's words: "Heck we can put real estate structure in there...
 * we start our own Zillow."
 */
import React, { useState } from "react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";

const GOLD = "#D4AF37";
const INK = "#0E0E0E";
const PAPER = "#F7F4EC";
const MUTED = "#6B6B6B";

function fmtUsd(cents: number | string | null | undefined) {
  const n = Number(cents) || 0;
  if (n === 0) return "—";
  return "$" + (n / 100).toLocaleString();
}

export default function RealtyBrowse() {
  const [city, setCity] = useState("");
  const [maxRent, setMaxRent] = useState<number | "">("");
  const [bedrooms, setBedrooms] = useState<number | "">("");
  const [nilFriendly, setNilFriendly] = useState(false);

  const listings = trpc.realty.listListings.useQuery({
    city: city || undefined,
    maxRentCents: typeof maxRent === "number" ? maxRent * 100 : undefined,
    bedrooms: typeof bedrooms === "number" ? bedrooms : undefined,
    nilFriendly: nilFriendly || undefined,
  });

  return (
    <div style={{ background: PAPER, color: INK, minHeight: "100vh" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "40px 24px 80px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
            flexWrap: "wrap",
            gap: 16,
          }}
        >
          <div>
            <div
              style={{
                fontSize: 11,
                letterSpacing: 3,
                color: GOLD,
                textTransform: "uppercase",
                fontWeight: 800,
              }}
            >
              AthlynX Realty — Layer 9
            </div>
            <h1
              style={{
                fontSize: 36,
                fontWeight: 800,
                margin: "6px 0 0",
                letterSpacing: -0.5,
              }}
            >
              A place to live. Built for athletes.
            </h1>
            <p style={{ color: MUTED, fontSize: 15, margin: "6px 0 0" }}>
              Near the school. Near the gym. NIL-friendly when it matters.
            </p>
          </div>
          <Link href="/realty/list" style={{
                background: INK,
                color: PAPER,
                padding: "12px 18px",
                borderRadius: 6,
                fontWeight: 800,
                textDecoration: "none",
              }}>
              List a Property
            </Link>
        </div>

        <div
          style={{
            marginTop: 22,
            padding: 14,
            background: "#FFF",
            border: `1px solid ${INK}`,
            borderRadius: 8,
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
            gap: 10,
          }}
        >
          <input
            placeholder="City"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            style={inputStyle}
          />
          <input
            placeholder="Max rent ($)"
            type="number"
            value={maxRent}
            onChange={(e) =>
              setMaxRent(e.target.value ? Number(e.target.value) : "")
            }
            style={inputStyle}
          />
          <input
            placeholder="Bedrooms"
            type="number"
            value={bedrooms}
            onChange={(e) =>
              setBedrooms(e.target.value ? Number(e.target.value) : "")
            }
            style={inputStyle}
          />
          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              fontSize: 14,
            }}
          >
            <input
              type="checkbox"
              checked={nilFriendly}
              onChange={(e) => setNilFriendly(e.target.checked)}
            />
            NIL-friendly only
          </label>
        </div>

        <div
          style={{
            marginTop: 24,
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
            gap: 14,
          }}
        >
          {((listings.data as any[]) ?? []).map((l: any) => {
            const photos: string[] = Array.isArray(l.photos)
              ? l.photos
              : (() => {
                  try { return JSON.parse(l.photos ?? "[]"); } catch { return []; }
                })();
            const hero = photos[0];
            return (
              <div
                key={l.id}
                style={{
                  background: "#FFF",
                  border: `1px solid ${INK}`,
                  borderRadius: 8,
                  padding: 14,
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <div
                  style={{
                    background: "#E9E4D5",
                    height: 140,
                    borderRadius: 4,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: MUTED,
                    fontSize: 12,
                    letterSpacing: 1.4,
                    overflow: "hidden",
                  }}
                >
                  {hero ? (
                    <img
                      src={hero}
                      alt={l.title}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  ) : (
                    "NO PHOTO"
                  )}
                </div>
                <div style={{ fontWeight: 800, fontSize: 16, marginTop: 10 }}>
                  {l.title}
                </div>
                <div style={{ color: MUTED, fontSize: 13 }}>
                  {[l.city, l.state].filter(Boolean).join(", ") || "—"}
                </div>
                <div style={{ marginTop: 6, fontSize: 14 }}>
                  {l.bedrooms ?? "?"} bd · {l.bathrooms ?? "?"} ba
                  {l.nil_friendly ? (
                    <span
                      style={{
                        marginLeft: 8,
                        background: GOLD,
                        color: INK,
                        padding: "2px 6px",
                        borderRadius: 3,
                        fontSize: 10,
                        fontWeight: 800,
                        letterSpacing: 1.2,
                      }}
                    >
                      NIL
                    </span>
                  ) : null}
                </div>
                <div style={{ marginTop: 6, fontWeight: 800, fontSize: 18 }}>
                  {fmtUsd(l.monthly_rent ?? l.sale_price)}
                  <span style={{ fontSize: 12, color: MUTED, fontWeight: 500 }}>
                    {l.monthly_rent ? "/mo" : ""}
                  </span>
                </div>
              </div>
            );
          })}
          {!listings.isLoading && ((listings.data as any[]) ?? []).length === 0 ? (
            <div style={{ color: MUTED, gridColumn: "1 / -1", padding: 20 }}>
              No listings yet. Be the first — list a property above.
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  padding: "8px 10px",
  border: `1px solid ${INK}`,
  borderRadius: 4,
  fontFamily: "inherit",
  fontSize: 14,
  background: "#FFF",
};
