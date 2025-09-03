import API from '@/config/api/api'
import useDeleteData from '@/hooks/use-delete-data'
import useFetchData from '@/hooks/use-fetch-data'
import usePatchData from '@/hooks/use-patch-data'
import usePostData from '@/hooks/use-post-data'
import { ExpenseCategory, PerDiemSettings, CategorySettings } from '../type/type'

const EXPENSE_CATEGORIES_QUERY = API.category.list

export interface IListParams {
  sort?: string
  limit: number
  page: number
  [key: string]: unknown
}

// Expense Category
export interface ExpenseCategoryPayload {
  categoryName: string
}

export interface ExpenseCategoryResponse {
  data: ExpenseCategory
  message: string
  statusCode: number
}

export const useCreateExpenseCategory = (onSuccess?: () => void) => {
  return usePostData<ExpenseCategoryResponse, ExpenseCategoryPayload>({
    url: API.category.create,
    refetchQueries: [EXPENSE_CATEGORIES_QUERY],
    onSuccess: () => {
      console.log('Expense category created successfully, refetching data...')
      if (onSuccess) {
        onSuccess()
      }
    },
    onError: (error) => {
      console.error('Error creating expense category:', error)
    },
  })
}

export const useUpdateExpenseCategory = (id: string, onSuccess?: () => void) => {
  return usePatchData<ExpenseCategoryResponse, ExpenseCategoryPayload>({
    url: `${API.category.update}/${id}`,
    refetchQueries: [EXPENSE_CATEGORIES_QUERY],
    onSuccess: () => {
      console.log('Expense category updated successfully, refetching data...')
      if (onSuccess) {
        onSuccess()
      }
    },
    onError: (error) => {
      console.error('Error updating expense category:', error)
    },
  })
}

export const useDeleteExpenseCategory = (id: string, onSuccess?: () => void) => {
  return useDeleteData({
    url: `${API.category.delete}/${id}`,
    refetchQueries: [EXPENSE_CATEGORIES_QUERY],
    onSuccess: () => {
      console.log('Expense category deleted successfully, refetching data...')
      if (onSuccess && id) onSuccess()
    },
    onError: (error) => {
      console.error('Error deleting expense category:', error)
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
    url: API.category.update,
    refetchQueries: [EXPENSE_CATEGORIES_QUERY],
    onSuccess: () => {
      if (onSuccess) {
        onSuccess()
      }
    },
    onError: (error) => {
      console.error('Error updating per diem settings:', error)
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
    url: API.category.update,
    refetchQueries: [EXPENSE_CATEGORIES_QUERY],
    onSuccess: () => {
      if (onSuccess) {
        onSuccess()
      }
    },
    onError: (error) => {
      console.error('Error updating category settings:', error)
    },
  })
}

// Data fetching hooks
export interface ExpenseCategoriesListResponse {
  list: ExpenseCategory[]
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
    expenseCategories: query.data?.list ?? [],
    perDiemSettings: query.data?.perDiemSettings ?? null,
    categorySettings: query.data?.categorySettings ?? null,
    totalCount: query.data?.totalCount ?? 0,
    isLoading: query.isLoading,
    error: query.error,
  }
} 