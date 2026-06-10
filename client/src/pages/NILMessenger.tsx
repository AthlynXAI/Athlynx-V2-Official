
import DashboardLayout from "@/components/DashboardLayout";
import MobileBottomNav from "@/components/MobileBottomNav";
import { RouteErrorBoundary } from "@/components/GlobalErrorBoundary";
import { Link } from "wouter";
import { useState, useEffect } from "react";
import { Shield, MessageCircle, Lock, CheckCircle, Share2, Mic, Users, FileText, EyeOff, Briefcase, Calendar, User, Handshake, Gavel, Image, Voicemail, ClipboardList, UserCog, Link as LinkIcon, Trophy } from "lucide-react";

export default function NILMessenger() {
  return (
    <RouteErrorBoundary>
      <DashboardLayout>
        <div className="min-h-screen bg-[#050c1a] text-white">
          {/* Hero Section */}
          <section className="relative overflow-hidden py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-[#1E90FF] to-[#4169E1] text-white">
            <div className="absolute inset-0 opacity-10">
              <svg
                className="absolute inset-0 h-full w-full stroke-current text-blue-300/20"
                fill="none"
              >
                <defs>
                  <pattern
                    id="pattern-nil-messenger"
                    x="0"
                    y="0"
                    width="20"
                    height="20"
                    patternUnits="userSpaceOnUse"
                  >
                    <path d="M0 20L20 0ZM-1 1L19 21ZM-1 19L19 -1Z" />
                  </pattern>
                </defs>
                <rect
                  stroke="none"
                  fill="url(#pattern-nil-messenger)"
                  width="100%"
                  height="100%"
                />
              </svg>
            </div>
            <div className="relative z-10 max-w-7xl mx-auto text-center">
              <div className="flex items-center justify-center space-x-4 mb-6">
                <Shield className="h-12 w-12 text-white" />
                <MessageCircle className="h-12 w-12 text-white" />
              </div>
              <h1 className="text-5xl font-black leading-tight mb-4">
                Your Conversations. Your Brand. Your Privacy.
              </h1>
              <p className="text-xl text-blue-100 mb-8">
                AthlynX NIL Messenger: private encrypted messaging platform for
                athletes, coaches, agents, brands, teams.
              </p>
              <Link
                href="/signup"
                className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 md:py-4 md:px-10 md:text-lg transition duration-300"
              >
                Get Started
              </Link>
            </div>
          </section>

          {/* Mock Message Thread UI */}
          <section className="py-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
              <h2 className="text-4xl font-black text-white text-center mb-12">
                Seamless Communication, Securely Delivered
              </h2>
              <div className="grid md:grid-cols-3 gap-8">
                {/* NIL Deal Negotiation */}
                <div className="bg-[#0d1a3a] rounded-lg shadow-lg p-6 border border-blue-700/50">
                  <h3 className="text-2xl font-bold text-blue-300 mb-4 flex items-center">
                    <Handshake className="h-6 w-6 mr-2 text-[#1E90FF]" /> NIL Deal Chat
                  </h3>
                  <div className="h-64 overflow-y-auto bg-[#050c1a] p-4 rounded-md">
                    <div className="flex justify-start mb-4">
                      <div className="bg-blue-600 text-white p-3 rounded-lg max-w-[70%]">
                        Hey AthlynXAI Team, excited about the endorsement offer!
                      </div>
                    </div>
                    <div className="flex justify-end mb-4">
                      <div className="bg-slate-700 text-white p-3 rounded-lg max-w-[70%]">
                        Great to hear! We've attached the draft contract for your review.
                      </div>
                    </div>
                    <div className="flex justify-start mb-4">
                      <div className="bg-blue-600 text-white p-3 rounded-lg max-w-[70%]">
                        Looks good overall. Can we discuss the exclusivity clause?
                      </div>
                    </div>
                    <div className="flex justify-end mb-4">
                      <div className="bg-slate-700 text-white p-3 rounded-lg max-w-[70%]">
                        Absolutely. Let's schedule a call for tomorrow morning.
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 text-sm text-gray-400">Athlete & Brand</div>
                </div>

                {/* Athlete-Coach Recruiting Chat */}
                <div className="bg-[#0d1a3a] rounded-lg shadow-lg p-6 border border-blue-700/50">
                  <h3 className="text-2xl font-bold text-blue-300 mb-4 flex items-center">
                    <UserCog className="h-6 w-6 mr-2 text-[#1E90FF]" /> Recruiting Chat
                  </h3>
                  <div className="h-64 overflow-y-auto bg-[#050c1a] p-4 rounded-md">
                    <div className="flex justify-end mb-4">
                      <div className="bg-slate-700 text-white p-3 rounded-lg max-w-[70%]">
                        Coach, thanks for the visit! Loved the campus.
                      </div>
                    </div>
                    <div className="flex justify-start mb-4">
                      <div className="bg-blue-600 text-white p-3 rounded-lg max-w-[70%]">
                        It was great having you. We're very impressed with your skills.
                      </div>
                    </div>
                    <div className="flex justify-end mb-4">
                      <div className="bg-slate-700 text-white p-3 rounded-lg max-w-[70%]">
                        When can we discuss scholarship details?
                      </div>
                    </div>
                    <div className="flex justify-start mb-4">
                      <div className="bg-blue-600 text-white p-3 rounded-lg max-w-[70%]">
                        My assistant will reach out to set up a call next week.
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 text-sm text-gray-400">Athlete & Coach</div>
                </div>

                {/* Teammate Group Chat */}
                <div className="bg-[#0d1a3a] rounded-lg shadow-lg p-6 border border-blue-700/50">
                  <h3 className="text-2xl font-bold text-blue-300 mb-4 flex items-center">
                    <Trophy className="h-6 w-6 mr-2 text-[#1E90FF]" /> Team Group Chat
                  </h3>
                  <div className="h-64 overflow-y-auto bg-[#050c1a] p-4 rounded-md">
                    <div className="flex justify-start mb-4">
                      <div className="bg-blue-600 text-white p-3 rounded-lg max-w-[70%]">
                        Who's up for an extra practice session tonight?
                      </div>
                    </div>
                    <div className="flex justify-end mb-4">
                      <div className="bg-slate-700 text-white p-3 rounded-lg max-w-[70%]">
                        I'm in! What time?
                      </div>
                    </div>
                    <div className="flex justify-start mb-4">
                      <div className="bg-blue-600 text-white p-3 rounded-lg max-w-[70%]">
                        7 PM at the usual spot.
                      </div>
                    </div>
                    <div className="flex justify-end mb-4">
                      <div className="bg-slate-700 text-white p-3 rounded-lg max-w-[70%]">
                        Count me in too! Need to work on my free throws.
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 text-sm text-gray-400">Teammates</div>
                </div>
              </div>
            </div>
          </section>

          {/* NIL Deal Rooms Section */}
          <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#0d1a3a]">
            <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-4xl font-black text-white mb-6">
                  NIL Deal Rooms: Negotiate with Confidence
                </h2>
                <p className="text-lg text-gray-300 mb-8">
                  Dedicated, secure spaces for athletes, brands, and agents to
                  negotiate Name, Image, and Likeness (NIL) contracts in real-time.
                  Streamline your deal-making process with integrated tools and a
                  transparent overview of all terms.
                </p>
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <CheckCircle className="h-6 w-6 text-[#1E90FF] mr-3 flex-shrink-0" />
                    <p className="text-lg text-gray-200">
                      Real-time contract editing and version control.
                    </p>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-6 w-6 text-[#1E90FF] mr-3 flex-shrink-0" />
                    <p className="text-lg text-gray-200">
                      Secure document sharing and e-signature integration.
                    </p>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-6 w-6 text-[#1E90FF] mr-3 flex-shrink-0" />
                    <p className="text-lg text-gray-200">
                      Transparent communication with all stakeholders.
                    </p>
                  </li>
                </ul>
              </div>
              <div className="bg-[#050c1a] rounded-lg shadow-xl p-8 border border-blue-700/50">
                <h3 className="text-2xl font-bold text-blue-300 mb-6 flex items-center">
                  <FileText className="h-7 w-7 mr-3 text-[#1E90FF]" /> Contract Preview
                </h3>
                <div className="space-y-4 text-gray-300 text-sm">
                  <p>
                    <strong>Agreement Title:</strong> NIL Endorsement Agreement
                  </p>
                  <p>
                    <strong>Parties:</strong> [Athlete Name] & [Brand Name]
                  </p>
                  <p>
                    <strong>Term:</strong> 12 Months, starting June 1, 2026
                  </p>
                  <p>
                    <strong>Compensation:</strong> $50,000 + Performance Bonuses
                  </p>
                  <p>
                    <strong>Deliverables:</strong> 3 Social Media Posts/Month, 1 Event Appearance
                  </p>
                  <p>
                    <strong>Exclusivity:</strong> Non-exclusive for similar product categories.
                  </p>
                  <p className="text-right text-xs text-gray-500 mt-4">
                    Version 3.2 - Last updated: May 30, 2026
                  </p>
                </div>
                <button className="mt-8 w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded transition duration-300">
                  View Full Contract
                </button>
              </div>
            </div>
          </section>

          {/* Community Rules Card */}
          <section className="py-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md mx-auto bg-[#0d1a3a] rounded-lg shadow-xl p-8 border border-blue-700/50 text-center">
              <h3 className="text-3xl font-black text-white mb-4 flex items-center justify-center">
                <Gavel className="h-8 w-8 mr-3 text-[#1E90FF]" /> Community Rules
              </h3>
              <p className="text-lg text-gray-300 mb-6">
                Our platform thrives on respect and professionalism. Please adhere to
                the following guidelines:
              </p>
              <ul className="space-y-3 text-left text-gray-200 mb-6">
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                  Be Respectful and Professional at all times.
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                  Zero Tolerance for Harassment, Hate Speech, or Discrimination.
                </li>
                <li className="flex items-center">
                  <Trophy className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0" />
                  Report any suspicious activity or violations.
                </li>
              </ul>
              <p className="text-md text-red-400 font-semibold">
                Violations will result in immediate account suspension.
              </p>
            </div>
          </section>

          {/* Features Grid */}
          <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#0d1a3a]">
            <div className="max-w-7xl mx-auto">
              <h2 className="text-4xl font-black text-white text-center mb-12">
                Powerful Features for Secure Communication
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <div className="bg-[#050c1a] p-6 rounded-lg shadow-md border border-blue-700/50 flex items-start space-x-4">
                  <Lock className="h-8 w-8 text-[#1E90FF] flex-shrink-0" />
                  <div>
                    <h3 className="text-xl font-bold text-blue-300 mb-2">End-to-End Encryption</h3>
                    <p className="text-gray-400">Your messages are secured from sender to receiver, ensuring complete privacy.</p>
                  </div>
                </div>
                <div className="bg-[#050c1a] p-6 rounded-lg shadow-md border border-blue-700/50 flex items-start space-x-4">
                  <ClipboardList className="h-8 w-8 text-[#1E90FF] flex-shrink-0" />
                  <div>
                    <h3 className="text-xl font-bold text-blue-300 mb-2">HIPAA-Compliant Medical Chats</h3>
                    <p className="text-gray-400">Securely discuss sensitive health information with medical professionals.</p>
                  </div>
                </div>
                <div className="bg-[#050c1a] p-6 rounded-lg shadow-md border border-blue-700/50 flex items-start space-x-4">
                  <EyeOff className="h-8 w-8 text-[#1E90FF] flex-shrink-0" />
                  <div>
                    <h3 className="text-xl font-bold text-blue-300 mb-2">Read Receipts & Typing Indicators</h3>
                    <p className="text-gray-400">Know when your messages are delivered and read, and when others are typing.</p>
                  </div>
                </div>
                <div className="bg-[#050c1a] p-6 rounded-lg shadow-md border border-blue-700/50 flex items-start space-x-4">
                  <Image className="h-8 w-8 text-[#1E90FF] flex-shrink-0" />
                  <div>
                    <h3 className="text-xl font-bold text-blue-300 mb-2">Rich Media Sharing</h3>
                    <p className="text-gray-400">Share photos, videos, and documents seamlessly within your conversations.</p>
                  </div>
                </div>
                <div className="bg-[#050c1a] p-6 rounded-lg shadow-md border border-blue-700/50 flex items-start space-x-4">
                  <Voicemail className="h-8 w-8 text-[#1E90FF] flex-shrink-0" />
                  <div>
                    <h3 className="text-xl font-bold text-blue-300 mb-2">Voice Notes</h3>
                    <p className="text-gray-400">Send quick voice messages for convenient and expressive communication.</p>
                  </div>
                </div>
                <div className="bg-[#050c1a] p-6 rounded-lg shadow-md border border-blue-700/50 flex items-start space-x-4">
                  <Users className="h-8 w-8 text-[#1E90FF] flex-shrink-0" />
                  <div>
                    <h3 className="text-xl font-bold text-blue-300 mb-2">Group Team Chats</h3>
                    <p className="text-gray-400">Collaborate with your entire team in secure, dedicated group conversations.</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Privacy Section */}
          <section className="py-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto text-center bg-[#0d1a3a] rounded-lg shadow-xl p-8 border border-blue-700/50">
              <h2 className="text-4xl font-black text-white mb-6">
                Your Data, Your Control. Always.
              </h2>
              <p className="text-lg text-gray-300 mb-8">
                At AthlynXAI, we are committed to protecting your privacy. Our
                NIL Messenger is built with a privacy-first approach, ensuring
                your sensitive conversations remain confidential.
              </p>
              <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                <div className="flex items-start space-x-4 text-left">
                  <Lock className="h-8 w-8 text-[#1E90FF] flex-shrink-0" />
                  <div>
                    <h3 className="text-xl font-bold text-blue-300 mb-2">No Third-Party Data Sharing</h3>
                    <p className="text-gray-400">We never share your personal data or conversation content with any third parties.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4 text-left">
                  <ClipboardList className="h-8 w-8 text-[#1E90FF] flex-shrink-0" />
                  <div>
                    <h3 className="text-xl font-bold text-blue-300 mb-2">Comprehensive Audit Logs</h3>
                    <p className="text-gray-400">Maintain a transparent record of all critical actions and data access within your account.</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Integration Callouts */}
          <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#0d1a3a]">
            <div className="max-w-7xl mx-auto text-center">
              <h2 className="text-4xl font-black text-white mb-12">
                Seamlessly Integrated with the AthlynXAI Ecosystem
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-[#050c1a] p-6 rounded-lg shadow-md border border-blue-700/50">
                  <User className="h-12 w-12 text-[#1E90FF] mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-blue-300 mb-3">AthlynX Profile</h3>
                  <p className="text-gray-400 mb-4">Connect directly to your AthlynXAI athlete profile for easy access to your stats and achievements.</p>
                  <Link href="/profile" className="text-[#1E90FF] hover:underline flex items-center justify-center">
                    <LinkIcon className="h-5 w-5 mr-2" /> View Profile
                  </Link>
                </div>
                <div className="bg-[#050c1a] p-6 rounded-lg shadow-md border border-blue-700/50">
                  <Briefcase className="h-12 w-12 text-[#1E90FF] mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-blue-300 mb-3">NIL Deals Hub</h3>
                  <p className="text-gray-400 mb-4">Manage all your NIL opportunities and contracts from a centralized hub.</p>
                  <Link href="/nil-deals" className="text-[#1E90FF] hover:underline flex items-center justify-center">
                    <LinkIcon className="h-5 w-5 mr-2" /> Manage Deals
                  </Link>
                </div>
                <div className="bg-[#050c1a] p-6 rounded-lg shadow-md border border-blue-700/50">
                  <Calendar className="h-12 w-12 text-[#1E90FF] mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-blue-300 mb-3">Integrated Calendar</h3>
                  <p className="text-gray-400 mb-4">Sync your messaging events with your AthlynXAI calendar for seamless scheduling.</p>
                  <Link href="/calendar" className="text-[#1E90FF] hover:underline flex items-center justify-center">
                    <LinkIcon className="h-5 w-5 mr-2" /> View Calendar
                  </Link>
                </div>
              </div>
            </div>
          </section>

          {/* Footer */}
          <footer className="bg-[#050c1a] py-10 px-4 sm:px-6 lg:px-8 text-center text-gray-500 text-sm">
            <p>
              Copyright © 2026 Chad A. Dozier Sr. / AthlynXAI. All rights reserved.
              <span className="block sm:inline-block mt-1 sm:mt-0 sm:ml-2">Be The Legacy.™</span>
            </p>
          </footer>
        </div>
        <MobileBottomNav />
      </DashboardLayout>
    </RouteErrorBoundary>
  );
}
