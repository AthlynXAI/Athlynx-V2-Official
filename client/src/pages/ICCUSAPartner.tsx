import { RouteErrorBoundary } from "@/components/GlobalErrorBoundary";
import { Link } from 'wouter';
import PlatformLayout from "@/components/PlatformLayout";
import MobileBottomNav from '@/components/MobileBottomNav'
import { Server, Cpu, HardDrive, Zap, Shield, Award, ExternalLink, ChevronRight, Star, Globe, Phone, Mail, CheckCircle, TrendingUp, Database, Monitor } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';

const ICC_PRODUCTS = [
  {
    category: "AI GPU Servers",
    icon: <Cpu className="w-6 h-6" />,
    color: "from-blue-600 to-blue-800",
    badge: "NVIDIA ELITE",
    products: [
      {
        name: "Aquarius R-117A",
        tagline: "High-density AI infrastructure · private technical review",
        specs: ["High-density accelerator configuration", "Advanced cooling form factor", "High-bandwidth memory architecture", "High-speed fabric architecture", "Designed for approved AI workloads"],
        badge: "NEW — Mar 2026",
        badgeColor: "bg-[#00C2FF]",
        featured: true,
      },
      {
        name: "GPU Server — H100 8x",
        tagline: "8× NVIDIA H100 SXM5 · 80GB HBM3 · Enterprise AI",
        specs: ["8× NVIDIA H100 SXM5 80GB HBM3", "NVLink 4.0 900 GB/s GPU-to-GPU", "NDR InfiniBand 400 Gbps", "Dual Intel Xeon Platinum", "Up to 2TB DDR5 ECC System RAM"],
        badge: "ENTERPRISE",
        badgeColor: "bg-blue-600",
        featured: true,
      },
      {
        name: "GPU Server — H200 8x",
        tagline: "Multi-accelerator private infrastructure review",
        specs: ["Multi-accelerator configuration", "High-bandwidth architecture", "Private interconnect architecture", "Enterprise CPU configuration", "Up to 4TB DDR5 ECC System RAM"],
        badge: "FLAGSHIP",
        badgeColor: "bg-blue-700",
        featured: true,
      },
      {
        name: "GPU Server — B200 8x",
        tagline: "8× NVIDIA Blackwell B200 · 288GB HBM3e · 8 TB/s",
        specs: ["8× NVIDIA B200 Tensor Core GPU", "288GB HBM3e · 8 TB/s Bandwidth", "11× H100 Inference Performance", "NDR InfiniBand 2× vs H100", "Trillion-parameter LLM Ready"],
        badge: "BLACKWELL",
        badgeColor: "bg-[#1E90FF]",
        featured: false,
      },
    ],
  },
  {
    category: "Custom Enterprise Servers",
    icon: <Server className="w-6 h-6" />,
    color: "from-[#1E90FF] to-indigo-800",
    badge: "SUPERMICRO",
    products: [
      {
        name: "2U Silver — 256GB DDR5",
        tagline: "Supermicro 2U · Intel Xeon Silver 4514Y · Enterprise",
        specs: ["Supermicro SYS-221H-TNR", "2× Intel Xeon Silver 4514Y (16C/32T)", "256GB DDR5 4800MHz ECC", "8× 2.5\" NVMe/SATA/SAS + 2× M.2", "Micron 5400 PRO 480GB M.2 SSD"],
        badge: "ENTERPRISE",
        badgeColor: "bg-blue-600",
        featured: true,
      },
      {
        name: "2U Platinum — 32C/64T",
        tagline: "Supermicro 2U · Intel Xeon Platinum 8562Y+ · AI Workloads",
        specs: ["Supermicro SYS-221H-TNR", "2× Intel Xeon Platinum 8562Y+ (32C/64T, 300W)", "256GB DDR5 5600MHz ECC (32GB×8)", "8× 2.5\" NVMe/SATA/SAS + 2× M.2", "Enterprise-grade AI workloads"],
        badge: "PLATINUM",
        badgeColor: "bg-blue-700",
        featured: true,
      },
      {
        name: "4U 60-Bay Hyperscale",
        tagline: "Supermicro 4U 60-Bay · Intel Xeon 6521P · 30T Storage",
        specs: ["Supermicro SSG-542B-E1CR60", "Intel Xeon 6521P (24C/48T, 225W)", "128GB DDR5 6400MHz ECC", "60× 3.5\" SATA/SAS + 2× M.2", "1+1 2000W Redundant PSU"],
        badge: "HYPERSCALE",
        badgeColor: "bg-[#1E90FF]",
        featured: false,
      },
      {
        name: "2U Silver — Storage Optimized",
        tagline: "Supermicro 2U · Intel Xeon Silver 4514Y · 64GB DDR5",
        specs: ["Supermicro SYS-221H-TNR", "2× Intel Xeon Silver 4514Y (16C/32T)", "64GB DDR5 5600MHz ECC", "Micron 5400 PRO 480GB M.2 SSD", "8× 2.5\" NVMe/SATA/SAS"],
        badge: "STORAGE",
        badgeColor: "bg-[#1565C0]",
        featured: false,
      },
    ],
  },
  {
    category: "AI Workstations",
    icon: <Monitor className="w-6 h-6" />,
    color: "from-[#1E90FF] to-[#0a1628]",
    badge: "WORKSTATION",
    products: [
      {
        name: "AI Workstation — RTX 6000 Ada",
        tagline: "NVIDIA RTX 6000 Ada · 48GB GDDR6 · Professional AI",
        specs: ["NVIDIA RTX 6000 Ada Generation", "48GB GDDR6 ECC Memory", "Intel Core i9 / AMD Threadripper", "Up to 256GB DDR5 ECC RAM", "PCIe 5.0 · Thunderbolt 4"],
        badge: "PROFESSIONAL",
        badgeColor: "bg-blue-600",
        featured: true,
      },
      {
        name: "AI Workstation — RTX 5000 Ada",
        tagline: "NVIDIA RTX 5000 Ada · 32GB GDDR6 · Design & AI",
        specs: ["NVIDIA RTX 5000 Ada Generation", "32GB GDDR6 ECC Memory", "Intel Core i9-14900K", "128GB DDR5 ECC RAM", "Dual 10GbE Networking"],
        badge: "CREATOR",
        badgeColor: "bg-[#1E90FF]",
        featured: false,
      },
      {
        name: "NVIDIA RTX Blackwell Workstation",
        tagline: "RTX Blackwell · Next-Gen AI & Visualization",
        specs: ["NVIDIA RTX Blackwell Architecture", "Next-generation DLSS 4 AI", "Multi-GPU NVLink Support", "PCIe 5.0 Platform", "Showcased at SIGGRAPH 2025"],
        badge: "BLACKWELL NEW",
        badgeColor: "bg-[#1E90FF]",
        featured: true,
      },
    ],
  },
  {
    category: "Financial Trading Systems",
    icon: <TrendingUp className="w-6 h-6" />,
    color: "from-[#1E90FF] to-[#0a1628]",
    badge: "ULTRA-LOW LATENCY",
    products: [
      {
        name: "Trading Server — Ultra-Low Latency",
        tagline: "Sub-microsecond latency · NYSE/NASDAQ co-location ready",
        specs: ["Intel Xeon w9-3595X (60C/120T)", "Ultra-low latency BIOS tuning", "Solarflare/Mellanox RDMA NICs", "FPGA acceleration option", "NYSE/NASDAQ co-location certified"],
        badge: "HFT READY",
        badgeColor: "bg-[#1E90FF]",
        featured: true,
      },
      {
        name: "Overclocked Trading Server",
        tagline: "Maximum single-thread performance · Algorithmic trading",
        specs: ["Intel Core i9-14900KS Overclocked", "DDR5 7200MHz+ Tuned Memory", "Custom liquid cooling solution", "Redundant 10GbE + 25GbE", "24/7 mission-critical uptime"],
        badge: "OVERCLOCKED",
        badgeColor: "bg-[#1E90FF]",
        featured: false,
      },
    ],
  },
  {
    category: "Storage Solutions",
    icon: <Database className="w-6 h-6" />,
    color: "from-slate-600 to-slate-800",
    badge: "ENTERPRISE STORAGE",
    products: [
      {
        name: "All-Flash NVMe Array",
        tagline: "Pure NVMe · Petabyte-scale · AI/ML data pipelines",
        specs: ["All-NVMe U.2/U.3 Architecture", "Up to 1PB raw capacity", "100 GB/s sequential read", "Sub-100μs latency", "RAID 0/1/5/6/10/60 support"],
        badge: "ALL-FLASH",
        badgeColor: "bg-blue-600",
        featured: true,
      },
      {
        name: "Advanced Storage Server",
        tagline: "Hybrid NVMe/SAS · High-capacity data center storage",
        specs: ["Supermicro 4U 90-Bay chassis", "Intel Xeon Scalable processor", "NVMe caching tier + SAS capacity", "12Gb/s SAS3 backplane", "Redundant PSU + hot-swap drives"],
        badge: "HIGH CAPACITY",
        badgeColor: "bg-slate-600",
        featured: false,
      },
    ],
  },
];

