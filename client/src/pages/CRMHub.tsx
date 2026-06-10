/**
 * /crm-hub — Build 4 CRM dashboard.
 * Accounts, deals, pipeline summary, revenue snapshot.
 */
import React, { useState } from "react";
import { trpc } from "@/lib/trpc";

const GOLD = "#D4AF37";
const INK = "#0E0E0E";
const PAPER = "#F7F4EC";
const MUTED = "#6B6B6B";

function fmtUsd(cents: number | string | null | undefined) {
  const n = Number(cents) || 0;
  return "$" + (n / 100).toLocaleString(undefined, { maximumFractionDigits: 0 });
}

export default function CRMHub() {
  const accounts = trpc.crmHub.listAccounts.useQuery({ limit: 50 });
  const deals = trpc.crmHub.listDeals.useQuery({ limit: 50 });
  const pipeline = trpc.crmHub.pipelineSummary.useQuery();
  const revenue = trpc.crmHub.revenueSnapshot.useQuery();

  const [name, setName] = useState("");
  const upsert = trpc.crmHub.upsertAccount.useMutation({
    onSuccess: () => {
      accounts.refetch();
      setName("");
    },
  });

  const acctList = (accounts.data as any[]) ?? [];
  const dealList = (deals.data as any[]) ?? [];
  const pipeRows = (pipeline.data as any[]) ?? [];
  const rev: any = revenue.data ?? {};

  const openPipeline = pipeRows
    .filter((r: any) => !["closed_won", "closed_lost"].includes(r.stage))
    .reduce((sum: number, r: any) => sum + Number(r.total_cents || 0), 0);
  const wonCents = pipeRows
    .filter((r: any) => r.stage === "closed_won")
    .reduce((sum: number, r: any) => sum + Number(r.total_cents || 0), 0);

  return (
    <div style={{ background: PAPER, color: INK, minHeight: "100vh" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "40px 24px 80px" }}>
        <div
          style={{
            fontSize: 11,
            letterSpacing: 3,
            color: GOLD,
            textTransform: "uppercase",
            fontWeight: 800,
          }}
        >
          CRM Command — Build 4
        </div>
        <h1
          style={{
            fontSize: 36,
            fontWeight: 800,
            margin: "6px 0 0",
            letterSpacing: -0.5,
          }}
        >
          Accounts. Deals. Pipeline.
        </h1>
        <p style={{ color: MUTED, fontSize: 16, margin: "8px 0 24px" }}>
          One spine for every relationship. Scored, tracked, closed.
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: 12,
          }}
        >
          <Kpi label="Open Pipeline" value={fmtUsd(openPipeline)} />
          <Kpi label="Won (closed)" value={fmtUsd(wonCents)} />
          <Kpi label="MRR (Stripe)" value={fmtUsd(rev?.mrr_cents)} />
          <Kpi label="Lifetime Paid" value={fmtUsd(rev?.lifetime_paid_cents)} />
        </div>

        <div
          style={{
            marginTop: 32,
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 16,
          }}
        >
          <Card title="Accounts">
            <div style={{ display: "flex", gap: 6, marginBottom: 12 }}>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="New account name"
                style={{
                  flex: 1,
                  padding: "8px 10px",
                  border: `1px solid ${INK}`,
                  borderRadius: 4,
                  fontFamily: "inherit",
                }}
              />
              <button
                onClick={() =>
                  name.trim() &&
                  upsert.mutate({
                    name: name.trim(),
                    kind: "brand",
                    stage: "lead",
                  } as any)
                }
                style={{
                  background: INK,
                  color: PAPER,
                  border: "none",
                  padding: "8px 14px",
                  borderRadius: 4,
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                Add
              </button>
            </div>
            <Table
              cols={["Name", "Stage", "Kind", "Score"]}
              rows={acctList.slice(0, 25).map((a: any) => [
                a.name ?? "—",
                a.stage ?? "—",
                a.kind ?? "—",
                String(a.health_score ?? 0),
              ])}
              empty="No accounts yet."
            />
          </Card>

          <Card title="Deals">
            <Table
              cols={["Deal", "Account", "Stage", "Amount"]}
              rows={dealList.slice(0, 25).map((d: any) => [
                d.name ?? "—",
                d.account_name ?? "—",
                d.stage ?? "lead",
                fmtUsd(d.amount_cents),
              ])}
              empty="No deals yet."
            />
          </Card>
        </div>

        <div
          style={{
            marginTop: 24,
            background: "#FFF",
            border: `1px solid ${INK}`,
            borderRadius: 8,
            padding: 16,
          }}
        >
          <div style={{ fontWeight: 800, fontSize: 16, marginBottom: 10 }}>
            Pipeline by Stage
          </div>
          <Table
            cols={["Stage", "Count", "Total", "Weighted"]}
            rows={pipeRows.map((r: any) => [
              r.stage,
              String(r.count),
              fmtUsd(r.total_cents),
              fmtUsd(r.weighted_cents),
            ])}
            empty="Pipeline is empty."
          />
        </div>
      </div>
    </div>
  );
}

function Kpi({ label, value }: { label: string; value: string }) {
  return (
    <div
      style={{
        background: "#FFF",
        border: `1px solid ${INK}`,
        borderRadius: 8,
        padding: 14,
      }}
    >
      <div style={{ fontSize: 10, letterSpacing: 2, color: MUTED, fontWeight: 700 }}>
        {label.toUpperCase()}
      </div>
      <div style={{ fontSize: 28, fontWeight: 800, marginTop: 4 }}>{value}</div>
    </div>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div
      style={{
        background: "#FFF",
        border: `1px solid ${INK}`,
        borderRadius: 8,
        padding: 16,
      }}
    >
      <div style={{ fontWeight: 800, fontSize: 16, marginBottom: 10 }}>{title}</div>
      {children}
    </div>
  );
}

function Table({
  cols,
  rows,
  empty,
}: {
  cols: string[];
  rows: string[][];
  empty: string;
}) {
  if (!rows.length) {
    return <div style={{ color: MUTED, fontSize: 13 }}>{empty}</div>;
  }
  return (
    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
      <thead>
        <tr>
          {cols.map((c) => (
            <th
              key={c}
              style={{
                textAlign: "left",
                fontSize: 11,
                letterSpacing: 1.4,
                color: MUTED,
                fontWeight: 700,
                padding: "6px 4px",
                borderBottom: `1px solid #E2DFD6`,
              }}
            >
              {c.toUpperCase()}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((r, i) => (
          <tr key={i}>
            {r.map((v, j) => (
              <td
                key={j}
                style={{
                  padding: "6px 4px",
                  borderBottom: `1px solid #F0EEE6`,
                }}
              >
                {v}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
