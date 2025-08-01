export interface Approver {
  approverId: string
  name: string
  role: string
  level: number
  amountRange: {
    min: number
    max: number
  }
  isRequired: boolean
  category?: string
  createdAt?: string
  updatedAt?: string
}

export interface ApprovalHierarchy {
  hierarchyId: string
  level: number
  amountRange: {
    min: number
    max: number
  }
  approverRole: string
  isRequired: boolean
  createdAt?: string
  updatedAt?: string
}

export interface CategoryApprover {
  categoryId: string
  categoryName: string
  approverRole: string
  isEnabled: boolean
  description?: string
  createdAt?: string
  updatedAt?: string
}

export interface ApprovalSettings {
  defaultFirstApprover: string
  autoApproveLimit: number
  createdAt?: string
  updatedAt?: string
}
