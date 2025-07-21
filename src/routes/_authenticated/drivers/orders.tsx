import ServiceProviderDetails from '@/components/layout/details-page-layout'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/drivers/orders')({
  component: RouteComponent,
})

function RouteComponent() {
  return <ServiceProviderDetails />
}
