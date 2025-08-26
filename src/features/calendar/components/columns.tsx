import { ColumnDef } from '@tanstack/react-table'
import { CustomDataTableColumnHeader } from '@/components/shared/custom-table-header-column'
import { DataTableRowActions } from './table-action-button'

export const columns: ColumnDef<any>[] = [
  {
    accessorKey: 'salesRap',
    header: ({ column }) => (
      <CustomDataTableColumnHeader column={column} title='SalesRap' />
    ),
    cell: ({ row }) => {
      const user = row.original.salesRepresentativeUser
      const firstName = user?.firstName || ''
      const lastName = user?.lastName || ''

      const territory =
        firstName || lastName ? `${firstName} ${lastName}`.trim() : '-'

      return <div className='text-sm font-medium'>{territory}</div>
    },
    enableHiding: false,
    enableSorting: false,
  },
  {
    accessorKey: 'Customer',
    header: ({ column }) => (
      <CustomDataTableColumnHeader column={column} title='Customer' />
    ),
    cell: ({ row }) => {
      const companyName = row.original.customer?.companyName || ''
      return <div className='text-muted-foreground text-sm'>{companyName}</div>
    },
    enableSorting: false,
  },
  {
    accessorKey: 'date',
    header: ({ column }) => (
      <CustomDataTableColumnHeader column={column} title='Date & Time' />
    ),
    cell: ({ row }) => {
      const date = row.original.date || ''
      const formattedDate = date
        ? new Date(date).toLocaleDateString('en-US', {
            month: 'numeric',
            day: 'numeric',
            year: 'numeric',
          })
        : '-'
      const time = row.original.time || ''
      const dateAndTime = `${formattedDate} ${time}`.trim() || '-'
      return <div className='text-muted-foreground text-sm'>{dateAndTime}</div>
    },
    enableSorting: false,
  },
  {
    accessorKey: 'purpose',
    header: ({ column }) => (
      <CustomDataTableColumnHeader column={column} title='Purpose' />
    ),
    cell: ({ row }) => {
      const purpose = row.original.purpose || ''
      return <div className='text-muted-foreground text-sm'>{purpose}</div>
    },
    enableSorting: false,
  },
  {
    accessorKey: 'location',
    header: ({ column }) => (
      <CustomDataTableColumnHeader column={column} title='Location' />
    ),
    cell: ({ row }) => {
      const streetAddress = row.original.streetAddress || ''
      const firstPart = streetAddress.split(',')[0]
      return (
        <div
          className='text-muted-foreground max-w-[200px] cursor-default truncate text-sm'
          title={streetAddress}
        >
          {firstPart}
        </div>
      )
    },
    enableSorting: false,
  },
  {
    accessorKey: 'status',
    header: ({ column }) => (
      <CustomDataTableColumnHeader column={column} title='Status' />
    ),
    cell: ({ row }) => {
      const status = row.original.status || ''
      return <div className='text-muted-foreground text-sm'>{status}</div>
    },
    enableSorting: false,
  },
  {
    accessorKey: 'Priority',
    header: ({ column }) => (
      <CustomDataTableColumnHeader column={column} title='Priority' />
    ),
    cell: ({ row }) => {
      const priority = row.original.priority || ''
      return <div className='text-muted-foreground text-sm'>{priority}</div>
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
