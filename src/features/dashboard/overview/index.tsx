import { useState, useEffect } from 'react'
import { DEFAULT_PAGE_NUMBER, DEFAULT_PAGE_SIZE } from '@/data/app.data'
import { cn } from '@/lib/utils'
import { Main } from '@/components/layout/main'
import TablePageLayout from '@/components/layout/table-page-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, MapPin, TrendingUp, DollarSign, RefreshCw } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

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

  // Auto-refresh state
  const [autoRefresh, setAutoRefresh] = useState(true)
  const [lastRefresh, setLastRefresh] = useState(new Date())

  // Overview data with refetch capability
  const {
    totalCount = 0,
    allSalesReps = [],
    isLoading,
    error,
    refetch: refetchSalesReps,
  } = useGetAllSalesReps(pagination, { enabled: true })

  // Dashboard stats with refetch capability
  const {
    stats,
    error: statsError,
    refetch: refetchStats,
  } = useGetDashboardStats(pagination, { enabled: true })

  const { setOpen } = useOverviewStore()

  // Auto-refresh effect
  useEffect(() => {
    if (!autoRefresh) return

    const interval = setInterval(() => {
      refetchSalesReps()
      refetchStats()
      setLastRefresh(new Date())
    }, 30000) // Refresh every 30 seconds

    return () => clearInterval(interval)
  }, [autoRefresh, refetchSalesReps, refetchStats])

  // Manual refresh function
  const handleManualRefresh = () => {
    refetchSalesReps()
    refetchStats()
    setLastRefresh(new Date())
  }

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

  // Calculate active sales reps
  const activeSalesReps = allSalesReps.filter(rep => rep.status === 'active').length
  const totalSalesReps = allSalesReps.length

  return (
    <Main className={cn('flex flex-col gap-4 p-4')}>
      
      {/* Header with Refresh Controls */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Dashboard Overview</h1>
          <p className="text-muted-foreground">
            Real-time monitoring of your field sales team
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleManualRefresh}
            disabled={isLoading}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button
            variant={autoRefresh ? "default" : "outline"}
            size="sm"
            onClick={() => setAutoRefresh(!autoRefresh)}
          >
            {autoRefresh ? 'Auto-refresh ON' : 'Auto-refresh OFF'}
          </Button>
        </div>

      </div>

      {/* Last Updated Info */}
      <div className="text-xs text-muted-foreground">
        Last updated: {lastRefresh.toLocaleTimeString()}
      </div>
      
      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Sales Reps
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? (
                <div className="h-8 w-16 bg-muted animate-pulse rounded"></div>
              ) : (
                totalSalesReps
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              {isLoading ? (
                <div className="h-4 w-24 bg-muted animate-pulse rounded"></div>
              ) : (
                `${activeSalesReps} active in field`
              )}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active in Field
            </CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? (
                <div className="h-8 w-16 bg-muted animate-pulse rounded"></div>
              ) : (
                activeSalesReps
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              {isLoading ? (
                <div className="h-4 w-24 bg-muted animate-pulse rounded"></div>
              ) : (
                `${totalSalesReps > 0 ? Math.round((activeSalesReps / totalSalesReps) * 100) : 0}% of total team`
              )}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Revenue
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          {/* <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? (
                <div className="h-8 w-20 bg-muted animate-pulse rounded"></div>
              ) : (
                `$${stats?.kpis?.totalRevenue?.toLocaleString() || '0'}`
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              {isLoading ? (
                <div className="h-4 w-28 bg-muted animate-pulse rounded"></div>
              ) : (
                `+${stats?.kpis?.monthlyGrowth || 0}% from last month`
              )}
            </p>
          </CardContent> */}
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Visits
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          {/* <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? (
                <div className="h-8 w-16 bg-muted animate-pulse rounded"></div>
              ) : (
                stats?.kpis?.totalVisits || 0
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              {isLoading ? (
                <div className="h-4 w-24 bg-muted animate-pulse rounded"></div>
              ) : (
                `${stats?.kpis?.conversionRate || 0}% conversion rate`
              )}
            </p>
          </CardContent> */}
        </Card>
      </div>

      {/* Sales Reps Status Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Team Status Overview</CardTitle>
          <CardDescription>Current status of your sales representatives</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex flex-wrap gap-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-6 w-20 bg-muted animate-pulse rounded"></div>
              ))}
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              <Badge variant="default" className="flex items-center gap-1">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                Active: {allSalesReps.filter(rep => rep.status === 'active').length}
              </Badge>
              <Badge variant="secondary" className="flex items-center gap-1">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                Idle: {allSalesReps.filter(rep => rep.status === 'idle').length}
              </Badge>
              <Badge variant="outline" className="flex items-center gap-1">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                On Break: {allSalesReps.filter(rep => rep.status === 'on_break').length}
              </Badge>
              <Badge variant="destructive" className="flex items-center gap-1">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                Offline: {allSalesReps.filter(rep => rep.status === 'offline').length}
              </Badge>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Overview Management Section */}
      <div className='mt-6'>
        <TablePageLayout
          title='Sales Representatives'
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


