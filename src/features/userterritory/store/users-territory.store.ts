import { create } from 'zustand'

// Define the dialog types
type DialogType = 'add' | 'edit' | 'delete' | null

// Define the territory interface
interface Territory {
  id?: string
  name: string
  createdAt?: string
  updatedAt?: string
}

// Define the store interface
interface UserTerritoryStoreState {
  open: DialogType
  setOpen: (open: DialogType) => void
  currentRow: Territory | null
  setCurrentRow: (row: Territory | null) => void
}

// Create the Zustand store
export const useUserTerritoryStore = create<UserTerritoryStoreState>((set) => ({
  open: null,
  setOpen: (open) => set({ open }),
  currentRow: null,
  setCurrentRow: (row) => set({ currentRow: row }),
}))
