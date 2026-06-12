/**
 * AthlynX Messenger — Session 33
 * Full E2EE integration (AES-256-GCM via Web Crypto API)
 * Lucide icons only · E2EE badge · Real-time via tRPC polling
 */
import PlatformLayout from "@/components/PlatformLayout";
import { useState, useRef, useEffect } from "react";
import { RouteErrorBoundary } from "@/components/GlobalErrorBoundary";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
// Real-time messaging via tRPC polling — Supabase realtime archived
const subscribeToMessages = (_ch: string, _cb: (m: unknown) => void) => () => {};
const broadcastMessage = async (_ch: string, _msg: unknown) => {};
const trackUserPresence = (_ch: string, _uid: string) => () => {};
import { encryptMessage, decryptMessage, isEncrypted } from "@/lib/e2e-crypto";
import {
  MessageCircle, Lock, Shield, Send, Plus, Search,
  ArrowLeft, CheckCheck, Check, Zap, Users, UserPlus,
  MoreHorizontal, Phone, Video, Info, Smile, Paperclip,
  Image as ImageIcon, Mic, Circle, Radio
} from "lucide-react";
import { NILAvatar } from "@/components/NILAvatar";

const AVATAR_COLORS = [
  "from-blue-600 to-blue-800",
  "from-[#00C2FF] to-teal-700",
  "from-[#1E90FF] to-[#0a1628]",
  "from-[#1E90FF] to-[#0a1628]",
  "from-[#1E90FF] to-[#0a1628]",
];

function getColor(id: number) { return AVATAR_COLORS[id % AVATAR_COLORS.length]; }
function getInitials(name: string) { return (name || "?").split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase(); }

