import { createFileRoute, Navigate } from '@tanstack/react-router'
import { RoleActionForm } from '@/features/UserManagement/components/roles-action-form'
import { PermissionGate } from '@/permissions/components/PermissionGate'

export const Route = createFileRoute(
  '/_authenticated/user-management/add-roles-permission'
)({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <PermissionGate requiredPermission="roles_permission" action="add" fallback={<Navigate to="/403" replace />}>
      <RoleActionForm />
    </PermissionGate>
  )
}
