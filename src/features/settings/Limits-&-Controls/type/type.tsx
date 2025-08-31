export interface ExpenseLimit {
  limitId: string
  designation: string
  tierkey: string
  category: string
  dailyLimit: number
  monthlyLimit: number
  isActive: boolean
  createdAt?: string
  updatedAt?: string
}

export interface LocationAdjustment {
  adjustmentId: string
  locationType: 'metropolitan' | 'rural' | 'suburban'
  adjustmentPercentage: number
  isActive: boolean
  createdAt?: string
  updatedAt?: string
}

export interface ExpenseExpirySettings {
  settingsId: string
  submissionDeadline: number // days
  warningPeriod: number // days
  autoRejectAfterExpiry: boolean
  allowLateSubmissions: boolean
  createdAt?: string
  updatedAt?: string
}

export interface LimitsControlsConfig {
  configId: string
  expenseLimits: ExpenseLimit[]
  locationAdjustments: LocationAdjustment[]
  expirySettings: ExpenseExpirySettings
  createdAt?: string
  updatedAt?: string
}
