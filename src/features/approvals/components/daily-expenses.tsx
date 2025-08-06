import { useState } from "react";
import { DEFAULT_PAGE_NUMBER, DEFAULT_PAGE_SIZE } from "@/data/app.data";
import { useSelectOptions } from "@/hooks/use-select-option";
import { FilterConfig } from "@/components/global-filter-section";
import GlobalFilterSection from "@/components/global-table-filter-section";
import DailyExpenseTable from "./daily-expense-table";
import { useGetAllDailyExpanses } from "../services/calendar-view.hook";
import { useGetUsers } from "@/features/livetracking/services/live-tracking-services";
import { DateRange } from "react-day-picker";
import { format } from "date-fns";

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

  const onSalesChange = (value: string) => {
    setPagination((prev) => ({
      ...prev,
      page: 1,
      salesRepresentativeUserId: value,
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

  const filters: FilterConfig[] = [
    {
      key: "date-range",
      type: "date-range",
      placeholder: "Filter by date",
      dateRangeValue: dateRange,
      onDateRangeChange: handleDateRangeChange,
    },
    {
      key: "salesRep",
      type: "searchable-select",
      onChange: (value) => onSalesChange(String(value)),
      placeholder: "Select salesRep",
      value: pagination.salesRepresentativeUserId,
      options: usersOptions,
      onCancelPress: () => onSalesChange(""),
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
