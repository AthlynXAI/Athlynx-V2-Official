import { RouteErrorBoundary } from "@/components/GlobalErrorBoundary";
import { useLocation } from "wouter";
import { useState } from "react";

function SuccessInner() {
  const [location] = useLocation();
  const params = new URLSearchParams(location.split('?')[1]);
  const accessCode = params.get('code') || '';
  const position = params.get('position') ? Number(params.get('position')) : null;
  const [copied, setCopied] = useState(false);

  const shareUrl = typeof window !== 'undefined' ? `${window.location.origin}/signup` : 'https://athlynx.ai/signup';
  const shareText = position
    ? `I just joined the AthlynX waitlist at #${position}! Join me — the future of athlete success. `
    : "I just joined AthlynX \u2014 the athlete's playbook. Join me! \uD83C\uDFC6";

  function copyLink() {
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  }

  return (
    <div className="min-h-screen relative text-white overflow-x-hidden flex items-center justify-center">
      {/* Diagonal Gradient Background - Same as VIP page */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#1E90FF] via-black to-[#0a1628]" 
           style={{
             background: 'linear-gradient(135deg, #d4af37 0%, #c9a227 15%, #1a1a1a 35%, #000000 50%, #1a1a1a 65%, #0d4d4d 85%, #00CED1 100%)'
           }}>
      </div>

      {/* Diagonal wave overlay */}
      <div className="absolute inset-0 opacity-30"
           style={{
             background: 'radial-gradient(ellipse at top left, rgba(212, 175, 55, 0.3) 0%, transparent 50%), radial-gradient(ellipse at bottom right, rgba(0, 206, 209, 0.3) 0%, transparent 50%)'
           }}>
      </div>
      
      <div className="relative w-full max-w-[640px] mx-auto px-4 py-8 space-y-10">
        
        {/* Party Popper */}
        <div className="flex justify-center">
          <div className="text-9xl animate-bounce drop-shadow-2xl"></div>
        </div>

        {/* AthlynX Logo */}
        <div className="flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-[#1E90FF] blur-3xl opacity-60 animate-pulse"></div>
            <img 
              src="/athlynx-icon.png" 
              alt="AthlynX" 
              className="relative w-40 h-40 object-contain drop-shadow-2xl"
            />
          </div>
        </div>

        {/* AthlynX Text */}
        <div className="text-center">
          <h1 className="text-6xl md:text-7xl font-black tracking-tight text-[#1E90FF] drop-shadow-2xl mb-4">
            AthlynX
          </h1>
        </div>

        {/* YOU'RE IN! */}
        <div className="text-center">
          <h2 className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#1E90FF] to-blue-500 drop-shadow-lg mb-4">
            YOU'RE IN!
          </h2>
          <p className="text-xl md:text-2xl text-white font-bold">
            Welcome to the Inner Circle! Your VIP<br/>Beta access request has been received.
          </p>
        </div>

        {/* Waitlist position badge */}
        {position && (
          <div className="text-center">
            <div className="inline-flex flex-col items-center gap-2 bg-gradient-to-br from-[#1E90FF]/20 to-blue-900/80 border-2 border-[#1E90FF] rounded-3xl px-8 py-5 shadow-2xl">
              <span className="text-[#00C2FF] text-xs font-black uppercase tracking-widest">Your Waitlist Position</span>
              <span className="text-white font-black text-6xl"># {position}</span>
              <span className="text-[#00C2FF] text-sm">Share with a friend to move up the list</span>
            </div>
          </div>
        )}

        {/* Share to move up — always show this card */}
        <div className="bg-black/80 backdrop-blur-xl border-2 border-[#1E90FF]/30 rounded-3xl p-6 space-y-4 shadow-2xl">
          <div className="text-center">
            <h3 className="text-[#00C2FF] font-black text-xl uppercase tracking-wider mb-1"> Share to Move Up</h3>
            <p className="text-gray-300 text-sm mb-4">Each friend who signs up bumps your position up the list.</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={copyLink}
              className="flex-1 flex items-center justify-center gap-2 bg-[#1E90FF] hover:bg-[#1E90FF] text-black font-black py-3 px-4 rounded-xl transition-all"
            >
              {copied ? '\u2714 Link Copied!' : '\ud83d\udccb Copy Invite Link'}
            </button>
            <a
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-2 bg-black border border-white/20 hover:bg-white/10 text-white font-bold py-3 px-4 rounded-xl transition-all"
            >
              Post on X (Twitter)
            </a>
          </div>
        </div>

        {/* Check Your Email Card */}
        <div className="bg-gradient-to-br from-[#1E90FF]/60 to-[#0a1628]/60 backdrop-blur-md border-2 border-[#1E90FF] rounded-3xl p-8 space-y-4 shadow-2xl">
          <div className="text-center">
            <div className="text-5xl mb-4 hidden"></div>
            <h3 className="text-[#1E90FF] font-black text-2xl uppercase tracking-wider mb-4">
              CHECK YOUR EMAIL
            </h3>
            <p className="text-white text-lg leading-relaxed">
              We'll review your application and send your <span className="text-[#1E90FF] font-bold">login credentials</span> to the email address you provided within <span className="text-[#00C2FF] font-bold">24-48 hours</span>.
            </p>
          </div>
        </div>

        {/* What Happens Next */}
        <div className="bg-black/80 backdrop-blur-xl border-2 border-[#1E90FF] rounded-3xl p-8 space-y-6 shadow-2xl">
          <div className="text-center">
            <h3 className="text-[#00C2FF] font-black text-2xl uppercase tracking-wider mb-6 flex items-center justify-center gap-3">
              <span></span>
              <span>WHAT HAPPENS NEXT</span>
            </h3>
          </div>

          <div className="space-y-5">
            <div className="flex gap-4 items-start">
              <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-[#1E90FF] to-blue-500 rounded-full flex items-center justify-center font-black text-black text-lg">
                1
              </div>
              <div>
                <h4 className="text-white font-bold text-lg mb-1">Application Review</h4>
                <p className="text-gray-300 text-sm">Our team reviews your VIP application to ensure the best experience for founding members.</p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-[#1E90FF] to-blue-500 rounded-full flex items-center justify-center font-black text-black text-lg">
                2
              </div>
              <div>
                <h4 className="text-white font-bold text-lg mb-1">Access Granted</h4>
                <p className="text-gray-300 text-sm">You'll receive an email with your unique access code and login instructions.</p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-[#1E90FF] to-blue-500 rounded-full flex items-center justify-center font-black text-black text-lg">
                3
              </div>
              <div>
                <h4 className="text-white font-bold text-lg mb-1">Launch Day - February 1, 2026</h4>
                <p className="text-gray-300 text-sm">Be among the first 10,000 to experience the future of athlete success with 6 months FREE access!</p>
              </div>
            </div>
          </div>
        </div>

        {/* Access Code Display (if available) */}
        {accessCode && (
          <div className="bg-gradient-to-br from-gray-900/95 to-black/95 backdrop-blur-xl border-2 border-[#1E90FF] rounded-3xl p-8 space-y-4 shadow-2xl">
            <div className="text-center">
              <div className="text-4xl mb-3"></div>
              <h3 className="text-[#1E90FF] font-black text-xl uppercase tracking-wider mb-3">
                YOUR ACCESS CODE
              </h3>
              <div className="bg-black/60 border-2 border-[#1E90FF] rounded-xl px-6 py-4 inline-block">
                <p className="text-[#00C2FF] font-mono text-2xl font-black tracking-widest">
                  {accessCode}
                </p>
              </div>
              <p className="text-gray-400 text-sm mt-4">
                Save this code! You'll need it when the platform launches.
              </p>
            </div>
          </div>
        )}

        {/* Footer Message */}
        <div className="text-center space-y-4">
          <p className="text-gray-300 text-sm">
            This platform contains confidential information.<br/>
            Unauthorized access is prohibited. 
          </p>
          <div className="flex justify-center gap-4">
            <div className="text-white font-bold bg-black/60 backdrop-blur-sm px-4 py-2 rounded-full border border-[#1E90FF]/30 shadow-lg text-sm">
              VIP Status Confirmed
            </div>
            <div className="text-white font-bold bg-black/60 backdrop-blur-sm px-4 py-2 rounded-full border border-[#1E90FF]/50 shadow-lg text-sm">
              Founding Member
            </div>
          </div>
        </div>

        {/* Bottom Spacing */}
        <div className="h-8"></div>
      </div>
    </div>
  );
}
export default function Success() {
  return <RouteErrorBoundary><SuccessInner /></RouteErrorBoundary>;
}
