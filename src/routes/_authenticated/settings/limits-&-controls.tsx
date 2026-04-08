import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_authenticated/settings/limits-&-controls',
)({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_authenticated/settings/limits-&-controls"!</div>
}
