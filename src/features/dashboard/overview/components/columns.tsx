import { ColumnDef } from '@tanstack/react-table'
import { CustomDataTableColumnHeader } from '@/components/shared/custom-table-header-column'
import { DataTableRowActions } from './table-action-button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { SalesRep } from '../type/type'

export const columns: ColumnDef<SalesRep>[] = [
  {
    accessorKey: 'name',
    header: ({ column }) => (
      <CustomDataTableColumnHeader column={column} title='Sales Rep' />
    ),
    cell: ({ row }) => {
      const salesRep = row.original
      return (
        <div className="flex items-center space-x-3">
          <Avatar>
            <AvatarImage src={salesRep.avatar || "/placeholder.svg"} alt={salesRep.name} />
            <AvatarFallback>
              {salesRep.name
                .split(" ")
                .map((n: string) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">{salesRep.name}</p>
            <p className="text-sm text-muted-foreground">{salesRep.email}</p>
          </div>
        </div>
      )
    },
    enableHiding: false,
  },
  {
    accessorKey: 'status',
    header: ({ column }) => (
      <CustomDataTableColumnHeader column={column} title='Status' />
    ),
    cell: ({ row }) => {
      const status = row.original.status || 'offline'
      const isOnline = row.original.isOnline
      const getStatusVariant = (status: string, isOnline: boolean) => {
        if (!isOnline) return 'secondary'
        switch (status) {
          case 'active':
            return 'default'
          case 'idle':
            return 'outline'
          case 'on_break':
            return 'secondary'
          default:
            return 'secondary'
        }
      }
      return (
        <Badge variant={getStatusVariant(status, isOnline)} className='capitalize'>
          {isOnline ? status.replace('_', ' ') : 'offline'}
        </Badge>
      )
    },
  },
  {
    accessorKey: 'location',
    header: ({ column }) => (
      <CustomDataTableColumnHeader column={column} title='Location' />
    ),
    cell: ({ row }) => {
      const location = row.original.location || 'Unknown'
      return <div className='text-sm'>{location}</div>
    },
  },
  {
    accessorKey: 'todayVisits',
    header: ({ column }) => (
      <CustomDataTableColumnHeader column={column} title="Today's Visits" />
    ),
    cell: ({ row }) => {
      const visits = row.original.todayVisits || 0
      return <div className='text-sm font-medium'>{visits}</div>
    },
  },
  {
    accessorKey: 'todayRevenue',
    header: ({ column }) => (
      <CustomDataTableColumnHeader column={column} title="Today's Revenue" />
    ),
    cell: ({ row }) => {
      const revenue = row.original.todayRevenue || 0
      return (
        <div className='text-sm font-medium'>
          ${revenue.toLocaleString()}
        </div>
      )
    },
  },
  {
    accessorKey: 'lastSeen',
    header: ({ column }) => (
      <CustomDataTableColumnHeader column={column} title='Last Seen' />
    ),
    cell: ({ row }) => {
      const lastSeen = row.original.lastSeen
      return (
        <div className='text-muted-foreground text-sm'>{lastSeen}</div>
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
