import { RouteErrorBoundary } from "@/components/GlobalErrorBoundary";
import SportXHub, { ALL_SPORTS } from "@/components/SportXHub";
const sport = ALL_SPORTS.find(s => s.id === "softball") ?? ALL_SPORTS[0];
function SoftballNationInner() { return <SportXHub sport={sport} />; }
export default function SoftballNation() {
  return <RouteErrorBoundary><SoftballNationInner /></RouteErrorBoundary>;
}
