import API from "@/config/api/api";
import useFetchData from "@/hooks/use-fetch-data";
import usePutData from "@/hooks/use-put-data";

const LEAVE_TYPE_QUERY = API.leaveRulesConfig.list;

export interface IListParams1 {
  [key: string]: unknown;
}
export interface IListParams {
  sort?: string;
  limit: number;
  page: number;
  [key: string]: unknown;
}

export const useUpdateLeaveRulesConfig = (onSuccess?: () => void) => {
  return usePutData({
    url: `${API.leaveRulesConfig.update}`,
    refetchQueries: [LEAVE_TYPE_QUERY],
    onSuccess: () => {
      if (onSuccess) {
        onSuccess();
      }
    },
  });
};

export const useGetLeaveRulesConfig = (
  params?: IListParams,
  options?: { enabled?: boolean }
) => {
  const query = useFetchData<any>({
    url: LEAVE_TYPE_QUERY,
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
