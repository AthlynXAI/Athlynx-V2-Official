import { RouteErrorBoundary } from "@/components/GlobalErrorBoundary";
import SportXHub, { ALL_SPORTS } from "@/components/SportXHub";
const sport = ALL_SPORTS.find(s => s.id === "dance") ?? ALL_SPORTS[0];
function DanceEliteInner() { return <SportXHub sport={sport} />; }
export default function DanceElite() {
  return <RouteErrorBoundary><DanceEliteInner /></RouteErrorBoundary>;
}
