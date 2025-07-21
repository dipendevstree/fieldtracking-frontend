import { jsonToFormData } from '@/utils/commonFunction'
import { DeleteModal } from '@/components/shared/common-delete-modal'
import {
  useCreateMerchant,
  useUpdateMerchant,
} from '../services/merchants.hook'
import { useUsersStore } from '../store/merchant.store'
import { MerchantForm } from '../types'
import { MerchantsActionForm } from './action-form'

export function MerchantsActionModal() {
  const { open, setOpen, currentRow, setCurrentRow } = useUsersStore()
  const { mutate: createMerchant, isPending: isCreateLoading } =
    useCreateMerchant()
  const { mutate: updateMerchant, isPending: isUpdateLoading } =
    useUpdateMerchant(currentRow?.user_id || '')
  const handleCreateMerchant = (values: MerchantForm) => {
    const payload = {
      name: values.name,
      email: values.email,
      mobile: values.mobile,
      gender: values.gender,
      password: values.password,
      user_name: values.user_name,
      merchant_id: values.merchant_id,
    }
    const formDataPayload = jsonToFormData(payload)
    createMerchant(formDataPayload)
  }
  const handleEditMerchant = (values: MerchantForm) => {
    const payload = {
      name: values.name,
      email: values.email,
      mobile: values.mobile,
      gender: values.gender,
      password: values.password,
      user_name: values.user_name,
      merchant_id: values.merchant_id,
    }
    const formDataPayload = jsonToFormData(payload)
    updateMerchant(formDataPayload)
  }
  const handleDeleteMerchant = () => {
    setOpen(null)
  }

  return (
    <>
      <MerchantsActionForm
        key='add-merchants'
        open={open === 'add'}
        loading={isCreateLoading}
        onOpenChange={(value) => setOpen(value ? 'add' : null)}
        onSubmit={handleCreateMerchant}
      />

      {currentRow && (
        <>
          <MerchantsActionForm
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
