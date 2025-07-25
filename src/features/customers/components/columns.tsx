import { ColumnDef } from '@tanstack/react-table'
import { CustomDataTableColumnHeader } from '@/components/shared/custom-table-header-column'
import { DataTableRowActions } from './table-action-button'

interface Customer {
  CustomerName: string
  employeeRang?: {
    employeeRange: string
  }
  adminData?: {
    firstName: string
    lastName: string
    email: string
  }
  industry?: {
    industryName: string
  }
  companyName: string
  isActive: boolean
  createdDate: string
  customerType?: {
    typeName: string
  }
  location: string
  assignedRep: string
  contactPerson: string
  phoneNumber: string
  customerId: string
}

interface GetColumnsProps {
  onEdit?: (id: string) => void
}

export const getColumns = ({ onEdit }: GetColumnsProps): ColumnDef<Customer>[] => [
  {
    accessorKey: 'companyName',
    header: ({ column }) => (
      <CustomDataTableColumnHeader column={column} title='Company Name' />
    ),
    cell: ({ row }) => <div>{row.original.companyName ?? '-'}</div>,
  },
  {
    accessorKey: 'customerType.typeName',
    header: ({ column }) => (
      <CustomDataTableColumnHeader column={column} title='Customer Type' />
    ),
    cell: ({ row }) => <div>{row.original.customerType?.typeName ?? '-'}</div>,
  },
  {
    accessorKey: 'streetAddress',
    header: ({ column }) => (
      <CustomDataTableColumnHeader column={column} title='Location' />
    ),
    cell: ({ row }) => <div>{row.original.streetAddress ?? '-'}</div>,
  },
  {
    accessorKey: 'industry.industryName',
    header: ({ column }) => (
      <CustomDataTableColumnHeader column={column} title='Industry' />
    ),
    cell: ({ row }) => {
      return <div>{row.original.industry?.industryName ?? '-'}</div>
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => (
      <DataTableRowActions 
        row={row} 
        onEdit={onEdit ? () => onEdit(row.original.customerId) : undefined}
      />
    ),
  },
]
