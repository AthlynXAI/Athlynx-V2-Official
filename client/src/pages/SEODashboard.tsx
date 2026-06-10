// AthlynXAI OS v1 — SEO Command Center
// Full SEO dashboard: keywords, sitemap, crawler access, connectors.
import { useState } from "react";
import { Link } from "wouter";

const KEYWORDS = [
  { keyword: "athlete NIL platform", volume: "12K/mo", difficulty: "Medium", rank: "#4" },
  { keyword: "college recruiting software", volume: "8.5K/mo", difficulty: "High", rank: "#11" },
  { keyword: "athlete profile builder", volume: "6.2K/mo", difficulty: "Low", rank: "#2" },
  { keyword: "NIL marketplace athletes", volume: "18K/mo", difficulty: "High", rank: "#7" },
  { keyword: "transfer portal tracker", volume: "22K/mo", difficulty: "High", rank: "#5" },
  { keyword: "AI sports recruiting", volume: "4.1K/mo", difficulty: "Medium", rank: "#3" },
  { keyword: "athlete management platform", volume: "3.8K/mo", difficulty: "Medium", rank: "#6" },
  { keyword: "diamond grind baseball", volume: "2.9K/mo", difficulty: "Low", rank: "#1" },
  { keyword: "athlynx app", volume: "1.4K/mo", difficulty: "Low", rank: "#1" },
  { keyword: "athlete OS platform", volume: "900/mo", difficulty: "Low", rank: "#1" },
];

const SITEMAP = [
  { path: "/", priority: "1.0", changefreq: "daily", label: "Home" },
  { path: "/sports", priority: "0.9", changefreq: "daily", label: "Sports Hub" },
  { path: "/apps", priority: "0.9", changefreq: "weekly", label: "Apps Ecosystem" },
  { path: "/nil", priority: "0.9", changefreq: "daily", label: "NIL Portal" },
  { path: "/recruiting", priority: "0.9", changefreq: "daily", label: "Recruiting Hub" },
  { path: "/transfer-portal", priority: "0.8", changefreq: "daily", label: "Transfer Portal" },
  { path: "/training", priority: "0.8", changefreq: "weekly", label: "Training" },
  { path: "/diamond-grind", priority: "0.8", changefreq: "weekly", label: "Diamond Grind" },
  { path: "/gridiron-nexus", priority: "0.8", changefreq: "weekly", label: "Gridiron Nexus" },
  { path: "/court-kings", priority: "0.8", changefreq: "weekly", label: "Court Kings" },
  { path: "/commerce", priority: "0.7", changefreq: "weekly", label: "AthlynX Store" },
  { path: "/ai-engine", priority: "0.7", changefreq: "monthly", label: "AI Engine" },
  { path: "/google-workspace", priority: "0.6", changefreq: "monthly", label: "Google Workspace OS" },
  { path: "/crm", priority: "0.6", changefreq: "weekly", label: "CRM Command Center" },
  { path: "/seo", priority: "0.5", changefreq: "monthly", label: "SEO Dashboard" },
];

const CONNECTORS = [
  { name: "Shopify Store", status: "connected", url: "0010yz-fn.myshopify.com" },
  { name: "Meta Ads Manager", status: "connected", url: "facebook.com/ads" },
  { name: "Instagram Business", status: "connected", url: "instagram.com/athlynxai" },
  { name: "Google Drive", status: "connected", url: "drive.google.com" },
  { name: "Google Search Console", status: "pending", url: "search.google.com/search-console" },
  { name: "Vercel Analytics", status: "connected", url: "vercel.com/analytics" },
];

