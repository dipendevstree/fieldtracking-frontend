import { createFileRoute, Navigate } from "@tanstack/react-router";
import { RoleActionForm } from "@/features/UserManagement/components/roles-action-form";
import { PermissionGate } from "@/permissions/components/PermissionGate";

export const Route = createFileRoute(
  "/_authenticated/user-management/edit-roles-permission/$roleId"
)({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <PermissionGate
      requiredPermission="roles_permission"
      action="edit"
      fallback={<Navigate to="/403" replace />}
    >
      <RoleActionForm isEdit={true} />
    </PermissionGate>
  );
}
