import { useState } from 'react'
import { DEFAULT_PAGE_NUMBER, DEFAULT_PAGE_SIZE } from '@/data/app.data'
import { cn } from '@/lib/utils'
import { Main } from '@/components/layout/main'
// import { EnhancedError } from '@/types'
// import { useGetNotificationsData } from './services/notificationshook'
// import { useNotificationsStore } from './store/notifications.store'
// import { ErrorPage } from '@/components/shared/custom-error'
import Notifications from './components/Notifications'
import { NotificationsActionModal } from './components/action-form-modal'

const NotificationsPage = () => {
  const [
    // pagination, setPagination
  ] = useState({
    page: DEFAULT_PAGE_NUMBER,
    limit: DEFAULT_PAGE_SIZE,
  })

  // Notifications data
  // const {
  //   notificationConfig,
  //   notificationRules = [],
  //   notificationTemplates = [],
  //   totalCount = 0,
  //   isLoading,
  //   error,
  // } = useGetNotificationsData(pagination)

  // const { setOpen, setCurrentConfig, setCurrentRule, setCurrentTemplate } = useNotificationsStore()

  // if (error) {
  //   const errorResponse = (error as EnhancedError)?.response?.data
  //   return (
  //     <ErrorPage
  //       errorCode={errorResponse?.statusCode}
  //       message={errorResponse?.message}
  //     />
  //   )
  // }

  const handleEditNotificationConfig = () => {
    // setCurrentConfig(notificationConfig)
    // setOpen('edit-config')
  }

  const handleAddNotificationRule = () => {
    // setOpen('add-rule')
  }

  const handleAddNotificationTemplate = () => {
    // setOpen('add-template')
  }

  return (
    <Main className={cn('flex flex-col gap-2 p-4')}>
      
      {/* Notifications Configuration Section */}
      <div className='mt-6'>
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Notification Configuration</h1>
          <p className="text-muted-foreground">
            Configure alerts, reminders, and notification preferences for various events.
          </p>
        </div>

        {/* Settings Configuration */}
        <div className="mb-8">
          <Notifications />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <button
            onClick={handleEditNotificationConfig}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
            // disabled={isLoading}
          >
            Edit Notification Configuration
          </button>
          <button
            onClick={handleAddNotificationRule}
            className="px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/90"
            // disabled={isLoading}
          >
            Add Notification Rule
          </button>
          <button
            onClick={handleAddNotificationTemplate}
            className="px-4 py-2 bg-accent text-accent-foreground rounded-md hover:bg-accent/90"
            // disabled={isLoading}
          >
            Add Notification Template
          </button>
        </div>
      </div>

      <NotificationsActionModal key={'notifications-action-modal'} />
    </Main>
  )
}

export default NotificationsPage
