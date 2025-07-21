import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/buyers/partnerships')(
  {
    component: RouteComponent,
  },
)

function RouteComponent() {
  return <div>Hello "/_authenticated/businesses/partnerships"!</div>
}
