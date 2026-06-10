import { RouteErrorBoundary } from "@/components/GlobalErrorBoundary";
import { Link } from "wouter";
import { useState } from "react";
import { trpc } from "@/lib/trpc";

/**
 * Build 5 — Q&A: the listening post.
 * Athletes ask questions, request features, vote, report bugs.
 * Master admin answers and updates status.
 *
 * This is goldmine #1 for "what do they want next."
 */

type Kind = "question" | "feature_request" | "bug" | "general" | "love" | "hate";
type Status = "open" | "planned" | "in_progress" | "shipped" | "answered" | "closed";

interface QARow {
  id: number;
  display_name: string;
  kind: Kind;
  title: string;
  body: string;
  status: Status;
  upvotes: number;
  downvotes: number;
  is_pinned: boolean;
  answer: string | null;
  answered_by: string | null;
  answered_at: string | null;
  created_at: string;
}

const KIND_LABEL: Record<Kind, string> = {
  question: "Question",
  feature_request: "Feature Request",
  bug: "Bug Report",
  general: "General",
  love: "What I Love",
  hate: "What I Don't Like",
};

const KIND_STYLE: Record<Kind, string> = {
  question: "bg-blue-500/10 text-blue-300 border-blue-500/30",
  feature_request: "bg-purple-500/10 text-purple-300 border-purple-500/30",
  bug: "bg-red-500/10 text-red-300 border-red-500/30",
  general: "bg-white/5 text-white/70 border-white/20",
  love: "bg-green-500/10 text-green-300 border-green-500/30",
  hate: "bg-blue-500/10 text-sky-300 border-blue-500/30",
};

const STATUS_STYLE: Record<Status, string> = {
  open: "bg-white/5 text-white/60 border-white/20",
  planned: "bg-blue-500/10 text-blue-300 border-blue-500/30",
  in_progress: "bg-blue-500/10 text-sky-300 border-blue-500/30",
  shipped: "bg-green-500/10 text-green-300 border-green-500/30",
  answered: "bg-[#00c2ff]/10 text-[#00c2ff] border-[#00c2ff]/30",
  closed: "bg-white/5 text-white/40 border-white/10",
};

