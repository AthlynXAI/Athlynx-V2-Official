import React from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { RouteErrorBoundary } from '@/components/GlobalErrorBoundary';
import MobileBottomNav from '@/components/MobileBottomNav';
import { PiggyBank, Handshake, TrendingUp, Landmark, Gift, Trophy, DollarSign, Award, Users } from 'lucide-react';

interface EndowmentData {
  school: string;
  endowment: string;
  year: number;
}

interface GiftType {
  type: string;
  description: string;
}

const topAthleticEndowments: EndowmentData[] = [
  { school: 'University of Texas', endowment: '$3.3 Billion', year: 2023 },
  { school: 'Stanford University', endowment: '$2.8 Billion', year: 2023 },
  { school: 'Texas A&M University', endowment: '$2.5 Billion', year: 2023 },
  { school: 'University of Notre Dame', endowment: '$2.0 Billion', year: 2023 },
  { school: 'Ohio State University', endowment: '$1.8 Billion', year: 2023 },
  { school: 'University of Michigan', endowment: '$1.7 Billion', year: 2023 },
  { school: 'University of Florida', endowment: '$1.5 Billion', year: 2023 },
  { school: 'University of Southern California', endowment: '$1.4 Billion', year: 2023 },
  { school: 'University of Alabama', endowment: '$1.3 Billion', year: 2023 },
  { school: 'Penn State University', endowment: '$1.2 Billion', year: 2023 },
];

const giftTypes: GiftType[] = [
  { type: 'Restricted Gifts', description: 'Donations designated by the donor for a specific purpose, such as a particular sport, scholarship, or facility project. These funds must be used exactly as specified.' },
  { type: 'Unrestricted Gifts', description: 'Donations that can be used by the athletic department or university for any purpose deemed necessary, offering maximum flexibility in addressing immediate needs or strategic initiatives.' },
  { type: 'Donor-Advised Funds (DAFs)', description: 'Charitable giving vehicles administered by a public charity. Donors make an irrevocable contribution to the DAF and can recommend grants to qualified charities, including athletic programs, over time.' },
  { type: 'Planned Gifts', description: 'Donations made through bequests, trusts, or annuities, often allowing donors to make significant contributions while also receiving financial or tax benefits.' },
];

