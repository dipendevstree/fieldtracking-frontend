import { ColumnDef } from '@tanstack/react-table'
import { CustomDataTable } from '@/components/shared/custom-data-table'
import { PaginationCallbacks } from '@/components/shared/custom-table-pagination'
import { Approval } from '../type/type'
import { columns } from './columns'
import { Button } from '@/components/ui/button'
import { PlusIcon } from 'lucide-react'
import { useApprovalsStore } from '../store/approvals.store'
import { ApprovalActionModal } from './action-form-modal'

interface ApprovalsTableProps {
  data: Approval[]
  totalCount: number
  loading?: boolean
  paginationCallbacks: PaginationCallbacks
  currentPage?: number
}

const ApprovalsTable = ({
  data,
  totalCount,
  loading,
  paginationCallbacks,
  currentPage,
}: ApprovalsTableProps) => {
  const { setOpen } = useApprovalsStore()

  const handleAddWorkflow = () => {
    setOpen('workflow')
  }

  return (
    <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-y-0 lg:space-x-12'>
      <div className="flex justify-end mb-4">
        <Button 
          onClick={handleAddWorkflow} 
          className="flex items-center gap-1"
          disabled={loading}
        >
          <PlusIcon className="h-4 w-4" />
          Add Workflow
        </Button>
      </div>
      <CustomDataTable
        paginationCallbacks={paginationCallbacks}
        loading={loading}
        data={data}
        currentPage={currentPage}
        columns={columns as ColumnDef<unknown>[]}
        totalCount={totalCount}
        key={'approvals'}
      />
      <ApprovalActionModal key={'approval-action-modal'} />
    </div>
  )
}

export default ApprovalsTable
