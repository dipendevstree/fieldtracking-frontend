import API from "@/config/api/api"
import useFetchData from "@/hooks/use-fetch-data"
import useFetchInfiniteData, { PaginatedResponse } from "@/hooks/use-fetch-Infinite-data"
import { InfiniteData, UseInfiniteQueryResult } from "@tanstack/react-query"
import { useCallback, useRef } from "react"

export interface IListParams {
  sort?: string
  limit: number
  page: number
  [key: string]: unknown
}

export const useGetNotifications = (params: IListParams): UseInfiniteQueryResult<
  PaginatedResponse<any>,
  Error
> & {
  allData: any[],
  totalCount: number;
  lastPostRef: (node: HTMLDivElement) => void;
} => {
  const query = useFetchInfiniteData<any>({
    url: API.notifications.list,
    params,
  })
  const observerElem = useRef<IntersectionObserver | null>(null);

  const lastPostRef = useCallback((node: HTMLDivElement) => {
    if (query.isFetchingNextPage) return; // don’t trigger while loading
    if (observerElem.current) observerElem.current.disconnect(); // clear old
    observerElem.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && query.hasNextPage) {
        query.fetchNextPage();
      }
    });
    if (node) observerElem.current.observe(node);
  }, [query.isFetchingNextPage, query.fetchNextPage, query.hasNextPage]);

  const infiniteData = query.data as InfiniteData<PaginatedResponse<any>> | undefined

  return {
    ...query,
    lastPostRef,
    allData: infiniteData?.pages?.flatMap((page: any) => page.list) ?? [],
    totalCount: infiniteData?.pages[0]?.totalCount ?? 0
  }
}

export const useGetAllNotifications = (
  params?: any,
  options?: { enabled?: boolean }
) => {
  const query = useFetchData<any>({
    url: API.notifications.list,
    params,
    enabled: options?.enabled ?? true,
  });

  return {
    ...query,
    data: query.data,
    list: query.data?.list ?? [],
    totalCount: query.data?.totalCount ?? 0,
    isLoading: query.isLoading,
    error: query.error,
  };
}

export const useGetUnreadCount = (params?: any) => {
  const query = useFetchData<any>({
    url: API.notifications.unreadCount,
    params,
    enabled: true,
  });

  return {
    ...query,
    data: query.data,
    error: query.error,
  };
}
