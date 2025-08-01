import { z } from 'zod'

// Schema for field tracking configuration
export const fieldTrackingConfigFormSchema = z.object({
  mapDisplaySettings: z.object({
    showLiveLocationPins: z.boolean(),
    showRouteHistory: z.boolean(),
    showCustomerLocationPins: z.boolean(),
  }),
  trackingIntervals: z.object({
    locationUpdateFrequency: z.number().min(1, 'Location update frequency must be at least 1 minute'),
    geofenceRadius: z.number().min(10, 'Geofence radius must be at least 10 meters'),
  }),
  activityMonitoring: z.object({
    autoCheckinAtCustomerLocations: z.boolean(),
    idleTimeDetection: z.boolean(),
    idleTimeThreshold: z.number().min(5, 'Idle time threshold must be at least 5 minutes'),
    longBreakThreshold: z.number().min(10, 'Long break threshold must be at least 10 minutes'),
  }),
})

// Schema for tracking rules
export const trackingRuleFormSchema = z.object({
  ruleName: z.string().min(1, 'Rule name is required'),
  ruleType: z.enum(['geofence', 'idle', 'break', 'route', 'custom'], {
    required_error: 'Rule type is required',
  }),
  isEnabled: z.boolean(),
  conditions: z.array(z.object({
    field: z.string().min(1, 'Field is required'),
    operator: z.enum(['equals', 'greater_than', 'less_than', 'contains', 'within_radius'], {
      required_error: 'Operator is required',
    }),
    value: z.any(),
  })),
  actions: z.array(z.object({
    type: z.enum(['notification', 'alert', 'auto_checkin', 'auto_checkout', 'report'], {
      required_error: 'Action type is required',
    }),
    target: z.string().min(1, 'Target is required'),
    message: z.string().optional(),
  })),
})

// Schema for geofence zones
export const geofenceZoneFormSchema = z.object({
  zoneName: z.string().min(1, 'Zone name is required'),
  coordinates: z.object({
    lat: z.number().min(-90).max(90, 'Latitude must be between -90 and 90'),
    lng: z.number().min(-180).max(180, 'Longitude must be between -180 and 180'),
  }),
  radius: z.number().min(10, 'Radius must be at least 10 meters'),
  isActive: z.boolean(),
  description: z.string().optional(),
})

export type TFieldTrackingConfigFormSchema = z.infer<typeof fieldTrackingConfigFormSchema>
export type TTrackingRuleFormSchema = z.infer<typeof trackingRuleFormSchema>
export type TGeofenceZoneFormSchema = z.infer<typeof geofenceZoneFormSchema>