export default function SEODashboard() {
  const [tab, setTab] = useState<"overview" | "keywords" | "sitemap" | "connectors">("overview");
  const [copied, setCopied] = useState(false);

  const CRAWLER_SIG = `Signature: sig1=:0kpdFkHfJzWG9QXgg+wDX5QFPjXmIbbbBXDuAzRK/QqBLhmlw/ZaVrvpTB7oqRLxUYPjXxl6iJKEJij5lei0Bg==:\nSignature-Input: sig1=("@authority" "signature-agent");keyid="SjjyXvQ2cGhsRXs9DXEaV6ClyCun0Pj5yxjV67dLGOk";nonce="gX7jrUxLduE88y32ccqgAsJJDasSFDgN1YJHJYEszzOqRWiho2yM/gzSu7RLN+ScykunxSiyKdbirgNrBu0Yow==";tag="web-bot-auth";created=1780761428;expires=1788537428\nSignature-Agent: https://shopify.com`;

  const handleCopy = () => {
    navigator.clipboard.writeText(CRAWLER_SIG);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const exportSitemap = () => {
    const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${SITEMAP.map(s => `  <url>\n    <loc>https://athlynx.ai${s.path}</loc>\n    <priority>${s.priority}</priority>\n    <changefreq>${s.changefreq}</changefreq>\n  </url>`).join("\n")}\n</urlset>`;
    const blob = new Blob([xml], { type: "text/xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "sitemap.xml";
    a.click();
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="border-b border-white/10 bg-black/80 backdrop-blur sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="text-white/50 hover:text-white text-sm">← Home</Link>
            <span className="text-white/20">/</span>
            <span className="text-[#1E90FF] font-bold">SEO Command Center</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-green-400 text-xs font-mono">LIVE</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-black tracking-tight">SEO Command Center</h1>
          <p className="text-white/50 mt-1">AthlynXAI OS v1 · Search visibility, keywords, sitemap & crawler access</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Indexed Pages", value: "264", trend: "+12 this week" },
            { label: "Organic Keywords", value: "847", trend: "+34 this month" },
            { label: "Avg. Position", value: "#4.2", trend: "↑ from #6.1" },
            { label: "Monthly Organic", value: "18.4K", trend: "+22% MoM" },
          ].map(s => (
            <div key={s.label} className="bg-white/5 border border-white/10 rounded-xl p-4">
              <div className="text-2xl font-black text-[#1E90FF]">{s.value}</div>
              <div className="text-white/70 text-sm mt-1">{s.label}</div>
              <div className="text-green-400 text-xs mt-1">{s.trend}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-white/10">
          {(["overview", "keywords", "sitemap", "connectors"] as const).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2 text-sm font-semibold capitalize transition-colors border-b-2 -mb-px ${tab === t ? "border-[#1E90FF] text-[#1E90FF]" : "border-transparent text-white/50 hover:text-white"}`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {tab === "overview" && (
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                <h3 className="font-bold text-lg mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <button onClick={exportSitemap} className="w-full text-left px-4 py-3 bg-[#1E90FF]/10 border border-[#1E90FF]/30 rounded-lg text-[#1E90FF] hover:bg-[#1E90FF]/20 transition-colors text-sm font-semibold">
                    📄 Export sitemap.xml
                  </button>
                  <button onClick={handleCopy} className="w-full text-left px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white hover:bg-white/10 transition-colors text-sm font-semibold">
                    {copied ? "✅ Copied!" : "📋 Copy Shopify Crawler Headers"}
                  </button>
                  <a href="https://search.google.com/search-console" target="_blank" rel="noopener noreferrer" className="block px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white hover:bg-white/10 transition-colors text-sm font-semibold">
                    🔍 Open Google Search Console →
                  </a>
                </div>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                <h3 className="font-bold text-lg mb-4">Top Keywords</h3>
                <div className="space-y-2">
                  {KEYWORDS.slice(0, 5).map(k => (
                    <div key={k.keyword} className="flex items-center justify-between text-sm">
                      <span className="text-white/80">{k.keyword}</span>
                      <div className="flex gap-3">
                        <span className="text-white/40">{k.volume}</span>
                        <span className="text-green-400 font-mono">{k.rank}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Keywords Tab */}
        {tab === "keywords" && (
          <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-white/5 border-b border-white/10">
                <tr>
                  <th className="text-left px-4 py-3 text-white/50 font-semibold">Keyword</th>
                  <th className="text-left px-4 py-3 text-white/50 font-semibold">Volume</th>
                  <th className="text-left px-4 py-3 text-white/50 font-semibold">Difficulty</th>
                  <th className="text-left px-4 py-3 text-white/50 font-semibold">Rank</th>
                </tr>
              </thead>
              <tbody>
                {KEYWORDS.map((k, i) => (
                  <tr key={k.keyword} className={`border-b border-white/5 ${i % 2 === 0 ? "" : "bg-white/[0.02]"}`}>
                    <td className="px-4 py-3 text-white font-medium">{k.keyword}</td>
                    <td className="px-4 py-3 text-white/60">{k.volume}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded text-xs font-semibold ${k.difficulty === "Low" ? "bg-green-500/20 text-green-400" : k.difficulty === "Medium" ? "bg-yellow-500/20 text-yellow-400" : "bg-red-500/20 text-red-400"}`}>
                        {k.difficulty}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-[#1E90FF] font-mono font-bold">{k.rank}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Sitemap Tab */}
        {tab === "sitemap" && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <p className="text-white/50 text-sm">{SITEMAP.length} pages indexed</p>
              <button onClick={exportSitemap} className="px-4 py-2 bg-[#1E90FF] text-white rounded-lg text-sm font-semibold hover:bg-[#1E90FF]/80 transition-colors">
                Export sitemap.xml
              </button>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-white/5 border-b border-white/10">
                  <tr>
                    <th className="text-left px-4 py-3 text-white/50 font-semibold">Page</th>
                    <th className="text-left px-4 py-3 text-white/50 font-semibold">Path</th>
                    <th className="text-left px-4 py-3 text-white/50 font-semibold">Priority</th>
                    <th className="text-left px-4 py-3 text-white/50 font-semibold">Changefreq</th>
                  </tr>
                </thead>
                <tbody>
                  {SITEMAP.map((s, i) => (
                    <tr key={s.path} className={`border-b border-white/5 ${i % 2 === 0 ? "" : "bg-white/[0.02]"}`}>
                      <td className="px-4 py-3 text-white font-medium">{s.label}</td>
                      <td className="px-4 py-3 text-[#1E90FF] font-mono text-xs">
                        <Link href={s.path} className="hover:underline">athlynx.ai{s.path}</Link>
                      </td>
                      <td className="px-4 py-3 text-white/60">{s.priority}</td>
                      <td className="px-4 py-3 text-white/60">{s.changefreq}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Connectors Tab */}
        {tab === "connectors" && (
          <div className="space-y-4">
            {CONNECTORS.map(c => (
              <div key={c.name} className="flex items-center justify-between bg-white/5 border border-white/10 rounded-xl p-4">
                <div>
                  <div className="font-semibold">{c.name}</div>
                  <div className="text-white/40 text-xs mt-0.5">{c.url}</div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${c.status === "connected" ? "bg-green-500/20 text-green-400" : "bg-yellow-500/20 text-yellow-400"}`}>
                  {c.status === "connected" ? "✅ Connected" : "⏳ Pending"}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
