import React, { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import MobileBottomNav from "@/components/MobileBottomNav";
import { RouteErrorBoundary } from "@/components/GlobalErrorBoundary";
import { Button } from "@/components/ui/button"; // Assuming a UI library for Button
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"; // Assuming a UI library for Card
import { Lightbulb, FileText, MessageSquare, CheckSquare, Users, Globe, Shield, DollarSign, XCircle, Lock, Briefcase, BookOpen, ClipboardCheck, Handshake, Award, Gavel, HelpCircle, CalendarCheck, Flag, Trophy } from "lucide-react";

// Placeholder for trpc.ai.wizardAdvice.useMutation
// In a real application, this would be imported from your tRPC client setup.
const trpc = {
  ai: {
    wizardAdvice: {
      useMutation: () => {
        const [isLoading, setIsLoading] = useState(false);
        const [data, setData] = useState<string | null>(null);
        const mutate = async (variables: { wizardType: string; prompt: string }) => {
          setIsLoading(true);
          // Simulate an API call
          await new Promise((resolve) => setTimeout(resolve, 1500));
          setData(`AI Response for "${variables.prompt}" from ${variables.wizardType} wizard.`);
          setIsLoading(false);
        };
        return { mutate, isLoading, data };
      },
    },
  },
};

const LawyerWizard = () => {
  const [chatInput, setChatInput] = useState("");
  const [chatHistory, setChatHistory] = useState<Array<{ type: "user" | "ai"; text: string }>>([]);
  const { mutate: sendWizardAdvice, isLoading: isChatLoading, data: chatResponse } = trpc.ai.wizardAdvice.useMutation();

  React.useEffect(() => {
    if (chatResponse) {
      setChatHistory((prev) => [...prev, { type: "ai", text: chatResponse }]);
    }
  }, [chatResponse]);

  const handleChatSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (chatInput.trim()) {
      setChatHistory((prev) => [...prev, { type: "user", text: chatInput }]);
      sendWizardAdvice({ wizardType: "lawyer", prompt: chatInput });
      setChatInput("");
    }
  };

  const quickPrompts = [
    "Review my endorsement contract for potential pitfalls.",
    "What are the key legal considerations for a NIL deal?",
    "Explain the clauses typically found in an agent agreement.",
    "I need advice on intellectual property rights for my brand.",
    "What are the implications of signing a contract with a foreign entity?",
    "How can I protect my NCAA eligibility while exploring professional opportunities?",
    "What are common red flags in sports contracts?",
    "Can you help me understand the difference between an agent and a lawyer?",
  ];

  const legalEducationCards = [
    {
      icon: FileText,
      title: "What to Look For in Contracts",
      description: "Understand the essential clauses: scope, term, compensation, termination, and dispute resolution.",
    },
    {
      icon: XCircle,
      title: "Red Flags in Agent Agreements",
      description: "Watch out for excessive fees, unclear termination clauses, conflicts of interest, and lack of transparency.",
    },
    {
      icon: Award,
      title: "NIL Contract Clauses",
      description: "Key elements include scope of work, compensation structure, duration, intellectual property, and compliance with NCAA rules.",
    },
    {
      icon: Lock,
      title: "Intellectual Property Ownership",
      description: "Protect your name, image, likeness, and brand. Understand who owns what in your deals.",
    },
  ];

  const contractChecklistItems = [
    { label: "Guaranteed Money & Bonuses", icon: DollarSign },
    { label: "Injury Clauses & Protection", icon: Shield },
    { label: "Termination Clauses (with/without cause)", icon: XCircle },
    { label: "Exclusivity & Non-Compete", icon: Lock },
    { label: "Intellectual Property Rights", icon: Lightbulb },
    { label: "Dispute Resolution Mechanism", icon: Gavel },
    { label: "Governing Law & Jurisdiction", icon: Flag },
    { label: "Confidentiality Agreements", icon: Briefcase },
  ];

  const rolesExplained = [
    {
      role: "Agent",
      description: "Primarily focuses on securing contracts, endorsements, and managing career opportunities. Often involved in negotiations.",
      icon: Handshake,
    },
    {
      role: "Lawyer",
      description: "Provides legal advice, reviews contracts, ensures compliance, and represents athletes in legal disputes. Acts as a fiduciary.",
      icon: Trophy,
    },
    {
      role: "Financial Advisor",
      description: "Manages finances, investments, taxes, and long-term wealth planning. Crucial for managing earnings effectively.",
      icon: DollarSign,
    },
  ];

  const ncaaEligibilityChecklist = [
    { label: "Amateurism Rules Compliance", icon: CheckSquare },
    { label: "NIL Disclosure Requirements", icon: ClipboardCheck },
    { label: "Avoiding Pay-for-Play Scenarios", icon: XCircle },
    { label: "Agent Contact Regulations", icon: Users },
    { label: "Maintaining Academic Eligibility", icon: BookOpen },
    { label: "Transfer Portal Considerations", icon: Globe },
  ];

  return (
    <RouteErrorBoundary>
      <DashboardLayout>
        <div className="min-h-screen bg-[#050c1a] text-white p-4 sm:p-6 lg:p-8">
          {/* Hero Section */}
          <div className="bg-gradient-to-r from-[#1E90FF] to-[#4169E1] p-6 sm:p-8 lg:p-10 rounded-xl shadow-lg mb-8">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black mb-2">AI Legal Wizard for Athletes</h1>
            <p className="text-blue-100 text-lg sm:text-xl font-bold">Your trusted AI companion for navigating the complex legal landscape of sports.</p>
          </div>

          {/* Quick Prompts Section */}
          <section className="mb-8">
            <h2 className="text-2xl sm:text-3xl font-black text-blue-300 mb-4">Quick Legal Prompts</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {quickPrompts.map((prompt, index) => (
                <Button
                  key={index}
                  onClick={() => setChatInput(prompt)}
                  className="w-full bg-[#0d1a3a] hover:bg-blue-700 text-white border border-blue-700/50 rounded-lg py-3 px-4 text-left"
                >
                  <Lightbulb className="mr-2 h-5 w-5 text-cyan-400" /> {prompt}
                </Button>
              ))}
            </div>
          </section>

          {/* AI Chat Interface Section */}
          <section className="mb-8">
            <h2 className="text-2xl sm:text-3xl font-black text-blue-300 mb-4">AI Legal Chat</h2>
            <Card className="bg-[#0d1a3a] rounded-2xl border border-blue-700/50 shadow-lg">
              <CardContent className="p-6">
                <div className="h-64 overflow-y-auto mb-4 p-4 bg-[#050c1a] rounded-lg border border-blue-800/50">
                  {chatHistory.length === 0 && (
                    <p className="text-blue-300">Ask me anything about sports law, contracts, NIL, or agent agreements!</p>
                  )}
                  {chatHistory.map((msg, index) => (
                    <div key={index} className={`mb-2 ${msg.type === "user" ? "text-right" : "text-left"}`}>
                      <span
                        className={`inline-block p-2 rounded-lg ${msg.type === "user"
                          ? "bg-blue-600 text-white" : "bg-gray-700 text-white"}
                        `}
                      >
                        {msg.text}
                      </span>
                    </div>
                  ))}
                  {isChatLoading && (
                    <div className="text-center text-blue-400 mt-2">AI is thinking...</div>
                  )}
                </div>
                <form onSubmit={handleChatSubmit} className="flex gap-2">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="Type your legal question here..."
                    className="flex-grow p-3 rounded-lg bg-[#050c1a] border border-blue-700/50 text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    disabled={isChatLoading}
                  />
                  <Button type="submit" className="bg-[#1E90FF] hover:bg-cyan-600 text-white font-bold py-3 px-6 rounded-lg" disabled={isChatLoading}>
                    <MessageSquare className="mr-2 h-5 w-5" /> Ask AI
                  </Button>
                </form>
              </CardContent>
            </Card>
          </section>

          {/* Legal Education Cards Section */}
          <section className="mb-8">
            <h2 className="text-2xl sm:text-3xl font-black text-blue-300 mb-4">Legal Education Hub</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {legalEducationCards.map((card, index) => (
                <Card key={index} className="bg-[#0d1a3a] rounded-2xl border border-blue-700/50 shadow-lg">
                  <CardHeader>
                    <card.icon className="h-10 w-10 text-cyan-400 mb-3" />
                    <CardTitle className="text-xl font-bold text-white">{card.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-blue-200">{card.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Contract Checklist Section */}
          <section className="mb-8">
            <h2 className="text-2xl sm:text-3xl font-black text-blue-300 mb-4">Essential Contract Checklist</h2>
            <Card className="bg-[#0d1a3a] rounded-2xl border border-blue-700/50 shadow-lg">
              <CardContent className="p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {contractChecklistItems.map((item, index) => (
                    <div key={index} className="flex items-center text-blue-200">
                      <item.icon className="h-5 w-5 text-cyan-400 mr-3" />
                      <span className="font-bold">{item.label}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Agent vs Lawyer vs Financial Advisor Section */}
          <section className="mb-8">
            <h2 className="text-2xl sm:text-3xl font-black text-blue-300 mb-4">Understanding Your Support Team</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {rolesExplained.map((role, index) => (
                <Card key={index} className="bg-[#0d1a3a] rounded-2xl border border-blue-700/50 shadow-lg">
                  <CardHeader>
                    <role.icon className="h-10 w-10 text-cyan-400 mb-3" />
                    <CardTitle className="text-xl font-bold text-white">{role.role}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-blue-200">{role.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* NCAA Eligibility Protection Checklist Section */}
          <section className="mb-8">
            <h2 className="text-2xl sm:text-3xl font-black text-blue-300 mb-4">NCAA Eligibility Protection</h2>
            <Card className="bg-[#0d1a3a] rounded-2xl border border-blue-700/50 shadow-lg">
              <CardContent className="p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {ncaaEligibilityChecklist.map((item, index) => (
                    <div key={index} className="flex items-center text-blue-200">
                      <item.icon className="h-5 w-5 text-cyan-400 mr-3" />
                      <span className="font-bold">{item.label}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </section>

          {/* International Contract Considerations Section */}
          <section className="mb-8">
            <h2 className="text-2xl sm:text-3xl font-black text-blue-300 mb-4">International Contract Considerations</h2>
            <Card className="bg-[#0d1a3a] rounded-2xl border border-blue-700/50 shadow-lg">
              <CardContent className="p-6 text-blue-200">
                <p className="mb-3">When dealing with international contracts, several factors become critical:</p>
                <ul className="list-disc list-inside space-y-2">
                  <li><Globe className="inline h-4 w-4 mr-2 text-cyan-400" /> Jurisdiction and Governing Law: Which country's laws will apply? Where will disputes be resolved?</li>
                  <li><DollarSign className="inline h-4 w-4 mr-2 text-cyan-400" /> Currency and Taxation: Understand exchange rates, payment methods, and tax obligations in different countries.</li>
                  <li><Users className="inline h-4 w-4 mr-2 text-cyan-400" /> Visa and Work Permit Requirements: Ensure all necessary documentation for working abroad is secured.</li>
                  <li><CalendarCheck className="inline h-4 w-4 mr-2 text-cyan-400" /> Cultural Differences in Negotiation: Be aware of varying business practices and communication styles.</li>
                  <li><Shield className="inline h-4 w-4 mr-2 text-cyan-400" /> Compliance with Local Regulations: Adhere to labor laws, sports regulations, and anti-corruption laws of the host country.</li>
                  <li><HelpCircle className="inline h-4 w-4 mr-2 text-cyan-400" /> Repatriation Clauses: What happens if you need to return home unexpectedly?</li>
                </ul>
              </CardContent>
            </Card>
          </section>

          {/* Copyright */}
          <footer className="text-center text-blue-300 text-sm mt-10">
            <p>Copyright © 2026 Chad A. Dozier Sr. / AthlynXAI. All rights reserved.</p>
          </footer>
        </div>
        <MobileBottomNav />
      </DashboardLayout>
    </RouteErrorBoundary>
  );
};

export default LawyerWizard;
