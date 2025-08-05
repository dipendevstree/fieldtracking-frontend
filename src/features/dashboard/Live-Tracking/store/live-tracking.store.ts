import { create } from 'zustand'
import { LiveTrackingUser, TrackingSession, TrackingEvent } from '../type/type'

// Define the dialog types
type DialogType = 'view-user' | 'view-session' | 'view-events' | 'settings' | null

// Define the store interface
interface LiveTrackingStoreState {
  open: DialogType
  setOpen: (open: DialogType) => void
  
  // Current data
  currentUser: LiveTrackingUser | null
  setCurrentUser: (user: LiveTrackingUser | null) => void
  
  currentSession: TrackingSession | null
  setCurrentSession: (session: TrackingSession | null) => void
  
  currentEvents: TrackingEvent[] | null
  setCurrentEvents: (events: TrackingEvent[] | null) => void
  
  // Map state
  mapCenter: { lat: number; lng: number } | null
  setMapCenter: (center: { lat: number; lng: number } | null) => void
  
  selectedUserPath: { lat: number; lng: number }[]
  setSelectedUserPath: (path: { lat: number; lng: number }[]) => void
  
  // Filters
  filters: {
    status?: string
    activityStatus?: string
    roleId?: string
    territoryId?: string
    dateFrom?: string
    dateTo?: string
    searchFor?: string
  }
  setFilters: (filters: Partial<LiveTrackingStoreState['filters']>) => void
}

// Create the Zustand store
export const useLiveTrackingStore = create<LiveTrackingStoreState>((set) => ({
  open: null,
  setOpen: (open) => set({ open }),
  
  currentUser: null,
  setCurrentUser: (user) => set({ currentUser: user }),
  
  currentSession: null,
  setCurrentSession: (session) => set({ currentSession: session }),
  
  currentEvents: null,
  setCurrentEvents: (events) => set({ currentEvents: events }),
  
  mapCenter: null,
  setMapCenter: (center) => set({ mapCenter: center }),
  
  selectedUserPath: [],
  setSelectedUserPath: (path) => set({ selectedUserPath: path }),
  
  filters: {},
  setFilters: (filters) => set((state) => ({ 
    filters: { ...state.filters, ...filters } 
  })),
}))
