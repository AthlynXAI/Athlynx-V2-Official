import DashboardLayout from "@/components/DashboardLayout";
import MobileBottomNav from "@/components/MobileBottomNav";
import { RouteErrorBoundary } from "@/components/GlobalErrorBoundary";
import { Link } from "wouter";
import { useState, useEffect } from "react";
import {
  Users,
  Globe,
  ShieldCheck,
  Heart,
  MessageCircle,
  UserPlus,
  BadgeCheck,
  MessageSquare,
  Dumbbell,
  Award,
  Star,
  Share2,
  MoreHorizontal,
  Camera,
  Video,
  MapPin,
  Smile,
  Send,
  ThumbsUp,
  TrendingUp,
  Activity,
  Zap,
  Target,
  Trophy,
} from "lucide-react";

export default function AthleteSocialHub() {
  const [activeTab, setActiveTab] = useState("friends");
  const [postText, setPostText] = useState("");

  const socialPosts = [
    {
      id: 1,
      athlete: "Sarah J. (Track & Field)",
      sport: "Track & Field",
      content: "Just crushed my personal best in the 400m! Hard work pays off. Feeling stronger every day. #AthlynXAI #PB #TrackAndField #Dedication",
      likes: 125,
      comments: 18,
      shares: 5,
      time: "2 hours ago",
      avatar: "https://via.placeholder.com/40/1E90FF/FFFFFF?text=SJ"
    },
    {
      id: 2,
      athlete: "Mike D. (Basketball)",
      sport: "Basketball",
      content: "Great team practice today! Chemistry is building up for the next game. Focused on defense and ball movement. Let's go AthlynXAI! #BasketballLife #TeamWork #Hoops",
      likes: 98,
      comments: 12,
      shares: 2,
      time: "4 hours ago",
      avatar: "https://via.placeholder.com/40/4169E1/FFFFFF?text=MD"
    },
    {
      id: 3,
      athlete: "Emily R. (Soccer)",
      sport: "Soccer",
      content: "Pre-season training is intense but I'm loving every minute. Pushing my limits and ready to dominate the field! #SoccerGirl #AthlynXAI #TrainingHard",
      likes: 150,
      comments: 25,
      shares: 10,
      time: "6 hours ago",
      avatar: "https://via.placeholder.com/40/1E90FF/FFFFFF?text=ER"
    },
    {
      id: 4,
      athlete: "David L. (Swimming)",
      sport: "Swimming",
      content: "Early morning laps are the best way to start the day. Feeling refreshed and ready for competition. #SwimLife #AthlynXAI #MorningWorkout",
      likes: 75,
      comments: 9,
      shares: 1,
      time: "8 hours ago",
      avatar: "https://via.placeholder.com/40/4169E1/FFFFFF?text=DL"
    },
    {
      id: 5,
      athlete: "Jessica P. (Volleyball)",
      sport: "Volleyball",
      content: "Spiking my way through practice! Team energy is high. Can't wait for the next match. #Volleyball #AthlynXAI #TeamSpirit",
      likes: 110,
      comments: 20,
      shares: 4,
      time: "10 hours ago",
      avatar: "https://via.placeholder.com/40/1E90FF/FFFFFF?text=JP"
    },
    {
      id: 6,
      athlete: "Alex K. (Football)",
      sport: "Football",
      content: "Grinding in the weight room today. Getting stronger for the upcoming season. No days off! #Football #AthlynXAI #Grind",
      likes: 205,
      comments: 32,
      shares: 15,
      time: "12 hours ago",
      avatar: "https://via.placeholder.com/40/4169E1/FFFFFF?text=AK"
    },
  ];

  const sportCommunities = [
    { name: "Basketball", icon: <Trophy size={24} />, members: "12.5k" },
    { name: "Football", icon: <Trophy size={24} />, members: "15.2k" },
    { name: "Baseball", icon: <Trophy size={24} />, members: "8.9k" },
    { name: "Soccer", icon: <Trophy size={24} />, members: "18.1k" },
    { name: "Track & Field", icon: <Trophy size={24} />, members: "10.3k" },
    { name: "Volleyball", icon: <Trophy size={24} />, members: "7.4k" },
    { name: "Tennis", icon: <Trophy size={24} />, members: "6.8k" },
    { name: "Golf", icon: <Trophy size={24} />, members: "5.2k" },
    { name: "Swimming", icon: <Trophy size={24} />, members: "9.1k" },
    { name: "Weightlifting", icon: <Dumbbell size={24} />, members: "14.7k" },
  ];

  const trendingTopics = [
    "#AthlynXAI",
    "#GameDay",
    "#TrainingCamp",
    "#PersonalBest",
    "#TeamWork",
    "#Championship",
    "#NILDeals",
    "#AthleteLife",
  ];

  const suggestedConnections = [
    { name: "Chris T.", sport: "Basketball", role: "Athlete", avatar: "https://via.placeholder.com/40/1E90FF/FFFFFF?text=CT" },
    { name: "Coach Miller", sport: "Football", role: "Coach", avatar: "https://via.placeholder.com/40/4169E1/FFFFFF?text=CM" },
    { name: "Nike Sports", sport: "All", role: "Brand", avatar: "https://via.placeholder.com/40/1E90FF/FFFFFF?text=NS" },
  ];

  return (
    <RouteErrorBoundary>
      <DashboardLayout>
        <div className="min-h-screen bg-[#050c1a] text-white pb-20 md:pb-0">
          {/* Hero Section */}
          <section className="relative bg-gradient-to-r from-[#1E90FF] to-[#4169E1] text-white py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
            <div className="absolute inset-0 opacity-10">
              <Users className="absolute top-1/4 left-1/4 w-64 h-64 text-white/20 transform -translate-x-1/2 -translate-y-1/2" />
              <Globe className="absolute bottom-1/4 right-1/4 w-64 h-64 text-white/20 transform translate-x-1/2 translate-y-1/2" />
            </div>
            <div className="relative z-10 max-w-7xl mx-auto text-center">
              <h1 className="text-5xl sm:text-7xl font-black text-white mb-6 leading-tight tracking-tight">
                Your Circle. Your Community. Your Sport.
              </h1>
              <p className="text-xl sm:text-3xl font-medium mb-10 max-w-4xl mx-auto leading-relaxed">
                Connect, share, and grow with athletes worldwide. Forge new connections, celebrate achievements, and push your limits together. <span className="font-bold text-blue-200">Be The Legacy.</span>
              </p>
              <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6">
                <Link href="/connect" className="w-full sm:w-auto bg-white text-[#1E90FF] px-10 py-4 rounded-full text-xl font-bold hover:bg-gray-100 transition-colors duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                  Find Athletes
                </Link>
                <Link href="/communities" className="w-full sm:w-auto border-2 border-white text-white px-10 py-4 rounded-full text-xl font-bold hover:bg-white/10 transition-colors duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                  Explore Communities
                </Link>
              </div>
            </div>
          </section>

          {/* Community Rules Banner */}
          <section className="bg-[#0d1a3a] border-t border-b border-blue-700/50 py-16 px-4 sm:px-6 lg:px-8 text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-50"></div>
            <div className="max-w-5xl mx-auto relative z-10">
              <h2 className="text-4xl font-black text-white mb-6 flex items-center justify-center">
                <ShieldCheck size={40} className="text-cyan-400 mr-4" />
                Community Rules: Be Respectful & Thrive
              </h2>
              <p className="text-xl text-blue-300 mb-10 leading-relaxed">
                AthlynXAI fosters a positive and supportive environment for all athletes. We enforce a strict <span className="font-bold text-white bg-blue-900/50 px-2 py-1 rounded">zero-harassment policy</span> to ensure everyone feels safe and valued. Engage in constructive competition, celebrate successes, report any violations promptly, and understand that account suspensions are in place to protect our community's integrity and well-being.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
                <div className="bg-[#050c1a] p-8 rounded-xl border border-blue-700/50 hover:border-cyan-400/50 transition-colors duration-300 shadow-lg">
                  <div className="bg-blue-900/30 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                    <ShieldCheck size={24} className="text-cyan-400" />
                  </div>
                  <h3 className="text-xl font-bold text-blue-300 mb-3">Zero Harassment</h3>
                  <p className="text-gray-300 text-base leading-relaxed">Treat all members with respect and dignity. Any form of harassment, bullying, hate speech, or discrimination will not be tolerated and will result in immediate action.</p>
                </div>
                <div className="bg-[#050c1a] p-8 rounded-xl border border-blue-700/50 hover:border-cyan-400/50 transition-colors duration-300 shadow-lg">
                  <div className="bg-blue-900/30 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                    <Target size={24} className="text-cyan-400" />
                  </div>
                  <h3 className="text-xl font-bold text-blue-300 mb-3">Constructive Competition</h3>
                  <p className="text-gray-300 text-base leading-relaxed">Encourage and challenge each other positively. Focus on growth, sportsmanship, and mutual respect, fostering an environment free from negativity and unfair play.</p>
                </div>
                <div className="bg-[#050c1a] p-8 rounded-xl border border-blue-700/50 hover:border-cyan-400/50 transition-colors duration-300 shadow-lg">
                  <div className="bg-blue-900/30 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                    <Activity size={24} className="text-cyan-400" />
                  </div>
                  <h3 className="text-xl font-bold text-blue-300 mb-3">Report & Protect</h3>
                  <p className="text-gray-300 text-base leading-relaxed">Utilize our robust reporting system for any inappropriate behavior or content. Your safety and well-being are our utmost priority, and all reports are handled confidentially.</p>
                </div>
              </div>
            </div>
          </section>

          {/* Main Content Area - 3 Column Layout */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Left Sidebar - Navigation & Trending */}
              <div className="lg:col-span-3 space-y-8 hidden lg:block">
                <div className="bg-[#0d1a3a] rounded-xl border border-blue-700/50 p-6 sticky top-24">
                  <h3 className="text-xl font-bold text-white mb-6 flex items-center">
                    <TrendingUp size={20} className="text-cyan-400 mr-2" /> Trending Now
                  </h3>
                  <ul className="space-y-4">
                    {trendingTopics.map((topic, index) => (
                      <li key={index} className="flex items-center justify-between group cursor-pointer">
                        <span className="text-blue-300 group-hover:text-white transition-colors duration-200 font-medium">{topic}</span>
                        <span className="text-xs text-gray-500">{Math.floor(Math.random() * 10) + 1}k posts</span>
                      </li>
                    ))}
                  </ul>
                  <button className="w-full mt-6 py-2 text-sm text-cyan-400 hover:text-white transition-colors duration-200 font-bold">
                    Show More
                  </button>
                </div>

                <div className="bg-[#0d1a3a] rounded-xl border border-blue-700/50 p-6">
                  <h3 className="text-xl font-bold text-white mb-6 flex items-center">
                    <UserPlus size={20} className="text-cyan-400 mr-2" /> Suggested
                  </h3>
                  <ul className="space-y-4">
                    {suggestedConnections.map((conn, index) => (
                      <li key={index} className="flex items-center justify-between">
                        <div className="flex items-center">
                          <img src={conn.avatar} alt={conn.name} className="w-10 h-10 rounded-full mr-3 border border-blue-700/50" />
                          <div>
                            <p className="text-sm font-bold text-white">{conn.name}</p>
                            <p className="text-xs text-blue-300">{conn.role} • {conn.sport}</p>
                          </div>
                        </div>
                        <button className="text-cyan-400 hover:text-white transition-colors duration-200">
                          <UserPlus size={18} />
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Center Column - Feed */}
              <div className="lg:col-span-6 space-y-8">
                {/* Create Post Box */}
                <div className="bg-[#0d1a3a] rounded-xl border border-blue-700/50 p-6 shadow-lg">
                  <div className="flex items-start space-x-4">
                    <img src="https://via.placeholder.com/48/1E90FF/FFFFFF?text=ME" alt="Current User" className="w-12 h-12 rounded-full border-2 border-cyan-400" />
                    <div className="flex-1">
                      <textarea
                        className="w-full bg-[#050c1a] border border-blue-700/50 rounded-lg p-4 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 resize-none transition-all duration-300"
                        rows={3}
                        placeholder="Share your latest achievement, thought, or question..."
                        value={postText}
                        onChange={(e) => setPostText(e.target.value)}
                      ></textarea>
                      <div className="flex items-center justify-between mt-4">
                        <div className="flex space-x-2">
                          <button className="p-2 text-blue-300 hover:text-cyan-400 hover:bg-blue-900/30 rounded-full transition-colors duration-200" title="Add Photo">
                            <Camera size={20} />
                          </button>
                          <button className="p-2 text-blue-300 hover:text-cyan-400 hover:bg-blue-900/30 rounded-full transition-colors duration-200" title="Add Video">
                            <Video size={20} />
                          </button>
                          <button className="p-2 text-blue-300 hover:text-cyan-400 hover:bg-blue-900/30 rounded-full transition-colors duration-200" title="Add Location">
                            <MapPin size={20} />
                          </button>
                          <button className="p-2 text-blue-300 hover:text-cyan-400 hover:bg-blue-900/30 rounded-full transition-colors duration-200" title="Add Emoji">
                            <Smile size={20} />
                          </button>
                        </div>
                        <button 
                          className={`px-6 py-2 rounded-full font-bold flex items-center transition-all duration-300 ${postText.trim() ? 'bg-[#1E90FF] text-white hover:bg-[#4169E1] shadow-md hover:shadow-lg' : 'bg-blue-900/50 text-blue-300/50 cursor-not-allowed'}`}
                          disabled={!postText.trim()}
                        >
                          <Send size={16} className="mr-2" /> Post
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Feed Header */}
                <div className="flex items-center justify-between border-b border-blue-700/50 pb-4">
                  <h2 className="text-2xl font-black text-white">Your Feed</h2>
                  <div className="flex space-x-4 text-sm font-bold">
                    <button className="text-cyan-400 border-b-2 border-cyan-400 pb-1">Recent</button>
                    <button className="text-blue-300 hover:text-white transition-colors duration-200 pb-1">Trending</button>
                  </div>
                </div>

                {/* Posts */}
                <div className="space-y-6">
                  {socialPosts.map((post) => (
                    <div key={post.id} className="bg-[#0d1a3a] rounded-xl border border-blue-700/50 shadow-lg overflow-hidden hover:border-blue-500/50 transition-colors duration-300">
                      <div className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center">
                            <img src={post.avatar} alt={post.athlete} className="w-12 h-12 rounded-full mr-4 border-2 border-transparent hover:border-cyan-400 transition-colors duration-300 cursor-pointer" />
                            <div>
                              <p className="font-bold text-white text-lg hover:text-cyan-400 cursor-pointer transition-colors duration-200">{post.athlete}</p>
                              <div className="flex items-center text-blue-300 text-xs">
                                <span>{post.sport}</span>
                                <span className="mx-2">•</span>
                                <span>{post.time}</span>
                              </div>
                            </div>
                          </div>
                          <button className="text-gray-400 hover:text-white transition-colors duration-200 p-2 rounded-full hover:bg-blue-900/30">
                            <MoreHorizontal size={20} />
                          </button>
                        </div>
                        <p className="text-gray-200 text-base leading-relaxed mb-6 whitespace-pre-wrap">{post.content}</p>
                        
                        {/* Post Stats */}
                        <div className="flex items-center justify-between text-blue-300 text-sm mb-4 px-2">
                          <div className="flex items-center space-x-4">
                            <span className="flex items-center"><Heart size={14} className="mr-1 text-red-400 fill-current" /> {post.likes}</span>
                          </div>
                          <div className="flex items-center space-x-4">
                            <span>{post.comments} comments</span>
                            <span>{post.shares} shares</span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Post Actions */}
                      <div className="bg-[#050c1a]/50 px-6 py-3 border-t border-blue-700/30 flex items-center justify-between">
                        <button className="flex-1 flex items-center justify-center py-2 text-blue-300 hover:text-cyan-400 hover:bg-blue-900/30 rounded-lg transition-all duration-200 font-medium">
                          <ThumbsUp size={20} className="mr-2" /> Like
                        </button>
                        <button className="flex-1 flex items-center justify-center py-2 text-blue-300 hover:text-cyan-400 hover:bg-blue-900/30 rounded-lg transition-all duration-200 font-medium">
                          <MessageCircle size={20} className="mr-2" /> Comment
                        </button>
                        <button className="flex-1 flex items-center justify-center py-2 text-blue-300 hover:text-cyan-400 hover:bg-blue-900/30 rounded-lg transition-all duration-200 font-medium">
                          <Share2 size={20} className="mr-2" /> Share
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="text-center pt-4">
                  <button className="bg-transparent border border-blue-700 text-blue-300 px-8 py-3 rounded-full font-bold hover:bg-blue-900/30 hover:text-white transition-all duration-300">
                    Load More Posts
                  </button>
                </div>
              </div>

              {/* Right Sidebar - Network & Communities */}
              <div className="lg:col-span-3 space-y-8">
                {/* Friend/Teammate/Rival System Widget */}
                <div className="bg-[#0d1a3a] rounded-xl border border-blue-700/50 p-6 shadow-lg">
                  <h3 className="text-xl font-bold text-white mb-6 flex items-center">
                    <Users size={20} className="text-cyan-400 mr-2" /> Your Network
                  </h3>
                  
                  <div className="flex bg-[#050c1a] rounded-lg p-1 mb-6 border border-blue-700/30">
                    <button
                      className={`flex-1 py-2 text-sm font-bold rounded-md transition-all duration-200 ${activeTab === "friends" ? "bg-[#1E90FF] text-white shadow" : "text-blue-300 hover:text-white"}`}
                      onClick={() => setActiveTab("friends")}
                    >
                      Friends
                    </button>
                    <button
                      className={`flex-1 py-2 text-sm font-bold rounded-md transition-all duration-200 ${activeTab === "teammates" ? "bg-[#1E90FF] text-white shadow" : "text-blue-300 hover:text-white"}`}
                      onClick={() => setActiveTab("teammates")}
                    >
                      Team
                    </button>
                    <button
                      className={`flex-1 py-2 text-sm font-bold rounded-md transition-all duration-200 ${activeTab === "rivals" ? "bg-[#1E90FF] text-white shadow" : "text-blue-300 hover:text-white"}`}
                      onClick={() => setActiveTab("rivals")}
                    >
                      Rivals
                    </button>
                  </div>

                  <div className="space-y-4 min-h-[150px]">
                    {activeTab === "friends" && (
                      <>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="relative">
                              <img src="https://via.placeholder.com/32/1E90FF/FFFFFF?text=F1" alt="Friend" className="w-8 h-8 rounded-full" />
                              <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-[#0d1a3a] rounded-full"></div>
                            </div>
                            <span className="ml-3 text-sm font-medium text-gray-200">Marcus T.</span>
                          </div>
                          <MessageSquare size={16} className="text-blue-400 cursor-pointer hover:text-cyan-400" />
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="relative">
                              <img src="https://via.placeholder.com/32/4169E1/FFFFFF?text=F2" alt="Friend" className="w-8 h-8 rounded-full" />
                              <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-gray-500 border-2 border-[#0d1a3a] rounded-full"></div>
                            </div>
                            <span className="ml-3 text-sm font-medium text-gray-200">Elena R.</span>
                          </div>
                          <MessageSquare size={16} className="text-blue-400 cursor-pointer hover:text-cyan-400" />
                        </div>
                      </>
                    )}
                    {activeTab === "teammates" && (
                      <>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <img src="https://via.placeholder.com/32/1E90FF/FFFFFF?text=T1" alt="Teammate" className="w-8 h-8 rounded-full border border-cyan-400" />
                            <span className="ml-3 text-sm font-medium text-gray-200">Coach Davis</span>
                          </div>
                          <span className="text-xs bg-blue-900/50 text-cyan-400 px-2 py-1 rounded">Coach</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <img src="https://via.placeholder.com/32/4169E1/FFFFFF?text=T2" alt="Teammate" className="w-8 h-8 rounded-full" />
                            <span className="ml-3 text-sm font-medium text-gray-200">James W.</span>
                          </div>
                          <span className="text-xs bg-blue-900/50 text-blue-300 px-2 py-1 rounded">Captain</span>
                        </div>
                      </>
                    )}
                    {activeTab === "rivals" && (
                      <>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <img src="https://via.placeholder.com/32/FF4500/FFFFFF?text=R1" alt="Rival" className="w-8 h-8 rounded-full border border-red-500/50" />
                            <span className="ml-3 text-sm font-medium text-gray-200">State Univ.</span>
                          </div>
                          <Trophy size={16} className="text-red-400" />
                        </div>
                      </>
                    )}
                  </div>
                  
                  <button className="w-full mt-4 bg-blue-900/30 text-cyan-400 py-2 rounded-lg text-sm font-bold hover:bg-blue-900/50 transition-colors duration-200">
                    Manage Network
                  </button>
                </div>

                {/* Top Communities Widget */}
                <div className="bg-[#0d1a3a] rounded-xl border border-blue-700/50 p-6 shadow-lg">
                  <h3 className="text-xl font-bold text-white mb-6 flex items-center">
                    <Globe size={20} className="text-cyan-400 mr-2" /> Top Communities
                  </h3>
                  <div className="space-y-4">
                    {sportCommunities.slice(0, 5).map((community, index) => (
                      <div key={index} className="flex items-center justify-between group cursor-pointer">
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-lg bg-[#050c1a] border border-blue-700/50 flex items-center justify-center text-cyan-400 group-hover:border-cyan-400 group-hover:bg-blue-900/30 transition-all duration-300">
                            {community.icon}
                          </div>
                          <div className="ml-3">
                            <p className="text-sm font-bold text-white group-hover:text-cyan-400 transition-colors duration-200">{community.name}</p>
                            <p className="text-xs text-blue-300">{community.members} members</p>
                          </div>
                        </div>
                        <button className="text-xs bg-blue-900/50 text-white px-3 py-1 rounded-full hover:bg-[#1E90FF] transition-colors duration-200">
                          Join
                        </button>
                      </div>
                    ))}
                  </div>
                  <Link href="/communities" className="block text-center w-full mt-6 py-2 text-sm text-cyan-400 hover:text-white transition-colors duration-200 font-bold">
                    View All Communities
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Team Rooms Section */}
          <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#0a152a] border-t border-b border-blue-700/30">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-4xl font-black text-white mb-4">Private Team Rooms</h2>
                <p className="text-xl text-blue-300 max-w-3xl mx-auto">
                  Dedicated and secure spaces for your team to collaborate effectively. Share game film, discuss strategies, make important announcements, and foster a winning team dynamic.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-[#0d1a3a] p-8 rounded-2xl border border-blue-700/50 shadow-xl hover:shadow-2xl hover:border-cyan-400/50 transition-all duration-300 transform hover:-translate-y-2 group">
                  <div className="w-16 h-16 bg-blue-900/30 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-[#1E90FF] transition-colors duration-300">
                    <Video size={32} className="text-cyan-400 group-hover:text-white transition-colors duration-300" />
                  </div>
                  <h3 className="font-black text-white text-2xl mb-4">Game Film Analysis</h3>
                  <p className="text-gray-300 text-base leading-relaxed mb-6">Upload and review game footage with your team in high definition. Break down plays, analyze opponent strategies, and identify areas for individual and team improvement with integrated drawing tools.</p>
                  <button className="text-cyan-400 font-bold flex items-center group-hover:text-white transition-colors duration-300">
                    Enter Room <span className="ml-2">→</span>
                  </button>
                </div>
                
                <div className="bg-[#0d1a3a] p-8 rounded-2xl border border-blue-700/50 shadow-xl hover:shadow-2xl hover:border-cyan-400/50 transition-all duration-300 transform hover:-translate-y-2 group">
                  <div className="w-16 h-16 bg-blue-900/30 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-[#1E90FF] transition-colors duration-300">
                    <Target size={32} className="text-cyan-400 group-hover:text-white transition-colors duration-300" />
                  </div>
                  <h3 className="font-black text-white text-2xl mb-4">Strategy Discussions</h3>
                  <p className="text-gray-300 text-base leading-relaxed mb-6">Engage in real-time discussions about tactics, formations, and upcoming opponents. Share insights, draw up plays on the virtual whiteboard, and ensure everyone is on the same page before game day.</p>
                  <button className="text-cyan-400 font-bold flex items-center group-hover:text-white transition-colors duration-300">
                    Enter Room <span className="ml-2">→</span>
                  </button>
                </div>
                
                <div className="bg-[#0d1a3a] p-8 rounded-2xl border border-blue-700/50 shadow-xl hover:shadow-2xl hover:border-cyan-400/50 transition-all duration-300 transform hover:-translate-y-2 group">
                  <div className="w-16 h-16 bg-blue-900/30 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-[#1E90FF] transition-colors duration-300">
                    <Zap size={32} className="text-cyan-400 group-hover:text-white transition-colors duration-300" />
                  </div>
                  <h3 className="font-black text-white text-2xl mb-4">Team Announcements</h3>
                  <p className="text-gray-300 text-base leading-relaxed mb-6">Keep everyone updated with important news, schedules, and event details. Centralize communication to ensure no one misses critical information, practice changes, or travel itineraries.</p>
                  <button className="text-cyan-400 font-bold flex items-center group-hover:text-white transition-colors duration-300">
                    Enter Room <span className="ml-2">→</span>
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* AthlynX Verified Badge Explanation */}
          <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            <div className="bg-gradient-to-br from-[#0d1a3a] to-[#050c1a] rounded-3xl border border-blue-700/50 p-8 md:p-12 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-400/5 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#1E90FF]/10 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2"></div>
              
              <div className="relative z-10">
                <div className="text-center mb-12">
                  <h2 className="text-4xl font-black text-white mb-6 flex items-center justify-center">
                    <BadgeCheck size={48} className="text-cyan-400 mr-4" />
                    AthlynX Verified: Elite Status
                  </h2>
                  <p className="text-xl text-blue-300 max-w-3xl mx-auto leading-relaxed">
                    The <span className="font-bold text-white">AthlynX Verified badge</span> signifies authenticity, elite status, and significant achievement within our community. It is exclusively awarded to recognized entities that meet our stringent criteria for excellence and integrity.
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="bg-[#050c1a]/80 backdrop-blur-sm p-8 rounded-2xl border border-blue-700/30 text-center hover:border-cyan-400/50 transition-colors duration-300">
                    <div className="w-16 h-16 mx-auto bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center mb-6 shadow-lg shadow-blue-500/20">
                      <Trophy size={32} className="text-white" />
                    </div>
                    <h3 className="text-2xl font-black text-white mb-4">Elite Athletes</h3>
                    <p className="text-gray-300 text-base leading-relaxed">Recognized for their outstanding achievements, consistent high performance, and significant contributions to their sport at national or international levels.</p>
                  </div>
                  
                  <div className="bg-[#050c1a]/80 backdrop-blur-sm p-8 rounded-2xl border border-blue-700/30 text-center hover:border-cyan-400/50 transition-colors duration-300">
                    <div className="w-16 h-16 mx-auto bg-gradient-to-br from-gray-300 to-gray-500 rounded-full flex items-center justify-center mb-6 shadow-lg shadow-gray-500/20">
                      <Trophy size={32} className="text-white" />
                    </div>
                    <h3 className="text-2xl font-black text-white mb-4">Pro Coaches</h3>
                    <p className="text-gray-300 text-base leading-relaxed">Certified and highly experienced coaches who have a proven track record of guiding athletes to success. Their expertise is recognized with this verification.</p>
                  </div>
                  
                  <div className="bg-[#050c1a]/80 backdrop-blur-sm p-8 rounded-2xl border border-blue-700/30 text-center hover:border-cyan-400/50 transition-colors duration-300">
                    <div className="w-16 h-16 mx-auto bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center mb-6 shadow-lg shadow-blue-500/20">
                      <Trophy size={32} className="text-white" />
                    </div>
                    <h3 className="text-2xl font-black text-white mb-4">Official Brands</h3>
                    <p className="text-gray-300 text-base leading-relaxed">Partnerships with leading sports brands that provide authentic gear, exclusive content, and unique opportunities to our community.</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Link to NIL Messenger */}
          <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
            <div className="bg-[#0d1a3a] rounded-3xl border border-blue-700/50 p-12 shadow-2xl flex flex-col items-center">
              <div className="w-20 h-20 bg-gradient-to-br from-[#1E90FF] to-[#4169E1] rounded-full flex items-center justify-center mb-8 shadow-lg shadow-blue-500/30">
                <MessageSquare size={40} className="text-white" />
              </div>
              <h2 className="text-4xl font-black text-white mb-6">Private Conversations with NIL Messenger</h2>
              <p className="text-xl text-blue-300 mb-10 max-w-3xl leading-relaxed">
                Seamlessly connect and communicate privately with your network using the integrated <span className="font-bold text-white">NIL Messenger</span>. This secure messaging platform allows you to discuss opportunities, negotiate deals, share insights, and build professional relationships in a confidential environment.
              </p>
              <Link href="/nil-messenger" className="bg-[#1E90FF] text-white px-10 py-4 rounded-full text-xl font-bold hover:bg-[#4169E1] transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center">
                <MessageSquare size={24} className="mr-3" /> Open NIL Messenger
              </Link>
            </div>
          </section>

          {/* Footer */}
          <footer className="bg-[#050c1a] py-12 px-4 sm:px-6 lg:px-8 text-center border-t border-blue-700/50">
            <div className="max-w-7xl mx-auto flex flex-col items-center">
              <div className="flex items-center justify-center space-x-2 mb-6">
                <ShieldCheck size={24} className="text-[#1E90FF]" />
                <span className="text-2xl font-black text-white tracking-wider">AthlynX<span className="text-[#1E90FF]">AI</span></span>
              </div>
              <p className="text-blue-300 text-base mb-4">
                Copyright © 2026 Chad A. Dozier Sr. / AthlynXAI. All rights reserved.
              </p>
              <p className="text-xl font-black text-white tracking-widest uppercase">
                BE THE LEGACY.™
              </p>
            </div>
          </footer>
        </div>
        <MobileBottomNav />
      </DashboardLayout>
    </RouteErrorBoundary>
  );
}
