import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/buyers/insurance')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_authenticated/businesses/insurance"!</div>
}
