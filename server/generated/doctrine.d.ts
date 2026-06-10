// Build 27 — AthlynXAI Doctrine Bundle (type declarations)
//
// This .d.ts ships in git so `tsc --noEmit` resolves imports from
// server/routes/doctrine.ts even before scripts/bundle-doctrine.mjs has
// generated the actual server/generated/doctrine.ts at build time.
//
// The generated .ts file (created by `build:vercel`) is gitignored, but
// these types are stable and version-controlled. If you add a new spec
// to /docs/specs/, update SPEC_KEYS below.
//
// Iron Sharpens Iron — Proverbs 27:17.

export type DoctrineSpecId =
  | "01-layer-cake-and-tokenization"
  | "02-sport-classification-matrix"
  | "03-autonomous-os"
  | "04-quality-bar-4-5-star";

export const DOCTRINE: Record<DoctrineSpecId, string>;
export const DOCTRINE_GENERATED_AT: string;
