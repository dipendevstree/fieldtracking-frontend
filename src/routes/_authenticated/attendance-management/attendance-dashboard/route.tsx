import AttendanceDashboard from "@/features/attendance-management/components/attendance-dashboard";
import { ProtectedRoute } from "@/permissions/components/ProtectedRoute";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute(
  "/_authenticated/attendance-management/attendance-dashboard"
)({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <ProtectedRoute requiredPermission="attendance_dashboard">
      <AttendanceDashboard />
    </ProtectedRoute>
  );
}
