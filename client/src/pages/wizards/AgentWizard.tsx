import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Users, Sparkles } from "lucide-react";
import AIWizardChat from "@/components/AIWizardChat";

export default function AgentWizard() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-900 to-blue-950">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur-md border-b border-slate-800">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/wizards">
                <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  All Wizards
                </Button>
              </Link>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                  <Users className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-white">Agent Wizard</h1>
                  <p className="text-slate-400 text-sm">Find & vet sports agents</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Chat Interface */}
      <div className="container mx-auto px-4 py-6">
        <AIWizardChat
          wizardName="Agent Wizard"
          wizardIcon={<Users className="w-5 h-5 text-white" />}
          wizardColor="from-blue-500 to-cyan-500"
          systemPrompt="You are an expert sports agent advisor helping athletes find and evaluate agents."
          welcomeMessage={`Hey there! I'm your Agent Wizard, here to help you navigate the world of sports agents.

Whether you're looking for your first agent, evaluating offers, or understanding contracts, I've got you covered.

**I can help you with:**
• Finding certified agents in your sport
• Understanding agent fee structures
• Reviewing contract terms
• Spotting red flags
• Negotiation strategies

What would you like to know about agents?`}
          suggestedQuestions={[
            { text: "How do I find a good agent?" },
            { text: "What fees should I expect?" },
            { text: "What are agent red flags?" },
            { text: "How do contracts work?" },
          ]}
        />
      </div>
    </div>
  );
}
