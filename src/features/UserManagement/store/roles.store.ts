import { create } from 'zustand'

// Define the dialog types
type DialogType = 'add-role' | 'edit' | 'viewPermissions' | null

// Define the generic store interface
interface StoreState<T> {
  open: DialogType
  setOpen: (open: DialogType) => void
  currentRow: T | null
  setCurrentRow: (row: T | null) => void
}

// Create the generic Zustand store
export const useRolesStore = create<StoreState<any>>((set) => ({
  open: null,
  setOpen: (open) => set({ open }),
  currentRow: null,
  setCurrentRow: (row) => set({ currentRow: row }),
}))
