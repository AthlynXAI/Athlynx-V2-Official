import { RouteErrorBoundary } from "@/components/GlobalErrorBoundary";
import SportXHub, { ALL_SPORTS } from "@/components/SportXHub";
const sport = ALL_SPORTS.find(s => s.id === "wrestling") ?? ALL_SPORTS[0];
function MatWarriorsInner() { return <SportXHub sport={sport} />; }
export default function MatWarriors() {
  return <RouteErrorBoundary><MatWarriorsInner /></RouteErrorBoundary>;
}
