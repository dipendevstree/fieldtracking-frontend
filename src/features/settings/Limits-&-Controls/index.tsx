import { useState } from 'react'
import { DEFAULT_PAGE_NUMBER, DEFAULT_PAGE_SIZE } from '@/data/app.data'
import { cn } from '@/lib/utils'
import { Main } from '@/components/layout/main'
import LimitsControls from './components/LimitsControls'
import { LimitsControlsActionModal } from './components/action-form-modal'

const LimitsControlsPage = () => {
  const [_pagination, _setPagination] = useState({
    page: DEFAULT_PAGE_NUMBER,
    limit: DEFAULT_PAGE_SIZE,
  })

  // Limits Controls data
  // const {
  //   expenseLimits = [],
  //   locationAdjustments = [],
  //   expirySettings,
  //   totalCount = 0,
  //   isLoading,
  //   error,
  // } = useGetLimitsControlsData(pagination)

  // const { setOpen, setCurrentLimit, setCurrentAdjustment, setCurrentExpirySettings } = useLimitsControlsStore()

  // if (error) {
  //   const errorResponse = (error as EnhancedError)?.response?.data
  //   return (
  //     <ErrorPage
  //       errorCode={errorResponse?.statusCode}
  //       message={errorResponse?.message}
  //     />
  //   )
  // }

  const handleAddExpenseLimit = () => {
      // setOpen('add-limit')
  }

  const handleAddLocationAdjustment = () => {
    // setOpen('add-adjustment')
  }

  const handleEditExpirySettings = () => {
    // setCurrentExpirySettings(expirySettings)
    // setOpen('edit-expiry-settings')
  }

  return (
    <Main className={cn('flex flex-col gap-2 p-4')}>
      
      {/* Limits Controls Configuration Section */}
      <div className='mt-6'>
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Expense Limits & Controls</h1>
          <p className="text-muted-foreground">
            Configure expense limits based on designation, location, and category.
          </p>
        </div>

        {/* Settings Configuration */}
        <div className="mb-8">
          <LimitsControls />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <button
            onClick={handleAddExpenseLimit}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
            // disabled={isLoading}
          >
            Add Expense Limit
          </button>
          <button
            onClick={handleAddLocationAdjustment}
            className="px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/90"
            // disabled={isLoading}
          >
            Add Location Adjustment
          </button>
          <button
            onClick={handleEditExpirySettings}
            className="px-4 py-2 bg-accent text-accent-foreground rounded-md hover:bg-accent/90"
            // disabled={isLoading}
          >
            Edit Expiry Settings
          </button>
        </div>
      </div>

      <LimitsControlsActionModal key={'limits-controls-action-modal'} />
    </Main>
  )
}

export default LimitsControlsPage
