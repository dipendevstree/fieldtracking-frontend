import PlanHistoryFeature from "@/features/plan-history";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute(
  "/_authenticated/superadmin/plan-history/",
)({
  component: RouteComponent,
});

function RouteComponent() {
  return <PlanHistoryFeature />;
}
