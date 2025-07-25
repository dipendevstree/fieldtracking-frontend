import CustomerType from '@/features/customer-type'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/customer-type/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <CustomerType/>
}
