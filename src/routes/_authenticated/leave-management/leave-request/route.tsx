import { createFileRoute } from "@tanstack/react-router";
import { ProtectedRoute } from "@/permissions/components/ProtectedRoute";
import LeaveRequest from "@/features/leave-management/components/leave-request/LeaveRequest";

export const Route = createFileRoute(
  "/_authenticated/leave-management/leave-request",
)({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <ProtectedRoute requiredPermission="leave_request">
      <LeaveRequest />
    </ProtectedRoute>
  );
}
