import { useEffect } from 'react'
import { DeleteModal } from '@/components/shared/common-delete-modal'
import {
  useCreateExpenseLimit,
  useUpdateExpenseLimit,
  useDeleteExpenseLimit,
  useCreateLocationAdjustment,
  useUpdateLocationAdjustment,
  useDeleteLocationAdjustment,
  useUpdateExpenseExpirySettings,
  ExpenseLimitPayload,
  LocationAdjustmentPayload,
  ExpenseExpirySettingsPayload
} from '../services/LImits&Controlshook'
import { useLimitsControlsStore } from '../store/limits-&-controls.store'
import { ExpenseLimitActionForm, LocationAdjustmentActionForm, ExpenseExpirySettingsActionForm } from './action-form'
import { TExpenseLimitFormSchema, TLocationAdjustmentFormSchema, TExpenseExpirySettingsFormSchema } from '../data/schema'
import { toast } from 'sonner'

export function LimitsControlsActionModal() {
  const { 
    open, 
    setOpen, 
    currentLimit, 
    setCurrentLimit,
    currentAdjustment,
    setCurrentAdjustment,
    currentExpirySettings,
    setCurrentExpirySettings
  } = useLimitsControlsStore()

  // Expense Limit hooks
  const {
    mutate: createExpenseLimit,
    isPending: isCreateLimitLoading,
    isSuccess: isCreateLimitSuccess,
    isError: isCreateLimitError,
  } = useCreateExpenseLimit()

  const {
    mutate: updateExpenseLimit,
    isPending: isUpdateLimitLoading,
    isSuccess: isUpdateLimitSuccess,
    isError: isUpdateLimitError,
  } = useUpdateExpenseLimit(currentLimit?.limitId || '')

  const {
    mutate: deleteExpenseLimit,
    isSuccess: isDeleteLimitSuccess,
    isError: isDeleteLimitError,
  } = useDeleteExpenseLimit(currentLimit?.limitId || '')

  // Location Adjustment hooks
  const {
    mutate: createLocationAdjustment,
    isPending: isCreateAdjustmentLoading,
    isSuccess: isCreateAdjustmentSuccess,
    isError: isCreateAdjustmentError,
  } = useCreateLocationAdjustment()

  const {
    mutate: updateLocationAdjustment,
    isPending: isUpdateAdjustmentLoading,
    isSuccess: isUpdateAdjustmentSuccess,
    isError: isUpdateAdjustmentError,
  } = useUpdateLocationAdjustment(currentAdjustment?.adjustmentId || '')

  const {
    mutate: deleteLocationAdjustment,
    isSuccess: isDeleteAdjustmentSuccess,
    isError: isDeleteAdjustmentError,
  } = useDeleteLocationAdjustment(currentAdjustment?.adjustmentId || '')

  // Expense Expiry Settings hooks
  const {
    mutate: updateExpenseExpirySettings,
    isPending: isUpdateExpirySettingsLoading,
    isSuccess: isUpdateExpirySettingsSuccess,
    isError: isUpdateExpirySettingsError,
  } = useUpdateExpenseExpirySettings()

  // Auto-close on successful operations
  useEffect(() => {
    if (
      (isCreateLimitSuccess && !isCreateLimitError) ||
      (isUpdateLimitSuccess && !isUpdateLimitError) ||
      (isDeleteLimitSuccess && !isDeleteLimitError) ||
      (isCreateAdjustmentSuccess && !isCreateAdjustmentError) ||
      (isUpdateAdjustmentSuccess && !isUpdateAdjustmentError) ||
      (isDeleteAdjustmentSuccess && !isDeleteAdjustmentError) ||
      (isUpdateExpirySettingsSuccess && !isUpdateExpirySettingsError)
    ) {
      closeModal()
    }
  }, [
    isCreateLimitSuccess, isCreateLimitError,
    isUpdateLimitSuccess, isUpdateLimitError,
    isDeleteLimitSuccess, isDeleteLimitError,
    isCreateAdjustmentSuccess, isCreateAdjustmentError,
    isUpdateAdjustmentSuccess, isUpdateAdjustmentError,
    isDeleteAdjustmentSuccess, isDeleteAdjustmentError,
    isUpdateExpirySettingsSuccess, isUpdateExpirySettingsError
  ])

  const closeModal = () => {
    setOpen(null)
    setTimeout(() => {
      setCurrentLimit(null)
      setCurrentAdjustment(null)
      setCurrentExpirySettings(null)
    }, 300)
  }

  // Expense Limit handlers
  const handleCreateExpenseLimit = (values: TExpenseLimitFormSchema) => {
    try {
      const payload: ExpenseLimitPayload = {
        designation: values.designation.trim(),
        dailyLimit: values.dailyLimit,
        monthlyLimit: values.monthlyLimit,
        travelLimit: values.travelLimit,
        isActive: values.isActive,
      }
      
      if (!payload.designation) {
        toast.error('Designation is required')
        return
      }
      
      createExpenseLimit(payload)
    } catch (error) {
      console.error('Error creating expense limit:', error)
      toast.error('Failed to create expense limit')
    }
  }

  const handleUpdateExpenseLimit = (values: TExpenseLimitFormSchema) => {
    try {
      if (!currentLimit?.limitId) {
        toast.error('Limit ID is missing')
        return
      }
      
      const payload: ExpenseLimitPayload = {
        designation: values.designation.trim(),
        dailyLimit: values.dailyLimit,
        monthlyLimit: values.monthlyLimit,
        travelLimit: values.travelLimit,
        isActive: values.isActive,
      }
      
      if (!payload.designation) {
        toast.error('Designation is required')
        return
      }
      
      updateExpenseLimit(payload)
    } catch (error) {
      console.error('Error updating expense limit:', error)
      toast.error('Failed to update expense limit')
    }
  }

  const handleDeleteExpenseLimit = () => {
    try {
      if (!currentLimit?.limitId) {
        toast.error('Limit ID is missing')
        return
      }
      
      deleteExpenseLimit()
    } catch (error) {
      console.error('Error deleting expense limit:', error)
      toast.error('Failed to delete expense limit')
    }
  }

  // Location Adjustment handlers
  const handleCreateLocationAdjustment = (values: TLocationAdjustmentFormSchema) => {
    try {
      const payload: LocationAdjustmentPayload = {
        locationType: values.locationType,
        adjustmentPercentage: values.adjustmentPercentage,
        isActive: values.isActive,
      }
      
      createLocationAdjustment(payload)
    } catch (error) {
      console.error('Error creating location adjustment:', error)
      toast.error('Failed to create location adjustment')
    }
  }

  const handleUpdateLocationAdjustment = (values: TLocationAdjustmentFormSchema) => {
    try {
      if (!currentAdjustment?.adjustmentId) {
        toast.error('Adjustment ID is missing')
        return
      }
      
      const payload: LocationAdjustmentPayload = {
        locationType: values.locationType,
        adjustmentPercentage: values.adjustmentPercentage,
        isActive: values.isActive,
      }
      
      updateLocationAdjustment(payload)
    } catch (error) {
      console.error('Error updating location adjustment:', error)
      toast.error('Failed to update location adjustment')
    }
  }

  const handleDeleteLocationAdjustment = () => {
    try {
      if (!currentAdjustment?.adjustmentId) {
        toast.error('Adjustment ID is missing')
        return
      }
      
      deleteLocationAdjustment()
    } catch (error) {
      console.error('Error deleting location adjustment:', error)
      toast.error('Failed to delete location adjustment')
    }
  }

  // Expense Expiry Settings handlers
  const handleUpdateExpenseExpirySettings = (values: TExpenseExpirySettingsFormSchema) => {
    try {
      const payload: ExpenseExpirySettingsPayload = {
        submissionDeadline: values.submissionDeadline,
        warningPeriod: values.warningPeriod,
        autoRejectAfterExpiry: values.autoRejectAfterExpiry,
        allowLateSubmissions: values.allowLateSubmissions,
      }
      
      updateExpenseExpirySettings(payload)
    } catch (error) {
      console.error('Error updating expiry settings:', error)
      toast.error('Failed to update expiry settings')
    }
  }

  return (
    <>
      {/* Expense Limit Modals */}
      <ExpenseLimitActionForm
        key='add-limit'
        open={open === 'add-limit'}
        loading={isCreateLimitLoading}
        onSubmit={handleCreateExpenseLimit}
        onOpenChange={(value) => {
          if (!value) closeModal()
          else setOpen('add-limit')
        }}
      />

      {currentLimit && (
        <>
          <ExpenseLimitActionForm
            key='edit-limit'
            open={open === 'edit-limit'}
            loading={isUpdateLimitLoading}
            currentLimit={currentLimit}
            onSubmit={handleUpdateExpenseLimit}
            onOpenChange={(value) => {
              if (!value) closeModal()
              else setOpen('edit-limit')
            }}
          />

          <DeleteModal
            key='delete-limit'
            open={open === 'delete-limit'}
            currentRow={currentLimit}
            itemIdentifier={'limitId' as keyof typeof currentLimit}
            itemName='Expense Limit'
            onDelete={handleDeleteExpenseLimit}
            onOpenChange={(value) => {
              if (!value) closeModal()
              else setOpen('delete-limit')
            }}
          />
        </>
      )}

      {/* Location Adjustment Modals */}
      <LocationAdjustmentActionForm
        key='add-adjustment'
        open={open === 'add-adjustment'}
        loading={isCreateAdjustmentLoading}
        onSubmit={handleCreateLocationAdjustment}
        onOpenChange={(value) => {
          if (!value) closeModal()
          else setOpen('add-adjustment')
        }}
      />

      {currentAdjustment && (
        <>
          <LocationAdjustmentActionForm
            key='edit-adjustment'
            open={open === 'edit-adjustment'}
            loading={isUpdateAdjustmentLoading}
            currentAdjustment={currentAdjustment}
            onSubmit={handleUpdateLocationAdjustment}
            onOpenChange={(value) => {
              if (!value) closeModal()
              else setOpen('edit-adjustment')
            }}
          />

          <DeleteModal
            key='delete-adjustment'
            open={open === 'delete-adjustment'}
            currentRow={currentAdjustment}
            itemIdentifier={'adjustmentId' as keyof typeof currentAdjustment}
            itemName='Location Adjustment'
            onDelete={handleDeleteLocationAdjustment}
            onOpenChange={(value) => {
              if (!value) closeModal()
              else setOpen('delete-adjustment')
            }}
          />
        </>
      )}

      {/* Expense Expiry Settings Modal */}
      <ExpenseExpirySettingsActionForm
        key='edit-expiry-settings'
        open={open === 'edit-expiry-settings'}
        loading={isUpdateExpirySettingsLoading}
        currentSettings={currentExpirySettings}
        onSubmit={handleUpdateExpenseExpirySettings}
        onOpenChange={(value) => {
          if (!value) closeModal()
          else setOpen('edit-expiry-settings')
        }}
      />
    </>
  )
}
