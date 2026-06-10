import { RouteErrorBoundary } from "@/components/GlobalErrorBoundary";
import SportXHub, { ALL_SPORTS } from "@/components/SportXHub";
const sport = ALL_SPORTS.find(s => s.id === "triathlon") ?? ALL_SPORTS[0];
function TriathlonEliteInner() { return <SportXHub sport={sport} />; }
export default function TriathlonElite() {
  return <RouteErrorBoundary><TriathlonEliteInner /></RouteErrorBoundary>;
}
