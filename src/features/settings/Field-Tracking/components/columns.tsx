import { ColumnDef } from '@tanstack/react-table'
import { CustomDataTableColumnHeader } from '@/components/shared/custom-table-header-column'
import { DataTableRowActions } from './table-action-button'
import { TrackingRule, GeofenceZone } from '../type/type'
import { Badge } from '@/components/ui/badge'

// Tracking Rule columns
export const trackingRuleColumns: ColumnDef<TrackingRule>[] = [
  {
    accessorKey: 'ruleName',
    header: ({ column }) => (
      <CustomDataTableColumnHeader column={column} title='Rule Name' />
    ),
    cell: ({ row }) => {
      const ruleName = row.original.ruleName || ''
      return <div className='text-sm font-medium'>{ruleName}</div>
    },
    enableHiding: false,
  },
  {
    accessorKey: 'ruleType',
    header: ({ column }) => (
      <CustomDataTableColumnHeader column={column} title='Rule Type' />
    ),
    cell: ({ row }) => {
      const ruleType = row.original.ruleType || ''
      const typeLabels = {
        'geofence': 'Geofence',
        'idle': 'Idle Time',
        'break': 'Break Time',
        'route': 'Route',
        'custom': 'Custom'
      }
      return <div className='text-sm'>{typeLabels[ruleType] || ruleType}</div>
    },
  },
  {
    accessorKey: 'conditions',
    header: ({ column }) => (
      <CustomDataTableColumnHeader column={column} title='Conditions' />
    ),
    cell: ({ row }) => {
      const conditions = row.original.conditions || []
      return (
        <div className='text-sm text-muted-foreground'>
          {conditions.length} condition{conditions.length !== 1 ? 's' : ''}
        </div>
      )
    },
  },
  {
    accessorKey: 'actions',
    header: ({ column }) => (
      <CustomDataTableColumnHeader column={column} title='Actions' />
    ),
    cell: ({ row }) => {
      const actions = row.original.actions || []
      return (
        <div className='text-sm text-muted-foreground'>
          {actions.length} action{actions.length !== 1 ? 's' : ''}
        </div>
      )
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
        <Badge variant={isEnabled ? 'default' : 'secondary'}>
          {isEnabled ? 'Active' : 'Inactive'}
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
    cell: ({ row }) => <DataTableRowActions row={row} type="rule" />,
  },
]

// Geofence Zone columns
export const geofenceZoneColumns: ColumnDef<GeofenceZone>[] = [
  {
    accessorKey: 'zoneName',
    header: ({ column }) => (
      <CustomDataTableColumnHeader column={column} title='Zone Name' />
    ),
    cell: ({ row }) => {
      const zoneName = row.original.zoneName || ''
      return <div className='text-sm font-medium'>{zoneName}</div>
    },
    enableHiding: false,
  },
  {
    accessorKey: 'coordinates',
    header: ({ column }) => (
      <CustomDataTableColumnHeader column={column} title='Coordinates' />
    ),
    cell: ({ row }) => {
      const coordinates = row.original.coordinates
      if (!coordinates) return <div className='text-sm text-muted-foreground'>-</div>
      return (
        <div className='text-sm'>
          {coordinates.lat.toFixed(6)}, {coordinates.lng.toFixed(6)}
        </div>
      )
    },
  },
  {
    accessorKey: 'radius',
    header: ({ column }) => (
      <CustomDataTableColumnHeader column={column} title='Radius' />
    ),
    cell: ({ row }) => {
      const radius = row.original.radius || 0
      return <div className='text-sm'>{radius}m</div>
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
    cell: ({ row }) => <DataTableRowActions row={row} type="zone" />,
  },
]
