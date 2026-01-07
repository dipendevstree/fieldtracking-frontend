import { createFileRoute } from "@tanstack/react-router";
import AttendanceApprovals from "@/features/attendance-management/components/attendance-approvals";
// import { ProtectedRoute } from "@/permissions/components/ProtectedRoute";

export const Route = createFileRoute(
  "/_authenticated/attendance-management/approvals"
)({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    // <ProtectedRoute requiredPermission="attendance_approvals">
    <AttendanceApprovals />
    // </ProtectedRoute>
  );
}
