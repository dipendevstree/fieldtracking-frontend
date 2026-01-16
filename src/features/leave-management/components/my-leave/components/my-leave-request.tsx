import { FilterConfig, Option } from "@/components/global-filter-section";
import GlobalFilterSection from "@/components/global-table-filter-section";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import { DateRange } from "react-day-picker";
import {
  DEFAULT_PAGE_NUMBER,
  DEFAULT_PAGE_SIZE,
  LEAVE_STATUS,
} from "@/data/app.data";
import { LeaveRequestStatus } from "../../../data/schema";
import { useSelectOptions } from "@/hooks/use-select-option";
import { useGetAllLeaveTypes } from "@/features/leave-management/services/leave-type.action.hook";
import { formatDropDownLabel } from "@/utils/commonFunction";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PendingRequest from "../../leave-request/components/PendingRequest";
import { useAuthStore } from "@/stores/use-auth-store";
import { useViewType } from "@/context/view-type-context";
import { ViewType } from "@/components/layout/types";
import LeaveBalanceHistory from "../../leave-request/components/LeaveBalanceHistory";

const tabs = [
  {
    value: "pending-request",
    label: "Pending Request",
    component: PendingRequest,
  },
  {
    value: "leave-balance-history",
    label: "Leave Balance History",
    component: LeaveBalanceHistory,
  },
];

interface Props {
  calendarQueryParams: {
    startDate: string;
    endDate: string;
  };
}

export default function MyLeaveRequest({ calendarQueryParams }: Props) {
  const { viewType } = useViewType();
  const [activeTab, setActiveTab] = useState("pending-request");
  const { user } = useAuthStore();
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(calendarQueryParams.startDate),
    to: new Date(calendarQueryParams.endDate),
  });
  const [pagination, setPagination] = useState({
    page: DEFAULT_PAGE_NUMBER,
    limit: DEFAULT_PAGE_SIZE,
    startDate: dateRange?.from ? format(dateRange.from, "yyyy-MM-dd") : "",
    endDate: dateRange?.to ? format(dateRange.to, "yyyy-MM-dd") : "",
    userId: user?.id,
    status: LEAVE_STATUS.PENDING,
    leaveTypeId: "",
    sort: "desc",
  });

  const { data: leaveTypeList = [] } = useGetAllLeaveTypes();

  const leaveTypeOptions = useSelectOptions<any>({
    listData: leaveTypeList,
    labelKey: "name",
    valueKey: "id",
  }).map((option) => ({ ...option, value: String(option.value) }));

  const leaveTypeSelectOptions = useSelectOptions<any>({
    listData: Object.entries(LeaveRequestStatus).map(([key, value]) => ({
      label: formatDropDownLabel(value),
      value: String(key),
    })),
    labelKey: "label",
    valueKey: "value",
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
      key: "status",
      type: "select",
      onChange: (value) => handleFilterChange("status", String(value)),
      placeholder: "Select Status",
      value: pagination.status,
      options: leaveTypeSelectOptions,
    },
    {
      key: "leaveTypeId",
      type: "select",
      onChange: (value) => handleFilterChange("leaveTypeId", String(value)),
      placeholder: "Select Type",
      value: pagination.leaveTypeId,
      options: leaveTypeOptions,
    },
  ];

  useEffect(() => {
    setDateRange({
      from: new Date(calendarQueryParams.startDate),
      to: new Date(calendarQueryParams.endDate),
    });
    setPagination((prev) => ({
      ...prev,
      startDate: calendarQueryParams.startDate,
      endDate: calendarQueryParams.endDate,
    }));
  }, [calendarQueryParams]);

  return (
    <div className="space-y-6">
      <GlobalFilterSection key={"calender-view-filters"} filters={filters} />

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-4 gap-0"
      >
        <div className="overflow-x-auto">
          <TabsList className="w-full justify-start h-12 bg-muted/50 p-1">
            {tabs.map((tab) => {
              return (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className="gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm"
                >
                  {tab.label}
                </TabsTrigger>
              );
            })}
          </TabsList>
        </div>

        {tabs.map((tab) => {
          return (
            <TabsContent
              key={tab.value}
              value={tab.value}
              className="space-y-4 mb-0"
            >
              {tab.component({
                pagination: {
                  ...pagination,
                  selfView: viewType === ViewType.Self,
                },
                onPaginationChange,
                dashboardView: true,
              })}
            </TabsContent>
          );
        })}
      </Tabs>
    </div>
  );
}
