import API from '@/config/api/api'
import useFetchData from '@/hooks/use-fetch-data'
import usePostData from '@/hooks/use-post-data'
import useDeleteData from '@/hooks/use-delete-data'
import usePatchData from '@/hooks/use-patch-data'
import { NotificationConfig, NotificationRule, NotificationTemplate } from '../type/type'

const NOTIFICATIONS_QUERY = 'notifications/list'

export interface IListParams {
  sort?: string
  limit: number
  page: number
  [key: string]: unknown
}

// Notification Configuration
export interface NotificationConfigPayload {
  expenseNotifications: {
    warnForExpiry: boolean
    unsubmittedReminders: boolean
    reminderFrequency: 'daily' | 'weekly' | 'monthly'
    reminderTime: string
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
}

export interface NotificationConfigResponse {
  data: NotificationConfig
  message: string
  statusCode: number
}

export const useUpdateNotificationConfig = (onSuccess?: () => void) => {
  return usePatchData<NotificationConfigResponse, NotificationConfigPayload>({
    url: 'notifications/config/update',
    refetchQueries: [NOTIFICATIONS_QUERY],
    onSuccess: () => {
      if (onSuccess) {
        onSuccess()
      }
    },
  })
}

// Notification Rules
export interface NotificationRulePayload {
  ruleName: string
  ruleType: 'expense' | 'field' | 'email' | 'system'
  isEnabled: boolean
  conditions: Record<string, any>
  actions: Record<string, any>
}

export interface NotificationRuleResponse {
  data: NotificationRule
  message: string
  statusCode: number
}

export const useCreateNotificationRule = (onSuccess?: () => void) => {
  return usePostData<NotificationRuleResponse, NotificationRulePayload>({
    url: 'notifications/rules/create',
    refetchQueries: [NOTIFICATIONS_QUERY],
    onSuccess: () => {
      if (onSuccess) {
        onSuccess()
      }
    },
  })
}

export const useUpdateNotificationRule = (id: string, onSuccess?: () => void) => {
  return usePatchData<NotificationRuleResponse, NotificationRulePayload>({
    url: `notifications/rules/update/${id}`,
    refetchQueries: [NOTIFICATIONS_QUERY],
    onSuccess: () => {
      if (onSuccess) {
        onSuccess()
      }
    },
  })
}

export const useDeleteNotificationRule = (id: string, onSuccess?: () => void) => {
  return useDeleteData({
    url: id ? `notifications/rules/delete/${id}` : 'notifications/rules/delete',
    refetchQueries: [NOTIFICATIONS_QUERY],
    onSuccess: () => {
      if (onSuccess && id) onSuccess()
    },
  })
}

// Notification Templates
export interface NotificationTemplatePayload {
  templateName: string
  templateType: 'email' | 'sms' | 'push' | 'in-app'
  subject?: string
  body: string
  isActive: boolean
}

export interface NotificationTemplateResponse {
  data: NotificationTemplate
  message: string
  statusCode: number
}

export const useCreateNotificationTemplate = (onSuccess?: () => void) => {
  return usePostData<NotificationTemplateResponse, NotificationTemplatePayload>({
    url: 'notifications/templates/create',
    refetchQueries: [NOTIFICATIONS_QUERY],
    onSuccess: () => {
      if (onSuccess) {
        onSuccess()
      }
    },
  })
}

export const useUpdateNotificationTemplate = (id: string, onSuccess?: () => void) => {
  return usePatchData<NotificationTemplateResponse, NotificationTemplatePayload>({
    url: `notifications/templates/update/${id}`,
    refetchQueries: [NOTIFICATIONS_QUERY],
    onSuccess: () => {
      if (onSuccess) {
        onSuccess()
      }
    },
  })
}

export const useDeleteNotificationTemplate = (id: string, onSuccess?: () => void) => {
  return useDeleteData({
    url: id ? `notifications/templates/delete/${id}` : 'notifications/templates/delete',
    refetchQueries: [NOTIFICATIONS_QUERY],
    onSuccess: () => {
      if (onSuccess && id) onSuccess()
    },
  })
}

// Data fetching hooks
export interface NotificationsListResponse {
  config: NotificationConfig
  rules: NotificationRule[]
  templates: NotificationTemplate[]
  totalCount: number
}

export const useGetNotificationsData = (
  params: IListParams,
  options?: { enabled?: boolean }
) => {
  const query = useFetchData<NotificationsListResponse>({
    url: NOTIFICATIONS_QUERY,
    params,
    enabled: options?.enabled ?? true,
  })

  return {
    ...query,
    notificationConfig: query.data?.config ?? null,
    notificationRules: query.data?.rules ?? [],
    notificationTemplates: query.data?.templates ?? [],
    totalCount: query.data?.totalCount ?? 0,
    isLoading: query.isLoading,
    error: query.error,
  }
}
