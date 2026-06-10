import { RouteErrorBoundary } from "@/components/GlobalErrorBoundary";
import SportXHub, { ALL_SPORTS } from "@/components/SportXHub";
const sport = ALL_SPORTS.find(s => s.id === "tennis") ?? ALL_SPORTS[0];
function RacketKingsInner() { return <SportXHub sport={sport} />; }
export default function RacketKings() {
  return <RouteErrorBoundary><RacketKingsInner /></RouteErrorBoundary>;
}
