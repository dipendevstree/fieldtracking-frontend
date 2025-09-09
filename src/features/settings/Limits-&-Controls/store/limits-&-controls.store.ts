import { create } from 'zustand'
import { ExpenseLimit } from '../type/type'

// Define the dialog types
type DialogType = 'add-limit' | 'edit-limit' | 'delete-limit' | null

// Define the store interface
interface LimitsControlsStoreState {
  open: DialogType
  setOpen: (open: DialogType) => void
  currentLimit: ExpenseLimit | null
  setCurrentLimit: (limit: ExpenseLimit | null) => void
}

// Create the Zustand store
export const useLimitsControlsStore = create<LimitsControlsStoreState>((set) => ({
  open: null,
  setOpen: (open) => set({ open }),
  currentLimit: null,
  setCurrentLimit: (limit) => set({ currentLimit: limit }),
}))
