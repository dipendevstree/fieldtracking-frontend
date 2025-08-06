import { useEffect } from 'react'

import {
  useUpdateGeneralSettings,
  useUpdateCompanyInfo,
  useUpdateSystemPreferences,
  GeneralSettingsPayload,
  CompanyInfoPayload
} from '../services/Generalhook'
import { useGeneralSettingsStore } from '../store/customer-type.store'
import { GeneralSettingsActionForm, CompanyInfoActionForm } from './action-form'
import { TGeneralSettingsFormSchema, TCompanyInfoFormSchema } from '../data/schema'
import { toast } from 'sonner'

export function GeneralSettingsActionModal() {
  const { 
    open, 
    setOpen, 
    currentSettings, 
    setCurrentSettings,
    currentCompanyInfo,
    setCurrentCompanyInfo,
    currentPreferences: _currentPreferences,
    setCurrentPreferences
  } = useGeneralSettingsStore()

  // General Settings hooks
  const {
    mutate: updateGeneralSettings,
    isPending: isUpdateSettingsLoading,
    isSuccess: isUpdateSettingsSuccess,
    isError: isUpdateSettingsError,
  } = useUpdateGeneralSettings()

  // Company Info hooks
  const {
    mutate: updateCompanyInfo,
    isPending: isUpdateCompanyLoading,
    isSuccess: isUpdateCompanySuccess,
    isError: isUpdateCompanyError,
  } = useUpdateCompanyInfo()

  // System Preferences hooks
  const {
    isSuccess: isUpdatePreferencesSuccess,
    isError: isUpdatePreferencesError,
  } = useUpdateSystemPreferences()

  // Auto-close on successful operations
  useEffect(() => {
    if (
      (isUpdateSettingsSuccess && !isUpdateSettingsError) ||
      (isUpdateCompanySuccess && !isUpdateCompanyError) ||
      (isUpdatePreferencesSuccess && !isUpdatePreferencesError)
    ) {
      closeModal()
    }
  }, [
    isUpdateSettingsSuccess, isUpdateSettingsError,
    isUpdateCompanySuccess, isUpdateCompanyError,
    isUpdatePreferencesSuccess, isUpdatePreferencesError
  ])

  const closeModal = () => {
    setOpen(null)
    setTimeout(() => {
      setCurrentSettings(null)
      setCurrentCompanyInfo(null)
      setCurrentPreferences(null)
    }, 300)
  }

  // General Settings handlers
  const handleUpdateGeneralSettings = (values: TGeneralSettingsFormSchema) => {
    try {
      const payload: GeneralSettingsPayload = {
        companyInformation: {
          companyName: values.companyInformation.companyName.trim(),
          defaultTimezone: values.companyInformation.defaultTimezone,
        },
        currencyAndFormatting: {
          defaultCurrency: values.currencyAndFormatting.defaultCurrency,
          dateFormat: values.currencyAndFormatting.dateFormat,
          distanceUnit: values.currencyAndFormatting.distanceUnit,
        },
        securitySettings: {
          requireTwoFactorAuth: values.securitySettings.requireTwoFactorAuth,
          autoLogoutOnInactivity: values.securitySettings.autoLogoutOnInactivity,
          sessionTimeoutMinutes: values.securitySettings.sessionTimeoutMinutes,
        },
      }
      
      if (!payload.companyInformation.companyName) {
        toast.error('Company name is required')
        return
      }
      
      updateGeneralSettings(payload)
    } catch (error) {
      console.error('Error updating general settings:', error)
      toast.error('Failed to update general settings')
    }
  }

  // Company Info handlers
  const handleUpdateCompanyInfo = (values: TCompanyInfoFormSchema) => {
    try {
      const payload: CompanyInfoPayload = {
        companyName: values.companyName.trim(),
        defaultTimezone: values.defaultTimezone,
        contactEmail: values.contactEmail?.trim(),
        contactPhone: values.contactPhone?.trim(),
        address: values.address?.trim(),
        website: values.website?.trim(),
      }
      
      if (!payload.companyName) {
        toast.error('Company name is required')
        return
      }
      
      updateCompanyInfo(payload)
    } catch (error) {
      console.error('Error updating company info:', error)
      toast.error('Failed to update company info')
    }
  }

  // System Preferences handlers


  return (
    <>
      {/* General Settings Modal */}
      <GeneralSettingsActionForm
        key='edit-settings'
        open={open === 'edit-settings'}
        loading={isUpdateSettingsLoading}
        currentSettings={currentSettings || undefined}
        onSubmit={handleUpdateGeneralSettings}
        onOpenChange={(value) => {
          if (!value) closeModal()
          else setOpen('edit-settings')
        }}
      />

      {/* Company Info Modal */}
      <CompanyInfoActionForm
        key='edit-company'
        open={open === 'edit-company'}
        loading={isUpdateCompanyLoading}
        currentCompanyInfo={currentCompanyInfo || undefined}
        onSubmit={handleUpdateCompanyInfo}
        onOpenChange={(value) => {
          if (!value) closeModal()
          else setOpen('edit-company')
        }}
      />
    </>
  )
}
