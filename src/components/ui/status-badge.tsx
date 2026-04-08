/**
 * StatusBadge — Config-driven status pill with optional dot indicator.
 *
 * Config:  config/badgeThemes.ts  →  config/statusConfig.ts  →  this component
 * Usage:   <StatusBadge status="approved" />
 */

import { memo, useMemo } from "react";
import { cn } from "@/lib/utils";
import { formatStatus } from "@/utils/commonFunction";
import {
  isInvalidOrPlaceholder,
  resolveTheme,
  resolveLabel,
  statusColors,
} from "@/config/statusConfig";

export type StatusType = string;

export interface StatusBadgeProps {
  /** Raw status string from API — normalised internally. */
  status?: StatusType | null;
  /** Show colored dot before label. @default true */
  showDot?: boolean;
  /** Extra Tailwind classes on the outer span. */
  className?: string;
}

export const StatusBadge = memo(
  ({ status, showDot = true, className }: StatusBadgeProps) => {
    const { isInvalid, displayText, color } = useMemo(() => {
      const normalized =
        status?.trim().toLowerCase().replace(/\s+/g, "_") ?? "";

      return {
        isInvalid: isInvalidOrPlaceholder(status),
        displayText: resolveLabel(normalized) ?? formatStatus(normalized),
        color: resolveTheme(normalized),
      };
    }, [status]);

    if (isInvalid) {
      return (
        <span
          className={cn(
            "inline-flex items-center justify-center rounded-full px-2 py-1 text-xs font-medium text-gray-500 bg-gray-100",
            className,
          )}
        >
          -
        </span>
      );
    }

    return (
      <span
        className={cn(
          "inline-flex items-center rounded-full px-2 py-1 text-xs font-medium capitalize",
          color.text,
          color.bg,
          className,
        )}
      >
        {showDot && (
          <span
            className={cn("mr-1 h-2 w-2 shrink-0 rounded-full", color.dot)}
            aria-hidden="true"
          />
        )}
        {displayText}
      </span>
    );
  },
);

StatusBadge.displayName = "StatusBadge";

export { statusColors };
export default StatusBadge;
