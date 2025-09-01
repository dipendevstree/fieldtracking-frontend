import { z } from 'zod'

// Schema for expense limits
export const expenseLimitFormSchema = z.object({
  designation: z.string().min(1, 'Designation is required'),
  tierkey: z.string().min(1, 'Tier is required'),
  category: z.string().min(1, 'Category is required'),
  dailyLimit: z.coerce.number().min(0, 'Daily limit must be 0 or greater'),
  monthlyLimit: z.coerce.number().min(0, 'Monthly limit must be 0 or greater'),
  isActive: z.boolean(),
})

// Schema for location adjustments
export const locationAdjustmentFormSchema = z.object({
  locationType: z.enum(['metropolitan', 'rural', 'suburban'], {
    required_error: 'Location type is required',
  }),
  adjustmentPercentage: z.number().min(-100, 'Adjustment percentage must be between -100 and 100').max(100, 'Adjustment percentage must be between -100 and 100'),
  isActive: z.boolean(),
})

// Schema for expense expiry settings
export const expenseExpirySettingsFormSchema = z.object({
  submissionDeadline: z.number().min(1, 'Submission deadline must be at least 1 day'),
  warningPeriod: z.number().min(1, 'Warning period must be at least 1 day'),
  autoRejectAfterExpiry: z.boolean(),
  allowLateSubmissions: z.boolean(),
})

// Schema for limits controls configuration
export const limitsControlsConfigFormSchema = z.object({
  expenseLimits: z.array(expenseLimitFormSchema),
  locationAdjustments: z.array(locationAdjustmentFormSchema),
  expirySettings: expenseExpirySettingsFormSchema,
})

export type TExpenseLimitFormSchema = z.infer<typeof expenseLimitFormSchema>
export type TLocationAdjustmentFormSchema = z.infer<typeof locationAdjustmentFormSchema>
export type TExpenseExpirySettingsFormSchema = z.infer<typeof expenseExpirySettingsFormSchema>
export type TLimitsControlsConfigFormSchema = z.infer<typeof limitsControlsConfigFormSchema>
