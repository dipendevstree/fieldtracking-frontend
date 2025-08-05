import { useEffect } from 'react'
// import { DeleteModal } from '@/components/shared/common-delete-modal'
import {
  useApproveRejectApproval,
  useCreateApprovalWorkflow,
  useUpdateApprovalWorkflow,
  useDeleteApprovalWorkflow,
  ApprovalActionPayload,
  ApprovalWorkflowPayload
} from '../services/Approvals.hook'
import { useApprovalsStore } from '../store/approvals.store'
import { ApprovalActionForm, WorkflowForm } from './action-form'
import { ApprovalActionSchema, ApprovalWorkflowSchema } from '../data/schema'
import { toast } from 'sonner'

export function ApprovalActionModal() {
  const { open, setOpen, currentApproval, setCurrentApproval, currentWorkflow, setCurrentWorkflow } = useApprovalsStore()
  
  // Approval actions
  const {
    mutate: approveRejectApproval,
    isPending: isActionLoading,
    isSuccess: isActionSuccess,
    isError: isActionError,
  }  = useApproveRejectApproval()

  // Workflow management
  const {
    mutate: createWorkflow,
    isPending: isCreateLoading,
    isSuccess: isCreateSuccess,
    isError: isCreateError,
  } = useCreateApprovalWorkflow()

  const {
    mutate: updateWorkflow,
    isPending: isUpdateLoading,
    isSuccess: isUpdateSuccess,
    isError: isUpdateError,
  } = useUpdateApprovalWorkflow(currentWorkflow?.workflowId || '')

  const {
    mutate: deleteWorkflow,
    isSuccess: isDeleteSuccess,
    isError: isDeleteError,
  } = useDeleteApprovalWorkflow(currentWorkflow?.workflowId || '')

  // Auto-close on successful actions
  useEffect(() => {
    if (
      (isActionSuccess && !isActionError) ||
      (isCreateSuccess && !isCreateError) ||
      (isUpdateSuccess && !isUpdateError) ||
      (isDeleteSuccess && !isDeleteError)
    ) {
      closeModal()
    }
  }, 
  // [isActionSuccess, isActionError, isCreateSuccess, isCreateError, isUpdateSuccess, isUpdateError, isDeleteSuccess, isDeleteError]
)

  const closeModal = () => {
    setOpen(null)
    setTimeout(() => {
      setCurrentApproval(null)
      setCurrentWorkflow(null)
    }, 300)
  }

  const handleApprovalAction = (values: ApprovalActionSchema) => {
    try {
      const payload: ApprovalActionPayload = {
        approvalId: values.approvalId,
        action: values.action,
        comment: values.comment,
        rejectionReason: values.rejectionReason,
      }
      
      if (!payload.approvalId) {
        toast.error('Approval ID is required')
        return
      }
      
      if (payload.action === 'reject' && !payload.rejectionReason) {
        toast.error('Rejection reason is required')
        return
      }
      
      approveRejectApproval(payload)
    } 
    catch (error) {
      toast.error('Error processing approval action')
    }
  }

  const handleCreateWorkflow = (values: ApprovalWorkflowSchema) => {
    try {
      const payload: ApprovalWorkflowPayload = {
        name: values.name.trim(),
        description: values.description?.trim(),
        type: values.type,
        steps: values.steps,
        isActive: values.isActive,
      }
      
      if (!payload.name) {
        toast.error('Workflow name is required')
        return
      }
      
      createWorkflow(payload)
    } catch (error) {
      console.error('Error creating workflow:', error)
      // Error handling is done in the hook
    }
  }

  const handleUpdateWorkflow = (values: ApprovalWorkflowSchema) => {
    try {
      if (!currentWorkflow?.workflowId) {
        toast.error('Workflow ID is missing')
        return
      }
      
      const payload: ApprovalWorkflowPayload = {
        name: values.name.trim(),
        description: values.description?.trim(),
        type: values.type,
        steps: values.steps,
        isActive: values.isActive,
      }
      
      if (!payload.name) {
        toast.error('Workflow name is required')
        return
      }
      
      updateWorkflow(payload)
    } catch (error) {
      console.error('Error updating workflow:', error)
      // Error handling is done in the hook
    }
  }

  const handleDeleteWorkflow = () => {
    try {
      if (!currentWorkflow?.workflowId) {
        toast.error('Workflow ID is missing')
        return
      }
      
      deleteWorkflow()
    } catch (error) {
      console.error('Error deleting workflow:', error)
      // Error handling is done in the hook
    }
  }

  return (
    <>
      {/* Approval Action Modal */}
      {currentApproval && (
        <ApprovalActionForm
          key='approval-action'
          currentApproval={currentApproval}
          open={open === 'approve' || open === 'reject'}
          loading={isActionLoading}
          onSubmit={handleApprovalAction}
          onOpenChange={(value) => {
            if (!value) closeModal()
            else setOpen(open)
          }}
          resetOnSubmitSuccess
        />
      )}

      {/* Workflow Management Modals */}
      <WorkflowForm
        key='add-workflow'
        open={open === 'workflow' && !currentWorkflow}
        loading={isCreateLoading}
        onSubmit={handleCreateWorkflow}
        onOpenChange={(value) => {
          if (!value) closeModal()
          else setOpen('workflow')
        }}
        resetOnSubmitSuccess
      />

      {currentWorkflow && (
        <>
          <WorkflowForm
            key='edit-workflow'
            currentWorkflow={currentWorkflow}
            open={open === 'workflow'}
            loading={isUpdateLoading}
            onSubmit={handleUpdateWorkflow}
            onOpenChange={(value) => {
              if (!value) closeModal()
              else setOpen('workflow')
            }}
          />

         {/* <DeleteModal
            key='delete-workflow'
            open={open === 'delete'} 
            currentRow={currentWorkflow}
            itemIdentifier={'workflowId' as keyof typeof currentWorkflow}
            itemName='Workflow'
            onDelete={handleDeleteWorkflow}
            onOpenChange={(value) => {
              if (!value) closeModal()
              else setOpen('delete')
            }}
          /> */}
        </>
      )}
    </>
  )
}
