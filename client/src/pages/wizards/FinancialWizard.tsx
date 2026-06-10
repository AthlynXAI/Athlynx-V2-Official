import DashboardLayout from "@/components/DashboardLayout";
import MobileBottomNav from "@/components/MobileBottomNav";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Link } from "wouter";
import { useState, useEffect } from "react";
import { DollarSign, Lightbulb, TrendingUp, Wallet, Banknote, ShieldCheck, MessageSquareText, Calculator, Clock, Handshake, PiggyBank, Briefcase, GraduationCap, HeartHandshake, LineChart, BarChart2, Trophy } from "lucide-react";

// Mock trpc for AI chat interface - in a real app, this would be imported from "@/lib/trpc"
const trpc = {
  ai: {
    wizardAdvice: {
      useMutation: () => {
        const [isLoading, setIsLoading] = useState(false);
        const [data, setData] = useState<string | null>(null);
        const mutate = (variables: { wizardType: string; prompt: string }) => {
          setIsLoading(true);
          // Simulate API call with a more detailed response
          setTimeout(() => {
            let advice = `AI Financial Wizard says: Based on your prompt "${variables.prompt}", here is some general advice.`;
            if (variables.prompt.toLowerCase().includes("budget")) {
              advice += ` Creating a budget is crucial. Start by tracking all your income and expenses for a month. Categorize them into fixed (rent, subscriptions) and variable (food, entertainment). Then, allocate specific amounts to each category. Remember to set aside a portion for savings and investments first.`;
            } else if (variables.prompt.toLowerCase().includes("invest")) {
              advice += ` For athletes, starting early with investments like low-cost index funds or ETFs in a Roth IRA can be highly beneficial due to compound interest. Understand your risk tolerance and diversify your portfolio. Avoid putting all your eggs in one basket, especially in speculative assets.`;
            } else if (variables.prompt.toLowerCase().includes("tax")) {
              advice += ` NIL income is taxable, and you'll likely receive a 1099-NEC form. It's considered self-employment income, meaning you're responsible for both employer and employee portions of FICA taxes. Keep meticulous records of all income and business-related expenses. Consider setting aside 25-35% of your NIL income for taxes and making quarterly estimated tax payments to avoid penalties. Consulting a tax professional specializing in athlete finances is highly recommended.`;
            } else if (variables.prompt.toLowerCase().includes("credit")) {
              advice += ` Building good credit is vital for future financial opportunities like buying a car or home. Start with a secured credit card or become an authorized user on a trusted family member's card. Always pay your bills on time and keep your credit utilization low (below 30%). Regularly check your credit report for errors.`;
            } else {
              advice += ` For personalized advice, please consult a financial expert.`;
            }
            setData(advice);
            setIsLoading(false);
          }, 1500);
        };
        return { mutate, isLoading, data };
      },
    },
  },
};

interface FinancialWizardProps {}

