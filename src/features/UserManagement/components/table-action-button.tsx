import { DotsHorizontalIcon } from '@radix-ui/react-icons'
import { IconEdit, IconTrash } from '@tabler/icons-react'
import { PermissionGate } from '@/permissions/components/PermissionGate'
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
import { useUsersStore } from '../store/users.store'

export function DataTableRowActions({ row }: any) {
  const { setOpen, setCurrentRow } = useUsersStore()

  const handleEdit = (row: any) => {
    setOpen('edit')
    setCurrentRow(row.original)
  }

  const handleDelete = (row: any) => {
    setOpen('delete')
    setCurrentRow(row.original)
  }

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <CustomButton
          variant='ghost'
          className='data-[state=open]:bg-muted flex h-8 w-8 cursor-pointer p-0'
        >
          <CustomTooltip title='Actions'>
            <DotsHorizontalIcon className='h-4 w-4' />
            <span className='sr-only'>Open menu</span>
          </CustomTooltip>
        </CustomButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' className='w-[180px]'>
        <PermissionGate requiredPermission='all_user' action='edit'>
          <DropdownMenuItem onClick={() => handleEdit(row)}>
            Edit
            <DropdownMenuShortcut>
              <IconEdit size={16} />
            </DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
        </PermissionGate>

        <DropdownMenuItem
          onClick={() => handleDelete(row)}
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
