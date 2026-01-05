import API from "@/config/api/api";
import useFetchData from "@/hooks/use-fetch-data";
import usePutData from "@/hooks/use-put-data";

const ATTENDANCE_RULES_CONFIG_QUERY = API.attendanceRules.rules;

export const useUpdateAttendanceRulesConfig = (onSuccess?: () => void) => {
  return usePutData({
    url: `${API.attendanceRules.update}`,
    refetchQueries: [ATTENDANCE_RULES_CONFIG_QUERY],
    onSuccess: () => {
      if (onSuccess) {
        onSuccess();
      }
    },
  });
};

export const useGetAttendanceRulesConfig = (
  params?: any,
  options?: { enabled?: boolean }
) => {
  const query = useFetchData<any>({
    url: ATTENDANCE_RULES_CONFIG_QUERY,
    params,
    enabled: options?.enabled ?? true,
  });

  return {
    ...query,
    data: query.data,
    totalCount: query.data?.totalCount ?? 0,
    isLoading: query.isLoading,
    error: query.error,
  };
};
