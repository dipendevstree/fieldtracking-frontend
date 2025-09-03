export interface ExpenseLimit {
  limitId: string
  designation: string
  tierKey: string
  expenseCategoryId: string
  dailyLimit: number
  monthlyLimit: number
  isActive: boolean
  createdAt?: string
  updatedAt?: string
}

export interface LimitsControlsConfig {
  configId: string
  expenseLimits: ExpenseLimit[]
  createdAt?: string
  updatedAt?: string
}
