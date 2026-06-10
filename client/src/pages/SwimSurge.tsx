import { RouteErrorBoundary } from "@/components/GlobalErrorBoundary";
import SportXHub, { ALL_SPORTS } from "@/components/SportXHub";
const sport = ALL_SPORTS.find(s => s.id === "swimming") ?? ALL_SPORTS[0];
function SwimSurgeInner() { return <SportXHub sport={sport} />; }
export default function SwimSurge() {
  return <RouteErrorBoundary><SwimSurgeInner /></RouteErrorBoundary>;
}
