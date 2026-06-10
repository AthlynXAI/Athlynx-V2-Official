import { RouteErrorBoundary } from "@/components/GlobalErrorBoundary";
import SportXHub, { ALL_SPORTS } from "@/components/SportXHub";
const sport = ALL_SPORTS.find(s => s.id === "beach-volleyball") ?? ALL_SPORTS[0];
function BeachVolleyballEliteInner() { return <SportXHub sport={sport} />; }
export default function BeachVolleyballElite() {
  return <RouteErrorBoundary><BeachVolleyballEliteInner /></RouteErrorBoundary>;
}
