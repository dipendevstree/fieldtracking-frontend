import API from "@/config/api/api";
import { LEAVE_STATUS } from "@/data/app.data";
import useDeleteData from "@/hooks/use-delete-data";
import useFetchData from "@/hooks/use-fetch-data";
import usePatchData from "@/hooks/use-patch-data";
import usePostData from "@/hooks/use-post-data";
import usePutData from "@/hooks/use-put-data";

const LEAVE_QUERY = API.leave.list;
const MY_LEAVE_QUERY = API.leave.myLeave;
const LEAVE_STATS_QUERY = API.leave.stats;

export const useCreateLeave = (onSuccess?: () => void) => {
  return usePostData({
    url: API.leave.create,
    refetchQueries: [
      LEAVE_QUERY,
      MY_LEAVE_QUERY,
      LEAVE_STATS_QUERY,
      API.leaveRequest.pendingList,
    ],
    onSuccess: () => {
      if (onSuccess) {
        onSuccess();
      }
    },
  });
};

export const useUpdateLeave = (id: string, onSuccess?: () => void) => {
  return usePatchData({
    url: `${API.leave.update}/${id}`,
    refetchQueries: [
      LEAVE_QUERY,
      MY_LEAVE_QUERY,
      LEAVE_STATS_QUERY,
      API.leaveRequest.pendingList,
    ],
    onSuccess: () => {
      if (onSuccess) {
        onSuccess();
      }
    },
  });
};

export const useDeleteLeave = (id: string, onSuccess?: () => void) => {
  return useDeleteData({
    url: `${API.leave.delete}/${id}`,
    refetchQueries: [
      LEAVE_QUERY,
      MY_LEAVE_QUERY,
      LEAVE_STATS_QUERY,
      API.leaveRequest.pendingList,
    ],
    onSuccess: () => {
      if (onSuccess) {
        onSuccess();
      }
    },
  });
};

export const useCancelLeave = (id: string, onSuccess?: () => void) => {
  const mutation = usePatchData({
    url: `${API.leave.update}/${id}`,
    refetchQueries: [
      LEAVE_QUERY,
      MY_LEAVE_QUERY,
      LEAVE_STATS_QUERY,
      API.leaveRequest.pendingList,
    ],
    onSuccess: () => {
      if (onSuccess) {
        onSuccess();
      }
    },
  });

  return {
    ...mutation,
    mutate: () => mutation.mutate({ status: LEAVE_STATUS.CANCEL }),
  };
};

export const useGetLeaveById = (id?: any, options?: { enabled?: boolean }) => {
  const query = useFetchData<any>({
    url: `${API.leave.byId}/${id}`,
    enabled: !!id && (options?.enabled ?? true),
  });

  return {
    ...query,
    data: query.data,
    isLoading: query.isLoading,
    error: query.error,
  };
};

export const useGetAllLeaves = (
  params?: any,
  options?: { enabled?: boolean },
) => {
  const query = useFetchData<any>({
    url: LEAVE_QUERY,
    params,
    enabled: options?.enabled ?? true,
  });

  return {
    ...query,
    data: query.data?.list,
    totalCount: query.data?.totalCount ?? 0,
    weekOffDays: query.data?.weekOffDays ?? [],
    isLoading: query.isLoading,
    error: query.error,
  };
};

export const useGetMyLeaves = (
  params?: any,
  options?: { enabled?: boolean },
) => {
  const query = useFetchData<any>({
    url: MY_LEAVE_QUERY,
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

export const useGetLeaveStats = (options?: { enabled?: boolean }) => {
  const query = useFetchData<any>({
    url: LEAVE_STATS_QUERY,
    enabled: options?.enabled ?? true,
  });

  return {
    ...query,
    data: query.data,
    isLoading: query.isLoading,
    error: query.error,
  };
};

export const useCancelLeaveEncashment = (
  id: string,
  onSuccess?: () => void,
) => {
  const mutation = usePatchData({
    url: `${API.leaveEncashment.update}/${id}`,
    refetchQueries: [API.leaveEncashmentApprovals.pendingList],
    onSuccess: () => {
      if (onSuccess) {
        onSuccess();
      }
    },
  });

  return {
    ...mutation,
    mutate: () => mutation.mutate({ status: LEAVE_STATUS.CANCEL }),
  };
};

export const useGetLeaveApplyStats = (
  params?: any,
  options?: { enabled?: boolean },
) => {
  const query = useFetchData<any>({
    url: API.leave.applyStats,
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

export const useProcessLeaveBalance = (onSuccess?: () => void) => {
  return usePutData({
    url: API.task.processLeaveBalance,
    onSuccess: () => {
      if (onSuccess) {
        onSuccess();
      }
    },
  });
};

export const useExpireCarryForwardLeaveBalance = (onSuccess?: () => void) => {
  return usePutData({
    url: API.task.expireCarryForwardLeaveBalance,
    onSuccess: () => {
      if (onSuccess) {
        onSuccess();
      }
    },
  });
};
