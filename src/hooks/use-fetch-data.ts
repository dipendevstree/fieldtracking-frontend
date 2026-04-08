import { useQuery, UseQueryOptions } from '@tanstack/react-query'
import instance from '@/config/instance/instance'
import { buildQueryString } from '@/utils/storage'

export interface FetchDataOptions<TData, TParams> {
  url: string
  params?: TParams
  queryKey?: string
  queryOptions?: Omit<
    UseQueryOptions<TData, Error, TData>,
    'queryKey' | 'queryFn'
  >
  enabled?: boolean
  token?: string
}

const useFetchData = <TData = unknown, TParams = Record<string, unknown>>({
  url,
  params = {} as TParams,
  queryKey,
  queryOptions = {},
  enabled = true,
  token,
}: FetchDataOptions<TData, TParams>) => {
  return useQuery<TData, Error>({
    queryKey: queryKey ? [queryKey, params, token] : [url, params, token],
    queryFn: async (): Promise<TData> => {
      const queryString = buildQueryString(params as Record<string, unknown>)
      const response = await instance.get({
        url: `${url}${queryString}`,
        customToken: token,
      })

      if (response?.statusCode === 200) {
        return response.data as TData
      }

      throw new Error(response?.message || 'Failed to fetch data')
    },
    enabled,
    retry: 1,
    // refetchOnWindowFocus: false,
    // staleTime: 0,
    placeholderData: (prevData) => prevData,
    ...queryOptions,
  })
}

export default useFetchData
