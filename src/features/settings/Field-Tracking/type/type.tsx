export interface FieldTrackingConfig {
  configId: string
  mapDisplaySettings: {
    showLiveLocationPins: boolean
    showRouteHistory: boolean
    showCustomerLocationPins: boolean
  }
  trackingIntervals: {
    locationUpdateFrequency: number // minutes
    geofenceRadius: number // meters
  }
  activityMonitoring: {
    autoCheckinAtCustomerLocations: boolean
    idleTimeDetection: boolean
    idleTimeThreshold: number // minutes
    longBreakThreshold: number // minutes
  }
  createdAt?: string
  updatedAt?: string
}

export interface TrackingRule {
  ruleId: string
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
  createdAt?: string
  updatedAt?: string
}

export interface GeofenceZone {
  zoneId: string
  zoneName: string
  coordinates: {
    lat: number
    lng: number
  }
  radius: number // meters
  isActive: boolean
  description?: string
  createdAt?: string
  updatedAt?: string
}
