import { RouteErrorBoundary } from "@/components/GlobalErrorBoundary";
import SportXHub, { ALL_SPORTS } from "@/components/SportXHub";
const sport = ALL_SPORTS.find(s => s.id === "boxing") ?? ALL_SPORTS[0];
function BoxingEliteInner() { return <SportXHub sport={sport} />; }
export default function BoxingElite() {
  return <RouteErrorBoundary><BoxingEliteInner /></RouteErrorBoundary>;
}
