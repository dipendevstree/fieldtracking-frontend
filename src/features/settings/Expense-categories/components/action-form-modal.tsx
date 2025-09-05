import { useEffect } from 'react'
import { DeleteModal } from '@/components/shared/common-delete-modal'
import { useExpenseCategoriesStore } from '../store/expense-categories.store'
import { ExpenseCategoryActionForm } from './action-form'
import {
  useCreateExpenseCategory,
  useDeleteExpenseCategory,
  useUpdateExpenseCategory,
} from '../services/expense-categories.hook'
import { toast } from 'sonner'

export function ExpenseCategoryActionModal() {
  const { open, setOpen, currentCategory, setCurrentCategory } = useExpenseCategoriesStore()
  
  // Debug: Log the current category structure and find correct ID field
  useEffect(() => {
    if (currentCategory) {
      console.log('Current category object:', currentCategory)
      console.log('Available fields in currentCategory:', Object.keys(currentCategory))
      console.log('categoryId value:', currentCategory.categoryId)
      // Check for alternative ID field names
      const altId = (currentCategory as any).id || (currentCategory as any).expensesCategoryId || (currentCategory as any).expenseCategoryId
      console.log('Alternative ID value:', altId)
    }
  }, [currentCategory])
  
  // Helper function to get the correct ID field
  const getCategoryId = (category: any) => {
    return category?.categoryId || category?.id || category?.expensesCategoryId || category?.expenseCategoryId || ''
  }
  
  const {
    mutate: createExpenseCategory,
    isPending: isCreateLoading,
    isSuccess: isCreateSuccess,
    isError: isCreateError,
  } = useCreateExpenseCategory(() => {
    console.log('Create success callback triggered')
    closeModal()
  })

  const {
    mutate: updateExpenseCategory,
    isPending: isUpdateLoading,
    isSuccess: isUpdateSuccess,
    isError: isUpdateError,
  } = useUpdateExpenseCategory(getCategoryId(currentCategory), () => {
    console.log('Update success callback triggered')
    closeModal()
  })

  const closeModal = () => {
    setOpen(null)
    setTimeout(() => setCurrentCategory(null), 300)
  }

  const handleCreateExpenseCategory = (values: any) => {
    const payload = {
      categoryName: values.categoryName.trim(),
    }
    createExpenseCategory(payload)
  }

  const handleUpdateExpenseCategory = (values: any) => {
    try {
      const categoryId = getCategoryId(currentCategory)
      if (!categoryId) {
        console.error('No category ID found for update. Current category:', currentCategory)
        toast.error('Category ID is missing. Please refresh and try again.')
        return
      }
      
      const payload = {
        categoryName: values.categoryName.trim(),
      }
      
      console.log('Updating category with ID:', categoryId, 'Payload:', payload)
      updateExpenseCategory(payload)
    } catch (error) {
      console.error('Error updating expense category:', error)
      toast.error('Failed to update expense category')
    }
  }

  const {
    mutate: deleteExpenseCategory,
    isSuccess: isDeleteSuccess,
    isError: isDeleteError,
  } = useDeleteExpenseCategory(getCategoryId(currentCategory));
  
  const handleDeleteExpenseCategory = () => {
    try {
      const categoryId = getCategoryId(currentCategory)
      if (!categoryId) {
        console.error('No category ID found. Current category:', currentCategory)
        toast.error('Category ID is missing. Please refresh and try again.')
        return
      }
      
      console.log('Deleting category with ID:', categoryId)
      deleteExpenseCategory()
    } catch (error) {
      console.error('Error deleting expense category:', error)
      toast.error('Failed to delete expense category')
    }
  }

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
            itemIdentifier={'categoryName' as keyof typeof currentCategory}
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
