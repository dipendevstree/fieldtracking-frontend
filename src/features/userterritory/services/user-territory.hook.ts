import API from '@/config/api/api'
import useDeleteData from '@/hooks/use-delete-data'
import useFetchData from '@/hooks/use-fetch-data'
import usePatchData from '@/hooks/use-patch-data'
import usePostData from '@/hooks/use-post-data'

const TERRITORY_QUERY = API.territories.list

export interface IListParams1 {
  sort?: string
  limit: number
  page: number
  territoryId: string
  [key: string]: unknown
}
export interface IListParams {
  sort?: string
  limit: number
  page: number
  [key: string]: unknown
}

export const useCreateTerritory = (onSuccess?: () => void) => {
  return usePostData({
    url: API.territories.create,
    refetchQueries: [TERRITORY_QUERY],
    onSuccess: () => {
      if (onSuccess) {
        onSuccess()
      }
    },
  })
}

export const useUpdateTerritory = (id: string, onSuccess?: () => void) => {
  return usePatchData({
    url: `${API.territories.update}/${id}`,
    refetchQueries: [TERRITORY_QUERY],
    onSuccess: () => {
      if (onSuccess) {
        onSuccess()
      }
    },
  })
}

export const useDeleteTerritory = (id: string, onSuccess?: () => void) => {
  return useDeleteData({
    url: `${API.territories.delete}/${id}`,
    refetchQueries: [TERRITORY_QUERY],
    onSuccess: () => {
      if (onSuccess) {
        onSuccess()
      }
    },
  })
}

export const useGetAllTerritories = (
  params: IListParams,
  options?: { enabled?: boolean }
) => {
  const query = useFetchData<any>({
    url: TERRITORY_QUERY,
    params,
    enabled: options?.enabled ?? true,
  })

  return {
    ...query,
    data: query.data?.list,
    allTerritories: query.data?.list ?? [],
    totalCount: query.data?.totalCount ?? 0,
    isLoading: query.isLoading,
    error: query.error,
  }
}

export const useGetTerritoriesWiseUser = (
  params: IListParams1,
  options?: { enabled?: boolean }
) => {
  const query = useFetchData<any>({
    url: API.users.list,
    params,
    enabled: options?.enabled ?? true,
  })

  return {
    ...query,
    data: query.data?.list,
    allTerritories: query.data?.list ?? [],
    totalCount: query.data?.totalCount ?? 0,
    isLoading: query.isLoading,
    error: query.error,
  }
}

export const useGetAllTerritoriesForDropdown = (options?: {
  enabled?: boolean
}) => {
  const query = useFetchData<any>({
    url: TERRITORY_QUERY,
    enabled: options?.enabled ?? true,
  })

  return {
    ...query,
    data: query.data?.list,
    allTerritories: query.data?.list ?? [],
    totalCount: query.data?.totalCount ?? 0,
    isLoading: query.isLoading,
    error: query.error,
  }
}
