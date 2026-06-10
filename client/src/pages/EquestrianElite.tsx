import { RouteErrorBoundary } from "@/components/GlobalErrorBoundary";
import SportXHub, { ALL_SPORTS } from "@/components/SportXHub";
const sport = ALL_SPORTS.find(s => s.id === "equestrian") ?? ALL_SPORTS[0];
function EquestrianEliteInner() { return <SportXHub sport={sport} />; }
export default function EquestrianElite() {
  return <RouteErrorBoundary><EquestrianEliteInner /></RouteErrorBoundary>;
}
