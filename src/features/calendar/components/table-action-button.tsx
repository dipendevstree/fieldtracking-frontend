import { useNavigate } from '@tanstack/react-router'
import { IconEdit, IconTrash } from '@tabler/icons-react'
import { PermissionGate } from '@/permissions/components/PermissionGate'
import Button from '@/components/shared/custom-button'
import CustomTooltip from '@/components/shared/custom-tooltip'
import { userUpcomingVisitStoreState } from '../store/upcoming-visits.store'

export function DataTableRowActions({ row }: any) {
  const { setOpen, setCurrentRow } = userUpcomingVisitStoreState()
  const navigate = useNavigate()
  console.log('row', row)
  const handleEdit = (row: any) => {
    console.log('row.original', row.original)
    setCurrentRow(row.original)
    navigate({ to: `/calendar/schedule-visit/${row.original.visitId}` })
  }

  const handleDelete = (row: any) => {
    setOpen('delete')
    console.log('row.original', row.original)
    setCurrentRow(row.original)
  }

  return (
    <div className='flex items-center space-x-2'>
      <PermissionGate requiredPermission='upcoming_visits' action='edit'>
        <CustomTooltip title='Edit'>
          <Button
            variant='ghost'
            className='h-8 w-8 p-0 text-green-600 hover:bg-green-50 hover:text-green-700'
            onClick={() => handleEdit(row)}
          >
            <IconEdit size={16} />
          </Button>
        </CustomTooltip>
      </PermissionGate>

      <PermissionGate requiredPermission='upcoming_visits' action='delete'>
        <CustomTooltip title='Delete'>
          <Button
            variant='ghost'
            onClick={() => handleDelete(row)}
            className='h-8 w-8 p-0 text-red-600 hover:bg-green-50 hover:text-red-700'
          >
            <IconTrash size={16} />
          </Button>
        </CustomTooltip>
      </PermissionGate>

      {/* {row.original.userCount > 0 && (
        <PermissionGate requiredPermission='user_territory' action='viewOwn'>
          <CustomTooltip title='View Users'>
            <Button variant='ghost' onClick={() => handleViewUsers(row)}>
              <IconUser size={16} />
            </Button>
          </CustomTooltip>
        </PermissionGate>
      )} */}
    </div>
  )
}
