import { ColumnDef } from '@tanstack/react-table'
import { CustomDataTable } from '@/components/shared/custom-data-table'
import { PaginationCallbacks } from '@/components/shared/custom-table-pagination'
import { SalesRep, DashboardStats } from '../type/type'
import { columns } from './columns'
import { Button } from '@/components/ui/button'
import { BarChart3 } from 'lucide-react'
import { useOverviewStore } from '../store/over-view.store'
import { OverviewActionModal } from './action-form-modal'

interface OverviewTableProps {
  data: SalesRep[]
  totalCount: number
  loading?: boolean
  paginationCallbacks: PaginationCallbacks
  currentPage?: number
  stats?: DashboardStats
}

const OverviewTable = ({
  data,
  totalCount,
  loading,
  paginationCallbacks,
  currentPage,
}: OverviewTableProps) => {
  const { setOpen } = useOverviewStore()

  const handleViewPerformance = () => {
    setOpen('view-performance')
  }

  return (
    <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-y-0 lg:space-x-12'>
      <div className="flex justify-end mb-4">
        <Button 
          onClick={handleViewPerformance} 
          className="flex items-center gap-1"
          disabled={loading}
        >
          <BarChart3 className="h-4 w-4" />
          View Performance
        </Button>
      </div>
      <CustomDataTable
        paginationCallbacks={paginationCallbacks}
        loading={loading}
        data={data}
        currentPage={currentPage}
        columns={columns as ColumnDef<unknown>[]}
        totalCount={totalCount}
        key={'overview'}
      />
      <OverviewActionModal key={'overview-action-modal'} />
    </div>
  )
}

export default OverviewTable
