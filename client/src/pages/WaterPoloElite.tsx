import { RouteErrorBoundary } from "@/components/GlobalErrorBoundary";
import SportXHub, { ALL_SPORTS } from "@/components/SportXHub";
const sport = ALL_SPORTS.find(s => s.id === "water-polo") ?? ALL_SPORTS[0];
function WaterPoloEliteInner() { return <SportXHub sport={sport} />; }
export default function WaterPoloElite() {
  return <RouteErrorBoundary><WaterPoloEliteInner /></RouteErrorBoundary>;
}
