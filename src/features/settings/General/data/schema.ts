import { TIER } from '@/data/app.data';
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
  contactEmail: z.string().min(1, 'Contact email is required').email('Invalid email address'),
  contactPhone: z.string().min(1, 'Contact phone is required'),
  address: z.string().min(1, 'Address is required'),
  website: z.string().min(1, 'Website is required').url('Invalid website URL'),
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

const singleFixedDayTierExpenseSchema = z
  .object({
    fixedDayExpenseId: z.string().optional(),
    tierKey: z.nativeEnum(TIER),
    dailyExpense: z.string().min(1, "Amount is required.")
  });

// Schema for a single approval level
export const fixedDayTierExpenseSchema = z.object({
  fixedDayTierExpenseList: z
    .array(singleFixedDayTierExpenseSchema)
    .min(1, "At least one fixed day expense is required."),
});

export type FixedDayExpenseForm = z.infer<typeof fixedDayTierExpenseSchema>;
export type TGeneralSettingsFormSchema = z.infer<typeof generalSettingsFormSchema>
export type TCompanyInfoFormSchema = z.infer<typeof companyInfoFormSchema>
export type TSystemPreferencesFormSchema = z.infer<typeof systemPreferencesFormSchema>
