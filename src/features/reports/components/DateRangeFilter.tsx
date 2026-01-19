import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, XIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { format, isBefore, isAfter, startOfDay } from "date-fns";
import { DateRange } from "react-day-picker";
import { cn } from "@/lib/utils";

interface DateRangeFilterProps {
  label?: string;
  dateRange: DateRange | undefined;
  setDateRange: (range: DateRange | undefined) => void;
  className?: string;
  size?: "sm" | "md" | "lg";
  placeholder?: string;
  disablePastDates?: boolean;
  disableFutureDates?: boolean;
  allowClear?: boolean;
}

export const DateRangeFilter: React.FC<DateRangeFilterProps> = ({
  label,
  dateRange,
  setDateRange,
  className,
  size = "md",
  placeholder = "Pick a date range",
  disablePastDates = false,
  disableFutureDates = false,
  allowClear = true,
}) => {
  const [open, setOpen] = useState(false);
  const [tempRange, setTempRange] = useState<DateRange | undefined>(dateRange);

  // Sync tempRange with dateRange prop when the popover opens or dateRange changes
  useEffect(() => {
    if (open) {
      setTempRange(dateRange);
    }
  }, [dateRange, open]);

  const sizeClasses = {
    sm: "h-8 text-sm",
    md: "h-9 text-md",
    lg: "h-10 text-lg",
  };

  const formattedRange =
    dateRange?.from && dateRange?.to
      ? `${format(dateRange.from, "LLL dd, y")} - ${format(
          dateRange.to,
          "LLL dd, y"
        )}`
      : dateRange?.from
        ? format(dateRange.from, "LLL dd, y")
        : placeholder;

  const handleApply = () => {
    setDateRange(tempRange);
    setOpen(false);
  };

  const handleCancel = () => {
    setTempRange(dateRange);
    setOpen(false);
  };

  const handleClear = () => {
    setTempRange(undefined);
    setDateRange(undefined);
  };

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {label && <label className="text-sm font-medium">{label}</label>}

      <div className="relative">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal",
                allowClear && "pr-10",
                sizeClasses[size]
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4 opacity-50" />
              <span
                className={cn(
                  !dateRange?.from && "text-muted-foreground text-sm"
                )}
              >
                {formattedRange}
              </span>
            </Button>
          </PopoverTrigger>

          <PopoverContent
            className="w-auto p-0"
            align="start"
            onInteractOutside={(e) => e.preventDefault()}
          >
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={tempRange?.from}
              selected={tempRange}
              onSelect={setTempRange}
              numberOfMonths={2}
              disabled={(date) => {
                if (
                  disablePastDates &&
                  isBefore(startOfDay(date), startOfDay(new Date()))
                )
                  return true;
                if (
                  disableFutureDates &&
                  isAfter(startOfDay(date), startOfDay(new Date()))
                )
                  return true;
                return false;
              }}
            />

            {/* Footer Buttons */}
            <div className="flex justify-end gap-2 p-3 border-t bg-white">
              <Button variant="ghost" size="sm" onClick={handleCancel}>
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleApply}
                disabled={!tempRange?.from}
              >
                Apply
              </Button>
            </div>
          </PopoverContent>
        </Popover>

        {allowClear && (dateRange?.from || dateRange?.to) && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-auto mr-1 rounded-full p-0.5 hover:bg-muted"
            title="Clear date range"
          >
            <XIcon className="size-4 text-muted-foreground" />
          </button>
        )}
      </div>
    </div>
  );
};
