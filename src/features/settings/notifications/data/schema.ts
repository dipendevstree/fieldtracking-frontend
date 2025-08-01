import { z } from 'zod'

// Schema for notification configuration
export const notificationConfigFormSchema = z.object({
  expenseNotifications: z.object({
    warnForExpiry: z.boolean(),
    unsubmittedReminders: z.boolean(),
    reminderFrequency: z.enum(['daily', 'weekly', 'monthly'], {
      required_error: 'Reminder frequency is required',
    }),
    reminderTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format (HH:MM)'),
  }),
  fieldActivityAlerts: z.object({
    geofenceAlerts: z.boolean(),
    inactivityAlerts: z.boolean(),
    checkinAlerts: z.boolean(),
    breakAlerts: z.boolean(),
  }),
  emailNotifications: z.object({
    sendVisitNotesEmail: z.boolean(),
    notificationEmail: z.string().email('Invalid email address'),
    emailFrequency: z.enum(['realtime', 'daily', 'weekly'], {
      required_error: 'Email frequency is required',
    }),
  }),
})

// Schema for notification rules
export const notificationRuleFormSchema = z.object({
  ruleName: z.string().min(1, 'Rule name is required'),
  ruleType: z.enum(['expense', 'field', 'email', 'system'], {
    required_error: 'Rule type is required',
  }),
  isEnabled: z.boolean(),
  conditions: z.record(z.any()),
  actions: z.record(z.any()),
})

// Schema for notification templates
export const notificationTemplateFormSchema = z.object({
  templateName: z.string().min(1, 'Template name is required'),
  templateType: z.enum(['email', 'sms', 'push', 'in-app'], {
    required_error: 'Template type is required',
  }),
  subject: z.string().optional(),
  body: z.string().min(1, 'Template body is required'),
  isActive: z.boolean(),
})

export type TNotificationConfigFormSchema = z.infer<typeof notificationConfigFormSchema>
export type TNotificationRuleFormSchema = z.infer<typeof notificationRuleFormSchema>
export type TNotificationTemplateFormSchema = z.infer<typeof notificationTemplateFormSchema>
