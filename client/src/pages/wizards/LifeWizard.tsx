import DashboardLayout from "@/components/DashboardLayout";
import MobileBottomNav from "@/components/MobileBottomNav";
import { RouteErrorBoundary } from '@/components/GlobalErrorBoundary';
import { Link } from "wouter";
import { Button } from "@/components/ui/button"; // Assuming a UI library for Button
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"; // Assuming a UI library for Card
import { Brain, Clock, Heart, Users, Church, Lightbulb, MessageSquare, Briefcase, BookOpen, Gift, Shield } from "lucide-react"; // Example Lucide icons
import React, { useState } from "react";

// Mock trpc for the AI chat interface
const trpc = {
  ai: {
    wizardAdvice: {
      useMutation: () => {
        const [isLoading, setIsLoading] = useState(false);
        const [data, setData] = useState<string | null>(null);
        const mutate = async (input: { prompt: string; wizardType: string }) => {
          setIsLoading(true);
          // Simulate an API call
          await new Promise((resolve) => setTimeout(resolve, 1500));
          setData(`AI response for "${input.prompt}" in ${input.wizardType} wizard: Focus on holistic well-being, strategic planning, and leveraging your unique strengths.`);
          setIsLoading(false);
        };
        return { mutate, isLoading, data };
      },
    },
  },
};

