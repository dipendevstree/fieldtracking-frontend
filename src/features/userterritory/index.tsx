import { useState, useCallback, useMemo } from 'react'
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
import { useGetAllTerritoriesForDropdown } from './services/user-territory.hook'
import { useSelectOptions } from '@/hooks/use-select-option'
import { FilterConfig } from '@/components/global-filter-section'
import GlobalFilterSection from '@/components/global-table-filter-section'
import debounce from 'lodash.debounce'
import { useForm } from 'react-hook-form'

const UserTerritory = () => {
  const [pagination, setPagination] = useState({
    page: DEFAULT_PAGE_NUMBER,
    limit: DEFAULT_PAGE_SIZE,
    searchFor: '',
    territoryId: '',
  })

  const { setOpen, open } = useUserTerritoryStore()

  // Use form for filter state like monthly-expenses
  const { watch, setValue } = useForm({
    defaultValues: { search: '', territoryId: '' },
  })

  const searchValue = watch('search')
  const territoryIdValue = watch('territoryId')

  // Query parameters including filters
  const queryParams = useMemo(
    () => ({
      ...pagination,
      searchFor: pagination.searchFor || "",
      territoryId: pagination.territoryId || "",
    }),
    [pagination]
  )

  // Debug: Log query parameters when they change
  console.log("Territory search query params:", queryParams);

  // Territories data
  const {
    totalCount = 0,
    allTerritories = [],
    isLoading,
    error,
  } = useGetAllTerritories(queryParams)

  // Get filter options
  const { data: territoryList = [] } = useGetAllTerritoriesForDropdown();

  const territoryOptions = useSelectOptions({
    listData: territoryList ?? [],
    labelKey: "name",
    valueKey: "id",
  }).map((option) => ({
    ...option,
    value: String(option.value),
  }));

  const debouncedSearch = useCallback(
    debounce((value: string) => {
      setPagination((prev) => ({
        ...prev,
        searchFor: value,
        page: DEFAULT_PAGE_NUMBER, // Reset to first page when searching
      }));
    }, 800),
    []
  );

  const handleGlobalSearchChange = (value: string | undefined) => {
    const searchValue = value ?? "";
    setValue('search', searchValue);
    debouncedSearch(searchValue);
  };

  const handleTerritoryFilterChange = (value: string | undefined) => {
    const territoryId = value ?? "";
    setValue('territoryId', territoryId);
    setPagination((prev) => ({
      ...prev,
      territoryId: territoryId,
      page: DEFAULT_PAGE_NUMBER, // Reset to first page when filtering
    }));
  };

  const clearFilters = () => {
    setValue('search', '');
    setValue('territoryId', '');
    setPagination((prev) => ({
      ...prev,
      searchFor: '',
      territoryId: '',
      page: DEFAULT_PAGE_NUMBER,
    }));
  };

  const filtersConfig: FilterConfig[] = [
    {
      key: "search",
      type: "search",
      placeholder: "Search territories...",
      value: searchValue,
      onChange: handleGlobalSearchChange,
    },
    {
      key: "territoryId",
      type: "select",
      placeholder: "Territory",
      value: territoryIdValue,
      onChange: handleTerritoryFilterChange,
      options: territoryOptions,
    },
  ];

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
      <TablePageLayout
        title="All Territories"
        description="Manage territory assignments and coverage areas"
        onAddButtonClick={handleAddTerritory}
        addButtonText="Add Territory"
        modulePermission="user_territory"
        moduleAction="add"
      >
        <div className="space-y-4">
          {/* Filter Section */}
          <GlobalFilterSection
            key="territories-management-filters"
            filters={filtersConfig}
            onCancelPress={clearFilters}
          />
          
          {/* Table */}
          <UserTerritoryTable
            data={allTerritories}
            totalCount={totalCount}
            loading={isLoading}
            currentPage={pagination.page}
            paginationCallbacks={{ onPaginationChange }}
          />
        </div>
      </TablePageLayout>

      {open && <UserTerritoryActionModal key={"user-territory-action-modal"} />}
    </Main>
  )
}

export default UserTerritory
