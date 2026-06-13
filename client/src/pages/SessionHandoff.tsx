import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Copy, CheckCircle2 } from "lucide-react";
import { useState } from "react";

export default function SessionHandoff() {
  const [copied, setCopied] = useState(false);

  const handoffContent = `<project_instructions>
Build 1 Session 1 handoff for AthlynX “The Athlete’s Playbook” — June 11, 2026. This session completed the full Google Drive archive of the AthlynX platform (Firebase/Supabase auth files, all 49 handoff reports from Apr–Jun 2026, 764MB full codebase snapshot, scripts, platform docs, and read-only legacy repos) and locked the updated AGENTS.md doctrine: only AthlynXAI/Athlynx-V2-Official main branch, only the AthlynxChad account, all other repos archived. Authentication is currently broken on athlynx.ai (Firebase wrapper over Supabase OAuth silently failing on /signin) and the decision is locked: rip out Firebase + Supabase auth entirely and replace with Okta-only (athlynx.okta.com, $240/mo paid). Next session resumes at Step 2 — delete the archived auth files from the repo, then proceed straight through Okta token creation, OIDC SPA app setup, okta.ts implementation, Vercel env vars, and push to main with commit hash + Vercel deployment ID returned when READY. Secondary task: fix broken SCREENS images IMG_7115, IMG_7116, IMG_7119 after Okta is live. Blocker: Chad must create a new Okta API token at athlynx.okta.com → Security → API → Tokens (previous token rejected).

Session 1 Extension:
- All 6 hackathons are now officially submitted and verified on Devpost (Build with Gemini XPRIZE, FIND EVIL!, UiPath AgentHack, Splunk Agentic Ops, Google Cloud Rapid Agent, Global AI Hackathon with Qwen Cloud).
- The Devpost feedback survey for the Gemini XPRIZE was completed and submitted.
- The AGENTS.md doctrine was strictly enforced: All pushes MUST go to AthlynXAI/Athlynx-V2-Official on main branch using the AthlynxChad (chaddozier75@gmail.com) account. The Vercel team 'chad-a-doziers-projects' auto-deploys. NEVER push to archived repos or bot accounts.
</project_instructions>`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(handoffContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-black text-white selection:bg-blue-500/30">
      <Navbar />
      
      <main className="container mx-auto px-4 pt-32 pb-24 max-w-4xl">
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4 text-white">
            Session <span className="text-blue-500">Handoff</span>
          </h1>
          <p className="text-xl text-zinc-400 font-light">
            Copy the block below to start the next session with full context and locked doctrine.
          </p>
        </div>

        <Card className="bg-zinc-900/50 border-zinc-800 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 border-b border-zinc-800">
            <div>
              <CardTitle className="text-xl font-bold text-white">Build 1 Session 1 Handoff</CardTitle>
              <CardDescription className="text-zinc-400 mt-1">June 11-13, 2026</CardDescription>
            </div>
            <Button 
              onClick={copyToClipboard}
              variant="outline"
              className="bg-blue-600 hover:bg-blue-700 text-white border-0 transition-all duration-300 flex items-center gap-2"
            >
              {copied ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copy Handoff</span>
                </>
              )}
            </Button>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="bg-black rounded-lg p-6 font-mono text-sm text-zinc-300 leading-relaxed overflow-x-auto border border-zinc-800 shadow-inner">
              <pre className="whitespace-pre-wrap break-words">{handoffContent}</pre>
            </div>
          </CardContent>
        </Card>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-zinc-900/30 border-zinc-800">
            <CardHeader>
              <CardTitle className="text-lg text-white">Next Session Goals</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 text-zinc-400">
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 font-bold">1.</span>
                  Delete archived Firebase/Supabase auth files from repo
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 font-bold">2.</span>
                  Complete Okta token creation & OIDC SPA app setup
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 font-bold">3.</span>
                  Implement okta.ts and Vercel env vars
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 font-bold">4.</span>
                  Fix broken SCREENS images (IMG_7115, IMG_7116, IMG_7119)
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-zinc-900/30 border-zinc-800">
            <CardHeader>
              <CardTitle className="text-lg text-white">Locked Doctrine</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 text-zinc-400">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                  <span>Push ONLY to <strong>AthlynXAI/Athlynx-V2-Official</strong> (main)</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                  <span>Use ONLY <strong>AthlynxChad</strong> (chaddozier75@gmail.com)</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                  <span>Vercel team <strong>chad-a-doziers-projects</strong> auto-deploys</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
