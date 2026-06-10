import { useState } from "react";
import { trpc } from "@/lib/trpc";

const SHOPIFY_CRAWLER = {
  signature: "sig1=:0kpdFkHfJzWG9QXgg+wDX5QFPjXmIbbbBXDuAzRK/QqBLhmlw/ZaVrvpTB7oqRLxUYPjXxl6iJKEJij5lei0Bg==:",
  signatureInput: `sig1=("@authority" "signature-agent");keyid="SjjyXvQ2cGhsRXs9DXEaV6ClyCun0Pj5yxjV67dLGOk";nonce="gX7jrUxLduE88y32ccqgAsJJDasSFDgN1YJHJYEszzOqRWiho2yM/gzSu7RLN+ScykunxSiyKdbirgNrBu0Yow==";tag="web-bot-auth";created=1780761428;expires=1788537428`,
  signatureAgent: "https://shopify.com",
  expires: "2026-09-03",
  store: "0010yz-fn.myshopify.com",
};

const KEYWORDS = [
  { keyword: "athlete commerce platform", volume: "High", intent: "Commercial", status: "Target" },
  { keyword: "NIL merchandise athletes", volume: "High", intent: "Transactional", status: "Target" },
  { keyword: "diamond grind baseball gear", volume: "Medium", intent: "Transactional", status: "Target" },
  { keyword: "AthlynX sportswear", volume: "Brand", intent: "Navigational", status: "Owned" },
  { keyword: "AthlynXAI platform", volume: "Brand", intent: "Navigational", status: "Owned" },
  { keyword: "warriors playbook coaching", volume: "Medium", intent: "Commercial", status: "Target" },
  { keyword: "ICC-USA sports vendor", volume: "Medium", intent: "Commercial", status: "Partner" },
  { keyword: "athlete vendor marketplace", volume: "High", intent: "Commercial", status: "Target" },
];

const CONNECTORS = [
  { name: "Shopify", status: "Connected", icon: "🛍️", action: "View Store", url: "https://admin.shopify.com" },
  { name: "Meta Ads Manager", status: "Connected", icon: "📊", action: "View Campaigns", url: "https://business.facebook.com" },
  { name: "Instagram", status: "Connected", icon: "📸", action: "View Profile", url: "https://instagram.com" },
  { name: "Google Drive", status: "Connected", icon: "📁", action: "View Drive", url: "https://drive.google.com" },
  { name: "Google Search Console", status: "Not Connected", icon: "🔍", action: "Connect", url: "https://search.google.com/search-console" },
  { name: "Google Analytics", status: "Not Connected", icon: "📈", action: "Connect", url: "https://analytics.google.com" },
];

const SITEMAP_PAGES = [
  { url: "/", priority: "1.0", changefreq: "daily" },
  { url: "/commerce", priority: "0.9", changefreq: "daily" },
  { url: "/commerce/vendor/icc-usa", priority: "0.8", changefreq: "weekly" },
  { url: "/crm/vendors", priority: "0.7", changefreq: "weekly" },
  { url: "/dashboard", priority: "0.8", changefreq: "daily" },
  { url: "/athletes", priority: "0.8", changefreq: "daily" },
  { url: "/nil-portal", priority: "0.9", changefreq: "weekly" },
  { url: "/diamond-grind", priority: "0.8", changefreq: "weekly" },
  { url: "/warriors-playbook", priority: "0.8", changefreq: "weekly" },
];

type Tab = "overview" | "crawler" | "keywords" | "connectors" | "sitemap";