function fmt(d?: string | null): string {
  if (!d) return "—";
  try { return new Date(d).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" }); }
  catch { return String(d); }
}

function QAInner() {
  const [sort, setSort] = useState<"top" | "new" | "answered">("top");
  const [filterKind, setFilterKind] = useState<Kind | "all">("all");
  const [formOpen, setFormOpen] = useState(false);
  const [draftKind, setDraftKind] = useState<Kind>("question");
  const [draftTitle, setDraftTitle] = useState("");
  const [draftBody, setDraftBody] = useState("");
  const [draftName, setDraftName] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const utils = trpc.useUtils();
  const listInput = filterKind === "all" ? { sort } : { sort, kind: filterKind };
  const q = trpc.qa.list.useQuery(listInput);

  const createMut = trpc.qa.create.useMutation({
    onSuccess: () => {
      setDraftTitle("");
      setDraftBody("");
      setSubmitted(true);
      utils.qa.list.invalidate();
      setTimeout(() => { setSubmitted(false); setFormOpen(false); }, 1500);
    },
  });

  const voteMut = trpc.qa.vote.useMutation({
    onSuccess: () => utils.qa.list.invalidate(),
  });

  const rows = ((q.data ?? []) as unknown) as QARow[];

  function submit() {
    if (!draftTitle.trim() || !draftBody.trim()) return;
    createMut.mutate({
      kind: draftKind,
      title: draftTitle.trim(),
      body: draftBody.trim(),
      displayName: draftName.trim() || undefined,
    });
  }

  return (
    <div className="min-h-screen bg-[#050c1a] text-white">
      <nav className="sticky top-0 z-50 bg-[#050c1a]/95 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <img src="/athlynx-icon.png" alt="AthlynX" className="w-9 h-9 rounded-lg object-cover" />
            <span className="text-white font-black text-lg tracking-widest">AthlynX</span>
          </Link>
          <div className="flex gap-4 text-sm">
            <Link href="/rules" className="text-[#00c2ff] hover:underline">Rules</Link>
            <Link href="/terms-of-service" className="text-[#00c2ff] hover:underline">Terms</Link>
            <Link href="/privacy-policy" className="text-[#00c2ff] hover:underline">Privacy</Link>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 pt-12 pb-6">
        <div className="mb-2">
          <span className="text-xs text-[#00c2ff] font-semibold uppercase tracking-widest">The Listening Post</span>
        </div>
        <h1 className="text-4xl md:text-6xl font-black mb-4 leading-none">Q&amp;A</h1>
        <p className="text-white/70 text-lg max-w-3xl">
          Ask anything. Tell us what you want. What you love. What you hate. What we're missing. Every question gets seen. The best ones get built.
        </p>
      </div>

      {/* Action bar */}
      <div className="max-w-6xl mx-auto px-4 mb-6">
        <div className="bg-[#0a1628] border border-white/10 rounded-xl p-4 flex flex-wrap gap-3 items-center">
          <button
            onClick={() => setFormOpen((v) => !v)}
            className="px-5 py-2 bg-gradient-to-r from-[#0066ff] to-[#00c2ff] text-white text-sm font-bold rounded-full hover:opacity-90"
          >
            {formOpen ? "× Cancel" : "+ Post Something"}
          </button>

          <div className="flex-1 min-w-[180px]" />

          <div className="flex gap-2 text-xs">
            {(["top", "new", "answered"] as const).map((s) => (
              <button
                key={s}
                onClick={() => setSort(s)}
                className={`px-3 py-1.5 rounded-full font-semibold uppercase tracking-wider border ${sort === s ? "bg-[#00c2ff]/20 text-[#00c2ff] border-[#00c2ff]/40" : "bg-white/5 text-white/60 border-white/10 hover:bg-white/10"}`}
              >
                {s}
              </button>
            ))}
          </div>

          <select
            value={filterKind}
            onChange={(e) => setFilterKind(e.target.value as Kind | "all")}
            className="bg-[#050c1a] border border-white/10 text-white text-xs rounded-full px-3 py-2"
          >
            <option value="all">All kinds</option>
            <option value="question">Questions</option>
            <option value="feature_request">Feature Requests</option>
            <option value="bug">Bug Reports</option>
            <option value="love">Love</option>
            <option value="hate">Don't Like</option>
            <option value="general">General</option>
          </select>
        </div>
      </div>

      {/* Post form */}
      {formOpen ? (
        <div className="max-w-6xl mx-auto px-4 mb-8">
          <div className="bg-[#0a1628] border border-[#00c2ff]/30 rounded-xl p-6">
            <h2 className="text-lg font-bold mb-4">Post Something</h2>
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-[11px] font-bold text-white/50 uppercase tracking-wider mb-1">Kind</label>
                <select value={draftKind} onChange={(e) => setDraftKind(e.target.value as Kind)} className="w-full bg-[#050c1a] border border-white/10 rounded-lg px-3 py-2 text-sm">
                  <option value="question">Question</option>
                  <option value="feature_request">Feature Request</option>
                  <option value="bug">Bug Report</option>
                  <option value="love">What I Love</option>
                  <option value="hate">What I Don't Like</option>
                  <option value="general">General</option>
                </select>
              </div>
              <div>
                <label className="block text-[11px] font-bold text-white/50 uppercase tracking-wider mb-1">Display Name (optional)</label>
                <input value={draftName} onChange={(e) => setDraftName(e.target.value)} placeholder="Anonymous" className="w-full bg-[#050c1a] border border-white/10 rounded-lg px-3 py-2 text-sm" />
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-[11px] font-bold text-white/50 uppercase tracking-wider mb-1">Title</label>
              <input value={draftTitle} onChange={(e) => setDraftTitle(e.target.value)} maxLength={200} placeholder="Short and clear" className="w-full bg-[#050c1a] border border-white/10 rounded-lg px-3 py-2 text-sm" />
            </div>
            <div className="mb-4">
              <label className="block text-[11px] font-bold text-white/50 uppercase tracking-wider mb-1">Details</label>
              <textarea value={draftBody} onChange={(e) => setDraftBody(e.target.value)} rows={5} maxLength={4000} placeholder="Tell us everything." className="w-full bg-[#050c1a] border border-white/10 rounded-lg px-3 py-2 text-sm" />
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={submit}
                disabled={createMut.isPending || !draftTitle.trim() || !draftBody.trim()}
                className="px-5 py-2 bg-gradient-to-r from-[#0066ff] to-[#00c2ff] text-white text-sm font-bold rounded-full disabled:opacity-50"
              >
                {createMut.isPending ? "Posting…" : "Post"}
              </button>
              {submitted ? <span className="text-green-400 text-sm">Posted. Thank you.</span> : null}
              {createMut.error ? <span className="text-red-400 text-sm">Could not post. Try again.</span> : null}
            </div>
          </div>
        </div>
      ) : null}

      {/* List */}
      <div className="max-w-6xl mx-auto px-4 pb-20 space-y-4">
        {q.isPending ? (
          <div className="py-20 text-center text-white/50">Loading…</div>
        ) : rows.length === 0 ? (
          <div className="py-20 text-center text-white/50">Nothing here yet. Be the first to post.</div>
        ) : (
          rows.map((r) => (
            <article key={r.id} className={`bg-[#0a1628] border rounded-xl p-5 ${r.is_pinned ? "border-[#00c2ff]/40" : "border-white/10"}`}>
              <div className="flex items-start gap-4">
                <div className="flex flex-col items-center gap-1 shrink-0">
                  <button onClick={() => voteMut.mutate({ questionId: r.id, direction: 1 })} className="text-white/40 hover:text-green-400" title="Upvote">▲</button>
                  <div className="text-sm font-bold text-white">{r.upvotes - r.downvotes}</div>
                  <button onClick={() => voteMut.mutate({ questionId: r.id, direction: -1 })} className="text-white/40 hover:text-red-400" title="Downvote">▼</button>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider border rounded ${KIND_STYLE[r.kind]}`}>{KIND_LABEL[r.kind]}</span>
                    <span className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider border rounded ${STATUS_STYLE[r.status]}`}>{r.status.replace(/_/g, " ")}</span>
                    {r.is_pinned ? <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider border rounded bg-[#00c2ff]/10 text-[#00c2ff] border-[#00c2ff]/30">Pinned</span> : null}
                  </div>
                  <h3 className="text-base font-bold text-white">{r.title}</h3>
                  <p className="text-sm text-white/70 mt-2 whitespace-pre-wrap">{r.body}</p>
                  <div className="text-[11px] text-white/40 mt-2">{r.display_name || "Anonymous"} · {fmt(r.created_at)}</div>

                  {r.answer ? (
                    <div className="mt-4 pl-4 border-l-2 border-[#00c2ff]/40">
                      <div className="text-[11px] font-bold text-[#00c2ff] uppercase tracking-wider mb-1">AthlynX response</div>
                      <p className="text-sm text-white/80 whitespace-pre-wrap">{r.answer}</p>
                      <div className="text-[11px] text-white/40 mt-1">{r.answered_by ?? "Team"} · {fmt(r.answered_at)}</div>
                    </div>
                  ) : null}
                </div>
              </div>
            </article>
          ))
        )}
      </div>

      <div className="pt-8 pb-12 border-t border-white/10 text-center">
        <p className="text-white/40 text-sm">© {new Date().getFullYear()} Softmor Inc. / Dozier Holdings Group. All rights reserved.</p>
        <div className="flex justify-center gap-6 mt-4 text-sm">
          <Link href="/rules" className="text-[#00c2ff] hover:underline">Rules</Link>
          <Link href="/terms-of-service" className="text-[#00c2ff] hover:underline">Terms</Link>
          <Link href="/privacy-policy" className="text-[#00c2ff] hover:underline">Privacy</Link>
          <Link href="/" className="text-white/50 hover:text-white transition-colors">← Back</Link>
        </div>
      </div>
    </div>
  );
}

export default function QA() {
  return <RouteErrorBoundary><QAInner /></RouteErrorBoundary>;
}
