import API from "@/config/api/api";
import useDeleteData from "@/hooks/use-delete-data";
import useFetchData from "@/hooks/use-fetch-data";
import usePatchData from "@/hooks/use-patch-data";
import usePostData from "@/hooks/use-post-data";
import { IListParams } from "../types";

const EMPLOYEE_TIER_QUERY = API.employeeTier.list;
const EMPLOYEE_TIER_STATS_QUERY = API.employeeTier.stats;

export const useCreateEmployeeTier = (onSuccess?: () => void) => {
  return usePostData({
    url: API.employeeTier.create,
    refetchQueries: [EMPLOYEE_TIER_QUERY, EMPLOYEE_TIER_STATS_QUERY],
    onSuccess: () => {
      if (onSuccess) {
        onSuccess();
      }
    },
  });
};

export const useUpdateEmployeeTier = (id: string, onSuccess?: () => void) => {
  return usePatchData({
    url: `${API.employeeTier.update}/${id}`,
    refetchQueries: [EMPLOYEE_TIER_QUERY, EMPLOYEE_TIER_STATS_QUERY],
    onSuccess: () => {
      if (onSuccess) {
        onSuccess();
      }
    },
  });
};

export const useDeleteEmployeeTier = (id: string, onSuccess?: () => void) => {
  return useDeleteData({
    url: `${API.employeeTier.delete}/${id}`,
    refetchQueries: [EMPLOYEE_TIER_QUERY, EMPLOYEE_TIER_STATS_QUERY],
    onSuccess: () => {
      if (onSuccess) {
        onSuccess();
      }
    },
  });
};

export const useGetAllEmployeeTiers = (
  params?: IListParams,
  options?: { enabled?: boolean }
) => {
  const query = useFetchData<any>({
    url: EMPLOYEE_TIER_QUERY,
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

export const useGetEmployeeTierStats = (options?: { enabled?: boolean }) => {
  const query = useFetchData<any>({
    url: EMPLOYEE_TIER_STATS_QUERY,
    enabled: options?.enabled ?? true,
  });

  return {
    ...query,
    data: query.data,
    isLoading: query.isLoading,
    error: query.error,
  };
};

export const useAssignEmployeeOnTier = (id: string, onSuccess?: () => void) => {
  return usePatchData({
    url: `${API.employeeTier.assign}/${id}`,
    refetchQueries: [EMPLOYEE_TIER_STATS_QUERY],
    onSuccess: () => {
      if (onSuccess) {
        onSuccess();
      }
    },
  });
};

export const useGetEmployeeTierById = (
  id?: any,
  options?: { enabled?: boolean }
) => {
  const query = useFetchData<any>({
    url: `${API.employeeTier.byId}/${id}`,
    enabled: !!id && (options?.enabled ?? true),
  });

  return {
    ...query,
    data: query.data,
    isLoading: query.isLoading,
    error: query.error,
  };
};
