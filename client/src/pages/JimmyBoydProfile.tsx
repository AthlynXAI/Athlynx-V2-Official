/**
 * /team/jimmy-boyd — Jimmy Boyd
 * Partner · VP of Real Estate · The Land Man
 * Public page · no auth wall · Beta.
 */
import PartnerProfilePage, { type PartnerProfileConfig } from "@/components/PartnerProfilePage";

const config: PartnerProfileConfig = {
  routeBack: "/about",
  routeBackLabel: "Back to Team",

  name: "Jimmy Boyd",
  honor: "Partner · Funding",
  role: "Vice President of Real Estate · Strategic Investor · ATHLYNX AI",
  photoSrc: "/images/team/jimmy-boyd.png",
  initials: "JB",

  plaqueCaption: "He walks the land before he draws the line.",
  plaqueAttribution: "— Chad, on Jimmy",

  whoTheyAre: [
    "Jimmy is a builder before he is a financier. He's been around buildings, land, and contracts long enough to know that the deal isn't the contract — the deal is the relationship before the contract.",
    "When ATHLYNX needed real money in the door at the start, Jimmy didn't ask for the pitch deck twice. He asked one question and wrote the check.",
  ],

  whatTheyDo: [
    "Strategic investor — part of the founding capital that put ATHLYNX on the field.",
    "VP of Real Estate — physical footprint, training facilities, partnerships with venues and academies.",
    "Deal architect — quietly works the contract structure so the family is protected on the back end.",
    "Mentor — the voice in the room when something doesn't smell right.",
  ],

  whyTheyMatter: [
    "Most people will tell you about the deal. Jimmy will tell you about the people on the other side of the deal. That's a different operator.",
    "When you build something you want to last, you want people like Jimmy in the corner.",
  ],

  lockedSentence: "Jimmy doesn't draw the line until he walks the land. That's the standard he sets for every agreement that has the ATHLYNX name on it.",

  signatureChip: "Founding Capital · Real Estate",
};

export default function JimmyBoydProfile() {
  return <PartnerProfilePage config={config} />;
}
