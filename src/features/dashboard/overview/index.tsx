import { useState } from 'react'
import { DEFAULT_PAGE_NUMBER, DEFAULT_PAGE_SIZE } from '@/data/app.data'
import { cn } from '@/lib/utils'
import { Main } from '@/components/layout/main'
import TablePageLayout from '@/components/layout/table-page-layout'
interface ErrorResponse {
  response?: {
    data?: {
      statusCode?: number
      message?: string
    }
  }
}
import OverviewTable from './components/table'
import { useGetAllSalesReps, useGetDashboardStats } from './services/OverView.hook'
import { useOverviewStore } from './store/over-view.store'
import { ErrorPage } from '@/components/shared/custom-error'

const Overview = () => {
  const [pagination, setPagination] = useState({
    page: DEFAULT_PAGE_NUMBER,
    limit: DEFAULT_PAGE_SIZE,
    status: '',
    roleId: '',
    territoryId: '',
    dateFrom: new Date().toISOString().split('T')[0],
    dateTo: new Date().toISOString().split('T')[0],
    searchFor: '',
    timeRange: 'today' as const,
  })

  // Overview data
  const {
    totalCount = 0,
    allSalesReps = [],
    isLoading,
    error,
  } = useGetAllSalesReps(pagination)

  // Dashboard stats
  const {
    stats,
    error: statsError,
  } = useGetDashboardStats(pagination)

  const { setOpen } = useOverviewStore()

  if (error || statsError) {
    const errorResponse = (error || statsError) as ErrorResponse
    return (
      <ErrorPage
        errorCode={errorResponse?.response?.data?.statusCode}
        message={errorResponse?.response?.data?.message}
      />
    )
  }

  const handleViewPerformance = () => {
    setOpen('view-performance')
  }

  const onPaginationChange = (page: number, pageSize: number) => {
    setPagination((prev) => ({ ...prev, page, limit: pageSize }))
  }

  return (
    <Main className={cn('flex flex-col gap-2 p-4')}>
      
      {/* Overview Management Section */}
      <div className='mt-6'>
        <TablePageLayout
          title='Dashboard Overview'
          description='Monitor your field sales team performance and activities'
          onAddButtonClick={handleViewPerformance}
          addButtonText='View Performance'
        >
          <OverviewTable
            data={allSalesReps}
            totalCount={totalCount}
            loading={isLoading}
            currentPage={pagination.page}
            paginationCallbacks={{ onPaginationChange }}
            stats={stats}
          />
        </TablePageLayout>
      </div>
    </Main>
  )
}

export default Overview

