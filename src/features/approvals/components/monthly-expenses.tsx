import { useCallback, useState } from 'react'
import { useForm } from 'react-hook-form'
import { DEFAULT_PAGE_NUMBER, DEFAULT_PAGE_SIZE } from '@/data/app.data'
import debounce from 'lodash.debounce'
import { useSelectOptions } from '@/hooks/use-select-option'
import { FilterConfig } from '@/components/global-filter-section'
import GlobalFilterSection from '@/components/global-table-filter-section'
import MonthlyExpenseTable from './monthly-expense-table'

// Updated mock data for monthly expense summary based on the image
const mockMonthlyExpenses = [
  {
    id: 1,
    salesRepresentativeUser: {
      firstName: 'Royd',
      lastName: 'Miles',
      id: 1,
    },
    dailyExpenseTotal: 500,
    travelExpenseTotal: 500,
    grandTotal: 1000,
    status: 'pending',
  },
  {
    id: 2,
    salesRepresentativeUser: {
      firstName: 'Jooe',
      lastName: 'Gopper',
      id: 2,
    },
    dailyExpenseTotal: 500,
    travelExpenseTotal: 500,
    grandTotal: 1000,
    status: 'partially_approved',
  },
  {
    id: 3,
    salesRepresentativeUser: {
      firstName: 'Beeoor',
      lastName: 'Reed',
      id: 3,
    },
    dailyExpenseTotal: 500,
    travelExpenseTotal: 500,
    grandTotal: 1000,
    status: 'approved',
  },
  {
    id: 4,
    salesRepresentativeUser: {
      firstName: 'Sooeior',
      lastName: 'Simmons',
      id: 4,
    },
    dailyExpenseTotal: 500,
    travelExpenseTotal: 500,
    grandTotal: 1000,
    status: 'pending',
  },
  {
    id: 5,
    salesRepresentativeUser: {
      firstName: 'Danield',
      lastName: 'Ionard',
      id: 5,
    },
    dailyExpenseTotal: 500,
    travelExpenseTotal: 500,
    grandTotal: 1000,
    status: 'complete',
  },
  {
    id: 6,
    salesRepresentativeUser: {
      firstName: 'Anneto',
      lastName: 'Fiack',
      id: 6,
    },
    dailyExpenseTotal: 500,
    travelExpenseTotal: 500,
    grandTotal: 1000,
    status: 'pending',
  },
  {
    id: 7,
    salesRepresentativeUser: {
      firstName: 'Ronald',
      lastName: 'Geeper',
      id: 7,
    },
    dailyExpenseTotal: 500,
    travelExpenseTotal: 500,
    grandTotal: 1000,
    status: 'complete',
  },
]

// Mock roles data
const mockRoles = [
  { roleId: '1', roleName: 'Sales Representative' },
  { roleId: '2', roleName: 'Field Agent' },
  { roleId: '3', roleName: 'Account Manager' },
  { roleId: '4', roleName: 'Territory Manager' },
  { roleId: '5', roleName: 'Senior Sales Rep' },
]

// Updated mock users data to match the new names
const mockUsers = [
  { id: '1', firstName: 'Royd', lastName: 'Miles', roleId: '1' },
  { id: '2', firstName: 'Jooe', lastName: 'Gopper', roleId: '1' },
  { id: '3', firstName: 'Beeoor', lastName: 'Reed', roleId: '2' },
  { id: '4', firstName: 'Sooeior', lastName: 'Simmons', roleId: '3' },
  { id: '5', firstName: 'Danield', lastName: 'Ionard', roleId: '1' },
  { id: '6', firstName: 'Anneto', lastName: 'Fiack', roleId: '4' },
  { id: '7', firstName: 'Ronald', lastName: 'Geeper', roleId: '2' },
]

export default function MonthlyExpenses() {
  const [pagination, setPagination] = useState({
    page: DEFAULT_PAGE_NUMBER,
    limit: DEFAULT_PAGE_SIZE,
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
    searchFor: '',
    roleId: '',
    salesRepId: '',
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
      }))
    }, 800),
    []
  )

  const handleGlobalSearchChange = (value: string | undefined) => {
    const searchValue = value ?? ''
    setValue('search', searchValue)
    debouncedSearch(searchValue)
  }

  // Mock API calls - replace with actual hooks when available
  const allRoles = mockRoles
  const userList = mockUsers.filter((user) => !roleId || user.roleId === roleId)

  // Filter mock expenses based on current filters
  const filteredExpenses = mockMonthlyExpenses.filter((expense) => {
    const matchesSearch =
      !pagination.searchFor ||
      `${expense.salesRepresentativeUser.firstName} ${expense.salesRepresentativeUser.lastName}`
        .toLowerCase()
        .includes(pagination.searchFor.toLowerCase())
    const matchesRep =
      !selectedRep ||
      expense.salesRepresentativeUser.id.toString() === selectedRep

    return matchesSearch && matchesRep
  })

  // Pagination logic
  const startIndex = (pagination.page - 1) * pagination.limit
  const endIndex = startIndex + pagination.limit
  const paginatedExpenses = filteredExpenses.slice(startIndex, endIndex)

  const expenses = paginatedExpenses
  const totalCount = filteredExpenses.length
  const isLoading = false

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
      onChange: (value) => setValue('roleId', value ?? ''),
      placeholder: 'Select role',
      value: roleId,
      options: roles,
    },
    {
      key: 'salesRep',
      type: 'select',
      onChange: (value) => setValue('salesRep', value ?? ''),
      placeholder: 'Select sales rep',
      value: selectedRep,
      options: users,
    },
  ]

  return (
    <>
      <GlobalFilterSection key={'monthly-expenses-filters'} filters={filters} />

      <MonthlyExpenseTable
        data={expenses}
        totalCount={totalCount}
        loading={isLoading}
        currentPage={pagination.page}
        paginationCallbacks={{ onPaginationChange }}
      />
    </>
  )
}
