import { create } from 'zustand'
import { ExpenseLimit, LimitsControlsConfig } from '../type/type'

// Define the dialog types
type DialogType = 'add-limit' | 'edit-limit' | 'delete-limit' | null

// No mock data - using API data only

// Define the store interface
interface LimitsControlsStoreState {
  // Dialog state
  open: DialogType
  setOpen: (open: DialogType) => void
  
  // Current data
  currentLimit: ExpenseLimit | null
  setCurrentLimit: (limit: ExpenseLimit | null) => void
  
  // Data lists
  expenseLimits: ExpenseLimit[]
  setExpenseLimits: (limits: ExpenseLimit[]) => void
  
  // Configuration
  limitsControlsConfig: LimitsControlsConfig | null
  setLimitsControlsConfig: (config: LimitsControlsConfig | null) => void
}

// Create the Zustand store
export const useLimitsControlsStore = create<LimitsControlsStoreState>((set) => ({
  // Dialog state
  open: null,
  setOpen: (open) => {
    console.log('Setting dialog open state:', open)
    set({ open })
  },
  
  // Current data
  currentLimit: null,
  setCurrentLimit: (limit) => {
    console.log('Setting current limit:', limit)
    set({ currentLimit: limit })
  },
  
  // Data lists - Initialize empty, will be populated by API
  expenseLimits: [],
  setExpenseLimits: (limits) => set({ expenseLimits: limits }),
  
  // Configuration
  limitsControlsConfig: null,
  setLimitsControlsConfig: (config) => set({ limitsControlsConfig: config }),
}))
