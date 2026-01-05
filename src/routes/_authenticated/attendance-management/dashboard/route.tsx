import AttendanceDashboard from "@/features/attendance-management/components/attendance-dashboard";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute(
  "/_authenticated/attendance-management/dashboard"
)({
  component: RouteComponent,
});

function RouteComponent() {
  return <AttendanceDashboard />;
}
