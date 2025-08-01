import { ColumnDef } from '@tanstack/react-table'
import { CustomDataTableColumnHeader } from '@/components/shared/custom-table-header-column'
import { DataTableRowActions } from './table-action-button'
import { ApprovalHierarchy, CategoryApprover } from '../type/type'

// Hierarchy columns
export const hierarchyColumns: ColumnDef<ApprovalHierarchy>[] = [
  {
    accessorKey: 'level',
    header: ({ column }) => (
      <CustomDataTableColumnHeader column={column} title='Level' />
    ),
    cell: ({ row }) => {
      const level = row.original.level || ''
      return <div className='text-sm font-medium'>Level {level}</div>
    },
    enableHiding: false,
  },
  {
    accessorKey: 'amountRange',
    header: ({ column }) => (
      <CustomDataTableColumnHeader column={column} title='Amount Range' />
    ),
    cell: ({ row }) => {
      const range = row.original.amountRange
      const min = range?.min || 0
      const max = range?.max || 0
      return (
        <div className='text-sm'>
          ${min.toLocaleString()} - ${max.toLocaleString()}
        </div>
      )
    },
  },
  {
    accessorKey: 'approverRole',
    header: ({ column }) => (
      <CustomDataTableColumnHeader column={column} title='Approver Role' />
    ),
    cell: ({ row }) => {
      const role = row.original.approverRole || ''
      return <div className='text-sm font-medium'>{role}</div>
    },
  },
  {
    accessorKey: 'isRequired',
    header: ({ column }) => (
      <CustomDataTableColumnHeader column={column} title='Required' />
    ),
    cell: ({ row }) => {
      const isRequired = row.original.isRequired
      return (
        <div className={`text-sm ${isRequired ? 'text-green-600' : 'text-gray-500'}`}>
          {isRequired ? 'Yes' : 'No'}
        </div>
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
    cell: ({ row }) => <DataTableRowActions row={row} type="hierarchy" />,
  },
]

// Category approver columns
export const categoryApproverColumns: ColumnDef<CategoryApprover>[] = [
  {
    accessorKey: 'categoryName',
    header: ({ column }) => (
      <CustomDataTableColumnHeader column={column} title='Category' />
    ),
    cell: ({ row }) => {
      const categoryName = row.original.categoryName || ''
      return <div className='text-sm font-medium'>{categoryName}</div>
    },
    enableHiding: false,
  },
  {
    accessorKey: 'approverRole',
    header: ({ column }) => (
      <CustomDataTableColumnHeader column={column} title='Approver Role' />
    ),
    cell: ({ row }) => {
      const role = row.original.approverRole || ''
      return <div className='text-sm font-medium'>{role}</div>
    },
  },
  {
    accessorKey: 'description',
    header: ({ column }) => (
      <CustomDataTableColumnHeader column={column} title='Description' />
    ),
    cell: ({ row }) => {
      const description = row.original.description || ''
      return <div className='text-sm text-muted-foreground'>{description}</div>
    },
  },
  {
    accessorKey: 'isEnabled',
    header: ({ column }) => (
      <CustomDataTableColumnHeader column={column} title='Status' />
    ),
    cell: ({ row }) => {
      const isEnabled = row.original.isEnabled
      return (
        <div className={`text-sm ${isEnabled ? 'text-green-600' : 'text-gray-500'}`}>
          {isEnabled ? 'Enabled' : 'Disabled'}
        </div>
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
    cell: ({ row }) => <DataTableRowActions row={row} type="category" />,
  },
]
