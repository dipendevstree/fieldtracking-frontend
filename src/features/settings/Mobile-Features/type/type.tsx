export interface MobileFeaturesConfig {
  configId: string
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
    syncFrequency: number // minutes
  }
  createdAt?: string
  updatedAt?: string
}

export interface MobilePermission {
  permissionId: string
  permissionName: string
  isEnabled: boolean
  description?: string
  createdAt?: string
  updatedAt?: string
}

export interface MobileFeatureSettings {
  settingsId: string
  featureName: string
  isEnabled: boolean
  configuration: Record<string, any>
  createdAt?: string
  updatedAt?: string
}
