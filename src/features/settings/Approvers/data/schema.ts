import { z } from 'zod'

// Schema for approval hierarchy
export const hierarchyFormSchema = z.object({
  level: z.number().min(1, 'Level is required'),
  minAmount: z.number().min(0, 'Minimum amount must be 0 or greater'),
  maxAmount: z.number().min(0, 'Maximum amount must be 0 or greater'),
  approverRole: z.string().min(1, 'Approver role is required'),
  isRequired: z.boolean(),
})

// Schema for category-specific approvers
export const categoryApproverFormSchema = z.object({
  categoryName: z.string().min(1, 'Category name is required'),
  approverRole: z.string().min(1, 'Approver role is required'),
  isEnabled: z.boolean(),
  description: z.string().optional(),
})

// Schema for approval settings
export const approvalSettingsFormSchema = z.object({
  defaultFirstApprover: z.string().min(1, 'Default first approver is required'),
  autoApproveLimit: z.number().min(0, 'Auto-approve limit must be 0 or greater'),
})

export type THierarchyFormSchema = z.infer<typeof hierarchyFormSchema>
export type TCategoryApproverFormSchema = z.infer<typeof categoryApproverFormSchema>
export type TApprovalSettingsFormSchema = z.infer<typeof approvalSettingsFormSchema>
