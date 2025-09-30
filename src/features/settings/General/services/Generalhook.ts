import API from '@/config/api/api'
import useFetchData from '@/hooks/use-fetch-data'
import usePatchData from '@/hooks/use-patch-data'
import usePostData from '@/hooks/use-post-data'
import { GeneralSettings, CompanyInfo, SystemPreferences } from '../type/type'
import useDeleteData from '@/hooks/use-delete-data'

const GENERAL_SETTINGS_QUERY = API.generalSettings.list

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

export const useUpdateGeneralSettings = (organizationId?: string, onSuccess?: () => void) => {
  const url = organizationId ? `${API.organizations.update}/${organizationId}` : API.organizations.update
  return usePatchData<any, any>({
    url,
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
    url: API.generalSettings.updateCompanyInfo,
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
    url: API.generalSettings.updateSystemPreferences,
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

// Get general settings data
export const useGetGeneralSettings = (options?: { enabled?: boolean }) => {
  const query = useFetchData<any>({
    url: API.generalSettings.get,
    enabled: options?.enabled ?? true,
  })

  return {
    ...query,
    data: query.data,
    generalSettings: query.data ?? null,
    isLoading: query.isLoading,
    error: query.error,
  }
}

// Get company info data
export const useGetCompanyInfo = (options?: { enabled?: boolean }) => {
  const query = useFetchData<any>({
    url: API.generalSettings.companyInfo,
    enabled: options?.enabled ?? true,
  })

  return {
    ...query,
    data: query.data,
    companyInfo: query.data ?? null,
    isLoading: query.isLoading,
    error: query.error,
  }
}

// Get system preferences data
export const useGetSystemPreferences = (options?: { enabled?: boolean }) => {
  const query = useFetchData<any>({
    url: API.generalSettings.systemPreferences,
    enabled: options?.enabled ?? true,
  })

  return {
    ...query,
    data: query.data,
    systemPreferences: query.data ?? null,
    isLoading: query.isLoading,
    error: query.error,
  }
}

// Create general settings
export const useCreateGeneralSettings = (onSuccess?: () => void) => {
  return usePostData({
    url: API.generalSettings.create,
    refetchQueries: [GENERAL_SETTINGS_QUERY],
    onSuccess: () => {
      if (onSuccess) {
        onSuccess()
      }
    },
  })
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

export const useGetAllFixedDayExpense = (params: any = {}) => {
  const query = useFetchData<any>({
    url: API.fixedDayExpense.list,
    params,
  });

  return {
    ...query,
    data: query.data,
    list: query.data?.list ?? [],
    totalCount: query.data?.totalCount ?? 0,
    isLoading: query.isLoading,
    error: query.error,
  };
};
export const useCreateFixedDayExpense = (onSuccess?: () => void) => {
  return usePostData({
    url: API.fixedDayExpense.create,
    refetchQueries: [API.fixedDayExpense.list],
    onSuccess: () => {
      if (onSuccess) {
        onSuccess();
      }
    },
  });
};
export const useUpdateFixedDayExpense = (onSuccess?: () => void) => {
  return usePatchData({
    url: API.fixedDayExpense.update,
    refetchQueries: [API.fixedDayExpense.list],
    onSuccess: () => {
      if (onSuccess) {
        onSuccess();
      }
    },
  });
};
export const useDeleteFixedDayExpense = (onSuccess?: () => void) => {
  return useDeleteData({
    url: API.fixedDayExpense.delete,
    refetchQueries: [API.fixedDayExpense.list],

    onSuccess: () => {
      if (onSuccess) {
        onSuccess();
      }
    },
  });
};