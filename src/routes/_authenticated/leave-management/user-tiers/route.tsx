import UserTierManagement from "@/features/leave-management/components/user-tiers/UserTierManagement";
import { ProtectedRoute } from "@/permissions/components/ProtectedRoute";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute(
  "/_authenticated/leave-management/user-tiers"
)({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <ProtectedRoute requiredPermission="user_tiers">
      <UserTierManagement />
    </ProtectedRoute>
  );
}
