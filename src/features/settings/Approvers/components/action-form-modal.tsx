import { useEffect } from 'react'
import { DeleteModal } from '@/components/shared/common-delete-modal'
import {
  useCreateApprovalHierarchy,
  useUpdateApprovalHierarchy,
  useDeleteApprovalHierarchy,
  useCreateCategoryApprover,
  useUpdateCategoryApprover,
  useDeleteCategoryApprover,
  ApprovalHierarchyPayload,
  CategoryApproverPayload
} from '../services/approvers.hook'
import { useApproversStore } from '../store/approvers.store'
import { HierarchyActionForm, CategoryApproverActionForm } from './action-form'
import { THierarchyFormSchema, TCategoryApproverFormSchema } from '../data/schema'
import { toast } from 'sonner'

export function ApproversActionModal() {
  const { 
    open, 
    setOpen, 
    currentHierarchy, 
    setCurrentHierarchy,
    currentCategory,
    setCurrentCategory
  } = useApproversStore()

  // Hierarchy hooks
  const {
    mutate: createHierarchy,
    isPending: isCreateHierarchyLoading,
    isSuccess: isCreateHierarchySuccess,
    isError: isCreateHierarchyError,
  } = useCreateApprovalHierarchy()

  const {
    mutate: updateHierarchy,
    isPending: isUpdateHierarchyLoading,
    isSuccess: isUpdateHierarchySuccess,
    isError: isUpdateHierarchyError,
  } = useUpdateApprovalHierarchy(currentHierarchy?.hierarchyId || '')

  const {
    mutate: deleteHierarchy,
    isSuccess: isDeleteHierarchySuccess,
    isError: isDeleteHierarchyError,
  } = useDeleteApprovalHierarchy(currentHierarchy?.hierarchyId || '')

  // Category approver hooks
  const {
    mutate: createCategoryApprover,
    isPending: isCreateCategoryLoading,
    isSuccess: isCreateCategorySuccess,
    isError: isCreateCategoryError,
  } = useCreateCategoryApprover()

  const {
    mutate: updateCategoryApprover,
    isPending: isUpdateCategoryLoading,
    isSuccess: isUpdateCategorySuccess,
    isError: isUpdateCategoryError,
  } = useUpdateCategoryApprover(currentCategory?.categoryId || '')

  const {
    mutate: deleteCategoryApprover,
    isSuccess: isDeleteCategorySuccess,
    isError: isDeleteCategoryError,
  } = useDeleteCategoryApprover(currentCategory?.categoryId || '')

  // Auto-close on successful operations
  useEffect(() => {
    if (
      (isCreateHierarchySuccess && !isCreateHierarchyError) ||
      (isUpdateHierarchySuccess && !isUpdateHierarchyError) ||
      (isDeleteHierarchySuccess && !isDeleteHierarchyError) ||
      (isCreateCategorySuccess && !isCreateCategoryError) ||
      (isUpdateCategorySuccess && !isUpdateCategoryError) ||
      (isDeleteCategorySuccess && !isDeleteCategoryError)
    ) {
      closeModal()
    }
  }, [
    isCreateHierarchySuccess, isCreateHierarchyError,
    isUpdateHierarchySuccess, isUpdateHierarchyError,
    isDeleteHierarchySuccess, isDeleteHierarchyError,
    isCreateCategorySuccess, isCreateCategoryError,
    isUpdateCategorySuccess, isUpdateCategoryError,
    isDeleteCategorySuccess, isDeleteCategoryError
  ])

  const closeModal = () => {
    setOpen(null)
    setTimeout(() => {
      setCurrentHierarchy(null)
      setCurrentCategory(null)
    }, 300)
  }

  // Hierarchy handlers
  const handleCreateHierarchy = (values: THierarchyFormSchema) => {
    try {
      const payload: ApprovalHierarchyPayload = {
        level: values.level,
        minAmount: values.minAmount,
        maxAmount: values.maxAmount,
        approverRole: values.approverRole.trim(),
        isRequired: values.isRequired,
      }
      
      if (!payload.approverRole) {
        toast.error('Approver role is required')
        return
      }
      
      createHierarchy(payload)
    } catch (error) {
      console.error('Error creating approval hierarchy:', error)
      toast.error('Failed to create approval hierarchy')
    }
  }

  const handleUpdateHierarchy = (values: THierarchyFormSchema) => {
    try {
      if (!currentHierarchy?.hierarchyId) {
        toast.error('Hierarchy ID is missing')
        return
      }
      
      const payload: ApprovalHierarchyPayload = {
        level: values.level,
        minAmount: values.minAmount,
        maxAmount: values.maxAmount,
        approverRole: values.approverRole.trim(),
        isRequired: values.isRequired,
      }
      
      if (!payload.approverRole) {
        toast.error('Approver role is required')
        return
      }
      
      updateHierarchy(payload)
    } catch (error) {
      console.error('Error updating approval hierarchy:', error)
      toast.error('Failed to update approval hierarchy')
    }
  }

  const handleDeleteHierarchy = () => {
    try {
      if (!currentHierarchy?.hierarchyId) {
        toast.error('Hierarchy ID is missing')
        return
      }
      
      deleteHierarchy()
    } catch (error) {
      console.error('Error deleting approval hierarchy:', error)
      toast.error('Failed to delete approval hierarchy')
    }
  }

  // Category approver handlers
  const handleCreateCategoryApprover = (values: TCategoryApproverFormSchema) => {
    try {
      const payload: CategoryApproverPayload = {
        categoryName: values.categoryName.trim(),
        approverRole: values.approverRole.trim(),
        isEnabled: values.isEnabled,
        description: values.description?.trim(),
      }
      
      if (!payload.categoryName) {
        toast.error('Category name is required')
        return
      }
      
      if (!payload.approverRole) {
        toast.error('Approver role is required')
        return
      }
      
      createCategoryApprover(payload)
    } catch (error) {
      console.error('Error creating category approver:', error)
      toast.error('Failed to create category approver')
    }
  }

  const handleUpdateCategoryApprover = (values: TCategoryApproverFormSchema) => {
    try {
      if (!currentCategory?.categoryId) {
        toast.error('Category ID is missing')
        return
      }
      
      const payload: CategoryApproverPayload = {
        categoryName: values.categoryName.trim(),
        approverRole: values.approverRole.trim(),
        isEnabled: values.isEnabled,
        description: values.description?.trim(),
      }
      
      if (!payload.categoryName) {
        toast.error('Category name is required')
        return
      }
      
      if (!payload.approverRole) {
        toast.error('Approver role is required')
        return
      }
      
      updateCategoryApprover(payload)
    } catch (error) {
      console.error('Error updating category approver:', error)
      toast.error('Failed to update category approver')
    }
  }

  const handleDeleteCategoryApprover = () => {
    try {
      if (!currentCategory?.categoryId) {
        toast.error('Category ID is missing')
        return
      }
      
      deleteCategoryApprover()
    } catch (error) {
      console.error('Error deleting category approver:', error)
      toast.error('Failed to delete category approver')
    }
  }

  return (
    <>
      {/* Hierarchy Modals */}
      <HierarchyActionForm
        key='add-hierarchy'
        open={open === 'add-hierarchy'}
        loading={isCreateHierarchyLoading}
        onSubmit={handleCreateHierarchy}
        onOpenChange={(value) => {
          if (!value) closeModal()
          else setOpen('add-hierarchy')
        }}
      />

      {currentHierarchy && (
        <>
          <HierarchyActionForm
            key='edit-hierarchy'
            open={open === 'edit-hierarchy'}
            loading={isUpdateHierarchyLoading}
            currentRow={currentHierarchy}
            onSubmit={handleUpdateHierarchy}
            onOpenChange={(value) => {
              if (!value) closeModal()
              else setOpen('edit-hierarchy')
            }}
          />

          <DeleteModal
            key='delete-hierarchy'
            open={open === 'delete-hierarchy'}
            currentRow={currentHierarchy}
            itemIdentifier={'hierarchyId' as keyof typeof currentHierarchy}
            itemName='Approval Level'
            onDelete={handleDeleteHierarchy}
            onOpenChange={(value) => {
              if (!value) closeModal()
              else setOpen('delete-hierarchy')
            }}
          />
        </>
      )}

      {/* Category Approver Modals */}
      <CategoryApproverActionForm
        key='add-category'
        open={open === 'add-category'}
        loading={isCreateCategoryLoading}
        onSubmit={handleCreateCategoryApprover}
        onOpenChange={(value) => {
          if (!value) closeModal()
          else setOpen('add-category')
        }}
      />

      {currentCategory && (
        <>
          <CategoryApproverActionForm
            key='edit-category'
            open={open === 'edit-category'}
            loading={isUpdateCategoryLoading}
            currentRow={currentCategory}
            onSubmit={handleUpdateCategoryApprover}
            onOpenChange={(value) => {
              if (!value) closeModal()
              else setOpen('edit-category')
            }}
          />

          <DeleteModal
            key='delete-category'
            open={open === 'delete-category'}
            currentRow={currentCategory}
            itemIdentifier={'categoryId' as keyof typeof currentCategory}
            itemName='Category Approver'
            onDelete={handleDeleteCategoryApprover}
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
