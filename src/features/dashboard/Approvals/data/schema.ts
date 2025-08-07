import { z } from 'zod'

// Approval action schema
export const approvalActionSchema = z.object({
  approvalId: z.string().min(1, 'Approval ID is required'),
  action: z.enum(['approve', 'reject']),
  comment: z.string().optional(),
  rejectionReason: z.string().optional(),
})

// Approval workflow schema
export const approvalWorkflowSchema = z.object({
  name: z.string().min(1, 'Workflow name is required'),
  description: z.string().optional(),
  type: z.enum(['expense', 'allowance', 'travel', 'general']),
  steps: z.array(z.object({
    order: z.number().min(1),
    approverType: z.enum(['individual', 'role', 'hierarchy']),
    approverId: z.string().optional(),
    roleId: z.string().optional(),
    minAmount: z.number().optional(),
    maxAmount: z.number().optional(),
    isRequired: z.boolean(),
  })).min(1, 'At least one approval step is required'),
  isActive: z.boolean(),
})

// Approval filter schema
export const approvalFilterSchema = z.object({
  status: z.enum(['pending', 'approved', 'rejected', 'under_review']).optional(),
  type: z.enum(['expense', 'allowance', 'travel', 'other']).optional(),
  priority: z.enum(['low', 'medium', 'high']).optional(),
  dateFrom: z.string().optional(),
  dateTo: z.string().optional(),
  employeeId: z.string().optional(),
})

export type ApprovalActionSchema = z.infer<typeof approvalActionSchema>
export type ApprovalWorkflowSchema = z.infer<typeof approvalWorkflowSchema>
export type ApprovalFilterSchema = z.infer<typeof approvalFilterSchema>
