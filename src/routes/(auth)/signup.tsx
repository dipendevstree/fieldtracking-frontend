import { createFileRoute } from '@tanstack/react-router'
import AdminSignUp from '@/features/auth/Admin-sign-up'

export const Route = createFileRoute('/(auth)/signup')({
  component: AdminSignUp,
})
