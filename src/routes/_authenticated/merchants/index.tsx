import MerchantsPage from '@/features/merchants'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/merchants/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <MerchantsPage />
}