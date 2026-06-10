import { RouteErrorBoundary } from "@/components/GlobalErrorBoundary";
import SportXHub, { ALL_SPORTS } from "@/components/SportXHub";
const sport = ALL_SPORTS.find(s => s.id === "skateboarding") ?? ALL_SPORTS[0];
function SkateboardingEliteInner() { return <SportXHub sport={sport} />; }
export default function SkateboardingElite() {
  return <RouteErrorBoundary><SkateboardingEliteInner /></RouteErrorBoundary>;
}
