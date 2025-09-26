import { ColumnDef } from '@tanstack/react-table'
import { CustomDataTableColumnHeader } from '@/components/shared/custom-table-header-column'

export const columns = (currency: string): ColumnDef<any>[] => [
  {
    accessorKey: 'salesRepName',
    header: ({ column }) => (
      <CustomDataTableColumnHeader column={column} title='Sales Reps' />
    ),
    cell: ({ row }) => {
      const salesRepName = row.original.salesRepName || '-'

      // Debug log to see the sales rep data
      console.log('Sales Rep Data:', {
        original: row.original,
        salesRepName
      })

      return (
        <div className='flex items-center gap-2'>
          <span className='text-sm font-medium'>{salesRepName}</span>
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
      // Convert to number and handle both string and number types
      const numericAmount = typeof amount === 'string' ? parseFloat(amount) || 0 : Number(amount) || 0
      const formattedAmount = `${currency}${numericAmount.toFixed(0)}`
      
      // Debug log to see the data
      console.log('Daily Expense Data:', {
        original: amount,
        type: typeof amount,
        numeric: numericAmount,
        formatted: formattedAmount
      })
      
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
      // Convert to number and handle both string and number types
      const numericAmount = typeof amount === 'string' ? parseFloat(amount) || 0 : Number(amount) || 0
      const formattedAmount = `${currency}${numericAmount.toFixed(0)}`
      
      // Debug log to see the data
      console.log('Travel Expense Data:', {
        original: amount,
        type: typeof amount,
        numeric: numericAmount,
        formatted: formattedAmount
      })
      
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
      // Convert to number and handle both string and number types
      const numericAmount = typeof amount === 'string' ? parseFloat(amount) || 0 : Number(amount) || 0
      const formattedAmount = `${currency}${numericAmount.toFixed(0)}`
      
      // Debug log to see the data
      console.log('Grand Total Data:', {
        original: amount,
        type: typeof amount,
        numeric: numericAmount,
        formatted: formattedAmount
      })
      
      return <div className='text-sm font-medium'>{formattedAmount}</div>
    },
    enableSorting: false,
  },
]
