import { ColumnDef } from '@tanstack/react-table'
import { CustomDataTable } from '@/components/shared/custom-data-table'
import { PaginationCallbacks } from '@/components/shared/custom-table-pagination'
import { ExpenseCategory } from '../type/type'
import { columns } from './columns'
import { Button } from '@/components/ui/button'
import { PlusIcon } from 'lucide-react'
import { useExpenseCategoriesStore } from '../store/expense-categories.store'
import { ExpenseCategoryActionModal } from './action-form-modal'

interface ExpenseCategoryTableProps {
  data: ExpenseCategory[]
  totalCount: number
  loading?: boolean
  paginationCallbacks: PaginationCallbacks
  currentPage?: number
}

const ExpenseCategoryTable = ({
  data,
  totalCount,
  loading,
  paginationCallbacks,
  currentPage,
}: ExpenseCategoryTableProps) => {
  const { setOpen } = useExpenseCategoriesStore()

  const handleAddExpenseCategory = () => {
    setOpen('add-category')
  }

  return (
    <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-y-0 lg:space-x-12'>
      <div className="flex justify-end mb-4">
        <Button 
          onClick={handleAddExpenseCategory} 
          className="flex items-center gap-1"
          disabled={loading}
        >
          <PlusIcon className="h-4 w-4" />
          Add Expense Category
        </Button>
      </div>
      <CustomDataTable
        paginationCallbacks={paginationCallbacks}
        loading={loading}
        data={data}
        currentPage={currentPage}
        columns={columns as ColumnDef<unknown>[]}
        totalCount={totalCount}
        key={'expense-category'}
      />
      <ExpenseCategoryActionModal key={'expense-category-action-modal'} />
    </div>
  )
}

export default ExpenseCategoryTable
