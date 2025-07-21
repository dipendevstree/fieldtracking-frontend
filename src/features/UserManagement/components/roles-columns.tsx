import { ColumnDef } from '@tanstack/react-table'
import { CustomDataTableColumnHeader } from '@/components/shared/custom-table-header-column'
import { DataTableRowActions } from './roles-table-action-button'

export const columns: ColumnDef<any>[] = [
  {
    accessorKey: 'roleName',
    header: ({ column }) => (
      <CustomDataTableColumnHeader column={column} title='Role Name' />
    ),
    cell: ({ row }) => {
      const roleName = row.original.roleName || row.original.name || '-'
      return <div className='text-sm font-medium'>{roleName}</div>
    },
    enableHiding: false,
  },
  {
    accessorKey: 'users',
    header: ({ column }) => (
      <CustomDataTableColumnHeader column={column} title='Users' />
    ),
    cell: ({ row }) => {
      const usersCount =
        row.original.userCount ||
        (Array.isArray(row.original.users) ? row.original.users.length : 0)
      return <div className='text-sm'>{usersCount} users</div>
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
