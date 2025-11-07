import BuyersPage from '@/features/buyers'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/buyers/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <BuyersPage />
}
