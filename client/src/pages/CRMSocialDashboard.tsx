import DashboardLayout from "@/components/DashboardLayout";
import MobileBottomNav from "@/components/MobileBottomNav";
import { RouteErrorBoundary } from "@/components/GlobalErrorBoundary";
import { Link } from "wouter";
import { useState, useEffect } from "react";
import { BarChart3, Users, MessageSquare, Calendar, TrendingUp, DollarSign, Award, RefreshCcw, Bell, Share2, Heart, MessageCircle, Eye, Trophy } from "lucide-react";

const socialPlatforms = [
  { name: "Meta", icon: Trophy, followers: "1.2M", following: "500", engagement: "3.5%", lastPost: "2h ago", reach: "2.5M", impressions: "10M" },
  { name: "Instagram", icon: Trophy, followers: "850K", following: "300", engagement: "4.2%", lastPost: "1h ago", reach: "1.8M", impressions: "8M" },
  { name: "X", icon: Trophy, followers: "600K", following: "1.5K", engagement: "2.8%", lastPost: "30m ago", reach: "1.2M", impressions: "5M" },
  { name: "LinkedIn", icon: Trophy, followers: "200K", following: "100", engagement: "1.5%", lastPost: "4h ago", reach: "400K", impressions: "1.5M" },
  { name: "TikTok", icon: Trophy, followers: "2.5M", following: "200", engagement: "5.1%", lastPost: "15m ago", reach: "5M", impressions: "20M" },
  { name: "YouTube", icon: Trophy, followers: "1.8M", following: "50", engagement: "6.0%", lastPost: "1d ago", reach: "3M", impressions: "12M" },
];

const mockMessages = [
  { id: 1, platform: "Instagram", sender: "Fan_123", message: "Awesome post!", time: "5m ago", avatar: "https://via.placeholder.com/30/FF0000/FFFFFF?text=F", read: false },
  { id: 2, platform: "X", sender: "BrandX_Official", message: "Let's collaborate!", time: "15m ago", avatar: "https://via.placeholder.com/30/0000FF/FFFFFF?text=B", read: true },
  { id: 3, platform: "Meta", sender: "Follower456", message: "Love your content!", time: "30m ago", avatar: "https://via.placeholder.com/30/008000/FFFFFF?text=F", read: false },
  { id: 4, platform: "LinkedIn", sender: "Recruiter_Pro", message: "Interested in your profile.", time: "1h ago", avatar: "https://via.placeholder.com/30/FFFF00/000000?text=R", read: true },
  { id: 5, platform: "TikTok", sender: "User_789", message: "Can you do a duet?", time: "2h ago", avatar: "https://via.placeholder.com/30/800080/FFFFFF?text=U", read: false },
  { id: 6, platform: "YouTube", sender: "Subscriber_Fan", message: "Great video, keep it up!", time: "3h ago", avatar: "https://via.placeholder.com/30/FFA500/FFFFFF?text=S", read: true },
  { id: 7, platform: "Instagram", sender: "Brand_Partner", message: "Checking in on our campaign.", time: "4h ago", avatar: "https://via.placeholder.com/30/FFC0CB/000000?text=B", read: false },
  { id: 8, platform: "X", sender: "Sports_Analyst", message: "Insightful tweet!", time: "5h ago", avatar: "https://via.placeholder.com/30/ADD8E6/000000?text=A", read: true },
];

const mockCalendarEvents = [
  { date: "2026-06-07", platform: "Instagram", content: "New Reel: Training Day", time: "10:00 AM" },
  { date: "2026-06-08", platform: "X", content: "Q&A Session", time: "02:00 PM" },
  { date: "2026-06-09", platform: "YouTube", content: "Vlog: Game Prep", time: "04:00 PM" },
  { date: "2026-06-10", platform: "Meta", content: "Live Q&A", time: "01:00 PM" },
  { date: "2026-06-11", platform: "LinkedIn", content: "Article: Athlete Journey", time: "09:00 AM" },
  { date: "2026-06-12", platform: "TikTok", content: "Challenge Video", time: "03:00 PM" },
  { date: "2026-06-13", platform: "Instagram", content: "Story: Behind the Scenes", time: "11:00 AM" },
  { date: "2026-06-14", platform: "X", content: "Poll: Favorite Play", time: "05:00 PM" },
];

