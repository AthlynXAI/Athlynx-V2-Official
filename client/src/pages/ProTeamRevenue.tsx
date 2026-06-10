
import DashboardLayout from "@/components/DashboardLayout";
import MobileBottomNav from "@/components/MobileBottomNav";
import { RouteErrorBoundary } from '@/components/GlobalErrorBoundary';
import { DollarSign, Ticket, Building2, Car, Globe, Trophy, MonitorPlay, Users, PiggyBank, Handshake, TrendingUp, Wallet, Landmark, BarChart3, ShieldCheck, Coins, Briefcase, Zap, LineChart, Gem, Lightbulb, Gauge, Share2, Megaphone, CreditCard, Cloud, RefreshCcw, Building, Percent, Award, Star, Rocket, Factory, ScaleIcon, HandCoins, LineChartIcon, BuildingIcon, TrendingUpIcon, WalletIcon, HandshakeIcon, ShieldIcon, DollarSignIcon, TvIcon, TicketIcon, ShirtIcon, Building2Icon, CarIcon, GlobeIcon, TrophyIcon, MonitorPlayIcon, UsersIcon, ScaleIcon as ScaleIconLucide, BriefcaseIcon, ZapIcon, LineChartIcon as LineChartIconLucide, GemIcon, LightbulbIcon, GaugeIcon, Share2Icon, MegaphoneIcon, CreditCardIcon, CloudIcon, RefreshCcwIcon, BuildingIcon as BuildingIconLucide, PercentIcon, AwardIcon, StarIcon, RocketIcon, FactoryIcon, HandCoinsIcon, Banknote } from "lucide-react";

// Data for the revenue streams comparison table
const revenueData = [
  {
    league: "NFL",
    nationalTv: "$113B/11yr",
    localTv: "High",
    ticketsSuites: "Very High",
    merchandise: "High",
    stadiumNaming: "High",
    concessionsParking: "High",
    digitalStreaming: "High",
    jerseySponsorships: "N/A (Team Specific)",
    playerTradingFees: "N/A",
    expansionFees: "Very High (Rare)",
    privateEquity: "Growing",
    revenueSharing: "Significant",
    forbesValuations: "Avg. $5.1B",
  },
  {
    league: "NBA",
    nationalTv: "$76B/11yr",
    localTv: "High",
    ticketsSuites: "High",
    merchandise: "High",
    stadiumNaming: "High",
    concessionsParking: "High",
    digitalStreaming: "High",
    jerseySponsorships: "High",
    playerTradingFees: "N/A",
    expansionFees: "Very High (Rare)",
    privateEquity: "Growing",
    revenueSharing: "Moderate",
    forbesValuations: "Avg. $3.8B",
  },
  {
    league: "MLB",
    nationalTv: "$7.1B/7yr",
    localTv: "Very High",
    ticketsSuites: "High",
    merchandise: "Moderate",
    stadiumNaming: "Moderate",
    concessionsParking: "High",
    digitalStreaming: "Moderate",
    jerseySponsorships: "N/A (Team Specific)",
    playerTradingFees: "N/A",
    expansionFees: "Very High (Rare)",
    privateEquity: "Growing",
    revenueSharing: "Moderate",
    forbesValuations: "Avg. $2.3B",
  },
  {
    league: "NHL",
    nationalTv: "$625M/7yr",
    localTv: "Moderate",
    ticketsSuites: "Moderate",
    merchandise: "Moderate",
    stadiumNaming: "Moderate",
    concessionsParking: "Moderate",
    digitalStreaming: "Moderate",
    jerseySponsorships: "High",
    playerTradingFees: "N/A",
    expansionFees: "Very High (Rare)",
    privateEquity: "Growing",
    revenueSharing: "Moderate",
    forbesValuations: "Avg. $1.3B",
  },
  {
    league: "MLS",
    nationalTv: "$2.5B/10yr",
    localTv: "Moderate",
    ticketsSuites: "Moderate",
    merchandise: "Moderate",
    stadiumNaming: "Moderate",
    concessionsParking: "Moderate",
    digitalStreaming: "Growing",
    jerseySponsorships: "High",
    playerTradingFees: "N/A",
    expansionFees: "Very High (Rare)",
    privateEquity: "Growing",
    revenueSharing: "Moderate",
    forbesValuations: "Avg. $678M",
  },
];

