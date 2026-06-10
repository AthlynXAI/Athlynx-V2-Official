import { RouteErrorBoundary } from "@/components/GlobalErrorBoundary";
import SportXHub, { ALL_SPORTS } from "@/components/SportXHub";
const sport = ALL_SPORTS.find(s => s.id === "fencing") ?? ALL_SPORTS[0];
function FencingEliteInner() { return <SportXHub sport={sport} />; }
export default function FencingElite() {
  return <RouteErrorBoundary><FencingEliteInner /></RouteErrorBoundary>;
}
