import { createFileRoute } from '@tanstack/react-router'
import AddCustomerPage from '../../../features/customers/components/add-customer'

  export const Route = createFileRoute('/_authenticated/customers/add-customer')({
  component: RouteComponent,
})

function RouteComponent() {
  return <AddCustomerPage />
} 