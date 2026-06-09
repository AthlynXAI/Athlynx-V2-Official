export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
      <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight bg-gradient-to-r from-cobalt-500 via-electric-400 to-cobalt-700 bg-clip-text text-transparent">
        AthlynX
      </h1>
      <p className="mt-6 text-xl md:text-2xl text-granite-100 max-w-2xl">
        The Athlete's Playbook.
      </p>
      <p className="mt-2 text-base text-granite-100/70 max-w-xl">
        One Platform. Every Tool. Unlimited Potential. Built for every athlete —
        youth to pro to retirement.
      </p>
      <div className="mt-12 text-xs uppercase tracking-widest text-granite-100/40">
        Build 1 · Live
      </div>
    </main>
  );
}
