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
import { BanknoteArrowDown, CalendarIcon } from "lucide-react";
import { Settings } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PendingRequest from "./components/PendingRequest";
import LeaveApprovalHistory from "./components/LeaveApprovalHistory";
import {
  useGetLeaveEncashmentApprovalStats,
  useGetLeaveRequestStats,
} from "../../services/leave-request.hook";
import { Main } from "@/components/layout/main";
import PendingLeaveEncashmentRequest from "./components/PendingLeaveEncashmentRequest";
import LeaveEncashmentApprovalHistory from "./components/LeaveEncashmentApprovalHistory";
import { useGetLeaveRulesConfig } from "../../services/leave-rules-config.action.hook";

const tabs = [
  {
    value: "pending-leave-request",
    label: "Pending Leave Request",
    component: PendingRequest,
  },
  {
    label: "Approval History",
    value: "approval-history",
    component: LeaveApprovalHistory,
  },
];

const encashmentTabs = [
  {
    value: "pending-encashment-request",
    label: "Pending Leave Encashment Request",
    component: PendingLeaveEncashmentRequest,
  },
  {
    label: "Leave Encashment Approval History",
    value: "approval-leave-encashment-history",
    component: LeaveEncashmentApprovalHistory,
  },
];

interface Props {
  dashboardView?: boolean;
}

