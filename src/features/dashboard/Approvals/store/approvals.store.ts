import { create } from 'zustand'
import { ApprovalWorkflow } from '../type/type'

// Define the dialog types
type DialogType = 'approve' | 'reject' | 'view' | 'workflow' | 'delete' | null

// Define the store interface
interface ApprovalsStoreState {
  open: DialogType
  setOpen: (open: DialogType) => void
  currentApproval: any | null
  setCurrentApproval: (approval: any | null) => void
  currentWorkflow: ApprovalWorkflow | null
  setCurrentWorkflow: (workflow: ApprovalWorkflow | null) => void
  selectedApprovals: string[]
  setSelectedApprovals: (approvals: string[]) => void
  filters: {
    status?: string
    type?: string
    priority?: string
    dateFrom?: string
    dateTo?: string
    employeeId?: string
  }
  setFilters: (filters: Partial<ApprovalsStoreState['filters']>) => void
}

// Create the Zustand store
export const useApprovalsStore = create<ApprovalsStoreState>((set) => ({
  open: null,
  setOpen: (open) => set({ open }),
  currentApproval: null,
  setCurrentApproval: (approval) => set({ currentApproval: approval }),
  currentWorkflow: null,
  setCurrentWorkflow: (workflow) => set({ currentWorkflow: workflow }),
  selectedApprovals: [],
  setSelectedApprovals: (approvals) => set({ selectedApprovals: approvals }),
  filters: {},
  setFilters: (filters) => set((state) => ({ 
    filters: { ...state.filters, ...filters } 
  })),
}))
