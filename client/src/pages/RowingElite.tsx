import { RouteErrorBoundary } from "@/components/GlobalErrorBoundary";
import SportXHub, { ALL_SPORTS } from "@/components/SportXHub";
const sport = ALL_SPORTS.find(s => s.id === "rowing") ?? ALL_SPORTS[0];
function RowingEliteInner() { return <SportXHub sport={sport} />; }
export default function RowingElite() {
  return <RouteErrorBoundary><RowingEliteInner /></RouteErrorBoundary>;
}
