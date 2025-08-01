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
import { useApproversStore } from '../store/approvers.store'
import { ApprovalHierarchy, CategoryApprover } from '../type/type'

interface DataTableRowActionsProps {
  row: {
    original: ApprovalHierarchy | CategoryApprover
  }
  type: 'hierarchy' | 'category'
}

export function DataTableRowActions({ row, type }: DataTableRowActionsProps) {
  const { setOpen, setCurrentHierarchy, setCurrentCategory } = useApproversStore()

  const handleEdit = () => {
    if (!row.original) return
    
    if (type === 'hierarchy') {
      setCurrentHierarchy(row.original as ApprovalHierarchy)
      setOpen('edit-hierarchy')
    } else {
      setCurrentCategory(row.original as CategoryApprover)
      setOpen('edit-category')
    }
  }

  const handleDelete = () => {
    if (!row.original) return
    
    if (type === 'hierarchy') {
      setCurrentHierarchy(row.original as ApprovalHierarchy)
      setOpen('delete-hierarchy')
    } else {
      setCurrentCategory(row.original as CategoryApprover)
      setOpen('delete-category')
    }
  }

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <CustomButton
          variant='ghost'
          className='data-[state=open]:bg-muted flex h-8 w-8 cursor-pointer p-0'
        >
          <CustomTooltip title='Actions'>
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
