import { useState, useCallback, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, MapPin } from "lucide-react";
import { SalesRep, DashboardKPI, AuditPagination } from "../type/type";
import {
  useGetCustomers,
  useGetCustomerType,
} from "@/features/customers/services/Customers.hook";
import { useGetAllVisit } from "@/features/calendar/services/calendar-view.hook";
import { useGetIndustry } from "@/features/customers/services/Customers.hook";
import { useGetUsers } from "@/features/livetracking/services/live-tracking-services";
import debounce from "lodash.debounce";
import { CustomDataTable } from "@/components/shared/custom-data-table";
import { useGetAuditLogs, useGetStats } from "../services/OverView.hook";
import { endOfDay, startOfDay } from "date-fns";
import {
  formatDropDownLabel,
  formatName,
  getFullName,
} from "@/utils/commonFunction";
import { DateRange } from "react-day-picker";
import { Button } from "@/components/ui/button";
import { useNavigate } from "@tanstack/react-router";
import { PRIORITY } from "@/data/app.data";
import { scheduleColumns } from "./columns/scheduleColumns";
import { customerColumns } from "./columns/customerColumns";
import { auditLogColumns } from "./columns/auditLogColumns";
import { FilterConfig } from "@/components/global-filter-section";
import GlobalFilterSection from "@/components/global-table-filter-section";

interface OverviewProps {
  salesReps: SalesRep[];
  kpis: DashboardKPI;
  loading?: boolean;
}

