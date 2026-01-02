import LeaveTypeManagement from "@/features/leave-management/components/leave-types/LeaveTypeManagement";
import { ProtectedRoute } from "@/permissions/components/ProtectedRoute";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute(
  "/_authenticated/settings/leave-types"
)({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <ProtectedRoute requiredPermission="leave_types">
      <LeaveTypeManagement />
    </ProtectedRoute>
  );
}
