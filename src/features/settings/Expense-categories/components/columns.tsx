import { ColumnDef } from '@tanstack/react-table'
import { CustomDataTableColumnHeader } from '@/components/shared/custom-table-header-column'
import { DataTableRowActions } from './table-action-button'
import { ExpenseCategory } from '../type/type'
import { Badge } from '@/components/ui/badge'

export const columns: ColumnDef<ExpenseCategory>[] = [
  {
    accessorKey: 'categoryName',
    header: ({ column }) => (
      <CustomDataTableColumnHeader column={column} title='Category Name' />
    ),
    cell: ({ row }) => {
      const categoryName = row.original.categoryName || ''
      return <div className='text-sm font-medium'>{categoryName}</div>
    },
    enableHiding: false,
  },
  {
    accessorKey: 'categoryType',
    header: ({ column }) => (
      <CustomDataTableColumnHeader column={column} title='Type' />
    ),
    cell: ({ row }) => {
      const categoryType = row.original.categoryType || ''
      const typeLabels = {
        'mileage': 'Mileage',
        'per-diem': 'Per Diem',
        'fixed-amount': 'Fixed Amount',
        'percentage': 'Percentage',
        'custom': 'Custom'
      }
      return <div className='text-sm'>{typeLabels[categoryType] || categoryType}</div>
    },
  },
  {
    accessorKey: 'defaultLimit',
    header: ({ column }) => (
      <CustomDataTableColumnHeader column={column} title='Default Limit' />
    ),
    cell: ({ row }) => {
      const defaultLimit = row.original.defaultLimit || 0
      const limitUnit = row.original.limitUnit || 'fixed'
      const unitLabels = {
        'per-mile': '/mile',
        'per-day': '/day',
        'per-meal': '/meal',
        'per-trip': '/trip',
        'fixed': ''
      }
      return (
        <div className='text-sm'>
          ${defaultLimit.toLocaleString()}{unitLabels[limitUnit]}
        </div>
      )
    },
  },
  {
    accessorKey: 'requiresReceipt',
    header: ({ column }) => (
      <CustomDataTableColumnHeader column={column} title='Requires Receipt' />
    ),
    cell: ({ row }) => {
      const requiresReceipt = row.original.requiresReceipt
      return (
        <Badge variant={requiresReceipt ? 'destructive' : 'secondary'}>
          {requiresReceipt ? 'Required' : 'Optional'}
        </Badge>
      )
    },
  },
  {
    accessorKey: 'isActive',
    header: ({ column }) => (
      <CustomDataTableColumnHeader column={column} title='Status' />
    ),
    cell: ({ row }) => {
      const isActive = row.original.isActive
      return (
        <Badge variant={isActive ? 'default' : 'secondary'}>
          {isActive ? 'Active' : 'Inactive'}
        </Badge>
      )
    },
  },
  {
    accessorKey: 'createdAt',
    header: ({ column }) => (
      <CustomDataTableColumnHeader column={column} title='Created Date' />
    ),
    cell: ({ row }) => {
      const createdAt = row.original.createdAt
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
  },
  {
    id: 'actions',
    header: ({ column }) => (
      <CustomDataTableColumnHeader column={column} title='Action' />
    ),
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
]
