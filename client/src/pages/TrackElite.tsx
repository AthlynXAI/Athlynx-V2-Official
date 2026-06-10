import { RouteErrorBoundary } from "@/components/GlobalErrorBoundary";
import SportXHub, { ALL_SPORTS } from "@/components/SportXHub";
const sport = ALL_SPORTS.find(s => s.id === "track") ?? ALL_SPORTS[0];
function TrackEliteInner() { return <SportXHub sport={sport} />; }
export default function TrackElite() {
  return <RouteErrorBoundary><TrackEliteInner /></RouteErrorBoundary>;
}
