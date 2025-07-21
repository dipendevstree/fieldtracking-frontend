import { createFileRoute } from '@tanstack/react-router'
import SuperAdminSignIn from '@/features/auth/superAdmin-sign-in'

export const Route = createFileRoute('/(auth)/superadmin-sign-in')({
  component: SuperAdminSignIn,
})
