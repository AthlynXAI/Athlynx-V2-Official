import { useEffect, useState, useRef } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";

const C = {
  base: "#0A1628",
  card: "#0F1E36",
  border: "#1F3257",
  blue: "#00A3FF",
  white: "#FFFFFF",
  textSecondary: "#B7C3D9",
  textMuted: "#6B7A99",
};

const HIDE_ON = [/^\/signin/, /^\/signup/, /^\/login/, /^\/forgot-password/, /^\/callback/, /^\/auth/, /^\/$/];

export default function CoachLynx() {
  const { user } = useAuth();
  const [location] = useLocation();
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState("");
  const scrollerRef = useRef<HTMLDivElement | null>(null);

  const historyQ = trpc.trainer.history.useQuery(undefined, { enabled: !!user && open });
  const chatM = trpc.trainer.chat.useMutation({
    onSuccess: () => {
      void historyQ.refetch();
    },
  });

  useEffect(() => {
    if (scrollerRef.current) {
      scrollerRef.current.scrollTop = scrollerRef.current.scrollHeight;
    }
  }, [historyQ.data, chatM.isPending]);

  if (!user) return null;
  if (HIDE_ON.some(re => re.test(location))) return null;

  const messages = historyQ.data?.messages ?? [];

  const send = () => {
    const text = draft.trim();
    if (!text || chatM.isPending) return;
    setDraft("");
    chatM.mutate({ message: text, contextScreen: location });
  };

  return (
    <>
      {!open && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Open Coach Lynx"
          style={{
            position: "fixed",
            right: 16,
            top: "calc(env(safe-area-inset-top, 0px) + 72px)",
            zIndex: 40,
            background: C.blue,
            color: C.white,
            border: "none",
            borderRadius: 999,
            padding: "12px 20px",
            fontSize: 14,
            fontWeight: 800,
            letterSpacing: 1.2,
            textTransform: "uppercase",
            boxShadow: "0 12px 36px rgba(0, 163, 255, 0.35)",
            cursor: "pointer",
          }}
        >
          Coach
        </button>
      )}

      {open && (
        <div
          style={{
            position: "fixed",
            right: 16,
            top: "calc(env(safe-area-inset-top, 0px) + 88px)",
            zIndex: 40,
            width: 380,
            maxWidth: "calc(100vw - 32px)",
            height: 540,
            maxHeight: "calc(100dvh - env(safe-area-inset-top, 0px) - env(safe-area-inset-bottom, 0px) - 112px)",
            background: C.card,
            border: `1px solid ${C.border}`,
            borderRadius: 14,
            boxShadow: "0 24px 60px rgba(0, 0, 0, 0.5)",
            display: "flex",
            flexDirection: "column",
            fontFamily: "system-ui, sans-serif",
          }}
        >
          <div
            style={{
              padding: "14px 16px",
              borderBottom: `1px solid ${C.border}`,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <div style={{ color: C.white, fontWeight: 800, fontSize: 14 }}>Coach Lynx</div>
              <div style={{ color: C.textMuted, fontSize: 11, marginTop: 2 }}>Your trainer</div>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close Coach Lynx"
              style={{ background: "transparent", color: C.textMuted, border: "none", fontSize: 18, cursor: "pointer" }}
            >
              ×
            </button>
          </div>

          <div
            ref={scrollerRef}
            style={{
              flex: 1,
              padding: 16,
              overflowY: "auto",
              display: "flex",
              flexDirection: "column",
              gap: 10,
            }}
          >
            {messages.length === 0 && (
              <div style={{ color: C.textMuted, fontSize: 13, lineHeight: 1.6 }}>
                Ask me anything. Practice plan, college list, what to post tonight. Iron sharpens iron.
              </div>
            )}
            {messages.map((m, i) => (
              <div
                key={i}
                style={{
                  alignSelf: m.role === "user" ? "flex-end" : "flex-start",
                  background: m.role === "user" ? C.blue : C.base,
                  color: m.role === "user" ? C.white : C.textSecondary,
                  padding: "10px 14px",
                  borderRadius: 12,
                  maxWidth: "85%",
                  fontSize: 13,
                  lineHeight: 1.5,
                  whiteSpace: "pre-wrap",
                  border: m.role === "assistant" ? `1px solid ${C.border}` : "none",
                }}
              >
                {m.content}
              </div>
            ))}
            {chatM.isPending && (
              <div style={{ color: C.textMuted, fontSize: 12, alignSelf: "flex-start" }}>Thinking…</div>
            )}
          </div>

          <div style={{ borderTop: `1px solid ${C.border}`, padding: 12 }}>
            <textarea
              value={draft}
              onChange={e => setDraft(e.target.value)}
              onKeyDown={e => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  send();
                }
              }}
              placeholder="Talk to Coach Lynx"
              rows={2}
              style={{
                width: "100%",
                background: C.base,
                border: `1px solid ${C.border}`,
                borderRadius: 8,
                color: C.white,
                fontSize: 13,
                padding: "10px 12px",
                resize: "none",
                outline: "none",
                boxSizing: "border-box",
                fontFamily: "inherit",
              }}
            />
            <button
              type="button"
              onClick={send}
              disabled={!draft.trim() || chatM.isPending}
              style={{
                width: "100%",
                marginTop: 8,
                padding: "10px",
                background: chatM.isPending ? "#1c3458" : C.blue,
                color: C.white,
                border: "none",
                borderRadius: 8,
                fontWeight: 700,
                fontSize: 13,
                cursor: chatM.isPending ? "not-allowed" : "pointer",
              }}
            >
              Send
            </button>
          </div>
        </div>
      )}
    </>
  );
}
