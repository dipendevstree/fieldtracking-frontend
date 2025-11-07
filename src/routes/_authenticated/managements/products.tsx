import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/managements/products')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_authenticated/managements/products"!</div>
}
