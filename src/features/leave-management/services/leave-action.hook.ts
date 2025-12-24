import API from "@/config/api/api";
import useDeleteData from "@/hooks/use-delete-data";
import useFetchData from "@/hooks/use-fetch-data";
import usePatchData from "@/hooks/use-patch-data";
import usePostData from "@/hooks/use-post-data";

const LEAVE_QUERY = API.leave.list;
const MY_LEAVE_QUERY = API.leave.myLeave;
const LEAVE_STATS_QUERY = API.leave.stats;

export const useCreateLeave = (onSuccess?: () => void) => {
  return usePostData({
    url: API.leave.create,
    refetchQueries: [LEAVE_QUERY],
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
    refetchQueries: [LEAVE_QUERY],
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
    refetchQueries: [LEAVE_QUERY],
    onSuccess: () => {
      if (onSuccess) {
        onSuccess();
      }
    },
  });
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
  options?: { enabled?: boolean }
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
    isLoading: query.isLoading,
    error: query.error,
  };
};

export const useGetMyLeaves = (options?: { enabled?: boolean }) => {
  const query = useFetchData<any>({
    url: MY_LEAVE_QUERY,
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
