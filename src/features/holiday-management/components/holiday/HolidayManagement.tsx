import { useState } from "react";
import { format } from "date-fns";
import { Plus, CalendarIcon, Globe, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DeleteModal } from "@/components/shared/common-delete-modal";
import { HolidayActionDialog } from "./components/holiday-action-dialog";
import {
  useDeleteHoliday,
  useGetAllHolidays,
  useGetHolidayStats,
} from "@/features/holiday-management/services/holiday.action.hook";
import { Main } from "@/components/layout/main";
import { PermissionGate } from "@/permissions/components/PermissionGate";
import GlobalFilterSection from "@/components/global-table-filter-section";
import { FilterConfig, Option } from "@/components/global-filter-section";
import { DateRange } from "react-day-picker";
import { DEFAULT_PAGE_NUMBER, DEFAULT_PAGE_SIZE } from "@/data/app.data";
import { useGetAllHolidayTypes } from "../../services/holiday-type.action.hook";
import { useSelectOptions } from "@/hooks/use-select-option";
import HolidayListTable from "./components/holiday-list-table";
import { useHolidayStore } from "../../store/holiday-type.store";

export default function HolidayManagement() {
  const { open, setOpen, currentRow, setCurrentRow } = useHolidayStore();
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [pagination, setPagination] = useState({
    page: DEFAULT_PAGE_NUMBER,
    limit: DEFAULT_PAGE_SIZE,
    startDate: dateRange?.from ? format(dateRange.from, "yyyy-MM-dd") : "",
    endDate: dateRange?.to ? format(dateRange.to, "yyyy-MM-dd") : "",
    holidayTypeId: "",
    isSpecial: "",
    sort: "desc",
  });
  const { data: holidayStats } = useGetHolidayStats();
  const { data: holidayTypeList = [] } = useGetAllHolidayTypes();
  const { data: holidayList = [], isLoading } = useGetAllHolidays(pagination);
  const isSpecialList = [
    { value: "true", label: "Special" },
    { value: "false", label: "Not Special" },
  ];

  const holidayTypeOptions = useSelectOptions<any>({
    listData: holidayTypeList,
    labelKey: "holidayTypeName",
    valueKey: "id",
  }) as Option[];

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

  const onPaginationChange = (page: number, pageSize: number) => {
    setPagination((prev) => ({ ...prev, page, limit: pageSize }));
  };

  const { mutate: deleteHoliday } = useDeleteHoliday(
    currentRow?.id || "",
    () => {
      setOpen(null);
      setCurrentRow(null);
    }
  );

  // Handlers
  const openAddDialog = () => {
    setOpen("add");
    setCurrentRow(null);
  };

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
      key: "isSpecial",
      type: "select",
      onChange: (value) => handleFilterChange("isSpecial", String(value)),
      placeholder: "Select Type",
      value: pagination.isSpecial,
      options: isSpecialList,
    },
    {
      key: "holidayTypeId",
      type: "select",
      onChange: (value) => handleFilterChange("holidayTypeId", String(value)),
      placeholder: "Select Type",
      value: pagination.holidayTypeId,
      options: holidayTypeOptions,
    },
  ];

  return (
    <Main className="space-y-6 pb-10">
      <div className="grid gap-4 md:grid-cols-4">
        {/* Total Templates Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Holidays
            </CardTitle>
            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {holidayStats?.totalHolidayCount || 0}
            </div>
            <p className="text-xs text-muted-foreground">Active holidays</p>
          </CardContent>
        </Card>

        {/* Assigned Employees Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Special Holidays
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {holidayStats?.totalSpecialHolidayCount || 0}
            </div>
            <p className="text-xs text-muted-foreground">From total holidays</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Holidays of {new Date().getFullYear()}
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {holidayStats?.currentYearHolidayCount || 0}
            </div>
            <p className="text-xs text-muted-foreground">From total holidays</p>
          </CardContent>
        </Card>

        {/* Total Regions Card (New) */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Holiday In Holiday Template
            </CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {holidayStats?.holidayInHolidayTemplateCount || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Distinct regions configured
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">
          List of Holidays
        </h2>
        <PermissionGate requiredPermission="list_of_holidays" action="add">
          <Button onClick={openAddDialog}>
            <Plus className="mr-2 h-4 w-4" /> Add Holiday
          </Button>
        </PermissionGate>
      </div>

      <GlobalFilterSection key={"holiday-filters"} filters={filters} />

      <HolidayListTable
        data={holidayList}
        totalCount={holidayList?.length || 0}
        loading={isLoading}
        paginationCallbacks={{ onPaginationChange }}
        currentPage={pagination.page}
        defaultPageSize={DEFAULT_PAGE_SIZE}
      />

      <HolidayActionDialog
        open={open === "add"}
        onOpenChange={() => setOpen(null)}
        holidayToEdit={null}
      />

      {currentRow && (
        <>
          <HolidayActionDialog
            open={open === "edit"}
            onOpenChange={() => setOpen(null)}
            holidayToEdit={currentRow}
          />
          <DeleteModal
            open={open === "delete"}
            currentRow={currentRow}
            itemIdentifier="name"
            itemName="Holiday"
            onDelete={() => deleteHoliday()}
            onOpenChange={(value) => {
              if (!value) setOpen(null);
              else setOpen("delete");
            }}
          />
        </>
      )}
    </Main>
  );
}
