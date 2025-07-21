import { createFileRoute } from '@tanstack/react-router'
import AllUsers from '@/features/UserManagement'

export const Route = createFileRoute('/_authenticated/user-management/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <AllUsers />
}
