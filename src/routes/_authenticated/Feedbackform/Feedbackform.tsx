import { createFileRoute } from '@tanstack/react-router'
import FeedbackForm from '@/features/Feedback-form/Feedback-form'

export const Route = createFileRoute(
  '/_authenticated/Feedbackform/Feedbackform'
)({
  component: RouteComponent,
})

function RouteComponent() {
  return <FeedbackForm />
}
