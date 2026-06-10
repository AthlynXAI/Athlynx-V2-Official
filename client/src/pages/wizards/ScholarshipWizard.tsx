import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import DashboardLayout from "@/components/DashboardLayout";
import { trpc } from "@/lib/trpc";

export default function ScholarshipWizard() {
  const [question, setQuestion] = useState("");
  const [result, setResult] = useState("");
  const [asked, setAsked] = useState(false);

  const wizardMutation = trpc.ai.wizardAdvice.useMutation({
    onSuccess: (data) => { setResult(String(data.result ?? "")); setAsked(true); },
  });

  const handleAsk = () => {
    if (!question.trim()) return;
    wizardMutation.mutate({ wizardType: "scholarship", context: question });
  };

  const QUICK_PROMPTS = ['What scholarships am I eligible for?', 'How do I write a scholarship essay?', 'What is a full-ride scholarship?', 'How do I negotiate my scholarship offer?'];

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto space-y-5 pb-10">
        <div className="bg-gradient-to-r from-[#1a3a8f] to-[#1a2a4a] border border-blue-700 rounded-xl p-5">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-blue-700 flex items-center justify-center text-3xl"></div>
            <div>
              <h1 className="text-2xl font-black text-white">Scholarship Wizard</h1>
              <p className="text-blue-300 text-sm">Find and win scholarships</p>
            </div>
          </div>
        </div>
        <Card className="bg-[#1a3a8f] border-blue-800">
          <CardContent className="p-5 space-y-4">
            <h2 className="text-white font-bold">Quick Start — Ask Anything</h2>
            <div className="flex flex-wrap gap-2">
              {QUICK_PROMPTS.map((p: string, i: number) => (
                <button key={i} onClick={() => setQuestion(p)}
                  className="px-3 py-1.5 rounded-xl text-xs font-bold bg-[#0d1b3e] border border-blue-800 text-blue-300 hover:border-blue-500 hover:text-white transition-all">
                  {p}
                </button>
              ))}
            </div>
            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Ask your question or describe your situation..."
              rows={4}
              className="w-full bg-[#0d1b3e] border border-blue-800 rounded-xl p-3 text-white text-sm placeholder-blue-600 focus:outline-none focus:border-blue-500 resize-none"
            />
            <Button
              onClick={handleAsk}
              disabled={wizardMutation.isPending || !question.trim()}
              className="w-full bg-gradient-to-r from-red-600 to-red-500 text-white font-black py-3">
              {wizardMutation.isPending ? "Getting Your Answer..." : "Get AI Advice "}
            </Button>
          </CardContent>
        </Card>
        {asked && result && (
          <Card className="bg-[#1a3a8f] border-blue-800">
            <CardContent className="p-5">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-full bg-blue-700 flex items-center justify-center text-lg"></div>
                <h3 className="text-white font-bold">AI Advice</h3>
              </div>
              <div className="text-blue-200 text-sm whitespace-pre-wrap leading-relaxed">{result}</div>
              <Button
                onClick={() => { setQuestion(""); setResult(""); setAsked(false); }}
                variant="outline"
                className="w-full mt-4 border-blue-700 text-blue-300">
                ↺ Ask Another Question
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
