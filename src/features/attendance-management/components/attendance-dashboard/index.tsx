import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AttendanceEvent,
  TeamAttendanceCalendar,
} from "./components/dashboard-calendar";
import DashboardUserTable from "./components/dashboard-user-table";
import { Main } from "@/components/layout/main";
import { TopStatsCard } from "@/components/ui/TopStatsCard";
import {
  Users,
  UserCheck,
  UserX,
  Clock,
  LogOut,
  CalendarOff,
} from "lucide-react";
import {
  useGetDashboardUsers,
  useGetDashboardCalendarData,
  useGetDashboardStats,
  useGetDashboardUsersWeeklyMonthly,
} from "../../services/attendance-action.hook";
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
} from "date-fns";
import {
  ATTENDANCE_STATUS,
  DEFAULT_PAGE_NUMBER,
  DEFAULT_PAGE_SIZE,
} from "@/data/app.data";
import { FilterConfig } from "@/components/global-filter-section";
import GlobalFilterSection from "@/components/global-table-filter-section";
import { DateRange } from "react-day-picker";
import { useViewType } from "@/context/view-type-context";
import { ViewType as ViewTypeContextType } from "@/components/layout/types";
import { useNavigate } from "@tanstack/react-router";

type ViewType = "daily" | "range";

export default function AttendanceDashboard() {
  const navigate = useNavigate();
  // view type context
  const { viewType } = useViewType();
  useEffect(() => {
    if (viewType === ViewTypeContextType.Self) {
      navigate({ to: "/attendance-management/my-attendance" });
      return;
    }
  }, [viewType]);

  const [currentDate, setCurrentDate] = useState(new Date()); // Today
  const [selectedView, setSelectedView] = useState<ViewType>("daily");
  const [pagination, setPagination] = useState({
    page: DEFAULT_PAGE_NUMBER,
    limit: DEFAULT_PAGE_SIZE,
  });
  const [filters, setFilters] = useState({
    date: format(new Date(), "yyyy-MM-dd"),
  });
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: startOfWeek(new Date(), { weekStartsOn: 1 }), // Monday
    to: endOfWeek(new Date(), { weekStartsOn: 1 }), // Sunday
  });

  // Calculate date ranges based on selected view
  const getApiDateRange = () => {
    if (selectedView === "range" && dateRange?.from && dateRange?.to) {
      return {
        startDate: format(dateRange.from, "yyyy-MM-dd"),
        endDate: format(dateRange.to, "yyyy-MM-dd"),
      };
    } else {
      return {
        startDate: filters.date,
        endDate: filters.date,
      };
    }
  };

  const apiDateRange = getApiDateRange();

  const { stats } = useGetDashboardStats({
    startDate: filters.date,
    endDate: filters.date,
  });

  const {
    data: dashboardUsers,
    totalCount,
    isLoading,
  } = useGetDashboardUsers({
    page: pagination.page,
    limit: pagination.limit,
    date: filters.date,
  });

  const {
    data: dashboardUsersWeeklyMonthly,
    totalCount: totalCountWeeklyMonthly,
    isLoading: isLoadingWeeklyMonthly,
  } = useGetDashboardUsersWeeklyMonthly(
    {
      page: pagination.page,
      limit: pagination.limit,
      startDate: apiDateRange.startDate,
      endDate: apiDateRange.endDate,
    },
    { enabled: selectedView === "range" }
  );

  // Get start and end dates of the current calendar month
  const calendarMonthStart = format(startOfMonth(currentDate), "yyyy-MM-dd");
  const calendarMonthEnd = format(endOfMonth(currentDate), "yyyy-MM-dd");

  const {
    data: calendarData,
    holidays,
    weekOffDays,
    leaves,
  } = useGetDashboardCalendarData({
    startDate: calendarMonthStart,
    endDate: calendarMonthEnd,
  });

  const handleDateChange = (date: Date | string | undefined) => {
    let dateObject: Date;
    let dateString: string;

    if (typeof date === "string") {
      dateString = date;
      dateObject = new Date(dateString);
    } else if (date instanceof Date) {
      dateObject = date;
      dateString = format(date, "yyyy-MM-dd");
    } else {
      dateObject = new Date();
      dateString = format(new Date(), "yyyy-MM-dd");
    }

    // Prevent selecting any future dates
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const selectedDate = new Date(dateObject);
    selectedDate.setHours(0, 0, 0, 0);

    // If the chosen date is in the future, clamp to today
    if (selectedDate > today) {
      dateObject = today;
      dateString = format(today, "yyyy-MM-dd");
    }

    // Update both calendar and filter states
    setCurrentDate(dateObject);
    setFilters((prev) => ({
      ...prev,
      date: dateString,
    }));
    setPagination((prev) => ({ ...prev, page: DEFAULT_PAGE_NUMBER })); // Reset to first page
  };

  const handleViewChange = (view: ViewType) => {
    setSelectedView(view);
    setPagination((prev) => ({ ...prev, page: DEFAULT_PAGE_NUMBER })); // Reset to first page

    // Initialize date range for range view with current week
    if (view === "range") {
      setDateRange({
        from: startOfWeek(new Date(), { weekStartsOn: 1 }), // Monday
        to: endOfWeek(new Date(), { weekStartsOn: 1 }), // Sunday
      });
    }
  };

  const handleDateRangeChange = (newDateRange: DateRange | undefined) => {
    setDateRange(newDateRange);
    setPagination((prev) => ({ ...prev, page: DEFAULT_PAGE_NUMBER })); // Reset to first page
  };

  const onPaginationChange = (page: number, pageSize: number) => {
    setPagination({ page, limit: pageSize });
  };

  const filtersConfig: FilterConfig[] = [
    selectedView === "daily"
      ? {
          key: "date",
          type: "date" as const,
          placeholder: "Select Date",
          value: filters.date,
          onChange: handleDateChange,
          disableFutureDates: true,
        }
      : {
          key: "dateRange",
          type: "date-range" as const,
          placeholder: "Select Date Range",
          dateRangeValue: dateRange,
          onDateRangeChange: handleDateRangeChange,
          disableFutureDates: true,
        },
  ];

  useEffect(() => {
    setSelectedView("daily");
  }, [filters]);

  // Helper function to generate initials from full name
  const generateInitials = (fullName: string) => {
    const names = fullName.trim().split(" ");
    if (names.length >= 2) {
      return (
        names[0].charAt(0) + names[names.length - 1].charAt(0)
      ).toUpperCase();
    }
    return names[0].charAt(0).toUpperCase();
  };

  const EXCEPTION_STATUSES = ["absent", "late", "half_day", "leave"] as const;

  const getStatusFromRecord = (status?: string): ATTENDANCE_STATUS => {
    switch (status?.toLowerCase()) {
      case "absent":
        return ATTENDANCE_STATUS.ABSENT;
      case "half_day":
        return ATTENDANCE_STATUS.HALF_DAY;
      case "late":
        return ATTENDANCE_STATUS.LATE;
      case "leave":
        return ATTENDANCE_STATUS.LEAVE;
      default:
        return ATTENDANCE_STATUS.PRESENT;
    }
  };

  // Create attendance events
  const attendanceEvents: AttendanceEvent[] =
    calendarData
      ?.filter((r: any) =>
        EXCEPTION_STATUSES.includes(r.status?.toLowerCase() as any)
      )
      .map((record: any) => ({
        id: record.attendanceId,
        title: generateInitials(record.username),
        start: new Date(record.date),
        end: new Date(record.date),
        resource: {
          status: getStatusFromRecord(record.status),
          name: record.username,
        },
      })) || [];

  // Create leave events
  const leaveEvents: AttendanceEvent[] =
    leaves?.map((leave: any) => ({
      id: leave.leaveId,
      title: generateInitials(leave.username),
      start: new Date(leave.date),
      end: new Date(leave.date),
      resource: {
        status: ATTENDANCE_STATUS.LEAVE,
        name: leave.username,
        leaveType: leave.leaveType,
        halfDay: leave.halfDay,
      },
    })) || [];

  const events: AttendanceEvent[] = [...attendanceEvents, ...leaveEvents];

  return (
    <Main>
      <div className="grid gap-4 md:grid-cols-4 mb-6">
        {/* 1. Total Employees*/}
        <TopStatsCard
          title="Total Users"
          value={stats?.totalUsers || 0}
          description="Registered users"
          icon={Users}
          themeColor="purple"
        />

        {/* 2. Present Today */}
        <TopStatsCard
          title="Present Today"
          value={stats?.present || 0}
          description="Checked in successfully"
          icon={UserCheck}
          themeColor="green"
        />

        {/* 3. Absent*/}
        <TopStatsCard
          title="Absent"
          value={stats?.absent || 0}
          description="Not checked in"
          icon={UserX}
          themeColor="red"
        />

        {/* 4. Not Started */}
        <TopStatsCard
          title="Not Started"
          value={stats?.notStarted || 0}
          description="Not checked in"
          icon={UserX}
          themeColor="purple"
        />

        {/* 5. Half Day */}
        <TopStatsCard
          title="Half Day"
          value={stats?.halfDay || 0}
          description="Checked in successfully"
          icon={UserCheck}
          themeColor="blue"
        />

        {/* 6. Late Arrivals */}
        <TopStatsCard
          title="Late Arrivals"
          value={stats?.late || 0}
          description="Checked in after start time"
          icon={Clock}
          themeColor="yellow"
        />

        {/* 7. Early Exits  */}
        <TopStatsCard
          title="Early Exits"
          value={stats?.earlyExit || 0}
          description="Left before shift end"
          icon={LogOut}
          themeColor="orange"
        />

        {/* 8. On Leave  */}
        <TopStatsCard
          title="On Leave"
          value={stats?.onLeave || 0}
          description="Approved leave today"
          icon={CalendarOff}
          themeColor="orange"
        />
      </div>

      {/*calendar */}
      <Card className="shadow-sm border-slate-200 bg-white mb-6">
        <CardContent>
          <TeamAttendanceCalendar
            events={events}
            date={currentDate}
            onNavigate={handleDateChange}
            holidays={holidays}
            weekOffDays={weekOffDays}
          />
        </CardContent>
      </Card>

      {/* View Selector */}
      <Card className="shadow-sm border-slate-200 bg-white mb-6">
        <CardContent>
          <Tabs
            value={selectedView}
            onValueChange={(value) => handleViewChange(value as ViewType)}
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="daily">Daily View</TabsTrigger>
              <TabsTrigger value="range">Range View</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardContent>
      </Card>

      {/* Dashboard Users Table */}
      <Card className="shadow-sm border-slate-200 bg-white">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">
            User Attendance Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <GlobalFilterSection
            key="dashboard-users-filters"
            filters={filtersConfig}
          />

          <DashboardUserTable
            data={
              selectedView === "daily"
                ? dashboardUsers || []
                : dashboardUsersWeeklyMonthly || []
            }
            totalCount={
              selectedView === "daily" ? totalCount : totalCountWeeklyMonthly
            }
            loading={
              selectedView === "daily" ? isLoading : isLoadingWeeklyMonthly
            }
            currentPage={pagination.page}
            paginationCallbacks={{ onPaginationChange }}
            defaultPageSize={pagination.limit}
            viewType={selectedView === "range" ? "range" : "daily"}
          />
        </CardContent>
      </Card>
    </Main>
  );
}
