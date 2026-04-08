import { ColumnDef } from '@tanstack/react-table'
import { CustomDataTable } from '@/components/shared/custom-data-table'
import { PaginationCallbacks } from '@/components/shared/custom-table-pagination'
import { ExpenseLimit } from '../type/type'

interface LimitsControlsTableProps {
  data: ExpenseLimit[]
  columns: ColumnDef<ExpenseLimit>[]
  totalCount: number
  loading?: boolean
  paginationCallbacks?: PaginationCallbacks
  currentPage?: number
}

export function LimitsControlsTable({
  data,
  columns,
  totalCount,
  loading,
  paginationCallbacks,
  currentPage,
}: LimitsControlsTableProps) {

  return (
    <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-y-0 lg:space-x-12'>
      <CustomDataTable
        paginationCallbacks={paginationCallbacks}
        loading={loading}
        data={data}
        currentPage={currentPage}
        columns={columns as ColumnDef<unknown>[]}
        totalCount={totalCount}
        key={'limitsControls'}
      />
    </div>
  )
}