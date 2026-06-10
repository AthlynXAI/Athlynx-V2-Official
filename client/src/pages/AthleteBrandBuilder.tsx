import DashboardLayout from "@/components/DashboardLayout";
import MobileBottomNav from "@/components/MobileBottomNav";
import { RouteErrorBoundary } from "@/components/GlobalErrorBoundary";
import { Link } from "wouter";
import { useState, useEffect } from "react";
import {
  Star,
  Zap,
  User,
  Edit,
  BarChart2,
  Link2,
  Palette,
  Image,
  DollarSign,
  Table,
  Tag,
  Mic,
  Lightbulb,
  CheckSquare,
  Award,
  Briefcase,
  Handshake,
  Percent,
} from "lucide-react";

export default function AthleteBrandBuilder() {
  return (
    <RouteErrorBoundary>
      <DashboardLayout>
        <div className="min-h-screen bg-[#050c1a] text-white p-4 sm:p-6 lg:p-8">
          {/* Hero Section */}
          <section className="relative overflow-hidden rounded-lg mb-12 p-8 sm:p-12 lg:p-16 bg-gradient-to-r from-[#1E90FF] to-[#4169E1] text-white shadow-lg">
            <div className="absolute inset-0 opacity-10">
              <Star className="w-48 h-48 text-white/20 absolute -top-10 -left-10 transform rotate-12" />
              <Zap className="w-48 h-48 text-white/20 absolute -bottom-10 -right-10 transform -rotate-12" />
            </div>
            <div className="relative z-10 max-w-4xl mx-auto text-center">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black mb-4 leading-tight">
                Your Name. Your Image. Your Likeness. Your Legacy.
              </h1>
              <p className="text-lg sm:text-xl lg:text-2xl font-medium opacity-90 mb-8">
                Build your personal brand, maximize your NIL value, and secure your future.
              </p>
              <Link
                href="/brand-strategy"
                className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-[#1E90FF] bg-white hover:bg-gray-100 md:py-4 md:px-10 md:text-lg transition-all duration-300"
              >
                Start Building Your Legacy
              </Link>
            </div>
          </section>

          {/* Brand Profile Builder */}
          <section className="mb-12">
            <h2 className="text-3xl sm:text-4xl font-black text-white mb-8 text-center">
              <User className="inline-block w-8 h-8 mr-3 text-cyan-400" /> Brand Profile Builder
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-[#0d1a3a] rounded-lg p-6 shadow-md border border-blue-700/50">
                <h3 className="text-xl font-bold text-blue-300 mb-4 flex items-center">
                  <Edit className="w-5 h-5 mr-2 text-[#1E90FF]" /> Bio & Story Editor
                </h3>
                <p className="text-gray-300 text-sm mb-4">Craft your compelling narrative and personal bio.</p>
                <textarea
                  className="w-full p-3 rounded-md bg-[#050c1a] border border-blue-700/50 text-white focus:ring-[#1E90FF] focus:border-[#1E90FF] outline-none"
                  rows={5}
                  placeholder="Tell your story here..."
                ></textarea>
                <button className="mt-4 w-full bg-[#1E90FF] text-white py-2 rounded-md hover:bg-[#4169E1] transition-colors duration-300">
                  Save Bio
                </button>
              </div>

              <div className="bg-[#0d1a3a] rounded-lg p-6 shadow-md border border-blue-700/50">
                <h3 className="text-xl font-bold text-blue-300 mb-4 flex items-center">
                  <BarChart2 className="w-5 h-5 mr-2 text-[#1E90FF]" /> Stats & Achievements
                </h3>
                <p className="text-gray-300 text-sm mb-4">Showcase your athletic and academic accomplishments.</p>
                <ul className="space-y-2 text-gray-200">
                  <li>
                    <span className="font-semibold text-cyan-400">Sport:</span> Football
                  </li>
                  <li>
                    <span className="font-semibold text-cyan-400">Position:</span> Quarterback
                  </li>
                  <li>
                    <span className="font-semibold text-cyan-400">Key Stat 1:</span> 3,500 Passing Yards
                  </li>
                  <li>
                    <span className="font-semibold text-cyan-400">Key Stat 2:</span> 30 Touchdowns
                  </li>
                  <li>
                    <span className="font-semibold text-cyan-400">GPA:</span> 3.8
                  </li>
                </ul>
                <button className="mt-4 w-full bg-[#1E90FF] text-white py-2 rounded-md hover:bg-[#4169E1] transition-colors duration-300">
                  Update Stats
                </button>
              </div>

              <div className="bg-[#0d1a3a] rounded-lg p-6 shadow-md border border-blue-700/50">
                <h3 className="text-xl font-bold text-blue-300 mb-4 flex items-center">
                  <Link2 className="w-5 h-5 mr-2 text-[#1E90FF]" /> Highlight & Social Links
                </h3>
                <p className="text-gray-300 text-sm mb-4">Connect your highlight reels and social media profiles.</p>
                <div className="space-y-3">
                  <div>
                    <label htmlFor="highlights" className="block text-sm font-medium text-gray-400">Highlight Reel</label>
                    <input
                      type="url"
                      id="highlights"
                      className="w-full p-2 rounded-md bg-[#050c1a] border border-blue-700/50 text-white focus:ring-[#1E90FF] focus:border-[#1E90FF] outline-none"
                      placeholder="https://youtube.com/my-highlights"
                    />
                  </div>
                  <div>
                    <label htmlFor="instagram" className="block text-sm font-medium text-gray-400">Instagram</label>
                    <input
                      type="url"
                      id="instagram"
                      className="w-full p-2 rounded-md bg-[#050c1a] border border-blue-700/50 text-white focus:ring-[#1E90FF] focus:border-[#1E90FF] outline-none"
                      placeholder="https://instagram.com/my-profile"
                    />
                  </div>
                  <div>
                    <label htmlFor="twitter" className="block text-sm font-medium text-gray-400">X (Twitter)</label>
                    <input
                      type="url"
                      id="twitter"
                      className="w-full p-2 rounded-md bg-[#050c1a] border border-blue-700/50 text-white focus:ring-[#1E90FF] focus:border-[#1E90FF] outline-none"
                      placeholder="https://x.com/my-profile"
                    />
                  </div>
                </div>
                <button className="mt-4 w-full bg-[#1E90FF] text-white py-2 rounded-md hover:bg-[#4169E1] transition-colors duration-300">
                  Save Links
                </button>
              </div>

              <div className="bg-[#0d1a3a] rounded-lg p-6 shadow-md border border-blue-700/50">
                <h3 className="text-xl font-bold text-blue-300 mb-4 flex items-center">
                  <Palette className="w-5 h-5 mr-2 text-[#1E90FF]" /> Brand Color Picker
                </h3>
                <p className="text-gray-300 text-sm mb-4">Select your primary and secondary brand colors.</p>
                <div className="flex items-center space-x-4 mb-4">
                  <label htmlFor="primaryColor" className="text-gray-400">Primary:</label>
                  <input type="color" id="primaryColor" defaultValue="#1E90FF" className="w-10 h-10 rounded-full border-2 border-blue-700/50 cursor-pointer" />
                </div>
                <div className="flex items-center space-x-4">
                  <label htmlFor="secondaryColor" className="text-gray-400">Secondary:</label>
                  <input type="color" id="secondaryColor" defaultValue="#4169E1" className="w-10 h-10 rounded-full border-2 border-blue-700/50 cursor-pointer" />
                </div>
                <button className="mt-4 w-full bg-[#1E90FF] text-white py-2 rounded-md hover:bg-[#4169E1] transition-colors duration-300">
                  Apply Colors
                </button>
              </div>

              <div className="bg-[#0d1a3a] rounded-lg p-6 shadow-md border border-blue-700/50">
                <h3 className="text-xl font-bold text-blue-300 mb-4 flex items-center">
                  <Image className="w-5 h-5 mr-2 text-[#1E90FF]" /> Personal Logo Section
                </h3>
                <p className="text-gray-300 text-sm mb-4">Upload or design your unique personal brand logo.</p>
                <div className="flex items-center justify-center w-full mb-4">
                  <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-32 border-2 border-blue-700/50 border-dashed rounded-lg cursor-pointer bg-[#050c1a] hover:bg-[#0d1a3a]/50 transition-colors duration-300">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <svg className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L7 9m3-3 3 3"/>
                      </svg>
                      <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
                    </div>
                    <input id="dropzone-file" type="file" className="hidden" />
                  </label>
                </div>
                <button className="mt-4 w-full bg-[#1E90FF] text-white py-2 rounded-md hover:bg-[#4169E1] transition-colors duration-300">
                  Upload Logo
                </button>
              </div>
            </div>
          </section>

          {/* NIL Value Estimator */}
          <section className="mb-12">
            <h2 className="text-3xl sm:text-4xl font-black text-white mb-8 text-center">
              <DollarSign className="inline-block w-8 h-8 mr-3 text-cyan-400" /> NIL Value Estimator
            </h2>
            <div className="bg-[#0d1a3a] rounded-lg p-6 shadow-md border border-blue-700/50 overflow-x-auto">
              <h3 className="text-xl font-bold text-blue-300 mb-4 flex items-center">
                <Table className="w-5 h-5 mr-2 text-[#1E90FF]" /> Estimated NIL Value by Factors
              </h3>
              <table className="min-w-full divide-y divide-blue-700/50">
                <thead>
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Factor</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Description</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Estimated Annual Value</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-blue-700/30">
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">D1 Football QB (SEC)</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">High-profile position in a major conference.</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-cyan-400">$500K - $2M+</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">D1 Basketball (Power Conf.)</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">Key player in a top-tier basketball program.</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-cyan-400">$300K - $1M</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">D1 Olympic Sport (Star)</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">Nationally recognized athlete in sports like Gymnastics, Track & Field.</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-cyan-400">$50K - $250K</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">High School Athlete (Top Recruit)</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">Highly sought-after recruit with significant social media presence.</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-cyan-400">$10K - $100K</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">Social Media Following (100K+)</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">Strong engagement and reach on platforms like TikTok.</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-cyan-400">+$50K - $500K</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">Academic Standing (Dean
's List)</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">Demonstrates commitment and responsibility beyond athletics.</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-cyan-400">+$5K - $25K</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Brand Identity Section */}
          <section className="mb-12">
            <h2 className="text-3xl sm:text-4xl font-black text-white mb-8 text-center">
              <Tag className="inline-block w-8 h-8 mr-3 text-cyan-400" /> Brand Identity
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-[#0d1a3a] rounded-lg p-6 shadow-md border border-blue-700/50">
                <h3 className="text-xl font-bold text-blue-300 mb-4 flex items-center">
                  <Lightbulb className="w-5 h-5 mr-2 text-[#1E90FF]" /> Tagline Builder
                </h3>
                <p className="text-gray-300 text-sm mb-4">Create a memorable tagline that encapsulates your brand.</p>
                <input
                  type="text"
                  className="w-full p-3 rounded-md bg-[#050c1a] border border-blue-700/50 text-white focus:ring-[#1E90FF] focus:border-[#1E90FF] outline-none"
                  placeholder="Enter keywords to generate taglines..."
                />
                <button className="mt-4 w-full bg-[#1E90FF] text-white py-2 rounded-md hover:bg-[#4169E1] transition-colors duration-300">
                  Generate Taglines
                </button>
              </div>

              <div className="bg-[#0d1a3a] rounded-lg p-6 shadow-md border border-blue-700/50">
                <h3 className="text-xl font-bold text-blue-300 mb-4 flex items-center">
                  <Mic className="w-5 h-5 mr-2 text-[#1E90FF]" /> Brand Voice Guide
                </h3>
                <p className="text-gray-300 text-sm mb-4">Define your communication style and tone across all platforms.</p>
                <ul className="list-disc list-inside text-gray-200 space-y-1">
                  <li>Authentic & Relatable</li>
                  <li>Confident & Inspiring</li>
                  <li>Professional & Articulate</li>
                  <li>Engaging & Approachable</li>
                </ul>
                <button className="mt-4 w-full bg-[#1E90FF] text-white py-2 rounded-md hover:bg-[#4169E1] transition-colors duration-300">
                  Customize Voice
                </button>
              </div>

              <div className="bg-[#0d1a3a] rounded-lg p-6 shadow-md border border-blue-700/50">
                <h3 className="text-xl font-bold text-blue-300 mb-4 flex items-center">
                  <Lightbulb className="w-5 h-5 mr-2 text-[#1E90FF]" /> Content Strategy Tips
                </h3>
                <p className="text-gray-300 text-sm mb-4">Guidance on creating impactful content for your audience.</p>
                <ul className="list-disc list-inside text-gray-200 space-y-1">
                  <li>Consistency is Key</li>
                  <li>Engage Your Audience</li>
                  <li>Showcase Your Personality</li>
                  <li>High-Quality Visuals</li>
                </ul>
                <button className="mt-4 w-full bg-[#1E90FF] text-white py-2 rounded-md hover:bg-[#4169E1] transition-colors duration-300">
                  View Full Guide
                </button>
              </div>
            </div>
          </section>

          {/* Sponsorship Readiness Score */}
          <section className="mb-12">
            <h2 className="text-3xl sm:text-4xl font-black text-white mb-8 text-center">
              <CheckSquare className="inline-block w-8 h-8 mr-3 text-cyan-400" /> Sponsorship Readiness Score
            </h2>
            <div className="bg-[#0d1a3a] rounded-lg p-6 shadow-md border border-blue-700/50">
              <h3 className="text-xl font-bold text-blue-300 mb-4 flex items-center">
                <Award className="w-5 h-5 mr-2 text-[#1E90FF]" /> Your Readiness Checklist
              </h3>
              <ul className="space-y-3 text-gray-200">
                <li className="flex items-center">
                  <input type="checkbox" id="followerCount" className="form-checkbox h-5 w-5 text-[#1E90FF] rounded border-gray-600 bg-[#050c1a] focus:ring-[#1E90FF]" checked readOnly />
                  <label htmlFor="followerCount" className="ml-3 text-lg">Follower Count: <span className="font-semibold text-cyan-400">100K+</span></label>
                </li>
                <li className="flex items-center">
                  <input type="checkbox" id="engagementRate" className="form-checkbox h-5 w-5 text-[#1E90FF] rounded border-gray-600 bg-[#050c1a] focus:ring-[#1E90FF]" checked readOnly />
                  <label htmlFor="engagementRate" className="ml-3 text-lg">Engagement Rate: <span className="font-semibold text-cyan-400">5%+</span></label>
                </li>
                <li className="flex items-center">
                  <input type="checkbox" id="cleanImage" className="form-checkbox h-5 w-5 text-[#1E90FF] rounded border-gray-600 bg-[#050c1a] focus:ring-[#1E90FF]" checked readOnly />
                  <label htmlFor="cleanImage" className="ml-3 text-lg">Clean Public Image</label>
                </li>
                <li className="flex items-center">
                  <input type="checkbox" id="academicStanding" className="form-checkbox h-5 w-5 text-[#1E90FF] rounded border-gray-600 bg-[#050c1a] focus:ring-[#1E90FF]" checked readOnly />
                  <label htmlFor="academicStanding" className="ml-3 text-lg">Good Academic Standing</label>
                </li>
                <li className="flex items-center">
                  <input type="checkbox" id="gpa" className="form-checkbox h-5 w-5 text-[#1E90FF] rounded border-gray-600 bg-[#050c1a] focus:ring-[#1E90FF]" checked readOnly />
                  <label htmlFor="gpa" className="ml-3 text-lg">GPA: <span className="font-semibold text-cyan-400">3.5+</span></label>
                </li>
                <li className="flex items-center">
                  <input type="checkbox" id="communityInvolvement" className="form-checkbox h-5 w-5 text-[#1E90FF] rounded border-gray-600 bg-[#050c1a] focus:ring-[#1E90FF]" checked readOnly />
                  <label htmlFor="communityInvolvement" className="ml-3 text-lg">Community Involvement</label>
                </li>
              </ul>
              <button className="mt-6 w-full bg-[#1E90FF] text-white py-2 rounded-md hover:bg-[#4169E1] transition-colors duration-300">
                Get Detailed Report
              </button>
            </div>
          </section>

          {/* Brand Portfolio Showcase */}
          <section className="mb-12">
            <h2 className="text-3xl sm:text-4xl font-black text-white mb-8 text-center">
              <Briefcase className="inline-block w-8 h-8 mr-3 text-cyan-400" /> Brand Portfolio Showcase
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-[#0d1a3a] rounded-lg p-6 shadow-md border border-blue-700/50">
                <h3 className="text-xl font-bold text-blue-300 mb-4 flex items-center">
                  <Handshake className="w-5 h-5 mr-2 text-[#1E90FF]" /> Deal: Nike Sponsorship
                </h3>
                <p className="text-gray-300 text-sm mb-2">Multi-year endorsement deal for athletic apparel and footwear.</p>
                <p className="text-gray-400 text-xs">Value: <span className="font-semibold text-cyan-400">$500,000/year</span></p>
              </div>
              <div className="bg-[#0d1a3a] rounded-lg p-6 shadow-md border border-blue-700/50">
                <h3 className="text-xl font-bold text-blue-300 mb-4 flex items-center">
                  <Handshake className="w-5 h-5 mr-2 text-[#1E90FF]" /> Endorsement: Gatorade
                </h3>
                <p className="text-gray-300 text-sm mb-2">Promotional partnership for hydration products.</p>
                <p className="text-gray-400 text-xs">Value: <span className="font-semibold text-cyan-400">$150,000/year</span></p>
              </div>
              <div className="bg-[#0d1a3a] rounded-lg p-6 shadow-md border border-blue-700/50">
                <h3 className="text-xl font-bold text-blue-300 mb-4 flex items-center">
                  <Handshake className="w-5 h-5 mr-2 text-[#1E90FF]" /> Partnership: Local Charity
                </h3>
                <p className="text-gray-300 text-sm mb-2">Community involvement and brand ambassador for youth sports program.</p>
                <p className="text-gray-400 text-xs">Value: <span className="font-semibold text-cyan-400">$50,000/year (in-kind + stipend)</span></p>
              </div>
            </div>
          </section>

          {/* AthlynX Commission */}
          <section className="mb-12">
            <h2 className="text-3xl sm:text-4xl font-black text-white mb-8 text-center">
              <Percent className="inline-block w-8 h-8 mr-3 text-cyan-400" /> AthlynX Commission
            </h2>
            <div className="bg-[#0d1a3a] rounded-lg p-6 shadow-md border border-blue-700/50 max-w-2xl mx-auto text-center">
              <p className="text-lg text-gray-200 mb-4">
                AthlynXAI takes a <span className="font-bold text-cyan-400">10-15% commission</span> on all successful NIL and endorsement deals secured through our platform.
              </p>
              <p className="text-sm text-gray-400">
                This ensures we can continue to provide cutting-edge tools and support to maximize your brand's potential.
              </p>
            </div>
          </section>

          {/* Footer */}
          <footer className="text-center text-gray-500 text-sm mt-12 py-6 border-t border-blue-700/50">
            <p>Copyright © 2026 Chad A. Dozier Sr. / AthlynXAI. All rights reserved. Be The Legacy.™</p>
          </footer>
        </div>
        <MobileBottomNav />
      </DashboardLayout>
    </RouteErrorBoundary>
  );
}

          {/* How it Works Section */}
          <section className="mb-12">
            <h2 className="text-3xl sm:text-4xl font-black text-white mb-8 text-center">
              <Lightbulb className="inline-block w-8 h-8 mr-3 text-cyan-400" /> How It Works
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-[#0d1a3a] rounded-lg p-6 shadow-md border border-blue-700/50 text-center">
                <Star className="w-12 h-12 text-[#1E90FF] mx-auto mb-4" />
                <h3 className="text-xl font-bold text-blue-300 mb-2">1. Build Your Profile</h3>
                <p className="text-gray-300 text-sm">Showcase your athletic achievements, academic excellence, and personal story to create a compelling brand profile.</p>
              </div>
              <div className="bg-[#0d1a3a] rounded-lg p-6 shadow-md border border-blue-700/50 text-center">
                <Zap className="w-12 h-12 text-[#1E90FF] mx-auto mb-4" />
                <h3 className="text-xl font-bold text-blue-300 mb-2">2. Estimate Your Value</h3>
                <p className="text-gray-300 text-sm">Utilize our advanced NIL Value Estimator to understand your market potential and identify areas for growth.</p>
              </div>
              <div className="bg-[#0d1a3a] rounded-lg p-6 shadow-md border border-blue-700/50 text-center">
                <Handshake className="w-12 h-12 text-[#1E90FF] mx-auto mb-4" />
                <h3 className="text-xl font-bold text-blue-300 mb-2">3. Secure Deals</h3>
                <p className="text-gray-300 text-sm">Connect with brands and secure lucrative NIL deals and endorsements that align with your values and goals.</p>
              </div>
            </div>
          </section>
