import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
} from "../../services/attendance-action.hook";
import { format, startOfMonth, endOfMonth } from "date-fns";
import {
  ATTENDANCE_STATUS,
  DEFAULT_PAGE_NUMBER,
  DEFAULT_PAGE_SIZE,
} from "@/data/app.data";
import { FilterConfig } from "@/components/global-filter-section";
import GlobalFilterSection from "@/components/global-table-filter-section";

export default function AttendanceDashboard() {
  const [currentDate, setCurrentDate] = useState(new Date()); // Today
  const [pagination, setPagination] = useState({
    page: DEFAULT_PAGE_NUMBER,
    limit: DEFAULT_PAGE_SIZE,
  });
  const [filters, setFilters] = useState({
    date: format(new Date(), "yyyy-MM-dd"),
  });

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

  // Get start and end dates of the current calendar month
  const calendarMonthStart = format(startOfMonth(currentDate), "yyyy-MM-dd");
  const calendarMonthEnd = format(endOfMonth(currentDate), "yyyy-MM-dd");

  const {
    data: calendarData,
    holidays,
    weekOffDays,
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

  const onPaginationChange = (page: number, pageSize: number) => {
    setPagination({ page, limit: pageSize });
  };

  const filtersConfig: FilterConfig[] = [
    {
      key: "date",
      type: "date",
      placeholder: "Select Date",
      value: filters.date,
      onChange: handleDateChange,
      disableFutureDates: true,
    },
  ];

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

  const events: AttendanceEvent[] =
    calendarData?.map((record: any) => {
      // Map status from API to ATTENDANCE_STATUS enum
      const getStatusFromRecord = (status: string) => {
        switch (status?.toLowerCase()) {
          case "present":
            return ATTENDANCE_STATUS.PRESENT;
          case "absent":
            return ATTENDANCE_STATUS.LEAVE;
          case "half_day":
            return ATTENDANCE_STATUS.HALF_DAY;
          case "late":
            return ATTENDANCE_STATUS.LATE;
          default:
            return ATTENDANCE_STATUS.PRESENT;
        }
      };

      return {
        id: record.attendanceId,
        title: generateInitials(record.username),
        start: new Date(record.date),
        end: new Date(record.date),
        resource: {
          status: getStatusFromRecord(record.status),
          name: record.username,
        },
      };
    }) || [];

  return (
    <Main>
      <div className="grid gap-4 md:grid-cols-4 mb-6">
        {/* 1. Total Employees */}
        <TopStatsCard
          title="Total Users"
          value={stats?.totalUsers || 0}
          description="Registered users"
          icon={Users}
        />

        {/* 2. Present */}
        <TopStatsCard
          title="Present Today"
          value={stats?.present || 0}
          description="Checked in successfully"
          icon={UserCheck}
        />

        {/* 3. Absent */}
        <TopStatsCard
          title="Absent"
          value={stats?.absent || 0}
          description="Not checked in"
          icon={UserX}
        />

        {/* 4. Not Started */}
        <TopStatsCard
          title="Not Started"
          value={stats?.notStarted || 0}
          description="Not checked in"
          icon={UserX}
        />

        {/* 5. Half Day */}
        <TopStatsCard
          title="Half Day"
          value={stats?.halfDay || 0}
          description="Checked in successfully"
          icon={UserCheck}
        />

        {/* 6. Late Arrivals */}
        <TopStatsCard
          title="Late Arrivals"
          value={stats?.late || 0}
          description="Checked in after start time"
          icon={Clock}
        />

        {/* 7. Early Exits */}
        <TopStatsCard
          title="Early Exits"
          value={stats?.earlyExit || 0}
          description="Left before shift end"
          icon={LogOut}
        />

        {/* 8. On Leave */}
        <TopStatsCard
          title="On Leave"
          value={stats?.onLeave || 0}
          description="Approved leave today"
          icon={CalendarOff}
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
            className="mb-4"
          />

          <DashboardUserTable
            data={dashboardUsers || []}
            totalCount={totalCount}
            loading={isLoading}
            currentPage={pagination.page}
            paginationCallbacks={{ onPaginationChange }}
            defaultPageSize={pagination.limit}
          />
        </CardContent>
      </Card>
    </Main>
  );
}
