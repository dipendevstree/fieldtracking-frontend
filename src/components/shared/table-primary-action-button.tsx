import React, { memo, forwardRef } from "react";
import { IconPlus, IconLoader2 } from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// uming you have a cn utility for class merging

// Define the interface for the component props
interface ActionButtonProps extends Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  "onClick" | "children"
> {
  /** Text to display on the button */
  text: string;
  /** Click handler function */
  onAction: () => void;
  /** Icon component to display (defaults to IconPlus) */
  icon?: React.ComponentType<React.SVGProps<SVGSVGElement> | any>;
  /** Size of the icon (defaults to 18) */
  iconSize?: number;
  /** Position of the icon relative to text */
  iconPosition?: "left" | "right";
  /** Additional className for the button */
  className?: string;
  /** Whether the button is in a loading state */
  loading?: boolean;
  /** Custom loading text */
  loadingText?: string;
  /** Whether to show only the icon (no text) */
  iconOnly?: boolean;
  /** Tooltip text for icon-only buttons */
  tooltip?: string;
  /** Explicit tooltip text to show when the button is disabled */
  disabledTooltip?: string;
  /** Test ID for testing purposes */
  testId?: string;
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
        iconPosition = "left",
        className,
        loading = false,
        loadingText = "Loading...",
        iconOnly = false,
        tooltip,
        disabledTooltip,
        testId,
        disabled,
        ...buttonProps
      },
      ref,
    ) => {
      const isEffectivelyDisabled = disabled || loading;

      const handleClick = React.useCallback(() => {
        if (!isEffectivelyDisabled) {
          onAction();
        }
      }, [onAction, isEffectivelyDisabled]);

      // dynamically switch to the loader icon when loading is true
      const ActiveIcon = loading ? IconLoader2 : IconComponent;

      const iconElement = (
        <ActiveIcon
          size={iconSize}
          className={cn(
            "flex-shrink-0",
            loading && "animate-spin",
            iconOnly ? "" : iconPosition === "left" ? "" : "",
          )}
        />
      );

      const textElement = loading ? loadingText : text;

      // THE SCALABLE TOOLTIP LOGIC:
      // 1. If loading -> Suppress tooltip (spinner and loading text are enough!)
      // 2. If explicitly disabled -> Show disabledTooltip
      // 3. Otherwise -> Show normal tooltip (or icon text fallback)
      let activeTooltip: string | undefined = undefined;

      if (loading) {
        activeTooltip = undefined;
      } else if (disabled) {
        activeTooltip = disabledTooltip || tooltip;
      } else {
        activeTooltip = tooltip || (iconOnly ? text : undefined);
      }

      // The exact original Button component (removed native 'title' since we use Tooltip now)
      const buttonElement = (
        <Button
          ref={ref}
          className={cn(
            "inline-flex cursor-pointer items-center justify-center",
            iconOnly ? "p-2" : "px-4 py-2",
            className,
          )}
          onClick={handleClick}
          disabled={isEffectivelyDisabled}
          data-testid={testId}
          {...buttonProps}
        >
          {iconOnly ? (
            iconElement
          ) : (
            <>
              {iconPosition === "left" && iconElement}
              <span className={loading ? "opacity-70" : ""}>{textElement}</span>
              {iconPosition === "right" && iconElement}
            </>
          )}
        </Button>
      );

      // If no tooltip text is needed at all, just return your normal button
      if (!activeTooltip) {
        return buttonElement;
      }

      // Explicit wrapper for scalable tooltip handling on disabled elements
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              {isEffectivelyDisabled ? (
                <span tabIndex={0} className="inline-block cursor-not-allowed">
                  <span className="pointer-events-none block">
                    {buttonElement}
                  </span>
                </span>
              ) : (
                buttonElement
              )}
            </TooltipTrigger>
            <TooltipContent>
              <p>{activeTooltip}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    },
  ),
);

ActionButton.displayName = "ActionButton";

export default ActionButton;
export type { ActionButtonProps };
