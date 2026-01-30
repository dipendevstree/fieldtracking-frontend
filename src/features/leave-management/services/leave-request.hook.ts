import API from "@/config/api/api";
import useFetchData from "@/hooks/use-fetch-data";
import usePostData from "@/hooks/use-post-data";

export const useGetAllLeaveRequest = (params: any, options?: any) => {
  const query = useFetchData<any>({
    url: API.leaveRequest.pendingList,
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

export const useGetAllLeaveApprovalHistory = (params: any, options?: any) => {
  const query = useFetchData<any>({
    url: API.leaveRequest.list,
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

export const useGetLeaveRequestStats = (params: any, options?: any) => {
  const query = useFetchData<any>({
    url: API.leaveRequest.stats,
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

export const useCreateLeaveApproval = (onSuccess?: () => void) => {
  return usePostData({
    url: API.leaveRequest.create,
    refetchQueries: [API.leaveRequest.pendingList, API.leaveRequest.list],
    onSuccess: () => {
      if (onSuccess) {
        onSuccess();
      }
    },
  });
};

export const useGetAllLeaveBalanceHistory = (params: any, options?: any) => {
  const query = useFetchData<any>({
    url: API.leaveTransaction.list,
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

export const useCreateLeaveEncashment = (onSuccess?: () => void) => {
  return usePostData({
    url: API.leaveEncashment.create,
    refetchQueries: [],
    onSuccess: () => {
      if (onSuccess) {
        onSuccess();
      }
    },
  });
};
