import { ColumnDef } from '@tanstack/react-table'
import { CustomDataTable } from '@/components/shared/custom-data-table'
import { PaginationCallbacks } from '@/components/shared/custom-table-pagination'
import { useState, useMemo, useEffect } from 'react'
import { createColumns } from './columns'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
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

  // Clear selected rows when data changes (pagination, filtering, etc.)
  useEffect(() => {
    setSelectedRows(new Set())
  }, [data])

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
    if (selectedRows.size === data.length && data.length > 0) {
      // Deselect all
      setSelectedRows(new Set())
    } else {
      // Select all
      const allIds = new Set(data.map((item) => String(item.id)))
      setSelectedRows(allIds)
    }
  }

  // Check if all rows are selected
  const isAllSelected = useMemo(
    () => data && data.length > 0 && selectedRows.size === data.length,
    [selectedRows, data?.length]
  )

  // Create columns with selection handlers
  const columns = useMemo(
    () => createColumns(selectedRows, toggleRowSelection, toggleSelectAll, isAllSelected || false),
    [selectedRows, isAllSelected]
  )

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
            <Button disabled={!selectedRows.size} className="bg-green-600 text-white hover:bg-green-700">Approve</Button>
            <Button disabled={!selectedRows.size} className="bg-green-600 text-white hover:bg-green-700">Review</Button>
            <Button disabled={!selectedRows.size} variant="destructive">Reject</Button>
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
