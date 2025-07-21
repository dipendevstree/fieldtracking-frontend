import { useState } from 'react'
import { useRouter } from '@tanstack/react-router'
import { DEFAULT_PAGE_NUMBER, DEFAULT_PAGE_SIZE } from '@/data/app.data'
import { cn } from '@/lib/utils'
import { Main } from '@/components/layout/main'
import TablePageLayout from '@/components/layout/table-page-layout'
import { ErrorPage } from '@/components/shared/custom-error'
import { ErrorResponse } from '../merchants/types'
import { UserTerritoryActionModal } from './compoenents/action-form-modal'
import UserTerritoryTable from './compoenents/table'
import { useGetAllTerritories } from './services/user-territory.hook'
import { useUserTerritoryStore } from './store/users-territory.store'

const UserTerritory = () => {
  const [pagination, setPagination] = useState({
    page: DEFAULT_PAGE_NUMBER,
    limit: DEFAULT_PAGE_SIZE,
  })

  // Territories data
  const {
    totalCount = 0,
    allTerritories = [],
    isLoading,
    error,
  } = useGetAllTerritories(pagination)

  const { setOpen, open } = useUserTerritoryStore()
  const {} = useRouter()

  if (error) {
    const errorResponse = (error as ErrorResponse)?.response?.data
    return (
      <ErrorPage
        errorCode={errorResponse?.statusCode}
        message={errorResponse?.message}
      />
    )
  }

  const handleAddTerritory = () => {
    console.log('Add Territory button clicked')
    setOpen('add')
  }

  const onPaginationChange = (page: number, pageSize: number) => {
    setPagination((prev) => ({ ...prev, page, limit: pageSize }))
  }

  return (
    <Main className={cn('flex flex-col gap-2 p-4')}>
      {/* Territory Management Section */}
      <div className='mt-6'>
        <TablePageLayout
          title='All Territories'
          description='Manage territory assignments and coverage areas'
          onAddButtonClick={handleAddTerritory}
          addButtonText='Add Territory'
          modulePermission='user_territory'
          moduleAction='add'
        >
          <UserTerritoryTable
            data={allTerritories}
            totalCount={totalCount}
            loading={isLoading}
            currentPage={pagination.page}
            paginationCallbacks={{ onPaginationChange }}
          />
        </TablePageLayout>
      </div>

      {open && <UserTerritoryActionModal key={'territory-action-modal'} />}
    </Main>
  )
}

export default UserTerritory
