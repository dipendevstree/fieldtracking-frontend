import { useState } from 'react'
import { DEFAULT_PAGE_NUMBER, DEFAULT_PAGE_SIZE } from '@/data/app.data'
import { cn } from '@/lib/utils'
import { Main } from '@/components/layout/main'
import TablePageLayout from '@/components/layout/table-page-layout'
import { EnhancedError } from '@/types'
import FieldTrackingTable from './components/table'
// import { useGetFieldTrackingData } from './services/field-tracking.hook'
// import { useFieldTrackingStore } from './store/field-tracking.store'
import { ErrorPage } from '@/components/shared/custom-error'
import FieldTracking from './components/FieldTracking'

const FieldTrackingPage = () => {
  const [pagination, setPagination] = useState({
    page: DEFAULT_PAGE_NUMBER,
    limit: DEFAULT_PAGE_SIZE,
  })

  // Field Tracking data
  // const {
  //   fieldTrackingConfig,
  //   trackingRules = [],
  //   geofenceZones = [],
  //   totalCount = 0,
  //   isLoading,
  //   error,
  // } = useGetFieldTrackingData(pagination)

  // const { setOpen } = useFieldTrackingStore()/

  // if (error) {
  //   const errorResponse = (error as EnhancedError)?.response?.data
  //   return (
  //     <ErrorPage
  //       errorCode={errorResponse?.statusCode}
  //       message={errorResponse?.message}
  //     />
  //   )
  // }

  const handleAddTrackingRule = () => {
    // setOpen('add-rule')
  }

  const handleAddGeofenceZone = () => {
    // setOpen('add-zone')
  }

  const onPaginationChange = (page: number, pageSize: number) => {
    setPagination((prev) => ({ ...prev, page, limit: pageSize }))
  }

  return (
    <Main className={cn('flex flex-col gap-2 p-4')}>
      
      {/* Field Tracking Management Section */}
      <div className='mt-6'>
        <div className="mb-6">
          <h2 className="text-2xl font-bold">Field Tracking Configuration</h2>
          <p className="text-muted-foreground ">
            Configure location tracking, map views, and field activity monitoring
          </p>
        </div>
          {/* Settings Configuration */}
          <div className="mb-8">
            <FieldTracking />
          </div>

          {/* Data Tables */}
          {/* <FieldTrackingTable
            trackingRules={trackingRules}
            geofenceZones={geofenceZones}
            totalCount={totalCount}
            loading={isLoading}
            currentPage={pagination.page}
            paginationCallbacks={{ onPaginationChange }}
          /> */}
      </div>
    </Main>
  )
}

export default FieldTrackingPage
