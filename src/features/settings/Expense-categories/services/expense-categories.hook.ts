import useFetchData from '@/hooks/use-fetch-data'
import usePostData from '@/hooks/use-post-data'
import useDeleteData from '@/hooks/use-delete-data'
import usePatchData from '@/hooks/use-patch-data'
import { ExpenseCategory, PerDiemSettings, CategorySettings } from '../type/type'

const EXPENSE_CATEGORIES_QUERY = 'expense-categories/list'

export interface IListParams {
  sort?: string
  limit: number
  page: number
  [key: string]: unknown
}

// Expense Category
export interface ExpenseCategoryPayload {
  categoryName: string
  categoryType: 'mileage' | 'per-diem' | 'fixed-amount' | 'percentage' | 'custom'
  defaultLimit: number
  limitUnit: 'per-mile' | 'per-day' | 'per-meal' | 'per-trip' | 'fixed'
  requiresReceipt: boolean
  isActive: boolean
  description?: string
}

export interface ExpenseCategoryResponse {
  data: ExpenseCategory
  message: string
  statusCode: number
}

export const useCreateExpenseCategory = (onSuccess?: () => void) => {
  return usePostData<ExpenseCategoryResponse, ExpenseCategoryPayload>({
    url: 'expense-categories/create',
    refetchQueries: [EXPENSE_CATEGORIES_QUERY],
    onSuccess: () => {
      if (onSuccess) {
        onSuccess()
      }
    },
  })
}

export const useUpdateExpenseCategory = (id: string, onSuccess?: () => void) => {
  return usePatchData<ExpenseCategoryResponse, ExpenseCategoryPayload>({
    url: `expense-categories/update/${id}`,
    refetchQueries: [EXPENSE_CATEGORIES_QUERY],
    onSuccess: () => {
      if (onSuccess) {
        onSuccess()
      }
    },
  })
}

export const useDeleteExpenseCategory = (id: string, onSuccess?: () => void) => {
  return useDeleteData({
    url: id ? `expense-categories/delete/${id}` : 'expense-categories/delete',
    refetchQueries: [EXPENSE_CATEGORIES_QUERY],
    onSuccess: () => {
      if (onSuccess && id) onSuccess()
    },
  })
}

// Per Diem Settings
export interface PerDiemSettingsPayload {
  breakfastAllowance: number
  lunchAllowance: number
  dinnerAllowance: number
  totalDailyLimit: number
}

export interface PerDiemSettingsResponse {
  data: PerDiemSettings
  message: string
  statusCode: number
}

export const useUpdatePerDiemSettings = (onSuccess?: () => void) => {
  return usePatchData<PerDiemSettingsResponse, PerDiemSettingsPayload>({
    url: 'expense-categories/per-diem-settings/update',
    refetchQueries: [EXPENSE_CATEGORIES_QUERY],
    onSuccess: () => {
      if (onSuccess) {
        onSuccess()
      }
    },
  })
}

// Category Settings
export interface CategorySettingsPayload {
  perDiemSettings: PerDiemSettingsPayload
  globalSettings: {
    defaultReceiptRequired: boolean
    autoApprovalLimit: number
    maxExpenseAmount: number
  }
}

export interface CategorySettingsResponse {
  data: CategorySettings
  message: string
  statusCode: number
}

export const useUpdateCategorySettings = (onSuccess?: () => void) => {
  return usePatchData<CategorySettingsResponse, CategorySettingsPayload>({
    url: 'expense-categories/settings/update',
    refetchQueries: [EXPENSE_CATEGORIES_QUERY],
    onSuccess: () => {
      if (onSuccess) {
        onSuccess()
      }
    },
  })
}

// Data fetching hooks
export interface ExpenseCategoriesListResponse {
  categories: ExpenseCategory[]
  perDiemSettings: PerDiemSettings
  categorySettings: CategorySettings
  totalCount: number
}

export const useGetExpenseCategoriesData = (
  params: IListParams,
  options?: { enabled?: boolean }
) => {
  const query = useFetchData<ExpenseCategoriesListResponse>({
    url: EXPENSE_CATEGORIES_QUERY,
    params,
    enabled: options?.enabled ?? true,
  })

  return {
    ...query,
    expenseCategories: query.data?.categories ?? [],
    perDiemSettings: query.data?.perDiemSettings ?? null,
    categorySettings: query.data?.categorySettings ?? null,
    totalCount: query.data?.totalCount ?? 0,
    isLoading: query.isLoading,
    error: query.error,
  }
} 