import { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import CustomTableHeader from '../shared/custom-table-header'
import { Main } from './main'

interface TablePageLayoutProps {
  title: string
  description?: string
  children: ReactNode
  onAddButtonClick?: () => void
  addButtonText?: string
  className?: string
  headerClassName?: string
  contentClassName?: string
  customHeader?: ReactNode
  extraButtons?: ReactNode
  showHeader?: boolean
  showActionButton?: boolean
  headerVariant?: 'default' | 'bordered' | 'minimal'
  modulePermission?: string
  moduleAction?: 'add' | 'edit' | 'viewOwn' | 'viewGlobal' | 'delete'
}

const TablePageLayout = ({
  title,
  description,
  children,
  onAddButtonClick,
  addButtonText,
  className,
  headerClassName,
  contentClassName,
  customHeader,
  extraButtons,
  showHeader = true,
  headerVariant = 'default',
  showActionButton,
  moduleAction,
  modulePermission,
}: TablePageLayoutProps) => {
  return (
    <Main className={cn('flex flex-col gap-2 p-4', className)}>
      {showHeader && (
        <div
          className={cn(
            'flex items-center justify-between',
            {
              'border-b': headerVariant === 'bordered',
              'p-0': headerVariant === 'minimal',
            },
            headerClassName
          )}
        >
          {customHeader ? (
            customHeader
          ) : (
            <CustomTableHeader
              title={title}
              moduleAction={moduleAction}
              modulePermission={modulePermission}
              subtitle={description}
              onAddButtonClick={onAddButtonClick}
              className='w-full'
              addButtonText={addButtonText || `Add ${title.slice(0, -1)}`}
              showActionButton={showActionButton}
            />
          )}
          {extraButtons && (
            <div className='flex items-center gap-2'>{extraButtons}</div>
          )}
        </div>
      )}
      <div className={cn('w-full', contentClassName)}>{children}</div>
    </Main>
  )
}

export default TablePageLayout
