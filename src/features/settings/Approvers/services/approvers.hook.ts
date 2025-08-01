// import API from '@/config/api/api'
import useFetchData from '@/hooks/use-fetch-data'
import usePostData from '@/hooks/use-post-data'
import useDeleteData from '@/hooks/use-delete-data'
import usePatchData from '@/hooks/use-patch-data'
import { ApprovalHierarchy, CategoryApprover, ApprovalSettings } from '../type/type'

const APPROVERS_QUERY = 'approvers/list'

export interface IListParams {
  sort?: string
  limit: number
  page: number
  [key: string]: unknown
}

// Approval Hierarchy
export interface ApprovalHierarchyPayload {
  level: number
  minAmount: number
  maxAmount: number
  approverRole: string
  isRequired: boolean
}

export interface ApprovalHierarchyResponse {
  data: ApprovalHierarchy
  message: string
  statusCode: number
}

export const useCreateApprovalHierarchy = (onSuccess?: () => void) => {
  return usePostData<ApprovalHierarchyResponse, ApprovalHierarchyPayload>({
    url: 'approvers/hierarchy/create',
    refetchQueries: [APPROVERS_QUERY],
    onSuccess: () => {
      if (onSuccess) {
        onSuccess()
      }
    },
  })
}

export const useUpdateApprovalHierarchy = (id: string, onSuccess?: () => void) => {
  return usePatchData<ApprovalHierarchyResponse, ApprovalHierarchyPayload>({
    url: `approvers/hierarchy/update/${id}`,
    refetchQueries: [APPROVERS_QUERY],
    onSuccess: () => {
      if (onSuccess) {
        onSuccess()
      }
    },
  })
}

export const useDeleteApprovalHierarchy = (id: string, onSuccess?: () => void) => {
  return useDeleteData({
    url: id ? `approvers/hierarchy/delete/${id}` : 'approvers/hierarchy/delete',
    refetchQueries: [APPROVERS_QUERY],
    onSuccess: () => {
      if (onSuccess && id) onSuccess()
    },
  })
}

// Category Approvers
export interface CategoryApproverPayload {
  categoryName: string
  approverRole: string
  isEnabled: boolean
  description?: string
}

export interface CategoryApproverResponse {
  data: CategoryApprover
  message: string
  statusCode: number
}

export const useCreateCategoryApprover = (onSuccess?: () => void) => {
  return usePostData<CategoryApproverResponse, CategoryApproverPayload>({
    url: 'approvers/category/create',
    refetchQueries: [APPROVERS_QUERY],
    onSuccess: () => {
      if (onSuccess) {
        onSuccess()
      }
    },
  })
}

export const useUpdateCategoryApprover = (id: string, onSuccess?: () => void) => {
  return usePatchData<CategoryApproverResponse, CategoryApproverPayload>({
    url: `approvers/category/update/${id}`,
    refetchQueries: [APPROVERS_QUERY],
    onSuccess: () => {
      if (onSuccess) {
        onSuccess()
      }
    },
  })
}

export const useDeleteCategoryApprover = (id: string, onSuccess?: () => void) => {
  return useDeleteData({
    url: id ? `approvers/category/delete/${id}` : 'approvers/category/delete',
    refetchQueries: [APPROVERS_QUERY],
    onSuccess: () => {
      if (onSuccess && id) onSuccess()
    },
  })
}

// Approval Settings
export interface ApprovalSettingsPayload {
  defaultFirstApprover: string
  autoApproveLimit: number
}

export interface ApprovalSettingsResponse {
  data: ApprovalSettings
  message: string
  statusCode: number
}

export const useUpdateApprovalSettings = (onSuccess?: () => void) => {
  return usePatchData<ApprovalSettingsResponse, ApprovalSettingsPayload>({
    url: 'approvers/settings/update',
    refetchQueries: [APPROVERS_QUERY],
    onSuccess: () => {
      if (onSuccess) {
        onSuccess()
      }
    },
  })
}

// Data fetching hooks
export interface ApproversListResponse {
  hierarchy: ApprovalHierarchy[]
  categoryApprovers: CategoryApprover[]
  settings: ApprovalSettings
  totalCount: number
}

// export const useGetApproversData = (
//   params: IListParams,
//   options?: { enabled?: boolean }
// ) => {
//   const query = useFetchData<ApproversListResponse>({
//     url: APPROVERS_QUERY,
//     params,
//     enabled: options?.enabled ?? true,
//   })

//   return {
//     ...query,
//     approvalHierarchy: query.data?.hierarchy ?? [],
//     categoryApprovers: query.data?.categoryApprovers ?? [],
//     approvalSettings: query.data?.settings ?? null,
//     totalCount: query.data?.totalCount ?? 0,
//     isLoading: query.isLoading,
//     error: query.error,
//   }
// } 