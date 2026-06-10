/**
 * Soul Source OS — /portal/social-os
 * The Apple Moment dashboard. One keyring, one content pool, one rotation brain.
 */
import { useState } from "react";
import { trpc } from "@/lib/trpc";

type Platform = {
  slug: string;
  name: string;
  category: string;
  posts_per_day: number;
  supports_text: boolean;
  supports_image: boolean;
  supports_video: boolean;
  supports_link: boolean;
  notes: string | null;
};

type Account = {
  id: number;
  platform_slug: string;
  display_name: string;
  handle: string | null;
  external_id: string | null;
  access_token_env: string | null;
  webhook_url: string | null;
  status: string;
  last_used_at: string | null;
  last_error: string | null;
};

type Content = {
  id: number;
  kind: string;
  title: string | null;
  body: string;
  link_url: string | null;
  image_url: string | null;
  video_url: string | null;
  tags: string[] | null;
  content_hash: string;
  is_active: boolean;
  use_count: number;
  last_used_at: string | null;
  created_at: string;
};

type Post = {
  id: number;
  platform_slug: string;
  status: string;
  scheduled_for: string | null;
  posted_at: string | null;
  external_post_url: string | null;
  error: string | null;
  attempt: number;
  kind: string;
  title: string | null;
  body: string;
};

export default function SocialOS() {
  const [tab, setTab] = useState<"accounts" | "content" | "log">("accounts");

  const platforms = trpc.socialOs.platforms.useQuery();
  const accounts = trpc.socialOs.accountsList.useQuery();
  const content = trpc.socialOs.contentList.useQuery({ activeOnly: false, limit: 200 });
  const posts = trpc.socialOs.postsList.useQuery({ limit: 100, sinceHours: 168 });

  return (
    <div style={{ minHeight: "100vh", background: "#0a1628", color: "#e6f1ff", padding: 24, fontFamily: "system-ui, sans-serif" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <h1 style={{ fontSize: 32, fontWeight: 900, margin: 0, marginBottom: 4 }}>Soul Source OS</h1>
        <div style={{ fontSize: 14, color: "rgba(230,241,255,0.6)", marginBottom: 24 }}>
          The Apple Moment. One keyring. One content pool. One rotation brain. Every social and app endpoint flows through here.
        </div>

        {/* Platform catalog */}
        <section style={{ marginBottom: 28 }}>
          <SectionHeader title="Platform Catalog" count={platforms.data?.length ?? 0} />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 10 }}>
            {(platforms.data as Platform[] | undefined)?.map((p) => (
              <div key={p.slug} style={cardStyle}>
                <div style={{ fontWeight: 700, fontSize: 15 }}>{p.name}</div>
                <div style={{ fontSize: 11, color: "rgba(230,241,255,0.55)", marginTop: 2 }}>{p.category} · {p.posts_per_day}/day</div>
                <div style={{ fontSize: 11, color: "rgba(230,241,255,0.7)", marginTop: 6, display: "flex", gap: 6, flexWrap: "wrap" }}>
                  {p.supports_text && <Pill>text</Pill>}
                  {p.supports_image && <Pill>image</Pill>}
                  {p.supports_video && <Pill>video</Pill>}
                  {p.supports_link && <Pill>link</Pill>}
                </div>
                {p.notes && <div style={{ fontSize: 11, color: "rgba(230,241,255,0.5)", marginTop: 8, lineHeight: 1.4 }}>{p.notes}</div>}
              </div>
            ))}
          </div>
        </section>

        {/* Tabs */}
        <div style={{ display: "flex", gap: 8, marginBottom: 16, borderBottom: "1px solid rgba(230,241,255,0.15)" }}>
          <TabButton active={tab === "accounts"} onClick={() => setTab("accounts")}>Accounts</TabButton>
          <TabButton active={tab === "content"} onClick={() => setTab("content")}>Content Pool</TabButton>
          <TabButton active={tab === "log"} onClick={() => setTab("log")}>Post Log</TabButton>
        </div>

        {tab === "accounts" && <AccountsTab data={accounts.data as Account[] | undefined} platforms={platforms.data as Platform[] | undefined} onChange={() => accounts.refetch()} />}
        {tab === "content" && <ContentTab data={content.data as Content[] | undefined} accounts={accounts.data as Account[] | undefined} onChange={() => { content.refetch(); posts.refetch(); }} />}
        {tab === "log" && <LogTab data={posts.data as Post[] | undefined} />}
      </div>
    </div>
  );
}

