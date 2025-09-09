import { create } from 'zustand'
import { GeneralSettings, CompanyInfo, SystemPreferences } from '../type/type'

// Define the dialog types
type DialogType = 'edit-settings' | 'edit-company' | 'edit-preferences' | null

// Define the store interface
interface GeneralSettingsStoreState {
  // Dialog state
  open: DialogType
  setOpen: (open: DialogType) => void
  
  // Current data
  currentSettings: GeneralSettings | null
  setCurrentSettings: (settings: GeneralSettings | null) => void
  
  currentCompanyInfo: CompanyInfo | null
  setCurrentCompanyInfo: (info: CompanyInfo | null) => void
  
  currentPreferences: SystemPreferences | null
  setCurrentPreferences: (preferences: SystemPreferences | null) => void
  
  // Data lists
  generalSettings: GeneralSettings | null
  setGeneralSettings: (settings: GeneralSettings | null) => void
  
  companyInfo: CompanyInfo | null
  setCompanyInfo: (info: CompanyInfo | null) => void
  
  systemPreferences: SystemPreferences | null
  setSystemPreferences: (preferences: SystemPreferences | null) => void
}

// Create the Zustand store
export const useGeneralSettingsStore = create<GeneralSettingsStoreState>((set) => ({
  // Dialog state
  open: null,
  setOpen: (open) => set({ open }),
  
  // Current data
  currentSettings: null,
  setCurrentSettings: (settings) => set({ currentSettings: settings }),
  
  currentCompanyInfo: null,
  setCurrentCompanyInfo: (info) => set({ currentCompanyInfo: info }),
  
  currentPreferences: null,
  setCurrentPreferences: (preferences) => set({ currentPreferences: preferences }),
  
  // Data lists
  generalSettings: null,
  setGeneralSettings: (settings) => set({ generalSettings: settings }),
  
  companyInfo: null,
  setCompanyInfo: (info) => set({ companyInfo: info }),
  
  systemPreferences: null,
  setSystemPreferences: (preferences) => set({ systemPreferences: preferences }),
}))