const mockNILDeals = [
  { brand: "Sportswear Co.", platform: "Instagram", engagement: "High", status: "Active", value: "$50,000" },
  { brand: "Energy Drink Inc.", platform: "X", engagement: "Medium", status: "Pending", value: "$20,000" },
  { brand: "Tech Gadgets", platform: "YouTube", engagement: "High", status: "Negotiating", value: "$75,000" },
  { brand: "Nutrition Supplements", platform: "TikTok", engagement: "Medium", status: "Active", value: "$30,000" },
  { brand: "Gaming Gear", platform: "Twitch (via YouTube)", engagement: "Low", status: "Proposed", value: "$15,000" },
];

const mockFollowerData = [
  { month: "Jan", followers: 1000000 },
  { month: "Feb", followers: 1100000 },
  { month: "Mar", followers: 1250000 },
  { month: "Apr", followers: 1300000 },
  { month: "May", followers: 1450000 },
  { month: "Jun", followers: 1500000 },
  { month: "Jul", followers: 1600000 },
  { month: "Aug", followers: 1750000 },
  { month: "Sep", followers: 1800000 },
  { month: "Oct", followers: 1950000 },
  { month: "Nov", followers: 2000000 },
  { month: "Dec", followers: 2100000 },
];

const mockEngagementData = [
  { platform: "Meta", rate: 3.5 },
  { platform: "Instagram", rate: 4.2 },
  { platform: "X", rate: 2.8 },
  { platform: "LinkedIn", rate: 1.5 },
  { platform: "TikTok", rate: 5.1 },
  { platform: "YouTube", rate: 6.0 },
];

const getDayName = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { weekday: 'short' });
};

const getMonthDay = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

