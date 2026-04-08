import { create } from 'zustand'

// Define the dialog types
type DialogType = 'add' | 'edit' | 'delete' | null

// Define the Customer Type interface
interface CustomerType {
  customerTypeId: string
  typeName: string
  createdAt?: string
  updatedAt?: string
}

// Define the store interface
interface CustomerTypeStoreState {
  open: DialogType
  setOpen: (open: DialogType) => void
  currentRow: CustomerType | null
  setCurrentRow: (row: CustomerType | null) => void
}

// Create the Zustand store
export const useCustomerTypeStore = create<CustomerTypeStoreState>((set) => ({
  open: null,
  setOpen: (open) => set({ open }),
  currentRow: null,
  setCurrentRow: (row) => set({ currentRow: row }),
}))
