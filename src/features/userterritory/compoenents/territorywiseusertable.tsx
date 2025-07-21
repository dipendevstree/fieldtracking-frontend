import { ColumnDef } from '@tanstack/react-table'
import { CustomDataTable } from '@/components/shared/custom-data-table'
import { PaginationCallbacks } from '@/components/shared/custom-table-pagination'
import { Territory } from '../type/type'
import { columns } from './territorywiseusercolumns'

interface UserTerritoryTableProps {
  data: Territory[]
  totalCount: number
  loading?: boolean
  paginationCallbacks: PaginationCallbacks
  currentPage?: number
}

const TerritoryWiseUserTable = ({
  data,
  totalCount,
  loading,
  paginationCallbacks,
  currentPage,
}: UserTerritoryTableProps) => {
  return (
    <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-y-0 lg:space-x-12'>
      <CustomDataTable
        paginationCallbacks={paginationCallbacks}
        loading={loading}
        data={data}
        currentPage={currentPage}
        columns={columns as ColumnDef<unknown>[]}
        totalCount={totalCount}
        key={'territories'}
      />
    </div>
  )
}

export default TerritoryWiseUserTable
