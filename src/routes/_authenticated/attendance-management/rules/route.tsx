import AttendanceRulesConfiguration from "@/features/attendance-management/components/attendance-rules/AttendanceRulesConfiguration";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute(
  "/_authenticated/attendance-management/rules"
)({
  component: RouteComponent,
});

function RouteComponent() {
  return <AttendanceRulesConfiguration />;
}
