import { create } from 'zustand'
import { ExpenseLimit, LocationAdjustment, ExpenseExpirySettings, LimitsControlsConfig } from '../type/type'

// Define the dialog types
type DialogType = 'add-limit' | 'edit-limit' | 'delete-limit' | 
                  'add-adjustment' | 'edit-adjustment' | 'delete-adjustment' | 
                  'edit-expiry-settings' | null

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
  
  // Data lists
  expenseLimits: [],
  setExpenseLimits: (limits) => set({ expenseLimits: limits }),
  
  locationAdjustments: [],
  setLocationAdjustments: (adjustments) => set({ locationAdjustments: adjustments }),
  
  expirySettings: null,
  setExpirySettings: (settings) => set({ expirySettings: settings }),
  
  // Configuration
  limitsControlsConfig: null,
  setLimitsControlsConfig: (config) => set({ limitsControlsConfig: config }),
}))
