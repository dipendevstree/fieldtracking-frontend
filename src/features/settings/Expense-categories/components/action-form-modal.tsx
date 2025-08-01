import { useEffect } from 'react'
import { DeleteModal } from '@/components/shared/common-delete-modal'
import {
  useCreateExpenseCategory,
  useUpdateExpenseCategory,
  useDeleteExpenseCategory,
  ExpenseCategoryPayload
} from '../services/expense-categories.hook'
import { useExpenseCategoriesStore } from '../store/expense-categories.store'
import { ExpenseCategoryActionForm } from './action-form'
import { TExpenseCategoryFormSchema } from '../data/schema'
import { toast } from 'sonner'

export function ExpenseCategoryActionModal() {
  const { open, setOpen, currentCategory, setCurrentCategory } = useExpenseCategoriesStore()
  
  const {
    mutate: createExpenseCategory,
    isPending: isCreateLoading,
    isSuccess: isCreateSuccess,
    isError: isCreateError,
  } = useCreateExpenseCategory()

  const {
    mutate: updateExpenseCategory,
    isPending: isUpdateLoading,
    isSuccess: isUpdateSuccess,
    isError: isUpdateError,
  } = useUpdateExpenseCategory(currentCategory?.categoryId || '')

  const {
    mutate: deleteExpenseCategory,
    isSuccess: isDeleteSuccess,
    isError: isDeleteError,
  } = useDeleteExpenseCategory(currentCategory?.categoryId || '')

  // Auto-close on successful create/update/delete
  useEffect(() => {
    if (
      (isCreateSuccess && !isCreateError) ||
      (isUpdateSuccess && !isUpdateError) ||
      (isDeleteSuccess && !isDeleteError)
    ) {
      closeModal()
    }
  }, [isCreateSuccess, isCreateError, isUpdateSuccess, isUpdateError, isDeleteSuccess, isDeleteError])

  const closeModal = () => {
    setOpen(null)
    setTimeout(() => setCurrentCategory(null), 300)
  }

  const handleCreateExpenseCategory = (values: TExpenseCategoryFormSchema) => {
    try {
      const payload: ExpenseCategoryPayload = {
        categoryName: values.categoryName.trim(),
        categoryType: values.categoryType,
        defaultLimit: values.defaultLimit,
        limitUnit: values.limitUnit,
        requiresReceipt: values.requiresReceipt,
        isActive: values.isActive,
        description: values.description?.trim(),
      }
      
      if (!payload.categoryName) {
        toast.error('Category name is required')
        return
      }
      
      createExpenseCategory(payload)
    } catch (error) {
      console.error('Error creating expense category:', error)
      toast.error('Failed to create expense category')
    }
  }

  const handleUpdateExpenseCategory = (values: TExpenseCategoryFormSchema) => {
    try {
      if (!currentCategory?.categoryId) {
        toast.error('Category ID is missing')
        return
      }
      
      const payload: ExpenseCategoryPayload = {
        categoryName: values.categoryName.trim(),
        categoryType: values.categoryType,
        defaultLimit: values.defaultLimit,
        limitUnit: values.limitUnit,
        requiresReceipt: values.requiresReceipt,
        isActive: values.isActive,
        description: values.description?.trim(),
      }
      
      if (!payload.categoryName) {
        toast.error('Category name is required')
        return
      }
      
      updateExpenseCategory(payload)
    } catch (error) {
      console.error('Error updating expense category:', error)
      toast.error('Failed to update expense category')
    }
  }

  const handleDeleteExpenseCategory = () => {
    try {
      if (!currentCategory?.categoryId) {
        toast.error('Category ID is missing')
        return
      }
      
      deleteExpenseCategory()
    } catch (error) {
      console.error('Error deleting expense category:', error)
      toast.error('Failed to delete expense category')
    }
  }

  return (
    <>
      {/* Add Modal */}
      <ExpenseCategoryActionForm
        key='add-expense-category'
        open={open === 'add-category'}
        loading={isCreateLoading}
        onSubmit={handleCreateExpenseCategory}
        onOpenChange={(value) => {
          if (!value) closeModal()
          else setOpen('add-category')
        }}
      />

      {/* Edit + Delete Modals */}
      {currentCategory && (
        <>
          <ExpenseCategoryActionForm
            key='edit-expense-category'
            open={open === 'edit-category'}
            loading={isUpdateLoading}
            currentRow={currentCategory}
            onSubmit={handleUpdateExpenseCategory}
            onOpenChange={(value) => {
              if (!value) closeModal()
              else setOpen('edit-category')
            }}
          />

          <DeleteModal
            key='delete-expense-category'
            open={open === 'delete-category'}
            currentRow={currentCategory}
            itemIdentifier={'categoryId' as keyof typeof currentCategory}
            itemName='Expense Category'
            onDelete={handleDeleteExpenseCategory}
            onOpenChange={(value) => {
              if (!value) closeModal()
              else setOpen('delete-category')
            }}
          />
        </>
      )}
    </>
  )
}
