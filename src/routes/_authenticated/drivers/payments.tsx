import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/drivers/payments')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_authenticated/drivers/payments"!</div>
}
