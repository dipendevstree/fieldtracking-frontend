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
      roleId: filters.roleId || "",
    }),
    [pagination, filters.search, filters.roleId]
  );

  useEffect(() => {
    console.log("Search query params:", queryParams);
  }, [queryParams]);

  // Organizations data
  const {
    totalCount = 0,
    allRoles = [],
    isLoading,
    error,
  } = useGetAllRoles(queryParams);

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

  const debouncedSearch = useCallback(
    debounce((value: string) => {
      setPagination((prev) => ({ ...prev, searchFor: value }));
    }, 800),
    []
  );

  const handleGlobalSearchChange = (value: string | undefined) => {
    const searchValue = value ?? "";
    debouncedSearch(searchValue);
  };

  const handleRoleFilterChange = (value: string | undefined) => {
    setFilters({ roleId: value ?? "" });
  };

  const clearFilters = () => {
    setFilters({ search: "", roleId: "" });
  };

  const filtersConfig: FilterConfig[] = [
    {
      key: "search",
      type: "search",
      placeholder: "Search roles...",
      value: filters.search,
      onChange: handleGlobalSearchChange,
    },
    {
      key: "roleId",
      type: "select",
      placeholder: "Role",
      value: filters.roleId,
      onChange: handleRoleFilterChange,
      options: roleOptions,
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

  const handleEditRole = (roleData: any) => {
    console.log("Edit Role button clicked", roleData);
    setCurrentRow(roleData);
    navigate({
      to: `/user-management/edit-roles-permission/${roleData.roleId}`,
    });
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
              onEditRole={handleEditRole}
            />
            
          </div>
        </TablePageLayout>
    </Main>
  );
};

export default Roles;
