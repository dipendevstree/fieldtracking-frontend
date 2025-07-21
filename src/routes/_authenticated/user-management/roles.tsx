import { createFileRoute } from '@tanstack/react-router'
import Roles from '@/features/UserManagement/components/roles'

export const Route = createFileRoute('/_authenticated/user-management/roles')({
  component: RouteComponent,
})

function RouteComponent() {
  return <Roles />
}
