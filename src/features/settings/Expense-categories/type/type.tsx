export interface ExpenseCategory {
  categoryId: string
  categoryName: string
  categoryType: 'mileage' | 'per-diem' | 'fixed-amount' | 'percentage' | 'custom'
  defaultLimit: number
  limitUnit: 'per-mile' | 'per-day' | 'per-meal' | 'per-trip' | 'fixed'
  requiresReceipt: boolean
  isActive: boolean
  description?: string
  createdAt?: string
  updatedAt?: string
}

export interface PerDiemSettings {
  breakfastAllowance: number
  lunchAllowance: number
  dinnerAllowance: number
  totalDailyLimit: number
  createdAt?: string
  updatedAt?: string
}

export interface CategorySettings {
  perDiemSettings: PerDiemSettings
  globalSettings: {
    defaultReceiptRequired: boolean
    autoApprovalLimit: number
    maxExpenseAmount: number
  }
}
