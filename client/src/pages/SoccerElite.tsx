import { RouteErrorBoundary } from "@/components/GlobalErrorBoundary";
import SportXHub, { ALL_SPORTS } from "@/components/SportXHub";
const sport = ALL_SPORTS.find(s => s.id === "soccer") ?? ALL_SPORTS[0];
function SoccerEliteInner() { return <SportXHub sport={sport} />; }
export default function SoccerElite() {
  return <RouteErrorBoundary><SoccerEliteInner /></RouteErrorBoundary>;
}
