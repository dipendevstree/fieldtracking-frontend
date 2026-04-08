import API from "@/config/api/api";
import useFetchData from "@/hooks/use-fetch-data";
import usePutData from "@/hooks/use-put-data";

const ATTENDANCE_RULES_CONFIG_QUERY = API.attendanceRules.rules;

import { useQueryClient } from "@tanstack/react-query";

export const useUpdateAttendanceRulesConfig = (onSuccess?: () => void) => {
  const queryClient = useQueryClient();

  return usePutData({
    url: `${API.attendanceRules.update}`,
    onSuccess: (data: any) => {
      // Optimistically update the cache with the response data
      queryClient.setQueriesData(
        { queryKey: [ATTENDANCE_RULES_CONFIG_QUERY] },
        data
      );

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
