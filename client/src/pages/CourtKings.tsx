import { RouteErrorBoundary } from "@/components/GlobalErrorBoundary";
import SportXHub, { ALL_SPORTS } from "@/components/SportXHub";
const sport = ALL_SPORTS.find(s => s.id === "basketball") ?? ALL_SPORTS[0];
function CourtKingsInner() { return <SportXHub sport={sport} />; }
export default function CourtKings() {
  return <RouteErrorBoundary><CourtKingsInner /></RouteErrorBoundary>;
}
