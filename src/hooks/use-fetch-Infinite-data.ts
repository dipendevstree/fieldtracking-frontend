import {
  useInfiniteQuery,
  UseInfiniteQueryOptions,
  InfiniteData,
} from '@tanstack/react-query'
import instance from '@/config/instance/instance'
import { buildQueryString } from '@/utils/storage'

export interface PaginatedResponse<TItem = any> {
  list: TItem[]
  totalPages: number
  currentPage: number
  totalCount: number
}

type DefaultQueryKey = readonly unknown[]

export interface FetchInfiniteDataOptions<
  TData = unknown,
  TParams = Record<string, any>
> {
  url: string
  params?: TParams
  queryKey?: string
  queryOptions?: Omit<
    UseInfiniteQueryOptions<
      PaginatedResponse<TData>, // TQueryFnData
      Error,                    // TError
      InfiniteData<PaginatedResponse<TData>, number>, // TData
      PaginatedResponse<TData>, // TQueryData
      DefaultQueryKey,          // TQueryKey
      number                    // TPageParam
    >,
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
  return useInfiniteQuery<
    PaginatedResponse<TData>, // TQueryFnData
    Error,                    // TError
    InfiniteData<PaginatedResponse<TData>, number>, // TData
    DefaultQueryKey,          // TQueryKey
    number                    // TPageParam
  >({
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
    initialPageParam: 1,
    enabled,
    retry: 1,
    refetchOnWindowFocus: queryOptions?.refetchOnWindowFocus ?? false,
    staleTime: 0,
    placeholderData: (prev) => prev ?? undefined,
    ...queryOptions,
  })
}

export default useFetchInfiniteData
