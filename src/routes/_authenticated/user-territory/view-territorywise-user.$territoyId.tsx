import { createFileRoute } from '@tanstack/react-router'
import { ProtectedRoute } from '@/permissions/components/ProtectedRoute'
import TerritoryWiseUser from '@/features/userterritory/compoenents/territorywiseuser'

export const Route = createFileRoute(
  '/_authenticated/user-territory/view-territorywise-user/$territoyId'
)({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <ProtectedRoute requiredPermission='user_territory'>
      <TerritoryWiseUser />
    </ProtectedRoute>
  )
}
