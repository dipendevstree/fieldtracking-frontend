import { createFileRoute } from '@tanstack/react-router'
import CalendarPage from '@/features/calendar'

export const Route = createFileRoute(
  '/_authenticated/calendar/task-assignment'
)({
  component: RouteComponent,
})

function RouteComponent() {
  return <CalendarPage />
}
