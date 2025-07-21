import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/drivers/tracking')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_authenticated/drivers/tracking"!</div>
}
