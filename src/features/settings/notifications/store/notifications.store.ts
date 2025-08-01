import { create } from 'zustand'
import { NotificationConfig, NotificationRule, NotificationTemplate } from '../type/type'

// Define the dialog types
type DialogType = 'edit-config' | 'add-rule' | 'edit-rule' | 'delete-rule' | 
                  'add-template' | 'edit-template' | 'delete-template' | null

// Define the store interface
interface NotificationsStoreState {
  // Dialog state
  open: DialogType
  setOpen: (open: DialogType) => void
  
  // Current data
  currentRule: NotificationRule | null
  setCurrentRule: (rule: NotificationRule | null) => void
  
  currentTemplate: NotificationTemplate | null
  setCurrentTemplate: (template: NotificationTemplate | null) => void
  
  currentConfig: NotificationConfig | null
  setCurrentConfig: (config: NotificationConfig | null) => void
  
  // Data lists
  notificationRules: NotificationRule[]
  setNotificationRules: (rules: NotificationRule[]) => void
  
  notificationTemplates: NotificationTemplate[]
  setNotificationTemplates: (templates: NotificationTemplate[]) => void
  
  // Configuration
  notificationConfig: NotificationConfig | null
  setNotificationConfig: (config: NotificationConfig | null) => void
}

// Create the Zustand store
export const useNotificationsStore = create<NotificationsStoreState>((set) => ({
  // Dialog state
  open: null,
  setOpen: (open) => set({ open }),
  
  // Current data
  currentRule: null,
  setCurrentRule: (rule) => set({ currentRule: rule }),
  
  currentTemplate: null,
  setCurrentTemplate: (template) => set({ currentTemplate: template }),
  
  currentConfig: null,
  setCurrentConfig: (config) => set({ currentConfig: config }),
  
  // Data lists
  notificationRules: [],
  setNotificationRules: (rules) => set({ notificationRules: rules }),
  
  notificationTemplates: [],
  setNotificationTemplates: (templates) => set({ notificationTemplates: templates }),
  
  // Configuration
  notificationConfig: null,
  setNotificationConfig: (config) => set({ notificationConfig: config }),
}))