export default function SEODashboard() {
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [copied, setCopied] = useState<string | null>(null);

  const copy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(null), 2000);
  };

  const tabs: { id: Tab; label: string; icon: string }[] = [
    { id: "overview", label: "Overview", icon: "🏠" },
    { id: "crawler", label: "Crawler Access", icon: "🤖" },
    { id: "keywords", label: "Keywords", icon: "🔑" },
    { id: "connectors", label: "SEO Connectors", icon: "🔗" },
    { id: "sitemap", label: "Sitemap", icon: "🗺️" },
  ];

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-3xl">🔍</span>
          <div>
            <h1 className="text-2xl font-bold text-white">AthlynX SEO Command Center</h1>
            <p className="text-gray-400 text-sm">Search engine optimization, crawler access, and connector integrations</p>
          </div>
        </div>
        {/* SEO Score Banner */}
        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Products Indexed", value: "11", color: "text-green-400" },
            { label: "Collections Live", value: "9", color: "text-blue-400" },
            { label: "SEO Tags Set", value: "11/11", color: "text-green-400" },
            { label: "Crawler Status", value: "Active", color: "text-blue-400" },
          ].map((stat) => (
            <div key={stat.label} className="bg-gray-900 rounded-xl p-4 border border-gray-800">
              <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
              <div className="text-gray-400 text-xs mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
              activeTab === tab.id
                ? "bg-blue-600 text-white"
                : "bg-gray-900 text-gray-400 hover:bg-gray-800 hover:text-white"
            }`}
          >
            <span>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
            <h2 className="text-lg font-semibold mb-4">AthlynX Store SEO Status</h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-gray-800">
                <span className="text-gray-400">Store URL</span>
                <span className="text-blue-400 font-mono text-sm">{SHOPIFY_CRAWLER.store}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-800">
                <span className="text-gray-400">Home Page Title</span>
                <span className="text-white text-sm">AthlynX | The Athlete Vendor Marketplace</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-800">
                <span className="text-gray-400">Meta Description</span>
                <span className="text-green-400 text-xs">✓ Set</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-800">
                <span className="text-gray-400">Crawler Signature</span>
                <span className="text-green-400 text-xs">✓ Active (expires {SHOPIFY_CRAWLER.expires})</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-400">Password Protection</span>
                <span className="text-green-400 text-xs">✓ OFF — Store Open</span>
              </div>
            </div>
          </div>
          <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
            <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {[
                { label: "Submit to Google", icon: "🔍", desc: "Submit sitemap to Google Search Console" },
                { label: "Refresh Crawler Key", icon: "🔄", desc: "Generate new Shopify crawler signature" },
                { label: "View Sitemap", icon: "🗺️", desc: "Preview XML sitemap for all pages" },
                { label: "Keyword Report", icon: "📊", desc: "View target keyword rankings" },
                { label: "Meta Ads SEO Sync", icon: "📣", desc: "Sync product catalog to Meta" },
                { label: "Instagram SEO", icon: "📸", desc: "Optimize Instagram bio and links" },
              ].map((action) => (
                <button
                  key={action.label}
                  onClick={() => setActiveTab(action.label.includes("Sitemap") ? "sitemap" : action.label.includes("Keyword") ? "keywords" : "connectors")}
                  className="bg-gray-800 hover:bg-gray-700 rounded-lg p-4 text-left transition-colors border border-gray-700"
                >
                  <div className="text-2xl mb-2">{action.icon}</div>
                  <div className="font-medium text-sm">{action.label}</div>
                  <div className="text-gray-500 text-xs mt-1">{action.desc}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === "crawler" && (
        <div className="space-y-6">
          <div className="bg-blue-900/20 border border-blue-700/50 rounded-xl p-4 mb-4">
            <p className="text-blue-300 text-sm">
              <strong>Shopify Crawler Access Credentials</strong> — Use these HTTP headers to authorize AthlynXAI OS, SEO tools, and indexing services to crawl the AthlynX storefront. Expires <strong>{SHOPIFY_CRAWLER.expires}</strong>.
            </p>
          </div>
          {[
            { label: "Signature", key: "signature", value: SHOPIFY_CRAWLER.signature },
            { label: "Signature-Input", key: "signatureInput", value: SHOPIFY_CRAWLER.signatureInput },
            { label: "Signature-Agent", key: "signatureAgent", value: SHOPIFY_CRAWLER.signatureAgent },
          ].map((field) => (
            <div key={field.key} className="bg-gray-900 rounded-xl p-5 border border-gray-800">
              <div className="flex justify-between items-center mb-3">
                <span className="font-semibold text-white">{field.label}</span>
                <button
                  onClick={() => copy(field.value, field.key)}
                  className="text-xs bg-blue-600 hover:bg-blue-500 px-3 py-1 rounded-lg transition-colors"
                >
                  {copied === field.key ? "✓ Copied!" : "Copy"}
                </button>
              </div>
              <div className="bg-gray-950 rounded-lg p-3 font-mono text-xs text-green-400 break-all">
                {field.value}
              </div>
            </div>
          ))}
          <div className="bg-gray-900 rounded-xl p-5 border border-gray-800">
            <h3 className="font-semibold mb-3">HTTP Headers for Crawler Requests</h3>
            <div className="bg-gray-950 rounded-lg p-4 font-mono text-xs text-gray-300 space-y-2">
              <div><span className="text-blue-400">Signature:</span> {SHOPIFY_CRAWLER.signature}</div>
              <div><span className="text-blue-400">Signature-Input:</span> {SHOPIFY_CRAWLER.signatureInput}</div>
              <div><span className="text-blue-400">Signature-Agent:</span> {SHOPIFY_CRAWLER.signatureAgent}</div>
            </div>
            <button
              onClick={() => copy(
                `Signature: ${SHOPIFY_CRAWLER.signature}\nSignature-Input: ${SHOPIFY_CRAWLER.signatureInput}\nSignature-Agent: ${SHOPIFY_CRAWLER.signatureAgent}`,
                "all"
              )}
              className="mt-3 text-xs bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-lg transition-colors"
            >
              {copied === "all" ? "✓ Copied All!" : "Copy All Headers"}
            </button>
          </div>
        </div>
      )}

      {activeTab === "keywords" && (
        <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
          <div className="p-5 border-b border-gray-800">
            <h2 className="font-semibold">Target Keyword Strategy</h2>
            <p className="text-gray-400 text-sm mt-1">AthlynX SEO keyword targets across all brand lanes</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-800 bg-gray-950">
                  <th className="text-left p-4 text-gray-400 font-medium">Keyword</th>
                  <th className="text-left p-4 text-gray-400 font-medium">Volume</th>
                  <th className="text-left p-4 text-gray-400 font-medium">Intent</th>
                  <th className="text-left p-4 text-gray-400 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {KEYWORDS.map((kw, i) => (
                  <tr key={i} className="border-b border-gray-800 hover:bg-gray-800/50">
                    <td className="p-4 font-medium">{kw.keyword}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded text-xs ${
                        kw.volume === "High" ? "bg-green-900/50 text-green-400" :
                        kw.volume === "Brand" ? "bg-blue-900/50 text-blue-400" :
                        "bg-blue-900/50 text-blue-400"
                      }`}>{kw.volume}</span>
                    </td>
                    <td className="p-4 text-gray-300">{kw.intent}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded text-xs ${
                        kw.status === "Owned" ? "bg-green-900/50 text-green-400" :
                        kw.status === "Partner" ? "bg-purple-900/50 text-purple-400" :
                        "bg-blue-900/50 text-blue-400"
                      }`}>{kw.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === "connectors" && (
        <div className="space-y-4">
          <p className="text-gray-400 text-sm">SEO-relevant connectors and integrations for AthlynX brand visibility</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {CONNECTORS.map((conn) => (
              <div key={conn.name} className="bg-gray-900 rounded-xl p-5 border border-gray-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{conn.icon}</span>
                  <div>
                    <div className="font-medium">{conn.name}</div>
                    <div className={`text-xs mt-1 ${conn.status === "Connected" ? "text-green-400" : "text-blue-400"}`}>
                      {conn.status === "Connected" ? "✓ Connected" : "⚠ Not Connected"}
                    </div>
                  </div>
                </div>
                <a
                  href={conn.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`text-xs px-3 py-2 rounded-lg transition-colors ${
                    conn.status === "Connected"
                      ? "bg-blue-600 hover:bg-blue-500 text-white"
                      : "bg-blue-600 hover:bg-blue-500 text-white"
                  }`}
                >
                  {conn.action}
                </a>
              </div>
            ))}
          </div>
          <div className="bg-blue-900/20 border border-blue-700/50 rounded-xl p-4">
            <p className="text-blue-300 text-sm">
              <strong>Next Step:</strong> Connect Google Search Console and Google Analytics to track AthlynX store rankings and traffic. Go to Manus Connectors → Add Connectors to enable Google integrations.
            </p>
          </div>
        </div>
      )}

      {activeTab === "sitemap" && (
        <div className="space-y-6">
          <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
            <div className="p-5 border-b border-gray-800 flex justify-between items-center">
              <div>
                <h2 className="font-semibold">AthlynXAI OS v1 Sitemap</h2>
                <p className="text-gray-400 text-sm mt-1">All indexable pages for search engine submission</p>
              </div>
              <button
                onClick={() => {
                  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${SITEMAP_PAGES.map(p => `  <url>\n    <loc>https://athlynx.ai${p.url}</loc>\n    <priority>${p.priority}</priority>\n    <changefreq>${p.changefreq}</changefreq>\n  </url>`).join("\n")}\n</urlset>`;
                  copy(xml, "sitemap");
                }}
                className="text-xs bg-blue-600 hover:bg-blue-500 px-3 py-2 rounded-lg transition-colors"
              >
                {copied === "sitemap" ? "✓ Copied!" : "Copy XML"}
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-800 bg-gray-950">
                    <th className="text-left p-4 text-gray-400 font-medium">URL</th>
                    <th className="text-left p-4 text-gray-400 font-medium">Priority</th>
                    <th className="text-left p-4 text-gray-400 font-medium">Change Freq</th>
                  </tr>
                </thead>
                <tbody>
                  {SITEMAP_PAGES.map((page, i) => (
                    <tr key={i} className="border-b border-gray-800 hover:bg-gray-800/50">
                      <td className="p-4 font-mono text-blue-400 text-xs">https://athlynx.ai{page.url}</td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded text-xs ${
                          page.priority === "1.0" ? "bg-green-900/50 text-green-400" :
                          page.priority === "0.9" ? "bg-blue-900/50 text-blue-400" :
                          "bg-gray-700 text-gray-300"
                        }`}>{page.priority}</span>
                      </td>
                      <td className="p-4 text-gray-300 text-xs">{page.changefreq}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="bg-gray-900 rounded-xl p-5 border border-gray-800">
            <h3 className="font-semibold mb-3">Submit to Google Search Console</h3>
            <div className="space-y-2 text-sm text-gray-400">
              <p>1. Connect Google Search Console in Manus Connectors</p>
              <p>2. Verify ownership of <span className="text-blue-400">athlynx.ai</span></p>
              <p>3. Submit sitemap URL: <span className="font-mono text-green-400">https://athlynx.ai/sitemap.xml</span></p>
              <p>4. Also submit Shopify sitemap: <span className="font-mono text-green-400">https://0010yz-fn.myshopify.com/sitemap.xml</span></p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
