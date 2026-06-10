import { RouteErrorBoundary } from "@/components/GlobalErrorBoundary";
import SportXHub, { ALL_SPORTS } from "@/components/SportXHub";
const sport = ALL_SPORTS.find(s => s.id === "badminton") ?? ALL_SPORTS[0];
function BadmintonEliteInner() { return <SportXHub sport={sport} />; }
export default function BadmintonElite() {
  return <RouteErrorBoundary><BadmintonEliteInner /></RouteErrorBoundary>;
}
