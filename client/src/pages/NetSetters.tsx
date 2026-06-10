import { RouteErrorBoundary } from "@/components/GlobalErrorBoundary";
import SportXHub, { ALL_SPORTS } from "@/components/SportXHub";
const sport = ALL_SPORTS.find(s => s.id === "volleyball") ?? ALL_SPORTS[0];
function NetSettersInner() { return <SportXHub sport={sport} />; }
export default function NetSetters() {
  return <RouteErrorBoundary><NetSettersInner /></RouteErrorBoundary>;
}
