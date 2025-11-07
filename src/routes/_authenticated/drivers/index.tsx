import DriverPage from '@/features/driver'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/drivers/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <DriverPage />
}