const PARTNERS = [
  { name: "NVIDIA", desc: "Elite Partner 2024 — AI & Accelerated Computing", color: "text-[#00C2FF]", icon: "" },
  { name: "AMD", desc: "EPYC Processor Partner — Data Center CPUs", color: "text-[#1E90FF]", icon: "" },
  { name: "Dell Technologies", desc: "OEM Hardware Partner — Enterprise Servers", color: "text-blue-400", icon: "" },
  { name: "Intel", desc: "Xeon Scalable & Core Platform Partner", color: "text-[#00C2FF]", icon: "" },
  { name: "Supermicro", desc: "Primary Server Platform — Green Computing", color: "text-[#1E90FF]", icon: "" },
  { name: "Micron", desc: "DDR5 ECC Memory & NVMe Storage Partner", color: "text-blue-500", icon: "" },
  { name: "Mellanox/NVIDIA", desc: "InfiniBand & 400G Ethernet Networking", color: "text-[#00C2FF]", icon: "" },
  { name: "Solarflare", desc: "Ultra-Low Latency RDMA Networking", color: "text-[#1E90FF]", icon: "" },
];

const AWARDS = [
  { title: "Partner of the Year", year: "2024", category: "AI & Accelerated Computing", org: "NVIDIA" },
  { title: "#1 Fast Growth 150", year: "2025", category: "Top Solution Provider", org: "CRN" },
  { title: "Solution Provider 500", year: "2025", category: "Leading Tech Integrators", org: "CRN" },
  { title: "Inc. 5000 — No. 733", year: "2025", category: "Fastest-Growing Private Companies", org: "Inc. Magazine" },
];

