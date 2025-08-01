import API from '@/config/api/api'
import useFetchData from '@/hooks/use-fetch-data'
import usePostData from '@/hooks/use-post-data'
import useDeleteData from '@/hooks/use-delete-data'
import usePatchData from '@/hooks/use-patch-data'
import { MobileFeaturesConfig, MobilePermission, MobileFeatureSettings } from '../type/type'

const MOBILE_FEATURES_QUERY = 'mobile-features/list'

export interface IListParams {
  sort?: string
  limit: number
  page: number
  [key: string]: unknown
}

// Mobile Features Configuration
export interface MobileFeaturesConfigPayload {
  scheduleAndReports: {
    allowScheduleViewing: boolean
    allowVisitSummaryAccess: boolean
    allowExpenseReportAccess: boolean
  }
  cameraAndPhoto: {
    enableSelfieCheckin: boolean
    allowPhotoCapture: boolean
    allowReceiptPhotos: boolean
    photoQuality: 'low' | 'medium' | 'high'
    maxPhotosPerVisit: number
  }
  offlineCapabilities: {
    enableOfflineMode: boolean
    autoSyncWhenOnline: boolean
    syncFrequency: number
  }
}

export interface MobileFeaturesConfigResponse {
  data: MobileFeaturesConfig
  message: string
  statusCode: number
}

export const useUpdateMobileFeaturesConfig = (onSuccess?: () => void) => {
  return usePatchData<MobileFeaturesConfigResponse, MobileFeaturesConfigPayload>({
    url: 'mobile-features/config/update',
    refetchQueries: [MOBILE_FEATURES_QUERY],
    onSuccess: () => {
      if (onSuccess) {
        onSuccess()
      }
    },
  })
}

// Mobile Permissions
export interface MobilePermissionPayload {
  permissionName: string
  isEnabled: boolean
  description?: string
}

export interface MobilePermissionResponse {
  data: MobilePermission
  message: string
  statusCode: number
}

export const useCreateMobilePermission = (onSuccess?: () => void) => {
  return usePostData<MobilePermissionResponse, MobilePermissionPayload>({
    url: 'mobile-features/permissions/create',
    refetchQueries: [MOBILE_FEATURES_QUERY],
    onSuccess: () => {
      if (onSuccess) {
        onSuccess()
      }
    },
  })
}

export const useUpdateMobilePermission = (id: string, onSuccess?: () => void) => {
  return usePatchData<MobilePermissionResponse, MobilePermissionPayload>({
    url: `mobile-features/permissions/update/${id}`,
    refetchQueries: [MOBILE_FEATURES_QUERY],
    onSuccess: () => {
      if (onSuccess) {
        onSuccess()
      }
    },
  })
}

export const useDeleteMobilePermission = (id: string, onSuccess?: () => void) => {
  return useDeleteData({
    url: id ? `mobile-features/permissions/delete/${id}` : 'mobile-features/permissions/delete',
    refetchQueries: [MOBILE_FEATURES_QUERY],
    onSuccess: () => {
      if (onSuccess && id) onSuccess()
    },
  })
}

// Mobile Feature Settings
export interface MobileFeatureSettingsPayload {
  featureName: string
  isEnabled: boolean
  configuration: Record<string, any>
}

export interface MobileFeatureSettingsResponse {
  data: MobileFeatureSettings
  message: string
  statusCode: number
}

export const useCreateMobileFeatureSettings = (onSuccess?: () => void) => {
  return usePostData<MobileFeatureSettingsResponse, MobileFeatureSettingsPayload>({
    url: 'mobile-features/settings/create',
    refetchQueries: [MOBILE_FEATURES_QUERY],
    onSuccess: () => {
      if (onSuccess) {
        onSuccess()
      }
    },
  })
}

export const useUpdateMobileFeatureSettings = (id: string, onSuccess?: () => void) => {
  return usePatchData<MobileFeatureSettingsResponse, MobileFeatureSettingsPayload>({
    url: `mobile-features/settings/update/${id}`,
    refetchQueries: [MOBILE_FEATURES_QUERY],
    onSuccess: () => {
      if (onSuccess) {
        onSuccess()
      }
    },
  })
}

export const useDeleteMobileFeatureSettings = (id: string, onSuccess?: () => void) => {
  return useDeleteData({
    url: id ? `mobile-features/settings/delete/${id}` : 'mobile-features/settings/delete',
    refetchQueries: [MOBILE_FEATURES_QUERY],
    onSuccess: () => {
      if (onSuccess && id) onSuccess()
    },
  })
}

// Data fetching hooks
export interface MobileFeaturesListResponse {
  config: MobileFeaturesConfig
  permissions: MobilePermission[]
  features: MobileFeatureSettings[]
  totalCount: number
}

export const useGetMobileFeaturesData = (
  params: IListParams,
  options?: { enabled?: boolean }
) => {
  const query = useFetchData<MobileFeaturesListResponse>({
    url: MOBILE_FEATURES_QUERY,
    params,
    enabled: options?.enabled ?? true,
  })

  return {
    ...query,
    mobileFeaturesConfig: query.data?.config ?? null,
    mobilePermissions: query.data?.permissions ?? [],
    mobileFeatures: query.data?.features ?? [],
    totalCount: query.data?.totalCount ?? 0,
    isLoading: query.isLoading,
    error: query.error,
  }
}
