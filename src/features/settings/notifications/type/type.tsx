export interface NotificationConfig {
  configId: string
  expenseNotifications: {
    warnForExpiry: boolean
    unsubmittedReminders: boolean
    reminderFrequency: 'daily' | 'weekly' | 'monthly'
    reminderTime: string // HH:MM format
  }
  fieldActivityAlerts: {
    geofenceAlerts: boolean
    inactivityAlerts: boolean
    checkinAlerts: boolean
    breakAlerts: boolean
  }
  emailNotifications: {
    sendVisitNotesEmail: boolean
    notificationEmail: string
    emailFrequency: 'realtime' | 'daily' | 'weekly'
  }
  createdAt?: string
  updatedAt?: string
}

export interface NotificationRule {
  ruleId: string
  ruleName: string
  ruleType: 'expense' | 'field' | 'email' | 'system'
  isEnabled: boolean
  conditions: Record<string, any>
  actions: Record<string, any>
  createdAt?: string
  updatedAt?: string
}

export interface NotificationTemplate {
  templateId: string
  templateName: string
  templateType: 'email' | 'sms' | 'push' | 'in-app'
  subject?: string
  body: string
  isActive: boolean
  createdAt?: string
  updatedAt?: string
}
