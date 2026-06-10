/**
 * /family/uncle-david — David Roland Ford Sr.
 * Trusted Advisor · Family · The First Signature
 * Public page · no auth wall · Beta.
 */
import PartnerProfilePage, { type PartnerProfileConfig } from "@/components/PartnerProfilePage";

const config: PartnerProfileConfig = {
  routeBack: "/about",
  routeBackLabel: "Back to About",

  name: "David Roland Ford Sr.",
  honor: "Uncle · Family",
  role: "Trusted Advisor · Board of Directors · ATHLYNX AI",
  photoSrc: null,
  initials: "DRF",

  plaqueCaption: "He didn't have to show up. He showed up anyway.",
  plaqueAttribution: "— Chad, on Uncle David",

  whoTheyAre: [
    "Uncle David is family. Not staff. Not contractor. Not advisor on paper. Family.",
    "Before there was a company, there was an uncle who answered the phone. Before there were partners, there was a man who said I'm in without asking what he got out of it. Before there was a circle, there was him.",
    "That's why his name is the first one on the Family side of the door.",
  ],

  whatTheyDo: [
    "Trusted Advisor — the one Chad calls before he signs anything.",
    "Lead-by-example signatory — first to put his name on the agreement, so the rest of the circle can follow.",
    "Board seat — Director, ATHLYNX AI Corporation.",
    "Legal coordination — IP protection, partner agreements, the paperwork that keeps the family safe.",
    "The steady voice — the one who says slow down, read it again when the room is moving too fast.",
  ],

  whyTheyMatter: [
    "There's a line in our Founder's Dedication that names the men who stayed. Uncle David is on that line.",
    "You don't write a profile for a man like that to impress him. You write it so the rest of the world knows what we already know.",
  ],

  lockedSentence: "Uncle David was the first signature. Not because he had to be. Because he wanted to be. That's the difference between staff and family — and that's the bar for everyone who walks through this door after him.",

  signatureChip: "First Signature · Family Side of the Door",
};

export default function UncleDavidProfile() {
  return <PartnerProfilePage config={config} />;
}
