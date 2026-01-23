import API from "@/config/api/api";
import useDeleteData from "@/hooks/use-delete-data";
import useFetchData from "@/hooks/use-fetch-data";
import usePatchData from "@/hooks/use-patch-data";
import usePostData from "@/hooks/use-post-data";
import { IListParams } from "../types";

const HOLIDAY_TEMPLATE_QUERY = API.holidayTemplate.list;
const HOLIDAY_TEMPLATE_STATS_QUERY = API.holidayTemplate.stats;
const HOLIDAY_TEMPLATE_TERRITORIES_QUERY = API.holidayTemplate.territories;

export const useCreateHolidayTemplate = (onSuccess?: () => void) => {
  return usePostData({
    url: API.holidayTemplate.create,
    refetchQueries: [
      HOLIDAY_TEMPLATE_QUERY,
      HOLIDAY_TEMPLATE_STATS_QUERY,
      HOLIDAY_TEMPLATE_TERRITORIES_QUERY,
    ],
    onSuccess: () => {
      if (onSuccess) {
        onSuccess();
      }
    },
  });
};

export const useUpdateHolidayTemplate = (
  id: string,
  onSuccess?: () => void,
) => {
  return usePatchData({
    url: `${API.holidayTemplate.update}/${id}`,
    refetchQueries: [
      HOLIDAY_TEMPLATE_QUERY,
      HOLIDAY_TEMPLATE_STATS_QUERY,
      HOLIDAY_TEMPLATE_TERRITORIES_QUERY,
    ],
    onSuccess: () => {
      if (onSuccess) {
        onSuccess();
      }
    },
  });
};

export const useDeleteHolidayTemplate = (
  id: string,
  onSuccess?: () => void,
) => {
  return useDeleteData({
    url: `${API.holidayTemplate.delete}/${id}`,
    refetchQueries: [
      HOLIDAY_TEMPLATE_QUERY,
      HOLIDAY_TEMPLATE_STATS_QUERY,
      HOLIDAY_TEMPLATE_TERRITORIES_QUERY,
    ],
    onSuccess: () => {
      if (onSuccess) {
        onSuccess();
      }
    },
  });
};

export const useGetAllHolidayTemplates = (
  params?: IListParams,
  options?: { enabled?: boolean },
) => {
  const query = useFetchData<any>({
    url: HOLIDAY_TEMPLATE_QUERY,
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

export const useGetHolidayTemplateStats = (options?: { enabled?: boolean }) => {
  const query = useFetchData<any>({
    url: HOLIDAY_TEMPLATE_STATS_QUERY,
    enabled: options?.enabled ?? true,
  });

  return {
    ...query,
    data: query.data,
    isLoading: query.isLoading,
    error: query.error,
  };
};

export const useGetHolidayTemplateById = (
  id: string,
  options?: { enabled?: boolean },
) => {
  const query = useFetchData<any>({
    url: `${API.holidayTemplate.byId}/${id}`,
    enabled: !!id && (options?.enabled ?? true),
  });

  return {
    ...query,
    data: query.data,
    isLoading: query.isLoading,
    error: query.error,
  };
};

export const useGetHolidayTemplateTerritories = (
  id: string,
  options?: {
    enabled?: boolean;
  },
) => {
  const query = useFetchData<any>({
    url: `${HOLIDAY_TEMPLATE_TERRITORIES_QUERY}/${id}`,
    enabled: !!id && (options?.enabled ?? true),
  });

  return {
    ...query,
    data: query.data,
    isLoading: query.isLoading,
    error: query.error,
  };
};
