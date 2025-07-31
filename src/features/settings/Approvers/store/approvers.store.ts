import { create } from 'zustand'
import { ApprovalHierarchy, CategoryApprover, ApprovalSettings } from '../type/type'

// Define the dialog types
type DialogType = 'add-hierarchy' | 'edit-hierarchy' | 'delete-hierarchy' | 
                  'add-category' | 'edit-category' | 'delete-category' | 
                  'settings' | null

// Define the store interface
interface ApproversStoreState {
  // Dialog state
  open: DialogType
  setOpen: (open: DialogType) => void
  
  // Current row data
  currentHierarchy: ApprovalHierarchy | null
  setCurrentHierarchy: (hierarchy: ApprovalHierarchy | null) => void
  
  currentCategory: CategoryApprover | null
  setCurrentCategory: (category: CategoryApprover | null) => void
  
  // Settings
  approvalSettings: ApprovalSettings | null
  setApprovalSettings: (settings: ApprovalSettings | null) => void
  
  // Data lists
  approvalHierarchy: ApprovalHierarchy[]
  setApprovalHierarchy: (hierarchy: ApprovalHierarchy[]) => void
  
  categoryApprovers: CategoryApprover[]
  setCategoryApprovers: (approvers: CategoryApprover[]) => void
}

// Create the Zustand store
// export const useApproversStore = create<ApproversStoreState>((set) => ({
//   // Dialog state
//   open: null,
//   setOpen: (open) => set({ open }),
  
//   // Current row data
//   currentHierarchy: null,
//   setCurrentHierarchy: (hierarchy) => set({ currentHierarchy: hierarchy }),
  
//   currentCategory: null,
//   setCurrentCategory: (category) => set({ currentCategory: category }),
  
//   // Settings
//   approvalSettings: null,
//   setApprovalSettings: (settings) => set({ approvalSettings: settings }),
  
//   // Data lists
//   approvalHierarchy: [],
//   setApprovalHierarchy: (hierarchy) => set({ approvalHierarchy: hierarchy }),
  
//   categoryApprovers: [],
//   setCategoryApprovers: (approvers) => set({ categoryApprovers: approvers }),
// })) 