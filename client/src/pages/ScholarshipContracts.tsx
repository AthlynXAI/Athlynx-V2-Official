import React from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { RouteErrorBoundary } from '@/components/GlobalErrorBoundary';
import MobileBottomNav from '@/components/MobileBottomNav';
import { BookText, Trophy, Award, GraduationCap, DollarSign, Users, TrendingUp, ShieldCheck, Landmark, Lightbulb, Gavel, CalendarDays, BarChart, Banknote, FileText } from 'lucide-react';

const ScholarshipContracts: React.FC = () => {
  return (
    <RouteErrorBoundary>
      <DashboardLayout>
        <div className="min-h-screen bg-[#050c1a] text-gray-100 font-sans">
          {/* Hero Section */}
          <section className="relative py-20 px-4 md:px-8 lg:px-16 bg-gradient-to-br from-[#0d1a3a] to-[#050c1a] overflow-hidden">
            <div className="absolute inset-0 z-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 50% 0%, #1E90FF, transparent 70%)' }}></div>
            <div className="relative z-10 max-w-7xl mx-auto text-center">
              <h1 className="text-5xl md:text-6xl font-extrabold text-white leading-tight mb-4 drop-shadow-lg">
                Scholarship Contracts & Financial Aid
              </h1>
              <p className="text-xl md:text-2xl text-cyan-300 mb-8 max-w-3xl mx-auto">
                Navigate the complexities of athletic scholarships and financial support with clarity and confidence.
              </p>
              <div className="flex justify-center space-x-4">
                <button className="bg-[#1E90FF] hover:bg-blue-600 text-white font-bold py-3 px-8 rounded-full transition duration-300 ease-in-out transform hover:scale-105 shadow-lg">
                  Explore NLI Details
                </button>
                <button className="bg-transparent border-2 border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-[#0d1a3a] font-bold py-3 px-8 rounded-full transition duration-300 ease-in-out transform hover:scale-105 shadow-lg">
                  Understand Scholarship Types
                </button>
              </div>
            </div>
          </section>

          {/* NLI Explained Section */}
          <section className="py-16 px-4 md:px-8 lg:px-16 max-w-7xl mx-auto">
            <h2 className="text-4xl font-bold text-white mb-10 text-center flex items-center justify-center">
              <BookText className="mr-4 text-[#1E90FF]" size={40} /> National Letter of Intent (NLI) Explained
            </h2>
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <p className="text-lg text-gray-300 leading-relaxed mb-6">
                  The National Letter of Intent (NLI) serves as a foundational commitment in collegiate athletics, formalizing the agreement between a prospective student-athlete and an NCAA Division I or II institution. By signing, the athlete commits to attending the institution for one academic year, while the institution commits to providing athletic financial aid for that same period. This aid typically covers tuition, fees, room, board, and books, though the exact components can vary.
                </p>
                <p className="text-lg text-gray-300 leading-relaxed mb-6">
                  The NLI program was developed to protect both student-athletes and institutions. For athletes, it guarantees a scholarship, removing uncertainty about financial aid. For institutions, it secures a commitment from a recruit, preventing other NCAA schools from continuing recruitment efforts once the NLI is officially signed and submitted. This mutual commitment streamlines the recruiting process and provides clarity for all parties involved.
                </p>
                <p className="text-lg text-gray-300 leading-relaxed mb-6">
                  It is imperative for student-athletes and their families to thoroughly understand the terms and conditions of the NLI before signing. This includes being aware of the signing periods, which are specific windows set by the NCAA, and the potential consequences of not fulfilling the NLI, such as loss of eligibility. Seeking guidance from high school counselors, coaches, and legal advisors is highly recommended to ensure a well-informed decision.
                </p>
                <ul className="list-disc list-inside text-gray-300 space-y-3">
                  <li><span className="font-semibold text-cyan-300">Binding Agreement:</span> Commits you to a school for one year.</li>
                  <li><span className="font-semibold text-cyan-300">Financial Aid Guarantee:</span> School commits to providing athletic aid.</li>
                  <li><span className="font-semibold text-cyan-300">Recruiting Ends:</span> Other schools cannot recruit you after signing.</li>
                  <li><span className="font-semibold text-cyan-300">Release Clause:</span> Under specific circumstances, a release from the NLI may be granted.</li>
                </ul>
              </div>
              <div className="relative bg-[#0d1a3a] p-8 rounded-xl shadow-2xl border border-blue-700/50">
                <div className="absolute inset-0 rounded-xl" style={{ background: 'linear-gradient(45deg, rgba(30, 144, 255, 0.1), rgba(0, 255, 255, 0.1))' }}></div>
                <div className="relative z-10">
                  <h3 className="text-2xl font-bold text-white mb-4 flex items-center"><FileText className="mr-3 text-cyan-400" /> Key NLI Considerations</h3>
                  <ul className="space-y-4 text-gray-300">
                    <li>
                      <p><span className="font-semibold text-cyan-300">Timing:</span> NLIs can only be signed during specific signing periods set by the NCAA, which vary by sport and division. It's crucial to be aware of these dates to avoid missing opportunities or making premature commitments.</p>
                    </li>
                    <li>
                      <p><span className="font-semibold text-cyan-300">Validity:</span> An NLI is only valid if signed by both the prospective student-athlete (and a parent/guardian if under 21) and an authorized representative of the institution. All signatures must be obtained within the designated signing period.</p>
                    </li>
                    <li>
                      <p><span className="font-semibold text-cyan-300">Breach of NLI:</span> Consequences for not fulfilling the NLI without a valid release can be severe, including loss of eligibility for one year and a mandatory waiting period before competing at another NCAA institution. This underscores the binding nature of the agreement.</p>
                    </li>
                    <li>
                      <p><span className="font-semibold text-cyan-300">Early Enrollment:</span> Specific rules apply for student-athletes who wish to enroll early, such as graduating high school a semester early. These athletes must ensure their NLI signing aligns with their early enrollment plans and NCAA regulations.</p>
                    </li>
                    <li>
                      <p><span className="font-semibold text-cyan-300">Release from NLI:</span> While binding, a student-athlete can request a release from their NLI under certain circumstances, such as a coaching change or if the institution no longer offers the sport. The institution is not obligated to grant the release, but a formal process exists.</p>
                    </li>
                    <li>
                      <p><span className="font-semibold text-cyan-300">Impact on Other Sports:</span> Signing an NLI for one sport does not restrict an athlete from participating in other sports at the same institution, provided they meet all eligibility requirements for those sports and the coaching staff approves.</p>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Scholarship Types Section */}
          <section className="py-16 px-4 md:px-8 lg:px-16 max-w-7xl mx-auto">
            <h2 className="text-4xl font-bold text-white mb-10 text-center flex items-center justify-center">
              <Award className="mr-4 text-[#00FFFF]" size={40} /> Understanding Scholarship Types
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Full Scholarship */}
              <div className="bg-[#0d1a3a] p-6 rounded-xl shadow-xl border border-cyan-700/50 hover:border-cyan-400 transition duration-300">
                <h3 className="text-2xl font-semibold text-white mb-3 flex items-center"><DollarSign className="mr-3 text-green-400" /> Full Scholarship</h3>
                <p className="text-gray-300 leading-relaxed">A full scholarship is the most comprehensive form of athletic aid, typically covering the full cost of attendance, which includes tuition, mandatory fees, room, board, and required course books. These are most commonly awarded in 'headcount' sports where the NCAA limits the number of full scholarships a team can offer.</p>
              </div>
              {/* Partial Scholarship */}
              <div className="bg-[#0d1a3a] p-6 rounded-xl shadow-xl border border-cyan-700/50 hover:border-cyan-400 transition duration-300">
                <h3 className="text-2xl font-semibold text-white mb-3 flex items-center"><Banknote className="mr-3 text-blue-400" /> Partial Scholarship</h3>
                <p className="text-gray-300 leading-relaxed">A partial scholarship covers only a portion of a student-athlete's educational expenses, such as tuition, fees, or room and board. These are prevalent in 'equivalency' sports, where coaches have a total scholarship budget that can be divided among many athletes, allowing for greater flexibility in team building.</p>
              </div>
              {/* Equivalency Sports */}
              <div className="bg-[#0d1a3a] p-6 rounded-xl shadow-xl border border-cyan-700/50 hover:border-cyan-400 transition duration-300">
                <h3 className="text-2xl font-semibold text-white mb-3 flex items-center"><BarChart className="mr-3 text-blue-400" /> Equivalency Sports</h3>
                <p className="text-gray-300 leading-relaxed">Equivalency sports are those where the NCAA imposes a limit on the total amount of financial aid that can be awarded to a team, rather than a limit on the number of full scholarships. Coaches in these sports (e.g., baseball, track & field, soccer, swimming) have the flexibility to divide this total scholarship equivalency among multiple student-athletes, often resulting in partial scholarships for many.</p>
              </div>
              {/* Headcount Sports */}
              <div className="bg-[#0d1a3a] p-6 rounded-xl shadow-xl border border-cyan-700/50 hover:border-cyan-400 transition duration-300">
                <h3 className="text-2xl font-semibold text-white mb-3 flex items-center"><Users className="mr-3 text-purple-400" /> Headcount Sports</h3>
                <p className="text-gray-300 leading-relaxed">Headcount sports are characterized by the NCAA limiting the total number of athletes who can receive athletic scholarships, and these scholarships must be full rides. This means that if a coach offers a scholarship, it must cover the full cost of attendance. Examples include Football (FBS), Men's and Women's Women's Gymnastics, Women's and Women's Volleyball.</p>
              </div>
            </div>
          </section>

          {/* Scholarship Renewal & Cancellation */}
          <section className="py-16 px-4 md:px-8 lg:px-16 max-w-7xl mx-auto">
            <h2 className="text-4xl font-bold text-white mb-10 text-center flex items-center justify-center">
              <CalendarDays className="mr-4 text-[#1E90FF]" size={40} /> Renewal & Cancellation Rules
            </h2>
            <div className="grid md:grid-cols-2 gap-12">
              <div className="bg-[#0d1a3a] p-8 rounded-xl shadow-2xl border border-blue-700/50">
                <h3 className="text-2xl font-bold text-white mb-4 flex items-center"><ShieldCheck className="mr-3 text-green-400" /> Scholarship Renewal</h3>
                <p className="text-lg text-gray-300 leading-relaxed mb-4">
                  Athletic scholarships are generally awarded for one academic year at a time and are subject to annual renewal. It is crucial for student-athletes to understand that renewal is not automatic for the duration of their collegiate career. NCAA rules stipulate that institutions must provide written notification to student-athletes by July 1st each year regarding whether their athletic aid will be renewed, reduced, or canceled for the upcoming academic year.
                </p>
                <ul className="list-disc list-inside text-gray-300 space-y-3">
                  <li><span className="font-semibold text-cyan-300">Annual Review:</span> Aid is reviewed yearly, not guaranteed for four years.</li>
                  <li><span className="font-semibold text-cyan-300">Notification Deadline:</span> Schools must inform athletes by July 1st.</li>
                  <li><span className="font-semibold text-cyan-300">Performance & Conduct:</span> Renewal often depends on academic standing, athletic performance, and adherence to team/university rules.</li>
                </ul>
              </div>
              <div className="bg-[#0d1a3a] p-8 rounded-xl shadow-2xl border border-blue-700/50">
                <h3 className="text-2xl font-bold text-white mb-4 flex items-center"><Gavel className="mr-3 text-red-400" /> Reduction & Cancellation</h3>
                <p className="text-lg text-gray-300 leading-relaxed mb-4">
                  While athletic scholarships provide significant support, institutions do have the right to reduce or cancel them under specific, NCAA-defined circumstances. These circumstances are typically outlined in the National Letter of Intent (NLI) and the institutional financial aid agreement. Common reasons for reduction or cancellation include: becoming academically ineligible, voluntarily withdrawing from the sport, engaging in fraudulent misrepresentation, or serious misconduct that violates team or university policies. It is vital for student-athletes to be aware of these conditions to maintain their scholarship.
                </p>
                <ul className="list-disc list-inside text-gray-300 space-y-3">
                  <li><span className="font-semibold text-cyan-300">Ineligibility:</span> Failing to meet academic or NCAA eligibility standards.</li>
                  <li><span className="font-semibold text-cyan-300">Voluntary Withdrawal:</span> Deciding not to participate in the sport.</li>
                  <li><span className="font-semibold text-cyan-300">Misconduct:</span> Engaging in serious misconduct that warrants disciplinary action.</li>
                  <li><span className="font-semibold text-cyan-300">Injury:</span> Generally, injury alone cannot be a reason for cancellation during the period of the award.</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Title IX & Walk-on Pathways */}
          <section className="py-16 px-4 md:px-8 lg:px-16 max-w-7xl mx-auto">
            <h2 className="text-4xl font-bold text-white mb-10 text-center flex items-center justify-center">
              <Trophy className="mr-4 text-[#00FFFF]" size={40} /> Title IX & Walk-on Opportunities
            </h2>
            <div className="grid md:grid-cols-2 gap-12">
              <div className="bg-[#0d1a3a] p-8 rounded-xl shadow-2xl border border-cyan-700/50">
                <h3 className="text-2xl font-bold text-white mb-4 flex items-center"><Landmark className="mr-3 text-blue-400" /> Title IX Scholarship Distribution</h3>
                <p className="text-lg text-gray-300 leading-relaxed mb-4">
                  Title IX of the Education Amendments of 1972 is a federal civil rights law that prohibits discrimination on the basis of sex in any education program or activity receiving federal financial assistance. In collegiate athletics, Title IX mandates equal opportunities for male and female athletes, which extends to the equitable distribution of athletic scholarships. This does not necessarily mean identical funding for every sport, but rather a proportional distribution of financial aid based on the participation rates of male and female student-athletes. Institutions must demonstrate a commitment to providing scholarship opportunities that are substantially proportionate to their enrollment numbers by gender.
                </p>
                <ul className="list-disc list-inside text-gray-300 space-y-3">
                  <li><span className="font-semibold text-cyan-300">Equal Opportunity:</span> Ensures fair treatment regardless of gender.</li>
                  <li><span className="font-semibold text-cyan-300">Proportionality:</span> Scholarship aid should be proportional to the number of male and female athletes.</li>
                  <li><span className="font-semibold text-cyan-300">Compliance:</span> Institutions must regularly review their athletic programs for Title IX compliance.</li>
                </ul>
              </div>
              <div className="bg-[#0d1a3a] p-8 rounded-xl shadow-2xl border border-cyan-700/50">
                <h3 className="text-2xl font-bold text-white mb-4 flex items-center"><TrendingUp className="mr-3 text-green-400" /> Walk-on to Scholarship Pathways</h3>
                <p className="text-lg text-gray-300 leading-relaxed mb-4">
                  The journey from a walk-on athlete to a scholarship recipient is a testament to dedication, hard work, and perseverance. Many successful collegiate athletes, particularly in equivalency sports, begin their careers without athletic aid, proving their value to the team through their performance, commitment, and academic achievement. This pathway not only demonstrates an athlete's resilience but also opens doors to significant opportunities, as coaches often reward deserving walk-ons with scholarships as they become available due to various factors like transfers, graduation, or improved team budgets.
                </p>
                <ul className="list-disc list-inside text-gray-300 space-y-3">
                  <li><span className="font-semibold text-cyan-300">Earn Your Spot:</span> Prove your value to the team without initial scholarship aid.</li>
                  <li><span className="font-semibold text-cyan-300">Scholarship Availability:</span> Scholarships can become available due to various reasons (e.g., transfers, graduation, performance).</li>
                  <li><span className="font-semibold text-cyan-300">Persistence Pays Off:</span> A common route for athletes in equivalency sports.</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Graduate & 5th Year Scholarships */}
          <section className="py-16 px-4 md:px-8 lg:px-16 max-w-7xl mx-auto">
            <h2 className="text-4xl font-bold text-white mb-10 text-center flex items-center justify-center">
              <GraduationCap className="mr-4 text-[#1E90FF]" size={40} /> Graduate & 5th Year Aid
            </h2>
            <div className="grid md:grid-cols-2 gap-12">
              <div className="bg-[#0d1a3a] p-8 rounded-xl shadow-2xl border border-blue-700/50">
                <h3 className="text-2xl font-bold text-white mb-4 flex items-center"><Lightbulb className="mr-3 text-blue-400" /> Graduate Scholarship Rules</h3>
                <p className="text-lg text-gray-300 leading-relaxed mb-4">
                  Student-athletes who have exhausted their undergraduate eligibility for athletic competition may still be eligible to receive athletic financial aid while pursuing a graduate degree. This can occur at the same institution or a different one, provided they meet specific NCAA criteria for graduate student-athlete eligibility. These rules are complex and often depend on factors such as academic standing, remaining eligibility, and the institution's specific policies regarding graduate student-athletes. It offers a pathway for continued athletic involvement and educational advancement.
                </p>
                <ul className="list-disc list-inside text-gray-300 space-y-3">
                  <li><span className="font-semibold text-cyan-300">Post-Eligibility Aid:</span> Continues athletic aid while pursuing graduate studies.</li>
                  <li><span className="font-semibold text-cyan-300">NCAA Regulations:</span> Must adhere to specific rules regarding eligibility and academic progress.</li>
                </ul>
              </div>
              <div className="bg-[#0d1a3a] p-8 rounded-xl shadow-2xl border border-blue-700/50">
                <h3 className="text-2xl font-bold text-white mb-4 flex items-center"><CalendarDays className="mr-3 text-blue-400" /> 5th Year Scholarship</h3>
                <p className="text-lg text-gray-300 leading-relaxed mb-4">
                  A 5th-year scholarship, or an additional year of athletic aid, is often granted under specific NCAA rules, most commonly through a medical redshirt or hardship waiver. This allows student-athletes to gain an additional year of eligibility due beyond their initial four years, typically due to significant injury, illness, or other unforeseen circumstances that prevented them from competing for a full season. This extension of eligibility often comes with continued financial aid, providing an opportunity to complete their athletic career and academic pursuits.
                </p>
                <ul className="list-disc list-inside text-gray-300 space-y-3">
                  <li><span className="font-semibold text-cyan-300">Hardship Waiver:</span> Granted for significant injuries or other qualifying events.</li>
                  <li><span className="font-semibold text-cyan-300">Eligibility Extension:</span> Provides an extra year of competition.</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Olympic Sport & Academic Stacking */}
          <section className="py-16 px-4 md:px-8 lg:px-16 max-w-7xl mx-auto">
            <h2 className="text-4xl font-bold text-white mb-10 text-center flex items-center justify-center">
              <Award className="mr-4 text-[#00FFFF]" size={40} /> Specialized Scholarship Insights
            </h2>
            <div className="grid md:grid-cols-2 gap-12">
              <div className="bg-[#0d1a3a] p-8 rounded-xl shadow-2xl border border-cyan-700/50">
                <h3 className="text-2xl font-bold text-white mb-4 flex items-center"><BarChart className="mr-3 text-purple-400" /> Olympic Sport Scholarship Limits</h3>
                <p className="text-lg text-gray-300 leading-relaxed mb-4">
                  Scholarship limits for Olympic sports (e.g., swimming, track & field, gymnastics, soccer, volleyball, wrestling) often differ significantly from those in high-revenue sports like football and basketball. Most Olympic sports are classified as equivalency sports, meaning coaches have a total scholarship budget to distribute among their athletes, leading to a prevalence of partial scholarships. Understanding these specific limits, which vary by sport, NCAA division, and gender, is crucial for athletes and their families when evaluating financial aid offers and planning their collegiate careers.
                </p>
                <ul className="list-disc list-inside text-gray-300 space-y-3">
                  <li><span className="font-semibold text-cyan-300">Sport-Specific Limits:</span> Varies significantly by sport and NCAA division.</li>
                  <li><span className="font-semibold text-cyan-300">Equivalency Focus:</span> Many Olympic sports are equivalency sports, allowing for partial scholarships.</li>
                </ul>
              </div>
              <div className="bg-[#0d1a3a] p-8 rounded-xl shadow-2xl border border-cyan-700/50">
                <h3 className="text-2xl font-bold text-white mb-4 flex items-center"><Lightbulb className="mr-3 text-blue-400" /> Academic Scholarship Stacking</h3>
                <p className="text-lg text-gray-300 leading-relaxed mb-4">
                  Student-athletes often have the opportunity to combine academic scholarships with their athletic aid, a practice known as scholarship stacking. This can significantly enhance their overall financial support. However, it's crucial to navigate the specific NCAA rules and institutional policies that govern how these different types of aid can be combined. The total amount of financial aid, including both athletic and academic scholarships, cannot exceed the student-athlete's full cost of attendance as determined by the institution. Understanding these limits and policies is essential to maximize financial benefits while maintaining NCAA eligibility.
                </p>
                <ul className="list-disc list-inside text-gray-300 space-y-3">
                  <li><span className="font-semibold text-cyan-300">NCAA Limits:</span> Total aid from all sources (athletic, academic, need-based) cannot exceed the student-athlete's full cost of attendance, which includes tuition, fees, room, board, books, and other miscellaneous expenses.</li>
                  <li><span className="font-semibold text-cyan-300">Institutional Policies:</span> Each institution has its own policies regarding how academic and athletic aid can be combined. Some schools may have stricter limits or specific procedures for stacking scholarships.</li>
                  <li><span className="font-semibold text-cyan-300">Reporting Requirements:</span> All financial aid received by a student-athlete must be reported to the institution's compliance office to ensure adherence to NCAA regulations and avoid potential penalties.</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Additional Scholarship Scenarios */}
          <section className="py-16 px-4 md:px-8 lg:px-16 max-w-7xl mx-auto">
            <h2 className="text-4xl font-bold text-white mb-10 text-center flex items-center justify-center">
              <Lightbulb className="mr-4 text-[#1E90FF]" size={40} /> Additional Scholarship Scenarios
            </h2>
            <div className="grid md:grid-cols-2 gap-12">
              <div className="bg-[#0d1a3a] p-8 rounded-xl shadow-2xl border border-blue-700/50">
                <h3 className="text-2xl font-bold text-white mb-4 flex items-center"><GraduationCap className="mr-3 text-blue-400" /> Graduate Scholarship Rules Deep Dive</h3>
                <p className="text-lg text-gray-300 leading-relaxed mb-4">
                  For student-athletes looking to continue their academic and athletic careers beyond their undergraduate degree, graduate scholarships offer a unique opportunity. The NCAA permits institutions to offer athletic aid to graduate students, provided they meet specific criteria. This typically involves maintaining good academic standing, having remaining athletic eligibility (which can be complex to determine after undergraduate play), and being admitted into a graduate program. The rules can vary significantly between divisions and institutions, making it essential for prospective graduate student-athletes to work closely with compliance officers and graduate admissions to ensure all requirements are met. This pathway allows athletes to pursue advanced degrees while still competing at a high level.
                </p>
                <ul className="list-disc list-inside text-gray-300 space-y-3">
                  <li><span className="font-semibold text-cyan-300">Eligibility for Graduate Students:</span> Must be enrolled in a graduate program and meet NCAA academic progress standards.</li>
                  <li><span className="font-semibold text-cyan-300">Remaining Eligibility:</span> Athletes must have remaining years of competition according to NCAA rules, which can be affected by redshirt years or previous transfer waivers.</li>
                  <li><span className="font-semibold text-cyan-300">Institutional Discretion:</span> The decision to offer graduate athletic aid rests with the individual institution and its athletic department.</li>
                </ul>
              </div>
              <div className="bg-[#0d1a3a] p-8 rounded-xl shadow-2xl border border-blue-700/50">
                <h3 className="text-2xl font-bold text-white mb-4 flex items-center"><CalendarDays className="mr-3 text-blue-400" /> 5th Year Scholarship Nuances</h3>
                <p className="text-lg text-gray-300 leading-relaxed mb-4">
                  The concept of a "5th year scholarship" often refers to an additional year of athletic financial aid granted to a student-athlete beyond their initial four years of eligibility. This is typically facilitated through a medical redshirt, where an athlete misses a significant portion of a season due to injury or illness, or a hardship waiver, granted for other unforeseen circumstances. This extension allows athletes to complete their athletic career and academic degree, often with continued financial support. It's a critical mechanism for athletes whose careers are interrupted by factors beyond their control, providing them with the opportunity to return to competition and finish their education on scholarship.
                </p>
                <ul className="list-disc list-inside text-gray-300 space-y-3">
                  <li><span className="font-semibold text-cyan-300">Medical Redshirt:</span> Common for athletes who suffer season-ending injuries early in their career.</li>
                  <li><span className="font-semibold text-cyan-300">Hardship Waiver:</span> Can be granted for other extenuating circumstances, such as a family tragedy or other significant life events impacting athletic participation.</li>
                  <li><span className="font-semibold text-cyan-300">Academic Progress:</span> Must continue to meet academic eligibility requirements to utilize the 5th year.</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Walk-on to Scholarship Pathways */}
          <section className="py-16 px-4 md:px-8 lg:px-16 max-w-7xl mx-auto">
            <h2 className="text-4xl font-bold text-white mb-10 text-center flex items-center justify-center">
              <TrendingUp className="mr-4 text-[#00FFFF]" size={40} /> Walk-on to Scholarship Pathways
            </h2>
            <div className="bg-[#0d1a3a] p-8 rounded-xl shadow-2xl border border-cyan-700/50">
              <p className="text-lg text-gray-300 leading-relaxed mb-4">
                The journey from a walk-on athlete to a scholarship recipient is a testament to dedication, hard work, and perseverance. Many successful collegiate athletes, particularly in equivalency sports, begin their careers without athletic aid, proving their value to the team through their performance, commitment, and academic achievement. This pathway not only demonstrates an athlete's resilience but also opens doors to significant opportunities, as coaches often reward deserving walk-ons with scholarships as they become available due to various factors like transfers, graduation, or improved team budgets. This process highlights the meritocratic aspect of collegiate athletics, where talent and effort can ultimately lead to financial recognition.
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-3">
                <li><span className="font-semibold text-cyan-300">Earn Your Spot:</span> Walk-ons earn scholarships by consistently performing at a high level and demonstrating commitment to the team.</li>
                <li><span className="font-semibold text-cyan-300">Scholarship Availability:</span> Opportunities often arise from unused scholarship limits, athletes leaving the program, or increased team budgets.</li>
                <li><span className="font-semibold text-cyan-300">Persistence Pays Off:</span> A common route for athletes in equivalency sports, where partial scholarships can be awarded.</li>
                <li><span className="font-semibold text-cyan-300">Impact on Team Culture:</span> Walk-ons who earn scholarships often become leaders and embody the team's work ethic.</li>
              </ul>
            </div>
          </section>

          {/* Olympic Sport Scholarship Limits */}
          <section className="py-16 px-4 md:px-8 lg:px-16 max-w-7xl mx-auto">
            <h2 className="text-4xl font-bold text-white mb-10 text-center flex items-center justify-center">
              <BarChart className="mr-4 text-[#1E90FF]" size={40} /> Olympic Sport Scholarship Limits
            </h2>
            <div className="bg-[#0d1a3a] p-8 rounded-xl shadow-2xl border border-blue-700/50">
              <p className="text-lg text-gray-300 leading-relaxed mb-4">
                Scholarship limits for Olympic sports (e.g., swimming, track & field, gymnastics, soccer, volleyball, wrestling) often differ significantly from those in high-revenue sports like football and basketball. Most Olympic sports are classified as equivalency sports, meaning coaches have a total scholarship budget to distribute among their athletes, leading to a prevalence of partial scholarships. Understanding these specific limits, which vary by sport, NCAA division, and gender, is crucial for athletes and their families when evaluating financial aid offers and planning their collegiate careers. These limits are designed to promote broad-based participation and ensure a wide range of athletic opportunities.
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-3">
                <li><span className="font-semibold text-cyan-300">Sport-Specific Limits:</span> The NCAA sets specific maximum scholarship limits for each Olympic sport, which can vary by division (e.g., Division I, II).</li>
                <li><span className="font-semibold text-cyan-300">Equivalency Focus:</span> Coaches often award partial scholarships to maximize the number of athletes receiving aid within their overall budget.</li>
                <li><span className="font-semibold text-cyan-300">Gender Equity:</span> Title IX considerations play a significant role in how scholarship dollars are allocated across men's and women's Olympic sports.</li>
                <li><span className="font-semibold text-cyan-300">Recruiting Strategy:</span> Coaches in Olympic sports often recruit a larger roster, with many athletes receiving partial aid or being walk-ons.</li>
              </ul>
            </div>
          </section>

          {/* Academic Scholarship Stacking with Athletic Aid */}
          <section className="py-16 px-4 md:px-8 lg:px-16 max-w-7xl mx-auto">
            <h2 className="text-4xl font-bold text-white mb-10 text-center flex items-center justify-center">
              <Lightbulb className="mr-4 text-[#00FFFF]" size={40} /> Academic Scholarship Stacking with Athletic Aid
            </h2>
            <div className="bg-[#0d1a3a] p-8 rounded-xl shadow-2xl border border-blue-700/50">
              <p className="text-lg text-gray-300 leading-relaxed mb-4">
                Student-athletes often have the opportunity to combine academic scholarships with their athletic aid, a practice known as scholarship stacking. This can significantly enhance their overall financial support. However, it's crucial to navigate the specific NCAA rules and institutional policies that govern how these different types of aid can be combined. The total amount of financial aid, including both athletic and academic scholarships, cannot exceed the student-athlete's full cost of attendance as determined by the institution. Understanding these limits and policies is essential to maximize financial benefits while maintaining NCAA eligibility. This strategy allows student-athletes to leverage their academic achievements alongside their athletic talents to secure comprehensive financial packages.
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-3">
                <li><span className="font-semibold text-cyan-300">NCAA Limits:</span> Total aid from all sources (athletic, academic, need-based) cannot exceed the student-athlete's full cost of attendance, which includes tuition, fees, room, board, books, and other miscellaneous expenses.</li>
                <li><span className="font-semibold text-cyan-300">Institutional Policies:</span> Each institution has its own policies regarding how academic and athletic aid can be combined. Some schools may have stricter limits or specific procedures for stacking scholarships.</li>
                <li><span className="font-semibold text-cyan-300">Reporting Requirements:</span> All financial aid received by a student-athlete must be reported to the institution's compliance office to ensure adherence to NCAA regulations and avoid potential penalties.</li>
                <li><span className="font-semibold text-cyan-300">Academic Performance:</span> Maintaining strong academic performance is key to securing and retaining academic scholarships, which can complement athletic aid.</li>
              </ul>
            </div>
          </section>

          {/* House Settlement Changes */}
          <section className="py-16 px-4 md:px-8 lg:px-16 max-w-7xl mx-auto">
            <h2 className="text-4xl font-bold text-white mb-10 text-center flex items-center justify-center">
              <Landmark className="mr-4 text-[#1E90FF]" size={40} /> House Settlement Scholarship Changes
            </h2>
            <div className="bg-[#0d1a3a] p-8 rounded-xl shadow-2xl border border-blue-700/50">
              <p className="text-lg text-gray-300 leading-relaxed mb-4">
                  The landmark House v. NCAA settlement, a pivotal moment in collegiate athletics, is poised to fundamentally reshape the landscape of student-athlete compensation and scholarship structures. This historic agreement, stemming from antitrust claims, introduces a framework that could lead to direct payments to athletes, moving beyond the traditional scholarship model. The settlement addresses past and future damages related to Name, Image, and Likeness (NIL) rights and aims to establish a new revenue-sharing model between institutions and student-athletes. This shift is expected to have profound implications for recruiting, athlete retention, and the overall financial ecosystem of college sports, requiring institutions and athletes alike to adapt to a new era of collegiate athletics.
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-3">
                <li><span className="font-semibold text-cyan-300">Direct Payments:</span> Potential for schools to directly pay athletes, beyond traditional scholarships.</li>
                <li><span className="font-semibold text-cyan-300">Revenue Sharing:</span> A framework for revenue sharing with student-athletes.</li>
                <li><span className="font-semibold text-cyan-300">Retroactive Damages:</span> Includes provisions for past and future damages.</li>
                <li><span className="font-semibold text-cyan-300">Impact on Recruiting:</span> Could fundamentally alter recruiting dynamics and athlete retention.</li>
              </ul>
              <p className="text-lg text-gray-300 leading-relaxed mt-6">
                AthlynXAI is continuously monitoring these developments to provide the most up-to-date information and guidance for athletes navigating this evolving landscape.
              </p>
            </div>
          </section>

          {/* Footer Note */}
          <footer className="py-10 px-4 md:px-8 lg:px-16 bg-[#0d1a3a] text-gray-400 text-center border-t border-blue-900">
            <p className="text-sm mb-2">
              Disclaimer: The information provided on this page is for general informational purposes only and does not constitute legal or financial advice. Student-athletes should consult with their institution's compliance office, legal counsel, or financial advisors for personalized guidance.
            </p>
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

export default ScholarshipContracts;
