import { createFileRoute } from '@tanstack/react-router'
import ExpenseApprovalsPage from '@/features/approvals'

export const Route = createFileRoute(
  '/_authenticated/approvals/reports-analytics',
)({
  component: RouteComponent,
})

function RouteComponent() {
  return < ExpenseApprovalsPage />
}
