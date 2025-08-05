import { useLiveTrackingStore } from '../store/live-tracking.store'
import { LiveTrackingUserModal, TrackingSessionModal, TrackingEventsModal } from './action-form'

export function LiveTrackingActionModal() {
  const { 
    open, 
    setOpen, 
    currentUser, 
    setCurrentUser, 
    setCurrentSession,
    setCurrentEvents
  } = useLiveTrackingStore()

  const closeModal = () => {
    setOpen(null)
    setTimeout(() => {
      setCurrentUser(null)
      setCurrentSession(null)
      setCurrentEvents(null)
    }, 300)
  }

  return (
    <>
      {/* User Details Modal */}
      {currentUser && (
        <LiveTrackingUserModal
          key='user-details'
          currentUser={currentUser}
          open={open === 'view-user'}
          onOpenChange={(value) => {
            if (!value) closeModal()
            else setOpen('view-user')
          }}
        />
      )}

      {/* Tracking Session Modal */}
      {currentUser && (
        <TrackingSessionModal
          key='tracking-session'
          currentUser={currentUser}
          open={open === 'view-session'}
          onOpenChange={(value) => {
            if (!value) closeModal()
            else setOpen('view-session')
          }}
        />
      )}

      {/* Tracking Events Modal */}
      {currentUser && (
        <TrackingEventsModal
          key='tracking-events'
          currentUser={currentUser}
          open={open === 'view-events'}
          onOpenChange={(value) => {
            if (!value) closeModal()
            else setOpen('view-events')
          }}
        />
      )}
    </>
  )
}
