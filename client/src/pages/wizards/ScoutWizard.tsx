import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import MobileBottomNav from "@/components/MobileBottomNav";
import { RouteErrorBoundary } from '@/components/GlobalErrorBoundary';
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Lightbulb, CalendarDays, ClipboardList, GraduationCap, Globe, ArrowRight, MessageSquareText, User, Bot, UserRound } from "lucide-react";

// Mock trpc for demonstration purposes
const trpc = {
  ai: {
    wizardAdvice: {
      useMutation: () => {
        const [isLoading, setIsLoading] = useState(false);
        const [data, setData] = useState<any>(null);
        const mutate = async (variables: { wizardType: string; prompt: string }) => {
          setIsLoading(true);
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 1500));
          setData({
            response: `AI Scout Wizard: Based on your prompt "${variables.prompt}", here is some advice regarding ${variables.wizardType} recruiting. Always prioritize academic eligibility and NCAA compliance. Develop a strong highlight reel and proactively reach out to coaches. Attend camps and showcases to gain exposure. For specific timelines, refer to the sport-specific sections below.`, 
            sources: [
              "NCAA Eligibility Center",
              "Recruiting Process Guidelines"
            ]
          });
          setIsLoading(false);
        };
        return { mutate, isLoading, data };
      },
    },
  },
};

interface ChatMessage {
  id: number;
  sender: "user" | "ai";
  text: string;
}

