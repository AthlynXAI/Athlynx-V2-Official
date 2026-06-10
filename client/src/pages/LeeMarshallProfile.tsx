/**
 * /team/lee-marshall — Lee Marshall
 * Partner · VP of Sales & Operations · The Handshake
 * Public page · no auth wall · Beta.
 */
import PartnerProfilePage, { type PartnerProfileConfig } from "@/components/PartnerProfilePage";

const config: PartnerProfileConfig = {
  routeBack: "/about",
  routeBackLabel: "Back to Team",

  name: "Lee Marshall",
  honor: "Partner · Operations",
  role: "Vice President of Sales & Athlete Community · ATHLYNX AI",
  photoSrc: "/images/team/lee-marshall.png",
  initials: "LM",

  plaqueCaption: "He shakes the hand, then he keeps the promise.",
  plaqueAttribution: "— Chad, on Lee",

  whoTheyAre: [
    "Lee is the front of the house. The first phone call a partner gets. The first hand an athlete shakes. The one who decides whether what we said on the website is going to be true when you meet us in person.",
    "He's not a salesman. He's a relationship builder who happens to close deals because he doesn't oversell.",
  ],

  whatTheyDo: [
    "VP of Sales & Athlete Community — partnerships, outreach, on-the-ground operations.",
    "Front-of-house — the public face of the team when Chad and Glenn are heads-down on product and finance.",
    "Community liaison — agents, coaches, parents, athletes — the network that makes the platform actually useful.",
    "Brand promise enforcer — if a partner agreement doesn't match what we promised on the page, Lee is the one who pulls the brake.",
  ],

  whyTheyMatter: [
    "You can't market your way to a movement. You have to be on the phone, in the gym, at the field, at the school. That's Lee.",
    "When an athlete tells someone ATHLYNX is real, more often than not it's because they shook Lee's hand first.",
  ],

  lockedSentence: "Lee's job is to make sure the words on the page are the same words said face-to-face. That's how the brand stays clean.",

  signatureChip: "Sales · Athlete Community",
};

export default function LeeMarshallProfile() {
  return <PartnerProfilePage config={config} />;
}
