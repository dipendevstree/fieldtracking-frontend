import { Navigate } from '@tanstack/react-router'
import { useAuthStore } from '@/stores/use-auth-store'
import SignInLeftSection from './components/superAdmin-sign-in-left-section'
import SignInSection from './components/superAdmin-sign-in-section'

export default function SuperAdminSignIn() {
  const { isAuthenticated } = useAuthStore()
  if (isAuthenticated) {
    return <Navigate to='/' />
  }
  return (
    <div className='relative container grid h-svh flex-col items-center justify-center lg:max-w-none lg:grid-cols-2 lg:px-0'>
      <SignInLeftSection />
      <SignInSection />
    </div>
  )
}
