import { RouteErrorBoundary } from "@/components/GlobalErrorBoundary";
import { Link } from 'wouter';
import PlatformLayout from "@/components/PlatformLayout";
import MobileBottomNav from '@/components/MobileBottomNav'
import { useState } from 'react';
import { trpc } from '@/lib/trpc';
import { useAuth } from '@/_core/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Code, Smartphone, Users, Shield, Zap, Globe, ChevronRight, ExternalLink } from 'lucide-react';

const products = [
  {
    name: 'AthlynX',
    tagline: "The Athlete's Playbook",
    description: 'Complete athlete ecosystem for NIL deals, social networking, messaging, and career management',
    icon: '',
    status: 'Active',
    link: '/'
  },
  {
    name: 'NIL Portal',
    tagline: 'Name, Image, Likeness Platform',
    description: 'Connect athletes with brands for endorsement deals and sponsorship opportunities',
    icon: '',
    status: 'Active',
    link: '/nil-portal'
  },
  {
    name: 'Diamond Grind',
    tagline: 'Baseball Training Excellence',
    description: 'Performance tracking, training programs, and analytics for baseball athletes',
    icon: '',
    status: 'Active',
    link: '/diamond-grind'
  },
  {
    name: 'NIL Messenger',
    tagline: 'Secure Athlete Communication',
    description: 'End-to-end encrypted messaging for athletes, agents, and brands',
    icon: '💬',
    status: 'Active',
    link: '/messenger'
  },
  {
    name: 'FUEL Bots',
    tagline: 'AI Companions',
    description: 'Revolutionary AI companions for training, medical response, and industrial operations',
    icon: '🤖',
    status: 'Active',
    link: '/fuel-bots'
  }
];

const whiteLabelApps = [
  { name: 'Court Kings', sport: 'Basketball', icon: '' },
  { name: 'Gridiron Nexus', sport: 'Football', icon: '' },
  { name: 'Pitch Pulse', sport: 'Soccer', icon: '' },
  { name: 'Reel Masters', sport: 'Fishing', icon: '🎣' },
  { name: 'Faith & Sport', sport: 'Faith-Based', icon: '✝️' },
  { name: 'Military Athletes', sport: 'Veterans', icon: '' }
];

