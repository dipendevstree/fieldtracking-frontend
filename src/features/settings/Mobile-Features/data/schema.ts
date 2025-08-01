import { z } from 'zod'

// Schema for mobile features configuration
export const mobileFeaturesConfigFormSchema = z.object({
  scheduleAndReports: z.object({
    allowScheduleViewing: z.boolean(),
    allowVisitSummaryAccess: z.boolean(),
    allowExpenseReportAccess: z.boolean(),
  }),
  cameraAndPhoto: z.object({
    enableSelfieCheckin: z.boolean(),
    allowPhotoCapture: z.boolean(),
    allowReceiptPhotos: z.boolean(),
    photoQuality: z.enum(['low', 'medium', 'high'], {
      required_error: 'Photo quality is required',
    }),
    maxPhotosPerVisit: z.number().min(1, 'Max photos must be at least 1').max(20, 'Max photos cannot exceed 20'),
  }),
  offlineCapabilities: z.object({
    enableOfflineMode: z.boolean(),
    autoSyncWhenOnline: z.boolean(),
    syncFrequency: z.number().min(1, 'Sync frequency must be at least 1 minute').max(1440, 'Sync frequency cannot exceed 24 hours'),
  }),
})

// Schema for mobile permissions
export const mobilePermissionFormSchema = z.object({
  permissionName: z.string().min(1, 'Permission name is required'),
  isEnabled: z.boolean(),
  description: z.string().optional(),
})

// Schema for mobile feature settings
export const mobileFeatureSettingsFormSchema = z.object({
  featureName: z.string().min(1, 'Feature name is required'),
  isEnabled: z.boolean(),
  configuration: z.record(z.any()),
})

export type TMobileFeaturesConfigFormSchema = z.infer<typeof mobileFeaturesConfigFormSchema>
export type TMobilePermissionFormSchema = z.infer<typeof mobilePermissionFormSchema>
export type TMobileFeatureSettingsFormSchema = z.infer<typeof mobileFeatureSettingsFormSchema>
