/**
 * AthlynX — DOC PAGE WRAPPER
 * Reusable wrapper for long-form doctrine + spec pages.
 * Brand colors: #050d1a navy, #0066ff blue, #00c2ff cyan.
 * No external markdown dep — children render JSX directly.
 * Build 11 — May 12, 2026
 */
import { ReactNode } from "react";
import { RouteErrorBoundary } from "@/components/GlobalErrorBoundary";
import MobileBottomNav from "@/components/MobileBottomNav";
import { Link } from "wouter";

type DocPageProps = {
  title: string;
  subtitle?: string;
  eyebrow?: string;
  children: ReactNode;
  closer?: string;
};

function DocPageInner({ title, subtitle, eyebrow, children, closer }: DocPageProps) {
  return (
    <div className="min-h-screen bg-[#050d1a] text-white">
      <header className="border-b border-white/10 bg-[#050d1a]/95 backdrop-blur sticky top-0 z-50">
        <div className="mx-auto max-w-5xl px-6 py-5 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold tracking-tight">
            <span className="text-white">AthlynX</span>
            <span className="ml-2 text-xs uppercase tracking-widest text-[#00c2ff]">Beta</span>
          </Link>
          <nav className="hidden md:flex gap-6 text-sm text-white/70">
            <Link href="/about" className="hover:text-white">About</Link>
            <Link href="/founders" className="hover:text-white">Founders</Link>
            <Link href="/pricing" className="hover:text-white">Pricing</Link>
            <Link href="/os" className="hover:text-[#00c2ff]">Connector OS</Link>
          </nav>
        </div>
      </header>

      <section className="mx-auto max-w-5xl px-6 pt-16 pb-10">
        {eyebrow && (
          <div className="text-xs uppercase tracking-[0.3em] text-[#00c2ff] mb-4">
            {eyebrow}
          </div>
        )}
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight leading-tight">{title}</h1>
        {subtitle && (
          <p className="mt-4 text-lg md:text-xl text-white/70 max-w-3xl leading-relaxed">{subtitle}</p>
        )}
      </section>

      <article className="mx-auto max-w-3xl px-6 pb-24 text-white/80 leading-relaxed space-y-6">
        {children}
      </article>

      {closer && (
        <footer className="border-t border-white/10 bg-[#050d1a]">
          <div className="mx-auto max-w-3xl px-6 py-10 text-center">
            <p className="text-xs uppercase tracking-[0.3em] text-[#00c2ff]">
              {closer}
            </p>
          </div>
        </footer>
      )}

      <MobileBottomNav />
    </div>
  );
}

export default function DocPage(props: DocPageProps) {
  return (
    <RouteErrorBoundary>
      <DocPageInner {...props} />
    </RouteErrorBoundary>
  );
}

// Shared section helpers so each doc page stays consistent
export function DocH2({ children }: { children: ReactNode }) {
  return (
    <h2 className="text-2xl md:text-3xl font-bold text-[#00c2ff] border-b border-white/10 pb-2 mt-12">
      {children}
    </h2>
  );
}

export function DocH3({ children }: { children: ReactNode }) {
  return (
    <h3 className="text-xl md:text-2xl font-bold text-white mt-8">{children}</h3>
  );
}

export function DocList({ items }: { items: ReactNode[] }) {
  return (
    <ul className="list-disc list-outside ml-6 space-y-2 text-white/80">
      {items.map((item, i) => (
        <li key={i}>{item}</li>
      ))}
    </ul>
  );
}

export function DocCallout({ children, accent = "blue" }: { children: ReactNode; accent?: "blue" | "cyan" }) {
  const color = accent === "cyan" ? "border-[#00c2ff] bg-[#00c2ff]/5" : "border-[#0066ff] bg-[#0066ff]/5";
  return (
    <div className={`border-l-4 ${color} px-5 py-4 my-6 rounded-r`}>
      {children}
    </div>
  );
}
