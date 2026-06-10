import React from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { RouteErrorBoundary } from '@/components/GlobalErrorBoundary';
import MobileBottomNav from '@/components/MobileBottomNav';
import {
  Award,
  GraduationCap,
  HeartHandshake,
  Home,
  Rocket,
  Trophy,
  Users,
  Briefcase,
  DollarSign,
  Brain,
  BookOpen,
  Handshake,
  Landmark,
  TrendingUp,
  ShieldCheck,
  LifeBuoy,
  Lightbulb,
  Star,
  Gift,
  Feather,
  Globe,
  Target,
  UserRoundSearch,
  School,
  Banknote,
  Building,
  Wallet,
  HandCoins,
  Activity,
  Puzzle,
  Sparkles,
  Gem,
  BarChart3,
  Clock,
  CircleDollarSign,
  User,
  CalendarDays,
  LineChart,
  MessageSquare,
  BriefcaseBusiness,
  PiggyBank,
  HeartPulse,
} from 'lucide-react';

// Interface for a single timeline item
interface TimelineItemProps {
  icon: React.ElementType;
  title: string;
  description: string;
  decisions: string[];
  accentColor: string;
}

// Reusable component for a timeline item
const TimelineItem: React.FC<TimelineItemProps> = ({ icon: Icon, title, description, decisions, accentColor }) => (
  <div className="relative pl-8 sm:pl-32 py-6 group">
    {/* Timeline dot and line */}
    <div
      className={`flex flex-col sm:flex-row items-start mb-1 group-last:before:hidden before:absolute before:left-2 sm:before:left-0 before:h-full before:px-px before:bg-slate-700 sm:before:ml-[6.5rem] before:self-start before:-translate-x-1/2 before:translate-y-3 after:absolute after:left-2 sm:after:left-0 after:w-2 after:h-2 after:bg-${accentColor} after:border-4 after:border-slate-900 after:rounded-full sm:after:ml-[6.5rem] after:-translate-x-1/2 after:translate-y-1.5`}
    ></div>
    {/* Icon and title */}
    <time className="sm:absolute left-0 translate-y-0.5 inline-flex items-center justify-center bg-slate-800 border border-slate-700 rounded-full h-20 w-20 sm:h-24 sm:w-24 text-xl font-bold text-blue-300 mb-3 sm:mb-0">
      <Icon className={`w-10 h-10 text-${accentColor}`} />
    </time>
    <div className="flex-grow">
      <h3 className="text-2xl font-bold text-white mb-1">{title}</h3>
      <p className="text-slate-400 text-lg">{description}</p>
      <div className="mt-4">
        <h4 className="text-xl font-semibold text-blue-300 mb-2">Key Decisions & Challenges:</h4>
        <ul className="list-disc list-inside text-slate-400 space-y-1">
          {decisions.map((decision, index) => (
            <li key={index} className="flex items-start">
              <span className={`inline-block w-2 h-2 rounded-full bg-${accentColor} mr-2 mt-1.5`}></span>
              {decision}
            </li>
          ))}
        </ul>
      </div>
    </div>
  </div>
);

