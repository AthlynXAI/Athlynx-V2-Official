import { RouteErrorBoundary } from "@/components/GlobalErrorBoundary";
import SportXHub, { ALL_SPORTS } from "@/components/SportXHub";
const sport = ALL_SPORTS.find(s => s.id === "cycling") ?? ALL_SPORTS[0];
function CyclingEliteInner() { return <SportXHub sport={sport} />; }
export default function CyclingElite() {
  return <RouteErrorBoundary><CyclingEliteInner /></RouteErrorBoundary>;
}
