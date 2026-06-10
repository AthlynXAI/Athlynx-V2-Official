import { RouteErrorBoundary } from "@/components/GlobalErrorBoundary";
import SportXHub, { ALL_SPORTS } from "@/components/SportXHub";
const sport = ALL_SPORTS.find(s => s.id === "archery") ?? ALL_SPORTS[0];
function ArcheryEliteInner() { return <SportXHub sport={sport} />; }
export default function ArcheryElite() {
  return <RouteErrorBoundary><ArcheryEliteInner /></RouteErrorBoundary>;
}
