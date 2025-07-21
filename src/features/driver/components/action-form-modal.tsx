
import { DeleteModal } from '@/components/shared/common-delete-modal'
import { useUsersStore } from '../store/user.store'
import { ActionForm } from './action-form'

import { useCreateDriver, useUpdateDriver } from '../services/drivers.hook'
import { UserForm } from '../types'
export function ActionFormModal() {
    const { open, setOpen, currentRow, setCurrentRow } = useUsersStore()
    const { mutate: createMerchant, isPending: isCreateLoading } = useCreateDriver()
    const { mutate: updateMerchant, isPending: isUpdateLoading } = useUpdateDriver(currentRow?.user_id || '')
    const handleCreateMerchant = (values: UserForm) => {
        const payload: UserForm = {
            name: values.name,
            email: values.email,
            mobile: values.mobile,
            gender: values.gender,
            // isEdit: false
        }
        createMerchant(payload)
    }
    const handleEditMerchant = (values: UserForm) => {
        const payload = {
            name: values.name,
            // mobile: values.mobile,
            email: values.email,
            gender: values.gender,
            language: "english"
        }
        updateMerchant(payload)
    }
    const handleDeleteMerchant = () => {
        setOpen(null)
    }

    return (
        <>
            <ActionForm
                key='add-merchants'
                open={open === 'add'}
                loading={isCreateLoading}
                onOpenChange={(value) => setOpen(value ? 'add' : null)}
                onSubmit={handleCreateMerchant}
            />


            {currentRow && (
                <>
                    <ActionForm
                        key={`user-edit-${currentRow.email}`}
                        open={open === 'edit'}
                        onSubmit={handleEditMerchant}
                        loading={isUpdateLoading}
                        onOpenChange={() => {
                            setOpen('edit')
                            setTimeout(() => {
                                setCurrentRow(null)
                            }, 500)
                        }}
                        currentRow={currentRow}
                    />
                    <DeleteModal
                        onDelete={handleDeleteMerchant}
                        key={`user-delete-${currentRow.created_at}`}
                        open={open === 'delete'}
                        itemIdentifier={'created_at'}
                        itemName={'Merchant'}
                        onOpenChange={() => {
                            setOpen(null)
                            setTimeout(() => {
                                setCurrentRow(null)
                            }, 500)
                        }}
                        currentRow={currentRow}
                    />
                </>
            )}
        </>
    )
}
