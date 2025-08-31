import { ColumnDef } from '@tanstack/react-table'
import { Badge } from '@/components/ui/badge'
import { CustomDataTableColumnHeader } from '@/components/shared/custom-table-header-column'
import { DataTableRowActions } from './table-action-button'

export const columns: ColumnDef<any>[] = [
  {
    accessorKey: 'organizationName',
    header: ({ column }) => (
      <CustomDataTableColumnHeader column={column} title='Organization' />
    ),
    cell: ({ row }) => {
      const orgName = row.original.organizationName
      const empRange = row.original.employeeRang?.employeeRange ?? '-'
      return (
        <div className='font-medium'>
          <div>{orgName}</div>
          <div className='text-muted-foreground text-xs'>{empRange}</div>
        </div>
      )
    },
    enableHiding: false,
  },
  {
    accessorKey: 'adminUserId',
    header: ({ column }) => (
      <CustomDataTableColumnHeader column={column} title='Admin Contact' />
    ),
    cell: ({ row }) => {
      const admin = row.original.adminData
      return (
        <div>
          <div className='font-semibold'>
            {admin?.firstName} {admin?.lastName}
          </div>
          <div className='text-muted-foreground text-xs'>{admin?.email}</div>
        </div>
      )
    },
    enableHiding: false,
  },
  {
    accessorKey: 'industry.industryName',
    header: ({ column }) => (
      <CustomDataTableColumnHeader column={column} title='Industry' />
    ),
    cell: ({ row }) => {
      return <div>{row.original.industry?.industryName ?? '-'}</div>
    },
    enableHiding: false,
  },
  {
    accessorKey: 'userCount',
    header: ({ column }) => (
      <CustomDataTableColumnHeader column={column} title='Users' />
    ),
    cell: ({ row }) => <div>{row.original.userCount ?? 0}</div>,
    enableHiding: false,
  },
  {
    accessorKey: 'isActive',
    header: ({ column }) => (
      <CustomDataTableColumnHeader column={column} title='Status' />
    ),
    cell: ({ row }) => {
      const isActive = row.original.isActive
      return (
        <Badge variant='default' className='bg-black text-white capitalize'>
          {isActive ? 'active' : 'inactive'}
        </Badge>
      )
    },
    enableHiding: false,
  },
  {
    accessorKey: 'createdDate',
    header: ({ column }) => (
      <CustomDataTableColumnHeader column={column} title='Created' />
    ),
    cell: ({ row }) => {
      const rawDate = row.original.createdDate
      const formattedDate = new Date(rawDate).toLocaleDateString('en-US')
      return <div className='text-muted-foreground'>{formattedDate}</div>
    },
    enableHiding: false,
  },
  {
    id: 'actions',
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
]
