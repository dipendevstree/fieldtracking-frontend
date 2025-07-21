import { ColumnDef } from '@tanstack/react-table'
import { CustomDataTableColumnHeader } from '@/components/shared/custom-table-header-column'

export const columns: ColumnDef<any>[] = [
  {
    accessorKey: 'salesRepName',
    header: ({ column }) => (
      <CustomDataTableColumnHeader column={column} title='Sales Rep Name' />
    ),
    cell: ({ row }) => {
      const firstName = row.original.firstName || ''
      const lastName = row.original.lastName || ''
      const fullName = `${firstName} ${lastName}`.trim() || '-'
      const avatar = row.original.avatar || row.original.profileImage

      return (
        <div className='flex items-center gap-2'>
          <div className='flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-gray-200'>
            {avatar ? (
              <img
                src={avatar}
                alt={fullName}
                className='h-full w-full object-cover'
              />
            ) : (
              <span className='text-xs font-medium text-gray-600'>
                {firstName.charAt(0).toUpperCase() || 'U'}
              </span>
            )}
          </div>
          <div className='text-sm font-medium'>{fullName}</div>
        </div>
      )
    },
    enableHiding: false,
  },
  {
    accessorKey: 'userRole',
    header: ({ column }) => (
      <CustomDataTableColumnHeader column={column} title='User Role' />
    ),
    cell: ({ row }) => {
      const role =
        row.original.role?.roleName || row.original.jobTitle || 'Manager'
      return <div className='text-sm'>{role}</div>
    },
  },
  {
    accessorKey: 'emailId',
    header: ({ column }) => (
      <CustomDataTableColumnHeader column={column} title='Email Id' />
    ),
    cell: ({ row }) => {
      const email = row.original.email || '-'
      return <div className='text-muted-foreground text-sm'>{email}</div>
    },
  },
  {
    accessorKey: 'phoneNumber',
    header: ({ column }) => (
      <CustomDataTableColumnHeader column={column} title='Phone Number' />
    ),
    cell: ({ row }) => {
      const countryCode = row.original.countryCode || ''
      const phone = row.original.phoneNumber || ''
      const fullPhone = phone ? `${countryCode} ${phone}` : '-'
      return <div className='text-muted-foreground text-sm'>{fullPhone}</div>
    },
  },
]
