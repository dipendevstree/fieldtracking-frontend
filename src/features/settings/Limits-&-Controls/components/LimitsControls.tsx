import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Search } from "lucide-react"
import { LimitsControlsTable } from "./LimitsControlsTable"
import { PaginationCallbacks } from "@/components/shared/custom-table-pagination"
import { getExpenseLimitColumns } from "./columns"
import { ExpenseLimit, LocationAdjustment } from "../type/type"
import { useLimitsControlsStore } from "../store/limits-&-controls.store"

interface LimitsControlsProps {
  expenseLimits: ExpenseLimit[]
  locationAdjustments: LocationAdjustment[]
  totalCount: number
  loading?: boolean
  paginationCallbacks?: PaginationCallbacks
  currentPage?: number
  onSearchChange?: (value: string) => void
}

export default function LimitsControls({
  expenseLimits,
  totalCount,
  loading,
  paginationCallbacks,
  currentPage,
  onSearchChange,
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
      
      {/* Search and Add Button Row */}
      <div className="flex items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search expense limits..."
            className="pl-10"
            onChange={(e) => onSearchChange?.(e.target.value)}
          />
        </div>
        <Button onClick={handleAddExpenseLimit}>
          <Plus className="h-4 w-4 mr-2" />
          Add Limit
        </Button>
      </div>

      {/* Table */}
      <LimitsControlsTable
        data={expenseLimits}
        columns={expenseLimitColumns}
        totalCount={totalCount}
        loading={loading}
        currentPage={currentPage}
        paginationCallbacks={paginationCallbacks}
        defaultPageSize={10}
      />
    </div>
  )
}