import React from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { RouteErrorBoundary } from '@/components/GlobalErrorBoundary';
import MobileBottomNav from "@/components/MobileBottomNav";
import { ArrowRight, CalendarDays, Banknote, ShieldCheck, BookOpen, Users, Landmark, FileText, Gavel, GraduationCap, Trophy } from "lucide-react";

const TransferPortalRules: React.FC = () => {
  return (
    <RouteErrorBoundary>
      <DashboardLayout>
        <div className="min-h-screen bg-[#050c1a] text-gray-100 font-sans relative">
          {/* Hero Section */}
          <section className="relative h-96 flex items-center justify-center text-center px-4 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-[#0d1a3a] to-[#050c1a] opacity-90"></div>
            <div className="relative z-10">
              <h1 className="text-5xl font-bold text-white mb-4 drop-shadow-lg">
                NCAA Transfer Portal Rules
              </h1>
              <p className="text-xl text-cyan-300 max-w-3xl mx-auto">
                Navigating the complexities of collegiate athlete transfers.
                Understand the regulations, timelines, and implications.
              </p>
            </div>
          </section>

          <main className="container mx-auto px-6 py-12 relative z-10">
            {/* One-Time Transfer Exception */}
            <section className="mb-16 bg-[#0d1a3a] p-8 rounded-lg shadow-xl border border-electric-blue-500/20">
              <h2 className="text-3xl font-semibold text-electric-blue-400 mb-6 flex items-center">
                <Trophy className="mr-3 text-cyan-400" size={28} /> One-Time Transfer Exception
              </h2>
              <p className="text-lg leading-relaxed mb-4 text-gray-300">
                The NCAA's one-time transfer exception allows student-athletes to transfer from a four-year institution to another four-year institution and be immediately eligible to compete, provided certain conditions are met. This exception can only be used once during an athlete's collegiate career, making strategic decisions crucial for their athletic and academic future.
              </p>
              <ul className="list-disc list-inside text-gray-300 ml-4 space-y-2">
                <li><span className="font-semibold text-white">Academic Eligibility:</span> Must be academically eligible at the previous institution at the time of transfer.</li>
                <li><span className="font-semibold text-white">Good Standing:</span> Must be in good academic standing and not subject to disciplinary suspension.</li>
                <li><span className="font-semibold text-white">Notification:</span> Must notify their institution of their intent to transfer by entering their name into the NCAA Transfer Portal within the designated window.</li>
                <li><span className="font-semibold text-white">Scope:</span> The exception applies to all NCAA sports, including Division I, II, and III.</li>
                <li><span className="font-semibold text-white">Usage Limit:</span> This exception can only be utilized once per student-athlete during their undergraduate career. Graduate transfers have different rules.</li>
              </ul>
            </section>

            {/* Eligibility Windows */}
            <section className="mb-16 bg-[#0d1a3a] p-8 rounded-lg shadow-xl border border-electric-blue-500/20">
              <h2 className="text-3xl font-semibold text-electric-blue-400 mb-6 flex items-center">
                <CalendarDays className="mr-3 text-cyan-400" size={28} /> Eligibility Windows & Deadlines
              </h2>
              <p className="text-lg leading-relaxed mb-4 text-gray-300">
                Student-athletes must enter the Transfer Portal within specific, non-negotiable windows to be eligible for immediate competition. Missing these deadlines can result in a loss of immediate eligibility, requiring a waiver or sitting out a season. These windows are sport-specific and designed to align with the academic calendar and competitive seasons, ensuring fair play and academic integration.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <div className="bg-[#050c1a] p-6 rounded-md border border-gray-700">
                  <h3 className="text-xl font-medium text-white mb-3 flex items-center">
                    <ArrowRight className="mr-2 text-electric-blue-300" size={20} /> Fall Sports (e.g., Volleyball)
                  </h3>
                  <p className="text-gray-300">Typically a 45-day window beginning the day after championship selections for that sport. For football, there's also a spring window.</p>
                </div>
                <div className="bg-[#050c1a] p-6 rounded-md border border-gray-700">
                  <h3 className="text-xl font-medium text-white mb-3 flex items-center">
                    <ArrowRight className="mr-2 text-electric-blue-300" size={20} /> Winter Sports (e.g., Ice Hockey)
                  </h3>
                  <p className="text-gray-300">A 60-day window beginning the day after championship selections for that sport.</p>
                </div>
                <div className="bg-[#050c1a] p-6 rounded-md border border-gray-700">
                  <h3 className="text-xl font-medium text-white mb-3 flex items-center">
                    <ArrowRight className="mr-2 text-electric-blue-300" size={20} /> Spring Sports (e.g., Softball, Lacrosse)
                  </h3>
                  <p className="text-gray-300">A 45-day window, often from May 1st to May 15th, or 45 days after championship selections, depending on the specific sport and division.</p>
                </div>
                <div className="bg-[#050c1a] p-6 rounded-md border border-gray-700">
                  <h3 className="text-xl font-medium text-white mb-3 flex items-center">
                    <ArrowRight className="mr-2 text-electric-blue-300" size={20} /> Graduate Transfers
                  </h3>
                  <p className="text-gray-300">Often have more flexible windows, but still must adhere to academic eligibility and admission requirements of the new institution.</p>
                </div>
              </div>
            </section>

            {/* Portal Entry/Withdrawal Rules */}
            <section className="mb-16 bg-[#0d1a3a] p-8 rounded-lg shadow-xl border border-electric-blue-500/20">
              <h2 className="text-3xl font-semibold text-electric-blue-400 mb-6 flex items-center">
                <BookOpen className="mr-3 text-cyan-400" size={28} /> Portal Entry & Withdrawal Procedures
              </h2>
              <p className="text-lg leading-relaxed mb-4 text-gray-300">
                The process of entering and withdrawing from the Transfer Portal has specific guidelines that student-athletes must follow meticulously. Understanding these steps is crucial to avoid procedural errors that could impact eligibility.
              </p>
              <ul className="list-disc list-inside text-gray-300 ml-4 space-y-2">
                <li><span className="font-semibold text-white">Initiation:</span> Student-athletes must formally inform their current institution's compliance office or athletic director of their desire to enter the portal.</li>
                <li><span className="font-semibold text-white">Institutional Action:</span> The institution then has a maximum of 2 business days to officially enter the athlete's name into the national transfer portal database.</li>
                <li><span className="font-semibold text-white">Recruitment Contact:</span> Once an athlete's name appears in the portal, other NCAA institutions are permitted to contact them directly for recruitment purposes.</li>
                <li><span className="font-semibold text-white">Withdrawal:</span> An athlete can withdraw their name from the portal. However, re-entry within the same academic year or after a certain period may impact immediate eligibility, often requiring a waiver.</li>
                <li><span className="font-semibold text-white">Scholarship Implications:</span> Entering the portal does not guarantee a scholarship offer from a new institution, nor does it guarantee the retention of the current scholarship.</li>
              </ul>
            </section>

            {/* Waivers and Immediate Eligibility */}
            <section className="mb-16 bg-[#0d1a3a] p-8 rounded-lg shadow-xl border border-electric-blue-500/20">
              <h2 className="text-3xl font-semibold text-electric-blue-400 mb-6 flex items-center">
                <ShieldCheck className="mr-3 text-cyan-400" size={28} /> Waivers & Immediate Eligibility
              </h2>
              <p className="text-lg leading-relaxed mb-4 text-gray-300">
                While the one-time transfer exception grants immediate eligibility for most, there are specific situations where waivers might be necessary for athletes who do not meet the standard criteria or wish to transfer a second time. The waiver process is complex and outcome-dependent.
              </p>
              <ul className="list-disc list-inside text-gray-300 ml-4 space-y-2">
                <li><span className="font-semibold text-white">Extenuating Circumstances:</span> Waivers are typically considered for documented extenuating circumstances, such as a head coach change, egregious behavior by the institution, or documented health and safety concerns.</li>
                <li><span className="font-semibold text-white">Process:</span> The waiver application involves submitting detailed documentation and often requires support from both the previous and new institutions.</li>
                <li><span className="font-semibold text-white">No Guarantee:</span> A waiver application does not guarantee immediate eligibility, and the review process can be lengthy, potentially delaying an athlete's ability to compete.</li>
                <li><span className="font-semibold text-white">Compliance Officer Role:</span> Athletes are strongly advised to work closely with compliance officers at both institutions to navigate the waiver process effectively.</li>
              </ul>
            </section>

            {/* Sport-Specific Rules */}
            <section className="mb-16 bg-[#0d1a3a] p-8 rounded-lg shadow-xl border border-electric-blue-500/20">
              <h2 className="text-3xl font-semibold text-electric-blue-400 mb-6 flex items-center">
                <Trophy className="mr-3 text-cyan-400" size={28} /> Sport-Specific Regulations & Transfer Windows
              </h2>
              <p className="text-lg leading-relaxed mb-4 text-gray-300">
                Beyond general rules, several NCAA sports have unique transfer regulations and specific windows that athletes must be acutely aware of. These rules often reflect the sport's unique competitive calendar and roster management needs.
              </p>
              <div className="overflow-x-auto">
                <table className="min-w-full bg-[#050c1a] rounded-lg shadow-md">
                  <thead>
                    <tr className="bg-electric-blue-600/30 text-white uppercase text-sm leading-normal">
                      <th className="py-3 px-6 text-left">Sport</th>
                      <th className="py-3 px-6 text-left">Primary Transfer Window</th>
                      <th className="py-3 px-6 text-left">Key Rule / Additional Notes</th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-300 text-sm font-light">
                    <tr className="border-b border-gray-700 hover:bg-gray-800">
                      <td className="py-3 px-6 text-left whitespace-nowrap">Football (FBS/FCS)</td>
                      <td className="py-3 px-6 text-left">Winter: 45 days (Early Dec - Mid Jan)<br/>Spring: 15 days (Late Apr - Early May)</td>
                      <td className="py-3 px-6 text-left">The <span className="font-semibold text-white">4+1 Rule</span> allows graduate transfers to play immediately. Strict limits on total transfers.</td>
                    </tr>
                    <tr className="border-b border-gray-700 hover:bg-gray-800">
                      <td className="py-3 px-6 text-left whitespace-nowrap">Men's & Women's Basketball</td>
                      <td className="py-3 px-6 text-left">60 days (Mid-March - Mid-May)</td>
                      <td className="py-3 px-6 text-left">One-time transfer exception applies. Athletes often seek new opportunities after coaching changes.</td>
                    </tr>
                    <tr className="border-b border-gray-700 hover:bg-gray-800">
                      <td className="py-3 px-6 text-left whitespace-nowrap">Baseball</td>
                      <td className="py-3 px-6 text-left">45 days (Early June - Mid July)</td>
                      <td className="py-3 px-6 text-left">Specific rules for two-year college transfers and impact on scholarship limits.</td>
                    </tr>
                    <tr className="border-b border-gray-700 hover:bg-gray-800">
                      <td className="py-3 px-6 text-left whitespace-nowrap">Softball</td>
                      <td className="py-3 px-6 text-left">45 days (Early June - Mid July)</td>
                      <td className="py-3 px-6 text-left">Similar to baseball, with considerations for roster sizes and scholarship distribution.</td>
                    </tr>
                    <tr className="border-b border-gray-700 hover:bg-gray-800">
                      <td className="py-3 px-6 text-left whitespace-nowrap">Ice Hockey</td>
                      <td className="py-3 px-6 text-left">60 days (Late March - Late May)</td>
                      <td className="py-3 px-6 text-left">One-time transfer exception applies. Often sees movement after season conclusion.</td>
                    </tr>
                    <tr className="border-b border-gray-700 hover:bg-gray-800">
                      <td className="py-3 px-6 text-left whitespace-nowrap">Lacrosse</td>
                      <td className="py-3 px-6 text-left">45 days (Late May - Early July)</td>
                      <td className="py-3 px-6 text-left">One-time transfer exception applies. Strategic transfers common for playing time.</td>
                    </tr>
                    <tr className="border-b border-gray-700 hover:bg-gray-800">
                      <td className="py-3 px-6 text-left whitespace-nowrap">Soccer</td>
                      <td className="py-3 px-6 text-left">45 days (Late May - Early July)</td>
                      <td className="py-3 px-6 text-left">One-time transfer exception applies. Important for roster building ahead of fall season.</td>
                    </tr>
                    <tr className="border-b border-gray-700 hover:bg-gray-800">
                      <td className="py-3 px-6 text-left whitespace-nowrap">Volleyball</td>
                      <td className="py-3 px-6 text-left">45 days (Late May - Early July)</td>
                      <td className="py-3 px-6 text-left">One-time transfer exception applies. Critical for team dynamics and competitive balance.</td>
                    </tr>
                    <tr className="border-b border-gray-700 hover:bg-gray-800">
                      <td className="py-3 px-6 text-left whitespace-nowrap">Track & Field / Cross Country</td>
                      <td className="py-3 px-6 text-left">Variable, often after championship seasons</td>
                      <td className="py-3 px-6 text-left">Specific rules for indoor vs. outdoor seasons and eligibility.</td>
                    </tr>
                    <tr className="border-b border-gray-700 hover:bg-gray-800">
                      <td className="py-3 px-6 text-left whitespace-nowrap">Swimming & Diving</td>
                      <td className="py-3 px-6 text-left">Variable, often after championship seasons</td>
                      <td className="py-3 px-6 text-left">One-time transfer exception applies. Focus on academic fit and training facilities.</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            {/* NIL During Transfer */}
            <section className="mb-16 bg-[#0d1a3a] p-8 rounded-lg shadow-xl border border-electric-blue-500/20">
              <h2 className="text-3xl font-semibold text-electric-blue-400 mb-6 flex items-center">
                <Banknote className="mr-3 text-cyan-400" size={28} /> NIL & Transfer Portal Dynamics
              </h2>
              <p className="text-lg leading-relaxed mb-4 text-gray-300">
                Name, Image, and Likeness (NIL) opportunities have profoundly impacted the transfer landscape, adding a new layer of complexity to student-athlete decisions. While NIL deals are permissible, they cannot be used as direct inducements to transfer, and institutions must navigate these rules carefully.
              </p>
              <ul className="list-disc list-inside text-gray-300 ml-4 space-y-2">
                <li><span className="font-semibold text-white">Influence on Decisions:</span> NIL collectives and opportunities are increasingly significant factors in a student-athlete's decision to enter the portal and choose a new institution.</li>
                <li><span className="font-semibold text-white">Prohibited Inducements:</span> NCAA rules strictly prohibit 
 "pay-for-play" or direct payments contingent on transfer. NIL deals must be for actual services rendered.</li>
                <li><span className="font-semibold text-white">Transparency & Disclosure:</span> While not always fully transparent, institutions and athletes are encouraged to disclose NIL agreements to ensure compliance.</li>
                <li><span className="font-semibold text-white">Independent Advice:</span> Athletes should seek independent legal and financial advice regarding NIL deals, as these agreements can have long-term implications.</li>
              </ul>
            </section>

            {/* Academic Requirements */}
            <section className="mb-16 bg-[#0d1a3a] p-8 rounded-lg shadow-xl border border-electric-blue-500/20">
              <h2 className="text-3xl font-semibold text-electric-blue-400 mb-6 flex items-center">
                <GraduationCap className="mr-3 text-cyan-400" size={28} /> Academic Requirements for Transfer
              </h2>
              <p className="text-lg leading-relaxed mb-4 text-gray-300">
                Maintaining academic eligibility is paramount for student-athletes considering a transfer. Academic standing at both the previous and new institution is closely scrutinized to ensure the athlete is making satisfactory progress toward a degree.
              </p>
              <ul className="list-disc list-inside text-gray-300 ml-4 space-y-2">
                <li><span className="font-semibold text-white">Progress Toward Degree:</span> Must meet specific NCAA and institutional requirements for progress toward a degree, including credit hours earned and GPA.</li>
                <li><span className="font-semibold text-white">Minimum GPA:</span> Minimum GPA requirements vary significantly by institution, conference, and even specific academic programs. Athletes must verify these requirements for their target schools.</li>
                <li><span className="font-semibold text-white">Transfer Credits:</span> All transfer credits must be officially accepted by the new institution, and these credits must apply towards the athlete's chosen degree program.</li>
                <li><span className="font-semibold text-white">Academic Advising:</span> Close consultation with academic advisors at both institutions is critical to ensure a smooth academic transition and continued eligibility.</li>
              </ul>
            </section>

            {/* Coach Contact Rules */}
            <section className="mb-16 bg-[#0d1a3a] p-8 rounded-lg shadow-xl border border-electric-blue-500/20">
              <h2 className="text-3xl font-semibold text-electric-blue-400 mb-6 flex items-center">
                <Users className="mr-3 text-cyan-400" size={28} /> Coach Contact & Recruiting Rules
              </h2>
              <p className="text-lg leading-relaxed mb-4 text-gray-300">
                Once a student-athlete enters the Transfer Portal, coaches from other institutions are permitted to contact them. However, there are strict NCAA rules governing this contact to prevent tampering and ensure fair recruitment practices.
              </p>
              <ul className="list-disc list-inside text-gray-300 ml-4 space-y-2">
                <li><span className="font-semibold text-white">Pre-Portal Contact:</span> Coaches are strictly prohibited from contacting athletes before their name is officially entered into the NCAA Transfer Portal.</li>
                <li><span className="font-semibold text-white">Recruiting Begins:</span> Once in the portal, recruiting conversations, visits, and offers can commence between the athlete and prospective new institutions.</li>
                <li><span className="font-semibold text-white">Institutional Facilitation:</span> Current institutions are not permitted to facilitate contact between their athletes and other schools before the athlete has entered the portal.</li>
                <li><span className="font-semibold text-white">Tampering:</span> Any contact or inducement prior to portal entry is considered tampering and can result in severe penalties for the involved institutions and coaches.</li>
              </ul>
            </section>

            {/* House Settlement Impact */}
            <section className="mb-16 bg-[#0d1a3a] p-8 rounded-lg shadow-xl border border-electric-blue-500/20">
              <h2 className="text-3xl font-semibold text-electric-blue-400 mb-6 flex items-center">
                <Landmark className="mr-3 text-cyan-400" size={28} /> House Settlement Impact on Transfers
              </h2>
              <p className="text-lg leading-relaxed mb-4 text-gray-300">
                The recent House v. NCAA settlement has significant implications for collegiate athletics, including potential seismic shifts in transfer rules and athlete compensation models. While the full ramifications are still being determined, it is expected to usher in a new era for student-athletes.
              </p>
              <ul className="list-disc list-inside text-gray-300 ml-4 space-y-2">
                <li><span className="font-semibold text-white">Direct Revenue Sharing:</span> The settlement paves the way for direct revenue sharing with athletes, which could fundamentally alter the financial incentives for transfers.</li>
                <li><span className="font-semibold text-white">Liberalized Rules:</span> There is potential for further liberalization of transfer rules, possibly reducing restrictions on multiple transfers or eliminating transfer windows entirely.</li>
                <li><span className="font-semibold text-white">New Compensation Structures:</span> The introduction of new compensation structures could lead to a more professionalized model for collegiate athletics, impacting how athletes choose institutions.</li>
                <li><span className="font-semibold text-white">Ongoing Changes:</span> The landscape is highly dynamic, with ongoing legal challenges and NCAA policy adjustments expected in the coming years. Athletes and institutions must stay informed.</li>
              </ul>
            </section>

            {/* Additional Resources */}
            <section className="mb-16 bg-[#0d1a3a] p-8 rounded-lg shadow-xl border border-electric-blue-500/20">
              <h2 className="text-3xl font-semibold text-electric-blue-400 mb-6 flex items-center">
                <FileText className="mr-3 text-cyan-400" size={28} /> Additional Resources
              </h2>
              <p className="text-lg leading-relaxed mb-4 text-gray-300">
                For the most up-to-date and detailed information, student-athletes and their families should consult official NCAA resources and institutional compliance offices.
              </p>
              <ul className="list-disc list-inside text-gray-300 ml-4 space-y-2">
                <li><a href="https://www.ncaa.org/transfer" target="_blank" rel="noopener noreferrer" className="text-electric-blue-300 hover:underline">NCAA Transfer Guide</a></li>
                <li><a href="https://ncaacomp.com/" target="_blank" rel="noopener noreferrer" className="text-electric-blue-300 hover:underline">NCAA Eligibility Center</a></li>
                <li>Consult with your institution's compliance department.</li>
              </ul>
            </section>
          </main>

          {/* Footer */}
          <footer className="bg-[#0d1a3a] py-8 px-6 text-center text-gray-400 border-t border-electric-blue-500/20">
            <p className="mb-2">Copyright © 2026 Chad A. Dozier Sr. / AthlynXAI. All rights reserved.</p>
            <p className="text-sm">Disclaimer: This information is for general guidance only and does not constitute legal advice. NCAA rules are subject to change, and individual circumstances may vary. Always consult with qualified professionals.</p>
          </footer>
        </div>
        <MobileBottomNav />
      </DashboardLayout>
    </RouteErrorBoundary>
  );
};

export default TransferPortalRules;
