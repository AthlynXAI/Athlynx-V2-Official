import { RouteErrorBoundary } from "@/components/GlobalErrorBoundary";
import SportXHub, { ALL_SPORTS } from "@/components/SportXHub";
const sport = ALL_SPORTS.find(s => s.id === "skiing") ?? ALL_SPORTS[0];
function SkiingEliteInner() { return <SportXHub sport={sport} />; }
export default function SkiingElite() {
  return <RouteErrorBoundary><SkiingEliteInner /></RouteErrorBoundary>;
}
