import { createFileRoute } from "@tanstack/react-router";
import Roles from "@/features/UserManagement/components/roles";
import { ProtectedRoute } from "@/permissions/components/ProtectedRoute";

export const Route = createFileRoute("/_authenticated/user-management/roles")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <ProtectedRoute requiredPermission="roles_permission">
      <Roles />
    </ProtectedRoute>
  );
}
