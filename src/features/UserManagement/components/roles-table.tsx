import { ColumnDef } from '@tanstack/react-table'
import { CustomDataTable } from '@/components/shared/custom-data-table'
import { PaginationCallbacks } from '@/components/shared/custom-table-pagination'
import { columns } from './roles-columns'

interface UserTableProps {
  data: any[]
  totalCount: number
  loading?: boolean
  paginationCallbacks: PaginationCallbacks
  currentPage?: number
  
  hideActions?: boolean
}

const RolesTable = ({
  data,
  totalCount,
  loading,
  paginationCallbacks,
  currentPage,
  hideActions = false,
}: UserTableProps) => {
  const filteredColumns = hideActions
  ? columns.filter((column) => column.id !== 'actions')
  : columns

  return (
    <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-y-0 lg:space-x-12'>
      <CustomDataTable
        paginationCallbacks={paginationCallbacks}
        loading={loading}
        data={data}
        currentPage={currentPage}
        columns={filteredColumns as ColumnDef<unknown>[]}
        totalCount={totalCount}
        key={'roles'}
      />
    </div>
  )
}

export default RolesTable
