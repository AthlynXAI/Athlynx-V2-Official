import { RouteErrorBoundary } from "@/components/GlobalErrorBoundary";
import SportXHub, { ALL_SPORTS } from "@/components/SportXHub";
const sport = ALL_SPORTS.find(s => s.id === "esports") ?? ALL_SPORTS[0];
function EsportsHubInner() { return <SportXHub sport={sport} />; }
export default function EsportsHub() {
  return <RouteErrorBoundary><EsportsHubInner /></RouteErrorBoundary>;
}
