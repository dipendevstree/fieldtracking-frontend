import API from "@/config/api/api";
import useFetchData from "@/hooks/use-fetch-data";

export const useGetAllReportsAndAnalyticsQuickStats = (
  params?: any,
  options?: { enabled?: boolean }
) => {
  const query = useFetchData<any>({
    url: API.ExpenseAnalytics.list,
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
