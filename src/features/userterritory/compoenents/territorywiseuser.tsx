import { useState } from 'react'
import { useParams, useNavigate } from '@tanstack/react-router'
import { DEFAULT_PAGE_NUMBER, DEFAULT_PAGE_SIZE } from '@/data/app.data'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Main } from '@/components/layout/main'
import TablePageLayout from '@/components/layout/table-page-layout'
import { useGetTerritoriesWiseUser } from '../services/user-territory.hook'
import TerritoryWiseUserTable from './territorywiseusertable'

const TerritoryWiseUser = () => {
  const { territoyId } = useParams({
    from: '/_authenticated/user-territory/view-territorywise-user/$territoyId',
  })
  const [pagination, setPagination] = useState({
    page: DEFAULT_PAGE_NUMBER,
    limit: DEFAULT_PAGE_SIZE,
    territoryId: territoyId || '',
  })
  const navigate = useNavigate()

  const {
    totalCount = 0,
    allTerritories = [],
    isLoading,
  } = useGetTerritoriesWiseUser(pagination)

  const territoryName =
    allTerritories.length > 0 ? allTerritories[0]?.territory?.name : 'Territory'

  const onPaginationChange = (page: number, pageSize: number) => {
    setPagination((prev) => ({ ...prev, page, limit: pageSize }))
  }

  return (
    <Main className={cn('flex flex-col gap-2 p-4')}>
      <div className='mt-6'>
        <Button
          onClick={() => navigate({ to: '/user-territory' })}
          className='ml-6'
        >
          Back to list
        </Button>
        <TablePageLayout
          title={`Users in ${territoryName}`}
          description='View and manage sales reps within this territory'
          modulePermission='user_territory'
          moduleAction='viewOwn'
          showActionButton={false}
        >
          <TerritoryWiseUserTable
            data={allTerritories}
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

export default TerritoryWiseUser
