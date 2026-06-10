import { RouteErrorBoundary } from "@/components/GlobalErrorBoundary";
import SportXHub, { ALL_SPORTS } from "@/components/SportXHub";
const sport = ALL_SPORTS.find(s => s.id === "gymnastics") ?? ALL_SPORTS[0];
function GymnasticsEliteInner() { return <SportXHub sport={sport} />; }
export default function GymnasticsElite() {
  return <RouteErrorBoundary><GymnasticsEliteInner /></RouteErrorBoundary>;
}
