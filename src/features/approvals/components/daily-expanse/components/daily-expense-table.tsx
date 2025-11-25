import { ColumnDef } from '@tanstack/react-table'
import { CustomDataTable } from '@/components/shared/custom-data-table'
import { PaginationCallbacks } from '@/components/shared/custom-table-pagination'
import { useState, useMemo, useEffect } from 'react'
import { createColumns } from './columns'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { userUpcomingVisitStoreState } from '@/features/approvals/store/upcoming-visits.store'
import { EXPENSE_STATUS } from '@/data/app.data'
interface DailyExpensesTableProps {
  data: any[]
  totalCount: number
  loading?: boolean
  paginationCallbacks: PaginationCallbacks
  currentPage?: number
  defaultPageSize?: number,
  pagination: any
}

const DailyExpenseTable = ({
  data,
  totalCount,
  loading,
  paginationCallbacks,
  currentPage,
  defaultPageSize,
  pagination: _pagination
}: DailyExpensesTableProps) => {
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set())
  const { setOpen, setSelectedIds, setCurrentRow } = userUpcomingVisitStoreState();
  const [selectableData, setSelectableData] = useState<any[]>([]);
  // Clear selected rows when data changes (pagination, filtering, etc.)
  useEffect(() => {
    setSelectedRows(new Set())
    data && setSelectableData(data?.filter((d) => d.isApprovalLevel))
  }, [data]);

  // Toggle individual row selection
  const toggleRowSelection = (rowId: string) => {
    setSelectedRows((prev) => {
      const updated = new Set(prev)
      if (updated.has(rowId)) {
        updated.delete(rowId)
      } else {
        updated.add(rowId)
      }
      return updated
    })
  }

  // Toggle select all
  const toggleSelectAll = () => {
    if (selectedRows.size === selectableData.length && selectableData.length > 0) {
      // Deselect all
      setSelectedRows(new Set())
    } else {
      // Select all
      const allIds = new Set(selectableData.map((item) => String(item.id)))
      setSelectedRows(allIds)
    }
  }

  // Check if all rows are selected
  const isAllSelected = useMemo(
    () => selectableData && selectableData.length > 0 && selectedRows.size === selectableData.length,
    [selectedRows, selectableData?.length]
  )

  // Create columns with selection handlers
  const columns = useMemo(
    () => {
      const hasSelectableRows = data?.some(
        (row) => row?.isApprovalLevel && !row?.updateAction
      )
      return createColumns(selectedRows, toggleRowSelection, toggleSelectAll, isAllSelected || false, hasSelectableRows)
    },
    [selectedRows, isAllSelected, data]
  )

  const handleActionOnExpense = (types: EXPENSE_STATUS[]) => {
    setSelectedIds(selectedRows);
    setCurrentRow({ actionType: types.join(",") });
    setOpen("action");
  }

  return (
    <>
      <Card className="p-4 gap-0">
        <div className="-mx-4 px-4 py-1 flex gap-2 justify-between">
          <div className="">
            <div className="text-2xl font-semibold">Bulk Action</div>
            <div className="text-sm font-normal text-muted-foreground">
              Select options to perform bulk action
            </div>
          </div>
          <div className="flex gap-2">
            <Button disabled={!selectedRows.size} className="bg-green-600 text-white hover:bg-green-700" onClick={() => handleActionOnExpense([EXPENSE_STATUS.APPROVED, EXPENSE_STATUS.REVIEWED])}>Approve/Review</Button>
            {/* <Button disabled={!selectedRows.size} className="bg-green-600 text-white hover:bg-green-700">Review</Button> */}
            <Button disabled={!selectedRows.size} variant="destructive" onClick={() => handleActionOnExpense([EXPENSE_STATUS.REJECT])}>Reject</Button>
          </div>
        </div>
      </Card>
      <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-y-0 lg:space-x-12'>
        <CustomDataTable
          paginationCallbacks={paginationCallbacks}
          loading={loading}
          data={data}
          currentPage={currentPage}
          columns={columns as ColumnDef<unknown>[]}
          totalCount={totalCount}
          key={'dailyExpense'}
          defaultPageSize={defaultPageSize}
        />
      </div>
    </>
  )
}

export default DailyExpenseTable
