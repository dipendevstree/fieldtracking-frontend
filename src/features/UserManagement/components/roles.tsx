import { useState, useCallback, useMemo, useEffect } from "react";
import { useNavigate, useRouter } from "@tanstack/react-router";
import { DEFAULT_PAGE_NUMBER, DEFAULT_PAGE_SIZE } from "@/data/app.data";
import { cn } from "@/lib/utils";
import { Main } from "@/components/layout/main";
import TablePageLayout from "@/components/layout/table-page-layout";
import { ErrorPage } from "@/components/shared/custom-error";
import { useGetAllRoles } from "../services/Roles.hook";
import { useRolesStore } from "../store/roles.store";
import { useGetAllRolesForDropdown } from "../services/Roles.hook";
import { useSelectOptions } from "@/hooks/use-select-option";
import { FilterConfig } from "@/components/global-filter-section";
import GlobalFilterSection from "@/components/global-table-filter-section";
import debounce from "lodash.debounce";
import { ErrorResponse } from "../types";
import RolesTable from "./roles-table";

const Roles = () => {
  const navigate = useNavigate();
  const [pagination, setPagination] = useState({
    page: DEFAULT_PAGE_NUMBER,
    limit: DEFAULT_PAGE_SIZE,
  });

  const { filters, setFilters, setCurrentRow } = useRolesStore();

  useEffect(() => {
    setPagination(prev => ({ ...prev, page: DEFAULT_PAGE_NUMBER }));
  }, [filters.search, filters.roleId]);

  const queryParams = useMemo(
    () => ({
      ...pagination,
      searchFor: filters.search || "", 
    }),
    [pagination, filters]
  );

  // Debug: Log query parameters when they change
  console.log("Roles search query params:", queryParams);

  const {
    totalCount = 0,
    allRoles = [],
    isLoading,
    error,
  } = useGetAllRoles(queryParams);

  // Debug: Log the API response
  console.log("API Response - allRoles:", allRoles);
  console.log("API Response - totalCount:", totalCount);

  // Client-side filtering as fallback if API doesn't support filtering
  const filteredRoles = useMemo(() => {
    if (!filters.search && !filters.roleId) {
      return allRoles;
    }

    return allRoles.filter((role: any) => {
      const matchesSearch = !filters.search || 
        role.roleName?.toLowerCase().includes(filters.search.toLowerCase()) ||
        role.name?.toLowerCase().includes(filters.search.toLowerCase());
      
      const matchesRoleId = !filters.roleId || 
        String(role.roleId) === filters.roleId ||
        String(role.id) === filters.roleId;

      return matchesSearch && matchesRoleId;
    });
  }, [allRoles, filters.search, filters.roleId]);

  // const displayRoles = filteredRoles;
  // const displayTotalCount = filteredRoles.length;

  // Debug: Log filtering results
  console.log("Filtering results:", {
    originalCount: allRoles.length,
    filteredCount: filteredRoles.length,
    searchFilter: filters.search,
    roleIdFilter: filters.roleId,
    filteredRoles: filteredRoles
  });

  // Get filter options
  const { data: roleList = [] } = useGetAllRolesForDropdown();

  const roleOptions = useSelectOptions({
    listData: roleList ?? [],
    labelKey: "roleName",
    valueKey: "roleId",
  }).map((option) => ({
    ...option,
    value: String(option.value),
  }));

  // Debug: Log filter options
  console.log("Role filter options:", roleOptions);

  const debouncedSearch = useCallback(
    debounce((value: string) => {
      setFilters({ search: value });
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
      placeholder: "Search roles...",
      value: filters.search,
      onChange: handleGlobalSearchChange,
    },
  ];

  const {} = useRouter();

  if (error) {
    const errorResponse = (error as ErrorResponse)?.response?.data;
    return (
      <ErrorPage
        errorCode={errorResponse?.statusCode}
        message={errorResponse?.message}
      />
    );
  }

  const handleAddRole = () => {
    // Clear any existing role data
    console.log("Add Role button clicked");
    setCurrentRow(null);
    navigate({ to: "/user-management/add-roles-permission" });
  };

  const onPaginationChange = (page: number, pageSize: number) => {
    setPagination((prev) => ({ ...prev, page, limit: pageSize }));
  };

  return (
    <Main className={cn("flex flex-col gap-2 p-4")}>
      {/* User Directory Section */}
        <TablePageLayout
          title="Roles Management"
          description="Manage roles and permissions"
          onAddButtonClick={handleAddRole}
          addButtonText="Add Roles"
          modulePermission="roles_permission"
          moduleAction="add"
        >
          <div className="space-y-4">
            {/* Filter Section */}
            <GlobalFilterSection
              key="roles-management-filters"
              filters={filtersConfig}
              onCancelPress={clearFilters}
            />
            
            {/* Table */}
            <RolesTable
              data={allRoles}
              totalCount={totalCount}
              loading={isLoading}
              currentPage={pagination.page}
              paginationCallbacks={{ onPaginationChange }}
              defaultPageSize={pagination.limit}
            />
            
          </div>
        </TablePageLayout>
    </Main>
  );
};

export default Roles;
