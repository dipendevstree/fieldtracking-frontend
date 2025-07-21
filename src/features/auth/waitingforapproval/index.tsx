import { Clock } from 'lucide-react'

export default function WaitingPage() {
  return (
    <div className='flex min-h-screen items-center justify-center bg-black'>
      <div className='animate-fade-in-down w-full max-w-md space-y-6 rounded-2xl border border-white/10 bg-white/5 p-10 text-center shadow-2xl backdrop-blur-sm'>
        <div className='flex justify-center'>
          <Clock className='h-12 w-12 animate-pulse text-white' />
        </div>
        <h2 className='text-2xl font-semibold text-white'>
          Waiting for Approval
        </h2>
        <p className='text-gray-300'>
          Your registration has been submitted successfully. Please wait while
          we review your information.
        </p>
        <div className='text-sm text-gray-500'>
          We’ll notify you once your account is approved.
        </div>
      </div>
    </div>
  )
}
