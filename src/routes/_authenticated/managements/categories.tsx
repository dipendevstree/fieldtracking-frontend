import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/managements/categories')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_authenticated/managements/categories"!</div>
}
