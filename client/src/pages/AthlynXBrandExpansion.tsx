import DashboardLayout from "@/components/DashboardLayout";
import MobileBottomNav from "@/components/MobileBottomNav";
import { RouteErrorBoundary } from "@/components/GlobalErrorBoundary";
import { Link } from "wouter";
import { useState, useEffect, useRef } from "react";
import { Rocket, TrendingUp, Calendar, DollarSign, Target, Globe, Megaphone, CheckCircle, Clock, Award, Heart, ShoppingBag, Monitor, Users, Handshake, BookOpen, BarChart2, Zap, Sparkles, Lightbulb, Palette, Briefcase, Coins, ShieldCheck, GraduationCap, Dumbbell, Home, Store, Flag, Trophy } from "lucide-react";

// Main component for the AthlynX Brand Expansion page
export default function AthlynXBrandExpansion() {
  // Ref for observing timeline elements for animation
  const timelineRef = useRef<HTMLDivElement>(null);

  // Effect hook for implementing scroll-based animations on timeline elements
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Add animation class when element enters viewport
            entry.target.classList.add("animate-fade-in-up");
            // Stop observing once animated to prevent re-triggering
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 } // Trigger when 10% of the item is visible
    );

    // Observe all direct children of the timeline container
    if (timelineRef.current) {
      Array.from(timelineRef.current.children).forEach((child) => {
        observer.observe(child);
      });
    }

    // Cleanup function to unobserve elements when component unmounts
    return () => {
      if (timelineRef.current) {
        Array.from(timelineRef.current.children).forEach((child) => {
          observer.unobserve(child);
        });
      }
    };
  }, []); // Empty dependency array ensures this runs once on mount

  // Data structure for the brand expansion phases
  const phases = [
    {
      year: "2026",
      title: "Phase 1: Sports OS",
      status: "Current",
      icon: <Rocket className="h-6 w-6 text-white" />,
      description: "Establishing AthlynXAI as the premier operating system for athletes, focusing on performance optimization, career management, and financial empowerment. This phase lays the foundational technology and user base within the professional and collegiate sports ecosystems, targeting both individual athletes and sports organizations.",
      keyFeatures: [
        { icon: <Award className="h-4 w-4 mr-2" />, text: "Athlete Performance Tracking & Analytics: Advanced metrics and insights for peak physical and mental conditioning, injury prevention, and recovery." },
        { icon: <DollarSign className="h-4 w-4 mr-2" />, text: "NIL Deal Management & Monetization: Streamlined tools for athletes to manage and maximize Name, Image, and Likeness opportunities, ensuring fair compensation and compliance." },
        { icon: <Target className="h-4 w-4 mr-2" />, text: "Recruiting & Scouting Tools for Teams: AI-powered talent identification and recruitment platforms for coaches and scouts, enhancing decision-making processes." },
        { icon: <ShieldCheck className="h-4 w-4 mr-2" />, text: "Integrated Medical & Wellness Records: Secure and comprehensive health data management for injury prevention, rehabilitation, and overall athlete well-being." },
        { icon: <Coins className="h-4 w-4 mr-2" />, text: "Financial Literacy & Wealth Management: Educational resources and tools to build sustainable financial futures for athletes, including budgeting, investment, and tax planning." },
        { icon: <Handshake className="h-4 w-4 mr-2" />, text: "Agent & Endorsement Management: Tools for agents to manage contracts, endorsements, and athlete portfolios efficiently, fostering transparency and trust." },
        { icon: <Briefcase className="h-4 w-4 mr-2" />, text: "Career Development & Post-Sport Transition: Guidance and resources for athletes transitioning to new careers, including skill development, networking, and job placement assistance." },
      ],
      revenue: "Projected: $5M - $10M (Initial Market Penetration & Platform Adoption)",
    },
    {
      year: "2027",
      title: "Phase 2: Mainstream",
      status: "Upcoming",
      icon: <Home className="h-6 w-6 text-white" />,
      description: "Expanding beyond professional sports to embrace general consumer wellness, fitness, and lifestyle. This phase aims to integrate AthlynXAI into the daily lives of a broader audience, promoting healthy living and personal development, and fostering a vibrant, engaged community around the 'Be The Legacy' philosophy.",
      keyFeatures: [
        { icon: <Dumbbell className="h-4 w-4 mr-2" />, text: "Personalized Fitness & Wellness Programs: Tailored workout plans, nutrition guides, and mental well-being exercises for all fitness levels, adaptable to individual goals and preferences." },
        { icon: <Sparkles className="h-4 w-4 mr-2" />, text: "Lifestyle Integration & Smart Recommendations: AI-driven suggestions for daily routines, productivity, and personal growth, enhancing overall quality of life through intelligent insights." },
        { icon: <GraduationCap className="h-4 w-4 mr-2" />, text: "Youth Sports & Development Programs: Educational content and training modules for aspiring young athletes and enthusiasts, promoting healthy habits, sportsmanship, and skill development from an early age." },
        { icon: <Users className="h-4 w-4 mr-2" />, text: "Community Building & Social Engagement Features: Platforms for users to connect, share progress, participate in challenges, and motivate each other, fostering a supportive network." },
        { icon: <BookOpen className="h-4 w-4 mr-2" />, text: "Educational Content Hub: A comprehensive library of articles, videos, and courses on health, fitness, nutrition, and personal development, curated by experts and thought leaders." },
        { icon: <Heart className="h-4 w-4 mr-2" />, text: "Mental Health & Mindfulness Resources: Tools and guided practices for stress reduction, focus, and emotional well-being, promoting holistic health." },
        { icon: <Monitor className="h-4 w-4 mr-2" />, text: "Wearable Tech Integration: Seamless integration with popular fitness trackers and smart devices to provide real-time data and personalized feedback." },
      ],
      revenue: "Projected: $20M - $50M (Consumer Market Expansion & Subscription Growth)",
    },
    {
      year: "2028",
      title: "Phase 3: Retail",
      status: "Future",
      icon: <Store className="h-6 w-6 text-white" />,
      description: "Venturing into physical and digital retail with exclusive AthlynXAI merchandise and strategic partnerships. This phase establishes a tangible brand presence and offers high-quality products that embody the 'Be The Legacy' ethos, extending the brand's reach into everyday consumer goods and lifestyle products.",
      keyFeatures: [
        { icon: <ShoppingBag className="h-4 w-4 mr-2" />, text: "Launch of 'Be The Legacy' Merchandise Line: Premium apparel, accessories, and gear reflecting the AthlynXAI brand's commitment to excellence, performance, and inspiration." },
        { icon: <Trophy className="h-4 w-4 mr-2" />, text: "Co-branded Athlete Apparel Collections: Exclusive collaborations with top athletes to create unique, limited-edition product lines that resonate with fans and celebrate individual legacies." },
        { icon: <Handshake className="h-4 w-4 mr-2" />, text: "Strategic Retail Partnerships & Pop-up Stores: Expanding distribution through major retailers and creating immersive brand experiences with temporary pop-up shops in key urban centers." },
        { icon: <Monitor className="h-4 w-4 mr-2" />, text: "Enhanced E-commerce Platform & Experience: A seamless, intuitive online shopping experience with personalized recommendations, virtual try-ons, and exclusive drops for loyal customers." },
        { icon: <Palette className="h-4 w-4 mr-2" />, text: "Customization Options: Allowing users to personalize merchandise with their unique flair, team logos, inspirational messages, or performance achievements." },
        { icon: <Zap className="h-4 w-4 mr-2" />, text: "Smart Wearables & Tech Integration: Developing AthlynXAI branded smart wearables that integrate with the platform for enhanced tracking, data collection, and personalized insights." },
        { icon: <Lightbulb className="h-4 w-4 mr-2" />, text: "Sustainable Product Initiatives: Commitment to eco-friendly materials and ethical manufacturing practices for all merchandise." },
      ],
      revenue: "Projected: $75M - $150M (Product Sales & Brand Monetization)",
    },
    {
      year: "2029",
      title: "Phase 4: Brand/Advertising",
      status: "Future",
      icon: <Trophy className="h-6 w-6 text-white" />,
      description: "Positioning AthlynXAI as a powerful media and advertising platform, focusing on brand storytelling and engagement. Crucially, this phase emphasizes advertising the AthlynX BRAND itself, rather than hosting ads on individual athletes or user content, maintaining brand integrity and focus on core values.",
      keyFeatures: [
        { icon: <Monitor className="h-4 w-4 mr-2" />, text: "AthlynX as a Premium Media Platform: Curated content, documentaries, and exclusive interviews showcasing the legacy mindset, inspiring stories of achievement, and behind-the-scenes insights." },
        { icon: <Megaphone className="h-4 w-4 mr-2" />, text: "Advertising the AthlynX BRAND (not athletes): Strategic campaigns to elevate the AthlynXAI brand globally, focusing on its values, mission, and impact on individuals and communities." },
        { icon: <Handshake className="h-4 w-4 mr-2" />, text: "Content Creation & Distribution Partnerships: Collaborations with leading media houses, influencers, and content creators to amplify brand messaging and reach diverse audiences." },
        { icon: <BarChart2 className="h-4 w-4 mr-2" />, text: "Data-Driven Brand Storytelling & Engagement: Utilizing advanced analytics to craft compelling narratives that resonate deeply with the target audience and drive meaningful engagement." },
        { icon: <Lightbulb className="h-4 w-4 mr-2" />, text: "Innovative Ad Formats: Developing unique and engaging ways to present the AthlynXAI brand story across various digital and traditional channels, including interactive experiences." },
        { icon: <Trophy className="h-4 w-4 mr-2" />, text: "Global Brand Campaigns: Launching high-impact campaigns that transcend geographical boundaries and cultural differences, fostering a universal appeal." },
        { icon: <Users className="h-4 w-4 mr-2" />, text: "Influencer Marketing with Brand Ambassadors: Partnering with key figures who embody the 'Be The Legacy' ethos to authentically promote the brand." },
      ],
      revenue: "Projected: $200M - $400M (Media & Brand Value Growth through Strategic Campaigns)",
    },
    {
      year: "2030",
      title: "Phase 5: Global",
      status: "Future",
      icon: <Globe className="h-6 w-6 text-white" />,
      description: "Achieving global presence, making AthlynXAI a worldwide recognized legacy brand. This final phase solidifies AthlynXAI's position as a dominant force in sports, wellness, and lifestyle across international markets, impacting lives globally and inspiring future generations.",
      keyFeatures: [
        { icon: <Trophy className="h-4 w-4 mr-2" />, text: "International Market Expansion & Localization: Adapting the platform and services to diverse cultural and linguistic contexts, ensuring global relevance and seamless user experience." },
        { icon: <Flag className="h-4 w-4 mr-2" />, text: "Global Athlete & Brand Partnerships: Forging strategic alliances with international sports organizations, athletes, and lifestyle brands to expand reach and influence on a massive scale." },
        { icon: <Monitor className="h-4 w-4 mr-2" />, text: "Multi-language Platform Support: Ensuring accessibility and usability for a global user base through comprehensive multi-language support and localized content, breaking down communication barriers." },
        { icon: <Award className="h-4 w-4 mr-2" />, text: "Establishing AthlynX as a Worldwide Legacy Brand: Cementing its reputation as a leader in innovation, empowerment, and positive global impact, recognized across continents." },
        { icon: <Zap className="h-4 w-4 mr-2" />, text: "Global Infrastructure Development: Building robust and scalable systems to support worldwide operations, ensuring seamless performance, reliability, and data security across all regions." },
        { icon: <Users className="h-4 w-4 mr-2" />, text: "Cross-Cultural Community Engagement: Fostering a global community that transcends borders, united by the 'Be The Legacy' philosophy and shared aspirations." },
        { icon: <Handshake className="h-4 w-4 mr-2" />, text: "International Philanthropic Initiatives: Launching global programs to support youth development, education, and wellness in underserved communities worldwide." },
      ],
      revenue: "Projected: $500M+ (Global Market Dominance & Sustained Growth)",
    },
  ];

  return (
    <RouteErrorBoundary>
      <DashboardLayout>
        <div className="min-h-screen bg-[#050c1a] text-white">
          <MobileBottomNav />

          {/* Hero Section: Visually striking introduction to the brand expansion vision */}
          <section className="relative overflow-hidden py-20 md:py-32 bg-gradient-to-r from-[#1E90FF] to-[#4169E1] text-white shadow-lg">
            {/* Subtle stadium-lights effect background for a futuristic feel */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB2aWV3Qm94PSIwIDAgMTIwMCAxMjAwIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxwYXRoIGZpbGw9IiNmZmZmZmYiIGQ9Ik0wIDBoMTIwMHYxMjAwSDBWMHoiLz48cGF0aCBmaWxsPSIjMDAwMDAwIiBvcGFjaXR5PSIwLjA1IiBkPSJNMCAwYzEyNS4zMyAwIDI1MC42NyAwIDM3NiAwczI1MC42NyAwIDM3NiAwIDM3NiAwIDM3NiAwVjEyMDBjLTEyNS4zMyAwLTI1MC42NyAwLTM3NiAwcy0yNTAuNjcgMC0zNzYgMC0zNzYgMC0zNzYgMFYwWiIvPjxwYXRoIGZpbGw9IiMwMDAwMDAiIG9wYWNpdHk9IjAuMDMiIGQ9Ik0wIDBjMTI1LjMzIDAgMjUwLjY3IDAgMzc2IDBzMjUwLjY3IDAgMzc2IDAgMzc2IDAgMzc2IDBWMTIwMGMtMTI1LjMzIDAtMjUwLjY3IDAtMzc2IDBzLTI1MC42NyAwLTM3NiAwLTM3NiAwLTM3NiAwVjBaIi8+PC9zdmc=')] bg-repeat [mask-image:radial-gradient(ellipse_at_center,white,transparent_70%)]"></div>
            </div>
            <div className="container mx-auto px-6 text-center relative z-10">
              <h1 className="text-5xl md:text-7xl font-black text-white leading-tight mb-4 animate-fade-in-down">
                We Started in Sports.
                <br />
                We Are Going Everywhere.
              </h1>
              <p className="text-xl md:text-2xl text-blue-100 mb-8 animate-fade-in-up">
                <span className="font-bold text-blue-300">Be The Legacy.™</span> AthlynXAI
              </p>
              <div className="flex justify-center space-x-6 animate-fade-in-up">
                <Rocket className="h-12 w-12 md:h-16 md:w-16 text-white" />
                <TrendingUp className="h-12 w-12 md:h-16 md:w-16 text-white" />
              </div>
            </div>
          </section>

          {/* Phase Timeline Section: Visual representation of the roadmap */}
          <section className="py-16 md:py-24">
            <div className="container mx-auto px-6">
              <h2 className="text-4xl font-black text-white text-center mb-12">
                Our Brand Expansion Roadmap
              </h2>
              <div className="relative wrap overflow-hidden p-10 h-full">
                {/* Vertical line for the timeline */}
                <div
                  className="border-2-2 absolute border-opacity-20 border-blue-700/50 h-full border"
                  style={{ left: "50%" }}
                ></div>
                <div ref={timelineRef} className="timeline-container">
                  {phases.map((phase, index) => (
                    <div
                      key={phase.year}
                      className={`mb-8 flex justify-between items-center w-full ${
                        index % 2 === 0 ? "flex-row-reverse left-timeline" : "right-timeline"
                      }`}
                    >
                      <div className="order-1 w-5/12"></div>
                      {/* Timeline icon circle */}
                      <div className="z-20 flex items-center order-1 bg-[#1E90FF] shadow-xl w-12 h-12 rounded-full justify-center">
                        {phase.icon}
                      </div>
                      {/* Timeline content card */}
                      <div className="order-1 bg-[#0d1a3a] rounded-lg shadow-xl w-5/12 px-6 py-4 border border-blue-700/50 transform transition duration-500 hover:scale-105">
                        <p className="mb-2 text-sm font-bold text-blue-300">{phase.year}</p>
                        <h3 className="mb-3 font-black text-white text-xl">
                          {phase.title}
                        </h3>
                        {/* Status badge with icon */}
                        <div
                          className={`inline-block px-3 py-1 text-sm font-semibold rounded-full ${
                            phase.status === "Current"
                              ? "bg-green-500 text-white" // Current status badge
                              : "bg-blue-500 text-white" // Upcoming/Future status badge
                          }`}
                        >
                          {phase.status === "Current" && <CheckCircle className="inline-block h-4 w-4 mr-1" />}
                          {phase.status === "Upcoming" && <Clock className="inline-block h-4 w-4 mr-1" />}
                          {phase.status === "Future" && <Calendar className="inline-block h-4 w-4 mr-1" />}
                          {phase.status}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Phase Details Section: In-depth look at each phase's offerings */}
          <section className="py-16 md:py-24 bg-[#0d1a3a]">
            <div className="container mx-auto px-6">
              <h2 className="text-4xl font-black text-white text-center mb-12">
                Deep Dive into Each Phase
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {phases.map((phase) => (
                  <div
                    key={phase.title}
                    className="bg-[#050c1a] p-8 rounded-lg shadow-xl border border-blue-700/50 transform transition duration-500 hover:scale-105"
                  >
                    <h3 className="text-2xl font-black text-white mb-4 flex items-center">
                      {phase.icon}
                      <span className="ml-3">{phase.title}</span>
                    </h3>
                    <p className="text-lg font-bold text-blue-300 mb-4">{phase.year} - {phase.status}</p>
                    <p className="text-gray-300 mb-4 leading-relaxed">{phase.description}</p>
                    <h4 className="text-xl font-bold text-[#1E90FF] mb-3">Key Features:</h4>
                    <ul className="list-none text-gray-300 space-y-2">
                      {phase.keyFeatures.map((feature, i) => (
                        <li key={i} className="flex items-start">
                          {feature.icon}
                          <span className="ml-2">{feature.text}</span>
                        </li>
                      ))}
                    </ul>
                    <p className="mt-6 text-xl font-bold text-[#1E90FF] flex items-center">
                      <DollarSign className="h-5 w-5 mr-2" />
                      {phase.revenue}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Black Sheep Philosophy Card: Highlighting the unique brand ethos */}
          <section className="py-16 md:py-24">
            <div className="container mx-auto px-6 text-center">
              <div className="bg-[#0d1a3a] p-10 rounded-lg shadow-xl border border-blue-700/50 max-w-2xl mx-auto transform transition duration-500 hover:scale-105">
                <Trophy className="h-16 w-16 text-[#1E90FF] mx-auto mb-6" />
                <h2 className="text-3xl font-black text-white mb-4">
                  Black Sheep Philosophy
                </h2>
                <blockquote className="text-xl italic text-gray-300 leading-relaxed mb-6">
                  "I go my own way. No one has done this before."
                </blockquote>
                <p className="text-lg font-bold text-blue-300">
                  — Chad Dozier Sr.
                </p>
              </div>
            </div>
          </section>

          {/* Footer Section: Copyright and tagline */}
          <footer className="bg-[#0d1a3a] py-8 border-t border-blue-700/50">
            <div className="container mx-auto px-6 text-center text-gray-400 text-sm">
              <p>
                Copyright © 2026 Chad A. Dozier Sr. / AthlynXAI. All rights reserved. Be The Legacy.™
              </p>
            </div>
          </footer>
        </div>
      </DashboardLayout>
    </RouteErrorBoundary>
  );
}

// Tailwind CSS for custom animations (add these to your global CSS file or a style block if using Next.js/styled-jsx)
// These animations provide a subtle entrance effect for elements as they appear on screen.
// @keyframes fadeInDown {
//   from { opacity: 0; transform: translateY(-20px); }
//   to { opacity: 1; transform: translateY(0); }
// }
// .animate-fade-in-down { animation: fadeInDown 0.8s ease-out forwards; }

// @keyframes fadeInUp {
//   from { opacity: 0; transform: translateY(20px); }
//   to { opacity: 1; transform: translateY(0); }
// }
// .animate-fade-in-up { animation: fadeInUp 0.8s ease-out forwards; }

// Basic styles for vertical timeline (these can be added to your global CSS file or a style block)
// These styles ensure the timeline layout is correct and responsive.
/*
.timeline-container {
  position: relative;
  margin: 0 auto;
  padding: 20px 0;
}

.timeline-container::after {
  content: '';
  position: absolute;
  width: 2px;
  background-color: rgba(59, 130, 246, 0.5); // Equivalent to blue-700/50
  top: 0;
  bottom: 0;
  left: 50%;
  margin-left: -1px;
}

.right-timeline {
  left: 50%;
}

.left-timeline {
  left: 0;
}

.right-timeline .order-1 {
  order: 1;
}

.left-timeline .order-1 {
  order: 1;
}

.right-timeline .order-1:first-child {
  order: 0;
}

.left-timeline .order-1:first-child {
  order: 0;
}

@media (max-width: 768px) {
  .timeline-container::after {
    left: 20px;
  }
  .right-timeline,
  .left-timeline {
    transform: translateX(0);
    margin-bottom: 20px;
    left: 0;
  }
  .right-timeline .order-1,
  .left-timeline .order-1 {
    width: calc(100% - 70px);
    margin-left: 70px;
  }
  .right-timeline .order-1:first-child,
  .left-timeline .order-1:first-child {
    order: 1;
  }
  .z-20 {
    left: 10px;
  }
}
*/
