import { useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { DEFAULT_PAGE_NUMBER, DEFAULT_PAGE_SIZE } from "@/data/app.data";
import { cn } from "@/lib/utils";
import { Main } from "@/components/layout/main";
import LimitsControls from "./components/LimitsControls";
import { LimitsControlsActionModal } from "./components/action-form-modal";
import { useGetLimitsControlsData, IListParams } from "./services/LImits&Controlshook";
import debounce from "lodash.debounce";
import { FilterConfig } from "@/components/global-filter-section";

const LimitsControlsPage = () => {
  const [pagination, setPagination] = useState<IListParams>({
    page: DEFAULT_PAGE_NUMBER,
    limit: DEFAULT_PAGE_SIZE,
    searchFor: "",
  });

  const { watch, setValue } = useForm({
    defaultValues: { search: "" },
  });

  const {
    expenseLimits = [],
    totalCount = 0,
    isLoading,
    error,
  } = useGetLimitsControlsData(pagination);

  // Debug: Log the data to understand the mismatch
  console.log('Pagination params:', pagination);
  console.log('Expense limits data:', expenseLimits);
  console.log('Total count:', totalCount);
  console.log('Actual records received:', expenseLimits.length);

  const debouncedSearch = useCallback(
    debounce((value: string) => {
      setPagination((prev) => ({
        ...prev,
        searchFor: value,
        page: 1, // Reset to first page when searching
      }));
    }, 800), // Consistent with monthly-expense pattern
    []
  );

  const handleGlobalSearchChange = (value: string | undefined) => {
    const searchValue = value ?? ''
    setValue('search', searchValue)
    debouncedSearch(searchValue)
  }

  // Handle pagination change
  const handlePaginationChange = useCallback(
    (page: number, pageSize: number) => {
      setPagination((prev) => ({
        ...prev,
        page,
        limit: pageSize,
      }));
    },
    []
  );

  if (error) {
    console.error("Limits Controls Error:", error);
  }

  const filters: FilterConfig[] = [
    {
      key: 'search',
      type: 'search',
      onChange: handleGlobalSearchChange,
      placeholder: 'Search by tier, category...',
      value: watch('search'),
    },
  ];

  return (
    <Main className={cn("flex flex-col gap-2 p-4")}>
      {/* Limits Controls Configuration Section */}
      <div className="mt-6">
        <LimitsControls
          expenseLimits={expenseLimits}
          totalCount={totalCount}
          loading={isLoading}
          paginationCallbacks={{
            onPaginationChange: handlePaginationChange,
          }}
          currentPage={pagination.page}
          filters={filters}
        />
      </div>

      <LimitsControlsActionModal key={"limits-controls-action-modal"} />
    </Main>
  );
};

export default LimitsControlsPage;
