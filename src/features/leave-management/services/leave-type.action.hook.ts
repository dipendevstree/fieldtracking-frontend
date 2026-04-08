import API from "@/config/api/api";
import useDeleteData from "@/hooks/use-delete-data";
import useFetchData from "@/hooks/use-fetch-data";
import usePatchData from "@/hooks/use-patch-data";
import usePostData from "@/hooks/use-post-data";
import { IListParams } from "../types";

const LEAVE_TYPE_QUERY = API.leaveType.list;
const LEAVE_TYPE_STATS_QUERY = API.leaveType.stats;

export const useCreateLeaveType = (onSuccess?: () => void) => {
  return usePostData({
    url: API.leaveType.create,
    refetchQueries: [LEAVE_TYPE_QUERY, LEAVE_TYPE_STATS_QUERY],
    onSuccess: () => {
      if (onSuccess) {
        onSuccess();
      }
    },
  });
};

export const useUpdateLeaveType = (id: string, onSuccess?: () => void) => {
  return usePatchData({
    url: `${API.leaveType.update}/${id}`,
    refetchQueries: [LEAVE_TYPE_QUERY, LEAVE_TYPE_STATS_QUERY],
    onSuccess: () => {
      if (onSuccess) {
        onSuccess();
      }
    },
  });
};

export const useDeleteLeaveType = (
  id: string,
  onSuccess?: (data: any) => void,
  onError?: (error: any) => void
) => {
  return useDeleteData({
    url: `${API.leaveType.delete}/${id}`,
    refetchQueries: [LEAVE_TYPE_QUERY, LEAVE_TYPE_STATS_QUERY],
    skipToast: false,
    onSuccess: (data) => {
      if (onSuccess) {
        onSuccess(data);
      }
    },
    onError: (error) => {
      if (onError) {
        onError(error);
      }
    },
  });
};

export const useGetAllLeaveTypes = (
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
    data: query.data?.list,
    totalCount: query.data?.totalCount ?? 0,
    isLoading: query.isLoading,
    error: query.error,
  };
};

export const useGetLeaveTypeStats = (options?: { enabled?: boolean }) => {
  const query = useFetchData<any>({
    url: LEAVE_TYPE_STATS_QUERY,
    enabled: options?.enabled ?? true,
  });

  return {
    ...query,
    data: query.data,
    isLoading: query.isLoading,
    error: query.error,
  };
};
