import { useCallback, useState } from 'react'
import { useForm } from 'react-hook-form'
import { DEFAULT_PAGE_NUMBER, DEFAULT_PAGE_SIZE } from '@/data/app.data'
import debounce from 'lodash.debounce'
import { useSelectOptions } from '@/hooks/use-select-option'
import { FilterConfig } from '@/components/global-filter-section'
import GlobalFilterSection from '@/components/global-table-filter-section'
import { FormData } from '@/features/calendar/components/CalendarView'
import DailyExpenseTable from './daily-expense-table'

// Mock data for daily expenses matching your column structure
const mockExpenses = [
  {
    id: 1,
    salesRepresentativeUser: {
      firstName: 'Jacob',
      lastName: 'Jones',
      id: 1,
      avatar: '/avatars/jacob-jones.png',
    },
    date: '2024-01-15',
    time: '09:30 AM',
    purpose: 'Client visit - Downtown',
    streetAddress: '123 Main St, Downtown, New York, NY 10001',
    status: 'pending',
    amount: 45.5,
    type: 'daily_allowance',
  },
  {
    id: 2,
    salesRepresentativeUser: {
      firstName: 'Bessie',
      lastName: 'Cooper',
      id: 2,
      avatar: '/avatars/bessie-cooper.png',
    },
    date: '2024-01-15',
    time: '11:00 AM',
    purpose: 'Field work - North Zone',
    streetAddress: '456 Oak Ave, North Zone, Brooklyn, NY 11201',
    status: 'pending',
    amount: 75.0,
    type: 'travel_allowance',
  },
  {
    id: 3,
    salesRepresentativeUser: {
      firstName: 'Kristin',
      lastName: 'Watson',
      id: 3,
      avatar: '/avatars/kristin-watson.png',
    },
    date: '2024-01-15',
    time: '12:30 PM',
    purpose: 'Client lunch meeting',
    streetAddress: '789 Broadway, Midtown, New York, NY 10019',
    status: 'complete',
    amount: 120.0,
    type: 'meal_allowance',
  },
  {
    id: 4,
    salesRepresentativeUser: {
      firstName: 'Ronald',
      lastName: 'Richards',
      id: 4,
      avatar: '/avatars/ronald-richards.png',
    },
    date: '2024-01-15',
    time: '02:15 PM',
    purpose: 'Training session travel',
    streetAddress: '321 Training Center Blvd, Queens, NY 11354',
    status: 'pending',
    amount: 67.25,
    type: 'travel_allowance',
  },
  {
    id: 5,
    salesRepresentativeUser: {
      firstName: 'Annette',
      lastName: 'Black',
      id: 5,
      avatar: '/avatars/annette-black.png',
    },
    date: '2024-01-15',
    time: '03:45 PM',
    purpose: 'Training session travel',
    streetAddress: '654 Education St, Bronx, NY 10451',
    status: 'complete',
    amount: 45.5,
    type: 'travel_allowance',
  },
  {
    id: 6,
    salesRepresentativeUser: {
      firstName: 'Devon',
      lastName: 'Lane',
      id: 6,
      avatar: '/avatars/devon-lane.png',
    },
    date: '2024-01-15',
    time: '04:20 PM',
    purpose: 'Training session travel',
    streetAddress: '987 Conference Ave, Manhattan, NY 10016',
    status: 'pending',
    amount: 45.5,
    type: 'travel_allowance',
  },
  {
    id: 7,
    salesRepresentativeUser: {
      firstName: 'Arlene',
      lastName: 'McCoy',
      id: 7,
      avatar: '/avatars/arlene-mccoy.png',
    },
    date: '2024-01-15',
    time: '10:00 AM',
    purpose: 'Training session travel',
    streetAddress: '147 Corporate Plaza, Staten Island, NY 10301',
    status: 'complete',
    amount: 45.5,
    type: 'travel_allowance',
  },
  {
    id: 8,
    salesRepresentativeUser: {
      firstName: 'Eleanor',
      lastName: 'Pena',
      id: 8,
      avatar: '/avatars/eleanor-pena.png',
    },
    date: '2024-01-16',
    time: '08:30 AM',
    purpose: 'Client presentation - East Zone',
    streetAddress: '258 Business Center Dr, Long Island, NY 11747',
    status: 'pending',
    amount: 89.75,
    type: 'daily_allowance',
  },
  {
    id: 9,
    salesRepresentativeUser: {
      firstName: 'Guy',
      lastName: 'Hawkins',
      id: 9,
      avatar: '/avatars/guy-hawkins.png',
    },
    date: '2024-01-16',
    time: '01:00 PM',
    purpose: 'Office supplies purchase',
    streetAddress: '369 Supply Chain Rd, Yonkers, NY 10701',
    status: 'complete',
    amount: 32.25,
    type: 'miscellaneous',
  },
  {
    id: 10,
    salesRepresentativeUser: {
      firstName: 'Cody',
      lastName: 'Fisher',
      id: 10,
      avatar: '/avatars/cody-fisher.png',
    },
    date: '2024-01-16',
    time: '07:00 AM',
    purpose: 'Regional conference travel',
    streetAddress: '741 Convention Center Way, Albany, NY 12203',
    status: 'pending',
    amount: 156.0,
    type: 'travel_allowance',
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

// Mock users data
const mockUsers = [
  { id: '1', firstName: 'Jacob', lastName: 'Jones', roleId: '1' },
  { id: '2', firstName: 'Bessie', lastName: 'Cooper', roleId: '1' },
  { id: '3', firstName: 'Kristin', lastName: 'Watson', roleId: '2' },
  { id: '4', firstName: 'Ronald', lastName: 'Richards', roleId: '3' },
  { id: '5', firstName: 'Annette', lastName: 'Black', roleId: '1' },
  { id: '6', firstName: 'Devon', lastName: 'Lane', roleId: '4' },
  { id: '7', firstName: 'Arlene', lastName: 'McCoy', roleId: '2' },
  { id: '8', firstName: 'Eleanor', lastName: 'Pena', roleId: '5' },
  { id: '9', firstName: 'Guy', lastName: 'Hawkins', roleId: '3' },
  { id: '10', firstName: 'Cody', lastName: 'Fisher', roleId: '4' },
]

export default function DailyExpenses() {
  const [pagination, setPagination] = useState({
    page: DEFAULT_PAGE_NUMBER,
    limit: DEFAULT_PAGE_SIZE,
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
    searchFor: '',
    roleId: '',
    salesRepId: '',
  })

  const { watch, setValue } = useForm<FormData>({
    defaultValues: { roleId: '', salesRep: '', search: '' },
  })

  const onPaginationChange = (page: number, pageSize: number) => {
    setPagination((prev) => ({ ...prev, page, limit: pageSize }))
  }

  const [selectedDate, setSelectedDate] = useState<string>('')

  const handleDateChange = (newDate?: string) => {
    const value = newDate ?? new Date().toISOString().split('T')[0]
    setSelectedDate(value)
    setPagination((prev) => ({ ...prev, startDate: value, endDate: value }))
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
  const filteredExpenses = mockExpenses.filter((expense) => {
    const matchesDate = !selectedDate || expense.date === selectedDate
    const matchesSearch =
      !pagination.searchFor ||
      expense.purpose
        .toLowerCase()
        .includes(pagination.searchFor.toLowerCase()) ||
      `${expense.salesRepresentativeUser.firstName} ${expense.salesRepresentativeUser.lastName}`
        .toLowerCase()
        .includes(pagination.searchFor.toLowerCase()) ||
      expense.streetAddress
        .toLowerCase()
        .includes(pagination.searchFor.toLowerCase())
    const matchesRep =
      !selectedRep ||
      expense.salesRepresentativeUser.id.toString() === selectedRep

    return matchesDate && matchesSearch && matchesRep
  })

  // Pagination logic
  const startIndex = (pagination.page - 1) * pagination.limit
  const endIndex = startIndex + pagination.limit
  const paginatedExpenses = filteredExpenses.slice(startIndex, endIndex)

  const visits = paginatedExpenses
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
      key: 'date',
      type: 'date',
      onChange: handleDateChange,
      placeholder: 'Select date',
      value: selectedDate,
    },
    {
      key: 'search',
      type: 'search',
      onChange: handleGlobalSearchChange,
      placeholder: 'Search visits by purpose...',
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
      placeholder: 'Select salesRep',
      value: selectedRep,
      options: users,
    },
  ]

  return (
    <>
      <GlobalFilterSection key={'calender-view-filters'} filters={filters} />

      <DailyExpenseTable
        data={visits}
        totalCount={totalCount}
        loading={isLoading}
        currentPage={pagination.page}
        paginationCallbacks={{ onPaginationChange }}
      />
    </>
  )
}
