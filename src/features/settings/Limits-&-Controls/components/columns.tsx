import { ColumnDef } from '@tanstack/react-table'
import { CustomDataTableColumnHeader } from '@/components/shared/custom-table-header-column'
import { Edit, Trash2 } from 'lucide-react'
import { ExpenseLimit, LocationAdjustment } from '../type/type'
import { Badge } from '@/components/ui/badge'

// Expense Limit Columns
export const getExpenseLimitColumns = (
  onEdit: (limit: ExpenseLimit) => void,
  onDelete: (limit: ExpenseLimit) => void
): ColumnDef<ExpenseLimit>[] => [
  {
    accessorKey: 'designation',
    header: ({ column }) => (
      <CustomDataTableColumnHeader column={column} title='Designation' />
    ),
    cell: ({ row }) => (
      <div className="font-medium">{row.original.designation}</div>
    ),
    enableSorting: false,
  },
  {
    accessorKey: 'dailyLimit',
    header: ({ column }) => (
      <CustomDataTableColumnHeader column={column} title='Daily Limit' />
    ),
    cell: ({ row }) => (
      <div className="text">${row.original.dailyLimit.toLocaleString()}</div>
    ),
    meta: {
      className: 'text',
    },
    enableSorting: false,
  },
  {
    accessorKey: 'monthlyLimit',
    header: ({ column }) => (
      <CustomDataTableColumnHeader column={column} title='Monthly Limit' />
    ),
    cell: ({ row }) => (
      <div className="text">${row.original.monthlyLimit.toLocaleString()}</div>
    ),
    meta: {
      className: 'text',
    },
    enableSorting: false,
  },
  {
    accessorKey: 'travelLimit',
    header: ({ column }) => (
      <CustomDataTableColumnHeader column={column} title='Travel Limit' />
    ),
    cell: ({ row }) => (
        <div className="text">${row.original.travelLimit}/mile</div>
    ),
    meta: {
      className: 'text',
    },
    enableSorting: false,
  },
  {
    accessorKey: 'isActive',
    header: ({ column }) => (
      <CustomDataTableColumnHeader column={column} title='Status' />
    ),
    cell: ({ row }) => (
      <Badge variant={row.original.isActive ? 'default' : 'secondary'}>
        {row.original.isActive ? 'Active' : 'Inactive'}
      </Badge>
    ),
    enableSorting: false,
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <div
          className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-8 w-8 p-0 cursor-pointer"
          onClick={() => onEdit(row.original)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              onEdit(row.original)
            }
          }}
        >
          <Edit className="h-4 w-4" />
        </div>
        <div
          className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-8 w-8 p-0 cursor-pointer"
          onClick={() => onDelete(row.original)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              onDelete(row.original)
            }
          }}
        >
          <Trash2 className="h-4 w-4" />
        </div>
      </div>
    ),
    enableSorting: false,
  },
]

// Location Adjustment Columns
export const getLocationAdjustmentColumns = (
  onEdit: (adjustment: LocationAdjustment) => void,
  onDelete: (adjustment: LocationAdjustment) => void
): ColumnDef<LocationAdjustment>[] => [
  {
    accessorKey: 'locationType',
    header: ({ column }) => (
      <CustomDataTableColumnHeader column={column} title='Location Type' />
    ),
    cell: ({ row }) => (
      <div className="capitalize">{row.original.locationType}</div>
    ),
    enableSorting: false,
  },
  {
    accessorKey: 'adjustmentPercentage',
    header: ({ column }) => (
      <CustomDataTableColumnHeader column={column} title='Adjustment %' />
    ),
    cell: ({ row }) => (
      <div className={`text ${row.original.adjustmentPercentage >= 0 ? 'text-green-600' : 'text-red-600'}`}>
        {row.original.adjustmentPercentage >= 0 ? '+' : ''}{row.original.adjustmentPercentage}%
      </div>
    ),
    meta: {
      className: 'text',
    },
  },
  {
    accessorKey: 'isActive',
    header: ({ column }) => (
      <CustomDataTableColumnHeader column={column} title='Status' />
    ),
    cell: ({ row }) => (
      <Badge variant={row.original.isActive ? 'default' : 'secondary'}>
        {row.original.isActive ? 'Active' : 'Inactive'}
      </Badge>
    ),
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <div
          className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-8 w-8 p-0 cursor-pointer"
          onClick={() => onEdit(row.original)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              onEdit(row.original)
            }
          }}
        >
          <Edit className="h-4 w-4" />
        </div>
        <div
          className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-8 w-8 p-0 cursor-pointer"
          onClick={() => onDelete(row.original)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              onDelete(row.original)
            }
          }}
        >
          <Trash2 className="h-4 w-4" />
        </div>
      </div>
    ),
  },
] 