import MyLeaveBalance from "@/features/leave-management/components/user-view/MyLeaveBalance";
import { ProtectedRoute } from "@/permissions/components/ProtectedRoute";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute(
  "/_authenticated/leave-management/dashboard"
)({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <ProtectedRoute requiredPermission="dashboard">
      <MyLeaveBalance />
    </ProtectedRoute>
  );
}
