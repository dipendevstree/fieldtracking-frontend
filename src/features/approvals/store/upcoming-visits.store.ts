import { create } from 'zustand'

// Define the dialog types
type DialogType = 'add' | 'edit' | 'delete' | 'action' | null

// Define the store interface
interface UserUpcomingVisitStoreState {
  open: DialogType
  setOpen: (open: DialogType) => void
  currentRow: any | null
  setCurrentRow: (row: any | null) => void,
  selectedIds: Set<string> | null;
  setSelectedIds: (ids: Set<string>) => void,
}
// Create the Zustand store
export const userUpcomingVisitStoreState = create<UserUpcomingVisitStoreState>(
  (set) => ({
    open: null,
    setOpen: (open) => set({ open }),
    currentRow: null,
    setCurrentRow: (row) => set({ currentRow: row }),
    selectedIds: null,
    setSelectedIds: (ids: Set<string>) => set({ selectedIds: ids }),
  })
)
