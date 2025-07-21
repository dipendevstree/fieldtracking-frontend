import { createFileRoute } from '@tanstack/react-router'
import AllUsers from '@/features/UserManagement'

export const Route = createFileRoute('/_authenticated/users/')({
  component: AllUsers,
})
