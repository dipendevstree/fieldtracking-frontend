import { useState, useCallback } from 'react'
import { DEFAULT_PAGE_NUMBER, DEFAULT_PAGE_SIZE } from '@/data/app.data'
import { cn } from '@/lib/utils'
import { Main } from '@/components/layout/main'
import LimitsControls from './components/LimitsControls'
import { LimitsControlsActionModal } from './components/action-form-modal'
import { useGetLimitsControlsData } from './services/LImits&Controlshook'
import { useLimitsControlsStore } from './store/limits-&-controls.store'
import debounce from 'lodash.debounce'

const LimitsControlsPage = () => {
  const [pagination, setPagination] = useState({
    page: DEFAULT_PAGE_NUMBER,
    limit: DEFAULT_PAGE_SIZE,
    searchFor: '',
  })

  const {
    expenseLimits = [],
    locationAdjustments = [],
    totalCount = 0,
    isLoading,
    error,
  } = useGetLimitsControlsData(pagination)
  const debouncedSearch = useCallback(
    debounce((searchTerm: string) => {
      setPagination(prev => ({
        ...prev,
        searchFor: searchTerm,
        page: 1,
      }))
    }, 800),
    []
  )

  // Handle search change
  const handleSearchChange = useCallback((searchTerm: string) => {
    debouncedSearch(searchTerm)
  }, [debouncedSearch])

  // Handle pagination change
  const handlePaginationChange = useCallback((page: number, pageSize: number) => {
    setPagination(prev => ({
      ...prev,
      page,
      limit: pageSize,
    }))
  }, [])

  if (error) {
    console.warn('API Error (using mock data):', error)
  }

  return (
    <Main className={cn('flex flex-col gap-2 p-4')}>
      
      {/* Limits Controls Configuration Section */}
      <div className='mt-6'>
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Expense Limits & Controls</h1>
          <p className="text-muted-foreground">
            Configure expense limits based on designation, location, and category.
          </p>
        </div>

        <LimitsControls
          expenseLimits={expenseLimits}
          locationAdjustments={locationAdjustments}
          totalCount={totalCount}
          loading={isLoading}
          paginationCallbacks={{
            onPaginationChange: handlePaginationChange,
          }}
          currentPage={pagination.page}
          onSearchChange={handleSearchChange}
        />
      </div>

      <LimitsControlsActionModal key={'limits-controls-action-modal'} />
    </Main>
  )
}

export default LimitsControlsPage
