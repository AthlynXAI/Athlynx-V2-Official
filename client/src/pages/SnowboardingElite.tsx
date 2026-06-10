import { RouteErrorBoundary } from "@/components/GlobalErrorBoundary";
import SportXHub, { ALL_SPORTS } from "@/components/SportXHub";
const sport = ALL_SPORTS.find(s => s.id === "snowboarding") ?? ALL_SPORTS[0];
function SnowboardingEliteInner() { return <SportXHub sport={sport} />; }
export default function SnowboardingElite() {
  return <RouteErrorBoundary><SnowboardingEliteInner /></RouteErrorBoundary>;
}
