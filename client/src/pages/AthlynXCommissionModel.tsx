import DashboardLayout from "@/components/DashboardLayout";
import MobileBottomNav from "@/components/MobileBottomNav";
import { RouteErrorBoundary } from '@/components/GlobalErrorBoundary';
import { DollarSign, Percent, PiggyBank, Home, Briefcase, TrendingUp, ShieldCheck, LifeBuoy } from "lucide-react";
import { Link } from "wouter";

const AthlynXCommissionModel = () => {
  return (
    <RouteErrorBoundary>
      <DashboardLayout>
        <div className="min-h-screen bg-[#050c1a] text-white font-sans">
          {/* Hero Section */}
          <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-[#1E90FF] to-[#4169E1] text-center">
            <h1 className="text-5xl font-black mb-4 leading-tight">AthlynX Commission Model</h1>
            <p className="text-xl text-blue-200 mb-8">Empowering Athletes, Building Legacies</p>
            <p className="text-lg text-blue-300 max-w-3xl mx-auto">
              At AthlynX, our mission is to revolutionize athlete management by fostering financial literacy and long-term wealth creation. We believe in transparency, ethical practices, and ensuring our athletes thrive both on and off the field.
            </p>
          </section>

          {/* Main Content */}
          <main className="container mx-auto py-16 px-4 sm:px-6 lg:px-8">
            {/* AthlynX Fee Structure */}
            <section className="mb-16">
              <h2 className="text-4xl font-black mb-8 text-center text-[#00FFFF]">AthlynX Fee Structure</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                <div className="bg-[#0d1a3a] rounded-2xl border border-blue-700/50 p-6 shadow-lg">
                  <DollarSign className="text-[#1E90FF] mb-4" size={32} />
                  <h3 className="text-2xl font-bold mb-2">Pro Contracts</h3>
                  <p className="text-blue-300">3-5% of athlete contracts from teams.</p>
                </div>
                <div className="bg-[#0d1a3a] rounded-2xl border border-blue-700/50 p-6 shadow-lg">
                  <Percent className="text-[#1E90FF] mb-4" size={32} />
                  <h3 className="text-2xl font-bold mb-2">NIL/Endorsement Deals</h3>
                  <p className="text-blue-300">10-15% of Name, Image, and Likeness (NIL) / endorsement deals.</p>
                </div>
                <div className="bg-[#0d1a3a] rounded-2xl border border-blue-700/50 p-6 shadow-lg">
                  <PiggyBank className="text-[#1E90FF] mb-4" size={32} />
                  <h3 className="text-2xl font-bold mb-2">Scholarship Value</h3>
                  <p className="text-blue-300">5% of scholarship value for college athletes.</p>
                </div>
                <div className="bg-[#0d1a3a] rounded-2xl border border-blue-700/50 p-6 shadow-lg">
                  <Home className="text-[#1E90FF] mb-4" size={32} />
                  <h3 className="text-2xl font-bold mb-2">Youth Development</h3>
                  <p className="text-blue-300">2-3% from travel ball/AAU/club team parents for youth development.</p>
                </div>
                <div className="bg-[#0d1a3a] rounded-2xl border border-blue-700/50 p-6 shadow-lg">
                  <TrendingUp className="text-[#1E90FF] mb-4" size={32} />
                  <h3 className="text-2xl font-bold mb-2">Platform Subscriptions</h3>
                  <ul className="list-disc list-inside text-blue-300">
                    <li>Youth: $9.99/month</li>
                    <li>College: $29.99/month</li>
                    <li>Pro: $99.99/month</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* What AthlynX takes from the ATHLETE */}
            <section className="mb-16">
              <h2 className="text-4xl font-black mb-8 text-center text-[#00FFFF]">What AthlynX Takes from the ATHLETE</h2>
              <div className="grid md:grid-cols-3 gap-8">
                <div className="bg-[#0d1a3a] rounded-2xl border border-blue-700/50 p-6 shadow-lg">
                  <Briefcase className="text-[#00FFFF] mb-4" size={32} />
                  <h3 className="text-2xl font-bold mb-2">Pro Contracts</h3>
                  <p className="text-blue-300">3% management fee on professional contracts.</p>
                </div>
                <div className="bg-[#0d1a3a] rounded-2xl border border-blue-700/50 p-6 shadow-lg">
                  <Percent className="text-[#00FFFF] mb-4" size={32} />
                  <h3 className="text-2xl font-bold mb-2">Endorsement/NIL Deals</h3>
                  <p className="text-blue-300">10% on endorsement/NIL deals.</p>
                </div>
                <div className="bg-[#0d1a3a] rounded-2xl border border-blue-700/50 p-6 shadow-lg">
                  <PiggyBank className="text-[#00FFFF] mb-4" size={32} />
                  <h3 className="text-2xl font-bold mb-2">Scholarship Packages</h3>
                  <p className="text-blue-300">5% on scholarship packages.</p>
                </div>
              </div>
            </section>

            {/* What AthlynX takes from TEAMS/BRANDS */}
            <section className="mb-16">
              <h2 className="text-4xl font-black mb-8 text-center text-[#00FFFF]">What AthlynX Takes from TEAMS/BRANDS</h2>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-[#0d1a3a] rounded-2xl border border-blue-700/50 p-6 shadow-lg">
                  <DollarSign className="text-[#1E90FF] mb-4" size={32} />
                  <h3 className="text-2xl font-bold mb-2">Contracts Facilitated</h3>
                  <p className="text-blue-300">5% finder's fee on contracts facilitated through AthlynX.</p>
                </div>
                <div className="bg-[#0d1a3a] rounded-2xl border border-blue-700/50 p-6 shadow-lg">
                  <Briefcase className="text-[#1E90FF] mb-4" size={32} />
                  <h3 className="text-2xl font-bold mb-2">Brand Deals Sourced</h3>
                  <p className="text-blue-300">15% on brand deals sourced through AthlynX.</p>
                </div>
              </div>
            </section>

            {/* ATHLETE INVESTMENT MODEL */}
            <section className="mb-16">
              <h2 className="text-4xl font-black mb-8 text-center text-[#00FFFF]">ATHLETE INVESTMENT MODEL</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                <div className="bg-[#0d1a3a] rounded-2xl border border-blue-700/50 p-6 shadow-lg">
                  <ShieldCheck className="text-[#00FFFF] mb-4" size={32} />
                  <h3 className="text-2xl font-bold mb-2">The 50% Rule</h3>
                  <p className="text-blue-300">Never spend more than 50% of your income. The rest is for savings and investment.</p>
                </div>
                <div className="bg-[#0d1a3a] rounded-2xl border border-blue-700/50 p-6 shadow-lg">
                  <PiggyBank className="text-[#00FFFF] mb-4" size={32} />
                  <h3 className="text-2xl font-bold mb-2">Mandatory Savings Tiers</h3>
                  <p className="text-blue-300">Structured savings plans tailored to career stage and income level.</p>
                </div>
                <div className="bg-[#0d1a3a] rounded-2xl border border-blue-700/50 p-6 shadow-lg">
                  <TrendingUp className="text-[#00FFFF] mb-4" size={32} />
                  <h3 className="text-2xl font-bold mb-2">Index Fund Strategy</h3>
                  <p className="text-blue-300">Long-term growth through diversified, low-cost index funds.</p>
                </div>
                <div className="bg-[#0d1a3a] rounded-2xl border border-blue-700/50 p-6 shadow-lg">
                  <Home className="text-[#00FFFF] mb-4" size={32} />
                  <h3 className="text-2xl font-bold mb-2">Real Estate Pathway</h3>
                  <p className="text-blue-300">Guidance and opportunities for real estate investment.</p>
                </div>
                <div className="bg-[#0d1a3a] rounded-2xl border border-blue-700/50 p-6 shadow-lg">
                  <Briefcase className="text-[#00FFFF] mb-4" size={32} />
                  <h3 className="text-2xl font-bold mb-2">Business Ownership</h3>
                  <p className="text-blue-300">Support and resources for entrepreneurial ventures.</p>
                </div>
              </div>
            </section>

            {/* YOUTH/PARENT REVENUE */}
            <section className="mb-16">
              <h2 className="text-4xl font-black mb-8 text-center text-[#00FFFF]">YOUTH/PARENT REVENUE</h2>
              <div className="grid md:grid-cols-3 gap-8">
                <div className="bg-[#0d1a3a] rounded-2xl border border-blue-700/50 p-6 shadow-lg">
                  <DollarSign className="text-[#1E90FF] mb-4" size={32} />
                  <h3 className="text-2xl font-bold mb-2">Family Plan</h3>
                  <p className="text-blue-300">$9.99/month for comprehensive youth athlete support.</p>
                </div>
                <div className="bg-[#0d1a3a] rounded-2xl border border-blue-700/50 p-6 shadow-lg">
                  <Percent className="text-[#1E90FF] mb-4" size={32} />
                  <h3 className="text-2xl font-bold mb-2">Travel Ball Tournament Fees</h3>
                  <p className="text-blue-300">2% of travel ball tournament fees.</p>
                </div>
                <div className="bg-[#0d1a3a] rounded-2xl border border-blue-700/50 p-6 shadow-lg">
                  <Briefcase className="text-[#1E90FF] mb-4" size={32} />
                  <h3 className="text-2xl font-bold mb-2">Recruiting Showcase Fees</h3>
                  <p className="text-blue-300">3% of recruiting showcase fees.</p>
                </div>
              </div>
            </section>

            {/* RETIREMENT PLANNING */}
            <section className="mb-16">
              <h2 className="text-4xl font-black mb-8 text-center text-[#00FFFF]">RETIREMENT PLANNING</h2>
              <div className="grid md:grid-cols-4 gap-8">
                <div className="bg-[#0d1a3a] rounded-2xl border border-blue-700/50 p-6 shadow-lg">
                  <PiggyBank className="text-[#00FFFF] mb-4" size={32} />
                  <h3 className="text-2xl font-bold mb-2">20% Paycheck Rule</h3>
                  <p className="text-blue-300">20% of every paycheck allocated to a dedicated retirement fund.</p>
                </div>
                <div className="bg-[#0d1a3a] rounded-2xl border border-blue-700/50 p-6 shadow-lg">
                  <LifeBuoy className="text-[#00FFFF] mb-4" size={32} />
                  <h3 className="text-2xl font-bold mb-2">Roth IRA for Athletes</h3>
                  <p className="text-blue-300">Strategic use of Roth IRAs for tax-advantaged growth.</p>
                </div>
                <div className="bg-[#0d1a3a] rounded-2xl border border-blue-700/50 p-6 shadow-lg">
                  <ShieldCheck className="text-[#00FFFF] mb-4" size={32} />
                  <h3 className="text-2xl font-bold mb-2">Life Insurance</h3>
                  <p className="text-blue-300">Comprehensive life insurance policies for financial security.</p>
                </div>
                <div className="bg-[#0d1a3a] rounded-2xl border border-blue-700/50 p-6 shadow-lg">
                  <ShieldCheck className="text-[#00FFFF] mb-4" size={32} />
                  <h3 className="text-2xl font-bold mb-2">Disability Insurance</h3>
                  <p className="text-blue-300">Protection against career-ending injuries or illnesses.</p>
                </div>
              </div>
            </section>

            {/* Founder's Philosophy */}
            <section className="mb-16 text-center">
              <h2 className="text-4xl font-black mb-4 text-[#00FFFF]">Founder's Philosophy</h2>
              <blockquote className="text-xl italic text-blue-200 max-w-3xl mx-auto border-l-4 border-[#1E90FF] pl-4">
                "The sport may not be there forever. Build your legacy off the field."
                <footer className="mt-2 text-blue-300">- Chad Dozier Sr., Founder of AthlynXAI</footer>
              </blockquote>
            </section>

            {/* Fee Calculator Table */}
            <section className="mb-16">
              <h2 className="text-4xl font-black mb-8 text-center text-[#00FFFF]">Fee Calculator Examples</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse rounded-2xl overflow-hidden">
                  <thead>
                    <tr className="bg-[#1E90FF] text-white">
                      <th className="p-4 font-bold">Scenario</th>
                      <th className="p-4 font-bold">Athlete Income</th>
                      <th className="p-4 font-bold">AthlynX Earns (Athlete)</th>
                      <th className="p-4 font-bold">AthlynX Earns (Team/Brand)</th>
                      <th className="p-4 font-bold">Total AthlynX Earns</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="bg-[#0d1a3a] border-b border-blue-700/50">
                      <td className="p-4 text-blue-300">Pro Contract</td>
                      <td className="p-4 text-blue-300">$1,000,000</td>
                      <td className="p-4 text-blue-300">$30,000 (3%)</td>
                      <td className="p-4 text-blue-300">$50,000 (5%)</td>
                      <td className="p-4 text-blue-300">$80,000</td>
                    </tr>
                    <tr className="bg-[#050c1a] border-b border-blue-700/50">
                      <td className="p-4 text-blue-300">NIL/Endorsement Deal</td>
                      <td className="p-4 text-blue-300">$100,000</td>
                      <td className="p-4 text-blue-300">$10,000 - $15,000 (10-15%)</td>
                      <td className="p-4 text-blue-300">$15,000 (15%)</td>
                      <td className="p-4 text-blue-300">$25,000 - $30,000</td>
                    </tr>
                    <tr className="bg-[#0d1a3a]">
                      <td className="p-4 text-blue-300">Scholarship Package</td>
                      <td className="p-4 text-blue-300">$50,000</td>
                      <td className="p-4 text-blue-300">$2,500 (5%)</td>
                      <td className="p-4 text-blue-300">N/A</td>
                      <td className="p-4 text-blue-300">$2,500</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>
          </main>

          {/* Footer */}
          <footer className="py-8 text-center text-blue-300 text-sm bg-[#0d1a3a] border-t border-blue-700/50">
            <p>Copyright © 2026 Chad A. Dozier Sr. / AthlynXAI. All rights reserved.</p>
          </footer>
        </div>
        <MobileBottomNav />
      </DashboardLayout>
    </RouteErrorBoundary>
  );
};

export default AthlynXCommissionModel;
