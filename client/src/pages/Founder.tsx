import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Mic, BookOpen, Users, Sparkles, ChevronRight } from "lucide-react";
import { trpc } from "@/lib/trpc";
import PlatformLayout from "@/components/PlatformLayout";
import MobileBottomNav from "@/components/MobileBottomNav";
import { RouteErrorBoundary } from "@/components/GlobalErrorBoundary";

function FounderInner() {
  const founderQ = trpc.founder.getFounderProfile.useQuery();
  const lessonsQ = trpc.founder.listLessons.useQuery({ category: "all", limit: 12, offset: 0 });
  const podcastQ = trpc.podcast.listPublished.useQuery({ limit: 6, offset: 0 });

  const founder = founderQ.data;
  const lessons = lessonsQ.data ?? [];
  const episodes = podcastQ.data ?? [];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-slate-950/95 backdrop-blur-md border-b border-slate-800">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/">
            <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Home
            </Button>
          </Link>
          <div className="flex items-center gap-2 text-xs text-slate-500">
            Iron Sharpens Iron — Proverbs 27:17
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="container mx-auto px-4 py-12 max-w-5xl">
        <div className="flex items-start gap-6 flex-col sm:flex-row">
          {founder?.avatarUrl ? (
            <img
              src={founder.avatarUrl}
              alt={founder.displayName ?? "Founder"}
              className="w-28 h-28 sm:w-36 sm:h-36 rounded-2xl object-cover border-2 border-slate-700"
            />
          ) : (
            <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center text-4xl font-bold">
              CD
            </div>
          )}
          <div className="flex-1">
            <div className="text-sky-400 text-xs font-semibold tracking-wider mb-2">FOUNDER</div>
            <h1 className="text-3xl sm:text-5xl font-bold mb-3">
              {founder?.displayName ?? "Chad A. Dozier"}
            </h1>
            <p className="text-slate-300 text-base sm:text-lg leading-relaxed max-w-3xl">
              I set the bar — the athletes raise it. This is my note feed, my lessons, and my
              podcast. Every once in a while I follow someone I see grinding. When that happens,
              you'll see it on their profile.
            </p>
            <p className="text-slate-500 text-sm mt-3">
              Looking for a Michael Jordan + Bo Jackson brand to build with. If that's you —
              find me.
            </p>
          </div>
        </div>
      </section>

      {/* Quick links */}
      <section className="container mx-auto px-4 max-w-5xl">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link href="/founder/podcast">
            <Card className="bg-slate-900 border-slate-800 hover:border-blue-600 transition-colors cursor-pointer">
              <CardContent className="p-5">
                <Mic className="w-6 h-6 text-sky-400 mb-3" />
                <div className="font-semibold mb-1">The Podcast</div>
                <div className="text-slate-400 text-sm">Real talk with athletes</div>
              </CardContent>
            </Card>
          </Link>
          <Card className="bg-slate-900 border-slate-800">
            <CardContent className="p-5">
              <BookOpen className="w-6 h-6 text-cyan-400 mb-3" />
              <div className="font-semibold mb-1">Lessons</div>
              <div className="text-slate-400 text-sm">Things I've learned along the way</div>
            </CardContent>
          </Card>
          <Card className="bg-slate-900 border-slate-800">
            <CardContent className="p-5">
              <Users className="w-6 h-6 text-emerald-400 mb-3" />
              <div className="font-semibold mb-1">Following</div>
              <div className="text-slate-400 text-sm">Athletes who set the standard</div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Lessons feed */}
      <section className="container mx-auto px-4 py-10 max-w-5xl">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-2xl font-bold">Founder Lessons</h2>
          <Sparkles className="w-4 h-4 text-sky-400" />
        </div>
        {lessonsQ.isLoading ? (
          <div className="text-slate-500 text-sm">Loading…</div>
        ) : lessons.length === 0 ? (
          <Card className="bg-slate-900 border-slate-800">
            <CardContent className="p-6 text-slate-400 text-sm">
              No lessons published yet. Check back soon.
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {lessons.map((l: any) => (
              <Card key={l.id} className="bg-slate-900 border-slate-800">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <h3 className="font-semibold">{l.title}</h3>
                    {l.category && (
                      <span className="text-[10px] uppercase tracking-wider text-slate-500 bg-slate-800 px-2 py-0.5 rounded">
                        {l.category}
                      </span>
                    )}
                  </div>
                  <p className="text-slate-300 text-sm whitespace-pre-wrap leading-relaxed">
                    {l.body}
                  </p>
                  {l.audioUrl && (
                    <audio controls className="mt-3 w-full">
                      <source src={l.audioUrl} />
                    </audio>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* Podcast strip */}
      {episodes.length > 0 && (
        <section className="container mx-auto px-4 pb-12 max-w-5xl">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-2xl font-bold">Recent Episodes</h2>
            <Link href="/founder/podcast">
              <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
                All episodes <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {episodes.map((ep: any) => (
              <Link key={ep.id} href={`/founder/podcast/${ep.slug}`}>
                <Card className="bg-slate-900 border-slate-800 hover:border-blue-600 transition-colors cursor-pointer h-full">
                  <CardContent className="p-4">
                    {ep.coverArtUrl && (
                      <img
                        src={ep.coverArtUrl}
                        alt={ep.title}
                        className="w-full aspect-square object-cover rounded mb-3"
                      />
                    )}
                    {ep.episodeNumber && (
                      <div className="text-xs text-sky-400 mb-1">EP {ep.episodeNumber}</div>
                    )}
                    <h3 className="font-semibold leading-tight mb-1">{ep.title}</h3>
                    {ep.subtitle && (
                      <p className="text-slate-400 text-xs">{ep.subtitle}</p>
                    )}
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      )}

      <footer className="container mx-auto px-4 py-8 max-w-5xl text-center text-slate-500 text-xs border-t border-slate-800">
      </footer>
      <MobileBottomNav />
    </div>
  );
}

export default function Founder() {
  return (
    <RouteErrorBoundary>
      <PlatformLayout>
        <FounderInner />
      </PlatformLayout>
    </RouteErrorBoundary>
  );
}