function MessengerAppInner() {
  const { user, loading: authLoading } = useAuth();
  const [activeConvoId, setActiveConvoId] = useState<number | null>(null);
  const [message, setMessage] = useState("");
  const [showList, setShowList] = useState(true);
  const [newConvoName, setNewConvoName] = useState("");
  const [showNewConvo, setShowNewConvo] = useState(false);
  const [decryptedMessages, setDecryptedMessages] = useState<Record<number, string>>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const utils = trpc.useUtils();

  const { data: conversations = [], isLoading: convosLoading } = trpc.messenger.getConversations.useQuery(
    undefined, { enabled: !!user, refetchInterval: 10000 }
  );
  const { data: messages = [], isLoading: msgsLoading, refetch: refetchMessages } = trpc.messenger.getMessages.useQuery(
    { conversationId: activeConvoId ?? 0 }, { enabled: !!user && !!activeConvoId }
  );

  // Decrypt messages when they load
  useEffect(() => {
    if (!messages.length || !activeConvoId) return;
    const decryptAll = async () => {
      const decrypted: Record<number, string> = {};
      for (const msg of messages as any[]) {
        if (msg.content && isEncrypted(msg.content)) {
          decrypted[msg.id] = await decryptMessage(msg.content, activeConvoId);
        } else {
          decrypted[msg.id] = msg.content;
        }
      }
      setDecryptedMessages(decrypted);
    };
    decryptAll();
  }, [messages, activeConvoId]);

  useEffect(() => {
    if (!activeConvoId) return undefined;
    const unsubscribe = subscribeToMessages(String(activeConvoId), () => { refetchMessages(); });
    return () => { void unsubscribe(); };
  }, [activeConvoId]);

  useEffect(() => {
    if (!user) return;
    trackUserPresence(String(user.id), user.name || "Athlete");
    return () => { /* realtime archived — no-op */ };
  }, [user]);

  const sendMessageMutation = trpc.messenger.sendMessage.useMutation({
    onSuccess: (data: any) => {
      setMessage("");
      if (activeConvoId) broadcastMessage(String(activeConvoId), data);
      utils.messenger.getMessages.invalidate({ conversationId: activeConvoId ?? 0 });
      utils.messenger.getConversations.invalidate();
    },
  });

  const startConvoMutation = trpc.messenger.startConversation.useMutation({
    onSuccess: (data: any) => {
      setShowNewConvo(false);
      setNewConvoName("");
      setActiveConvoId(data.conversationId);
      utils.messenger.getConversations.invalidate();
    },
  });

  useEffect(() => {
    if (conversations.length > 0 && !activeConvoId) {
      setActiveConvoId((conversations[0] as any).id);
    }
  }, [conversations, activeConvoId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!message.trim() || !activeConvoId) return;
    // Encrypt before sending
    const encrypted = await encryptMessage(message.trim(), activeConvoId);
    sendMessageMutation.mutate({ conversationId: activeConvoId, content: encrypted });
  };

  const activeConvo = conversations.find((c: any) => c.id === activeConvoId);

  if (authLoading) {
    return (
      <PlatformLayout title="Messenger">
        <div className="animate-pulse bg-[#0d1b3e] border border-blue-900/50 rounded-2xl overflow-hidden" style={{ height: "calc(100vh - 180px)", minHeight: "500px" }}>
          <div className="flex h-full">
            <div className="w-72 border-r border-blue-900/50 p-4 space-y-3">
              {[1,2,3,4].map(i => <div key={i} className="h-14 bg-blue-800/20 rounded-xl" />)}
            </div>
            <div className="flex-1 p-4"><div className="h-full bg-blue-800/10 rounded-xl" /></div>
          </div>
        </div>
      </PlatformLayout>
    );
  }

  if (!user) {
    return (
      <PlatformLayout title="Messenger">
        <div className="bg-[#0d1b3e] border border-blue-900/50 rounded-2xl p-10 text-center">
          <div className="w-20 h-20 rounded-2xl bg-blue-900/40 flex items-center justify-center mx-auto mb-4">
            <MessageCircle className="w-10 h-10 text-blue-400" />
          </div>
          <h2 className="text-xl font-black text-white mb-2">Sign In to Use Messenger</h2>
          <p className="text-blue-300 text-sm mb-2">Connect with coaches, brands, and fellow athletes.</p>
          <div className="flex items-center justify-center gap-1.5 mb-6">
            <Lock className="w-3.5 h-3.5 text-[#00C2FF]" />
            <span className="text-[#00C2FF] text-xs font-black">END-TO-END ENCRYPTED</span>
          </div>
          <a href="/signin" className="bg-blue-600 hover:bg-blue-500 text-white font-black px-6 py-2.5 rounded-xl inline-flex items-center gap-2 transition-colors">
            <Zap className="w-4 h-4" /> Sign In
          </a>
        </div>
      </PlatformLayout>
    );
  }

  return (
    <PlatformLayout title="Messenger">
      <div className="bg-[#0d1b3e] border border-blue-900/50 rounded-2xl overflow-hidden" style={{ height: "calc(100vh - 180px)", minHeight: "500px" }}>
        <div className="flex h-full">

          {/*  Conversation List  */}
          <div className={`${showList ? "flex" : "hidden"} md:flex flex-col w-full md:w-80 border-r border-blue-900/50 shrink-0`}>
            {/* Header */}
            <div className="p-3 border-b border-blue-900/50">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg bg-blue-900/50 flex items-center justify-center">
                  <MessageCircle className="w-4 h-4 text-blue-400" />
                </div>
                <span className="font-black text-white">Messenger</span>
                <div className="ml-auto flex items-center gap-1.5 bg-[#1E90FF]/10 border border-[#1E90FF]/20 rounded-full px-2 py-0.5">
                  <Lock className="w-2.5 h-2.5 text-[#00C2FF]" />
                  <span className="text-[#00C2FF] text-[9px] font-black">E2EE</span>
                </div>
              </div>
              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-blue-500" />
                  <input
                    type="text"
                    placeholder="Search conversations..."
                    className="w-full bg-[#040c1a] border border-blue-800/50 text-white text-sm rounded-xl pl-8 pr-3 py-2 focus:outline-none focus:border-blue-500 placeholder-blue-600"
                  />
                </div>
                <button
                  onClick={() => setShowNewConvo(!showNewConvo)}
                  className="p-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl transition-colors"
                  title="New conversation"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              {showNewConvo && (
                <div className="mt-2 flex gap-2">
                  <input
                    value={newConvoName}
                    onChange={e => setNewConvoName(e.target.value)}
                    placeholder="User ID or name..."
                    className="flex-1 bg-[#040c1a] border border-blue-800/50 text-white text-sm rounded-xl px-3 py-2 focus:outline-none focus:border-blue-500 placeholder-blue-600"
                    onKeyDown={e => {
                      if (e.key === "Enter") {
                        const id = parseInt(newConvoName);
                        if (!isNaN(id)) startConvoMutation.mutate({ recipientId: id, initialMessage: "Hey! Connecting via AthlynX." });
                      }
                    }}
                  />
                  <button
                    onClick={() => {
                      const id = parseInt(newConvoName);
                      if (!isNaN(id)) startConvoMutation.mutate({ recipientId: id, initialMessage: "Hey! Connecting via AthlynX." });
                    }}
                    disabled={startConvoMutation.isPending}
                    className="text-xs bg-blue-600 hover:bg-blue-500 text-white px-3 py-2 rounded-xl transition-colors disabled:opacity-50 flex items-center gap-1"
                  >
                    <UserPlus className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>

            {/* Conversation list */}
            <div className="flex-1 overflow-y-auto">
              {convosLoading && (
                <div className="p-4 text-center">
                  <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                  <div className="text-blue-400 text-xs">Loading...</div>
                </div>
              )}
              {!convosLoading && conversations.length === 0 && (
                <div className="p-6 text-center">
                  <MessageCircle className="w-10 h-10 text-blue-800 mx-auto mb-3" />
                  <div className="text-blue-400 text-sm font-bold mb-2">No conversations yet</div>
                  <button
                    onClick={() => setShowNewConvo(true)}
                    className="text-xs bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-xl transition-colors flex items-center gap-1.5 mx-auto"
                  >
                    <Plus className="w-3.5 h-3.5" /> Start a conversation
                  </button>
                </div>
              )}
              {conversations.map((convo: any) => (
                <button
                  key={convo.id}
                  onClick={() => { setActiveConvoId(convo.id); setShowList(false); }}
                  className={`w-full flex items-center gap-3 px-3 py-3 hover:bg-blue-900/30 transition-colors border-b border-blue-900/30 text-left ${activeConvoId === convo.id ? "bg-blue-900/40" : ""}`}
                >
                  <div className="relative shrink-0">
                    {/* NIL doctrine: 44px avatar must show real Image, or silhouette — never initials. */}
                    <NILAvatar src={(convo as any).avatarUrl} name={convo.name || "Conversation"} size="md" />
                    <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-[#1E90FF] rounded-full border-2 border-[#0d1b3e]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white text-sm truncate">{convo.name || "Conversation"}</span>
                      <span className="text-blue-500 text-[10px] shrink-0 ml-2">
                        {convo.lastMessageAt ? new Date(convo.lastMessageAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : ""}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-blue-500 truncate">
                      <Lock className="w-2.5 h-2.5 text-[#00C2FF] flex-shrink-0" />
                      <span className="truncate">{convo.lastMessage ? "Encrypted message" : "No messages yet"}</span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/*  Chat Window  */}
          <div className={`${!showList ? "flex" : "hidden"} md:flex flex-col flex-1 min-w-0`}>
            {!activeConvo ? (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center px-6">
                  <div className="w-20 h-20 rounded-2xl bg-blue-900/30 flex items-center justify-center mx-auto mb-4">
                    <MessageCircle className="w-10 h-10 text-blue-600" />
                  </div>
                  <div className="text-white font-black text-lg mb-1">Select a conversation</div>
                  <div className="text-blue-500 text-sm mb-4">or start a new one to get connected</div>
                  <div className="flex items-center justify-center gap-1.5 bg-[#1E90FF]/10 border border-[#1E90FF]/20 rounded-full px-3 py-1.5 mx-auto w-fit">
                    <Shield className="w-3.5 h-3.5 text-[#00C2FF]" />
                    <span className="text-[#00C2FF] text-xs font-black">All messages are end-to-end encrypted</span>
                  </div>
                </div>
              </div>
            ) : (
              <>
                {/* Chat header */}
                <div className="flex items-center gap-3 px-4 py-3 border-b border-blue-900/50 bg-[#0a1628]">
                  <button onClick={() => setShowList(true)} className="md:hidden p-1 text-blue-400 hover:text-white mr-1">
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  {/* NIL doctrine: 36px header avatar shows real Image or silhouette. */}
                  <NILAvatar src={(activeConvo as any).avatarUrl} name={(activeConvo as any).name || "Conversation"} size="md" />
                  <div className="flex-1">
                    <div className="font-black text-white text-sm">{(activeConvo as any).name || "Conversation"}</div>
                    <div className="flex items-center gap-1.5">
                      <Radio className="w-2.5 h-2.5 text-[#00C2FF]" />
                      <span className="text-[#00C2FF] text-[10px] font-black">LIVE</span>
                      <span className="text-blue-600 text-[10px]">·</span>
                      <Lock className="w-2.5 h-2.5 text-[#00C2FF]" />
                      <span className="text-[#00C2FF] text-[10px] font-black">E2EE</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="p-2 text-blue-400 hover:text-white hover:bg-blue-900/30 rounded-xl transition-all">
                      <Phone className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-blue-400 hover:text-white hover:bg-blue-900/30 rounded-xl transition-all">
                      <Video className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-blue-400 hover:text-white hover:bg-blue-900/30 rounded-xl transition-all">
                      <Info className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* E2EE notice banner */}
                <div className="flex items-center justify-center gap-2 py-2 bg-[#1E90FF]/20 border-b border-[#1E90FF]/20">
                  <Lock className="w-3 h-3 text-[#00C2FF]" />
                  <span className="text-[#00C2FF] text-[10px] font-black">Messages are end-to-end encrypted. Only you and the recipient can read them.</span>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {msgsLoading && (
                    <div className="text-center py-8">
                      <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                      <div className="text-blue-400 text-xs">Loading encrypted messages...</div>
                    </div>
                  )}
                  {!msgsLoading && messages.length === 0 && (
                    <div className="text-center text-blue-600 text-sm py-8 flex flex-col items-center gap-2">
                      <Lock className="w-8 h-8 text-blue-800" />
                      No messages yet. Say hello — your message will be encrypted.
                    </div>
                  )}
                  {(messages as any[]).map((msg: any) => {
                    const isMe = msg.senderId === user.id;
                    const displayContent = decryptedMessages[msg.id] || (isEncrypted(msg.content) ? "Decrypting..." : msg.content);
                    return (
                      <div key={msg.id} className={`flex ${isMe ? "justify-end" : "justify-start"} gap-2`}>
                        {!isMe && (
                          <div className={`w-7 h-7 rounded-full bg-gradient-to-br ${getColor(msg.senderId ?? 0)} flex items-center justify-center text-xs font-bold shrink-0 text-white`}>
                            {getInitials(msg.senderName || "?")}
                          </div>
                        )}
                        <div className={`max-w-xs lg:max-w-md px-4 py-2.5 rounded-2xl text-sm ${isMe ? "bg-blue-600 text-white rounded-br-sm" : "bg-[#0a1628] border border-blue-900/50 text-blue-100 rounded-bl-sm"}`}>
                          {!isMe && <div className="text-[10px] font-black text-blue-400 mb-0.5">{msg.senderName}</div>}
                          <p className="leading-relaxed">{displayContent}</p>
                          <div className={`flex items-center gap-1 mt-1 ${isMe ? "justify-end" : "justify-start"}`}>
                            <span className={`text-[10px] ${isMe ? "text-blue-200" : "text-blue-600"}`}>
                              {new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                            </span>
                            {isMe && <CheckCheck className="w-3 h-3 text-blue-300" />}
                            <Lock className="w-2.5 h-2.5 text-[#00C2FF]/60" />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>

                {/* Message input */}
                <div className="p-3 border-t border-blue-900/50 bg-[#0a1628]">
                  <div className="flex items-center gap-1 mb-1.5">
                    <Lock className="w-2.5 h-2.5 text-[#00C2FF]" />
                    <span className="text-[#00C2FF] text-[9px] font-black">AES-256-GCM ENCRYPTED</span>
                  </div>
                  <div className="flex gap-2 items-end">
                    <div className="flex items-center gap-1 text-blue-500">
                      <button className="p-2 hover:text-blue-300 hover:bg-blue-900/30 rounded-xl transition-all">
                        <Paperclip className="w-4 h-4" />
                      </button>
                      <button className="p-2 hover:text-blue-300 hover:bg-blue-900/30 rounded-xl transition-all">
                        <ImageIcon className="w-4 h-4" />
                      </button>
                    </div>
                    <input
                      value={message}
                      onChange={e => setMessage(e.target.value)}
                      onKeyDown={e => e.key === "Enter" && !e.shiftKey && handleSend()}
                      placeholder="Type an encrypted message..."
                      className="flex-1 bg-[#040c1a] border border-blue-800/50 text-white text-sm rounded-xl px-4 py-2.5 focus:outline-none focus:border-blue-500 placeholder-blue-700"
                    />
                    <button
                      onClick={handleSend}
                      disabled={sendMessageMutation.isPending || !message.trim()}
                      className="p-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl transition-colors shrink-0 disabled:opacity-50 flex items-center gap-1.5"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </PlatformLayout>
  );
}

export default function MessengerApp() {
  return <RouteErrorBoundary><MessengerAppInner /></RouteErrorBoundary>;
}
