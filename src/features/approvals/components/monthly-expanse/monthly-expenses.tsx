import { useCallback, useState } from 'react'
import { useForm } from 'react-hook-form'
import { DEFAULT_PAGE_NUMBER, DEFAULT_PAGE_SIZE } from '@/data/app.data'
import debounce from 'lodash.debounce'
import { useSelectOptions } from '@/hooks/use-select-option'
import { FilterConfig } from '@/components/global-filter-section'
import GlobalFilterSection from '@/components/global-table-filter-section'
import MonthlyExpenseTable from './components/monthly-expense-table'
import { 
  useGetMonthlyExpensesData, 
  useGetRolesForMonthlyExpenses, 
  useGetUsersForMonthlyExpenses,
  IMonthlyExpensesParams 
} from '../../services/monthly-expenses.hook'


// No mock data - using API data only

export default function MonthlyExpenses() {
  const currentDate = new Date()
  const [pagination, setPagination] = useState<IMonthlyExpensesParams>({
    page: DEFAULT_PAGE_NUMBER,
    limit: DEFAULT_PAGE_SIZE,
    searchFor: '',
    roleId: '',
    salesRepresentativeUserId: '',
    year: currentDate.getFullYear(),
    month: currentDate.getMonth() + 1, // JavaScript months are 0-indexed
  })

  const { watch, setValue } = useForm({
    defaultValues: { roleId: '', salesRep: '', search: '' },
  })

  const onPaginationChange = (page: number, pageSize: number) => {
    setPagination((prev) => ({ ...prev, page, limit: pageSize }))
  }

  const roleId = watch('roleId')
  const selectedRep = watch('salesRep')

  const debouncedSearch = useCallback(
    debounce((value: string) => {
      setPagination((prev) => ({
        ...prev,
        searchFor: value,
        page: 1, // Reset to first page when searching
      }))
    }, 800),
    []
  )

  const handleGlobalSearchChange = (value: string | undefined) => {
    const searchValue = value ?? ''
    setValue('search', searchValue)
    debouncedSearch(searchValue)
  }

  // API calls
  const { 
    monthlyExpenses = [], 
    totalCount = 0, 
    isLoading, 
  } = useGetMonthlyExpensesData(pagination)

  // Debug logging to see the current data
  console.log('Monthly Expenses Data:', {
    monthlyExpenses,
    totalCount,
    isLoading,
    pagination
  })

  const { data: allRoles = [] } = useGetRolesForMonthlyExpenses()
  const { data: userList = [] } = useGetUsersForMonthlyExpenses(roleId)

  const roles = useSelectOptions({
    listData: allRoles ?? [],
    labelKey: 'roleName',
    valueKey: 'roleId',
  }).map((option) => ({
    ...option,
    value: String(option.value),
  }))

  const enhancedUserList = userList.map((user: any) => ({
    ...user,
    fullName: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
  }))

  const users = useSelectOptions({
    listData: enhancedUserList,
    labelKey: 'fullName',
    valueKey: 'id',
  }).map((option) => ({ ...option, value: String(option.value) }))

  // Handle role filter change
  const handleRoleChange = (value: string | undefined) => {
    const roleValue = value ?? ''
    setValue('roleId', roleValue)
    setValue('salesRep', '') // Reset sales rep when role changes
    setPagination((prev) => ({
      ...prev,
      roleId: roleValue,
      salesRepresentativeUserId: '', // Reset sales rep filter
      page: 1,
    }))
  }

  // Handle sales rep filter change
  const handleSalesRepChange = (value: string | undefined) => {
    const repValue = value ?? ''
    setValue('salesRep', repValue)
    setPagination((prev) => ({
      ...prev,
      salesRepresentativeUserId: repValue,
      page: 1,
    }))
  }

  const filters: FilterConfig[] = [
    {
      key: 'search',
      type: 'search',
      onChange: handleGlobalSearchChange,
      placeholder: 'Search by sales rep name...',
      value: watch('search'),
    },
    {
      key: 'role',
      type: 'select',
      onChange: handleRoleChange,
      placeholder: 'Select role',
      value: roleId,
      options: roles,
    },
    {
      key: 'salesRep',
      type: 'select',
      onChange: handleSalesRepChange,
      placeholder: 'Select sales rep',
      value: selectedRep,
      options: users,
    },
  ]

  return (
    <>
      <GlobalFilterSection key={'monthly-expenses-filters'} filters={filters} />

      <MonthlyExpenseTable
        data={monthlyExpenses}
        totalCount={totalCount}
        loading={isLoading}
        currentPage={pagination.page}
        paginationCallbacks={{ onPaginationChange }}
      />
    </>
  )
}
