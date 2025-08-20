import { create } from 'zustand'
import { ExpenseLimit, LocationAdjustment, ExpenseExpirySettings, LimitsControlsConfig } from '../type/type'

// Define the dialog types
type DialogType = 'add-limit' | 'edit-limit' | 'delete-limit' | 
                  'add-adjustment' | 'edit-adjustment' | 'delete-adjustment' | 
                  'edit-expiry-settings' | null

// Mock data for development
const mockExpenseLimits: ExpenseLimit[] = [
  {
    limitId: '1',
    designation: 'Junior Sales Rep',
    dailyLimit: 50,
    monthlyLimit: 1000,
    travelLimit: 0.45,
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    limitId: '2',
    designation: 'Senior Sales Rep',
    dailyLimit: 75,
    monthlyLimit: 1500,
    travelLimit: 0.50,
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    limitId: '3',
    designation: 'Sales Manager',
    dailyLimit: 100,
    monthlyLimit: 2500,
    travelLimit: 0.60,
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
]

const mockLocationAdjustments: LocationAdjustment[] = [
  {
    adjustmentId: '1',
    locationType: 'metropolitan',
    adjustmentPercentage: 15,
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    adjustmentId: '2',
    locationType: 'suburban',
    adjustmentPercentage: 5,
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    adjustmentId: '3',
    locationType: 'rural',
    adjustmentPercentage: -10,
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
]

const mockExpirySettings: ExpenseExpirySettings = {
  settingsId: '1',
  submissionDeadline: 30,
  warningPeriod: 7,
  autoRejectAfterExpiry: true,
  allowLateSubmissions: false,
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z',
}

// Define the store interface
interface LimitsControlsStoreState {
  // Dialog state
  open: DialogType
  setOpen: (open: DialogType) => void
  
  // Current data
  currentLimit: ExpenseLimit | null
  setCurrentLimit: (limit: ExpenseLimit | null) => void
  
  currentAdjustment: LocationAdjustment | null
  setCurrentAdjustment: (adjustment: LocationAdjustment | null) => void
  
  currentExpirySettings: ExpenseExpirySettings | null
  setCurrentExpirySettings: (settings: ExpenseExpirySettings | null) => void
  
  // Data lists
  expenseLimits: ExpenseLimit[]
  setExpenseLimits: (limits: ExpenseLimit[]) => void
  
  locationAdjustments: LocationAdjustment[]
  setLocationAdjustments: (adjustments: LocationAdjustment[]) => void
  
  expirySettings: ExpenseExpirySettings | null
  setExpirySettings: (settings: ExpenseExpirySettings | null) => void
  
  // Configuration
  limitsControlsConfig: LimitsControlsConfig | null
  setLimitsControlsConfig: (config: LimitsControlsConfig | null) => void
}

// Create the Zustand store
export const useLimitsControlsStore = create<LimitsControlsStoreState>((set) => ({
  // Dialog state
  open: null,
  setOpen: (open) => set({ open }),
  
  // Current data
  currentLimit: null,
  setCurrentLimit: (limit) => set({ currentLimit: limit }),
  
  currentAdjustment: null,
  setCurrentAdjustment: (adjustment) => set({ currentAdjustment: adjustment }),
  
  currentExpirySettings: null,
  setCurrentExpirySettings: (settings) => set({ currentExpirySettings: settings }),
  
  // Data lists - Initialize with mock data
  expenseLimits: mockExpenseLimits,
  setExpenseLimits: (limits) => set({ expenseLimits: limits }),
  
  locationAdjustments: mockLocationAdjustments,
  setLocationAdjustments: (adjustments) => set({ locationAdjustments: adjustments }),
  
  expirySettings: mockExpirySettings,
  setExpirySettings: (settings) => set({ expirySettings: settings }),
  
  // Configuration
  limitsControlsConfig: null,
  setLimitsControlsConfig: (config) => set({ limitsControlsConfig: config }),
}))
