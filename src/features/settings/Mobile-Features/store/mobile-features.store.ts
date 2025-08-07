import { create } from 'zustand'
import { MobileFeaturesConfig, MobilePermission, MobileFeatureSettings } from '../type/type'

// Define the dialog types
type DialogType = 'edit-config' | 'add-permission' | 'edit-permission' | 'delete-permission' | 
                  'add-feature' | 'edit-feature' | 'delete-feature' | null

// Define the store interface
interface MobileFeaturesStoreState {
  // Dialog state
  open: DialogType
  setOpen: (open: DialogType) => void
  
  // Current data
  currentPermission: MobilePermission | null
  setCurrentPermission: (permission: MobilePermission | null) => void
  
  currentFeature: MobileFeatureSettings | null
  setCurrentFeature: (feature: MobileFeatureSettings | null) => void
  
  currentConfig: MobileFeaturesConfig | null
  setCurrentConfig: (config: MobileFeaturesConfig | null) => void
  
  // Data lists
  mobilePermissions: MobilePermission[]
  setMobilePermissions: (permissions: MobilePermission[]) => void
  
  mobileFeatures: MobileFeatureSettings[]
  setMobileFeatures: (features: MobileFeatureSettings[]) => void
  
  // Configuration
  mobileFeaturesConfig: MobileFeaturesConfig | null
  setMobileFeaturesConfig: (config: MobileFeaturesConfig | null) => void
}

// Create the Zustand store
export const useMobileFeaturesStore = create<MobileFeaturesStoreState>((set) => ({
  // Dialog state
  open: null,
  setOpen: (open) => set({ open }),
  
  // Current data
  currentPermission: null,
  setCurrentPermission: (permission) => set({ currentPermission: permission }),
  
  currentFeature: null,
  setCurrentFeature: (feature) => set({ currentFeature: feature }),
  
  currentConfig: null,
  setCurrentConfig: (config) => set({ currentConfig: config }),
  
  // Data lists
  mobilePermissions: [],
  setMobilePermissions: (permissions) => set({ mobilePermissions: permissions }),
  
  mobileFeatures: [],
  setMobileFeatures: (features) => set({ mobileFeatures: features }),
  
  // Configuration
  mobileFeaturesConfig: null,
  setMobileFeaturesConfig: (config) => set({ mobileFeaturesConfig: config }),
}))
