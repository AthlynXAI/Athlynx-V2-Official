import { trpc } from "@/lib/trpc";
import {
  communicationsOsPrinciples,
  protectedCommunicationClasses,
  providerCapabilities,
  senderIdentityRules,
} from "@shared/communicationsOs";

const badgeTone: Record<string, string> = {
  connected: "bg-emerald-500/15 text-emerald-200 border-emerald-400/30",
  needs_setup: "bg-amber-500/15 text-amber-200 border-amber-400/30",
  planned: "bg-sky-500/15 text-sky-200 border-sky-400/30",
  critical: "bg-red-500/15 text-red-200 border-red-400/30",
  high: "bg-orange-500/15 text-orange-200 border-orange-400/30",
  normal: "bg-blue-500/15 text-blue-200 border-blue-400/30",
  low: "bg-slate-500/15 text-slate-200 border-slate-400/30",
};

function Badge({ children, tone = "normal" }: { children: React.ReactNode; tone?: string }) {
  return (
    <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${badgeTone[tone] ?? badgeTone.normal}`}>
      {children}
    </span>
  );
}

export default function CommunicationsOS() {
  const statusQuery = trpc.communicationsOs.status.useQuery(undefined, {
    retry: false,
    staleTime: 30_000,
  });
  const summaryQuery = trpc.communicationsOs.dashboardSummary.useQuery(undefined, {
    retry: false,
    staleTime: 30_000,
  });

  const status = statusQuery.data;
  const summary = summaryQuery.data;
  const providers = status?.providerCapabilities ?? providerCapabilities;
  const senders = status?.senderIdentityRules ?? senderIdentityRules;
  const protectedClasses = status?.protectedCommunicationClasses ?? protectedCommunicationClasses;
  const principles = status?.principles ?? communicationsOsPrinciples;

  return (
    <main className="min-h-screen bg-slate-950 text-slate-50">
      <section className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-6 py-10 lg:px-10">
        <div className="rounded-[2rem] border border-blue-400/20 bg-gradient-to-br from-slate-900 via-blue-950/70 to-slate-950 p-8 shadow-2xl shadow-blue-950/30">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <Badge tone="connected">Build 29 Layer Cake</Badge>
              <h1 className="mt-5 text-4xl font-black tracking-tight text-white md:text-6xl">
                AthlynXAI Communications OS
              </h1>
              <p className="mt-4 text-lg leading-8 text-blue-100">
                One CRM-controlled command layer for Gmail, Google Workspace, Outlook, iCloud, Gmailify, SMS, sender identity, cleanup, triage, follow-up tasks, and safe real-time replies.
              </p>
            </div>
            <div className="grid min-w-[280px] gap-3 rounded-2xl border border-white/10 bg-white/5 p-5">
              <div className="flex items-center justify-between gap-3">
                <span className="text-sm text-slate-300">Database tables</span>
                <Badge tone={status?.database.ready ? "connected" : "needs_setup"}>
                  {status?.database.presentTables.length ?? 0}/{status?.database.expectedTables ?? 8} ready
                </Badge>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span className="text-sm text-slate-300">Mode</span>
                <Badge tone="normal">safe scaffold</Badge>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span className="text-sm text-slate-300">Source of truth</span>
                <Badge tone="connected">Phone All Inboxes</Badge>
              </div>
            </div>
          </div>
        </div>

        <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
            <div className="text-sm text-slate-400">Accounts</div>
            <div className="mt-2 text-3xl font-black">{summary?.summary.accounts ?? "—"}</div>
            <p className="mt-2 text-sm text-slate-300">Connected/seeded communication accounts after migrations.</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
            <div className="text-sm text-slate-400">Threads</div>
            <div className="mt-2 text-3xl font-black">{summary?.summary.threads ?? "—"}</div>
            <p className="mt-2 text-sm text-slate-300">CRM-linked conversation threads.</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
            <div className="text-sm text-slate-400">Events</div>
            <div className="mt-2 text-3xl font-black">{summary?.summary.events ?? "—"}</div>
            <p className="mt-2 text-sm text-slate-300">Inbound/outbound email and SMS records.</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
            <div className="text-sm text-slate-400">Automation Runs</div>
            <div className="mt-2 text-3xl font-black">{summary?.summary.runs ?? "—"}</div>
            <p className="mt-2 text-sm text-slate-300">Audited automation jobs and cleanup runs.</p>
          </div>
        </section>

        <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
          <div className="mb-5 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="text-2xl font-black">Provider Capability Matrix</h2>
              <p className="mt-2 text-slate-300">This is the control board that tells the CRM what can be cleaned now, what must be centralized, and what needs a one-time connector upgrade.</p>
            </div>
            <Badge tone="connected">Live policy</Badge>
          </div>
          <div className="grid gap-4 lg:grid-cols-2">
            {providers.map((provider) => (
              <article key={provider.id} className="rounded-2xl border border-slate-700/70 bg-slate-900/70 p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h3 className="text-xl font-bold">{provider.label}</h3>
                    <p className="mt-1 text-sm uppercase tracking-[0.2em] text-blue-200">{provider.channel}</p>
                  </div>
                  <Badge tone={provider.status}>{provider.status.replace("_", " ")}</Badge>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {provider.capabilities.map((capability) => (
                    <span key={capability} className="rounded-lg bg-blue-500/10 px-2.5 py-1 text-xs text-blue-100">
                      {capability.replace("_", " ")}
                    </span>
                  ))}
                </div>
                {provider.limitation ? <p className="mt-4 text-sm text-amber-100">{provider.limitation}</p> : null}
                <p className="mt-4 text-sm leading-6 text-slate-300">{provider.crmAction}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
            <h2 className="text-2xl font-black">Sender Identity Rules</h2>
            <p className="mt-2 text-slate-300">The CRM chooses the sender by company context so replies do not come from the wrong business identity.</p>
            <div className="mt-5 grid gap-4">
              {senders.map((sender) => (
                <div key={sender.id} className="rounded-2xl border border-slate-700 bg-slate-900/70 p-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <h3 className="font-bold">{sender.label}</h3>
                    <Badge tone={sender.externallyAllowed ? "connected" : "needs_setup"}>
                      {sender.externallyAllowed ? "external allowed" : "admin only"}
                    </Badge>
                  </div>
                  <p className="mt-2 text-sm text-blue-100">{sender.senderIdentity}</p>
                  <p className="mt-2 text-sm text-slate-300">{sender.note}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
            <h2 className="text-2xl font-black">Protected Classes</h2>
            <p className="mt-2 text-slate-300">These messages are never auto-deleted. They are preserved, classified, and escalated into CRM tasks where needed.</p>
            <div className="mt-5 grid gap-4">
              {protectedClasses.map((item) => (
                <div key={item.id} className="rounded-2xl border border-slate-700 bg-slate-900/70 p-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <h3 className="font-bold">{item.label}</h3>
                    <Badge tone={item.risk}>{item.risk}</Badge>
                  </div>
                  <p className="mt-2 text-sm text-slate-300">Default: {item.defaultAction.replace("_", " ")}</p>
                  <p className="mt-2 text-xs text-slate-400">{item.examples.join(" • ")}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-blue-400/20 bg-blue-950/30 p-6">
          <h2 className="text-2xl font-black">Operating Rules</h2>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {principles.map((principle) => (
              <div key={principle} className="rounded-2xl border border-blue-300/10 bg-slate-950/60 p-4 text-sm leading-6 text-blue-50">
                {principle}
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-3xl border border-amber-400/20 bg-amber-950/20 p-6">
          <h2 className="text-2xl font-black">Next Live Wiring</h2>
          <p className="mt-3 text-slate-200">
            Gmail/Workspace cleanup can run through label, archive, spam, and trash controls. Outlook/iCloud cleanup needs either a connector with move/delete scope or a Gmailify/forwarding path so the CRM can apply the same cleanup engine to those accounts.
          </p>
          <div className="mt-5 grid gap-3 md:grid-cols-3">
            {(summary?.nextProviderWork ?? [
              "Apply migrations 0011/0012/0013 in production.",
              "Add Outlook/iCloud move-delete capability or centralize through Gmailify.",
              "Attach SMS webhook with draft-first reply policy.",
            ]).map((item) => (
              <div key={item} className="rounded-2xl border border-amber-300/10 bg-slate-950/50 p-4 text-sm text-amber-50">
                {item}
              </div>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}
