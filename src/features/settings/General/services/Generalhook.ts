import API from '@/config/api/api'
import useFetchData from '@/hooks/use-fetch-data'
import usePostData from '@/hooks/use-post-data'
import useDeleteData from '@/hooks/use-delete-data'
import usePatchData from '@/hooks/use-patch-data'
import { GeneralSettings, CompanyInfo, SystemPreferences } from '../type/type'

const GENERAL_SETTINGS_QUERY = 'general-settings/list'

export interface IListParams {
  sort?: string
  limit: number
  page: number
  [key: string]: unknown
}

// General Settings
export interface GeneralSettingsPayload {
  companyInformation: {
    companyName: string
    defaultTimezone: string
  }
  currencyAndFormatting: {
    defaultCurrency: string
    dateFormat: string
    distanceUnit: string
  }
  securitySettings: {
    requireTwoFactorAuth: boolean
    autoLogoutOnInactivity: boolean
    sessionTimeoutMinutes: number
  }
}

export interface GeneralSettingsResponse {
  data: GeneralSettings
  message: string
  statusCode: number
}

export const useUpdateGeneralSettings = (onSuccess?: () => void) => {
  return usePatchData<GeneralSettingsResponse, GeneralSettingsPayload>({
    url: 'general-settings/update',
    refetchQueries: [GENERAL_SETTINGS_QUERY],
    onSuccess: () => {
      if (onSuccess) {
        onSuccess()
      }
    },
  })
}

// Company Information
export interface CompanyInfoPayload {
  companyName: string
  defaultTimezone: string
  contactEmail?: string
  contactPhone?: string
  address?: string
  website?: string
}

export interface CompanyInfoResponse {
  data: CompanyInfo
  message: string
  statusCode: number
}

export const useUpdateCompanyInfo = (onSuccess?: () => void) => {
  return usePatchData<CompanyInfoResponse, CompanyInfoPayload>({
    url: 'general-settings/company/update',
    refetchQueries: [GENERAL_SETTINGS_QUERY],
    onSuccess: () => {
      if (onSuccess) {
        onSuccess()
      }
    },
  })
}

// System Preferences
export interface SystemPreferencesPayload {
  defaultCurrency: string
  dateFormat: string
  distanceUnit: string
  language: string
  theme: 'light' | 'dark' | 'auto'
}

export interface SystemPreferencesResponse {
  data: SystemPreferences
  message: string
  statusCode: number
}

export const useUpdateSystemPreferences = (onSuccess?: () => void) => {
  return usePatchData<SystemPreferencesResponse, SystemPreferencesPayload>({
    url: 'general-settings/preferences/update',
    refetchQueries: [GENERAL_SETTINGS_QUERY],
    onSuccess: () => {
      if (onSuccess) {
        onSuccess()
      }
    },
  })
}

// Data fetching hooks
export interface GeneralSettingsListResponse {
  generalSettings: GeneralSettings
  companyInfo: CompanyInfo
  systemPreferences: SystemPreferences
  totalCount: number
}

export const useGetGeneralSettingsData = (
  params: IListParams,
  options?: { enabled?: boolean }
) => {
  const query = useFetchData<GeneralSettingsListResponse>({
    url: GENERAL_SETTINGS_QUERY,
    params,
    enabled: options?.enabled ?? true,
  })

  return {
    ...query,
    generalSettings: query.data?.generalSettings ?? null,
    companyInfo: query.data?.companyInfo ?? null,
    systemPreferences: query.data?.systemPreferences ?? null,
    totalCount: query.data?.totalCount ?? 0,
    isLoading: query.isLoading,
    error: query.error,
  }
}
