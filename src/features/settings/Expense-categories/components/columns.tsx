import { ColumnDef } from '@tanstack/react-table'
import { CustomDataTableColumnHeader } from '@/components/shared/custom-table-header-column'
import { DataTableRowActions } from './table-action-button'

export const columns: ColumnDef<any>[] = [
  {
    accessorKey: 'categoryName',
    header: ({ column }) => (
      <CustomDataTableColumnHeader column={column} title='Category Name' />
    ),
    enableHiding: false,
    enableSorting: false,
  },
  {
    accessorKey: 'createdDate',
    header: ({ column }) => (
      <CustomDataTableColumnHeader column={column} title='Created Date' />
    ),
    cell: ({ row }) => {
      const createdAt = row.original.createdAt || row.original.createdDate
      const formattedDate = createdAt
        ? new Date(createdAt).toLocaleDateString('en-US', {
            month: 'numeric',
            day: 'numeric',
            year: 'numeric',
          })
        : '-'
      return (
        <div className='text-muted-foreground text-sm'>{formattedDate}</div>
      )
    },
    enableSorting: false,
  },
  {
    id: 'actions',
    header: ({ column }) => (
      <CustomDataTableColumnHeader column={column} title='Action' />
    ),
    cell: ({ row }) => <DataTableRowActions row={row} />,
    enableSorting: false,
  },
]
