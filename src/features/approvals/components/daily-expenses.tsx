import { useState } from "react";
import {
  DEFAULT_PAGE_NUMBER,
  DEFAULT_PAGE_SIZE,
  EXPENSE_STATUS,
  EXPENSE_SUB_TYPE,
  EXPENSE_TYPE,
} from "@/data/app.data";
import { useSelectOptions } from "@/hooks/use-select-option";
import { FilterConfig } from "@/components/global-filter-section";
import GlobalFilterSection from "@/components/global-table-filter-section";
import DailyExpenseTable from "./daily-expense-table";
import { useGetAllDailyExpanses } from "../services/calendar-view.hook";
import { useGetUsers } from "@/features/livetracking/services/live-tracking-services";
import { DateRange } from "react-day-picker";
import { format } from "date-fns";
import { formatDropDownLabel } from "@/utils/commonFunction";
import {
  formatExpenseSubType,
  formatExpenseType,
} from "@/utils/commonFormatters";

export default function DailyExpenses() {
  const initialDateRange: DateRange = {
    from: new Date(),
    to: new Date(),
  };

  const [dateRange, setDateRange] = useState<DateRange | undefined>(
    initialDateRange
  );
  const [pagination, setPagination] = useState({
    page: DEFAULT_PAGE_NUMBER,
    limit: DEFAULT_PAGE_SIZE,
    startDate: initialDateRange.from
      ? format(initialDateRange.from, "yyyy-MM-dd")
      : "",
    endDate: initialDateRange.to
      ? format(initialDateRange.to, "yyyy-MM-dd")
      : "",
    salesRepresentativeUserId: "",
    expenseType: "",
    status: "",
    expenseSubType: "",
    sort:"desc"
  });

  const {
    data: dailyExpanses,
    totalCount,
    isPending,
  } = useGetAllDailyExpanses(pagination);

  const onPaginationChange = (page: number, pageSize: number) => {
    setPagination((prev) => ({ ...prev, page, limit: pageSize }));
  };

  const handleDateRangeChange = (newRange: DateRange | undefined) => {
    setDateRange(newRange);
    setPagination((prev) => ({
      ...prev,
      page: 1,
      startDate: newRange?.from ? format(newRange.from, "yyyy-MM-dd") : "",
      endDate: newRange?.to ? format(newRange.to, "yyyy-MM-dd") : "",
    }));
  };

  const handleFilterChange = (key: string, value: string) => {
    setPagination((prev) => ({
      ...prev,
      page: 1,
      [key]: value,
    }));
  };

  const { listData: userListDropDownData = [] } = useGetUsers();

  const userListDropDownList = userListDropDownData?.map((user: any) => ({
    ...user,
    fullName: `${user.firstName || ""} ${user.lastName || ""}`.trim(),
  }));

  const usersOptions = useSelectOptions<any>({
    listData: userListDropDownList,
    labelKey: "fullName",
    valueKey: "id",
  }).map((option) => ({ ...option, value: String(option.value) }));

  const expanseTypeOptions = Object.entries(EXPENSE_TYPE).map(
    ([key, value]) => ({
      label: formatExpenseType(key),
      value,
    })
  );

  const expanseStatusOptions = Object.entries(EXPENSE_STATUS).map(
    ([key, value]) => ({
      label: formatDropDownLabel(key),
      value,
    })
  );

  const expanseSubTypeOptions = Object.entries(EXPENSE_SUB_TYPE).map(
    ([key, value]) => ({
      label: formatExpenseSubType(key),
      value,
    })
  );

  const filters: FilterConfig[] = [
    {
      key: "date-range",
      type: "date-range",
      placeholder: "Filter by date",
      dateRangeValue: dateRange,
      onDateRangeChange: handleDateRangeChange,
      dataRangeClassName: "w-full max-w-xs",
    },
    {
      key: "salesRepresentativeUserId",
      type: "searchable-select",
      onChange: (value) =>
        handleFilterChange("salesRepresentativeUserId", String(value)),
      placeholder: "Select Sales Rep",
      value: pagination.salesRepresentativeUserId,
      options: usersOptions,
      onCancelPress: () => handleFilterChange("salesRepresentativeUserId", ""),
      searchableSelectClassName: "w-full max-w-[180px]",
    },
    {
      key: "expenseType",
      type: "select",
      onChange: (value) => handleFilterChange("expenseType", String(value)),
      placeholder: "Select Type",
      value: pagination.expenseType,
      options: expanseTypeOptions,
    },
    {
      key: "status",
      type: "select",
      onChange: (value) => handleFilterChange("status", String(value)),
      placeholder: "Select Status",
      value: pagination.status,
      options: expanseStatusOptions,
    },
    {
      key: "expenseSubType",
      type: "select",
      onChange: (value) => handleFilterChange("expenseSubType", String(value)),
      placeholder: "Select Sub Type",
      value: pagination.expenseSubType,
      options: expanseSubTypeOptions,
    },
  ];

  return (
    <>
      <GlobalFilterSection key={"calender-view-filters"} filters={filters} />

      <DailyExpenseTable
        data={dailyExpanses}
        totalCount={totalCount}
        loading={isPending}
        currentPage={pagination.page}
        paginationCallbacks={{ onPaginationChange }}
        defaultPageSize={pagination.limit}
      />
    </>
  );
}
