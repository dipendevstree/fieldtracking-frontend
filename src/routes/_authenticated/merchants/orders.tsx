import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/merchants/orders')({
  component: RouteComponent,
})



function RouteComponent() {
  return <>
    I am accessable by admin and merchant</>
}
