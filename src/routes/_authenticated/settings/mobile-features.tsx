import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_authenticated/settings/mobile-features',
)({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_authenticated/settings/mobile-features"!</div>
}
