import { RouteErrorBoundary } from "@/components/GlobalErrorBoundary";
import SportXHub, { ALL_SPORTS } from "@/components/SportXHub";
const sport = ALL_SPORTS.find(s => s.id === "pickleball") ?? ALL_SPORTS[0];
function PickleballEliteInner() { return <SportXHub sport={sport} />; }
export default function PickleballElite() {
  return <RouteErrorBoundary><PickleballEliteInner /></RouteErrorBoundary>;
}
