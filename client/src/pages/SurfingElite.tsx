import { RouteErrorBoundary } from "@/components/GlobalErrorBoundary";
import SportXHub, { ALL_SPORTS } from "@/components/SportXHub";
const sport = ALL_SPORTS.find(s => s.id === "surfing") ?? ALL_SPORTS[0];
function SurfingEliteInner() { return <SportXHub sport={sport} />; }
export default function SurfingElite() {
  return <RouteErrorBoundary><SurfingEliteInner /></RouteErrorBoundary>;
}
