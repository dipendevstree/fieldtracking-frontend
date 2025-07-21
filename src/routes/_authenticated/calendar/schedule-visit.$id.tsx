import { createFileRoute, useRouter } from '@tanstack/react-router'
import ScheduleVisitForm from '@/features/calendar/components/ScheduleVisitForm'

export const Route = createFileRoute(
  '/_authenticated/calendar/schedule-visit/$id'
)({
  component: EditVisitPage,
})

function EditVisitPage() {
  const router = useRouter()

  return (
    <div className='container mx-auto px-4 py-8'>
      <div className='mb-4'>
        <h1 className='text-2xl font-bold'>Edit Visit</h1>
        <p className='text-muted-foreground'>Update the details below.</p>
      </div>
      <ScheduleVisitForm onClose={() => router.history.back()} />
    </div>
  )
}