function SoftmorInner() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [checkoutLoading, setCheckoutLoading] = useState<string | null>(null);

  const checkoutMutation = trpc.stripe.createSubscriptionCheckout.useMutation({
    onSuccess: (data) => { if (data.url) window.location.href = data.url; },
    onError: (e) => { toast({ title: "Error", description: e.message || "Checkout failed", variant: "destructive" }); setCheckoutLoading(null); },
  });

  const CONCREATOR_PRICES: Record<string, string> = {
    'Pulse': 'price_1TTaLKGvvjXZw2uE0j4ZMU9J',
    'Insight': 'price_1TTaLMGvvjXZw2uE8m5Imwtn',
    'Command': 'price_1TTaLNGvvjXZw2uEVbyQse2H',
    'Enterprise': 'price_1TTaLPGvvjXZw2uEOGZwzZUA',
  };

  const handleConCreatorCheckout = (tierName: string) => {
    const priceId = CONCREATOR_PRICES[tierName];
    if (!priceId) return;
    if (!user) { toast({ title: "Sign In Required", description: "Please sign in to subscribe.", variant: "destructive" }); return; }
    setCheckoutLoading(tierName);
    checkoutMutation.mutate({ planId: priceId, interval: 'month', origin: window.location.origin });
  };

  return (
    <div className="min-h-screen bg-[#0a1628] text-white">
      {/* Hero */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/30 via-transparent to-blue-900/30" />
        
        <div className="container relative py-16">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-gray-400 mb-8">
            <Link href="/dhg" className="hover:text-white transition">Dozier Holdings Group</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-cyan-400">Softmor, Inc.</span>
          </div>

          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-xl overflow-hidden">
              <img src="/images/logos/dhg-logo.png" alt="Softmor Inc - Technology Division of Dozier Holdings Group" className="w-full h-full object-contain bg-white p-1 rounded-xl" onError={(e) => { (e.target as HTMLImageElement).src = '/dhg-logo.png'; }} />
            </div>
            <div>
              <p className="text-cyan-400 text-sm font-medium tracking-wider">DHG TECHNOLOGY DIVISION</p>
              <h1 className="text-4xl md:text-5xl font-bold">Softmor, Inc.</h1>
            </div>
          </div>
          
          <p className="text-xl text-gray-300 max-w-2xl mb-8">
            Software development and technology solutions powering the future of athlete success
          </p>

          <div className="flex flex-wrap gap-4">
            <Link href="/" className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg font-semibold hover:opacity-90 transition">
              Explore AthlynX <ChevronRight className="w-4 h-4" />
            </Link>
            <Link href="/dhg" className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 border border-white/20 rounded-lg font-semibold hover:bg-white/20 transition">
              Back to DHG
            </Link>
            <a href="/dhg" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-6 py-3 bg-green-600/20 border border-green-500/30 rounded-lg font-semibold hover:bg-green-600/30 transition text-green-400">
              <ExternalLink className="w-4 h-4" /> Official Website
            </a>
          </div>
        </div>
      </div>

      {/* Mission */}
      <div className="container py-16">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
            <p className="text-gray-300 mb-6">
              Softmor, Inc. is the technology arm of Dozier Holdings Group, focused on developing 
              innovative software solutions that empower athletes to maximize their potential both 
              on and off the field.
            </p>
            <p className="text-gray-400 mb-6">
              Our flagship product, AthlynX, represents one identity, every athlete, every platform - combining 
              social networking, NIL deal management, secure messaging, performance analytics, and 
              career development tools into one unified platform.
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                <div className="text-3xl font-bold text-cyan-400">7+</div>
                <div className="text-sm text-gray-400">Platform Products</div>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                <div className="text-3xl font-bold text-cyan-400">6</div>
                <div className="text-sm text-gray-400">White-Label Apps</div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 rounded-xl p-6">
              <Smartphone className="w-8 h-8 text-cyan-400 mb-3" />
              <h3 className="font-semibold mb-1">Mobile First</h3>
              <p className="text-sm text-gray-400">Native iOS & Android apps</p>
            </div>
            <div className="bg-gradient-to-br from-emerald-500/20 to-green-500/20 border border-emerald-500/30 rounded-xl p-6">
              <Shield className="w-8 h-8 text-emerald-400 mb-3" />
              <h3 className="font-semibold mb-1">Secure</h3>
              <p className="text-sm text-gray-400">End-to-end encryption</p>
            </div>
            <div className="bg-gradient-to-br from-blue-600/20 to-red-500/20 border border-blue-600/30 rounded-xl p-6">
              <Zap className="w-8 h-8 text-blue-500 mb-3" />
              <h3 className="font-semibold mb-1">AI Powered</h3>
              <p className="text-sm text-gray-400">Smart recommendations</p>
            </div>
            <div className="bg-gradient-to-br from-red-500/20 to-red-500/20 border border-red-500/30 rounded-xl p-6">
              <Globe className="w-8 h-8 text-red-400 mb-3" />
              <h3 className="font-semibold mb-1">Global Scale</h3>
              <p className="text-sm text-gray-400">Cloud infrastructure</p>
            </div>
          </div>
        </div>
      </div>

      {/* Products */}
      <div className="container py-16">
        <h2 className="text-3xl font-bold mb-2">Our Products</h2>
        <p className="text-gray-400 mb-8">The complete athlete technology ecosystem</p>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product, i) => (
            <Link key={i} href={product.link}>
              <div className="group bg-gradient-to-br from-white/10 to-white/5 border border-white/10 rounded-xl p-6 hover:border-cyan-500/50 transition cursor-pointer h-full">
                <div className="flex items-start justify-between mb-4">
                  <div className="text-4xl">{product.icon}</div>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    product.status === 'Active' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                  }`}>
                    {product.status}
                  </span>
                </div>
                <h3 className="text-xl font-bold mb-1">{product.name}</h3>
                <p className="text-cyan-400 text-sm mb-3">{product.tagline}</p>
                <p className="text-gray-400 text-sm">{product.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* ConCreator™ Data Intelligence */}
      <div className="container py-16">
        <div className="bg-gradient-to-br from-blue-900/60 via-[#0a1628] to-cyan-900/40 border border-cyan-500/40 rounded-2xl p-8 md:p-12">
          <div className="flex items-center gap-5 mb-6">
            <img src="/images/logos/athlynx-main-logo.png" alt="ConCreator" className="w-16 h-16 rounded-2xl shadow-lg border border-cyan-500/30" />
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-3xl font-bold text-white">ConCreator™</h2>
                <span className="text-xs px-2 py-1 rounded-full bg-green-500/20 text-green-400 font-bold">LIVE</span>
              </div>
              <p className="text-cyan-400 font-semibold">Data Intelligence &amp; AI Credit System</p>
              <p className="text-gray-400 text-sm">Powered by Softmor Inc. · A Dozier Holdings Group Product</p>
            </div>
          </div>

          <p className="text-gray-300 mb-8 max-w-3xl leading-relaxed">
            ConCreator™ is Softmor's enterprise data intelligence platform — delivering AI-powered machine analytics, 
            predictive trend analysis, and automated reporting for industrial and enterprise clients. 
            Four tiers. Unlimited potential. Every machine. Every day.
          </p>

          {/* Tiers */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { name: 'Pulse', price: '$297', credits: '500', reports: 'Monthly', color: 'from-blue-600/20 to-blue-800/20', border: 'border-blue-600/40' },
              { name: 'Insight', price: '$597', credits: '2,000', reports: 'Weekly + Monthly', color: 'from-cyan-600/20 to-cyan-800/20', border: 'border-cyan-500/40' },
              { name: 'Command', price: '$997', credits: '5,000', reports: 'Daily + Weekly + Monthly', color: 'from-emerald-600/20 to-emerald-800/20', border: 'border-emerald-500/40', recommended: true },
              { name: 'Enterprise', price: '$1,997', credits: 'Unlimited', reports: 'Full Suite + Custom', color: 'from-purple-600/20 to-purple-800/20', border: 'border-purple-500/40' },
            ].map((tier, i) => (
              <div key={i} className={`relative bg-gradient-to-br ${tier.color} border ${tier.border} rounded-xl p-4`}>
                {tier.recommended && (
                  <div className="absolute -top-2 left-1/2 -translate-x-1/2 text-xs bg-emerald-500 text-white px-2 py-0.5 rounded-full font-bold whitespace-nowrap">RECOMMENDED</div>
                )}
                <div className="text-white font-black text-lg mb-1">{tier.name}</div>
                <div className="text-2xl font-black text-cyan-300 mb-1">{tier.price}<span className="text-sm font-normal text-gray-400">/mo</span></div>
                <div className="text-xs text-gray-400 mb-1">{tier.credits} AI Credits</div>
                <div className="text-xs text-gray-500 mb-3">{tier.reports}</div>
                <button
                  onClick={() => handleConCreatorCheckout(tier.name)}
                  disabled={checkoutLoading === tier.name}
                  className={`w-full text-xs font-black py-2 rounded-lg transition-all disabled:opacity-60 ${tier.recommended ? 'bg-emerald-500 hover:bg-emerald-400 text-white' : 'bg-white/10 hover:bg-white/20 text-white border border-white/20'}`}
                >
                  {checkoutLoading === tier.name ? 'Loading...' : tier.name === 'Enterprise' ? 'Contact Sales' : 'Subscribe →'}
                </button>
              </div>
            ))}
          </div>

          {/* AI Actions */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[
              { action: 'Standard Report Generation', credits: '50 credits', icon: '📊' },
              { action: 'AI Anomaly Detection Alert', credits: '25 credits', icon: '🚨' },
              { action: 'Predictive Trend Analysis', credits: '150 credits', icon: '📈' },
              { action: 'Custom Data Query', credits: '100 credits', icon: '🤖' },
            ].map((item, i) => (
              <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-4">
                <div className="text-2xl mb-2">{item.icon}</div>
                <div className="text-white text-sm font-semibold mb-1">{item.action}</div>
                <div className="text-cyan-400 text-xs font-bold">{item.credits}</div>
              </div>
            ))}
          </div>

          {/* Revenue highlight */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-5 mb-6">
            <div className="text-white font-bold mb-2">📍 10-Machine Revenue Projection (Command Tier)</div>
            <div className="flex flex-wrap gap-6">
              <div><div className="text-2xl font-black text-cyan-400">$9,970</div><div className="text-xs text-gray-400">Per Month</div></div>
              <div><div className="text-2xl font-black text-cyan-400">$119,640</div><div className="text-xs text-gray-400">Per Year</div></div>
              <div><div className="text-2xl font-black text-cyan-400">$419,640</div><div className="text-xs text-gray-400">Year 1 with License</div></div>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <a href="mailto:contact@athlynx.ai" className="px-6 py-3 bg-cyan-500 rounded-lg font-semibold hover:bg-cyan-600 transition text-white">Request a Demo</a>
            <a href="mailto:contact@athlynx.ai" className="px-6 py-3 bg-white/10 border border-white/20 rounded-lg font-semibold hover:bg-white/20 transition text-white">Get Pricing</a>
          </div>

          <p className="text-xs text-gray-500 mt-4">ConCreator™ is a registered trademark of Dozier Holdings Group. © 2026 Dozier Holdings Group &amp; Softmor Inc. All Rights Reserved. Governing Law: State of Texas. Disputes: binding arbitration in Houston, TX.</p>
        </div>
      </div>

      {/* White Label Apps */}
      <div className="container py-16">
        <h2 className="text-3xl font-bold mb-2">White-Label Sport Apps</h2>
        <p className="text-gray-400 mb-8">Customized AthlynX experiences for specific sports and communities</p>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {whiteLabelApps.map((app, i) => (
            <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-4 text-center hover:border-cyan-500/50 transition">
              <div className="text-4xl mb-2">{app.icon}</div>
              <h3 className="font-semibold text-sm">{app.name}</h3>
              <p className="text-xs text-gray-500">{app.sport}</p>
            </div>
          ))}
        </div>
      </div>

      {/* AthlynX Feature */}
      <div className="container py-16">
        <div className="bg-gradient-to-r from-cyan-900/50 to-blue-900/50 border border-cyan-500/30 rounded-2xl p-8 md:p-12">
          <div className="flex items-center gap-4 mb-6">
            <div className="text-6xl"></div>
            <div>
              <h2 className="text-3xl font-bold">AthlynX</h2>
              <p className="text-cyan-400">The Athlete's Playbook</p>
            </div>
          </div>
          
          <p className="text-gray-300 mb-8 max-w-3xl">
            The complete ecosystem for modern athletes. Connect with brands, manage NIL deals, 
            network with other athletes, track performance, and build your career - all in one platform.
          </p>
          
          <div className="grid md:grid-cols-5 gap-4 mb-8">
            {['Social Network', 'NIL Deals', 'Messaging', 'Analytics', 'Compliance'].map((feature, i) => (
              <div key={i} className="bg-white/10 rounded-lg p-3 text-center">
                <span className="text-cyan-400"></span> {feature}
              </div>
            ))}
          </div>
          
          <div className="flex flex-wrap gap-4">
            <Link href="/" className="px-8 py-3 bg-cyan-500 rounded-lg font-semibold hover:bg-cyan-600 transition">
              Get VIP Early Access
            </Link>
            <Link href="/playbook" className="px-8 py-3 bg-white/10 border border-white/20 rounded-lg font-semibold hover:bg-white/20 transition">
              Preview the App
            </Link>
          </div>
        </div>
      </div>

      {/* Videos Section */}
      <div className="container py-16">
        <h2 className="text-3xl font-bold mb-2">Softmor Videos</h2>
        <p className="text-gray-400 mb-8">See our technology in action</p>
        <div className="grid md:grid-cols-2 gap-6">
          {[
            {
              src: "https://pub-e4ffb4c8e08a4770a064090220a8e31d.r2.dev/videos/jOicUTDalswOCdmD.mov",
              title: "Softmor — Driving Digital Tomorrow",
              desc: "Official Softmor brand intro animation",
              badge: "BRAND"
            },
            {
              src: "https://pub-e4ffb4c8e08a4770a064090220a8e31d.r2.dev/videos/KkLleYEkFxPcgTwt.mov",
              title: "Softmor Data Center Infrastructure",
              desc: "Futuristic server room & enterprise compute",
              badge: "TECH"
            },
          ].map((v, i) => (
            <div key={i} className="bg-white/5 border border-white/10 rounded-xl overflow-hidden hover:border-cyan-500/50 transition">
              <div className="relative w-full aspect-video bg-black">
                <video
                  className="w-full h-full object-cover"
                  muted
                  loop
                  playsInline
                  controls
                >
                  <source src={v.src} />
                </video>
                <span className="absolute top-2 right-2 text-[9px] font-black px-2 py-1 rounded-full text-white bg-cyan-700">{v.badge}</span>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-white">{v.title}</h3>
                <p className="text-sm text-gray-400">{v.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="container py-8 border-t border-white/10">
        <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-400">
          <Link href="/" className="hover:text-white transition">Home</Link>
          <Link href="/dhg" className="hover:text-white transition">DHG Corporate</Link>
          <Link href="/project-management" className="hover:text-white transition">Project Management</Link>
          <a href="/dhg" target="_blank" rel="noopener noreferrer" className="hover:text-white transition">
            Softmor Official <ExternalLink className="w-3 h-3 inline ml-1" />
          </a>
        </div>
      </div>
      <MobileBottomNav />
    </div>
  );
}

export default function Softmor() {
  return <RouteErrorBoundary><SoftmorInner /></RouteErrorBoundary>;
}
