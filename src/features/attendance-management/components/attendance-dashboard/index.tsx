import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TeamAttendanceCalendar } from "./components/dashboard-calendar";
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
  ChevronLeft,
  ChevronRight,
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
  addDays,
  subDays,
  isSameDay,
  isAfter,
  isSameWeek,
  addWeeks,
  subWeeks,
} from "date-fns";
import {
  ATTENDANCE_STATUS,
  DEFAULT_PAGE_NUMBER,
  DEFAULT_PAGE_SIZE,
} from "@/data/app.data";
import {
  FilterConfig,
  DataTableToolbarCompact,
} from "@/components/global-filter-section";
import { DateRange } from "react-day-picker";
import { useViewType } from "@/context/view-type-context";
import { ViewType as ViewTypeContextType } from "@/components/layout/types";
import { useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { AttendanceEvent } from "../../types";

type ViewType = "daily" | "range";

export default function AttendanceDashboard() {
  const navigate = useNavigate();
  // view type context
  const { viewType, viewTypeToggle } = useViewType();
  useEffect(() => {
    if (viewType === ViewTypeContextType.Self && viewTypeToggle) {
      navigate({ to: "/attendance-management/my-attendance" });
      return;
    }
  }, [viewType, viewTypeToggle]);

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
    startDate: apiDateRange.startDate,
    endDate: apiDateRange.endDate,
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
    { enabled: selectedView === "range" },
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
    if (newDateRange?.from) {
      setCurrentDate(newDateRange.from);
    }
    setPagination((prev) => ({ ...prev, page: DEFAULT_PAGE_NUMBER })); // Reset to first page
  };

  const isToday = isSameDay(currentDate, new Date());

  const isCurrentWeek =
    dateRange?.from &&
    isSameWeek(dateRange.from, new Date(), { weekStartsOn: 1 });

  const handlePrevDay = () => {
    const prev = subDays(currentDate, 1);
    handleDateChange(prev);
  };

  const handleNextDay = () => {
    const next = addDays(currentDate, 1);
    if (isAfter(next, new Date())) return;
    handleDateChange(next);
  };

  const handlePrevWeek = () => {
    if (dateRange?.from && dateRange?.to) {
      const newFrom = subWeeks(dateRange.from, 1);
      const newTo = subWeeks(dateRange.to, 1);
      setDateRange({ from: newFrom, to: newTo });
      setCurrentDate(newFrom);
    }
  };

  const handleNextWeek = () => {
    if (dateRange?.from && dateRange?.to) {
      const newFrom = addWeeks(dateRange.from, 1);
      const newTo = addWeeks(dateRange.to, 1);
      if (isAfter(newFrom, startOfWeek(new Date(), { weekStartsOn: 1 })))
        return;
      setDateRange({ from: newFrom, to: newTo });
      setCurrentDate(newFrom);
    }
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
          allowClear: false,
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

  const EXCEPTION_STATUSES = [
    "absent",
    "late",
    "half_day",
    "leave",
    "early_exit",
  ] as const;

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
      case "early_exit":
        return ATTENDANCE_STATUS.EARLY_EXIT;
      default:
        return ATTENDANCE_STATUS.PRESENT;
    }
  };

  // Build leave lookup map (userId + date)
  const leaveDateMap = new Set<string>();

  leaves?.forEach((leave: any) => {
    const key = `${leave.userId}-${format(new Date(leave.date), "yyyy-MM-dd")}`;
    leaveDateMap.add(key);
  });

  // Create attendance events
  const attendanceEvents: AttendanceEvent[] =
    calendarData
      ?.filter((record: any) => {
        const dateKey = `${record.userId}-${format(
          new Date(record.date),
          "yyyy-MM-dd",
        )}`;

        // 🚫 If leave exists → ignore attendance
        if (leaveDateMap.has(dateKey)) return false;

        return EXCEPTION_STATUSES.includes(record.status?.toLowerCase() as any);
      })
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
        halfDayType: leave.halfDayType,
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
        {!isToday && (
          <TopStatsCard
            title="Absent"
            value={stats?.absent || 0}
            description="Not checked in"
            icon={UserX}
            themeColor="red"
          />
        )}

        {/* 4. Not Started */}
        {isToday && (
          <TopStatsCard
            title="Not Started"
            value={stats?.notStarted || 0}
            description="Not checked in"
            icon={UserX}
            themeColor="purple"
          />
        )}

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
          themeColor="amber"
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
              <TabsTrigger value="range">Weekly View</TabsTrigger>
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
          <div className="flex flex-col items-center justify-center">
            <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-lg p-1.5 shadow-sm">
              <Button
                variant="ghost"
                size="icon"
                onClick={
                  selectedView === "daily" ? handlePrevDay : handlePrevWeek
                }
                className="h-9 w-9 text-slate-500 hover:text-slate-900 hover:bg-slate-100"
                title={
                  selectedView === "daily" ? "Previous Day" : "Previous Week"
                }
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>

              <div className="h-6 w-[1px] bg-slate-200 mx-1" />

              <div className="flex-1 min-w-[300px] md:min-w-[420px]">
                <DataTableToolbarCompact
                  filters={filtersConfig}
                  className="justify-center"
                />
              </div>

              <div className="h-6 w-[1px] bg-slate-200 mx-1" />

              <Button
                variant="ghost"
                size="icon"
                onClick={
                  selectedView === "daily" ? handleNextDay : handleNextWeek
                }
                disabled={selectedView === "daily" ? isToday : isCurrentWeek}
                className="h-9 w-9 text-slate-500 hover:text-slate-900 hover:bg-slate-100 disabled:opacity-30"
                title={selectedView === "daily" ? "Next Day" : "Next Week"}
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>
          </div>

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
