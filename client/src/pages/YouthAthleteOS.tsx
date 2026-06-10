import DashboardLayout from "@/components/DashboardLayout";
import MobileBottomNav from "@/components/MobileBottomNav";
import { RouteErrorBoundary } from '@/components/GlobalErrorBoundary';
import { Trophy, Users, DollarSign, TrendingUp, Search, ShieldCheck, BookOpen, GraduationCap } from "lucide-react";
import { Link } from "wouter";

const YouthAthleteOS = () => {
  return (
    <RouteErrorBoundary>
      <DashboardLayout>
        <div className="min-h-screen bg-[#050c1a] text-white font-sans">
          {/* Hero Section */}
          <section className="relative py-20 px-4 sm:px-6 lg:px-8 text-center bg-gradient-to-r from-[#1E90FF] to-[#4169E1] shadow-lg">
            <h1 className="text-5xl sm:text-6xl font-black text-white leading-tight mb-4">
              Start the Journey Early
            </h1>
            <p className="text-2xl sm:text-3xl font-bold text-blue-100 mb-8">
              From Travel Ball to the Pros
            </p>
            <p className="text-lg text-blue-200 max-w-3xl mx-auto">
              AthlynXAI provides the ultimate platform for young athletes and their families to navigate the complex world of youth sports, ensuring every step is purposeful and leads to success.
            </p>
            <div className="mt-10">
              <Link href="/signup">
                <a className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-[#00FFFF] hover:bg-cyan-400 md:py-4 md:text-lg md:px-10 transition duration-300 ease-in-out shadow-lg">
                  <Trophy className="-ml-1 mr-3 h-5 w-5" />
                  Get Started Today
                </a>
              </Link>
            </div>
          </section>

          {/* AthlynX Family Plan Section */}
          <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#050c1a]">
            <div className="max-w-7xl mx-auto">
              <h2 className="text-4xl font-black text-center text-white mb-12 bg-gradient-to-r from-[#1E90FF] to-[#4169E1] text-transparent bg-clip-text">
                The AthlynX Family Plan
              </h2>
              <div className="bg-[#0d1a3a] rounded-2xl border border-blue-700/50 p-8 shadow-xl">
                <p className="text-center text-blue-300 text-xl mb-8">Unlock your child's full potential for just <span className="text-[#00FFFF] font-bold">$9.99/month</span>.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                  <div className="flex flex-col items-center text-center p-6 bg-[#050c1a] rounded-xl border border-blue-800/30 shadow-md">
                    <Users className="h-12 w-12 text-[#00FFFF] mb-4" />
                    <h3 className="text-xl font-bold text-white mb-2">Athlete Profile Creation</h3>
                    <p className="text-blue-200">Build a comprehensive digital profile showcasing skills, stats, and achievements.</p>
                  </div>
                  <div className="flex flex-col items-center text-center p-6 bg-[#050c1a] rounded-xl border border-blue-800/30 shadow-md">
                    <Search className="h-12 w-12 text-[#00FFFF] mb-4" />
                    <h3 className="text-xl font-bold text-white mb-2">Recruiting Exposure</h3>
                    <p className="text-blue-200">Connect with college coaches and scouts through our exclusive network.</p>
                  </div>
                  <div className="flex flex-col items-center text-center p-6 bg-[#050c1a] rounded-xl border border-blue-800/30 shadow-md">
                    <TrendingUp className="h-12 w-12 text-[#00FFFF] mb-4" />
                    <h3 className="text-xl font-bold text-white mb-2">Performance Tracking</h3>
                    <p className="text-blue-200">Monitor progress with advanced analytics and personalized insights.</p>
                  </div>
                  <div className="flex flex-col items-center text-center p-6 bg-[#050c1a] rounded-xl border border-blue-800/30 shadow-md">
                    <GraduationCap className="h-12 w-12 text-[#00FFFF] mb-4" />
                    <h3 className="text-xl font-bold text-white mb-2">College Prep Timeline</h3>
                    <p className="text-blue-200">Stay on track with a step-by-step guide to academic and athletic readiness.</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Travel Ball & AAU Section */}
          <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#050c1a]">
            <div className="max-w-7xl mx-auto">
              <h2 className="text-4xl font-black text-center text-white mb-12 bg-gradient-to-r from-[#1E90FF] to-[#4169E1] text-transparent bg-clip-text">
                Navigating Travel Ball & AAU
              </h2>
              <div className="bg-[#0d1a3a] rounded-2xl border border-blue-700/50 p-8 shadow-xl">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-4">Finding the Right Program</h3>
                    <p className="text-blue-200 mb-4">Choosing the right travel ball or AAU team is crucial. AthlynXAI helps you evaluate programs based on coaching quality, competition level, and development philosophy.</p>
                    <ul className="list-disc list-inside text-blue-200 space-y-2">
                      <li>Access to verified team reviews and ratings.</li>
                      <li>Tools to compare program costs and benefits.</li>
                      <li>Guidance on tryouts and selection processes.</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-4">Cost Breakdown & AthlynX Advantage</h3>
                    <p className="text-blue-200 mb-4">Travel ball and AAU can range from <span className="text-[#00FFFF] font-bold">$5,000 to $30,000+ per year</span>. We provide transparent cost breakdowns including:</p>
                    <ul className="list-disc list-inside text-blue-200 space-y-2 mb-4">
                      <li>Team fees, coaching, and uniforms.</li>
                      <li>Travel, accommodation, and food.</li>
                      <li>Tournament registrations and showcases.</li>
                    </ul>
                    <p className="text-blue-200 mb-4">AthlynXAI takes a minimal <span className="text-[#00FFFF] font-bold">2-3% platform fee</span> on tournament registrations processed through our system, ensuring affordability and value.</p>
                    <div className="flex items-center bg-[#050c1a] rounded-xl border border-blue-800/30 p-4">
                      <DollarSign className="h-8 w-8 text-[#00FFFF] mr-4" />
                      <div>
                        <h4 className="text-xl font-bold text-white">ROI Calculator</h4>
                        <p className="text-blue-200">Estimate the potential return on investment for your youth sports journey.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Youth Athlete Development Timeline */}
          <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#050c1a]">
            <div className="max-w-7xl mx-auto">
              <h2 className="text-4xl font-black text-center text-white mb-12 bg-gradient-to-r from-[#1E90FF] to-[#4169E1] text-transparent bg-clip-text">
                Youth Athlete Development Timeline (Ages 6-18)
              </h2>
              <div className="bg-[#0d1a3a] rounded-2xl border border-blue-700/50 p-8 shadow-xl">
                <div className="relative">
                  <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-[#1E90FF] hidden md:block"></div>
                  <div className="space-y-12">
                    {[ 
                      { age: '6-9', title: 'Foundation & Fun', description: 'Focus on fundamental skills, multi-sport participation, and fostering a love for the game.' },
                      { age: '10-12', title: 'Skill Specialization & Growth', description: 'Introduce more specialized training, competitive play, and physical development.' },
                      { age: '13-15', title: 'Competitive Development & Exposure', description: 'Intensify training, participate in showcases, and begin academic planning for college.' },
                      { age: '16-18', title: 'Elite Performance & Recruiting', description: 'Refine skills, maximize exposure, navigate recruiting process, and prepare for collegiate or professional level.' }
                    ].map((item, index) => (
                      <div key={index} className="flex items-center justify-between md:odd:flex-row-reverse group">
                        <div className="w-full md:w-5/12 text-right md:text-left">
                          <div className="bg-[#050c1a] rounded-xl border border-blue-800/30 p-6 shadow-md group-odd:text-right group-even:text-left">
                            <h3 className="text-2xl font-bold text-white mb-2">Age {item.age}</h3>
                            <h4 className="text-xl font-bold text-[#00FFFF] mb-2">{item.title}</h4>
                            <p className="text-blue-200">{item.description}</p>
                          </div>
                        </div>
                        <div className="hidden md:block w-2/12 flex justify-center">
                          <div className="w-6 h-6 rounded-full bg-[#00FFFF] border-4 border-[#1E90FF] z-10"></div>
                        </div>
                        <div className="w-full md:w-5/12 text-left md:text-right"></div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Parent Resources Section */}
          <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#050c1a]">
            <div className="max-w-7xl mx-auto">
              <h2 className="text-4xl font-black text-center text-white mb-12 bg-gradient-to-r from-[#1E90FF] to-[#4169E1] text-transparent bg-clip-text">
                Essential Parent Resources
              </h2>
              <div className="bg-[#0d1a3a] rounded-2xl border border-blue-700/50 p-8 shadow-xl">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="flex items-start p-6 bg-[#050c1a] rounded-xl border border-blue-800/30 shadow-md">
                    <BookOpen className="h-10 w-10 text-[#00FFFF] mr-4 flex-shrink-0" />
                    <div>
                      <h3 className="text-xl font-bold text-white mb-2">Recruiting Education</h3>
                      <p className="text-blue-200">Comprehensive guides and webinars to understand the college recruiting landscape, NCAA rules, and scholarship opportunities.</p>
                    </div>
                  </div>
                  <div className="flex items-start p-6 bg-[#050c1a] rounded-xl border border-blue-800/30 shadow-md">
                    <DollarSign className="h-10 w-10 text-[#00FFFF] mr-4 flex-shrink-0" />
                    <div>
                      <h3 className="text-xl font-bold text-white mb-2">Financial Planning for Athlete Development</h3>
                      <p className="text-blue-200">Strategies for budgeting, fundraising, and maximizing financial aid for youth sports and college expenses.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Early Signing and Commitment Rules */}
          <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#050c1a]">
            <div className="max-w-7xl mx-auto">
              <h2 className="text-4xl font-black text-center text-white mb-12 bg-gradient-to-r from-[#1E90FF] to-[#4169E1] text-transparent bg-clip-text">
                Understanding Early Signing & Commitment
              </h2>
              <div className="bg-[#0d1a3a] rounded-2xl border border-blue-700/50 p-8 shadow-xl">
                <p className="text-blue-200 mb-4">Navigating the rules around early signing periods and verbal commitments can be complex. AthlynXAI provides up-to-date information and guidance on:</p>
                <ul className="list-disc list-inside text-blue-200 space-y-2">
                  <li>NCAA and NAIA regulations for different sports.</li>
                  <li>The difference between verbal commitments and National Letters of Intent (NLI).</li>
                  <li>Key dates and deadlines for signing periods.</li>
                  <li>Best practices for communicating with college programs.</li>
                </ul>
                <p className="text-blue-300 mt-6">Our platform helps families make informed decisions, avoiding potential pitfalls and ensuring compliance with athletic association guidelines.</p>
              </div>
            </div>
          </section>

          {/* AthlynX Youth Scouting Network */}
          <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#050c1a]">
            <div className="max-w-7xl mx-auto">
              <h2 className="text-4xl font-black text-center text-white mb-12 bg-gradient-to-r from-[#1E90FF] to-[#4169E1] text-transparent bg-clip-text">
                The AthlynX Youth Scouting Network
              </h2>
              <div className="bg-[#0d1a3a] rounded-2xl border border-blue-700/50 p-8 shadow-xl flex flex-col md:flex-row items-center gap-8">
                <div className="md:w-1/2">
                  <p className="text-blue-200 mb-4">We believe talent can emerge from anywhere. Our advanced scouting network leverages data analytics and human expertise to identify promising young athletes, just like finding the next generation of legends:</p>
                  <ul className="list-disc list-inside text-blue-200 space-y-2">
                    <li>Michael Jordan (Basketball)</li>
                    <li>Bo Jackson (Football/Baseball)</li>
                    <li>Mike Trout (Baseball)</li>
                    <li>Cristiano Ronaldo (Soccer)</li>
                  </ul>
                  <p className="text-blue-300 mt-4">AthlynXAI provides a pathway for these undiscovered talents to gain recognition and opportunities they deserve.</p>
                </div>
                <div className="md:w-1/2 flex justify-center">
                  <ShieldCheck className="h-48 w-48 text-[#00FFFF] opacity-70" />
                </div>
              </div>
            </div>
          </section>

          {/* Footer */}
          <footer className="py-10 px-4 sm:px-6 lg:px-8 bg-[#0d1a3a] text-center text-blue-300 border-t border-blue-700/50">
            <p className="text-sm">
              Copyright © 2026 Chad A. Dozier Sr. / AthlynXAI. All rights reserved.
            </p>
          </footer>
        </div>
        <MobileBottomNav />
      </DashboardLayout>
    </RouteErrorBoundary>
  );
};

export default YouthAthleteOS;
