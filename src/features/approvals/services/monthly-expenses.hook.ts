import useFetchData from '@/hooks/use-fetch-data'
import { useGetAllRolesForDropdown } from '@/features/UserManagement/services/Roles.hook'
import { useGetUsersForDropdown } from '@/features/buyers/services/users.hook'
import API from '@/config/api/api'

const MONTHLY_EXPENSES_QUERY = API.monthlyExpenses.consolidated

export interface IMonthlyExpensesParams {
  limit: number
  page: number
  searchFor?: string
  roleId?: string
  salesRepresentativeUserId?: string
  year: number
  month: number
  [key: string]: unknown
}

export interface MonthlyExpenseData {
  userId: string
  salesRepName: string
  dailyExpenseTotal: string | number
  travelExpenseTotal: string | number
  grandTotal: string | number
}

export interface MonthlyExpensesResponse {
  list: MonthlyExpenseData[]
  totalCount: number
}

export const useGetMonthlyExpensesData = (
  params: IMonthlyExpensesParams,
  options?: { enabled?: boolean }
) => {
  const query = useFetchData<MonthlyExpensesResponse>({
    url: MONTHLY_EXPENSES_QUERY,
    params,
    enabled: options?.enabled ?? true,
  })

  return {
    ...query,
    monthlyExpenses: query.data?.list ?? [],
    totalCount: query.data?.totalCount ?? 0,
    isLoading: query.isLoading,
    error: query.error,
  }
}

// Hook to get roles for dropdown
export const useGetRolesForMonthlyExpenses = () => {
  return useGetAllRolesForDropdown()
}

// Hook to get users for dropdown based on role
export const useGetUsersForMonthlyExpenses = (roleId?: string) => {
  return useGetUsersForDropdown({
    roleId,
    enabled: !!roleId,
  })
}