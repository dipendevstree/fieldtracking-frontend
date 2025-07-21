import API from '@/config/api/api'
import useDeleteData from '@/hooks/use-delete-data'
import useFetchData from '@/hooks/use-fetch-data'
import usePatchData from '@/hooks/use-patch-data'
import usePostData from '@/hooks/use-post-data'

const USEALLUSERS_QUERY = API.users.list

export interface IListParams {
  sort?: string
  limit: number
  page: number
  [key: string]: unknown
}

export const useCreateUsers = (onSuccess?: () => void) => {
  return usePostData({
    url: API.users.create,
    refetchQueries: [USEALLUSERS_QUERY],
    onSuccess: () => {
      if (onSuccess) {
        onSuccess()
      }
    },
  })
}
export const useUpdateUser = (id: string, onSuccess?: () => void) => {
  return usePatchData({
    url: `${API.users.update}/${id}`,
    refetchQueries: [USEALLUSERS_QUERY],
    onSuccess: () => {
      if (onSuccess) {
        onSuccess()
      }
    },
  })
}
export const useDeleteUser = (id: string, onSuccess?: () => void) => {
  return useDeleteData({
    url: `${API.users.delete}/${id}`,
    refetchQueries: [USEALLUSERS_QUERY],
    onSuccess: () => {
      if (onSuccess) {
        onSuccess()
      }
    },
  })
}

export const useGetAllUsers = (
  params: IListParams,
  options?: { enabled?: boolean }
) => {
  const query = useFetchData<any>({
    url: USEALLUSERS_QUERY,
    params,
    enabled: options?.enabled ?? true,
  })

  return {
    ...query,
    data: query.data?.list,
    allUsers: query.data?.list ?? [],
    totalCount: query.data?.totalCount ?? 0,
    isLoading: query.isLoading,
    error: query.error,
  }
}
