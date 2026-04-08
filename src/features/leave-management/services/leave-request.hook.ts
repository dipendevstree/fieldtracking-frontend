import API from "@/config/api/api";
import useFetchData from "@/hooks/use-fetch-data";
import usePatchData from "@/hooks/use-patch-data";
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
    refetchQueries: [API.leaveEncashmentApprovals.pendingList],
    onSuccess: () => {
      if (onSuccess) {
        onSuccess();
      }
    },
  });
};

export const useUpdateLeaveEncashment = (
  id: string,
  onSuccess?: () => void,
) => {
  return usePatchData({
    url: `${API.leaveEncashment.update}/${id}`,
    refetchQueries: [API.leaveEncashmentApprovals.pendingList],
    onSuccess: () => {
      if (onSuccess) {
        onSuccess();
      }
    },
  });
};

export const useGetAllPendingLeaveEncashmentRequest = (
  params: any,
  options?: any,
) => {
  const query = useFetchData<any>({
    url: API.leaveEncashmentApprovals.pendingList,
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

export const useGetAllLeaveEncashmentApprovalHistory = (
  params: any,
  options?: any,
) => {
  const query = useFetchData<any>({
    url: API.leaveEncashmentApprovals.list,
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

export const useGetLeaveEncashmentApprovalStats = (
  params: any,
  options?: any,
) => {
  const query = useFetchData<any>({
    url: API.leaveEncashmentApprovals.stats,
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

export const useCreateLeaveEncashmentApproval = (onSuccess?: () => void) => {
  return usePostData({
    url: API.leaveEncashmentApprovals.create,
    refetchQueries: [
      API.leaveEncashmentApprovals.pendingList,
      API.leaveEncashmentApprovals.list,
    ],
    onSuccess: () => {
      if (onSuccess) {
        onSuccess();
      }
    },
  });
};