export default function LeaveRequest({ dashboardView = false }: Props) {
  const [activeTab, setActiveTab] = useState("pending-leave-request");
  const { data: rulesData } = useGetLeaveRulesConfig();
  const [activeEncashmentTab, setActiveEncashmentTab] = useState(
    "pending-encashment-request",
  );
  const [dateRange, setDateRange] = useState<DateRange | undefined>(() => {
    return {
      from: subDays(new Date(), 7),
      to: new Date(),
    };
  });
  const [encashmentDateRange, setEncashmentDateRange] = useState<
    DateRange | undefined
  >(() => {
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
  const [encashmentPagination, setEncashmentPagination] = useState({
    page: DEFAULT_PAGE_NUMBER,
    limit: dashboardView ? 5 : DEFAULT_PAGE_SIZE,
    startDate: encashmentDateRange?.from
      ? format(encashmentDateRange.from, "yyyy-MM-dd")
      : "",
    endDate: encashmentDateRange?.to
      ? format(encashmentDateRange.to, "yyyy-MM-dd")
      : "",
    userId: "",
    status: "",
    sort: "desc",
  });

  const { data: usersList = [] } = useGetAllUsers();
  const { data: leaveRequestStats } = useGetLeaveRequestStats({
    startDate: pagination.startDate,
    endDate: pagination.endDate,
    userId: pagination.userId,
    leaveTypeId: pagination.leaveTypeId,
  });

  const { data: leaveEncashmentRequestStats } =
    useGetLeaveEncashmentApprovalStats({
      startDate: encashmentPagination.startDate,
      endDate: encashmentPagination.endDate,
      userId: encashmentPagination.userId,
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

  const { pending: _, ...LeaveStatus } = LeaveRequestStatus;

  const leaveTypeSelectOptions = useSelectOptions<any>({
    listData: Object.entries(LeaveStatus).map(([key, value]) => ({
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

  const handleEncashmentDateRangeChange = (newRange: DateRange | undefined) => {
    setEncashmentDateRange(newRange);
    setEncashmentPagination((prev) => ({
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

  const handleEncashmentFilterChange = (key: string, value: string) => {
    setEncashmentPagination((prev) => ({
      ...prev,
      page: 1,
      [key]: value,
    }));
  };

  const onPaginationChange = (page: number, pageSize: number) => {
    setPagination((prev) => ({ ...prev, page, limit: pageSize }));
  };

  const handleEncashmentPaginationChange = (page: number, pageSize: number) => {
    setEncashmentPagination((prev) => ({ ...prev, page, limit: pageSize }));
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
    ...(activeTab !== "pending-leave-request"
      ? ([
          {
            key: "status",
            type: "select",
            onChange: (value) => handleFilterChange("status", String(value)),
            placeholder: "Select Status",
            value: pagination.status,
            options: leaveTypeSelectOptions,
          },
        ] as FilterConfig[])
      : []),
    {
      key: "leaveTypeId",
      type: "select",
      onChange: (value) => handleFilterChange("leaveTypeId", String(value)),
      placeholder: "Select Type",
      value: pagination.leaveTypeId,
      options: leaveTypeOptions,
    },
  ];

  const leaveEncashmentFilters: FilterConfig[] = [
    {
      key: "date-range",
      type: "date-range",
      placeholder: "Filter by date",
      dateRangeValue: encashmentDateRange,
      onDateRangeChange: handleEncashmentDateRangeChange,
      dataRangeClassName: "w-full max-w-xs",
    },
    {
      key: "userId",
      type: "searchable-select",
      onChange: (value) =>
        handleEncashmentFilterChange("userId", String(value)),
      placeholder: "Select Sales Rep",
      value: encashmentPagination.userId,
      options: usersOptions,
      onCancelPress: () => handleEncashmentFilterChange("userId", ""),
      searchableSelectClassName: "w-full max-w-[180px]",
    },
    ...(activeEncashmentTab !== "pending-encashment-request"
      ? ([
          {
            key: "status",
            type: "select",
            onChange: (value) =>
              handleEncashmentFilterChange("status", String(value)),
            placeholder: "Select Status",
            value: encashmentPagination.status,
            options: leaveTypeSelectOptions,
          },
        ] as FilterConfig[])
      : []),
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

  const handleEncashmentCardClick = (status: LEAVE_STATUS) => {
    if (activeEncashmentTab !== "approval-leave-encashment-history") {
      setActiveEncashmentTab("approval-leave-encashment-history");
    }
    setEncashmentPagination((prev) => ({
      ...prev,
      page: 1,
      status,
    }));
  };

  const leaveRequestView = (
    <>
      {!dashboardView && (
        <>
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Pending Leave Requests
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
                  Approved Leave Requests
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
                  Rejected Leave Requests
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

          {rulesData && rulesData?.leaveEncashmentRuleActive && (
            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Pending Leave Encashment Requests
                  </CardTitle>
                  <BanknoteArrowDown
                    size={18}
                    className="h-4 w-4 text-muted-foreground"
                  />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {leaveEncashmentRequestStats?.pendingLeaveEncashmentRequest ||
                      0}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Currently Awaiting Approval
                  </p>
                </CardContent>
              </Card>

              <Card
                className="cursor-pointer"
                onClick={() => handleEncashmentCardClick(LEAVE_STATUS.APPROVED)}
              >
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Approved Leave Encashment Requests
                  </CardTitle>
                  <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {leaveEncashmentRequestStats?.approvedLeaveEncashmentRequest ||
                      0}
                  </div>
                  <p className="text-xs text-muted-foreground">Approved</p>
                </CardContent>
              </Card>

              <Card
                className="cursor-pointer"
                onClick={() => handleEncashmentCardClick(LEAVE_STATUS.REJECTED)}
              >
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Rejected Leave Encashment Requests
                  </CardTitle>
                  <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {leaveEncashmentRequestStats?.rejectedLeaveEncashmentRequest ||
                      0}
                  </div>
                  <p className="text-xs text-muted-foreground">Rejected</p>
                </CardContent>
              </Card>
            </div>
          )}
        </>
      )}

      {!dashboardView && (
        <GlobalFilterSection key={"leave-request-filters"} filters={filters} />
      )}

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-4 gap-0"
        id="pending-leave-section"
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
          const TabComponent = tab.component;
          return (
            <TabsContent
              key={tab.value}
              value={tab.value}
              className="space-y-4 mb-0"
            >
              <TabComponent
                pagination={pagination}
                onPaginationChange={onPaginationChange}
                dashboardView={dashboardView}
              />
            </TabsContent>
          );
        })}
      </Tabs>

      {rulesData && rulesData?.leaveEncashmentRuleActive && (
        <>
          {!dashboardView && (
            <GlobalFilterSection
              key={"leave-encashment-filters"}
              filters={leaveEncashmentFilters}
            />
          )}
          <Tabs
            value={activeEncashmentTab}
            onValueChange={setActiveEncashmentTab}
            className="space-y-4 gap-0"
            id="pending-leave-encashment-section"
          >
            <div className="overflow-x-auto">
              <TabsList className="w-full justify-start h-12 bg-muted/50 p-1">
                {encashmentTabs.map((tab) => {
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

            {encashmentTabs.map((tab) => {
              const TabComponent = tab.component;
              return (
                <TabsContent
                  key={tab.value}
                  value={tab.value}
                  className="space-y-4 mb-0"
                >
                  <TabComponent
                    pagination={encashmentPagination}
                    onPaginationChange={handleEncashmentPaginationChange}
                    dashboardView={dashboardView}
                  />
                </TabsContent>
              );
            })}
          </Tabs>
        </>
      )}
    </>
  );

  return dashboardView ? (
    <div className="space-y-6">{leaveRequestView}</div>
  ) : (
    <Main className="space-y-6">{leaveRequestView}</Main>
  );
}
