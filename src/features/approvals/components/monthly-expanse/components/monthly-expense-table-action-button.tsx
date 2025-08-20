import { useNavigate } from '@tanstack/react-router'
import { IconEdit, IconTrash } from '@tabler/icons-react'
import { PermissionGate } from '@/permissions/components/PermissionGate'
import { DeleteModal } from '@/components/shared/common-delete-modal'
import Button from '@/components/shared/custom-button'
import CustomTooltip from '@/components/shared/custom-tooltip'
import { userUpcomingVisitStoreState } from '@/features/calendar/store/upcoming-visits.store'
import { useDeleteVisits } from '@/features/calendar/services/calendar-view.hook'


type RowProps = {
  row: {
    original: {
      visitId: string
      purpose?: string
      [key: string]: any
    }
  }
}

export function DataTableRowActions({ row }: RowProps) {
  const { open, setOpen, currentRow, setCurrentRow } =
    userUpcomingVisitStoreState()
  const navigate = useNavigate()

  const closeModal = () => {
    setOpen(null)
    setTimeout(() => setCurrentRow(null), 300)
  }

  const { mutate: deleteUpcomingVisits } = useDeleteVisits(
    row.original.visitId,
    closeModal
  )

  const handleEdit = () => {
    setCurrentRow(row.original)
    navigate({ to: `/calendar/schedule-visit/${row.original.visitId}` })
  }

  const handleDelete = () => {
    setCurrentRow(row.original)
    setOpen('delete')
  }

  const handleDeleteUpcomingVisits = () => {
    if (currentRow?.visitId) {
      deleteUpcomingVisits()
    } else {
      closeModal()
    }
  }

  return (
    <div className='flex items-center space-x-2'>
      <PermissionGate requiredPermission='upcoming_visits' action='edit'>
        <CustomTooltip title='Edit'>
          <Button
            variant='ghost'
            className='h-8 w-8 p-0 text-green-600 hover:bg-green-50 hover:text-green-700'
            onClick={handleEdit}
          >
            <IconEdit size={16} />
          </Button>
        </CustomTooltip>
      </PermissionGate>

      <PermissionGate requiredPermission='upcoming_visits' action='delete'>
        <CustomTooltip title='Delete'>
          <Button
            variant='ghost'
            className='h-8 w-8 p-0 text-red-600 hover:bg-red-50 hover:text-red-700'
            onClick={handleDelete}
          >
            <IconTrash size={16} />
          </Button>
        </CustomTooltip>
      </PermissionGate>

      {currentRow && (
        <DeleteModal
          key='delete-upcoming'
          open={open === 'delete'}
          currentRow={currentRow ?? {}}
          itemName='Upcoming Visit'
          itemIdentifier={'purpose' as keyof typeof currentRow}
          onDelete={handleDeleteUpcomingVisits}
          onOpenChange={(value) => {
            if (!value) closeModal()
            else setOpen('delete')
          }}
        />
      )}
    </div>
  )
}
