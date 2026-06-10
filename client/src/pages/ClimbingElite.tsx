import { RouteErrorBoundary } from "@/components/GlobalErrorBoundary";
import SportXHub, { ALL_SPORTS } from "@/components/SportXHub";
const sport = ALL_SPORTS.find(s => s.id === "climbing") ?? ALL_SPORTS[0];
function ClimbingEliteInner() { return <SportXHub sport={sport} />; }
export default function ClimbingElite() {
  return <RouteErrorBoundary><ClimbingEliteInner /></RouteErrorBoundary>;
}
