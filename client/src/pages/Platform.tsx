import { RouteErrorBoundary } from "@/components/GlobalErrorBoundary";
import UnifiedFooter from "@/components/UnifiedFooter";
import { Link } from "wouter";

function PlatformInner() {
  const features = [
    {
      icon: "👤",
      title: "Athlete Profiles",
      description: "Build your digital brand with customizable profiles showcasing stats, highlights, and achievements"
    },
    {
      icon: "💰",
      title: "NIL Marketplace",
      description: "Connect with brands for sponsorships, endorsements, and partnership opportunities"
    },
    {
      icon: "💬",
      title: "Secure Messaging",
      description: "Direct communication with coaches, scouts, teammates, and brands"
    },
    {
      icon: "📊",
      title: "Performance Analytics",
      description: "Track your progress with advanced stats, metrics, and performance insights"
    },
    {
      icon: "🎯",
      title: "Transfer Portal",
      description: "Navigate the transfer process with intelligence, connections, and guidance"
    },
    {
      icon: "🤖",
      title: "AI Training Coach",
      description: "Personalized training plans powered by artificial intelligence"
    },
    {
      icon: "🎥",
      title: "Video Highlights",
      description: "Upload, organize, and share your best moments with recruiters and fans"
    },
    {
      icon: "⚖️",
      title: "NCAA Compliance",
      description: "Built-in compliance tools to ensure all NIL activities follow regulations"
    },
    {
      icon: "🏆",
      title: "Recruiting Tools",
      description: "Connect with college coaches and showcase your talent to programs nationwide"
    },
    {
      icon: "📱",
      title: "Mobile Apps",
      description: "Access AthlynX anywhere with native iOS and Android applications"
    },
    {
      icon: "🛒",
      title: "Athlete Store",
      description: "Shop for gear, equipment, and training tools from top brands"
    },
    {
      icon: "🎓",
      title: "Educational Resources",
      description: "Learn about NIL, recruiting, and navigating your athletic career"
    }
  ];

  const platforms = [
    {
      name: "The Warrior's Playbook",
      sport: "Multi-Sport",
      icon: "⚔️",
      description: "Chad's legacy platform for athletes across all sports"
    },
    {
      name: "Diamond Grind",
      sport: "Baseball",
      icon: "⚾",
      description: "Elite baseball recruiting and development platform"
    },
    {
      name: "Gridiron Nexus",
      sport: "Football",
      icon: "🏈",
      description: "Football recruiting, NIL, and performance tracking"
    },
    {
      name: "Court Kings",
      sport: "Basketball",
      icon: "🏀",
      description: "Basketball recruiting and showcase platform"
    },
    {
      name: "Reel Masters",
      sport: "Fishing",
      icon: "🎣",
      description: "Competitive fishing tournaments and sponsorships"
    },
    {
      name: "Hunt Pro",
      sport: "Hunting",
      icon: "🦌",
      description: "Hunting competitions and outdoor sponsorships"
    },
    {
      name: "Fairway Elite",
      sport: "Golf",
      icon: "⛳",
      description: "Golf recruiting and tournament platform"
    },
    {
      name: "Pitch Pulse",
      sport: "Soccer",
      icon: "⚽",
      description: "Soccer recruiting and international opportunities"
    }
  ];

  return (
    <div className="min-h-screen relative text-white overflow-x-hidden">
      {/* Dark Blue Gradient Background */}
      <div className="absolute inset-0" 
           style={{
             background: 'linear-gradient(180deg, #0a1628 0%, #0d1f3c 25%, #0f2847 50%, #0a1e38 75%, #061424 100%)'
           }}>
      </div>

      {/* Subtle blue glow overlay */}
      <div className="absolute inset-0 opacity-40"
           style={{
             background: 'radial-gradient(ellipse at top center, rgba(59, 130, 246, 0.15) 0%, transparent 60%), radial-gradient(ellipse at bottom center, rgba(6, 182, 212, 0.1) 0%, transparent 60%)'
           }}>
      </div>

      {/* FIXED NAVIGATION HEADER */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0a1628]/95 backdrop-blur-md border-b border-cyan-500/30">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="text-cyan-400 font-bold text-xs tracking-widest">THE FUTURE OF ATHLETE SUCCESS</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="hidden md:flex items-center gap-2 mr-4">
              <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-xs font-bold text-cyan-400 border border-cyan-500/50">DHG</div>
              <div className="text-left">
                <p className="text-gray-400 text-[10px] uppercase">PARENT COMPANY</p>
                <p className="text-cyan-400 font-semibold text-xs">Dozier Holdings Group</p>
              </div>
            </div>
            <div className="text-right mr-4">
              <p className="text-white font-bold text-sm">AthlynX</p>
              <p className="text-cyan-400 text-[10px] tracking-wider">THE ATHLETE'S PLAYBOOK</p>
            </div>
            <Link href="/">
              <button className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold px-6 py-2 rounded-lg shadow-lg shadow-cyan-500/30 transition-all">
                HOME
              </button>
            </Link>
          </div>
        </div>
      </nav>

      <div className="relative w-full max-w-[1200px] mx-auto px-4 pt-24 pb-12 space-y-16">
        
        {/* Hero Section */}
        <div className="text-center space-y-6">
          <div className="inline-block px-4 py-2 bg-cyan-500/20 border border-cyan-500/50 rounded-full">
            <span className="text-cyan-400 font-bold text-sm tracking-wider">🚀 THE PLATFORM</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-black tracking-tight">
            <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
              AthlynX
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-cyan-400 font-bold tracking-wide">
            THE ATHLETE'S PLAYBOOK
          </p>
          
          <p className="text-gray-300 text-lg max-w-3xl mx-auto leading-relaxed">
            A comprehensive platform designed to empower athletes with the tools, connections, and resources needed to succeed in the modern era of college athletics and beyond.
          </p>
        </div>

        {/* Core Features Grid */}
        <div className="space-y-8">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">Core Features</h2>
            <p className="text-cyan-400">Everything you need to build your athletic brand</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="bg-slate-800/50 backdrop-blur-sm border border-cyan-500/30 rounded-xl p-6 hover:border-cyan-400 hover:shadow-lg hover:shadow-cyan-500/20 transition-all group"
              >
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">{feature.icon}</div>
                <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* White-Label Sport Platforms */}
        <div className="space-y-8">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">Sport-Specific Platforms</h2>
            <p className="text-cyan-400">Tailored experiences for every sport</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {platforms.map((platform, index) => (
              <div 
                key={index}
                className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm border border-cyan-500/30 rounded-xl p-6 hover:border-cyan-400 hover:shadow-lg hover:shadow-cyan-500/20 transition-all text-center group"
              >
                <div className="text-5xl mb-3 group-hover:scale-110 transition-transform">{platform.icon}</div>
                <h3 className="text-lg font-bold text-white mb-1">{platform.name}</h3>
                <p className="text-cyan-400 text-sm font-semibold mb-2">{platform.sport}</p>
                <p className="text-gray-400 text-xs leading-relaxed">{platform.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/50 rounded-2xl p-12 text-center space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold text-white">Ready to Get Started?</h2>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Join thousands of athletes already using AthlynX to build their brand, connect with opportunities, and take control of their athletic future.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/">
              <button className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold px-8 py-4 rounded-xl shadow-lg shadow-cyan-500/30 transition-all text-lg">
                🔑 CLAIM YOUR VIP SPOT
              </button>
            </Link>
            <Link href="/pricing">
              <button className="bg-slate-800/80 hover:bg-slate-700/80 border border-cyan-500/50 hover:border-cyan-400 text-white font-bold px-8 py-4 rounded-xl transition-all text-lg">
                View Pricing
              </button>
            </Link>
          </div>
        </div>

      </div>

      <UnifiedFooter />
    </div>
  );
}
export default function Platform() {
  return <RouteErrorBoundary><PlatformInner /></RouteErrorBoundary>;
}
