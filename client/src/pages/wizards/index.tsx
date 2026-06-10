// Export all wizard pages
export { default as AgentWizard } from "./AgentWizard";

// Lawyer Wizard
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Scale, DollarSign, GraduationCap, Eye, RefreshCw, Heart, Zap, Sparkles } from "lucide-react";
import AIWizardChat from "@/components/AIWizardChat";

export function LawyerWizard() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-900 to-blue-950">
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
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-red-500 flex items-center justify-center">
                  <Scale className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-white">Legal Advisor</h1>
                  <p className="text-slate-400 text-sm">NIL compliance & contracts</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-blue-600/20 px-3 py-1.5 rounded-full">
              <Sparkles className="w-3 h-3 text-blue-500" />
              <span className="text-blue-300 text-xs">Manus AI</span>
            </div>
          </div>
        </div>
      </header>
      <div className="container mx-auto px-4 py-6">
        <AIWizardChat
          wizardName="Legal Advisor"
          wizardIcon={<Scale className="w-5 h-5 text-white" />}
          wizardColor="from-blue-600 to-red-500"
          systemPrompt="You are an expert legal advisor helping athletes with NIL compliance and contracts."
          welcomeMessage={`⚖️ Welcome! I'm your Legal Advisor, here to help you understand the legal side of being an athlete.

**I specialize in:**
• NIL (Name, Image, Likeness) rules
• Contract review and red flags
• NCAA compliance
• State-specific regulations
• Protecting your rights

Remember: I provide guidance, but always consult a licensed attorney for legal decisions.

What legal questions can I help you with?`}
          suggestedQuestions={[
            { text: "What are the NIL rules?", icon: "📋" },
            { text: "Review my contract terms", icon: "📝" },
            { text: "What can I legally do?", icon: "✅" },
            { text: "State NIL law differences", icon: "🗺️" },
          ]}
        />
      </div>
    </div>
  );
}

export function FinancialWizard() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-900 to-blue-950">
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
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-white">Financial Coach</h1>
                  <p className="text-slate-400 text-sm">Money management for athletes</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-blue-600/20 px-3 py-1.5 rounded-full">
              <Sparkles className="w-3 h-3 text-blue-500" />
              <span className="text-blue-300 text-xs">Manus AI</span>
            </div>
          </div>
        </div>
      </header>
      <div className="container mx-auto px-4 py-6">
        <AIWizardChat
          wizardName="Financial Coach"
          wizardIcon={<DollarSign className="w-5 h-5 text-white" />}
          wizardColor="from-green-500 to-emerald-500"
          systemPrompt="You are an expert financial advisor helping athletes manage their money."
          welcomeMessage={`💰 Hey! I'm your Financial Coach, here to help you build wealth and manage your money wisely.

**I can help you with:**
• Budgeting your NIL income
• Understanding taxes
• Investment basics
• Avoiding financial pitfalls
• Building long-term wealth

Athletes have unique financial situations - let's make sure you're set up for success!

What financial topic would you like to explore?`}
          suggestedQuestions={[
            { text: "How should I budget?", icon: "📊" },
            { text: "NIL tax questions", icon: "🧾" },
            { text: "Should I invest?", icon: "📈" },
            { text: "Avoiding scams", icon: "🚨" },
          ]}
        />
      </div>
    </div>
  );
}

export function ScholarshipWizard() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-900 to-blue-950">
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
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-red-500 flex items-center justify-center">
                  <GraduationCap className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-white">Scholarship Navigator</h1>
                  <p className="text-slate-400 text-sm">NCAA rules & eligibility</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-blue-600/20 px-3 py-1.5 rounded-full">
              <Sparkles className="w-3 h-3 text-blue-500" />
              <span className="text-blue-300 text-xs">Manus AI</span>
            </div>
          </div>
        </div>
      </header>
      <div className="container mx-auto px-4 py-6">
        <AIWizardChat
          wizardName="Scholarship Navigator"
          wizardIcon={<GraduationCap className="w-5 h-5 text-white" />}
          wizardColor="from-red-500 to-red-500"
          systemPrompt="You are an expert on NCAA scholarships and eligibility requirements."
          welcomeMessage={`🎓 Welcome! I'm your Scholarship Navigator, here to help you understand NCAA rules and maximize your scholarship opportunities.

**I can guide you through:**
• NCAA eligibility requirements
• Academic standards by division
• Scholarship types and limits
• Transfer eligibility rules
• Important deadlines

Education is your foundation - let's make sure you're on track!

What would you like to know about scholarships?`}
          suggestedQuestions={[
            { text: "NCAA eligibility rules", icon: "📚" },
            { text: "GPA requirements", icon: "📝" },
            { text: "Scholarship limits", icon: "🎯" },
            { text: "Transfer eligibility", icon: "🔄" },
          ]}
        />
      </div>
    </div>
  );
}

