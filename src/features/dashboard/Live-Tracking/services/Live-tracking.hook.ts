import API from "@/config/api/api";
import useFetchData from "@/hooks/use-fetch-data";
import useFetchLiveData from "@/hooks/use-fetch-live-data";
import usePostData from "@/hooks/use-post-data";
// import useDeleteData from '@/hooks/use-delete-data'
// import usePatchData from '@/hooks/use-patch-data'
import {
  LiveTrackingUser,
  TrackingSession,
  TrackingEvent,
  LiveTrackingStats,
  // , TrackingFilter
} from "../type/type";

const LIVE_TRACKING_QUERY = API.liveTracking?.list || "/api/live-tracking";
// const TRACKING_SESSIONS_QUERY = '/api/tracking-sessions'
// const TRACKING_EVENTS_QUERY = '/api/tracking-events'

export interface IListParams {
  sort?: string;
  limit: number;
  page: number;
  status?: string;
  activityStatus?: string;
  roleId?: string;
  territoryId?: string;
  dateFrom?: string;
  dateTo?: string;
  searchFor?: string;
  includeLatLong?: boolean;
  [key: string]: unknown;
}

// Live Tracking Users
export interface LiveTrackingListResponse {
  list: LiveTrackingUser[];
  totalCount: number;
  stats: LiveTrackingStats;
}

export const useGetAllLiveTrackingUsers = (
  params: IListParams,
  options?: { enabled?: boolean }
) => {
  const query = useFetchData<LiveTrackingListResponse>({
    url: LIVE_TRACKING_QUERY,
    params,
    enabled: options?.enabled ?? true,
  });

  return {
    ...query,
    data: query.data?.list,
    allUsers: query.data?.list ?? [],
    totalCount: query.data?.totalCount ?? 0,
    stats: query.data?.stats,
    isLoading: query.isLoading,
    error: query.error,
  };
};

// Get Live Tracking Stats
export const useGetLiveTrackingStats = (options?: { enabled?: boolean }) => {
  return useFetchData<LiveTrackingStats>({
    url: "/api/live-tracking/stats",
    enabled: options?.enabled ?? true,
  });
};

// Get User by ID
export const useGetUserById = (
  userId: string,
  options?: { enabled?: boolean }
) => {
  return useFetchData<LiveTrackingUser>({
    url: `/api/live-tracking/user/${userId}`,
    enabled: options?.enabled ?? true,
  });
};

// Tracking Sessions
export interface TrackingSessionsListResponse {
  list: TrackingSession[];
  totalCount: number;
}

export const useGetUserSessions = (
  userId: string,
  params: IListParams,
  options?: { enabled?: boolean }
) => {
  const query = useFetchData<TrackingSessionsListResponse>({
    url: `/api/tracking-sessions/${userId}`,
    params,
    enabled: options?.enabled ?? true,
  });

  return {
    ...query,
    data: query.data?.list,
    sessions: query.data?.list ?? [],
    totalCount: query.data?.totalCount ?? 0,
    isLoading: query.isLoading,
    error: query.error,
  };
};

// Tracking Events
export interface TrackingEventsListResponse {
  list: TrackingEvent[];
  totalCount: number;
}

export const useGetUserEvents = (
  userId: string,
  params: IListParams,
  options?: { enabled?: boolean }
) => {
  const query = useFetchData<TrackingEventsListResponse>({
    url: `/api/tracking-events/${userId}`,
    params,
    enabled: options?.enabled ?? true,
  });

  return {
    ...query,
    data: query.data?.list,
    events: query.data?.list ?? [],
    totalCount: query.data?.totalCount ?? 0,
    isLoading: query.isLoading,
    error: query.error,
  };
};

// Real-time location updates
export const useGetLiveLocation = (
  userId: string,
  options?: { enabled?: boolean }
) => {
  return useFetchLiveData<{ lat: number; lng: number; timestamp: string }>({
    url: `/api/live-tracking/location/${userId}`,
    enabled: options?.enabled ?? true,
  });
};

// Update user status
export interface UpdateStatusPayload {
  userId: string;
  status: "active" | "idle" | "offline" | "on_break";
  activityStatus: "working" | "traveling" | "at_customer" | "break" | "offline";
  location?: {
    lat: number;
    lng: number;
    accuracy?: number;
  };
}

export const useUpdateUserStatus = (onSuccess?: () => void) => {
  return usePostData<{ message: string }, UpdateStatusPayload>({
    url: "/api/live-tracking/status",
    refetchQueries: [LIVE_TRACKING_QUERY],
    onSuccess: () => {
      if (onSuccess) {
        onSuccess();
      }
    },
  });
};

// Get user path for a specific time range
export const useGetUserPath = (
  userId: string,
  startDate: string,
  endDate: string,
  options?: { enabled?: boolean }
) => {
  const enabled = !!userId && !!startDate && !!endDate;

  return useFetchData<{
    path: Array<{ lat: number; lng: number; timestamp: string }>;
  }>({
    url: `/api/live-tracking/path/${userId}`,
    params: { startDate, endDate },
    enabled: options?.enabled ?? enabled,
  });
};
