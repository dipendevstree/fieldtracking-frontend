export interface Approval {
  approvalId: string
  type: 'expense' | 'allowance' | 'travel' | 'other'
  employeeId: string
  employeeName: string
  amount: number
  currency: string
  description: string
  submittedDate: string
  status: 'pending' | 'approved' | 'rejected' | 'under_review'
  approverId?: string
  approverName?: string
  approvedDate?: string
  rejectionReason?: string
  category?: string
  attachments?: string[]
  priority: 'low' | 'medium' | 'high'
  createdAt?: string
  updatedAt?: string
}

export interface ApprovalWorkflow {
  workflowId: string
  name: string
  description: string
  type: 'expense' | 'allowance' | 'travel' | 'general'
  steps: ApprovalStep[]
  isActive: boolean
  createdAt?: string
  updatedAt?: string
}

export interface ApprovalStep {
  stepId: string
  order: number
  approverType: 'individual' | 'role' | 'hierarchy'
  approverId?: string
  roleId?: string
  minAmount?: number
  maxAmount?: number
  isRequired: boolean
}

export interface ApprovalStats {
  pending: number
  approved: number
  rejected: number
  total: number
  averageProcessingTime: number
}
