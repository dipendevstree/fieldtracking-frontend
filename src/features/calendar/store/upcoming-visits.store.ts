import { create } from 'zustand'

// Define the dialog types
type DialogType = 'add' | 'edit' | 'delete' | null

// Define the territory interface
interface UpcomingVisit {
  id?: string
  name: string
  createdAt?: string
  updatedAt?: string
}

// Define the store interface
interface UserUpcomingVisitStoreState {
  open: DialogType
  setOpen: (open: DialogType) => void
  currentRow: UpcomingVisit | null
  setCurrentRow: (row: UpcomingVisit | null) => void
}
// Create the Zustand store
export const userUpcomingVisitStoreState = create<UserUpcomingVisitStoreState>(
  (set) => ({
    open: null,
    setOpen: (open) => set({ open }),
    currentRow: null,
    setCurrentRow: (row) => set({ currentRow: row }),
  })
)
