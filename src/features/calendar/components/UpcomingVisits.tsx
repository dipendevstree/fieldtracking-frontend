import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { DEFAULT_PAGE_NUMBER, DEFAULT_PAGE_SIZE } from "@/data/app.data";
import debounce from "lodash.debounce";
import { useSelectOptions } from "@/hooks/use-select-option";
import { FilterConfig } from "@/components/global-filter-section";
import GlobalFilterSection from "@/components/global-table-filter-section";
import { useGetAllRolesForDropdown } from "@/features/UserManagement/services/Roles.hook";
import { useGetUsersForDropdown } from "@/features/buyers/services/users.hook";
import { useGetAllVisit } from "../services/calendar-view.hook";
import { FormData } from "./CalendarView";
import UpcomingVisitsTable from "./upcoming-visits-table";

export default function UpcomingVisits() {
  const [pagination, setPagination] = useState({
    page: DEFAULT_PAGE_NUMBER,
    limit: DEFAULT_PAGE_SIZE,
    startDate: new Date().toISOString().split("T")[0],
    endDate: new Date().toISOString().split("T")[0],
    searchFor: "",
    roleId: "",
    salesRepId: "",
  });

  const { watch, setValue } = useForm<FormData>({
    defaultValues: { roleId: "", salesRep: "", search: "" },
  });

  const { data: visits, totalCount, isLoading } = useGetAllVisit(pagination);

  const onPaginationChange = (page: number, pageSize: number) => {
    setPagination((prev) => ({ ...prev, page, limit: pageSize }));
  };

  const [selectedDate, setSelectedDate] = useState<string>("");

  const handleDateChange = (newDate?: string) => {
    const value = newDate ?? new Date().toISOString().split("T")[0];
    setSelectedDate(value);
    setPagination((prev) => ({ ...prev, startDate: value, endDate: value }));
  };

  const roleId = watch("roleId");
  const selectedRep = watch("salesRep");

  const debouncedSearch = useCallback(
    debounce((value: string) => {
      setPagination((prev) => ({
        ...prev,
        searchFor: value,
      }));
    }, 800),
    []
  );
  const handleGlobalSearchChange = (value: string | undefined) => {
    const searchValue = value ?? "";
    setValue("search", searchValue);
    debouncedSearch(searchValue);
  };

  const { data: allRoles } = useGetAllRolesForDropdown();
  const roles = useSelectOptions({
    listData: allRoles ?? [],
    labelKey: "roleName",
    valueKey: "roleId",
  }).map((option) => ({
    ...option,
    value: String(option.value),
  }));

  const { data: userList = [] } = useGetUsersForDropdown({
    roleId,
    enabled: true,
  });
  const enhancedUserList = userList.map((user: any) => ({
    ...user,
    fullName: `${user.firstName || ""} ${user.lastName || ""}`.trim(),
  }));
  const users = useSelectOptions({
    listData: enhancedUserList,
    labelKey: "fullName",
    valueKey: "id",
  }).map((option) => ({ ...option, value: String(option.value) }));

  const filters: FilterConfig[] = [
    {
      key: "date",
      type: "date",
      onChange: handleDateChange,
      placeholder: "Select date",
      value: selectedDate,
    },
    {
      key: "search",
      type: "search",
      onChange: handleGlobalSearchChange,
      placeholder: "Search visits by purpose...",
      value: watch("search"),
    },
    {
      key: "role",
      type: "select",
      onChange: (value) => setValue("roleId", value ?? ""),
      placeholder: "Select role",
      value: roleId,
      options: roles,
    },
    {
      key: "salesRep",
      type: "select",
      onChange: (value) => setValue("salesRep", value ?? ""),
      placeholder: "Select salesRep",
      value: selectedRep,
      options: users,
    },
  ];

  return (
    <>
      <GlobalFilterSection key={"calender-view-filters"} filters={filters} />

      <UpcomingVisitsTable
        data={visits}
        totalCount={totalCount}
        loading={isLoading}
        currentPage={pagination.page}
        paginationCallbacks={{ onPaginationChange }}
      />
    </>
  );
}
