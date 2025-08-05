import { ColumnDef } from '@tanstack/react-table'
import { CustomDataTableColumnHeader } from '@/components/shared/custom-table-header-column'
import { DataTableRowActions } from './table-action-button'
import { Badge } from '@/components/ui/badge'
import { LiveTrackingUser } from '../type/type'

export const columns: ColumnDef<LiveTrackingUser>[] = [
  {
    accessorKey: 'fullName',
    header: ({ column }) => (
      <CustomDataTableColumnHeader column={column} title='Employee' />
    ),
    cell: ({ row }) => {
      const fullName = row.original.fullName || `${row.original.firstName} ${row.original.lastName}`.trim()
      return <div className='text-sm font-medium'>{fullName}</div>
    },
    enableHiding: false,
  },
  {
    accessorKey: 'roleName',
    header: ({ column }) => (
      <CustomDataTableColumnHeader column={column} title='Role' />
    ),
    cell: ({ row }) => {
      const roleName = row.original.roleName || ''
      return <div className='text-sm'>{roleName}</div>
    },
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
    accessorKey: 'activityStatus',
    header: ({ column }) => (
      <CustomDataTableColumnHeader column={column} title='Activity' />
    ),
    cell: ({ row }) => {
      const activityStatus = row.original.activityStatus || 'offline'
      const getActivityVariant = (activityStatus: string) => {
        switch (activityStatus) {
          case 'working':
            return 'default'
          case 'traveling':
            return 'outline'
          case 'at_customer':
            return 'secondary'
          case 'break':
            return 'destructive'
          default:
            return 'secondary'
        }
      }
      return (
        <Badge variant={getActivityVariant(activityStatus)} className='capitalize'>
          {activityStatus.replace('_', ' ')}
        </Badge>
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
      const formattedTime = lastSeen
        ? new Date(lastSeen).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
          })
        : '-'
      return (
        <div className='text-muted-foreground text-sm'>{formattedTime}</div>
      )
    },
  },
  {
    accessorKey: 'currentLocation',
    header: ({ column }) => (
      <CustomDataTableColumnHeader column={column} title='Location' />
    ),
    cell: ({ row }) => {
      const location = row.original.currentLocation
      if (!location) {
        return <div className='text-muted-foreground text-sm'>No location</div>
      }
      return (
        <div className='text-sm'>
          {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
        </div>
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