const FinancialWizard: React.FC<FinancialWizardProps> = () => {
  const [chatInput, setChatInput] = useState("");
  const [chatHistory, setChatHistory] = useState<Array<{ type: 'user' | 'ai'; message: string }>>([]);
  const { mutate: getWizardAdvice, isLoading: isAiThinking, data: aiResponse } = trpc.ai.wizardAdvice.useMutation();

  useEffect(() => {
    if (aiResponse) {
      setChatHistory((prev) => [...prev, { type: 'ai', message: aiResponse }]);
    }
  }, [aiResponse]);

  const handleChatSubmit = () => {
    if (chatInput.trim() === "") return;
    setChatHistory((prev) => [...prev, { type: 'user', message: chatInput }]);
    getWizardAdvice({ wizardType: 'financial', prompt: chatInput });
    setChatInput("");
  };

  const [emergencyFundGoalMonths, setEmergencyFundGoalMonths] = useState(6);
  const [monthlyExpenses, setMonthlyExpenses] = useState(2000);
  const [currentSavings, setCurrentSavings] = useState(5000);

  const calculatedEmergencyFundGoal = monthlyExpenses * emergencyFundGoalMonths;
  const monthsCovered = currentSavings / monthlyExpenses;
  const progress = (currentSavings / calculatedEmergencyFundGoal) * 100;

  const savingsMilestones = [
    { amount: 10000, label: "First $10K" },
    { amount: 50000, label: "$50K Mark" },
    { amount: 100000, label: "Six-Figure Savings" },
    { amount: 250000, label: "Quarter Million" },
    { amount: 500000, label: "Half Million" },
    { amount: 1000000, label: "Millionaire Status" },
  ];

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-[#050c1a] text-white p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#1E90FF] to-[#4169E1] p-6 rounded-lg shadow-lg mb-8">
            <h1 className="text-4xl font-black text-white mb-2">Financial Wizard <DollarSign className="inline-block ml-2" size={36} /></h1>
            <p className="text-blue-100 text-lg">Your AI-powered guide to financial success as an athlete. Master your money, secure your future.</p>
          </div>

          {/* Hero Section - Quick Prompts */}
          <section className="mb-12">
            <h2 className="text-3xl font-black text-white mb-6 flex items-center"><Lightbulb className="mr-3 text-[#00FFFF]" size={30} />Quick Prompts for Financial Guidance</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-[#0d1a3a] rounded-2xl border border-blue-700/50 hover:border-[#00FFFF] transition-all duration-300 transform hover:-translate-y-1">
                <CardContent className="p-6">
                  <h3 className="font-bold text-blue-300 mb-2">NIL Income Budgeting</h3>
                  <p className="text-blue-200 text-sm mb-4">How can I effectively budget my Name, Image, Likeness (NIL) income to maximize savings and manage expenses?</p>
                  <Button variant="outline" className="w-full bg-transparent border-blue-500 text-blue-300 hover:bg-blue-900/30" onClick={() => setChatInput("Give me a detailed budget plan for my fluctuating NIL income, considering both fixed and variable expenses.")}>Ask AI</Button>
                </CardContent>
              </Card>
              <Card className="bg-[#0d1a3a] rounded-2xl border border-blue-700/50 hover:border-[#00FFFF] transition-all duration-300 transform hover:-translate-y-1">
                <CardContent className="p-6">
                  <h3 className="font-bold text-blue-300 mb-2">Investment Basics for Athletes</h3>
                  <p className="text-blue-200 text-sm mb-4">What are the best first steps for an athlete to start investing, focusing on long-term growth and minimizing risk?</p>
                  <Button variant="outline" className="w-full bg-transparent border-blue-500 text-blue-300 hover:bg-blue-900/30" onClick={() => setChatInput("Explain investment basics for athletes, including recommended low-risk options and how to start a Roth IRA.")}>Ask AI</Button>
                </CardContent>
              </Card>
              <Card className="bg-[#0d1a3a] rounded-2xl border border-blue-700/50 hover:border-[#00FFFF] transition-all duration-300 transform hover:-translate-y-1">
                <CardContent className="p-6">
                  <h3 className="font-bold text-blue-300 mb-2">NIL Tax Planning & Obligations</h3>
                  <p className="text-blue-200 text-sm mb-4">What are my specific tax obligations for NIL income and athletic scholarships, and how can I plan effectively?</p>
                  <Button variant="outline" className="w-full bg-transparent border-blue-500 text-blue-300 hover:bg-blue-900/30" onClick={() => setChatInput("Summarize NIL tax obligations, including self-employment taxes and quarterly payments, and advise on record-keeping.")}>Ask AI</Button>
                </CardContent>
              </Card>
              <Card className="bg-[#0d1a3a] rounded-2xl border border-blue-700/50 hover:border-[#00FFFF] transition-all duration-300 transform hover:-translate-y-1">
                <CardContent className="p-6">
                  <h3 className="font-bold text-blue-300 mb-2">Building & Maintaining Credit</h3>
                  <p className="text-blue-200 text-sm mb-4">How can I build and maintain good credit as a young athlete to ensure future financial stability?</p>
                  <Button variant="outline" className="w-full bg-transparent border-blue-500 text-blue-300 hover:bg-blue-900/30" onClick={() => setChatInput("Provide tips for building good credit from scratch and maintaining a high credit score.")}>Ask AI</Button>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* AI Chat Interface */}
          <section className="mb-12">
            <h2 className="text-3xl font-black text-white mb-6 flex items-center"><MessageSquareText className="mr-3 text-[#00FFFF]" size={30} />AI Financial Advisor Chat</h2>
            <Card className="bg-[#0d1a3a] rounded-2xl border border-blue-700/50">
              <CardContent className="p-6">
                <ScrollArea className="h-96 w-full rounded-md border border-blue-700/50 p-4 mb-4 bg-[#050c1a]">
                  {chatHistory.length === 0 && (
                    <p className="text-blue-400 text-center italic">Ask me anything about athlete finance! Try one of the quick prompts above.</p>
                  )}
                  {chatHistory.map((msg, index) => (
                    <div key={index} className={`mb-3 flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <span className={`inline-block p-3 rounded-lg max-w-[70%] ${msg.type === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-white'}`}>
                        {msg.message}
                      </span>
                    </div>
                  ))}
                  {isAiThinking && (
                    <div className="flex justify-start">
                      <span className="inline-block p-3 rounded-lg bg-gray-700 text-white animate-pulse">AI is thinking...</span>
                    </div>
                  )}
                </ScrollArea>
                <div className="flex space-x-2">
                  <Textarea
                    placeholder="Ask your financial question..."
                    className="flex-1 bg-[#050c1a] border-blue-700/50 text-white placeholder:text-blue-400 focus:ring-2 focus:ring-[#00FFFF]"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleChatSubmit();
                      }
                    }}
                  />
                  <Button onClick={handleChatSubmit} disabled={isAiThinking} className="bg-[#1E90FF] hover:bg-[#00FFFF] text-white font-bold transition-colors duration-300">
                    Send
                  </Button>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Financial Education Cards */}
          <section className="mb-12">
            <h2 className="text-3xl font-black text-white mb-6 flex items-center"><TrendingUp className="mr-3 text-[#00FFFF]" size={30} />Essential Financial Education for Athletes</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="bg-[#0d1a3a] rounded-2xl border border-blue-700/50 p-6">
                <CardHeader className="p-0 mb-4">
                  <CardTitle className="font-bold text-blue-300 flex items-center"><Wallet className="mr-2 text-[#00FFFF]" />The 50/30/20 Rule for Athletes</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <p className="text-blue-200 text-sm mb-3">A simple budgeting guideline: allocate 50% of your after-tax income to Needs, 30% to Wants, and 20% to Savings & Debt Repayment. For athletes with variable NIL income, it's crucial to average your income over a few months or use a conservative estimate for your 'Needs' budget.</p>
                  <ul className="list-disc list-inside text-blue-200 text-sm space-y-1">
                    <li><span className="font-semibold text-blue-300">Needs:</span> Rent, utilities, groceries, transportation, insurance, essential training costs.</li>
                    <li><span className="font-semibold text-blue-300">Wants:</span> Entertainment, dining out, new gadgets, luxury items, non-essential travel.</li>
                    <li><span className="font-semibold text-blue-300">Savings & Debt:</span> Emergency fund, retirement accounts (Roth IRA), student loan payments, credit card debt.</li>
                  </ul>
                  <p className="text-blue-400 text-xs mt-3">Adapt this rule to your unique financial situation and income fluctuations. Prioritize building an emergency fund first.</p>
                </CardContent>
              </Card>
              <Card className="bg-[#0d1a3a] rounded-2xl border border-blue-700/50 p-6">
                <CardHeader className="p-0 mb-4">
                  <CardTitle className="font-bold text-blue-300 flex items-center"><Banknote className="mr-2 text-[#00FFFF]" />NIL Tax Obligations & Planning</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <p className="text-blue-200 text-sm mb-3">Understanding your tax responsibilities for Name, Image, and Likeness (NIL) income is paramount. NIL earnings are generally considered self-employment income by the IRS.</p>
                  <ul className="list-disc list-inside text-blue-200 text-sm space-y-1">
                    <li><span className="font-semibold text-blue-300">Self-Employment Tax:</span> You are responsible for both the employer and employee portions of Social Security and Medicare taxes (FICA).</li>
                    <li><span className="font-semibold text-blue-300">Estimated Taxes:</span> If you expect to owe at least $1,000 in taxes, you'll likely need to pay estimated taxes quarterly (April 15, June 15, Sept 15, Jan 15 of next year).</li>
                    <li><span className="font-semibold text-blue-300">Record Keeping:</span> Maintain meticulous records of all NIL income and business expenses (agent fees, travel for endorsements, equipment, etc.) to maximize deductions.</li>
                    <li><span className="font-semibold text-blue-300">Professional Advice:</span> Always consult a tax professional specializing in athlete finances to ensure compliance and optimize your tax strategy.</li>
                  </ul>
                  <p className="text-blue-400 text-xs mt-3">Failure to pay estimated taxes or keep proper records can result in penalties.</p>
                </CardContent>
              </Card>
              <Card className="bg-[#0d1a3a] rounded-2xl border border-blue-700/50 p-6">
                <CardHeader className="p-0 mb-4">
                  <CardTitle className="font-bold text-blue-300 flex items-center"><LineChart className="mr-2 text-[#00FFFF]" />Investment Basics: Index Funds & Roth IRA</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <p className="text-blue-200 text-sm mb-3">Starting to invest early is one of the most powerful financial moves you can make. Focus on simplicity, diversification, and long-term growth.</p>
                  <ul className="list-disc list-inside text-blue-200 text-sm space-y-1">
                    <li><span className="font-semibold text-blue-300">Index Funds/ETFs:</span> These are passively managed funds that track a market index (like the S&P 500). They offer broad diversification, low fees, and historically strong returns. Ideal for beginners.</li>
                    <li><span className="font-semibold text-blue-300">Roth IRA:</span> A retirement account where you contribute after-tax dollars, and qualified withdrawals in retirement are tax-free. Excellent for young athletes who expect to be in a higher tax bracket later in their careers.</li>
                    <li><span className="font-semibold text-blue-300">Compound Interest:</span> The magic of investing. Your earnings generate their own earnings, leading to exponential growth over time. The earlier you start, the more time compound interest has to work.</li>
                    <li><span className="font-semibold text-blue-300">Diversification:</span> Don't put all your money into one stock or asset. Spread your investments across different companies, industries, and asset classes to reduce risk.</li>
                  </ul>
                  <p className="text-blue-400 text-xs mt-3">Consistency is key. Even small, regular contributions can grow significantly over decades.</p>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* AthlynX Commission Breakdown */}
          <section className="mb-12">
            <h2 className="text-3xl font-black text-white mb-6 flex items-center"><Handshake className="mr-3 text-[#00FFFF]" size={30} />AthlynX Commission Breakdown: Value Proposition</h2>
            <Card className="bg-[#0d1a3a] rounded-2xl border border-blue-700/50 p-6">
              <CardContent className="p-0">
                <p className="text-blue-200 mb-4">AthlynX operates on a transparent, performance-based commission model, ensuring our success is directly tied to yours. We take a <span className="text-[#00FFFF] font-bold">10% commission</span> on all Name, Image, Likeness (NIL) deals successfully facilitated and closed directly through the AthlynX platform.</p>
                <p className="text-blue-200 mb-4">This commission is an investment in your career, covering a comprehensive suite of services designed to maximize your earning potential and protect your interests:</p>
                <ul className="list-disc list-inside text-blue-200 space-y-2 mb-4 ml-4">
                  <li><span className="font-bold text-blue-300">Deal Sourcing & Negotiation:</span> Our dedicated team actively identifies, vets, and connects you with top-tier brands and lucrative NIL opportunities. We handle all negotiations to secure the best possible terms, ensuring you receive fair market value for your brand.</li>
                  <li><span className="font-bold text-blue-300">Legal & Compliance Assurance:</span> We provide expert guidance to ensure all contracts are legally sound, fully compliant with NCAA regulations, state laws, and institutional policies. We protect you from predatory agreements and ensure your long-term financial well-being.</li>
                  <li><span className="font-bold text-blue-300">Streamlined Financial Management:</span> From invoicing to payment collection and distribution, we manage the entire financial workflow. You get clear, concise statements and timely payments, allowing you to focus on your sport and studies.</li>
                  <li><span className="font-bold text-blue-300">Personal Brand Building & Marketing:</span> We work with you to develop and enhance your personal brand, creating compelling narratives and marketing materials that increase your marketability and attract more opportunities.</li>
                  <li><span className="font-bold text-blue-300">Exclusive Platform Access:</span> Your commission grants you continued, premium access to the AthlynXAI OS platform, including advanced AI-powered tools, personalized financial education modules, networking opportunities, and dedicated support.</li>
                  <li><span className="font-bold text-blue-300">Post-Deal Support:</span> We don't just close deals; we ensure successful execution, manage relationships, and provide ongoing advice for future opportunities.</li>
                </ul>
                <p className="text-blue-200 mt-4">We believe this comprehensive model provides unparalleled value, allowing you to focus on your athletic and academic pursuits with peace of mind, knowing your financial future is being expertly managed and maximized.</p>
              </CardContent>
            </Card>
          </section>

          {/* Savings Milestones Tracker */}
          <section className="mb-12">
            <h2 className="text-3xl font-black text-white mb-6 flex items-center"><Trophy className="mr-3 text-[#00FFFF]" size={30} />Savings Milestones Tracker</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
              {savingsMilestones.map((milestone, index) => (
                <Card key={index} className="bg-[#0d1a3a] rounded-2xl border border-blue-700/50 p-4 flex flex-col justify-between">
                  <CardHeader className="p-0 mb-2">
                    <CardTitle className="font-bold text-blue-300 text-lg">{milestone.label}</CardTitle>
                  </CardHeader>
                  <CardContent className="p-0 flex-grow">
                    <p className="text-blue-200 text-sm mb-2">Target: <span className="font-semibold text-[#00FFFF]">${milestone.amount.toLocaleString()}</span></p>
                    <Progress value={Math.min(100, (currentSavings / milestone.amount) * 100)} className="w-full h-2 mb-2 bg-blue-900" />
                    <p className="text-blue-400 text-xs">Current: <span className="font-semibold">${currentSavings.toLocaleString()}</span></p>
                  </CardContent>
                  <div className="mt-3 text-right">
                    {currentSavings >= milestone.amount ? 
                      <span className="text-green-400 font-bold text-sm flex items-center justify-end"><ShieldCheck className="mr-1" size={16} /> Achieved!</span> : 
                      <span className="text-blue-400 text-sm">{(milestone.amount - currentSavings).toLocaleString()} left</span>
                    }
                  </div>
                </Card>
              ))}
            </div>
            <div className="mt-8 p-6 bg-[#0d1a3a] rounded-2xl border border-blue-700/50">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="currentSavingsInput" className="text-blue-300 text-lg mb-2 block">Update Your Current Savings:</Label>
                  <Input
                    id="currentSavingsInput"
                    type="number"
                    value={currentSavings}
                    onChange={(e) => setCurrentSavings(parseFloat(e.target.value) || 0)}
                    className="mt-2 bg-[#050c1a] border-blue-700/50 text-white placeholder:text-blue-400 focus:ring-2 focus:ring-[#00FFFF]"
                    placeholder="Enter current savings amount"
                  />
                </div>
                <div className="flex items-center justify-center">
                  <p className="text-blue-100 text-lg">Total Saved: <span className="font-black text-[#00FFFF]">${currentSavings.toLocaleString()}</span></p>
                </div>
              </div>
            </div>
          </section>

          {/* Emergency Fund Calculator */}
          <section className="mb-12">
            <h2 className="text-3xl font-black text-white mb-6 flex items-center"><Calculator className="mr-3 text-[#00FFFF]" size={30} />Emergency Fund Calculator</h2>
            <Card className="bg-[#0d1a3a] rounded-2xl border border-blue-700/50 p-6">
              <CardContent className="p-0">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <div>
                    <Label htmlFor="monthlyExpensesInput" className="text-blue-300 mb-2 block">Estimated Monthly Expenses ($):</Label>
                    <Input
                      id="monthlyExpensesInput"
                      type="number"
                      value={monthlyExpenses}
                      onChange={(e) => setMonthlyExpenses(parseFloat(e.target.value) || 0)}
                      className="mt-2 bg-[#050c1a] border-blue-700/50 text-white placeholder:text-blue-400 focus:ring-2 focus:ring-[#00FFFF]"
                      placeholder="e.g., 2000"
                    />
                  </div>
                  <div>
                    <Label htmlFor="emergencyFundGoalMonthsInput" className="text-blue-300 mb-2 block">Desired Months of Coverage:</Label>
                    <Input
                      id="emergencyFundGoalMonthsInput"
                      type="number"
                      value={emergencyFundGoalMonths}
                      onChange={(e) => setEmergencyFundGoalMonths(parseFloat(e.target.value) || 0)}
                      className="mt-2 bg-[#050c1a] border-blue-700/50 text-white placeholder:text-blue-400 focus:ring-2 focus:ring-[#00FFFF]"
                      placeholder="e.g., 6"
                    />
                  </div>
                  <div className="flex flex-col justify-end">
                    <p className="text-blue-100 text-lg">Target Fund: <span className="font-black text-[#00FFFF]">${calculatedEmergencyFundGoal.toLocaleString()}</span></p>
                  </div>
                </div>
                <Separator className="my-6 bg-blue-700/50" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                  <div>
                    <p className="text-blue-200 mb-2">You currently have <span className="font-bold text-[#00FFFF]">${currentSavings.toLocaleString()}</span> in your emergency fund.</p>
                    <p className="text-blue-200">This covers approximately <span className="font-bold text-[#00FFFF]">{monthsCovered.toFixed(1)}</span> months of your estimated expenses.</p>
                  </div>
                  <div>
                    <Progress value={progress} className="w-full h-3 bg-blue-900" />
                    <p className="text-blue-400 text-sm mt-2">
                      {progress >= 100 ? 
                        <span className="text-green-400 font-bold flex items-center"><ShieldCheck className="mr-1" size={16} /> Emergency fund goal achieved!</span> : 
                        `Progress: ${progress.toFixed(1)}% (${(calculatedEmergencyFundGoal - currentSavings).toLocaleString()} left)`
                      }
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Investment Timeline */}
          <section className="mb-12">
            <h2 className="text-3xl font-black text-white mb-6 flex items-center"><Clock className="mr-3 text-[#00FFFF]" size={30} />Investment Timeline: College to Retirement</h2>
            <Card className="bg-[#0d1a3a] rounded-2xl border border-blue-700/50 p-6">
              <CardContent className="p-0">
                <div className="relative pl-6">
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-700 rounded-full"></div>
                  
                  <div className="mb-10 relative">
                    <div className="absolute -left-3 top-0 w-3 h-3 bg-[#00FFFF] rounded-full z-10"></div>
                    <h3 className="font-bold text-blue-300 mb-1 text-xl flex items-center"><GraduationCap className="mr-2" />College Years (Ages 18-22)</h3>
                    <p className="text-blue-200 text-base">This is a foundational period. Focus on establishing good financial habits. Prioritize building a robust emergency fund (3-6 months of living expenses). Understand and manage your NIL income, setting aside funds for taxes. Begin investing small, consistent amounts into low-cost, diversified index funds or ETFs within a Roth IRA. Avoid high-risk speculative investments and focus on learning the basics of personal finance.</p>
                    <ul className="list-disc list-inside text-blue-200 text-sm mt-2 ml-4">
                      <li><span className="font-semibold text-blue-300">Key Actions:</span> Emergency fund, NIL tax planning, Roth IRA contributions, basic budgeting.</li>
                      <li><span className="font-semibold text-blue-300">Goal:</span> Financial literacy and establishing a solid base.</li>
                    </ul>
                  </div>

                  <div className="mb-10 relative">
                    <div className="absolute -left-3 top-0 w-3 h-3 bg-[#00FFFF] rounded-full z-10"></div>
                    <h3 className="font-bold text-blue-300 mb-1 text-xl flex items-center"><Briefcase className="mr-2" />Early Career & Professional Play (Ages 23-30)</h3>
                    <p className="text-blue-200 text-base">As your income potentially increases, accelerate your savings and investment contributions. Maximize contributions to tax-advantaged accounts like a Roth IRA or a 401(k) if offered by a professional team. Explore diversifying your portfolio beyond just index funds into broader market ETFs or even carefully selected individual stocks if you have the knowledge and time. Consider purchasing your first home or other appreciating assets. Continue to educate yourself on advanced investment strategies.</p>
                    <ul className="list-disc list-inside text-blue-200 text-sm mt-2 ml-4">
                      <li><span className="font-semibold text-blue-300">Key Actions:</span> Maximize retirement contributions, portfolio diversification, consider real estate.</li>
                      <li><span className="font-semibold text-blue-300">Goal:</span> Aggressive wealth accumulation and asset building.</li>
                    </ul>
                  </div>

                  <div className="mb-10 relative">
                    <div className="absolute -left-3 top-0 w-3 h-3 bg-[#00FFFF] rounded-full z-10"></div>
                    <h3 className="font-bold text-blue-300 mb-1 text-xl flex items-center"><HeartHandshake className="mr-2" />Mid-Career & Transition (Ages 31-50)</h3>
                    <p className="text-blue-200 text-base">This phase often involves significant life events and potential career transitions (e.g., post-playing career). Continue aggressive saving and investing. Review and rebalance your portfolio regularly to align with your risk tolerance and changing goals. Consider estate planning, setting up trusts, and planning for children's education. If transitioning from professional sports, strategize how to leverage your existing capital and skills into new ventures or careers. Focus on preserving wealth while still growing it.</p>
                    <ul className="list-disc list-inside text-blue-200 text-sm mt-2 ml-4">
                      <li><span className="font-semibold text-blue-300">Key Actions:</span> Estate planning, education savings, wealth preservation, career transition financial strategy.</li>
                      <li><span className="font-semibold text-blue-300">Goal:</span> Wealth preservation, strategic growth, and planning for the next chapter.</li>
                    </ul>
                  </div>

                  <div className="mb-10 relative">
                    <div className="absolute -left-3 top-0 w-3 h-3 bg-[#00FFFF] rounded-full z-10"></div>
                    <h3 className="font-bold text-blue-300 mb-1 text-xl flex items-center"><PiggyBank className="mr-2" />Late Career & Pre-Retirement (Ages 51-65)</h3>
                    <p className="text-blue-200 text-base">Shift your investment strategy towards more conservative assets to protect the capital you've accumulated. Maximize catch-up contributions to retirement accounts. Begin to understand withdrawal strategies for retirement income. Review your healthcare and long-term care insurance needs. This is the time to fine-tune your retirement plan and ensure all pieces are in place for a comfortable future.</p>
                    <ul className="list-disc list-inside text-blue-200 text-sm mt-2 ml-4">
                      <li><span className="font-semibold text-blue-300">Key Actions:</span> Conservative investments, maximize catch-up contributions, retirement income planning.</li>
                      <li><span className="font-semibold text-blue-300">Goal:</span> Secure retirement and wealth protection.</li>
                    </ul>
                  </div>

                  <div className="relative">
                    <div className="absolute -left-3 top-0 w-3 h-3 bg-[#00FFFF] rounded-full z-10"></div>
                    <h3 className="font-bold text-blue-300 mb-1 text-xl flex items-center"><ShieldCheck className="mr-2" />Retirement (Age 65+)</h3>
                    <p className="text-blue-200 text-base">Enjoy the fruits of your disciplined financial planning. Implement your withdrawal strategy, focusing on tax efficiency. Continue to monitor your investments, though with a very conservative approach. Ensure your estate plan is up-to-date. This phase is about living comfortably and confidently on the wealth you've built.</p>
                    <ul className="list-disc list-inside text-blue-200 text-sm mt-2 ml-4">
                      <li><span className="font-semibold text-blue-300">Key Actions:</span> Strategic withdrawals, estate plan review, continued conservative investing.</li>
                      <li><span className="font-semibold text-blue-300">Goal:</span> Sustainable income and legacy planning.</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Copyright */}
          <footer className="text-center text-blue-300 text-sm mt-12 pt-8 border-t border-blue-700/50">
            <p>Copyright © 2026 Chad A. Dozier Sr. / AthlynXAI. All rights reserved.</p>
          </footer>
        </div>
      </div>
      <MobileBottomNav />
    </DashboardLayout>
  );
};

export default FinancialWizard;
