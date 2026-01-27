import { FilterConfig, Option } from "@/components/global-filter-section";
import GlobalFilterSection from "@/components/global-table-filter-section";
import { format, subDays } from "date-fns";
import { useState } from "react";
import { DateRange } from "react-day-picker";
import {
  DEFAULT_PAGE_NUMBER,
  DEFAULT_PAGE_SIZE,
  LEAVE_STATUS,
} from "@/data/app.data";
import { LeaveRequestStatus } from "../../data/schema";
import { useGetAllUsers } from "@/features/UserManagement/services/AllUsers.hook";
import { useSelectOptions } from "@/hooks/use-select-option";
import { useGetAllLeaveTypes } from "@/features/leave-management/services/leave-type.action.hook";
import { formatDropDownLabel } from "@/utils/commonFunction";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarIcon } from "lucide-react";
import { Settings } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PendingRequest from "./components/PendingRequest";
import LeaveApprovalHistory from "./components/LeaveApprovalHistory";
import { useGetLeaveRequestStats } from "../../services/leave-request.hook";
import { Main } from "@/components/layout/main";

const tabs = [
  {
    value: "pending-request",
    label: "Pending Request",
    component: PendingRequest,
  },
  {
    label: "Approval History",
    value: "approval-history",
    component: LeaveApprovalHistory,
  },
];

interface Props {
  dashboardView?: boolean;
}

export default function LeaveRequest({ dashboardView = false }: Props) {
  const [activeTab, setActiveTab] = useState("pending-request");
  const [dateRange, setDateRange] = useState<DateRange | undefined>(() => {
    return {
      from: subDays(new Date(), 7),
      to: new Date(),
    };
  });
  const [pagination, setPagination] = useState({
    page: DEFAULT_PAGE_NUMBER,
    limit: dashboardView ? 5 : DEFAULT_PAGE_SIZE,
    startDate: dateRange?.from ? format(dateRange.from, "yyyy-MM-dd") : "",
    endDate: dateRange?.to ? format(dateRange.to, "yyyy-MM-dd") : "",
    userId: "",
    status: "",
    leaveTypeId: "",
    sort: "desc",
  });

  const { data: usersList = [] } = useGetAllUsers({ onlyTeamMembers: true });
  const { data: leaveRequestStats } = useGetLeaveRequestStats({
    startDate: pagination.startDate,
    endDate: pagination.endDate,
    userId: pagination.userId,
    leaveTypeId: pagination.leaveTypeId,
  });

  const usersOptions = useSelectOptions<any>({
    listData: usersList?.map((user: any) => ({
      ...user,
      fullName: `${user.firstName || ""} ${user.lastName || ""}`.trim(),
    })),
    labelKey: "fullName",
    valueKey: "id",
  }).map((option) => ({ ...option, value: String(option.value) }));

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
      key: "userId",
      type: "searchable-select",
      onChange: (value) => handleFilterChange("userId", String(value)),
      placeholder: "Select Sales Rep",
      value: pagination.userId,
      options: usersOptions,
      onCancelPress: () => handleFilterChange("userId", ""),
      searchableSelectClassName: "w-full max-w-[180px]",
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

  const handleCardClick = (status: LEAVE_STATUS) => {
    if (activeTab !== "approval-history") {
      setActiveTab("approval-history");
    }
    setPagination((prev) => ({
      ...prev,
      page: 1,
      status,
    }));
  };

  const leaveRequestView = (
    <>
      {!dashboardView && (
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Leave Requests
              </CardTitle>
              <Settings className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {leaveRequestStats?.totalLeaveRequest || 0}
              </div>
              <p className="text-xs text-muted-foreground">
                Currently Awaiting Approval
              </p>
            </CardContent>
          </Card>

          <Card
            className="cursor-pointer"
            onClick={() => handleCardClick(LEAVE_STATUS.APPROVED)}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Approved Leave
              </CardTitle>
              <CalendarIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {leaveRequestStats?.approvedLeaveRequest || 0}
              </div>
              <p className="text-xs text-muted-foreground">Approved</p>
            </CardContent>
          </Card>

          <Card
            className="cursor-pointer"
            onClick={() => handleCardClick(LEAVE_STATUS.REJECTED)}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Rejected Leave
              </CardTitle>
              <CalendarIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {leaveRequestStats?.rejectedLeaveRequest || 0}
              </div>
              <p className="text-xs text-muted-foreground">Rejected</p>
            </CardContent>
          </Card>
        </div>
      )}
      {!dashboardView && (
        <GlobalFilterSection key={"calender-view-filters"} filters={filters} />
      )}

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
                pagination,
                onPaginationChange,
                dashboardView,
              })}
            </TabsContent>
          );
        })}
      </Tabs>
    </>
  );

  return dashboardView ? (
    <div className="space-y-6">{leaveRequestView}</div>
  ) : (
    <Main className="space-y-6">{leaveRequestView}</Main>
  );
}
