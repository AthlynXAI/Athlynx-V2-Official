import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Calendar, Tv, Trophy } from "lucide-react";
import { trpc } from "@/lib/trpc";
import PlatformLayout from "@/components/PlatformLayout";
import MobileBottomNav from "@/components/MobileBottomNav";
import { RouteErrorBoundary } from "@/components/GlobalErrorBoundary";

function AthlynXNetworkInner() {
  const channelsQ = trpc.stream.listChannels.useQuery({ limit: 24 });
  const liveQ = trpc.stream.listLive.useQuery();
  const upcomingQ = trpc.stream.listUpcoming.useQuery({ limit: 10 });

  const channels = channelsQ.data ?? [];
  const live = liveQ.data ?? [];
  const upcoming = upcomingQ.data ?? [];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white">
      <header className="sticky top-0 z-40 bg-slate-950/95 backdrop-blur-md border-b border-slate-800">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/">
            <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Home
            </Button>
          </Link>
          <div className="flex items-center gap-2 text-xs text-slate-500">
            AthlynX Network
          </div>
        </div>
      </header>

      <section className="container mx-auto px-4 py-10 max-w-6xl">
        <div className="flex items-center gap-3 mb-2">
          <Trophy className="w-6 h-6 text-cyan-400" />
          <div className="text-cyan-400 text-xs font-semibold tracking-wider">AthlynX NETWORK</div>
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold mb-3">Every game. Every athlete. One network.</h1>
        <p className="text-slate-300 max-w-2xl">
          Live broadcasts, replays, and on-demand video from every channel on the platform.
          Built on Cloudflare Stream.
        </p>
      </section>

      {/* Live now */}
      {live.length > 0 && (
        <section className="container mx-auto px-4 pb-10 max-w-6xl">
          <div className="flex items-center gap-2 mb-4">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-600" />
            </span>
            <h2 className="text-2xl font-bold">Live now</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {live.map((e: any) => (
              <Card key={e.id} className="bg-slate-900 border-red-900/40 hover:border-red-600 transition-colors">
                <CardContent className="p-4">
                  <div className="aspect-video bg-slate-800 rounded mb-3 flex items-center justify-center relative">
                    {e.thumbnailUrl ? (
                      <img src={e.thumbnailUrl} alt={e.title} className="w-full h-full object-cover rounded" />
                    ) : (
                      <Trophy className="w-8 h-8 text-slate-600" />
                    )}
                    <span className="absolute top-2 left-2 bg-red-600 text-white text-xs px-2 py-0.5 rounded font-semibold">
                      LIVE
                    </span>
                    <span className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-0.5 rounded">
                      {e.viewerCount} watching
                    </span>
                  </div>
                  <h3 className="font-semibold leading-tight mb-1">{e.title}</h3>
                  <p className="text-slate-400 text-sm">
                    <Link href={`/network/${e.channelSlug}`}>
                      <span className="hover:text-white cursor-pointer">{e.channelName}</span>
                    </Link>
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* Upcoming */}
      {upcoming.length > 0 && (
        <section className="container mx-auto px-4 pb-10 max-w-6xl">
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="w-5 h-5 text-blue-400" />
            <h2 className="text-2xl font-bold">Upcoming</h2>
          </div>
          <div className="space-y-2">
            {upcoming.map((e: any) => (
              <Card key={e.id} className="bg-slate-900 border-slate-800">
                <CardContent className="p-4 flex items-center justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold leading-tight">{e.title}</h3>
                    <p className="text-slate-400 text-xs">
                      {e.channelName} ·{" "}
                      {e.scheduledStartAt && new Date(e.scheduledStartAt).toLocaleString()}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* Channels */}
      <section className="container mx-auto px-4 pb-12 max-w-6xl">
        <h2 className="text-2xl font-bold mb-4">All channels</h2>
        {channelsQ.isLoading ? (
          <div className="text-slate-500 text-sm">Loading…</div>
        ) : channels.length === 0 ? (
          <Card className="bg-slate-900 border-slate-800">
            <CardContent className="p-6 text-slate-400 text-sm">
              No channels yet. The first ones are coming online soon.
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {channels.map((c: any) => (
              <Link key={c.id} href={`/network/${c.slug}`}>
                <Card className="bg-slate-900 border-slate-800 hover:border-cyan-600 transition-colors cursor-pointer h-full">
                  <CardContent className="p-4">
                    {c.logoUrl ? (
                      <img
                        src={c.logoUrl}
                        alt={c.name}
                        className="w-12 h-12 rounded mb-3 object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded mb-3 bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center font-bold">
                        {c.name.slice(0, 2).toUpperCase()}
                      </div>
                    )}
                    <div className="font-semibold leading-tight">{c.name}</div>
                    {c.sport && (
                      <div className="text-slate-500 text-xs mt-1 capitalize">{c.sport}</div>
                    )}
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </section>

      <MobileBottomNav />
    </div>
  );
}

export default function AthlynXNetwork() {
  return (
    <RouteErrorBoundary>
      <PlatformLayout>
        <AthlynXNetworkInner />
      </PlatformLayout>
    </RouteErrorBoundary>
  );
}
