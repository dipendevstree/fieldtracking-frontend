import ApproversPage from '@/features/settings/Approvers'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/settings/Approvers')({
  component: RouteComponent,
})

function RouteComponent() {
  return <ApproversPage />
}
