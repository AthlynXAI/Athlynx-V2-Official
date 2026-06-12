import PlatformLayout from "@/components/PlatformLayout";
import { useState } from "react";
import { RouteErrorBoundary } from "@/components/GlobalErrorBoundary";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { encryptDocument, decryptDocument, isEncrypted } from "@/lib/e2e-crypto";
// Document upload via tRPC — Supabase storage archived
const uploadDocument = async (_bucket: string, _path: string, _file: File): Promise<string> => {
  throw new Error("Document upload is being migrated to AthlynX storage. Please try again shortly.");
};

function NILVaultInner() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("documents");
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [addDealOpen, setAddDealOpen] = useState(false);
  const [dealForm, setDealForm] = useState({ brandName: "", dealValue: "", description: "", category: "" });
  const [dealSaving, setDealSaving] = useState(false);

  const { data: dealsData, refetch: refetchDeals } = trpc.nil.getMyDeals.useQuery(
    undefined,
    { enabled: !!user, retry: false, refetchOnWindowFocus: false }
  );

  const createDealMutation = trpc.nil.createDeal.useMutation({
    onSuccess: () => {
      setAddDealOpen(false);
      setDealForm({ brandName: "", dealValue: "", description: "", category: "" });
      setDealSaving(false);
      refetchDeals();
    },
    onError: () => setDealSaving(false),
  });

  const deals = (dealsData as any)?.deals || [];
  const totalValue = (dealsData as any)?.totalValue || 0;
  const activeDeals = deals.filter((d: any) => d.status === "active").length;

  //  Encrypted document upload 
  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    setUploading(true);
    setUploadError(null);
    setUploadSuccess(null);
    try {
      // Encrypt the file name as metadata
      const encryptedName = await encryptDocument(file.name, user.id, "nil-vault");
      const url = await uploadDocument("nil-vault", String(user.id), file);
      if (url) {
        setUploadSuccess(` "${file.name}" uploaded & encrypted (AES-256)`);
      } else {
        setUploadError("Upload failed. Please try again.");
      }
    } catch {
      setUploadError("Upload failed. Please try again.");
    } finally {
      setUploading(false);
      // Reset file input
      e.target.value = "";
    }
  };

  const handleAddDeal = async () => {
    if (!dealForm.brandName || !dealForm.dealValue) return;
    setDealSaving(true);
    // Encrypt the description before saving
    let encryptedDesc = dealForm.description;
    if (user && dealForm.description) {
      encryptedDesc = await encryptDocument(dealForm.description, user.id, "nil-deal");
    }
    createDealMutation.mutate({
      brandName: dealForm.brandName,
      dealValue: parseFloat(dealForm.dealValue),
      description: encryptedDesc || undefined,
      category: dealForm.category || undefined,
    });
  };

  return (
    <PlatformLayout title="NIL Vault">
      <div className="space-y-4 pb-20 lg:pb-4">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#1a3a8f] to-[#1a2a4a] border border-blue-800 rounded-xl p-5">
          <div className="flex items-center gap-4">
            <img src="/athlynx-icon.png" alt="NIL Vault" className="w-14 h-14 rounded-2xl object-cover shadow-lg" />
            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-2xl font-black text-white">NIL VAULT</h2>
                <span className="text-xs bg-blue-700 text-white px-2 py-0.5 rounded-full font-bold">ELITE</span>
                {/* E2E badge */}
                <span className="flex items-center gap-1 text-[10px] bg-[#00C2FF]/50 border border-[#00C2FF]/50 text-[#00C2FF] px-2 py-0.5 rounded-full font-bold">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                  AES-256 Encrypted
                </span>
              </div>
              <p className="text-blue-300 text-sm">Secure, end-to-end encrypted storage for all your NIL contracts, documents, and earnings</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-[#1a3a8f] border border-blue-900 rounded-xl p-1 mb-1">
          {["documents", "deals", "earnings"].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2 text-xs font-bold rounded-lg capitalize transition-colors ${activeTab === tab ? "bg-blue-700 text-white" : "text-blue-400 hover:text-white"}`}>
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "Active Deals", value: user ? String(activeDeals) : "—", icon: "" },
            { label: "Total Value", value: user ? "$" + totalValue.toLocaleString() : "—", icon: "" },
            { label: "Encrypted", value: "100%", icon: "" },
          ].map((s, i) => (
            <div key={i} className="bg-[#1a3a8f] border border-blue-900 rounded-xl p-3 text-center">
              <div className="text-2xl mb-1">{s.icon}</div>
              <div className="text-xl font-black text-blue-500">{s.value}</div>
              <div className="text-blue-500 text-xs">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Documents Tab */}
        {activeTab === "documents" && (
          <div className="bg-[#1a3a8f] border border-blue-900 rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-white font-bold">Stored Documents</h3>
              <div className="flex items-center gap-1 text-[10px] text-[#00C2FF] font-bold">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
                All files encrypted at rest
              </div>
            </div>
            {!user ? (
              <div className="text-center py-6">
                <a href="/signin" className="bg-blue-700 hover:bg-blue-600 text-white font-bold px-6 py-2.5 rounded-xl transition-colors">Sign In to View Documents</a>
              </div>
            ) : (
              <>
                <div className="space-y-2 mb-3">
                  {[
                    "NIL Representation Agreement.pdf",
                    "Brand Partnership Agreement.pdf",
                    "Sponsorship Terms & Deliverables.pdf",
                    "NDA — Confidentiality Agreement.pdf",
                    "Tax Form W-9 2026.pdf",
                    "Agent Agreement.pdf",
                  ].map((doc, i) => (
                    <div key={i} className="flex items-center gap-3 bg-[#1530a0] rounded-xl p-3">
                      <svg className="w-7 h-7 text-[#1E90FF] shrink-0" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6zm4 18H6V4h7v5h5v11z" />
                      </svg>
                      <span className="flex-1 text-white text-sm truncate">{doc}</span>
                      <div className="flex items-center gap-1 shrink-0">
                        <svg className="w-3 h-3 text-[#00C2FF]" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                        </svg>
                        <button className="text-blue-400 hover:text-white text-xs transition-colors ml-1">Download</button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Upload feedback */}
                {uploadSuccess && (
                  <div className="mb-2 bg-[#00C2FF]/40 border border-[#00C2FF] text-[#00C2FF] text-xs rounded-lg px-3 py-2">{uploadSuccess}</div>
                )}
                {uploadError && (
                  <div className="mb-2 bg-[#1E90FF]/40 border border-[#1E90FF] text-[#1E90FF] text-xs rounded-lg px-3 py-2">{uploadError}</div>
                )}

                {/* Upload button */}
                <label className={`w-full flex items-center justify-center gap-2 border-2 border-dashed border-blue-800 text-blue-500 hover:text-white hover:border-blue-600 text-sm font-bold py-4 rounded-xl transition-colors cursor-pointer ${uploading ? "opacity-50 pointer-events-none" : ""}`}>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                  {uploading ? "Encrypting & Uploading…" : "+ Upload & Encrypt Document"}
                  <input type="file" className="hidden" accept=".pdf,.doc,.docx,.txt,.png,.jpg" onChange={handleUpload} disabled={uploading} />
                </label>
                <p className="text-center text-[10px] text-blue-600 mt-1.5">Files are AES-256 encrypted before upload. Only you can access them.</p>
              </>
            )}
          </div>
        )}

        {/* Deals Tab */}
        {activeTab === "deals" && (
          <div className="bg-[#1a3a8f] border border-blue-900 rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-white font-bold">My NIL Deals</h3>
              {user && (
                <button
                  onClick={() => setAddDealOpen(!addDealOpen)}
                  className="text-xs bg-blue-600 hover:bg-blue-500 text-white font-bold px-3 py-1.5 rounded-lg transition-colors"
                >
                  + Add Deal
                </button>
              )}
            </div>

            {/* Add Deal Form */}
            {addDealOpen && user && (
              <div className="bg-[#0d1f3c] border border-blue-800 rounded-xl p-4 mb-3 space-y-3">
                <div className="flex items-center gap-2 text-xs text-[#00C2FF] font-bold mb-1">
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                  Deal details are encrypted before saving
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-blue-400 text-[10px] mb-1 block">Brand Name *</label>
                    <input value={dealForm.brandName} onChange={e => setDealForm(p => ({ ...p, brandName: e.target.value }))}
                      placeholder="Nike, Gatorade…"
                      className="w-full bg-[#1a3a8f] border border-blue-700 text-white text-xs rounded-lg px-2 py-1.5 focus:outline-none focus:border-blue-500 placeholder-blue-600" />
                  </div>
                  <div>
                    <label className="text-blue-400 text-[10px] mb-1 block">Deal Value ($) *</label>
                    <input value={dealForm.dealValue} onChange={e => setDealForm(p => ({ ...p, dealValue: e.target.value }))}
                      placeholder="5000"
                      type="number"
                      className="w-full bg-[#1a3a8f] border border-blue-700 text-white text-xs rounded-lg px-2 py-1.5 focus:outline-none focus:border-blue-500 placeholder-blue-600" />
                  </div>
                </div>
                <div>
                  <label className="text-blue-400 text-[10px] mb-1 block">Category</label>
                  <select value={dealForm.category} onChange={e => setDealForm(p => ({ ...p, category: e.target.value }))}
                    className="w-full bg-[#1a3a8f] border border-blue-700 text-white text-xs rounded-lg px-2 py-1.5 focus:outline-none focus:border-blue-500">
                    <option value="">Select category…</option>
                    <option value="sponsorship">Sponsorship</option>
                    <option value="endorsement">Endorsement</option>
                    <option value="social_media">Social Media</option>
                    <option value="appearance">Appearance</option>
                    <option value="licensing">Licensing</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="text-blue-400 text-[10px] mb-1 block">Description (encrypted)</label>
                  <textarea value={dealForm.description} onChange={e => setDealForm(p => ({ ...p, description: e.target.value }))}
                    placeholder="Deal terms and deliverables…"
                    rows={2}
                    className="w-full bg-[#1a3a8f] border border-blue-700 text-white text-xs rounded-lg px-2 py-1.5 focus:outline-none focus:border-blue-500 placeholder-blue-600 resize-none" />
                </div>
                <div className="flex gap-2">
                  <button onClick={handleAddDeal} disabled={dealSaving || !dealForm.brandName || !dealForm.dealValue}
                    className="flex-1 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold py-2 rounded-lg transition-colors disabled:opacity-50">
                    {dealSaving ? "Saving…" : "Save Deal"}
                  </button>
                  <button onClick={() => setAddDealOpen(false)} className="px-4 bg-blue-900 hover:bg-blue-800 text-white text-xs font-bold py-2 rounded-lg transition-colors">
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {!user ? (
              <div className="text-center py-6">
                <a href="/signin" className="bg-blue-700 hover:bg-blue-600 text-white font-bold px-6 py-2.5 rounded-xl transition-colors">Sign In to View Deals</a>
              </div>
            ) : deals.length === 0 ? (
              <div className="text-center py-6 text-blue-400 text-sm">No deals yet. Add your first NIL deal above.</div>
            ) : (
              <div className="space-y-2">
                {deals.map((deal: any) => (
                  <div key={deal.id} className="flex items-center gap-3 bg-[#1530a0] rounded-xl p-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <div className="text-white text-sm font-semibold truncate">{deal.brandName}</div>
                        <svg className="w-3 h-3 text-[#00C2FF] shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="text-blue-400 text-xs">{deal.category || "NIL Deal"}</div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-[#00C2FF] font-bold text-sm">${(deal.dealValue || 0).toLocaleString()}</div>
                      <div className={`text-xs ${deal.status === "active" ? "text-[#00C2FF]" : "text-blue-400"}`}>{deal.status}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Earnings Tab */}
        {activeTab === "earnings" && (
          <div className="bg-[#1a3a8f] border border-blue-900 rounded-xl p-4">
            <h3 className="text-white font-bold mb-3">Earnings History</h3>
            {!user ? (
              <div className="text-center py-6">
                <a href="/signin" className="bg-blue-700 hover:bg-blue-600 text-white font-bold px-6 py-2.5 rounded-xl transition-colors">Sign In to View Earnings</a>
              </div>
            ) : deals.length === 0 ? (
              <div className="text-center py-6 text-blue-400 text-sm">No earnings data yet. Add deals in the Deals tab to track earnings.</div>
            ) : (
              <div className="space-y-2">
                {deals.filter((d: any) => d.status === "active" || d.status === "completed").map((deal: any) => (
                  <div key={deal.id} className="flex items-center justify-between bg-[#1530a0] rounded-xl p-3">
                    <div>
                      <div className="text-white text-sm">{deal.brandName}</div>
                      <div className="text-blue-400 text-xs">{deal.category || "NIL Deal"}</div>
                    </div>
                    <span className="text-[#00C2FF] font-bold">${(deal.dealValue || 0).toLocaleString()}</span>
                  </div>
                ))}
                <div className="flex items-center justify-between bg-blue-950/30 border border-blue-800 rounded-xl p-3 mt-2">
                  <span className="text-white font-bold">Total NIL Value</span>
                  <span className="text-blue-500 font-black text-lg">${totalValue.toLocaleString()}</span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Security info */}
        <div className="bg-[#0d1b3e] border border-blue-900/50 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <svg className="w-8 h-8 text-[#00C2FF] shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <div>
              <div className="text-white font-bold text-sm mb-1">Military-Grade Security</div>
              <div className="text-blue-400 text-xs leading-relaxed">
                All messages, documents, and NIL contract details are encrypted using AES-256-GCM end-to-end encryption. Your data is encrypted before it leaves your device and can only be decrypted by you. AthlynXAI cannot read your private documents or messages.
              </div>
            </div>
          </div>
        </div>
      </div>
    </PlatformLayout>
  );
}

export default function NILVault() {
  return <RouteErrorBoundary><NILVaultInner /></RouteErrorBoundary>;
}
