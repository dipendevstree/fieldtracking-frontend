import { ProtectedRoute } from "@/permissions/components/ProtectedRoute";
import { createFileRoute } from "@tanstack/react-router";
import LeaveApprovals from "@/features/settings/leaveApprovals";

export const Route = createFileRoute(
  "/_authenticated/settings/leave-approvals"
)({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <ProtectedRoute requiredPermission="leave-approvals">
      <LeaveApprovals />
    </ProtectedRoute>
  );
}
