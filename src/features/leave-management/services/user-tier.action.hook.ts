import API from "@/config/api/api";
import useDeleteData from "@/hooks/use-delete-data";
import useFetchData from "@/hooks/use-fetch-data";
import usePatchData from "@/hooks/use-patch-data";
import usePostData from "@/hooks/use-post-data";
import { IListParams } from "../types";

const USER_TIER_QUERY = API.userTier.list;
const USER_TIER_STATS_QUERY = API.userTier.stats;

export const useCreateUserTier = (onSuccess?: () => void) => {
  return usePostData({
    url: API.userTier.create,
    refetchQueries: [USER_TIER_QUERY, USER_TIER_STATS_QUERY],
    onSuccess: () => {
      if (onSuccess) {
        onSuccess();
      }
    },
  });
};

export const useUpdateUserTier = (id: string, onSuccess?: () => void) => {
  return usePatchData({
    url: `${API.userTier.update}/${id}`,
    refetchQueries: [USER_TIER_QUERY, USER_TIER_STATS_QUERY],
    onSuccess: () => {
      if (onSuccess) {
        onSuccess();
      }
    },
  });
};

export const useDeleteUserTier = (id: string, onSuccess?: () => void) => {
  return useDeleteData({
    url: `${API.userTier.delete}/${id}`,
    refetchQueries: [USER_TIER_QUERY, USER_TIER_STATS_QUERY],
    onSuccess: () => {
      if (onSuccess) {
        onSuccess();
      }
    },
  });
};

export const useGetAllUserTiers = (
  params?: IListParams,
  options?: { enabled?: boolean }
) => {
  const query = useFetchData<any>({
    url: USER_TIER_QUERY,
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

export const useGetUserTierStats = (options?: { enabled?: boolean }) => {
  const query = useFetchData<any>({
    url: USER_TIER_STATS_QUERY,
    enabled: options?.enabled ?? true,
  });

  return {
    ...query,
    data: query.data,
    isLoading: query.isLoading,
    error: query.error,
  };
};

export const useAssignUserOnTier = (id: string, onSuccess?: () => void) => {
  return usePatchData({
    url: `${API.userTier.assign}/${id}`,
    refetchQueries: [USER_TIER_STATS_QUERY],
    onSuccess: () => {
      if (onSuccess) {
        onSuccess();
      }
    },
  });
};

export const useGetUserTierById = (
  id?: any,
  options?: { enabled?: boolean }
) => {
  const query = useFetchData<any>({
    url: `${API.userTier.byId}/${id}`,
    enabled: !!id && (options?.enabled ?? true),
  });

  return {
    ...query,
    data: query.data,
    isLoading: query.isLoading,
    error: query.error,
  };
};
