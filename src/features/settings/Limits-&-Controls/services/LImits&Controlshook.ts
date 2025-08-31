// import API from '@/config/api/api'
import useFetchData from '@/hooks/use-fetch-data'
import usePostData from '@/hooks/use-post-data'
import useDeleteData from '@/hooks/use-delete-data'
import usePatchData from '@/hooks/use-patch-data'
import { ExpenseLimit, LocationAdjustment, ExpenseExpirySettings } from '../type/type'

const LIMITS_CONTROLS_QUERY = 'limits-controls/list'

export interface IListParams {
  sort?: string
  limit: number
  page: number
  [key: string]: unknown
}

// Expense Limits
export interface ExpenseLimitPayload {
  designation: string
  tierkey: string
  category: string
  dailyLimit: number
  monthlyLimit: number
  travelLimit: number
  isActive: boolean
}

export interface ExpenseLimitResponse {
  data: ExpenseLimit
  message: string
  statusCode: number
}

export const useCreateExpenseLimit = (onSuccess?: () => void) => {
  return usePostData<ExpenseLimitResponse, ExpenseLimitPayload>({
    url: 'limits-controls/expense-limits/create',
    refetchQueries: [LIMITS_CONTROLS_QUERY],
    onSuccess: () => {
      if (onSuccess) {
        onSuccess()
      }
    },
  })
}

export const useUpdateExpenseLimit = (id: string, onSuccess?: () => void) => {
  return usePatchData<ExpenseLimitResponse, ExpenseLimitPayload>({
    url: `limits-controls/expense-limits/update/${id}`,
    refetchQueries: [LIMITS_CONTROLS_QUERY],
    onSuccess: () => {
      if (onSuccess) {
        onSuccess()
      }
    },
  })
}

export const useDeleteExpenseLimit = (id: string, onSuccess?: () => void) => {
  return useDeleteData({
    url: id ? `limits-controls/expense-limits/delete/${id}` : 'limits-controls/expense-limits/delete',
    refetchQueries: [LIMITS_CONTROLS_QUERY],
    onSuccess: () => {
      if (onSuccess && id) onSuccess()
    },
  })
}

// Location Adjustments
export interface LocationAdjustmentPayload {
  locationType: 'metropolitan' | 'rural' | 'suburban'
  adjustmentPercentage: number
  isActive: boolean
}

export interface LocationAdjustmentResponse {
  data: LocationAdjustment
  message: string
  statusCode: number
}

export const useCreateLocationAdjustment = (onSuccess?: () => void) => {
  return usePostData<LocationAdjustmentResponse, LocationAdjustmentPayload>({
    url: 'limits-controls/location-adjustments/create',
    refetchQueries: [LIMITS_CONTROLS_QUERY],
    onSuccess: () => {
      if (onSuccess) {
        onSuccess()
      }
    },
  })
}

export const useUpdateLocationAdjustment = (id: string, onSuccess?: () => void) => {
  return usePatchData<LocationAdjustmentResponse, LocationAdjustmentPayload>({
    url: `limits-controls/location-adjustments/update/${id}`,
    refetchQueries: [LIMITS_CONTROLS_QUERY],
    onSuccess: () => {
      if (onSuccess) {
        onSuccess()
      }
    },
  })
}

export const useDeleteLocationAdjustment = (id: string, onSuccess?: () => void) => {
  return useDeleteData({
    url: id ? `limits-controls/location-adjustments/delete/${id}` : 'limits-controls/location-adjustments/delete',
    refetchQueries: [LIMITS_CONTROLS_QUERY],
    onSuccess: () => {
      if (onSuccess && id) onSuccess()
    },
  })
}

// Expense Expiry Settings
export interface ExpenseExpirySettingsPayload {
  submissionDeadline: number
  warningPeriod: number
  autoRejectAfterExpiry: boolean
  allowLateSubmissions: boolean
}

export interface ExpenseExpirySettingsResponse {
  data: ExpenseExpirySettings
  message: string
  statusCode: number
}

export const useUpdateExpenseExpirySettings = (onSuccess?: () => void) => {
  return usePatchData<ExpenseExpirySettingsResponse, ExpenseExpirySettingsPayload>({
    url: 'limits-controls/expiry-settings/update',
    refetchQueries: [LIMITS_CONTROLS_QUERY],
    onSuccess: () => {
      if (onSuccess) {
        onSuccess()
      }
    },
  })
}

// Data fetching hooks
export interface LimitsControlsListResponse {
  expenseLimits: ExpenseLimit[]
  locationAdjustments: LocationAdjustment[]
  expirySettings: ExpenseExpirySettings
  totalCount: number
}

export const useGetLimitsControlsData = (
  params: IListParams,
  options?: { enabled?: boolean }
) => {
  const query = useFetchData<LimitsControlsListResponse>({
    url: LIMITS_CONTROLS_QUERY,
    params,
    enabled: options?.enabled ?? true,
  })

  return {
    ...query,
    expenseLimits: query.data?.expenseLimits ?? [],
    locationAdjustments: query.data?.locationAdjustments ?? [],
    expirySettings: query.data?.expirySettings ?? null,
    totalCount: query.data?.totalCount ?? 0,
    isLoading: query.isLoading,
    error: query.error,
  }
}
