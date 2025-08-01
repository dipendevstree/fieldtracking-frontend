import { create } from 'zustand'
import { FieldTrackingConfig, TrackingRule, GeofenceZone } from '../type/type'

// Define the dialog types
type DialogType = 'add-rule' | 'edit-rule' | 'delete-rule' | 
                  'add-zone' | 'edit-zone' | 'delete-zone' | 
                  'settings' | null

// Define the store interface
interface FieldTrackingStoreState {
  // Dialog state
  open: DialogType
  setOpen: (open: DialogType) => void
  
  // Current row data
  currentRule: TrackingRule | null
  setCurrentRule: (rule: TrackingRule | null) => void
  
  currentZone: GeofenceZone | null
  setCurrentZone: (zone: GeofenceZone | null) => void
  
  // Configuration
  fieldTrackingConfig: FieldTrackingConfig | null
  setFieldTrackingConfig: (config: FieldTrackingConfig | null) => void
  
  // Data lists
  trackingRules: TrackingRule[]
  setTrackingRules: (rules: TrackingRule[]) => void
  
  geofenceZones: GeofenceZone[]
  setGeofenceZones: (zones: GeofenceZone[]) => void
}

// Create the Zustand store
export const useFieldTrackingStore = create<FieldTrackingStoreState>((set) => ({
  // Dialog state
  open: null,
  setOpen: (open) => set({ open }),
  
  // Current row data
  currentRule: null,
  setCurrentRule: (rule) => set({ currentRule: rule }),
  
  currentZone: null,
  setCurrentZone: (zone) => set({ currentZone: zone }),
  
  // Configuration
  fieldTrackingConfig: null,
  setFieldTrackingConfig: (config) => set({ fieldTrackingConfig: config }),
  
  // Data lists
  trackingRules: [],
  setTrackingRules: (rules) => set({ trackingRules: rules }),
  
  geofenceZones: [],
  setGeofenceZones: (zones) => set({ geofenceZones: zones }),
})) 