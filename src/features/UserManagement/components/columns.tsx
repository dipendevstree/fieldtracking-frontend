import { ColumnDef } from '@tanstack/react-table'
import { Badge } from '@/components/ui/badge'
import { CustomDataTableColumnHeader } from '@/components/shared/custom-table-header-column'
import { DataTableRowActions } from './table-action-button'

export const columns: ColumnDef<any>[] = [
  {
    accessorKey: 'user',
    header: ({ column }) => (
      <CustomDataTableColumnHeader column={column} title='User' />
    ),
    cell: ({ row }) => {
      const firstName =
        row.original.firstName || row.original.adminData?.firstName
      const lastName = row.original.lastName || row.original.adminData?.lastName
      const organization =
        row.original.organizationName || row.original.organization
      return (
        <div className='font-medium'>
          <div>
            {firstName} {lastName}
          </div>
          <div className='text-muted-foreground text-xs'>{organization}</div>
        </div>
      )
    },
    enableHiding: false,
    enableSorting: false,
  },
  {
    accessorKey: 'email',
    header: ({ column }) => (
      <CustomDataTableColumnHeader column={column} title='Email Id' />
    ),
    cell: ({ row }) => {
      const email = row.original.email || row.original.adminData?.email
      return <div className='text-sm'>{email}</div>
    },
    enableSorting: false,
  },
  {
    accessorKey: 'phone',
    header: ({ column }) => (
      <CustomDataTableColumnHeader column={column} title='Number' />
    ),
    cell: ({ row }) => {
      const phone =
        row.original.phoneNumber || row.original.adminData?.phoneNumber
      const countryCode = row.original.countryCode || '+1'
      return (
        <div className='text-sm'>{phone ? `${countryCode} ${phone}` : '-'}</div>
      )
    },
    enableSorting: false,
  },
  {
    accessorKey: 'role',
    header: ({ column }) => (
      <CustomDataTableColumnHeader column={column} title='Role' />
    ),
    cell: ({ row }) => {
      const role = row.original.role.roleName || '-'
      return (
        <div className='text-sm'>
          {role.charAt(0).toUpperCase() + role.slice(1)}
        </div>
      )
    },
    enableSorting: false,
  },
  {
    accessorKey: "tierkey",
    header: ({ column }) => (
      <CustomDataTableColumnHeader column={column} title="Tier" />
    ),
    cell: ({ row }) => {
      const tier = row.original.tierkey || "-";
      return (
        <div className="text-sm">
          {tier ? tier.replace(/^tier_/, "Tier ") : "-"}
        </div>
      );
    },
    enableSorting: false,
  },
  {
    accessorKey: 'territory',
    header: ({ column }) => (
      <CustomDataTableColumnHeader column={column} title='Territory' />
    ),
    cell: ({ row }) => {
      const territoryName = row.original.territory?.name || '-'
      return <div className='text-sm'>{territoryName}</div>
    },
    enableSorting: false,
  },
  {
    accessorKey: 'reportingToIds',
    header: ({ column }) => (
      <CustomDataTableColumnHeader column={column} title='Reporting To' />
    ),
    cell: ({ row }) => {
      const reportingToIds = row.original.reportingToIds
      const reportingTo = row.original.reportingTo
      
      console.log('=== TABLE DISPLAY DEBUG ===')
      console.log('Row data:', row.original)
      console.log('reportingToIds:', reportingToIds)
      console.log('reportingTo:', reportingTo)
      
      let displayValue = '-'
      
      // First try to get names from reportingTo (if API provides full user objects)
      if (Array.isArray(reportingTo) && reportingTo.length > 0) {
        displayValue = reportingTo
          .map((user: any) => `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim())
          .filter(name => name.length > 0)
          .join(', ')
      }
      // If no names found, try to get from reportingToIds (if they contain user objects)
      else if (Array.isArray(reportingToIds) && reportingToIds.length > 0) {
        // Check if reportingToIds contains user objects or just IDs
        if (typeof reportingToIds[0] === 'object' && reportingToIds[0]?.firstName) {
          displayValue = reportingToIds
            .map((user: any) => `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim())
            .filter(name => name.length > 0)
            .join(', ')
        } else {
          // If reportingToIds contains just IDs, we can't display names without additional API call
          displayValue = `${reportingToIds.length} user(s)`
        }
      }
      
      return <div className='text-sm'>{displayValue}</div>
    },
    enableSorting: false,
  },
  {
    accessorKey: 'status',
    header: ({ column }) => (
      <CustomDataTableColumnHeader column={column} title='Status' />
    ),
    cell: ({ row }) => {
      const status =
        row.original.status || (row.original.isActive ? 'active' : 'inactive')
      const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
          case 'active':
            return 'bg-green-100 text-green-800 border-green-200'
          case 'inactive':
            return 'bg-gray-100 text-gray-800 border-gray-200'
          case 'complete':
            return 'bg-blue-100 text-blue-800 border-blue-200'
          case 'pending':
            return 'bg-yellow-100 text-yellow-800 border-yellow-200'
          default:
            return 'bg-gray-100 text-gray-800 border-gray-200'
        }
      }

      return (
        <Badge
          variant='outline'
          className={`capitalize ${getStatusColor(status)}`}
        >
          ● {status}
        </Badge>
      )
    },
    enableSorting: false,
  },
  {
    id: 'actions',
    header: ({ column }) => (
      <CustomDataTableColumnHeader column={column} title='Action' />
    ),
    cell: ({ row }) => <DataTableRowActions row={row} />,
    enableSorting: false,
  },
]