function SectionHeader({ title, count }: { title: string; count?: number }) {
  return (
    <div style={{ fontSize: 18, fontWeight: 800, marginBottom: 10, color: "#00c2ff", display: "flex", alignItems: "center", gap: 8 }}>
      {title}
      {count !== undefined && <span style={{ fontSize: 12, color: "rgba(230,241,255,0.5)", fontWeight: 500 }}>· {count}</span>}
    </div>
  );
}

function TabButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      style={{
        background: "transparent",
        color: active ? "#00c2ff" : "rgba(230,241,255,0.6)",
        border: "none",
        borderBottom: active ? "2px solid #00c2ff" : "2px solid transparent",
        padding: "10px 14px",
        fontWeight: 700,
        fontSize: 14,
        cursor: "pointer",
        marginBottom: -1,
      }}
    >
      {children}
    </button>
  );
}

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span style={{ background: "rgba(0,194,255,0.15)", color: "#00c2ff", padding: "2px 8px", borderRadius: 10, fontSize: 10, fontWeight: 600 }}>
      {children}
    </span>
  );
}

const cardStyle: React.CSSProperties = {
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: 12,
  padding: 14,
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "10px 12px",
  background: "rgba(255,255,255,0.06)",
  border: "1px solid rgba(255,255,255,0.12)",
  borderRadius: 8,
  color: "#e6f1ff",
  fontSize: 13,
  fontFamily: "system-ui, sans-serif",
  marginBottom: 8,
  boxSizing: "border-box",
};

const btnStyle: React.CSSProperties = {
  background: "#00c2ff",
  color: "#0a1628",
  border: "none",
  borderRadius: 8,
  padding: "8px 14px",
  fontWeight: 700,
  fontSize: 13,
  cursor: "pointer",
};

function AccountsTab({ data, platforms, onChange }: { data: Account[] | undefined; platforms: Platform[] | undefined; onChange: () => void }) {
  const [formOpen, setFormOpen] = useState(false);
  const [platformSlug, setPlatformSlug] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [handle, setHandle] = useState("");
  const [tokenEnv, setTokenEnv] = useState("");
  const [webhook, setWebhook] = useState("");
  const upsert = trpc.socialOs.accountUpsert.useMutation({
    onSuccess: () => { setFormOpen(false); setPlatformSlug(""); setDisplayName(""); setHandle(""); setTokenEnv(""); setWebhook(""); onChange(); },
  });
  const del = trpc.socialOs.accountDelete.useMutation({ onSuccess: onChange });

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
        <div style={{ fontSize: 13, color: "rgba(230,241,255,0.6)" }}>{data?.length ?? 0} accounts connected</div>
        <button style={btnStyle} onClick={() => setFormOpen((v) => !v)}>{formOpen ? "Cancel" : "+ Add account"}</button>
      </div>
      {formOpen && (
        <div style={{ ...cardStyle, marginBottom: 12 }}>
          <select style={inputStyle} value={platformSlug} onChange={(e) => setPlatformSlug(e.target.value)}>
            <option value="">Pick platform</option>
            {platforms?.map((p) => <option key={p.slug} value={p.slug}>{p.name}</option>)}
          </select>
          <input style={inputStyle} placeholder="Display name (e.g. AthlynX Official)" value={displayName} onChange={(e) => setDisplayName(e.target.value)} />
          <input style={inputStyle} placeholder="Handle (@athlynx)" value={handle} onChange={(e) => setHandle(e.target.value)} />
          <input style={inputStyle} placeholder="Token env var name (e.g. BUFFER_ACCESS_TOKEN)" value={tokenEnv} onChange={(e) => setTokenEnv(e.target.value)} />
          <input style={inputStyle} placeholder="Webhook URL" value={webhook} onChange={(e) => setWebhook(e.target.value)} />
          <button
            style={btnStyle}
            disabled={!platformSlug || !displayName}
            onClick={() => upsert.mutate({ platformSlug, displayName, handle: handle || undefined, accessTokenEnv: tokenEnv || undefined, webhookUrl: webhook || undefined })}
          >
            Save account
          </button>
        </div>
      )}
      <div style={{ display: "grid", gap: 8 }}>
        {data?.map((a) => (
          <div key={a.id} style={{ ...cardStyle, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ fontWeight: 700, fontSize: 14 }}>{a.display_name} <span style={{ color: "rgba(230,241,255,0.5)", fontWeight: 500 }}>· {a.platform_slug}</span></div>
              <div style={{ fontSize: 11, color: "rgba(230,241,255,0.55)", marginTop: 4 }}>
                {a.handle && <>{a.handle} · </>}
                Token env: <code style={{ color: a.access_token_env ? "#00c2ff" : "#ff6b6b" }}>{a.access_token_env || "—"}</code> · status: <span style={{ color: a.status === "active" ? "#5dd897" : "#ff6b6b" }}>{a.status}</span>
              </div>
              {a.last_error && <div style={{ fontSize: 11, color: "#ff6b6b", marginTop: 4 }}>{a.last_error}</div>}
            </div>
            <button onClick={() => del.mutate({ id: a.id })} style={{ background: "transparent", color: "#ff6b6b", border: "1px solid rgba(255,107,107,0.4)", borderRadius: 8, padding: "6px 12px", fontSize: 12, cursor: "pointer" }}>Remove</button>
          </div>
        ))}
        {!data?.length && <div style={{ ...cardStyle, color: "rgba(230,241,255,0.5)", fontSize: 13 }}>No accounts yet. Add approved social accounts and publishing destinations.</div>}
      </div>
    </div>
  );
}

