import { create } from 'zustand'
import { ExpenseCategory, PerDiemSettings, CategorySettings } from '../type/type'

// Define the dialog types
type DialogType = 'add-category' | 'edit-category' | 'delete-category' | 
                  'settings' | 'per-diem-settings' | null

// Define the store interface
interface ExpenseCategoriesStoreState {
  // Dialog state
  open: DialogType
  setOpen: (open: DialogType) => void
  
  // Current row data
  currentCategory: ExpenseCategory | null
  setCurrentCategory: (category: ExpenseCategory | null) => void
  
  // Settings
  perDiemSettings: PerDiemSettings | null
  setPerDiemSettings: (settings: PerDiemSettings | null) => void
  
  categorySettings: CategorySettings | null
  setCategorySettings: (settings: CategorySettings | null) => void
  
  // Data lists
  expenseCategories: ExpenseCategory[]
  setExpenseCategories: (categories: ExpenseCategory[]) => void
}

// Create the Zustand store
export const useExpenseCategoriesStore = create<ExpenseCategoriesStoreState>((set) => ({
  // Dialog state
  open: null,
  setOpen: (open) => set({ open }),
  
  // Current row data
  currentCategory: null,
  setCurrentCategory: (category) => set({ currentCategory: category }),
  
  // Settings
  perDiemSettings: null,
  setPerDiemSettings: (settings) => set({ perDiemSettings: settings }),
  
  categorySettings: null,
  setCategorySettings: (settings) => set({ categorySettings: settings }),
  
  // Data lists
  expenseCategories: [],
  setExpenseCategories: (categories) => set({ expenseCategories: categories }),
})) 