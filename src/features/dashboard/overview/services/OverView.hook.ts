// import API from '@/config/api/api'
import useFetchData from "@/hooks/use-fetch-data";
import usePostData from "@/hooks/use-post-data";
// import useDeleteData from '@/hooks/use-delete-data'
// import usePatchData from '@/hooks/use-patch-data'
import { DashboardStats, SalesRep, RecentActivity } from "../type/type";
import API from '@/config/api/api'

export interface IListParams {
  sort?: string;
  limit: number;
  page: number;
  status?: string;
  roleId?: string;
  territoryId?: string;
  dateFrom?: string;
  dateTo?: string;
  searchFor?: string;
  timeRange?: "today" | "week" | "month" | "quarter";
  [key: string]: unknown;
}

// Dashboard Overview Stats
export const useGetDashboardStats = (
  params: IListParams,
  options?: { enabled?: boolean }
) => {
  const query = useFetchData<DashboardStats>({
    url: API.overview?.stats,
    params,
    enabled: options?.enabled ?? true,
  });

  return {
    ...query,
    data: query.data,
    stats: query.data,
    isLoading: query.isLoading,
    error: query.error,
  };
};

// Sales Representatives
export interface SalesRepsListResponse {
  list: SalesRep[];
  totalCount: number;
}

export const useGetAllSalesReps = (
  params: IListParams,
  options?: { enabled?: boolean }
) => {
  const query = useFetchData<SalesRepsListResponse>({
    url: API.overview?.salesReps,
    params,
    enabled: options?.enabled ?? true,
  });

  return {
    ...query,
    data: query.data?.list,
    allSalesReps: query.data?.list ?? [],
    totalCount: query.data?.totalCount ?? 0,
    isLoading: query.isLoading,
    error: query.error,
  };
};

// Recent Activities
export interface ActivitiesListResponse {
  list: RecentActivity[];
  totalCount: number;
}

export const useGetRecentActivities = (
  params: IListParams,
  options?: { enabled?: boolean }
) => {
  const query = useFetchData<ActivitiesListResponse>({
    url: API.overview?.activities,
    params,
    enabled: options?.enabled ?? true,
  });

  return {
    ...query,
    data: query.data?.list,
    activities: query.data?.list ?? [],
    totalCount: query.data?.totalCount ?? 0,
    isLoading: query.isLoading,
    error: query.error,
  };
};

// Get User Performance
export const useGetUserPerformance = (
  userId: string,
  options?: { enabled?: boolean }
) => {
  return useFetchData<{
    salesRep: SalesRep;
    performance: {
      totalVisits: number;
      totalRevenue: number;
      conversionRate: number;
      averageSessionDuration: number;
      topCustomers: string[];
    };
  }>({
    url: `${API.overview?.performance}/${userId}`,
    enabled: options?.enabled ?? true,
  });
};

// Update User Status
export interface UpdateUserStatusPayload {
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
  return usePostData<{ message: string }, UpdateUserStatusPayload>({
    url: API.overview?.updateStatus,
    refetchQueries: [API.overview?.salesReps],
    onSuccess: () => {
      if (onSuccess) {
        onSuccess();
      }
    },
  });
};

// Export Dashboard Report
export interface ExportReportPayload {
  timeRange: "today" | "week" | "month" | "quarter";
  format: "pdf" | "excel" | "csv";
  filters?: {
    status?: string;
    roleId?: string;
    territoryId?: string;
    dateFrom?: string;
    dateTo?: string;
  };
}

export const useExportDashboardReport = (onSuccess?: () => void) => {
  return usePostData<{ downloadUrl: string }, ExportReportPayload>({
    url: API.overview?.exportReport,
    onSuccess: () => {
      if (onSuccess) {
        onSuccess();
      }
    },
  });
};
