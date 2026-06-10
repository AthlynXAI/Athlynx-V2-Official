
import React, { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import MobileBottomNav from "@/components/MobileBottomNav";
import { RouteErrorBoundary } from '@/components/GlobalErrorBoundary';
import { Link } from "wouter";
import {
  ArrowRight, 
  BookOpen, 
  Calendar, 
  CheckCircle, 
  ClipboardList, 
  GraduationCap,
  MessageSquare, 
  ShieldCheck, 
  Star, 
  User, 
  Zap,
} from "lucide-react";

// Placeholder for trpc context and hooks
// In a real application, this would be properly configured
const trpc = {
  ai: {
    wizardAdvice: {
      useMutation: () => ({
        mutate: (data: { wizardType: string; prompt: string }) => {
          console.log("AI Wizard Advice Mutation:", data);
          // Simulate API response
          return new Promise((resolve) => {
            setTimeout(() => {
              resolve({
                response: `AI response for "${data.prompt}" in ${data.wizardType} context. This is a simulated response.`,
              });
            }, 1500);
          });
        },
        isLoading: false,
        error: null,
        data: null,
      }),
    },
  },
};

interface CardProps {
  title: string;
  icon: React.ElementType;
  children: React.ReactNode;
}

const InfoCard: React.FC<CardProps> = ({ title, icon: Icon, children }) => (
  <div className="bg-[#0d1a3a] rounded-2xl border border-blue-700/50 p-6 shadow-lg hover:shadow-blue-500/30 transition-shadow duration-300">
    <div className="flex items-center mb-4">
      <Icon className="w-8 h-8 text-[#00FFFF] mr-3" />
      <h3 className="font-bold text-xl text-white">{title}</h3>
    </div>
    <p className="text-blue-200 text-base leading-relaxed">{children}</p>
  </div>
);

interface RuleCardProps {
  sport: string;
  rule: string;
  details: string;
}

const RuleCard: React.FC<RuleCardProps> = ({ sport, rule, details }) => (
  <div className="bg-[#0d1a3a] rounded-2xl border border-blue-700/50 p-5 shadow-md hover:shadow-blue-500/20 transition-shadow duration-300">
    <h4 className="font-bold text-lg text-[#1E90FF] mb-2">{sport}</h4>
    <p className="text-white font-semibold mb-1">{rule}</p>
    <p className="text-blue-300 text-sm">{details}</p>
  </div>
);

const TimelineEvent: React.FC<{ title: string; description: string; icon: React.ElementType }>= ({ title, description, icon: Icon }) => (
  <div className="flex items-start space-x-3 mb-6">
    <div className="flex-shrink-0 w-10 h-10 bg-[#1E90FF] rounded-full flex items-center justify-center">
      <Icon className="w-5 h-5 text-white" />
    </div>
    <div>
      <h4 className="font-bold text-white text-lg">{title}</h4>
      <p className="text-blue-300 text-sm">{description}</p>
    </div>
  </div>
);

const ChecklistItem: React.FC<{ item: string; checked: boolean }> = ({ item, checked }) => (
  <li className="flex items-center text-blue-200 mb-2">
    {checked ? (
      <CheckCircle className="w-5 h-5 text-[#00FFFF] mr-2" />
    ) : (
      <div className="w-5 h-5 border border-blue-500 rounded-full mr-2"></div>
    )}
    {item}
  </li>
);

const TransferWizard: React.FC = () => {
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const { mutate, isLoading } = trpc.ai.wizardAdvice.useMutation();

  const handleAiPromptSubmit = async () => {
    if (aiPrompt.trim()) {
      setAiResponse(null); // Clear previous response
      const result = await mutate({ wizardType: "transfer", prompt: aiPrompt });
      // @ts-ignore
      setAiResponse(result.response);
    }
  };

  return (
    <RouteErrorBoundary>
      <DashboardLayout>
        <div className="min-h-screen bg-[#050c1a] text-white p-4 sm:p-6 lg:p-8">
          {/* Hero Section */}
          <div className="mb-12 text-center">
            <h1 className="font-black text-5xl sm:text-6xl lg:text-7xl bg-gradient-to-r from-[#1E90FF] to-[#4169E1] text-transparent bg-clip-text leading-tight">
              AthlynX Transfer Portal Wizard
            </h1>
            <p className="text-blue-300 text-lg sm:text-xl mt-4 max-w-3xl mx-auto">
              Navigate the complex world of collegiate athletic transfers with AI-powered guidance and comprehensive resources.
            </p>
            <div className="mt-8 flex justify-center space-x-4">
              <Link href="/portal-entry">
                <a className="px-8 py-3 bg-[#00FFFF] text-[#050c1a] font-bold rounded-full shadow-lg hover:bg-cyan-400 transition-colors duration-300 flex items-center">
                  <Zap className="w-5 h-5 mr-2" /> Enter Portal
                </a>
              </Link>
              <Link href="/eligibility-check">
                <a className="px-8 py-3 border border-[#1E90FF] text-[#1E90FF] font-bold rounded-full shadow-lg hover:bg-[#1E90FF] hover:text-white transition-colors duration-300 flex items-center">
                  <ShieldCheck className="w-5 h-5 mr-2" /> Check Eligibility
                </a>
              </Link>
            </div>
          </div>

          {/* Quick Prompts Section */}
          <section className="mb-12">
            <h2 className="font-black text-4xl text-white mb-8 text-center">Quick Start Prompts</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <InfoCard title="Portal Entry" icon={ArrowRight}>
                Understand the steps and requirements for officially entering the NCAA Transfer Portal.
              </InfoCard>
              <InfoCard title="Eligibility Rules" icon={BookOpen}>
                Detailed breakdown of academic and athletic eligibility criteria for transfers.
              </InfoCard>
              <InfoCard title="Immediate Eligibility" icon={Star}>
                Learn about waivers and conditions for immediate eligibility at your new institution.
              </InfoCard>
              <InfoCard title="Scholarship Search" icon={GraduationCap}>
                Strategies for securing athletic scholarships at your target transfer schools.
              </InfoCard>
            </div>
          </section>

          {/* AI Chat Interface Section */}
          <section className="mb-12">
            <h2 className="font-black text-4xl text-white mb-8 text-center">AI Transfer Advisor</h2>
            <div className="bg-[#0d1a3a] rounded-2xl border border-blue-700/50 p-6 shadow-lg max-w-4xl mx-auto">
              <div className="flex flex-col sm:flex-row gap-4 mb-4">
                <input
                  type="text"
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  placeholder="Ask the AI about transfer rules, eligibility, or next steps..."
                  className="flex-grow p-3 rounded-lg bg-[#050c1a] border border-blue-700/50 text-white placeholder-blue-400 focus:outline-none focus:ring-2 focus:ring-[#1E90FF]"
                />
                <button
                  onClick={handleAiPromptSubmit}
                  disabled={isLoading}
                  className="px-6 py-3 bg-[#1E90FF] text-white font-bold rounded-lg shadow-md hover:bg-blue-600 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? "Thinking..." : "Ask AI"}
                </button>
              </div>
              {aiResponse && (
                <div className="mt-6 p-4 bg-[#050c1a] rounded-lg border border-blue-700/50">
                  <p className="font-bold text-[#00FFFF] mb-2 flex items-center"><MessageSquare className="w-5 h-5 mr-2" /> AI Response:</p>
                  <p className="text-blue-200 whitespace-pre-wrap">{aiResponse}</p>
                </div>
              )}
              {isLoading && (
                <div className="mt-4 text-center text-blue-400">
                  Generating response...
                </div>
              )}
            </div>
          </section>

          {/* Transfer Rules by Sport Cards */}
          <section className="mb-12">
            <h2 className="font-black text-4xl text-white mb-8 text-center">Sport-Specific Transfer Rules</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <RuleCard
                sport="Football"
                rule="4+1 Rule (FBS/FCS)"
                details="Athletes can transfer once without sitting out. Additional transfers may require a waiver. Graduate transfers are immediately eligible."
              />
              <RuleCard
                sport="Basketball (Men's/Women's)"
                rule="One-Time Transfer Exception"
                details="Eligible for immediate participation after one transfer. Subsequent transfers require a year in residence or waiver."
              />
              <RuleCard
                sport="Baseball"
                rule="Undergraduate Transfer Rules"
                details="First-time transfers are generally immediately eligible. Subsequent transfers may require a year in residence."
              />
              <RuleCard
                sport="Soccer"
                rule="NCAA Transfer Guidelines"
                details="Similar to basketball, a one-time transfer exception allows immediate play. Waivers for additional transfers are possible."
              />
              <RuleCard
                sport="Track & Field / Cross Country"
                rule="Multi-Sport Transfer Considerations"
                details="Rules often align with general NCAA transfer policies, with specific considerations for multi-sport athletes."
              />
              <RuleCard
                sport="Volleyball"
                rule="Transfer Eligibility"
                details="One-time transfer exception applies. Academic standing and previous competition history are key factors."
              />
            </div>
          </section>

          {/* Portal Entry/Withdrawal Timeline */}
          <section className="mb-12">
            <h2 className="font-black text-4xl text-white mb-8 text-center">Key Transfer Portal Dates & Timeline</h2>
            <div className="relative pl-10">
              <div className="absolute left-4 top-0 bottom-0 w-1 bg-blue-700/50 rounded-full"></div>
              <TimelineEvent
                title="Fall Sport Window (Football)"
                description="Typically 45 days starting the Monday after conference championship games. Another window in May."
                icon={Calendar}
              />
              <TimelineEvent
                title="Winter Sport Window (Basketball)"
                description="Typically 60 days starting the Monday after the NCAA Men's and Women's Basketball Championship selections."
                icon={Calendar}
              />
              <TimelineEvent
                title="Spring Sport Window (All Others)"
                description="Typically 45 days starting May 1st. Specific dates vary by sport and division."
                icon={Calendar}
              />
              <TimelineEvent
                title="Withdrawal Deadline"
                description="Athletes must withdraw from the portal by a specific date to be eligible for aid at their previous institution."
                icon={Calendar}
              />
              <TimelineEvent
                title="Official Visit Period"
                description="Dates when prospective transfers can take official visits to new institutions."
                icon={User}
              />
            </div>
          </section>

          {/* NIL During Transfer Checklist */}
          <section className="mb-12">
            <h2 className="font-black text-4xl text-white mb-8 text-center">NIL & Transfer Checklist</h2>
            <div className="bg-[#0d1a3a] rounded-2xl border border-blue-700/50 p-6 shadow-lg max-w-3xl mx-auto">
              <ul className="list-none p-0">
                <ChecklistItem item="Review current NIL contracts for transfer clauses." checked={true} />
                <ChecklistItem item="Understand state NIL laws of new institution." checked={true} />
                <ChecklistItem item="Assess market value in new location/conference." checked={false} />
                <ChecklistItem item="Consult with NIL agent/advisor on new opportunities." checked={true} />
                <ChecklistItem item="Negotiate new NIL deals with potential schools." checked={false} />
                <ChecklistItem item="Ensure compliance with NCAA and institutional NIL policies." checked={true} />
                <ChecklistItem item="Document all NIL activities and agreements." checked={false} />
                <ChecklistItem item="Consider impact of transfer on existing brand partnerships." checked={true} />
              </ul>
            </div>
          </section>

          {/* Academic Eligibility Requirements */}
          <section className="mb-12">
            <h2 className="font-black text-4xl text-white mb-8 text-center">Academic Eligibility for Transfers</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <InfoCard title="GPA Requirements" icon={GraduationCap}>
                Maintain a minimum GPA (e.g., 2.0 or 2.5) at your previous institution to be eligible for transfer and competition.
              </InfoCard>
              <InfoCard title="Credit Hours" icon={BookOpen}>
                Ensure you have completed the required number of transferable credit hours and are on track for graduation.
              </InfoCard>
              <InfoCard title="Degree Progress" icon={ClipboardList}>
                Demonstrate satisfactory progress towards a degree at your previous school. This is crucial for immediate eligibility.
              </InfoCard>
              <InfoCard title="Major Declaration" icon={User}>
                Some institutions require a declared major upon transfer, especially for specific programs or scholarships.
              </InfoCard>
            </div>
          </section>

          {/* Coach Contact Rules During Portal */}
          <section className="mb-12">
            <h2 className="font-black text-4xl text-white mb-8 text-center">Coach Contact & Recruitment Rules</h2>
            <div className="bg-[#0d1a3a] rounded-2xl border border-blue-700/50 p-6 shadow-lg max-w-4xl mx-auto">
              <p className="text-blue-200 mb-4 leading-relaxed">
                Once an athlete enters the transfer portal, other institutions are permitted to contact them directly. 
                However, there are specific rules governing the nature and timing of this contact:
              </p>
              <ul className="list-disc list-inside text-blue-200 space-y-2">
                <li>Coaches can initiate contact without permission from the previous institution.</li>
                <li>Official and unofficial visits are allowed once in the portal.</li>
                <li>NCAA rules prohibit inducements or promises of NIL deals before official commitments.</li>
                <li>Athletes should keep records of all communications with prospective coaches.</li>
                <li>Understanding the recruitment timeline within the portal windows is critical.</li>
              </ul>
              <p className="text-blue-300 mt-4 italic">
                Always consult with compliance officers or AthlynX advisors for specific interpretations.
              </p>
            </div>
          </section>

          {/* How AthlynX Helps Section */}
          <section className="mb-12">
            <h2 className="font-black text-4xl text-white mb-8 text-center">How AthlynX Empowers Your Transfer</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InfoCard title="Personalized Guidance" icon={User}>
                Our AI-powered platform provides tailored advice based on your sport, academic standing, and transfer goals.
              </InfoCard>
              <InfoCard title="Rule Clarity" icon={BookOpen}>
                Access up-to-date NCAA and conference-specific transfer rules, ensuring you stay compliant.
              </InfoCard>
              <InfoCard title="Timeline Management" icon={Calendar}>
                Stay on track with critical dates for portal entry, withdrawal, and eligibility deadlines.
              </InfoCard>
              <InfoCard title="NIL Strategy" icon={Zap}>
                Develop a robust NIL strategy to maximize your opportunities during and after your transfer.
              </InfoCard>
            </div>
          </section>

          {/* Copyright */}
          <div className="text-center text-blue-500 text-sm mt-16 pb-8">
            Copyright © 2026 Chad A. Dozier Sr. / AthlynXAI. All rights reserved.
          </div>
        </div>
        <MobileBottomNav />
      </DashboardLayout>
    </RouteErrorBoundary>
  );
};

export default TransferWizard;
