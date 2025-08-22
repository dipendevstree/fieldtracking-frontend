// import API from '@/config/api/api'
import useFetchData from "@/hooks/use-fetch-data";
import usePostData from "@/hooks/use-post-data";
import useDeleteData from "@/hooks/use-delete-data";
import usePatchData from "@/hooks/use-patch-data";
import {
  ApprovalHierarchy,
  CategoryApprover,
  ApprovalSettings,
} from "../type/type";
import API from "@/config/api/api";

const APPROVERS_QUERY = "";

export interface IListParams {
  sort?: string;
  limit: number;
  page: number;
  [key: string]: unknown;
}

// Approval Hierarchy
export interface ApprovalHierarchyPayload {
  level: number;
  minAmount: number;
  maxAmount: number;
  approverRole: string;
  isRequired: boolean;
}

export interface ApprovalHierarchyResponse {
  data: ApprovalHierarchy;
  message: string;
  statusCode: number;
}

export const useCreateApprovalHierarchy = (onSuccess?: () => void) => {
  return usePostData<ApprovalHierarchyResponse, ApprovalHierarchyPayload>({
    url: "approvers/hierarchy/create",
    refetchQueries: [APPROVERS_QUERY],
    onSuccess: () => {
      if (onSuccess) {
        onSuccess();
      }
    },
  });
};

export const useDeleteApprovalHierarchy = (
  id: string,
  onSuccess?: () => void
) => {
  return useDeleteData({
    url: id ? `approvers/hierarchy/delete/${id}` : "approvers/hierarchy/delete",
    refetchQueries: [APPROVERS_QUERY],
    onSuccess: () => {
      if (onSuccess && id) onSuccess();
    },
  });
};

// Category Approvers
export interface CategoryApproverPayload {
  categoryName: string;
  approverRole: string;
  isEnabled: boolean;
  description?: string;
}

export interface CategoryApproverResponse {
  data: CategoryApprover;
  message: string;
  statusCode: number;
}

export const useCreateCategoryApprover = (onSuccess?: () => void) => {
  return usePostData<CategoryApproverResponse, CategoryApproverPayload>({
    url: "approvers/category/create",
    refetchQueries: [APPROVERS_QUERY],
    onSuccess: () => {
      if (onSuccess) {
        onSuccess();
      }
    },
  });
};

export const useUpdateCategoryApprover = (
  id: string,
  onSuccess?: () => void
) => {
  return usePatchData<CategoryApproverResponse, CategoryApproverPayload>({
    url: `approvers/category/update/${id}`,
    refetchQueries: [APPROVERS_QUERY],
    onSuccess: () => {
      if (onSuccess) {
        onSuccess();
      }
    },
  });
};

export const useDeleteCategoryApprover = (
  id: string,
  onSuccess?: () => void
) => {
  return useDeleteData({
    url: id ? `approvers/category/delete/${id}` : "approvers/category/delete",
    refetchQueries: [APPROVERS_QUERY],
    onSuccess: () => {
      if (onSuccess && id) onSuccess();
    },
  });
};

// Approval Settings
export interface ApprovalSettingsPayload {
  defaultFirstApprover: string;
  autoApproveLimit: number;
}

export interface ApprovalSettingsResponse {
  data: ApprovalSettings;
  message: string;
  statusCode: number;
}

export const useUpdateApprovalSettings = (onSuccess?: () => void) => {
  return usePatchData<ApprovalSettingsResponse, ApprovalSettingsPayload>({
    url: "approvers/settings/update",
    refetchQueries: [APPROVERS_QUERY],
    onSuccess: () => {
      if (onSuccess) {
        onSuccess();
      }
    },
  });
};

// Data fetching hooks
export interface ApproversListResponse {
  hierarchy: ApprovalHierarchy[];
  categoryApprovers: CategoryApprover[];
  settings: ApprovalSettings;
  totalCount: number;
}

export const useGetApproversData = (
  params: IListParams,
  options?: { enabled?: boolean }
) => {
  const query = useFetchData<ApproversListResponse>({
    url: APPROVERS_QUERY,
    params,
    enabled: options?.enabled ?? true,
  });

  return {
    ...query,
    approvalHierarchy: query.data?.hierarchy ?? [],
    categoryApprovers: query.data?.categoryApprovers ?? [],
    approvalSettings: query.data?.settings ?? null,
    totalCount: query.data?.totalCount ?? 0,
    isLoading: query.isLoading,
    error: query.error,
  };
};

////////////////--Approval section--/////////////////////

export const useGetAllRolesForDropdownList = (params: any = {}) => {
  const query = useFetchData<any>({
    url: API.roles.list,
    params,
  });

  return {
    ...query,
    data: query.data?.list,
    allRoles: query.data?.list ?? [],
    totalCount: query.data?.totalCount ?? 0,
    isLoading: query.isLoading,
    error: query.error,
  };
};

export const useGetUsersDropDownList = (params: any = {}) => {
  const query = useFetchData<any>({
    url: API.users.list,
    params,
  });

  return {
    ...query,
    data: query.data,
    listData: query.data?.list ?? [],
    totalCount: query.data?.totalCount ?? 0,
    isLoading: query.isLoading,
    error: query.error,
  };
};

export const useGetAllApprovalsLevel = (params: any = {}) => {
  const query = useFetchData<any>({
    url: API.approvals.list,
    params,
  });

  return {
    ...query,
    data: query.data,
    listData: query.data?.list ?? [],
    totalCount: query.data?.totalCount ?? 0,
    isLoading: query.isLoading,
    error: query.error,
  };
};

export const useCreateApprovalsLevel = (onSuccess?: () => void) => {
  return usePostData({
    url: API.approvals.create,
    refetchQueries: [API.approvals.list],
    onSuccess: () => {
      if (onSuccess) {
        onSuccess();
      }
    },
  });
};

export const useUpdateApprovalsLevel = (onSuccess?: () => void) => {
  return usePatchData({
    url: API.approvals.update,
    refetchQueries: [API.approvals.list],
    onSuccess: () => {
      if (onSuccess) {
        onSuccess();
      }
    },
  });
};

export const useDeleteApprovalsLevel = (onSuccess?: () => void) => {
  return useDeleteData({
    url: API.approvals.delete,
    refetchQueries: [API.approvals.list],

    onSuccess: () => {
      if (onSuccess) {
        onSuccess();
      }
    },
  });
};

export const useUpdateOrganization = (
  organizationID: string,
  onSuccess?: (data: any) => void
) => {
  return usePatchData({
    url: `${API.organizations.update}/${organizationID}`,
    refetchQueries: [API.approvals.list],
    onSuccess: (data) => {
      if (onSuccess) {
        onSuccess(data);
      }
    },
  });
};

export const useGetExpenseCategoriesDropDownList = (
  params?: IListParams,
  options?: { enabled?: boolean }
) => {
  const query = useFetchData<any>({
    url: API.category.list,
    params,
    enabled: options?.enabled ?? true,
  });

  return {
    ...query,
    expenseCategories: query.data?.list ?? [],
    perDiemSettings: query.data?.perDiemSettings ?? null,
    categorySettings: query.data?.categorySettings ?? null,
    totalCount: query.data?.totalCount ?? 0,
    isLoading: query.isLoading,
    error: query.error,
  };
};
