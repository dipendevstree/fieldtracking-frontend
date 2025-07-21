import { ColumnDef } from '@tanstack/react-table'
import { CustomDataTableColumnHeader } from '@/components/shared/custom-table-header-column'
import { DataTableRowActions } from './daily-expense-table-action-button'

export const columns: ColumnDef<any>[] = [
  {
    accessorKey: 'salesRep',
    header: ({ column }) => (
      <CustomDataTableColumnHeader column={column} title='Sales Rep' />
    ),
    cell: ({ row }) => {
      const user = row.original.salesRepresentativeUser
      const firstName = user?.firstName || ''
      const lastName = user?.lastName || ''
      const fullName =
        firstName || lastName ? `${firstName} ${lastName}`.trim() : '-'

      return (
        <div className='flex items-center gap-2'>
          <span className='text-sm font-medium'>{fullName}</span>
        </div>
      )
    },
    enableHiding: false,
  },
  {
    accessorKey: 'date',
    header: ({ column }) => (
      <CustomDataTableColumnHeader column={column} title='Date' />
    ),
    cell: ({ row }) => {
      const date = row.original.date || ''
      const formattedDate = date
        ? new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
          })
        : '-'
      return (
        <div className='text-muted-foreground text-sm'>{formattedDate}</div>
      )
    },
  },
  {
    accessorKey: 'amount',
    header: ({ column }) => (
      <CustomDataTableColumnHeader column={column} title='Amount' />
    ),
    cell: ({ row }) => {
      const amount = row.original.amount || 0
      const formattedAmount = `$${amount.toFixed(2)}`
      return <div className='text-sm font-medium'>{formattedAmount}</div>
    },
  },
  {
    accessorKey: 'description',
    header: ({ column }) => (
      <CustomDataTableColumnHeader column={column} title='Description' />
    ),
    cell: ({ row }) => {
      const description = row.original.description || ''
      return <div className='text-muted-foreground text-sm'>{description}</div>
    },
  },
  {
    accessorKey: 'status',
    header: ({ column }) => (
      <CustomDataTableColumnHeader column={column} title='Status' />
    ),
    cell: ({ row }) => {
      const status = row.original.status || ''
      const statusColor =
        status === 'complete' ? 'text-green-600' : 'text-red-600'
      const statusBg = status === 'complete' ? 'bg-green-100' : 'bg-red-100'

      return (
        <div
          className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${statusColor} ${statusBg}`}
        >
          <span
            className={`mr-1 h-2 w-2 rounded-full ${status === 'complete' ? 'bg-green-500' : 'bg-red-500'}`}
          ></span>
          {status === 'complete' ? 'Complete' : 'Pending'}
        </div>
      )
    },
  },
  {
    id: 'actions',
    header: ({ column }) => (
      <CustomDataTableColumnHeader column={column} title='Action' />
    ),
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
]
