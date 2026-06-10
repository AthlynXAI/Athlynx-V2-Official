import { RouteErrorBoundary } from "@/components/GlobalErrorBoundary";
import SportXHub, { ALL_SPORTS } from "@/components/SportXHub";
const sport = ALL_SPORTS.find(s => s.id === "golf") ?? ALL_SPORTS[0];
function FairwayEliteInner() { return <SportXHub sport={sport} />; }
export default function FairwayElite() {
  return <RouteErrorBoundary><FairwayEliteInner /></RouteErrorBoundary>;
}
