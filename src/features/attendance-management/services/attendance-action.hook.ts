import API from "@/config/api/api";
import useFetchData from "@/hooks/use-fetch-data";

const ATTENDANCE_QUERY = API.attendance.myAttendance;
const ATTENDANCE_QUERY_STATS = API.attendance.stats;

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

export const useGetAttendanceStats = (
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
    data: query.data,
    isLoading: query.isLoading,
    error: query.error,
  };
};
