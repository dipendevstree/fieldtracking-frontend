import API from "@/config/api/api";
import useDeleteData from "@/hooks/use-delete-data";
import useFetchData from "@/hooks/use-fetch-data";
import usePatchData from "@/hooks/use-patch-data";
import usePostData from "@/hooks/use-post-data";
import { IListParams } from "../types";

const SHIFT_QUERY = API.shifts.list;

export const useCreateShift = (onSuccess?: () => void) => {
  return usePostData({
    url: API.shifts.create,
    refetchQueries: [SHIFT_QUERY],
    onSuccess: () => {
      if (onSuccess) {
        onSuccess();
      }
    },
  });
};

export const useUpdateShift = (id: string, onSuccess?: () => void) => {
  return usePatchData({
    url: `${API.shifts.update}/${id}`,
    refetchQueries: [SHIFT_QUERY],
    onSuccess: () => {
      if (onSuccess) {
        onSuccess();
      }
    },
  });
};

export const useDeleteShift = (id: string, onSuccess?: () => void) => {
  return useDeleteData({
    url: `${API.shifts.delete}/${id}`,
    refetchQueries: [SHIFT_QUERY],
    onSuccess: () => {
      if (onSuccess) {
        onSuccess();
      }
    },
  });
};

export const useGetAllShifts = (
  params?: IListParams,
  options?: { enabled?: boolean }
) => {
  const query = useFetchData<any>({
    url: SHIFT_QUERY,
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

export const useUpdateDefaultShifts = (onSuccess?: () => void) => {
  return usePatchData({
    url: API.shifts.update,
    refetchQueries: [SHIFT_QUERY],
    onSuccess: () => {
      if (onSuccess) {
        onSuccess();
      }
    },
  });
};
