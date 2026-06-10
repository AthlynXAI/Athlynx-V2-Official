/**
 * /team/andy-kustes — Andy Kustes
 * Partner · VP of Technology · The Builder
 * Public page · no auth wall · Beta.
 */
import PartnerProfilePage, { type PartnerProfileConfig } from "@/components/PartnerProfilePage";

const config: PartnerProfileConfig = {
  routeBack: "/about",
  routeBackLabel: "Back to Team",

  name: "Andy Kustes",
  honor: "Partner · Technology",
  role: "Vice President of Technology · Platform Architecture · ATHLYNX AI",
  photoSrc: "/images/team/andrew-kustes-vpt.png",
  initials: "AK",

  plaqueCaption: "He builds the thing the way it ought to be built.",
  plaqueAttribution: "— Chad, on Andy",

  whoTheyAre: [
    "Andy is the technologist in the family — the one who has been around enough builds to know which corners you can cut and which corners will collapse the whole thing six months later.",
    "He doesn't chase shiny. He picks the boring tool that works for ten years and explains why.",
  ],

  whatTheyDo: [
    "VP of Technology — platform architecture, AI infrastructure, compute strategy.",
    "Cost-of-build watchdog — the person who looks at a vendor invoice and asks whether the bill matches the work.",
    "Roadmap pressure-tester — questions every feature before it gets a sprint number.",
    "AI partnerships — the relationships behind the models, the GPUs, the data pipelines.",
  ],

  whyTheyMatter: [
    "Anybody can spin up a server. Andy's value is knowing what NOT to build, and protecting the team from spending six weeks on the wrong thing.",
    "When the platform stays simple where it can and serious where it has to be, that's Andy's fingerprint.",
  ],

  lockedSentence: "Andy's seat is the one that asks the boring question that saves the company. Every build has one of those seats. Ours has Andy in it.",

  signatureChip: "Technology · Platform Architecture",
};

export default function AndyKustesProfile() {
  return <PartnerProfilePage config={config} />;
}
