import { RouteErrorBoundary } from "@/components/GlobalErrorBoundary";
import SportXHub, { ALL_SPORTS } from "@/components/SportXHub";
const sport = ALL_SPORTS.find(s => s.id === "table-tennis") ?? ALL_SPORTS[0];
function TableTennisEliteInner() { return <SportXHub sport={sport} />; }
export default function TableTennisElite() {
  return <RouteErrorBoundary><TableTennisEliteInner /></RouteErrorBoundary>;
}
