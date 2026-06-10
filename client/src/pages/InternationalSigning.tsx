import { Trophy } from "lucide-react";
import React from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import MobileBottomNav from '@/components/MobileBottomNav';
import { RouteErrorBoundary } from '@/components/GlobalErrorBoundary';
import { Globe, Users, Award, Plane, Briefcase, Flag, CalendarDays, Gavel, Landmark, Banknote, ShieldCheck } from 'lucide-react';

const InternationalSigning: React.FC = () => {
  return (
    <RouteErrorBoundary>
      <DashboardLayout>
        <div className="min-h-screen bg-[#050c1a] text-gray-100 font-sans">
          {/* Hero Section */}
          <section className="relative h-[50vh] flex items-center justify-center text-center px-4 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-[#0d1a3a] to-[#050c1a] opacity-90"></div>
            <div className="absolute inset-0" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1579952947600-01642232371c?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D")' /* Placeholder image */, backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.2 }}></div>
            <div className="relative z-10 max-w-4xl mx-auto">
              <h1 className="text-5xl md:text-7xl font-bold text-white mb-4 leading-tight">
                Global Talent, Limitless Potential
              </h1>
              <p className="text-xl md:text-2xl text-cyan-300 mb-8">
                Navigating the complex world of international athlete recruitment and signing.
              </p>
              <button className="bg-[#1E90FF] hover:bg-blue-600 text-white font-bold py-3 px-8 rounded-full transition duration-300 ease-in-out transform hover:scale-105 shadow-lg">
                Explore Recruitment Guides
              </button>
            </div>
          </section>

          {/* Introduction Section */}
          <section className="py-16 px-8 md:px-16 lg:px-24 bg-[#0d1a3a]">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-4xl font-bold text-cyan-400 mb-8 text-center">Your Gateway to International Sports</h2>
              <p className="text-lg text-gray-300 leading-relaxed text-center mb-12">
                The journey for international athletes to compete in the U.S. and globally involves intricate rules, visa requirements, and recruitment processes. AthlynXAI provides comprehensive insights into J-1/F-1 visas, sport-specific regulations, and critical timelines to ensure a smooth transition for aspiring global stars.
              </p>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
                <div className="bg-[#050c1a] p-8 rounded-lg shadow-xl border border-gray-700 hover:border-[#1E90FF] transition duration-300">
                  <Globe size={48} className="text-[#1E90FF] mb-4" />
                  <h3 className="text-2xl font-semibold text-white mb-3">Visa & Immigration</h3>
                  <p className="text-gray-400">Understand the nuances of J-1 and F-1 visas for college athletes, including eligibility, application processes, and timelines.</p>
                </div>
                <div className="bg-[#050c1a] p-8 rounded-lg shadow-xl border border-gray-700 hover:border-[#1E90FF] transition duration-300">
                  <Users size={48} className="text-[#00FFFF] mb-4" />
                  <h3 className="text-2xl font-semibold text-white mb-3">Recruitment Rules</h3>
                  <p className="text-gray-400">Dive deep into sport-specific international recruiting rules for soccer, basketball, baseball, and track & field.</p>
                </div>
                <div className="bg-[#050c1a] p-8 rounded-lg shadow-xl border border-gray-700 hover:border-[#1E90FF] transition duration-300">
                  <Award size={48} className="text-[#1E90FF] mb-4" />
                  <h3 className="text-2xl font-semibold text-white mb-3">Professional Leagues</h3>
                  <p className="text-gray-400">Explore FIFA transfer rules, MLB international signing bonus pools, and NBA draft eligibility for international players.</p>
                </div>
              </div>
            </div>
          </section>

          {/* Sport-Specific Rules Section */}
          <section className="py-16 px-8 md:px-16 lg:px-24 bg-[#050c1a]">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-4xl font-bold text-white mb-12 text-center">Sport-Specific International Regulations</h2>
              <div className="space-y-12">
                {/* Soccer */}
                <div className="flex flex-col lg:flex-row items-center bg-[#0d1a3a] p-8 rounded-lg shadow-xl border border-gray-700">
                  <div className="lg:w-1/3 mb-6 lg:mb-0 lg:pr-8">
                    <h3 className="text-3xl font-bold text-cyan-400 mb-4 flex items-center"><Flag size={32} className="mr-3" /> Soccer (FIFA)</h3>
                    <p className="text-gray-400 text-lg">Understanding FIFA's intricate rules for international transfers, particularly for minors, is crucial for aspiring soccer players and clubs.</p>
                  </div>
                  <div className="lg:w-2/3">
                    <ul className="list-disc list-inside text-gray-300 space-y-2">
                      <li>FIFA Regulations on the Status and Transfer of Players (RSTP) Article 19 for minors. This article strictly governs the international transfer of players under the age of 18, with limited exceptions.</li>
                      <li>International Transfer Certificate (ITC) requirements and process. An ITC is mandatory for any player registered with one national association to be registered with another.</li>
                      <li>Solidarity mechanism and training compensation for youth development. These financial mechanisms ensure that clubs contributing to the training and education of players receive compensation when those players sign their first professional contract or are transferred.</li>
                      <li>Exceptions for cross-border transfers of minors (e.g., parents moving for non-football reasons, player living within 50km of national border).</li>
                      <li>The role of FIFA's Transfer Matching System (TMS) in ensuring transparency and compliance in international transfers.</li>
                      <li>Specific rules for players moving between FIFA's confederations (e.g., CONMEBOL to UEFA).</li>
                    </ul>
                  </div>
                </div>

                {/* Basketball */}
                <div className="flex flex-col lg:flex-row items-center bg-[#0d1a3a] p-8 rounded-lg shadow-xl border border-gray-700">
                  <div className="lg:w-1/3 mb-6 lg:mb-0 lg:pr-8">
                    <h3 className="text-3xl font-bold text-cyan-400 mb-4 flex items-center"><Award size={32} className="mr-3" /> Basketball (NBA)</h3>
                    <p className="text-gray-400 text-lg">NBA draft eligibility rules for international players differ significantly from U.S. college players, impacting their path to the league.</p>
                  </div>
                  <div className="lg:w-2/3">
                    <ul className="list-disc list-inside text-gray-300 space-y-2">
                      <li>Age requirements: at least 19 years old during calendar year of draft. Players must turn 19 during the calendar year in which the draft is held.</li>
                      <li>One year removed from high school graduation (or equivalent). This ensures a minimum level of maturity and experience.</li>
                      <li>Definition of 'international player' vs. 'collegiate player'. An international player is defined as anyone who has not resided in the U.S. for at least three years and has not completed high school in the U.S.</li>
                      <li>Early entry process and withdrawal deadlines. International players can declare for the draft early but must withdraw by a specific deadline if they wish to retain college eligibility or explore other options.</li>
                      <li>The impact of playing professionally overseas on NBA draft eligibility and rookie contracts.</li>
                      <li>FIBA regulations and their interplay with NBA rules for international transfers.</li>
                    </ul>
                  </div>
                </div>

                {/* Baseball */}
                <div className="flex flex-col lg:flex-row items-center bg-[#0d1a3a] p-8 rounded-lg shadow-xl border border-gray-700">
                  <div className="lg:w-1/3 mb-6 lg:mb-0 lg:pr-8">
                    <h3 className="text-3xl font-bold text-cyan-400 mb-4 flex items-center"><Briefcase size={32} className="mr-3" /> Baseball (MLB)</h3>
                    <p className="text-gray-400 text-lg">MLB's international signing bonus pools and rules are critical for teams scouting talent from Latin America and Asia.</p>
                  </div>
                  <div className="lg:w-2/3">
                    <ul className="list-disc list-inside text-gray-300 space-y-2">
                      <li>International signing period (July 2nd to June 15th). This annual period is when MLB teams can sign eligible international amateur players.</li>
                      <li>Bonus pool allocations for each MLB team. Each team is allotted a specific amount of money they can spend on international amateur free agents.</li>
                      <li>Penalties for exceeding bonus pools. Teams that exceed their bonus pool are subject to penalties, including spending restrictions in future signing periods.</li>
                      <li>Exemptions for players over 25 with 6+ years in a foreign professional league. These players are not subject to bonus pool restrictions.</li>
                      <li>The role of MLB's international scouting combines and showcases.</li>
                      <li>Rules regarding agents and player representation in international signings.</li>
                    </ul>
                  </div>
                </div>

                {/* Track & Field */}
                <div className="flex flex-col lg:flex-row items-center bg-[#0d1a3a] p-8 rounded-lg shadow-xl border border-gray-700">
                  <div className="lg:w-1/3 mb-6 lg:mb-0 lg:pr-8">
                    <h3 className="text-3xl font-bold text-cyan-400 mb-4 flex items-center"><Plane size={32} className="mr-3" /> Track & Field</h3>
                    <p className="text-gray-400 text-lg">International track and field athletes face unique challenges related to amateur status, scholarship eligibility, and competition rules.</p>
                  </div>
                  <div className="lg:w-2/3">
                    <ul className="list-disc list-inside text-gray-300 space-y-2">
                      <li>World Athletics (formerly IAAF) eligibility rules for international competitions.</li>
                      <li>NCAA and NAIA amateurism rules for track and field athletes, particularly concerning prize money and endorsements.</li>
                      <li>Scholarship opportunities for international track and field athletes in the U.S. collegiate system.</li>
                      <li>Transfer regulations between international institutions and U.S. colleges.</li>
                      <li>Visa considerations for international athletes competing and training in the U.S.</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* NCAA vs NAIA Section */}
          <section className="py-16 px-8 md:px-16 lg:px-24 bg-[#0d1a3a]">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-4xl font-bold text-[#1E90FF] mb-12 text-center">NCAA vs. NAIA: International Eligibility</h2>
              <div className="grid md:grid-cols-2 gap-10">
                <div className="bg-[#050c1a] p-8 rounded-lg shadow-xl border border-gray-700 hover:border-cyan-500 transition duration-300">
                  <h3 className="text-2xl font-semibold text-white mb-4">NCAA International Rules</h3>
                  <ul className="list-disc list-inside text-gray-300 space-y-2">
                    <li>Amateurism certification process: International Student-Athletes must register with the NCAA Eligibility Center and undergo a thorough review of their amateur status.</li>
                    <li>Academic eligibility requirements (core courses, GPA, standardized tests): Specific academic benchmarks must be met, often requiring transcript evaluations from international institutions.</li>
                    <li>Transfer rules for international students: Rules vary depending on previous collegiate enrollment and competition.</li>
                    <li>Impact of professional experience abroad on eligibility: Even minor professional experience can jeopardize NCAA amateur status.</li>
                    <li>Initial-eligibility waivers and appeals process for unique circumstances.</li>
                    <li>English language proficiency requirements (e.g., TOEFL, IELTS scores).</li>
                  </ul>
                </div>
                <div className="bg-[#050c1a] p-8 rounded-lg shadow-xl border border-gray-700 hover:border-cyan-500 transition duration-300">
                  <h3 className="text-2xl font-semibold text-white mb-4">NAIA International Rules</h3>
                  <ul className="list-disc list-inside text-gray-300 space-y-2">
                    <li>More flexible amateurism rules compared to NCAA: NAIA allows for more leniency regarding prior professional experience.</li>
                    <li>Academic requirements (e.g., 2.0 GPA, specific test scores): While similar to NCAA, NAIA often has slightly different thresholds.</li>
                    <li>Eligibility center registration and evaluation: International students must register with the NAIA Eligibility Center.</li>
                    <li>Opportunities for older international athletes: NAIA often provides more opportunities for athletes who may be older or have had more post-high school athletic experience.</li>
                    <li>Character and sportsmanship requirements.</li>
                    <li>Differences in transfer rules and academic progress requirements.</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Immigration Timeline Section */}
          <section className="py-16 px-8 md:px-16 lg:px-24 bg-[#050c1a]">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-4xl font-bold text-white mb-12 text-center">Immigration Timeline for Student-Athletes</h2>
              <div className="relative border-l-4 border-[#1E90FF] pl-8 space-y-12">
                <div className="relative mb-8">
                  <div className="absolute w-4 h-4 bg-[#00FFFF] rounded-full -left-10 top-1 border-2 border-white"></div>
                  <h3 className="text-2xl font-semibold text-cyan-300 mb-2">6-12 Months Before Enrollment: Initial Steps</h3>
                  <ul className="list-disc list-inside text-gray-300 space-y-1">
                    <li>Secure admission to a U.S. institution.</li>
                    <li>Receive I-20 (for F-1 visa) or DS-2019 (for J-1 visa) from the school.</li>
                    <li>Pay SEVIS I-901 fee.</li>
                    <li>Begin gathering financial documentation to prove ability to cover educational and living expenses.</li>
                    <li>Complete NCAA/NAIA Eligibility Center registration and submit required academic documents.</li>
                  </ul>
                </div>
                <div className="relative mb-8">
                  <div className="absolute w-4 h-4 bg-[#00FFFF] rounded-full -left-10 top-1 border-2 border-white"></div>
                  <h3 className="text-2xl font-semibold text-cyan-300 mb-2">3-6 Months Before Enrollment: Visa Application</h3>
                  <ul className="list-disc list-inside text-gray-300 space-y-1">
                    <li>Complete online visa application (DS-160).</li>
                    <li>Schedule and attend visa interview at a U.S. Embassy or Consulate.</li>
                    <li>Gather required documents: passport, I-20/DS-2019, financial evidence, academic transcripts, and proof of athletic achievement.</li>
                    <li>Prepare for potential questions about intent to return to home country after studies.</li>
                    <li>Review visa interview tips and common pitfalls.</li>
                  </ul>
                </div>
                <div className="relative mb-8">
                  <div className="absolute w-4 h-4 bg-[#00FFFF] rounded-full -left-10 top-1 border-2 border-white"></div>
                  <h3 className="text-2xl font-semibold text-cyan-300 mb-2">Arrival in U.S. & Maintaining Status</h3>
                  <ul className="list-disc list-inside text-gray-300 space-y-1">
                    <li>Arrive up to 30 days before program start date.</li>
                    <li>Report to International Student Office upon arrival for check-in and orientation.</li>
                    <li>Maintain full-time enrollment and good academic standing to retain visa status.</li>
                    <li>Adhere to visa regulations regarding employment (e.g., on-campus work, OPT/CPT) and travel restrictions.</li>
                    <li>Understand the implications of Name, Image, and Likeness (NIL) rules for international student-athletes.</li>
                    <li>Familiarize yourself with U.S. laws and cultural norms.</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Country-Specific Rules Section */}
          <section className="py-16 px-8 md:px-16 lg:px-24 bg-[#0d1a3a]">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-4xl font-bold text-white mb-12 text-center">Country-Specific Signing Insights</h2>
              <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-10">
                {/* Dominican Republic */}
                <div className="bg-[#050c1a] p-8 rounded-lg shadow-xl border border-gray-700 hover:border-cyan-500 transition duration-300">
                  <h3 className="text-2xl font-semibold text-cyan-300 mb-3 flex items-center"><Landmark size={24} className="mr-2" /> Dominican Republic (MLB)</h3>
                  <ul className="list-disc list-inside text-gray-300 space-y-2">
                    <li>Prevalence of baseball academies and their role in player development.</li>
                    <li>Age verification challenges and MLB's efforts to combat fraud.</li>
                    <li>The importance of showcases and tryouts for exposure to MLB scouts.</li>
                    <li>Cultural aspects and family involvement in the signing process.</li>
                    <li>Impact of the MLB Draft on Dominican players (not eligible for the main draft).</li>
                    <li>The role of the MLB International Prospect List.</li>
                  </ul>
                </div>
                {/* Japan */}
                <div className="bg-[#050c1a] p-8 rounded-lg shadow-xl border border-gray-700 hover:border-cyan-500 transition duration-300">
                  <h3 className="text-2xl font-semibold text-cyan-300 mb-3 flex items-center"><Landmark size={24} className="mr-2" /> Japan (NPB & MLB)</h3>
                  <ul className="list-disc list-inside text-gray-300 space-y-2">
                    <li>The NPB posting system, allowing Japanese players to move to MLB after a certain number of years of service.</li>
                    <li>Direct signing rules for Japanese amateur players by MLB teams, often after high school or college.</li>
                    <li>The strong high school and university baseball systems in Japan, serving as primary talent pipelines.</li>
                    <li>Cultural differences in player development and professional contracts, emphasizing team loyalty and discipline.</li>
                    <li>The role of the Japan Series and other domestic competitions in player evaluation.</li>
                    <li>Restrictions on Japanese players signing with MLB teams before a certain age or professional experience.</li>
                  </ul>
                </div>
                {/* Cuba */}
                <div className="bg-[#050c1a] p-8 rounded-lg shadow-xl border border-gray-700 hover:border-cyan-500 transition duration-300">
                  <h3 className="text-2xl font-semibold text-cyan-300 mb-3 flex items-center"><Landmark size={24} className="mr-2" /> Cuba (MLB)</h3>
                  <ul className="list-disc list-inside text-gray-300 space-y-2">
                    <li>Complex defection and residency rules for professional athletes seeking to play in MLB.</li>
                    <li>The historical challenges and recent changes in U.S.-Cuba relations impacting player movement.</li>
                    <li>The role of third countries in establishing residency for Cuban players to become eligible for MLB free agency.</li>
                    <li>MLB's efforts to create a safe and legal pathway for Cuban players, including potential agreements with the Cuban Baseball Federation.</li>
                    <li>The unique challenges faced by Cuban players in establishing their age and identity.</li>
                    <li>The impact of the U.S. embargo on Cuban athletes.</li>
                  </ul>
                </div>
                {/* Australia */}
                <div className="bg-[#050c1a] p-8 rounded-lg shadow-xl border border-gray-700 hover:border-cyan-500 transition duration-300">
                  <h3 className="text-2xl font-semibold text-cyan-300 mb-3 flex items-center"><Landmark size={24} className="mr-2" /> Australia (Various Sports)</h3>
                  <ul className="list-disc list-inside text-gray-300 space-y-2">
                    <li>Growing talent pool in baseball, basketball, and soccer, with increasing international recognition.</li>
                    <li>Pathways to U.S. colleges through scholarships and recruitment, particularly for basketball and track & field.</li>
                    <li>Development leagues and academies fostering young talent across multiple sports.</li>
                    <li>The impact of professional leagues like the NBL (basketball) and A-League (soccer) in developing and retaining talent.</li>
                    <li>Opportunities for Australian rules football players to transition to American football.</li>
                    <li>The role of national sports organizations in athlete development and international placement.</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Agent Rules Section */}
          <section className="py-16 px-8 md:px-16 lg:px-24 bg-[#050c1a]">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-4xl font-bold text-cyan-400 mb-8 text-center">Agent Regulations for International Athletes</h2>
              <div className="bg-[#0d1a3a] p-8 rounded-lg shadow-xl border border-gray-700">
                <p className="text-lg text-gray-300 leading-relaxed mb-4">
                  Navigating the world of sports agents as an international athlete requires careful consideration of various regulations, licensing requirements, and ethical standards across different countries and sports federations. It is crucial for athletes to work with certified and reputable agents to ensure their rights are protected and their careers are managed ethically and effectively.
                </p>
                <ul className="list-disc list-inside text-gray-300 space-y-2">
                  <li>FIFA Football Agent Regulations (FFAR) and national association licensing: These regulations govern the conduct of football agents and require them to be licensed and adhere to specific ethical guidelines.</li>
                  <li>NBA Players Association (NBPA) agent certification process: Agents representing NBA players must be certified by the NBPA, which involves an application, background check, examination, and ongoing compliance.</li>
                  <li>MLB Players Association (MLBPA) agent regulations: Similar to the NBPA, the MLBPA certifies agents who represent baseball players, ensuring they adhere to specific standards of conduct and fee structures.</li>
                  <li>NCAA and NAIA rules regarding agents and amateurism: Strict rules are in place to prevent student-athletes from compromising their amateur status by engaging with agents before specific timelines or without proper procedures, often leading to loss of eligibility.</li>
                  <li>Importance of legal counsel for contract review and compliance: International athletes often face complex contracts that require expert legal review to ensure fair terms, compliance with international laws, and protection against exploitation.</li>
                  <li>Understanding commission structures and fee agreements with agents, which can vary significantly by sport and country.</li>
                  <li>The role of international sports law firms in advising athletes and agents on complex cross-border legal issues.</li>
                  <li>Ethical considerations and avoiding predatory agents who target vulnerable international athletes.</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Additional Resources Section */}
          <section className="py-16 px-8 md:px-16 lg:px-24 bg-[#050c1a]">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-4xl font-bold text-[#00FFFF] mb-12 text-center">Additional Resources & Support</h2>
              <div className="grid md:grid-cols-2 gap-10">
                <div className="bg-[#0d1a3a] p-8 rounded-lg shadow-xl border border-gray-700 hover:border-[#00FFFF] transition duration-300">
                  <Gavel size={48} className="text-[#00FFFF] mb-4" />
                  <h3 className="text-2xl font-semibold text-white mb-3">Sports Immigration Law</h3>
                  <p className="text-gray-400">Connect with legal experts specializing in sports immigration and international athlete representation.</p>
                </div>
                <div className="bg-[#0d1a3a] p-8 rounded-lg shadow-xl border border-gray-700 hover:border-[#00FFFF] transition duration-300">
                  <ShieldCheck size={48} className="text-[#00FFFF] mb-4" />
                  <h3 className="text-2xl font-semibold text-white mb-3">Compliance & Eligibility</h3>
                  <p className="text-gray-400">Access detailed guides and services for NCAA, NAIA, FIFA, and other governing body compliance.</p>
                </div>
              </div>
            </div>
          </section>

          {/* Key Challenges Section */}
          <section className="py-16 px-8 md:px-16 lg:px-24 bg-[#050c1a]">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-4xl font-bold text-white mb-12 text-center">Key Challenges for International Athletes</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
                <div className="bg-[#0d1a3a] p-8 rounded-lg shadow-xl border border-gray-700 hover:border-[#1E90FF] transition duration-300">
                  <Trophy size={48} className="text-[#1E90FF] mb-4" />
                  <h3 className="text-2xl font-semibold text-white mb-3">Cultural & Language Barriers</h3>
                  <p className="text-gray-400">Adapting to a new culture and overcoming language differences can be significant hurdles for international athletes, impacting both their academic and athletic performance.</p>
                </div>
                <div className="bg-[#0d1a3a] p-8 rounded-lg shadow-xl border border-gray-700 hover:border-[#1E90FF] transition duration-300">
                  <Banknote size={48} className="text-[#00FFFF] mb-4" />
                  <h3 className="text-2xl font-semibold text-white mb-3">Financial & Scholarship Limitations</h3>
                  <p className="text-gray-400">Securing adequate financial support and understanding scholarship limitations are crucial for international student-athletes, as funding options can be complex.</p>
                </div>
                <div className="bg-[#0d1a3a] p-8 rounded-lg shadow-xl border border-gray-700 hover:border-[#1E90FF] transition duration-300">
                  <CalendarDays size={48} className="text-[#1E90FF] mb-4" />
                  <h3 className="text-2xl font-semibold text-white mb-3">Eligibility & Compliance</h3>
                  <p className="text-gray-400">Staying compliant with ever-evolving NCAA, NAIA, and international federation eligibility rules requires constant vigilance and expert guidance.</p>
                </div>
              </div>
            </div>
          </section>

          {/* Future Outlook Section */}
          <section className="py-16 px-8 md:px-16 lg:px-24 bg-[#0d1a3a]">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-4xl font-bold text-cyan-400 mb-8 text-center">Future Outlook: Evolving Landscape</h2>
              <p className="text-lg text-gray-300 leading-relaxed text-center">
                The landscape of international athlete recruitment is constantly evolving, with new regulations, technologies, and global trends shaping the future. Staying informed and adaptable will be key for athletes, coaches, and organizations alike.
              </p>
            </div>
          </section>

          {/* Footer Note */}
          <footer className="bg-[#050c1a] py-8 px-8 md:px-16 lg:px-24 text-center text-gray-500 text-sm border-t border-gray-800">
            <p className="mb-2">Disclaimer: The information provided on this page is for general informational purposes only and does not constitute legal advice. Please consult with an immigration attorney or sports law expert for specific guidance.</p>
            <p>Copyright © 2026 Chad A. Dozier Sr. / AthlynXAI. All rights reserved.</p>
          </footer>
        </div>
        <MobileBottomNav />
      </DashboardLayout>
    </RouteErrorBoundary>
  );
};

export default InternationalSigning;
