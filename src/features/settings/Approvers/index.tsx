import { useState } from 'react'
import { DEFAULT_PAGE_NUMBER, DEFAULT_PAGE_SIZE } from '@/data/app.data'
import { cn } from '@/lib/utils'
import { Main } from '@/components/layout/main'
import TablePageLayout from '@/components/layout/table-page-layout'
import { EnhancedError } from '@/types'
import ApproversTable from './components/table'
// import { useGetApproversData } from './services/approvers.hook'
// import { useApproversStore } from './store/approvers.store'
import { ErrorPage } from '@/components/shared/custom-error'
import Approvers from './components/Approvers'

const ApproversPage = () => {
  const [pagination, setPagination] = useState({
    page: DEFAULT_PAGE_NUMBER,
    limit: DEFAULT_PAGE_SIZE,
  })

  // Approvers data
  // const {
  //   approvalHierarchy = [],
  //   categoryApprovers = [],
  //   approvalSettings,
  //   totalCount = 0,
  //   isLoading,
  //   error,
  // } = useGetApproversData(pagination)

  // const { setOpen } = useApproversStore()

  // if (error) {
  //   const errorResponse = (error as EnhancedError)?.response?.data
  //   return (
  //     <ErrorPage
  //       errorCode={errorResponse?.statusCode}
  //       message={errorResponse?.message}
  //     />
  //   )
  // }

  const handleAddHierarchy = () => {
    // setOpen('add-hierarchy')
  }

  const handleAddCategory = () => {
    // setOpen('add-category')
  }

  const onPaginationChange = (page: number, pageSize: number) => {
    setPagination((prev) => ({ ...prev, page, limit: pageSize }))
  }

  return (
    <Main className={cn('flex flex-col gap-2 p-4')}>
      
      {/* Approvers Configuration Section */}
      <div className='mt-6'>
        <div className="mb-6">
          <h2 className="text-2xl font-bold">Expense Approvers Configuration</h2>
          <p className="text-muted-foreground ">
            Configure approval hierarchy and default approvers for different scenarios
          </p>
        </div>
          {/* Settings Configuration */}
          <div className="mb-8">
            <Approvers />
          </div>

          {/* Data Tables */}
          {/* <ApproversTable
            hierarchyData={approvalHierarchy}
            categoryData={categoryApprovers}
            totalCount={totalCount}
            loading={isLoading}
            currentPage={pagination.page}
            paginationCallbacks={{ onPaginationChange }}
          /> */}
        
      </div>
    </Main>
  )
}

export default ApproversPage
