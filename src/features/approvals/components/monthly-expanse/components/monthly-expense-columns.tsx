import { ColumnDef } from '@tanstack/react-table'
import { CustomDataTableColumnHeader } from '@/components/shared/custom-table-header-column'
// import { DataTableRowActions } from './monthly-expense-table-action-button'


export const columns: ColumnDef<any>[] = [
  {
    accessorKey: 'salesRep',
    header: ({ column }) => (
      <CustomDataTableColumnHeader column={column} title='Sales Reps' />
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
    enableSorting: false,
  },
  {
    accessorKey: 'dailyExpenseTotal',
    header: ({ column }) => (
      <CustomDataTableColumnHeader
        column={column}
        title='Daily Expense Total'
      />
    ),
    cell: ({ row }) => {
      const amount = row.original.dailyExpenseTotal || 0
      const formattedAmount = `$${amount.toFixed(0)}`
      return <div className='text-sm font-medium'>{formattedAmount}</div>
    },
    enableSorting: false,
  },
  {
    accessorKey: 'travelExpenseTotal',
    header: ({ column }) => (
      <CustomDataTableColumnHeader
        column={column}
        title='Travel Expense Total'
      />
    ),
    cell: ({ row }) => {
      const amount = row.original.travelExpenseTotal || 0
      const formattedAmount = `$${amount.toFixed(0)}`
      return <div className='text-sm font-medium'>{formattedAmount}</div>
    },
    enableSorting: false,
  },
  {
    accessorKey: 'grandTotal',
    header: ({ column }) => (
      <CustomDataTableColumnHeader column={column} title='Grand Total' />
    ),
    cell: ({ row }) => {
      const amount = row.original.grandTotal || 0
      const formattedAmount = `$${amount.toFixed(0)}`
      return <div className='text-sm font-medium'>{formattedAmount}</div>
    },
    enableSorting: false,
  },
  // {
  //   accessorKey: 'status',
  //   header: ({ column }) => (
  //     <CustomDataTableColumnHeader column={column} title='Status' />
  //   ),
  //   cell: ({ row }) => {
  //     const status = row.original.status || ''

  //     let statusColor = 'text-gray-600'
  //     let statusBg = 'bg-gray-100'
  //     let statusText = status
  //     let dotColor = 'bg-gray-500'

  //     switch (status) {
  //       case 'pending':
  //         statusColor = 'text-red-600'
  //         statusBg = 'bg-red-100'
  //         statusText = 'Pending'
  //         dotColor = 'bg-red-500'
  //         break
  //       case 'partially_approved':
  //         statusColor = 'text-yellow-600'
  //         statusBg = 'bg-yellow-100'
  //         statusText = 'Partially Approved'
  //         dotColor = 'bg-yellow-500'
  //         break
  //       case 'approved':
  //         statusColor = 'text-green-600'
  //         statusBg = 'bg-green-100'
  //         statusText = 'Approved'
  //         dotColor = 'bg-green-500'
  //         break
  //       case 'complete':
  //         statusColor = 'text-blue-600'
  //         statusBg = 'bg-blue-100'
  //         statusText = 'Complete'
  //         dotColor = 'bg-blue-500'
  //         break
  //       default:
  //         statusText = status
  //     }

  //     return (
  //       <div
  //         className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${statusColor} ${statusBg}`}
  //       >
  //         <span className={`mr-1 h-2 w-2 rounded-full ${dotColor}`}></span>
  //         {statusText}
  //       </div>
  //     )
  //   },
  //   enableSorting: false,
  // },
  // {
  //   id: 'actions',
  //   header: ({ column }) => (
  //     <CustomDataTableColumnHeader column={column} title='Action' />
  //   ),
  //   cell: ({ row }) => <DataTableRowActions row={row} />,
  // },
]
