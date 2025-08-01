import { z } from 'zod'

// Schema for general settings
export const generalSettingsFormSchema = z.object({
  companyInformation: z.object({
    companyName: z.string().min(1, 'Company name is required'),
    defaultTimezone: z.string().min(1, 'Default timezone is required'),
  }),
  currencyAndFormatting: z.object({
    defaultCurrency: z.string().min(1, 'Default currency is required'),
    dateFormat: z.string().min(1, 'Date format is required'),
    distanceUnit: z.string().min(1, 'Distance unit is required'),
  }),
  securitySettings: z.object({
    requireTwoFactorAuth: z.boolean(),
    autoLogoutOnInactivity: z.boolean(),
    sessionTimeoutMinutes: z.number().min(1, 'Session timeout must be at least 1 minute'),
  }),
})

// Schema for company information
export const companyInfoFormSchema = z.object({
  companyName: z.string().min(1, 'Company name is required'),
  defaultTimezone: z.string().min(1, 'Default timezone is required'),
  contactEmail: z.string().email('Invalid email address').optional().or(z.literal('')),
  contactPhone: z.string().optional(),
  address: z.string().optional(),
  website: z.string().url('Invalid website URL').optional().or(z.literal('')),
})

// Schema for system preferences
export const systemPreferencesFormSchema = z.object({
  defaultCurrency: z.string().min(1, 'Default currency is required'),
  dateFormat: z.string().min(1, 'Date format is required'),
  distanceUnit: z.string().min(1, 'Distance unit is required'),
  language: z.string().min(1, 'Language is required'),
  theme: z.enum(['light', 'dark', 'auto'], {
    required_error: 'Theme is required',
  }),
})

export type TGeneralSettingsFormSchema = z.infer<typeof generalSettingsFormSchema>
export type TCompanyInfoFormSchema = z.infer<typeof companyInfoFormSchema>
export type TSystemPreferencesFormSchema = z.infer<typeof systemPreferencesFormSchema>
