import { RouteErrorBoundary } from "@/components/GlobalErrorBoundary";
import SportXHub, { ALL_SPORTS } from "@/components/SportXHub";
const sport = ALL_SPORTS.find(s => s.id === "cricket") ?? ALL_SPORTS[0];
function CricketElite2Inner() { return <SportXHub sport={sport} />; }
export default function CricketElite2() {
  return <RouteErrorBoundary><CricketElite2Inner /></RouteErrorBoundary>;
}
