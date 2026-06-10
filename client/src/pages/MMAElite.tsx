import { RouteErrorBoundary } from "@/components/GlobalErrorBoundary";
import SportXHub, { ALL_SPORTS } from "@/components/SportXHub";
const sport = ALL_SPORTS.find(s => s.id === "mma") ?? ALL_SPORTS[0];
function MMAEliteInner() { return <SportXHub sport={sport} />; }
export default function MMAElite() {
  return <RouteErrorBoundary><MMAEliteInner /></RouteErrorBoundary>;
}
