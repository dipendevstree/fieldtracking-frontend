import { useState, useCallback, useMemo, useEffect } from "react";
import { useNavigate, useRouter } from "@tanstack/react-router";
import { DEFAULT_PAGE_NUMBER, DEFAULT_PAGE_SIZE } from "@/data/app.data";
import { cn } from "@/lib/utils";
import { Main } from "@/components/layout/main";
import TablePageLayout from "@/components/layout/table-page-layout";
import { ErrorPage } from "@/components/shared/custom-error";
import { useGetAllRoles } from "../services/Roles.hook";
import { useRolesStore } from "../store/roles.store";
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
    setPagination((prev) => ({ ...prev, page: DEFAULT_PAGE_NUMBER }));
  }, [filters.search, filters.roleId]);

  const queryParams = useMemo(
    () => ({
      ...pagination,
      searchFor: filters.search || "",
    }),
    [pagination, filters],
  );

  const {
    totalCount = 0,
    allRoles = [],
    isLoading,
    error,
  } = useGetAllRoles(queryParams);

  const debouncedSearch = useCallback(
    debounce((value: string) => {
      setFilters({ search: value });
      setPagination((prev) => ({ ...prev, page: DEFAULT_PAGE_NUMBER })); // Reset to first page when searching
    }, 800),
    [],
  );

  const handleGlobalSearchChange = (value: string | undefined) => {
    const searchValue = value ?? "";

    debouncedSearch(searchValue);
  };

  const clearFilters = () => {
    setFilters({ search: "" });
    setPagination((prev) => ({ ...prev, page: DEFAULT_PAGE_NUMBER }));
  };

  const filtersConfig: FilterConfig[] = [
    {
      key: "search",
      type: "search",
      placeholder: "Search Roles...",
      value: filters.search,
      onChange: handleGlobalSearchChange,
    },
  ];

  const {} = useRouter();

  useEffect(() => {
    return () => {
      setFilters({});
    };
  }, []);

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

    setCurrentRow(null);
    navigate({ to: "/user-management/add-roles-permission" });
  };

  const onPaginationChange = (page: number, pageSize: number) => {
    setPagination((prev) => ({ ...prev, page, limit: pageSize }));
  };

  return (
    <Main className={cn("flex flex-col gap-2")}>
      {/* User Directory Section */}
      <TablePageLayout
        title="All Roles"
        description="Manage roles and permissions"
        onAddButtonClick={handleAddRole}
        addButtonText="Add Roles"
        modulePermission="roles_permission"
        moduleAction="add"
        className="p-0"
      >
        <div className="space-y-4">
          {/* Filter Section */}
          <GlobalFilterSection
            key="roles-management-filters"
            filters={filtersConfig}
            onCancelPress={clearFilters}
            className={"mb-0 mt-2"}
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
