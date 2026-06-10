import { RouteErrorBoundary } from "@/components/GlobalErrorBoundary";
import SportXHub, { ALL_SPORTS } from "@/components/SportXHub";
const sport = ALL_SPORTS.find(s => s.id === "weightlifting") ?? ALL_SPORTS[0];
function WeightliftingEliteInner() { return <SportXHub sport={sport} />; }
export default function WeightliftingElite() {
  return <RouteErrorBoundary><WeightliftingEliteInner /></RouteErrorBoundary>;
}
