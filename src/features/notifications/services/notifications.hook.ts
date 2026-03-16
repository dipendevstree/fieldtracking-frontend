import API from "@/config/api/api";
import useFetchData from "@/hooks/use-fetch-data";
import useInfiniteFetch, {
  PaginatedResponse,
} from "@/hooks/use-infinite-fetch";
import { InfiniteData, UseInfiniteQueryResult } from "@tanstack/react-query";
import { useCallback, useRef } from "react";
import { Notification } from "../types";
import usePostData from "@/hooks/use-post-data";

export interface IListParams {
  sort?: string;
  limit: number;
  page: number;
  [key: string]: unknown;
}

export const useGetNotifications = (
  params: IListParams,
): UseInfiniteQueryResult<PaginatedResponse<Notification>, Error> & {
  allData: Notification[];
  totalCount: number;
  unreadCount: number;
  lastPostRef: (node: HTMLDivElement) => void;
} => {
  const query = useInfiniteFetch<Notification>({
    url: API.notifications.list,
    params,
    queryKey: [API.notifications.list, params],
  });
  const observerElem = useRef<IntersectionObserver | null>(null);

  const lastPostRef = useCallback(
    (node: HTMLDivElement) => {
      if (query.isFetchingNextPage) return; // don’t trigger while loading
      if (observerElem.current) observerElem.current.disconnect(); // clear old
      observerElem.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && query.hasNextPage) {
          query.fetchNextPage();
        }
      });
      if (node) observerElem.current.observe(node);
    },
    [query.isFetchingNextPage, query.fetchNextPage, query.hasNextPage],
  );

  const infiniteData = query.data as
    | InfiniteData<PaginatedResponse<Notification>>
    | undefined;

  return {
    ...query,
    lastPostRef,
    allData: infiniteData?.pages?.flatMap((page) => page.list || []) ?? [],
    totalCount: infiniteData?.pages[0]?.totalCount ?? 0,
    unreadCount: infiniteData?.pages[0]?.unreadCount ?? 0,
  } as any;
};

export const useGetAllNotifications = (
  params?: any,
  options?: { enabled?: boolean },
) => {
  const query = useFetchData<PaginatedResponse<Notification>>({
    url: API.notifications.list,
    params,
    enabled: options?.enabled ?? true,
  });

  return {
    ...query,
    data: query.data,
    list: query.data?.list ?? [],
    totalCount: query.data?.totalCount ?? 0,
    unreadCount: query.data?.unreadCount ?? 0,
    isLoading: query.isLoading,
    error: query.error,
  };
};

export const useMarkAsRead = (options?: any) => {
  return usePostData({
    url: API.notifications.markAsRead,
    refetchQueries: [API.notifications.list],
    ...options,
    skipToast: true,
  });
};

export const useMarkAllAsRead = (options?: any) => {
  return usePostData({
    url: API.notifications.markAsRead,
    refetchQueries: [API.notifications.list],
    ...options,
    skipToast: true,
  });
};
