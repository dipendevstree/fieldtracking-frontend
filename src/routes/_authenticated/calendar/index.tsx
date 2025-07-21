import { createFileRoute } from '@tanstack/react-router'
import CalendarPage from '@/features/calendar'

export const Route = createFileRoute('/_authenticated/calendar/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    // <ProtectedRoute requiredPermission='organizations'>
    <CalendarPage />
    // </ProtectedRoute>
  )
}
