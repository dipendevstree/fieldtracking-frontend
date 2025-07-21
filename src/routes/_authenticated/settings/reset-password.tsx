import UpdatePasswordPage from '@/features/settings/reset-password'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/settings/reset-password')(
  {
    component: RouteComponent,
  },
)

function RouteComponent() {
  return <UpdatePasswordPage />
}