const ProTeamRevenue = () => {
  return (
    <RouteErrorBoundary>
      <DashboardLayout>
        {/* Hero Section: Visually striking header with gradient and bold text */}
        <section className="relative h-64 flex items-center justify-center text-white bg-gradient-to-r from-[#1E90FF] to-[#4169E1] rounded-b-3xl shadow-lg mb-8 overflow-hidden">
          <div className="absolute inset-0 bg-cover bg-center opacity-10" style={{ backgroundImage: "url('/images/stadium-lights-bg.jpg')" }}></div>
          <div className="relative z-10 text-center p-4">
            <h1 className="text-6xl font-black tracking-tight mb-3 text-shadow-lg">ProTeam Revenue</h1>
            <p className="text-2xl font-bold text-blue-100 drop-shadow">The Financial Engine of Professional Sports</p>
          </div>
        </section>

        {/* Main Content Area: Structured with dark cards and spacious layout */}
        <main className="p-6 md:p-10 lg:p-12 space-y-12 max-w-7xl mx-auto">
          {/* Introduction to Revenue Streams */}
          <section className="bg-[#0d1a3a] p-8 rounded-2xl border border-blue-700/50 shadow-xl transition-all duration-300 hover:shadow-2xl hover:border-blue-600/70">
            <h2 className="text-4xl font-black text-white mb-6 flex items-center gap-3">
              <Banknote className="text-[#1E90FF] w-10 h-10" /> The Business of Sports
            </h2>
            <p className="text-blue-300 leading-relaxed text-lg">
              Professional sports teams are not just athletic competitors; they are sophisticated businesses generating billions of dollars annually. Their financial success hinges on a diverse portfolio of revenue streams, ranging from massive media deals to local fan engagement. Understanding these mechanisms is crucial for anyone looking to grasp the economics behind the games we love.
            </p>
          </section>

          {/* Key Revenue Streams Section */}
          <section className="space-y-8">
            <h2 className="text-4xl font-black text-white mb-6 text-center">Key Revenue Streams</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

              {/* National TV Contracts */}
              <div className="bg-[#0d1a3a] p-6 rounded-2xl border border-blue-700/50 shadow-lg flex flex-col items-center text-center transition-transform transform hover:scale-105">
                <TvIcon className="text-[#00FFFF] w-12 h-12 mb-4" />
                <h3 className="text-2xl font-bold text-white mb-2">National TV Contracts</h3>
                <p className="text-blue-300 text-base leading-relaxed">
                  The bedrock of modern sports finance. Leagues secure colossal deals with broadcasters for exclusive rights to air games, providing a stable and immense revenue base for all teams.
                </p>
                <ul className="text-blue-200 text-sm mt-4 list-disc list-inside text-left w-full">
                  <li>NFL: $113B/11yr</li>
                  <li>NBA: $76B/11yr</li>
                  <li>MLB: $7.1B/7yr</li>
                  <li>NHL: $625M/7yr</li>
                  <li>MLS: $2.5B/10yr</li>
                </ul>
              </div>

              {/* Local TV Rights */}
              <div className="bg-[#0d1a3a] p-6 rounded-2xl border border-blue-700/50 shadow-lg flex flex-col items-center text-center transition-transform transform hover:scale-105">
                <MonitorPlayIcon className="text-[#00FFFF] w-12 h-12 mb-4" />
                <h3 className="text-2xl font-bold text-white mb-2">Local TV Rights</h3>
                <p className="text-blue-300 text-base leading-relaxed">
                  Individual teams negotiate deals with regional sports networks, crucial for market-specific exposure and revenue, especially in leagues like MLB.
                </p>
              </div>

              {/* Ticket Sales & Premium Suites */}
              <div className="bg-[#0d1a3a] p-6 rounded-2xl border border-blue-700/50 shadow-lg flex flex-col items-center text-center transition-transform transform hover:scale-105">
                <TicketIcon className="text-[#00FFFF] w-12 h-12 mb-4" />
                <h3 className="text-2xl font-bold text-white mb-2">Ticket Sales & Premium Suites</h3>
                <p className="text-blue-300 text-base leading-relaxed">
                  Direct revenue from fans attending games. Premium seating, luxury boxes, and season tickets offer significant profit margins.
                </p>
              </div>

              {/* Merchandise & Licensing */}
              <div className="bg-[#0d1a3a] p-6 rounded-2xl border border-blue-700/50 shadow-lg flex flex-col items-center text-center transition-transform transform hover:scale-105">
                <ShirtIcon className="text-[#00FFFF] w-12 h-12 mb-4" />
                <h3 className="text-2xl font-bold text-white mb-2">Merchandise & Licensing</h3>
                <p className="text-blue-300 text-base leading-relaxed">
                  Sales of jerseys, hats, and other team-branded apparel, along with licensing agreements for various products, contribute to a global revenue stream.
                </p>
              </div>

              {/* Stadium Naming Rights */}
              <div className="bg-[#0d1a3a] p-6 rounded-2xl border border-blue-700/50 shadow-lg flex flex-col items-center text-center transition-transform transform hover:scale-105">
                <Building2Icon className="text-[#00FFFF] w-12 h-12 mb-4" />
                <h3 className="text-2xl font-bold text-white mb-2">Stadium Naming Rights</h3>
                <p className="text-blue-300 text-base leading-relaxed">
                  Lucrative deals where corporations pay to have their name associated with a team's home venue, often spanning decades.
                </p>
              </div>

              {/* Concessions & Parking */}
              <div className="bg-[#0d1a3a] p-6 rounded-2xl border border-blue-700/50 shadow-lg flex flex-col items-center text-center transition-transform transform hover:scale-105">
                <CarIcon className="text-[#00FFFF] w-12 h-12 mb-4" />
                <h3 className="text-2xl font-bold text-white mb-2">Concessions & Parking</h3>
                <p className="text-blue-300 text-base leading-relaxed">
                  On-site sales of food, beverages, and parking fees around the stadium or arena provide consistent game-day revenue.
                </p>
              </div>

              {/* International Broadcasting */}
              <div className="bg-[#0d1a3a] p-6 rounded-2xl border border-blue-700/50 shadow-lg flex flex-col items-center text-center transition-transform transform hover:scale-105">
                <GlobeIcon className="text-[#00FFFF] w-12 h-12 mb-4" />
                <h3 className="text-2xl font-bold text-white mb-2">International Broadcasting</h3>
                <p className="text-blue-300 text-base leading-relaxed">
                  As sports globalize, rights to broadcast games in international markets become increasingly valuable, expanding reach and revenue.
                </p>
              </div>

              {/* Jersey Sponsorships */}
              <div className="bg-[#0d1a3a] p-6 rounded-2xl border border-blue-700/50 shadow-lg flex flex-col items-center text-center transition-transform transform hover:scale-105">
                <TrophyIcon className="text-[#00FFFF] w-12 h-12 mb-4" />
                <h3 className="text-2xl font-bold text-white mb-2">Jersey Sponsorships</h3>
                <p className="text-blue-300 text-base leading-relaxed">
                  Companies pay to have their logos displayed on team jerseys, a highly visible form of advertising that generates significant income for teams.
                </p>
              </div>

              {/* Digital/Streaming Revenue */}
              <div className="bg-[#0d1a3a] p-6 rounded-2xl border border-blue-700/50 shadow-lg flex flex-col items-center text-center transition-transform transform hover:scale-105">
                <CloudIcon className="text-[#00FFFF] w-12 h-12 mb-4" />
                <h3 className="text-2xl font-bold text-white mb-2">Digital/Streaming Revenue</h3>
                <p className="text-blue-300 text-base leading-relaxed">
                  Partnerships with platforms like Apple TV+, Amazon Prime, and Peacock for exclusive streaming content and live games represent a growing revenue frontier.
                </p>
              </div>

              {/* Player Trading Fees */}
              <div className="bg-[#0d1a3a] p-6 rounded-2xl border border-blue-700/50 shadow-lg flex flex-col items-center text-center transition-transform transform hover:scale-105">
                <RefreshCcwIcon className="text-[#00FFFF] w-12 h-12 mb-4" />
                <h3 className="text-2xl font-bold text-white mb-2">Player Trading Fees</h3>
                <p className="text-blue-300 text-base leading-relaxed">
                  In some global sports, fees exchanged between clubs for player transfers can be a substantial income source, though less common in major US leagues.
                </p>
              </div>

              {/* Expansion Fees */}
              <div className="bg-[#0d1a3a] p-6 rounded-2xl border border-blue-700/50 shadow-lg flex flex-col items-center text-center transition-transform transform hover:scale-105">
                <RocketIcon className="text-[#00FFFF] w-12 h-12 mb-4" />
                <h3 className="text-2xl font-bold text-white mb-2">Expansion Fees</h3>
                <p className="text-blue-300 text-base leading-relaxed">
                  When a league adds new teams, existing owners receive a share of the hefty fees paid by the new franchises, a significant but infrequent windfall.
                </p>
              </div>

              {/* Private Equity Investment */}
              <div className="bg-[#0d1a3a] p-6 rounded-2xl border border-blue-700/50 shadow-lg flex flex-col items-center text-center transition-transform transform hover:scale-105">
                <PiggyBank className="text-[#00FFFF] w-12 h-12 mb-4" />
                <h3 className="text-2xl font-bold text-white mb-2">Private Equity Investment</h3>
                <p className="text-blue-300 text-base leading-relaxed">
                  Increasingly, private equity firms are investing in sports franchises, providing capital and seeking returns, adding another layer to team valuations.
                </p>
              </div>
            </div>
          </section>

          {/* Financial Mechanics Section */}
          <section className="space-y-8">
            <h2 className="text-4xl font-black text-white mb-6 text-center">Financial Mechanics & Valuations</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

              {/* Salary Cap Mechanics & Luxury Tax */}
              <div className="bg-[#0d1a3a] p-6 rounded-2xl border border-blue-700/50 shadow-lg flex flex-col items-center text-center transition-transform transform hover:scale-105">
                <ScaleIconLucide className="text-[#1E90FF] w-12 h-12 mb-4" />
                <h3 className="text-2xl font-bold text-white mb-2">Salary Cap & Luxury Tax</h3>
                <p className="text-blue-300 text-base leading-relaxed">
                  Mechanisms designed to promote competitive balance. Teams must manage player salaries within a cap, with penalties (luxury tax) for exceeding certain thresholds, impacting profitability.
                </p>
              </div>

              {/* Revenue Sharing Between Teams */}
              <div className="bg-[#0d1a3a] p-6 rounded-2xl border border-blue-700/50 shadow-lg flex flex-col items-center text-center transition-transform transform hover:scale-105">
                <HandshakeIcon className="text-[#1E90FF] w-12 h-12 mb-4" />
                <h3 className="text-2xl font-bold text-white mb-2">Revenue Sharing</h3>
                <p className="text-blue-300 text-base leading-relaxed">
                  A system where a portion of league-wide revenues (often from national media deals) is distributed among all teams, aiming to reduce disparities between large and small markets.
                </p>
              </div>

              {/* Forbes Team Valuations */}
              <div className="bg-[#0d1a3a] p-6 rounded-2xl border border-blue-700/50 shadow-lg flex flex-col items-center text-center transition-transform transform hover:scale-105">
                <TrendingUpIcon className="text-[#1E90FF] w-12 h-12 mb-4" />
                <h3 className="text-2xl font-bold text-white mb-2">Forbes Team Valuations</h3>
                <p className="text-blue-300 text-base leading-relaxed">
                  Annual assessments by Forbes magazine that estimate the market value of sports franchises, reflecting their overall financial health and future earning potential.
                </p>
              </div>
            </div>
          </section>

          {/* Data Table Section: Comparison of Revenue Streams Across Leagues */}
          <section className="bg-[#0d1a3a] p-8 rounded-2xl border border-blue-700/50 shadow-xl overflow-x-auto">
            <h2 className="text-4xl font-black text-white mb-6 flex items-center gap-3">
              <BarChart3 className="text-[#00FFFF] w-10 h-10" /> League Revenue Comparison
            </h2>
            <p className="text-blue-300 leading-relaxed text-lg mb-6">
              A comparative overview of how major North American sports leagues generate revenue across various categories. Note that "N/A" or "Team Specific" indicates variability or less direct applicability of a revenue stream at the league level.
            </p>
            <div className="min-w-full inline-block align-middle">
              <table className="min-w-full divide-y divide-blue-700/50">
                <thead className="bg-[#050c1a]">
                  <tr>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-bold text-blue-200 uppercase tracking-wider">League</th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-bold text-blue-200 uppercase tracking-wider">National TV Contracts</th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-bold text-blue-200 uppercase tracking-wider">Local TV Rights</th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-bold text-blue-200 uppercase tracking-wider">Tickets & Suites</th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-bold text-blue-200 uppercase tracking-wider">Merchandise & Licensing</th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-bold text-blue-200 uppercase tracking-wider">Stadium Naming Rights</th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-bold text-blue-200 uppercase tracking-wider">Concessions & Parking</th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-bold text-blue-200 uppercase tracking-wider">Digital/Streaming Revenue</th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-bold text-blue-200 uppercase tracking-wider">Jersey Sponsorships</th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-bold text-blue-200 uppercase tracking-wider">Player Trading Fees</th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-bold text-blue-200 uppercase tracking-wider">Expansion Fees</th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-bold text-blue-200 uppercase tracking-wider">Private Equity Investment</th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-bold text-blue-200 uppercase tracking-wider">Revenue Sharing</th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-bold text-blue-200 uppercase tracking-wider">Forbes Team Valuations</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-blue-800/30">
                  {revenueData.map((data, index) => (
                    <tr key={index} className="hover:bg-blue-900/20 transition-colors duration-200">
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-bold text-white">{data.league}</td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-blue-200">{data.nationalTv}</td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-blue-200">{data.localTv}</td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-blue-200">{data.ticketsSuites}</td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-blue-200">{data.merchandise}</td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-blue-200">{data.stadiumNaming}</td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-blue-200">{data.concessionsParking}</td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-blue-200">{data.digitalStreaming}</td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-blue-200">{data.jerseySponsorships}</td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-blue-200">{data.playerTradingFees}</td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-blue-200">{data.expansionFees}</td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-blue-200">{data.privateEquity}</td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-blue-200">{data.revenueSharing}</td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-blue-200">{data.forbesValuations}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Conclusion */}
          <section className="bg-[#0d1a3a] p-8 rounded-2xl border border-blue-700/50 shadow-xl transition-all duration-300 hover:shadow-2xl hover:border-blue-600/70">
            <h2 className="text-4xl font-black text-white mb-6 flex items-center gap-3">
              <Lightbulb className="text-[#00FFFF] w-10 h-10" /> The Evolving Landscape
            </h2>
            <p className="text-blue-300 leading-relaxed text-lg">
              The financial models of professional sports are constantly evolving, driven by technological advancements, globalization, and changing consumer habits. From traditional gate receipts to cutting-edge digital streaming deals and private equity infusions, teams are continuously seeking new avenues to maximize their revenue and enhance their brand value. This dynamic environment ensures that the business of sports remains as competitive off the field as it is on it.
            </p>
          </section>
        </main>

        {/* Mobile Bottom Navigation */}
        <MobileBottomNav />

        {/* Footer with Copyright */}
        <footer className="p-6 text-center text-blue-500 text-sm mt-12">
          <p>Copyright © 2026 Chad A. Dozier Sr. / AthlynXAI. All rights reserved.</p>
        </footer>
      </DashboardLayout>
    </RouteErrorBoundary>
  );
};

export default ProTeamRevenue;
