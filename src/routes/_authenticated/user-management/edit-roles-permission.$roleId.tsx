import { createFileRoute } from '@tanstack/react-router'
import { ProtectedRoute } from '@/permissions/components/ProtectedRoute'
import { RoleActionForm } from '@/features/UserManagement/components/roles-action-form'

export const Route = createFileRoute(
  '/_authenticated/user-management/edit-roles-permission/$roleId'
)({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <ProtectedRoute requiredPermission='all_user'>
      <RoleActionForm isEdit={true} />
    </ProtectedRoute>
  )
}
