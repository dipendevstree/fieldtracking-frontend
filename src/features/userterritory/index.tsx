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
import { FilterConfig } from '@/components/global-filter-section'
import GlobalFilterSection from '@/components/global-table-filter-section'
import debounce from 'lodash.debounce'
import { useAuthStore } from '@/stores/use-auth-store'
import NotFoundError from '../errors/not-found-error'

const UserTerritory = () => {
  const { user } = useAuthStore();
  if (user && user?.organization && !user?.organization?.allowAddUsersBasedOnTerritories) {
    return <NotFoundError />
  }
  
  const [pagination, setPagination] = useState({
    page: DEFAULT_PAGE_NUMBER,
    limit: DEFAULT_PAGE_SIZE,
  })

  const { setOpen, open } = useUserTerritoryStore()

  // Filter state - only search
  const [filters, setFilters] = useState({
    search: '',
  })

  // Query parameters including filters
  const queryParams = useMemo(
    () => ({
      ...pagination,
      searchFor: filters.search || "",
    }),
    [pagination, filters]
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

  // Debug: Log the API response
  console.log("API Response - allTerritories:", allTerritories);
  console.log("API Response - totalCount:", totalCount);

  // Client-side filtering as fallback if API doesn't support filtering
  const filteredTerritories = useMemo(() => {
    if (!filters.search) {
      return allTerritories;
    }

    return allTerritories.filter((territory: any) => {
      const matchesSearch = !filters.search || 
        territory.name?.toLowerCase().includes(filters.search.toLowerCase());
      
      return matchesSearch;
    });
  }, [allTerritories, filters.search]);

  const displayTerritories = filteredTerritories;
  const displayTotalCount = filteredTerritories.length;

  // Debug: Log filtering results
  console.log("Filtering results:", {
    originalCount: allTerritories.length,
    filteredCount: filteredTerritories.length,
    searchFilter: filters.search,
    filteredTerritories: filteredTerritories
  });

  const debouncedSearch = useCallback(
    debounce((value: string) => {
      setFilters(prev => ({ ...prev, search: value }));
      setPagination(prev => ({ ...prev, page: DEFAULT_PAGE_NUMBER })); // Reset to first page when searching
    }, 800),
    []
  );

  const handleGlobalSearchChange = (value: string | undefined) => {
    const searchValue = value ?? "";
    console.log("Search value changed to:", searchValue);
    debouncedSearch(searchValue);
  };

  const clearFilters = () => {
    console.log("Clearing all filters");
    setFilters({ search: "" });
    setPagination(prev => ({ ...prev, page: DEFAULT_PAGE_NUMBER }));
  };

  const filtersConfig: FilterConfig[] = [
    {
      key: "search",
      type: "search",
      placeholder: "Search territories...",
      value: filters.search,
      onChange: handleGlobalSearchChange,
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
    <Main className={cn('flex flex-col gap-2')}>
      <TablePageLayout
        title="All Territories"
        description="Manage territory assignments and coverage areas"
        onAddButtonClick={handleAddTerritory}
        addButtonText="Add Territory"
        modulePermission="user_territory"
        moduleAction="add"
        className='p-0'
      >
        <div className="space-y-4">
          {/* Filter Section - Only Search */}
          <GlobalFilterSection
            key="territories-management-filters"
            filters={filtersConfig}
            onCancelPress={clearFilters}
            className={"mb-0 mt-2"}
          />
          
          {/* Table */}
          <UserTerritoryTable
            data={displayTerritories}
            totalCount={displayTotalCount}
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