export function ScoutWizard() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-900 to-blue-950">
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
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-red-500 flex items-center justify-center">
                  <Eye className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-white">Scout Simulator</h1>
                  <p className="text-slate-400 text-sm">See through a scout's eyes</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-blue-600/20 px-3 py-1.5 rounded-full">
              <Sparkles className="w-3 h-3 text-blue-500" />
              <span className="text-blue-300 text-xs">Manus AI</span>
            </div>
          </div>
        </div>
      </header>
      <div className="container mx-auto px-4 py-6">
        <AIWizardChat
          wizardName="Scout Simulator"
          wizardIcon={<Eye className="w-5 h-5 text-white" />}
          wizardColor="from-red-500 to-red-500"
          systemPrompt="You are an expert scout helping athletes understand what recruiters look for."
          welcomeMessage={`👀 Hey! I'm your Scout Simulator - I'll help you see yourself through a scout's eyes.

**I can help you understand:**
• What scouts look for by position
• How to improve your profile
• Creating effective highlight film
• Combine and pro day preparation
• Building your recruiting brand

Let's get you noticed by the right people!

What aspect of scouting would you like to explore?`}
          suggestedQuestions={[
            { text: "What do scouts look for?", icon: "🔍" },
            { text: "Improve my highlight film", icon: "🎬" },
            { text: "Combine preparation", icon: "🏃" },
            { text: "Position-specific tips", icon: "🏈" },
          ]}
        />
      </div>
    </div>
  );
}

export function TransferWizard() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-900 to-blue-950">
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
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center">
                  <RefreshCw className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-white">Transfer Guide</h1>
                  <p className="text-slate-400 text-sm">Navigate the portal</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-blue-600/20 px-3 py-1.5 rounded-full">
              <Sparkles className="w-3 h-3 text-blue-500" />
              <span className="text-blue-300 text-xs">Manus AI</span>
            </div>
          </div>
        </div>
      </header>
      <div className="container mx-auto px-4 py-6">
        <AIWizardChat
          wizardName="Transfer Guide"
          wizardIcon={<RefreshCw className="w-5 h-5 text-white" />}
          wizardColor="from-cyan-500 to-blue-500"
          systemPrompt="You are an expert on the college transfer portal process."
          welcomeMessage={`🔄 Welcome! I'm your Transfer Guide, here to help you navigate the transfer portal successfully.

**I can help you with:**
• Understanding the portal process
• Key dates and deadlines
• Communication with coaches
• Evaluating new schools
• Making the right decision

The transfer portal can change your career - let's do it right!

Where are you in the transfer process?`}
          suggestedQuestions={[
            { text: "How does the portal work?", icon: "❓" },
            { text: "Key transfer dates", icon: "📅" },
            { text: "Talk to coaches", icon: "💬" },
            { text: "Evaluate schools", icon: "🏫" },
          ]}
        />
      </div>
    </div>
  );
}

export function LifeWizard() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-900 to-blue-950">
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
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-red-500 flex items-center justify-center">
                  <Heart className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-white">Life Coach</h1>
                  <p className="text-slate-400 text-sm">Balance & wellness</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-blue-600/20 px-3 py-1.5 rounded-full">
              <Sparkles className="w-3 h-3 text-blue-500" />
              <span className="text-blue-300 text-xs">Manus AI</span>
            </div>
          </div>
        </div>
      </header>
      <div className="container mx-auto px-4 py-6">
        <AIWizardChat
          wizardName="Life Coach"
          wizardIcon={<Heart className="w-5 h-5 text-white" />}
          wizardColor="from-red-500 to-red-500"
          systemPrompt="You are a supportive life coach helping athletes balance their lives."
          welcomeMessage={`💖 Hey! I'm your Life Coach, here to help you thrive both on and off the field.

**I can support you with:**
• Time management
• Mental wellness
• Relationships & social life
• Academic balance
• Personal growth

You're more than an athlete - let's build a fulfilling life!

What's on your mind today?`}
          suggestedQuestions={[
            { text: "Balance my schedule", icon: "⏰" },
            { text: "Dealing with stress", icon: "😤" },
            { text: "Relationships advice", icon: "💑" },
            { text: "Finding motivation", icon: "🔥" },
          ]}
        />
      </div>
    </div>
  );
}

export function CareerWizard() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-900 to-blue-950">
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
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-white">Career Transition</h1>
                  <p className="text-slate-400 text-sm">Life after sports</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-blue-600/20 px-3 py-1.5 rounded-full">
              <Sparkles className="w-3 h-3 text-blue-500" />
              <span className="text-blue-300 text-xs">Manus AI</span>
            </div>
          </div>
        </div>
      </header>
      <div className="container mx-auto px-4 py-6">
        <AIWizardChat
          wizardName="Career Transition"
          wizardIcon={<Zap className="w-5 h-5 text-white" />}
          wizardColor="from-indigo-500 to-blue-600"
          systemPrompt="You are a career counselor helping athletes transition to life after sports."
          welcomeMessage={`⚡ Welcome! I'm your Career Transition advisor, here to help you build an amazing future beyond sports.

**I can help you with:**
• Identifying transferable skills
• Career exploration
• Resume & interview prep
• Networking strategies
• Education & certifications

Your athletic experience is valuable - let's leverage it!

What career interests you?`}
          suggestedQuestions={[
            { text: "My transferable skills", icon: "💪" },
            { text: "Career options", icon: "🎯" },
            { text: "Build my resume", icon: "📄" },
            { text: "Networking tips", icon: "🤝" },
          ]}
        />
      </div>
    </div>
  );
}
