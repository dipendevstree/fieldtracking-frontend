import API from "@/config/api/api";
import useFetchData from "@/hooks/use-fetch-data";
import useFetchLiveData from "@/hooks/use-fetch-live-data";
import { useInfiniteQuery } from "@tanstack/react-query";
import instance from "@/config/instance/instance";
import { buildQueryString } from "@/utils/storage";

export const useGetUserTrackingByUserId = (userId: string) => {
  console.log("useGetUserByToken called with token:", userId);
  const query = useFetchData<any>({
    url: API.liveTracking.list,
    params: { userId },
  });
  return {
    data: query.data ?? [],
    totalCount: query.data?.totalCount ?? 0,
    isLoading: query.isLoading,
    error: query.error,
    // ...query,
    refetch: query.refetch,
    isFetched: query.isFetched,
  };
};

export const userDetailsById = (userId: string) => {
  const query = useFetchData<any>({
    url: `${API.liveTracking.user}/${userId}`,
    enabled: !!userId,
  });
  return {
    user: query.data ?? [],
    totalCount: query.data?.totalCount ?? 0,
    isLoading: query.isLoading,
    error: query.error,
    // ...query,
    refetch: query.refetch,
    isFetched: query.isFetched,
  };
};

export const getWorkDaySession = (userId: string, date: string) => {
  const enabled = Boolean(userId && date);

  const query = useFetchData<any>({
    url: API.liveTracking.getWorkDaySession,
    params: { userId, date },
    enabled,
  });

  return {
    userSession: query.data ?? [],
    totalCount: query.data?.totalCount ?? 0,
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
    isFetched: query.isFetched,
  };
};

export const useVisitAnalytics = (
  userId: string,
  startDate: string,
  endDate: string
) => {
  const enabled = Boolean(userId && startDate && endDate);

  const query = useFetchData<any>({
    url: API.liveTracking.visitAnalytics,
    params: {
      salesRepresentativeUserId: userId,
      byOrganization: false,
      startDate,
      endDate,
    },
    enabled,
  });

  return {
    analytics: query.data ?? {},
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
    isFetched: query.isFetched,
  };
};

export const useFetchLiveTrackingData = (
  userId: string,
  startDate: string,
  endDate: string
) => {
  const enabled = !!userId && !!startDate && !!endDate;

  const query = useFetchLiveData<any>({
    url: `${API.liveTracking.userTracking}/${userId}`,
    params: { startDate, endDate },
    enabled,
  });

  return {
    data: query.data ?? [],
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
    isFetched: query.isFetched,
  };
};

export const useInfiniteUsers = (baseParams: any) => {
  return useInfiniteQuery({
    queryKey: ["live-tracking-users", baseParams],
    initialPageParam: 1,

    queryFn: async ({ pageParam = 1 }) => {
      const params = {
        ...baseParams,
        page: pageParam,
      };

      const queryString = buildQueryString(params);
      const response = await instance.get({
        url: `${API.liveTracking.userList}${queryString}`,
      });

      if (response?.statusCode === 200) {
        return response.data;
      }

      throw new Error(response?.message || "Failed to fetch data");
    },

    getNextPageParam: (lastPage: any, pages:any) => {
      const totalFetched = pages.flatMap((p: any) => p?.list ?? []).length;
      const totalAvailable = lastPage?.totalCount ?? 0;
      return totalFetched < totalAvailable ? pages.length + 1 : undefined;
    },
  });
};