const ScoutWizard = () => {
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [currentPrompt, setCurrentPrompt] = useState("");
  const { mutate: getWizardAdvice, isLoading: isAiThinking, data: aiResponse } = trpc.ai.wizardAdvice.useMutation();

  const handleSendMessage = async () => {
    if (currentPrompt.trim() === "") return;

    const newUserMessage: ChatMessage = { id: chatMessages.length + 1, sender: "user", text: currentPrompt };
    setChatMessages((prev) => [...prev, newUserMessage]);
    setCurrentPrompt("");

    await getWizardAdvice({ wizardType: "scout", prompt: currentPrompt });
  };

  // Effect to add AI response to chat messages
  useEffect(() => {
    if (aiResponse && aiResponse.response) {
      const newAiMessage: ChatMessage = { id: chatMessages.length + 1, sender: "ai", text: aiResponse.response };
      setChatMessages((prev) => [...prev, newAiMessage]);
    }
  }, [aiResponse]);

  return (
    <RouteErrorBoundary>
      <DashboardLayout>
        <div className="min-h-screen bg-[#050c1a] text-white pb-16">
          {/* Hero Section */}
          <div className="relative isolate overflow-hidden pt-14">
            <div
              className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
              aria-hidden="true"
            >
              <div
                className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#1E90FF] to-[#00FFFF] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
                style={{
                  clipPath:
                    "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
                }}
              />
            </div>
            <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
              <div className="mx-auto max-w-2xl text-center">
                <h1 className="text-4xl font-black tracking-tight text-white sm:text-6xl bg-gradient-to-r from-[#1E90FF] to-[#4169E1] text-transparent bg-clip-text">
                  AthlynX Scout Wizard
                </h1>
                <p className="mt-6 text-lg leading-8 text-blue-200">
                  Your AI-powered guide to navigating the complex world of athletic recruiting. Get personalized advice, timelines, and rule breakdowns.
                </p>
                <div className="mt-10 flex items-center justify-center gap-x-6">
                  <Button className="bg-[#1E90FF] hover:bg-[#00FFFF] text-white font-bold py-2 px-4 rounded-lg transition-all duration-300">
                    Start Scouting Journey <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                  <Link href="/dashboard" className="text-sm font-semibold leading-6 text-white hover:text-[#00FFFF]">
                    Learn more <span aria-hidden="true">→</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Prompts Section */}
          <section className="mx-auto max-w-7xl px-6 lg:px-8 py-16">
            <h2 className="text-3xl font-black text-white mb-8 bg-gradient-to-r from-[#1E90FF] to-[#4169E1] text-transparent bg-clip-text">
              Quick Prompts & Key Topics
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="bg-[#0d1a3a] rounded-2xl border border-blue-700/50 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-[#00FFFF] flex items-center"><CalendarDays className="mr-2" /> Recruiting Timelines</CardTitle>
                </CardHeader>
                <CardContent className="text-blue-300">
                  Understand the critical dates and phases for different sports and academic years.
                  <Button variant="link" className="text-[#1E90FF] hover:text-[#00FFFF] mt-2 p-0 h-auto">Explore Timelines</Button>
                </CardContent>
              </Card>
              <Card className="bg-[#0d1a3a] rounded-2xl border border-blue-700/50 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-[#00FFFF] flex items-center"><ClipboardList className="mr-2" /> Contact Rules</CardTitle>
                </CardHeader>
                <CardContent className="text-blue-300">
                  Navigate NCAA rules on when and how coaches can contact prospective student-athletes.
                  <Button variant="link" className="text-[#1E90FF] hover:text-[#00FFFF] mt-2 p-0 h-auto">View Contact Rules</Button>
                </CardContent>
              </Card>
              <Card className="bg-[#0d1a3a] rounded-2xl border border-blue-700/50 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-[#00FFFF] flex items-center"><Lightbulb className="mr-2" /> Official Visits</CardTitle>
                </CardHeader>
                <CardContent className="text-blue-300">
                  Learn about official visits, what they entail, and how to prepare for them.
                  <Button variant="link" className="text-[#1E90FF] hover:text-[#00FFFF] mt-2 p-0 h-auto">Official Visit Guide</Button>
                </CardContent>
              </Card>
              <Card className="bg-[#0d1a3a] rounded-2xl border border-blue-700/50 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-[#00FFFF] flex items-center"><GraduationCap className="mr-2" /> Commitment Process</CardTitle>
                </CardHeader>
                <CardContent className="text-blue-300">
                  A step-by-step breakdown of the commitment process, from verbal offers to National Letter of Intent.
                  <Button variant="link" className="text-[#1E90FF] hover:text-[#00FFFF] mt-2 p-0 h-auto">Commitment Steps</Button>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* AI Chat Interface Section */}
          <section className="mx-auto max-w-7xl px-6 lg:px-8 py-16">
            <h2 className="text-3xl font-black text-white mb-8 bg-gradient-to-r from-[#1E90FF] to-[#4169E1] text-transparent bg-clip-text">
              AI Scout Assistant
            </h2>
            <Card className="bg-[#0d1a3a] rounded-2xl border border-blue-700/50 shadow-lg p-6">
              <CardContent className="p-0">
                <ScrollArea className="h-[400px] pr-4">
                  <div className="space-y-4">
                    {chatMessages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex items-start gap-3 ${message.sender === "user" ? "justify-end" : ""}`}
                      >
                        {message.sender === "ai" && (
                          <Avatar className="h-8 w-8">
                            <AvatarImage src="/athlynx-ai-logo.png" alt="AI" />
                            <AvatarFallback className="bg-[#1E90FF] text-white"><Bot className="h-5 w-5" /></AvatarFallback>
                          </Avatar>
                        )}
                        <div
                          className={`max-w-[70%] rounded-lg p-3 ${message.sender === "user"
                            ? "bg-[#1E90FF] text-white" : "bg-blue-800/30 text-blue-100 border border-blue-700/50"}
                          `}
                        >
                          <p className="text-sm">{message.text}</p>
                        </div>
                        {message.sender === "user" && (
                          <Avatar className="h-8 w-8">
                            <AvatarImage src="/user-avatar.png" alt="User" />
                            <AvatarFallback className="bg-blue-500 text-white"><UserRound className="h-5 w-5" /></AvatarFallback>
                          </Avatar>
                        )}
                      </div>
                    ))}
                    {isAiThinking && (
                      <div className="flex items-start gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src="/athlynx-ai-logo.png" alt="AI" />
                          <AvatarFallback className="bg-[#1E90FF] text-white"><Bot className="h-5 w-5" /></AvatarFallback>
                        </Avatar>
                        <div className="max-w-[70%] rounded-lg p-3 bg-blue-800/30 text-blue-100 border border-blue-700/50">
                          <p className="text-sm italic">AI is thinking...</p>
                        </div>
                      </div>
                    )}
                  </div>
                </ScrollArea>
                <div className="flex mt-4 gap-2">
                  <Input
                    placeholder="Ask the AI about recruiting..."
                    className="flex-1 bg-[#050c1a] border border-blue-700/50 text-white placeholder:text-blue-300 focus:ring-[#1E90FF] focus:border-[#1E90FF]"
                    value={currentPrompt}
                    onChange={(e) => setCurrentPrompt(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        handleSendMessage();
                      }
                    }}
                    disabled={isAiThinking}
                  />
                  <Button onClick={handleSendMessage} disabled={isAiThinking} className="bg-[#1E90FF] hover:bg-[#00FFFF] text-white font-bold">
                    <MessageSquareText className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Recruiting Timeline by Sport Cards */}
          <section className="mx-auto max-w-7xl px-6 lg:px-8 py-16">
            <h2 className="text-3xl font-black text-white mb-8 bg-gradient-to-r from-[#1E90FF] to-[#4169E1] text-transparent bg-clip-text">
              Sport-Specific Recruiting Timelines
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { sport: "Football", description: "Key dates for official visits, contact periods, and signing days." },
                { sport: "Basketball", description: "NCAA rules for men's and women's basketball recruiting cycles." },
                { sport: "Baseball", description: "Important periods for showcases, commitments, and draft considerations." },
                { sport: "Soccer", description: "Recruiting windows, ID camps, and academic requirements for soccer." },
              ].map((item) => (
                <Card key={item.sport} className="bg-[#0d1a3a] rounded-2xl border border-blue-700/50 shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-[#00FFFF]">{item.sport}</CardTitle>
                  </CardHeader>
                  <CardContent className="text-blue-300">
                    <p>{item.description}</p>
                    <Button variant="link" className="text-[#1E90FF] hover:text-[#00FFFF] mt-2 p-0 h-auto">View Details</Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Official vs Unofficial Visit Rules */}
          <section className="mx-auto max-w-7xl px-6 lg:px-8 py-16">
            <h2 className="text-3xl font-black text-white mb-8 bg-gradient-to-r from-[#1E90FF] to-[#4169E1] text-transparent bg-clip-text">
              Official vs. Unofficial Visits
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-[#0d1a3a] rounded-2xl border border-blue-700/50 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-[#00FFFF]">Official Visits</CardTitle>
                </CardHeader>
                <CardContent className="text-blue-300">
                  <p>An official visit is any visit to a college campus by a prospective student-athlete that is financed in whole or in part by the college. You can take a maximum of five official visits, one per institution.</p>
                  <ul className="list-disc list-inside mt-4 space-y-1">
                    <li>College can pay for transportation, lodging, and meals.</li>
                    <li>Limited to 48 hours.</li>
                    <li>Must be academically eligible.</li>
                  </ul>
                </CardContent>
              </Card>
              <Card className="bg-[#0d1a3a] rounded-2xl border border-blue-700/50 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-[#00FFFF]">Unofficial Visits</CardTitle>
                </CardHeader>
                <CardContent className="text-blue-300">
                  <p>An unofficial visit is any visit to a college campus by a prospective student-athlete that is made at the prospective student-athlete's expense.</p>
                  <ul className="list-disc list-inside mt-4 space-y-1">
                    <li>Unlimited number of unofficial visits.</li>
                    <li>All expenses are paid by the prospective student-athlete.</li>
                    <li>Can meet with coaches and tour facilities.</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Dead Period and Quiet Period Rules */}
          <section className="mx-auto max-w-7xl px-6 lg:px-8 py-16">
            <h2 className="text-3xl font-black text-white mb-8 bg-gradient-to-r from-[#1E90FF] to-[#4169E1] text-transparent bg-clip-text">
              NCAA Recruiting Periods: Dead & Quiet
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-[#0d1a3a] rounded-2xl border border-blue-700/50 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-[#00FFFF]">Dead Period</CardTitle>
                </CardHeader>
                <CardContent className="text-blue-300">
                  <p>During a dead period, a college coach may not have face-to-face contact with a prospective student-athlete or their parents off the college campus. The coach may not watch the prospective student-athlete compete or visit their high school.</p>
                  <ul className="list-disc list-inside mt-4 space-y-1">
                    <li>No in-person contact allowed.</li>
                    <li>Coaches can still call, email, or text.</li>
                    <li>Prospective student-athletes can still visit campus at their own expense.</li>
                  </ul>
                </CardContent>
              </Card>
              <Card className="bg-[#0d1a3a] rounded-2xl border border-blue-700/50 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-[#00FFFF]">Quiet Period</CardTitle>
                </CardHeader>
                <CardContent className="text-blue-300">
                  <p>During a quiet period, a college coach may not have face-to-face contact with a prospective student-athlete or their parents off the college campus. The coach may not watch the prospective student-athlete compete or visit their high school.</p>
                  <ul className="list-disc list-inside mt-4 space-y-1">
                    <li>In-person contact only allowed on campus.</li>
                    <li>Coaches can still call, email, or text.</li>
                    <li>No off-campus recruiting.</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* How AthlynX Scouts Find Talent */}
          <section className="mx-auto max-w-7xl px-6 lg:px-8 py-16">
            <h2 className="text-3xl font-black text-white mb-8 bg-gradient-to-r from-[#1E90FF] to-[#4169E1] text-transparent bg-clip-text">
              How AthlynX Scouts Identify Talent
            </h2>
            <Card className="bg-[#0d1a3a] rounded-2xl border border-blue-700/50 shadow-lg p-6">
              <CardContent className="text-blue-300">
                <p className="mb-4">AthlynX utilizes a comprehensive, data-driven approach to identify and evaluate talent, going beyond traditional metrics to uncover true potential. Our scouting methodology integrates both mental and physical analytics to provide a holistic view of an athlete.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-xl font-bold text-[#00FFFF] mb-2">Mental Analytics</h3>
                    <ul className="list-disc list-inside space-y-1">
                      <li>Cognitive Processing Speed: Reaction time, decision-making under pressure.</li>
                      <li>Game Intelligence: Positional awareness, strategic understanding, adaptability.</li>
                      <li>Resilience & Grit: Performance under adversity, recovery from mistakes, mental toughness.</li>
                      <li>Leadership Qualities: Communication, team cohesion, influence on teammates.</li>
                      <li>Coachability: Openness to feedback, learning curve, application of instructions.</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-[#00FFFF] mb-2">Physical Analytics</h3>
                    <ul className="list-disc list-inside space-y-1">
                      <li>Biometric Data: Speed, agility, strength, endurance metrics.</li>
                      <li>Movement Efficiency: Biomechanical analysis of form and technique.</li>
                      <li>Injury Prediction Models: Data-driven insights to assess and mitigate injury risk.</li>
                      <li>Sport-Specific Skills Assessment: Advanced metrics for passing accuracy, shooting efficiency, tackling effectiveness, etc.</li>
                      <li>Growth Potential: Projections based on physical development and training response.</li>
                    </ul>
                  </div>
                </div>
                <p className="mt-4">Our AI models process vast amounts of data from game footage, training sessions, and psychological assessments to generate a unique AthlynX Talent Score, helping coaches find the perfect fit for their programs.</p>
              </CardContent>
            </Card>
          </section>

          {/* International Recruiting Rules */}
          <section className="mx-auto max-w-7xl px-6 lg:px-8 py-16">
            <h2 className="text-3xl font-black text-white mb-8 bg-gradient-to-r from-[#1E90FF] to-[#4169E1] text-transparent bg-clip-text">
              International Recruiting: What You Need to Know
            </h2>
            <Card className="bg-[#0d1a3a] rounded-2xl border border-blue-700/50 shadow-lg p-6">
              <CardContent className="text-blue-300">
                <p className="mb-4">Recruiting international student-athletes involves additional considerations and rules compared to domestic recruiting. It's crucial to understand these nuances to ensure compliance and a smooth transition for the athlete.</p>
                <ul className="list-disc list-inside space-y-2">
                  <li><span className="font-bold text-[#00FFFF]">Eligibility Center:</span> International students must register with the NCAA Eligibility Center and submit academic documents, including transcripts and exam results, for evaluation.</li>
                  <li><span className="font-bold text-[#00FFFF]">Amateurism:</span> Strict amateurism rules apply. Participation in professional leagues or receiving payment beyond actual expenses can jeopardize eligibility.</li>
                  <li><span className="font-bold text-[#00FFFF]">National Governing Bodies:</span> Understanding the rules and regulations of international sport federations and national governing bodies is essential.</li>
                  <li><span className="font-bold text-[#00FFFF]">Visas & Immigration:</span> Obtaining the correct student visa (F-1) is a critical step. Colleges often assist with this process.</li>
                  <li><span className="font-bold text-[#00FFFF]">Language Proficiency:</span> English language proficiency tests (e.g., TOEFL, IELTS) are often required for admission to U.S. universities.</li>
                  <li><span className="font-bold text-[#00FFFF]">Age Limits:</span> Be aware of age limits for competition, which can vary by sport and division.</li>
                </ul>
                <p className="mt-4">AthlynX provides resources to help international athletes and coaches navigate these complex requirements, ensuring a fair and compliant recruiting process.</p>
              </CardContent>
            </Card>
          </section>

          {/* JUCO and Transfer Recruiting Differences */}
          <section className="mx-auto max-w-7xl px-6 lg:px-8 py-16">
            <h2 className="text-3xl font-black text-white mb-8 bg-gradient-to-r from-[#1E90FF] to-[#4169E1] text-transparent bg-clip-text">
              JUCO & Transfer Recruiting: Key Distinctions
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-[#0d1a3a] rounded-2xl border border-blue-700/50 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-[#00FFFF]">Junior College (JUCO) Transfers</CardTitle>
                </CardHeader>
                <CardContent className="text-blue-300">
                  <p>Recruiting from junior colleges offers a different pathway to NCAA eligibility. JUCO athletes often bring more experience and can fill immediate roster needs.</p>
                  <ul className="list-disc list-inside mt-4 space-y-1">
                    <li><span className="font-bold text-[#00FFFF]">Eligibility:</span> Requirements vary based on academic performance at JUCO and whether they are a qualifier or non-qualifier out of high school.</li>
                    <li><span className="font-bold text-[#00FFFF]">Credit Hours:</span> Must complete a certain number of transferable credit hours with a minimum GPA.</li>
                    <li><span className="font-bold text-[#00FFFF]">Residency:</span> Often requires a year or two of residency at the JUCO before transferring.</li>
                    <li><span className="font-bold text-[#00FFFF]">Recruiting Calendar:</span> May have different contact and evaluation periods.</li>
                  </ul>
                </CardContent>
              </Card>
              <Card className="bg-[#0d1a3a] rounded-2xl border border-blue-700/50 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-[#00FFFF]">Four-Year College Transfers</CardTitle>
                </CardHeader>
                <CardContent className="text-blue-300">
                  <p>The transfer portal has significantly changed recruiting for athletes moving between four-year institutions. Rules regarding immediate eligibility and contact are key.</p>
                  <ul className="list-disc list-inside mt-4 space-y-1">
                    <li><span className="font-bold text-[#00FFFF]">Transfer Portal:</span> Athletes must enter the NCAA Transfer Portal to be contacted by other institutions.</li>
                    <li><span className="font-bold text-[#00FFFF]">One-Time Transfer Exception:</span> Allows for immediate eligibility at the new institution for a first-time transfer, with certain conditions.</li>
                    <li><span className="font-bold text-[#00FFFF]">Academic Progress:</span> Must be in good academic standing at the previous institution.</li>
                    <li><span className="font-bold text-[#00FFFF]">Contact:</span> Coaches can contact athletes once they are in the transfer portal.</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Footer */}
          <footer className="mx-auto max-w-7xl px-6 lg:px-8 py-8 text-center text-blue-300 text-sm">
            <p>Copyright © 2026 Chad A. Dozier Sr. / AthlynXAI. All rights reserved.</p>
          </footer>
        </div>
        <MobileBottomNav />
      </DashboardLayout>
    </RouteErrorBoundary>
  );
};

export default ScoutWizard;
