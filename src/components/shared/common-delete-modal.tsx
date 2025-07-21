import { IconAlertTriangle } from '@tabler/icons-react'
import { showSubmittedData } from '@/utils/show-submitted-data'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { ConfirmDialog } from '@/components/confirm-dialog'

interface Props<T> {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentRow: T
  onDelete: () => void
  itemName: string
  itemIdentifier: keyof T
}

export function DeleteModal<T>({
  open,
  onOpenChange,
  currentRow,
  onDelete,
  itemName,
  itemIdentifier,
}: Props<T>) {
  const handleDelete = () => {
    onOpenChange(false)
    showSubmittedData(currentRow, `The following ${itemName} has been deleted:`)
    onDelete()
  }

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      handleConfirm={handleDelete}
      title={
        <span className='text-destructive'>
          <IconAlertTriangle
            className='stroke-destructive mr-1 inline-block'
            size={18}
          />{' '}
          Delete {itemName}
        </span>
      }
      desc={
        <div className='space-y-4'>
          <p className='mb-2'>
            Are you sure you want to delete{' '}
            <span className='font-bold'>
              {String(currentRow[itemIdentifier])}
            </span>
            ?
            <br />
            This action will permanently remove the {itemName} from the system.
            This cannot be undone.
          </p>
          <Alert variant='destructive'>
            <AlertTitle>Warning!</AlertTitle>
            <AlertDescription>
              Please be careful, this operation cannot be rolled back.
            </AlertDescription>
          </Alert>
        </div>
      }
      confirmText='Delete'
      destructive
    />
  )
}
