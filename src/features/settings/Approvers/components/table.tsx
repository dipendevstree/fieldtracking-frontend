import { ColumnDef } from '@tanstack/react-table'
import { CustomDataTable } from '@/components/shared/custom-data-table'
import { PaginationCallbacks } from '@/components/shared/custom-table-pagination'
import { ApprovalHierarchy, CategoryApprover } from '../type/type'
import { hierarchyColumns, categoryApproverColumns } from './columns'
import { Button } from '@/components/ui/button'
import { PlusIcon } from 'lucide-react'
import { useApproversStore } from '../store/approvers.store'
import { ApproversActionModal } from './action-form-modal'

interface ApproversTableProps {
  hierarchyData: ApprovalHierarchy[]
  categoryData: CategoryApprover[]
  totalCount: number
  loading?: boolean
  paginationCallbacks: PaginationCallbacks
  currentPage?: number
}

const ApproversTable = ({
  hierarchyData,
  categoryData,
  totalCount,
  loading,
  paginationCallbacks,
  currentPage,
}: ApproversTableProps) => {
  const { setOpen } = useApproversStore()

  const handleAddHierarchy = () => {
    setOpen('add-hierarchy')
  }

  const handleAddCategory = () => {
    setOpen('add-category')
  }

  return (
    <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-y-0 lg:space-x-12'>
      {/* Approval Hierarchy Section */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Approval Hierarchy</h3>
        <Button 
            onClick={handleAddHierarchy} 
          className="flex items-center gap-1"
          disabled={loading}
        >
          <PlusIcon className="h-4 w-4" />
            Add Level
        </Button>
      </div>
      <CustomDataTable
        paginationCallbacks={paginationCallbacks}
        loading={loading}
          data={hierarchyData}
          currentPage={currentPage}
          columns={hierarchyColumns as ColumnDef<unknown>[]}
          totalCount={hierarchyData.length}
          key={'approval-hierarchy'}
        />
      </div>

      {/* Category Approvers Section */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Category-Specific Approvers</h3>
          <Button 
            onClick={handleAddCategory} 
            className="flex items-center gap-1"
            disabled={loading}
          >
            <PlusIcon className="h-4 w-4" />
            Add Category
          </Button>
        </div>
        <CustomDataTable
          paginationCallbacks={paginationCallbacks}
          loading={loading}
          data={categoryData}
        currentPage={currentPage}
          columns={categoryApproverColumns as ColumnDef<unknown>[]}
          totalCount={categoryData.length}
          key={'category-approvers'}
      />
      </div>

      <ApproversActionModal key={'approvers-action-modal'} />
    </div>
  )
}

export default ApproversTable
