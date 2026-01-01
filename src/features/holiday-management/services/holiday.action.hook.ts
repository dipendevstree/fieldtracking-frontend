import API from "@/config/api/api";
import useDeleteData from "@/hooks/use-delete-data";
import useFetchData from "@/hooks/use-fetch-data";
import usePatchData from "@/hooks/use-patch-data";
import usePostData from "@/hooks/use-post-data";

const HOLIDAY_QUERY = API.holiday.list;
const MY_HOLIDAY_QUERY = API.holiday.myHoliday;

export const useCreateHoliday = (onSuccess?: () => void) => {
  return usePostData({
    url: API.holiday.create,
    refetchQueries: [HOLIDAY_QUERY],
    onSuccess: () => {
      if (onSuccess) {
        onSuccess();
      }
    },
  });
};

export const useUpdateHoliday = (id: string, onSuccess?: () => void) => {
  return usePatchData({
    url: `${API.holiday.update}/${id}`,
    refetchQueries: [HOLIDAY_QUERY],
    onSuccess: () => {
      if (onSuccess) {
        onSuccess();
      }
    },
  });
};

export const useDeleteHoliday = (id: string, onSuccess?: () => void) => {
  return useDeleteData({
    url: `${API.holiday.delete}/${id}`,
    refetchQueries: [HOLIDAY_QUERY],
    onSuccess: () => {
      if (onSuccess) {
        onSuccess();
      }
    },
  });
};

export const useGetHolidayById = (
  id?: any,
  options?: { enabled?: boolean }
) => {
  const query = useFetchData<any>({
    url: `${API.holiday.byId}/${id}`,
    enabled: !!id && (options?.enabled ?? true),
  });

  return {
    ...query,
    data: query.data,
    isLoading: query.isLoading,
    error: query.error,
  };
};

export const useGetAllHolidays = (
  params?: any,
  options?: { enabled?: boolean }
) => {
  const query = useFetchData<any>({
    url: HOLIDAY_QUERY,
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

export const useGetMyHolidays = (options?: { enabled?: boolean }) => {
  const query = useFetchData<any>({
    url: MY_HOLIDAY_QUERY,
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
