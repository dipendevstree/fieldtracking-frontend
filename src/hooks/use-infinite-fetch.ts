import {
  keepPreviousData,
  useInfiniteQuery,
  UseInfiniteQueryOptions,
} from "@tanstack/react-query";
import instance from "@/config/instance/instance";
import { buildQueryString } from "@/utils/storage";

export interface PaginatedResponse<TItem = any> {
  list?: TItem[];
  data?: TItem[];
  totalPages?: number;
  currentPage?: number;
  totalCount?: number;
  meta?: {
    page: number;
    limit: number;
    hasMore: boolean;
  };
  [key: string]: any;
}

type DefaultQueryKey = readonly unknown[];

export interface InfiniteFetchOptions<
  TData = unknown,
  TParams = Record<string, any>,
> {
  url: string;
  params?: TParams;
  queryKey?: string | any[];
  queryOptions?: Omit<
    UseInfiniteQueryOptions<
      PaginatedResponse<TData>,
      Error,
      PaginatedResponse<TData>,
      DefaultQueryKey,
      number
    >,
    "queryKey" | "queryFn" | "getNextPageParam" | "initialPageParam"
  >;
  enabled?: boolean;
}

/**
 * A generic infinite fetch hook that handles different paginated API structures.
 */
const useInfiniteFetch = <TData = unknown, TParams = Record<string, any>>({
  url,
  params = {} as TParams,
  queryKey,
  queryOptions = {},
  enabled = true,
}: InfiniteFetchOptions<TData, TParams>) => {
  return useInfiniteQuery<
    PaginatedResponse<TData>,
    Error,
    PaginatedResponse<TData>,
    DefaultQueryKey,
    number
  >({
    queryKey: Array.isArray(queryKey) ? queryKey : [queryKey || url, params],
    queryFn: async ({ pageParam = 1 }): Promise<PaginatedResponse<TData>> => {
      const queryString = buildQueryString({
        ...params,
        page: pageParam,
      });
      const response = await instance.get({ url: `${url}${queryString}` });
      if (response?.statusCode === 200 || response?.data) {
        return response.data as PaginatedResponse<TData>;
      }
      throw new Error(response?.message || "Failed to fetch data");
    },
    getNextPageParam: (lastPage, allPages) => {
      // Structure 1: list/totalCount
      if (lastPage?.totalCount !== undefined) {
        const loaded = allPages.flatMap((p) => p.list || p.data || []).length;
        return loaded < lastPage.totalCount ? allPages.length + 1 : undefined;
      }

      // Structure 2: meta.hasMore
      if (lastPage?.meta?.hasMore) {
        return (lastPage.meta.page || allPages.length) + 1;
      }

      return undefined;
    },
    initialPageParam: 1,
    enabled,
    retry: 1,
    refetchOnWindowFocus: queryOptions?.refetchOnWindowFocus ?? false,
    staleTime: 5 * 60 * 1000, // 5 minutes default stale time
    placeholderData: keepPreviousData,
    ...queryOptions,
  });
};

export default useInfiniteFetch;