export default function CRMSocialDashboard() {
  const [athleteScore, setAthleteScore] = useState(85);

  useEffect(() => {
    // Simulate score update or data fetching
    const timer = setTimeout(() => {
      setAthleteScore(88); // Example update
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <RouteErrorBoundary>
      <DashboardLayout>
        <div className="min-h-screen bg-[#050c1a] text-white p-4 sm:p-6 lg:p-8">
          {/* Hero Section */}
          <section className="bg-gradient-to-r from-[#1E90FF] to-[#4169E1] text-white p-8 rounded-lg shadow-lg mb-8 flex flex-col sm:flex-row items-center justify-between">
            <div className="flex items-center mb-4 sm:mb-0">
              <BarChart3 className="w-12 h-12 mr-4" />
              <Users className="w-12 h-12 mr-4" />
              <div>
                <h1 className="text-4xl font-black mb-2">Your Social Empire.</h1>
                <p className="text-xl">Managed in One Place.</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold">AthlynX CRM Social Media Command Center</p>
              <p className="text-sm opacity-80">"Be The Legacy"</p>
            </div>
          </section>

          {/* Social Overview Dashboard */}
          <section className="mb-8">
            <h2 className="text-3xl font-black text-white mb-6">Social Overview</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {socialPlatforms.map((platform, index) => (
                <div key={index} className="bg-[#0d1a3a] p-6 rounded-lg shadow-md border border-blue-700/50">
                  <div className="flex items-center mb-4">
                    <platform.icon className="w-8 h-8 text-[#1E90FF] mr-3" />
                    <h3 className="text-xl font-bold text-blue-300">{platform.name}</h3>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-400">Followers</p>
                      <p className="text-white text-lg font-semibold">{platform.followers}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Following</p>
                      <p className="text-white text-lg font-semibold">{platform.following}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Engagement Rate</p>
                      <p className="text-white text-lg font-semibold">{platform.engagement}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Reach</p>
                      <p className="text-white text-lg font-semibold">{platform.reach}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Impressions</p>
                      <p className="text-white text-lg font-semibold">{platform.impressions}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Last Post</p>
                      <p className="text-white text-lg font-semibold">{platform.lastPost}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Unified Inbox */}
            <section className="bg-[#0d1a3a] p-6 rounded-lg shadow-md border border-blue-700/50">
              <h2 className="text-3xl font-black text-white mb-6 flex items-center">
                <MessageSquare className="w-7 h-7 mr-3 text-cyan-400" /> Unified Inbox
              </h2>
              <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                {mockMessages.map((msg) => (
                  <div key={msg.id} className={`flex items-start p-4 rounded-lg ${msg.read ? 'bg-[#050c1a]' : 'bg-[#050c1a]/70 border border-blue-700/30'}`}>
                    <img src={msg.avatar} alt="avatar" className="w-8 h-8 rounded-full mr-3" />
                    <div className="flex-grow">
                      <p className="text-sm font-bold text-blue-300">{msg.sender} <span className="text-gray-500 text-xs font-normal">on {msg.platform}</span></p>
                      <p className="text-white">{msg.message}</p>
                      <p className="text-gray-500 text-xs">{msg.time}</p>
                    </div>
                    {!msg.read && <Bell className="w-5 h-5 text-blue-400" />}
                  </div>
                ))}
              </div>
            </section>

            {/* Content Calendar */}
            <section className="bg-[#0d1a3a] p-6 rounded-lg shadow-md border border-blue-700/50">
              <h2 className="text-3xl font-black text-white mb-6 flex items-center">
                <Calendar className="w-7 h-7 mr-3 text-cyan-400" /> Content Calendar
              </h2>
              <div className="grid grid-cols-7 text-center text-blue-300 font-bold mb-4">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                  <div key={day}>{day}</div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-2">
                {Array.from({ length: 21 }).map((_, i) => {
                  const date = new Date();
                  date.setDate(date.getDate() + i);
                  const dateString = date.toISOString().split('T')[0];
                  const eventsToday = mockCalendarEvents.filter(event => event.date === dateString);
                  return (
                    <div key={i} className={`p-2 rounded-lg text-center min-h-[80px] ${eventsToday.length > 0 ? "bg-[#1E90FF]/20 border border-blue-700/50" : "bg-[#050c1a] border border-transparent"}`}>
                      <p className="text-sm font-semibold text-white">{date.getDate()}</p>
                      {eventsToday.map((event, idx) => (
                        <div key={idx} className="text-xs text-cyan-400 mt-1 truncate" title={`${event.platform}: ${event.content} at ${event.time}`}>
                          {event.platform}: {event.content}
                        </div>
                      ))}
                    </div>
                  );
                })}
              </div>
            </section>
          </div>

          {/* Analytics Section */}
          <section className="mb-8">
            <h2 className="text-3xl font-black text-white mb-6 flex items-center">
              <TrendingUp className="w-7 h-7 mr-3 text-cyan-400" /> Analytics
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-[#0d1a3a] p-6 rounded-lg shadow-md border border-blue-700/50">
                <h3 className="text-xl font-bold text-blue-300 mb-4">Follower Growth</h3>
                <div className="h-64 relative pb-8">
                  {/* Simple Line Chart (div-based) */}
                  <div className="absolute bottom-0 left-0 right-0 h-full flex items-end justify-around px-4">
                    {mockFollowerData.map((data, index) => {
                      const maxFollowers = Math.max(...mockFollowerData.map(d => d.followers));
                      const height = (data.followers / maxFollowers) * 100;
                      return (
                        <div key={index} className="flex flex-col items-center h-full justify-end w-1/12">
                          <div style={{ height: `${height}%` }} className="w-2 bg-[#1E90FF] rounded-t-full relative group">
                            <span className="absolute -top-6 text-xs text-white left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">{`${(data.followers / 1000000).toFixed(1)}M`}</span>
                          </div>
                          <span className="text-xs text-gray-400 mt-2">{data.month}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
              <div className="bg-[#0d1a3a] p-6 rounded-lg shadow-md border border-blue-700/50">
                <h3 className="text-xl font-bold text-blue-300 mb-4">Engagement Rate by Platform</h3>
                <div className="h-64 relative pb-8">
                  {/* Simple Bar Chart (div-based) */}
                  <div className="absolute bottom-0 left-0 right-0 h-full flex items-end justify-around px-4">
                    {mockEngagementData.map((data, index) => {
                      const maxHeight = Math.max(...mockEngagementData.map(d => d.rate));
                      const height = (data.rate / maxHeight) * 100;
                      return (
                        <div key={index} className="flex flex-col items-center h-full justify-end w-1/6">
                          <div style={{ height: `${height}%` }} className="w-4 bg-cyan-400 rounded-t-md relative group">
                            <span className="absolute -top-6 text-xs text-white left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">{`${data.rate}%`}</span>
                          </div>
                          <span className="text-xs text-gray-400 mt-2">{data.platform}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-8 bg-[#0d1a3a] p-6 rounded-lg shadow-md border border-blue-700/50">
              <h3 className="text-xl font-bold text-blue-300 mb-4">Best Posting Times & Content Insights</h3>
              <p className="text-white mb-4">Based on historical engagement, here are insights to optimize your content strategy:</p>
              <ul className="list-disc list-inside text-white ml-4 space-y-2">
                <li>**Weekdays (10 AM - 12 PM PST):** High engagement for educational content and announcements.</li>
                <li>**Weekends (1 PM - 3 PM PST):** Best for lifestyle content and behind-the-scenes glimpses.</li>
                <li>**Instagram Peak:** Tuesday 11 AM - Reels and Stories perform exceptionally well.</li>
                <li>**X Peak:** Wednesday 9 AM - Short-form updates and interactive polls drive most engagement.</li>
                <li>**YouTube Strategy:** Long-form video content thrives on Thursdays and Fridays for weekend viewing.</li>
                <li>**LinkedIn Advantage:** Post industry insights and career updates on Monday mornings for professional reach.</li>
                <li>**TikTok Trends:** Short, trending videos see highest virality during evening hours (7 PM - 9 PM PST).</li>
              </ul>
              <div className="mt-6 flex items-center text-gray-400">
                <Eye className="w-5 h-5 mr-2" />
                <p>Pro-tip: Analyze individual post performance for deeper insights.</p>
              </div>
            </div>
          </section>

          {/* NIL Deal Tracker */}
          <section className="mb-8">
            <h2 className="text-3xl font-black text-white mb-6 flex items-center">
              <DollarSign className="w-7 h-7 mr-3 text-cyan-400" /> NIL Deal Tracker
            </h2>
            <div className="bg-[#0d1a3a] p-6 rounded-lg shadow-md border border-blue-700/50">
              <table className="min-w-full table-auto">
                <thead>
                  <tr className="text-left text-blue-300 font-bold border-b border-blue-700/50">
                    <th className="pb-3">Brand</th>
                    <th className="pb-3">Platform</th>
                    <th className="pb-3">Engagement</th>
                    <th className="pb-3">Status</th>
                    <th className="pb-3">Estimated Value</th>
                  </tr>
                </thead>
                <tbody>
                  {mockNILDeals.map((deal, index) => (
                    <tr key={index} className="border-b border-blue-700/20 last:border-b-0">
                      <td className="py-3 text-white">{deal.brand}</td>
                      <td className="py-3 text-white">{deal.platform}</td>
                      <td className="py-3 text-white">{deal.engagement}</td>
                      <td className="py-3 text-white">{deal.status}</td>
                      <td className="py-3 text-white">{deal.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="mt-6 text-right">
                <Link href="/nil-deals" className="text-[#1E90FF] hover:underline flex items-center justify-end">
                  View All NIL Deals <Share2 className="w-4 h-4 ml-2" />
                </Link>
              </div>
            </div>
          </section>

          {/* Athlete Social Score */}
          <section className="mb-8">
            <h2 className="text-3xl font-black text-white mb-6 flex items-center">
              <Award className="w-7 h-7 mr-3 text-cyan-400" /> Athlete Social Score
            </h2>
            <div className="bg-[#0d1a3a] p-6 rounded-lg shadow-md border border-blue-700/50 flex flex-col sm:flex-row items-center justify-between">
              <div className="mb-4 sm:mb-0">
                <p className="text-blue-300 font-bold text-lg">Current Score</p>
                <p className="text-white text-6xl font-black">{athleteScore}<span className="text-xl text-gray-400">/100</span></p>
                <p className="text-gray-400 mt-2 max-w-md">A composite score reflecting your overall social media influence and brand safety, calculated from reach, engagement, consistency, and audience sentiment.</p>
              </div>
              <div className="text-right">
                <p className="text-cyan-400 text-sm">Last Updated: {new Date().toLocaleTimeString()}</p>
                <button className="mt-2 px-4 py-2 bg-[#1E90FF] text-white rounded-md hover:bg-[#4169E1] transition-colors duration-200 flex items-center justify-center">
                  <RefreshCcw className="w-4 h-4 mr-2" /> Recalculate Score
                </button>
                <div className="mt-4 text-left sm:text-right">
                  <p className="text-blue-300 font-bold">Key Factors:</p>
                  <ul className="text-gray-400 text-sm list-disc list-inside">
                    <li>Reach: <span className="text-white">Excellent</span></li>
                    <li>Engagement: <span className="text-white">Very Good</span></li>
                    <li>Brand Safety: <span className="text-white">High</span></li>
                    <li>Consistency: <span className="text-white">Consistent</span></li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* AthlynX CRM Sync */}
          <section className="mb-8">
            <h2 className="text-3xl font-black text-white mb-6 flex items-center">
              <Link href="/crm-integration" className="text-cyan-400 hover:underline flex items-center">
                <RefreshCcw className="w-7 h-7 mr-3" /> AthlynX CRM Sync
              </Link>
            </h2>
            <div className="bg-[#0d1a3a] p-6 rounded-lg shadow-md border border-blue-700/50">
              <p className="text-white mb-4">Seamlessly integrate your social media data with your AthlynX CRM profile. This enriches athlete profiles with real-time insights for:</p>
              <ul className="list-disc list-inside text-white ml-4 space-y-2">
                <li>**Targeted Recruiting:** Identify athletes with strong social presence and engagement.</li>
                <li>**Optimized NIL Deal Matching:** Connect athletes with brands that align with their audience demographics and content themes.</li>
                <li>**Comprehensive Performance Tracking:** Gain a holistic view of an athlete's influence beyond on-field performance.</li>
                <li>**Personalized Brand Outreach:** Craft compelling proposals based on an athlete's proven social media impact.</li>
                <li>**Automated Reporting:** Generate detailed reports on social media growth and NIL opportunities directly within CRM.</li>
              </ul>
              <button className="mt-6 px-6 py-3 bg-[#1E90FF] text-white rounded-md hover:bg-[#4169E1] transition-colors duration-200">
                Manage CRM Integration
              </button>
              <div className="mt-4 text-gray-400 text-sm">
                <p>Last Sync: {new Date().toLocaleString()}</p>
                <p>Data Privacy: Your social data is securely processed and used only to enhance your CRM profile for career opportunities.</p>
              </div>
            </div>
          </section>

          {/* Footer */}
          <footer className="text-center text-gray-500 text-sm mt-12 pt-8 border-t border-blue-700/20">
            <p>Copyright © 2026 Chad A. Dozier Sr. / AthlynXAI. All rights reserved. Be The Legacy.™</p>
          </footer>
        </div>
        <MobileBottomNav />
      </DashboardLayout>
    </RouteErrorBoundary>
  );
}
