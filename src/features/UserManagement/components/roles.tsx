import { useState } from 'react'
import { useNavigate, useRouter } from '@tanstack/react-router'
import { DEFAULT_PAGE_NUMBER, DEFAULT_PAGE_SIZE } from '@/data/app.data'
import { cn } from '@/lib/utils'
import { Main } from '@/components/layout/main'
import TablePageLayout from '@/components/layout/table-page-layout'
import { ErrorPage } from '@/components/shared/custom-error'
import { useGetAllRoles } from '../services/Roles.hook'
import { useRolesStore } from '../store/roles.store'
import { ErrorResponse } from '../types'
import RolesTable from './roles-table'

const Roles = () => {
  const navigate = useNavigate()
  const [pagination, setPagination] = useState({
    page: DEFAULT_PAGE_NUMBER,
    limit: DEFAULT_PAGE_SIZE,
  })

  // Organizations data
  const {
    totalCount = 0,
    allRoles = [],
    isLoading,
    error,
  } = useGetAllRoles(pagination)

  const { setCurrentRow } = useRolesStore()
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

  const handleAddRole = () => {
    // Clear any existing role data
    console.log('Add Role button clicked')
    setCurrentRow(null)
    navigate({ to: '/user-management/add-roles-permission' })
  }

  const handleEditRole = (roleData: any) => {
    console.log('Edit Role button clicked', roleData)
    setCurrentRow(roleData)
    navigate({
      to: `/user-management/edit-roles-permission/${roleData.roleId}`,
    })
  }

  const onPaginationChange = (page: number, pageSize: number) => {
    setPagination((prev) => ({ ...prev, page, limit: pageSize }))
  }

  return (
    <Main className={cn('flex flex-col gap-2 p-4')}>
      <div className='mt-2 flex items-center justify-between space-y-2'>
        <div>
          <h2 className='text-3xl font-bold tracking-tight'>User Management</h2>
          <p className='text-muted-foreground'>
            Manage user accounts, sales reps, and access permissions
          </p>
        </div>
      </div>

      {/* User Directory Section */}
      <div className='mt-6'>
        {' '}
        <TablePageLayout
          title='Roles Management'
          description='Manage roles and permissions'
          onAddButtonClick={handleAddRole}
          addButtonText='Add Roles'
          modulePermission='roles_permission'
          moduleAction='add'
        >
          <RolesTable
            data={allRoles}
            totalCount={totalCount}
            loading={isLoading}
            currentPage={pagination.page}
            paginationCallbacks={{ onPaginationChange }}
            onEditRole={handleEditRole}
          />
        </TablePageLayout>
      </div>
    </Main>
  )
}

export default Roles
