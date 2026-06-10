import { RouteErrorBoundary } from "@/components/GlobalErrorBoundary";
import SportXHub, { ALL_SPORTS } from "@/components/SportXHub";
const sport = ALL_SPORTS.find(s => s.id === "field-hockey") ?? ALL_SPORTS[0];
function FieldHockeyElite2Inner() { return <SportXHub sport={sport} />; }
export default function FieldHockeyElite2() {
  return <RouteErrorBoundary><FieldHockeyElite2Inner /></RouteErrorBoundary>;
}
