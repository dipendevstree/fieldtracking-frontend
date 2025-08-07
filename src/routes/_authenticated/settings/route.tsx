import { createFileRoute } from '@tanstack/react-router'
import Settings from '@/features/dashboard'

export const Route = createFileRoute('/_authenticated/settings')({
  component: Settings,
})
