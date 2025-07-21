import { ColumnDef } from '@tanstack/react-table'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { TableAvatar } from '@/components/shared/custom-profile-avatar'
import { CustomDataTableColumnHeader } from '@/components/shared/custom-table-header-column'
import { Merchant } from '../types'
import { DataTableRowActions } from './table-action-button'

export const columns: ColumnDef<Merchant>[] = [
  {
    accessorKey: 'profile_pic',
    header: ({ column }) => (
      <CustomDataTableColumnHeader column={column} title='Profile' />
    ),
    cell: ({ row }) => {
      return (
        <TableAvatar
          user={{
            name: row.getValue('name'),
            avatar: row.getValue('profile_pic'),
          }}
          className='h-10 w-10'
        />
      )
    },
    enableHiding: false,
    enableSorting: false,
  },
  {
    accessorKey: 'name',
    header: ({ column }) => (
      <CustomDataTableColumnHeader column={column} title='Name' />
    ),
    cell: ({ row }) => (
      <div className='font-medium capitalize'>{row.getValue('name')}</div>
    ),
    enableHiding: false,
  },
  {
    accessorKey: 'merchant_id',
    header: ({ column }) => (
      <CustomDataTableColumnHeader column={column} title='Merchant ID' />
    ),
    cell: ({ row }) => (
      <div className='font-medium capitalize'>
        {row.getValue('merchant_id')}
      </div>
    ),
    enableHiding: false,
  },
  {
    accessorKey: 'email',
    header: ({ column }) => (
      <CustomDataTableColumnHeader column={column} title='Email' />
    ),
    cell: ({ row }) => (
      <div className='text-muted-foreground'>{row.getValue('email')}</div>
    ),
  },
  {
    accessorKey: 'mobile',
    header: ({ column }) => (
      <CustomDataTableColumnHeader column={column} title='Phone' />
    ),
    cell: ({ row }) => (
      <div className='text-muted-foreground'>{row.getValue('mobile')}</div>
    ),
  },
  {
    accessorKey: 'status',
    header: ({ column }) => (
      <CustomDataTableColumnHeader column={column} title='Status' />
    ),
    cell: ({ row }) => (
      <Badge variant={row.getValue('status') ? 'default' : 'destructive'}>
        {row.getValue('status') ? 'Active' : 'Inactive'}
      </Badge>
    ),
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id) ? 'active' : 'inactive')
    },
  },
  {
    id: 'actions',
    header: ({ column }) => (
      <CustomDataTableColumnHeader column={column} title='Actions' />
    ),
    cell: DataTableRowActions,
    meta: {
      className: cn(
        'sticky right-0 bg-background cursor-pointer',
        'drop-shadow-[0_1px_2px_rgba(0,0,0,0.1)] dark:drop-shadow-[0_1px_2px_rgba(255,255,255,0.1)] lg:drop-shadow-none',
        'transition-colors duration-200 group-hover/row:bg-muted group-data-[state=selected]/row:bg-muted'
      ),
    },
    enableHiding: false,
    enableSorting: false,
  },
]
