import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  DEFAULT_PAGE_NUMBER,
  DEFAULT_PAGE_SIZE,
  Priority,
} from "@/data/app.data";
import debounce from "lodash.debounce";
import { useSelectOptions } from "@/hooks/use-select-option";
import { FilterConfig } from "@/components/global-filter-section";
import GlobalFilterSection from "@/components/global-table-filter-section";
import { useGetAllRolesForDropdown } from "@/features/UserManagement/services/Roles.hook";
import { useGetUsersForDropdown } from "@/features/buyers/services/users.hook";
import {
  useGetAllCustomer,
  useGetAllVisit,
} from "../services/calendar-view.hook";
import { FormData } from "../type/type";
import UpcomingVisitsTable from "./upcoming-visits-table";
import { formatDropDownLabel } from "@/utils/commonFunction";
import { DateRange } from "react-day-picker";
import { addDays, format } from "date-fns";
import { Main } from "@/components/layout/main";
import { cn } from "@/lib/utils";

export default function UpcomingVisits() {
  const [pagination, setPagination] = useState({
    page: DEFAULT_PAGE_NUMBER,
    limit: DEFAULT_PAGE_SIZE,
    startDate: new Date().toISOString().split("T")[0],
    endDate: format(addDays(new Date(), 7), "yyyy-MM-dd"),
    searchFor: "",
    roleId: "",
    salesRepresentativeUserId: "",
    isUpcoming: true,
    customerId: "",
    status: "pending",
  });

  const [selectedRange, setSelectedRange] = useState<DateRange | undefined>({
    from: new Date(),
    to: addDays(new Date(), 7),
  });

  const { watch, setValue } = useForm<FormData>({
    defaultValues: {
      roleId: "",
      salesRep: "",
      search: "",
      customerId: "",
      priority: "",
    },
  });

  const { data: visits, totalCount, isLoading } = useGetAllVisit(pagination);

  const onPaginationChange = (page: number, pageSize: number) => {
    setPagination((prev) => ({ ...prev, page, limit: pageSize }));
  };

  const handleDateRangeChange = (range?: DateRange) => {
    setSelectedRange(range);
    setPagination((prev) => ({
      ...prev,
      startDate: range?.from
        ? format(range.from, "yyyy-MM-dd")
        : new Date().toISOString().split("T")[0],
      endDate: range?.to
        ? format(range.to, "yyyy-MM-dd")
        : new Date().toISOString().split("T")[0],
    }));
  };

  const roleId = watch("roleId");
  const selectedRep = watch("salesRep");
  const customerId = watch("customerId");
  const priority = watch("priority");

  useEffect(() => {
    setPagination((prev) => ({
      ...prev,
      roleId,
      salesRepresentativeUserId: selectedRep,
      customerId,
      priority,
    }));
  }, [roleId, selectedRep, customerId, priority]);

  const debouncedSearch = useCallback(
    debounce((value: string) => {
      setPagination((prev) => ({
        ...prev,
        searchFor: value,
      }));
    }, 800),
    [],
  );
  const handleGlobalSearchChange = (value: string | undefined) => {
    const searchValue = value ?? "";
    setValue("search", searchValue);
    debouncedSearch(searchValue);
  };

  const { data: customers } = useGetAllCustomer();
  const customerOptions = useSelectOptions({
    listData: customers ?? [],
    labelKey: "companyName",
    valueKey: "customerId",
  }).map((option) => ({
    ...option,
    value: String(option.value),
  }));

  const priorityOptions = Object.entries(Priority).map(([key, value]) => ({
    label: formatDropDownLabel(key),
    value,
  }));

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
      key: "dateRange",
      type: "date-range",
      placeholder: "Select Date Range",
      dateRangeValue: selectedRange,
      onDateRangeChange: handleDateRangeChange,
      dataRangeClassName: "w-full max-w-xs",
      disablePastDates: true,
    },
    {
      key: "search",
      type: "search",
      onChange: handleGlobalSearchChange,
      placeholder: "Search Visits By Purpose...",
      value: watch("search"),
    },
    {
      key: "role",
      type: "searchable-select",
      onChange: (value) => setValue("roleId", value ?? ""),
      onCancelPress: () => setValue("roleId", ""),
      placeholder: "Select Role",
      value: roleId,
      options: roles,
      searchableSelectClassName: "w-full max-w-[180px]",
    },
    {
      key: "salesRep",
      type: "searchable-select",
      onChange: (value) => setValue("salesRep", value ?? ""),
      onCancelPress: () => setValue("salesRep", ""),
      placeholder: "Select Sales Rep",
      value: selectedRep,
      options: users,
      searchableSelectClassName: "w-full max-w-[180px]",
    },
    {
      key: "customerId",
      type: "searchable-select",
      onChange: (value) => setValue("customerId", value ?? ""),
      onCancelPress: () => setValue("customerId", ""),
      placeholder: "Select Customer",
      value: customerId,
      options: customerOptions,
      searchableSelectClassName: "w-full max-w-[180px]",
    },
    {
      key: "priority",
      type: "searchable-select",
      onChange: (value) => setValue("priority", value ?? ""),
      onCancelPress: () => setValue("priority", ""),
      placeholder: "Select Priority",
      value: priority,
      options: priorityOptions,
      searchableSelectClassName: "w-full max-w-[180px]",
    },
  ];

  return (
    <Main className={cn("flex flex-col gap-2 p-4")}>
      <GlobalFilterSection
        key={"calender-view-filters"}
        filters={filters}
        className={"mb-4"}
      />

      <UpcomingVisitsTable
        data={visits}
        totalCount={totalCount}
        loading={isLoading}
        currentPage={pagination.page}
        paginationCallbacks={{ onPaginationChange }}
      />
    </Main>
  );
}
