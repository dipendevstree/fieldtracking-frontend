import { useEffect } from 'react'
import { DeleteModal } from '@/components/shared/common-delete-modal'
import {
  useCreateUsers,
  useDeleteUser,
  useUpdateUser,
} from '../services/AllUsers.hook'
import { useUsersStore } from '../store/users.store'
import { UserActionForm } from './action-form'

export function UsersActionModal() {
  const { open, setOpen, currentRow, setCurrentRow } = useUsersStore()

  const {
    mutate: createUser,
    isPending: isCreateLoading,
    isSuccess: isCreateSuccess,
    isError: isCreateError,
  } = useCreateUsers()

  const {
    mutate: updateUser,
    isSuccess: isUpdateSuccess,
    isError: isUpdateError,
  } = useUpdateUser(currentRow?.id || '')

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

  const handleCreateUser = (values: any) => {
    const fullPhone = values.phoneNumber || ''
    const nationalNumber = fullPhone.replace(values.countryCode, '')
    const payload = {
      email: values.email,
      firstName: values.firstName,
      lastName: values.lastName,
      phoneNumber: nationalNumber,
      countryCode: values.countryCode,
      tierkey: values.tierkey,
      roleId: values.roleId,
      jobTitle: '',
      departmentId: values.departmentId,
      reportingToRoleId: values.reportingToRoleId,
      isWebUser: values.isWebUser ?? false,
      reportingToIds: [values.reportingToIds],
      territoryId: values.territoryId,
    }

    createUser(payload)
  }

  const handleUpdateUser = (values: any) => {
    const fullPhone = values.phoneNumber || ''
    const nationalNumber = fullPhone.replace(values.countryCode, '')
    const payload = {
      email: values.email,
      firstName: values.firstName,
      lastName: values.lastName,
      phoneNumber: nationalNumber,
      countryCode: values.countryCode,
      tierkey: values.tierkey,
      roleId: values.roleId,
      jobTitle: '',
      departmentId: values.departmentId,
      reportingToRoleId: values.reportingToRoleId,
      isWebUser: values.isWebUser ?? false,
      reportingToIds: values.reportingToIds || [],
      territoryId: values.territoryId,
    }
    updateUser(payload)
  }

  const { mutate: deleteUser } = useDeleteUser(currentRow?.id || '', () => {
    closeModal()
  })

  const handleDeleteUser = () => {
    if (currentRow?.id) {
      deleteUser(currentRow?.id)
    } else {
      closeModal()
    }
  }

  return (
    <>
      {/* Add Modal */}
      <UserActionForm
        key='add-user'
        open={open === 'add'}
        loading={isCreateLoading}
        onSubmit={handleCreateUser}
        onOpenChange={(value) => {
          if (!value) closeModal()
          else setOpen('add')
        }}
      />

      {/* Edit + Delete Modals */}
      {currentRow && (
        <>
          <UserActionForm
            key='edit-user'
            open={open === 'edit'}
            // loading={isUpdateLoading}
            currentRow={{
              ...currentRow,
              status:
                typeof currentRow.status === 'boolean'
                  ? currentRow.status
                    ? 'active'
                    : 'inactive'
                  : currentRow.status,
              role:
                typeof currentRow.role === 'string'
                  ? currentRow.role
                  : String(currentRow.role),
            }}
            onSubmit={handleUpdateUser}
            onOpenChange={(value) => {
              if (!value) closeModal()
              else setOpen('edit')
            }}
          />

          <DeleteModal
            key='delete-user'
            open={open === 'delete'}
            currentRow={currentRow}
            itemIdentifier={'id' as keyof typeof currentRow}
            itemName='User'
            onDelete={handleDeleteUser}
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
