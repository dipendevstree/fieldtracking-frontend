import { DotsHorizontalIcon } from '@radix-ui/react-icons'
import { IconEye, IconCheck, IconX } from '@tabler/icons-react'
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
import { useApprovalsStore } from '../store/approvals.store'
import { Approval } from '../type/type'

interface DataTableRowActionsProps {
  row: {
    original: Approval
  }
}

export function DataTableRowActions({ row }: DataTableRowActionsProps) {
  const { setOpen, setCurrentApproval } = useApprovalsStore()

  const handleView = () => {
    if (!row.original) return
    
    setCurrentApproval(row.original)
    setOpen('view')
  }

  const handleApprove = () => {
    if (!row.original) return
    
    setCurrentApproval(row.original)
    setOpen('approve')
  }

  const handleReject = () => {
    if (!row.original) return
    
    setCurrentApproval(row.original)
    setOpen('reject')
  }

  const isPending = row.original?.status === 'pending'

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
        <DropdownMenuItem onClick={handleView}>
          View Details
          <DropdownMenuShortcut>
            <IconEye size={16} />
          </DropdownMenuShortcut>
        </DropdownMenuItem>

        {isPending && (
          <>
            <DropdownMenuSeparator />
            
            <DropdownMenuItem onClick={handleApprove}>
              Approve
              <DropdownMenuShortcut>
                <IconCheck size={16} />
              </DropdownMenuShortcut>
            </DropdownMenuItem>

            <DropdownMenuItem onClick={handleReject}>
              Reject
              <DropdownMenuShortcut>
                <IconX size={16} />
              </DropdownMenuShortcut>
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
