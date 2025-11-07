import { RouteGuard } from '@/components/guards/route-guard'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/merchants/payments')({
  component: RouteComponent,
})

function RouteComponent() {
  return <RouteGuard requiredRoles={['admin', 'merchant']}>
    <div>Orders</div>
    <h1>I am accessable by admin and merchant</h1>
  </RouteGuard>
}

