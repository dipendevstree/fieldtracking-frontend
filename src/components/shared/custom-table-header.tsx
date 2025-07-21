import React, { memo } from 'react'
import { PermissionGate } from '@/permissions/components/PermissionGate'
import { cn } from '@/lib/utils'
import SectionTitle from './page-section-title'
import ActionButton, {
  type ActionButtonProps,
} from './table-primary-action-button'

// Define the interface for the component props
interface CustomTableHeaderProps {
  /** Title text to display */
  title: string
  /** Callback function when action button is clicked */
  onAddButtonClick?: () => void
  /** Text for the action button (defaults to "Add") */
  addButtonText?: string
  /** Additional className for the header container */
  className?: string
  /** Additional className for the title */
  titleClassName?: string
  /** Whether to show the action button */
  showActionButton?: boolean
  /** Custom action button props (overrides individual button props) */
  actionButtonProps?: Partial<ActionButtonProps>
  /** Optional subtitle or description */
  subtitle?: string
  /** Additional content to render in the header */
  children?: React.ReactNode
  /** Layout variant */
  variant?: 'default' | 'compact' | 'spacious'
  /** Test ID for testing purposes */
  testId?: string
  modulePermission?: string
  moduleAction?: 'add' | 'edit' | 'viewOwn' | 'viewGlobal' | 'delete'
}

// Memoized component for better performance
const CustomTableHeader = memo<CustomTableHeaderProps>(
  ({
    title,
    onAddButtonClick,
    addButtonText = 'Add',
    className,
    titleClassName,
    showActionButton = true,
    actionButtonProps,
    subtitle,
    children,
    variant = 'default',
    testId,
    moduleAction,
    modulePermission,
  }) => {
    // Handle missing onAddButtonClick prop
    const handleActionClick = React.useCallback(() => {
      if (onAddButtonClick) {
        onAddButtonClick()
      } else {
        // eslint-disable-next-line no-console
        console.warn('CustomTableHeader: onAddButtonClick prop is not provided')
      }
    }, [onAddButtonClick])

    // Variant-based spacing classes
    const spacingClasses = {
      compact: 'mb-1 space-y-1',
      default: 'mb-2 space-y-2',
      spacious: 'mb-4 space-y-3',
    }

    return (
      <div
        className={cn(
          'flex flex-wrap items-center justify-between rounded-lg p-4 shadow',
          spacingClasses[variant],
          className
        )}
        data-testid={testId}
      >
        {/* Title Section */}
        <div className='min-w-0 flex-1'>
          <SectionTitle
            title={title}
            variant={variant}
            titleClassName={titleClassName}
          />
          {subtitle && (
            <p
              className={cn(
                'text-muted-foreground mt-1',
                variant === 'compact' ? 'text-sm' : 'text-base'
              )}
            >
              {subtitle}
            </p>
          )}
        </div>

        {/* Action Section */}
        <PermissionGate
          requiredPermission={modulePermission ?? ''}
          action={moduleAction}
        >
          <div className='flex items-center space-x-2'>
            {children}
            {showActionButton && (
              <ActionButton
                text={addButtonText}
                onAction={handleActionClick}
                {...actionButtonProps}
              />
            )}
          </div>
        </PermissionGate>
      </div>
    )
  }
)

CustomTableHeader.displayName = 'CustomTableHeader'

export default CustomTableHeader
export type { CustomTableHeaderProps }
