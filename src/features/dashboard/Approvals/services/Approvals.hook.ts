// import API from "@/config/api/api";
import useFetchData from "@/hooks/use-fetch-data";
import usePostData from "@/hooks/use-post-data";
import useDeleteData from "@/hooks/use-delete-data";
import usePatchData from "@/hooks/use-patch-data";
import { Approval, ApprovalWorkflow, ApprovalStats } from "../type/type";

const APPROVALS_QUERY = "/api/approvals";
const APPROVAL_WORKFLOWS_QUERY = "/api/approval-workflows";

export interface IListParams {
  sort?: string;
  limit: number;
  page: number;
  status?: string;
  type?: string;
  priority?: string;
  dateFrom?: string;
  dateTo?: string;
  employeeId?: string;
  [key: string]: unknown;
}

export interface ApprovalActionPayload {
  approvalId: string;
  action: "approve" | "reject";
  comment?: string;
  rejectionReason?: string;
}

export interface ApprovalResponse {
  data: Approval;
  message: string;
  statusCode: number;
}

export interface ApprovalWorkflowPayload {
  name: string;
  description?: string;
  type: "expense" | "allowance" | "travel" | "general";
  steps: Array<{
    order: number;
    approverType: "individual" | "role" | "hierarchy";
    approverId?: string;
    roleId?: string;
    minAmount?: number;
    maxAmount?: number;
    isRequired: boolean;
  }>;
  isActive: boolean;
}

export interface ApprovalWorkflowResponse {
  data: ApprovalWorkflow;
  message: string;
  statusCode: number;
}

// Approval Actions
export const useApproveRejectApproval = (onSuccess?: () => void) => {
  return usePostData<ApprovalResponse, ApprovalActionPayload>({
    url: "/api/approvals/action",
    refetchQueries: [APPROVALS_QUERY],
    onSuccess: () => {
      if (onSuccess) {
        onSuccess();
      }
    },
  });
};

// Get All Approvals
export interface ApprovalsListResponse {
  list: Approval[];
  totalCount: number;
  stats: ApprovalStats;
}

export const useGetAllApprovals = (
  params: IListParams,
  options?: { enabled?: boolean }
) => {
  const query = useFetchData<ApprovalsListResponse>({
    url: APPROVALS_QUERY,
    params,
    enabled: options?.enabled ?? true,
  });

  return {
    ...query,
    data: query.data?.list,
    allApprovals: query.data?.list ?? [],
    totalCount: query.data?.totalCount ?? 0,
    stats: query.data?.stats,
    isLoading: query.isLoading,
    error: query.error,
  };
};

// Get Approval Stats
export const useGetApprovalStats = (options?: { enabled?: boolean }) => {
  return useFetchData<ApprovalStats>({
    url: "/api/approvals/stats",
    enabled: options?.enabled ?? true,
  });
};

// Workflow Management
export const useCreateApprovalWorkflow = (onSuccess?: () => void) => {
  return usePostData<ApprovalWorkflowResponse, ApprovalWorkflowPayload>({
    url: "/api/approval-workflows",
    refetchQueries: [APPROVAL_WORKFLOWS_QUERY],
    onSuccess: () => {
      if (onSuccess) {
        onSuccess();
      }
    },
  });
};

export const useUpdateApprovalWorkflow = (
  id: string,
  onSuccess?: () => void
) => {
  return usePatchData<ApprovalWorkflowResponse, ApprovalWorkflowPayload>({
    url: `/api/approval-workflows/${id}`,
    refetchQueries: [APPROVAL_WORKFLOWS_QUERY],
    onSuccess: () => {
      if (onSuccess) {
        onSuccess();
      }
    },
  });
};

export const useDeleteApprovalWorkflow = (
  id: string,
  onSuccess?: () => void
) => {
  return useDeleteData({
    url: `/api/approval-workflows/${id}`,
    refetchQueries: [APPROVAL_WORKFLOWS_QUERY],
    onSuccess: () => {
      if (onSuccess) {
        onSuccess();
      }
    },
  });
};

export interface ApprovalWorkflowsListResponse {
  list: ApprovalWorkflow[];
  totalCount: number;
}

export const useGetAllApprovalWorkflows = (
  params: IListParams,
  options?: { enabled?: boolean }
) => {
  const query = useFetchData<ApprovalWorkflowsListResponse>({
    url: APPROVAL_WORKFLOWS_QUERY,
    params,
    enabled: options?.enabled ?? true,
  });

  return {
    ...query,
    data: query.data?.list,
    allWorkflows: query.data?.list ?? [],
    totalCount: query.data?.totalCount ?? 0,
    isLoading: query.isLoading,
    error: query.error,
  };
};
