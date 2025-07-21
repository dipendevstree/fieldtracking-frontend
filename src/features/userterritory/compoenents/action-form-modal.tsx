import { useEffect } from 'react'
import { DeleteModal } from '@/components/shared/common-delete-modal'
import {
  useCreateTerritory,
  useDeleteTerritory,
  useUpdateTerritory,
} from '../services/user-territory.hook'
import { useUserTerritoryStore } from '../store/users-territory.store'
import { UserTerritoryActionForm } from './action-form'

export function UserTerritoryActionModal() {
  const { open, setOpen, currentRow, setCurrentRow } = useUserTerritoryStore()
  const {
    mutate: createTerritory,
    isPending: isCreateLoading,
    isSuccess: isCreateSuccess,
    isError: isCreateError,
  } = useCreateTerritory()

  const {
    mutate: updateTerritory,
    isPending: isUpdateLoading,
    isSuccess: isUpdateSuccess,
    isError: isUpdateError,
  } = useUpdateTerritory(currentRow?.id || '')

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
    setTimeout(() => setCurrentRow(null), 300)
  }

  const handleCreateTerritory = (values: any) => {
    const payload = {
      name: values.name.trim(),
    }
    createTerritory(payload)
  }

  const handleUpdateTerritory = (values: any) => {
    const payload = {
      name: values.name.trim(),
    }
    updateTerritory(payload)
  }

  const { mutate: deleteTerritory } = useDeleteTerritory(
    currentRow?.id || '',
    () => {
      closeModal()
    }
  )
  const handleDeleteTerritory = () => {
    if (currentRow?.id) {
      deleteTerritory()
    } else {
      closeModal()
    }
  }

  return (
    <>
      {/* Add Modal */}
      <UserTerritoryActionForm
        key='add-territory'
        open={open === 'add'}
        loading={isCreateLoading}
        onSubmit={handleCreateTerritory}
        onOpenChange={(value) => {
          if (!value) closeModal()
          else setOpen('add')
        }}
      />

      {/* Edit + Delete Modals */}
      {currentRow && (
        <>
          <UserTerritoryActionForm
            key='edit-territory'
            open={open === 'edit'}
            loading={isUpdateLoading}
            currentRow={currentRow}
            onSubmit={handleUpdateTerritory}
            onOpenChange={(value) => {
              if (!value) closeModal()
              else setOpen('edit')
            }}
          />

          <DeleteModal
            key='delete-territory'
            open={open === 'delete'}
            currentRow={currentRow}
            itemIdentifier={'id' as keyof typeof currentRow}
            itemName='Territory'
            onDelete={handleDeleteTerritory}
            onOpenChange={(value) => {
              if (!value) closeModal()
              else setOpen('delete')
            }}
          />
        </>
      )}
    </>
  )
}
