import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import DashboardLayout from "@/components/DashboardLayout";
import { trpc } from "@/lib/trpc";

const STEPS = [
  { id: 1, title: "Your Sport & Level", emoji: "" },
  { id: 2, title: "Career Goals", emoji: "" },
  { id: 3, title: "Timeline", emoji: "" },
  { id: 4, title: "Your Playbook", emoji: "" },
];

const GOALS = [
  "Play Division I", "Go Pro / Draft", "Earn Full Scholarship", "Transfer to Better Program",
  "Compete Internationally", "Become a Coach", "NIL Brand Deals", "Graduate Debt-Free",
];

const SPORTS = ["Football", "Basketball", "Baseball", "Soccer", "Track & Field", "Swimming", "Wrestling", "Volleyball", "Golf", "Hockey"];
const LEVELS = ["High School", "JUCO", "Division III", "Division II", "Division I", "Professional"];

export default function CareerWizard() {
  const [step, setStep] = useState(0);
  const [sport, setSport] = useState("");
  const [level, setLevel] = useState("");
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  const [gradYear, setGradYear] = useState("2026");
  const [done, setDone] = useState(false);
  const [aiResult, setAiResult] = useState("");

  const wizardMutation = trpc.ai.wizardAdvice.useMutation({
    onSuccess: (data) => { setAiResult(data.result ?? ""); setDone(true); },
  });

  const toggleGoal = (g: string) => {
    setSelectedGoals(prev => prev.includes(g) ? prev.filter(x => x !== g) : [...prev, g]);
  };

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto space-y-5 pb-10">
        <div className="bg-gradient-to-r from-[#1a3a8f] to-[#1a2a4a] border border-blue-700 rounded-xl p-5">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-blue-700 flex items-center justify-center text-3xl"></div>
            <div>
              <h1 className="text-2xl font-black text-white">Career Wizard</h1>
              <p className="text-blue-300 text-sm">Build your personalized athletic career playbook</p>
            </div>
          </div>
        </div>
        {!done && (
          <div className="flex items-center gap-2">
            {STEPS.map((s, i) => (
              <div key={s.id} className="flex items-center gap-2 flex-1">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${i <= step ? "bg-blue-600 text-white" : "bg-[#1a3a8f] text-blue-400"}`}>
                  {i < step ? "" : s.emoji}
                </div>
                {i < STEPS.length - 1 && <div className={`flex-1 h-0.5 ${i < step ? "bg-blue-600" : "bg-blue-900"}`} />}
              </div>
            ))}
          </div>
        )}
        {!done && step === 0 && (
          <Card className="bg-[#1a3a8f] border-blue-800">
            <CardContent className="p-5 space-y-4">
              <h2 className="text-white font-bold text-lg">What sport do you play?</h2>
              <div className="grid grid-cols-2 gap-2">
                {SPORTS.map(s => (
                  <button key={s} onClick={() => setSport(s)}
                    className={`py-2.5 px-3 rounded-xl text-sm font-semibold border transition-all ${sport === s ? "bg-blue-600 border-blue-400 text-white" : "bg-[#0d1b3e] border-blue-900 text-blue-300 hover:border-blue-600"}`}>
                    {s}
                  </button>
                ))}
              </div>
              <h2 className="text-white font-bold text-lg mt-4">Current level?</h2>
              <div className="grid grid-cols-2 gap-2">
                {LEVELS.map(l => (
                  <button key={l} onClick={() => setLevel(l)}
                    className={`py-2.5 px-3 rounded-xl text-sm font-semibold border transition-all ${level === l ? "bg-[#1E90FF] border-[#1E90FF] text-white" : "bg-[#0d1b3e] border-blue-900 text-blue-300 hover:border-blue-600"}`}>
                    {l}
                  </button>
                ))}
              </div>
              <Button onClick={() => setStep(1)} disabled={!sport || !level} className="w-full bg-blue-600 hover:bg-blue-500 mt-2">
                Next: Set Your Goals →
              </Button>
            </CardContent>
          </Card>
        )}
        {!done && step === 1 && (
          <Card className="bg-[#1a3a8f] border-blue-800">
            <CardContent className="p-5 space-y-4">
              <h2 className="text-white font-bold text-lg">Select your career goals <span className="text-blue-400 text-sm font-normal">(pick all that apply)</span></h2>
              <div className="grid grid-cols-2 gap-2">
                {GOALS.map(g => (
                  <button key={g} onClick={() => toggleGoal(g)}
                    className={`py-2.5 px-3 rounded-xl text-sm font-semibold border transition-all text-left ${selectedGoals.includes(g) ? "bg-blue-600 border-blue-400 text-white" : "bg-[#0d1b3e] border-blue-900 text-blue-300 hover:border-blue-600"}`}>
                    {selectedGoals.includes(g) ? " " : ""}{g}
                  </button>
                ))}
              </div>
              <div className="flex gap-2 mt-2">
                <Button variant="outline" onClick={() => setStep(0)} className="flex-1 border-blue-700 text-blue-300">← Back</Button>
                <Button onClick={() => setStep(2)} disabled={selectedGoals.length === 0} className="flex-1 bg-blue-600 hover:bg-blue-500">Next: Timeline →</Button>
              </div>
            </CardContent>
          </Card>
        )}
        {!done && step === 2 && (
          <Card className="bg-[#1a3a8f] border-blue-800">
            <CardContent className="p-5 space-y-4">
              <h2 className="text-white font-bold text-lg">When do you graduate / go pro?</h2>
              <div className="grid grid-cols-3 gap-2">
                {["2025", "2026", "2027", "2028", "2029", "2030"].map(y => (
                  <button key={y} onClick={() => setGradYear(y)}
                    className={`py-3 rounded-xl text-sm font-bold border transition-all ${gradYear === y ? "bg-[#1E90FF] border-[#1E90FF] text-white" : "bg-[#0d1b3e] border-blue-900 text-blue-300 hover:border-blue-600"}`}>
                    {y}
                  </button>
                ))}
              </div>
              <div className="flex gap-2 mt-2">
                <Button variant="outline" onClick={() => setStep(1)} className="flex-1 border-blue-700 text-blue-300">← Back</Button>
                <Button
                  onClick={() => {
                    const context = `Sport: ${sport}\nLevel: ${level}\nGoals: ${selectedGoals.join(", ")}\nTarget Year: ${gradYear}\n\nCreate my complete career playbook with immediate actions, 6-month milestones, and long-term goals.`;
                    wizardMutation.mutate({ wizardType: "career", context });
                  }}
                  disabled={wizardMutation.isPending}
                  className="flex-1 bg-gradient-to-r from-[#1E90FF] to-[#0a1628] text-white font-black">
                  {wizardMutation.isPending ? "Generating..." : "Generate My Playbook "}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
        {done && (
          <div className="space-y-4">
            <Card className="bg-gradient-to-r from-[#1E90FF]/40 to-blue-900 border-[#1E90FF]">
              <CardContent className="p-5">
                <div className="text-[#1E90FF] text-xs uppercase tracking-widest mb-1">Your Career Playbook</div>
                <h2 className="text-white text-2xl font-black mb-1">{sport} Athlete — {level}</h2>
                <p className="text-blue-300 text-sm">Target Year: {gradYear}</p>
                <div className="flex flex-wrap gap-2 mt-3">
                  {selectedGoals.map(g => <Badge key={g} className="bg-blue-700 text-white">{g}</Badge>)}
                </div>
              </CardContent>
            </Card>
            <Card className="bg-[#1a3a8f] border-blue-800">
              <CardContent className="p-5">
                <h3 className="text-white font-bold mb-3"> Your AI Career Playbook</h3>
                <div className="text-blue-200 text-sm whitespace-pre-wrap leading-relaxed">{aiResult}</div>
              </CardContent>
            </Card>
            <Button onClick={() => { setStep(0); setDone(false); setSport(""); setLevel(""); setSelectedGoals([]); setAiResult(""); }}
              variant="outline" className="w-full border-blue-700 text-blue-300">↺ Start Over</Button>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
