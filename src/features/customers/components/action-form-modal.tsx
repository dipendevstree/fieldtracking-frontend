import { useEffect } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { DeleteModal } from '@/components/shared/common-delete-modal'
import {
  useUpdateCustomer,
  useDeleteCustomer
} from '../services/Customers.hook'
import { useCustomersStore } from '../store/customers.store'
import { Customer } from '../types'

// Import your actual form component or create a placeholder
const CustomerActionForm = (_props: { 
  open: boolean;
  loading?: boolean;
  onOpenChange: (value: boolean) => void;
  onSubmit: (values: Customer) => void;
  currentRow?: Customer;
}) => {
  return null; // Replace with your actual form implementation
}

export function CustomersActionModal() {
  const navigate = useNavigate()
  const { open, setOpen, currentRow, setCurrentRow } = useCustomersStore()
  const {
    isPending: isUpdateLoading,
    isSuccess: isUpdateSuccess,
    isError: isUpdateError,
  } = useUpdateCustomer(currentRow?.customerId ?? '')

  const {
    mutate: deleteCustomer,
    isSuccess: isDeleteSuccess,
  } = useDeleteCustomer(currentRow?.customerId ?? '', () => {
    setOpen(null)
    setCurrentRow(null)
  })

  useEffect(() => {
    if (
      (isUpdateSuccess || isDeleteSuccess) &&
      !isUpdateError
    ) {
      setOpen(null)
      setCurrentRow(null)
    }
  }, [
    isUpdateSuccess,
    isDeleteSuccess,
    isUpdateError,
    setOpen,
    setCurrentRow,
  ])

  // Handle edit redirection
  const handleEdit = () => {
    if (currentRow?.customerId) {
      navigate({ 
        to: '/customers/add-customer',
        search: { id: currentRow.customerId }
      })
    }
  }

  // Handle delete
  const handleDeleteCustomer = () => {
    if (currentRow?.customerId) {
      deleteCustomer()
    }
  }

  return (
    <>
      {currentRow && (
        <>
          <CustomerActionForm
            key={`customer-edit-${currentRow.customerId}`}
            open={open === 'edit'}
            loading={isUpdateLoading}
            onSubmit={() => {}}
            currentRow={currentRow}
            onOpenChange={(value: boolean) => {
              if (!value) {
                setOpen(null)
                setTimeout(() => setCurrentRow(null), 300)
              } else {
                handleEdit() // Redirect to edit page instead of opening modal
              }
            }}
          />
          <DeleteModal
            onDelete={handleDeleteCustomer}
            key={`customer-delete-${currentRow.customerId}`}
            open={open === 'delete'}
            itemIdentifier={'companyName' as any} 
            itemName={'Customer'}
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