const AlumniEndowment: React.FC = () => {
  return (
    <RouteErrorBoundary>
      <DashboardLayout>
        <div className="min-h-screen bg-[#050c1a] text-gray-100 font-sans">
          {/* Hero Section */}
          <section className="relative py-24 px-8 md:px-16 lg:px-24 bg-gradient-to-br from-[#0d1a3a] to-[#050c1a] overflow-hidden">
            <div className="absolute inset-0 z-0 opacity-10">
              {/* Stadium lights aesthetic */}
              <div className="absolute top-0 left-1/4 w-48 h-48 bg-[#1E90FF] rounded-full mix-blend-screen filter blur-3xl opacity-30 animate-pulse"></div>
              <div className="absolute bottom-1/4 right-1/3 w-64 h-64 bg-[#00FFFF] rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-pulse delay-200"></div>
              <div className="absolute top-1/3 right-1/4 w-56 h-56 bg-[#1E90FF] rounded-full mix-blend-screen filter blur-3xl opacity-25 animate-pulse delay-400"></div>
            </div>
            <div className="relative z-10 max-w-4xl mx-auto text-center">
              <h1 className="text-5xl md:text-6xl font-bold text-[#00FFFF] leading-tight mb-6 drop-shadow-lg">
                Alumni Endowment & Athletic Funding
              </h1>
              <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl mx-auto">
                Explore the intricate ecosystem of university alumni support, athletic funding, and the strategic financial instruments powering collegiate sports.
              </p>
              <div className="flex justify-center space-x-4">
                <button className="px-8 py-3 bg-[#1E90FF] text-white rounded-full text-lg font-semibold hover:bg-opacity-90 transition duration-300 shadow-lg">
                  Learn About NIL
                </button>
                <button className="px-8 py-3 border border-[#00FFFF] text-[#00FFFF] rounded-full text-lg font-semibold hover:bg-[#00FFFF] hover:text-[#0d1a3a] transition duration-300 shadow-lg">
                  Explore Donor Funds
                </button>
              </div>
            </div>
          </section>

          {/* Section: Alumni Donations & Athletic Departments */}
          <section className="py-16 px-8 md:px-16 lg:px-24 bg-[#0d1a3a]">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-4xl font-bold text-[#1E90FF] mb-10 text-center">
                <PiggyBank className="inline-block mr-3 text-[#00FFFF]" size={36} />
                The Flow of Philanthropy: Alumni to Athletics
              </h2>
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div>
                  <p className="text-lg text-gray-300 leading-relaxed mb-6">
                    Alumni donations form the bedrock of financial stability for many university athletic programs. These contributions, often channeled through university foundations or dedicated athletic booster clubs, directly impact everything from operational budgets to state-of-the-art facilities.
                  </p>
                  <p className="text-lg text-gray-300 leading-relaxed">
                    Understanding the pathways of these funds is crucial. While some donations are unrestricted, providing flexibility for athletic directors, many are earmarked for specific purposes, reflecting donors' passions for particular sports, scholarships, or capital projects.
                  </p>
                </div>
                <div className="bg-[#1a2b4d] p-8 rounded-xl shadow-xl border border-[#1E90FF] relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#1E90FF] to-transparent opacity-10 rounded-xl"></div>
                  <h3 className="text-2xl font-semibold text-[#00FFFF] mb-4 relative z-10">Key Funding Pathways</h3>
                  <ul className="list-disc list-inside text-gray-200 space-y-3 relative z-10">
                    <li>University Foundations & Endowments</li>
                    <li>Athletic Booster Clubs & Associations</li>
                    <li>Direct Gifts to Athletic Departments</li>
                    <li>Capital Campaign Pledges</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Section: NIL Collectives & Booster Rules */}
          <section className="py-16 px-8 md:px-16 lg:px-24 bg-[#050c1a]">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-4xl font-bold text-[#00FFFF] mb-10 text-center">
                <Handshake className="inline-block mr-3 text-[#1E90FF]" size={36} />
                NIL, Boosters, and NCAA Compliance
              </h2>
              <div className="grid md:grid-cols-2 gap-12 items-start">
                <div className="bg-[#1a2b4d] p-8 rounded-xl shadow-xl border border-[#00FFFF] relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#00FFFF] to-transparent opacity-10 rounded-xl"></div>
                  <h3 className="text-2xl font-semibold text-[#1E90FF] mb-4 relative z-10">NIL Collectives: A New Era</h3>
                  <p className="text-lg text-gray-300 leading-relaxed mb-4 relative z-10">
                    Name, Image, and Likeness (NIL) collectives, often funded by alumni and boosters, have reshaped the landscape of collegiate athletics. These entities facilitate opportunities for student-athletes to monetize their NIL, ranging from endorsement deals to appearances.
                  </p>
                  <p className="text-lg text-gray-300 leading-relaxed relative z-10">
                    While operating independently from universities, their close ties to alumni networks make them a significant force in recruiting and retaining talent. Understanding the evolving rules and ethical considerations is paramount for all stakeholders.
                  </p>
                </div>
                <div>
                  <h3 className="text-2xl font-semibold text-[#00FFFF] mb-4">Booster Rules Under NCAA</h3>
                  <p className="text-lg text-gray-300 leading-relaxed mb-6">
                    The NCAA maintains strict regulations regarding booster involvement to preserve amateurism and competitive equity. Boosters, defined broadly as anyone who has supported or promoted a university's athletic program, must adhere to rules preventing impermissible benefits to student-athletes.
                  </p>
                  <p className="text-lg text-gray-300 leading-relaxed">
                    With the advent of NIL, the lines have blurred, necessitating careful navigation. Universities actively educate alumni and supporters on compliance to avoid penalties that could impact their athletic programs.
                  </p>
                  <ul className="list-disc list-inside text-gray-200 space-y-2 mt-4">
                    <li>No direct payments for athletic performance.</li>
                    <li>NIL deals must be quid pro quo for services rendered.</li>
                    <li>Avoid recruiting inducements.</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Section: Endowment Investment Strategies & Scholarship Use */}
          <section className="py-16 px-8 md:px-16 lg:px-24 bg-[#0d1a3a]">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-4xl font-bold text-[#1E90FF] mb-10 text-center">
                <TrendingUp className="inline-block mr-3 text-[#00FFFF]" size={36} />
                Endowment Power: Investment & Impact
              </h2>
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div>
                  <h3 className="text-2xl font-semibold text-[#00FFFF] mb-4">Strategic Investment for Growth</h3>
                  <p className="text-lg text-gray-300 leading-relaxed mb-6">
                    University endowments are perpetual funds, designed to grow through investment and provide a stable income stream for the institution indefinitely. Investment strategies are typically long-term, diversified across various asset classes like equities, fixed income, real estate, and alternative investments.
                  </p>
                  <p className="text-lg text-gray-300 leading-relaxed">
                    The goal is to generate returns that can be spent while preserving the principal's purchasing power for future generations. A portion of these returns is then distributed annually to support university operations, including athletic scholarships and programs.
                  </p>
                </div>
                <div className="bg-[#1a2b4d] p-8 rounded-xl shadow-xl border border-[#1E90FF] relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#1E90FF] to-transparent opacity-10 rounded-xl"></div>
                  <h3 className="text-2xl font-semibold text-[#00FFFF] mb-4 relative z-10">Scholarships & Athletic Development</h3>
                  <p className="text-lg text-gray-300 leading-relaxed relative z-10">
                    Endowment returns are a critical source for funding athletic scholarships, enabling student-athletes to pursue higher education without financial burden. These scholarships are vital for attracting top talent and ensuring academic access.
                  </p>
                  <p className="text-lg text-gray-300 leading-relaxed relative z-10">
                    Beyond scholarships, endowment funds can support coaching salaries, facility upgrades, academic support services for athletes, and innovative sports science programs, directly contributing to the overall excellence and competitiveness of athletic departments.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Section: Tax Implications & Naming Rights */}
          <section className="py-16 px-8 md:px-16 lg:px-24 bg-[#050c1a]">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-4xl font-bold text-[#00FFFF] mb-10 text-center">
                <DollarSign className="inline-block mr-3 text-[#1E90FF]" size={36} />
                Financial & Legacy Considerations
              </h2>
              <div className="grid md:grid-cols-2 gap-12 items-start">
                <div className="bg-[#1a2b4d] p-8 rounded-xl shadow-xl border border-[#00FFFF] relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#00FFFF] to-transparent opacity-10 rounded-xl"></div>
                  <h3 className="text-2xl font-semibold text-[#1E90FF] mb-4 relative z-10">Tax Benefits for Donors</h3>
                  <p className="text-lg text-gray-300 leading-relaxed mb-4 relative z-10">
                    Donating to university athletic programs, especially through qualified charitable organizations, often comes with significant tax advantages. These can include deductions for charitable contributions, estate tax benefits, and capital gains tax avoidance for gifts of appreciated assets.
                  </p>
                  <p className="text-lg text-gray-300 leading-relaxed relative z-10">
                    It is always advisable for donors to consult with financial and tax professionals to understand the specific implications of their contributions and to maximize their philanthropic impact.
                  </p>
                </div>
                <div>
                  <h3 className="text-2xl font-semibold text-[#00FFFF] mb-4">Naming Rights Deals</h3>
                  <p className="text-lg text-gray-300 leading-relaxed mb-6">
                    Naming rights deals represent a significant revenue stream and a powerful way for major donors to leave a lasting legacy. These agreements involve a substantial financial contribution in exchange for the right to name a facility, stadium, arena, or even a specific program or scholarship.
                  </p>
                  <p className="text-lg text-gray-300 leading-relaxed">
                    Beyond the financial aspect, naming rights foster a deep connection between donors and the institutions they support, publicly recognizing their commitment and inspiring future generations of philanthropists.
                  </p>
                  <ul className="list-disc list-inside text-gray-200 space-y-2 mt-4">
                    <li>Facilities (stadiums, arenas, training centers)</li>
                    <li>Academic Centers for Athletes</li>
                    <li>Endowed Coaching Positions</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Section: Capital Campaigns & Gift Types */}
          <section className="py-16 px-8 md:px-16 lg:px-24 bg-[#0d1a3a]">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-4xl font-bold text-[#1E90FF] mb-10 text-center">
                <Landmark className="inline-block mr-3 text-[#00FFFF]" size={36} />
                Building the Future: Campaigns & Contributions
              </h2>
              <div className="grid md:grid-cols-2 gap-12 items-start">
                <div>
                  <h3 className="text-2xl font-semibold text-[#00FFFF] mb-4">Capital Campaigns for Facilities</h3>
                  <p className="text-lg text-gray-300 leading-relaxed mb-6">
                    Capital campaigns are intensive fundraising efforts undertaken by universities to secure significant financial commitments for large-scale projects, most notably new athletic facilities or major renovations. These campaigns are crucial for providing student-athletes with cutting-edge training environments and competition venues.
                  </p>
                  <p className="text-lg text-gray-300 leading-relaxed">
                    Successful campaigns often involve multi-year pledges from alumni, corporations, and foundations, transforming the physical infrastructure of athletic programs and enhancing the overall student-athlete experience.
                  </p>
                </div>
                <div className="bg-[#1a2b4d] p-8 rounded-xl shadow-xl border border-[#1E90FF] relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#1E90FF] to-transparent opacity-10 rounded-xl"></div>
                  <h3 className="text-2xl font-semibold text-[#00FFFF] mb-4 relative z-10">Restricted vs. Unrestricted Gifts</h3>
                  <div className="space-y-6 relative z-10">
                    {giftTypes.map((gift, index) => (
                      <div key={index} className="flex items-start">
                        <Gift className="flex-shrink-0 mr-4 mt-1 text-[#00FFFF]" size={24} />
                        <div>
                          <p className="font-semibold text-gray-100 text-xl mb-1">{gift.type}</p>
                          <p className="text-gray-300 text-lg">{gift.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Section: Top 10 Athletic Endowments */}
          <section className="py-16 px-8 md:px-16 lg:px-24 bg-[#050c1a]">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-4xl font-bold text-[#00FFFF] mb-10 text-center">
                <Trophy className="inline-block mr-3 text-[#1E90FF]" size={36} />
                Leading the Pack: Top Athletic Endowments
              </h2>
              <p className="text-lg text-gray-300 leading-relaxed mb-8 text-center max-w-3xl mx-auto">
                A look at the universities with the largest athletic endowments, showcasing the significant financial power underpinning their sports programs and long-term stability.
              </p>
              <div className="overflow-x-auto">
                <table className="min-w-full bg-[#1a2b4d] rounded-xl shadow-xl border border-[#00FFFF]">
                  <thead>
                    <tr className="bg-[#1E90FF] text-white text-left text-lg">
                      <th className="py-4 px-6 rounded-tl-xl">Rank</th>
                      <th className="py-4 px-6">School</th>
                      <th className="py-4 px-6">Athletic Endowment (Est.)</th>
                      <th className="py-4 px-6 rounded-tr-xl">Year</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topAthleticEndowments.map((data, index) => (
                      <tr key={index} className={`${index % 2 === 0 ? 'bg-[#0d1a3a]' : 'bg-[#1a2b4d]'} hover:bg-[#2a3c5e] transition duration-200`}>
                        <td className="py-3 px-6 text-gray-200 text-lg">{index + 1}</td>
                        <td className="py-3 px-6 text-[#00FFFF] font-medium text-lg">{data.school}</td>
                        <td className="py-3 px-6 text-gray-200 text-lg">{data.endowment}</td>
                        <td className="py-3 px-6 text-gray-200 text-lg">{data.year}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          {/* Footer Note */}
          <footer className="py-8 px-8 md:px-16 lg:px-24 bg-[#0d1a3a] text-center text-gray-400 text-sm border-t border-[#1E90FF] border-opacity-20">
            <p className="mb-2">Disclaimer: All financial figures are estimates based on publicly available data and may vary.</p>
            <p>Copyright © 2026 Chad A. Dozier Sr. / AthlynXAI. All rights reserved.</p>
          </footer>

          <MobileBottomNav />
        </div>
      </DashboardLayout>
    </RouteErrorBoundary>
  );
};

export default AlumniEndowment;
