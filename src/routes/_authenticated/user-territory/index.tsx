import { createFileRoute } from '@tanstack/react-router'
import { ProtectedRoute } from '@/permissions/components/ProtectedRoute'
import UserTerritory from '@/features/userterritory'

export const Route = createFileRoute('/_authenticated/user-territory/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <ProtectedRoute requiredPermission='user_territory'>
      <UserTerritory />
    </ProtectedRoute>
  )
}
