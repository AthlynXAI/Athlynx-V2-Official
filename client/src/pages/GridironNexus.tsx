import { RouteErrorBoundary } from "@/components/GlobalErrorBoundary";
import SportXHub, { ALL_SPORTS } from "@/components/SportXHub";
const sport = ALL_SPORTS.find(s => s.id === "football") ?? ALL_SPORTS[0];
function GridironNexusInner() { return <SportXHub sport={sport} />; }
export default function GridironNexus() {
  return <RouteErrorBoundary><GridironNexusInner /></RouteErrorBoundary>;
}
