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
import LiveTrackingTable from './components/table'
import { useGetAllLiveTrackingUsers } from './services/Live-tracking.hook'
import { useLiveTrackingStore } from './store/live-tracking.store'
import { ErrorPage } from '@/components/shared/custom-error'

const LiveTracking = () => {
  const [pagination, setPagination] = useState({
    page: DEFAULT_PAGE_NUMBER,
    limit: DEFAULT_PAGE_SIZE,
    status: '',
    activityStatus: '',
    roleId: '',
    territoryId: '',
    dateFrom: new Date().toISOString().split('T')[0],
    dateTo: new Date().toISOString().split('T')[0],
    searchFor: '',
    includeLatLong: true,
  })

  // Live tracking data
  const {
    totalCount = 0,
    allUsers = [],
    stats,
    isLoading,
    error,
  } = useGetAllLiveTrackingUsers(pagination)

  const { setOpen } = useLiveTrackingStore()

  if (error) {
    const errorResponse = (error as ErrorResponse)?.response?.data
    return (
      <ErrorPage
        errorCode={errorResponse?.statusCode}
        message={errorResponse?.message}
      />
    )
  }

  const handleViewMap = () => {
    setOpen('settings')
  }

  const onPaginationChange = (page: number, pageSize: number) => {
    setPagination((prev) => ({ ...prev, page, limit: pageSize }))
  }

  return (
    <Main className={cn('flex flex-col gap-2 p-4')}>
      
      {/* Live Tracking Management Section */}
      <div className='mt-6'>
        <TablePageLayout
          title='Live Team Tracking'
          description='Real-time location and status of your field team'
          onAddButtonClick={handleViewMap}
          addButtonText='View Map'
        >
          <LiveTrackingTable
            data={allUsers}
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

export default LiveTracking

