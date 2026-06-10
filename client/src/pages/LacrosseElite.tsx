import { RouteErrorBoundary } from "@/components/GlobalErrorBoundary";
import SportXHub, { ALL_SPORTS } from "@/components/SportXHub";
const sport = ALL_SPORTS.find(s => s.id === "lacrosse") ?? ALL_SPORTS[0];
function LacrosseEliteInner() { return <SportXHub sport={sport} />; }
export default function LacrosseElite() {
  return <RouteErrorBoundary><LacrosseEliteInner /></RouteErrorBoundary>;
}
