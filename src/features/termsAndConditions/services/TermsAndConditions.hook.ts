import API from "@/config/api/api";
import useDeleteData from "@/hooks/use-delete-data";
import useFetchData from "@/hooks/use-fetch-data";
import usePatchData from "@/hooks/use-patch-data";
import usePostData from "@/hooks/use-post-data";

const TERMSANDCONDITIONS_QUERY = "termsAndConditions";

export interface IListParams {
  sort?: string;
  limit: number;
  page: number;
  [key: string]: unknown;
}

export const useCreatetermsAndConditions = (onSuccess?: () => void) => {
  return usePostData({
    url: API.termsAndConditions.create,
    refetchQueries: [TERMSANDCONDITIONS_QUERY],
    onSuccess: () => {
      if (onSuccess) {
        onSuccess();
      }
    },
  });
};
export const useUpdatetermsAndConditions = (
  id: string,
  onSuccess?: () => void
) => {
  return usePatchData({
    url: `${API.termsAndConditions.update}/${id}`,
    refetchQueries: [TERMSANDCONDITIONS_QUERY],
    onSuccess: () => {
      if (onSuccess) {
        onSuccess();
      }
    },
  });
};
export const useDeletetermsAndConditions = (
  id: string,
  onSuccess?: () => void
) => {
  return useDeleteData({
    url: `${API.termsAndConditions.delete}/${id}`,
    refetchQueries: [TERMSANDCONDITIONS_QUERY],
    onSuccess: () => {
      if (onSuccess) {
        onSuccess();
      }
    },
  });
};

export const useGetAllTermsAndConditions = (
  params?: IListParams,
  options?: { enabled?: boolean }
) => {
  const query = useFetchData<any>({
    url: API.termsAndConditions.list,
    params,
    enabled: options?.enabled ?? true,
    queryKey: TERMSANDCONDITIONS_QUERY,
  });

  return {
    ...query,
    data: query?.data?.list,
    totalCount: query.data?.totalCount ?? 0,
    isLoading: query.isLoading,
    error: query.error,
  };
};