const LifeWizard = () => {
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const { mutate: getWizardAdvice, isLoading: isAiLoading, data: aiData } = trpc.ai.wizardAdvice.useMutation();

  const handleAiPromptSubmit = () => {
    if (aiPrompt.trim()) {
      getWizardAdvice({ prompt: aiPrompt, wizardType: "life" });
      setAiResponse(null); // Clear previous response
    }
  };

  React.useEffect(() => {
    if (aiData) {
      setAiResponse(aiData);
    }
  }, [aiData]);

  const quickPrompts = [
    { icon: Brain, label: "Mental Health Check-in", prompt: "How can I improve my mental resilience as an athlete?" },
    { icon: Clock, label: "Time Management Strategies", prompt: "What are effective time management techniques for balancing training, studies, and personal life?" },
    { icon: Heart, label: "Relationship Building", prompt: "How can I maintain strong relationships with family and friends despite my demanding schedule?" },
    { icon: Users, label: "Social Media Presence", prompt: "What are best practices for building a positive and authentic social media brand?" },
    { icon: Lightbulb, label: "Brand Building Tips", prompt: "Give me actionable steps to build my personal brand beyond my sport." },
  ];

  const lifeSkillsCards = [
    { icon: Shield, title: "Mental Health Resources", description: "Access tools and support for athlete well-being.", link: "#" },
    { icon: Clock, title: "Time Management for Athletes", description: "Optimize your schedule for peak performance and life balance.", link: "#" },
    { icon: Users, title: "Social Media Brand Building", description: "Craft your online identity and engage with your audience.", link: "#" },
    { icon: Heart, title: "Relationship Management", description: "Strengthen connections with loved ones and teammates.", link: "#" },
  ];

  const careerTransitionSteps = [
    "Identify transferable skills from your athletic career.",
    "Explore potential career paths and industries of interest.",
    "Network with professionals in your desired fields.",
    "Pursue internships or educational opportunities.",
    "Develop a strong resume and interview skills.",
    "Seek mentorship and guidance from experienced individuals.",
    "Plan for financial stability during the transition.",
    "Embrace new challenges and learning opportunities.",
  ];

  const educationTrackerItems = [
    { course: "Sports Psychology 101", status: "Completed", grade: "A" },
    { course: "Financial Literacy for Athletes", status: "In Progress", grade: "N/A" },
    { course: "Public Speaking & Media Training", status: "Planned", grade: "N/A" },
    { course: "Business Fundamentals", status: "Completed", grade: "B+" },
  ];

  const communityGivingBackItems = [
    { activity: "Mentoring youth athletes", impact: "Inspiring the next generation" },
    { activity: "Volunteering at local charities", impact: "Supporting community initiatives" },
    { activity: "Participating in awareness campaigns", impact: "Advocating for important causes" },
  ];

  return (
    <RouteErrorBoundary>
      <DashboardLayout>
        <div className="min-h-screen bg-[#050c1a] text-white p-4 sm:p-6 lg:p-8">
          <MobileBottomNav />
          <header className="mb-8">
            <h1 className="text-4xl sm:text-5xl font-black bg-gradient-to-r from-[#1E90FF] to-[#4169E1] text-transparent bg-clip-text pb-2">
              Life Wizard
            </h1>
            <p className="text-blue-200 text-lg sm:text-xl">Navigate your journey beyond the game with AI-powered life skills guidance.</p>
          </header>

          {/* Hero Section */}
          <section className="relative bg-[#0d1a3a] rounded-2xl border border-blue-700/50 p-6 sm:p-8 mb-12 overflow-hidden">
            <div className="absolute inset-0 opacity-10 pointer-events-none">
              {/* Stadium lights effect */}
              <div className="absolute top-0 left-1/4 w-1/2 h-full bg-gradient-to-b from-[#1E90FF] to-transparent blur-3xl"></div>
              <div className="absolute bottom-0 right-1/4 w-1/2 h-full bg-gradient-to-t from-[#00FFFF] to-transparent blur-3xl"></div>
            </div>
            <div className="relative z-10">
              <h2 className="text-3xl font-bold text-white mb-4 flex items-center">
                <Shield className="mr-3 text-[#1E90FF]" size={32} /> Your Holistic Athlete Journey
              </h2>
              <p className="text-blue-300 text-lg mb-6">
                The Life Wizard is designed to support you in every aspect of your personal development.
                From mental well-being to career transitions, get personalized insights and resources to thrive.
              </p>
              <Button className="bg-[#1E90FF] hover:bg-[#00FFFF] text-white font-bold py-3 px-6 rounded-lg transition-all duration-300">
                Start Your Life Plan
              </Button>
            </div>
          </section>

          {/* Quick Prompts Section */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-white mb-6">Quick Prompts for Life Skills</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {quickPrompts.map((item, index) => (
                <Card key={index} className="bg-[#0d1a3a] rounded-2xl border border-blue-700/50 hover:border-[#00FFFF] transition-all duration-300">
                  <CardContent className="p-6 flex items-center space-x-4">
                    <item.icon className="text-[#00FFFF]" size={28} />
                    <p className="text-blue-200 font-bold">{item.label}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* AI Chat Interface */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-white mb-6">AI Life Coach Chat</h2>
            <Card className="bg-[#0d1a3a] rounded-2xl border border-blue-700/50 p-6">
              <CardContent>
                <div className="flex flex-col sm:flex-row gap-4 mb-4">
                  <input
                    type="text"
                    value={aiPrompt}
                    onChange={(e) => setAiPrompt(e.target.value)}
                    placeholder="Ask your AI Life Coach anything..."
                    className="flex-grow p-3 rounded-lg bg-gray-800 text-white border border-blue-700/50 focus:outline-none focus:ring-2 focus:ring-[#1E90FF]"
                  />
                  <Button
                    onClick={handleAiPromptSubmit}
                    disabled={isAiLoading}
                    className="bg-[#1E90FF] hover:bg-[#00FFFF] text-white font-bold py-3 px-6 rounded-lg transition-all duration-300"
                  >
                    {isAiLoading ? "Thinking..." : "Get Advice"}
                  </Button>
                </div>
                {aiResponse && (
                  <div className="mt-4 p-4 bg-gray-800 rounded-lg border border-blue-700/50">
                    <p className="text-blue-300 flex items-start">
                      <MessageSquare className="mr-3 text-[#00FFFF] flex-shrink-0" size={20} />
                      {aiResponse}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </section>

          {/* Life Skills Cards */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-white mb-6">Essential Life Skills Hub</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {lifeSkillsCards.map((card, index) => (
                <Card key={index} className="bg-[#0d1a3a] rounded-2xl border border-blue-700/50 hover:border-[#1E90FF] transition-all duration-300">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-lg font-bold text-white">{card.title}</CardTitle>
                    <card.icon className="text-[#1E90FF]" size={24} />
                  </CardHeader>
                  <CardContent>
                    <p className="text-blue-300 text-sm mb-4">{card.description}</p>
                    <Link href={card.link} className="text-[#00FFFF] hover:underline text-sm font-bold">
                      Learn More
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Career Transition Planning */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-white mb-6">Career Transition Planning</h2>
            <Card className="bg-[#0d1a3a] rounded-2xl border border-blue-700/50 p-6">
              <CardContent>
                <p className="text-blue-300 mb-4">Prepare for a successful life after sports with our guided transition plan:</p>
                <ul className="list-disc list-inside space-y-2 text-blue-200">
                  {careerTransitionSteps.map((step, index) => (
                    <li key={index} className="flex items-start">
                      <Briefcase className="mr-2 mt-1 text-[#00FFFF] flex-shrink-0" size={18} />
                      <span>{step}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </section>

          {/* Education Completion Tracker */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-white mb-6">Education Completion Tracker</h2>
            <Card className="bg-[#0d1a3a] rounded-2xl border border-blue-700/50 p-6">
              <CardContent>
                <p className="text-blue-300 mb-4">Keep track of your academic progress and achievements:</p>
                <div className="overflow-x-auto">
                  <table className="min-w-full text-left text-blue-200">
                    <thead>
                      <tr className="border-b border-blue-700/50">
                        <th className="py-2 px-4 font-bold">Course</th>
                        <th className="py-2 px-4 font-bold">Status</th>
                        <th className="py-2 px-4 font-bold">Grade</th>
                      </tr>
                    </thead>
                    <tbody>
                      {educationTrackerItems.map((item, index) => (
                        <tr key={index} className="border-b border-blue-700/30 last:border-b-0">
                          <td className="py-2 px-4 flex items-center">
                            <BookOpen className="mr-2 text-[#1E90FF]" size={18} />
                            {item.course}
                          </td>
                          <td className="py-2 px-4">{item.status}</td>
                          <td className="py-2 px-4">{item.grade}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Community and Giving Back */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-white mb-6">Community & Giving Back</h2>
            <Card className="bg-[#0d1a3a] rounded-2xl border border-blue-700/50 p-6">
              <CardContent>
                <p className="text-blue-300 mb-4">Make a positive impact beyond your sport:</p>
                <ul className="list-disc list-inside space-y-2 text-blue-200">
                  {communityGivingBackItems.map((item, index) => (
                    <li key={index} className="flex items-start">
                      <Gift className="mr-2 mt-1 text-[#00FFFF] flex-shrink-0" size={18} />
                      <span>
                        <span className="font-bold">{item.activity}:</span> {item.impact}
                      </span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </section>

          {/* Faith and Purpose Section */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-white mb-6">Faith & Purpose</h2>
            <Card className="bg-[#0d1a3a] rounded-2xl border border-blue-700/50 p-6">
              <CardContent>
                <p className="text-blue-300 mb-4">
                  Explore resources and guidance to strengthen your faith and define your purpose:
                </p>
                <div className="flex items-center space-x-4 text-blue-200">
                  <Church className="text-[#1E90FF]" size={28} />
                  <p className="font-bold">Discover your core values and mission.</p>
                </div>
                <p className="text-blue-300 mt-4">
                  Understanding your faith and purpose can provide a strong foundation for all aspects of your life,
                  offering resilience, clarity, and direction as you navigate challenges and opportunities.
                </p>
                <Link href="#" className="text-[#00FFFF] hover:underline text-sm font-bold mt-4 block">
                  Explore Spiritual Growth Resources
                </Link>
              </CardContent>
            </Card>
          </section>

          <footer className="text-center text-blue-300 text-sm mt-12">
            <p>Copyright © 2026 Chad A. Dozier Sr. / AthlynXAI. All rights reserved.</p>
          </footer>
        </div>
      </DashboardLayout>
    </RouteErrorBoundary>
  );
};

export default LifeWizard;
