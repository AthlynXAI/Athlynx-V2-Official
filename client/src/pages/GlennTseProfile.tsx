/**
 * /team/glenn-tse — Glenn Tse
 * Co-Founder · CFO & COO · The Numbers Man
 * Public page · no auth wall · Beta.
 */
import PartnerProfilePage, { type PartnerProfileConfig } from "@/components/PartnerProfilePage";

const config: PartnerProfileConfig = {
  routeBack: "/about",
  routeBackLabel: "Back to Team",

  name: "Glenn Tse",
  honor: "Co-Founder · Partner",
  role: "Chief Financial Officer · Chief Operating Officer · AthlynXAI",
  photoSrc: "/team/glenn-tse.jpg",
  initials: "GT",

  plaqueCaption: "When the room got loud, he stayed quiet and got the numbers right.",
  plaqueAttribution: "— Chad, on Glenn",

  whoTheyAre: [
    "Glenn is the co-founder. Houston, November 2024 — two guys, one decision, one company. Everything that's been built since started in that room.",
    "He's not the loudest voice in the family. He's the most careful one. That's why the numbers tie out. That's why the structure holds.",
  ],

  whatTheyDo: [
    "Co-Founder of Dozier Holdings Group and AthlynXAI Corporation.",
    "Chief Financial Officer — owns the model, the runway, the cap table, the investor conversations.",
    "Chief Operating Officer — owns the operating cadence, the vendor stack, the receipts.",
    "Asia-Pacific corridor — relationships and capital pathways outside the U.S.",
    "First check in. First name on the agreement after Chad's.",
  ],

  whyTheyMatter: [
    "Anyone can talk about building a company. Glenn put his name on the paperwork, his money on the table, and his time on the line — all three. That's the test.",
    "The reason AthlynX exists is that Chad had a vision and Glenn had a yes.",
  ],

  lockedSentence: "Glenn was the second signature. The numbers, the structure, and the patience to do it the right way — that's the seat he holds in the family.",

  signatureChip: "Co-Founder · Houston · November 2024",
};

export default function GlennTseProfile() {
  return <PartnerProfilePage config={config} />;
}
