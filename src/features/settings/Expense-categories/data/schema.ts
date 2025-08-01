import { z } from 'zod'

// Schema for expense category
export const expenseCategoryFormSchema = z.object({
  categoryName: z.string().min(1, 'Category name is required'),
  categoryType: z.enum(['mileage', 'per-diem', 'fixed-amount', 'percentage', 'custom'], {
    required_error: 'Category type is required',
  }),
  defaultLimit: z.number().min(0, 'Default limit must be 0 or greater'),
  limitUnit: z.enum(['per-mile', 'per-day', 'per-meal', 'per-trip', 'fixed'], {
    required_error: 'Limit unit is required',
  }),
  requiresReceipt: z.boolean(),
  isActive: z.boolean(),
  description: z.string().optional(),
})

// Schema for per diem settings
export const perDiemSettingsFormSchema = z.object({
  breakfastAllowance: z.number().min(0, 'Breakfast allowance must be 0 or greater'),
  lunchAllowance: z.number().min(0, 'Lunch allowance must be 0 or greater'),
  dinnerAllowance: z.number().min(0, 'Dinner allowance must be 0 or greater'),
  totalDailyLimit: z.number().min(0, 'Total daily limit must be 0 or greater'),
})

// Schema for category settings
export const categorySettingsFormSchema = z.object({
  perDiemSettings: perDiemSettingsFormSchema,
  globalSettings: z.object({
    defaultReceiptRequired: z.boolean(),
    autoApprovalLimit: z.number().min(0, 'Auto approval limit must be 0 or greater'),
    maxExpenseAmount: z.number().min(0, 'Max expense amount must be 0 or greater'),
  }),
})

export type TExpenseCategoryFormSchema = z.infer<typeof expenseCategoryFormSchema>
export type TPerDiemSettingsFormSchema = z.infer<typeof perDiemSettingsFormSchema>
export type TCategorySettingsFormSchema = z.infer<typeof categorySettingsFormSchema>
