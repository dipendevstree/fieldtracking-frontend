import React, { memo, forwardRef } from 'react'
import { IconPlus } from '@tabler/icons-react'
import { cn } from '@/lib/utils'
import { Button } from '../ui/button'

// uming you have a cn utility for class merging

// Define the interface for the component props
interface ActionButtonProps
  extends Omit<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    'onClick' | 'children'
  > {
  /** Text to display on the button */
  text: string
  /** Click handler function */
  onAction: () => void
  /** Icon component to display (defaults to IconPlus) */
  icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>
  /** Size of the icon (defaults to 18) */
  iconSize?: number
  /** Position of the icon relative to text */
  iconPosition?: 'left' | 'right'
  /** Additional className for the button */
  className?: string
  /** Whether the button is in a loading state */
  loading?: boolean
  /** Custom loading text */
  loadingText?: string
  /** Whether to show only the icon (no text) */
  iconOnly?: boolean
  /** Tooltip text for icon-only buttons */
  tooltip?: string
  /** Test ID for testing purposes */
  testId?: string
}

// Memoized component for better performance
const ActionButton = memo(
  forwardRef<HTMLButtonElement, ActionButtonProps>(
    (
      {
        text,
        onAction,
        icon: IconComponent = IconPlus,
        iconSize = 18,
        iconPosition = 'left',
        className,
        loading = false,
        loadingText = 'Loading...',
        iconOnly = false,
        tooltip,
        testId,
        disabled,
        ...buttonProps
      },
      ref
    ) => {
      const handleClick = React.useCallback(() => {
        if (!loading && !disabled) {
          onAction()
        }
      }, [onAction, loading, disabled])

      const iconElement = (
        <IconComponent
          size={iconSize}
          className={cn(
            'flex-shrink-0',
            loading && 'animate-spin',
            iconOnly ? '' : iconPosition === 'left' ? '' : ''
          )}
        />
      )

      const textElement = loading ? loadingText : text

      return (
        <Button
          ref={ref}
          className={cn(
            'inline-flex cursor-pointer items-center justify-center',
            iconOnly ? 'p-2' : 'px-4 py-2',
            className
          )}
          onClick={handleClick}
          disabled={disabled || loading}
          title={iconOnly ? tooltip || text : undefined}
          data-testid={testId}
          {...buttonProps}
        >
          {iconOnly ? (
            iconElement
          ) : (
            <>
              {iconPosition === 'left' && iconElement}
              <span className={loading ? 'opacity-70' : ''}>{textElement}</span>
              {iconPosition === 'right' && iconElement}
            </>
          )}
        </Button>
      )
    }
  )
)

ActionButton.displayName = 'ActionButton'

export default ActionButton
export type { ActionButtonProps }
