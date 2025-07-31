import { useEffect } from 'react'
import { DeleteModal } from '@/components/shared/common-delete-modal'
import {
  useUpdateNotificationConfig,
  useCreateNotificationRule,
  useUpdateNotificationRule,
  useDeleteNotificationRule,
  useCreateNotificationTemplate,
  useUpdateNotificationTemplate,
  useDeleteNotificationTemplate,
  NotificationConfigPayload,
  NotificationRulePayload,
  NotificationTemplatePayload
} from '../services/notificationshook'
import { useNotificationsStore } from '../store/notifications.store'
import { NotificationConfigActionForm, NotificationRuleActionForm } from './action-form'
import { TNotificationConfigFormSchema, TNotificationRuleFormSchema, TNotificationTemplateFormSchema } from '../data/schema'
import { toast } from 'sonner'

export function NotificationsActionModal() {
  const { 
    open, 
    setOpen, 
    currentConfig, 
    setCurrentConfig,
    currentRule,
    setCurrentRule,
    currentTemplate,
    setCurrentTemplate
  } = useNotificationsStore()

  // Notification Configuration hooks
  const {
    mutate: updateNotificationConfig,
    isPending: isUpdateConfigLoading,
    isSuccess: isUpdateConfigSuccess,
    isError: isUpdateConfigError,
  } = useUpdateNotificationConfig()

  // Notification Rule hooks
  const {
    mutate: createNotificationRule,
    isPending: isCreateRuleLoading,
    isSuccess: isCreateRuleSuccess,
    isError: isCreateRuleError,
  } = useCreateNotificationRule()

  const {
    mutate: updateNotificationRule,
    isPending: isUpdateRuleLoading,
    isSuccess: isUpdateRuleSuccess,
    isError: isUpdateRuleError,
  } = useUpdateNotificationRule(currentRule?.ruleId || '')

  const {
    mutate: deleteNotificationRule,
    isSuccess: isDeleteRuleSuccess,
    isError: isDeleteRuleError,
  } = useDeleteNotificationRule(currentRule?.ruleId || '')

  // Notification Template hooks
  const {
    mutate: createNotificationTemplate,
    isPending: isCreateTemplateLoading,
    isSuccess: isCreateTemplateSuccess,
    isError: isCreateTemplateError,
  } = useCreateNotificationTemplate()

  const {
    mutate: updateNotificationTemplate,
    isPending: isUpdateTemplateLoading,
    isSuccess: isUpdateTemplateSuccess,
    isError: isUpdateTemplateError,
  } = useUpdateNotificationTemplate(currentTemplate?.templateId || '')

  const {
    mutate: deleteNotificationTemplate,
    isSuccess: isDeleteTemplateSuccess,
    isError: isDeleteTemplateError,
  } = useDeleteNotificationTemplate(currentTemplate?.templateId || '')

  // Auto-close on successful operations
  useEffect(() => {
    if (
      (isUpdateConfigSuccess && !isUpdateConfigError) ||
      (isCreateRuleSuccess && !isCreateRuleError) ||
      (isUpdateRuleSuccess && !isUpdateRuleError) ||
      (isDeleteRuleSuccess && !isDeleteRuleError) ||
      (isCreateTemplateSuccess && !isCreateTemplateError) ||
      (isUpdateTemplateSuccess && !isUpdateTemplateError) ||
      (isDeleteTemplateSuccess && !isDeleteTemplateError)
    ) {
      closeModal()
    }
  }, [
    isUpdateConfigSuccess, isUpdateConfigError,
    isCreateRuleSuccess, isCreateRuleError,
    isUpdateRuleSuccess, isUpdateRuleError,
    isDeleteRuleSuccess, isDeleteRuleError,
    isCreateTemplateSuccess, isCreateTemplateError,
    isUpdateTemplateSuccess, isUpdateTemplateError,
    isDeleteTemplateSuccess, isDeleteTemplateError
  ])

  const closeModal = () => {
    setOpen(null)
    setTimeout(() => {
      setCurrentConfig(null)
      setCurrentRule(null)
      setCurrentTemplate(null)
    }, 300)
  }

  // Notification Configuration handlers
  const handleUpdateNotificationConfig = (values: TNotificationConfigFormSchema) => {
    try {
      const payload: NotificationConfigPayload = {
        expenseNotifications: {
          warnForExpiry: values.expenseNotifications.warnForExpiry,
          unsubmittedReminders: values.expenseNotifications.unsubmittedReminders,
          reminderFrequency: values.expenseNotifications.reminderFrequency,
          reminderTime: values.expenseNotifications.reminderTime,
        },
        fieldActivityAlerts: {
          geofenceAlerts: values.fieldActivityAlerts.geofenceAlerts,
          inactivityAlerts: values.fieldActivityAlerts.inactivityAlerts,
          checkinAlerts: values.fieldActivityAlerts.checkinAlerts,
          breakAlerts: values.fieldActivityAlerts.breakAlerts,
        },
        emailNotifications: {
          sendVisitNotesEmail: values.emailNotifications.sendVisitNotesEmail,
          notificationEmail: values.emailNotifications.notificationEmail,
          emailFrequency: values.emailNotifications.emailFrequency,
        },
      }
      
      updateNotificationConfig(payload)
    } catch (error) {
      console.error('Error updating notification config:', error)
      toast.error('Failed to update notification configuration')
    }
  }

  // Notification Rule handlers
  const handleCreateNotificationRule = (values: TNotificationRuleFormSchema) => {
    try {
      const payload: NotificationRulePayload = {
        ruleName: values.ruleName.trim(),
        ruleType: values.ruleType,
        isEnabled: values.isEnabled,
        conditions: values.conditions,
        actions: values.actions,
      }
      
      if (!payload.ruleName) {
        toast.error('Rule name is required')
        return
      }
      
      createNotificationRule(payload)
    } catch (error) {
      console.error('Error creating notification rule:', error)
      toast.error('Failed to create notification rule')
    }
  }

  const handleUpdateNotificationRule = (values: TNotificationRuleFormSchema) => {
    try {
      if (!currentRule?.ruleId) {
        toast.error('Rule ID is missing')
        return
      }
      
      const payload: NotificationRulePayload = {
        ruleName: values.ruleName.trim(),
        ruleType: values.ruleType,
        isEnabled: values.isEnabled,
        conditions: values.conditions,
        actions: values.actions,
      }
      
      if (!payload.ruleName) {
        toast.error('Rule name is required')
        return
      }
      
      updateNotificationRule(payload)
    } catch (error) {
      console.error('Error updating notification rule:', error)
      toast.error('Failed to update notification rule')
    }
  }

  const handleDeleteNotificationRule = () => {
    try {
      if (!currentRule?.ruleId) {
        toast.error('Rule ID is missing')
        return
      }
      
      deleteNotificationRule()
    } catch (error) {
      console.error('Error deleting notification rule:', error)
      toast.error('Failed to delete notification rule')
    }
  }

  // Notification Template handlers
  const handleCreateNotificationTemplate = (values: TNotificationTemplateFormSchema) => {
    try {
      const payload: NotificationTemplatePayload = {
        templateName: values.templateName.trim(),
        templateType: values.templateType,
        subject: values.subject?.trim(),
        body: values.body.trim(),
        isActive: values.isActive,
      }
      
      if (!payload.templateName) {
        toast.error('Template name is required')
        return
      }
      
      if (!payload.body) {
        toast.error('Template body is required')
        return
      }
      
      createNotificationTemplate(payload)
    } catch (error) {
      console.error('Error creating notification template:', error)
      toast.error('Failed to create notification template')
    }
  }

  const handleUpdateNotificationTemplate = (values: TNotificationTemplateFormSchema) => {
    try {
      if (!currentTemplate?.templateId) {
        toast.error('Template ID is missing')
        return
      }
      
      const payload: NotificationTemplatePayload = {
        templateName: values.templateName.trim(),
        templateType: values.templateType,
        subject: values.subject?.trim(),
        body: values.body.trim(),
        isActive: values.isActive,
      }
      
      if (!payload.templateName) {
        toast.error('Template name is required')
        return
      }
      
      if (!payload.body) {
        toast.error('Template body is required')
        return
      }
      
      updateNotificationTemplate(payload)
    } catch (error) {
      console.error('Error updating notification template:', error)
      toast.error('Failed to update notification template')
    }
  }

  const handleDeleteNotificationTemplate = () => {
    try {
      if (!currentTemplate?.templateId) {
        toast.error('Template ID is missing')
        return
      }
      
      deleteNotificationTemplate()
    } catch (error) {
      console.error('Error deleting notification template:', error)
      toast.error('Failed to delete notification template')
    }
  }

  return (
    <>
      {/* Notification Configuration Modal */}
      <NotificationConfigActionForm
        key='edit-config'
        open={open === 'edit-config'}
        loading={isUpdateConfigLoading}
        currentConfig={currentConfig}
        onSubmit={handleUpdateNotificationConfig}
        onOpenChange={(value) => {
          if (!value) closeModal()
          else setOpen('edit-config')
        }}
      />

      {/* Notification Rule Modals */}
      <NotificationRuleActionForm
        key='add-rule'
        open={open === 'add-rule'}
        loading={isCreateRuleLoading}
        onSubmit={handleCreateNotificationRule}
        onOpenChange={(value) => {
          if (!value) closeModal()
          else setOpen('add-rule')
        }}
      />

      {currentRule && (
        <>
          <NotificationRuleActionForm
            key='edit-rule'
            open={open === 'edit-rule'}
            loading={isUpdateRuleLoading}
            currentRule={currentRule}
            onSubmit={handleUpdateNotificationRule}
            onOpenChange={(value) => {
              if (!value) closeModal()
              else setOpen('edit-rule')
            }}
          />

          <DeleteModal
            key='delete-rule'
            open={open === 'delete-rule'}
            currentRow={currentRule}
            itemIdentifier={'ruleId' as keyof typeof currentRule}
            itemName='Notification Rule'
            onDelete={handleDeleteNotificationRule}
            onOpenChange={(value) => {
              if (!value) closeModal()
              else setOpen('delete-rule')
            }}
          />
        </>
      )}
    </>
  )
}
