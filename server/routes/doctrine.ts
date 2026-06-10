// Build 27 — AthlynXAI Doctrine Routes
//
// Serves the four canonical specs at /api/doctrine/:spec_id so the platform
// can read its own constitution at runtime. This is what makes the specs
// "permanently baked in" — they ship with every deploy, live in git,
// and are accessible from the running app.
//
// Founder order, May 16, 2026, 1:01 AM PDT:
//   "I want all this baked in permanently."
//
// Iron Sharpens Iron — Proverbs 27:17.

import type { Express, Request, Response } from "express";
import { DOCTRINE, DOCTRINE_GENERATED_AT } from "../generated/doctrine";

const SPEC_META = {
  "01-layer-cake-and-tokenization": {
    title: "The Layer Cake & Tokenization Layer",
    locked_at: "2026-05-16T07:52:00Z",
    summary:
      "Nine layers from Identity to Syndication, with 18 canonical token classes (AthleteToken, PostToken, DealToken, ScoreToken, MilestoneToken, BroadcastToken, LedgerToken, …) flowing through every layer.",
  },
  "02-sport-classification-matrix": {
    title: "Full-Stack Sport Classification Matrix",
    locked_at: "2026-05-16T07:55:00Z",
    summary:
      "34 sports (including Cheer + Gymnastics sub-disciplines) classified against all 9 layers and all 18 token classes — the canonical sport-to-token map the Studio Suite reads from.",
  },
  "03-autonomous-os": {
    title: "The Autonomous OS",
    locked_at: "2026-05-16T07:59:00Z",
    summary:
      "Eight self-running engines (Acquisition, Content, Distribution, Monetization, Retention, Treasury, Resilience, Review) that turn the platform into a revenue machine the founder can run while sleeping.",
  },
  "04-quality-bar-4-5-star": {
    title: "The 4.5★ Quality Bar",
    locked_at: "2026-05-16T08:01:00Z",
    summary:
      "The non-negotiable 4.5★ rating floor on iOS App Store and Google Play, defended autonomously by Engine 8 (the Review Engine).",
  },
} as const satisfies Record<string, { title: string; locked_at: string; summary: string }>;

type SpecId = keyof typeof SPEC_META;

export function registerDoctrineRoutes(app: Express) {
  // List all specs
  app.get("/api/doctrine", (_req: Request, res: Response) => {
    res.json({
      doctrine: "AthlynX",
      locked_by: "Chad A. Dozier Sr.",
      version: "2026-05-16",
      build: "Build 27 OS Drop",
      generated_at: DOCTRINE_GENERATED_AT,
      specs: Object.entries(SPEC_META).map(([id, meta]) => ({
        id,
        ...meta,
        url: `/api/doctrine/${id}`,
      })),
      closer: "Iron Sharpens Iron — Proverbs 27:17.",
    });
  });

  // Serve individual spec as markdown
  app.get("/api/doctrine/:spec_id", (req: Request, res: Response) => {
    const specId = req.params.spec_id as SpecId;
    const md = DOCTRINE[specId];
    if (!md) {
      return res.status(404).json({ error: "spec_not_found", available: Object.keys(SPEC_META) });
    }
    if (req.query.format === "json") {
      return res.json({
        id: specId,
        ...SPEC_META[specId],
        generated_at: DOCTRINE_GENERATED_AT,
        markdown: md,
        closer: "Iron Sharpens Iron — Proverbs 27:17.",
      });
    }
    res.setHeader("Content-Type", "text/markdown; charset=utf-8");
    res.send(md);
  });
}
