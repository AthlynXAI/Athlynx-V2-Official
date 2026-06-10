import { RouteErrorBoundary } from "@/components/GlobalErrorBoundary";
import React from "react";
import DashboardLayout from "@/components/DashboardLayout";
import {
  ShieldCheck,
  Lightbulb,
  TrendingUp,
  Users,
  Handshake,
  Award,
  Target,
  Brain,
  Rocket,
  DollarSign,
  BarChart2,
  Zap,
  FileText,
  Search,
  HeartPulse,
  Trophy,
  Star,
  Fingerprint,
  Globe,
  BookOpen,
  Code,
  Gem,
  CalendarCheck,
  Briefcase,
  ChartLine,
  Megaphone,
  Sparkles,
  Feather,
  Palette,
  Monitor,
  Cpu,
  Network,
  Wallet,
  Lock,
  Key,
  Layers,
  Cloud,
  Database,
  Activity,
  Bell,
  MessageSquare,
  Settings,
  UserPlus,
  UserCheck,
  UserX,
  UserMinus,
  UserRound,
  UserCircle,
  UserCog,
  UserSquare,
  User,
} from "lucide-react";
import MobileBottomNav from "@/components/MobileBottomNav";

const AthleteRightsOS: React.FC = () => {
  const founderVision = `
    "At AthlynX, we envision a future where every athlete, regardless of their background or current stage, has the opportunity to unlock their full potential and build a lasting legacy. We are not just a platform; we are a dedicated teammate, providing the tools, insights, and support needed to navigate the complex world of professional sports. Our commitment is to fairness, equity, and empowering athletes to own their journey, from the earliest spark of talent to the pinnacle of their careers and beyond. We believe in the Black Sheep philosophy: to forge your own path, challenge the status quo, and ultimately, Be The Legacy." - Chad A. Dozier Sr.
  `;

  return (
    <RouteErrorBoundary>
      <DashboardLayout>
        <div className="min-h-screen bg-[#050c1a] text-gray-100 font-sans relative pb-20">
          {/* Hero Section */}
          <section className="relative h-screen flex items-center justify-center text-center px-4 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-[#0d1a3a] to-[#050c1a] opacity-90"></div>
            <div className="relative z-10 max-w-5xl mx-auto">
              <h1 className="text-6xl font-extrabold text-white mb-6 leading-tight drop-shadow-lg">
                AthlynX Athlete Rights & Discovery OS
              </h1>
              <p className="text-2xl text-cyan-300 mb-8 font-light">
                Empowering the next generation of athletic legends, from birth to pro, with unparalleled rights and opportunities.
              </p>
              <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6">
                <button className="bg-[#1E90FF] hover:bg-blue-700 text-white font-bold py-3 px-10 rounded-full transition duration-300 ease-in-out transform hover:scale-105 shadow-lg">
                  Discover Your Path
                </button>
                <button className="border border-cyan-500 text-cyan-300 hover:bg-cyan-900 font-bold py-3 px-10 rounded-full transition duration-300 ease-in-out transform hover:scale-105 shadow-lg">
                  Explore Our Ecosystem
                </button>
              </div>
            </div>
            {/* Stadium Lights Effect */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-[#1E90FF] rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-pulse"></div>
              <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-[#00FFFF] rounded-full mix-blend-screen filter blur-3xl opacity-15 animate-pulse delay-200"></div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-white rounded-full mix-blend-screen filter blur-3xl opacity-5 animate-pulse delay-400"></div>
            </div>
          </section>

          {/* Founder's Vision */}
          <section className="py-20 px-4 md:px-8 lg:px-16 bg-[#0d1a3a] shadow-2xl">
            <div className="max-w-6xl mx-auto text-center">
              <h2 className="text-5xl font-bold text-white mb-10">Founder's Vision</h2>
              <blockquote className="text-2xl italic text-gray-300 leading-relaxed border-l-4 border-[#1E90FF] pl-8 mx-auto max-w-4xl">
                <p>{founderVision}</p>
              </blockquote>
              <p className="mt-10 text-xl text-cyan-400 font-medium">— Chad A. Dozier Sr., Founder & CEO of AthlynXAI</p>
            </div>
          </section>

          {/* Core Principles Section */}
          <section className="py-20 px-4 md:px-8 lg:px-16">
            <div className="max-w-7xl mx-auto">
              <h2 className="text-5xl font-bold text-white text-center mb-16">Our Foundational Pillars</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                <div className="bg-[#0d1a3a] p-10 rounded-xl shadow-xl border border-gray-700 hover:border-[#1E90FF] transition duration-300 transform hover:-translate-y-2">
                  <ShieldCheck className="text-[#1E90FF] mb-6 mx-auto" size={56} />
                  <h3 className="text-3xl font-semibold text-white mb-4 text-center">Athlete Rights & Ownership</h3>
                  <p className="text-lg text-gray-300 leading-relaxed text-center">Inspired by the Jordan-Nike model, we ensure athletes retain significant control and equity over their personal brand, data, and future earnings from an early age. This includes robust IP protection and transparent revenue sharing, fostering true athlete empowerment.</p>
                </div>
                <div className="bg-[#0d1a3a] p-10 rounded-xl shadow-xl border border-gray-700 hover:border-[#1E90FF] transition duration-300 transform hover:-translate-y-2">
                  <Lightbulb className="text-[#00FFFF] mb-6 mx-auto" size={56} />
                  <h3 className="text-3xl font-semibold text-white mb-4 text-center">Early Discovery & Nurturing</h3>
                  <p className="text-lg text-gray-300 leading-relaxed text-center">Our advanced AI systems identify nascent talent from birth, tracking developmental milestones and providing personalized guidance. We nurture potential through tailored programs, expert mentorship, and access to world-class facilities, ensuring a holistic growth path.</p>
                </div>
                <div className="bg-[#0d1a3a] p-10 rounded-xl shadow-xl border border-gray-700 hover:border-[#1E90FF] transition duration-300 transform hover:-translate-y-2">
                  <Trophy className="text-[#1E90FF] mb-6 mx-auto" size={56} />
                  <h3 className="text-3xl font-semibold text-white mb-4 text-center">Waiver & Consent System</h3>
                  <p className="text-lg text-gray-300 leading-relaxed text-center">A transparent, blockchain-secured framework for athletes and guardians to grant and manage consent for data utilization. This ensures privacy, compliance with global regulations, and athlete control over their biometric and performance data at all times, putting them in the driver's seat.</p>
                </div>
                <div className="bg-[#0d1a3a] p-10 rounded-xl shadow-xl border border-gray-700 hover:border-[#1E90FF] transition duration-300 transform hover:-translate-y-2">
                  <Brain className="text-[#00FFFF] mb-6 mx-auto" size={56} />
                  <h3 className="text-3xl font-semibold text-white mb-4 text-center">Talent Discovery Pipeline</h3>
                  <p className="text-lg text-gray-300 leading-relaxed text-center">Leveraging cutting-edge mental and physical analytics, we create a holistic, evolving profile for each athlete. This pipeline identifies strengths, weaknesses, and growth opportunities, guiding development from amateur to elite through personalized training regimens and strategic interventions.</p>
                </div>
                <div className="bg-[#0d1a3a] p-10 rounded-xl shadow-xl border border-gray-700 hover:border-[#1E90FF] transition duration-300 transform hover:-translate-y-2">
                  <Users className="text-[#1E90FF] mb-6 mx-auto" size={56} />
                  <h3 className="text-3xl font-semibold text-white mb-4 text-center">The AthlynX Roster</h3>
                  <p className="text-lg text-gray-300 leading-relaxed text-center">Our founder's first team, a curated group of athletes who embody the AthlynX spirit. They receive unparalleled support, resources, and a direct pathway to professional success, serving as pioneers of our ecosystem and inspiring others through their journey.</p>
                </div>
                <div className="bg-[#0d1a3a] p-10 rounded-xl shadow-xl border border-gray-700 hover:border-[#1E90FF] transition duration-300 transform hover:-translate-y-2">
                  <TrendingUp className="text-[#00FFFF] mb-6 mx-auto" size={56} />
                  <h3 className="text-3xl font-semibold text-white mb-4 text-center">Statistical Signing Model</h3>
                  <p className="text-lg text-gray-300 leading-relaxed text-center">Our proprietary AI-driven model analyzes vast datasets to predict an athlete's future potential and market value. This informs strategic decisions on when to sign, invest, or walk away, optimizing outcomes for both athlete and platform with precision and foresight.</p>
                </div>
              </div>
            </div>
          </section>

          {/* Athlete Data Waiver/Consent System Deep Dive */}
          <section className="py-20 px-4 md:px-8 lg:px-16 bg-[#0d1a3a] shadow-2xl">
            <div className="max-w-7xl mx-auto">
              <h2 className="text-5xl font-bold text-white text-center mb-16">Athlete Data: Your Rights, Your Control</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div className="space-y-8">
                  <p className="text-xl text-gray-300 leading-relaxed">
                    At AthlynX, we believe your data is your property. Our advanced waiver and consent system is built on principles of transparency, security, and athlete empowerment. We leverage cutting-edge blockchain technology to ensure every data point collected, from biometric markers to performance statistics, is handled with the utmost integrity and respect for your privacy.
                  </p>
                  <p className="text-xl text-gray-300 leading-relaxed">
                    You have granular control over what data is shared, with whom, and for what purpose. Our system provides a clear, immutable record of all consent actions, giving you peace of mind and unparalleled authority over your digital athletic identity. This ensures that your personal and performance data is always working for you, under your explicit direction.
                  </p>
                  <ul className="list-disc list-inside text-xl text-cyan-300 space-y-4 pl-6">
                    <li><FileText className="inline-block mr-3" size={24} /> <span className="font-semibold">Transparent Consent:</span> Clearly understand how your data is used, with plain language explanations and easy-to-manage settings.</li>
                    <li><ShieldCheck className="inline-block mr-3" size={24} /> <span className="font-semibold">Blockchain Security:</span> Immutable records protect your data integrity, preventing unauthorized alterations and ensuring verifiable consent trails.</li>
                    <li><Trophy className="inline-block mr-3" size={24} /> <span className="font-semibold">Biometric Data Protection:</span> Strict protocols and encryption for sensitive information like DNA, physiological markers, and health records, ensuring maximum security.</li>
                    <li><Search className="inline-block mr-3" size={24} /> <span className="font-semibold">Granular Control:</span> Manage permissions for specific data types and entities, allowing you to tailor your data sharing preferences to your exact needs.</li>
                    <li><Lock className="inline-block mr-3" size={24} /> <span className="font-semibold">Revocable Access:</span> Easily revoke access to your data at any time, maintaining full control over your digital footprint.</li>
                    <li><Key className="inline-block mr-3" size={24} /> <span className="font-semibold">Personal Data Vault:</span> A secure, encrypted vault where all your athletic data is stored, accessible only by you and those you authorize.</li>
                  </ul>
                </div>
                <div className="bg-[#050c1a] p-10 rounded-xl shadow-xl border border-gray-700">
                  <h3 className="text-3xl font-semibold text-white mb-6 text-center">How Your Data Empowers You</h3>
                  <div className="space-y-6 text-gray-300 text-lg">
                    <p><Star className="inline-block mr-3 text-[#00FFFF]" size={20} /> Your anonymized data contributes to global athletic research, advancing sports science for everyone and pushing the boundaries of human performance.</p>
                    <p><Trophy className="inline-block mr-3 text-[#1E90FF]" size={20} /> Data-driven insights help us tailor personalized training and development plans, accelerating your progress and optimizing your path to peak performance.</p>
                    <p><DollarSign className="inline-block mr-3 text-[#00FFFF]" size={20} /> Participate in data monetization programs, where you share in the value generated from the ethical and secure use of your information, creating new revenue streams.</p>
                    <p><HeartPulse className="inline-block mr-3 text-[#1E90FF]" size={20} /> Secure health and performance data helps prevent injuries, optimize recovery protocols, and ensure your long-term well-being and career longevity.</p>
                    <p><Globe className="inline-block mr-3 text-[#00FFFF]" size={20} /> Your data helps benchmark global talent, providing you with a clear understanding of where you stand and what it takes to reach the top.</p>
                    <p><BookOpen className="inline-block mr-3 text-[#1E90FF]" size={20} /> Access to aggregated insights from top athletes, offering a unique learning opportunity from the best in the world.</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Talent Discovery Pipeline Deep Dive */}
          <section className="py-20 px-4 md:px-8 lg:px-16">
            <div className="max-w-7xl mx-auto">
              <h2 className="text-5xl font-bold text-white text-center mb-16">The AthlynX Talent Discovery Pipeline</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div className="bg-[#0d1a3a] p-10 rounded-xl shadow-xl border border-gray-700">
                  <h3 className="text-3xl font-semibold text-white mb-6 text-center">From Potential to Pro: Our Journey with You</h3>
                  <ol className="list-decimal list-inside text-gray-300 space-y-6 text-lg pl-6">
                    <li><span className="font-semibold text-[#1E90FF]">Early Identification (Birth-10):</span> Utilizing advanced predictive analytics, genetic profiling, and developmental psychology, we identify early indicators of athletic aptitude, cognitive strengths, and potential for specific sports.</li>
                    <li><span className="font-semibold text-[#00FFFF]">Foundational Development (10-16):</span> Personalized training programs, fundamental skill development, and mental resilience coaching. Introduction to data tracking, performance analytics, and sports nutrition basics.</li>
                    <li><span className="font-semibold text-[#1E90FF]">Advanced Specialization (16-20):</span> Intensive sport-specific training, advanced biomechanical analysis, sophisticated nutritional guidance, and strategic career planning. Focus on competitive exposure and performance optimization.</li>
                    <li><span className="font-semibold text-[#00FFFF]">Pre-Professional Integration (20-22):</span> Exposure to professional environments, agent negotiation support, comprehensive brand building, media training, and advanced financial literacy education.</li>
                    <li><span className="font-semibold text-[#1E90FF]">Professional Launch & Management (22+):</span> Ongoing performance optimization, contract management, endorsement deals, legacy planning, and post-career transition support, ensuring long-term success and well-being.</li>
                  </ol>
                </div>
                <div className="space-y-8">
                  <p className="text-xl text-gray-300 leading-relaxed">
                    Our Talent Discovery Pipeline is a sophisticated, multi-stage process designed to identify, cultivate, and propel athletes to their highest potential. It's not just about physical prowess; we integrate mental fortitude, strategic thinking, and emotional intelligence into every assessment, ensuring a truly holistic development approach.
                  </p>
                  <p className="text-xl text-gray-300 leading-relaxed">
                    We combine state-of-the-art AI analytics with human expertise, ensuring a holistic approach to athlete development. Our global network of scouts, data scientists, and coaches work in tandem to uncover hidden gems and provide them with the resources to shine on the global stage, maximizing their inherent capabilities.
                  </p>
                  <ul className="list-disc list-inside text-xl text-cyan-300 space-y-4 pl-6">
                    <li><Trophy className="inline-block mr-3" size={24} /> <span className="font-semibold">Mental Analytics:</span> Cognitive profiling, stress management, resilience training, and psychological support to build a champion's mindset.</li>
                    <li><HeartPulse className="inline-block mr-3" size={24} /> <span className="font-semibold">Physical Analytics:</span> Biomechanical analysis, physiological monitoring, injury prevention strategies, and recovery optimization for peak physical condition.</li>
                    <li><Rocket className="inline-block mr-3" size={24} /> <span className="font-semibold">Personalized Development:</span> Tailored plans adapting to individual needs, progress, and evolving goals, ensuring a dynamic and effective training regimen.</li>
                    <li><Trophy className="inline-block mr-3" size={24} /> <span className="font-semibold">Global Network:</span> Access to top coaches, facilities, sports scientists, and professional opportunities worldwide, opening doors to unparalleled exposure.</li>
                    <li><ChartLine className="inline-block mr-3" size={24} /> <span className="font-semibold">Performance Benchmarking:</span> Compare your progress against global elite standards, identifying areas for improvement and celebrating milestones.</li>
                    <li><Cpu className="inline-block mr-3" size={24} /> <span className="font-semibold">AI-Driven Insights:</span> Leverage predictive analytics to anticipate future performance trends and proactively adjust training strategies.</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Athlete Equity and Ownership Model */}
          <section className="py-20 px-4 md:px-8 lg:px-16 bg-[#0d1a3a] shadow-2xl">
            <div className="max-w-7xl mx-auto">
              <h2 className="text-5xl font-bold text-white text-center mb-16">Athlete Equity & Ownership Model</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <div className="text-gray-300 space-y-8">
                  <p className="text-xl leading-relaxed">
                    AthlynX redefines the athlete-platform relationship by offering a groundbreaking equity and ownership model. Unlike traditional systems where athletes are merely participants, our athletes are not just beneficiaries; they are integral stakeholders in the AthlynX ecosystem. This model ensures that as AthlynX grows and succeeds, so does the financial well-being and long-term security of the athletes who power our platform, creating a symbiotic relationship.
                  </p>
                  <p className="text-xl leading-relaxed">
                    Through innovative mechanisms like performance-based incentives, data monetization shares, and direct equity stakes, athletes gain unprecedented control and financial upside. This aligns our interests perfectly: when our athletes succeed, both on and off the field, we all succeed together, fostering a true partnership built on mutual growth, transparency, and respect for their invaluable contributions.
                  </p>
                  <ul className="list-disc list-inside text-xl text-cyan-300 space-y-4 pl-6">
                    <li><DollarSign className="inline-block mr-3" size={24} /> <span className="font-semibold">Performance-based Incentives:</span> Direct financial rewards tied to athletic achievements, milestones, and positive impact, ensuring their hard work is tangibly recognized.</li>
                    <li><BarChart2 className="inline-block mr-3" size={24} /> <span className="font-semibold">Data Monetization Shares:</span> A significant percentage of revenue generated from the ethical and secure use of anonymized athlete data, providing a continuous income stream.</li>
                    <li><Rocket className="inline-block mr-3" size={24} /> <span className="font-semibold">Direct Equity Stakes in AthlynX:</span> Real ownership in the company, growing with our collective success and providing long-term capital appreciation.</li>
                    <li><Handshake className="inline-block mr-3" size={24} /> <span className="font-semibold">Long-Term Wealth Creation:</span> Strategies designed to build enduring financial stability beyond their playing careers, including investment opportunities and financial literacy programs.</li>
                    <li><Wallet className="inline-block mr-3" size={24} /> <span className="font-semibold">Transparent Financial Reporting:</span> Full visibility into how their contributions translate into financial returns and equity growth.</li>
                    <li><Gem className="inline-block mr-3" size={24} /> <span className="font-semibold">Brand Value Enhancement:</span> Support in building and monetizing their personal brand, creating additional revenue streams and long-term value.</li>
                  </ul>
                </div>
                <div className="bg-[#050c1a] p-10 rounded-xl shadow-xl border border-gray-700">
                  <h3 className="text-3xl font-semibold text-white mb-6 text-center">Our Partnership Framework</h3>
                  <ol className="list-decimal list-inside text-gray-300 space-y-6 text-lg pl-6">
                    <li><span className="font-semibold text-[#1E90FF]">Early Stage Investment:</span> AthlynX proactively invests in promising athletes from a young age, providing comprehensive resources, coaching, and developmental support, laying the foundation for future success.</li>
                    <li><span className="font-semibold text-[#00FFFF]">Data Contribution & Value Creation:</span> Athletes contribute anonymized performance and biometric data, which fuels our AI, enhances our ecosystem, and creates shared value for all stakeholders.</li>
                    <li><span className="font-semibold text-[#1E90FF]">Equity & Incentive Allocation:</span> Based on agreed-upon milestones, contributions, and performance metrics, athletes receive equity or profit-sharing units, aligning their success with ours and ensuring fair compensation.</li>
                    <li><span className="font-semibold text-[#00FFFF]">Continuous Growth & Legacy:</span> A continuous cycle of support, growth, and shared success throughout their active career and extending into post-career legacy building and financial management, ensuring a lasting impact.</li>
                    <li><span className="font-semibold text-[#1E90FF]">Exit Opportunities:</span> Clear pathways for liquidity events for equity holders, ensuring athletes can realize the value of their ownership.</li>
                    <li><span className="font-semibold text-[#00FFFF]">Advisory Roles:</span> Opportunities for retired athletes to transition into advisory or mentorship roles within AthlynX, continuing their contribution to the ecosystem.</li>
                  </ol>
                </div>
              </div>
            </div>
          </section>

          {/* Be The Legacy Manifesto */}
          <section className="py-20 px-4 md:px-8 lg:px-16">
            <div className="max-w-7xl mx-auto text-center">
              <h2 className="text-5xl font-bold text-white mb-10">Be The Legacy Manifesto</h2>
              <p className="text-2xl text-gray-300 leading-relaxed mb-8">
                More than just a slogan, "Be The Legacy" is our guiding philosophy—a call to action for every athlete who dares to dream bigger. It embodies the spirit of innovation, unwavering resilience, and the relentless pursuit of greatness that defines the AthlynX ethos. We empower athletes to transcend conventional boundaries, challenge established norms, and leave an indelible mark on the world, not just through their athletic achievements, but through their character, impact, and enduring influence on society.
              </p>
              <p className="text-xl text-cyan-400 font-medium">
                It's about owning your narrative, defining your success on your own terms, and inspiring generations to come. It's about the courage to be a pioneer, to break barriers, and to set new standards for excellence and positive impact in every facet of life. This manifesto is a living document, evolving with the aspirations of our athletes.
              </p>
              <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-10">
                <div className="p-8 bg-[#0d1a3a] rounded-xl shadow-xl border border-gray-700 transform hover:-translate-y-2 transition duration-300">
                  <Target className="text-[#1E90FF] mb-5 mx-auto" size={48} />
                  <h3 className="text-2xl font-semibold text-white mb-3">Define Your Purpose</h3>
                  <p className="text-lg text-gray-400 leading-relaxed">Understand your unique strengths, passions, and aspirations. We provide the tools and mentorship to help you chart a course that aligns with your deepest values and long-term vision, ensuring every step is purposeful.</p>
                </div>
                <div className="p-8 bg-[#0d1a3a] rounded-xl shadow-xl border border-gray-700 transform hover:-translate-y-2 transition duration-300">
                  <Zap className="text-[#00FFFF] mb-5 mx-auto" size={48} />
                  <h3 className="text-2xl font-semibold text-white mb-3">Ignite Your Potential</h3>
                  <p className="text-lg text-gray-400 leading-relaxed">Access unparalleled resources, cutting-edge training methodologies, and world-class mentorship to hone your skills, maximize your performance, and unlock capabilities you never knew you had, both on and off the field, pushing beyond perceived limits.</p>
                </div>
                <div className="p-8 bg-[#0d1a3a] rounded-xl shadow-xl border border-gray-700 transform hover:-translate-y-2 transition duration-300">
                  <Award className="text-[#1E90FF] mb-5 mx-auto" size={48} />
                  <h3 className="text-2xl font-semibold text-white mb-3">Leave Your Mark</h3>
                  <p className="text-lg text-gray-400 leading-relaxed">Inspire future generations through your achievements, character, and unwavering commitment to excellence. Your journey becomes a powerful blueprint for others to follow, creating a ripple effect of positive change and lasting impact.</p>
                </div>
              </div>
            </div>
          </section>

          {/* Teammate from Day One */}
          <section className="py-20 px-4 md:px-8 lg:px-16 bg-[#0d1a3a] shadow-2xl">
            <div className="max-w-7xl mx-auto text-center">
              <h2 className="text-5xl font-bold text-white mb-10">Your Teammate from Day One</h2>
              <div className="flex flex-col md:flex-row items-center justify-center space-y-10 md:space-y-0 md:space-x-16">
                <div className="md:w-1/2 space-y-6">
                  <Handshake className="text-[#1E90FF] mb-4 mx-auto" size={72} />
                  <p className="text-xl text-gray-300 leading-relaxed">
                    AthlynX isn't just a platform; we are an extension of your team, a dedicated partner invested in your success from the very beginning. From the moment you join us, we provide unwavering support, cutting-edge analytics, and strategic guidance to help you navigate every stage of your athletic journey. We are committed to your holistic development, ensuring you thrive physically, mentally, and financially, both during and after your career.
                  </p>
                  <p className="text-xl text-gray-300 leading-relaxed">
                    Our partnership extends beyond performance metrics. We offer mentorship, educational resources, and a robust support network to address every aspect of an athlete's life, fostering resilience, well-being, and sustained excellence. This includes access to sports psychologists, nutritionists, and career counselors.
                  </p>
                </div>
                <div className="md:w-1/2 space-y-6">
                  <Award className="text-[#00FFFF] mb-4 mx-auto" size={72} />
                  <p className="text-xl text-gray-300 leading-relaxed">
                    We celebrate your victories, learn from your challenges, and continuously innovate to ensure you have every conceivable advantage in achieving your dreams. Your success is our shared mission, and we stand by you through every triumph and tribulation, fostering a true partnership built on trust, transparency, and a mutual pursuit of greatness.
                  </p>
                  <p className="text-xl text-gray-300 leading-relaxed">
                    This commitment means providing access to top-tier legal, financial, and branding experts, ensuring your career is managed with foresight and integrity, maximizing your potential on and off the field. We help you build a sustainable future.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* The Black Sheep Philosophy */}
          <section className="py-20 px-4 md:px-8 lg:px-16">
            <div className="max-w-7xl mx-auto text-center">
              <h2 className="text-5xl font-bold text-white mb-10">The Black Sheep Philosophy</h2>
              <p className="text-2xl text-gray-300 leading-relaxed mb-8">
                In a world that often encourages conformity and adherence to established paths, the Black Sheep chooses their own way. It's about daring to be different, to innovate fearlessly, and to redefine what's truly possible in the realm of athletic achievement and personal legacy. AthlynX champions this spirit, providing the platform and ecosystem for those exceptional individuals who refuse to be ordinary and seek to carve out their unique, extraordinary destiny.
              </p>
              <p className="text-xl text-cyan-400 font-medium">
                Go your own way. Challenge the status quo. Be the pioneer. Embrace your individuality, let it fuel your extraordinary journey, and inspire a new paradigm of success. We are here for the trailblazers, the innovators, and those who dare to disrupt the conventional narrative of athletic careers.
              </p>
              <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="p-8 bg-[#0d1a3a] rounded-xl shadow-xl border border-gray-700 transform hover:-translate-y-2 transition duration-300">
                  <Trophy className="text-[#1E90FF] mb-5 mx-auto" size={48} />
                  <h3 className="text-2xl font-semibold text-white mb-3">Unleash Your Uniqueness</h3>
                  <p className="text-lg text-gray-400 leading-relaxed">We believe true greatness stems from embracing what makes you different. Our platform helps you identify and amplify your unique strengths, talents, and personality, transforming them into competitive advantages.</p>
                </div>
                <div className="p-8 bg-[#0d1a3a] rounded-xl shadow-xl border border-gray-700 transform hover:-translate-y-2 transition duration-300">
                  <Zap className="text-[#00FFFF] mb-5 mx-auto" size={48} />
                  <h3 className="text-2xl font-semibold text-white mb-3">Disrupt the Norm</h3>
                  <p className="text-lg text-gray-400 leading-relaxed">Don't just play the game; change it. We provide the tools, mindset, and support to challenge conventions, innovate within your sport, and forge new, unprecedented paths to success and influence.</p>
                </div>
              </div>
            </div>
          </section>

          {/* Call to Action Section */}
          <section className="py-20 px-4 md:px-8 lg:px-16 bg-[#0d1a3a] shadow-2xl text-center">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-5xl font-bold text-white mb-8">Ready to Be the Next AthlynX Legend?</h2>
              <p className="text-xl text-gray-300 leading-relaxed mb-10">
                Join the AthlynX ecosystem and take control of your athletic destiny. Experience unparalleled support, cutting-edge technology, and a partnership that puts your rights and success first. Your legacy starts here.
              </p>
              <button className="bg-[#00FFFF] hover:bg-cyan-600 text-[#050c1a] font-extrabold py-4 px-12 rounded-full text-xl transition duration-300 ease-in-out transform hover:scale-105 shadow-lg">
                Join AthlynX Today
              </button>
            </div>
          </section>

          {/* Footer */}
          <footer className="py-10 px-4 md:px-8 lg:px-16 text-center text-gray-500 text-sm border-t border-gray-800">
            <p>Copyright © 2026 Chad A. Dozier Sr. / AthlynXAI. All rights reserved.</p>
            <p className="mt-2">AthlynXAI is a registered trademark. All other trademarks are the property of their respective owners.</p>
            <div className="mt-4 flex justify-center space-x-4 text-gray-600">
              <a href="#" className="hover:text-[#1E90FF] transition duration-300">Privacy Policy</a>
              <span className="text-gray-700">|</span>
              <a href="#" className="hover:text-[#1E90FF] transition duration-300">Terms of Service</a>
              <span className="text-gray-700">|</span>
              <a href="#" className="hover:text-[#1E90FF] transition duration-300">Contact Us</a>
            </div>
          </footer>
        </div>
        <MobileBottomNav />
      </DashboardLayout>
    </RouteErrorBoundary>
  );
};

export default AthleteRightsOS;