function ICCUSAPartnerInner() {
  const [activeCategory, setActiveCategory] = useState("All");
  const categories = ["All", ...ICC_PRODUCTS.map(p => p.category)];

  const filteredProducts = activeCategory === "All"
    ? ICC_PRODUCTS
    : ICC_PRODUCTS.filter(p => p.category === activeCategory);

  return (
    <div className="min-h-screen bg-[#0a0f1e] text-white">
      {/* Hero */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#0a0f1e] via-[#0d1635] to-[#0a1628] border-b border-blue-900/30">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(59,130,246,0.15),_transparent_60%)]" />
        <div className="max-w-7xl mx-auto px-6 py-20 relative z-10">
          <div className="flex items-center gap-3 mb-6">
            <Link href="/partners">
              <span className="text-blue-400 hover:text-blue-300 text-sm cursor-pointer">Partners</span>
            </Link>
            <ChevronRight className="w-4 h-4 text-slate-500" />
            <span className="text-slate-300 text-sm">ICC-USA</span>
          </div>

          <div className="flex flex-col lg:flex-row items-start lg:items-center gap-8 mb-10">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <Badge className="bg-[#00C2FF]/20 text-[#00C2FF] border-[#00C2FF]/30 px-3 py-1">
                   NVIDIA Elite Partner 2024
                </Badge>
                <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 px-3 py-1">
                  ISO 9001:2015 Certified
                </Badge>
              </div>
              <h1 className="text-5xl font-black text-white mb-4 leading-tight">
                International Computer<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-[#0a1628]">
                  Concepts (ICC-USA)™
                </span>
              </h1>
              <p className="text-xl text-slate-300 mb-6 max-w-2xl leading-relaxed">
                America's #1 fastest-growing AI infrastructure company. NVIDIA Elite Partner 2024 for AI & Accelerated Computing. 
                Enterprise GPU servers, HPC clusters, AI workstations, and custom data center solutions — 
                now available through the AthlynX™ platform.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/marketplace">
                  <Button className="bg-gradient-to-r from-blue-600 to-[#0a1628] hover:from-blue-500 hover:to-[#0a1628] text-white font-bold px-8 py-3 text-lg">
                    Shop ICC-USA Products
                  </Button>
                </Link>
                <a href="https://www.icc-usa.com" target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" className="border-blue-500/50 text-blue-400 hover:bg-blue-500/10 px-8 py-3 text-lg">
                    Visit ICC-USA <ExternalLink className="w-4 h-4 ml-2" />
                  </Button>
                </a>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 lg:min-w-[320px]">
              {[
                { label: "Inc. 5000 Rank", value: "#733", sub: "Fastest Growing 2025" },
                { label: "CRN Fast Growth", value: "#1", sub: "150 List 2025" },
                { label: "Founded", value: "Northbrook", sub: "Illinois, USA" },
                { label: "Certification", value: "ISO 9001", sub: "Quality Management" },
              ].map((stat, i) => (
                <div key={i} className="bg-blue-900/20 border border-blue-800/30 rounded-xl p-4 text-center">
                  <div className="text-2xl font-black text-blue-400">{stat.value}</div>
                  <div className="text-white font-semibold text-sm">{stat.label}</div>
                  <div className="text-slate-400 text-xs">{stat.sub}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Awards */}
      <div className="bg-gradient-to-r from-blue-900/20 to-[#0a1628]/10 border-b border-blue-900/30 py-8">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-wrap justify-center gap-6">
            {AWARDS.map((award, i) => (
              <div key={i} className="flex items-center gap-3 bg-white/5 rounded-xl px-5 py-3 border border-white/10">
                <Award className="w-5 h-5 text-[#1E90FF]" />
                <div>
                  <div className="text-white font-bold text-sm">{award.title}</div>
                  <div className="text-slate-400 text-xs">{award.org} · {award.year} · {award.category}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex flex-wrap gap-3 mb-10">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                activeCategory === cat
                  ? 'bg-blue-600 text-white'
                  : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white border border-white/10'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Product Categories */}
        {filteredProducts.map((category, ci) => (
          <div key={ci} className="mb-14">
            <div className="flex items-center gap-3 mb-6">
              <div className={`p-2 rounded-lg bg-gradient-to-br ${category.color}`}>
                {category.icon}
              </div>
              <div>
                <h2 className="text-2xl font-black text-white">{category.category}</h2>
                <Badge className="bg-white/10 text-slate-300 border-white/20 text-xs mt-1">{category.badge}</Badge>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {category.products.map((product, pi) => (
                <div
                  key={pi}
                  className={`relative bg-gradient-to-br from-[#0d1635] to-[#0a1628] border rounded-2xl p-5 hover:border-blue-500/50 transition-all group ${
                    product.featured ? 'border-blue-600/40' : 'border-blue-900/30'
                  }`}
                >
                  {product.featured && (
                    <div className="absolute -top-2 -right-2">
                      <Star className="w-5 h-5 text-[#1E90FF] fill-red-400" />
                    </div>
                  )}
                  <Badge className={`${product.badgeColor} text-white text-xs mb-3`}>
                    {product.badge}
                  </Badge>
                  <h3 className="text-white font-bold text-base mb-1 group-hover:text-blue-300 transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-slate-400 text-xs mb-3 leading-relaxed">{product.tagline}</p>
                  <ul className="space-y-1 mb-4">
                    {product.specs.map((spec, si) => (
                      <li key={si} className="flex items-start gap-2 text-xs text-slate-300">
                        <CheckCircle className="w-3 h-3 text-blue-400 mt-0.5 flex-shrink-0" />
                        {spec}
                      </li>
                    ))}
                  </ul>
                  <Link href="/marketplace">
                    <Button size="sm" className="w-full bg-blue-600/20 hover:bg-blue-600/40 text-blue-300 border border-blue-600/30 text-xs">
                      Request Quote
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Technology Partners */}
      <div className="bg-gradient-to-br from-[#0d1635] to-[#0a1628] border-t border-blue-900/30 py-16">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-black text-white text-center mb-3">ICC-USA Technology Partners</h2>
          <p className="text-slate-400 text-center mb-10">World-class technology ecosystem powering every ICC-USA solution</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {PARTNERS.map((partner, i) => (
              <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-4 hover:border-blue-500/30 transition-all">
                <div className="text-2xl mb-2">{partner.icon}</div>
                <div className={`font-bold text-sm ${partner.color}`}>{partner.name}</div>
                <div className="text-slate-400 text-xs mt-1 leading-relaxed">{partner.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Case Study Highlight */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="bg-gradient-to-br from-blue-900/20 to-indigo-900/20 border border-blue-800/30 rounded-3xl p-10">
          <div className="flex flex-col lg:flex-row items-center gap-8">
            <div className="flex-1">
              <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 mb-4">CASE STUDY — CERN</Badge>
              <h3 className="text-3xl font-black text-white mb-4">High-Density HPC Deployment at CERN</h3>
              <p className="text-slate-300 leading-relaxed mb-6">
                ICC-USA delivered over 3,600 AMD EPYC-based compute nodes for CERN using the Supermicro BigTwin A+ 2124BT-HNTR platform, 
                supporting large-scale simulations, physics-event reconstruction, and data analysis for the world's largest particle physics laboratory.
              </p>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: "Compute Nodes", value: "3,600+" },
                  { label: "Systems Deployed", value: "~900" },
                  { label: "Architecture", value: "AMD EPYC" },
                  { label: "Platform", value: "Supermicro BigTwin" },
                ].map((stat, i) => (
                  <div key={i} className="bg-white/5 rounded-lg p-3">
                    <div className="text-blue-400 font-black text-xl">{stat.value}</div>
                    <div className="text-slate-400 text-xs">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="lg:w-64 text-center">
              <div className="bg-gradient-to-br from-blue-600 to-[#0a1628] rounded-2xl p-8">
                <Globe className="w-16 h-16 text-white mx-auto mb-4" />
                <div className="text-white font-black text-lg">Trusted Worldwide</div>
                <div className="text-blue-100 text-sm mt-2">From CERN to your data center — ICC-USA delivers enterprise-grade AI infrastructure at every scale.</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contact CTA */}
      <div className="bg-gradient-to-r from-blue-900/30 to-[#0a1628]/20 border-t border-blue-900/30 py-16">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-black text-white mb-4">Ready to Build Your Infrastructure?</h2>
          <p className="text-slate-300 text-lg mb-8">
            Our team works directly with ICC-USA to design and build exactly what your organization needs. 
            Enterprise pricing, custom configurations, and full deployment support available.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/marketplace">
              <Button className="bg-gradient-to-r from-blue-600 to-[#0a1628] hover:from-blue-500 hover:to-[#0a1628] text-white font-bold px-10 py-4 text-lg">
                Browse All Products
              </Button>
            </Link>
            <Link href="/contact">
              <Button variant="outline" className="border-blue-500/50 text-blue-400 hover:bg-blue-500/10 px-10 py-4 text-lg">
                <Phone className="w-5 h-5 mr-2" />
                Contact Our Team
              </Button>
            </Link>
          </div>
          <div className="mt-8 flex flex-wrap justify-center gap-6 text-sm text-slate-400">
            <span className="flex items-center gap-2"><Phone className="w-4 h-4 text-blue-400" /> 877.422.8729</span>
            <span className="flex items-center gap-2"><Mail className="w-4 h-4 text-blue-400" /> sales@icc-usa.com</span>
            <span className="flex items-center gap-2"><Globe className="w-4 h-4 text-blue-400" /> 300 Wainwright Drive, Northbrook, IL</span>
          </div>
        </div>
      </div>
    <MobileBottomNav />
    </div>
  );
}

export default function ICCUSAPartner() {
  return <RouteErrorBoundary><ICCUSAPartnerInner /></RouteErrorBoundary>;
}
