import API from "@/config/api/api";
import useDeleteData from "@/hooks/use-delete-data";
import useFetchData from "@/hooks/use-fetch-data";
import usePatchData from "@/hooks/use-patch-data";
import usePostData from "@/hooks/use-post-data";

const CATEGORY_QUERY = API.category.list;

export interface IListParams1 {
  [key: string]: unknown;
}
export interface IListParams {
  sort?: string;
  limit: number;
  page: number;
  [key: string]: unknown;
}

export const useCreateCategory = (onSuccess?: () => void) => {
  return usePostData({
    url: API.category.create,
    refetchQueries: [CATEGORY_QUERY],
    onSuccess: () => {
      if (onSuccess) {
        onSuccess();
      }
    },
  });
};

export const useUpdateCategory = (id: string, onSuccess?: () => void) => {
  return usePatchData({
    url: `${API.category.update}/${id}`,
    refetchQueries: [CATEGORY_QUERY],
    onSuccess: () => {
      if (onSuccess) {
        onSuccess();
      }
    },
  });
};

export const useDeleteCategory = (id: string, onSuccess?: () => void) => {
  return useDeleteData({
    url: `${API.category.delete}/${id}`,
    refetchQueries: [CATEGORY_QUERY],
    onSuccess: () => {
      if (onSuccess) {
        onSuccess();
      }
    },
  });
};

export const useGetAllCategories = (
  params: IListParams,
  options?: { enabled?: boolean }
) => {
  const query = useFetchData<any>({
    url: CATEGORY_QUERY,
    params,
    enabled: options?.enabled ?? true,
  });

  return {
    ...query,
    data: query.data?.list,
    allCategories: query.data?.list ?? [],
    totalCount: query.data?.totalCount ?? 0,
    isLoading: query.isLoading,
    error: query.error,
  };
};
