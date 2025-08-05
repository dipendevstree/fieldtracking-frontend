import { DotsHorizontalIcon } from '@radix-ui/react-icons'
import { IconEye, IconMap, IconChartBar, IconMessage, IconPhone } from '@tabler/icons-react'  
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
import { useOverviewStore } from '../store/over-view.store'
import { SalesRep } from '../type/type'

interface DataTableRowActionsProps {
  row: {
    original: SalesRep
  }
}

export function DataTableRowActions({ row }: DataTableRowActionsProps) {
  const { setOpen, setCurrentUser } = useOverviewStore()

  const handleViewUser = () => {
    if (!row.original) return
    
    setCurrentUser(row.original)
    setOpen('view-user')
  }

  const handleViewPerformance = () => {
    if (!row.original) return
    
    setCurrentUser(row.original)
    setOpen('view-performance')
  }

  const handleViewLocation = () => {
    if (!row.original) return
    
    setCurrentUser(row.original)
    setOpen('settings')
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
        <DropdownMenuItem onClick={handleViewUser}>
          View Details
          <DropdownMenuShortcut>
            <IconEye size={16} />
          </DropdownMenuShortcut>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={handleViewPerformance}>
          View Performance
          <DropdownMenuShortcut>
            <IconChartBar size={16} />
          </DropdownMenuShortcut>
        </DropdownMenuItem>

        <DropdownMenuItem onClick={handleViewLocation}>
          View Location
          <DropdownMenuShortcut>
            <IconMap size={16} />
          </DropdownMenuShortcut>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem>
          Send Message
          <DropdownMenuShortcut>
            <IconMessage size={16} />
          </DropdownMenuShortcut>
        </DropdownMenuItem>

        <DropdownMenuItem>
          Call
          <DropdownMenuShortcut>
            <IconPhone size={16} />
          </DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
