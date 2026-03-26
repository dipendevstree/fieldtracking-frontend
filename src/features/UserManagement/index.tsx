import { useState, useCallback, useMemo, useEffect } from "react";
import { useSearch } from "@tanstack/react-router";
import { DEFAULT_PAGE_NUMBER, DEFAULT_PAGE_SIZE } from "@/data/app.data";
import { cn } from "@/lib/utils";
import { Main } from "@/components/layout/main";
import TablePageLayout from "@/components/layout/table-page-layout";
import { ErrorPage } from "@/components/shared/custom-error";
import { ErrorResponse } from "../merchants/types";
import { UsersActionModal } from "./components/action-form-modal";
import { BulkImportModal } from "./components/bulk-import-modal";
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
import { toast } from "sonner";
import { PermissionGate } from "@/permissions/components/PermissionGate";
import CustomTableHeader from "@/components/shared/custom-table-header";
import ActionButton from "@/components/shared/table-primary-action-button";
import {
  FileUp as IconFileImport,
  // FileDown as IconFileExport,
  // Loader2,
} from "lucide-react";
// import { useExportFile } from "@/hooks/useExportFile";
// import API from "@/config/api/api";

const AllUsers = () => {
  const [pagination, setPagination] = useState({
    page: DEFAULT_PAGE_NUMBER,
    limit: DEFAULT_PAGE_SIZE,
  });

  const { user } = useAuthStore();
  const maxEmployeeCountString =
    user?.organization?.employeeRang?.employeeRange;
  const match = maxEmployeeCountString?.toString().match(/\d+\s*-\s*(\d+)/);
  const maxEmployeeCount = match ? parseInt(match[1]) : 0;
  const allowTerritoryFilter =
    user?.organization?.allowAddUsersBasedOnTerritories;
  // const { exportFile, isLoading: isExportLoading } = useExportFile();

  const { filters, setFilters, setOpen, open } = useUsersStore();
  const { noAdmin } = useSearch({
    from: "/_authenticated/user-management/",
  } as any);
  const queryParams = useMemo((): any => {
    const params: any = {
      ...pagination,
      searchFor: filters.search || "",
      roleId: filters.roleId || "",
      noAdmin,
    };

    if (allowTerritoryFilter) {
      params.territoryId = filters.territoryId || "";
    }

    return params;
  }, [pagination, filters, allowTerritoryFilter, noAdmin]);

  // Organizations data
  const {
    totalCount = 0,
    allUsers = [],
    isLoading,
    error,
  } = useGetAllUsers(queryParams);

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
    [],
  );

  const handleGlobalSearchChange = (value: string | undefined) => {
    const searchValue = value ?? "";
    debouncedSearch(searchValue);
  };

  const filtersConfig: (SearchFilterConfig | SelectFilterConfig)[] = [
    {
      key: "search",
      type: "search",
      placeholder: "Search Users...",
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
      placeholder: "Select Role",
      value: filters.roleId,
      onChange: (value) => setFilters({ roleId: value ?? "" }),
      onCancelPress: () => setFilters({ roleId: "" }),
      options: roleOptions,
      searchableSelectClassName: "w-full max-w-[180px]",
    } as SelectFilterConfig,
  ];

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
    if (Number(totalCount) >= maxEmployeeCount) {
      toast.error("Invalid action", {
        description:
          "You have exceeded the maximum number of limits to add the new users. Please contact FieldTrack360 Support Team to add new users.",
        duration: 5000,
        position: "top-right",
      });
      return;
    }
    setOpen("add");
  };

  const onPaginationChange = (page: number, pageSize: number) => {
    setPagination((prev) => ({ ...prev, page, limit: pageSize }));
  };

  useEffect(() => {
    return () => {
      if (open) {
        setOpen(null);
      }
    };
  }, [open]);

  useEffect(() => {
    return () => {
      setFilters({});
    };
  }, []);

  // Show loading state
  if (isLoading)
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    );

  return (
    <Main className={cn("flex flex-col gap-2")}>
      <TablePageLayout
        title=""
        customHeader={
          <CustomTableHeader
            title="All Users"
            subtitle="Manage user accounts and permissions"
            onAddButtonClick={handleAddUser}
            addButtonText="Add User"
            modulePermission="all_users"
            showActionButton={false}
            className="w-full"
          >
            {/* <PermissionGate requiredPermission="all_users" action="viewGlobal">
              <ActionButton
                text="Export Users"
                onAction={() =>
                  exportFile({
                    url: API.users.exportCsv,
                    type: "csv",
                    queryParams: queryParams,
                  })
                }
                icon={isExportLoading || isLoading ? Loader2 : IconFileExport}
                disabled={isExportLoading || isLoading || totalCount === 0}
                className="flex items-center gap-2"
              />
            </PermissionGate> */}
            <PermissionGate requiredPermission="all_users" action="add">
              <ActionButton
                text="Import Users"
                onAction={() => setOpen("import")}
                icon={IconFileImport}
                className="flex items-center gap-2"
              />
            </PermissionGate>
            <PermissionGate requiredPermission="all_users" action="add">
              <ActionButton
                text="Add User"
                onAction={handleAddUser}
                className="flex items-center gap-2"
              />
            </PermissionGate>
          </CustomTableHeader>
        }
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
            pageSize={pagination.limit}
            paginationCallbacks={{ onPaginationChange }}
          />
        </div>
      </TablePageLayout>

      {open === "add" || open === "edit" || open === "delete" ? (
        <UsersActionModal key={"users-action-modal"} />
      ) : null}
      <BulkImportModal key="bulk-import-modal" />
    </Main>
  );
};

export default AllUsers;
