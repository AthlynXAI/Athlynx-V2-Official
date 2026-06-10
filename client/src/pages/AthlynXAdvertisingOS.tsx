
import DashboardLayout from "@/components/DashboardLayout";
import MobileBottomNav from "@/components/MobileBottomNav";
import { RouteErrorBoundary } from "@/components/GlobalErrorBoundary";
import { Link } from "wouter";
import { useState, useEffect } from "react";
import { Megaphone, BarChart2, ShieldCheck, Network, Handshake, DollarSign, TrendingUp, Quote, Rocket, Lightbulb, Users, Globe, Award, Zap, Target, LineChart, MessageSquare, Calendar, Eye, Star, TrendingUpIcon, CheckCircle, ArrowRight } from "lucide-react";

export default function AthlynXAdvertisingOS() {
  return (
    <RouteErrorBoundary>
      <DashboardLayout>
        <div className="min-h-screen bg-[#050c1a] text-white">
          {/* Hero Section */}
          <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-[#1E90FF] to-[#4169E1] text-white overflow-hidden">
            <div className="absolute inset-0 opacity-10">
              <Megaphone className="w-full h-full object-cover opacity-5" />
            </div>
            <div className="relative z-10 max-w-7xl mx-auto text-center">
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black mb-4 leading-tight">
                The Brand Speaks. The Athletes Inspire.
              </h1>
              <p className="text-xl sm:text-2xl font-light mb-8">
                AthlynX Advertising and Media OS: Elevating brands through authentic athlete narratives and unparalleled media reach.
              </p>
              <div className="flex justify-center space-x-4">
                <Megaphone className="w-12 h-12 text-white" />
                <BarChart2 className="w-12 h-12 text-white" />
              </div>
              <p className="mt-8 text-lg font-semibold">
                <span className="text-cyan-200">"Be The Legacy"</span> — AthlynXAI
              </p>
            </div>
          </section>

          {/* The Rule Card */}
          <section className="py-16 px-4 sm:px-6 lg:px-8 bg-[#050c1a]">
            <div className="max-w-4xl mx-auto bg-[#0d1a3a] border border-blue-700/50 rounded-lg shadow-lg p-8 text-center">
              <ShieldCheck className="w-16 h-16 text-[#1E90FF] mx-auto mb-6" />
              <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">
                The AthlynX Rule: Uncompromised Authenticity in Advertising
              </h2>
              <p className="text-lg text-gray-300 leading-relaxed">
                <span className="font-bold text-blue-300">AthlynX NEVER puts traditional ads on athletes.</span> Our philosophy is rooted in genuine connection and respect for the athlete\\'s journey. <br />
                <span className="font-bold text-white">We ARE the brand.</span> Our platform is meticulously designed to amplify athlete voices and stories, fostering deep engagement without resorting to commoditization.
              </p>
            </div>
          </section>

          {/* AthlynX Media Network */}
          <section className="py-16 px-4 sm:px-6 lg:px-8 bg-[#050c1a]">
            <div className="max-w-7xl mx-auto">
              <h2 className="text-4xl font-black text-white text-center mb-12">AthlynX Media Network: Unrivaled Reach & Engagement</h2>
              <p className="text-lg text-gray-300 text-center mb-10">Our expansive media network ensures your brand message resonates across diverse channels, reaching a highly engaged global audience of sports enthusiasts and beyond. We cultivate communities, not just viewership.</p>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                <div className="bg-[#0d1a3a] border border-blue-700/50 rounded-lg p-6 text-center">
                  <Network className="w-12 h-12 text-cyan-400 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-blue-300 mb-2">Platform & App</h3>
                  <p className="text-gray-300 text-sm mb-2">Our core digital ecosystem, offering direct, interactive engagement with millions of users worldwide through personalized experiences and exclusive content.</p>
                  <p className="text-2xl font-black text-[#1E90FF] mt-4">10M+ Active Users</p>
                </div>
                <div className="bg-[#0d1a3a] border border-blue-700/50 rounded-lg p-6 text-center">
                  <Megaphone className="w-12 h-12 text-cyan-400 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-blue-300 mb-2">Podcast & Audio</h3>
                  <p className="text-gray-300 text-sm mb-2">In-depth interviews, expert analysis, and exclusive audio content that captures the attention of dedicated listeners, fostering a loyal and engaged community.</p>
                  <p className="text-2xl font-black text-[#1E90FF] mt-4">500K+ Engaged Listeners</p>
                </div>
                <div className="bg-[#0d1a3a] border border-blue-700/50 rounded-lg p-6 text-center">
                  <BarChart2 className="w-12 h-12 text-cyan-400 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-blue-300 mb-2">Social Media</h3>
                  <p className="text-gray-300 text-sm mb-2">Dynamic content and viral campaigns across all major social platforms, driving massive impressions, interactions, and trendsetting conversations.</p>
                  <p className="text-2xl font-black text-[#1E90FF] mt-4">20M+ Global Followers</p>
                </div>
                <div className="bg-[#0d1a3a] border border-blue-700/50 rounded-lg p-6 text-center">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/4/42/YouTube_icon_%282017%29.png" alt="YouTube Icon" className="w-12 h-12 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-blue-300 mb-2">YouTube Channel</h3>
                  <p className="text-gray-300 text-sm mb-2">High-quality video productions, compelling documentaries, and thrilling highlights that attract millions of viewers and build lasting connections.</p>
                  <p className="text-2xl font-black text-[#1E90FF] mt-4">5M+ Dedicated Subscribers</p>
                </div>
              </div>
            </div>
          </section>

          {/* Brand Partnership Model */}
          <section className="py-16 px-4 sm:px-6 lg:px-8 bg-[#050c1a]">
            <div className="max-w-7xl mx-auto">
              <h2 className="text-4xl font-black text-white text-center mb-12">Brand Partnership Model: Elevate Your Brand with AthlynX</h2>
              <p className="text-lg text-gray-300 text-center mb-10">Brands partner directly with the AthlynX platform, not individual athletes, ensuring consistent brand messaging and maximum impact. Our tiered model offers flexible solutions for every brand ambition, from emerging startups to global enterprises.</p>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                {/* Bronze Tier */}
                <div className="bg-[#0d1a3a] border border-blue-700/50 rounded-lg p-8 text-center flex flex-col h-full">
                  <h3 className="text-2xl font-black text-[#1E90FF] mb-4">Bronze Tier</h3>
                  <p className="text-gray-300 mb-6 flex-grow">Entry-level partnership for emerging brands seeking foundational visibility within the AthlynX ecosystem and initial brand exposure to our engaged audience.</p>
                  <ul className="text-left text-gray-400 space-y-2 mb-6">
                    <li><CheckCircle className="inline-block w-4 h-4 mr-2 text-blue-400" /> Platform Listing</li>
                    <li><CheckCircle className="inline-block w-4 h-4 mr-2 text-blue-400" /> Social Media Mentions</li>
                    <li><CheckCircle className="inline-block w-4 h-4 mr-2 text-blue-400" /> Community Access</li>
                    <li><CheckCircle className="inline-block w-4 h-4 mr-2 text-blue-400" /> Basic Support</li>
                  </ul>
                  <button className="mt-auto bg-[#1E90FF] hover:bg-[#4169E1] text-white font-bold py-3 px-6 rounded-lg transition duration-300">Learn More <ArrowRight className="inline-block w-4 h-4 ml-2" /></button>
                </div>
                {/* Silver Tier */}
                <div className="bg-[#0d1a3a] border border-blue-700/50 rounded-lg p-8 text-center flex flex-col h-full">
                  <h3 className="text-2xl font-black text-[#1E90FF] mb-4">Silver Tier</h3>
                  <p className="text-gray-300 mb-6 flex-grow">Enhanced visibility and engagement, ideal for growing brands ready to amplify their presence across key AthlynX channels and leverage our content creation capabilities.</p>
                  <ul className="text-left text-gray-400 space-y-2 mb-6">
                    <li><CheckCircle className="inline-block w-4 h-4 mr-2 text-blue-400" /> Featured Platform Listing</li>
                    <li><CheckCircle className="inline-block w-4 h-4 mr-2 text-blue-400" /> Dedicated Podcast Mentions</li>
                    <li><CheckCircle className="inline-block w-4 h-4 mr-2 text-blue-400" /> Basic Performance Analytics</li>
                    <li><CheckCircle className="inline-block w-4 h-4 mr-2 text-blue-400" /> Collaborative Content Creation</li>
                    <li><CheckCircle className="inline-block w-4 h-4 mr-2 text-blue-400" /> Priority Support</li>
                  </ul>
                  <button className="mt-auto bg-[#1E90FF] hover:bg-[#4169E1] text-white font-bold py-3 px-6 rounded-lg transition duration-300">Learn More <ArrowRight className="inline-block w-4 h-4 ml-2" /></button>
                </div>
                {/* Gold Tier */}
                <div className="bg-[#0d1a3a] border border-blue-700/50 rounded-lg p-8 text-center flex flex-col h-full">
                  <h3 className="text-2xl font-black text-[#1E90FF] mb-4">Gold Tier</h3>
                  <p className="text-gray-300 mb-6 flex-grow">Premium partnership with significant brand integration, offering bespoke campaigns and direct engagement with our athlete community for maximum brand resonance.</p>
                  <ul className="text-left text-gray-400 space-y-2 mb-6">
                    <li><CheckCircle className="inline-block w-4 h-4 mr-2 text-blue-400" /> Premium Placement & Branding</li>
                    <li><CheckCircle className="inline-block w-4 h-4 mr-2 text-blue-400" /> Curated Sponsored Content</li>
                    <li><CheckCircle className="inline-block w-4 h-4 mr-2 text-blue-400" /> Advanced Performance Analytics</li>
                    <li><CheckCircle className="inline-block w-4 h-4 mr-2 text-blue-400" /> Exclusive Event Integration</li>
                    <li><CheckCircle className="inline-block w-4 h-4 mr-2 text-blue-400" /> Co-marketing Opportunities</li>
                    <li><CheckCircle className="inline-block w-4 h-4 mr-2 text-blue-400" /> Dedicated Account Manager</li>
                  </ul>
                  <button className="mt-auto bg-[#1E90FF] hover:bg-[#4169E1] text-white font-bold py-3 px-6 rounded-lg transition duration-300">Learn More <ArrowRight className="inline-block w-4 h-4 ml-2" /></button>
                </div>
                {/* Platinum Tier */}
                <div className="bg-[#0d1a3a] border border-blue-700/50 rounded-lg p-8 text-center flex flex-col h-full">
                  <h3 className="text-2xl font-black text-[#1E90FF] mb-4">Platinum Tier</h3>
                  <p className="text-gray-300 mb-6 flex-grow">Exclusive, bespoke partnerships for maximum brand exposure and deep integration across all AthlynX channels, including global event sponsorship and revenue share opportunities for unparalleled growth.</p>
                  <ul className="text-left text-gray-400 space-y-2 mb-6">
                    <li><CheckCircle className="inline-block w-4 h-4 mr-2 text-blue-400" /> Elite Exclusive Partnership</li>
                    <li><CheckCircle className="inline-block w-4 h-4 mr-2 text-blue-400" /> Fully Bespoke Campaigns</li>
                    <li><CheckCircle className="inline-block w-4 h-4 mr-2 text-blue-400" /> Dedicated Account Management</li>
                    <li><CheckCircle className="inline-block w-4 h-4 mr-2 text-blue-400" /> Global Event Sponsorship</li>
                    <li><CheckCircle className="inline-block w-4 h-4 mr-2 text-blue-400" /> Revenue Share Opportunities</li>
                    <li><CheckCircle className="inline-block w-4 h-4 mr-2 text-blue-400" /> International Market Access</li>
                    <li><CheckCircle className="inline-block w-4 h-4 mr-2 text-blue-400" /> Annual Strategy Session</li>
                  </ul>
                  <button className="mt-auto bg-[#1E90FF] hover:bg-[#4169E1] text-white font-bold py-3 px-6 rounded-lg transition duration-300">Contact Us <ArrowRight className="inline-block w-4 h-4 ml-2" /></button>
                </div>
              </div>
            </div>
          </section>

          {/* Advertising Products: Pricing Table */}
          <section className="py-16 px-4 sm:px-6 lg:px-8 bg-[#050c1a]">
            <div className="max-w-7xl mx-auto">
              <h2 className="text-4xl font-black text-white text-center mb-12">Advertising Products: Tailored Solutions for Maximum Impact</h2>
              <p className="text-lg text-gray-300 text-center mb-10">Choose from a diverse range of advertising solutions designed to integrate seamlessly with the AthlynX ecosystem and deliver unparalleled brand exposure and engagement, driving measurable results for your business.</p>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse bg-[#0d1a3a] border border-blue-700/50 rounded-lg">
                  <thead>
                    <tr>
                      <th className="py-4 px-6 bg-blue-700/50 text-white font-bold uppercase text-sm rounded-tl-lg">Product</th>
                      <th className="py-4 px-6 bg-blue-700/50 text-white font-bold uppercase text-sm">Description</th>
                      <th className="py-4 px-6 bg-blue-700/50 text-white font-bold uppercase text-sm">Key Benefits</th>
                      <th className="py-4 px-6 bg-blue-700/50 text-white font-bold uppercase text-sm rounded-tr-lg">Starting Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-blue-700/30">
                      <td className="py-4 px-6 text-blue-300 font-bold">Platform Ads</td>
                      <td className="py-4 px-6 text-gray-300">Strategically placed display and native advertisements integrated directly within the AthlynX platform and mobile application, reaching users at key engagement points.</td>
                      <td className="py-4 px-6 text-gray-300">High visibility, precise audience targeting, detailed performance metrics, and measurable return on investment through advanced analytics.</td>
                      <td className="py-4 px-6 text-[#1E90FF] font-bold">$500/month</td>
                    </tr>
                    <tr className="border-b border-blue-700/30">
                      <td className="py-4 px-6 text-blue-300 font-bold">Sponsored Content</td>
                      <td className="py-4 px-6 text-gray-300">Collaborative creation of brand-aligned articles, engaging videos, and impactful social media posts featuring AthlynX athletes, distributed across our network.</td>
                      <td className="py-4 px-6 text-gray-300">Authentic storytelling, deep audience engagement, enhanced brand credibility, and organic reach amplification through athlete influence.</td>
                      <td className="py-4 px-6 text-[#1E90FF] font-bold">$2,000/campaign</td>
                    </tr>
                    <tr className="border-b border-blue-700/30">
                      <td className="py-4 px-6 text-blue-300 font-bold">Brand Integration</td>
                      <td className="py-4 px-6 text-gray-300">Seamless product placement and natural brand mentions woven into AthlynX original media productions, including podcasts, video series, and live streams.</td>
                      <td className="py-4 px-6 text-gray-300">Subtle yet powerful brand association, high recall rates, and integration into premium content experiences that resonate with our audience.</td>
                      <td className="py-4 px-6 text-[#1E90FF] font-bold">$5,000/integration</td>
                    </tr>
                    <tr className="border-b border-blue-700/30">
                      <td className="py-4 px-6 text-blue-300 font-bold">Event Sponsorship</td>
                      <td className="py-4 px-6 text-gray-300">Prominent brand presence and activation opportunities at exclusive AthlynX-hosted events, tournaments, and partnered gatherings, both virtual and physical.</td>
                      <td className="py-4 px-6 text-gray-300">Direct live audience engagement, exclusive branding rights, extensive media coverage, and unique experiential marketing opportunities.</td>
                      <td className="py-4 px-6 text-[#1E90FF] font-bold">$10,000/event</td>
                    </tr>
                    <tr>
                      <td className="py-4 px-6 text-blue-300 font-bold">Custom Solutions</td>
                      <td className="py-4 px-6 text-gray-300">Tailored advertising packages designed to meet unique brand objectives and specific marketing goals, developed in close collaboration with your team.</td>
                      <td className="py-4 px-6 text-gray-300">Maximum flexibility, bespoke strategy, dedicated support, and innovative campaign execution for truly unique brand activations.</td>
                      <td className="py-4 px-6 text-[#1E90FF] font-bold">Custom Quote</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          {/* Why Partner with AthlynX */}
          <section className="py-16 px-4 sm:px-6 lg:px-8 bg-[#050c1a]">
            <div className="max-w-7xl mx-auto">
              <h2 className="text-4xl font-black text-white text-center mb-12">Why Partner with AthlynX? Unlocking Unprecedented Value</h2>
              <p className="text-lg text-gray-300 text-center mb-10">Partnering with AthlynX means aligning your brand with authenticity, innovation, and a passionate global community. We offer more than just advertising; we offer a platform for meaningful connection and measurable growth.</p>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                <div className="bg-[#0d1a3a] border border-blue-700/50 rounded-lg p-6 text-center">
                  <Rocket className="w-12 h-12 text-cyan-400 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-blue-300 mb-2">Unmatched Reach & Influence</h3>
                  <p className="text-gray-300">Access millions of highly engaged sports fans and a global audience across all our media channels, ensuring your message is seen and heard by the right people, driving significant brand awareness.</p>
                </div>
                <div className="bg-[#0d1a3a] border border-blue-700/50 rounded-lg p-6 text-center">
                  <Lightbulb className="w-12 h-12 text-cyan-400 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-blue-300 mb-2">Authentic Engagement & Storytelling</h3>
                  <p className="text-gray-300">Connect with consumers through genuine athlete stories and compelling content, fostering deeper brand loyalty and creating lasting emotional connections that resonate deeply with your target audience.</p>
                </div>
                <div className="bg-[#0d1a3a] border border-blue-700/50 rounded-lg p-6 text-center">
                  <Handshake className="w-12 h-12 text-cyan-400 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-blue-300 mb-2">Brand Safe & Trustworthy Environment</h3>
                  <p className="text-gray-300">Partner with a platform committed to integrity, positive athlete representation, and ethical practices, ensuring your brand\\'s reputation is not only protected but significantly enhanced through association.</p>
                </div>
                <div className="bg-[#0d1a3a] border border-blue-700/50 rounded-lg p-6 text-center">
                  <LineChart className="w-12 h-12 text-cyan-400 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-blue-300 mb-2">Measurable Impact & ROI</h3>
                  <p className="text-gray-300">Benefit from advanced analytics and transparent reporting that demonstrate the tangible impact of your campaigns and ensure a strong return on your investment, optimizing future strategies.</p>
                </div>
                <div className="bg-[#0d1a3a] border border-blue-700/50 rounded-lg p-6 text-center">
                  <Target className="w-12 h-12 text-cyan-400 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-blue-300 mb-2">Targeted Audience Connection</h3>
                  <p className="text-gray-300">Leverage our deep understanding of the sports audience to precisely target your ideal customers, maximizing the effectiveness of your marketing efforts and minimizing wasted impressions.</p>
                </div>
                <div className="bg-[#0d1a3a] border border-blue-700/50 rounded-lg p-6 text-center">
                  <Award className="w-12 h-12 text-cyan-400 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-blue-300 mb-2">Innovative & Future-Proof Solutions</h3>
                  <p className="text-gray-300">Stay ahead of the curve with our continuously evolving platform and innovative advertising solutions that adapt to the dynamic digital landscape, ensuring long-term relevance and success.</p>
                </div>
              </div>
            </div>
          </section>

          {/* Athlete Amplification */}
          <section className="py-16 px-4 sm:px-6 lg:px-8 bg-[#050c1a]">
            <div className="max-w-4xl mx-auto bg-[#0d1a3a] border border-blue-700/50 rounded-lg shadow-lg p-8 text-center">
              <TrendingUpIcon className="w-16 h-16 text-cyan-400 mx-auto mb-6" />
              <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">
                Athlete Amplification: Growth Without Commoditization
              </h2>
              <p className="text-lg text-gray-300 leading-relaxed">
                AthlynX empowers athletes by growing the overall brand, creating a halo effect that benefits every individual without requiring them to become walking billboards. Our model ensures athletes maintain their authenticity and focus on their craft, while their personal brand naturally expands through association with AthlynX. We provide a platform for their stories to be heard and their achievements celebrated, all while maintaining their integrity and long-term career prospects, fostering true athlete empowerment and sustainable career development.
              </p>
            </div>
          </section>

          {/* Our Vision */}
          <section className="py-16 px-4 sm:px-6 lg:px-8 bg-[#050c1a]">
            <div className="max-w-7xl mx-auto">
              <h2 className="text-4xl font-black text-white text-center mb-12">Our Vision: Redefining Sports Marketing</h2>
              <p className="text-lg text-gray-300 text-center mb-10">At AthlynX, we envision a future where sports marketing is built on authenticity, mutual respect, and shared success. We are committed to creating a dynamic ecosystem where brands thrive by genuinely connecting with fans, and athletes are celebrated for their true value, not just their commercial appeal.</p>
              <div className="grid md:grid-cols-1 lg:grid-cols-3 gap-8 mt-10">
                <div className="bg-[#0d1a3a] border border-blue-700/50 rounded-lg p-6 text-center">
                  <Eye className="w-12 h-12 text-cyan-400 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-blue-300 mb-2">Authenticity First</h3>
                  <p className="text-gray-300 text-sm">Building genuine connections between brands, athletes, and fans, moving beyond traditional, often superficial, advertising methods.</p>
                </div>
                <div className="bg-[#0d1a3a] border border-blue-700/50 rounded-lg p-6 text-center">
                  <Star className="w-12 h-12 text-cyan-400 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-blue-300 mb-2">Athlete Empowerment</h3>
                  <p className="text-gray-300 text-sm">Creating opportunities for athletes to grow their personal brands and careers without compromising their integrity or being reduced to mere marketing tools.</p>
                </div>
                <div className="bg-[#0d1a3a] border border-blue-700/50 rounded-lg p-6 text-center">
                  <Globe className="w-12 h-12 text-cyan-400 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-blue-300 mb-2">Global Impact</h3>
                  <p className="text-gray-300 text-sm">Leveraging our expansive network to foster a global community where sports transcend boundaries, and inspiring stories reach every corner of the world.</p>
                </div>
              </div>
            </div>
          </section>

          {/* Call to Action */}
          <section className="py-16 px-4 sm:px-6 lg:px-8 bg-[#050c1a]">
            <div className="max-w-4xl mx-auto bg-gradient-to-r from-[#1E90FF] to-[#4169E1] text-white rounded-lg shadow-lg p-8 text-center">
              <h2 className="text-3xl sm:text-4xl font-black mb-4">
                Ready to Elevate Your Brand?
              </h2>
              <p className="text-lg font-light mb-8">
                Join the AthlynX Advertising OS and connect with a passionate global audience through authentic athlete narratives.
              </p>
              <button className="bg-white text-[#1E90FF] hover:bg-gray-100 font-bold py-3 px-8 rounded-lg transition duration-300 inline-flex items-center">
                Partner With Us <ArrowRight className="w-5 h-5 ml-2" />
              </button>
            </div>
          </section>

          {/* Revenue Model */}
          <section className="py-16 px-4 sm:px-6 lg:px-8 bg-[#050c1a]">
            <div className="max-w-7xl mx-auto">
              <h2 className="text-4xl font-black text-white text-center mb-12">Revenue Model: Sustainable Growth & Innovation</h2>
              <p className="text-lg text-gray-300 text-center mb-10">Our diversified and robust revenue streams ensure long-term sustainability, allowing continuous investment in platform innovation, athlete support, and community development, guaranteeing a thriving ecosystem for all stakeholders.</p>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                <div className="bg-[#0d1a3a] border border-blue-700/50 rounded-lg p-6 text-center">
                  <DollarSign className="w-12 h-12 text-[#1E90FF] mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-blue-300 mb-2">Platform Ad Revenue</h3>
                  <p className="text-gray-300 text-sm mb-2">High-yield, targeted advertisements seamlessly integrated within our digital ecosystem, maximizing brand exposure and user experience while respecting user privacy and data security, driving consistent revenue growth.</p>
                  <p className="text-2xl font-black text-white mt-4">High-yield & Targeted</p>
                </div>
                <div className="bg-[#0d1a3a] border border-blue-700/50 rounded-lg p-6 text-center">
                  <Handshake className="w-12 h-12 text-[#1E90FF] mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-blue-300 mb-2">Brand Partnerships</h3>
                  <p className="text-gray-300 text-sm mb-2">Strategic collaborations with leading global brands, offering tiered engagement models for mutual growth and amplified market presence across all our channels, fostering long-term relationships and significant revenue contributions.</p>
                  <p className="text-2xl font-black text-white mt-4">Strategic & Collaborative</p>
                </div>
                <div className="bg-[#0d1a3a] border border-blue-700/50 rounded-lg p-6 text-center">
                  <Megaphone className="w-12 h-12 text-[#1E90FF] mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-blue-300 mb-2">Sponsored Events</h3>
                  <p className="text-gray-300 text-sm mb-2">Exclusive branding and activation opportunities at high-profile AthlynX-hosted events, delivering unparalleled experiential marketing and extensive media visibility, creating memorable brand moments and generating substantial income.</p>
                  <p className="text-2xl font-black text-white mt-4">Experiential & High-Profile</p>
                </div>
                <div className="bg-[#0d1a3a] border border-blue-700/50 rounded-lg p-6 text-center">
                  <Quote className="w-12 h-12 text-[#1E90FF] mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-blue-300 mb-2">Media Licensing</h3>
                  <p className="text-gray-300 text-sm mb-2">Syndication and distribution of AthlynX original content to external media outlets, expanding reach and generating additional revenue streams through diverse platforms and global partnerships, maximizing content value.</p>
                  <p className="text-2xl font-black text-white mt-4">Scalable & Expansive</p>
                </div>
              </div>
              <p className="text-center text-gray-400 mt-10 text-lg">
                Our diversified revenue streams ensure robust financial health and continuous investment in the AthlynX ecosystem, fostering a thriving environment for athletes and brands alike, and driving future innovation and global expansion.
              </p>
            </div>
          </section>

          {/* Philosophy Quote */}
          <section className="py-16 px-4 sm:px-6 lg:px-8 bg-[#050c1a]">
            <div className="max-w-3xl mx-auto bg-[#0d1a3a] border border-blue-700/50 rounded-lg shadow-lg p-8 text-center">
              <Quote className="w-16 h-16 text-cyan-400 mx-auto mb-6" />
              <blockquote className="text-2xl italic text-gray-200 leading-relaxed mb-6">
                "We built the stage. The athletes perform. The brand shines."
              </blockquote>
              <p className="text-xl font-bold text-blue-300">— Chad Dozier Sr., Founder of AthlynXAI</p>
            </div>
          </section>

          {/* Footer */}
          <footer className="bg-[#0d1a3a] border-t border-blue-700/50 py-8 px-4 sm:px-6 lg:px-8 text-center text-gray-400 text-sm">
            <div className="max-w-7xl mx-auto">
              <p className="mb-2">Copyright © 2026 Chad A. Dozier Sr. / AthlynXAI. All rights reserved.</p>
              <p className="font-bold text-[#1E90FF]">Be The Legacy.™</p>
            </div>
          </footer>
        </div>
        <MobileBottomNav />
      </DashboardLayout>
    </RouteErrorBoundary>
  );
}
