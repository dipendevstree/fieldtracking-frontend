import API from "@/config/api/api";
import useFetchData from "@/hooks/use-fetch-data";

const ATTENDANCE_QUERY = API.attendance.myAttendance;
const ATTENDANCE_QUERY_STATS = API.attendance.dashboardStats;

export const useGetMyAttendance = (
  params?: any,
  options?: { enabled?: boolean }
) => {
  const query = useFetchData<any>({
    url: ATTENDANCE_QUERY,
    params,
    enabled: options?.enabled ?? true,
  });

  return {
    ...query,
    data: query.data,
    isLoading: query.isLoading,
    error: query.error,
  };
};

export const useGetDashboardStats = (
  params?: any,
  options?: { enabled?: boolean }
) => {
  const query = useFetchData<any>({
    url: ATTENDANCE_QUERY_STATS,
    params,
    enabled: options?.enabled ?? true,
  });

  return {
    ...query,
    stats: query?.data?.stats,
    isLoading: query.isLoading,
    error: query.error,
  };
};

export const useGetDashboardUsers = (
  params?: {
    page?: number;
    limit?: number;
    date?: string;
    departmentId?: string;
    territoryId?: string;
  },
  options?: { enabled?: boolean }
) => {
  const query = useFetchData<any>({
    url: API.attendance.dashboardUser,
    params,
    enabled: options?.enabled ?? true,
  });

  return {
    ...query,
    data: query.data?.list,
    totalCount: query.data?.totalCount ?? 0,
    isLoading: query.isLoading,
    error: query.error,
  };
};

export const useGetDashboardUsersWeeklyMonthly = (
  params?: {
    page?: number;
    limit?: number;
    startDate?: string;
    endDate?: string;
    departmentId?: string;
    territoryId?: string;
  },
  options?: { enabled?: boolean }
) => {
  const query = useFetchData<any>({
    url: API.attendance.dashboardUserWeeklyMonthly,
    params,
    enabled: options?.enabled ?? true,
  });

  return {
    ...query,
    data: query.data?.list,
    totalCount: query.data?.totalCount ?? 0,
    isLoading: query.isLoading,
    error: query.error,
  };
};

export const useGetDashboardCalendarData = (
  params?: any,
  options?: { enabled?: boolean }
) => {
  const query = useFetchData<any>({
    url: API.attendance.dashboardCalendar,
    params,
    enabled: options?.enabled ?? true,
  });

  return {
    ...query,
    data: query.data?.attendanceData,
    holidays: query.data?.holidays || [],
    weekOffDays: query.data?.weekOffDays || [],
    leaves: query.data?.leaves || [],
    isLoading: query.isLoading,
    error: query.error,
  };
};
