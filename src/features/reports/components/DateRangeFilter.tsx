import React from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, XIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { DateRange } from "react-day-picker";
import { cn } from "@/lib/utils";

interface DateRangeFilterProps {
  label?: string;
  dateRange: DateRange | undefined;
  setDateRange: (range: DateRange | undefined) => void;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export const DateRangeFilter: React.FC<DateRangeFilterProps> = ({
  label,
  dateRange,
  setDateRange,
  className,
  size = "md",
}) => {
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
        : "Pick a date range";

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {label && <label className="text-sm font-medium">{label}</label>}

      <div className="relative">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal pr-10",
                sizeClasses[size]
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4 opacity-50" />
              <span className={cn(!dateRange?.from && "text-muted-foreground")}>
                {formattedRange}
              </span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={dateRange?.from}
              selected={dateRange}
              onSelect={setDateRange}
              numberOfMonths={2}
            />
          </PopoverContent>
        </Popover>

        {dateRange?.from || dateRange?.to ? (
          <button
            type="button"
            onClick={() => setDateRange(undefined)}
            className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-auto mr-1 rounded-full p-0.5 hover:bg-muted"
            title="Clear date range"
          >
            <XIcon className="size-4 text-muted-foreground" />
          </button>
        ) : null}
      </div>
    </div>
  );
};
