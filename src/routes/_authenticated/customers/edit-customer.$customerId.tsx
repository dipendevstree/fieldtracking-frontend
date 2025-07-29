import AddCustomerPage from '@/features/customers/components/add-customer'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_authenticated/customers/edit-customer/$customerId',
)({
  component: RouteComponent,
})

function RouteComponent() {
  return <AddCustomerPage/>
}
