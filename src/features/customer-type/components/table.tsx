import { ColumnDef } from '@tanstack/react-table'
import { CustomDataTable } from '@/components/shared/custom-data-table'
import { PaginationCallbacks } from '@/components/shared/custom-table-pagination'
import { CustomerType } from '../type/type'
import { columns } from './columns'
import { Button } from '@/components/ui/button'
import { PlusIcon } from 'lucide-react'
import { useCustomerTypeStore } from '../store/customer-type.store'
import { CustomerTypeActionModal } from './action-form-modal'

interface CustomerTypeTableProps {
  data: CustomerType[]
  totalCount: number
  loading?: boolean
  paginationCallbacks: PaginationCallbacks
  currentPage?: number
}

const CustomerTypeTable = ({
  data,
  totalCount,
  loading,
  paginationCallbacks,
  currentPage,
}: CustomerTypeTableProps) => {
  const { setOpen } = useCustomerTypeStore()

  const handleAddCustomerType = () => {
    setOpen('add')
  }

  return (
    <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-y-0 lg:space-x-12'>
      <div className="flex justify-end mb-4">
        <Button 
          onClick={handleAddCustomerType} 
          className="flex items-center gap-1"
          disabled={loading}
        >
          <PlusIcon className="h-4 w-4" />
          Add Customer Type
        </Button>
      </div>
      <CustomDataTable
        paginationCallbacks={paginationCallbacks}
        loading={loading}
        data={data}
        currentPage={currentPage}
        columns={columns as ColumnDef<unknown>[]}
        totalCount={totalCount}
        key={'customerType'}
      />
      <CustomerTypeActionModal key={'CustomerType-action-modal'} />
    </div>
  )
}

export default CustomerTypeTable
