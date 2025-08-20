import useFetchData from "@/hooks/use-fetch-data";
import { IListParams } from "./calendar-view.hook";
import API from "@/config/api/api";
import usePostData from "@/hooks/use-post-data";
import usePatchData from "@/hooks/use-patch-data";

export const useGetAllDailyExpanses = (
  params: IListParams,
  options?: { enabled?: boolean }
) => {
  const query = useFetchData<any>({
    url: API.dailyExpenses.list,
    params,
    enabled: options?.enabled ?? true,
  });
  return {
    ...query,
    data: query.data?.list,
    allVisit: query.data?.list ?? [],
    totalCount: query.data?.totalCount ?? 0,
    isLoading: query.isLoading,
    error: query.error,
  };
};

export const useDailyExpansesById = (DailyExpanseId: string) => {
  const query = useFetchData<any>({
    url: `${API.dailyExpenses.getById}/${DailyExpanseId}`,
    enabled: !!DailyExpanseId,
  });
  return {
    ...query,
    dailyExpanse: query.data ?? {},
    totalCount: query.data?.totalCount ?? 0,
    isLoading: query.isLoading,
    error: query.error,
  };
};

export const useExpenseReviewAndApproval = (onSuccess?: () => void) => {
  return usePostData({
    url: API.dailyExpenses.expenseReviewAndApproval,
    refetchQueries: [API.dailyExpenses.list],
    onSuccess: () => {
      if (onSuccess) {
        onSuccess();
      }
    },
  });
};

export const useExpenseReviewAndApprovalUpdate = (id: string, onSuccess?: () => void) => {
  return usePatchData({
    url: `${API.dailyExpenses.expenseReviewAndApprovalUpdate}/${id}`,
    refetchQueries: [API.dailyExpenses.list],
    onSuccess: () => {
      if (onSuccess) {
        onSuccess();
      }
    },
  });
};
