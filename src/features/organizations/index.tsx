import { useEffect, useState } from 'react'
import { DEFAULT_PAGE_NUMBER, DEFAULT_PAGE_SIZE } from '@/data/app.data'
import { Building2, Clock, Users } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Main } from '@/components/layout/main'
import TablePageLayout from '@/components/layout/table-page-layout'
import { ErrorPage } from '@/components/shared/custom-error'
import AllUsersTable from '../UserManagement/components/table'
import { useGetAllUsers } from '../UserManagement/services/AllUsers.hook'
import { ActionFormModal } from '../driver/components/action-form-modal'
import { ErrorResponse } from '../merchants/types'
import { OrganizationsActionModal } from './components/action-form-modal'
import PendingUserTable from './components/pending-user-table'
import OrganizationsTable from './components/table'
import {
  useGetOrganizations,
  useGetPendingUsers,
  useUserStatusCounts,
} from './services/organization.hook'
import { useUsersStore } from './store/organizations.store'

const Organizations = () => {
  const [selectedTab, setSelectedTab] = useState('organizations')

  // Fixed typo: tiltObj -> titleObj
  const [titleObj, setTitleObj] = useState({
    title: 'Organizations',
    description: 'Manage all organizations in the system',
  })

  const [pagination, setPagination] = useState({
    page: DEFAULT_PAGE_NUMBER,
    limit: DEFAULT_PAGE_SIZE,
  })

  const [userPagination, setUserPagination] = useState({
    page: DEFAULT_PAGE_NUMBER,
    limit: DEFAULT_PAGE_SIZE,
    status: 'pending',
  })

  // Organizations data
  const {
    totalCount: organizationsTotalCount = 0,
    organization = [],
    isLoading: organizationsLoading,
    error: organizationsError,
  } = useGetOrganizations(pagination)

  // All users data - fixed variable naming conflict
  const {
    totalCount: allUsersTotalCount = 0,
    allUsers = [],
    isLoading: allUsersLoading,
    error: allUsersError,
  } = useGetAllUsers(pagination)

  // Pending users data - only call when pending-admins tab is active
  const {
    totalCount: pendingUsersTotalCount = 0,
    pendingUser = [],
    isLoading: pendingUsersLoading,
    error: pendingUsersError,
  } = useGetPendingUsers(userPagination, {
    enabled: selectedTab === 'pending-admins',
  })

  // User status counts
  const { userStatusCounts, totalOrganizations } = useUserStatusCounts() || {
    userStatusCounts: {},
    totalOrganizations: 0,
  }

  const { setOpen, open } = useUsersStore()

  // Consolidated error handling
  const error = organizationsError || pendingUsersError || allUsersError
  if (error) {
    const errorResponse = (error as ErrorResponse)?.response?.data
    return (
      <ErrorPage
        errorCode={errorResponse?.statusCode}
        message={errorResponse?.message}
      />
    )
  }

  const handleAddMerchant = () => {
    setOpen('add')
  }

  const onPaginationChange = (page: number, pageSize: number) => {
    setPagination((prev) => ({ ...prev, page, limit: pageSize }))
  }

  const onUserPaginationChange = (page: number, pageSize: number) => {
    setUserPagination((prev) => ({ ...prev, page, limit: pageSize }))
  }

  useEffect(() => {
    if (selectedTab === 'organizations') {
      setTitleObj({
        title: 'Organizations',
        description: 'Manage all organizations in the system',
      })
    } else if (selectedTab === 'pending-admins') {
      setTitleObj({
        title: 'Pending Admin',
        description: 'Review and approve admin registration requests',
      })
    } else if (selectedTab === 'system-logs') {
      setTitleObj({
        title: 'All Users',
        description: 'Monitor to all users',
      })
    }
  }, [selectedTab])

  // Helper function to calculate total users safely
  const getTotalUsers = () => {
    if (!userStatusCounts) return 0
    return (
      (userStatusCounts.created || 0) +
      (userStatusCounts.pending || 0) +
      (userStatusCounts.verified || 0) +
      (userStatusCounts.rejected || 0)
    )
  }

  return (
    <Main className={cn('flex flex-col gap-2 p-4')}>
      <div className='mt-2 flex items-center justify-between space-y-2'>
        <div>
          <h2 className='text-3xl font-bold tracking-tight'>
            Organization Management
          </h2>
          <p className='text-muted-foreground'>
            Manage organizations and approve admin registrations
          </p>
        </div>
      </div>

      <div className='mt-2 grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>
              Total Organizations
            </CardTitle>
            <Building2 className='text-muted-foreground h-4 w-4' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{totalOrganizations || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>
              Pending Approvals
            </CardTitle>
            <Clock className='text-muted-foreground h-4 w-4' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>
              {userStatusCounts?.pending || 0}
            </div>
            <p className='text-muted-foreground text-xs'>
              Admin registrations awaiting approval
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Total Users</CardTitle>
            <Users className='text-muted-foreground h-4 w-4' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{getTotalUsers()}</div>
            <p className='text-muted-foreground text-xs'>
              Across all organizations
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>
              Verified Organization
            </CardTitle>
            <Users className='text-muted-foreground h-4 w-4' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>
              {userStatusCounts?.verified || 0}
            </div>
            <p className='text-muted-foreground text-xs'>
              Across all organizations
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs
        value={selectedTab}
        onValueChange={setSelectedTab}
        className='mt-4 space-y-4'
      >
        <TabsList className='grid w-full grid-cols-3'>
          <TabsTrigger value='organizations'>Organizations</TabsTrigger>
          <TabsTrigger value='pending-admins'>
            Pending Admins
            <Badge variant='destructive' className='ml-2'>
              {userStatusCounts?.pending || 0}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value='system-logs'>All Users</TabsTrigger>
        </TabsList>

        <TabsContent value='organizations' className='space-y-4'>
          <TablePageLayout
            title={titleObj?.title}
            description={titleObj?.description}
            onAddButtonClick={handleAddMerchant}
            moduleAction='add'
            modulePermission='organizations'
            showActionButton={true}
          >
            <OrganizationsTable
              data={organization}
              totalCount={organizationsTotalCount}
              loading={organizationsLoading}
              currentPage={pagination.page}
              paginationCallbacks={{ onPaginationChange }}
            />
          </TablePageLayout>
        </TabsContent>

        <TabsContent value='pending-admins' className='space-y-4'>
          <TablePageLayout
            title={titleObj?.title}
            description={titleObj?.description}
            onAddButtonClick={handleAddMerchant}
            showActionButton={false}
          >
            <PendingUserTable
              data={pendingUser}
              totalCount={pendingUsersTotalCount}
              loading={pendingUsersLoading}
              currentPage={userPagination.page}
              paginationCallbacks={{
                onPaginationChange: onUserPaginationChange,
              }}
            />
            <ActionFormModal key={'merchants-action-modal'} />
          </TablePageLayout>
        </TabsContent>

        <TabsContent value='system-logs' className='space-y-4'>
          <TablePageLayout
            title={titleObj?.title}
            description={titleObj?.description}
            onAddButtonClick={handleAddMerchant}
            showActionButton={false}
          >
            <AllUsersTable
              data={allUsers}
              totalCount={allUsersTotalCount}
              loading={allUsersLoading}
              currentPage={pagination.page}
              paginationCallbacks={{ onPaginationChange }}
              hideActions={true} // Add this prop to hide the actions column
            />
          </TablePageLayout>
        </TabsContent>
      </Tabs>

      {open && <OrganizationsActionModal key={'organizations-action-modal'} />}
    </Main>
  )
}

export default Organizations
