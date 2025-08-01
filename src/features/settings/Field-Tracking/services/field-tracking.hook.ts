
import useFetchData from '@/hooks/use-fetch-data'
import usePostData from '@/hooks/use-post-data'
import useDeleteData from '@/hooks/use-delete-data'
import usePatchData from '@/hooks/use-patch-data'
import { FieldTrackingConfig, TrackingRule, GeofenceZone } from '../type/type'

const FIELD_TRACKING_QUERY = 'field-tracking/list'

export interface IListParams {
  sort?: string
  limit: number
  page: number
  [key: string]: unknown
}

// Field Tracking Configuration
export interface FieldTrackingConfigPayload {
  mapDisplaySettings: {
    showLiveLocationPins: boolean
    showRouteHistory: boolean
    showCustomerLocationPins: boolean
  }
  trackingIntervals: {
    locationUpdateFrequency: number
    geofenceRadius: number
  }
  activityMonitoring: {
    autoCheckinAtCustomerLocations: boolean
    idleTimeDetection: boolean
    idleTimeThreshold: number
    longBreakThreshold: number
  }
}

export interface FieldTrackingConfigResponse {
  data: FieldTrackingConfig
  message: string
  statusCode: number
}

export const useUpdateFieldTrackingConfig = (onSuccess?: () => void) => {
  return usePatchData<FieldTrackingConfigResponse, FieldTrackingConfigPayload>({
    url: 'field-tracking/config/update',
    refetchQueries: [FIELD_TRACKING_QUERY],
    onSuccess: () => {
      if (onSuccess) {
        onSuccess()
      }
    },
  })
}

// Tracking Rules
export interface TrackingRulePayload {
  ruleName: string
  ruleType: 'geofence' | 'idle' | 'break' | 'route' | 'custom'
  isEnabled: boolean
  conditions: {
    field: string
    operator: 'equals' | 'greater_than' | 'less_than' | 'contains' | 'within_radius'
    value: any
  }[]
  actions: {
    type: 'notification' | 'alert' | 'auto_checkin' | 'auto_checkout' | 'report'
    target: string
    message?: string
  }[]
}

export interface TrackingRuleResponse {
  data: TrackingRule
  message: string
  statusCode: number
}

export const useCreateTrackingRule = (onSuccess?: () => void) => {
  return usePostData<TrackingRuleResponse, TrackingRulePayload>({
    url: 'field-tracking/rules/create',
    refetchQueries: [FIELD_TRACKING_QUERY],
    onSuccess: () => {
      if (onSuccess) {
        onSuccess()
      }
    },
  })
}

export const useUpdateTrackingRule = (id: string, onSuccess?: () => void) => {
  return usePatchData<TrackingRuleResponse, TrackingRulePayload>({
    url: `field-tracking/rules/update/${id}`,
    refetchQueries: [FIELD_TRACKING_QUERY],
    onSuccess: () => {
      if (onSuccess) {
        onSuccess()
      }
    },
  })
}

export const useDeleteTrackingRule = (id: string, onSuccess?: () => void) => {
  return useDeleteData({
    url: id ? `field-tracking/rules/delete/${id}` : 'field-tracking/rules/delete',
    refetchQueries: [FIELD_TRACKING_QUERY],
    onSuccess: () => {
      if (onSuccess && id) onSuccess()
    },
  })
}

// Geofence Zones
export interface GeofenceZonePayload {
  zoneName: string
  coordinates: {
    lat: number
    lng: number
  }
  radius: number
  isActive: boolean
  description?: string
}

export interface GeofenceZoneResponse {
  data: GeofenceZone
  message: string
  statusCode: number
}

export const useCreateGeofenceZone = (onSuccess?: () => void) => {
  return usePostData<GeofenceZoneResponse, GeofenceZonePayload>({
    url: 'field-tracking/zones/create',
    refetchQueries: [FIELD_TRACKING_QUERY],
    onSuccess: () => {
      if (onSuccess) {
        onSuccess()
      }
    },
  })
}

export const useUpdateGeofenceZone = (id: string, onSuccess?: () => void) => {
  return usePatchData<GeofenceZoneResponse, GeofenceZonePayload>({
    url: `field-tracking/zones/update/${id}`,
    refetchQueries: [FIELD_TRACKING_QUERY],
    onSuccess: () => {
      if (onSuccess) {
        onSuccess()
      }
    },
  })
}

export const useDeleteGeofenceZone = (id: string, onSuccess?: () => void) => {
  return useDeleteData({
    url: id ? `field-tracking/zones/delete/${id}` : 'field-tracking/zones/delete',
    refetchQueries: [FIELD_TRACKING_QUERY],
    onSuccess: () => {
      if (onSuccess && id) onSuccess()
    },
  })
}

// Data fetching hooks
export interface FieldTrackingListResponse {
  config: FieldTrackingConfig
  trackingRules: TrackingRule[]
  geofenceZones: GeofenceZone[]
  totalCount: number
}

export const useGetFieldTrackingData = (
  params: IListParams,
  options?: { enabled?: boolean }
) => {
  const query = useFetchData<FieldTrackingListResponse>({
    url: FIELD_TRACKING_QUERY,
    params,
    enabled: options?.enabled ?? true,
  })

  return {
    ...query,
    fieldTrackingConfig: query.data?.config ?? null,
    trackingRules: query.data?.trackingRules ?? [],
    geofenceZones: query.data?.geofenceZones ?? [],
    totalCount: query.data?.totalCount ?? 0,
    isLoading: query.isLoading,
    error: query.error,
  }
} 