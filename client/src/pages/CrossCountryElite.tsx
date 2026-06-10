import { RouteErrorBoundary } from "@/components/GlobalErrorBoundary";
import SportXHub, { ALL_SPORTS } from "@/components/SportXHub";
const sport = ALL_SPORTS.find(s => s.id === "cross-country") ?? ALL_SPORTS[0];
function CrossCountryEliteInner() { return <SportXHub sport={sport} />; }
export default function CrossCountryElite() {
  return <RouteErrorBoundary><CrossCountryEliteInner /></RouteErrorBoundary>;
}
