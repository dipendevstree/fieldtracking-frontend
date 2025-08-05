import { DotsHorizontalIcon } from '@radix-ui/react-icons'
import { IconEye, IconMap } from '@tabler/icons-react'
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
import { useLiveTrackingStore } from '../store/live-tracking.store'
import { LiveTrackingUser } from '../type/type'

interface DataTableRowActionsProps {
  row: {
    original: LiveTrackingUser
  }
}

export function DataTableRowActions({ row }: DataTableRowActionsProps) {
  const { setOpen, setCurrentUser } = useLiveTrackingStore()

  const handleViewUser = () => {
    if (!row.original) return
    
    setCurrentUser(row.original)
    setOpen('view-user')
  }

  const handleViewMap = () => {
    if (!row.original) return
    
    setCurrentUser(row.original)
    setOpen('settings')
  }

  // const handleViewHistory = () => {
  //   if (!row.original) return
    
  //   setCurrentUser(row.original)
  //   setOpen('view-session')
  // }

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
        <DropdownMenuItem onClick={handleViewUser}>
          View Details
          <DropdownMenuShortcut>
            <IconEye size={16} />
          </DropdownMenuShortcut>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={handleViewMap}>
          View on Map
          <DropdownMenuShortcut>
            <IconMap size={16} />
          </DropdownMenuShortcut>
        </DropdownMenuItem>
        </DropdownMenuContent>
    </DropdownMenu>
  )
}
