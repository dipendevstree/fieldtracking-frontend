import AttendanceRulesConfiguration from "@/features/attendance-management/components/attendance-rules/AttendanceRulesConfiguration";
import { ProtectedRoute } from "@/permissions/components/ProtectedRoute";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute(
  "/_authenticated/attendance-management/rules"
)({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <ProtectedRoute requiredPermission="attendance_rules">
      <AttendanceRulesConfiguration />
    </ProtectedRoute>
  );
}