type AiDraft = { title: string; body: string; kind: string; tags: string[] };
type AiEngine = "claude" | "gpt" | "gemini" | "sonar";
const ENGINE_LABELS: Record<AiEngine, string> = {
  claude: "Claude",
  gpt: "GPT-4o",
  gemini: "Gemini",
  sonar: "Sonar",
};

function ContentTab({ data, accounts, onChange }: { data: Content[] | undefined; accounts: Account[] | undefined; onChange: () => void }) {
  const [formOpen, setFormOpen] = useState(false);
  const [body, setBody] = useState("");
  const [title, setTitle] = useState("");
  const [link, setLink] = useState("");
  const [image, setImage] = useState("");
  const [video, setVideo] = useState("");
  const [kind, setKind] = useState<string>("text");
  const [theme, setTheme] = useState("");
  const [drafts, setDrafts] = useState<AiDraft[]>([]);
  const [draftEngine, setDraftEngine] = useState<AiEngine | null>(null);
  const [draftError, setDraftError] = useState<string | null>(null);
  const [acceptedIdx, setAcceptedIdx] = useState<Set<number>>(new Set());
  const upsert = trpc.socialOs.contentUpsert.useMutation({
    onSuccess: () => { setFormOpen(false); setBody(""); setTitle(""); setLink(""); setImage(""); setVideo(""); setKind("text"); onChange(); },
  });
  const toggle = trpc.socialOs.contentToggle.useMutation({ onSuccess: onChange });
  const queue = trpc.socialOs.queue.useMutation({ onSuccess: onChange });
  const draftWithAi = trpc.socialOs.draftWithAi.useMutation({
    onSuccess: (res) => { setDrafts(res.drafts ?? []); setDraftError(null); setAcceptedIdx(new Set()); },
    onError: (err) => { setDrafts([]); setDraftError(err.message); },
  });
  const acceptDraft = trpc.socialOs.contentUpsert.useMutation({
    onSuccess: () => { onChange(); },
  });

  function runDraft(engine: AiEngine) {
    if (theme.trim().length < 2) { setDraftError("Theme required (at least 2 characters)."); return; }
    setDraftEngine(engine);
    setDraftError(null);
    setDrafts([]);
    draftWithAi.mutate({ engine, theme: theme.trim() });
  }

  function acceptOne(idx: number, d: AiDraft) {
    acceptDraft.mutate(
      {
        kind: (d.kind as any) || "text",
        title: d.title || undefined,
        body: d.body,
        tags: d.tags && d.tags.length > 0 ? d.tags : undefined,
      },
      { onSuccess: () => { setAcceptedIdx((prev) => { const next = new Set(prev); next.add(idx); return next; }); } },
    );
  }

  return (
    <div>
      {/* AI Draft Helper */}
      <div style={{ ...cardStyle, marginBottom: 12, borderColor: "rgba(0,194,255,0.25)" }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: "#00c2ff", marginBottom: 8 }}>AI Draft Helper</div>
        <div style={{ fontSize: 11, color: "rgba(230,241,255,0.55)", marginBottom: 8 }}>
          Give a theme. Pick an engine. Get 5 drafts in AthlynX voice. Add the keepers to the pool.
        </div>
        <input
          style={inputStyle}
          placeholder="Theme (e.g. backyard to billion, why we exist, the 22, layer cake)"
          value={theme}
          onChange={(e) => setTheme(e.target.value)}
        />
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {(Object.keys(ENGINE_LABELS) as AiEngine[]).map((engine) => (
            <button
              key={engine}
              style={{ ...btnStyle, opacity: draftWithAi.isPending && draftEngine === engine ? 0.6 : 1 }}
              disabled={draftWithAi.isPending || theme.trim().length < 2}
              onClick={() => runDraft(engine)}
            >
              {draftWithAi.isPending && draftEngine === engine ? `Drafting with ${ENGINE_LABELS[engine]}…` : `Draft 5 with ${ENGINE_LABELS[engine]}`}
            </button>
          ))}
        </div>
        {draftError && <div style={{ fontSize: 11, color: "#ff6b6b", marginTop: 8 }}>{draftError}</div>}
        {drafts.length > 0 && (
          <div style={{ marginTop: 12, display: "grid", gap: 8 }}>
            <div style={{ fontSize: 11, color: "rgba(230,241,255,0.5)" }}>
              {drafts.length} drafts from {draftEngine ? ENGINE_LABELS[draftEngine] : "AI"} on “{theme}” · click “Add to pool” on the ones you like
            </div>
            {drafts.map((d, i) => (
              <div key={i} style={{ ...cardStyle, background: "rgba(0,194,255,0.04)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: 12 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: 13 }}>{d.title || `Draft ${i + 1}`} <Pill>{d.kind}</Pill></div>
                    <div style={{ fontSize: 12, color: "rgba(230,241,255,0.8)", marginTop: 6, lineHeight: 1.5, whiteSpace: "pre-wrap" }}>{d.body}</div>
                    {d.tags && d.tags.length > 0 && (
                      <div style={{ fontSize: 10, color: "rgba(230,241,255,0.45)", marginTop: 6 }}>tags: {d.tags.join(", ")}</div>
                    )}
                  </div>
                  <button
                    style={{ ...btnStyle, fontSize: 11, padding: "6px 10px" }}
                    disabled={acceptedIdx.has(i) || acceptDraft.isPending}
                    onClick={() => acceptOne(i, d)}
                  >
                    {acceptedIdx.has(i) ? "Added" : "Add to pool"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
        <div style={{ fontSize: 13, color: "rgba(230,241,255,0.6)" }}>{data?.length ?? 0} content items · the rotation brain reads this pool</div>
        <button style={btnStyle} onClick={() => setFormOpen((v) => !v)}>{formOpen ? "Cancel" : "+ New content"}</button>
      </div>
      {formOpen && (
        <div style={{ ...cardStyle, marginBottom: 12 }}>
          <select style={inputStyle} value={kind} onChange={(e) => setKind(e.target.value)}>
            <option value="text">Text only</option>
            <option value="link">Link</option>
            <option value="image">Image</option>
            <option value="video">Video</option>
            <option value="mixed">Mixed</option>
          </select>
          <input style={inputStyle} placeholder="Title (internal)" value={title} onChange={(e) => setTitle(e.target.value)} />
          <textarea style={{ ...inputStyle, minHeight: 100, fontFamily: "inherit" }} placeholder="Post body" value={body} onChange={(e) => setBody(e.target.value)} />
          <input style={inputStyle} placeholder="Link URL (optional)" value={link} onChange={(e) => setLink(e.target.value)} />
          <input style={inputStyle} placeholder="Image URL (optional)" value={image} onChange={(e) => setImage(e.target.value)} />
          <input style={inputStyle} placeholder="Video URL (optional)" value={video} onChange={(e) => setVideo(e.target.value)} />
          <button
            style={btnStyle}
            disabled={body.length < 3}
            onClick={() => upsert.mutate({ kind: kind as any, title: title || undefined, body, linkUrl: link || undefined, imageUrl: image || undefined, videoUrl: video || undefined })}
          >
            Save content
          </button>
        </div>
      )}
      <div style={{ display: "grid", gap: 8 }}>
        {data?.map((c) => (
          <div key={c.id} style={cardStyle}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: 12 }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: 14 }}>{c.title || `Content #${c.id}`} <Pill>{c.kind}</Pill></div>
                <div style={{ fontSize: 12, color: "rgba(230,241,255,0.75)", marginTop: 6, lineHeight: 1.5, whiteSpace: "pre-wrap" }}>{c.body.slice(0, 240)}{c.body.length > 240 ? "…" : ""}</div>
                <div style={{ fontSize: 10, color: "rgba(230,241,255,0.4)", marginTop: 6 }}>hash: {c.content_hash} · used {c.use_count}× · {c.is_active ? "active" : "paused"}</div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <button
                  style={{ ...btnStyle, fontSize: 11, padding: "6px 10px" }}
                  disabled={!accounts?.length}
                  onClick={() => queue.mutate({ contentId: c.id, accountIds: (accounts ?? []).map((a) => a.id) })}
                >
                  Queue to all
                </button>
                <button
                  onClick={() => toggle.mutate({ id: c.id, isActive: !c.is_active })}
                  style={{ background: "transparent", color: "rgba(230,241,255,0.7)", border: "1px solid rgba(230,241,255,0.25)", borderRadius: 8, padding: "6px 10px", fontSize: 11, cursor: "pointer" }}
                >
                  {c.is_active ? "Pause" : "Activate"}
                </button>
              </div>
            </div>
          </div>
        ))}
        {!data?.length && <div style={{ ...cardStyle, color: "rgba(230,241,255,0.5)", fontSize: 13 }}>No content yet. Add your first post — text, image, video, or link.</div>}
      </div>
    </div>
  );
}

function LogTab({ data }: { data: Post[] | undefined }) {
  return (
    <div style={{ display: "grid", gap: 8 }}>
      {data?.map((p) => (
        <div key={p.id} style={cardStyle}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div style={{ fontWeight: 700, fontSize: 14 }}>{p.platform_slug} <Pill>{p.status}</Pill></div>
            <div style={{ fontSize: 11, color: "rgba(230,241,255,0.5)" }}>{p.posted_at ? new Date(p.posted_at).toLocaleString() : (p.scheduled_for ? `scheduled ${new Date(p.scheduled_for).toLocaleString()}` : "queued")}</div>
          </div>
          <div style={{ fontSize: 12, color: "rgba(230,241,255,0.7)", marginTop: 6 }}>{(p.title || p.body).slice(0, 200)}</div>
          {p.external_post_url && <div style={{ fontSize: 11, marginTop: 4 }}><a href={p.external_post_url} target="_blank" rel="noreferrer" style={{ color: "#00c2ff" }}>View posted →</a></div>}
          {p.error && <div style={{ fontSize: 11, color: "#ff6b6b", marginTop: 4 }}>{p.error}</div>}
        </div>
      ))}
      {!data?.length && <div style={{ ...cardStyle, color: "rgba(230,241,255,0.5)", fontSize: 13 }}>No posts yet. Queue something from the Content tab.</div>}
    </div>
  );
}