export default function Overview({ salesReps: _salesReps }: OverviewProps) {
  const navigate = useNavigate();
  const limit = 5;
  const [schedulePagination, setSchedulePagination] = useState({
    startDate: new Date().toISOString().split("T")[0],
    endDate: new Date().toISOString().split("T")[0],
    searchFor: "",
    sort: "desc",
    status: "",
    customerId: "",
    salesRepresentativeUserId: "",
    priority: "",
  });

  const [customerPagination, setCustomerPagination] = useState({
    searchFor: "",
    sort: "desc",
    industryId: "",
    customerTypeId: "",
  });

  const [auditPagination, setAuditPagination] = useState<AuditPagination>({
    page: 1,
    limit: 10,
    entity: "",
    action: undefined,
    userId: "",
  });

  const [selectedDateRange, setSelectedDateRange] = useState<
    DateRange | undefined
  >(undefined);

  // Get customer data from API with proper parameters
  const {
    data: customersResponse = { list: [], totalCount: 0 },
    isLoading: customersLoading,
    totalCount: customerTotalCount = 0,
  } = useGetCustomers(customerPagination);

  // Extract customers list from response
  const customers = customersResponse?.list || [];

  // Get stats data for filter
  const { data: stats, isLoading: isStatsLoading } = useGetStats();

  // Get schedule/visit data from API with proper parameters
  const {
    data: scheduleData = [],
    isLoading: scheduleLoading,
    totalCount: scheduleTotalCount = 0,
  } = useGetAllVisit(schedulePagination);

  // Get live tracking users data to count active users
  const { listData: liveTrackingUsers = [] } = useGetUsers({
    // page: 1,
    // limit: 1000, // Get all users to count them
    includeLatLong: true,
  });

  // Get customerType data for filter
  const { data: customerTypeList = [] } = useGetCustomerType();

  // Get Audit logs data from API with proper parameters
  const {
    data: auditLogsResponse = {
      list: [],
      totalCount: 0,
      totalPages: 0,
      currentPage: 1,
    },
    isLoading: auditLogsLoading,
  } = useGetAuditLogs(auditPagination);

  const auditLogsList = auditLogsResponse.list || [];

  // Debounced search for schedule
  const debouncedScheduleSearch = useCallback(
    debounce((value: string) => {
      setSchedulePagination((prev) => ({
        ...prev,
        searchFor: value,
        page: 1, // Reset to first page when searching
      }));
    }, 800),
    []
  );

  const handleScheduleSearchChange = useCallback(
    (value: string) => {
      debouncedScheduleSearch(value);
    },
    [debouncedScheduleSearch]
  );

  const handleScheduleCustomerFilterChange = (value: string) => {
    setSchedulePagination((prev) => ({
      ...prev,
      customerId: value === "All Customers" ? "" : value,
      page: 1,
    }));
  };

  const handleScheduleSalesRepFilterChange = (value: string) => {
    setSchedulePagination((prev) => ({
      ...prev,
      salesRepresentativeUserId: value === "All Sales Reps" ? "" : value,
      page: 1,
    }));
  };

  // Status filter handler
  const handleStatusFilterChange = (value: string) => {
    setSchedulePagination((prev) => ({
      ...prev,
      status: value === "All Status" ? "" : value.toLowerCase(),
      page: 1, // Reset to first page when filtering
    }));
  };

  const handlePriorityFilterChange = (value: string) => {
    setSchedulePagination((prev) => ({
      ...prev,
      priority: value === "All Priorities" ? "" : value,
      page: 1,
    }));
  };

  // Debounced search for customers
  const debouncedCustomerSearch = useCallback(
    debounce((value: string) => {
      setCustomerPagination((prev) => ({
        ...prev,
        searchFor: value,
        page: 1, // Reset to first page when searching
      }));
    }, 800),
    []
  );

  const handleCustomerTypeFilterChange = (value: string) => {
    setCustomerPagination((prev) => ({
      ...prev,
      customerTypeId: value === "All Customer Types" ? "" : value,
      page: 1, // Reset to first page when filtering
    }));
  };

  const handleCustomerSearchChange = useCallback(
    (value: string) => {
      debouncedCustomerSearch(value);
    },
    [debouncedCustomerSearch]
  );

  // Industry filter handler
  const handleIndustryFilterChange = (value: string) => {
    const selectedIndustry = industryList.find(
      (industry) => industry.industryName === value
    );
    setCustomerPagination((prev) => ({
      ...prev,
      industryId:
        value === "All Industries" ? "" : selectedIndustry?.industryId || "",
      page: 1, // Reset to first page when filtering
    }));
  };

  // Map schedule data to proper format (API handles filtering)
  const mappedScheduleData = scheduleData.map((visit: any) => ({
    ...visit,
    salesRepName: visit.salesRepresentativeUser
      ? `${visit.salesRepresentativeUser.firstName || ""} ${visit.salesRepresentativeUser.lastName || ""}`.trim() ||
        "Unassigned"
      : visit.salesRepresentativeName || "Unassigned",
    customerName: visit.customer?.companyName || visit.customerName || "N/A",
    formattedDateTime:
      visit.date && visit.time
        ? `${new Date(visit.date).toLocaleDateString()} ${visit.time}`
        : "N/A",
    displayStatus: visit.status
      ? visit.status.charAt(0).toUpperCase() + visit.status.slice(1)
      : "Scheduled",
    displayPriority: visit.priority || "Medium",
    location: visit.streetAddress || visit.location || "N/A",
  }));

  // Get industry data for filter
  const { data: industryList = [] } = useGetIndustry();

  // Get current industry filter display value
  const getCurrentIndustryFilterValue = () => {
    if (!customerPagination.industryId) return "All Industries";
    const selectedIndustry = industryList.find(
      (industry) => industry.industryId === customerPagination.industryId
    );
    return selectedIndustry?.industryName || "All Industries";
  };

  const debouncedAuditSearch = useCallback(
    debounce((value: string) => {
      setAuditPagination((prev) => ({
        ...prev,
        entity: value,
        page: 1,
      }));
    }, 300),
    []
  );

  const handleAuditSearchChange = useCallback(
    (value: string) => {
      debouncedAuditSearch(value);
    },
    [debouncedAuditSearch]
  );

  // user filter handler
  const handleUserFilterChange = (value: string) => {
    setAuditPagination((prev) => ({
      ...prev,
      page: 1,
      userId: value === "ALL USERS" ? "" : value,
    }));
  };

  const handleActionFilterChange = (value: string) => {
    setAuditPagination((prev) => ({
      ...prev,
      page: 1,
      action: value === "ALL ACTION" ? undefined : value,
    }));
  };

  useEffect(() => {
    if (selectedDateRange?.from && selectedDateRange?.to) {
      setAuditPagination((prev) => ({
        ...prev,
        page: 1,
        startDate: startOfDay(selectedDateRange.from!).toISOString(),
        endDate: endOfDay(selectedDateRange.to!).toISOString(),
      }));
    } else {
      // clear filter if no dates selected
      setAuditPagination((prev) => {
        const { startDate, endDate, ...rest } = prev;
        return { ...rest, page: 1 };
      });
    }
  }, [selectedDateRange]);

  const handleNavigation = (path: string) => {
    navigate({ to: path });
  };

  const usersOptions = useMemo(
    () =>
      (liveTrackingUsers || []).map((user: any) => ({
        label: formatName(getFullName(user.firstName, user.lastName)),
        value: String(user.id),
      })),
    [liveTrackingUsers]
  );

  const customersOptions = useMemo(
    () =>
      (customers || []).map((c: any) => ({
        label: c.companyName,
        value: c.customerId,
      })),
    [customers]
  );

  const statusOptions = useMemo(
    () => [
      { label: "Scheduled", value: "Scheduled" },
      { label: "Completed", value: "Completed" },
      { label: "Pending", value: "Pending" },
    ],
    []
  );

  const priorityOptions = useMemo(
    () => Object.values(PRIORITY).map((p) => ({ label: p, value: p })),
    []
  );

  const customerTypeOptions = useMemo(
    () =>
      (customerTypeList || []).map((t: any) => ({
        label: formatDropDownLabel(t.typeName),
        value: t.customerTypeId,
      })),
    [customerTypeList]
  );

  const industryOptions = useMemo(
    () =>
      (industryList || []).map((i: any) => ({
        label: i.industryName,
        value: i.industryId,
      })),
    [industryList]
  );

  const auditActionOptions = useMemo(
    () =>
      ["CREATE", "UPDATE", "DELETE", "USER LOGIN", "ADMIN LOGIN"].map((a) => ({
        label: a,
        value: a,
      })),
    []
  );

  const scheduleSelectFilters: FilterConfig[] = [
    {
      key: "search",
      type: "search",
      placeholder: "Search By Purpose...",
      value: schedulePagination.searchFor,
      onChange: (value: any) => handleScheduleSearchChange(value),
    },
    {
      key: "salesRepresentativeUserId",
      type: "searchable-select",
      onChange: (value: any) =>
        handleScheduleSalesRepFilterChange(String(value)),
      placeholder: "Select Sales Rep",
      value: schedulePagination.salesRepresentativeUserId,
      options: usersOptions,
      onCancelPress: () => handleScheduleSalesRepFilterChange("All Sales Reps"),
      searchableSelectClassName: "w-full sm:w-[180px]",
    },
    {
      key: "customerId",
      type: "searchable-select",
      onChange: (value: any) =>
        handleScheduleCustomerFilterChange(String(value)),
      placeholder: "Select Customer",
      value: schedulePagination.customerId,
      options: customersOptions,
      onCancelPress: () => handleScheduleCustomerFilterChange("All Customers"),
      searchableSelectClassName: "w-full sm:w-[180px]",
    },
    {
      key: "status",
      type: "searchable-select",
      onChange: (value: any) => handleStatusFilterChange(String(value)),
      placeholder: "Select Status",
      value: schedulePagination.status
        ? schedulePagination.status.charAt(0).toUpperCase() +
          schedulePagination.status.slice(1)
        : "All Status",
      options: statusOptions,
      onCancelPress: () => handleStatusFilterChange("All Status"),
      searchableSelectClassName: "w-[140px]",
    },
    {
      key: "priority",
      type: "searchable-select",
      onChange: (value: any) => handlePriorityFilterChange(String(value)),
      placeholder: "Select Priority",
      value: schedulePagination.priority,
      options: priorityOptions,
      onCancelPress: () => handlePriorityFilterChange("All Priorities"),
      searchableSelectClassName: "w-full sm:w-[140px]",
    },
  ];

  const customerSelectFilters: FilterConfig[] = [
    {
      key: "search",
      type: "search",
      placeholder: "Search By Customer...",
      value: customerPagination.searchFor,
      onChange: (value: any) => handleCustomerSearchChange(value),
    },
    {
      key: "customerTypeId",
      type: "searchable-select",
      onChange: (value: any) => handleCustomerTypeFilterChange(String(value)),
      placeholder: "Select Customer Type",
      value: customerPagination.customerTypeId,
      options: customerTypeOptions,
      onCancelPress: () => handleCustomerTypeFilterChange("All Customer Types"),
      searchableSelectClassName: "w-[180px]",
    },
    {
      key: "industryId",
      type: "searchable-select",
      onChange: (value: any) => handleIndustryFilterChange(String(value)),
      placeholder: "Select Industry",
      value: getCurrentIndustryFilterValue(),
      options: industryOptions,
      onCancelPress: () => handleIndustryFilterChange("All Industries"),
      searchableSelectClassName: "w-[140px]",
    },
  ];

  const auditSelectFilters: FilterConfig[] = [
    {
      key: "date-range",
      type: "date-range",
      placeholder: "Filter by date",
      dateRangeValue: selectedDateRange,
      onDateRangeChange: setSelectedDateRange,
      dataRangeClassName: "w-full max-w-xs",
    },
    {
      key: "search",
      type: "search",
      placeholder: "Search By Entity...",
      value: auditPagination.entity,
      onChange: (value: any) => handleAuditSearchChange(value),
    },
    {
      key: "userId",
      type: "searchable-select",
      onChange: (value: any) => handleUserFilterChange(String(value)),
      placeholder: "Select User",
      value: auditPagination.userId,
      options: usersOptions,
      onCancelPress: () => handleUserFilterChange("ALL USERS"),
      searchableSelectClassName: "w-[180px]",
    },
    {
      key: "action",
      type: "searchable-select",
      onChange: (value: any) => handleActionFilterChange(String(value)),
      placeholder: "Select Action",
      value: auditPagination.action ?? "ALL ACTION",
      options: auditActionOptions,
      onCancelPress: () => handleActionFilterChange("ALL ACTION"),
      searchableSelectClassName: "w-[140px]",
    },
  ];

  return (
    <div className="space-y-4">
      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
        <Card className="gap-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium">
              Total Sales Reps
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold mb-1">
              {isStatsLoading ? "..." : stats?.totalUsers}
            </div>
            <p className="text-xs text-muted-foreground">
              From today's schedule
            </p>
          </CardContent>
        </Card>
        <Card className="gap-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium">
              Active in Field
            </CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold mb-1">
              {isStatsLoading ? "..." : stats?.onlineUsers}
            </div>
            <p className="text-xs text-muted-foreground">Currently online</p>
          </CardContent>
        </Card>
      </div>

      {/* Today's Schedule */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Today's Schedule</CardTitle>
            </div>
            <Button onClick={() => handleNavigation("/calendar")}>
              View All
            </Button>
          </div>

          <div className="flex items-center space-x-2 mt-1">
            <div className="w-full">
              <GlobalFilterSection
                key={"overview-schedule-filters"}
                filters={scheduleSelectFilters}
                className={"mb-0"}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <CustomDataTable
            data={(mappedScheduleData ?? []).slice(0, limit)}
            columns={scheduleColumns}
            totalCount={scheduleTotalCount}
            loading={scheduleLoading}
            key="schedule-table"
          />
        </CardContent>
      </Card>

      {/* Customer List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Customer List</CardTitle>
            </div>
            <Button onClick={() => handleNavigation("/customers")}>
              View All
            </Button>
          </div>
          <div className="flex items-center space-x-2 mt-1">
            <div className="w-full">
              <GlobalFilterSection
                key={"overview-customer-filters"}
                filters={customerSelectFilters}
                className={"mb-0"}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <CustomDataTable
            data={(customers ?? []).slice(0, limit)}
            columns={customerColumns}
            totalCount={customerTotalCount}
            loading={customersLoading}
            key="customer-table"
          />
        </CardContent>
      </Card>

      {/* Audit Log  */}
      <Card>
        <CardHeader>
          <div>
            <CardTitle>Audit Logs</CardTitle>
          </div>
          <div className="relative flex mt-4">
            <div className="w-full">
              <GlobalFilterSection
                key={"overview-audit-filters"}
                filters={auditSelectFilters}
                className={"mb-0"}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <CustomDataTable
            data={auditLogsList}
            columns={auditLogColumns as any}
            totalCount={auditLogsResponse.totalCount}
            currentPage={auditPagination.page}
            defaultPageSize={auditPagination.limit}
            paginationCallbacks={{
              onPaginationChange: (page: number, pageSize: number) => {
                setAuditPagination((prev) => ({
                  ...prev,
                  page,
                  limit: pageSize,
                }));
              },
            }}
            loading={auditLogsLoading}
            key="auditLog"
          />
        </CardContent>
      </Card>
    </div>
  );
}
