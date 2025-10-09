import { useState, useCallback, useMemo } from "react";
import { useRouter } from "@tanstack/react-router";
import { DEFAULT_PAGE_NUMBER, DEFAULT_PAGE_SIZE } from "@/data/app.data";
import { cn } from "@/lib/utils";
import { Main } from "@/components/layout/main";
import TablePageLayout from "@/components/layout/table-page-layout";
import { ErrorPage } from "@/components/shared/custom-error";
import { ErrorResponse } from "../merchants/types";
import { UsersActionModal } from "./components/action-form-modal";
import AllUsersTable from "./components/table";
import { useGetAllUsers } from "./services/AllUsers.hook";
import { useUsersStore } from "./store/users.store";
import { useGetAllTerritoriesForDropdown } from "../userterritory/services/user-territory.hook";
import { useGetAllRolesForDropdown } from "./services/Roles.hook";
import { useSelectOptions } from "@/hooks/use-select-option";
import GlobalFilterSection from "@/components/global-table-filter-section";
import debounce from "lodash.debounce";
import { useAuthStore } from "@/stores/use-auth-store";
import { SearchFilterConfig, SelectFilterConfig } from "./types";

const AllUsers = () => {
  const [pagination, setPagination] = useState({
    page: DEFAULT_PAGE_NUMBER,
    limit: DEFAULT_PAGE_SIZE,
  });

  const { user } = useAuthStore();
  const allowTerritoryFilter =
    user?.organization?.allowAddUsersBasedOnTerritories;

  const { filters, setFilters, setOpen, open } = useUsersStore();

  const queryParams = useMemo((): any => {
    const params: any = {
      ...pagination,
      searchFor: filters.search || "",
      roleId: filters.roleId || "",
    };

    if (allowTerritoryFilter) {
      params.territoryId = filters.territoryId || "";
    }

    return params;
  }, [pagination, filters, allowTerritoryFilter]);

  // Organizations data
  const {
    totalCount = 0,
    allUsers = [],
    isLoading,
    error,
  } = useGetAllUsers(queryParams);

  // Debug logging
  console.log("Users query params:", queryParams);
  console.log("Users data:", allUsers);
  console.log("Total count:", totalCount);
  console.log("Loading:", isLoading);
  console.log("Error:", error);

  // Get filter options
  const { data: territoryList = [] } = useGetAllTerritoriesForDropdown();
  const { data: roleList = [] } = useGetAllRolesForDropdown();

  const territoryOptions = useSelectOptions({
    listData: territoryList ?? [],
    labelKey: "name",
    valueKey: "id",
  }).map((option) => ({
    ...option,
    value: String(option.value),
  }));

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
      setFilters({ search: value });
    }, 800),
    []
  );

  const handleGlobalSearchChange = (value: string | undefined) => {
    const searchValue = value ?? "";
    debouncedSearch(searchValue);
  };

  const filtersConfig: (SearchFilterConfig | SelectFilterConfig)[] = [
    {
      key: "search",
      type: "search",
      placeholder: "Search users...",
      value: filters.search,
      onChange: handleGlobalSearchChange,
    },
    ...(allowTerritoryFilter
      ? [
          {
            key: "territoryId",
            type: "searchable-select",
            placeholder: "Territory",
            value: filters.territoryId,
            onChange: (value) => setFilters({ territoryId: value ?? "" }),
            onCancelPress: () => setFilters({ territoryId: "" }),
            options: territoryOptions,
            searchableSelectClassName: "w-full max-w-[180px]",
          } as SelectFilterConfig,
        ]
      : []),
    {
      key: "roleId",
      type: "searchable-select",
      placeholder: "Role",
      value: filters.roleId,
      onChange: (value) => setFilters({ roleId: value ?? "" }),
      onCancelPress: () => setFilters({ roleId: "" }),
      options: roleOptions,
      searchableSelectClassName: "w-full max-w-[180px]",
    } as SelectFilterConfig,
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

  const handleAddUser = () => {
    console.log("Add User button clicked");
    setOpen("add");
  };

  const onPaginationChange = (page: number, pageSize: number) => {
    setPagination((prev) => ({ ...prev, page, limit: pageSize }));
  };

  return (
    <Main className={cn("flex flex-col gap-2")}>
      <TablePageLayout
        title="All Users"
        description="Manage user accounts and permissions"
        onAddButtonClick={handleAddUser}
        addButtonText="Add User"
        modulePermission="all_users"
        moduleAction="add"
        className="p-0"
      >
        <div className="space-y-4">
          {/* Filter Section */}
          <GlobalFilterSection
            key="user-management-filters"
            filters={filtersConfig}
            className={"mb-0 mt-2"}
          />

          {/* Table */}
          <AllUsersTable
            data={allUsers}
            totalCount={totalCount}
            loading={isLoading}
            currentPage={pagination.page}
            paginationCallbacks={{ onPaginationChange }}
          />
        </div>
      </TablePageLayout>

      {open && <UsersActionModal key={"users-action-modal"} />}
    </Main>
  );
};

export default AllUsers;
