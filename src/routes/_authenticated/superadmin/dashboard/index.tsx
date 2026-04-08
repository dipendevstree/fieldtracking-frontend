import SuperAdminDashboard from '@/features/dashboard/super-admin'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/superadmin/dashboard/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <SuperAdminDashboard />
}
