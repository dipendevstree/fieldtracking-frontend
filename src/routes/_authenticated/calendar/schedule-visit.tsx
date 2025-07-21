import { createFileRoute } from '@tanstack/react-router'
import ScheduleVisitForm from '@/features/calendar/components/ScheduleVisitForm'

export const Route = createFileRoute(
  '/_authenticated/calendar/schedule-visit'
)({
  component: ScheduleVisitPage,
})

function ScheduleVisitPage() {
  return (
    <div className='container mx-auto px-4 py-8'>
      <div className='mb-4'>
        <h1 className='text-2xl font-bold'>Schedule a New Visit</h1>
        <p className='text-muted-foreground'>
          Fill out the form to schedule a visit.
        </p>
      </div>
      <ScheduleVisitForm onClose={() => window.history.back()} />
    </div>
  )
}
