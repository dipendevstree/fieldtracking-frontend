import { createFileRoute } from '@tanstack/react-router'
import waitingPage from '@/features/auth/waitingforapproval'

export const Route = createFileRoute('/(auth)/watingforapproval')({
  component: waitingPage,
})
