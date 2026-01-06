import useFetchData from "@/hooks/use-fetch-data";
import API from "@/config/api/api";
import usePutData from "@/hooks/use-put-data";

export const useGetLeaveApprovals = (params: any, options?: any) => {
  const query = useFetchData<any>({
    url: API.leaveApprovals.list,
    params,
    enabled: options?.enabled ?? true,
    queryKey: API.leaveApprovals.list,
  });

  return {
    ...query,
    data: query.data,
    isLoading: query.isLoading,
    error: query.error,
  };
};

export const useCreateLeaveApprovals = (onSuccess?: () => void) => {
  return usePutData<any>({
    url: API.leaveApprovals.create,
    refetchQueries: [API.leaveApprovals.list],
    onSuccess: () => {
      if (onSuccess) onSuccess();
    },
  });
};
