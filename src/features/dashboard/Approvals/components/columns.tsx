import { ColumnDef } from '@tanstack/react-table'
import { CustomDataTableColumnHeader } from '@/components/shared/custom-table-header-column'
import { DataTableRowActions } from './table-action-button'
import { Badge } from '@/components/ui/badge'
import { Approval } from '../type/type'

export const columns: ColumnDef<Approval>[] = [
  {
    accessorKey: 'type',
    header: ({ column }) => (
      <CustomDataTableColumnHeader column={column} title='Type' />
    ),
    cell: ({ row }) => {
      const type = row.original.type || ''
      return <div className='text-sm font-medium capitalize'>{type}</div>
    },
    enableHiding: false,
  },
  {
    accessorKey: 'employeeName',
    header: ({ column }) => (
      <CustomDataTableColumnHeader column={column} title='Employee' />
    ),
    cell: ({ row }) => {
      const employeeName = row.original.employeeName || ''
      return <div className='text-sm font-medium'>{employeeName}</div>
    },
  },
  {
    accessorKey: 'amount',
    header: ({ column }) => (
      <CustomDataTableColumnHeader column={column} title='Amount' />
    ),
    cell: ({ row }) => {
      const amount = row.original.amount || 0
      const currency = row.original.currency || 'USD'
      return (
        <div className='text-sm font-medium'>
          {currency} {amount.toFixed(2)}
        </div>
      )
    },
  },
  {
    accessorKey: 'status',
    header: ({ column }) => (
      <CustomDataTableColumnHeader column={column} title='Status' />
    ),
    cell: ({ row }) => {
      const status = row.original.status || 'pending'
      const getStatusVariant = (status: string) => {
        switch (status) {
          case 'approved':
            return 'default'
          case 'rejected':
            return 'destructive'
          case 'under_review':
            return 'secondary'
          default:
            return 'outline'
        }
      }
      return (
        <Badge variant={getStatusVariant(status)} className='capitalize'>
          {status.replace('_', ' ')}
        </Badge>
      )
    },
  },
  {
    accessorKey: 'priority',
    header: ({ column }) => (
      <CustomDataTableColumnHeader column={column} title='Priority' />
    ),
    cell: ({ row }) => {
      const priority = row.original.priority || 'medium'
      const getPriorityVariant = (priority: string) => {
        switch (priority) {
          case 'high':
            return 'destructive'
          case 'medium':
            return 'secondary'
          default:
            return 'outline'
        }
      }
      return (
        <Badge variant={getPriorityVariant(priority)} className='capitalize'>
          {priority}
        </Badge>
      )
    },
  },
  {
    accessorKey: 'submittedDate',
    header: ({ column }) => (
      <CustomDataTableColumnHeader column={column} title='Submitted Date' />
    ),
    cell: ({ row }) => {
      const submittedDate = row.original.submittedDate
      const formattedDate = submittedDate
        ? new Date(submittedDate).toLocaleDateString('en-US', {
            month: 'short',
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
      <CustomDataTableColumnHeader column={column} title='Actions' />
    ),
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
]
