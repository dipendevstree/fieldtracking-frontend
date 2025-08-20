import { useEffect } from 'react'
import { DeleteModal } from '@/components/shared/common-delete-modal'
import { useExpenseCategoriesStore } from '../store/expense-categories.store'
import { ExpenseCategoryActionForm } from './action-form'
import {
  useCreateExpenseCategory,
  useDeleteExpenseCategory,
  useUpdateExpenseCategory,
} from '../services/expense-categories.hook'

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

  // Auto-close on successful create/update
  useEffect(() => {
    if (
      (isCreateSuccess && !isCreateError) ||
      (isUpdateSuccess && !isUpdateError)
    ) {
      closeModal()
    }
  }, [isCreateSuccess, isCreateError, isUpdateSuccess, isUpdateError])

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
    const payload = {
      categoryName: values.categoryName.trim(),
    }
    updateExpenseCategory(payload)
  }

  const { mutate: deleteExpenseCategory } = useDeleteExpenseCategory(
    currentCategory?.categoryId || '',
    () => {
      closeModal()
    }
  )
  
  const handleDeleteExpenseCategory = () => {
    if (currentCategory?.categoryId) {
      deleteExpenseCategory()
    } else {
      closeModal()
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
