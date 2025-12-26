import API from "@/config/api/api";
import useDeleteData from "@/hooks/use-delete-data";
import useFetchData from "@/hooks/use-fetch-data";
import usePatchData from "@/hooks/use-patch-data";
import usePostData from "@/hooks/use-post-data";
import { IListParams } from "../types";

const HOLIDAY_TYPE_QUERY = API.holidayType.list;

export const useCreateHolidayType = (onSuccess?: () => void) => {
  return usePostData({
    url: API.holidayType.create,
    refetchQueries: [HOLIDAY_TYPE_QUERY],
    onSuccess: () => {
      if (onSuccess) {
        onSuccess();
      }
    },
  });
};

export const useUpdateHolidayType = (id: string, onSuccess?: () => void) => {
  return usePatchData({
    url: `${API.holidayType.update}/${id}`,
    refetchQueries: [HOLIDAY_TYPE_QUERY],
    onSuccess: () => {
      if (onSuccess) {
        onSuccess();
      }
    },
  });
};

export const useDeleteHolidayType = (id: string, onSuccess?: () => void) => {
  return useDeleteData({
    url: `${API.holidayType.delete}/${id}`,
    refetchQueries: [HOLIDAY_TYPE_QUERY],
    onSuccess: () => {
      if (onSuccess) {
        onSuccess();
      }
    },
  });
};

export const useGetAllHolidayTypes = (
  params?: IListParams,
  options?: { enabled?: boolean }
) => {
  const query = useFetchData<any>({
    url: HOLIDAY_TYPE_QUERY,
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
