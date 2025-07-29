import { useState } from 'react'
import { DEFAULT_PAGE_NUMBER, DEFAULT_PAGE_SIZE } from '@/data/app.data'
import { cn } from '@/lib/utils'
import { Main } from '@/components/layout/main'
import TablePageLayout from '@/components/layout/table-page-layout'
import { ErrorResponse } from '../merchants/types'
import CustomerTypeTable from './components/table'
import { useGetAllCustomerType } from './services/CustomerTypehook'
import { useCustomerTypeStore } from './store/customer-type.store'
import { ErrorPage } from '@/components/shared/custom-error'

const CustomerType = () => {
  const [pagination, setPagination] = useState({
    page: DEFAULT_PAGE_NUMBER,
    limit: DEFAULT_PAGE_SIZE,
  })

  // Customer Type data
  const {
    totalCount = 0,
    allCustomerType = [],
    isLoading,
    error,
  } = useGetAllCustomerType(pagination)

  const { setOpen } = useCustomerTypeStore()

  if (error) {
    const errorResponse = (error as ErrorResponse)?.response?.data
    return (
      <ErrorPage
        errorCode={errorResponse?.statusCode}
        message={errorResponse?.message}
      />
    )
  }

  const handleAddCustomerType = () => {
    setOpen('add')
  }

  const onPaginationChange = (page: number, pageSize: number) => {
    setPagination((prev) => ({ ...prev, page, limit: pageSize }))
  }

  return (
    <Main className={cn('flex flex-col gap-2 p-4')}>
      
      {/* Customer Type Management Section */}
      <div className='mt-6'>
        <TablePageLayout
          title='All Customer Types'
          description='Manage customer type assignments and coverage areas'
          onAddButtonClick={handleAddCustomerType}
          addButtonText='Add Customer Type'
        >
          <CustomerTypeTable
            data={allCustomerType}
            totalCount={totalCount}
            loading={isLoading}
            currentPage={pagination.page}
            paginationCallbacks={{ onPaginationChange }}
          />
        </TablePageLayout>
      </div>
    </Main>
  )
}

export default CustomerType
