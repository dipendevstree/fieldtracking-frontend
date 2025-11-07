import SettingPage from '@/features/settings'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/setting/')({
    component: RouteComponent,
})

function RouteComponent() {
  return (
    <SettingPage />
  )
}
