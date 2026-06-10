import React from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { RouteErrorBoundary } from '@/components/GlobalErrorBoundary';
import MobileBottomNav from '@/components/MobileBottomNav';
import { DollarSign, TrendingUp, Users, Trophy, Banknote, Gift, Car, Handshake, Landmark, LineChart, BarChart, PieChart, Wallet, Briefcase, Megaphone, Globe, Zap, Lightbulb, TrendingDown, ShieldCheck, CreditCard } from 'lucide-react';

const SchoolRevenue = () => {
  return (
    <RouteErrorBoundary>
      <DashboardLayout>
        <div className="min-h-screen bg-[#050c1a] text-gray-100 font-sans">
          {/* Hero Section */}
          <section className="relative h-96 flex items-center justify-center text-center bg-gradient-to-br from-[#0d1a3a] to-[#050c1a] overflow-hidden">
            <div className="absolute inset-0 z-0 opacity-20" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1517649763962-0c623066013b?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D")', backgroundSize: 'cover', backgroundPosition: 'center' }}></div>
            <div className="relative z-10 p-8 max-w-4xl mx-auto">
              <h1 className="text-5xl font-bold text-white mb-4 drop-shadow-lg">Athletic Department Revenue Streams</h1>
              <p className="text-xl text-cyan-300">Understanding how collegiate sports power their financial engines.</p>
              <p className="text-md text-gray-400 mt-2">Explore the diverse financial mechanisms that fuel university athletic programs, from media deals to fan engagement and strategic partnerships that define the modern collegiate sports landscape. This comprehensive overview delves into the intricate financial ecosystem that sustains competitive excellence and student-athlete development, highlighting both traditional and emerging revenue sources.</p>
            </div>
          </section>

          {/* Main Content Sections */}
          <main className="container mx-auto px-4 py-12 space-y-16">
            {/* Section 1: Media Rights & Conference Sharing */}
            <section className="bg-[#0d1a3a] p-8 rounded-lg shadow-xl border border-[#1E90FF] border-opacity-30">
              <h2 className="text-4xl font-semibold text-white mb-6 flex items-center"><Trophy className="text-[#1E90FF] mr-4" size={36} /> Media Rights & Conference Revenue</h2>
              <p className="text-lg text-gray-300 mb-6">The lifeblood of modern collegiate athletics, massive television and media rights deals, alongside strategic conference revenue sharing, form the bedrock of financial stability for many athletic departments. These agreements have grown exponentially, transforming college sports into a multi-billion dollar industry, with significant implications for program funding, national visibility, and the overall landscape of intercollegiate competition. The continuous escalation of these rights fees underscores the immense value placed on live sports content.</p>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="p-6 bg-[#050c1a] rounded-lg border border-gray-700">
                  <h3 className="text-2xl font-medium text-cyan-300 mb-3 flex items-center"><LineChart className="mr-2" size={24} /> TV/Media Rights Deals</h3>
                  <p className="text-gray-400 leading-relaxed">Agreements with major networks such as ESPN, Fox, CBS, and dedicated conference channels like the SEC Network and Big Ten Network, provide substantial income. These deals grant broadcasting rights for games, highlights, and exclusive content, with revenues often distributed based on conference affiliation and performance metrics. The increasing demand for live sports content continues to drive these values higher, making them a primary revenue source and a key factor in conference realignment decisions, shaping the future of collegiate sports and influencing athletic budgets significantly.</p>
                </div>
                <div className="p-6 bg-[#050c1a] rounded-lg border border-gray-700">
                  <h3 className="text-2xl font-medium text-cyan-300 mb-3 flex items-center"><Banknote className="mr-2" size={24} /> Conference Revenue Sharing</h3>
                  <p className="text-gray-400 leading-relaxed">Conferences act as central hubs, pooling revenue from various sources including their own media deals, bowl game appearances, and distributions from NCAA tournaments. This collective income is then strategically distributed to member schools. The distribution models can vary, often balancing equal shares with incentives for athletic success, thereby fueling operational budgets, facility upgrades, coaching salaries, and student-athlete support across the conference. This system fosters both competition and financial stability among members, ensuring a robust athletic environment and equitable resource allocation.</p>
                </div>
              </div>
            </section>

            {/* Section 2: Game Day & Merchandise */}
            <section className="bg-[#0d1a3a] p-8 rounded-lg shadow-xl border border-[#1E90FF] border-opacity-30">
              <h2 className="text-4xl font-semibold text-white mb-6 flex items-center"><DollarSign className="text-[#1E90FF] mr-4" size={36} /> Game Day & Fan Engagement</h2>
              <p className="text-lg text-gray-300 mb-6">Direct engagement with fans translates into significant revenue through ticket sales, premium seating experiences, and the ubiquitous presence of team merchandise and licensing. The atmosphere of game day is a powerful economic driver, creating a vibrant ecosystem around collegiate sports events that extends far beyond the playing field, generating excitement and loyalty.</p>
              <div className="grid md:grid-cols-3 gap-8">
                <div className="p-6 bg-[#050c1a] rounded-lg border border-gray-700">
                  <h3 className="text-2xl font-medium text-cyan-300 mb-3 flex items-center"><Users className="mr-2" size={24} /> Ticket Sales & Premium Seating</h3>
                  <p className="text-gray-400 leading-relaxed">Revenue generated from general admission tickets, luxury suites, club seats, and season ticket packages for various sports, with football and men's basketball typically being the largest contributors. Premium seating options, offering enhanced amenities, exclusive access, and catering services, command higher prices and cater to a dedicated donor base, significantly boosting game-day income and enhancing the overall fan experience with exclusive perks.</p>
                </div>
                <div className="p-6 bg-[#050c1a] rounded-lg border border-gray-700">
                  <h3 className="text-2xl font-medium text-cyan-300 mb-3 flex items-center"><Trophy className="mr-2" size={24} /> Merchandise & Licensing</h3>
                  <p className="text-gray-400 leading-relaxed">Sales of official team apparel, jerseys, hats, and other memorabilia are a constant source of income, driven by fan loyalty and team success. Licensing agreements allow third parties to use team logos, mascots, and branding on a wide array of products, from video games to home goods, extending the brand's reach and revenue potential far beyond the campus borders, creating a strong and recognizable brand presence in the market.</p>
                </div>
                <div className="p-6 bg-[#050c1a] rounded-lg border border-gray-700">
                  <h3 className="text-2xl font-medium text-cyan-300 mb-3 flex items-center"><Car className="mr-2" size={24} /> Parking & Concessions</h3>
                  <p className="text-gray-400 leading-relaxed">Income derived from parking fees on game days, special events, and sales of food, beverages, and other amenities at athletic venues. These often overlooked revenue streams contribute significantly to the overall game day experience and the department's bottom line, providing convenience for fans and additional funds for operations and crucial facility maintenance and upgrades.</p>
                </div>
              </div>
            </section>

            {/* Section 3: Postseason & NCAA Distributions */}
            <section className="bg-[#0d1a3a] p-8 rounded-lg shadow-xl border border-[#1E90FF] border-opacity-30">
              <h2 className="text-4xl font-semibold text-white mb-6 flex items-center"><Trophy className="text-[#1E90FF] mr-4" size={36} /> Postseason Success & NCAA Distributions</h2>
              <p className="text-lg text-gray-300 mb-6">Success on the field and court brings not only prestige but also substantial financial rewards through participation in high-profile bowl games and significant distributions from NCAA tournaments, particularly March Madness, which generates immense viewership and advertising revenue, making it a cornerstone of collegiate sports finance and a major driver of institutional pride.</p>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="p-6 bg-[#050c1a] rounded-lg border border-gray-700">
                  <h3 className="text-2xl font-medium text-cyan-300 mb-3 flex items-center"><Trophy className="mr-2" size={24} /> Bowl Game Payouts</h3>
                  <p className="text-gray-400 leading-relaxed">Collegiate football teams participating in prestigious bowl games receive substantial payouts. These funds are typically shared with their respective conferences, which then distribute portions to member schools. The more prominent the bowl game, the larger the financial windfall, benefiting not just the participating team but often the entire conference through shared revenue pools and increased national exposure, attracting top talent and enhancing recruiting efforts.</p>
                </div>
                <div className="p-6 bg-[#050c1a] rounded-lg border border-gray-700">
                  <h3 className="text-2xl font-medium text-cyan-300 mb-3 flex items-center"><BarChart className="mr-2" size={24} /> NCAA Tournament Distributions</h3>
                  <p className="text-gray-400 leading-relaxed">Revenue generated from the NCAA Men's Basketball Tournament (often referred to as March Madness) and other NCAA championships is a massive income source. These funds are distributed to conferences and then to schools based on historical performance, participation, and success in the tournaments, providing a significant boost to athletic budgets and allowing for investment in student-athlete welfare, program development, and essential facility upgrades to maintain competitiveness.</p>
                </div>
              </div>
            </section>

            {/* Section 4: Sponsorships & Donations */}
            <section className="bg-[#0d1a3a] p-8 rounded-lg shadow-xl border border-[#1E90FF] border-opacity-30">
              <h2 className="text-4xl font-semibold text-white mb-6 flex items-center"><Handshake className="text-[#1E90FF] mr-4" size={36} /> Corporate Partnerships & Philanthropy</h2>
              <p className="text-lg text-gray-300 mb-6">Strategic partnerships with corporations and the unwavering support of alumni and boosters provide crucial financial backing for athletic programs, enabling them to invest in facilities, scholarships, competitive coaching staffs, and cutting-edge training resources, fostering a culture of excellence and ensuring long-term sustainability.</p>
              <div className="grid md:grid-cols-3 gap-8">
                <div className="p-6 bg-[#050c1a] rounded-lg border border-gray-700">
                  <h3 className="text-2xl font-medium text-cyan-300 mb-3 flex items-center"><Landmark className="mr-2" size={24} /> Corporate Sponsorships</h3>
                  <p className="text-gray-400 leading-relaxed">Agreements with companies for advertising, branding, and promotional rights within athletic venues, during broadcasts, and across digital platforms. These sponsorships can range from official soft drink providers to technology partners, providing significant revenue and in-kind services that enhance the student-athlete and fan experience, while also offering valuable marketing exposure for the corporate partners and strengthening community ties.</p>
                </div>
                <div className="p-6 bg-[#050c1a] rounded-lg border border-gray-700">
                  <h3 className="text-2xl font-medium text-cyan-300 mb-3 flex items-center"><Gift className="mr-2" size={24} /> Facility Naming Rights</h3>
                  <p className="text-gray-400 leading-relaxed">Long-term, multi-million dollar agreements where corporations pay substantial sums to have their name prominently associated with athletic facilities, such as stadiums, arenas, practice complexes, or even specific sections within them. This is a significant capital-generating strategy that helps fund new construction and major renovations, leaving a lasting legacy and providing state-of-the-art facilities for athletes and fans for decades to come.</p>
                </div>
                <div className="p-6 bg-[#050c1a] rounded-lg border border-gray-700">
                  <h3 className="text-2xl font-medium text-cyan-300 mb-3 flex items-center"><Banknote className="mr-2" size={24} /> Donor Contributions</h3>
                  <p className="text-gray-400 leading-relaxed">Financial gifts from loyal alumni, passionate boosters, and dedicated fans are a cornerstone of athletic department funding. These contributions are often directed towards specific projects (e.g., new locker rooms), athletic scholarships, or general athletic fund support, crucial for program growth, maintaining competitive excellence, and ensuring the long-term viability of various sports programs across the institution, reflecting a deep commitment to collegiate athletics.</p>
                </div>
              </div>
            </section>

            {/* Section 5: NIL & Apparel Deals */}
            <section className="bg-[#0d1a3a] p-8 rounded-lg shadow-xl border border-[#1E90FF] border-opacity-30">
              <h2 className="text-4xl font-semibold text-white mb-6 flex items-center"><Trophy className="text-[#1E90FF] mr-4" size={36} /> Emerging Revenue: NIL & Apparel Deals</h2>
              <p className="text-lg text-gray-300 mb-6">The evolving landscape of Name, Image, and Likeness (NIL) opportunities and lucrative apparel sponsorships represent new and growing revenue streams for athletic departments and their student-athletes, reshaping the financial model of college sports and offering unprecedented opportunities for brand building and athlete empowerment in the modern era.</p>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="p-6 bg-[#050c1a] rounded-lg border border-gray-700">
                  <h3 className="text-2xl font-medium text-cyan-300 mb-3 flex items-center"><Trophy className="mr-2" size={24} /> NIL Collective Revenue</h3>
                  <p className="text-gray-400 leading-relaxed">Funds generated by Name, Image, and Likeness (NIL) collectives, which facilitate endorsement deals and opportunities for student-athletes to monetize their personal brand. While directly benefiting athletes, a portion of these funds or related donations often indirectly or directly support the athletic department through increased donor engagement, program visibility, and a more attractive recruiting environment, fostering a symbiotic relationship between athletes, fans, and the institution.</p>
                </div>
                <div className="p-6 bg-[#050c1a] rounded-lg border border-gray-700">
                  <h3 className="text-2xl font-medium text-cyan-300 mb-3 flex items-center"><Trophy className="mr-2" size={24} /> Apparel Deals (Nike/Adidas/Under Armour)</h3>
                  <p className="text-gray-400 leading-relaxed">Multi-year partnerships with major athletic apparel companies like and Under Armour. These deals typically involve providing uniforms, athletic gear, and equipment across all sports, often accompanied by significant cash payments or product allowances to the athletic departments in exchange for exclusive branding rights, marketing opportunities, and the prestige associated with top-tier athletic brands, enhancing the overall athletic program's appeal and competitive edge.</p>
                </div>
              </div>
            </section>

            {/* Section 6: Financial Challenges and Sustainability */}
            <section className="bg-[#0d1a3a] p-8 rounded-lg shadow-xl border border-[#1E90FF] border-opacity-30">
              <h2 className="text-4xl font-semibold text-white mb-6 flex items-center"><TrendingDown className="text-[#1E90FF] mr-4" size={36} /> Financial Challenges & Sustainability</h2>
              <p className="text-lg text-gray-300 mb-6">Despite robust revenue streams, collegiate athletic departments face increasing financial pressures, including rising operational costs, coaching salaries, facility maintenance, and compliance expenses. Ensuring long-term financial sustainability requires careful planning and innovative strategies.</p>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="p-6 bg-[#050c1a] rounded-lg border border-gray-700">
                  <h3 className="text-2xl font-medium text-cyan-300 mb-3 flex items-center"><Briefcase className="mr-2" size={24} /> Rising Costs & Budget Management</h3>
                  <p className="text-gray-400 leading-relaxed">The cost of running a competitive athletic program continues to escalate. This includes increased spending on coaching and administrative salaries, state-of-the-art facilities, travel, equipment, and comprehensive student-athlete support services. Effective budget management and strategic allocation of resources are critical to navigate these financial demands without compromising program quality or student-athlete well-being.</p>
                </div>
                <div className="p-6 bg-[#050c1a] rounded-lg border border-gray-700">
                  <h3 className="text-2xl font-medium text-cyan-300 mb-3 flex items-center"><ShieldCheck className="mr-2" size={24} /> Compliance & Regulatory Expenses</h3>
                  <p className="text-gray-400 leading-relaxed">Adhering to NCAA regulations and conference rules involves significant financial and administrative overhead. This includes costs associated with compliance staff, legal counsel, and technology solutions to monitor recruiting, academic eligibility, and NIL activities. The evolving regulatory landscape, particularly around NIL, adds complexity and new financial considerations for athletic departments.</p>
                </div>
              </div>
            </section>

            {/* Data Table Section */}
            <section className="bg-[#0d1a3a] p-8 rounded-lg shadow-xl border border-[#1E90FF] border-opacity-30">
              <h2 className="text-4xl font-semibold text-white mb-6 flex items-center"><TrendingUp className="text-[#1E90FF] mr-4" size={36} /> Top 10 Revenue-Generating Athletic Departments</h2>
              <p className="text-lg text-gray-300 mb-6">A look at the collegiate powerhouses leading the nation in athletic department revenue, showcasing their financial might and influence in the collegiate sports landscape. These figures are estimates based on recent publicly available data and financial reports, reflecting the dynamic nature of collegiate athletics finance and the significant economic impact of these institutions on their respective conferences and communities.</p>
              <div className="overflow-x-auto">
                <table className="w-full text-left table-auto border-collapse">
                  <thead>
                    <tr className="bg-[#1E90FF] bg-opacity-20">
                      <th className="px-4 py-3 text-cyan-300 border-b border-gray-600">Rank</th>
                      <th className="px-4 py-3 text-cyan-300 border-b border-gray-600">University</th>
                      <th className="px-4 py-3 text-cyan-300 border-b border-gray-600">Conference</th>
                      <th className="px-4 py-3 text-cyan-300 border-b border-gray-600">Total Revenue (2023-24 est.)</th>
                      <th className="px-4 py-3 text-cyan-300 border-b border-gray-600">Key Revenue Driver</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-gray-700 hover:bg-[#0d1a3a] transition-colors">
                      <td className="px-4 py-3">1</td>
                      <td className="px-4 py-3">Ohio State University</td>
                      <td className="px-4 py-3">Big Ten</td>
                      <td className="px-4 py-3">$250M+</td>
                      <td className="px-4 py-3">Media Rights, Football Ticket Sales</td>
                    </tr>
                    <tr className="border-b border-gray-700 hover:bg-[#0d1a3a] transition-colors">
                      <td className="px-4 py-3">2</td>
                      <td className="px-4 py-3">University of Texas</td>
                      <td className="px-4 py-3">SEC</td>
                      <td className="px-4 py-3">$240M+</td>
                      <td className="px-4 py-3">Longhorn Network, Football Revenue</td>
                    </tr>
                    <tr className="border-b border-gray-700 hover:bg-[#0d1a3a] transition-colors">
                      <td className="px-4 py-3">3</td>
                      <td className="px-4 py-3">University of Alabama</td>
                      <td className="px-4 py-3">SEC</td>
                      <td className="px-4 py-3">$230M+</td>
                      <td className="px-4 py-3">Football Dominance, Donor Support</td>
                    </tr>
                    <tr className="border-b border-gray-700 hover:bg-[#0d1a3a] transition-colors">
                      <td className="px-4 py-3">4</td>
                      <td className="px-4 py-3">University of Michigan</td>
                      <td className="px-4 py-3">Big Ten</td>
                      <td className="px-4 py-3">$220M+</td>
                      <td className="px-4 py-3">Large Alumni Base, Football Success</td>
                    </tr>
                    <tr className="border-b border-gray-700 hover:bg-[#0d1a3a] transition-colors">
                      <td className="px-4 py-3">5</td>
                      <td className="px-4 py-3">University of Georgia</td>
                      <td className="px-4 py-3">SEC</td>
                      <td className="px-4 py-3">$215M+</td>
                      <td className="px-4 py-3">Football Program, SEC Network</td>
                    </tr>
                    <tr className="border-b border-gray-700 hover:bg-[#0d1a3a] transition-colors">
                      <td className="px-4 py-3">6</td>
                      <td className="px-4 py-3">Texas A&M University</td>
                      <td className="px-4 py-3">SEC</td>
                      <td className="px-4 py-3">$210M+</td>
                      <td className="px-4 py-3">12th Man Foundation, Kyle Field</td>
                    </tr>
                    <tr className="border-b border-gray-700 hover:bg-[#0d1a3a] transition-colors">
                      <td className="px-4 py-3">7</td>
                      <td className="px-4 py-3">University of Florida</td>
                      <td className="px-4 py-3">SEC</td>
                      <td className="px-4 py-3">$205M+</td>
                      <td className="px-4 py-3">Strong Fan Base, SEC Revenue</td>
                    </tr>
                    <tr className="border-b border-gray-700 hover:bg-[#0d1a3a] transition-colors">
                      <td className="px-4 py-3">8</td>
                      <td className="px-4 py-3">University of Oklahoma</td>
                      <td className="px-4 py-3">SEC</td>
                      <td className="px-4 py-3">$200M+</td>
                      <td className="px-4 py-3">Football Program, Future SEC Move</td>
                    </tr>
                    <tr className="border-b border-gray-700 hover:bg-[#0d1a3a] transition-colors">
                      <td className="px-4 py-3">9</td>
                      <td className="px-4 py-3">Louisiana State University</td>
                      <td className="px-4 py-3">SEC</td>
                      <td className="px-4 py-3">$195M+</td>
                      <td className="px-4 py-3">Tiger SEC Brand</td>
                    </tr>
                    <tr className="hover:bg-[#0d1a3a] transition-colors">
                      <td className="px-4 py-3">10</td>
                      <td className="px-4 py-3">University of Southern California</td>
                      <td className="px-4 py-3">Big Ten</td>
                      <td className="px-4 py-3">$190M+</td>
                      <td className="px-4 py-3">Los Angeles Market, Big Ten Move</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            {/* Additional Insights Section */}
            <section className="bg-[#0d1a3a] p-8 rounded-lg shadow-xl border border-[#1E90FF] border-opacity-30">
              <h2 className="text-4xl font-semibold text-white mb-6 flex items-center"><PieChart className="text-[#1E90FF] mr-4" size={36} /> The Evolving Revenue Landscape</h2>
              <p className="text-lg text-gray-300 mb-6">The financial model for collegiate athletic departments is constantly evolving. While traditional revenue streams remain vital, new opportunities and challenges continue to emerge, requiring adaptive strategies and innovative approaches to sustain growth and competitiveness in the dynamic world of college sports. Understanding these shifts is paramount for long-term success and strategic positioning.</p>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="p-6 bg-[#050c1a] rounded-lg border border-gray-700">
                  <h3 className="text-2xl font-medium text-cyan-300 mb-3 flex items-center"><Megaphone className="mr-2" size={24} /> Impact of Conference Realignment</h3>
                  <p className="text-gray-400 leading-relaxed">Recent conference realignments, driven primarily by lucrative media rights deals, have significantly altered the revenue landscape for athletic departments. Schools moving to more prominent or financially robust conferences often see a substantial increase in their annual distributions, directly impacting their ability to invest in facilities, coaching, and student-athlete support. This trend underscores the importance of strategic conference affiliation and its profound economic consequences for institutional athletic programs.</p>
                </div>
                <div className="p-6 bg-[#050c1a] rounded-lg border border-gray-700">
                  <h3 className="text-2xl font-medium text-cyan-300 mb-3 flex items-center"><Wallet className="mr-2" size={24} /> Future Trends in Revenue Generation</h3>
                  <p className="text-gray-400 leading-relaxed">Looking ahead, athletic departments are actively exploring new avenues such as expanded digital content rights, international fan engagement initiatives, and innovative sponsorship models that leverage data analytics and personalized fan experiences. The integration of advanced technology and strategic partnerships will play a crucial role in optimizing revenue generation and ensuring long-term financial sustainability in a rapidly changing sports environment, adapting to new consumer behaviors and technological advancements to maximize income.</p>
                </div>
                <div className="p-6 bg-[#050c1a] rounded-lg border border-gray-700">
                  <h3 className="text-2xl font-medium text-cyan-300 mb-3 flex items-center"><Globe className="mr-2" size={24} /> Global Reach & Digital Content</h3>
                  <p className="text-gray-400 leading-relaxed">The global appeal of collegiate sports is growing, opening doors for international media rights and merchandising. Furthermore, the rise of digital platforms and streaming services presents opportunities for athletic departments to create and monetize their own content, reaching a broader audience and generating new revenue streams outside traditional broadcast deals. This digital expansion is key to future growth and connecting with a worldwide fanbase.</p>
                </div>
                <div className="p-6 bg-[#050c1a] rounded-lg border border-gray-700">
                  <h3 className="text-2xl font-medium text-cyan-300 mb-3 flex items-center"><Zap className="mr-2" size={24} /> Innovation in Fan Experience</h3>
                  <p className="text-gray-400 leading-relaxed">Enhancing the fan experience through technology, such as augmented reality at games, interactive stadium apps, and personalized content delivery, can drive engagement and, consequently, revenue. Investing in these innovations not only attracts new fans but also deepens the connection with existing ones, encouraging higher spending on tickets, merchandise, and concessions. A superior, technologically advanced fan experience is a direct revenue driver and a competitive differentiator.</p>
                </div>
                <div className="p-6 bg-[#050c1a] rounded-lg border border-gray-700">
                  <h3 className="text-2xl font-medium text-cyan-300 mb-3 flex items-center"><Lightbulb className="mr-2" size={24} /> Data Analytics & Strategic Planning</h3>
                  <p className="text-gray-400 leading-relaxed">Utilizing data analytics to understand fan demographics, purchasing habits, and engagement patterns allows athletic departments to tailor marketing efforts, optimize pricing strategies, and identify new revenue opportunities. Strategic planning based on robust data insights is becoming indispensable for maximizing financial returns and ensuring the efficient allocation of resources across all athletic programs, leading to more informed decision-making and sustainable growth.</p>
                </div>
              </div>
            </section>

            {/* Final Call to Action/Summary Section */}
            <section className="bg-[#0d1a3a] p-8 rounded-lg shadow-xl border border-[#1E90FF] border-opacity-30 text-center">
              <h2 className="text-4xl font-semibold text-white mb-6">The Business of College Sports</h2>
              <p className="text-lg text-gray-300 mb-8">From the roar of the crowd to multi-million dollar media contracts, the financial ecosystem of college athletics is complex and ever-growing. Understanding these diverse revenue streams is key to appreciating the scale and impact of university sports programs on their institutions and communities. The continuous pursuit of excellence on and off the field is intrinsically linked to robust financial health and strategic foresight in a competitive landscape.</p>
              <p className="text-xl font-bold text-cyan-300">Invest in the future of collegiate athletics. Be The Legacy.</p>
            </section>

          </main>

          {/* Mobile Bottom Navigation */}
          <MobileBottomNav />

          {/* Footer */}
          <footer className="bg-[#0d1a3a] text-gray-500 text-center p-6 text-sm border-t border-[#1E90FF] border-opacity-20">
            <p>Copyright © 2026 Chad A. Dozier Sr. / AthlynXAI. All rights reserved.</p>
            <p className="mt-2">Be The Legacy.</p>
          </footer>
        </div>
      </DashboardLayout>
    </RouteErrorBoundary>
  );
};

export default SchoolRevenue;
