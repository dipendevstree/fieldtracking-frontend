import { createFileRoute } from '@tanstack/react-router'
import ExpenseApprovalsPage from '@/features/approvals'

export const Route = createFileRoute(
  '/_authenticated/approvals/monthly-consolidated'
)({
  component: RouteComponent,
})

function RouteComponent() {
  return <ExpenseApprovalsPage />
}
