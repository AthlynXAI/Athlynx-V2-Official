import { RouteErrorBoundary } from "@/components/GlobalErrorBoundary";
import SportXHub, { ALL_SPORTS } from "@/components/SportXHub";
const sport = ALL_SPORTS.find(s => s.id === "rugby") ?? ALL_SPORTS[0];
function RugbyEliteInner() { return <SportXHub sport={sport} />; }
export default function RugbyElite() {
  return <RouteErrorBoundary><RugbyEliteInner /></RouteErrorBoundary>;
}
