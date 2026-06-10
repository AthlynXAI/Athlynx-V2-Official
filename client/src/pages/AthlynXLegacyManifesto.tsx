import DashboardLayout from "@/components/DashboardLayout";
import MobileBottomNav from "@/components/MobileBottomNav";
import { RouteErrorBoundary } from "@/components/GlobalErrorBoundary";
import { Link } from "wouter";
import { useState, useEffect } from "react";
import {
  ShieldCheck,
  Award,
  Gem,
  Users,
  Lightbulb,
  ArrowRight,
  CalendarCheck,
  TrendingUp,
  Handshake,
  Rocket,
} from "lucide-react";

export default function AthlynXLegacyManifesto() {
  return (
    <RouteErrorBoundary>
      <DashboardLayout>
        <div className="min-h-screen bg-[#050c1a] text-white">
          {/* Hero Section */}
          <section className="relative h-screen flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-[#1E90FF] to-[#4169E1] opacity-20"></div>
            <div
              className="absolute inset-0"
              style={{
                background: `radial-gradient(circle at center, rgba(30, 144, 255, 0.3) 0%, transparent 50%)`,
              }}
            ></div>
            <div className="relative z-10 text-center">
              <h1 className="text-7xl md:text-9xl font-black mb-4"
                style={{
                  backgroundImage: "linear-gradient(to right, #1E90FF, #4169E1)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                BE THE LEGACY
              </h1>
              <p className="text-xl md:text-2xl font-bold text-blue-300">
                AthlynXAI — Founding Vision, Philosophy, Mission
              </p>
              <p className="mt-4 text-lg max-w-2xl mx-auto text-gray-300">
                At AthlynXAI, we believe every athlete has the potential to leave an indelible mark.
                Our manifesto outlines the core principles guiding our journey to empower athletes worldwide.
              </p>
            </div>
          </section>

          {/* Founder Statement */}
          <section className="py-20 px-4 md:px-8 lg:px-16">
            <div className="max-w-4xl mx-auto bg-[#0d1a3a] border border-blue-700/50 rounded-lg p-8 shadow-lg">
              <h2 className="text-3xl font-black text-white mb-6 text-center">Founder's Vision: A New Path</h2>
              <p className="text-lg text-gray-300 mb-6">
                Chad A. Dozier Sr., the visionary behind AthlynXAI, shares his profound motivation and the audacious spirit
                that drives our mission. His words encapsulate the pioneering ethos at the heart of our platform.
              </p>
              <blockquote className="text-2xl md:text-3xl italic font-semibold text-white leading-relaxed border-l-4 border-[#1E90FF] pl-4">
                "I am the black sheep. I go my own way. No one has done this before. We are building the first platform that owns the athlete journey from birth to career to retirement to death."
              </blockquote>
              <p className="text-right mt-6 text-lg font-bold text-blue-300">— Chad A. Dozier Sr.</p>
            </div>
          </section>

          {/* The Mission */}
          <section className="py-20 px-4 md:px-8 lg:px-16 bg-[#050c1a]">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-4xl font-black text-white mb-10 text-center">Our Unwavering Mission</h2>
              <p className="text-xl text-gray-300 text-center mb-12">
                AthlynXAI is committed to fundamentally transforming the landscape for athletes globally.
                Our mission is built upon three foundational pillars, ensuring a holistic approach to athlete empowerment.
              </p>
              <div className="grid md:grid-cols-3 gap-8 text-center">
                <div className="bg-[#0d1a3a] border border-blue-700/50 rounded-lg p-6 shadow-lg">
                  <ShieldCheck className="w-12 h-12 text-[#1E90FF] mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-blue-300 mb-2">Protect Athletes</h3>
                  <p className="text-white text-lg">
                    We are dedicated to safeguarding athletes' interests, ensuring their physical, mental, and financial well-being
                    throughout their careers and beyond. This includes providing resources for legal protection, health management,
                    and ethical representation, creating a secure environment for them to thrive.
                  </p>
                </div>
                <div className="bg-[#0d1a3a] border border-blue-700/50 rounded-lg p-6 shadow-lg">
                  <Gem className="w-12 h-12 text-[#1E90FF] mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-blue-300 mb-2">Build Generational Wealth</h3>
                  <p className="text-white text-lg">
                    Our platform empowers athletes with the knowledge and tools to cultivate lasting financial legacies.
                    We provide guidance on smart investments, financial planning, and entrepreneurial ventures,
                    enabling them to secure not just their own future, but that of their families for generations.
                  </p>
                </div>
                <div className="bg-[#0d1a3a] border border-blue-700/50 rounded-lg p-6 shadow-lg">
                  <Lightbulb className="w-12 h-12 text-[#1E90FF] mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-blue-300 mb-2">Jordan-Nike Model for the Digital Age</h3>
                  <p className="text-white text-lg">
                    We are innovating the athlete-brand partnership, creating a dynamic ecosystem where athletes can
                    build, own, and monetize their personal brands in the digital era. This model fosters direct engagement
                    with fans and consumers, maximizing their influence and economic potential beyond traditional endorsements.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* The Vision Timeline */}
          <section className="py-20 px-4 md:px-8 lg:px-16">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-4xl font-black text-white mb-10 text-center">Our Ambitious Vision: A Timeline</h2>
              <p className="text-xl text-gray-300 text-center mb-12">
                Our journey is meticulously planned, with strategic milestones designed to expand our reach and impact.
                Each phase builds upon the last, propelling AthlynXAI towards global leadership in athlete empowerment.
              </p>
              <div className="relative flex flex-col items-center">
                <div className="absolute h-full w-1 bg-blue-700/50 rounded-full"></div>
                <div className="flex flex-col space-y-12 w-full">
                  {[
                    {
                      year: "2026",
                      title: "Sports Focus: Dominating the Athletic Ecosystem",
                      description: "Launch of core platform features tailored for professional and aspiring athletes, establishing a strong foothold in key sports markets. Focus on athlete onboarding, initial brand partnerships, and foundational wealth-building tools.",
                    },
                    {
                      year: "2027",
                      title: "Mainstream Integration: Expanding into Broader Markets",
                      description: "Integration with mainstream media and entertainment, bringing athlete stories and brand opportunities to a wider audience. Expansion of financial literacy programs and introduction of advanced personal branding modules.",
                    },
                    {
                      year: "2028",
                      title: "Retail Expansion: Launching Innovative Product Lines",
                      description: "Introduction of AthlynXAI-powered retail ventures, allowing athletes to create and sell their own merchandise and digital assets directly to fans. Development of decentralized commerce solutions and fan engagement platforms.",
                    },
                    {
                      year: "2030",
                      title: "Global Brand: Becoming a Worldwide Household Name",
                      description: "Achieving global recognition as the definitive platform for athlete empowerment, with a presence in every major sports market. Continuous innovation in AI-driven insights, community building, and legacy creation tools.",
                    },
                  ].map((item, index) => (
                    <div key={index} className="flex items-center w-full relative">
                      <div className={`w-1/2 ${index % 2 === 0 ? "pr-8 text-right" : "pl-8 text-left"} hidden md:block`}>
                        <h3 className="text-2xl font-bold text-blue-300">{item.year}</h3>
                        <p className="text-white text-lg">{item.title}</p>
                        <p className="text-gray-400">{item.description}</p>
                      </div>
                      <div className="z-10 flex items-center justify-center w-10 h-10 rounded-full bg-[#1E90FF] border-4 border-blue-700/50 text-white font-bold">
                        {item.year.slice(-2)}
                      </div>
                      <div className={`w-full md:w-1/2 ${index % 2 === 0 ? "pl-8 md:pl-0 md:text-left" : "pr-8 md:pr-0 md:text-right"} md:hidden`}>
                        <h3 className="text-2xl font-bold text-blue-300">{item.year}</h3>
                        <p className="text-white text-lg">{item.title}</p>
                        <p className="text-gray-400">{item.description}</p>
                      </div>
                      <div className={`w-1/2 ${index % 2 === 0 ? "pl-8 text-left" : "pr-8 text-right"} hidden md:block`}>
                        <h3 className="text-2xl font-bold text-blue-300">{item.year}</h3>
                        <p className="text-white text-lg">{item.title}</p>
                        <p className="text-gray-400">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* The Values */}
          <section className="py-20 px-4 md:px-8 lg:px-16 bg-[#050c1a]">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-4xl font-black text-white mb-10 text-center">Our Core Values: Guiding Principles</h2>
              <p className="text-xl text-gray-300 text-center mb-12">
                These five core values are the bedrock of AthlynXAI, shaping every decision and interaction.
                They represent our unwavering commitment to the athletes we serve and the future we are building.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <div className="bg-[#0d1a3a] border border-blue-700/50 rounded-lg p-6 text-center shadow-lg">
                  <ShieldCheck className="w-16 h-16 text-cyan-400 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-blue-300 mb-2">Integrity</h3>
                  <p className="text-white text-lg">
                    We operate with unwavering honesty and transparency, building trust through ethical practices
                    and accountability. Every action we take is guided by a commitment to what is right, ensuring
                    fairness and respect for all members of the AthlynXAI community.
                  </p>
                </div>
                <div className="bg-[#0d1a3a] border border-blue-700/50 rounded-lg p-6 text-center shadow-lg">
                  <Award className="w-16 h-16 text-cyan-400 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-blue-300 mb-2">Excellence</h3>
                  <p className="text-white text-lg">
                    We are relentless in our pursuit of the highest standards in everything we do, from platform development
                    to athlete support. We strive for continuous improvement, pushing boundaries to deliver exceptional
                    results and unparalleled value to our athletes and partners.
                  </p>
                </div>
                <div className="bg-[#0d1a3a] border border-blue-700/50 rounded-lg p-6 text-center shadow-lg">
                  <Gem className="w-16 h-16 text-cyan-400 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-blue-300 mb-2">Legacy</h3>
                  <p className="text-white text-lg">
                    We empower athletes to build enduring legacies that transcend their playing careers, impacting
                    their families, communities, and the world. Our focus is on long-term impact, fostering a mindset
                    of sustained contribution and meaningful influence.
                  </p>
                </div>
                <div className="bg-[#0d1a3a] border border-blue-700/50 rounded-lg p-6 text-center shadow-lg">
                  <Users className="w-16 h-16 text-cyan-400 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-blue-300 mb-2">Community</h3>
                  <p className="text-white text-lg">
                    We foster a powerful, supportive global community where athletes connect, collaborate, and uplift
                    one another. This network provides mentorship, shared experiences, and collective strength,
                    ensuring no athlete walks their journey alone.
                  </p>
                </div>
                <div className="bg-[#0d1a3a] border border-blue-700/50 rounded-lg p-6 text-center shadow-lg">
                  <Lightbulb className="w-16 h-16 text-cyan-400 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-blue-300 mb-2">Innovation</h3>
                  <p className="text-white text-lg">
                    We embrace forward-thinking solutions and cutting-edge technology to continuously redefine
                    what's possible for athletes. Our commitment to innovation drives us to explore new frontiers,
                    providing our community with the most advanced tools and opportunities.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* The Promise to Athletes */}
          <section className="py-20 px-4 md:px-8 lg:px-16">
            <div className="max-w-4xl mx-auto bg-[#0d1a3a] border border-blue-700/50 rounded-lg p-8 shadow-lg text-center">
              <h2 className="text-3xl font-black text-white mb-6">Our Unbreakable Promise to Every Athlete</h2>
              <p className="text-lg text-gray-300 mb-6">
                At AthlynXAI, our commitment to athletes is absolute. We stand by you, not just as a platform,
                but as a dedicated partner throughout every stage of your career and life.
              </p>
              <blockquote className="text-2xl md:text-3xl italic font-semibold text-white leading-relaxed">
                "We are your teammate from day one. We grow when you grow. We win when you win."
              </blockquote>
              <p className="text-lg text-gray-300 mt-6">
                This promise is the cornerstone of our relationship, ensuring mutual success and unwavering support.
              </p>
            </div>
          </section>

          {/* The Numbers */}
          <section className="py-20 px-4 md:px-8 lg:px-16 bg-[#050c1a]">
            <div className="max-w-5xl mx-auto text-center">
              <h2 className="text-4xl font-black text-white mb-10">The Numbers: Unlocking Athlete Lifecycle Value</h2>
              <p className="text-xl text-gray-300 mb-8">
                AthlynXAI is not just a vision; it's a quantifiable impact. We are revolutionizing the athlete journey,
                unlocking unprecedented value and potential from youth to retirement and beyond. Our data-driven approach
                ensures that every athlete can maximize their earnings, secure their future, and build enduring legacies.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <div className="bg-[#0d1a3a] border border-blue-700/50 rounded-lg p-6 shadow-lg">
                  <TrendingUp className="w-16 h-16 text-[#1E90FF] mx-auto mb-4" />
                  <h3 className="text-5xl font-black text-[#1E90FF] mb-2">$10 Billion+</h3>
                  <p className="text-blue-300 text-lg">Projected Total Athlete Lifetime Value</p>
                  <p className="text-gray-400 text-sm mt-2">Through optimized career management & investment strategies.</p>
                </div>
                <div className="bg-[#0d1a3a] border border-blue-700/50 rounded-lg p-6 shadow-lg">
                  <Rocket className="w-16 h-16 text-[#1E90FF] mx-auto mb-4" />
                  <h3 className="text-5xl font-black text-[#1E90FF] mb-2">50%+</h3>
                  <p className="text-blue-300 text-lg">Average Increase in Athlete Earnings</p>
                  <p className="text-gray-400 text-sm mt-2">Leveraging personal brand monetization & diversified income streams.</p>
                </div>
                <div className="bg-[#0d1a3a] border border-blue-700/50 rounded-lg p-6 shadow-lg">
                  <Handshake className="w-16 h-16 text-[#1E90FF] mx-auto mb-4" />
                  <h3 className="text-5xl font-black text-[#1E90FF] mb-2">10,000+</h3>
                  <p className="text-blue-300 text-lg">Athletes Empowered Globally by 2030</p>
                  <p className="text-gray-400 text-sm mt-2">Building a worldwide network of successful, legacy-driven individuals.</p>
                </div>
              </div>
              <p className="text-gray-400 mt-8 text-md">
                *These figures represent our ambitious targets and are based on extensive market analysis and strategic projections.
              </p>
            </div>
          </section>

          {/* Call to Action */}
          <section className="py-20 px-4 md:px-8 lg:px-16 text-center">
            <div className="max-w-3xl mx-auto bg-[#0d1a3a] border border-blue-700/50 rounded-lg p-10 shadow-lg">
              <h2 className="text-4xl font-black text-white mb-6">Join the Movement. Be The Legacy.</h2>
              <p className="text-xl text-gray-300 mb-8">
                Your journey to unparalleled success and lasting impact begins here. AthlynXAI is more than a platform;
                it's a partnership dedicated to realizing your full potential. Don't just play the game—change it.
              </p>
              <Link href="/signup">
                <a className="inline-flex items-center justify-center px-8 py-4 text-lg font-bold rounded-full bg-gradient-to-r from-[#1E90FF] to-[#4169E1] text-white shadow-lg hover:from-[#4169E1] hover:to-[#1E90FF] transition-all duration-300">
                  Sign Up Now <ArrowRight className="ml-2 w-5 h-5" />
                </a>
              </Link>
            </div>
          </section>

          {/* Footer */}
          <footer className="bg-[#0d1a3a] py-8 px-4 md:px-8 lg:px-16 text-center text-gray-400 text-sm border-t border-blue-700/50">
            <p>
              Copyright © 2026 Chad A. Dozier Sr. / AthlynXAI. All rights reserved. Be The Legacy.™
            </p>
          </footer>
        </div>
        <MobileBottomNav />
      </DashboardLayout>
    </RouteErrorBoundary>
  );
}
