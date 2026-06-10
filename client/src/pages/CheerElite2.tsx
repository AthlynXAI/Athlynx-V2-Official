import { RouteErrorBoundary } from "@/components/GlobalErrorBoundary";
import SportXHub, { ALL_SPORTS } from "@/components/SportXHub";
const sport = ALL_SPORTS.find(s => s.id === "cheer") ?? ALL_SPORTS[0];
function CheerElite2Inner() { return <SportXHub sport={sport} />; }
export default function CheerElite2() {
  return <RouteErrorBoundary><CheerElite2Inner /></RouteErrorBoundary>;
}