// Main component for the Athlete Lifecycle page
const AthleteLifecycle: React.FC = () => {
  // Define the stages of an athlete's journey
  const stages = [
    {
      icon: Home,
      title: 'Youth (Ages 0-12)',
      description:
        'The foundational years, focusing on skill development, enjoyment, and early exposure to various sports. This stage often involves participation in Amateur Athletic Union (AAU) and travel teams, alongside debates around early specialization. It is crucial for building a broad athletic base and fostering a love for physical activity, laying the groundwork for future success and well-being.',
      decisions: [
        'Participation in multiple sports vs. early specialization: Balancing diverse skill development with focused training to prevent burnout and promote holistic growth.',
        'Balancing sports with academic and social development: Ensuring a well-rounded upbringing that prioritizes education and healthy social interactions alongside athletic pursuits.',
        'Choosing supportive coaching and team environments: Prioritizing positive experiences, ethical coaching, and a healthy team culture over winning at all costs.',
        'Managing parental expectations and pressure: Fostering intrinsic motivation and preventing burnout by creating a supportive, low-pressure environment.',
        'Developing fundamental movement skills and coordination: Building the physical literacy for future athletic endeavors across various sports and activities.',
        'Understanding the importance of play and unstructured activity: Encouraging creativity, problem-solving, and intrinsic joy in movement and sport.',
        'Nutritional awareness and healthy habits: Introducing basic concepts of healthy eating and hydration for optimal growth and performance.',
        'Injury prevention basics: Learning safe movement patterns and the importance of rest and recovery from a young age.',
      ],
      accentColor: 'blue-500',
    },
    {
      icon: School,
      title: 'High School (Ages 13-18)',
      description:
        'A critical period for athletic and academic growth, with increased competition and the emergence of college recruiting. Key aspects include preparing for Name, Image, and Likeness (NIL) opportunities, maintaining academic eligibility, and participating in showcase events. This stage often defines future opportunities and requires strategic planning.',
      decisions: [
        'Selecting a high school with strong athletic and academic programs: Aligning educational and athletic aspirations for a balanced and successful high school career.',
        'Navigating the college recruiting process: Understanding NCAA rules, communicating effectively with college coaches, and making informed decisions about collegiate opportunities.',
        'Understanding and preparing for NIL opportunities: Building a personal brand, understanding endorsement deals, and managing them responsibly within current regulations.',
        'Balancing athletic demands with academic performance: Maintaining a strong GPA and achieving competitive standardized test scores for college eligibility and scholarships.',
        'Participating in national showcase events and camps: Gaining exposure to college scouts and recruiters, and competing against top talent to assess skill level.',
        'Developing leadership skills and teamwork: Growing as an individual and a team player, contributing positively to team dynamics and success.',
        'Managing social media presence: Curating a positive and professional online image for future opportunities, understanding the impact of digital footprint.',
        'Strength and conditioning specialization: Implementing advanced training programs tailored to specific sport demands and injury prevention.',
        'Mental toughness and sports psychology: Developing resilience, focus, and coping mechanisms for high-pressure situations and setbacks.',
      ],
      accentColor: 'cyan-500',
    },
    {
      icon: GraduationCap,
      title: 'College (Ages 18-22+)',
      description:
        'The transition to collegiate athletics, involving scholarships, NIL deals, and potential use of the transfer portal. The focus is on athletic performance, academic degree completion, and personal development. This period is a bridge to professional sports or other career paths, demanding significant commitment and adaptability.',
      decisions: [
        'Choosing a college based on athletic, academic, and cultural fit: Finding the right environment for holistic growth, balancing competitive aspirations with educational goals.',
        'Maximizing NIL opportunities while adhering to NCAA rules: Monetizing personal brand through endorsements, appearances, and social media, while maintaining compliance and academic integrity.',
        'Navigating the transfer portal for better opportunities: Strategic moves for athletic and academic advancement, considering factors like playing time, coaching staff, and academic programs.',
        'Balancing demanding athletic schedules with degree completion: Effective time management, utilizing academic support services, and prioritizing studies amidst rigorous training and competition.',
        'Preparing for a potential professional career or alternative paths: Career exploration, internships, networking, and developing a backup plan beyond sports.',
        'Developing financial literacy and budgeting skills: Managing scholarship funds, NIL earnings, and understanding personal finance for future stability.',
        'Building a professional network: Connecting with mentors, agents, industry professionals, and alumni for career guidance and opportunities.',
        'Coping with injuries and rehabilitation: Developing resilience, mental fortitude, and adhering to rehabilitation protocols for a successful return to play.',
        'Understanding contractual obligations and legal aspects: Familiarizing oneself with scholarship agreements, NIL contracts, and other legal documents.',
      ],
      accentColor: 'emerald-500',
    },
    {
      icon: Briefcase,
      title: 'Professional (Ages 22+)',
      description:
        'The pinnacle of athletic achievement, marked by the draft, rookie contracts, veteran contracts, and free agency. This stage demands peak physical and mental performance, strategic career management, and financial acumen. Longevity and sustained success are key challenges, requiring constant adaptation and dedication.',
      decisions: [
        'Making the decision to declare for the professional draft: Weighing readiness, potential draft position, and professional prospects against collegiate eligibility.',
        'Negotiating rookie and veteran contracts: Securing fair compensation, understanding contract clauses, and planning for long-term financial stability with expert advice.',
        'Managing agents, endorsements, and financial investments: Building a trusted team of advisors including agents, financial planners, and legal counsel.',
        'Navigating free agency and team changes: Strategic career moves for optimal performance, financial gain, and personal fit within a team or organization.',
        'Maintaining physical and mental health under intense pressure: Prioritizing well-being amidst demanding schedules, travel, public scrutiny, and performance expectations.',
        'Building a personal brand and public image: Leveraging platform for endorsements, media opportunities, and post-career ventures, carefully managing public perception.',
        'Dealing with media scrutiny and public expectations: Developing coping mechanisms, media training, and maintaining a strong support system to navigate public pressure.',
        'Planning for post-career transition: Proactive steps for a smooth shift away from professional sports, including education, skill development, and networking for a second career.',
        'Tax planning and wealth management: Strategic financial planning to maximize earnings and ensure long-term financial security.',
        'Philanthropic endeavors and community engagement: Using platform to give back and create positive social impact.',
      ],
      accentColor: 'purple-500',
    },
    {
      icon: HeartPulse,
      title: 'Retirement (Post-Career)',
      description:
        'The transition out of professional sports, a challenging period requiring careful planning for a second career, financial stability, and mental well-being. This stage emphasizes adapting to a new identity beyond athletics and finding new purpose and fulfillment in life.',
      decisions: [
        'Planning for career transition before retirement: Identifying passions, developing new skills, and exploring potential career paths well in advance of leaving professional sports.',
        'Financial planning and investment management: Ensuring long-term security after athletic income ceases, including retirement planning, investment strategies, and budgeting.',
        'Addressing mental health and identity shifts post-sport: Seeking support for emotional and psychological adjustments, coping with the loss of athletic identity, and finding new sources of self-worth.',
        'Exploring new career paths and educational opportunities: Utilizing transferable skills gained from sports, pursuing higher education, or starting new entrepreneurial ventures.',
        'Maintaining physical fitness and a healthy lifestyle: Adapting exercise routines, prioritizing overall wellness, and managing any chronic injuries from their playing career.',
        'Leveraging network and experiences for new ventures: Utilizing connections and insights gained from sports to open doors in business, media, or other fields.',
        'Giving back to the community through mentorship or charity: Finding fulfillment in contributing to others, sharing experiences, and inspiring the next generation.',
        'Defining a new sense of purpose and identity: Embracing personal growth beyond athletic achievements, discovering new passions, and building a fulfilling post-athletic life.',
        'Family and personal relationships: Re-prioritizing and strengthening bonds with family and friends after a demanding athletic career.',
        'Advocacy for athlete welfare: Continuing to contribute to the betterment of sports by advocating for current and former athletes.',
      ],
      accentColor: 'rose-500',
    },
    {
      icon: Trophy,
      title: 'Legacy (Ongoing)',
      description:
        'The lasting impact an athlete leaves on their sport and community. This can involve coaching, broadcasting, entrepreneurship, philanthropy, and ultimately, induction into a Hall of Fame, solidifying their place in history and inspiring future generations. This stage is about enduring influence and continued contribution.',
      decisions: [
        'Choosing avenues for continued involvement in sports (coaching, broadcasting, administration): Staying connected to the game and contributing expertise from a new perspective.',
        'Venturing into entrepreneurship or business: Applying leadership, discipline, and competitive drive to new industries, building successful enterprises.',
        'Engaging in philanthropy and community service: Using influence and resources for social good, establishing foundations, and supporting causes they believe in.',
        'Mentoring younger athletes and sharing experiences: Guiding the next generation of talent, imparting wisdom, and helping them navigate their own journeys.',
        'Building a lasting personal brand and public image: Ensuring a positive and impactful public perception, maintaining relevance, and inspiring through their story.',
        'Writing memoirs or documentaries: Documenting their journey, sharing lessons learned, and providing insights into the world of elite athletics.',
        'Advocating for athlete welfare and rights: Contributing to systemic improvements in sports, ensuring better conditions and support for athletes.',
        'Achieving Hall of Fame induction: The ultimate recognition of career excellence, impact, and lasting contribution to their sport.',
        'Public speaking and motivational engagements: Sharing their story and insights to inspire diverse audiences beyond the sports world.',
        'Investment in sports technology and innovation: Contributing to the advancement of sports through strategic investments and partnerships.',
      ],
      accentColor: 'blue-500',
    },
  ];

  return (
    <RouteErrorBoundary>
      <DashboardLayout>
        <div className="min-h-screen bg-[#050c1a] text-white p-4 sm:p-8 relative overflow-hidden">
          {/* Stadium Lights Aesthetic - Background elements for visual flair */}
          <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
            <div className="absolute -top-1/4 -left-1/4 w-1/2 h-1/2 bg-[#1E90FF] opacity-10 rounded-full filter blur-3xl animate-pulse-slow"></div>
            <div className="absolute -bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-[#00FFFF] opacity-10 rounded-full filter blur-3xl animate-pulse-slow delay-1000"></div>
          </div>

          {/* Hero Section - Main title and introductory text */}
          <section className="relative z-10 text-center py-16 sm:py-24 mb-12 bg-gradient-to-br from-[#0d1a3a] to-[#050c1a] rounded-xl shadow-2xl border border-slate-800">
            <h1 className="text-5xl sm:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#1E90FF] to-[#00FFFF] leading-tight mb-4">
              The Athlete's Odyssey
            </h1>
            <p className="text-xl sm:text-2xl text-slate-300 max-w-3xl mx-auto mb-8">
              Charting the complete journey from nascent talent to enduring legacy within the AthlynXAI ecosystem, empowering athletes at every stage with cutting-edge insights and unwavering support.
            </p>
            <div className="flex justify-center space-x-4">
              <button className="px-8 py-3 bg-[#1E90FF] text-white font-semibold rounded-full shadow-lg hover:bg-blue-600 transition duration-300 transform hover:scale-105">
                Explore Youth Development
              </button>
              <button className="px-8 py-3 border border-[#00FFFF] text-[#00FFFF] font-semibold rounded-full shadow-lg hover:bg-[#00FFFF] hover:text-[#050c1a] transition duration-300 transform hover:scale-105">
                Discover Legacy Programs
              </button>
            </div>
          </section>

          {/* Timeline Section - Visual representation of the athlete's journey */}
          <section className="relative z-10 max-w-6xl mx-auto pb-16">
            <h2 className="text-4xl font-bold text-center text-white mb-12">
              Athlete Lifecycle: A Journey Through Stages
            </h2>
            <div className="relative">
              {/* Vertical line for the timeline on larger screens */}
              <div className="hidden sm:block absolute h-full left-1/2 transform -translate-x-1/2 w-px bg-slate-700"></div>
              <div className="space-y-12">
                {stages.map((stage, index) => (
                  <TimelineItem key={index} {...stage} />
                ))}
              </div>
            </div>
          </section>

          {/* AthlynXAI Advantage Section - New section to add more content */}
          <section className="relative z-10 max-w-6xl mx-auto py-16">
            <h2 className="text-4xl font-bold text-center text-white mb-12">
              The AthlynXAI Advantage: Empowering Every Stage
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-[#0d1a3a] p-6 rounded-xl shadow-lg border border-slate-800 hover:border-[#1E90FF] transition duration-300">
                <div className="flex items-center mb-4">
                  <LineChart className="w-8 h-8 text-[#1E90FF] mr-3" />
                  <h3 className="text-2xl font-semibold text-white">Predictive Analytics</h3>
                </div>
                <p className="text-slate-400">Leverage AI-driven insights to predict performance trends, identify injury risks, and optimize training regimens for peak athletic condition.</p>
              </div>
              <div className="bg-[#0d1a3a] p-6 rounded-xl shadow-lg border border-slate-800 hover:border-[#00FFFF] transition duration-300">
                <div className="flex items-center mb-4">
                  <MessageSquare className="w-8 h-8 text-[#00FFFF] mr-3" />
                  <h3 className="text-2xl font-semibold text-white">Personalized Mentorship</h3>
                </div>
                <p className="text-slate-400">Connect with a network of seasoned professionals and former athletes for tailored guidance, career advice, and emotional support throughout your journey.</p>
              </div>
              <div className="bg-[#0d1a3a] p-6 rounded-xl shadow-lg border border-slate-800 hover:border-emerald-500 transition duration-300">
                <div className="flex items-center mb-4">
                  <Wallet className="w-8 h-8 text-emerald-500 mr-3" />
                  <h3 className="text-2xl font-semibold text-white">Financial Acumen Tools</h3>
                </div>
                <p className="text-slate-400">Access resources and expert advice on contract negotiation, investment strategies, and wealth management to secure your financial future beyond sports.</p>
              </div>
              <div className="bg-[#0d1a3a] p-6 rounded-xl shadow-lg border border-slate-800 hover:border-purple-500 transition duration-300">
                <div className="flex items-center mb-4">
                  <BriefcaseBusiness className="w-8 h-8 text-purple-500 mr-3" />
                  <h3 className="text-2xl font-semibold text-white">Post-Career Transition Support</h3>
                </div>
                <p className="text-slate-400">Comprehensive programs designed to facilitate a smooth transition into new careers, entrepreneurship, or leadership roles, leveraging your unique athletic skill set.</p>
              </div>
            </div>
          </section>

          {/* Key Insights Section - Highlighting core values and support systems */}
          <section className="relative z-10 max-w-6xl mx-auto py-16">
            <h2 className="text-4xl font-bold text-center text-white mb-12">
              Core Principles of the AthlynXAI Ecosystem
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Insight Card 1: Holistic Development */}
              <div className="bg-[#0d1a3a] p-6 rounded-xl shadow-lg border border-slate-800 hover:border-[#1E90FF] transition duration-300">
                <div className="flex items-center mb-4">
                  <Target className="w-8 h-8 text-[#1E90FF] mr-3" />
                  <h3 className="text-2xl font-semibold text-white">Holistic Development</h3>
                </div>
                <p className="text-slate-400">Emphasizing physical, mental, and emotional well-being at every stage, ensuring athletes thrive beyond their sport and achieve long-term success in life.</p>
              </div>
              {/* Insight Card 2: Strategic Guidance */}
              <div className="bg-[#0d1a3a] p-6 rounded-xl shadow-lg border border-slate-800 hover:border-[#00FFFF] transition duration-300">
                <div className="flex items-center mb-4">
                  <Handshake className="w-8 h-8 text-[#00FFFF] mr-3" />
                  <h3 className="text-2xl font-semibold text-white">Strategic Guidance</h3>
                </div>
                <p className="text-slate-400">Providing expert advice on career planning, financial management, and navigating complex decisions like NIL, endorsements, and free agency with confidence.</p>
              </div>
              {/* Insight Card 3: Legacy Building */}
              <div className="bg-[#0d1a3a] p-6 rounded-xl shadow-lg border border-slate-800 hover:border-blue-500 transition duration-300">
                <div className="flex items-center mb-4">
                  <Sparkles className="w-8 h-8 text-blue-500 mr-3" />
                  <h3 className="text-2xl font-semibold text-white">Legacy Building</h3>
                </div>
                <p className="text-slate-400">Empowering athletes to leverage their platform for positive impact, ensuring their influence extends far beyond their playing days and inspires future generations.</p>
              </div>
              {/* Insight Card 4: Data-Driven Performance */}
              <div className="bg-[#0d1a3a] p-6 rounded-xl shadow-lg border border-slate-800 hover:border-green-500 transition duration-300">
                <div className="flex items-center mb-4">
                  <BarChart3 className="w-8 h-8 text-green-500 mr-3" />
                  <h3 className="text-2xl font-semibold text-white">Data-Driven Performance</h3>
                </div>
                <p className="text-slate-400">Utilizing advanced analytics and AI insights to optimize training, recovery, and game-day strategies for peak athletic performance and injury prevention.</p>
              </div>
              {/* Insight Card 5: Community & Network */}
              <div className="bg-[#0d1a3a] p-6 rounded-xl shadow-lg border border-slate-800 hover:border-indigo-500 transition duration-300">
                <div className="flex items-center mb-4">
                  <Users className="w-8 h-8 text-indigo-500 mr-3" />
                  <h3 className="text-2xl font-semibold text-white">Community & Network</h3>
                </div>
                <p className="text-slate-400">Connecting athletes with a powerful network of peers, mentors, and industry leaders to foster collaboration, support, and shared growth.</p>
              </div>
              {/* Insight Card 6: Continuous Learning */}
              <div className="bg-[#0d1a3a] p-6 rounded-xl shadow-lg border border-slate-800 hover:border-pink-500 transition duration-300">
                <div className="flex items-center mb-4">
                  <BookOpen className="w-8 h-8 text-pink-500 mr-3" />
                  <h3 className="text-2xl font-semibold text-white">Continuous Learning</h3>
                </div>
                <p className="text-slate-400">Promoting lifelong learning and skill development, both within and outside of sports, to ensure adaptability and readiness for future challenges.</p>
              </div>
            </div>
          </section>

          {/* Call to Action Section */}
          <section className="relative z-10 text-center py-16 sm:py-24 bg-gradient-to-br from-[#0d1a3a] to-[#050c1a] rounded-xl shadow-2xl border border-slate-800 mt-12">
            <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#00FFFF] to-[#1E90FF] mb-4">
              Ready to Chart Your Path?
            </h2>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto mb-8">
              AthlynXAI provides the tools, insights, and community to navigate every stage of the athlete lifecycle with unparalleled support and innovation.
            </p>
            <button className="px-10 py-4 bg-[#00FFFF] text-[#050c1a] font-bold rounded-full shadow-lg hover:bg-cyan-400 transition duration-300 transform hover:scale-105 text-lg">
              Join the AthlynXAI Ecosystem
            </button>
          </section>

          {/* Footer Note - Copyright information */}
          <footer className="relative z-10 text-center py-8 mt-16 border-t border-slate-800 text-slate-500 text-sm">
            <p>Copyright © 2026 Chad A. Dozier Sr. / AthlynXAI. All rights reserved.</p>
          </footer>
        </div>
        <MobileBottomNav />
      </DashboardLayout>
    </RouteErrorBoundary>
  );
};

export default AthleteLifecycle;
