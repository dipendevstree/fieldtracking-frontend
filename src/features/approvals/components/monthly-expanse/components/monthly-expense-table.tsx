import { ColumnDef } from '@tanstack/react-table'
import { CustomDataTable } from '@/components/shared/custom-data-table'
import { PaginationCallbacks } from '@/components/shared/custom-table-pagination'
import { columns } from './monthly-expense-columns'
import { useAuthStore } from '@/stores/use-auth-store'

interface MonthlyExpensesTableProps {
  data: any[]
  totalCount: number
  loading?: boolean
  paginationCallbacks: PaginationCallbacks
  currentPage?: number
}

const MonthlyExpenseTable = ({
  data,
  totalCount,
  loading,
  paginationCallbacks,
  currentPage,
}: MonthlyExpensesTableProps) => {
  const { user } = useAuthStore();
  return (
    <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-y-0 lg:space-x-12'>
      <CustomDataTable
        paginationCallbacks={paginationCallbacks}
        loading={loading}
        data={data}
        currentPage={currentPage}
        columns={columns(user?.organization?.currency) as ColumnDef<unknown>[]}
        totalCount={totalCount}
        key={'monthlyExpense'}
      />
    </div>
  )
}

export default MonthlyExpenseTable
