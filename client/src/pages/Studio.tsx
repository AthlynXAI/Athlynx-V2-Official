import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RouteErrorBoundary } from "@/components/GlobalErrorBoundary";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { 
  Mic, 
  Play, 
  Video, 
  Users,
  Calendar,
  Bell,
  Share2,
  Heart,
  MessageCircle,
  Clock,
  Trophy,
  Star,
  Headphones,
  Podcast,
} from "lucide-react";
import UnifiedFooter from "@/components/UnifiedFooter";

function StudioInner() {
  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const upcomingEpisodes = [
    {
      title: "NIL in 2026: Every Athlete Gets Paid",
      guest: "Chad A. Dozier — Founder · CEO · Chairman, AthlynX",
      date: "May 13, 2026",
      category: "NIL",
      live: false
    },
    {
      title: "The Mental Game: How Champions Think",
      guest: "Sports Performance Coach — Episode 2",
      date: "May 20, 2026",
      category: "Mindset",
      live: false
    },
    {
      title: "From College to Pro: The Transfer Portal AI",
      guest: "AthlynXAI Recruiter Deep Dive",
      date: "May 27, 2026",
      category: "Recruiting",
      live: false
    },
    {
      title: "Parents in the Game: Supporting Your Athlete",
      guest: "Family & Recruiting Advisor — Episode 4",
      date: "Jun 3, 2026",
      category: "Family",
      live: false
    },
    {
      title: "Building Your Brand: NIL from Day One",
      guest: "NIL Attorney & Brand Strategist — Episode 5",
      date: "Jun 10, 2026",
      category: "Business",
      live: false
    }
  ];

  const showCategories = [
    {
      name: "In The Zone",
      description: "Mental performance and mindset mastery",
      icon: "🧠",
      color: "from-blue-600 to-indigo-600"
    },
    {
      name: "The Closer's Corner",
      description: "Business, deals, and entrepreneurship",
      icon: "🎬",
      color: "from-red-500 to-red-600"
    },
    {
      name: "Athlete Stories",
      description: "Interviews with great athletes",
      icon: "🎬",
      color: "from-red-500 to-red-600"
    },
    {
      name: "The Journey",
      description: "Following athletes from youth to pro",
      icon: "🛤️",
      color: "from-cyan-500 to-blue-600"
    },
    {
      name: "Coach's Playbook",
      description: "Wisdom from legendary coaches",
      icon: "📋",
      color: "from-green-500 to-emerald-600"
    },
    {
      name: "NIL Insights",
      description: "Navigating the NIL landscape",
      icon: "🎬",
      color: "from-red-500 to-red-600"
    }
  ];

  const stakeholderContent = [
    { role: "Athletes", topics: ["Mental preparation", "Career development", "NIL strategies"], emoji: "" },
    { role: "Parents", topics: ["Supporting your athlete", "Financial planning", "Balancing life"], emoji: "👨‍👩‍👧‍👦" },
    { role: "Coaches", topics: ["Leadership", "Team building", "Player development"], emoji: "📋" },
    { role: "Agents", topics: ["Contract negotiations", "Client management", "Industry trends"], emoji: "" },
    { role: "Trainers", topics: ["Performance optimization", "Injury prevention", "Recovery"], emoji: "" },
    { role: "Counselors", topics: ["Mental health", "Life transitions", "Stress management"], emoji: "🧠" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a1628] via-[#0d1e36] to-[#0a1628]">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0a1628]/90 backdrop-blur-md border-b border-cyan-500/20">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/">
            <span className="text-cyan-400 font-bold text-sm tracking-widest cursor-pointer hover:text-cyan-300 transition-colors">
              THE FUTURE OF ATHLETE SUCCESS
            </span>
          </Link>
          <div className="flex items-center gap-6">
            <Link href="/mindset">
              <span className="text-white/80 hover:text-cyan-400 transition-colors cursor-pointer">
                Mindset
              </span>
            </Link>
            <Link href="/">
              <span className="text-white/80 hover:text-cyan-400 transition-colors cursor-pointer">
                AthlynX
              </span>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section - Studio */}
      <section className="pt-32 pb-20 px-4 relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/3 right-1/4 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-3xl" />
          
          {/* Studio Grid Lines */}
          <div className="absolute inset-0 opacity-5">
            <div className="h-full w-full" style={{
              backgroundImage: `
                linear-gradient(rgba(0, 217, 255, 0.3) 1px, transparent 1px),
                linear-gradient(90deg, rgba(0, 217, 255, 0.3) 1px, transparent 1px)
              `,
              backgroundSize: '50px 50px'
            }} />
          </div>
        </div>

        <div className="container mx-auto text-center relative z-10">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            <motion.div variants={fadeInUp} className="mb-6">
              <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-cyan-500/30 mb-4">
                <Mic className="w-12 h-12 text-cyan-400" />
              </div>
            </motion.div>
            
            <motion.div variants={fadeInUp} className="mb-4">
              <Badge className="bg-green-500/20 text-green-400 border-green-500/30 px-4 py-1">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse inline-block" />
                NOW LIVE — NEW EPISODES WEEKLY
              </Badge>
            </motion.div>
            
            <motion.p variants={fadeInUp} className="text-cyan-400 tracking-[0.3em] text-sm mb-4">
              AthlynX PRESENTS
            </motion.p>
            
            <motion.h1 variants={fadeInUp} className="text-5xl md:text-7xl font-black text-white mb-6">
              THE <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">STUDIO</span>
            </motion.h1>
            
            <motion.p variants={fadeInUp} className="text-xl md:text-2xl text-white/70 max-w-3xl mx-auto mb-4">
              TED Talk Style Conversations on Sports, Success & The Mental Game
            </motion.p>
            
            <motion.p variants={fadeInUp} className="text-lg text-cyan-400/80 max-w-2xl mx-auto mb-8">
              Streaming • Podcasting • Live from the AthlynX Studio
            </motion.p>

            <motion.div variants={fadeInUp} className="flex flex-wrap justify-center gap-4">
              <Button className="bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-400 hover:to-cyan-500 text-white px-8 py-6 text-lg rounded-full">
                <Bell className="w-5 h-5 mr-2" />
                Get Notified at Launch
              </Button>
              <Link href="/mindset">
                <Button variant="outline" className="border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10 px-8 py-6 text-lg rounded-full">
                  Read the Mindset
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* What to Expect */}
      <section className="py-20 px-4 bg-[#0d1e36]">
        <div className="container mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="text-center mb-16"
          >
            <motion.div variants={fadeInUp}>
              <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
                WHAT TO <span className="text-cyan-400">EXPECT</span>
              </h2>
              <p className="text-white/60 text-xl max-w-2xl mx-auto">
                Real conversations about what it takes to succeed. No fluff. No BS. Just truth.
              </p>
            </motion.div>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-[#1a3a5c]/50 to-[#0d1e36]/50 rounded-2xl p-8 border border-cyan-500/20 text-center"
            >
              <Video className="w-12 h-12 text-cyan-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-3">Live Streaming</h3>
              <p className="text-white/60">
                Watch live episodes with real-time interaction. Ask questions, share thoughts, be part of the conversation.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-gradient-to-br from-[#1a3a5c]/50 to-[#0d1e36]/50 rounded-2xl p-8 border border-cyan-500/20 text-center"
            >
              <Trophy className="w-12 h-12 text-blue-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-3">Podcast Episodes</h3>
              <p className="text-white/60">
                Listen on the go. Every episode available as a podcast on all major platforms.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-gradient-to-br from-[#1a3a5c]/50 to-[#0d1e36]/50 rounded-2xl p-8 border border-cyan-500/20 text-center"
            >
              <Users className="w-12 h-12 text-red-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-3">Expert Guests</h3>
              <p className="text-white/60">
                Athletes, coaches, agents, mental performance experts, and entrepreneurs sharing their journey.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Show Categories */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="text-center mb-16"
          >
            <motion.div variants={fadeInUp}>
              <Trophy className="w-16 h-16 text-cyan-400 mx-auto mb-4" />
              <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
                SHOW <span className="text-cyan-400">CATEGORIES</span>
              </h2>
              <p className="text-white/60 text-xl max-w-2xl mx-auto">
                Content for every aspect of the athlete journey
              </p>
            </motion.div>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {showCategories.map((category, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group cursor-pointer"
              >
                <div className={`bg-gradient-to-br ${category.color} rounded-2xl p-1`}>
                  <div className="bg-[#0a1628] rounded-xl p-6 h-full">
                    <span className="text-4xl mb-4 block">{category.icon}</span>
                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors">
                      {category.name}
                    </h3>
                    <p className="text-white/60 text-sm">
                      {category.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Content for Everyone */}
      <section className="py-20 px-4 bg-gradient-to-b from-[#0d1e36] to-[#0a1628]">
        <div className="container mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="text-center mb-16"
          >
            <motion.div variants={fadeInUp}>
              <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
                CONTENT FOR <span className="text-red-400">EVERYONE</span>
              </h2>
              <p className="text-white/60 text-xl max-w-3xl mx-auto">
                The complete ecosystem. Athletes, parents, coaches, agents, lawyers, trainers, counselors, chaplains—we cover it all.
              </p>
            </motion.div>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {stakeholderContent.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-[#1a3a5c]/30 rounded-2xl p-6 border border-cyan-500/10 hover:border-cyan-500/30 transition-all"
              >
                <div className="flex items-center gap-4 mb-4">
                  <span className="text-4xl">{item.emoji}</span>
                  <h3 className="text-xl font-bold text-white">{item.role}</h3>
                </div>
                <ul className="space-y-2">
                  {item.topics.map((topic, i) => (
                    <li key={i} className="text-white/60 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full" />
                      {topic}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Upcoming Episodes */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="text-center mb-16"
          >
            <motion.div variants={fadeInUp}>
              <Calendar className="w-16 h-16 text-cyan-400 mx-auto mb-4" />
              <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
                UPCOMING <span className="text-cyan-400">EPISODES</span>
              </h2>
              <p className="text-white/60 text-xl max-w-2xl mx-auto">
                New episodes every Tuesday — The Athlete's Playbook Podcast
              </p>
            </motion.div>
          </motion.div>

          <div className="max-w-4xl mx-auto space-y-4">
            {upcomingEpisodes.map((episode, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-gradient-to-r from-[#1a3a5c]/50 to-[#0d1e36]/50 rounded-xl p-6 border border-cyan-500/20 flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-xl bg-cyan-500/20 flex items-center justify-center">
                    <Play className="w-8 h-8 text-cyan-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">{episode.title}</h3>
                    <p className="text-white/50 text-sm">{episode.guest}</p>
                  </div>
                </div>
                <div className="text-right">
                  <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500/30 mb-1">
                    {episode.category}
                  </Badge>
                  <p className="text-white/50 text-sm">{episode.date}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Subscribe CTA */}
      <section className="py-20 px-4 bg-gradient-to-r from-cyan-500/10 to-blue-600/10">
        <div className="container mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Headphones className="w-16 h-16 text-cyan-400 mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
              DON'T MISS AN <span className="text-cyan-400">EPISODE</span>
            </h2>
            <p className="text-white/60 text-xl max-w-2xl mx-auto mb-8">
              Subscribe to get notified when we go live. Be the first to hear from the greatest minds in sports.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button className="bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-400 hover:to-cyan-500 text-white px-10 py-6 text-lg rounded-full">
                <Bell className="w-5 h-5 mr-2" />
                Subscribe Now
              </Button>
              <Button variant="outline" className="border-white/30 text-white hover:bg-white/10 px-10 py-6 text-lg rounded-full">
                <Share2 className="w-5 h-5 mr-2" />
                Share
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Total Positivity Message */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto text-center"
          >
            <div className="bg-gradient-to-br from-red-500/10 to-red-500/10 rounded-3xl p-12 border border-red-500/20">
              <Star className="w-16 h-16 text-red-400 mx-auto mb-6" />
              <h2 className="text-3xl md:text-4xl font-black text-white mb-6">
                TOTAL <span className="text-red-400">POSITIVITY</span>
              </h2>
              <p className="text-xl text-white/70 mb-6">
                This isn't about tearing people down. It's about building them up. Every episode, every conversation, every piece of content is designed to inspire, motivate, and help you become the best version of yourself.
              </p>
              <p className="text-cyan-400 text-lg font-semibold">
                "We don't talk about ourselves. We talk about the journey. We celebrate the athletes. We share the wisdom."
              </p>
              <p className="text-white/50 mt-4">— Chad Allen Dozier Sr., Founder</p>
            </div>
          </motion.div>
        </div>
      </section>

      <UnifiedFooter />
    </div>
  );
}
export default function Studio() {
  return <RouteErrorBoundary><StudioInner /></RouteErrorBoundary>;
}
