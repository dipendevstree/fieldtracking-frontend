import API from '@/config/api/api'
import useFetchData from '@/hooks/use-fetch-data'
import usePostData from '@/hooks/use-post-data'
import useDeleteData from '@/hooks/use-delete-data'
import usePatchData from '@/hooks/use-patch-data'
import { ExpenseLimit, LocationAdjustment, ExpenseExpirySettings } from '../type/type'

const LIMITS_CONTROLS_QUERY = API.limitsControls.list

export interface IListParams {
  sort?: string
  limit: number
  page: number
  searchFor?: string
  [key: string]: unknown
}

// Expense Limits
export interface ExpenseLimitPayload {
  designation: string
  tierKey: string
  expenseCategoryId: string
  dailyLimit: number
  monthlyLimit: number
  isActive: boolean
}

export interface ExpenseLimitResponse {
  data: ExpenseLimit
  message: string
  statusCode: number
}

export const useCreateExpenseLimit = (onSuccess?: () => void) => {
  return usePostData<ExpenseLimitResponse, ExpenseLimitPayload>({
    url: API.limitsControls.expenseLimits.create,
    refetchQueries: [LIMITS_CONTROLS_QUERY],
    onSuccess: () => {
      if (onSuccess) {
        onSuccess()
      }
    },
    onError: (error) => {
      console.error('Error creating expense limit:', error)
    },
  })
}

export const useUpdateExpenseLimit = (id: string, onSuccess?: () => void) => {
  return usePatchData<ExpenseLimitResponse, ExpenseLimitPayload>({
    url: `${API.limitsControls.expenseLimits.update}/${id}`,
    refetchQueries: [LIMITS_CONTROLS_QUERY],
    onSuccess: () => {
      if (onSuccess) {
        onSuccess()
      }
    },
    onError: (error) => {
      console.error('Error updating expense limit:', error)
    },
  })
}

export const useDeleteExpenseLimit = (id: string, onSuccess?: () => void) => {
  return useDeleteData({
    url: id ? `${API.limitsControls.expenseLimits.delete}/${id}` : API.limitsControls.expenseLimits.delete,
    refetchQueries: [LIMITS_CONTROLS_QUERY],
    onSuccess: () => {
      if (onSuccess && id) onSuccess()
    },
    onError: (error) => {
      console.error('Error deleting expense limit:', error)
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
    url: API.limitsControls.locationAdjustments.create,
    refetchQueries: [LIMITS_CONTROLS_QUERY],
    onSuccess: () => {
      if (onSuccess) {
        onSuccess()
      }
    },
    onError: (error) => {
      console.error('Error creating location adjustment:', error)
    },
  })
}

export const useUpdateLocationAdjustment = (id: string, onSuccess?: () => void) => {
  return usePatchData<LocationAdjustmentResponse, LocationAdjustmentPayload>({
    url: `${API.limitsControls.locationAdjustments.update}/${id}`,
    refetchQueries: [LIMITS_CONTROLS_QUERY],
    onSuccess: () => {
      if (onSuccess) {
        onSuccess()
      }
    },
    onError: (error) => {
      console.error('Error updating location adjustment:', error)
    },
  })
}

export const useDeleteLocationAdjustment = (id: string, onSuccess?: () => void) => {
  return useDeleteData({
    url: id ? `${API.limitsControls.locationAdjustments.delete}/${id}` : API.limitsControls.locationAdjustments.delete,
    refetchQueries: [LIMITS_CONTROLS_QUERY],
    onSuccess: () => {
      if (onSuccess && id) onSuccess()
    },
    onError: (error) => {
      console.error('Error deleting location adjustment:', error)
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
    url: API.limitsControls.expirySettings.update,
    refetchQueries: [LIMITS_CONTROLS_QUERY],
    onSuccess: () => {
      if (onSuccess) {
        onSuccess()
      }
    },
    onError: (error) => {
      console.error('Error updating expiry settings:', error)
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
