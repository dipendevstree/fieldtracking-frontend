import API from '@/config/api/api'
import useFetchData from '@/hooks/use-fetch-data'
import usePatchData from '@/hooks/use-patch-data'
import usePostData from '@/hooks/use-post-data'
import { IListParams } from '@/features/merchants/services/merchants.hook'
import { useUsersStore } from '../store/user.store'
import { UserResponse } from '../types'

const GET_QUERY = API.users.list

export const useGetUsers = (params: IListParams) => {
  const query = useFetchData<UserResponse>({ url: GET_QUERY, params })
  return {
    ...query,
    data: query.data,
    listData: query.data?.docs ?? [],
    totalCount: query.data?.count ?? 0,
    isLoading: query.isLoading,
    error: query.error,
  }
}
// export const useGetUsersForDropdown = (options?: { enabled?: boolean }) => {
//   const query = useFetchData<any>({
//     url: GET_QUERY,
//     enabled: options?.enabled ?? true,
//   })
//   console.log('useGetUsersForDropdown quer1111111111:', query)
//   return {
//     ...query,
//     data: query.data?.list,
//     allUsers: query.data?.data?.list ?? [],
//     totalCount: query.data?.totalCount ?? 0,
//     isLoading: query.isLoading,
//     error: query.error,
//   }
// }
export const useGetUsersForDropdown = ({
  roleId,
  enabled = true,
}: {
  roleId?: string // Make roleId optional
  enabled?: boolean
}) => {
  const query = useFetchData<any>({
    url: GET_QUERY,
    params: roleId ? { roleId } : undefined, // Pass roleId only if it exists
    enabled, // Fetch is enabled based on the enabled flag, not dependent on roleId
  })

  return {
    ...query,
    data: query.data?.list,
    allUsers: query.data?.data?.list ?? [],
    totalCount: query.data?.totalCount ?? 0,
    isLoading: query.isLoading,
    error: query.error,
  }
}

export const useCreateUser = () => {
  const { setOpen, setCurrentRow } = useUsersStore()
  return usePostData({
    url: API.users.create,
    refetchQueries: [GET_QUERY],
    onSuccess: () => {
      setOpen(null)
      setCurrentRow(null)
    },
  })
}

export const useUpdateUser = (id: string) => {
  const { setOpen, setCurrentRow } = useUsersStore()
  return usePatchData({
    url: `${API.users.update}/${id}`,
    refetchQueries: [GET_QUERY],
    onSuccess: () => {
      setOpen(null)
      setCurrentRow(null)
    },
  })
}
