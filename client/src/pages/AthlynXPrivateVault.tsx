import DashboardLayout from '@/components/DashboardLayout';
import MobileBottomNav from '@/components/MobileBottomNav';
import { RouteErrorBoundary } from '@/components/GlobalErrorBoundary';
import { Link } from 'wouter';
import { useState, useEffect } from 'react';
import { Lock, Trophy, Database, Folder, FileText, GraduationCap, ShieldCheck, HardDrive, Download, Share2, Users, CreditCard, Award, Zap, Cloud, Server, Key, Settings, Globe, Briefcase, BookOpen, HeartPulse, UploadCloud, Trash2, Search, StepForward, CheckCircle, UserPlus } from 'lucide-react';

export default function AthlynXPrivateVault() {
  const [vaultData, setVaultData] = useState([
    { id: 1, name: 'Game Film', count: 120, lastUpdated: '2026-05-30', icon: <Folder size={20} /> },
    { id: 2, name: 'Highlights', count: 45, lastUpdated: '2026-05-28', icon: <Folder size={20} /> },
    { id: 3, name: 'Photos', count: 800, lastUpdated: '2026-06-01', icon: <Folder size={20} /> },
    { id: 4, name: 'NIL Contracts', count: 5, lastUpdated: '2026-05-25', icon: <FileText size={20} /> },
    { id: 5, name: 'Scholarship Agreements', count: 2, lastUpdated: '2026-05-20', icon: <FileText size={20} /> },
    { id: 6, name: 'Agent Contracts', count: 1, lastUpdated: '2026-04-15', icon: <FileText size={20} /> },
    { id: 7, name: 'Medical Records', count: 15, lastUpdated: '2026-05-10', icon: <Trophy size={20} /> },
    { id: 8, name: 'GlucoAthlete Data', count: 30, lastUpdated: '2026-06-02', icon: <Zap size={20} /> },
    { id: 9, name: 'Transcripts', count: 3, lastUpdated: '2026-03-01', icon: <GraduationCap size={20} /> },
    { id: 10, name: 'Eligibility Docs', count: 4, lastUpdated: '2026-02-10', icon: <GraduationCap size={20} /> },
  ]);

  const [permissions, setPermissions] = useState([
    { role: 'Coach', media: 'View', contracts: 'None', medical: 'None', academic: 'None' },
    { role: 'Agent', media: 'View', contracts: 'View/Edit', medical: 'None', academic: 'View' },
    { role: 'Lawyer', media: 'None', contracts: 'View', medical: 'None', academic: 'None' },
    { role: 'Medical Staff', media: 'None', contracts: 'None', medical: 'View/Edit', academic: 'None' },
  ]);

  return (
    <RouteErrorBoundary>
      <DashboardLayout>
        <div className="min-h-screen bg-[#050c1a] text-white">
          {/* Hero Section */}
          <section className="relative bg-gradient-to-r from-[#1E90FF] to-[#4169E1] text-white py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
            <div className="absolute inset-0 opacity-10">
              <svg className="w-full h-full" fill="none" viewBox="0 0 100 100" preserveAspectRatio="none">
                <defs>
                  <pattern id="pattern-circles" x="0" y="0" width="10" height="10" patternUnits="userSpaceOnUse">
                    <circle cx="2" cy="2" r="1" fill="rgba(255,255,255,0.1)" />
                  </pattern>
                </defs>
                <rect x="0" y="0" width="100%" height="100%" fill="url(#pattern-circles)" />
              </svg>
            </div>
            <div className="relative max-w-7xl mx-auto text-center">
              <div className="flex items-center justify-center space-x-4 mb-4">
                <Lock size={48} className="text-white" />
                <Database size={48} className="text-white" />
              </div>
              <h1 className="text-5xl font-black mb-4">Your Life. Your Files. Your Vault.</h1>
              <p className="text-xl mb-8">Secure storage for athlete media, contracts, and documents. Your digital legacy, protected and always accessible, giving you peace of mind.</p>
              <Link href="/signup" className="bg-white text-[#1E90FF] font-bold py-3 px-8 rounded-full hover:bg-gray-100 transition duration-300">
                Get Started Today
              </Link>
            </div>
          </section>

          {/* Vault Categories Section */}
          <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#050c1a]">
            <div className="max-w-7xl mx-auto">
              <h2 className="text-4xl font-black text-white text-center mb-12">Comprehensive Vault Categories</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <div className="bg-[#0d1a3a] p-8 rounded-lg border border-blue-700/50 shadow-lg text-center">
                  <Folder size={40} className="text-cyan-400 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-blue-300 mb-2">Media Vault</h3>
                  <p className="text-gray-300">Store and organize all your athletic media, including high-resolution game film, highlight reels, professional photos, and personal branding content. Easily share with scouts and recruiters, preserving quality and access while maintaining full control over your visual assets. Never lose a moment of your career.</p>
                </div>
                <div className="bg-[#0d1a3a] p-8 rounded-lg border border-blue-700/50 shadow-lg text-center">
                  <FileText size={40} className="text-cyan-400 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-blue-300 mb-2">Contract Vault</h3>
                  <p className="text-gray-300">Securely manage all your legal documents, including Name, Image, and Likeness (NIL) contracts, scholarship agreements, agent contracts, and endorsement deals. Keep track of terms, expiration dates, and critical clauses with ease, ensuring compliance and protecting your interests. Digital signatures and version control included.</p>
                </div>
                <div className="bg-[#0d1a3a] p-8 rounded-lg border border-blue-700/50 shadow-lg text-center">
                  <Trophy size={40} className="text-cyan-400 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-blue-300 mb-2">Medical Vault</h3>
                  <p className="text-gray-300">Maintain HIPAA-compliant records of your medical history, injury reports, rehabilitation plans, and performance data from devices like GlucoAthlete. Share securely with medical staff, ensuring privacy and compliance with healthcare regulations. Your health data is always protected and accessible when you need it most.</p>
                </div>
                <div className="bg-[#0d1a3a] p-8 rounded-lg border border-blue-700/50 shadow-lg text-center">
                  <GraduationCap size={40} className="text-cyan-400 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-blue-300 mb-2">Academic Vault</h3>
                  <p className="text-gray-300">Keep all your academic records in one place, including transcripts, eligibility documents, academic awards, and course schedules. Essential for maintaining NCAA compliance and future educational pursuits, all securely stored and easily retrievable. Stay on track with your educational goals.</p>
                </div>
              </div>
            </div>
          </section>

          {/* Mock Vault UI Section */}
          <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#050c1a]">
            <div className="max-w-7xl mx-auto">
              <h2 className="text-4xl font-black text-white text-center mb-12">Your Vault, Organized and Accessible</h2>
              <p className="text-center text-gray-300 mb-8">A clear overview of your digital assets, with easy navigation and quick access to your most important files. Intuitive design for peak performance and effortless management, ensuring you spend less time organizing and more time excelling.</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                {vaultData.map((item) => (
                  <div key={item.id} className="bg-[#0d1a3a] p-6 rounded-lg border border-blue-700/50 shadow-lg flex flex-col items-center text-center">
                    {item.icon}
                    <h4 className="text-lg font-bold text-blue-300 mt-4 mb-2">{item.name}</h4>
                    <p className="text-gray-400 text-sm">Files: {item.count}</p>
                    <p className="text-gray-500 text-xs">Last Updated: {item.lastUpdated}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* How It Works Section */}
          <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#050c1a]">
            <div className="max-w-7xl mx-auto">
              <h2 className="text-4xl font-black text-white text-center mb-12">How AthlynX Private Vault Works</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                <div className="bg-[#0d1a3a] p-8 rounded-lg border border-blue-700/50 shadow-lg">
                  <UserPlus size={40} className="text-cyan-400 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-blue-300 mb-2">1. Create Your Vault</h3>
                  <p className="text-gray-300">Sign up for AthlynXAI and instantly create your secure private vault. Our onboarding process is quick and guided, getting you set up in minutes.</p>
                </div>
                <div className="bg-[#0d1a3a] p-8 rounded-lg border border-blue-700/50 shadow-lg">
                  <UploadCloud size={40} className="text-cyan-400 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-blue-300 mb-2">2. Upload & Organize</h3>
                  <p className="text-gray-300">Easily upload your documents, media, and data. Use our intuitive interface to categorize, tag, and organize your files exactly how you need them.</p>
                </div>
                <div className="bg-[#0d1a3a] p-8 rounded-lg border border-blue-700/50 shadow-lg">
                  <CheckCircle size={40} className="text-cyan-400 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-blue-300 mb-2">3. Secure & Share</h3>
                  <p className="text-gray-300">Your data is automatically encrypted and protected. Share specific files with trusted contacts using granular permissions, and track all activity with audit logs.</p>
                </div>
              </div>
            </div>
          </section>

          {/* Key Features Section */}
          <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#050c1a]">
            <div className="max-w-7xl mx-auto">
              <h2 className="text-4xl font-black text-white text-center mb-12">Key Features of AthlynX Private Vault</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <div className="bg-[#0d1a3a] p-8 rounded-lg border border-blue-700/50 shadow-lg flex items-start space-x-4">
                  <Cloud size={32} className="text-cyan-400 flex-shrink-0" />
                  <div>
                    <h3 className="text-xl font-bold text-blue-300 mb-2">Cloud-Based Accessibility</h3>
                    <p className="text-gray-300">Access your vault securely from anywhere, on any device. Your data is always at your fingertips, whether you're on the field, in the classroom, or traveling internationally. Seamless synchronization ensures up-to-date information across all your platforms.</p>
                  </div>
                </div>
                <div className="bg-[#0d1a3a] p-8 rounded-lg border border-blue-700/50 shadow-lg flex items-start space-x-4">
                  <Share2 size={32} className="text-cyan-400 flex-shrink-0" />
                  <div>
                    <h3 className="text-xl font-bold text-blue-300 mb-2">Secure Sharing Options</h3>
                    <p className="text-gray-300">Share specific documents or entire categories with coaches, agents, medical staff, or family members with granular control over permissions and access duration. Revoke access instantly when needed, maintaining complete command over your shared data.</p>
                  </div>
                </div>
                <div className="bg-[#0d1a3a] p-8 rounded-lg border border-blue-700/50 shadow-lg flex items-start space-x-4">
                  <Settings size={32} className="text-cyan-400 flex-shrink-0" />
                  <div>
                    <h3 className="text-xl font-bold text-blue-300 mb-2">Customizable Organization</h3>
                    <p className="text-gray-300">Organize your files with custom folders, tags, and categories. Tailor your vault to your specific needs, making it easy to find what you need, when you need it, with powerful search and filtering capabilities. Personalize your data management.</p>
                  </div>
                </div>
                <div className="bg-[#0d1a3a] p-8 rounded-lg border border-blue-700/50 shadow-lg flex items-start space-x-4">
                  <BookOpen size={32} className="text-cyan-400 flex-shrink-0" />
                  <div>
                    <h3 className="text-xl font-bold text-blue-300 mb-2">Educational Resources</h3>
                    <p className="text-gray-300">Access a curated library of resources on NIL rights, contract negotiation, academic eligibility, and health management to empower your journey and make informed decisions throughout your career. Stay ahead with expert insights.</p>
                  </div>
                </div>
                <div className="bg-[#0d1a3a] p-8 rounded-lg border border-blue-700/50 shadow-lg flex items-start space-x-4">
                  <HeartPulse size={32} className="text-cyan-400 flex-shrink-0" />
                  <div>
                    <h3 className="text-xl font-bold text-blue-300 mb-2">Health & Wellness Integration</h3>
                    <p className="text-gray-300">Seamlessly integrate data from health and fitness trackers, including GlucoAthlete, to provide a holistic view of your well-being and performance. Monitor trends and share insights with your medical team for optimized health outcomes.</p>
                  </div>
                </div>
                <div className="bg-[#0d1a3a] p-8 rounded-lg border border-blue-700/50 shadow-lg flex items-start space-x-4">
                  <Briefcase size={32} className="text-cyan-400 flex-shrink-0" />
                  <div>
                    <h3 className="text-xl font-bold text-blue-300 mb-2">Career Management Tools</h3>
                    <p className="text-gray-300">Utilize tools for tracking career milestones, managing professional contacts, and preparing for post-athletic life, all within your secure vault. Plan your future with confidence and strategic foresight.</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Access Control Section */}
          <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#050c1a]">
            <div className="max-w-7xl mx-auto">
              <h2 className="text-4xl font-black text-white text-center mb-12">Granular Access Control</h2>
              <p className="text-center text-gray-300 mb-8">Share specific documents with trusted individuals, with full control over permissions. Define who sees what, and for how long, ensuring your privacy is always maintained and data shared responsibly and securely.</p>
              <div className="overflow-x-auto bg-[#0d1a3a] rounded-lg border border-blue-700/50 shadow-lg">
                <table className="min-w-full divide-y divide-blue-700/50">
                  <thead className="bg-[#0d1a3a]">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-blue-300 uppercase tracking-wider">Role</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-blue-300 uppercase tracking-wider">Media Vault</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-blue-300 uppercase tracking-wider">Contract Vault</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-blue-300 uppercase tracking-wider">Medical Vault</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-blue-300 uppercase tracking-wider">Academic Vault</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-blue-300 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-blue-700/50">
                    {permissions.map((perm, index) => (
                      <tr key={index} className="bg-[#0d1a3a] hover:bg-[#1a2b4d]">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{perm.role}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{perm.media}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{perm.contracts}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{perm.medical}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{perm.academic}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button className="text-[#1E90FF] hover:text-[#4169E1] mr-4">Edit</button>
                          <button className="text-red-500 hover:text-red-700">Revoke</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          {/* Security Features Section */}
          <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#050c1a]">
            <div className="max-w-7xl mx-auto">
              <h2 className="text-4xl font-black text-white text-center mb-12">Uncompromised Security & Privacy</h2>
              <p className="text-center text-gray-300 mb-8">Your sensitive data is protected with industry-leading security protocols and privacy measures, ensuring peace of mind and compliance with global standards. Trust AthlynXAI with your most valuable information.</p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <div className="bg-[#0d1a3a] p-8 rounded-lg border border-blue-700/50 shadow-lg text-center">
                  <ShieldCheck size={40} className="text-cyan-400 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-blue-300 mb-2">End-to-End Encryption</h3>
                  <p className="text-gray-300">All your files are encrypted at rest and in transit, ensuring only you and authorized parties can access them. We use AES-256 encryption, the gold standard for data protection, combined with secure key management and regular security audits.</p>
                </div>
                <div className="bg-[#0d1a3a] p-8 rounded-lg border border-blue-700/50 shadow-lg text-center">
                  <Key size={40} className="text-cyan-400 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-blue-300 mb-2">Two-Factor Authentication</h3>
                  <p className="text-gray-300">Add an essential layer of security to your account with 2FA, protecting against unauthorized access even if your password is compromised. Your digital identity is safe with multiple verification methods, including biometric options.</p>
                </div>
                <div className="bg-[#0d1a3a] p-8 rounded-lg border border-blue-700/50 shadow-lg text-center">
                  <Trophy size={40} className="text-cyan-400 mx-auto mb-4" />
                  <div>
                    <h3 className="text-xl font-bold text-blue-300 mb-2">Real-time Security Alerts</h3>
                    <p className="text-gray-300">Receive instant notifications for suspicious activities or unauthorized access attempts to your vault, keeping you informed and secure around the clock. Proactive threat detection and immediate alerts for your peace of mind.</p>
                  </div>
                </div>
                <div className="bg-[#0d1a3a] p-8 rounded-lg border border-blue-700/50 shadow-lg text-center">
                  <Award size={40} className="text-cyan-400 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-blue-300 mb-2">Comprehensive Audit Logs</h3>
                  <p className="text-gray-300">Every access, modification, and share action within your vault is meticulously recorded, providing a transparent and immutable audit trail for complete accountability and regulatory compliance. Full visibility into your data's history.</p>
                </div>
              </div>
            </div>
          </section>

          {/* Storage Tiers Section */}
          <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#050c1a]">
            <div className="max-w-7xl mx-auto">
              <h2 className="text-4xl font-black text-white text-center mb-12">Flexible Storage Tiers to Grow With You</h2>
              <p className="text-center text-gray-300 mb-8">Choose the plan that best fits your needs, from essential free storage to unlimited capacity for elite athletes, ensuring you always have the space you require for your evolving career and digital footprint.</p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <div className="bg-[#0d1a3a] p-8 rounded-lg border border-blue-700/50 shadow-lg text-center flex flex-col justify-between">
                  <div>
                    <HardDrive size={40} className="text-cyan-400 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-blue-300 mb-2">Free</h3>
                    <p className="text-gray-300 text-4xl font-black mb-4">5GB</p>
                    <p className="text-gray-400">Perfect for getting started, ideal for basic document storage and a few media files. No credit card required, just sign up and secure your data with ease.</p>
                  </div>
                  <Link href="/signup" className="mt-8 bg-[#1E90FF] text-white font-bold py-2 px-6 rounded-full hover:bg-[#4169E1] transition duration-300">
                    Sign Up
                  </Link>
                </div>
                <div className="bg-[#0d1a3a] p-8 rounded-lg border border-blue-700/50 shadow-lg text-center flex flex-col justify-between">
                  <div>
                    <HardDrive size={40} className="text-cyan-400 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-blue-300 mb-2">Athlete</h3>
                    <p className="text-gray-300 text-4xl font-black mb-4">50GB</p>
                    <p className="text-gray-400">$9.99/month</p>
                    <p className="text-gray-500 text-sm mt-2">Ample space for extensive media, contracts, and medical records. Designed for active athletes who need reliable and secure storage for their growing digital assets.</p>
                  </div>
                  <Link href="/signup" className="mt-8 bg-[#1E90FF] text-white font-bold py-2 px-6 rounded-full hover:bg-[#4169E1] transition duration-300">
                    Choose Plan
                  </Link>
                </div>
                <div className="bg-[#0d1a3a] p-8 rounded-lg border border-blue-700/50 shadow-lg text-center flex flex-col justify-between">
                  <div>
                    <HardDrive size={40} className="text-cyan-400 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-blue-300 mb-2">Pro</h3>
                    <p className="text-gray-300 text-4xl font-black mb-4">500GB</p>
                    <p className="text-gray-400">$29.99/month</p>
                    <p className="text-gray-500 text-sm mt-2">Designed for professionals needing vast storage for all career documentation and high-volume media. Ideal for those with significant digital assets and a need for rapid access.</p>
                  </div>
                  <Link href="/signup" className="mt-8 bg-[#1E90FF] text-white font-bold py-2 px-6 rounded-full hover:bg-[#4169E1] transition duration-300">
                    Choose Plan
                  </Link>
                </div>
                <div className="bg-[#0d1a3a] p-8 rounded-lg border border-blue-700/50 shadow-lg text-center flex flex-col justify-between">
                  <div>
                    <HardDrive size={40} className="text-cyan-400 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-blue-300 mb-2">Elite</h3>
                    <p className="text-gray-300 text-4xl font-black mb-4">Unlimited</p>
                    <p className="text-gray-400">$99.99/month</p>
                    <p className="text-gray-500 text-sm mt-2">Unrestricted storage for the most demanding needs, truly future-proof for your entire career and beyond. Never worry about running out of space, ever.</p>
                  </div>
                  <Link href="/signup" className="mt-8 bg-[#1E90FF] text-white font-bold py-2 px-6 rounded-full hover:bg-[#4169E1] transition duration-300">
                    Choose Plan
                  </Link>
                </div>
              </div>
            </div>
          </section>

          {/* Export and Portability Section */}
          <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#050c1a]">
            <div className="max-w-7xl mx-auto text-center">
              <Download size={48} className="text-cyan-400 mx-auto mb-4" />
              <h2 className="text-4xl font-black text-white mb-4">You Own Your Data, Always.</h2>
              <p className="text-xl text-gray-300 mb-8">AthlynXAI ensures complete data portability. Easily export your entire vault at any time, in open formats, giving you full control and ownership of your digital legacy. We believe your data belongs to you, and you should always have the freedom to take it with you, without any vendor lock-in.</p>
              <Link href="/export" className="bg-[#1E90FF] text-white font-bold py-3 px-8 rounded-full hover:bg-[#4169E1] transition duration-300">
                Learn About Data Export
              </Link>
            </div>
          </section>

          {/* Call to Action Section */}
          <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#050c1a]">
            <div className="max-w-7xl mx-auto text-center bg-[#0d1a3a] p-12 rounded-lg border border-blue-700/50 shadow-lg">
              <h2 className="text-4xl font-black text-white mb-6">Ready to Secure Your Legacy?</h2>
              <p className="text-xl text-gray-300 mb-8">Join AthlynXAI today and take control of your athletic and personal data with the most secure and comprehensive private vault solution. Protect your future, starting now, with a platform built for your success and long-term peace of mind.</p>
              <Link href="/signup" className="bg-[#1E90FF] text-white font-bold py-4 px-10 rounded-full text-lg hover:bg-[#4169E1] transition duration-300">
                Create Your Private Vault
              </Link>
            </div>
          </section>

          {/* HIPAA Compliance and Legal Notice */}
          <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#050c1a]">
            <div className="max-w-7xl mx-auto text-center bg-[#0d1a3a] p-8 rounded-lg border border-blue-700/50 shadow-lg">
              <img src="/hipaa-badge.png" alt="HIPAA Compliant" className="mx-auto mb-4 h-20" /> {/* Placeholder for HIPAA badge */}
              <h3 className="text-2xl font-bold text-blue-300 mb-4">HIPAA Compliant & Secure</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                AthlynXAI is committed to protecting your sensitive health information. Our Medical Vault is designed to be HIPAA compliant,
                ensuring the highest standards of privacy and security for your medical records and GlucoAthlete data.
                We adhere to strict regulatory guidelines to safeguard your personal health information, including regular audits, staff training, and robust data handling policies. Your health data is treated with the utmost care and confidentiality, always.
              </p>
              <p className="text-gray-500 text-xs mt-8">
                Disclaimer: While AthlynXAI provides a secure platform for storing medical information, it is not a substitute for professional medical advice, diagnosis, or treatment.
                Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition.
                The information provided on this page is for informational purposes only and does not constitute medical advice. Consult with a healthcare professional for personalized guidance and before making any decisions related to your health or well-being.
              </p>
            </div>
          </section>

          {/* Footer */}
          <footer className="bg-[#0d1a3a] py-8 px-4 sm:px-6 lg:px-8 text-center border-t border-blue-700/50">
            <p className="text-gray-400 text-sm">
              Copyright © 2026 Chad A. Dozier Sr. / AthlynXAI. All rights reserved. Be The Legacy.™
            </p>
            <MobileBottomNav />
          </footer>
        </div>
      </DashboardLayout>
    </RouteErrorBoundary>
  );
}

