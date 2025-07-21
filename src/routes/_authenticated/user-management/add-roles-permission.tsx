import { createFileRoute } from '@tanstack/react-router'
import { ProtectedRoute } from '@/permissions/components/ProtectedRoute'
import { RoleActionForm } from '@/features/UserManagement/components/roles-action-form'

export const Route = createFileRoute(
  '/_authenticated/user-management/add-roles-permission'
)({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <ProtectedRoute requiredPermission='all_users'>
      <RoleActionForm />
    </ProtectedRoute>
  )
}
