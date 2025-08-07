import { create } from 'zustand'
import { SalesRep, RecentActivity } from '../type/type'

// Define the dialog types
type DialogType = 'view-user' | 'view-activity' | 'view-performance' | 'settings' | null

// Define the store interface
interface OverviewStoreState {
  open: DialogType
  setOpen: (open: DialogType) => void
  
  // Current data
  currentUser: SalesRep | null
  setCurrentUser: (user: SalesRep | null) => void
  
  currentActivity: RecentActivity | null
  setCurrentActivity: (activity: RecentActivity | null) => void
  
  // Dashboard state
  selectedTimeRange: 'today' | 'week' | 'month' | 'quarter'
  setSelectedTimeRange: (range: 'today' | 'week' | 'month' | 'quarter') => void
  
  // Filters
  filters: {
    status?: string
    roleId?: string
    territoryId?: string
    dateFrom?: string
    dateTo?: string
    searchFor?: string
  }
  setFilters: (filters: Partial<OverviewStoreState['filters']>) => void
  
  // Refresh state
  isRefreshing: boolean
  setIsRefreshing: (refreshing: boolean) => void
}

// Create the Zustand store
export const useOverviewStore = create<OverviewStoreState>((set) => ({
  open: null,
  setOpen: (open) => set({ open }),
  
  currentUser: null,
  setCurrentUser: (user) => set({ currentUser: user }),
  
  currentActivity: null,
  setCurrentActivity: (activity) => set({ currentActivity: activity }),
  
  selectedTimeRange: 'today',
  setSelectedTimeRange: (range) => set({ selectedTimeRange: range }),
  
  filters: {},
  setFilters: (filters) => set((state) => ({ 
    filters: { ...state.filters, ...filters } 
  })),
  
  isRefreshing: false,
  setIsRefreshing: (refreshing) => set({ isRefreshing: refreshing }),
}))
