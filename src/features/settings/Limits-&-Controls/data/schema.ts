import { z } from 'zod'

// Schema for expense limits
export const expenseLimitFormSchema = z.object({
  tierkey: z.string().min(1, 'Tier is required'),
  expenseCategoryId: z.string().min(1, 'Expense category is required'),
  dailyLimit: z.coerce.number().min(0, 'Daily limit must be 0 or greater'),
  monthlyLimit: z.coerce.number().min(0, 'Monthly limit must be 0 or greater'),
  isActive: z.boolean(),
})

// Schema for limits controls configuration
export const limitsControlsConfigFormSchema = z.object({
  expenseLimits: z.array(expenseLimitFormSchema),
})

export type TExpenseLimitFormSchema = z.infer<typeof expenseLimitFormSchema>
export type TLimitsControlsConfigFormSchema = z.infer<typeof limitsControlsConfigFormSchema>
