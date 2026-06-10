import { RouteErrorBoundary } from "@/components/GlobalErrorBoundary";
import SportXHub, { ALL_SPORTS } from "@/components/SportXHub";
const sport = ALL_SPORTS.find(s => s.id === "paddle-tennis") ?? ALL_SPORTS[0];
function PaddleTennisEliteInner() { return <SportXHub sport={sport} />; }
export default function PaddleTennisElite() {
  return <RouteErrorBoundary><PaddleTennisEliteInner /></RouteErrorBoundary>;
}
