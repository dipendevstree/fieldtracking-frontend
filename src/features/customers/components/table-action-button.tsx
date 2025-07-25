import { DotsHorizontalIcon } from '@radix-ui/react-icons'
import { IconEdit, IconTrash } from '@tabler/icons-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import CustomButton from '@/components/shared/custom-button'
import CustomTooltip from '@/components/shared/custom-tooltip'
import { useCustomersStore } from '../store/customers.store'
import { Customer } from '../types'

interface DataTableRowActionsProps {
  row: {
    original: Customer
  }
  onEdit?: (id: string) => void
}

export function DataTableRowActions({ row, onEdit }: DataTableRowActionsProps) {
  const { setOpen, setCurrentRow } = useCustomersStore()

  const handleEdit = () => {
    if (!row.original) return
    
    if (onEdit) {
      onEdit(row.original.customerId)
    } else {
      setCurrentRow(row.original)
      setOpen('edit')
    }
  }

  const handleDelete = () => {
    if (!row.original) return
    
    setCurrentRow(row.original)
    setOpen('delete')
  }

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <CustomButton
          variant='ghost'
          className='data-[state=open]:bg-muted flex h-8 w-8 cursor-pointer p-0'
        >
          <CustomTooltip title='Actions' asChild={true}>
            <div className="flex items-center justify-center">
              <DotsHorizontalIcon className='h-4 w-4' />
              <span className='sr-only'>Open menu</span>
            </div>
          </CustomTooltip>
        </CustomButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' className='w-[180px]'>
        <DropdownMenuItem onClick={handleEdit}>
          Edit
          <DropdownMenuShortcut>
            <IconEdit size={16} />
          </DropdownMenuShortcut>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={handleDelete}
          className='text-red-500 focus:text-red-500'
        >
          Delete
          <DropdownMenuShortcut>
            <IconTrash size={16} />
          </DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
