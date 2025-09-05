import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { LimitsControlsTable } from "./LimitsControlsTable"
import { PaginationCallbacks } from "@/components/shared/custom-table-pagination"
import { getExpenseLimitColumns } from "./columns"
import { ExpenseLimit } from "../type/type"
import { useLimitsControlsStore } from "../store/limits-&-controls.store"
import { FilterConfig } from "@/components/global-filter-section"
import GlobalFilterSection from "@/components/global-table-filter-section"

interface LimitsControlsProps {
  expenseLimits: ExpenseLimit[]
  totalCount: number
  loading?: boolean
  paginationCallbacks?: PaginationCallbacks
  currentPage?: number
  filters?: FilterConfig[]
  onSearchChange?: (searchValue: string) => void
}

export default function LimitsControls({
  expenseLimits,
  totalCount,
  loading,
  paginationCallbacks,
  currentPage,
  filters,
}: LimitsControlsProps) {
  const { setOpen, setCurrentLimit } = useLimitsControlsStore()

  const handleAddExpenseLimit = () => {
    setCurrentLimit(null)
    setOpen('add-limit')
  }

  const handleEditExpenseLimit = (limit: ExpenseLimit) => {
    setCurrentLimit(limit)
    setOpen('edit-limit')
  }

  const handleDeleteExpenseLimit = (limit: ExpenseLimit) => {
    setCurrentLimit(limit)
    setOpen('delete-limit')
  }

  const expenseLimitColumns = getExpenseLimitColumns(
    handleEditExpenseLimit,
    handleDeleteExpenseLimit
  )

  return (
    <div className="space-y-6">
      
      {/* Header, Search, and Add Button Card */}
      <div className="bg-white rounded-lg border p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">Expense Limits & Controls</h1>
          <Button onClick={handleAddExpenseLimit}>
            <Plus className="h-4 w-4 mr-2" />
            Add Limit
          </Button>
        </div>
        
        {/* Search Section */}
        {filters && (
          <GlobalFilterSection key={'limits-controls-filters'} filters={filters} />
        )}
      </div>

      {/* Table */}
      <LimitsControlsTable
        data={expenseLimits}
        columns={expenseLimitColumns}
        totalCount={totalCount}
        loading={loading}
        currentPage={currentPage}
        paginationCallbacks={paginationCallbacks}
      
      />
    </div>
  )
}