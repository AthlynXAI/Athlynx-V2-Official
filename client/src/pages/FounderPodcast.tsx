import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Mic, Rss } from "lucide-react";
import { trpc } from "@/lib/trpc";
import PlatformLayout from "@/components/PlatformLayout";
import MobileBottomNav from "@/components/MobileBottomNav";
import { RouteErrorBoundary } from "@/components/GlobalErrorBoundary";

function FounderPodcastInner() {
  const epsQ = trpc.podcast.listPublished.useQuery({ limit: 50, offset: 0 });
  const episodes = epsQ.data ?? [];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white">
      <header className="sticky top-0 z-40 bg-slate-950/95 backdrop-blur-md border-b border-slate-800">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/founder">
            <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Founder
            </Button>
          </Link>
          <a href="/founder/podcast/rss.xml" target="_blank" rel="noopener noreferrer">
            <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
              <Rss className="w-4 h-4 mr-2" />
              RSS
            </Button>
          </a>
        </div>
      </header>

      <section className="container mx-auto px-4 py-10 max-w-5xl">
        <div className="flex items-center gap-3 mb-2">
          <Mic className="w-6 h-6 text-[#00C2FF]" />
          <div className="text-[#00C2FF] text-xs font-semibold tracking-wider">FOUNDER PODCAST</div>
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold mb-3">Real talk. Real athletes.</h1>
        <p className="text-slate-300 max-w-2xl">
          Conversations with athletes, coaches, agents, scouts, and the people building the
          next generation of sports. No filler. No fluff.
        </p>
      </section>

      <section className="container mx-auto px-4 pb-12 max-w-5xl">
        {epsQ.isLoading ? (
          <div className="text-slate-500 text-sm">Loading episodes…</div>
        ) : episodes.length === 0 ? (
          <Card className="bg-slate-900 border-slate-800">
            <CardContent className="p-6 text-slate-400 text-sm">
              Episode 1 drops soon. Sign up to get notified when it's live.
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {episodes.map((ep: any) => (
              <Card
                key={ep.id}
                className="bg-slate-900 border-slate-800 hover:border-blue-600 transition-colors"
              >
                <CardContent className="p-5">
                  <div className="flex gap-4">
                    {ep.coverArtUrl && (
                      <img
                        src={ep.coverArtUrl}
                        alt={ep.title}
                        className="w-20 h-20 sm:w-24 sm:h-24 rounded object-cover flex-shrink-0"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
                        {ep.episodeNumber && (
                          <span className="text-[#00C2FF]">EP {ep.episodeNumber}</span>
                        )}
                        {ep.publishedAt && (
                          <span>{new Date(ep.publishedAt).toLocaleDateString()}</span>
                        )}
                        {ep.durationSeconds && (
                          <span>
                            {Math.floor(ep.durationSeconds / 60)} min
                          </span>
                        )}
                      </div>
                      <h3 className="font-semibold text-lg leading-tight mb-1">{ep.title}</h3>
                      {ep.subtitle && (
                        <p className="text-slate-400 text-sm">{ep.subtitle}</p>
                      )}
                      {ep.audioUrl && (
                        <audio controls className="mt-3 w-full">
                          <source src={ep.audioUrl} />
                        </audio>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>

      <footer className="container mx-auto px-4 py-8 max-w-5xl text-center text-slate-500 text-xs border-t border-slate-800">
        Iron Sharpens Iron — Proverbs 27:17
      </footer>
      <MobileBottomNav />
    </div>
  );
}

export default function FounderPodcast() {
  return (
    <RouteErrorBoundary>
      <PlatformLayout>
        <FounderPodcastInner />
      </PlatformLayout>
    </RouteErrorBoundary>
  );
}
