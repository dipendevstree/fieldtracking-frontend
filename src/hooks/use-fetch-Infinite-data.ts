import { useInfiniteQuery, UseInfiniteQueryOptions } from '@tanstack/react-query'
import instance from '@/config/instance/instance'
import { buildQueryString } from '@/utils/storage'

export interface PaginatedResponse<TItem = any> {
  list: TItem[]
  totalCount: number
}

export interface FetchInfiniteDataOptions<TData, TParams> {
  url: string
  params?: TParams
  queryKey?: string
  queryOptions?: Omit<
    UseInfiniteQueryOptions<TData, Error, TData>,
    'queryKey' | 'queryFn' | 'getNextPageParam' | 'initialPageParam'
  >
  enabled?: boolean
}

const useFetchInfiniteData = <
  TData = unknown,
  TParams = Record<string, any>
>({
  url,
  params = {} as TParams,
  queryKey,
  queryOptions = {},
  enabled = true,
}: FetchInfiniteDataOptions<TData, TParams>) => {
  return useInfiniteQuery<PaginatedResponse<TData>, Error>({
    queryKey: queryKey ? [queryKey, params] : [url, params],
    queryFn: async ({ pageParam = 1 }): Promise<PaginatedResponse<TData>> => {
      const queryString = buildQueryString({
        ...params,
        page: pageParam,
      })
      const response = await instance.get({ url: `${url}${queryString}` })
      if (response?.statusCode === 200) {
        return response.data as PaginatedResponse<TData>
      }
      throw new Error(response?.message || 'Failed to fetch data')
    },
    getNextPageParam: (lastPage, allPages) => {
      const total = lastPage?.totalCount ?? 0
      const loaded = allPages.flatMap((p) => p.list).length
      return loaded < total ? allPages.length + 1 : undefined
    },
    enabled,
    retry: 1,
    refetchOnWindowFocus: false,
    staleTime: 0,
    placeholderData: (prevData) => prevData,
    ...queryOptions,
  })
}

export default useFetchInfiniteData
