import API from '@/config/api/api'
import useDeleteData from '@/hooks/use-delete-data'
import useFetchData from '@/hooks/use-fetch-data'
import useFetchInfiniteData, { PaginatedResponse } from '@/hooks/use-fetch-Infinite-data'
import usePatchData from '@/hooks/use-patch-data'
import usePostData from '@/hooks/use-post-data'
import { InfiniteData } from '@tanstack/react-query'
import { UseInfiniteQueryResult } from '@tanstack/react-query'
import { useCallback, useRef } from 'react'

const CALENDAR_QUERY = API.calendar.visitList
const ANALYTICS_QUERY = API.calendar.analytics

export interface IListParams1 {
  [key: string]: unknown
}
export interface IListParams {
  sort?: string
  limit?: number
  page?: number
  [key: string]: unknown
}

export const useGetAllVisit = (
  params: IListParams,
  options?: { enabled?: boolean }
) => {
  const query = useFetchData<any>({
    url: CALENDAR_QUERY,
    params,
    enabled: options?.enabled ?? true,
  })
  return {
    ...query,
    data: query.data?.list,
    allVisit: query.data?.list ?? [],
    totalCount: query.data?.totalCount ?? 0,
    isLoading: query.isLoading,
    error: query.error,
  }
}
export const useGetAnalytics = (
  params: IListParams1,
  options?: { enabled?: boolean }
) => {
  const query = useFetchData<any>({
    url: ANALYTICS_QUERY,
    params,
    enabled: options?.enabled ?? true,
  })
  console.log('query', query)
  return {
    ...query,
    data: query.data?.statusCounts,
    analytics: query.data?.statusCounts ?? [],
    isLoading: query.isLoading,
    error: query.error,
  }
}

export const useGetAllCustomer = (options?: { enabled?: boolean }) => {
  const query = useFetchData<any>({
    url: API.customer.customerList,
    enabled: options?.enabled ?? true,
  })

  return {
    ...query,
    data: query.data?.list,
    allCustomer: query.data?.list ?? [],
    totalCount: query.data?.totalCount ?? 0,
    isLoading: query.isLoading,
    error: query.error,
  }
}

export const useCreateVisits = (onSuccess?: () => void) => {
  return usePostData({
    url: API.calendar.create,
    refetchQueries: [CALENDAR_QUERY, ANALYTICS_QUERY],
    onSuccess: () => {
      if (onSuccess) {
        onSuccess()
      }
    },
  })
}

export const useUpdateVisits = (id: string, onSuccess?: () => void) => {
  return usePatchData({
    url: `${API.calendar.update}/${id}`,
    refetchQueries: [CALENDAR_QUERY, ANALYTICS_QUERY],
    onSuccess: () => {
      if (onSuccess) {
        onSuccess()
      }
    },
  })
}

export const useGetVisitByID = (visitId: string, IsEditMode: boolean,token?:string) => {
  const query = useFetchData<any>({
    url: visitId ? `${API.calendar.getVisitByID}/${visitId}` : '',
    enabled: IsEditMode, // Only fetch if visitId is non-empty,
    token
  })

  return {
    data: query.data, // Single visit object
    isLoading: query.isLoading,
    error: query.error,
  }
}
export const useDeleteVisits = (id: string, onSuccess?: () => void) => {
  return useDeleteData({
    url: `${API.calendar.delete}/${id}`,
    refetchQueries: [CALENDAR_QUERY, ANALYTICS_QUERY],

    onSuccess: () => {
      if (onSuccess) {
        onSuccess()
      }
    },
  })
}

type UseGetAllCompletedVisit = UseInfiniteQueryResult<
  PaginatedResponse<any>,
  Error
> & {
  allData: any[],
  totalCount: number;
  lastPostRef: (node: HTMLDivElement) => void;
}

export const useGetAllCompletedVisit = (
  params: IListParams,
  options?: { enabled?: boolean }
): UseGetAllCompletedVisit => {
  const query = useFetchInfiniteData<any>({
    url: `${CALENDAR_QUERY}`,
    params: { 
      status: "completed", 
      ...params 
    },
    enabled: options?.enabled ?? true,
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

export const useGetVisitEmployeeAnalytics = (
  options?: { enabled?: boolean }
) => {
  return useFetchData({
    url: `${API.calendar.visitEmployeeAnalytics}`,
    params: options,
    enabled: options?.enabled ?? true,
  })
}
