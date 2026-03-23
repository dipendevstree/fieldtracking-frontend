import API from "@/config/api/api";
import useFetchData from "@/hooks/use-fetch-data";
import usePatchData from "@/hooks/use-patch-data";
import usePostData from "@/hooks/use-post-data";

const ORGANIZATION_QUERY = API.organizations.list;
const useUserStatusCounts_QUERY = API.organizations.statusCounts;
const USEPENDINGUSERS_QUERY = API.organizations.pendingAdmins;
const USEALLUSERS_QUERY = API.organizations.AllUsers;

export interface IListParams {
  sort?: string;
  limit: number;
  page: number;
  [key: string]: unknown;
}

export const useGetOrganizations = (
  params?: IListParams,
  options?: { enabled?: boolean },
) => {
  const query = useFetchData<any>({
    url: ORGANIZATION_QUERY,
    params,
    enabled: options?.enabled ?? true,
  });
  return {
    ...query,
    data: query.data?.list,
    organization: query.data?.list ?? [],
    totalCount: query.data?.totalCount ?? 0,
    isLoading: query.isLoading,
    error: query.error,
  };
};
export const useGetPendingUsers = (
  params: IListParams,
  options?: { enabled?: boolean },
) => {
  const query = useFetchData<any>({
    url: USEPENDINGUSERS_QUERY,
    params,
    enabled: options?.enabled ?? true,
  });

  return {
    ...query,
    data: query.data?.list,
    pendingUser: query.data?.list ?? [],
    totalCount: query.data?.totalCount ?? 0,
    isLoading: query.isLoading,
    error: query.error,
  };
};
export const useGetAllSchemaUsers = (
  params: IListParams,
  options?: { enabled?: boolean },
) => {
  const query = useFetchData<any>({
    url: USEALLUSERS_QUERY,
    params,
    enabled: options?.enabled ?? true,
  });

  return {
    ...query,
    data: query.data?.list,
    allUsers: query.data?.list ?? [],
    totalCount: query.data?.totalCount ?? 0,
    isLoading: query.isLoading,
    error: query.error,
  };
};
export const useUserStatusCounts = () => {
  const query = useFetchData<any>({
    url: useUserStatusCounts_QUERY,
  });
  return {
    ...query,
    userStatusCounts: query.data?.userStatusCounts ?? {},
    totalOrganizations: query.data?.totalOrganizations ?? 0,
    isLoading: query.isLoading,
    error: query.error,
  };
};

export const useGetEmployeeRange = () => {
  const query = useFetchData<any>({
    url: API.employeeRange.list,
  });
  return {
    ...query,
    data: query.data?.list,
    organization: query.data?.list ?? [],
    totalCount: query.data?.totalCount ?? 0,
    isLoading: query.isLoading,
    error: query.error,
  };
};
export const useGetIndustry = () => {
  const query = useFetchData<any>({
    url: API.industry.list,
  });
  return {
    ...query,
    data: query.data?.list,
    organization: query.data?.list ?? [],
    totalCount: query.data?.totalCount ?? 0,
    isLoading: query.isLoading,
    error: query.error,
  };
};

export const useGetMenu = () => {
  const query = useFetchData<any>({
    url: API.menu.list,
  });
  return {
    ...query,
    data: query.data?.list,
    organization: query.data?.list ?? [],
    totalCount: query.data?.totalCount ?? 0,
    isLoading: query.isLoading,
    error: query.error,
  };
};

export const useCreateOrganization = (onSuccess?: () => void) => {
  return usePostData({
    url: API.organizations.create,
    refetchQueries: [ORGANIZATION_QUERY, useUserStatusCounts_QUERY],
    onSuccess: () => {
      if (onSuccess) {
        onSuccess();
      }
    },
  });
};
export const useUpdateOrganization = (
  organizationID: string,
  onSuccess?: () => void,
) => {
  return usePatchData({
    url: `${API.organizations.update}/${organizationID}`,
    refetchQueries: [ORGANIZATION_QUERY],
    onSuccess: () => {
      if (onSuccess) {
        onSuccess();
      }
    },
  });
};

export const useUpdateStatus = (onSuccess?: () => void) => {
  return usePostData({
    url: API.organizations.updateStatus,
    refetchQueries: [USEPENDINGUSERS_QUERY, useUserStatusCounts_QUERY],
    onSuccess: () => {
      if (onSuccess) {
        onSuccess();
      }
    },
  });
};

export const useGetPlans = (params?: any) => {
  const query = useFetchData<any>({
    url: API.plan.dropdown,
    params,
  });
  return {
    ...query,
    plans: query.data?.list ?? [],
  };
};

export const useAssignPlan = (orgId: string, onSuccess?: () => void) => {
  return usePostData({
    url: `${API.plan.assign}/${orgId}`,
    refetchQueries: [ORGANIZATION_QUERY],
    onSuccess: () => {
      if (onSuccess) {
        onSuccess();
      }
    },
  });
};

export const useRenewPlan = (orgId: string, onSuccess?: () => void) => {
  return usePostData({
    url: `${API.plan.renew}/${orgId}`,
    refetchQueries: [ORGANIZATION_QUERY],
    onSuccess: () => {
      if (onSuccess) {
        onSuccess();
      }
    },
  });
};

export const useSuspendOrganization = (
  orgId: string,
  onSuccess?: () => void,
) => {
  return usePatchData({
    url: `${API.plan.suspend}/${orgId}`,
    refetchQueries: [ORGANIZATION_QUERY],
    onSuccess: () => {
      if (onSuccess) {
        onSuccess();
      }
    },
  });
};

export const useExtendGracePeriod = (orgId: string, onSuccess?: () => void) => {
  return usePatchData({
    url: `${API.plan.extendGracePeriod}/${orgId}`,
    refetchQueries: [ORGANIZATION_QUERY],
    onSuccess: () => {
      if (onSuccess) {
        onSuccess();
      }
    },
  });
};

export const useGetPlanStats = () => {
  const query = useFetchData<any>({
    url: API.plan.planStats,
  });
  return {
    ...query,
    data: query.data,
    isLoading: query.isLoading,
    error: query.error,
  };
};
