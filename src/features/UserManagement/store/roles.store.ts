import { create } from 'zustand'

// Define the dialog types
type DialogType = 'add' | 'edit' | 'delete' | null

// Define the filters interface
interface RoleFilters {
  search: string
  roleId: string
  }

// Define the generic store interface
interface StoreState<T> {
  open: DialogType
  setOpen: (open: DialogType) => void
  currentRow: T | null
  setCurrentRow: (row: T | null) => void
  filters: RoleFilters
  setFilters: (filters: Partial<RoleFilters>) => void
}

// Create the generic Zustand store
export const useRolesStore = create<StoreState<any>>((set) => ({
  open: null,
  setOpen: (open) => set({ open }),
  currentRow: null,
  setCurrentRow: (row) => set({ currentRow: row }),
  filters: {
    search: '',
    roleId: '',
  },
  setFilters: (newFilters) => set((state) => ({
    filters: { ...state.filters, ...newFilters }
  })),
}))
