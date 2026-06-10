import { RouteErrorBoundary } from "@/components/GlobalErrorBoundary";
import SportXHub, { ALL_SPORTS } from "@/components/SportXHub";
const sport = ALL_SPORTS.find(s => s.id === "hockey") ?? ALL_SPORTS[0];
function IceBreakersInner() { return <SportXHub sport={sport} />; }
export default function IceBreakers() {
  return <RouteErrorBoundary><IceBreakersInner /></RouteErrorBoundary>;
}
