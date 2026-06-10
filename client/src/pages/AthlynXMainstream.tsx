import DashboardLayout from "@/components/DashboardLayout";
import MobileBottomNav from "@/components/MobileBottomNav";
import { RouteErrorBoundary } from "@/components/GlobalErrorBoundary";
import { Link } from "wouter";
import { useState, useEffect } from "react";
import {
  Globe,
  Zap,
  Dumbbell,
  HeartPulse,
  GraduationCap,
  Lightbulb,
  Star,
  Mic,
  Map,
  LineChart,
  Quote,
  User,
  Rocket,
  ShieldCheck,
  ArrowRight,
  Users,
  MessageSquare,
} from "lucide-react";

export default function AthlynXMainstream() {
  return (
    <RouteErrorBoundary>
      <DashboardLayout>
        <div className="min-h-screen bg-[#050c1a] text-white">
          {/* Hero Section */}
          <section className="relative h-[60vh] flex items-center justify-center text-center overflow-hidden bg-gradient-to-r from-[#1E90FF] to-[#4169E1] text-white">
            <div className="absolute inset-0 z-0 opacity-20">
              <Globe className="w-full h-full object-cover scale-150 animate-pulse-slow" />
            </div>
            <div className="relative z-10 p-8 max-w-4xl mx-auto">
              <h1 className="text-5xl md:text-7xl font-black mb-4 leading-tight">
                Sports Was Just the Beginning.
              </h1>
              <p className="text-xl md:text-2xl font-light mb-8">
                From the arena to every aspect of life, AthlynXAI is redefining human potential.
              </p>
              <div className="flex justify-center space-x-4">
                <Link
                  href="/explore"
                  className="px-8 py-3 bg-white text-[#1E90FF] font-bold rounded-full shadow-lg hover:bg-gray-100 transition-all duration-300"
                >
                  Explore Our Ecosystem
                </Link>
                <Link
                  href="/join"
                  className="px-8 py-3 border-2 border-white text-white font-bold rounded-full shadow-lg hover:bg-blue-100 hover:text-[#1E90FF] transition-all duration-300"
                >
                  Join the Movement
                </Link>
              </div>
            </div>
          </section>

          {/* The Crossover Section */}
          <section className="py-20 px-4 md:px-8 lg:px-16 bg-[#050c1a]">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-4xl font-black text-white text-center mb-12">
                The Crossover: Beyond the Athlete
              </h2>
              <p className="text-lg text-blue-200 text-center max-w-3xl mx-auto mb-16">
                AthlynXAI's proven methodologies, once exclusive to elite athletes, are now tailored for everyone.
                We're transforming lives through holistic development, extending our reach into fitness, wellness,
                youth development, and life coaching.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <div className="bg-[#0d1a3a] p-8 rounded-xl border border-blue-700/50 shadow-lg hover:shadow-blue-500/30 transition-all duration-300">
                  <Dumbbell className="w-12 h-12 text-cyan-400 mb-4" />
                  <h3 className="text-xl font-bold text-blue-300 mb-2">Fitness</h3>
                  <p className="text-gray-300">Personalized training, performance tracking, and goal setting for all fitness levels.</p>
                </div>
                <div className="bg-[#0d1a3a] p-8 rounded-xl border border-blue-700/50 shadow-lg hover:shadow-blue-500/30 transition-all duration-300">
                  <HeartPulse className="w-12 h-12 text-cyan-400 mb-4" />
                  <h3 className="text-xl font-bold text-blue-300 mb-2">Wellness</h3>
                  <p className="text-gray-300">Mindfulness, nutrition, recovery, and mental resilience programs for a balanced life.</p>
                </div>
                <div className="bg-[#0d1a3a] p-8 rounded-xl border border-blue-700/50 shadow-lg hover:shadow-blue-500/30 transition-all duration-300">
                  <GraduationCap className="w-12 h-12 text-cyan-400 mb-4" />
                  <h3 className="text-xl font-bold text-blue-300 mb-2">Youth Development</h3>
                  <p className="text-gray-300">Building character, discipline, and leadership skills in the next generation.</p>
                </div>
                <div className="bg-[#0d1a3a] p-8 rounded-xl border border-blue-700/50 shadow-lg hover:shadow-blue-500/30 transition-all duration-300">
                  <Lightbulb className="w-12 h-12 text-cyan-400 mb-4" />
                  <h3 className="text-xl font-bold text-blue-300 mb-2">Life Coaching</h3>
                  <p className="text-gray-300">AI-powered guidance for career, personal growth, and achieving life ambitions.</p>
                </div>
              </div>
            </div>
          </section>

          {/* General Consumer Products Grid */}
          <section className="py-20 px-4 md:px-8 lg:px-16 bg-[#050c1a]">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-4xl font-black text-white text-center mb-12">
                Our Ecosystem: Products for Every Journey
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {/* Product Card 1 */}
                <div className="bg-[#0d1a3a] p-6 rounded-xl border border-blue-700/50 shadow-lg hover:shadow-blue-500/30 transition-all duration-300 flex flex-col items-center text-center">
                  <img src="/images/athlynx-fitness-os.png" alt="AthlynX Fitness OS" className="w-32 h-32 mb-4" />
                  <h3 className="text-2xl font-bold text-blue-300 mb-2">AthlynX Fitness OS</h3>
                  <p className="text-gray-300 text-sm">Your intelligent personal trainer, optimizing every workout.</p>
                  <Link href="#" className="mt-4 text-cyan-400 hover:underline font-semibold">Learn More</Link>
                </div>
                {/* Product Card 2 */}
                <div className="bg-[#0d1a3a] p-6 rounded-xl border border-blue-700/50 shadow-lg hover:shadow-blue-500/30 transition-all duration-300 flex flex-col items-center text-center">
                  <img src="/images/athlynx-wellness-os.png" alt="AthlynX Wellness OS" className="w-32 h-32 mb-4" />
                  <h3 className="text-2xl font-bold text-blue-300 mb-2">AthlynX Wellness OS</h3>
                  <p className="text-gray-300 text-sm">Holistic well-being, from nutrition to mental clarity.</p>
                  <Link href="#" className="mt-4 text-cyan-400 hover:underline font-semibold">Learn More</Link>
                </div>
                {/* Product Card 3 */}
                <div className="bg-[#0d1a3a] p-6 rounded-xl border border-blue-700/50 shadow-lg hover:shadow-blue-500/30 transition-all duration-300 flex flex-col items-center text-center">
                  <img src="/images/athlynx-youth-dev.png" alt="AthlynX Youth Development" className="w-32 h-32 mb-4" />
                  <h3 className="text-2xl font-bold text-blue-300 mb-2">AthlynX Youth Development</h3>
                  <p className="text-gray-300 text-sm">Empowering young minds for future success.</p>
                  <Link href="#" className="mt-4 text-cyan-400 hover:underline font-semibold">Learn More</Link>
                </div>
                {/* Product Card 4 */}
                <div className="bg-[#0d1a3a] p-6 rounded-xl border border-blue-700/50 shadow-lg hover:shadow-blue-500/30 transition-all duration-300 flex flex-col items-center text-center">
                  <img src="/images/athlynx-life-coach-ai.png" alt="AthlynX Life Coach AI" className="w-32 h-32 mb-4" />
                  <h3 className="text-2xl font-bold text-blue-300 mb-2">AthlynX Life Coach AI</h3>
                  <p className="text-gray-300 text-sm">Your AI companion for personal and professional breakthroughs.</p>
                  <Link href="#" className="mt-4 text-cyan-400 hover:underline font-semibold">Learn More</Link>
                </div>
              </div>
            </div>
          </section>

          {/* Celebrity and Influencer Partnerships */}
          <section className="py-20 px-4 md:px-8 lg:px-16 bg-[#050c1a]">
            <div className="max-w-6xl mx-auto text-center">
              <h2 className="text-4xl font-black text-white mb-12">
                Star Power: Our Celebrity & Influencer Network
              </h2>
              <p className="text-lg text-blue-200 max-w-3xl mx-auto mb-16">
                AthlynXAI is collaborating with global icons and influential voices to bring our mission to the forefront.
                These partnerships amplify our reach, inspiring millions to embrace the AthlynXAI lifestyle.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <div className="bg-[#0d1a3a] p-6 rounded-xl border border-blue-700/50 shadow-lg hover:shadow-blue-500/30 transition-all duration-300">
                  <Star className="w-12 h-12 text-cyan-400 mb-4 mx-auto" />
                  <h3 className="text-xl font-bold text-blue-300 mb-2">Global Athletes</h3>
                  <p className="text-gray-300 text-sm">Legendary sports figures sharing their AthlynXAI journey.</p>
                </div>
                <div className="bg-[#0d1a3a] p-6 rounded-xl border border-blue-700/50 shadow-lg hover:shadow-blue-500/30 transition-all duration-300">
                  <Zap className="w-12 h-12 text-cyan-400 mb-4 mx-auto" />
                  <h3 className="text-xl font-bold text-blue-300 mb-2">Lifestyle Influencers</h3>
                  <p className="text-gray-300 text-sm">Trendsetters integrating AthlynXAI into daily wellness.</p>
                </div>
                <div className="bg-[#0d1a3a] p-6 rounded-xl border border-blue-700/50 shadow-lg hover:shadow-blue-500/30 transition-all duration-300">
                  <Mic className="w-12 h-12 text-cyan-400 mb-4 mx-auto" />
                  <h3 className="text-xl font-bold text-blue-300 mb-2">Entertainment Personalities</h3>
                  <p className="text-gray-300 text-sm">Actors, musicians, and artists embracing peak performance.</p>
                </div>
              </div>
            </div>
          </section>

          {/* Entertainment Integration */}
          <section className="py-20 px-4 md:px-8 lg:px-16 bg-[#050c1a]">
            <div className="max-w-6xl mx-auto text-center">
              <h2 className="text-4xl font-black text-white mb-12">
                Athletes as Entertainers: The New Era
              </h2>
              <p className="text-lg text-blue-200 max-w-3xl mx-auto mb-16">
                AthlynXAI is at the forefront of a cultural shift, where athletes transcend their sport to become
                global entertainers. We're building platforms for music, podcasts, and media content creation,
                showcasing their multifaceted talents.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-[#0d1a3a] p-6 rounded-xl border border-blue-700/50 shadow-lg hover:shadow-blue-500/30 transition-all duration-300">
                  <h3 className="text-xl font-bold text-blue-300 mb-2">Music Ventures</h3>
                  <p className="text-gray-300 text-sm">Athletes producing and performing their own music.</p>
                </div>
                <div className="bg-[#0d1a3a] p-6 rounded-xl border border-blue-700/50 shadow-lg hover:shadow-blue-500/30 transition-all duration-300">
                  <h3 className="text-xl font-bold text-blue-300 mb-2">Podcast Networks</h3>
                  <p className="text-gray-300 text-sm">Engaging conversations and insights from top athletes.</p>
                </div>
                <div className="bg-[#0d1a3a] p-6 rounded-xl border border-blue-700/50 shadow-lg hover:shadow-blue-500/30 transition-all duration-300">
                  <h3 className="text-xl font-bold text-blue-300 mb-2">Original Media Content</h3>
                  <p className="text-gray-300 text-sm">Documentaries, series, and exclusive content.</p>
                </div>
              </div>
            </div>
          </section>

          {/* Global Expansion Map */}
          <section className="py-20 px-4 md:px-8 lg:px-16 bg-[#050c1a]">
            <div className="max-w-6xl mx-auto text-center">
              <h2 className="text-4xl font-black text-white mb-12">
                Mapping Our Future: Global Expansion
              </h2>
              <p className="text-lg text-blue-200 max-w-3xl mx-auto mb-16">
                AthlynXAI is rapidly expanding its global footprint, bringing our transformative platform to new markets.
                Our strategic rollout ensures localized impact and widespread adoption.
              </p>
              <div className="relative w-full h-96 bg-[#0d1a3a] rounded-xl border border-blue-700/50 flex items-center justify-center mb-12">
                <Map className="w-48 h-48 text-blue-700 opacity-30 absolute" />
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 p-4 relative z-10">
                  <div className="bg-[#050c1a] p-4 rounded-lg border border-blue-700/50 text-blue-300">
                    <h4 className="font-bold">USA</h4>
                    <p className="text-sm">Launched 2025</p>
                    <p className="text-xs text-gray-400">Key cities: NYC, LA, Miami</p>
                  </div>
                  <div className="bg-[#050c1a] p-4 rounded-lg border border-blue-700/50 text-blue-300">
                    <h4 className="font-bold">Europe</h4>
                    <p className="text-sm">Q1 2026</p>
                    <p className="text-xs text-gray-400">Key markets: UK, Germany, France</p>
                  </div>
                  <div className="bg-[#050c1a] p-4 rounded-lg border border-blue-700/50 text-blue-300">
                    <h4 className="font-bold">Latin America</h4>
                    <p className="text-sm">Q3 2026</p>
                    <p className="text-xs text-gray-400">Key markets: Brazil, Mexico</p>
                  </div>
                  <div className="bg-[#050c1a] p-4 rounded-lg border border-blue-700/50 text-blue-300">
                    <h4 className="font-bold">Asia</h4>
                    <p className="text-sm">Q1 2027</p>
                    <p className="text-xs text-gray-400">Key markets: Japan, South Korea, India</p>
                  </div>
                  <div className="bg-[#050c1a] p-4 rounded-lg border border-blue-700/50 text-blue-300">
                    <h4 className="font-bold">Africa</h4>
                    <p className="text-sm">Q3 2027</p>
                    <p className="text-xs text-gray-400">Key markets: South Africa, Nigeria</p>
                  </div>
                </div>
              </div>
              <p className="text-sm text-gray-400 mt-8">Our expansion strategy focuses on key urban centers and digital adoption rates to ensure maximum impact and community integration.</p>
            </div>
          </section>

          {/* Network Effect */}
          <section className="py-20 px-4 md:px-8 lg:px-16 bg-[#050c1a]">
            <div className="max-w-6xl mx-auto text-center">
              <h2 className="text-4xl font-black text-white mb-12">
                The Power of Connection: Our Network Effect
              </h2>
              <p className="text-lg text-blue-200 max-w-3xl mx-auto mb-16">
                Every new user joining AthlynXAI amplifies the value for the entire community.
                Our platform thrives on connection, shared growth, and collective achievement.
                The more people who join, the smarter and more personalized the AthlynXAI experience becomes for everyone.
              </p>
              <div className="bg-[#0d1a3a] p-8 rounded-xl border border-blue-700/50 shadow-lg hover:shadow-blue-500/30 transition-all duration-300 max-w-4xl mx-auto">
                <LineChart className="w-24 h-24 text-cyan-400 mb-6 mx-auto" />
                <h3 className="text-2xl font-bold text-blue-300 mb-4">Exponential Growth & Value Creation</h3>
                <p className="text-gray-300 text-md mb-6">A visual representation of our community's expanding impact and the increasing value derived by each member as our network grows.</p>
                {/* Placeholder for a growth chart mockup - in a real app, this would be a dynamic chart component */}
                <div className="w-full h-64 bg-[#050c1a] rounded-lg flex items-center justify-center text-blue-500 text-xl font-mono border border-blue-700/50">
                  <p>Growth Chart Mockup: Users vs. Platform Value</p>
                </div>
                <ul className="list-disc list-inside text-gray-300 text-left mt-6 space-y-2">
                  <li><span className="font-bold text-cyan-400">Personalized Insights:</span> More data leads to more accurate and tailored recommendations.</li>
                  <li><span className="font-bold text-cyan-400">Community Engagement:</span> A larger community fosters richer interactions and support networks.</li>
                  <li><span className="font-bold text-cyan-400">Content Enrichment:</span> User-generated content and shared experiences enhance the platform's knowledge base.</li>
                  <li><span className="font-bold text-cyan-400">Feature Development:</span> Growth enables continuous investment in cutting-edge AI and platform features.</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Community & Engagement Section */}
          <section className="py-20 px-4 md:px-8 lg:px-16 bg-[#050c1a]">
            <div className="max-w-6xl mx-auto text-center">
              <h2 className="text-4xl font-black text-white mb-12">
                Building Bridges: Community & Engagement
              </h2>
              <p className="text-lg text-blue-200 max-w-3xl mx-auto mb-16">
                AthlynXAI is more than a platform; it's a thriving global community. We foster connection, collaboration,
                and shared success through various engagement initiatives.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-[#0d1a3a] p-8 rounded-xl border border-blue-700/50 shadow-lg hover:shadow-blue-500/30 transition-all duration-300">
                  <Users className="w-12 h-12 text-cyan-400 mb-4 mx-auto" />
                  <h3 className="text-xl font-bold text-blue-300 mb-2">Global Forums & Groups</h3>
                  <p className="text-gray-300">Connect with like-minded individuals, share insights, and find support.</p>
                </div>
                <div className="bg-[#0d1a3a] p-8 rounded-xl border border-blue-700/50 shadow-lg hover:shadow-500/30 transition-all duration-300">
                  <MessageSquare className="w-12 h-12 text-cyan-400 mb-4 mx-auto" />
                  <h3 className="text-xl font-bold text-blue-300 mb-2">Interactive Workshops & Events</h3>
                  <p className="text-gray-300">Participate in live sessions, learn from experts, and expand your network.</p>
                </div>
              </div>
            </div>
          </section>

          {/* Testimonials Section */}
          <section className="py-20 px-4 md:px-8 lg:px-16 bg-[#050c1a]">
            <div className="max-w-6xl mx-auto text-center">
              <h2 className="text-4xl font-black text-white mb-12">
                What Our Community Says
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-[#0d1a3a] p-8 rounded-xl border border-blue-700/50 shadow-lg hover:shadow-blue-500/30 transition-all duration-300 text-left">
                  <Quote className="w-8 h-8 text-cyan-400 mb-4" />
                  <p className="text-gray-300 italic mb-4">
                    "AthlynXAI transformed my fitness journey. I went from struggling with motivation to achieving my personal bests, all thanks to their AI-powered coaching."
                  </p>
                  <div className="flex items-center">
                    <User className="w-10 h-10 text-blue-300 mr-3" />
                    <div>
                      <p className="font-bold text-blue-300">Jane Doe</p>
                      <p className="text-sm text-gray-400">Fitness Enthusiast</p>
                    </div>
                  </div>
                </div>
                <div className="bg-[#0d1a3a] p-8 rounded-xl border border-blue-700/50 shadow-lg hover:shadow-blue-500/30 transition-all duration-300 text-left">
                  <Quote className="w-8 h-8 text-cyan-400 mb-4" />
                  <p className="text-gray-300 italic mb-4">
                    "As a busy professional, AthlynXAI's wellness programs have been a game-changer. It's like having a personal wellness coach in my pocket, helping me stay balanced and focused."
                  </p>
                  <div className="flex items-center">
                    <User className="w-10 h-10 text-blue-300 mr-3" />
                    <div>
                      <p className="font-bold text-blue-300">John Smith</p>
                      <p className="text-sm text-gray-400">Entrepreneur</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Future Outlook Section */}
          <section className="py-20 px-4 md:px-8 lg:px-16 bg-[#050c1a]">
            <div className="max-w-6xl mx-auto text-center">
              <h2 className="text-4xl font-black text-white mb-12">
                The Road Ahead: Our Future Outlook
              </h2>
              <p className="text-lg text-blue-200 max-w-3xl mx-auto mb-16">
                AthlynXAI is continuously innovating, pushing the boundaries of AI and human potential.
                Our roadmap includes advanced AI models, deeper personalization, and new frontiers in human-computer interaction.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-[#0d1a3a] p-8 rounded-xl border border-blue-700/50 shadow-lg hover:shadow-blue-500/30 transition-all duration-300">
                  <Rocket className="w-12 h-12 text-cyan-400 mb-4 mx-auto" />
                  <h3 className="text-xl font-bold text-blue-300 mb-2">Innovation & Research</h3>
                  <p className="text-gray-300">Investing in cutting-edge AI, machine learning, and neuroscience to unlock new capabilities.</p>
                </div>
                <div className="bg-[#0d1a3a] p-8 rounded-xl border border-blue-700/50 shadow-lg hover:shadow-blue-500/30 transition-all duration-300">
                  <ShieldCheck className="w-12 h-12 text-cyan-400 mb-4 mx-auto" />
                  <h3 className="text-xl font-bold text-blue-300 mb-2">Ethical AI & Privacy</h3>
                  <p className="text-gray-300">Commitment to responsible AI development and robust data privacy for our users.</p>
                </div>
              </div>
            </div>
          </section>

          {/* Call to Action Section */}
          <section className="py-20 px-4 md:px-8 lg:px-16 bg-[#050c1a]">
            <div className="max-w-4xl mx-auto text-center bg-[#0d1a3a] p-10 rounded-xl border border-blue-700/50 shadow-lg">
              <h2 className="text-4xl font-black text-white mb-6">
                Ready to Be The Legacy?™
              </h2>
              <p className="text-lg text-blue-200 mb-8">
                Join the AthlynXAI movement and unlock your full potential. Whether you're an athlete, an entrepreneur, or seeking personal growth, our ecosystem is built for you.
              </p>
              <Link
                href="/signup"
                className="inline-flex items-center px-10 py-4 bg-[#1E90FF] text-white font-bold rounded-full shadow-lg hover:bg-[#4169E1] transition-all duration-300 text-xl"
              >
                Get Started Today <ArrowRight className="ml-3 w-6 h-6" />
              </Link>
            </div>
          </section>

          {/* Revenue at Scale & Vision Statement */}
          <section className="py-20 px-4 md:px-8 lg:px-16 bg-[#050c1a]">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-4xl font-black text-white text-center mb-12">
                Vision & Impact: Revenue at Scale
              </h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div className="bg-[#0d1a3a] p-8 rounded-xl border border-blue-700/50 shadow-lg hover:shadow-blue-500/30 transition-all duration-300">
                  <h3 className="text-2xl font-bold text-blue-300 mb-4">Projected User Growth</h3>
                  <ul className="list-disc list-inside text-gray-300 text-lg space-y-2">
                    <li><span className="font-bold text-cyan-400">2027:</span> 10 Million Users</li>
                    <li><span className="font-bold text-cyan-400">2028:</span> 50 Million Users</li>
                    <li><span className="font-bold text-cyan-400">2030:</span> 100 Million Users</li>
                  </ul>
                  <p className="text-gray-400 text-sm mt-6">*Projections based on current growth trajectory and market expansion strategies.</p>
                </div>
                <div className="bg-[#0d1a3a] p-8 rounded-xl border border-blue-700/50 shadow-lg hover:shadow-blue-500/30 transition-all duration-300">
                  <h3 className="text-2xl font-black text-white mb-4">Chad Dozier Sr.'s Vision</h3>
                  <blockquote className="italic text-blue-200 text-xl leading-relaxed">
                    "AthlynXAI was born from a simple yet profound belief: that every individual possesses the potential for greatness.
                    We started with sports, honing the tools that unlock peak human performance. Now, we extend that legacy to the world.
                    This isn't just about technology; it's about empowering lives, fostering a global community of achievers,
                    and inspiring everyone to truly <span className="text-cyan-400 font-bold">Be The Legacy.™</span>"
                  </blockquote>
                </div>
              </div>
            </div>
          </section>

          {/* Footer */}
          <footer className="py-10 px-4 md:px-8 lg:px-16 bg-[#050c1a] text-center text-blue-300 text-sm border-t border-blue-700/50">
            <p>Copyright © 2026 Chad A. Dozier Sr. / AthlynXAI. All rights reserved. Be The Legacy.™</p>
          </footer>
        </div>
        <MobileBottomNav />
      </DashboardLayout>
    </RouteErrorBoundary>
  );
}
