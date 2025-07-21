import { Navigate } from '@tanstack/react-router'
import { useAuthStore } from '@/stores/use-auth-store'
import SignUpLeftSection from './components/Admin-sign-up-left-section'
import SignInSection from './components/Admin-sign-up-section'

export default function AdminSignUp() {
  const { isAuthenticated } = useAuthStore()
  if (isAuthenticated) {
    return <Navigate to='/' />
  }
  return (
    <div className='relative h-svh overflow-hidden lg:grid lg:grid-cols-2'>
      <SignUpLeftSection />
      <div className='flex items-center justify-center overflow-y-auto bg-white p-6 lg:p-12'>
        <SignInSection />
      </div>
    </div>
  )
}
