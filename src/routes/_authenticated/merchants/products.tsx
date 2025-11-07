import { RouteGuard } from '@/components/guards/route-guard'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/merchants/products')({
  component: RouteComponent,
})

function RouteComponent() {
  return <RouteGuard fallbackPath='/403' requiredAction='read' requiredResource='products' requiredRole='admin'>
    <div>Orders</div>
    <h1>I am accessable by admin and merchant</h1>
  </RouteGuard>
}

